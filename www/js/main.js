(function ($) {
    "use strict";

    /*--
        WOW active 
    ------------------------- */
    new WOW().init();
    /*--
        stickey menu
    ------------------------- */
    $(window).on('scroll', function () {
        var scroll = $(window).scrollTop();
        if (scroll < 265) {
            $(".sticky-header").removeClass("sticky");
        } else {
            $(".sticky-header").addClass("sticky");
        }
    });

    /*--
        02. jQuery MeanMenu
    ------------------------- */
    $('#mobile-menu-active').meanmenu({
        meanScreenWidth: "991",
        meanMenuContainer: ".mobile-menu-area .mobile-menu",
    });
    /*--
        Nice Select
    ------------------------- */
    $('.nice-select').niceSelect();

    /*--- Vertical-Menu Activation ----*/

    $('.categories-toggler-menu').on('click', function () {
        $('.vertical-menu-list').slideToggle();
    });
    /*---
    	3. Category Menu Active
    ---------------------------- */
    $('.categories-more-less').on('click', function () {
        $('.hide-child').slideToggle();
        $(this).toggleClass('rx-change');
    });
    /*--
     owl active
    --------------------------- */
    $('.slider-active').owlCarousel({
        loop: true,
        items: 1,
        autoplay: false,
        dots: true,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            },
            1200: {
                items: 1
            }
        }
    });
    /*--
     owl active
    ------------------------------ */
    $('.slider-active-2').owlCarousel({
        loop: true,
        items: 1,
        dots: true,
        nav: true,
        navText: ['<i class="ion-chevron-left"></i>', '<i class="ion-chevron-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            },
            1200: {
                items: 1
            }
        }
    });
    /*--
 owl active
------------------------------ */
    $('.product-h-2.priduct-module-1-active').owlCarousel({
        loop: true,
        items: 1,
        dots: false,
        nav: true,
        margin: 30,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            767: {
                items: 2
            },
            992: {
                items: 1
            },
            1200: {
                items: 1
            }
        }
    });
    /*--
     owl active
    ------------------------------ */
    $('.priduct-module-1-active').owlCarousel({
        loop: true,
        items: 1,
        dots: false,
        nav: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            },
            1200: {
                items: 1
            }
        }
    });

    /*--
     owl active
    ------------------------------ */
    $('.deals-offer-active').owlCarousel({
        loop: true,
        items: 2,
        dots: false,
        nav: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 2
            },
            1200: {
                items: 2
            }
        }
    });
    /*--
     owl active
    ------------------------------ */
    $('.deals-offer-one-active').owlCarousel({
        loop: true,
        items: 2,
        dots: false,
        nav: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 1
            },
            1200: {
                items: 1
            }
        }
    });
    /*--
     owl active
    ------------------------------ */
    $('.feategory-active').owlCarousel({
        loop: true,
        items: 5,
        dots: false,
        nav: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2
            },
            768: {
                items: 4
            },
            992: {
                items: 5
            },
            1200: {
                items: 5
            }
        }
    });
    /*--
     owl active
    ------------------------------ */
    $('.prodict-active').owlCarousel({
        loop: true,
        items: 4,
        dots: false,
        nav: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2
            },
            768: {
                items: 3
            },
            992: {
                items: 4
            },
            1200: {
                items: 4
            }
        }
    });
    /*--
     owl active
    ------------------------------ */
    $('.prodict-active-4').owlCarousel({
        loop: true,
        items: 4,
        dots: false,
        nav: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 1
            },
            768: {
                items: 3
            },
            992: {
                items: 3
            },
            1200: {
                items: 3
            }
        }
    });
    /*--
     owl active
    ------------------------------ */
    $('.prodict-two-active').owlCarousel({
        loop: true,
        items: 4,
        dots: false,
        nav: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2
            },
            768: {
                items: 3
            },
            992: {
                items: 4
            },
            1200: {
                items: 5
            }
        }
    });
    /*--
     owl active
    ------------------------------ */
    $('.product-three-active').owlCarousel({
        loop: true,
        items: 4,
        dots: false,
        nav: true,
        navText: ['<i class="ion-chevron-left"></i>', '<i class="ion-chevron-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1200: {
                items: 4
            }
        }
    });
    /*--
     owl active
    ------------------------------ */
    $('.brand-active').owlCarousel({
        loop: true,
        items: 1,
        margin: 15,
        dots: false,
        nav: false,
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 2
            },
            768: {
                items: 4
            },
            992: {
                items: 5
            },
            1200: {
                items: 5
            }
        }
    });
    /*--
     owl active
    ------------------------------ */
    $('.product-category-active').owlCarousel({
        loop: true,
        items: 1,
        margin: 15,
        dots: false,
        nav: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            },
            1200: {
                items: 1
            }
        }
    });
    /*--
     owl active
    ------------------------------ */
    $('.articles-cont-active').owlCarousel({
        loop: true,
        items: 1,
        margin: 15,
        dots: false,
        nav: false,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            },
            1200: {
                items: 1
            }
        }
    });
    /*--
     owl active
    ------------------------------ */
    $('.single-product-active').owlCarousel({
        loop: false,
        items: 4,
        margin: 15,
        dots: false,
        nav: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 2
            },
            480: {
                items: 3
            },
            768: {
                items: 4
            },
            992: {
                items: 4
            },
            1200: {
                items: 4
            }
        }
    });
    /*--
     owl active
    ------------------------------ */
    $('.from-blog').owlCarousel({
        loop: true,
        items: 2,
        dots: false,
        nav: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            480: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 2
            },
            1200: {
                items: 2
            }
        }
    });

    /*--
     owl active
    ------------------------------ */
    $('.post-slider').owlCarousel({
        loop: true,
        items: 1,
        dots: true,
        nav: true,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            },
            1200: {
                items: 1
            }
        }
    });
    /*--
     owl active
    ------------------------------ */

    $('.testimonials-active').owlCarousel({
        loop: true,
        items: 1,
        dots: false,
        nav: false,
        navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            },
            1200: {
                items: 1
            }
        }
    });


    /*--
        elevateZoom
    ------------------------------ */
    $("#zoom1").elevateZoom({
        gallery: 'gallery_01',
        responsive: true,
        zoomType: 'inner',
        cursor: 'crosshair'
    });



    /*--
      11. price-slider active
    -----------------------------*/
    $("#price-slider").slider({
        range: true,
        min: 0,
        max: 145,
        values: [20, 440],
        slide: function (event, ui) {
            $("#min-price").val('$' + ui.values[0]);
            $("#max-price").val('$' + ui.values[1]);
        }
    });
    $("#min-price").val('$' + $("#price-slider").slider("values", 0));
    $("#max-price").val('$' + $("#price-slider").slider("values", 1));




    /*---
        select last tab 
    -------------------------*/

    $('.tabs-categorys-list a[href="#new-arrivals"],.shop-item-filter-list a[href="#grid"],.discription-tab-menu a[href="#description"]').tab('show')

    /*--
    	Count Down Timer
    ----------------------------*/
    $('[data-countdown]').each(function () {
        var $this = $(this),
            finalDate = $(this).data('countdown');
        $this.countdown(finalDate, function (event) {
            $this.html(event.strftime('<span class="cdown day"><span class="time-count">%-D</span> <p>Days</p></span> <span class="cdown hour"><span class="time-count">%-H</span> <p>Hours</p></span> <span class="cdown minutes"><span class="time-count">%M</span> <p>mins</p></span> <span class="cdown second"><span class="time-count">%S</span> <p>secs</p></span>'));
        });
    });


    /*--
      Vertical-Menu Activation
    -----------------------------*/
    $('.categorie-title,.mobile-categorei-menu').on('click', function () {
        $('.vertical-menu-list,.mobile-categorei-menu-list').slideToggle();
    });

    /*--
      Category menu Activation
    ------------------------------*/
    $('#cate-toggle li.has-sub>a,#cate-mobile-toggle li.has-sub>a').on('click', function () {
        $(this).removeAttr('href');
        var element = $(this).parent('li');
        if (element.hasClass('open')) {
            element.removeClass('open');
            element.find('li').removeClass('open');
            element.find('ul').slideUp();
        } else {
            element.addClass('open');
            element.children('ul').slideDown();
            element.siblings('li').children('ul').slideUp();
            element.siblings('li').removeClass('open');
            element.siblings('li').find('li').removeClass('open');
            element.siblings('li').find('ul').slideUp();
        }
    });

    /*--
        Accordion
    -------------------------*/
    $(".faequently-accordion").collapse({
        accordion: true,
        open: function () {
            this.slideDown(300);
        },
        close: function () {
            this.slideUp(300);
        }
    });

    /*--
      showlogin toggle function
    --------------------------*/
    $('#showlogin').on('click', function () {
        $('#checkout-login').slideToggle(500);
    });

    /*--
      showcoupon toggle function
    --------------------------*/
    $('#showcoupon').on('click', function () {
        $('#checkout-coupon').slideToggle(500);
    });

    /*--- Checkout ---*/
    $("#chekout-box").on("change", function () {
        $(".account-create").slideToggle("100");
    });

    /*-- Checkout -----*/
    $("#chekout-box-2").on("change", function () {
        $(".ship-box-info").slideToggle("100");
    });


    /*--
        ScrollUp Active
    -----------------------------------*/
    $.scrollUp({
        scrollText: '<i class="ion-chevron-up"></i>',
        easingType: 'linear',
        scrollSpeed: 900,
        animation: 'fade'
    });
    /*--
        Instafeed
    -----------------------------------------*/
    if ($('#instagram-feed').length) {
        var feed = new Instafeed({
            get: 'user',
            userId: 6665768655,
            accessToken: '6665768655.1677ed0.313e6c96807c45d8900b4f680650dee5',
            target: 'instagram-feed',
            resolution: 'thumbnail',
            limit: 6,
            template: '<li><a href="{{link}}" target="_new"><img src="{{image}}" /></a></li>',
        });
        feed.run();
    }









})(jQuery);
/* Theme JS */

(function ($) {
    "use strict";

    /* ----------------------------------------------
          jQuery MeanMenu
      ---------------------------------------------- */
    $('#mobile-menu-active').meanmenu({
        meanScreenWidth: "991",
        meanMenuContainer: ".mobile-menu-area .mobile-menu",
    });

    /* ----------------------------------------------
        nice-select-menu
    ---------------------------------------------- */
    $('.nice-select-menu').niceSelect();
    /*----------------------------
       4.1 Vertical-Menu Activation
       -----------------------------*/
    $('.categorie-title').on('click', function () {
        $('.categori-menu-list').slideToggle();
    });

    /* ----------------------------------------------
        gallery-post active
    ---------------------------------------------- */
    $('.gallery-post').owlCarousel({
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        loop: true,
        dots: false,
        nav: false,
        navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
        item: 1,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })


    /* ----------------------------------------------
        product-carousel-active
    ---------------------------------------------- */
    $('.product-carousel-active').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 2,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 1
            },
            1170: {
                items: 1
            },
            1366: {
                items: 2
            }
        }
    })
    /* ----------------------------------------------
        product-carousel-active
    ---------------------------------------------- */
    $('.product-carousel-active-home-four').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 1,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })

    /* ----------------------------------------------
        product-carousel-active
    ---------------------------------------------- */
    $('.home-three-product-carousel').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 1,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 1
            },
            1000: {
                items: 3
            },
            1600: {
                items: 1
            }
        }
    })


    /* ----------------------------------------------
        product-carousel-active
    ---------------------------------------------- */
    $('.product-carousel-active-2').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 5,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 3
            },
            992: {
                items: 3
            },
            1000: {
                items: 4
            },
            1366: {
                items: 5
            }
        }
    })
    /* ----------------------------------------------
        product-carousel-active
    ---------------------------------------------- */
    $('.product-carousel-active-h2').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 5,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 3
            },
            992: {
                items: 3
            },
            1000: {
                items: 4
            },
            1366: {
                items: 4
            },
            1600: {
                items: 5
            }
        }
    })
    /* ----------------------------------------------
        product-carousel-active
    ---------------------------------------------- */
    $('.product-carousel-active-3').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 6,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 3
            },
            950: {
                items: 3
            },
            1000: {
                items: 4
            },
            1366: {
                items: 5
            },
            1600: {
                items: 5
            }
        }
    })

    /* ----------------------------------------------
        product-carousel-active
    ---------------------------------------------- */
    $('.product-carousel-active-4').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 1,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            1000: {
                items: 2
            }
        }
    })
    /* ----------------------------------------------
            best seller carousel active
        ---------------------------------------------- */
    $('.bestseller-sidebar').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 1,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1000: {
                items: 3
            },
            1170: {
                items: 3
            },
            1366: {
                items: 1
            }
        }
    })
    /* ----------------------------------------------
        best seller carousel active
    ---------------------------------------------- */
    $('.newarival-sidebar').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 1,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 2
            },
            992: {
                items: 3
            },
            1000: {
                items: 3
            },
            1170: {
                items: 3
            },
            1366: {
                items: 1
            }
        }
    })
    /* ----------------------------------------------
        testimonial carousel active
    ---------------------------------------------- */
    $('.testimonial-sidebar').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 1,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })
    /* ----------------------------------------------
        mini product carousel active
    ---------------------------------------------- */
    $('.mini-product').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 1,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            992: {
                items: 1
            },
            1000: {
                items: 1
            },
            1170: {
                items: 1
            }
        }
    })
    /* ----------------------------------------------
        mini product carousel active
    ---------------------------------------------- */
    $('.mini-product-2').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 1,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            600: {
                items: 1
            },
            768: {
                items: 2
            },
            992: {
                items: 3
            },
            1000: {
                items: 3
            },
            1170: {
                items: 3
            },
            1366: {
                items: 1
            }
        }
    })

    /* ----------------------------------------------
        product-carousel-active
    ---------------------------------------------- */
    $('.home-two-product-carousel-active').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 4,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            950: {
                items: 3
            },
            1000: {
                items: 4
            }
        }
    })

    /* ----------------------------------------------
       Home two sidebar product-carousel-active
    ---------------------------------------------- */
    $('.home-two-sidebar-product').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 1,
        dots: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
            },
            768: {
                items: 2,
            },
            950: {
                items: 3,
            },
            1000: {
                items: 3,
            }
        }
    })
    /* ----------------------------------------------
        brand-carousel-active
    ---------------------------------------------- */
    $('.brand-carousel-active').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: true,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 8,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                center: true
            },
            768: {
                items: 4
            },
            1000: {
                items: 8
            }
        }
    })
    /* ----------------------------------------------
        brand-carousel-active
    ---------------------------------------------- */
    $('.four-brand-carousel-active').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: true,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 6,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                center: true
            },
            768: {
                items: 3
            },
            1000: {
                items: 6
            }
        }
    })
    /* ----------------------------------------------
        product dec slider qui active
    ---------------------------------------------- */
    $('.product-dec-slider-qui').owlCarousel({
        loop: true,
        nav: false,
        navText: ["<i class='ion-ios-arrow-left'></i>", "<i class='ion-ios-arrow-right'></i>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 4,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                center: true
            },
            768: {
                items: 3
            },
            1000: {
                items: 4
            }
        }
    })



    $('.product-dec-slider').slick({
        dots: true,
        vertical: true,
        slidesToShow: 4,
        slidesToScroll: 4,
        verticalSwiping: true,
        arrows: true,
        nextArrow: '<i class="fa fa-chevron-down"></i>',
        prevArrow: '<i class="fa fa-chevron-up"></i>',
    });



    /* ----------------------------------------------
        slider-carousel-active
    ---------------------------------------------- */
    $('.banner-call-to-action-carousel-active').owlCarousel({
        loop: true,
        nav: true,
        navText: ["<img src='images/icons/arrow-left.png'>", "<img src='images/icons/arrow-right.png'>"],
        autoplay: false,
        autoplayTimeout: 5000,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        item: 1,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 1
            },
            1000: {
                items: 1
            }
        }
    })


    /* ----------------------------------------------
        slider-carousel-active
    ---------------------------------------------- */

    /* ********************************************
        5. Countdown
    ******************************************** */
    $('[data-countdown]').each(function () {
        var $this = $(this),
            finalDate = $(this).data('countdown');
        $this.countdown(finalDate, function (event) {
            $this.html(event.strftime('<span class="cdown days"><span class="time-count">%-D</span><span>D : </span></span> <span class="cdown hour"><span class="time-count">%-H</span><span>H : </span></span> <span class="cdown minutes"><span class="time-count">%M</span><span>M : </span></span> <span class="cdown second"> <span><span class="time-count">%S</span><span>S</span></span>'));
        });
    });

    /* ----------------------------------------------
        product popup
    ---------------------------------------------- */
    $('.product-popup').magnificPopup({
        delegate: 'a', // child items selector, by clicking on it popup will open
        type: 'image'
        // other options
    });



    /*--------------------------
    tab active
    ---------------------------- */
    $('.product-details-small a').on('click', function (e) {
        e.preventDefault();

        var $href = $(this).attr('href');

        $('.product-details-small a').removeClass('active');
        $(this).addClass('active');

        $('.product-details-large .tab-pane').removeClass('active');
        $('.product-details-large ' + $href).addClass('active');
    })

    /* ----------------------------------------------
        Tooltip
    ---------------------------------------------- */
    $('[rel="tooltip"]').tooltip();



    /* ********************************************
        13. Cart Plus Minus Button
    ******************************************** */
    $(".cart-plus-minus").prepend('<div class="dec qtybutton">-</div>');
    $(".cart-plus-minus").append('<div class="inc qtybutton">+</div>');
    $(".qtybutton").on("click", function () {
        var $button = $(this);
        var oldValue = $button.parent().find("input").val();
        if ($button.text() == "+") {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            // Don't allow decrementing below zero
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        $button.parent().find("input").val(newVal);
    });

    /*-- Price Range --*/
    $('#price-range').slider({
        range: true,
        min: 0,
        max: 700,
        values: [0, 700],
        slide: function (event, ui) {
            $('.price-amount').val('$' + ui.values[0] + ' - $' + ui.values[1]);
        }
    });
    $('.price-amount').val('$' + $('#price-range').slider('values', 0) +
        ' - $' + $('#price-range').slider('values', 1));
    $('.product-filter-toggle').on('click', function () {
        $('.product-filter-wrapper').slideToggle();
    })

    /* ---------------------------
    11. FAQ Accordion Active
    * ---------------------------*/
    $('.panel-heading a').on('click', function () {
        $('.panel-default').removeClass('show');
        $(this).parents('.panel-default').addClass('show');
    });


    /* CounterUp Active */
    $('.counter').counterUp({
        delay: 10,
        time: 1000
    });


    /*--
        Isotop with ImagesLoaded
    -----------------------------------*/
    var isotopFilter = $('.isotop-filter');
    var isotopGrid = $('.isotop-grid');
    var isotopGridMasonry = $('.isotop-grid-masonry');
    var isotopGridItem = '.isotop-item';
    /*-- Images Loaded --*/
    isotopGrid.imagesLoaded(function () {
        /*-- Filter List --*/
        isotopFilter.on('click', 'button', function () {
            isotopFilter.find('button').removeClass('active');
            $(this).addClass('active');
            var filterValue = $(this).attr('data-filter');
            isotopGrid.isotope({
                filter: filterValue
            });
        });
        /*-- Filter Grid Layout FitRows --*/
        isotopGrid.isotope({
            itemSelector: isotopGridItem,
            layoutMode: 'fitRows',
            masonry: {
                columnWidth: 1,
            }
        });
        /*-- Filter Grid Layout Masonary --*/
        isotopGridMasonry.isotope({
            itemSelector: isotopGridItem,
            layoutMode: 'masonry',
            masonry: {
                columnWidth: 1,
            }
        });
    });

    /*-- Image --*/
    var imagePopup = $('.image-popup');
    imagePopup.magnificPopup({
        type: 'image',
    });

    $('iframe[src*="youtube"]').parent().fitVids();

    /*--------------------------
     ScrollUp
    ---------------------------- */
    $.scrollUp({
        scrollText: '<i class="ion-arrow-up-c"></i>',
        easingType: 'linear',
        scrollSpeed: 900,
        animation: 'fade'
    });

    // -------------------------------------------------------------
    // nivoSlider
    // -------------------------------------------------------------
    $('#mainSlider').nivoSlider({
        manualAdvance: false,
        directionNav: true,
        animSpeed: 500,
        slices: 18,
        pauseTime: 5000,
        pauseOnHover: false,
        controlNav: false,
        prevText: '<i class="fa fa-angle-left nivo-prev-icon"></i>',
        nextText: '<i class="fa fa-angle-right nivo-next-icon"></i>'
    });


})(jQuery);