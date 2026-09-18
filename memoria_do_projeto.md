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

## Ações Realizadas em 18/09/2026

**1. Domínio e SSL Ativos**
- Finalizamos o apontamento do DNS do domínio oficial `drmariowarde.com` para a Vercel. O site institucional subiu com certificado de segurança (HTTPS) ativo.

**2. Correções de Sistema (Next.js Suspense)**
- Resolvemos um erro interno da Vercel que quebrava a renderização (`useSearchParams` fora do `Suspense`) na Landing Page da primeira consulta, permitindo que a Vercel voltasse a compilar normalmente.

**3. Menu Mobile Adicionado**
- Inserido um ícone de Hambúrguer e menu responsivo no Header do site Institucional, permitindo navegação pelo celular.

**4. O "Filtro" da Landing Page (Formulário CRM)**
- Substituímos o link direto de WhatsApp da LP `/primeira-consulta` por um Componente customizado de Formulário (Apple-style UX).
- **Objetivo:** Adicionar fricção intencional. O usuário agora responde às 3 perguntas base da clínica ("O que te incomoda", "Qual o seu e-mail" e "Qual melhor período") antes de ver o WhatsApp.

**5. Back-end Blindado e Banco de Dados (Neon + Vercel)**
- Abandonamos soluções complexas e optamos por usar a integração nativa da **Vercel com a Neon (Serverless Postgres)**.
- Rota API (`/api/leads`) desenvolvida em Node.js recebendo os leads de forma passiva, higienizando os telefones e salvando no Banco de Dados.
- **Criptografia (LGPD + Meta CAPI):** A API já criptografa os dados sensíveis (e-mail, cidade, telefone, nome) em formato **SHA-256**, preparando o terreno perfeito para enviar Conversões Offline à Meta via API de Conversões no futuro sem violar as políticas.

**6. Painel Administrativo de CRM (Admin UI)**
- Criada a rota fechada `drmariowarde.com/admin?pass=warde2026`.
- Apenas acessível por essa URL secreta (para a secretária e clínica).
- Mostra uma tabela em tempo real listando todos os pacientes que preencheram o formulário da Landing Page.
- Captura automaticamente as UTMs de origem (ex: campanha X do Instagram) e possui um botão verde dinâmico de WhatsApp para contato instantâneo (abre a janela do paciente pronto para enviar mensagem).

**7. Solução do "Bloqueio" da Vercel (Autoria Git)**
- Tivemos um erro `404` por causa do bloqueio de Colaboradores Externos do plano gratuito da Vercel.
- **Solução:** Mudamos o crachá (`git config`) para que os códigos empurrados pelo meu terminal saiam assinados digitalmente com a identidade do Dr. Mário (`wardedrmario@gmail.com`). 
- Tudo funcionando sem necessidade de Upgrade para planos pagos (Pro).

## 🚧 Pendências Imediatas (Próxima Sessão)
1. **Redesign da Landing Page:** Repensar a LP atual de Primeira Consulta. Ela foi considerada muito escura/abstrata. Traremos algo claro, premium, idealmente com fotos reais da cirurgia/consultório.
2. **Detox da Conta BM:** Acessar o Meta Business Manager, limpar pixels inativos, verificar domínio e tirar lixos da agência antiga.
3. **Upload da Planilha VIP:** Injetar os clientes de alto LTV (Conversão Offline) para ensinar a IA do Meta o DNA dos pacientes premium.
