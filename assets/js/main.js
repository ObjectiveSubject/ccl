/*! CCL - v0.1.0
 * http://github.com/ObjectiveSubject/ccl
 * Copyright (c) 2017; * Licensed GPLv2+ */

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

/**
 * Dropdowns
 * 
 * Initialize and control behavior for dropdown menus
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var Dropdown = function(el){
        this.$el = $(el);
        this.$toggle = this.$el.find('.ccl-c-dropdown__toggle');
        this.init();
    };

    Dropdown.prototype.init = function(){
        
        this.$toggle.on( 'click', function(e){
            e.preventDefault();
        });

    };

    $(document).ready(function(){
        $('.ccl-c-dropdown').each(function(){
            new Dropdown(this);
        });
    });

} )( this, jQuery );

/**
 * Every piece of UI that requires javascript should have its own
 * javascript file. Use this file as a template for structuring
 * all JS source files.
 *
 * {Title}
 * 
 * {Description}
 */

// ( function( window, $ ) {
// 	'use strict';
// 	var document = window.document;

//     var MyClass = function(){
//         this.init();
//     };

//     MyClass.prototype.init = function(){
//         // do something
//     };

//     $(document).ready(function(){
//         new MyClass();
//     });

// } )( this, jQuery );

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhcm91c2Vscy5qcyIsImRyb3Bkb3ducy5qcyIsInRlbXBsYXRlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ2Fyb3VzZWxzXG4gKiBcbiAqIEluaXRpYWxpemUgYW5kIGRlZmluZSBiZWhhdmlvciBmb3IgY2Fyb3VzZWxzLiBcbiAqIFVzZXMgdGhlIFNsaWNrIFNsaWRlcyBqUXVlcnkgcGx1Z2luIC0tPiBodHRwOi8va2Vud2hlZWxlci5naXRodWIuaW8vc2xpY2svXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBjYXJvdXNlbHMgPSB7XG5cbiAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoJy5qcy1wcm9tby1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBjYXJvdXNlbHMucHJvbW8odGhpcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9LFxuXG4gICAgICAgIHByb21vOiBmdW5jdGlvbihlbCkge1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJChlbCksXG4gICAgICAgICAgICAgICAgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGRvdHNDbGFzczogJ2NjbC1jLWNhcm91c2VsX19wYWdpbmcgc2xpY2stZG90cycsXG4gICAgICAgICAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvcHRpb25zID0gJHRoaXMuZGF0YSgnc2xpY2snKTtcblxuICAgICAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKCBkZWZhdWx0cywgb3B0aW9ucyApO1xuXG4gICAgICAgICAgICB2YXIgY2Fyb3VzZWwgPSAkdGhpcy5zbGljayhvcHRpb25zKTtcbiAgICAgICAgICAgIGNhcm91c2VsLm9uKCdiZWZvcmVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKXtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcuc2xpY2stc2xpZGUnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXBhc3QnKTtcbiAgICAgICAgICAgICAgICAkdGhpcy5maW5kKCcuc2xpY2stc2xpZGVbZGF0YS1zbGljay1pbmRleD1cIicrbmV4dFNsaWRlKydcIl0nKS5wcmV2QWxsKCkuYWRkQ2xhc3MoJ2NjbC1pcy1wYXN0Jyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgIGNhcm91c2Vscy5pbml0KCk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIERyb3Bkb3duc1xuICogXG4gKiBJbml0aWFsaXplIGFuZCBjb250cm9sIGJlaGF2aW9yIGZvciBkcm9wZG93biBtZW51c1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgRHJvcGRvd24gPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHRvZ2dsZSA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1kcm9wZG93bl9fdG9nZ2xlJyk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBEcm9wZG93bi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiR0b2dnbGUub24oICdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWMtZHJvcGRvd24nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgRHJvcGRvd24odGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBFdmVyeSBwaWVjZSBvZiBVSSB0aGF0IHJlcXVpcmVzIGphdmFzY3JpcHQgc2hvdWxkIGhhdmUgaXRzIG93blxuICogamF2YXNjcmlwdCBmaWxlLiBVc2UgdGhpcyBmaWxlIGFzIGEgdGVtcGxhdGUgZm9yIHN0cnVjdHVyaW5nXG4gKiBhbGwgSlMgc291cmNlIGZpbGVzLlxuICpcbiAqIHtUaXRsZX1cbiAqIFxuICoge0Rlc2NyaXB0aW9ufVxuICovXG5cbi8vICggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcbi8vIFx0J3VzZSBzdHJpY3QnO1xuLy8gXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbi8vICAgICB2YXIgTXlDbGFzcyA9IGZ1bmN0aW9uKCl7XG4vLyAgICAgICAgIHRoaXMuaW5pdCgpO1xuLy8gICAgIH07XG5cbi8vICAgICBNeUNsYXNzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbi8vICAgICAgICAgLy8gZG8gc29tZXRoaW5nXG4vLyAgICAgfTtcblxuLy8gICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4vLyAgICAgICAgIG5ldyBNeUNsYXNzKCk7XG4vLyAgICAgfSk7XG5cbi8vIH0gKSggdGhpcywgalF1ZXJ5ICk7XG4iXX0=
