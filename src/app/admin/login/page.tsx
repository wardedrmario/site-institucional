'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { login } from '@/app/actions/auth';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('password', password);

    const result = await login(formData);

    if (result.success) {
      router.push('/admin');
    } else {
      setError(result.error as string);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#ccb9b6] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-8 shadow-xl">
        <div className="flex justify-center mb-8">
          <Image 
            src="/brand/logo-horizontal-wine.svg" 
            alt="Dr. Mário Warde" 
            width={200} 
            height={40} 
            className="h-10 w-auto"
          />
        </div>

        <h1 className="text-xl font-bold text-center text-[#1d1d1f] mb-2">Acesso ao CRM</h1>
        <p className="text-center text-sm text-[#1d1d1f]/60 mb-8">Digite a senha de acesso para continuar.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <input 
              type="password" 
              placeholder="Sua senha" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/80 focus:bg-white focus:ring-2 focus:ring-[#310f0e]/20 focus:border-[#310f0e]/40 outline-none transition-all placeholder:text-black/40 text-[#1d1d1f]"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium text-center">{error}</p>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#310f0e] text-white font-medium py-3 rounded-xl hover:bg-[#310f0e]/90 transition-colors disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
