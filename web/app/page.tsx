'use client';

import { useEffect, useState } from 'react';
import ObjectCard from '@/components/ObjectCard';
import socket from '@/lib/socket';
import { Package } from 'lucide-react';

interface ObjectItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export default function Home() {
  const [objects, setObjects] = useState<ObjectItem[]>([]);

  const fetchObjects = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/objects`);
    const data = await res.json();
    setObjects(data);
  };

  const handleDelete = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/objects/${id}`, {
      method: 'DELETE',
    });
    setObjects((prev) => prev.filter((obj) => obj._id !== id));
  };

  useEffect(() => {
    fetchObjects();

    socket.on('new-object', (newObject: ObjectItem) => {
      setObjects((prev) => [newObject, ...prev]);
    });

    socket.on('deleted-object', (id: string) => {
      setObjects((prev) => prev.filter((obj) => obj._id !== id));
    });

    return () => {
      socket.off('new-object');
      socket.off('deleted-object');
    };
  }, []);

  const count = objects.length;
  const subtitle = count === 0 ? 'Aucun objet' : `${count} objet${count > 1 ? 's' : ''} dans votre collection`;

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white mb-2">Collection</h1>
        <p className="text-[#94a3b8]">{subtitle}</p>
      </div>

      {count === 0 ? (
        <div className="flex flex-col items-center justify-center mt-32 gap-4">
          <Package className="text-6xl" />
          <p className="text-[#94a3b8] text-lg">Aucun objet pour le moment</p>
          <a
            href="/create"
            className="bg-violet-600 hover:bg-violet-700 transition-colors text-white text-sm font-medium px-6 py-3 rounded-lg"
          >
            Créer votre premier objet
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {objects.map((obj) => (
            <ObjectCard
              key={obj._id}
              id={obj._id}
              title={obj.title}
              description={obj.description}
              imageUrl={obj.imageUrl}
              createdAt={obj.createdAt}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </main>
  );
}