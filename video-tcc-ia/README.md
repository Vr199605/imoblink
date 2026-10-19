# TCC sem Pânico — IA como Sua Assistente Acadêmica

Vídeo animado (Remotion + React + TypeScript) sobre o uso ético e prático de Inteligência Artificial em monografias universitárias.

- **Saída:** `out/video_ia_monografia.mp4` — 1920×1080, 30 fps, H.264, 75 s
- **Animações:** todo movimento usa `spring()` com `damping: 12`, `stiffness: 100` (`src/anim.ts`)
- **Tipografia:** Poppins (títulos) e Inter (texto), empacotadas localmente via `@fontsource`
- **Ícones:** `lucide-react` (vetoriais)

## Estrutura

```
src/
├── index.ts / Root.tsx      # registro da composição "MainComposition"
├── Video.tsx                # monta as 5 <Sequence> + fundo + HUD
├── theme.ts                 # paleta, fontes e linha do tempo das cenas
├── anim.ts                  # helpers de mola (springAt, springWindow)
├── captions.ts              # legendas sincronizadas por frame
├── fonts.ts                 # carrega as fontes antes do primeiro frame
├── components/              # Background, Hud (legendas + progresso), Reveal, SceneShell, SceneHeader
└── scenes/
    ├── IntroScene.tsx              # 0–12 s   O desafio universitário
    ├── UseCasesScene.tsx           # 12–35 s  Casos práticos (3 cards)
    ├── EthicalGuardrailsScene.tsx  # 35–50 s  Linha vermelha & alucinações
    ├── WorkflowScene.tsx           # 50–65 s  Fluxo ideal de trabalho
    └── OutroScene.tsx              # 65–75 s  Encerramento
```

## Comandos

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run studio      # pré-visualização interativa
npm run render      # gera out/video_ia_monografia.mp4
```

Se a máquina não puder baixar o Chrome Headless Shell do Remotion, aponte para um Chromium local:

```bash
REMOTION_BROWSER=/caminho/para/chrome npm run render
```
