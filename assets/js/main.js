/*! CCL - v0.1.0
 * http://github.com/ObjectiveSubject/ccl
 * Copyright (c) 2017; * Licensed GPLv2+ */

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcm91c2Vscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogRXZlcnkgcGllY2Ugb2YgVUkgdGhhdCByZXF1aXJlcyBqYXZhc2NyaXB0IHNob3VsZCBoYXZlIGl0cyBvd25cbiAqIGphdmFzY3JpcHQgZmlsZS4gVXNlIHRoaXMgZmlsZSBhcyBhIHRlbXBsYXRlIGZvciBzdHJ1Y3R1cmluZ1xuICogYWxsIEpTIHNvdXJjZSBmaWxlcy5cbiAqXG4gKiB7RG9jdW1lbnQgVGl0bGV9XG4gKiB7RGVzY3JpcHRpb259XG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBjYXJvdXNlbHMgPSB7XG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoJy5qcy1wcm9tby1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBjYXJvdXNlbHMucHJvbW8odGhpcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIHByb21vOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJChlbCksXG4gICAgICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRvdHNDbGFzczogJ2NjbC1jLWNhcm91c2VsX19wYWdpbmcgc2xpY2stZG90cycsXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gJHRoaXMuZGF0YSgnc2xpY2snKTtcblxuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKCBkZWZhdWx0cywgb3B0aW9ucyApO1xuXG4gICAgICAgICAgICB2YXIgY2Fyb3VzZWwgPSAkdGhpcy5zbGljayhvcHRpb25zKTtcbiAgICAgICAgICAgIGNhcm91c2VsLm9uKCdiZWZvcmVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKXtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcuc2xpY2stc2xpZGUnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXBhc3QnKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcuc2xpY2stc2xpZGVbZGF0YS1zbGljay1pbmRleD1cIicrbmV4dFNsaWRlKydcIl0nKS5wcmV2QWxsKCkuYWRkQ2xhc3MoJ2NjbC1pcy1wYXN0Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgIGNhcm91c2Vscy5pbml0KCk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iXX0=
