# Portfólio — Lucas Neres Pistilli (notas para o Claude Code)

Site estático publicado no GitHub Pages: https://lucaspistilli.github.io (repositório `LucasPistilli/LucasPistilli.github.io`, branch `main`, raiz). Todo push na `main` publica.

## Regras
- HTML + CSS + JS puros, sem frameworks, sem build, sem CDN de bibliotecas.
- Nunca deixar texto fixo no HTML/JS: tudo vem de `data/content.json`, `data/projects.json` e `data/sections.json`.
- Design system: fundo `#030304` e tons escuros, âmbar `#ff7a1a`, ouro `#ffb347`, creme `#ffe1b0`; títulos em Silkscreen, texto em Inter, código em JetBrains Mono (fontes locais em `assets/fonts`).
- Testar desktop (1440×900) e celular (390×844) antes de publicar; respeitar `prefers-reduced-motion`.

## Arquivos
- `index.html` — esqueleto das 10 seções + rodapé.
- `css/v2.css` — estilos; bloco `@media (max-width:820px)` concentra o mobile.
- `js/v2.js` — preenchimento a partir dos JSON e todas as animações.
- `assets/hero-frames/f001–f036.webp` — quadros do vídeo do buraco negro.

## Seções (ordem)
Hero → Como eu trabalho (fixo, 4 passos) → Stack (bento) → Sobre (4 capítulos) → Pergunte ao Lucas (chat) → Projetos → Siga a requisição (partículas) → Cemitério de bugs → Tecnologias em órbita → Contato → Rodapé.

## Buraco negro viajante
Canvas fixo `#bh` + overlay `#bh-screen`. Âncoras `[data-bh-anchor]`: `hero`, `how`, `projects`, `cta` (config em `CFG` no `js/v2.js`). Entre hero e processo ele voa; nas outras âncoras fica preso à seção. No processo gira e troca a "tela" a cada passo; em projetos mostra a capa selecionada.

## Imagens geradas (Higgsfield)
Hospedadas no CDN do Higgsfield; links em `data/sections.json` → `assets` (sprite de 6 objetos 3D e capítulos 1 e 4). Para usar cópias locais, salvar em `assets/gen/` e trocar os caminhos.
