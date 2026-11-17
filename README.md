# Portfólio — Lucas Neres Pistilli

Site pessoal de desenvolvedor full-stack. HTML, CSS e JavaScript puros, sem build e sem dependências.

**No ar:** https://lucaspistilli.github.io

## Rodar localmente

Os textos são carregados de `data/*.json`, então é preciso um servidor local (abrir o arquivo direto não funciona):

```bash
npx serve .
# ou
python -m http.server 8000
```

## Estrutura

```
index.html            esqueleto das seções
css/v2.css            estilos (design system: fundo escuro, âmbar, Silkscreen / Inter / JetBrains Mono)
js/v2.js              conteúdo dinâmico e animações
data/content.json     nome, sobre, stack, contato
data/projects.json    projetos (adicionar um projeto = adicionar um item)
data/sections.json    textos das seções e links das imagens geradas
assets/hero-frames/   36 quadros do vídeo do buraco negro (desenhados em canvas)
assets/fonts/         fontes locais
assets/projects/      capas dos projetos
assets/img/           recorte do buraco negro
```

## Como funciona o buraco negro

Um canvas fixo (`#bh`) desenha os quadros do vídeo e viaja entre os elementos com `data-bh-anchor`:
hero → processo (desce, pousa no anel, gira e troca a "tela" a cada passo) → projetos (mostra a capa do projeto) → contato.

Estrutura e animações inspiradas em Sunny Money (conceito da Higgsfield). Imagens do buraco negro, dos objetos 3D e de dois capítulos geradas com IA (Higgsfield).
