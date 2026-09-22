# Plano de Implementação: Dark Mode Inteligente (System Preference)

## 1. Desafio do Design Premium
O nosso site atualmente alterna entre seções claras (como o Sobre e os Procedimentos) e seções intencionalmente escuras (como o Blog e o fechamento da página). 
Para implementar o "Dark Mode" sem quebrar a estética de grife, não podemos apenas inverter tudo. Precisamos de um **Dark Mode Semântico**.

## 2. A Solução
1. **Mapeamento de Cores Dinâmicas:** 
   Vou criar variáveis CSS inteligentes no nosso `globals.css` que "escutam" o sistema do usuário (`@media prefers-color-scheme: dark`).
   - `Fundo Principal:` Vai do Gelo (`#fbfbfd`) para um Chumbo super profundo (`#121212`).
   - `Textos Principais:` Vão do Chumbo (`#1d1d1f`) para o Gelo (`#fbfbfd`).
   - `Cards (Caixas brancas):` Vão do Branco para um Cinza Noturno (`#1d1d1f`).

2. **Seções "Hardcoded" (Fixas):**
   Seções que *já nasceram* escuras (como a sessão do Blog em Vinho escuro `#310f0e`) permanecerão escuras independentemente do sistema, garantindo que o contraste planejado não se perca.

3. **Substituição Cirúrgica:**
   Vou varrer o `page.tsx`, `Header.tsx` e `Footer.tsx` e trocar as cores fixas que eu havia digitado (ex: `bg-[#fbfbfd]`) pelas novas cores dinâmicas (ex: `bg-bg-primary`).

## 3. Próximos Passos
Se estiver de acordo com essa abordagem (que protege a elegância enquanto obedece o modo noturno do celular/computador do paciente), eu inicio a substituição imediata dessas classes.
