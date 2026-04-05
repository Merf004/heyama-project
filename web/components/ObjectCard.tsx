import Image from 'next/image';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

interface ObjectCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  onDelete: (id: string) => void;
}

export default function ObjectCard({
  id,
  title,
  description,
  imageUrl,
  createdAt,
  onDelete,
}: ObjectCardProps) {
  return (
    <div className="bg-[#12121a] border border-[#1e1e2e] rounded-xl overflow-hidden hover:border-violet-500 transition-all duration-300 group">
      <Link href={`/objects/${id}`}>
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] to-transparent opacity-60" />
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/objects/${id}`}>
            <h2 className="text-white font-semibold text-lg hover:text-violet-400 transition-colors line-clamp-1">
              {title}
            </h2>
          </Link>
          <button
            onClick={() => onDelete(id)}
            className="text-[#94a3b8] hover:text-red-400 transition-colors shrink-0 mt-1"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <p className="text-[#94a3b8] text-sm line-clamp-2">{description}</p>

        <p className="text-xs text-[#4a5568] mt-1">
          {new Date(createdAt).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
}