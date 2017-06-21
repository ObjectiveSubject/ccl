/**
 * Every piece of UI that requires javascript should have its own
 * javascript file. Use this file as a template for structuring
 * all JS source files.
 *
 * {Document Title}
 * {Description}
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var carousels = {

        init: function() {
            
            $('.promo__carousel').each(function(){
                carousels.promo(this);
            });

        },

        promo: function(el) {
            var $this = $(el),
                defaults = {
                    infinite: false,
                    mobileFirst: true,
                    dots: true,
                    dotsClass: 'promo__carousel-paging slick-dots'
                },
                options = $this.data('slick');

            if ( options.slidesToShow ) {
                options.slidesToScroll = options.slidesToShow;
            }

            options = $.extend( defaults, options );

            var carousel = $this.slick(options);
            carousel.on('beforeChange', function(event, slick, currentSlide, nextSlide){
                console.log($this);
                $this.find('.slick-slide').removeClass('slick-past');
                $this.find('.slick-slide[data-slick-index="'+nextSlide+'"]').prevAll().addClass('slick-past');
            });
        }

    };

    $(document).ready(function(){
        carousels.init();
    });

} )( this, jQuery );
