import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Heyama Objects',
  description: "Gérez votre collection d'objets",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={geist.className}>
        <nav className="border-b border-[#1e1e2e] bg-[#12121a] sticky top-0 z-50 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <a href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-600 bg-clip-text text-transparent">
              Heyama Objects
            </a>
            <a href="/create" className="bg-violet-600 hover:bg-violet-700 transition-colors text-white text-sm font-medium px-4 py-2 rounded-lg">
              + Nouvel objet
            </a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}