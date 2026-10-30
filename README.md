# Matheus Barber Shop

Website institucional estático da Matheus Barber Shop, no Jardim Ouro Branco, em Limeira/SP.

O projeto foi construído como uma landing page de página única, com direção de arte própria, navegação por seções, galeria com lightbox, horários dinâmicos e agendamento via WhatsApp.

**URL de publicação:** https://joaovsbuarque2.github.io/MATHEUS-BARBER-SHOP/

## Stack

- HTML5, CSS3 e JavaScript modular
- Vite
- GSAP e ScrollTrigger para as animações
- Lucide para os ícones
- Fontes auto-hospedadas: Bodoni Moda e Inter
- GitHub Pages para publicação

Não há backend, banco de dados, autenticação ou painel administrativo.

## Desenvolvimento

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

O build pode exibir o aviso `./fonts/fonts.css doesn't exist at build time...`. Ele é esperado: o arquivo é servido a partir de `public/fonts/` e permanece disponível no `dist/`.

## Estrutura

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml
├── public/
│   ├── fonts/
│   ├── images/
│   ├── favicon.svg
│   ├── logo.svg
│   ├── manifest.webmanifest
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── scripts/
│   │   ├── gallery.js
│   │   ├── interactions.js
│   │   └── navigation.js
│   ├── styles/
│   │   ├── animations.css
│   │   ├── components.css
│   │   └── global.css
│   └── main.js
├── img/                  # imagens originais usadas na otimização
├── scripts/
│   └── optimize-images.js
├── index.html
├── package.json
├── package-lock.json
└── vite.config.js
```

## Conteúdo e manutenção

### Serviços e preços

Os cards de serviços em `index.html` são uma base visual inicial. Os nomes, descrições e a lista completa devem ser confirmados com o proprietário. Os valores estão intencionalmente como **“Sob consulta”**, sem preços fictícios.

Para atualizar, edite os blocos `article.service-card` na seção `#servicos`.

### Avaliações

A seção `#avaliacoes` usa avaliações reais publicadas no Google para a barbearia: nota **4,8 de 5**, com base em **8 avaliações**. Os comentários foram reproduzidos na íntegra. Os nomes públicos dos avaliadores não estavam disponíveis no momento da implementação.

O link “Ver avaliações no Google” abre a busca do estabelecimento no Google Maps. Quando novas avaliações forem adicionadas, atualize os cards manualmente e o bloco `aggregateRating` do JSON-LD no `<head>`.

### Horários

Os horários oficiais estão em `index.html` e também no JSON-LD. O JavaScript destaca o dia atual e calcula o status “Aberto agora” / “Fechado agora” usando o fuso `America/Sao_Paulo`.

Para alterar horários, atualize:

1. A lista `SCHEDULE` em `src/scripts/interactions.js`.
2. Os textos das linhas `.hours__row` em `index.html`.
3. O bloco `openingHoursSpecification` do JSON-LD.

### Imagens

As imagens otimizadas ficam em `public/images/`. As originais estão em `img/` e o script `scripts/optimize-images.js` gera as versões WebP e a imagem de compartilhamento.

Para trocar as fotos:

1. Substitua os arquivos em `img/` mantendo os mesmos nomes, ou ajuste o script.
2. Rode `npm run optimize:images`.
3. Atualize os atributos `src`, `srcset`, `sizes`, `width` e `height` em `index.html` se as proporções mudarem.

Não use fotos de terceiros como se fossem trabalhos da barbearia.

### Links, SEO e publicação

- WhatsApp: `5519983624512`, com mensagem pré-preenchida em todos os links.
- Instagram: https://www.instagram.com/matheus.barbershoopp/
- Endereço: Rua Júlio Bagnato, Jardim Ouro Branco, Limeira/SP, 13482-122.

O projeto usa `base: './'` no Vite, então os arquivos compilados funcionam em qualquer subpasta do GitHub Pages.

Para publicar:

1. Envie as alterações para a branch `main`.
2. No repositório, acesse **Settings → Pages**.
3. Em **Build and deployment**, selecione **GitHub Actions**.
4. O workflow `.github/workflows/deploy.yml` compila e publica o site automaticamente.

Se o repositório mudar de nome ou receber um domínio próprio, atualize também:

- `canonical`, `og:url`, `og:image` e `twitter:image` em `index.html`;
- `homepage` e `repository` em `package.json`;
- `public/robots.txt` e `public/sitemap.xml`;
- os links absolutos do JSON-LD.

## Acessibilidade e performance

- Estrutura semântica, link para pular conteúdo e foco visível.
- Menu mobile com `inert`, controle de foco e fechamento por `Esc`.
- Lightbox em `<dialog>` com navegação por teclado, botões e swipe.
- Imagens responsivas com `srcset`, `sizes`, `loading="lazy"` e dimensões explícitas.
- Animações desativadas para quem usa `prefers-reduced-motion`.
- CSS dividido em global, componentes e animações; JavaScript modular.
- Fontes auto-hospedadas com `font-display: swap` e preload das fontes principais.
- Metadados Open Graph, Twitter Card, favicon, manifest e JSON-LD de negócio local.

## Créditos

- Tipografia: Bodoni Moda e Inter, via Google Fonts (SIL Open Font License).
- Ícones: Lucide (ISC License).
- Animações: GSAP (licença própria para uso comercial conforme os termos da GreenSock).
