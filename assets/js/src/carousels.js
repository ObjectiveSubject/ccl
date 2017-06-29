/**
 * Carousels
 * 
 * Initialize and define behavior for carousels. 
 * Uses the Slick Slides jQuery plugin --> http://kenwheeler.github.io/slick/
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var carousels = {

        init: function() {
            
            $('.js-promo-carousel').each(function(){
                carousels.promo(this);
            });

        },

        promo: function(el) {
            var $this = $(el),
                defaults = {
                    infinite: false,
                    mobileFirst: true,
                    dots: true,
                    dotsClass: 'ccl-c-carousel__paging slick-dots',
                    slidesToScroll: 1
                },
                options = $this.data('slick');

            options = $.extend( defaults, options );

            var carousel = $this.slick(options);
            carousel.on('beforeChange', function(event, slick, currentSlide, nextSlide){
                $this.find('.slick-slide').removeClass('ccl-is-past');
                $this.find('.slick-slide[data-slick-index="'+nextSlide+'"]').prevAll().addClass('ccl-is-past');
            });
        }

    };

    $(document).ready(function(){
        carousels.init();
    });

} )( this, jQuery );
