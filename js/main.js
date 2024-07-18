$(document).ready(function () {
  "use strict";

  var window_width = $(window).width(),
    window_height = window.innerHeight,
    header_height = $(".default-header").height(),
    header_height_static = $(".site-header.static").outerHeight(),
    fitscreen = window_height - header_height;


  $(window).on("scroll", function () {
    if ($(window).scrollTop() >= 80) {
      $(".header-area").addClass("header-fixed");
    } else {
      $(".header-area").removeClass("header-fixed");
    }
  });

  $("select").niceSelect();

  $("#play-video").magnificPopup({
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false,
  });

  $(".img-pop-up").magnificPopup({
    type: "image",
    gallery: {
      enabled: true,
    },
  });

  function home_banner_slider() {
    if ($(".home-banner-owl").length) {
      $(".home-banner-owl").owlCarousel({
        loop: true,
        margin: 10,
        items: 1,
        nav: true,
        autoplay: 2500,
        smartSpeed: 1500,
        dots: true,
        responsiveClass: true,
        stagePadding: 140,
        navText: [
          "<img src='img/prev.png' alt='' />",
          "<img src='img/next.png' alt='' />",
        ],
        responsive: {
          0: {
            margin: 0,
            stagePadding: 0,
          },
          1299: {
            margin: 10,
            stagePadding: 140,
          },
        },
      });
    }
  }
  home_banner_slider();

  $('a[href*="#"]')
    .not('[href="#"]')
    .not('[href="#0"]')
    .click(function (event) {
      if (
        location.pathname.replace(/^\//, "") ==
          this.pathname.replace(/^\//, "") &&
        location.hostname == this.hostname
      ) {
        var target = $(this.hash);
        target = target.length
          ? target
          : $("[name=" + this.hash.slice(1) + "]");
        if (target.length) {
          event.preventDefault();
          $("html, body").animate(
            {
              scrollTop: target.offset().top - 60,
            },
            1000,
            function () {
              var $target = $(target);
              $target.focus();
              if ($target.is(":focus")) {
                return false;
              } else {
                $target.attr("tabindex", "-1"); 
                $target.focus(); 
              }
            }
          );
        }
      }
    });

  });


  function initSwiper() {
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let config = JSON.parse(
        swiperElement.querySelector(".swiper-config").innerHTML.trim()
      );

      if (swiperElement.classList.contains("swiper-tab")) {
        initSwiperWithCustomPagination(swiperElement, config);
      } else {
        new Swiper(swiperElement, config);
      }
    });
  }

  window.addEventListener("load", initSwiper);