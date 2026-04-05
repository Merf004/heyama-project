'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload } from 'lucide-react';

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!title || !description || !image) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/objects`, {
      method: 'POST',
      body: formData,
    });

    setLoading(false);
    router.push('/');
  };

  const isValid = title && description && image;

  return (
    <main className="max-w-xl mx-auto px-6 py-10">
      <a
        href="/"
        className="flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors mb-8 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </a>

      <h1 className="text-3xl font-bold text-white mb-8">Nouvel objet</h1>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#94a3b8]">Titre</label>
          <input
            type="text"
            placeholder="Titre de l'objet"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-[#12121a] border border-[#1e1e2e] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder:text-[#4a5568]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#94a3b8]">Description</label>
          <textarea
            placeholder="Description de l'objet"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="bg-[#12121a] border border-[#1e1e2e] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-violet-500 transition-colors placeholder:text-[#4a5568] resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#94a3b8]">Image</label>
          <label className="cursor-pointer">
            <div className="bg-[#12121a] border-2 border-dashed border-[#1e1e2e] hover:border-violet-500 transition-colors rounded-lg p-6 flex flex-col items-center gap-3">
              {preview ? (
                <img src={preview} alt="preview" className="w-full h-48 object-cover rounded-lg" />
              ) : (
                <>
                  <Upload className="h-8 w-8 text-[#4a5568]" />
                  <p className="text-[#4a5568] text-sm">Cliquez pour choisir une image</p>
                </>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid || loading}
          className="bg-violet-600 hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white font-medium px-6 py-3 rounded-lg"
        >
          {loading ? 'Création en cours...' : 'Créer'}
        </button>
      </div>
    </main>
  );
}