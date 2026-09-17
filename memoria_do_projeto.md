# Memória do Projeto: Site Dr. Mário Warde

## Ações Realizadas em 17/09/2026

**1. Verificação e Organização do Repositório GitHub**
- O projeto Next.js existente na pasta `frontend` foi validado.
- Inicialmente, o código foi enviado para o repositório pessoal (`msgomesme/Dr.-M-rio-Warde---site`), resolvendo conflitos no `README.md`.
- Para manter tudo centralizado e profissional, decidimos migrar para o GitHub criado especificamente para o Dr. Mário.
- Alteramos o apontamento (`remote origin`) e enviamos todo o código para o novo repositório oficial: `https://github.com/wardedrmario/site-institucional.git`.
- *Nota:* O usuário `msgomesme` foi adicionado como colaborador no GitHub do Dr. para permitir o envio do código.

**2. Traqueamento (Meta Pixel)**
- Inserimos o código do **Meta Pixel (Facebook/Instagram)** no arquivo principal do site (`src/app/layout.tsx`).
- O **ID do Pixel utilizado foi:** `4376073622648258`.
- O Pixel já está configurado e disparando automaticamente o evento padrão `PageView` em todas as páginas, essencial para campanhas na Meta.

**3. Deploy na Vercel (Instruções)**
- Deixamos documentado o passo a passo para a publicação:
  - Fazer login na conta da Vercel do Dr. Mário.
  - Importar o projeto recém-atualizado do GitHub (`wardedrmario/site-institucional`).
  - Clicar em Deploy sem alterar configurações adicionais.

**4. Configuração de Domínio Personalizado**
- O domínio oficial do site será: `drmariowarde.com`.
- Instruções fornecidas para finalizar o setup:
  - Adicionar o domínio na aba *Domains* nas configurações do projeto na Vercel.
  - No provedor onde o domínio foi comprado, alterar a Zona DNS adicionando:
    - Um registro tipo **A** com o valor `76.76.21.21` (para o domínio raiz).
    - Um registro tipo **CNAME** com o nome `www` apontando para `cname.vercel-dns.com`.

**5. Confirmação do Deploy e Próximos Passos**
- O deploy inicial na Vercel foi concluído com sucesso. O site já está acessível e funcional no link gerado: `https://site-7ny4.vercel.app/`.
- Verificamos que o projeto está online com o Meta Pixel injetado corretamente.
- Próximos passos planejados: Pequenos ajustes de textos que serão solicitados futuramente. Graças à integração CI/CD (GitHub ⇄ Vercel), qualquer alteração aprovada subirá automaticamente para o ar.
