/*
  ================================================
  PORTFÓLIO — MATHEUS JALLES
  Arquivo: script.js
  ================================================
  ÍNDICE:
    1. Canvas de fundo (partículas animadas)
    2. Scroll Reveal (animação de entrada das seções)
    3. Galeria de imagens (projeto condomínio)
    4. Play / Pause dos vídeos
    5. Sombra do header ao rolar
    6. Destaque do link ativo na navegação
  ================================================
*/


/* ================================================
   1. CANVAS DE FUNDO — PARTÍCULAS ANIMADAS
   Desenha pontos conectados por linhas no fundo
   Cor: amarelo-limão (--accent do CSS)
================================================ */

// Pega o elemento canvas e seu contexto 2D para desenhar
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

/**
 * ajustaCanvas — redimensiona o canvas para cobrir toda a tela
 * Chamada no carregamento e sempre que a janela é redimensionada
 */
function ajustaCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

// Ajusta no carregamento
ajustaCanvas();

// Reajusta sempre que o usuário redimensiona a janela
window.addEventListener('resize', ajustaCanvas);

// Array que vai guardar todos os pontos (nós)
const nos = [];

// Quantidade de pontos na tela
const QUANTIDADE_NOS = 55;

/**
 * criaNo — cria um ponto com posição, velocidade e tamanho aleatórios
 * @returns {Object} objeto com propriedades do nó
 */
function criaNo() {
  return {
    x:  Math.random() * canvas.width,   // posição horizontal aleatória
    y:  Math.random() * canvas.height,  // posição vertical aleatória
    vx: (Math.random() - 0.5) * 0.3,   // velocidade horizontal (-0.15 a +0.15)
    vy: (Math.random() - 0.5) * 0.3,   // velocidade vertical
    r:  Math.random() * 1.2 + 0.3      // raio entre 0.3 e 1.5 px
  };
}

// Popula o array com os nós iniciais
for (let i = 0; i < QUANTIDADE_NOS; i++) {
  nos.push(criaNo());
}

/**
 * desenhaCanvas — loop principal de animação
 * Limpa o canvas, desenha pontos e linhas entre os próximos
 */
function desenhaCanvas() {

  // Limpa o frame anterior
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Percorre cada nó
  nos.forEach(function(no, indice) {

    // Desenha o ponto
    ctx.beginPath();
    ctx.arc(no.x, no.y, no.r, 0, Math.PI * 2);
    ctx.fillStyle = '#d4f84a'; // cor amarelo-limão
    ctx.fill();

    // Conecta com os outros nós próximos
    for (let j = indice + 1; j < nos.length; j++) {
      const outro     = nos[j];
      const distancia = Math.hypot(no.x - outro.x, no.y - outro.y);

      // Só conecta se a distância for menor que 140px
      if (distancia < 140) {

        // Opacidade da linha diminui conforme a distância aumenta
        const opacidade = (1 - distancia / 140) * 0.35;

        ctx.beginPath();
        ctx.moveTo(no.x, no.y);
        ctx.lineTo(outro.x, outro.y);
        ctx.strokeStyle = `rgba(212, 248, 74, ${opacidade})`;
        ctx.lineWidth   = 0.3;
        ctx.stroke();
      }
    }

    // Move o nó pela velocidade
    no.x += no.vx;
    no.y += no.vy;

    // Inverte a direção ao bater nas bordas
    if (no.x < 0 || no.x > canvas.width)  no.vx *= -1;
    if (no.y < 0 || no.y > canvas.height) no.vy *= -1;

  });

  // Solicita o próximo frame (loop infinito suave)
  requestAnimationFrame(desenhaCanvas);
}

// Inicia o loop de animação
desenhaCanvas();


/* ================================================
   CORREÇÃO DE FALLBACK DE IMAGENS
   Verifica se as imagens carregaram ao abrir a página.
   Se não carregaram (arquivo ausente), adiciona a classe
   img-fallback para exibir a mensagem de orientação no lugar.
   naturalWidth === 0 significa que a imagem não foi encontrada.
================================================ */
window.addEventListener('load', function() {

  // Verifica a imagem principal da galeria (Sistema de entregas/Login.jpeg)
  const imgGaleria = document.querySelector('#gallery-cond .gallery-main img');
  if (imgGaleria && (!imgGaleria.complete || imgGaleria.naturalWidth === 0)) {
    imgGaleria.closest('.gallery-main').classList.add('img-fallback');
  }

  // Verifica todas as imagens dos cards de projeto:
  //   - Fotos/Movimenta/User Flow.png
  //   - Fotos/ControleMEI/dashboard.jpeg
  //   - Fotos/EcoConnect/ecoconnectlogo.png
  document.querySelectorAll('.proj-img-wrap img').forEach(function(img) {
    if (!img.complete || img.naturalWidth === 0) {
      img.closest('.proj-img-wrap').classList.add('img-fallback');
    }
  });

  // Verifica os thumbnails da galeria do sistema de condomínios
  //   - Fotos/Sistema de entregas/Login.jpeg
  //   - Fotos/Sistema de entregas/Entregas.jpeg
  document.querySelectorAll('.gallery-thumbs .thumb img').forEach(function(img) {
    if (!img.complete || img.naturalWidth === 0) {
      img.closest('.thumb').classList.add('thumb-error');
    }
  });

});


/* ================================================
   2. SCROLL REVEAL — ANIMAÇÃO DE ENTRADA
   Usa IntersectionObserver para detectar quando
   um elemento entra na área visível da tela
   e adiciona a classe .visible (definida no CSS)
================================================ */

// Seleciona todos os elementos que devem aparecer com animação
const elementosReveal = document.querySelectorAll('.reveal, .reveal-right');

/**
 * observadorReveal — observa cada elemento e
 * adiciona .visible quando ele aparece na tela
 */
const observadorReveal = new IntersectionObserver(function(entradas) {
  entradas.forEach(function(entrada) {
    if (entrada.isIntersecting) {
      // Elemento entrou na tela: torna visível
      entrada.target.classList.add('visible');

      // Para de observar (a animação só acontece uma vez)
      observadorReveal.unobserve(entrada.target);
    }
  });
}, {
  threshold: 0.08 // ativa quando 8% do elemento está visível
});

// Registra cada elemento para ser observado
elementosReveal.forEach(function(el) {
  observadorReveal.observe(el);
});

// Garante que elementos já visíveis ao carregar a página apareçam
window.addEventListener('load', function() {
  elementosReveal.forEach(function(el) {
    const posicao = el.getBoundingClientRect();
    if (posicao.top < window.innerHeight) {
      el.classList.add('visible');
    }
  });
});


/* ================================================
   3. GALERIA DE IMAGENS — PROJETO CONDOMÍNIO
   Ao clicar em um thumbnail, troca a imagem principal
================================================ */

// Seleciona todos os thumbnails dentro da galeria do condomínio
const thumbnails  = document.querySelectorAll('#gallery-cond .thumb');
const galeriaMain = document.querySelector('#gallery-cond .gallery-main');
const imgPrincipal = galeriaMain ? galeriaMain.querySelector('img') : null;

thumbnails.forEach(function(thumb) {
  thumb.addEventListener('click', function() {

    // Pega o caminho da imagem no atributo data-src do thumbnail
    const novaSrc = thumb.dataset.src;

    // Troca a imagem principal se existir e tiver src
    if (imgPrincipal && novaSrc) {
      imgPrincipal.src = novaSrc;

      // Remove o estado de fallback (caso estivesse ativo)
      galeriaMain.classList.remove('img-fallback');
    }

    // Remove .active de todos os thumbnails
    thumbnails.forEach(function(t) { t.classList.remove('active'); });

    // Adiciona .active apenas no clicado
    thumb.classList.add('active');
  });
});


/* ================================================
   4. PLAY / PAUSE DOS VÍDEOS
   Controla o botão ▶/⏸ sobre cada vídeo
================================================ */

// Seleciona todos os containers de imagem/vídeo
document.querySelectorAll('.proj-img-wrap').forEach(function(container) {

  const video = container.querySelector('video');
  const botao = container.querySelector('.play-btn');

  // Só executa se tiver vídeo e botão
  if (!video || !botao) return;

  /**
   * aoClicarPlay — alterna entre play e pause
   */
  botao.addEventListener('click', function() {
    if (video.paused) {
      video.play();
      botao.textContent = '⏸'; // muda ícone para pausar
    } else {
      video.pause();
      botao.textContent = '▶'; // volta ícone de play
    }
  });

  // Quando o vídeo termina, volta o ícone para play
  video.addEventListener('ended', function() {
    botao.textContent = '▶';
  });
});


/* ================================================
   5. SOMBRA NO HEADER AO ROLAR
   Adiciona sombra/borda mais visível quando
   o usuário começa a rolar a página
================================================ */

const cabecalho = document.querySelector('header');

window.addEventListener('scroll', function() {

  if (window.scrollY > 10) {
    // Usuário rolou: borda mais visível
    cabecalho.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
  } else {
    // No topo: borda sutil
    cabecalho.style.borderBottomColor = 'rgba(255, 255, 255, 0.07)';
  }
});


/* ================================================
   6. DESTAQUE DO LINK ATIVO NA NAVEGAÇÃO
   O link da seção atual na tela fica mais claro
   Usa IntersectionObserver nas seções com ID
================================================ */

// Pega todas as seções que têm ID (as que o nav referencia)
const secoes   = document.querySelectorAll('section[id]');
const linksNav = document.querySelectorAll('nav a');

/**
 * observadorNav — quando uma seção entra na tela,
 * o link correspondente na nav fica destacado
 */
const observadorNav = new IntersectionObserver(function(entradas) {
  entradas.forEach(function(entrada) {

    if (entrada.isIntersecting) {
      const idAtual = entrada.target.id;

      linksNav.forEach(function(link) {
        // Compara o href do link com o ID da seção visível
        if (link.getAttribute('href') === `#${idAtual}`) {
          link.style.color = '#e8e8e8'; // destaca o link ativo
        } else {
          link.style.color = '';        // remove destaque dos outros
        }
      });
    }
  });
}, {
  threshold: 0.4 // ativa quando 40% da seção está visível
});

// Registra cada seção para ser observada
secoes.forEach(function(secao) {
  observadorNav.observe(secao);
});


/* ================================================
   LIGHTBOX — Visualizador de imagem em tela cheia
   
   Como funciona:
   - Cada imagem com classe .expandivel tem data-galeria e data-index
   - data-galeria agrupa imagens do mesmo projeto
   - data-index é a posição na galeria
   - Ao clicar, abre o lightbox com a imagem correspondente
   - Setas ‹ › navegam. ESC fecha. Clique fora fecha.
================================================ */

// Monta um mapa de galerias: { "cond": [src1, src2], "mei": [...] }
// Varre todas as imagens expandíveis e agrupa por data-galeria
var galerias = {};

document.querySelectorAll('.expandivel').forEach(function(img) {
  var nomeGaleria = img.dataset.galeria;
  var indice      = parseInt(img.dataset.index);
  var src         = img.src;

  if (!galerias[nomeGaleria]) {
    galerias[nomeGaleria] = [];
  }

  // Guarda o src na posição correta (evita duplicatas por index)
  galerias[nomeGaleria][indice] = src;
});

// Remove buracos nos arrays (caso algum index não exista)
Object.keys(galerias).forEach(function(nome) {
  galerias[nome] = galerias[nome].filter(Boolean);
});

// Referências dos elementos do lightbox
var lightbox         = document.getElementById('lightbox');
var lightboxImg      = document.getElementById('lightbox-img');
var lightboxFechar   = document.getElementById('lightbox-fechar');
var lightboxPrev     = document.getElementById('lightbox-prev');
var lightboxNext     = document.getElementById('lightbox-next');
var lightboxContador = document.getElementById('lightbox-contador');

// Estado atual do lightbox
var galeriaAtual = '';
var indiceAtual  = 0;

/**
 * abreLightbox — abre o lightbox na imagem clicada
 * @param {string} galeria - nome da galeria (data-galeria)
 * @param {number} indice  - posição da imagem (data-index)
 */
function abreLightbox(galeria, indice) {
  galeriaAtual = galeria;
  indiceAtual  = indice;

  var imagens = galerias[galeria];

  if (!imagens || imagens.length === 0) return;

  // Define a imagem e abre
  lightboxImg.src = imagens[indice];
  lightboxImg.alt = 'Imagem ' + (indice + 1) + ' de ' + galeria;
  lightbox.classList.add('lightbox-ativo');

  // Atualiza o contador
  atualizaContador(indice, imagens.length);

  // Mostra/esconde setas conforme a quantidade de imagens
  var temNavegacao = imagens.length > 1;
  lightboxPrev.classList.toggle('oculto', !temNavegacao);
  lightboxNext.classList.toggle('oculto', !temNavegacao);

  // Impede scroll do body enquanto lightbox está aberto
  document.body.style.overflow = 'hidden';
}

/**
 * fechaLightbox — fecha o lightbox e limpa o estado
 */
function fechaLightbox() {
  lightbox.classList.remove('lightbox-ativo');
  lightboxImg.src = '';
  document.body.style.overflow = '';
}

/**
 * navegaLightbox — vai para a imagem anterior ou próxima
 * @param {number} direcao - (-1) anterior | (+1) próxima
 */
function navegaLightbox(direcao) {
  var imagens = galerias[galeriaAtual];
  if (!imagens) return;

  // Calcula o novo índice com loop circular
  indiceAtual = (indiceAtual + direcao + imagens.length) % imagens.length;

  // Animação rápida de troca
  lightboxImg.style.opacity = '0';
  setTimeout(function() {
    lightboxImg.src     = imagens[indiceAtual];
    lightboxImg.style.opacity = '1';
    atualizaContador(indiceAtual, imagens.length);
  }, 120);
}

/**
 * atualizaContador — exibe "2 / 3" no rodapé do lightbox
 */
function atualizaContador(indice, total) {
  if (total <= 1) {
    lightboxContador.textContent = '';
  } else {
    lightboxContador.textContent = (indice + 1) + ' / ' + total;
  }
}

// Transição suave ao trocar imagem
lightboxImg.style.transition = 'opacity 0.12s ease';

// Clique em imagem expandível: abre lightbox
document.querySelectorAll('.expandivel').forEach(function(img) {
  img.addEventListener('click', function() {
    abreLightbox(img.dataset.galeria, parseInt(img.dataset.index));
  });
});

// Botão fechar
lightboxFechar.addEventListener('click', fechaLightbox);

// Clique no fundo escuro (fora da imagem) fecha
lightbox.addEventListener('click', function(e) {
  if (e.target === lightbox) fechaLightbox();
});

// Botões de navegação
lightboxPrev.addEventListener('click', function() { navegaLightbox(-1); });
lightboxNext.addEventListener('click', function() { navegaLightbox(+1); });

// Teclado: ESC fecha, setas navegam
document.addEventListener('keydown', function(e) {
  if (!lightbox.classList.contains('lightbox-ativo')) return;

  if (e.key === 'Escape')     fechaLightbox();
  if (e.key === 'ArrowLeft')  navegaLightbox(-1);
  if (e.key === 'ArrowRight') navegaLightbox(+1);
});


/* ================================================
   THUMBNAILS DOS CARDS HORIZONTAIS
   Ao clicar em um thumbnail, troca a imagem
   principal do card e atualiza o estado .ativo
================================================ */
document.querySelectorAll('.proj-card-h').forEach(function(card) {

  var imgPrincipal = card.querySelector('.proj-img-principal');
  var thumbs       = card.querySelectorAll('.proj-thumb');

  thumbs.forEach(function(thumb) {
    thumb.addEventListener('click', function(e) {

      // Impede que o clique no thumb acione o lightbox diretamente
      e.stopPropagation();

      // Troca a imagem principal
      if (imgPrincipal && thumb.src) {
        imgPrincipal.src           = thumb.src;
        imgPrincipal.dataset.index = thumb.dataset.index;

        // Remove fallback se a imagem carregar
        imgPrincipal.closest('.proj-galeria').classList.remove('img-fallback');
      }

      // Atualiza o estado visual dos thumbnails
      thumbs.forEach(function(t) { t.classList.remove('ativo'); });
      thumb.classList.add('ativo');
    });
  });

});
