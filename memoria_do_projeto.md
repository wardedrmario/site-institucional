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

**6. Implementação de Tracking Avançado (GTM & GA4)**
- **Google Tag Manager (GTM):** Criamos a conta e o contêiner web (`GTM-5T7DBGTG`). Injetamos o GTM nativamente no Next.js usando o pacote oficial `@next/third-parties` no arquivo `layout.tsx`, preservando a alta performance do site.
- **Google Analytics 4 (GA4):** Criamos a propriedade (`G-GB9N9TCV10`) e a conectamos dentro do GTM através da tag `GA4 - Base` (acionador All Pages).
- **Governança de Dados:** Para manter a velocidade do projeto, as contas do Google foram criadas no novo e-mail da equipe técnica (garantindo autonomia imediata). O passo seguinte acordado é adicionar o e-mail oficial da clínica (dono do perfil do Google Meu Negócio) como Administrador no GTM e GA4, garantindo que o Dr. Mário mantenha a propriedade vitalícia dos seus dados.
- Todo o código foi "commitado" e subiu automaticamente via CI/CD para a Vercel.

**7. O "Detox" da Conta e a Planilha VIP (Próximo Passo Estratégico)**
- **Detox do Gerenciador:** Antes de iniciar as campanhas novas, ficou mapeada a necessidade de expurgar o erro de "Políticas de Saúde" gerado pelo plugin antigo (`Click to Chat by HoliThemes`) usado pela agência anterior, além de revogar seus acessos.
- **Injeção de Inteligência (Planilha VIP):** A clínica possui um banco de dados ultra-qualificado (pacientes que operaram, com e-mail, endereço/CEP e **valores pagos**). 
- **Ação Técnica Mapeada:** Faremos o upload criptografado (SHA-256) dessa lista no Meta Ads via *Conversões Offline* atrelando o **Valor de Compra (LTV)**. Isso servirá como a "semente inicial" para treinar a Inteligência Artificial do Meta, forçando o algoritmo a ignorar curiosos e buscar o DNA e o poder aquisitivo exato dos pacientes pagantes.
