/*
  PORTFÓLIO — MATHEUS JALLES
  script.js — comportamentos da página
  ========================================
  1. Sombra no header ao rolar
  2. Scroll Reveal — animação de entrada
  3. Menu mobile (hamburguer)
  4. Link ativo na navegação
*/


/* ========================================
   1. SOMBRA NO HEADER AO ROLAR
   Adiciona classe .rolando ao rolar > 10px
======================================== */
var header = document.getElementById('header');

window.addEventListener('scroll', function () {
  if (window.scrollY > 10) {
    header.classList.add('rolando');
  } else {
    header.classList.remove('rolando');
  }
});


/* ========================================
   2. SCROLL REVEAL
   Detecta quando elementos entram na tela
   e adiciona a classe .visivel (CSS faz o resto)
======================================== */

// Seleciona todos os elementos com a classe .reveal
var elementosReveal = document.querySelectorAll('.reveal');

// Observer: dispara quando o elemento fica 10% visível
var observadorReveal = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      // Adiciona .visivel para ativar a animação CSS
      entrada.target.classList.add('visivel');
      // Para de observar após animar (animação acontece só uma vez)
      observadorReveal.unobserve(entrada.target);
    }
  });
}, { threshold: 0.1 });

// Registra cada elemento para ser observado
elementosReveal.forEach(function (el) {
  observadorReveal.observe(el);
});

// Elementos já visíveis ao carregar a página aparecem imediatamente
window.addEventListener('load', function () {
  elementosReveal.forEach(function (el) {
    if (el.getBoundingClientRect().top < window.innerHeight) {
      el.classList.add('visivel');
    }
  });
});


/* ========================================
   3. MENU MOBILE (HAMBURGUER)
   Alterna a classe .aberto na <nav>
   ao clicar no botão hamburguer
======================================== */
var btnMenu = document.getElementById('menu-toggle');
var nav     = document.querySelector('nav');

if (btnMenu && nav) {
  btnMenu.addEventListener('click', function () {
    // Alterna o menu aberto/fechado
    nav.classList.toggle('aberto');

    // Acessibilidade: informa o estado do botão
    var estaAberto = nav.classList.contains('aberto');
    btnMenu.setAttribute('aria-expanded', estaAberto);
  });

  // Fecha o menu ao clicar em qualquer link da nav
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('aberto');
      btnMenu.setAttribute('aria-expanded', 'false');
    });
  });
}


/* ========================================
   4. LINK ATIVO NA NAVEGAÇÃO
   Destaca o link da seção que está visível
   usando IntersectionObserver nas seções
======================================== */
var secoes   = document.querySelectorAll('section[id]');
var linksNav = document.querySelectorAll('nav a');

var observadorNav = new IntersectionObserver(function (entradas) {
  entradas.forEach(function (entrada) {
    if (entrada.isIntersecting) {
      var idAtual = entrada.target.id;

      // Remove .ativo de todos e adiciona só no link correspondente
      linksNav.forEach(function (link) {
        link.classList.remove('ativo');
        if (link.getAttribute('href') === '#' + idAtual) {
          link.classList.add('ativo');
        }
      });
    }
  });
}, {
  threshold: 0.4 // ativa quando 40% da seção está visível
});

secoes.forEach(function (secao) {
  observadorNav.observe(secao);
});