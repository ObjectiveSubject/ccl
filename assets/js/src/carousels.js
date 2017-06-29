/**
 * Carousels
 * 
 * Initialize and define behavior for carousels. 
 * Uses the Slick Slides jQuery plugin --> http://kenwheeler.github.io/slick/
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var Carousel = function(el){

        this.$el = $(el);
        this.globalDefaults = {
            mobileFirst: true,
            dotsClass: 'ccl-c-carousel__paging',
        };

        this.init();

    };

    Carousel.prototype.init = function() {
        
        if ( this.$el.hasClass('js-promo-carousel') ) {
            this.promo();
        }

    };

    Carousel.prototype.promo = function() {
        var defaults = {
                infinite: false,
                dots: true,
                slidesToScroll: 1
            },
            options = this.$el.data('slick');

        options = $.extend( this.globalDefaults, defaults, options );

        var carousel = this.$el.slick(options),
            _this = this;

        carousel.on('beforeChange', function(event, slick, currentSlide, nextSlide){
            _this.$el.find('.slick-slide').removeClass('ccl-is-past');
            _this.$el.find('.slick-slide[data-slick-index="'+nextSlide+'"]').prevAll().addClass('ccl-is-past');
        });
    };

    $(document).ready(function(){
        $('.ccl-c-carousel').each(function(){
            new Carousel(this);
        });
    });

} )( this, jQuery );
