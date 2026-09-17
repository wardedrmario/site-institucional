'use client';

import { useState } from 'react';

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

export function ArticleComments() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      author: 'Ana Paula',
      text: 'Doutor, excelente texto! Sempre tive dúvidas sobre o taping e como ele ajudava no pós-operatório. Muito esclarecedor.',
      date: 'Há 2 dias'
    },
    {
      id: '2',
      author: 'Camila S.',
      text: 'Concordo plenamente sobre a importância de operar em hospitais. Segurança sempre em primeiro lugar. Parabéns pelo conteúdo!',
      date: 'Há 5 dias'
    }
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !name.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: name,
      text: newComment,
      date: 'Agora mesmo'
    };

    setComments([comment, ...comments]);
    setNewComment('');
    setName('');
  };

  return (
    <div className="mt-16 pt-16 border-t border-black/10">
      <h3 className="text-2xl font-bold text-chumbo mb-8 tracking-tight">Comentários ({comments.length})</h3>
      
      {/* Formulário de Comentário */}
      <form onSubmit={handleSubmit} className="mb-12 bg-white p-6 rounded-2xl border border-black/[0.04] shadow-sm">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-[#fbfbfd] border border-black/5 text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 transition-all text-chumbo placeholder:text-chumbo-light/50"
            required
          />
        </div>
        <div className="mb-4">
          <textarea
            placeholder="Adicione um comentário ou deixe sua dúvida..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-[#fbfbfd] border border-black/5 text-sm focus:outline-none focus:ring-2 focus:ring-wine/20 transition-all text-chumbo placeholder:text-chumbo-light/50 resize-none"
            required
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!newComment.trim() || !name.trim()}
            className="bg-[#310f0e] text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-wine transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Publicar comentário
          </button>
        </div>
      </form>

      {/* Lista de Comentários */}
      <div className="space-y-8">
        {comments.map(comment => (
          <div key={comment.id} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-wine/10 flex items-center justify-center flex-shrink-0 text-wine font-bold text-sm">
              {comment.author.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-chumbo text-sm">{comment.author}</span>
                <span className="text-xs text-chumbo-light/60">{comment.date}</span>
              </div>
              <p className="text-sm text-chumbo-light leading-relaxed">
                {comment.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
