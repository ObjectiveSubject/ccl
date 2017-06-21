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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcm91c2Vscy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBFdmVyeSBwaWVjZSBvZiBVSSB0aGF0IHJlcXVpcmVzIGphdmFzY3JpcHQgc2hvdWxkIGhhdmUgaXRzIG93blxuICogamF2YXNjcmlwdCBmaWxlLiBVc2UgdGhpcyBmaWxlIGFzIGEgdGVtcGxhdGUgZm9yIHN0cnVjdHVyaW5nXG4gKiBhbGwgSlMgc291cmNlIGZpbGVzLlxuICpcbiAqIHtEb2N1bWVudCBUaXRsZX1cbiAqIHtEZXNjcmlwdGlvbn1cbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIGNhcm91c2VscyA9IHtcblxuICAgICAgICBpbml0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJCgnLnByb21vX19jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBjYXJvdXNlbHMucHJvbW8odGhpcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIHByb21vOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJChlbCksXG4gICAgICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRvdHNDbGFzczogJ3Byb21vX19jYXJvdXNlbC1wYWdpbmcgc2xpY2stZG90cydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIG9wdGlvbnMgPSAkdGhpcy5kYXRhKCdzbGljaycpO1xuXG4gICAgICAgICAgICBpZiAoIG9wdGlvbnMuc2xpZGVzVG9TaG93ICkge1xuICAgICAgICAgICAgICAgIG9wdGlvbnMuc2xpZGVzVG9TY3JvbGwgPSBvcHRpb25zLnNsaWRlc1RvU2hvdztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKCBkZWZhdWx0cywgb3B0aW9ucyApO1xuXG4gICAgICAgICAgICB2YXIgY2Fyb3VzZWwgPSAkdGhpcy5zbGljayhvcHRpb25zKTtcbiAgICAgICAgICAgIGNhcm91c2VsLm9uKCdiZWZvcmVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkdGhpcyk7XG4gICAgICAgICAgICAgICAgJHRoaXMuZmluZCgnLnNsaWNrLXNsaWRlJykucmVtb3ZlQ2xhc3MoJ3NsaWNrLXBhc3QnKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcuc2xpY2stc2xpZGVbZGF0YS1zbGljay1pbmRleD1cIicrbmV4dFNsaWRlKydcIl0nKS5wcmV2QWxsKCkuYWRkQ2xhc3MoJ3NsaWNrLXBhc3QnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgY2Fyb3VzZWxzLmluaXQoKTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiJdfQ==
