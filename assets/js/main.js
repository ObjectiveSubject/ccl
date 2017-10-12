/*! CCL - v0.1.0
 * http://github.com/ObjectiveSubject/ccl
 * Copyright (c) 2017; * Licensed GPLv2+ */

/**
 * Global Variables. 
 */


(function ( $, window ) {
    'use strict';
    var document = window.document;
    
    if (!window.CCL) {
        window.CCL = {};
    }

    CCL.DURATION = 300;

    CCL.BREAKPOINT_SM = 500;
    CCL.BREAKPOINT_MD = 768;
    CCL.BREAKPOINT_LG = 1000;
    CCL.BREAKPOINT_XL = 1500;

    $(document).ready(function(){
        $('html').toggleClass('no-js js');
    });

})(jQuery, this);
/**
 * Reflow page elements. 
 * 
 * Enables animations/transitions on elements added to the page after the DOM has loaded.
 */


(function () {

    if (!window.CCL) {
        window.CCL = {};
    }

    CCL.reflow = function (element) {
        return element.offsetHeight;
    };

})();
/**
 * Get the Scrollbar width
 * Thanks to david walsh: https://davidwalsh.name/detect-scrollbar-width
 */

( function( window, $ ) {
    'use strict';
    var document = window.document;
    
    function getScrollWidth() {
        
        // Create the measurement node
        var scrollDiv = document.createElement("div");
        
        // position way the hell off screen
        $(scrollDiv).css({
            width: '100px',
            height: '100px',
            overflow: 'scroll',
            position: 'absolute',
            top: '-9999px',
        });

        $('body').append(scrollDiv);

        // Get the scrollbar width
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        // console.warn(scrollbarWidth); // Mac:  15

        // Delete the DIV 
        $(scrollDiv).remove();

        return scrollbarWidth;
    }
    
    if ( ! window.CCL ) {
        window.CCL = {};
    }

    CCL.getScrollWidth = getScrollWidth;
    CCL.SCROLLBARWIDTH = getScrollWidth();

} )( this, jQuery );

/**
 * .debounce() function
 * 
 * Source: https://davidwalsh.name/javascript-debounce-function
 */


(function(window) {

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    var throttle = function (func, wait, options) {
        var timeout, context, args, result;
        var previous = 0;
        if (!options) options = {};

        var later = function () {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };

        var throttled = function () {
            var now = new Date().getTime();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };

        throttled.cancel = function () {
            clearTimeout(timeout);
            previous = 0;
            timeout = context = args = null;
        };

        return throttled;
    };

    if (!window.CCL) {
        window.CCL = {};
    }

    window.CCL.throttle = throttle;

})(this);
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
        this.$toggle = this.$el.children('.ccl-c-accordion__toggle');
        this.$content = this.$el.children('.ccl-c-accordion__content');
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
 * Alerts
 * 
 * Behavior for alerts
 */

(function (window, $) {
    'use strict';

    var document = window.document,
        DURATION = CCL.DURATION;

    var AlertDismiss = function(el){
        
        var $el = $(el);
        
        this.$el = $(el);
        this.target = $el.parent();
        this.$target = $(this.target);
        
        this.init();
    };

    AlertDismiss.prototype.init = function(){
        
        var _this = this; 

        _this.$el.on( 'click', function(e){
            e.preventDefault();

            _this.dismissAlert();
        });

    };
    
    AlertDismiss.prototype.dismissAlert = function(){

        var _this = this;

        _this.$target.animate( { opacity: 0 }, {
            duration: DURATION,
            complete: function(){
                _this.$target.slideUp( DURATION, function(){
                    _this.$target.remove();
                });
            }
        });

    };



    $(document).ready(function(){
        $('[data-dismiss="alert"]').each(function(){
            new AlertDismiss(this);
        });
    });

})(this, jQuery);
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
            infinite: false,
            dots: true,
            slidesToScroll: 1,
            variableWidth: true
        };

        this.init();

    };

    Carousel.prototype.init = function() {
        var data = this.$el.data(),
            options = data.options || {};
            
        options.responsive = [];

        if ( data.optionsSm ) {
            options.responsive.push({
                breakpoint: CCL.BREAKPOINT_SM, 
                settings: data.optionsSm
            });
        }
        if ( data.optionsMd ) {
            options.responsive.push({
                breakpoint: CCL.BREAKPOINT_MD, 
                settings: data.optionsMd
            });
        }
        if ( data.optionsLg ) {
            options.responsive.push({
                breakpoint: CCL.BREAKPOINT_LG, 
                settings: data.optionsLg
            });
        }
        if ( data.optionsXl ) {
            options.responsive.push({
                breakpoint: CCL.BREAKPOINT_XL, 
                settings: data.optionsXl
            });
        }

        options = $.extend( this.globalDefaults, options );

        var carousel = this.$el.slick(options),
            _this = this;

        carousel.on('beforeChange', function(event, slick, currentSlide, nextSlide){
            _this.$el.find('.slick-slide').removeClass('ccl-is-past');
            _this.$el.find('.slick-slide[data-slick-index="'+nextSlide+'"]').prevAll().addClass('ccl-is-past');
        });
    };

    $(document).ready(function(){
        $('.js-promo-carousel').each(function(){
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
    var document = window.document,
        selector = {
            TOGGLE: '[data-toggle="dropdown"]',
        },
        className = {
            ACTIVE: 'ccl-is-active',
            MENU: 'ccl-c-dropdown__menu'
        };

    var DropdownToggle = function(el){
        this.$toggle = $(el);
        this.$parent = this.$toggle.parent();
        
        var target = this.$toggle.data('target');

        this.$menu = $( target );
        
        this.init();
    };

    DropdownToggle.prototype.init = function(){

        var _this = this;

        this.$toggle.click( function(event){
            event.preventDefault();
            event.stopPropagation();
            _this.toggle();
        });

        $(document).on( 'click', function(event){
            var hasActiveMenus = $( '.' + className.MENU + '.' + className.ACTIVE ).length;
            if ( hasActiveMenus ){
                _clearMenus();
            }
        });

    };

    DropdownToggle.prototype.toggle = function(){

        var isActive = this.$toggle.hasClass( className.ACTIVE );

        if ( isActive ) {
            return;
        }

        this.showMenu();

    };

    DropdownToggle.prototype.showMenu = function(){
        this.$toggle.attr('aria-expanded', 'true');
        this.$menu.addClass( className.ACTIVE );
        this.$parent.addClass( className.ACTIVE );
    };

    DropdownToggle.prototype.hideMenu = function(){
        this.$toggle.attr('aria-expanded', 'false');
        this.$menu.removeClass( className.ACTIVE );
        this.$parent.removeClass( className.ACTIVE );
    };

    function _clearMenus() {
        $('.ccl-c-dropdown, .ccl-c-dropdown__menu').removeClass( className.ACTIVE );
        $( selector.TOGGLE ).attr('aria-expanded', 'false');
    }

    $(document).ready(function(){
        $( selector.TOGGLE ).each(function(){
            new DropdownToggle(this);
        });
    });

} )( this, jQuery );

/**
 * Modals
 * 
 * Behavior for modals. Based on Bootstrap's modals: https://getbootstrap.com/docs/4.0/components/modal/
 * 
 * Globals:
 * SCROLLBARWIDTH
 */

(function (window, $) {
    'use strict';

    var document = window.document,
        DURATION = 300;

    var ModalToggle = function(el){
        
        var $el = $(el);
        
        this.$el = $(el);
        this.target = $el.data('target');
        this.$target = $(this.target);
        
        this.init();
    };

    ModalToggle.prototype.init = function(){

        var _this = this; 

        _this.$el.on( 'click', function(e){
            e.preventDefault();

            if ( $(document.body).hasClass('ccl-modal-open') ) {
                _this.closeModal();
            } else {
                _this.showBackdrop(function(){
                    _this.showModal();
                });
            }
        });

    };

    ModalToggle.prototype.showBackdrop = function(callback){

        var backdrop = document.createElement('div');
        var $backdrop = $(backdrop);

        $backdrop.addClass('ccl-c-modal__backdrop');
        $backdrop.appendTo(document.body);
        
        CCL.reflow(backdrop);
        
        $backdrop.addClass('ccl-is-shown');

        $(document.body)
            .addClass('ccl-modal-open')
            .css( 'padding-right', CCL.SCROLLBARWIDTH );

        if ( callback ) {
            setTimeout( callback, DURATION );
        }
    };

    ModalToggle.prototype.showModal = function(){
        var _this = this;
        _this.$target.show( 0, function(){
            _this.$target.addClass('ccl-is-shown');
        });
    };

    ModalToggle.prototype.closeModal = function(){

        $('.ccl-c-modal').removeClass('ccl-is-shown');

        setTimeout( function(){
            
            $('.ccl-c-modal').hide();

            $('.ccl-c-modal__backdrop').removeClass('ccl-is-shown');

            setTimeout(function(){

                $('.ccl-c-modal__backdrop').remove();

                $(document.body)
                    .removeClass('ccl-modal-open')
                    .css( 'padding-right', '' );

            }, DURATION);

        }, DURATION ); 

    };



    $(document).ready(function(){
        $('[data-toggle="modal"]').each(function(){
            new ModalToggle(this);
        });
    });

})(this, jQuery);
/**
 * Stickies
 * 
 * Behaviour for sticky elements.
 */

( function( window, $ ) {
	'use strict';
    var document = window.document,
        $window = $(window),
        className = {
            isFixed: 'ccl-is-fixed'
        };

    var Sticky = function(el){

        // variables
        var $el = $(el),
            height = $el.outerHeight(),
            offset = $el.offset(),
            options = $el.data('sticky'),
            wrapper = $('<div class="js-sticky-wrapper"></div>').css({ height: height + 'px' });

        var defaultOptions = {
            offset: 0
        };

        options = $.extend( defaultOptions, options );

        // wrap element
        $el.wrap( wrapper );

        // scroll listener
        $window.scroll( CCL.throttle( _onScroll, 100 ) );

        // on scroll
        function _onScroll() {
            
            var scrollTop = $window.scrollTop() + options.offset;
    
            if ( scrollTop >= offset.top ) {
                $el.addClass( className.isFixed );
            } else {
                $el.removeClass( className.isFixed );
            }
    
        }

        return this;

    };

    $(document).ready(function(){
        $('.js-is-sticky').each(function(){
            new Sticky(this);
        });
    });

} )( this, jQuery );

/**
 * Toggle Schools
 * 
 * Behavior for school toggles
 */

(function (window, $) {
    'use strict';

    var document = window.document,
        initSchool = $('html').data('school');

    var SchoolSelect = function(el){
        
        this.$select = $(el);
        
        this.init();
    };

    SchoolSelect.prototype.init = function(){
        
        if ( initSchool ) {

            this.$select
                .find( 'option[value="' + initSchool + '"]' )
                .attr( 'selected', 'selected' );   

        }

        this.$select.change(function(event){
            $('html').attr(  'data-school', event.target.value );
        });
    };

    $(document).ready(function(){
        $('[data-toggle="school"]').each(function(){
            new SchoolSelect(this);
        });
    });

})(this, jQuery);
/**
 * Tooltips
 * 
 * Behavior for tooltips
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var Tooltip = function(el){
        this.$el = $(el);
        this.content = this.$el.attr('title');
        this.$tooltip = $('<div id="ccl-current-tooltip" class="ccl-c-tooltip ccl-is-top" role="tooltip">'+
                            '<div class="ccl-c-tooltip__arrow"></div>'+
                            '<div class="ccl-c-tooltip__inner">'+
                                this.content +
                            '</div>'+
                          '</div>');
        
        this.init();
    };

    Tooltip.prototype.init = function(){
        
        var _this = this;

        this.$el.hover(function(e){

            // mouseover

            _this.$el.attr('title', '');
            _this.$el.attr('aria-describedby', 'ccl-current-tooltip');
            _this.$tooltip.appendTo(document.body);

            CCL.reflow(_this.$tooltip[0]);

            var offset = _this.$el.offset(),
                width  = _this.$el.outerWidth(),
                tooltipHeight = _this.$tooltip.outerHeight();

            _this.$tooltip.css({
                top: (offset.top - tooltipHeight) + 'px',
                left: (offset.left + (width/2)) + 'px'
            });

            _this.$tooltip.addClass('ccl-is-shown');

        }, function(e){ 

            //mouseout

            _this.$el.attr('title', _this.content);
            _this.$el.attr('aria-describedby', '');
            _this.$tooltip.removeClass('ccl-is-shown');
            _this.$tooltip.remove();

        });

    };

    $(document).ready(function(){
        $('[data-toggle="tooltip"]').each(function(){
            new Tooltip(this);
        });
    });

} )( this, jQuery );

/**
 * Wayfinding
 * 
 * Controls interface for looking up call number locations
 */

( function( window, $ ) {
	'use strict';
    var document = window.document;
    
    var Tabs = function(el) {

        var _this = this;

        this.$el = $(el);
        this.$tabs = this.$el.find('.ccl-c-tab');
        this.$tabContents = $('.ccl-c-tab__content');
        

        this.$tabs.each(function(){
            var $tab = $(this);
            $tab.click(function(e){
                e.preventDefault();
                var target = $tab.data('target');
                console.log(target, _this.$tabContents);
                _this.$tabContents.removeClass('ccl-is-active');
                _this.$tabContents.filter(target).addClass('ccl-is-active');
            });
        });
    };

    var Wayfinder = function(el){
        this.$el = $(el);
        this.callNumbers = {};
        this.$input = this.$el.find('#call-num-search');
        this.$marquee = this.$el.find('.ccl-c-wayfinder__marquee');
        this.$callNum = this.$el.find('.ccl-c-wayfinder__call-num');
        this.$wing = this.$el.find('.ccl-c-wayfinder__wing');
        this.$floor = this.$el.find('.ccl-c-wayfinder__floor');
        this.$subject = this.$el.find('.ccl-c-wayfinder__subject');

        var _this = this;

        $.getJSON( CCL.assets + 'js/call-numbers.json' )
            .done(function(data){
                _this.callNumbers = data;
                _this.init();
            })
            .fail(function(err){
                console.log(err);
                this.$marquee.prepend('<div class="ccl-h3 ccl-wayfinder-error">There was an error fetching call numbers.</div>');
            })
            .always(function(){
                //
            });

        // this.init();
    };

    Wayfinder.prototype.init = function() {
        
        var _this = this,
            timeout;

        this.$input
            .keyup(function () {
                var query = $(this).val();
                
                clearTimeout(timeout);
                
                _this.$callNum.text(query);

                if ( query === "" ) {
                    _this.$marquee.hide();                    
                } else {
                    _this.$marquee.show();
                }

                timeout = setTimeout(function () {
                    if ( query !== "" ) {

                        _this.findRoom( query );

                    } else {

                        _this.$marquee.hide();
                        _this.$callNum.text('');
                        _this.$floor.text('');

                    }
                }, 600);
            })
            .keydown(function (event) {

                clearTimeout(timeout);

                _this.$floor.text('...');
                _this.reset();
            });

    };

    Wayfinder.prototype.getCallKey = function(callNum) {
        var key,
            callKeys = Object.keys(this.callNumbers);

        if ( callKeys.length === 0 ){
            return;
        }

        callKeys.forEach(function(k){
          if ( callNum >= k ) {
            key = k;
          }
        });

        return key;
    };

    Wayfinder.prototype.findRoom = function(query) {
        
        var callKey = this.getCallKey(query),
            callData = {};

        if ( ! callKey ) {
            return;
        }

        this.$el.addClass('ccl-app-active');
        $('html, body').animate({ scrollTop: $('.ccl-c-search').offset().top });
        
        callData = this.callNumbers[callKey];

        this.$floor.text( callData.floor );
        this.$wing.text( callData.wing );
        this.$subject.text( callData.subject );
        this.$el.find('a[href="#floor-1"]').addClass('ccl-is-active');
        this.$el.find('#floor-1__room-1').addClass('ccl-is-active');
        
    };

    Wayfinder.prototype.reset = function() {
        this.$el.removeClass('ccl-app-active');
        this.$el.find('a[href*="#floor-"]').removeClass('ccl-is-active');
        this.$el.find('.ccl-c-floor__room').removeClass('ccl-is-active');
    };

    $(document).ready(function(){
        $('.ccl-js-tabs').each(function(){
            new Tabs(this);
        });
        $('.ccl-js-wayfinder').each(function(){
            new Wayfinder(this);
        });
    });

} )( this, jQuery );

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkcm9wZG93bnMuanMiLCJtb2RhbHMuanMiLCJzdGlja2llcy5qcyIsInRvZ2dsZS1zY2hvb2xzLmpzIiwidG9vbHRpcHMuanMiLCJ3YXlmaW5kaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEdsb2JhbCBWYXJpYWJsZXMuIFxuICovXG5cblxuKGZ1bmN0aW9uICggJCwgd2luZG93ICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wuRFVSQVRJT04gPSAzMDA7XG5cbiAgICBDQ0wuQlJFQUtQT0lOVF9TTSA9IDUwMDtcbiAgICBDQ0wuQlJFQUtQT0lOVF9NRCA9IDc2ODtcbiAgICBDQ0wuQlJFQUtQT0lOVF9MRyA9IDEwMDA7XG4gICAgQ0NMLkJSRUFLUE9JTlRfWEwgPSAxNTAwO1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnaHRtbCcpLnRvZ2dsZUNsYXNzKCduby1qcyBqcycpO1xuICAgIH0pO1xuXG59KShqUXVlcnksIHRoaXMpOyIsIi8qKlxuICogUmVmbG93IHBhZ2UgZWxlbWVudHMuIFxuICogXG4gKiBFbmFibGVzIGFuaW1hdGlvbnMvdHJhbnNpdGlvbnMgb24gZWxlbWVudHMgYWRkZWQgdG8gdGhlIHBhZ2UgYWZ0ZXIgdGhlIERPTSBoYXMgbG9hZGVkLlxuICovXG5cblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLnJlZmxvdyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICB9O1xuXG59KSgpOyIsIi8qKlxuICogR2V0IHRoZSBTY3JvbGxiYXIgd2lkdGhcbiAqIFRoYW5rcyB0byBkYXZpZCB3YWxzaDogaHR0cHM6Ly9kYXZpZHdhbHNoLm5hbWUvZGV0ZWN0LXNjcm9sbGJhci13aWR0aFxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuICAgIFxuICAgIGZ1bmN0aW9uIGdldFNjcm9sbFdpZHRoKCkge1xuICAgICAgICBcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtZWFzdXJlbWVudCBub2RlXG4gICAgICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gcG9zaXRpb24gd2F5IHRoZSBoZWxsIG9mZiBzY3JlZW5cbiAgICAgICAgJChzY3JvbGxEaXYpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogJzEwMHB4JyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMHB4JyxcbiAgICAgICAgICAgIG92ZXJmbG93OiAnc2Nyb2xsJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAnLTk5OTlweCcsXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQoc2Nyb2xsRGl2KTtcblxuICAgICAgICAvLyBHZXQgdGhlIHNjcm9sbGJhciB3aWR0aFxuICAgICAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybihzY3JvbGxiYXJXaWR0aCk7IC8vIE1hYzogIDE1XG5cbiAgICAgICAgLy8gRGVsZXRlIHRoZSBESVYgXG4gICAgICAgICQoc2Nyb2xsRGl2KS5yZW1vdmUoKTtcblxuICAgICAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG4gICAgfVxuICAgIFxuICAgIGlmICggISB3aW5kb3cuQ0NMICkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLmdldFNjcm9sbFdpZHRoID0gZ2V0U2Nyb2xsV2lkdGg7XG4gICAgQ0NMLlNDUk9MTEJBUldJRFRIID0gZ2V0U2Nyb2xsV2lkdGgoKTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogLmRlYm91bmNlKCkgZnVuY3Rpb25cbiAqIFxuICogU291cmNlOiBodHRwczovL2Rhdmlkd2Fsc2gubmFtZS9qYXZhc2NyaXB0LWRlYm91bmNlLWZ1bmN0aW9uXG4gKi9cblxuXG4oZnVuY3Rpb24od2luZG93KSB7XG5cbiAgICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gICAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgICB2YXIgdGhyb3R0bGUgPSBmdW5jdGlvbiAoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgdGltZW91dCwgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgICAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgICAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblxuICAgICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgdGhyb3R0bGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgICAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhyb3R0bGVkLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgIHByZXZpb3VzID0gMDtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHRocm90dGxlZDtcbiAgICB9O1xuXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICB3aW5kb3cuQ0NMLnRocm90dGxlID0gdGhyb3R0bGU7XG5cbn0pKHRoaXMpOyIsIi8qKlxuICogQWNjb3JkaW9uc1xuICogXG4gKiBCZWhhdmlvciBmb3IgYWNjb3JkaW9uIGNvbXBvbmVudHNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIEFjY29yZGlvbiA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdG9nZ2xlID0gdGhpcy4kZWwuY2hpbGRyZW4oJy5jY2wtYy1hY2NvcmRpb25fX3RvZ2dsZScpO1xuICAgICAgICB0aGlzLiRjb250ZW50ID0gdGhpcy4kZWwuY2hpbGRyZW4oJy5jY2wtYy1hY2NvcmRpb25fX2NvbnRlbnQnKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEFjY29yZGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kdG9nZ2xlLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgX3RoaXMuJGNvbnRlbnQuc2xpZGVUb2dnbGUoKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC50b2dnbGVDbGFzcygnY2NsLWlzLW9wZW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1jLWFjY29yZGlvbicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBBY2NvcmRpb24odGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBBbGVydHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIGFsZXJ0c1xuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBEVVJBVElPTiA9IENDTC5EVVJBVElPTjtcblxuICAgIHZhciBBbGVydERpc21pc3MgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgJGVsID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLnRhcmdldCA9ICRlbC5wYXJlbnQoKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgQWxlcnREaXNtaXNzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7IFxuXG4gICAgICAgIF90aGlzLiRlbC5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIF90aGlzLmRpc21pc3NBbGVydCgpO1xuICAgICAgICB9KTtcblxuICAgIH07XG4gICAgXG4gICAgQWxlcnREaXNtaXNzLnByb3RvdHlwZS5kaXNtaXNzQWxlcnQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgX3RoaXMuJHRhcmdldC5hbmltYXRlKCB7IG9wYWNpdHk6IDAgfSwge1xuICAgICAgICAgICAgZHVyYXRpb246IERVUkFUSU9OLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5zbGlkZVVwKCBEVVJBVElPTiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG5cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBBbGVydERpc21pc3ModGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICogQ2Fyb3VzZWxzXG4gKiBcbiAqIEluaXRpYWxpemUgYW5kIGRlZmluZSBiZWhhdmlvciBmb3IgY2Fyb3VzZWxzLiBcbiAqIFVzZXMgdGhlIFNsaWNrIFNsaWRlcyBqUXVlcnkgcGx1Z2luIC0tPiBodHRwOi8va2Vud2hlZWxlci5naXRodWIuaW8vc2xpY2svXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBDYXJvdXNlbCA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLmdsb2JhbERlZmF1bHRzID0ge1xuICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICBkb3RzQ2xhc3M6ICdjY2wtYy1jYXJvdXNlbF9fcGFnaW5nJyxcbiAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgIH07XG5cbiAgICBDYXJvdXNlbC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuJGVsLmRhdGEoKSxcbiAgICAgICAgICAgIG9wdGlvbnMgPSBkYXRhLm9wdGlvbnMgfHwge307XG4gICAgICAgICAgICBcbiAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlID0gW107XG5cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNTbSApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9TTSwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc1NtXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc01kICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX01ELCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zTWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zTGcgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfTEcsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNMZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNYbCApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9YTCwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc1hsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCggdGhpcy5nbG9iYWxEZWZhdWx0cywgb3B0aW9ucyApO1xuXG4gICAgICAgIHZhciBjYXJvdXNlbCA9IHRoaXMuJGVsLnNsaWNrKG9wdGlvbnMpLFxuICAgICAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGNhcm91c2VsLm9uKCdiZWZvcmVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKXtcbiAgICAgICAgICAgIF90aGlzLiRlbC5maW5kKCcuc2xpY2stc2xpZGUnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXBhc3QnKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5maW5kKCcuc2xpY2stc2xpZGVbZGF0YS1zbGljay1pbmRleD1cIicrbmV4dFNsaWRlKydcIl0nKS5wcmV2QWxsKCkuYWRkQ2xhc3MoJ2NjbC1pcy1wYXN0Jyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtcHJvbW8tY2Fyb3VzZWwnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgQ2Fyb3VzZWwodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBEcm9wZG93bnNcbiAqIFxuICogSW5pdGlhbGl6ZSBhbmQgY29udHJvbCBiZWhhdmlvciBmb3IgZHJvcGRvd24gbWVudXNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgVE9HR0xFOiAnW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBBQ1RJVkU6ICdjY2wtaXMtYWN0aXZlJyxcbiAgICAgICAgICAgIE1FTlU6ICdjY2wtYy1kcm9wZG93bl9fbWVudSdcbiAgICAgICAgfTtcblxuICAgIHZhciBEcm9wZG93blRvZ2dsZSA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHBhcmVudCA9IHRoaXMuJHRvZ2dsZS5wYXJlbnQoKTtcbiAgICAgICAgXG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLiR0b2dnbGUuZGF0YSgndGFyZ2V0Jyk7XG5cbiAgICAgICAgdGhpcy4kbWVudSA9ICQoIHRhcmdldCApO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHRvZ2dsZS5jbGljayggZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgX3RoaXMudG9nZ2xlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICB2YXIgaGFzQWN0aXZlTWVudXMgPSAkKCAnLicgKyBjbGFzc05hbWUuTUVOVSArICcuJyArIGNsYXNzTmFtZS5BQ1RJVkUgKS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoIGhhc0FjdGl2ZU1lbnVzICl7XG4gICAgICAgICAgICAgICAgX2NsZWFyTWVudXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGlzQWN0aXZlID0gdGhpcy4kdG9nZ2xlLmhhc0NsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG5cbiAgICAgICAgaWYgKCBpc0FjdGl2ZSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2hvd01lbnUoKTtcblxuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuc2hvd01lbnUgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiR0b2dnbGUuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgIHRoaXMuJG1lbnUuYWRkQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgdGhpcy4kcGFyZW50LmFkZENsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5oaWRlTWVudSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgIHRoaXMuJG1lbnUucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgdGhpcy4kcGFyZW50LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9jbGVhck1lbnVzKCkge1xuICAgICAgICAkKCcuY2NsLWMtZHJvcGRvd24sIC5jY2wtYy1kcm9wZG93bl9fbWVudScpLnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgICQoIHNlbGVjdG9yLlRPR0dMRSApLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCBzZWxlY3Rvci5UT0dHTEUgKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgRHJvcGRvd25Ub2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBNb2RhbHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIG1vZGFscy4gQmFzZWQgb24gQm9vdHN0cmFwJ3MgbW9kYWxzOiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy80LjAvY29tcG9uZW50cy9tb2RhbC9cbiAqIFxuICogR2xvYmFsczpcbiAqIFNDUk9MTEJBUldJRFRIXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIERVUkFUSU9OID0gMzAwO1xuXG4gICAgdmFyIE1vZGFsVG9nZ2xlID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSAkZWwuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgIHRoaXMuJHRhcmdldCA9ICQodGhpcy50YXJnZXQpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzOyBcblxuICAgICAgICBfdGhpcy4kZWwub24oICdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAoICQoZG9jdW1lbnQuYm9keSkuaGFzQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJykgKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2xvc2VNb2RhbCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93QmFja2Ryb3AoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2hvd01vZGFsKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5zaG93QmFja2Ryb3AgPSBmdW5jdGlvbihjYWxsYmFjayl7XG5cbiAgICAgICAgdmFyIGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHZhciAkYmFja2Ryb3AgPSAkKGJhY2tkcm9wKTtcblxuICAgICAgICAkYmFja2Ryb3AuYWRkQ2xhc3MoJ2NjbC1jLW1vZGFsX19iYWNrZHJvcCcpO1xuICAgICAgICAkYmFja2Ryb3AuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG4gICAgICAgIFxuICAgICAgICBDQ0wucmVmbG93KGJhY2tkcm9wKTtcbiAgICAgICAgXG4gICAgICAgICRiYWNrZHJvcC5hZGRDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgJChkb2N1bWVudC5ib2R5KVxuICAgICAgICAgICAgLmFkZENsYXNzKCdjY2wtbW9kYWwtb3BlbicpXG4gICAgICAgICAgICAuY3NzKCAncGFkZGluZy1yaWdodCcsIENDTC5TQ1JPTExCQVJXSURUSCApO1xuXG4gICAgICAgIGlmICggY2FsbGJhY2sgKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCBjYWxsYmFjaywgRFVSQVRJT04gKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuc2hvd01vZGFsID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgX3RoaXMuJHRhcmdldC5zaG93KCAwLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5hZGRDbGFzcygnY2NsLWlzLXNob3duJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgJCgnLmNjbC1jLW1vZGFsJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbCcpLmhpZGUoKTtcblxuICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsX19iYWNrZHJvcCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsX19iYWNrZHJvcCcpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJylcbiAgICAgICAgICAgICAgICAgICAgLmNzcyggJ3BhZGRpbmctcmlnaHQnLCAnJyApO1xuXG4gICAgICAgICAgICB9LCBEVVJBVElPTik7XG5cbiAgICAgICAgfSwgRFVSQVRJT04gKTsgXG5cbiAgICB9O1xuXG5cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IE1vZGFsVG9nZ2xlKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIFN0aWNraWVzXG4gKiBcbiAqIEJlaGF2aW91ciBmb3Igc3RpY2t5IGVsZW1lbnRzLlxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgJHdpbmRvdyA9ICQod2luZG93KSxcbiAgICAgICAgY2xhc3NOYW1lID0ge1xuICAgICAgICAgICAgaXNGaXhlZDogJ2NjbC1pcy1maXhlZCdcbiAgICAgICAgfTtcblxuICAgIHZhciBTdGlja3kgPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgLy8gdmFyaWFibGVzXG4gICAgICAgIHZhciAkZWwgPSAkKGVsKSxcbiAgICAgICAgICAgIGhlaWdodCA9ICRlbC5vdXRlckhlaWdodCgpLFxuICAgICAgICAgICAgb2Zmc2V0ID0gJGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgb3B0aW9ucyA9ICRlbC5kYXRhKCdzdGlja3knKSxcbiAgICAgICAgICAgIHdyYXBwZXIgPSAkKCc8ZGl2IGNsYXNzPVwianMtc3RpY2t5LXdyYXBwZXJcIj48L2Rpdj4nKS5jc3MoeyBoZWlnaHQ6IGhlaWdodCArICdweCcgfSk7XG5cbiAgICAgICAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICAgICAgb2Zmc2V0OiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyApO1xuXG4gICAgICAgIC8vIHdyYXAgZWxlbWVudFxuICAgICAgICAkZWwud3JhcCggd3JhcHBlciApO1xuXG4gICAgICAgIC8vIHNjcm9sbCBsaXN0ZW5lclxuICAgICAgICAkd2luZG93LnNjcm9sbCggQ0NMLnRocm90dGxlKCBfb25TY3JvbGwsIDEwMCApICk7XG5cbiAgICAgICAgLy8gb24gc2Nyb2xsXG4gICAgICAgIGZ1bmN0aW9uIF9vblNjcm9sbCgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCkgKyBvcHRpb25zLm9mZnNldDtcbiAgICBcbiAgICAgICAgICAgIGlmICggc2Nyb2xsVG9wID49IG9mZnNldC50b3AgKSB7XG4gICAgICAgICAgICAgICAgJGVsLmFkZENsYXNzKCBjbGFzc05hbWUuaXNGaXhlZCApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5pc0ZpeGVkICk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtaXMtc3RpY2t5JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFN0aWNreSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFRvZ2dsZSBTY2hvb2xzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBzY2hvb2wgdG9nZ2xlc1xuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBpbml0U2Nob29sID0gJCgnaHRtbCcpLmRhdGEoJ3NjaG9vbCcpO1xuXG4gICAgdmFyIFNjaG9vbFNlbGVjdCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJHNlbGVjdCA9ICQoZWwpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIFNjaG9vbFNlbGVjdC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICBpZiAoIGluaXRTY2hvb2wgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuJHNlbGVjdFxuICAgICAgICAgICAgICAgIC5maW5kKCAnb3B0aW9uW3ZhbHVlPVwiJyArIGluaXRTY2hvb2wgKyAnXCJdJyApXG4gICAgICAgICAgICAgICAgLmF0dHIoICdzZWxlY3RlZCcsICdzZWxlY3RlZCcgKTsgICBcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kc2VsZWN0LmNoYW5nZShmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAkKCdodG1sJykuYXR0ciggICdkYXRhLXNjaG9vbCcsIGV2ZW50LnRhcmdldC52YWx1ZSApO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwic2Nob29sXCJdJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFNjaG9vbFNlbGVjdCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKHRoaXMsIGpRdWVyeSk7IiwiLyoqXG4gKiBUb29sdGlwc1xuICogXG4gKiBCZWhhdmlvciBmb3IgdG9vbHRpcHNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIFRvb2x0aXAgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuJGVsLmF0dHIoJ3RpdGxlJyk7XG4gICAgICAgIHRoaXMuJHRvb2x0aXAgPSAkKCc8ZGl2IGlkPVwiY2NsLWN1cnJlbnQtdG9vbHRpcFwiIGNsYXNzPVwiY2NsLWMtdG9vbHRpcCBjY2wtaXMtdG9wXCIgcm9sZT1cInRvb2x0aXBcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2NsLWMtdG9vbHRpcF9fYXJyb3dcIj48L2Rpdj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2NsLWMtdG9vbHRpcF9faW5uZXJcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+Jyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgVG9vbHRpcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsLmhvdmVyKGZ1bmN0aW9uKGUpe1xuXG4gICAgICAgICAgICAvLyBtb3VzZW92ZXJcblxuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ3RpdGxlJywgJycpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCAnY2NsLWN1cnJlbnQtdG9vbHRpcCcpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG5cbiAgICAgICAgICAgIENDTC5yZWZsb3coX3RoaXMuJHRvb2x0aXBbMF0pO1xuXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gX3RoaXMuJGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgICAgIHdpZHRoICA9IF90aGlzLiRlbC5vdXRlcldpZHRoKCksXG4gICAgICAgICAgICAgICAgdG9vbHRpcEhlaWdodCA9IF90aGlzLiR0b29sdGlwLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wOiAob2Zmc2V0LnRvcCAtIHRvb2x0aXBIZWlnaHQpICsgJ3B4JyxcbiAgICAgICAgICAgICAgICBsZWZ0OiAob2Zmc2V0LmxlZnQgKyAod2lkdGgvMikpICsgJ3B4J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICB9LCBmdW5jdGlvbihlKXsgXG5cbiAgICAgICAgICAgIC8vbW91c2VvdXRcblxuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ3RpdGxlJywgX3RoaXMuY29udGVudCk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cignYXJpYS1kZXNjcmliZWRieScsICcnKTtcbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLnJlbW92ZUNsYXNzKCdjY2wtaXMtc2hvd24nKTtcbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLnJlbW92ZSgpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgVG9vbHRpcCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFdheWZpbmRpbmdcbiAqIFxuICogQ29udHJvbHMgaW50ZXJmYWNlIGZvciBsb29raW5nIHVwIGNhbGwgbnVtYmVyIGxvY2F0aW9uc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcbiAgICBcbiAgICB2YXIgVGFicyA9IGZ1bmN0aW9uKGVsKSB7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiR0YWJzID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXRhYicpO1xuICAgICAgICB0aGlzLiR0YWJDb250ZW50cyA9ICQoJy5jY2wtYy10YWJfX2NvbnRlbnQnKTtcbiAgICAgICAgXG5cbiAgICAgICAgdGhpcy4kdGFicy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgJHRhYiA9ICQodGhpcyk7XG4gICAgICAgICAgICAkdGFiLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJHRhYi5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0YXJnZXQsIF90aGlzLiR0YWJDb250ZW50cyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZhciBXYXlmaW5kZXIgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuY2FsbE51bWJlcnMgPSB7fTtcbiAgICAgICAgdGhpcy4kaW5wdXQgPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW0tc2VhcmNoJyk7XG4gICAgICAgIHRoaXMuJG1hcnF1ZWUgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19tYXJxdWVlJyk7XG4gICAgICAgIHRoaXMuJGNhbGxOdW0gPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19jYWxsLW51bScpO1xuICAgICAgICB0aGlzLiR3aW5nID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fd2luZycpO1xuICAgICAgICB0aGlzLiRmbG9vciA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX2Zsb29yJyk7XG4gICAgICAgIHRoaXMuJHN1YmplY3QgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19zdWJqZWN0Jyk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAkLmdldEpTT04oIENDTC5hc3NldHMgKyAnanMvY2FsbC1udW1iZXJzLmpzb24nIClcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIF90aGlzLmNhbGxOdW1iZXJzID0gZGF0YTtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMuJG1hcnF1ZWUucHJlcGVuZCgnPGRpdiBjbGFzcz1cImNjbC1oMyBjY2wtd2F5ZmluZGVyLWVycm9yXCI+VGhlcmUgd2FzIGFuIGVycm9yIGZldGNoaW5nIGNhbGwgbnVtYmVycy48L2Rpdj4nKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIC8vIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICB0aW1lb3V0O1xuXG4gICAgICAgIHRoaXMuJGlucHV0XG4gICAgICAgICAgICAua2V5dXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBxdWVyeSA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIF90aGlzLiRjYWxsTnVtLnRleHQocXVlcnkpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBxdWVyeSA9PT0gXCJcIiApIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuaGlkZSgpOyAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBxdWVyeSAhPT0gXCJcIiApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuZmluZFJvb20oIHF1ZXJ5ICk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuJGNhbGxOdW0udGV4dCgnJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy4kZmxvb3IudGV4dCgnJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sIDYwMCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmtleWRvd24oZnVuY3Rpb24gKGV2ZW50KSB7XG5cbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG5cbiAgICAgICAgICAgICAgICBfdGhpcy4kZmxvb3IudGV4dCgnLi4uJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMucmVzZXQoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUuZ2V0Q2FsbEtleSA9IGZ1bmN0aW9uKGNhbGxOdW0pIHtcbiAgICAgICAgdmFyIGtleSxcbiAgICAgICAgICAgIGNhbGxLZXlzID0gT2JqZWN0LmtleXModGhpcy5jYWxsTnVtYmVycyk7XG5cbiAgICAgICAgaWYgKCBjYWxsS2V5cy5sZW5ndGggPT09IDAgKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxLZXlzLmZvckVhY2goZnVuY3Rpb24oayl7XG4gICAgICAgICAgaWYgKCBjYWxsTnVtID49IGsgKSB7XG4gICAgICAgICAgICBrZXkgPSBrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5maW5kUm9vbSA9IGZ1bmN0aW9uKHF1ZXJ5KSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgY2FsbEtleSA9IHRoaXMuZ2V0Q2FsbEtleShxdWVyeSksXG4gICAgICAgICAgICBjYWxsRGF0YSA9IHt9O1xuXG4gICAgICAgIGlmICggISBjYWxsS2V5ICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1hcHAtYWN0aXZlJyk7XG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKCcuY2NsLWMtc2VhcmNoJykub2Zmc2V0KCkudG9wIH0pO1xuICAgICAgICBcbiAgICAgICAgY2FsbERhdGEgPSB0aGlzLmNhbGxOdW1iZXJzW2NhbGxLZXldO1xuXG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoIGNhbGxEYXRhLmZsb29yICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggY2FsbERhdGEud2luZyApO1xuICAgICAgICB0aGlzLiRzdWJqZWN0LnRleHQoIGNhbGxEYXRhLnN1YmplY3QgKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnYVtocmVmPVwiI2Zsb29yLTFcIl0nKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjZmxvb3ItMV9fcm9vbS0xJykuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgXG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1hcHAtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJ2FbaHJlZio9XCIjZmxvb3ItXCJdJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLmNjbC1jLWZsb29yX19yb29tJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1qcy10YWJzJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFRhYnModGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuY2NsLWpzLXdheWZpbmRlcicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBXYXlmaW5kZXIodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIl19
