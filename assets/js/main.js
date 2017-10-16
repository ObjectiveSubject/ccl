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

    var AlertDismiss = function($el){
        
        this.$el = $el;
        this.target = $el.parent();
        this.$target = $(this.target);
        
        this.init();
    };

    AlertDismiss.prototype.init = function(){
        
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
        $(document).on( 'click', '[data-dismiss="alert"]', function(e){
            var dismissEl = $(e.target).closest('[data-dismiss="alert"]');
            new AlertDismiss(dismissEl);
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
 * Room Reservation
 * 
 * Handle room reservations
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var RoomResForm = function(el){
        
        this.$el = $(el);

        var _this = this;

        this.$el.submit(function(event){
            event.preventDefault();
            console.log( 'form-submitted', _this.$el.serializeArray() );
        });

    };

    // RoomResForm.prototype.onSubmit = function(){

    //     console.log('form submitted',  );

    // };

    $(document).ready(function(){
        $('.js-room-res-form').each(function(){
            new RoomResForm(this);
        });
    });

} )( this, jQuery );

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
    var document = window.document,
        tabs, wayfinder;
    
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
                // _this.$tabContents.removeClass('ccl-is-active');
                // _this.$tabContents.filter(target).addClass('ccl-is-active');
                _this.setActive(target);
            });
        });

        return this;
    };

    Tabs.prototype.setActive = function(target){
        this.$tabs.removeClass('ccl-is-active');
        this.$tabs.filter('[href="'+target+'"]').addClass('ccl-is-active');
        this.$tabContents.removeClass('ccl-is-active');
        this.$tabContents.filter(target).addClass('ccl-is-active');
    };

    var Wayfinder = function(el){
        this.$el = $(el);
        this.callNumbers = {};
        this.$form = this.$el.find('#call-number-search');
        this.$input = this.$el.find('#call-num-input');
        this.$submit = this.$el.find('#call-num-submit');
        this.$marquee = this.$el.find('.ccl-c-wayfinder__marquee');
        this.$callNum = this.$el.find('.ccl-c-wayfinder__call-num');
        this.$wing = this.$el.find('.ccl-c-wayfinder__wing');
        this.$floor = this.$el.find('.ccl-c-wayfinder__floor');
        this.$subject = this.$el.find('.ccl-c-wayfinder__subject');
        this.error = {
            get: '<div class="ccl-c-alert ccl-is-error ccl-wayfinder__error"><button type="button" class="ccl-b-close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><i class="ccl-b-icon-alert" aria-hidden="true"></i> There was an error fetching call numbers.</div>',
            find: '<div class="ccl-c-alert ccl-is-error ccl-wayfinder__error"><button type="button" class="ccl-b-close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><i class="ccl-b-icon-alert" aria-hidden="true"></i> Could not find that call number. Please try again.</div>'
        };
        this.$errorBox = $('.ccl-error-box');

        var _this = this;

        $.getJSON( CCL.assets + 'js/call-numbers.json' )
            .done(function(data){
                _this.callNumbers = data;
                _this.init();
            })
            .fail(function(err){
                console.log(err);
                this.$errorBox.append( this.error.get );
            });

        return this;
    };

    Wayfinder.prototype.init = function() {
        
        var _this = this;

        this.$el.addClass('ccl-app-active');

        this.$input
            .keyup(function () {
                var query = $(this).val();
                
                if ( query === "" ) {
                    _this.$submit.attr('disabled', true);
                    _this.$marquee.hide();
                    _this.reset();                
                } else {
                    _this.$submit.attr('disabled', false);
                }

            });

        this.$form.submit(function(e){
            e.preventDefault();

            var query = _this.$input.val();

            $('.ccl-wayfinder__error').remove();
            _this.$marquee.show();
            _this.$callNum.text(query);
            _this.findRoom( query );
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

        query = query.toUpperCase();
        
        var callKey = this.getCallKey(query),
            callData = {},
            room;

        if ( ! callKey ) {
            this.throwFindError();
            return;
        }

        $('html, body').animate({ scrollTop: $('.ccl-c-search').offset().top });
        
        callData = this.callNumbers[callKey];

        this.$floor.text( callData.floor );
        this.$wing.text( callData.wing );
        this.$subject.text( callData.subject );

        /* TODO:
         * set ACTUAL room, not just the floor. still waiting on client 
         * to provide data for which call numbers belong to which rooms
         * ----------------------------------------------------------------- */

        room = callData.floor_int;

        /* ----------------------------------------------------------------- */

        this.$el.find('a[href="#floor-'+room+'"]').addClass('ccl-is-active');
        this.$el.find('#room-'+room+'-1').addClass('ccl-is-active');

        tabs.setActive( '#floor-' + room );
        
    };

    Wayfinder.prototype.reset = function() {
        this.$el.find('a[href*="#floor-"]').removeClass('ccl-is-active');
        this.$el.find('.ccl-c-floor__room').removeClass('ccl-is-active');
    };

    Wayfinder.prototype.throwFindError = function(){
        this.$el.find('a[href*="#floor-"]').removeClass('ccl-is-active');
        this.$el.find('.ccl-c-floor__room').removeClass('ccl-is-active');
        this.$floor.text( '' );
        this.$wing.text( '' );
        this.$subject.text( '' );
        this.$errorBox.append( this.error.find );
    };

    $(document).ready(function(){
        $('.ccl-js-tabs').each(function(){
            tabs = new Tabs(this);
        });
        $('.ccl-js-wayfinder').each(function(){
            wayfinder = new Wayfinder(this);
        });
    });

} )( this, jQuery );

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkcm9wZG93bnMuanMiLCJtb2RhbHMuanMiLCJyb29tLXJlcy5qcyIsInN0aWNraWVzLmpzIiwidG9nZ2xlLXNjaG9vbHMuanMiLCJ0b29sdGlwcy5qcyIsIndheWZpbmRpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEdsb2JhbCBWYXJpYWJsZXMuIFxuICovXG5cblxuKGZ1bmN0aW9uICggJCwgd2luZG93ICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wuRFVSQVRJT04gPSAzMDA7XG5cbiAgICBDQ0wuQlJFQUtQT0lOVF9TTSA9IDUwMDtcbiAgICBDQ0wuQlJFQUtQT0lOVF9NRCA9IDc2ODtcbiAgICBDQ0wuQlJFQUtQT0lOVF9MRyA9IDEwMDA7XG4gICAgQ0NMLkJSRUFLUE9JTlRfWEwgPSAxNTAwO1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnaHRtbCcpLnRvZ2dsZUNsYXNzKCduby1qcyBqcycpO1xuICAgIH0pO1xuXG59KShqUXVlcnksIHRoaXMpOyIsIi8qKlxuICogUmVmbG93IHBhZ2UgZWxlbWVudHMuIFxuICogXG4gKiBFbmFibGVzIGFuaW1hdGlvbnMvdHJhbnNpdGlvbnMgb24gZWxlbWVudHMgYWRkZWQgdG8gdGhlIHBhZ2UgYWZ0ZXIgdGhlIERPTSBoYXMgbG9hZGVkLlxuICovXG5cblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLnJlZmxvdyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICB9O1xuXG59KSgpOyIsIi8qKlxuICogR2V0IHRoZSBTY3JvbGxiYXIgd2lkdGhcbiAqIFRoYW5rcyB0byBkYXZpZCB3YWxzaDogaHR0cHM6Ly9kYXZpZHdhbHNoLm5hbWUvZGV0ZWN0LXNjcm9sbGJhci13aWR0aFxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuICAgIFxuICAgIGZ1bmN0aW9uIGdldFNjcm9sbFdpZHRoKCkge1xuICAgICAgICBcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtZWFzdXJlbWVudCBub2RlXG4gICAgICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gcG9zaXRpb24gd2F5IHRoZSBoZWxsIG9mZiBzY3JlZW5cbiAgICAgICAgJChzY3JvbGxEaXYpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogJzEwMHB4JyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMHB4JyxcbiAgICAgICAgICAgIG92ZXJmbG93OiAnc2Nyb2xsJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAnLTk5OTlweCcsXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQoc2Nyb2xsRGl2KTtcblxuICAgICAgICAvLyBHZXQgdGhlIHNjcm9sbGJhciB3aWR0aFxuICAgICAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybihzY3JvbGxiYXJXaWR0aCk7IC8vIE1hYzogIDE1XG5cbiAgICAgICAgLy8gRGVsZXRlIHRoZSBESVYgXG4gICAgICAgICQoc2Nyb2xsRGl2KS5yZW1vdmUoKTtcblxuICAgICAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG4gICAgfVxuICAgIFxuICAgIGlmICggISB3aW5kb3cuQ0NMICkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLmdldFNjcm9sbFdpZHRoID0gZ2V0U2Nyb2xsV2lkdGg7XG4gICAgQ0NMLlNDUk9MTEJBUldJRFRIID0gZ2V0U2Nyb2xsV2lkdGgoKTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogLmRlYm91bmNlKCkgZnVuY3Rpb25cbiAqIFxuICogU291cmNlOiBodHRwczovL2Rhdmlkd2Fsc2gubmFtZS9qYXZhc2NyaXB0LWRlYm91bmNlLWZ1bmN0aW9uXG4gKi9cblxuXG4oZnVuY3Rpb24od2luZG93KSB7XG5cbiAgICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gICAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgICB2YXIgdGhyb3R0bGUgPSBmdW5jdGlvbiAoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgdGltZW91dCwgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgICAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgICAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblxuICAgICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgdGhyb3R0bGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgICAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhyb3R0bGVkLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgIHByZXZpb3VzID0gMDtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHRocm90dGxlZDtcbiAgICB9O1xuXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICB3aW5kb3cuQ0NMLnRocm90dGxlID0gdGhyb3R0bGU7XG5cbn0pKHRoaXMpOyIsIi8qKlxuICogQWNjb3JkaW9uc1xuICogXG4gKiBCZWhhdmlvciBmb3IgYWNjb3JkaW9uIGNvbXBvbmVudHNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIEFjY29yZGlvbiA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdG9nZ2xlID0gdGhpcy4kZWwuY2hpbGRyZW4oJy5jY2wtYy1hY2NvcmRpb25fX3RvZ2dsZScpO1xuICAgICAgICB0aGlzLiRjb250ZW50ID0gdGhpcy4kZWwuY2hpbGRyZW4oJy5jY2wtYy1hY2NvcmRpb25fX2NvbnRlbnQnKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEFjY29yZGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kdG9nZ2xlLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgX3RoaXMuJGNvbnRlbnQuc2xpZGVUb2dnbGUoKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC50b2dnbGVDbGFzcygnY2NsLWlzLW9wZW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1jLWFjY29yZGlvbicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBBY2NvcmRpb24odGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBBbGVydHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIGFsZXJ0c1xuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBEVVJBVElPTiA9IENDTC5EVVJBVElPTjtcblxuICAgIHZhciBBbGVydERpc21pc3MgPSBmdW5jdGlvbigkZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gJGVsLnBhcmVudCgpO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBBbGVydERpc21pc3MucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIF90aGlzLiR0YXJnZXQuYW5pbWF0ZSggeyBvcGFjaXR5OiAwIH0sIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiBEVVJBVElPTixcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF90aGlzLiR0YXJnZXQuc2xpZGVVcCggRFVSQVRJT04sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiR0YXJnZXQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuXG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKGRvY3VtZW50KS5vbiggJ2NsaWNrJywgJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXScsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgdmFyIGRpc21pc3NFbCA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXScpO1xuICAgICAgICAgICAgbmV3IEFsZXJ0RGlzbWlzcyhkaXNtaXNzRWwpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIENhcm91c2Vsc1xuICogXG4gKiBJbml0aWFsaXplIGFuZCBkZWZpbmUgYmVoYXZpb3IgZm9yIGNhcm91c2Vscy4gXG4gKiBVc2VzIHRoZSBTbGljayBTbGlkZXMgalF1ZXJ5IHBsdWdpbiAtLT4gaHR0cDovL2tlbndoZWVsZXIuZ2l0aHViLmlvL3NsaWNrL1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgQ2Fyb3VzZWwgPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5nbG9iYWxEZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgZG90c0NsYXNzOiAnY2NsLWMtY2Fyb3VzZWxfX3BhZ2luZycsXG4gICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB9O1xuXG4gICAgQ2Fyb3VzZWwucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLiRlbC5kYXRhKCksXG4gICAgICAgICAgICBvcHRpb25zID0gZGF0YS5vcHRpb25zIHx8IHt9O1xuICAgICAgICAgICAgXG4gICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZSA9IFtdO1xuXG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zU20gKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfU00sIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNTbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNNZCApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9NRCwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc01kXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc0xnICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX0xHLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zTGdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zWGwgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfWEwsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNYbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoIHRoaXMuZ2xvYmFsRGVmYXVsdHMsIG9wdGlvbnMgKTtcblxuICAgICAgICB2YXIgY2Fyb3VzZWwgPSB0aGlzLiRlbC5zbGljayhvcHRpb25zKSxcbiAgICAgICAgICAgIF90aGlzID0gdGhpcztcblxuICAgICAgICBjYXJvdXNlbC5vbignYmVmb3JlQ2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSl7XG4gICAgICAgICAgICBfdGhpcy4kZWwuZmluZCgnLnNsaWNrLXNsaWRlJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1wYXN0Jyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuZmluZCgnLnNsaWNrLXNsaWRlW2RhdGEtc2xpY2staW5kZXg9XCInK25leHRTbGlkZSsnXCJdJykucHJldkFsbCgpLmFkZENsYXNzKCdjY2wtaXMtcGFzdCcpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmpzLXByb21vLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IENhcm91c2VsKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogRHJvcGRvd25zXG4gKiBcbiAqIEluaXRpYWxpemUgYW5kIGNvbnRyb2wgYmVoYXZpb3IgZm9yIGRyb3Bkb3duIG1lbnVzXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgIFRPR0dMRTogJ1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJyxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lID0ge1xuICAgICAgICAgICAgQUNUSVZFOiAnY2NsLWlzLWFjdGl2ZScsXG4gICAgICAgICAgICBNRU5VOiAnY2NsLWMtZHJvcGRvd25fX21lbnUnXG4gICAgICAgIH07XG5cbiAgICB2YXIgRHJvcGRvd25Ub2dnbGUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZSA9ICQoZWwpO1xuICAgICAgICB0aGlzLiRwYXJlbnQgPSB0aGlzLiR0b2dnbGUucGFyZW50KCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy4kdG9nZ2xlLmRhdGEoJ3RhcmdldCcpO1xuXG4gICAgICAgIHRoaXMuJG1lbnUgPSAkKCB0YXJnZXQgKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiR0b2dnbGUuY2xpY2soIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIF90aGlzLnRvZ2dsZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgdmFyIGhhc0FjdGl2ZU1lbnVzID0gJCggJy4nICsgY2xhc3NOYW1lLk1FTlUgKyAnLicgKyBjbGFzc05hbWUuQUNUSVZFICkubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKCBoYXNBY3RpdmVNZW51cyApe1xuICAgICAgICAgICAgICAgIF9jbGVhck1lbnVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBpc0FjdGl2ZSA9IHRoaXMuJHRvZ2dsZS5oYXNDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuXG4gICAgICAgIGlmICggaXNBY3RpdmUgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNob3dNZW51KCk7XG5cbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLnNob3dNZW51ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB0aGlzLiRtZW51LmFkZENsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgIHRoaXMuJHBhcmVudC5hZGRDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuaGlkZU1lbnUgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiR0b2dnbGUuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICB0aGlzLiRtZW51LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgIHRoaXMuJHBhcmVudC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBfY2xlYXJNZW51cygpIHtcbiAgICAgICAgJCgnLmNjbC1jLWRyb3Bkb3duLCAuY2NsLWMtZHJvcGRvd25fX21lbnUnKS5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICAkKCBzZWxlY3Rvci5UT0dHTEUgKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCggc2VsZWN0b3IuVE9HR0xFICkuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IERyb3Bkb3duVG9nZ2xlKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogTW9kYWxzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBtb2RhbHMuIEJhc2VkIG9uIEJvb3RzdHJhcCdzIG1vZGFsczogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvNC4wL2NvbXBvbmVudHMvbW9kYWwvXG4gKiBcbiAqIEdsb2JhbHM6XG4gKiBTQ1JPTExCQVJXSURUSFxuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBEVVJBVElPTiA9IDMwMDtcblxuICAgIHZhciBNb2RhbFRvZ2dsZSA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgXG4gICAgICAgIHZhciAkZWwgPSAkKGVsKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gJGVsLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpczsgXG5cbiAgICAgICAgX3RoaXMuJGVsLm9uKCAnY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKCAkKGRvY3VtZW50LmJvZHkpLmhhc0NsYXNzKCdjY2wtbW9kYWwtb3BlbicpICkge1xuICAgICAgICAgICAgICAgIF90aGlzLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0JhY2tkcm9wKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnNob3dNb2RhbCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuc2hvd0JhY2tkcm9wID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuXG4gICAgICAgIHZhciBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB2YXIgJGJhY2tkcm9wID0gJChiYWNrZHJvcCk7XG5cbiAgICAgICAgJGJhY2tkcm9wLmFkZENsYXNzKCdjY2wtYy1tb2RhbF9fYmFja2Ryb3AnKTtcbiAgICAgICAgJGJhY2tkcm9wLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuICAgICAgICBcbiAgICAgICAgQ0NMLnJlZmxvdyhiYWNrZHJvcCk7XG4gICAgICAgIFxuICAgICAgICAkYmFja2Ryb3AuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgICQoZG9jdW1lbnQuYm9keSlcbiAgICAgICAgICAgIC5hZGRDbGFzcygnY2NsLW1vZGFsLW9wZW4nKVxuICAgICAgICAgICAgLmNzcyggJ3BhZGRpbmctcmlnaHQnLCBDQ0wuU0NST0xMQkFSV0lEVEggKTtcblxuICAgICAgICBpZiAoIGNhbGxiYWNrICkge1xuICAgICAgICAgICAgc2V0VGltZW91dCggY2FsbGJhY2ssIERVUkFUSU9OICk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLnNob3dNb2RhbCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIF90aGlzLiR0YXJnZXQuc2hvdyggMCwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIF90aGlzLiR0YXJnZXQuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICQoJy5jY2wtYy1tb2RhbCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWwnKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbF9fYmFja2Ryb3AnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbF9fYmFja2Ryb3AnKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuYm9keSlcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtbW9kYWwtb3BlbicpXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoICdwYWRkaW5nLXJpZ2h0JywgJycgKTtcblxuICAgICAgICAgICAgfSwgRFVSQVRJT04pO1xuXG4gICAgICAgIH0sIERVUkFUSU9OICk7IFxuXG4gICAgfTtcblxuXG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBNb2RhbFRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKHRoaXMsIGpRdWVyeSk7IiwiLyoqXG4gKiBSb29tIFJlc2VydmF0aW9uXG4gKiBcbiAqIEhhbmRsZSByb29tIHJlc2VydmF0aW9uc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgUm9vbVJlc0Zvcm0gPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuc3VibWl0KGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJ2Zvcm0tc3VibWl0dGVkJywgX3RoaXMuJGVsLnNlcmlhbGl6ZUFycmF5KCkgKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgLy8gUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uU3VibWl0ID0gZnVuY3Rpb24oKXtcblxuICAgIC8vICAgICBjb25zb2xlLmxvZygnZm9ybSBzdWJtaXR0ZWQnLCAgKTtcblxuICAgIC8vIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtcm9vbS1yZXMtZm9ybScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBSb29tUmVzRm9ybSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFN0aWNraWVzXG4gKiBcbiAqIEJlaGF2aW91ciBmb3Igc3RpY2t5IGVsZW1lbnRzLlxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgJHdpbmRvdyA9ICQod2luZG93KSxcbiAgICAgICAgY2xhc3NOYW1lID0ge1xuICAgICAgICAgICAgaXNGaXhlZDogJ2NjbC1pcy1maXhlZCdcbiAgICAgICAgfTtcblxuICAgIHZhciBTdGlja3kgPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgLy8gdmFyaWFibGVzXG4gICAgICAgIHZhciAkZWwgPSAkKGVsKSxcbiAgICAgICAgICAgIGhlaWdodCA9ICRlbC5vdXRlckhlaWdodCgpLFxuICAgICAgICAgICAgb2Zmc2V0ID0gJGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgb3B0aW9ucyA9ICRlbC5kYXRhKCdzdGlja3knKSxcbiAgICAgICAgICAgIHdyYXBwZXIgPSAkKCc8ZGl2IGNsYXNzPVwianMtc3RpY2t5LXdyYXBwZXJcIj48L2Rpdj4nKS5jc3MoeyBoZWlnaHQ6IGhlaWdodCArICdweCcgfSk7XG5cbiAgICAgICAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICAgICAgb2Zmc2V0OiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyApO1xuXG4gICAgICAgIC8vIHdyYXAgZWxlbWVudFxuICAgICAgICAkZWwud3JhcCggd3JhcHBlciApO1xuXG4gICAgICAgIC8vIHNjcm9sbCBsaXN0ZW5lclxuICAgICAgICAkd2luZG93LnNjcm9sbCggQ0NMLnRocm90dGxlKCBfb25TY3JvbGwsIDEwMCApICk7XG5cbiAgICAgICAgLy8gb24gc2Nyb2xsXG4gICAgICAgIGZ1bmN0aW9uIF9vblNjcm9sbCgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCkgKyBvcHRpb25zLm9mZnNldDtcbiAgICBcbiAgICAgICAgICAgIGlmICggc2Nyb2xsVG9wID49IG9mZnNldC50b3AgKSB7XG4gICAgICAgICAgICAgICAgJGVsLmFkZENsYXNzKCBjbGFzc05hbWUuaXNGaXhlZCApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5pc0ZpeGVkICk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtaXMtc3RpY2t5JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFN0aWNreSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFRvZ2dsZSBTY2hvb2xzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBzY2hvb2wgdG9nZ2xlc1xuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBpbml0U2Nob29sID0gJCgnaHRtbCcpLmRhdGEoJ3NjaG9vbCcpO1xuXG4gICAgdmFyIFNjaG9vbFNlbGVjdCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJHNlbGVjdCA9ICQoZWwpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIFNjaG9vbFNlbGVjdC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICBpZiAoIGluaXRTY2hvb2wgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuJHNlbGVjdFxuICAgICAgICAgICAgICAgIC5maW5kKCAnb3B0aW9uW3ZhbHVlPVwiJyArIGluaXRTY2hvb2wgKyAnXCJdJyApXG4gICAgICAgICAgICAgICAgLmF0dHIoICdzZWxlY3RlZCcsICdzZWxlY3RlZCcgKTsgICBcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kc2VsZWN0LmNoYW5nZShmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAkKCdodG1sJykuYXR0ciggICdkYXRhLXNjaG9vbCcsIGV2ZW50LnRhcmdldC52YWx1ZSApO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwic2Nob29sXCJdJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFNjaG9vbFNlbGVjdCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKHRoaXMsIGpRdWVyeSk7IiwiLyoqXG4gKiBUb29sdGlwc1xuICogXG4gKiBCZWhhdmlvciBmb3IgdG9vbHRpcHNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIFRvb2x0aXAgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuJGVsLmF0dHIoJ3RpdGxlJyk7XG4gICAgICAgIHRoaXMuJHRvb2x0aXAgPSAkKCc8ZGl2IGlkPVwiY2NsLWN1cnJlbnQtdG9vbHRpcFwiIGNsYXNzPVwiY2NsLWMtdG9vbHRpcCBjY2wtaXMtdG9wXCIgcm9sZT1cInRvb2x0aXBcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2NsLWMtdG9vbHRpcF9fYXJyb3dcIj48L2Rpdj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2NsLWMtdG9vbHRpcF9faW5uZXJcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+Jyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgVG9vbHRpcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsLmhvdmVyKGZ1bmN0aW9uKGUpe1xuXG4gICAgICAgICAgICAvLyBtb3VzZW92ZXJcblxuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ3RpdGxlJywgJycpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCAnY2NsLWN1cnJlbnQtdG9vbHRpcCcpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG5cbiAgICAgICAgICAgIENDTC5yZWZsb3coX3RoaXMuJHRvb2x0aXBbMF0pO1xuXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gX3RoaXMuJGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgICAgIHdpZHRoICA9IF90aGlzLiRlbC5vdXRlcldpZHRoKCksXG4gICAgICAgICAgICAgICAgdG9vbHRpcEhlaWdodCA9IF90aGlzLiR0b29sdGlwLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wOiAob2Zmc2V0LnRvcCAtIHRvb2x0aXBIZWlnaHQpICsgJ3B4JyxcbiAgICAgICAgICAgICAgICBsZWZ0OiAob2Zmc2V0LmxlZnQgKyAod2lkdGgvMikpICsgJ3B4J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICB9LCBmdW5jdGlvbihlKXsgXG5cbiAgICAgICAgICAgIC8vbW91c2VvdXRcblxuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ3RpdGxlJywgX3RoaXMuY29udGVudCk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cignYXJpYS1kZXNjcmliZWRieScsICcnKTtcbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLnJlbW92ZUNsYXNzKCdjY2wtaXMtc2hvd24nKTtcbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLnJlbW92ZSgpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgVG9vbHRpcCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFdheWZpbmRpbmdcbiAqIFxuICogQ29udHJvbHMgaW50ZXJmYWNlIGZvciBsb29raW5nIHVwIGNhbGwgbnVtYmVyIGxvY2F0aW9uc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgdGFicywgd2F5ZmluZGVyO1xuICAgIFxuICAgIHZhciBUYWJzID0gZnVuY3Rpb24oZWwpIHtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHRhYnMgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtdGFiJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzID0gJCgnLmNjbC1jLXRhYl9fY29udGVudCcpO1xuICAgICAgICBcblxuICAgICAgICB0aGlzLiR0YWJzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciAkdGFiID0gJCh0aGlzKTtcbiAgICAgICAgICAgICR0YWIuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkdGFiLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICAgICAgICAgIC8vIF90aGlzLiR0YWJDb250ZW50cy5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIC8vIF90aGlzLiR0YWJDb250ZW50cy5maWx0ZXIodGFyZ2V0KS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIF90aGlzLnNldEFjdGl2ZSh0YXJnZXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBUYWJzLnByb3RvdHlwZS5zZXRBY3RpdmUgPSBmdW5jdGlvbih0YXJnZXQpe1xuICAgICAgICB0aGlzLiR0YWJzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYnMuZmlsdGVyKCdbaHJlZj1cIicrdGFyZ2V0KydcIl0nKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiR0YWJDb250ZW50cy5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiR0YWJDb250ZW50cy5maWx0ZXIodGFyZ2V0KS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgIH07XG5cbiAgICB2YXIgV2F5ZmluZGVyID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLmNhbGxOdW1iZXJzID0ge307XG4gICAgICAgIHRoaXMuJGZvcm0gPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW1iZXItc2VhcmNoJyk7XG4gICAgICAgIHRoaXMuJGlucHV0ID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtLWlucHV0Jyk7XG4gICAgICAgIHRoaXMuJHN1Ym1pdCA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bS1zdWJtaXQnKTtcbiAgICAgICAgdGhpcy4kbWFycXVlZSA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX21hcnF1ZWUnKTtcbiAgICAgICAgdGhpcy4kY2FsbE51bSA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX2NhbGwtbnVtJyk7XG4gICAgICAgIHRoaXMuJHdpbmcgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX193aW5nJyk7XG4gICAgICAgIHRoaXMuJGZsb29yID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fZmxvb3InKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdCA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX3N1YmplY3QnKTtcbiAgICAgICAgdGhpcy5lcnJvciA9IHtcbiAgICAgICAgICAgIGdldDogJzxkaXYgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3IgY2NsLXdheWZpbmRlcl9fZXJyb3JcIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNjbC1iLWNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj48aSBjbGFzcz1cImNjbC1iLWljb24tYWxlcnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IFRoZXJlIHdhcyBhbiBlcnJvciBmZXRjaGluZyBjYWxsIG51bWJlcnMuPC9kaXY+JyxcbiAgICAgICAgICAgIGZpbmQ6ICc8ZGl2IGNsYXNzPVwiY2NsLWMtYWxlcnQgY2NsLWlzLWVycm9yIGNjbC13YXlmaW5kZXJfX2Vycm9yXCI+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjY2wtYi1jbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+PC9idXR0b24+PGkgY2xhc3M9XCJjY2wtYi1pY29uLWFsZXJ0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBDb3VsZCBub3QgZmluZCB0aGF0IGNhbGwgbnVtYmVyLiBQbGVhc2UgdHJ5IGFnYWluLjwvZGl2PidcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy4kZXJyb3JCb3ggPSAkKCcuY2NsLWVycm9yLWJveCcpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgJC5nZXRKU09OKCBDQ0wuYXNzZXRzICsgJ2pzL2NhbGwtbnVtYmVycy5qc29uJyApXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBfdGhpcy5jYWxsTnVtYmVycyA9IGRhdGE7XG4gICAgICAgICAgICAgICAgX3RoaXMuaW5pdCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRlcnJvckJveC5hcHBlbmQoIHRoaXMuZXJyb3IuZ2V0ICk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjY2wtYXBwLWFjdGl2ZScpO1xuXG4gICAgICAgIHRoaXMuJGlucHV0XG4gICAgICAgICAgICAua2V5dXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBxdWVyeSA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCBxdWVyeSA9PT0gXCJcIiApIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kbWFycXVlZS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJlc2V0KCk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRzdWJtaXQuYXR0cignZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRmb3JtLnN1Ym1pdChmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gX3RoaXMuJGlucHV0LnZhbCgpO1xuXG4gICAgICAgICAgICAkKCcuY2NsLXdheWZpbmRlcl9fZXJyb3InKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIF90aGlzLiRtYXJxdWVlLnNob3coKTtcbiAgICAgICAgICAgIF90aGlzLiRjYWxsTnVtLnRleHQocXVlcnkpO1xuICAgICAgICAgICAgX3RoaXMuZmluZFJvb20oIHF1ZXJ5ICk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUuZ2V0Q2FsbEtleSA9IGZ1bmN0aW9uKGNhbGxOdW0pIHtcbiAgICAgICAgdmFyIGtleSxcbiAgICAgICAgICAgIGNhbGxLZXlzID0gT2JqZWN0LmtleXModGhpcy5jYWxsTnVtYmVycyk7XG5cbiAgICAgICAgaWYgKCBjYWxsS2V5cy5sZW5ndGggPT09IDAgKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxLZXlzLmZvckVhY2goZnVuY3Rpb24oayl7XG4gICAgICAgICAgaWYgKCBjYWxsTnVtID49IGsgKSB7XG4gICAgICAgICAgICBrZXkgPSBrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5maW5kUm9vbSA9IGZ1bmN0aW9uKHF1ZXJ5KSB7XG5cbiAgICAgICAgcXVlcnkgPSBxdWVyeS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBcbiAgICAgICAgdmFyIGNhbGxLZXkgPSB0aGlzLmdldENhbGxLZXkocXVlcnkpLFxuICAgICAgICAgICAgY2FsbERhdGEgPSB7fSxcbiAgICAgICAgICAgIHJvb207XG5cbiAgICAgICAgaWYgKCAhIGNhbGxLZXkgKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93RmluZEVycm9yKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCgnLmNjbC1jLXNlYXJjaCcpLm9mZnNldCgpLnRvcCB9KTtcbiAgICAgICAgXG4gICAgICAgIGNhbGxEYXRhID0gdGhpcy5jYWxsTnVtYmVyc1tjYWxsS2V5XTtcblxuICAgICAgICB0aGlzLiRmbG9vci50ZXh0KCBjYWxsRGF0YS5mbG9vciApO1xuICAgICAgICB0aGlzLiR3aW5nLnRleHQoIGNhbGxEYXRhLndpbmcgKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdC50ZXh0KCBjYWxsRGF0YS5zdWJqZWN0ICk7XG5cbiAgICAgICAgLyogVE9ETzpcbiAgICAgICAgICogc2V0IEFDVFVBTCByb29tLCBub3QganVzdCB0aGUgZmxvb3IuIHN0aWxsIHdhaXRpbmcgb24gY2xpZW50IFxuICAgICAgICAgKiB0byBwcm92aWRlIGRhdGEgZm9yIHdoaWNoIGNhbGwgbnVtYmVycyBiZWxvbmcgdG8gd2hpY2ggcm9vbXNcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgICAgICByb29tID0gY2FsbERhdGEuZmxvb3JfaW50O1xuXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiAgICAgICAgdGhpcy4kZWwuZmluZCgnYVtocmVmPVwiI2Zsb29yLScrcm9vbSsnXCJdJykuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI3Jvb20tJytyb29tKyctMScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgdGFicy5zZXRBY3RpdmUoICcjZmxvb3ItJyArIHJvb20gKTtcbiAgICAgICAgXG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnYVtocmVmKj1cIiNmbG9vci1cIl0nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuY2NsLWMtZmxvb3JfX3Jvb20nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLnRocm93RmluZEVycm9yID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnYVtocmVmKj1cIiNmbG9vci1cIl0nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuY2NsLWMtZmxvb3JfX3Jvb20nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRmbG9vci50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiR3aW5nLnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJHN1YmplY3QudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kZXJyb3JCb3guYXBwZW5kKCB0aGlzLmVycm9yLmZpbmQgKTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1qcy10YWJzJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGFicyA9IG5ldyBUYWJzKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmNjbC1qcy13YXlmaW5kZXInKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB3YXlmaW5kZXIgPSBuZXcgV2F5ZmluZGVyKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiJdfQ==
