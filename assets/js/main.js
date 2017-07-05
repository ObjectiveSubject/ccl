/*! CCL - v0.1.0
 * http://github.com/ObjectiveSubject/ccl
 * Copyright (c) 2017; * Licensed GPLv2+ */

/**
 * Accordions
 * 
 * Behavior for accordion components
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var Accordion = function(el){
        this.$el = $(el);
        this.$toggle = this.$el.find('.ccl-c-accordion__toggle');
        this.$content = this.$el.find('.ccl-c-accordion__content');
        this.init();
    };

    Accordion.prototype.init = function(){
        var _this = this;

        this.$toggle.on('click', function(e){
            e.preventDefault();
            _this.$content.slideToggle();
            _this.$el.toggleClass('ccl-is-open');
        });

    };

    $(document).ready(function(){
        $('.ccl-c-accordion').each(function(){
            new Accordion(this);
        });
    });

} )( this, jQuery );

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjY29yZGlvbnMuanMiLCJjYXJvdXNlbHMuanMiLCJkcm9wZG93bnMuanMiLCJ0ZW1wbGF0ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBBY2NvcmRpb25zXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBhY2NvcmRpb24gY29tcG9uZW50c1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgQWNjb3JkaW9uID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiR0b2dnbGUgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtYWNjb3JkaW9uX190b2dnbGUnKTtcbiAgICAgICAgdGhpcy4kY29udGVudCA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1hY2NvcmRpb25fX2NvbnRlbnQnKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEFjY29yZGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kdG9nZ2xlLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgX3RoaXMuJGNvbnRlbnQuc2xpZGVUb2dnbGUoKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC50b2dnbGVDbGFzcygnY2NsLWlzLW9wZW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1jLWFjY29yZGlvbicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBBY2NvcmRpb24odGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBDYXJvdXNlbHNcbiAqIFxuICogSW5pdGlhbGl6ZSBhbmQgZGVmaW5lIGJlaGF2aW9yIGZvciBjYXJvdXNlbHMuIFxuICogVXNlcyB0aGUgU2xpY2sgU2xpZGVzIGpRdWVyeSBwbHVnaW4gLS0+IGh0dHA6Ly9rZW53aGVlbGVyLmdpdGh1Yi5pby9zbGljay9cbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIENhcm91c2VsID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuZ2xvYmFsRGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgIGRvdHNDbGFzczogJ2NjbC1jLWNhcm91c2VsX19wYWdpbmcnLFxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfTtcblxuICAgIENhcm91c2VsLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICBpZiAoIHRoaXMuJGVsLmhhc0NsYXNzKCdqcy1wcm9tby1jYXJvdXNlbCcpICkge1xuICAgICAgICAgICAgdGhpcy5wcm9tbygpO1xuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgQ2Fyb3VzZWwucHJvdG90eXBlLnByb21vID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9wdGlvbnMgPSB0aGlzLiRlbC5kYXRhKCdzbGljaycpO1xuXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCggdGhpcy5nbG9iYWxEZWZhdWx0cywgZGVmYXVsdHMsIG9wdGlvbnMgKTtcblxuICAgICAgICB2YXIgY2Fyb3VzZWwgPSB0aGlzLiRlbC5zbGljayhvcHRpb25zKSxcbiAgICAgICAgICAgIF90aGlzID0gdGhpcztcblxuICAgICAgICBjYXJvdXNlbC5vbignYmVmb3JlQ2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSl7XG4gICAgICAgICAgICBfdGhpcy4kZWwuZmluZCgnLnNsaWNrLXNsaWRlJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1wYXN0Jyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuZmluZCgnLnNsaWNrLXNsaWRlW2RhdGEtc2xpY2staW5kZXg9XCInK25leHRTbGlkZSsnXCJdJykucHJldkFsbCgpLmFkZENsYXNzKCdjY2wtaXMtcGFzdCcpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1jLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IENhcm91c2VsKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogRHJvcGRvd25zXG4gKiBcbiAqIEluaXRpYWxpemUgYW5kIGNvbnRyb2wgYmVoYXZpb3IgZm9yIGRyb3Bkb3duIG1lbnVzXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBEcm9wZG93biA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdG9nZ2xlID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLWRyb3Bkb3duX190b2dnbGUnKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIERyb3Bkb3duLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJHRvZ2dsZS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5jY2wtYy1kcm9wZG93bicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBEcm9wZG93bih0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIEV2ZXJ5IHBpZWNlIG9mIFVJIHRoYXQgcmVxdWlyZXMgamF2YXNjcmlwdCBzaG91bGQgaGF2ZSBpdHMgb3duXG4gKiBqYXZhc2NyaXB0IGZpbGUuIFVzZSB0aGlzIGZpbGUgYXMgYSB0ZW1wbGF0ZSBmb3Igc3RydWN0dXJpbmdcbiAqIGFsbCBKUyBzb3VyY2UgZmlsZXMuXG4gKlxuICoge1RpdGxlfVxuICogXG4gKiB7RGVzY3JpcHRpb259XG4gKi9cblxuLy8gKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuLy8gXHQndXNlIHN0cmljdCc7XG4vLyBcdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuLy8gICAgIHZhciBNeUNsYXNzID0gZnVuY3Rpb24oKXtcbi8vICAgICAgICAgdGhpcy5pbml0KCk7XG4vLyAgICAgfTtcblxuLy8gICAgIE15Q2xhc3MucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuLy8gICAgICAgICAvLyBkbyBzb21ldGhpbmdcbi8vICAgICB9O1xuXG4vLyAgICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbi8vICAgICAgICAgbmV3IE15Q2xhc3MoKTtcbi8vICAgICB9KTtcblxuLy8gfSApKCB0aGlzLCBqUXVlcnkgKTtcbiJdfQ==
