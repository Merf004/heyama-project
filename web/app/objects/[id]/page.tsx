'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

interface ObjectItem {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
}

export default function ObjectDetailPage() {
  const { id } = useParams();
  const [object, setObject] = useState<ObjectItem | null>(null);

  useEffect(() => {
    const fetchObject = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/objects/${id}`);
      const data = await res.json();
      setObject(data);
    };
    fetchObject();
  }, [id]);

  if (!object) {
    return (
      <main className="max-w-xl mx-auto px-6 py-10">
        <div className="flex items-center justify-center mt-32">
          <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-2xl mx-auto px-6 py-10">
      <a
        href="/"
        className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors mb-8 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </a>

      <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden">
        <div className="relative w-full h-155">
          <Image
            src={object.imageUrl}
            alt={object.title}
            fill
            className="object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] to-transparent" />
        </div>

        <div className="p-6 flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-white">{object.title}</h1>
          <p className="text-[#94a3b8] leading-relaxed">{object.description}</p>
          <p className="text-xs text-[#4a5568]">
            Créé le{' '}
            {new Date(object.createdAt).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </main>
  );
}