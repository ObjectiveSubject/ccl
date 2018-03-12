/*! CCL - v0.1.0
 * http://github.com/ObjectiveSubject/ccl
 * Copyright (c) 2018; * Licensed GPLv2+ */

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
            CONTENT: 'ccl-c-dropdown__content'
        };

    var DropdownToggle = function(el){
        this.$toggle = $(el);
        this.$parent = this.$toggle.parent();
        
        var target = this.$toggle.data('target');

        this.$content = $( target );
        
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
            var hasActiveMenus = $( '.' + className.CONTENT + '.' + className.ACTIVE ).length;
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

        this.showContent();

    };

    DropdownToggle.prototype.showContent = function(){
        this.$toggle.attr('aria-expanded', 'true');
        this.$content.addClass( className.ACTIVE );
        this.$parent.addClass( className.ACTIVE );
    };

    DropdownToggle.prototype.hideMenu = function(){
        this.$toggle.attr('aria-expanded', 'false');
        this.$content.removeClass( className.ACTIVE );
        this.$parent.removeClass( className.ACTIVE );
    };

    function _clearMenus() {
        $('.ccl-c-dropdown, .ccl-c-dropdown__content').removeClass( className.ACTIVE );
        $( selector.TOGGLE ).attr('aria-expanded', 'false');
    }

    $(document).ready(function(){
        $( selector.TOGGLE ).each(function(){
            new DropdownToggle(this);
        });
    });

} )( this, jQuery );

/**
 * Header Menu Toggles
 * 
 * Controls behavior of menu toggles in the header
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var HeaderMenuToggle = function(el){
        
        this.$el = $(el);
        this.target = this.$el.data('target');
        this.$target = $(this.target);
        this.$parentMenu = this.$el.closest('.ccl-c-menu');
        this.$closeIcon = $('<i class="ccl-b-icon close" aria-hidden="true"></i>');

        this.init();
    };

    HeaderMenuToggle.prototype.init = function(){
        
        var that = this;

        this.$el.click(function(event){

            event.preventDefault();

            // if the target is already open
            if ( that.$target.hasClass('ccl-is-active') ) {

                // close target and remove active classes/elements
                that.$parentMenu.removeClass('ccl-has-active-item');
                that.$el.removeClass('ccl-is-active');
                that.$target.removeClass('ccl-is-active').fadeOut(CCL.DURATION);
                that.$closeIcon.remove();       

            } 

            // target is not open
            else {

                // close and reset all active menus
                $('.ccl-c-menu.ccl-has-active-item').each(function(){
                    $(this)
                        .removeClass('ccl-has-active-item')
                        .find('a.ccl-is-active').removeClass('ccl-is-active')
                        .find('.ccl-b-icon.close').remove();
                });
                
                // close and reset all active sub-menu containers
                $('.ccl-c-sub-menu-container.ccl-is-active').each(function(){
                    $(this).removeClass('ccl-is-active').fadeOut(CCL.DURATION);
                });

                // activate the selected target
                that.$parentMenu.addClass('ccl-has-active-item');
                that.$target.addClass('ccl-is-active').fadeIn(CCL.DURATION);
                // prepend close icon
                that.$closeIcon.prependTo(that.$el);
                CCL.reflow(that.$closeIcon[0]);
                that.$closeIcon.fadeIn(200);
                that.$el.addClass('ccl-is-active');

            }

        });

    };

    $(document).ready(function(){
        $('.js-toggle-header-menu').each(function(){
            new HeaderMenuToggle(this);
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
 * Quick Nav
 * 
 * Behavior for the quick nav
 */

( function( window, $ ) {
	'use strict';
    var $window = $(window),
        document = window.document;

    var QuickNav = function(el){

        this.$el = $(el);
        this.$subMenus = this.$el.find('.sub-menu');
        this.$scrollSpyItems = this.$el.find('.ccl-c-quick-nav__scrollspy span');
        this.$searchToggle = this.$el.find('.ccl-is-search-toggle');

        // set the toggle offset and account for the WP admin bar 
    
        if ( $('body').hasClass('admin-bar') && $('#wpadminbar').css('position') == 'fixed' ) {
            var adminBarHeight = $('#wpadminbar').outerHeight();
            this.toggleOffset = $('.ccl-c-user-nav').offset().top + $('.ccl-c-user-nav').outerHeight() - adminBarHeight;
        } else {
            this.toggleOffset = $('.ccl-c-user-nav').offset().top + $('.ccl-c-user-nav').outerHeight();
        }

        this.init();
    };

    QuickNav.prototype.init = function(){

        this.initScroll();
        this.initMenus();
        this.initScrollSpy();
        this.initSearch();

    };

    QuickNav.prototype.initScroll = function(){

        var that = this;
        
        $window.scroll( CCL.throttle( _onScroll, 50 ) );

        function _onScroll() {
            
            var scrollTop = $window.scrollTop();
    
            if ( scrollTop >= that.toggleOffset ) {
                that.$el.addClass('ccl-is-fixed');
            } else {
                that.$el.removeClass('ccl-is-fixed');
            }
    
        }

    };

    QuickNav.prototype.initMenus = function(){
        if ( ! this.$subMenus.length ) {
            return;
        }

        this.$subMenus.each(function(){
            var $subMenu = $(this),
                $toggle = $subMenu.siblings('a');

            $toggle.click(function(event){
                event.stopPropagation();
                event.preventDefault();

                if ( $(this).hasClass('ccl-is-active') ) {
                    $(this).removeClass('ccl-is-active ccl-u-color-school');
                    $subMenu.fadeOut(250);
                    return;
                }

                $('.ccl-c-quick-nav__menu a.ccl-is-active')
                    .removeClass('ccl-is-active ccl-u-color-school')
                    .siblings('.sub-menu')
                        .fadeOut(250);
                
                $(this).toggleClass('ccl-is-active ccl-u-color-school');
                $subMenu.fadeToggle(250);
            });
        });
    };

    QuickNav.prototype.initScrollSpy = function(){

        var that = this;

        this.$scrollSpyItems.each(function(){

            var $spyItem = $(this),
                target = $spyItem.data('target');

            $window.scroll( CCL.throttle( _onScroll, 100 ) );

            function _onScroll() {
             
                var scrollTop = $window.scrollTop(),
                    targetTop = $(target).offset().top - 150;

                if ( scrollTop >= targetTop ) {
                    that.$scrollSpyItems.removeClass('ccl-is-active');
                    $spyItem.addClass('ccl-is-active');
                } else {
                    $spyItem.removeClass('ccl-is-active');
                }

            }

        });

    };

    QuickNav.prototype.initSearch = function(){
        var that = this;
        this.$searchToggle.click(function(event){
            event.preventDefault();
            that.$el.toggleClass('ccl-search-active');
        });
    };

    $(document).ready(function(){
        $('.ccl-c-quick-nav').each(function(){
            new QuickNav(this);
        });
    });

} )( this, jQuery );

/**
 * Room Reservation
 * 
 * Handle room reservations
 */

( function( window, $ ) {
	'use strict';
    var document = window.document;

    var RoomResForm = function(el){

        var now = new Date();
        
        this.$el = $(el);
        this.$formContent = this.$el.find('.js-room-res-form-content').css({position:'relative'});
        this.$formResponse = this.$el.find('.js-room-res-form-response').css({position: 'absolute', top: '1rem', left: '1rem', opacity: 0});
        this.$formCancel = this.$el.find('.js-room-res-form-cancel');
        this.$formSubmit = this.$el.find('.js-room-res-form-submit');
        this.$formReload = this.$el.find('.js-room-res-form-reload');
        this.roomId = this.$el.data('resource-id');
        this.$dateSelect = this.$el.find('.js-room-date-select');
        this.dateYmd = this.$dateSelect.val();
        this.$roomSchedule = this.$el.find('.js-room-schedule');
        this.$currentDurationText = this.$el.find('.js-current-duration');
        this.$formNotification = $('<p class="ccl-c-alert"></p>');
        this.$resetSelectionBtn = this.$el.find('.js-reset-selection'); 
        this.$roomSlotInputs = null;
        this.selectedSlotInputs = [];
        this.maxSlots = 4;
        this.$maxTime = this.$el.find('.js-max-time');
        this.slotMinutes = 30;
        this.locale = "en-US";
        this.timeZone = {timeZone: "America/Los_Angeles"};

        this.init();

    };

    RoomResForm.prototype.init = function(){

        this.setLoading();

        this.updateScheduleData();

        this.setMaxTimeText();

        this.initDateEvents();
        
        this.initFormEvents();
    };

    RoomResForm.prototype.getSpaceAvailability = function(Ymd){

		var data = {
			action: 'get_room_info',
			ccl_nonce: CCL.nonce,
			availability: Ymd || '', // e.g. '2017-10-19'. empty string will get availability for current day
			room: this.roomId // room_id (space)
		};

        return $.post({
			url: CCL.ajax_url,
			data: data
		});

    };

    RoomResForm.prototype.getSpaceBookings = function(Ymd){
        
        var data = {
            action: 'get_bookings',
            ccl_nonce: CCL.nonce,
            date: Ymd || '', // e.g. '2017-10-19'. empty string will get bookings for current day
            room: this.roomId,
            limit: 50
        };

        return $.post({
            url: CCL.ajax_url,
            data: data
        });

    };

    RoomResForm.prototype.updateScheduleData = function() {
        
        var getSpacejqXHR = this.getSpaceAvailability(this.dateYmd);
        var getBookingsjqXHR = this.getSpaceBookings(this.dateYmd);
        var that = this;

        $.when(getSpacejqXHR, getBookingsjqXHR)
            .done(function(getSpace,getBookings){

                var spaceData = getSpace[0],
                    bookingsData = getBookings[0],
                    spacejqXHR = getSpace[2],
                    bookingsjqXHR = getBookings[2],
                    timeSlotsArray;

                // parse data to JSON if it's a string
                spaceData = ( typeof spaceData === 'string' ) ? JSON.parse( spaceData )[0] : spaceData[0];
                bookingsData = ( typeof bookingsData === 'string' ) ? JSON.parse( bookingsData ) : bookingsData;

                // merge bookings with availability
                if ( bookingsData.length ){

                    bookingsData.forEach(function(booking,i){

                        // calculate number of slots based on booking duration
                        var fromTime = new Date(booking.fromDate).getTime(),
                            toTime = new Date(booking.toDate).getTime(),
                            durationMinutes = (toTime - fromTime) / 1000 / 60,
                            slotCount = durationMinutes / that.slotMinutes;

                        spaceData.availability.push({
                            "from": booking.fromDate,
                            "to": booking.toDate,
                            "slotCount": slotCount,
                            "isBooked": true
                        });
                        
                    });
                    
                    // sort time slot objects by the "from" key
                    _sortByKey( spaceData.availability, 'from' );

                }

                // parse time slots and return an appropriate subset (only open to close hours)
                timeSlotsArray = that.parseSchedule(spaceData.availability);
                
                // build schedule HTML
                that.buildSchedule(timeSlotsArray);

                // Error handlers
                spacejqXHR.fail(function(err){
                    console.log(err);
                });
                bookingsjqXHR.fail(function(err){
                    console.log(err);
                });

            })
            .always(function(){
                that.unsetLoading();
                that.$resetSelectionBtn.hide();
            });

    };

    RoomResForm.prototype.buildSchedule = function(timeSlotsArray){

        var that = this,
            html = [];
            
        // construct HTML for each time slot
        timeSlotsArray.forEach(function(item, i){

            var from = new Date( item.from ),
                timeString,
                itemClass = '';

            if ( from.getMinutes() !== 0 ) {
                timeString = that.readableTime( from, 'h:m' );
            } else {
                timeString = that.readableTime( from, 'ha' );
            }

            if ( item.isBooked && item.hasOwnProperty('slotCount') ) {
                itemClass = 'ccl-is-occupied ccl-duration-' + item.slotCount;
            }
            
            // build selectable time slots
            html.push( that.buildTimeSlot({
                id: 'slot-' + that.roomId + '-' + i,
                from: item.from,
                to: item.to,
                timeString: timeString,
                class: itemClass
            }) );
        
        });

        this.selectedSlotInputs = [];

        this.$roomSchedule.html( html.join('') );

        this.$roomSlotInputs = this.$el.find('.ccl-c-room__slot [type="checkbox"]');

        this.setCurrentDurationText();

        this.initSlotEvents();

    };

    RoomResForm.prototype.buildTimeSlot = function(vars){
        
        if ( ! vars || typeof vars !== 'object' ) {
            return '';
        }

        var defaults = {
            class: '',
            id: '',
            disabled: '',
            from: '',
            to: '',
            timeString: ''
        };
        vars = $.extend(defaults, vars);

        var template = '' +
            '<div class="ccl-c-room__slot ' + vars.class + '">' +
                '<input type="checkbox" id="' + vars.id + '" name="' + vars.id + '" value="' + vars.from + '" data-to="' + vars.to + '" ' + vars.disabled + '/>' +
                '<label class="ccl-c-room__slot-label" for="' + vars.id + '">' +
                    vars.timeString +
                '</label>' +
            '</div>';

        return template;
    };

    RoomResForm.prototype.parseSchedule = function(scheduleArray){
        // returns the appropriate schedule for a given array of time slots
        
        var to = null,
            startEndIndexes = [], 
            start, end;

        // loop through array and pick out time gaps
        scheduleArray.forEach(function(item,i){
            if ( to && to !== item.from ) {
                startEndIndexes.push(i);
            }
            to = item.to;
        });

        // depending on number of gaps found, determine start and end indexes
        if ( startEndIndexes.length >= 2 ) {
            start = startEndIndexes[0];
            end = startEndIndexes[1];
        } else {
            start = 0;
            if ( startEndIndexes.length === 1 ) {
                end = startEndIndexes[0];
            } else {
                end = scheduleArray.length;
            }
        }
        
        // returned sliced portion of original schedule
        return scheduleArray.slice(start,end);
    };

    RoomResForm.prototype.initFormEvents = function(){

        var that = this;

        this.$resetSelectionBtn.click(function(event){
            event.preventDefault();
            $(that.selectedSlotInputs).each(function(i,input){
                $(input)
                    .prop('checked',false)
                    .change();
            });
            $('.ccl-c-room__slot').removeClass('ccl-is-disabled ccl-has-potential');
        });

        this.$el.submit(function(event){
            event.preventDefault();
            that.onSubmit();
        });

        this.$formReload.click(function(event){
            event.preventDefault();
            that.reloadForm();
        });

    };

    RoomResForm.prototype.initDateEvents = function(){

        var that = this;
        
        this.$dateSelect.change(function(){
            that.onDateChange();
        });

    };

    RoomResForm.prototype.onDateChange = function() {
        
        this.dateYmd = this.$dateSelect.val();
        
        this.setLoading();

        this.updateScheduleData();
        
    };
        
    RoomResForm.prototype.initSlotEvents = function(){
        var that = this;
        
        if ( this.$roomSlotInputs && this.$roomSlotInputs.length ){

            this.$el.find('.ccl-c-room__slot').hover(function(){
                that.onSlotMouseIn(this);
            }, function(){
                that.onSlotMouseOut(this);
            });

            // click event fires BEFORE change event
            this.$roomSlotInputs.click(function(event){
                var input = this;
                that.onSlotClick(input, event);
            });
            
            this.$roomSlotInputs.change(function(){
                var input = this;
                that.onSlotChange(input);
            });
            
        }
    };

    RoomResForm.prototype.onSlotMouseIn = function(hoveredSlot) {

        // if you're not selecting your 2nd slot, return
        if ( this.selectedSlotInputs.length !== 1 ) {
            return;
        }

        var hoveredInput = $(hoveredSlot).find('[type="checkbox"]');

        var hoveredInputIndex = this.$roomSlotInputs.index(hoveredInput),
            selectedInputIndex = this.$roomSlotInputs.index( this.selectedSlotInputs[0] ),
            inputIndexSet = [hoveredInputIndex, selectedInputIndex].sort();

        // if you're hovering the already selected slot, return
        if ( inputIndexSet[0] === inputIndexSet[1] ) {
            return;
        }

        // if the first or last input indexes are beyond boundaries, return
        if ( inputIndexSet[0] <= selectedInputIndex - this.maxSlots || inputIndexSet[1] >= selectedInputIndex + this.maxSlots ) {
            return;
        }

        // get first/last slot elements
        var $firstSlot = this.$roomSlotInputs.eq(inputIndexSet[0]).parent('.ccl-c-room__slot'),
            $lastSlot = this.$roomSlotInputs.eq(inputIndexSet[1]).parent('.ccl-c-room__slot');

        // select slots in between first and last
        $firstSlot.nextUntil($lastSlot).each(function(){
            var $this = $(this);
            if ( ! $this.hasClass('ccl-is-disabled') ) {
                $this.addClass('ccl-has-potential');
            }
        });

    };

    RoomResForm.prototype.onSlotMouseOut = function(hoveredInput) {

        if ( this.selectedSlotInputs.length !== 1 ) {
            return;
        }

        $('.ccl-c-room__slot').removeClass('ccl-has-potential');

    };

    RoomResForm.prototype.onSlotClick = function(clickedInput, event){
        
        var that = this,
            clickInputIndex = that.$roomSlotInputs.index(clickedInput),
            minIndex = clickInputIndex - that.maxSlots,
            maxIndex = clickInputIndex + that.maxSlots;

        // disables slots that are outside of max selectable area
        function _isolateSelectableSlots() {

            // occupied slots will affect what nearby slots can be selected
            // Loop through any occupied slots, if they exist
            $('.ccl-c-room__slot.ccl-is-occupied').each(function(i,slot){

                // get occupied slot's input, find it's index amoung all slot inputs
                var slotInput = $(slot).find('[type="checkbox"]'),
                    occupiedIndex = that.$roomSlotInputs.index(slotInput);

                // if occupied slot falls in the selectable area
                if ( minIndex < occupiedIndex && occupiedIndex < maxIndex ) {

                    // if occupied slot is BEFORE clicked slot, set it as the min
                    if ( occupiedIndex < clickInputIndex ) {
                        minIndex = occupiedIndex;
                    }
                    // if occupied slot is AFTER clicked slot, set it as the max
                    if ( occupiedIndex > clickInputIndex ) {
                        maxIndex = occupiedIndex;
                    }

                }
            });

            // loop through slots, disable ones that fall outside of min/max indexes
            that.$roomSlotInputs.each(function(i,input){
                if ( i <= minIndex || i >= maxIndex ) {
                    $(input).parent('.ccl-c-room__slot').addClass('ccl-is-disabled');
                }
            });

        }

        /* -------------------------------------------------------------
         * if no inputs yet selected, this is the first
         * ------------------------------------------------------------- */
        if ( that.selectedSlotInputs.length === 0 ) {

            _isolateSelectableSlots();
            
        }

        /* -------------------------------------------------------------
         * if 1 input selected, selecting 2nd slot
         * ------------------------------------------------------------- */
        if ( that.selectedSlotInputs.length === 1 ) {

            if ( $(clickedInput).parent('.ccl-c-room__slot').hasClass('ccl-is-disabled') ) {
                event.preventDefault();
            } else {
                $('.ccl-c-room__slot').removeClass('ccl-is-disabled');
            }

        }

        /* -------------------------------------------------------------
         * if 2 or more slots already selected
         * ------------------------------------------------------------- */
        if ( that.selectedSlotInputs.length >= 2 ) {

            // if the clicked input is not part of current selection
            // clear all selected inputs
            if ( that.selectedSlotInputs.indexOf( clickedInput ) < 0 ) {
            
                that.clearAllSlots();
                that.selectedSlotInputs = [];

            } 
            
            // if clicked input is one of the currently selected inputs
            // keep that one selected and deselect the rest
            else {

                // prevent change event from firing
                event.preventDefault();

                // get the input index from among selected inputs
                var selectedSlotIndex = that.selectedSlotInputs.indexOf( clickedInput ),
                    selectedInputs = $.extend( [], that.selectedSlotInputs );
                
                // clear all inputs EXCEPT the clicked one
                selectedInputs.forEach(function(input,i){
                    if ( selectedSlotIndex != i ) {
                        that.clearSlot(input);
                    }
                });
                
                // // set selected inputs to just this one
                // that.selectedSlotInputs = [ that.selectedSlotInputs[selectedSlotIndex] ];

                // update the current duration text
                that.setCurrentDurationText();

            }

            _isolateSelectableSlots();

        }
        
    };

    RoomResForm.prototype.onSlotChange = function(changedInput){
        
        // if input checked, add it to selected set
        if ( $(changedInput).prop('checked') ) {

            this.selectedSlotInputs.push(changedInput);
            $(changedInput).parent('.ccl-c-room__slot').addClass('ccl-is-checked');
   
        } 
        
        // if input unchecked, remove it from the selected set
        else { 

            var changedInputIndex = this.selectedSlotInputs.indexOf(changedInput);

            if ( changedInputIndex > -1 ) {
                this.selectedSlotInputs.splice( changedInputIndex, 1 );
            }
            $(changedInput).parent('.ccl-c-room__slot').removeClass('ccl-is-checked');

        }

        // toggle reset button
        if ( this.selectedSlotInputs.length > 0 ) {
            this.$resetSelectionBtn.show();
        } else {
            this.$resetSelectionBtn.hide();
        }

        // if highlight slots between two ends
        if ( this.selectedSlotInputs.length === 2 ) {

            var that = this;

            that.$el.find('.ccl-is-checked').first().nextUntil('.ccl-is-checked').each(function(i,slot){
                var slotInput = $(slot).find('input[type="checkbox"]');
                that.selectedSlotInputs.push(slotInput[0]);
                that.activateSlot(slot);
            });
        }

        this.setCurrentDurationText();

    };

    RoomResForm.prototype.clearSlot = function(slot) {
        // slot can be either the checkbox input -OR- the checkbox's container

        var inputIndex;

        // if it's the checkbox.
        if ( $(slot).is('[type="checkbox"]') ) {
         
            $(slot)
                .prop('checked',false)
                .parent('.ccl-c-room__slot')
                    .removeClass('ccl-is-checked ccl-has-potential');

            // get index of the input from selected set
            inputIndex = this.selectedSlotInputs.indexOf(slot);
            
        // if it's the container
        } else {

            var $input = $(slot).find('[type="checkbox"]');

            $(slot).removeClass('ccl-is-checked ccl-has-potential');
            $input.prop('checked',false);

            // get index of the input from selected set
            inputIndex = this.selectedSlotInputs.indexOf( $input[0] );

        }

        // remove input from selected set
        this.selectedSlotInputs.splice( inputIndex, 1 );

    };

    RoomResForm.prototype.clearAllSlots = function() {

        var that = this;

        this.$resetSelectionBtn.hide();
        
        // Extend the selected inputs array to a new variable.
        // The selected inputs array changes with every clearSlot() call
        // so, best to loop through an unchanging array.
        var selectedInputs = $.extend( [], that.selectedSlotInputs );

        $(selectedInputs).each(function(i,input){
            that.clearSlot(input);
        });

    };

    RoomResForm.prototype.activateSlot = function(slot) {
        // slot can be either the checkbox -OR- the checkbox's container

        var slotIsCheckbox = $(slot).is('[type="checkbox"]'),
            $container = slotIsCheckbox ? $(slot).parent('.ccl-c-room__slot') : $(slot);

        // never set an occupied slot as active
        if ( $container.hasClass('ccl-is-occupied') ) {
            return;
        }

        if ( $(slot).is('[type="checkbox"]') ) {

            // if it's the checkbox.
         
            $(slot).prop('checked',true);
            $container.addClass('ccl-is-checked');
            
        } else {

            // if it's the container

            $container
                .addClass('ccl-is-checked')
                .find('[type="checkbox"]')
                    .prop('checked',true);

        }
    };

    RoomResForm.prototype.setLoading = function(){
        this.$currentDurationText.text('Loading schedule...');
        this.$el.addClass('ccl-is-loading');
    };

    RoomResForm.prototype.unsetLoading = function(){
        this.$el.removeClass('ccl-is-loading');
    };

    RoomResForm.prototype.setCurrentDurationText = function() {

        var selection = $.extend([],this.selectedSlotInputs),
            sortedSelection = selection.sort(function(a,b){ 
                return a.value > b.value; 
            }),
            selectionLength = sortedSelection.length;
        
        if ( selectionLength > 0 ) {

            var time1Val = sortedSelection[0].value,
                readableTime1 = this.readableTime( new Date(time1Val) );

            var time2Val = ( selectionLength >= 2 ) ? sortedSelection[sortedSelection.length - 1].value : time1Val,
                time2T = new Date(time2Val).getTime() + ( this.slotMinutes * 60 * 1000 ),
                readableTime2 = this.readableTime( new Date(time2T) );

            this.$currentDurationText.text( 'From ' + readableTime1 + ' to ' + readableTime2 );

        }
        
        else {

            this.$currentDurationText.text('Please select available time slots');

        }

    };

    RoomResForm.prototype.setMaxTimeText = function(){
        var maxMinutes = this.maxSlots * this.slotMinutes,
            maxText;

        switch(maxMinutes) {
            case 240:
                maxText = maxMinutes / 60 + ' hours';
                break;
            case 180:
                maxText = maxMinutes / 60 + ' hours';
                break;
            case 120:
                maxText = maxMinutes / 60 + ' hours';
                break;
            case 60:
                maxText = maxMinutes / 60 + ' hours';
                break;
            default:
                maxText = maxMinutes + 'mins';
        }

        this.$maxTime.text( maxText );
    };

    RoomResForm.prototype.readableTime = function( dateObj, format ) {
        
        var localeString = dateObj.toLocaleString( this.locale, this.timeZone ), // e.g. --> "11/7/2017, 4:38:33 AM"
            localeTime = localeString.split(", ")[1]; // "4:38:33 AM"

        var time = localeTime.split(' ')[0], // "4:38:33",
            timeObj = {
                a: localeTime.split(' ')[1].toLowerCase(), // (am or pm) --> "a"
                h: time.split(':')[0], // "4"
                m: time.split(':')[1], // "38"
            };

        if ( format && typeof format === 'string' ) {
            
            var formatArr = format.split(''),
                readableArr = [];
            
            for ( var i = 0; i < formatArr.length; i++ ) {
                if ( timeObj[formatArr[i]] ) {
                    readableArr.push(timeObj[formatArr[i]]);
                } else {
                    readableArr.push(formatArr[i]);
                }
            }

            return readableArr.join('');
            
        }

        return timeObj.h + ':' + timeObj.m + timeObj.a;
        
    };

    RoomResForm.prototype.onSubmit = function(event){

        if ( ! this.selectedSlotInputs.length ) {
            
            this.$formNotification
                .css('display','none')
                .addClass('ccl-is-error')
                .text('Please select a time for your reservation')
                .appendTo(this.$formContent)
                .slideDown(CCL.DURATION);            

            return;
        } 
        else {
            this.$formNotification.remove();
        }

        var that = this,
            sortedSelection = $.extend([], this.selectedSlotInputs).sort(function(a,b){
                return a.value > b.value;
            }),
            start = sortedSelection[0].value,
            end = ( sortedSelection.length > 1 ) ? $( sortedSelection[ sortedSelection.length - 1 ] ).data('to') : $( sortedSelection[0] ).data('to'),
            payload = {
                "iid":333,
                "start": start,
                "fname": this.$el[0].fname.value,
                "lname": this.$el[0].lname.value,
                "email": this.$el[0].email.value,
                "nickname": this.$el[0].nickname.value,
                "bookings":[
                    { 
                        "id": this.roomId,
                        "to": end
                    }
                ]
            };

        this.$el.addClass('ccl-is-submitting');
        this.$formCancel.prop('disabled',true);
        this.$formSubmit.text('Sending...').prop('disabled',true);

        var data = {
            action: 'request_booking',
            ccl_nonce: CCL.nonce,
            payload: payload
        };

        /* ------------------------------------
         * Make a request here to reserve space
         * ------------------------------------ */
        $.post({
                url: CCL.ajax_url,
                data: data
            })
            .done(function(response){
                _handleSubmitResponse(response);
            })
            .fail(function(error){
                console.log(error);
            })
            .always(function(){
                that.$el.removeClass('ccl-is-submitting');
            });

        function _handleSubmitResponse(response) {

            var responseHTML,
                responseObject = JSON.parse(response);

            if ( responseObject.booking_id ) {
                responseHTML =  ['<p class="ccl-h2 ccl-u-mt-0">Success!</p>',
                                '<p class="ccl-h4">Your booking ID is <span class="ccl-u-color-school">' + responseObject.booking_id + '</span></p>',
                                '<p class="ccl-h4">Please check your email to confirm your booking.</p>'];
            } else {
                responseHTML =  ['<p class="ccl-h3 ccl-u-mt-0">Sorry, but we couldn\'t process your reservation.</p>','<p class="ccl-h4">Errors:</p>'];
                $(responseObject.errors).each(function(i, error){
                    responseHTML.push('<p class="ccl-c-alert ccl-is-error">' + error + '</p>');
                });
                responseHTML.push('<p class="ccl-h4">Please talk to your nearest librarian for help.</p>');
            }

            that.$formCancel.prop('disabled',false).text('Close');
            that.$formSubmit.hide();
            that.$formReload.show();

            that.$formContent.animate({opacity: 0}, CCL.DURATION);
            that.$formResponse
                .delay(CCL.DURATION)
                .animate({opacity: 1}, CCL.DURATION)
                .html(responseHTML);
            that.$formContent
                .delay(CCL.DURATION)
                .animate({height: that.$formResponse.height() + 'px' }, CCL.DURATION)
                .css({zIndex: '-1'});

            that.$el.removeClass('ccl-is-submitting');

        }

    };

    RoomResForm.prototype.reloadForm = function(){
        
        this.$formCancel.text('Cancel');
        this.$formSubmit.text('Submit').prop('disabled',false).show();
        this.$formReload.hide();
        
        this.clearAllSlots();

        this.$formResponse
            .animate({opacity: 0}, CCL.DURATION)
            .delay(CCL.DURATION)
            .html('');
        this.$formContent
            .delay(CCL.DURATION)
            .css({ height: '', zIndex: '' })
            .animate({opacity: 1}, CCL.DURATION);

        this.setLoading();
        
        this.updateScheduleData();
    };

    // ------------------------------------------------------- //
    // Helpers

    function _sortByKey( arr, key, order ) {
        function sortASC(a,b) {
            if (a[key] < b[key]){
                return -1;
            }
            if (a[key] > b[key]){
                return 1;
            }
            return 0;
        }
        function sortDESC(a,b) {
            if (a[key] > b[key]){
                return -1;
            }
            if (a[key] < b[key]){
                return 1;
            }
            return 0;
        }
        if ( 'DESC' === order ) {
            arr.sort(sortDESC);
        } else {
            arr.sort(sortASC);
        }
    }

    // ------------------------------------------------------- //

    $(document).ready(function(){
        $('.js-room-res-form').each(function(){
            new RoomResForm(this);
        });
    });

} )( this, jQuery );

/**
 *
 * SlideToggle
 * 
 *  tabs for hiding and showing additional content
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var slideToggleList = function(el){
        this.$el                = $(el);
        this.$slideToggleLink   = this.$el.find('.ccl-c-slideToggle__title');
        this.$toggleContainer   = this.$el.find('.ccl-c-slideToggle__container');
        
        this.init();
    };

    slideToggleList.prototype.init = function(){
        var _that = this;
        
        this.$slideToggleLink.on('click', function(evt){
            evt.preventDefault();
            //get the target to be opened
            var clickItem = $(this);
            //get the data target that corresponds to this link
            var target_content = clickItem.attr('data-toggleTitle');
            
            //add the active class so we can do stylings and transitions
            clickItem
                .toggleClass('ccl-is-active')
                .siblings()
                .removeClass('ccl-is-active');
                
            //toggle aria
            if (clickItem.attr( 'aria-expanded') === 'true') {
                    $(clickItem).attr( 'aria-expanded', 'false');
                } else {
                    $(clickItem).attr( 'aria-expanded', 'true');
            }
            
            //locate the target element and slidetoggle it
            _that.$toggleContainer
                .find( '[data-toggleTarget="' + target_content + '"]' )
                .slideToggle('fast');
                //toggle aria-expanded
                
            //toggle aria
            if (_that.$toggleContainer.attr( 'aria-expanded') === 'true') {
                    $(_that.$toggleContainer).attr( 'aria-expanded', 'false');
                } else {
                    $(_that.$toggleContainer).attr( 'aria-expanded', 'true');
                }
        });
    };

    $(document).ready(function(){
        $('.ccl-c-slideToggle').each( function(){
            new slideToggleList(this);            
        });

    });

} )( this, jQuery );

/**
 * Smooth Scrolling
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    $(document).ready(function(){

        $('.js-smooth-scroll').on('click', function(e){

            e.preventDefault();

            var target = $(this).data('target') || $(this).attr('href'),
                $target = $(target),
                scrollOffset = 0;

            $('.ccl-is-fixed').each(function(){
                scrollOffset += $(this).outerHeight();
            });

            if ( $target.length ) {
                var targetTop = $target.offset().top;
                $('html, body').animate( { 'scrollTop': targetTop - scrollOffset }, 800 );
            }

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

        var school = getCookie( 'ccl-school' );

        if ( initSchool ) {

            this.$select
                .find( 'option[value="' + school + '"]' )
                .attr( 'selected', 'selected' );

        	if ( school ) {
        		 $('html').attr('data-school', school);
			}

		}

        this.$select.change(function(event){
            $('html').attr( 'data-school', event.target.value );

            eraseCookie( 'ccl-school' );
            setCookie( 'ccl-school', event.target.value, 7);
        });
    };

    // Cookie functions lifted from Stack Overflow for now
    // https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
	function setCookie(name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	}

	function getCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	function eraseCookie(name) {
		document.cookie = name + '=; Max-Age=-99999999;';
	}

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
            get: '<div class="ccl-c-alert ccl-is-error ccl-wayfinder__error"><button type="button" class="ccl-b-close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><i class="ccl-b-icon alert" aria-hidden="true"></i> There was an error fetching call numbers.</div>',
            find: '<div class="ccl-c-alert ccl-is-error ccl-wayfinder__error"><button type="button" class="ccl-b-close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><i class="ccl-b-icon alert" aria-hidden="true"></i> Could not find that call number. Please try again.</div>'
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

            _this.reset();

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
            floorId;

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

        floorId = callData.floor_int;

        /* ----------------------------------------------------------------- */

        this.$el.find('a[href="#floor-'+floorId+'"]').addClass('ccl-is-active');
        this.$el.find('[id*="room-'+floorId+'-"]').addClass('ccl-is-active');

        tabs.setActive( '#floor-' + floorId );
        
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkcm9wZG93bnMuanMiLCJoZWFkZXItbWVudS10b2dnbGVzLmpzIiwibW9kYWxzLmpzIiwicXVpY2stbmF2LmpzIiwicm9vbS1yZXMuanMiLCJzbGlkZS10b2dnbGUtbGlzdC5qcyIsInNtb290aC1zY3JvbGwuanMiLCJzdGlja2llcy5qcyIsInRvZ2dsZS1zY2hvb2xzLmpzIiwidG9vbHRpcHMuanMiLCJ3YXlmaW5kaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcklBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2wyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogR2xvYmFsIFZhcmlhYmxlcy4gXG4gKi9cblxuXG4oZnVuY3Rpb24gKCAkLCB3aW5kb3cgKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcbiAgICBcbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5EVVJBVElPTiA9IDMwMDtcblxuICAgIENDTC5CUkVBS1BPSU5UX1NNID0gNTAwO1xuICAgIENDTC5CUkVBS1BPSU5UX01EID0gNzY4O1xuICAgIENDTC5CUkVBS1BPSU5UX0xHID0gMTAwMDtcbiAgICBDQ0wuQlJFQUtQT0lOVF9YTCA9IDE1MDA7XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdodG1sJykudG9nZ2xlQ2xhc3MoJ25vLWpzIGpzJyk7XG4gICAgfSk7XG5cbn0pKGpRdWVyeSwgdGhpcyk7IiwiLyoqXG4gKiBSZWZsb3cgcGFnZSBlbGVtZW50cy4gXG4gKiBcbiAqIEVuYWJsZXMgYW5pbWF0aW9ucy90cmFuc2l0aW9ucyBvbiBlbGVtZW50cyBhZGRlZCB0byB0aGUgcGFnZSBhZnRlciB0aGUgRE9NIGhhcyBsb2FkZWQuXG4gKi9cblxuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wucmVmbG93ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH07XG5cbn0pKCk7IiwiLyoqXG4gKiBHZXQgdGhlIFNjcm9sbGJhciB3aWR0aFxuICogVGhhbmtzIHRvIGRhdmlkIHdhbHNoOiBodHRwczovL2Rhdmlkd2Fsc2gubmFtZS9kZXRlY3Qtc2Nyb2xsYmFyLXdpZHRoXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgXG4gICAgZnVuY3Rpb24gZ2V0U2Nyb2xsV2lkdGgoKSB7XG4gICAgICAgIFxuICAgICAgICAvLyBDcmVhdGUgdGhlIG1lYXN1cmVtZW50IG5vZGVcbiAgICAgICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIFxuICAgICAgICAvLyBwb3NpdGlvbiB3YXkgdGhlIGhlbGwgb2ZmIHNjcmVlblxuICAgICAgICAkKHNjcm9sbERpdikuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwcHgnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwcHgnLFxuICAgICAgICAgICAgb3ZlcmZsb3c6ICdzY3JvbGwnLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6ICctOTk5OXB4JyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnYm9keScpLmFwcGVuZChzY3JvbGxEaXYpO1xuXG4gICAgICAgIC8vIEdldCB0aGUgc2Nyb2xsYmFyIHdpZHRoXG4gICAgICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgICAgICAgLy8gY29uc29sZS53YXJuKHNjcm9sbGJhcldpZHRoKTsgLy8gTWFjOiAgMTVcblxuICAgICAgICAvLyBEZWxldGUgdGhlIERJViBcbiAgICAgICAgJChzY3JvbGxEaXYpLnJlbW92ZSgpO1xuXG4gICAgICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aDtcbiAgICB9XG4gICAgXG4gICAgaWYgKCAhIHdpbmRvdy5DQ0wgKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wuZ2V0U2Nyb2xsV2lkdGggPSBnZXRTY3JvbGxXaWR0aDtcbiAgICBDQ0wuU0NST0xMQkFSV0lEVEggPSBnZXRTY3JvbGxXaWR0aCgpO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiAuZGVib3VuY2UoKSBmdW5jdGlvblxuICogXG4gKiBTb3VyY2U6IGh0dHBzOi8vZGF2aWR3YWxzaC5uYW1lL2phdmFzY3JpcHQtZGVib3VuY2UtZnVuY3Rpb25cbiAqL1xuXG5cbihmdW5jdGlvbih3aW5kb3cpIHtcblxuICAgIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAgIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAgIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAgIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICAgIHZhciB0aHJvdHRsZSA9IGZ1bmN0aW9uIChmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgICAgIHZhciB0aW1lb3V0LCBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB0aHJvdHRsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcblxuICAgICAgICB0aHJvdHRsZWQuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgcHJldmlvdXMgPSAwO1xuICAgICAgICAgICAgdGltZW91dCA9IGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdGhyb3R0bGVkO1xuICAgIH07XG5cbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIHdpbmRvdy5DQ0wudGhyb3R0bGUgPSB0aHJvdHRsZTtcblxufSkodGhpcyk7IiwiLyoqXG4gKiBBY2NvcmRpb25zXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBhY2NvcmRpb24gY29tcG9uZW50c1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgQWNjb3JkaW9uID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiR0b2dnbGUgPSB0aGlzLiRlbC5jaGlsZHJlbignLmNjbC1jLWFjY29yZGlvbl9fdG9nZ2xlJyk7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQgPSB0aGlzLiRlbC5jaGlsZHJlbignLmNjbC1jLWFjY29yZGlvbl9fY29udGVudCcpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgQWNjb3JkaW9uLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiR0b2dnbGUub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy4kY29udGVudC5zbGlkZVRvZ2dsZSgpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLnRvZ2dsZUNsYXNzKCdjY2wtaXMtb3BlbicpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWMtYWNjb3JkaW9uJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IEFjY29yZGlvbih0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIEFsZXJ0c1xuICogXG4gKiBCZWhhdmlvciBmb3IgYWxlcnRzXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIERVUkFUSU9OID0gQ0NMLkRVUkFUSU9OO1xuXG4gICAgdmFyIEFsZXJ0RGlzbWlzcyA9IGZ1bmN0aW9uKCRlbCl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICAgICAgdGhpcy50YXJnZXQgPSAkZWwucGFyZW50KCk7XG4gICAgICAgIHRoaXMuJHRhcmdldCA9ICQodGhpcy50YXJnZXQpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEFsZXJ0RGlzbWlzcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgX3RoaXMuJHRhcmdldC5hbmltYXRlKCB7IG9wYWNpdHk6IDAgfSwge1xuICAgICAgICAgICAgZHVyYXRpb246IERVUkFUSU9OLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5zbGlkZVVwKCBEVVJBVElPTiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG5cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCAnY2xpY2snLCAnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICB2YXIgZGlzbWlzc0VsID0gJChlLnRhcmdldCkuY2xvc2VzdCgnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJyk7XG4gICAgICAgICAgICBuZXcgQWxlcnREaXNtaXNzKGRpc21pc3NFbCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICogQ2Fyb3VzZWxzXG4gKiBcbiAqIEluaXRpYWxpemUgYW5kIGRlZmluZSBiZWhhdmlvciBmb3IgY2Fyb3VzZWxzLiBcbiAqIFVzZXMgdGhlIFNsaWNrIFNsaWRlcyBqUXVlcnkgcGx1Z2luIC0tPiBodHRwOi8va2Vud2hlZWxlci5naXRodWIuaW8vc2xpY2svXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBDYXJvdXNlbCA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLmdsb2JhbERlZmF1bHRzID0ge1xuICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICBkb3RzQ2xhc3M6ICdjY2wtYy1jYXJvdXNlbF9fcGFnaW5nJyxcbiAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgIH07XG5cbiAgICBDYXJvdXNlbC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuJGVsLmRhdGEoKSxcbiAgICAgICAgICAgIG9wdGlvbnMgPSBkYXRhLm9wdGlvbnMgfHwge307XG4gICAgICAgICAgICBcbiAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlID0gW107XG5cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNTbSApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9TTSwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc1NtXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc01kICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX01ELCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zTWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zTGcgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfTEcsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNMZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNYbCApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9YTCwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc1hsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCggdGhpcy5nbG9iYWxEZWZhdWx0cywgb3B0aW9ucyApO1xuXG4gICAgICAgIHZhciBjYXJvdXNlbCA9IHRoaXMuJGVsLnNsaWNrKG9wdGlvbnMpLFxuICAgICAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGNhcm91c2VsLm9uKCdiZWZvcmVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKXtcbiAgICAgICAgICAgIF90aGlzLiRlbC5maW5kKCcuc2xpY2stc2xpZGUnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXBhc3QnKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5maW5kKCcuc2xpY2stc2xpZGVbZGF0YS1zbGljay1pbmRleD1cIicrbmV4dFNsaWRlKydcIl0nKS5wcmV2QWxsKCkuYWRkQ2xhc3MoJ2NjbC1pcy1wYXN0Jyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtcHJvbW8tY2Fyb3VzZWwnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgQ2Fyb3VzZWwodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBEcm9wZG93bnNcbiAqIFxuICogSW5pdGlhbGl6ZSBhbmQgY29udHJvbCBiZWhhdmlvciBmb3IgZHJvcGRvd24gbWVudXNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgVE9HR0xFOiAnW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBBQ1RJVkU6ICdjY2wtaXMtYWN0aXZlJyxcbiAgICAgICAgICAgIENPTlRFTlQ6ICdjY2wtYy1kcm9wZG93bl9fY29udGVudCdcbiAgICAgICAgfTtcblxuICAgIHZhciBEcm9wZG93blRvZ2dsZSA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHBhcmVudCA9IHRoaXMuJHRvZ2dsZS5wYXJlbnQoKTtcbiAgICAgICAgXG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLiR0b2dnbGUuZGF0YSgndGFyZ2V0Jyk7XG5cbiAgICAgICAgdGhpcy4kY29udGVudCA9ICQoIHRhcmdldCApO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHRvZ2dsZS5jbGljayggZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgX3RoaXMudG9nZ2xlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICB2YXIgaGFzQWN0aXZlTWVudXMgPSAkKCAnLicgKyBjbGFzc05hbWUuQ09OVEVOVCArICcuJyArIGNsYXNzTmFtZS5BQ1RJVkUgKS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoIGhhc0FjdGl2ZU1lbnVzICl7XG4gICAgICAgICAgICAgICAgX2NsZWFyTWVudXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGlzQWN0aXZlID0gdGhpcy4kdG9nZ2xlLmhhc0NsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG5cbiAgICAgICAgaWYgKCBpc0FjdGl2ZSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2hvd0NvbnRlbnQoKTtcblxuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuc2hvd0NvbnRlbnQgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiR0b2dnbGUuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQuYWRkQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgdGhpcy4kcGFyZW50LmFkZENsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5oaWRlTWVudSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgdGhpcy4kcGFyZW50LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9jbGVhck1lbnVzKCkge1xuICAgICAgICAkKCcuY2NsLWMtZHJvcGRvd24sIC5jY2wtYy1kcm9wZG93bl9fY29udGVudCcpLnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgICQoIHNlbGVjdG9yLlRPR0dMRSApLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCBzZWxlY3Rvci5UT0dHTEUgKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgRHJvcGRvd25Ub2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBIZWFkZXIgTWVudSBUb2dnbGVzXG4gKiBcbiAqIENvbnRyb2xzIGJlaGF2aW9yIG9mIG1lbnUgdG9nZ2xlcyBpbiB0aGUgaGVhZGVyXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBIZWFkZXJNZW51VG9nZ2xlID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0aGlzLiRlbC5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIHRoaXMuJHBhcmVudE1lbnUgPSB0aGlzLiRlbC5jbG9zZXN0KCcuY2NsLWMtbWVudScpO1xuICAgICAgICB0aGlzLiRjbG9zZUljb24gPSAkKCc8aSBjbGFzcz1cImNjbC1iLWljb24gY2xvc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+Jyk7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEhlYWRlck1lbnVUb2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIHRhcmdldCBpcyBhbHJlYWR5IG9wZW5cbiAgICAgICAgICAgIGlmICggdGhhdC4kdGFyZ2V0Lmhhc0NsYXNzKCdjY2wtaXMtYWN0aXZlJykgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBjbG9zZSB0YXJnZXQgYW5kIHJlbW92ZSBhY3RpdmUgY2xhc3Nlcy9lbGVtZW50c1xuICAgICAgICAgICAgICAgIHRoYXQuJHBhcmVudE1lbnUucmVtb3ZlQ2xhc3MoJ2NjbC1oYXMtYWN0aXZlLWl0ZW0nKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHRoYXQuJHRhcmdldC5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpLmZhZGVPdXQoQ0NMLkRVUkFUSU9OKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRjbG9zZUljb24ucmVtb3ZlKCk7ICAgICAgIFxuXG4gICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICAvLyB0YXJnZXQgaXMgbm90IG9wZW5cbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gY2xvc2UgYW5kIHJlc2V0IGFsbCBhY3RpdmUgbWVudXNcbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtbWVudS5jY2wtaGFzLWFjdGl2ZS1pdGVtJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NjbC1oYXMtYWN0aXZlLWl0ZW0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJ2EuY2NsLWlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuY2NsLWItaWNvbi5jbG9zZScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNsb3NlIGFuZCByZXNldCBhbGwgYWN0aXZlIHN1Yi1tZW51IGNvbnRhaW5lcnNcbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtc3ViLW1lbnUtY29udGFpbmVyLmNjbC1pcy1hY3RpdmUnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKS5mYWRlT3V0KENDTC5EVVJBVElPTik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBhY3RpdmF0ZSB0aGUgc2VsZWN0ZWQgdGFyZ2V0XG4gICAgICAgICAgICAgICAgdGhhdC4kcGFyZW50TWVudS5hZGRDbGFzcygnY2NsLWhhcy1hY3RpdmUtaXRlbScpO1xuICAgICAgICAgICAgICAgIHRoYXQuJHRhcmdldC5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpLmZhZGVJbihDQ0wuRFVSQVRJT04pO1xuICAgICAgICAgICAgICAgIC8vIHByZXBlbmQgY2xvc2UgaWNvblxuICAgICAgICAgICAgICAgIHRoYXQuJGNsb3NlSWNvbi5wcmVwZW5kVG8odGhhdC4kZWwpO1xuICAgICAgICAgICAgICAgIENDTC5yZWZsb3codGhhdC4kY2xvc2VJY29uWzBdKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRjbG9zZUljb24uZmFkZUluKDIwMCk7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy10b2dnbGUtaGVhZGVyLW1lbnUnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgSGVhZGVyTWVudVRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIE1vZGFsc1xuICogXG4gKiBCZWhhdmlvciBmb3IgbW9kYWxzLiBCYXNlZCBvbiBCb290c3RyYXAncyBtb2RhbHM6IGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzQuMC9jb21wb25lbnRzL21vZGFsL1xuICogXG4gKiBHbG9iYWxzOlxuICogU0NST0xMQkFSV0lEVEhcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgRFVSQVRJT04gPSAzMDA7XG5cbiAgICB2YXIgTW9kYWxUb2dnbGUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgJGVsID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLnRhcmdldCA9ICRlbC5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7IFxuXG4gICAgICAgIF90aGlzLiRlbC5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmICggJChkb2N1bWVudC5ib2R5KS5oYXNDbGFzcygnY2NsLW1vZGFsLW9wZW4nKSApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jbG9zZU1vZGFsKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzLnNob3dCYWNrZHJvcChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zaG93TW9kYWwoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLnNob3dCYWNrZHJvcCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblxuICAgICAgICB2YXIgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdmFyICRiYWNrZHJvcCA9ICQoYmFja2Ryb3ApO1xuXG4gICAgICAgICRiYWNrZHJvcC5hZGRDbGFzcygnY2NsLWMtbW9kYWxfX2JhY2tkcm9wJyk7XG4gICAgICAgICRiYWNrZHJvcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgXG4gICAgICAgIENDTC5yZWZsb3coYmFja2Ryb3ApO1xuICAgICAgICBcbiAgICAgICAgJGJhY2tkcm9wLmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICAkKGRvY3VtZW50LmJvZHkpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJylcbiAgICAgICAgICAgIC5jc3MoICdwYWRkaW5nLXJpZ2h0JywgQ0NMLlNDUk9MTEJBUldJRFRIICk7XG5cbiAgICAgICAgaWYgKCBjYWxsYmFjayApIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoIGNhbGxiYWNrLCBEVVJBVElPTiApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5zaG93TW9kYWwgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBfdGhpcy4kdGFyZ2V0LnNob3coIDAsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAkKCcuY2NsLWMtbW9kYWwnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsJykuaGlkZSgpO1xuXG4gICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWxfX2JhY2tkcm9wJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWxfX2JhY2tkcm9wJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLW1vZGFsLW9wZW4nKVxuICAgICAgICAgICAgICAgICAgICAuY3NzKCAncGFkZGluZy1yaWdodCcsICcnICk7XG5cbiAgICAgICAgICAgIH0sIERVUkFUSU9OKTtcblxuICAgICAgICB9LCBEVVJBVElPTiApOyBcblxuICAgIH07XG5cblxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgTW9kYWxUb2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICogUXVpY2sgTmF2XG4gKiBcbiAqIEJlaGF2aW9yIGZvciB0aGUgcXVpY2sgbmF2XG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyksXG4gICAgICAgIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIFF1aWNrTmF2ID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHN1Yk1lbnVzID0gdGhpcy4kZWwuZmluZCgnLnN1Yi1tZW51Jyk7XG4gICAgICAgIHRoaXMuJHNjcm9sbFNweUl0ZW1zID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXF1aWNrLW5hdl9fc2Nyb2xsc3B5IHNwYW4nKTtcbiAgICAgICAgdGhpcy4kc2VhcmNoVG9nZ2xlID0gdGhpcy4kZWwuZmluZCgnLmNjbC1pcy1zZWFyY2gtdG9nZ2xlJyk7XG5cbiAgICAgICAgLy8gc2V0IHRoZSB0b2dnbGUgb2Zmc2V0IGFuZCBhY2NvdW50IGZvciB0aGUgV1AgYWRtaW4gYmFyIFxuICAgIFxuICAgICAgICBpZiAoICQoJ2JvZHknKS5oYXNDbGFzcygnYWRtaW4tYmFyJykgJiYgJCgnI3dwYWRtaW5iYXInKS5jc3MoJ3Bvc2l0aW9uJykgPT0gJ2ZpeGVkJyApIHtcbiAgICAgICAgICAgIHZhciBhZG1pbkJhckhlaWdodCA9ICQoJyN3cGFkbWluYmFyJykub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlT2Zmc2V0ID0gJCgnLmNjbC1jLXVzZXItbmF2Jykub2Zmc2V0KCkudG9wICsgJCgnLmNjbC1jLXVzZXItbmF2Jykub3V0ZXJIZWlnaHQoKSAtIGFkbWluQmFySGVpZ2h0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVPZmZzZXQgPSAkKCcuY2NsLWMtdXNlci1uYXYnKS5vZmZzZXQoKS50b3AgKyAkKCcuY2NsLWMtdXNlci1uYXYnKS5vdXRlckhlaWdodCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIFF1aWNrTmF2LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB0aGlzLmluaXRTY3JvbGwoKTtcbiAgICAgICAgdGhpcy5pbml0TWVudXMoKTtcbiAgICAgICAgdGhpcy5pbml0U2Nyb2xsU3B5KCk7XG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaCgpO1xuXG4gICAgfTtcblxuICAgIFF1aWNrTmF2LnByb3RvdHlwZS5pbml0U2Nyb2xsID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICAkd2luZG93LnNjcm9sbCggQ0NMLnRocm90dGxlKCBfb25TY3JvbGwsIDUwICkgKTtcblxuICAgICAgICBmdW5jdGlvbiBfb25TY3JvbGwoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xuICAgIFxuICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gdGhhdC50b2dnbGVPZmZzZXQgKSB7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1maXhlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWZpeGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdE1lbnVzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCAhIHRoaXMuJHN1Yk1lbnVzLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJHN1Yk1lbnVzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciAkc3ViTWVudSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgJHRvZ2dsZSA9ICRzdWJNZW51LnNpYmxpbmdzKCdhJyk7XG5cbiAgICAgICAgICAgICR0b2dnbGUuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoICQodGhpcykuaGFzQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKSApIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZSBjY2wtdS1jb2xvci1zY2hvb2wnKTtcbiAgICAgICAgICAgICAgICAgICAgJHN1Yk1lbnUuZmFkZU91dCgyNTApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJCgnLmNjbC1jLXF1aWNrLW5hdl9fbWVudSBhLmNjbC1pcy1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUgY2NsLXUtY29sb3Itc2Nob29sJylcbiAgICAgICAgICAgICAgICAgICAgLnNpYmxpbmdzKCcuc3ViLW1lbnUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZhZGVPdXQoMjUwKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdjY2wtaXMtYWN0aXZlIGNjbC11LWNvbG9yLXNjaG9vbCcpO1xuICAgICAgICAgICAgICAgICRzdWJNZW51LmZhZGVUb2dnbGUoMjUwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgUXVpY2tOYXYucHJvdG90eXBlLmluaXRTY3JvbGxTcHkgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLiRzY3JvbGxTcHlJdGVtcy5lYWNoKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHZhciAkc3B5SXRlbSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gJHNweUl0ZW0uZGF0YSgndGFyZ2V0Jyk7XG5cbiAgICAgICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgMTAwICkgKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gX29uU2Nyb2xsKCkge1xuICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUb3AgPSAkKHRhcmdldCkub2Zmc2V0KCkudG9wIC0gMTUwO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gdGFyZ2V0VG9wICkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LiRzY3JvbGxTcHlJdGVtcy5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAkc3B5SXRlbS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzcHlJdGVtLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUXVpY2tOYXYucHJvdG90eXBlLmluaXRTZWFyY2ggPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuJHNlYXJjaFRvZ2dsZS5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhhdC4kZWwudG9nZ2xlQ2xhc3MoJ2NjbC1zZWFyY2gtYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWMtcXVpY2stbmF2JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFF1aWNrTmF2KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogUm9vbSBSZXNlcnZhdGlvblxuICogXG4gKiBIYW5kbGUgcm9vbSByZXNlcnZhdGlvbnNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgUm9vbVJlc0Zvcm0gPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiRmb3JtQ29udGVudCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLWNvbnRlbnQnKS5jc3Moe3Bvc2l0aW9uOidyZWxhdGl2ZSd9KTtcbiAgICAgICAgdGhpcy4kZm9ybVJlc3BvbnNlID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tcmVzcG9uc2UnKS5jc3Moe3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6ICcxcmVtJywgbGVmdDogJzFyZW0nLCBvcGFjaXR5OiAwfSk7XG4gICAgICAgIHRoaXMuJGZvcm1DYW5jZWwgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1jYW5jZWwnKTtcbiAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLXN1Ym1pdCcpO1xuICAgICAgICB0aGlzLiRmb3JtUmVsb2FkID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tcmVsb2FkJyk7XG4gICAgICAgIHRoaXMucm9vbUlkID0gdGhpcy4kZWwuZGF0YSgncmVzb3VyY2UtaWQnKTtcbiAgICAgICAgdGhpcy4kZGF0ZVNlbGVjdCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLWRhdGUtc2VsZWN0Jyk7XG4gICAgICAgIHRoaXMuZGF0ZVltZCA9IHRoaXMuJGRhdGVTZWxlY3QudmFsKCk7XG4gICAgICAgIHRoaXMuJHJvb21TY2hlZHVsZSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXNjaGVkdWxlJyk7XG4gICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQgPSB0aGlzLiRlbC5maW5kKCcuanMtY3VycmVudC1kdXJhdGlvbicpO1xuICAgICAgICB0aGlzLiRmb3JtTm90aWZpY2F0aW9uID0gJCgnPHAgY2xhc3M9XCJjY2wtYy1hbGVydFwiPjwvcD4nKTtcbiAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4gPSB0aGlzLiRlbC5maW5kKCcuanMtcmVzZXQtc2VsZWN0aW9uJyk7IFxuICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cyA9IG51bGw7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzID0gW107XG4gICAgICAgIHRoaXMubWF4U2xvdHMgPSA0O1xuICAgICAgICB0aGlzLiRtYXhUaW1lID0gdGhpcy4kZWwuZmluZCgnLmpzLW1heC10aW1lJyk7XG4gICAgICAgIHRoaXMuc2xvdE1pbnV0ZXMgPSAzMDtcbiAgICAgICAgdGhpcy5sb2NhbGUgPSBcImVuLVVTXCI7XG4gICAgICAgIHRoaXMudGltZVpvbmUgPSB7dGltZVpvbmU6IFwiQW1lcmljYS9Mb3NfQW5nZWxlc1wifTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5zZXRMb2FkaW5nKCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTY2hlZHVsZURhdGEoKTtcblxuICAgICAgICB0aGlzLnNldE1heFRpbWVUZXh0KCk7XG5cbiAgICAgICAgdGhpcy5pbml0RGF0ZUV2ZW50cygpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0Rm9ybUV2ZW50cygpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuZ2V0U3BhY2VBdmFpbGFiaWxpdHkgPSBmdW5jdGlvbihZbWQpe1xuXG5cdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRhY3Rpb246ICdnZXRfcm9vbV9pbmZvJyxcblx0XHRcdGNjbF9ub25jZTogQ0NMLm5vbmNlLFxuXHRcdFx0YXZhaWxhYmlsaXR5OiBZbWQgfHwgJycsIC8vIGUuZy4gJzIwMTctMTAtMTknLiBlbXB0eSBzdHJpbmcgd2lsbCBnZXQgYXZhaWxhYmlsaXR5IGZvciBjdXJyZW50IGRheVxuXHRcdFx0cm9vbTogdGhpcy5yb29tSWQgLy8gcm9vbV9pZCAoc3BhY2UpXG5cdFx0fTtcblxuICAgICAgICByZXR1cm4gJC5wb3N0KHtcblx0XHRcdHVybDogQ0NMLmFqYXhfdXJsLFxuXHRcdFx0ZGF0YTogZGF0YVxuXHRcdH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5nZXRTcGFjZUJvb2tpbmdzID0gZnVuY3Rpb24oWW1kKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgYWN0aW9uOiAnZ2V0X2Jvb2tpbmdzJyxcbiAgICAgICAgICAgIGNjbF9ub25jZTogQ0NMLm5vbmNlLFxuICAgICAgICAgICAgZGF0ZTogWW1kIHx8ICcnLCAvLyBlLmcuICcyMDE3LTEwLTE5Jy4gZW1wdHkgc3RyaW5nIHdpbGwgZ2V0IGJvb2tpbmdzIGZvciBjdXJyZW50IGRheVxuICAgICAgICAgICAgcm9vbTogdGhpcy5yb29tSWQsXG4gICAgICAgICAgICBsaW1pdDogNTBcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gJC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogQ0NMLmFqYXhfdXJsLFxuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUudXBkYXRlU2NoZWR1bGVEYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgZ2V0U3BhY2VqcVhIUiA9IHRoaXMuZ2V0U3BhY2VBdmFpbGFiaWxpdHkodGhpcy5kYXRlWW1kKTtcbiAgICAgICAgdmFyIGdldEJvb2tpbmdzanFYSFIgPSB0aGlzLmdldFNwYWNlQm9va2luZ3ModGhpcy5kYXRlWW1kKTtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgICQud2hlbihnZXRTcGFjZWpxWEhSLCBnZXRCb29raW5nc2pxWEhSKVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24oZ2V0U3BhY2UsZ2V0Qm9va2luZ3Mpe1xuXG4gICAgICAgICAgICAgICAgdmFyIHNwYWNlRGF0YSA9IGdldFNwYWNlWzBdLFxuICAgICAgICAgICAgICAgICAgICBib29raW5nc0RhdGEgPSBnZXRCb29raW5nc1swXSxcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VqcVhIUiA9IGdldFNwYWNlWzJdLFxuICAgICAgICAgICAgICAgICAgICBib29raW5nc2pxWEhSID0gZ2V0Qm9va2luZ3NbMl0sXG4gICAgICAgICAgICAgICAgICAgIHRpbWVTbG90c0FycmF5O1xuXG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgZGF0YSB0byBKU09OIGlmIGl0J3MgYSBzdHJpbmdcbiAgICAgICAgICAgICAgICBzcGFjZURhdGEgPSAoIHR5cGVvZiBzcGFjZURhdGEgPT09ICdzdHJpbmcnICkgPyBKU09OLnBhcnNlKCBzcGFjZURhdGEgKVswXSA6IHNwYWNlRGF0YVswXTtcbiAgICAgICAgICAgICAgICBib29raW5nc0RhdGEgPSAoIHR5cGVvZiBib29raW5nc0RhdGEgPT09ICdzdHJpbmcnICkgPyBKU09OLnBhcnNlKCBib29raW5nc0RhdGEgKSA6IGJvb2tpbmdzRGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIG1lcmdlIGJvb2tpbmdzIHdpdGggYXZhaWxhYmlsaXR5XG4gICAgICAgICAgICAgICAgaWYgKCBib29raW5nc0RhdGEubGVuZ3RoICl7XG5cbiAgICAgICAgICAgICAgICAgICAgYm9va2luZ3NEYXRhLmZvckVhY2goZnVuY3Rpb24oYm9va2luZyxpKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIG51bWJlciBvZiBzbG90cyBiYXNlZCBvbiBib29raW5nIGR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZnJvbVRpbWUgPSBuZXcgRGF0ZShib29raW5nLmZyb21EYXRlKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9UaW1lID0gbmV3IERhdGUoYm9va2luZy50b0RhdGUpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbk1pbnV0ZXMgPSAodG9UaW1lIC0gZnJvbVRpbWUpIC8gMTAwMCAvIDYwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsb3RDb3VudCA9IGR1cmF0aW9uTWludXRlcyAvIHRoYXQuc2xvdE1pbnV0ZXM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlRGF0YS5hdmFpbGFiaWxpdHkucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IGJvb2tpbmcuZnJvbURhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBib29raW5nLnRvRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNsb3RDb3VudFwiOiBzbG90Q291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0Jvb2tlZFwiOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIHNvcnQgdGltZSBzbG90IG9iamVjdHMgYnkgdGhlIFwiZnJvbVwiIGtleVxuICAgICAgICAgICAgICAgICAgICBfc29ydEJ5S2V5KCBzcGFjZURhdGEuYXZhaWxhYmlsaXR5LCAnZnJvbScgKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHBhcnNlIHRpbWUgc2xvdHMgYW5kIHJldHVybiBhbiBhcHByb3ByaWF0ZSBzdWJzZXQgKG9ubHkgb3BlbiB0byBjbG9zZSBob3VycylcbiAgICAgICAgICAgICAgICB0aW1lU2xvdHNBcnJheSA9IHRoYXQucGFyc2VTY2hlZHVsZShzcGFjZURhdGEuYXZhaWxhYmlsaXR5KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBidWlsZCBzY2hlZHVsZSBIVE1MXG4gICAgICAgICAgICAgICAgdGhhdC5idWlsZFNjaGVkdWxlKHRpbWVTbG90c0FycmF5KTtcblxuICAgICAgICAgICAgICAgIC8vIEVycm9yIGhhbmRsZXJzXG4gICAgICAgICAgICAgICAgc3BhY2VqcVhIUi5mYWlsKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYm9va2luZ3NqcVhIUi5mYWlsKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhhdC51bnNldExvYWRpbmcoKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRyZXNldFNlbGVjdGlvbkJ0bi5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuYnVpbGRTY2hlZHVsZSA9IGZ1bmN0aW9uKHRpbWVTbG90c0FycmF5KXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBodG1sID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gY29uc3RydWN0IEhUTUwgZm9yIGVhY2ggdGltZSBzbG90XG4gICAgICAgIHRpbWVTbG90c0FycmF5LmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSl7XG5cbiAgICAgICAgICAgIHZhciBmcm9tID0gbmV3IERhdGUoIGl0ZW0uZnJvbSApLFxuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmcsXG4gICAgICAgICAgICAgICAgaXRlbUNsYXNzID0gJyc7XG5cbiAgICAgICAgICAgIGlmICggZnJvbS5nZXRNaW51dGVzKCkgIT09IDAgKSB7XG4gICAgICAgICAgICAgICAgdGltZVN0cmluZyA9IHRoYXQucmVhZGFibGVUaW1lKCBmcm9tLCAnaDptJyApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aW1lU3RyaW5nID0gdGhhdC5yZWFkYWJsZVRpbWUoIGZyb20sICdoYScgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBpdGVtLmlzQm9va2VkICYmIGl0ZW0uaGFzT3duUHJvcGVydHkoJ3Nsb3RDb3VudCcpICkge1xuICAgICAgICAgICAgICAgIGl0ZW1DbGFzcyA9ICdjY2wtaXMtb2NjdXBpZWQgY2NsLWR1cmF0aW9uLScgKyBpdGVtLnNsb3RDb3VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gYnVpbGQgc2VsZWN0YWJsZSB0aW1lIHNsb3RzXG4gICAgICAgICAgICBodG1sLnB1c2goIHRoYXQuYnVpbGRUaW1lU2xvdCh7XG4gICAgICAgICAgICAgICAgaWQ6ICdzbG90LScgKyB0aGF0LnJvb21JZCArICctJyArIGksXG4gICAgICAgICAgICAgICAgZnJvbTogaXRlbS5mcm9tLFxuICAgICAgICAgICAgICAgIHRvOiBpdGVtLnRvLFxuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmc6IHRpbWVTdHJpbmcsXG4gICAgICAgICAgICAgICAgY2xhc3M6IGl0ZW1DbGFzc1xuICAgICAgICAgICAgfSkgKTtcbiAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzID0gW107XG5cbiAgICAgICAgdGhpcy4kcm9vbVNjaGVkdWxlLmh0bWwoIGh0bWwuam9pbignJykgKTtcblxuICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1yb29tX19zbG90IFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcblxuICAgICAgICB0aGlzLnNldEN1cnJlbnREdXJhdGlvblRleHQoKTtcblxuICAgICAgICB0aGlzLmluaXRTbG90RXZlbnRzKCk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmJ1aWxkVGltZVNsb3QgPSBmdW5jdGlvbih2YXJzKXtcbiAgICAgICAgXG4gICAgICAgIGlmICggISB2YXJzIHx8IHR5cGVvZiB2YXJzICE9PSAnb2JqZWN0JyApIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGNsYXNzOiAnJyxcbiAgICAgICAgICAgIGlkOiAnJyxcbiAgICAgICAgICAgIGRpc2FibGVkOiAnJyxcbiAgICAgICAgICAgIGZyb206ICcnLFxuICAgICAgICAgICAgdG86ICcnLFxuICAgICAgICAgICAgdGltZVN0cmluZzogJydcbiAgICAgICAgfTtcbiAgICAgICAgdmFycyA9ICQuZXh0ZW5kKGRlZmF1bHRzLCB2YXJzKTtcblxuICAgICAgICB2YXIgdGVtcGxhdGUgPSAnJyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNjbC1jLXJvb21fX3Nsb3QgJyArIHZhcnMuY2xhc3MgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cIicgKyB2YXJzLmlkICsgJ1wiIG5hbWU9XCInICsgdmFycy5pZCArICdcIiB2YWx1ZT1cIicgKyB2YXJzLmZyb20gKyAnXCIgZGF0YS10bz1cIicgKyB2YXJzLnRvICsgJ1wiICcgKyB2YXJzLmRpc2FibGVkICsgJy8+JyArXG4gICAgICAgICAgICAgICAgJzxsYWJlbCBjbGFzcz1cImNjbC1jLXJvb21fX3Nsb3QtbGFiZWxcIiBmb3I9XCInICsgdmFycy5pZCArICdcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgdmFycy50aW1lU3RyaW5nICtcbiAgICAgICAgICAgICAgICAnPC9sYWJlbD4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nO1xuXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnBhcnNlU2NoZWR1bGUgPSBmdW5jdGlvbihzY2hlZHVsZUFycmF5KXtcbiAgICAgICAgLy8gcmV0dXJucyB0aGUgYXBwcm9wcmlhdGUgc2NoZWR1bGUgZm9yIGEgZ2l2ZW4gYXJyYXkgb2YgdGltZSBzbG90c1xuICAgICAgICBcbiAgICAgICAgdmFyIHRvID0gbnVsbCxcbiAgICAgICAgICAgIHN0YXJ0RW5kSW5kZXhlcyA9IFtdLCBcbiAgICAgICAgICAgIHN0YXJ0LCBlbmQ7XG5cbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFycmF5IGFuZCBwaWNrIG91dCB0aW1lIGdhcHNcbiAgICAgICAgc2NoZWR1bGVBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0saSl7XG4gICAgICAgICAgICBpZiAoIHRvICYmIHRvICE9PSBpdGVtLmZyb20gKSB7XG4gICAgICAgICAgICAgICAgc3RhcnRFbmRJbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0byA9IGl0ZW0udG87XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGRlcGVuZGluZyBvbiBudW1iZXIgb2YgZ2FwcyBmb3VuZCwgZGV0ZXJtaW5lIHN0YXJ0IGFuZCBlbmQgaW5kZXhlc1xuICAgICAgICBpZiAoIHN0YXJ0RW5kSW5kZXhlcy5sZW5ndGggPj0gMiApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gc3RhcnRFbmRJbmRleGVzWzBdO1xuICAgICAgICAgICAgZW5kID0gc3RhcnRFbmRJbmRleGVzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgICAgICAgaWYgKCBzdGFydEVuZEluZGV4ZXMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAgICAgICAgIGVuZCA9IHN0YXJ0RW5kSW5kZXhlc1swXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZW5kID0gc2NoZWR1bGVBcnJheS5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIHJldHVybmVkIHNsaWNlZCBwb3J0aW9uIG9mIG9yaWdpbmFsIHNjaGVkdWxlXG4gICAgICAgIHJldHVybiBzY2hlZHVsZUFycmF5LnNsaWNlKHN0YXJ0LGVuZCk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0Rm9ybUV2ZW50cyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHJlc2V0U2VsZWN0aW9uQnRuLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzKS5lYWNoKGZ1bmN0aW9uKGksaW5wdXQpe1xuICAgICAgICAgICAgICAgICQoaW5wdXQpXG4gICAgICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJyxmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgLmNoYW5nZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcuY2NsLWMtcm9vbV9fc2xvdCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtZGlzYWJsZWQgY2NsLWhhcy1wb3RlbnRpYWwnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kZWwuc3VibWl0KGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGF0Lm9uU3VibWl0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGZvcm1SZWxvYWQuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoYXQucmVsb2FkRm9ybSgpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdERhdGVFdmVudHMgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGRhdGVTZWxlY3QuY2hhbmdlKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGF0Lm9uRGF0ZUNoYW5nZSgpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25EYXRlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRhdGVZbWQgPSB0aGlzLiRkYXRlU2VsZWN0LnZhbCgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zZXRMb2FkaW5nKCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTY2hlZHVsZURhdGEoKTtcbiAgICAgICAgXG4gICAgfTtcbiAgICAgICAgXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXRTbG90RXZlbnRzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgaWYgKCB0aGlzLiRyb29tU2xvdElucHV0cyAmJiB0aGlzLiRyb29tU2xvdElucHV0cy5sZW5ndGggKXtcblxuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5ob3ZlcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoYXQub25TbG90TW91c2VJbih0aGlzKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhhdC5vblNsb3RNb3VzZU91dCh0aGlzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBjbGljayBldmVudCBmaXJlcyBCRUZPUkUgY2hhbmdlIGV2ZW50XG4gICAgICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cy5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhpcztcbiAgICAgICAgICAgICAgICB0aGF0Lm9uU2xvdENsaWNrKGlucHV0LCBldmVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy4kcm9vbVNsb3RJbnB1dHMuY2hhbmdlKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhpcztcbiAgICAgICAgICAgICAgICB0aGF0Lm9uU2xvdENoYW5nZShpbnB1dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblNsb3RNb3VzZUluID0gZnVuY3Rpb24oaG92ZXJlZFNsb3QpIHtcblxuICAgICAgICAvLyBpZiB5b3UncmUgbm90IHNlbGVjdGluZyB5b3VyIDJuZCBzbG90LCByZXR1cm5cbiAgICAgICAgaWYgKCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggIT09IDEgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaG92ZXJlZElucHV0ID0gJChob3ZlcmVkU2xvdCkuZmluZCgnW3R5cGU9XCJjaGVja2JveFwiXScpO1xuXG4gICAgICAgIHZhciBob3ZlcmVkSW5wdXRJbmRleCA9IHRoaXMuJHJvb21TbG90SW5wdXRzLmluZGV4KGhvdmVyZWRJbnB1dCksXG4gICAgICAgICAgICBzZWxlY3RlZElucHV0SW5kZXggPSB0aGlzLiRyb29tU2xvdElucHV0cy5pbmRleCggdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHNbMF0gKSxcbiAgICAgICAgICAgIGlucHV0SW5kZXhTZXQgPSBbaG92ZXJlZElucHV0SW5kZXgsIHNlbGVjdGVkSW5wdXRJbmRleF0uc29ydCgpO1xuXG4gICAgICAgIC8vIGlmIHlvdSdyZSBob3ZlcmluZyB0aGUgYWxyZWFkeSBzZWxlY3RlZCBzbG90LCByZXR1cm5cbiAgICAgICAgaWYgKCBpbnB1dEluZGV4U2V0WzBdID09PSBpbnB1dEluZGV4U2V0WzFdICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhlIGZpcnN0IG9yIGxhc3QgaW5wdXQgaW5kZXhlcyBhcmUgYmV5b25kIGJvdW5kYXJpZXMsIHJldHVyblxuICAgICAgICBpZiAoIGlucHV0SW5kZXhTZXRbMF0gPD0gc2VsZWN0ZWRJbnB1dEluZGV4IC0gdGhpcy5tYXhTbG90cyB8fCBpbnB1dEluZGV4U2V0WzFdID49IHNlbGVjdGVkSW5wdXRJbmRleCArIHRoaXMubWF4U2xvdHMgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgZmlyc3QvbGFzdCBzbG90IGVsZW1lbnRzXG4gICAgICAgIHZhciAkZmlyc3RTbG90ID0gdGhpcy4kcm9vbVNsb3RJbnB1dHMuZXEoaW5wdXRJbmRleFNldFswXSkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpLFxuICAgICAgICAgICAgJGxhc3RTbG90ID0gdGhpcy4kcm9vbVNsb3RJbnB1dHMuZXEoaW5wdXRJbmRleFNldFsxXSkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpO1xuXG4gICAgICAgIC8vIHNlbGVjdCBzbG90cyBpbiBiZXR3ZWVuIGZpcnN0IGFuZCBsYXN0XG4gICAgICAgICRmaXJzdFNsb3QubmV4dFVudGlsKCRsYXN0U2xvdCkuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGlmICggISAkdGhpcy5oYXNDbGFzcygnY2NsLWlzLWRpc2FibGVkJykgKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ2NjbC1oYXMtcG90ZW50aWFsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblNsb3RNb3VzZU91dCA9IGZ1bmN0aW9uKGhvdmVyZWRJbnB1dCkge1xuXG4gICAgICAgIGlmICggdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoICE9PSAxICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5yZW1vdmVDbGFzcygnY2NsLWhhcy1wb3RlbnRpYWwnKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TbG90Q2xpY2sgPSBmdW5jdGlvbihjbGlja2VkSW5wdXQsIGV2ZW50KXtcbiAgICAgICAgXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGNsaWNrSW5wdXRJbmRleCA9IHRoYXQuJHJvb21TbG90SW5wdXRzLmluZGV4KGNsaWNrZWRJbnB1dCksXG4gICAgICAgICAgICBtaW5JbmRleCA9IGNsaWNrSW5wdXRJbmRleCAtIHRoYXQubWF4U2xvdHMsXG4gICAgICAgICAgICBtYXhJbmRleCA9IGNsaWNrSW5wdXRJbmRleCArIHRoYXQubWF4U2xvdHM7XG5cbiAgICAgICAgLy8gZGlzYWJsZXMgc2xvdHMgdGhhdCBhcmUgb3V0c2lkZSBvZiBtYXggc2VsZWN0YWJsZSBhcmVhXG4gICAgICAgIGZ1bmN0aW9uIF9pc29sYXRlU2VsZWN0YWJsZVNsb3RzKCkge1xuXG4gICAgICAgICAgICAvLyBvY2N1cGllZCBzbG90cyB3aWxsIGFmZmVjdCB3aGF0IG5lYXJieSBzbG90cyBjYW4gYmUgc2VsZWN0ZWRcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBhbnkgb2NjdXBpZWQgc2xvdHMsIGlmIHRoZXkgZXhpc3RcbiAgICAgICAgICAgICQoJy5jY2wtYy1yb29tX19zbG90LmNjbC1pcy1vY2N1cGllZCcpLmVhY2goZnVuY3Rpb24oaSxzbG90KXtcblxuICAgICAgICAgICAgICAgIC8vIGdldCBvY2N1cGllZCBzbG90J3MgaW5wdXQsIGZpbmQgaXQncyBpbmRleCBhbW91bmcgYWxsIHNsb3QgaW5wdXRzXG4gICAgICAgICAgICAgICAgdmFyIHNsb3RJbnB1dCA9ICQoc2xvdCkuZmluZCgnW3R5cGU9XCJjaGVja2JveFwiXScpLFxuICAgICAgICAgICAgICAgICAgICBvY2N1cGllZEluZGV4ID0gdGhhdC4kcm9vbVNsb3RJbnB1dHMuaW5kZXgoc2xvdElucHV0KTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIG9jY3VwaWVkIHNsb3QgZmFsbHMgaW4gdGhlIHNlbGVjdGFibGUgYXJlYVxuICAgICAgICAgICAgICAgIGlmICggbWluSW5kZXggPCBvY2N1cGllZEluZGV4ICYmIG9jY3VwaWVkSW5kZXggPCBtYXhJbmRleCApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBvY2N1cGllZCBzbG90IGlzIEJFRk9SRSBjbGlja2VkIHNsb3QsIHNldCBpdCBhcyB0aGUgbWluXG4gICAgICAgICAgICAgICAgICAgIGlmICggb2NjdXBpZWRJbmRleCA8IGNsaWNrSW5wdXRJbmRleCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkluZGV4ID0gb2NjdXBpZWRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBvY2N1cGllZCBzbG90IGlzIEFGVEVSIGNsaWNrZWQgc2xvdCwgc2V0IGl0IGFzIHRoZSBtYXhcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBvY2N1cGllZEluZGV4ID4gY2xpY2tJbnB1dEluZGV4ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4SW5kZXggPSBvY2N1cGllZEluZGV4O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHNsb3RzLCBkaXNhYmxlIG9uZXMgdGhhdCBmYWxsIG91dHNpZGUgb2YgbWluL21heCBpbmRleGVzXG4gICAgICAgICAgICB0aGF0LiRyb29tU2xvdElucHV0cy5lYWNoKGZ1bmN0aW9uKGksaW5wdXQpe1xuICAgICAgICAgICAgICAgIGlmICggaSA8PSBtaW5JbmRleCB8fCBpID49IG1heEluZGV4ICkge1xuICAgICAgICAgICAgICAgICAgICAkKGlucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykuYWRkQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIGlmIG5vIGlucHV0cyB5ZXQgc2VsZWN0ZWQsIHRoaXMgaXMgdGhlIGZpcnN0XG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgaWYgKCB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPT09IDAgKSB7XG5cbiAgICAgICAgICAgIF9pc29sYXRlU2VsZWN0YWJsZVNsb3RzKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogaWYgMSBpbnB1dCBzZWxlY3RlZCwgc2VsZWN0aW5nIDJuZCBzbG90XG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgaWYgKCB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPT09IDEgKSB7XG5cbiAgICAgICAgICAgIGlmICggJChjbGlja2VkSW5wdXQpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5oYXNDbGFzcygnY2NsLWlzLWRpc2FibGVkJykgKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5yZW1vdmVDbGFzcygnY2NsLWlzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogaWYgMiBvciBtb3JlIHNsb3RzIGFscmVhZHkgc2VsZWN0ZWRcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgICAgICBpZiAoIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCA+PSAyICkge1xuXG4gICAgICAgICAgICAvLyBpZiB0aGUgY2xpY2tlZCBpbnB1dCBpcyBub3QgcGFydCBvZiBjdXJyZW50IHNlbGVjdGlvblxuICAgICAgICAgICAgLy8gY2xlYXIgYWxsIHNlbGVjdGVkIGlucHV0c1xuICAgICAgICAgICAgaWYgKCB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKCBjbGlja2VkSW5wdXQgKSA8IDAgKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGF0LmNsZWFyQWxsU2xvdHMoKTtcbiAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdGVkU2xvdElucHV0cyA9IFtdO1xuXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBpZiBjbGlja2VkIGlucHV0IGlzIG9uZSBvZiB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGlucHV0c1xuICAgICAgICAgICAgLy8ga2VlcCB0aGF0IG9uZSBzZWxlY3RlZCBhbmQgZGVzZWxlY3QgdGhlIHJlc3RcbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gcHJldmVudCBjaGFuZ2UgZXZlbnQgZnJvbSBmaXJpbmdcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbnB1dCBpbmRleCBmcm9tIGFtb25nIHNlbGVjdGVkIGlucHV0c1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZFNsb3RJbmRleCA9IHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2YoIGNsaWNrZWRJbnB1dCApLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZElucHV0cyA9ICQuZXh0ZW5kKCBbXSwgdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMgKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBjbGVhciBhbGwgaW5wdXRzIEVYQ0VQVCB0aGUgY2xpY2tlZCBvbmVcbiAgICAgICAgICAgICAgICBzZWxlY3RlZElucHV0cy5mb3JFYWNoKGZ1bmN0aW9uKGlucHV0LGkpe1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHNlbGVjdGVkU2xvdEluZGV4ICE9IGkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmNsZWFyU2xvdChpbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAvLyBzZXQgc2VsZWN0ZWQgaW5wdXRzIHRvIGp1c3QgdGhpcyBvbmVcbiAgICAgICAgICAgICAgICAvLyB0aGF0LnNlbGVjdGVkU2xvdElucHV0cyA9IFsgdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHNbc2VsZWN0ZWRTbG90SW5kZXhdIF07XG5cbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGN1cnJlbnQgZHVyYXRpb24gdGV4dFxuICAgICAgICAgICAgICAgIHRoYXQuc2V0Q3VycmVudER1cmF0aW9uVGV4dCgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9pc29sYXRlU2VsZWN0YWJsZVNsb3RzKCk7XG5cbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uU2xvdENoYW5nZSA9IGZ1bmN0aW9uKGNoYW5nZWRJbnB1dCl7XG4gICAgICAgIFxuICAgICAgICAvLyBpZiBpbnB1dCBjaGVja2VkLCBhZGQgaXQgdG8gc2VsZWN0ZWQgc2V0XG4gICAgICAgIGlmICggJChjaGFuZ2VkSW5wdXQpLnByb3AoJ2NoZWNrZWQnKSApIHtcblxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMucHVzaChjaGFuZ2VkSW5wdXQpO1xuICAgICAgICAgICAgJChjaGFuZ2VkSW5wdXQpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5hZGRDbGFzcygnY2NsLWlzLWNoZWNrZWQnKTtcbiAgIFxuICAgICAgICB9IFxuICAgICAgICBcbiAgICAgICAgLy8gaWYgaW5wdXQgdW5jaGVja2VkLCByZW1vdmUgaXQgZnJvbSB0aGUgc2VsZWN0ZWQgc2V0XG4gICAgICAgIGVsc2UgeyBcblxuICAgICAgICAgICAgdmFyIGNoYW5nZWRJbnB1dEluZGV4ID0gdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZihjaGFuZ2VkSW5wdXQpO1xuXG4gICAgICAgICAgICBpZiAoIGNoYW5nZWRJbnB1dEluZGV4ID4gLTEgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuc3BsaWNlKCBjaGFuZ2VkSW5wdXRJbmRleCwgMSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChjaGFuZ2VkSW5wdXQpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5yZW1vdmVDbGFzcygnY2NsLWlzLWNoZWNrZWQnKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdG9nZ2xlIHJlc2V0IGJ1dHRvblxuICAgICAgICBpZiAoIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0bi5zaG93KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0bi5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBoaWdobGlnaHQgc2xvdHMgYmV0d2VlbiB0d28gZW5kc1xuICAgICAgICBpZiAoIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCA9PT0gMiApIHtcblxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGF0LiRlbC5maW5kKCcuY2NsLWlzLWNoZWNrZWQnKS5maXJzdCgpLm5leHRVbnRpbCgnLmNjbC1pcy1jaGVja2VkJykuZWFjaChmdW5jdGlvbihpLHNsb3Qpe1xuICAgICAgICAgICAgICAgIHZhciBzbG90SW5wdXQgPSAkKHNsb3QpLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpO1xuICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzLnB1c2goc2xvdElucHV0WzBdKTtcbiAgICAgICAgICAgICAgICB0aGF0LmFjdGl2YXRlU2xvdChzbG90KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRDdXJyZW50RHVyYXRpb25UZXh0KCk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmNsZWFyU2xvdCA9IGZ1bmN0aW9uKHNsb3QpIHtcbiAgICAgICAgLy8gc2xvdCBjYW4gYmUgZWl0aGVyIHRoZSBjaGVja2JveCBpbnB1dCAtT1ItIHRoZSBjaGVja2JveCdzIGNvbnRhaW5lclxuXG4gICAgICAgIHZhciBpbnB1dEluZGV4O1xuXG4gICAgICAgIC8vIGlmIGl0J3MgdGhlIGNoZWNrYm94LlxuICAgICAgICBpZiAoICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSApIHtcbiAgICAgICAgIFxuICAgICAgICAgICAgJChzbG90KVxuICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJyxmYWxzZSlcbiAgICAgICAgICAgICAgICAucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLWlzLWNoZWNrZWQgY2NsLWhhcy1wb3RlbnRpYWwnKTtcblxuICAgICAgICAgICAgLy8gZ2V0IGluZGV4IG9mIHRoZSBpbnB1dCBmcm9tIHNlbGVjdGVkIHNldFxuICAgICAgICAgICAgaW5wdXRJbmRleCA9IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2Yoc2xvdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gaWYgaXQncyB0aGUgY29udGFpbmVyXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkKHNsb3QpLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKTtcblxuICAgICAgICAgICAgJChzbG90KS5yZW1vdmVDbGFzcygnY2NsLWlzLWNoZWNrZWQgY2NsLWhhcy1wb3RlbnRpYWwnKTtcbiAgICAgICAgICAgICRpbnB1dC5wcm9wKCdjaGVja2VkJyxmYWxzZSk7XG5cbiAgICAgICAgICAgIC8vIGdldCBpbmRleCBvZiB0aGUgaW5wdXQgZnJvbSBzZWxlY3RlZCBzZXRcbiAgICAgICAgICAgIGlucHV0SW5kZXggPSB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKCAkaW5wdXRbMF0gKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGlucHV0IGZyb20gc2VsZWN0ZWQgc2V0XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnNwbGljZSggaW5wdXRJbmRleCwgMSApO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5jbGVhckFsbFNsb3RzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHJlc2V0U2VsZWN0aW9uQnRuLmhpZGUoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIEV4dGVuZCB0aGUgc2VsZWN0ZWQgaW5wdXRzIGFycmF5IHRvIGEgbmV3IHZhcmlhYmxlLlxuICAgICAgICAvLyBUaGUgc2VsZWN0ZWQgaW5wdXRzIGFycmF5IGNoYW5nZXMgd2l0aCBldmVyeSBjbGVhclNsb3QoKSBjYWxsXG4gICAgICAgIC8vIHNvLCBiZXN0IHRvIGxvb3AgdGhyb3VnaCBhbiB1bmNoYW5naW5nIGFycmF5LlxuICAgICAgICB2YXIgc2VsZWN0ZWRJbnB1dHMgPSAkLmV4dGVuZCggW10sIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzICk7XG5cbiAgICAgICAgJChzZWxlY3RlZElucHV0cykuZWFjaChmdW5jdGlvbihpLGlucHV0KXtcbiAgICAgICAgICAgIHRoYXQuY2xlYXJTbG90KGlucHV0KTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmFjdGl2YXRlU2xvdCA9IGZ1bmN0aW9uKHNsb3QpIHtcbiAgICAgICAgLy8gc2xvdCBjYW4gYmUgZWl0aGVyIHRoZSBjaGVja2JveCAtT1ItIHRoZSBjaGVja2JveCdzIGNvbnRhaW5lclxuXG4gICAgICAgIHZhciBzbG90SXNDaGVja2JveCA9ICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSxcbiAgICAgICAgICAgICRjb250YWluZXIgPSBzbG90SXNDaGVja2JveCA/ICQoc2xvdCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpIDogJChzbG90KTtcblxuICAgICAgICAvLyBuZXZlciBzZXQgYW4gb2NjdXBpZWQgc2xvdCBhcyBhY3RpdmVcbiAgICAgICAgaWYgKCAkY29udGFpbmVyLmhhc0NsYXNzKCdjY2wtaXMtb2NjdXBpZWQnKSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggJChzbG90KS5pcygnW3R5cGU9XCJjaGVja2JveFwiXScpICkge1xuXG4gICAgICAgICAgICAvLyBpZiBpdCdzIHRoZSBjaGVja2JveC5cbiAgICAgICAgIFxuICAgICAgICAgICAgJChzbG90KS5wcm9wKCdjaGVja2VkJyx0cnVlKTtcbiAgICAgICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gaWYgaXQncyB0aGUgY29udGFpbmVyXG5cbiAgICAgICAgICAgICRjb250YWluZXJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJylcbiAgICAgICAgICAgICAgICAuZmluZCgnW3R5cGU9XCJjaGVja2JveFwiXScpXG4gICAgICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJyx0cnVlKTtcblxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5zZXRMb2FkaW5nID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dC50ZXh0KCdMb2FkaW5nIHNjaGVkdWxlLi4uJyk7XG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUudW5zZXRMb2FkaW5nID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5zZXRDdXJyZW50RHVyYXRpb25UZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9ICQuZXh0ZW5kKFtdLHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzKSxcbiAgICAgICAgICAgIHNvcnRlZFNlbGVjdGlvbiA9IHNlbGVjdGlvbi5zb3J0KGZ1bmN0aW9uKGEsYil7IFxuICAgICAgICAgICAgICAgIHJldHVybiBhLnZhbHVlID4gYi52YWx1ZTsgXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHNlbGVjdGlvbkxlbmd0aCA9IHNvcnRlZFNlbGVjdGlvbi5sZW5ndGg7XG4gICAgICAgIFxuICAgICAgICBpZiAoIHNlbGVjdGlvbkxlbmd0aCA+IDAgKSB7XG5cbiAgICAgICAgICAgIHZhciB0aW1lMVZhbCA9IHNvcnRlZFNlbGVjdGlvblswXS52YWx1ZSxcbiAgICAgICAgICAgICAgICByZWFkYWJsZVRpbWUxID0gdGhpcy5yZWFkYWJsZVRpbWUoIG5ldyBEYXRlKHRpbWUxVmFsKSApO1xuXG4gICAgICAgICAgICB2YXIgdGltZTJWYWwgPSAoIHNlbGVjdGlvbkxlbmd0aCA+PSAyICkgPyBzb3J0ZWRTZWxlY3Rpb25bc29ydGVkU2VsZWN0aW9uLmxlbmd0aCAtIDFdLnZhbHVlIDogdGltZTFWYWwsXG4gICAgICAgICAgICAgICAgdGltZTJUID0gbmV3IERhdGUodGltZTJWYWwpLmdldFRpbWUoKSArICggdGhpcy5zbG90TWludXRlcyAqIDYwICogMTAwMCApLFxuICAgICAgICAgICAgICAgIHJlYWRhYmxlVGltZTIgPSB0aGlzLnJlYWRhYmxlVGltZSggbmV3IERhdGUodGltZTJUKSApO1xuXG4gICAgICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoICdGcm9tICcgKyByZWFkYWJsZVRpbWUxICsgJyB0byAnICsgcmVhZGFibGVUaW1lMiApO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoJ1BsZWFzZSBzZWxlY3QgYXZhaWxhYmxlIHRpbWUgc2xvdHMnKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnNldE1heFRpbWVUZXh0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG1heE1pbnV0ZXMgPSB0aGlzLm1heFNsb3RzICogdGhpcy5zbG90TWludXRlcyxcbiAgICAgICAgICAgIG1heFRleHQ7XG5cbiAgICAgICAgc3dpdGNoKG1heE1pbnV0ZXMpIHtcbiAgICAgICAgICAgIGNhc2UgMjQwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTgwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTIwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjA6XG4gICAgICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgLyA2MCArICcgaG91cnMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyArICdtaW5zJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJG1heFRpbWUudGV4dCggbWF4VGV4dCApO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUucmVhZGFibGVUaW1lID0gZnVuY3Rpb24oIGRhdGVPYmosIGZvcm1hdCApIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBsb2NhbGVTdHJpbmcgPSBkYXRlT2JqLnRvTG9jYWxlU3RyaW5nKCB0aGlzLmxvY2FsZSwgdGhpcy50aW1lWm9uZSApLCAvLyBlLmcuIC0tPiBcIjExLzcvMjAxNywgNDozODozMyBBTVwiXG4gICAgICAgICAgICBsb2NhbGVUaW1lID0gbG9jYWxlU3RyaW5nLnNwbGl0KFwiLCBcIilbMV07IC8vIFwiNDozODozMyBBTVwiXG5cbiAgICAgICAgdmFyIHRpbWUgPSBsb2NhbGVUaW1lLnNwbGl0KCcgJylbMF0sIC8vIFwiNDozODozM1wiLFxuICAgICAgICAgICAgdGltZU9iaiA9IHtcbiAgICAgICAgICAgICAgICBhOiBsb2NhbGVUaW1lLnNwbGl0KCcgJylbMV0udG9Mb3dlckNhc2UoKSwgLy8gKGFtIG9yIHBtKSAtLT4gXCJhXCJcbiAgICAgICAgICAgICAgICBoOiB0aW1lLnNwbGl0KCc6JylbMF0sIC8vIFwiNFwiXG4gICAgICAgICAgICAgICAgbTogdGltZS5zcGxpdCgnOicpWzFdLCAvLyBcIjM4XCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgaWYgKCBmb3JtYXQgJiYgdHlwZW9mIGZvcm1hdCA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBmb3JtYXRBcnIgPSBmb3JtYXQuc3BsaXQoJycpLFxuICAgICAgICAgICAgICAgIHJlYWRhYmxlQXJyID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IGZvcm1hdEFyci5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHRpbWVPYmpbZm9ybWF0QXJyW2ldXSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVBcnIucHVzaCh0aW1lT2JqW2Zvcm1hdEFycltpXV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlQXJyLnB1c2goZm9ybWF0QXJyW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZWFkYWJsZUFyci5qb2luKCcnKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRpbWVPYmouaCArICc6JyArIHRpbWVPYmoubSArIHRpbWVPYmouYTtcbiAgICAgICAgXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblN1Ym1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcblxuICAgICAgICBpZiAoICEgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoICkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLiRmb3JtTm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgLmNzcygnZGlzcGxheScsJ25vbmUnKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnY2NsLWlzLWVycm9yJylcbiAgICAgICAgICAgICAgICAudGV4dCgnUGxlYXNlIHNlbGVjdCBhIHRpbWUgZm9yIHlvdXIgcmVzZXJ2YXRpb24nKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyh0aGlzLiRmb3JtQ29udGVudClcbiAgICAgICAgICAgICAgICAuc2xpZGVEb3duKENDTC5EVVJBVElPTik7ICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRmb3JtTm90aWZpY2F0aW9uLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgc29ydGVkU2VsZWN0aW9uID0gJC5leHRlbmQoW10sIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzKS5zb3J0KGZ1bmN0aW9uKGEsYil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEudmFsdWUgPiBiLnZhbHVlO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBzdGFydCA9IHNvcnRlZFNlbGVjdGlvblswXS52YWx1ZSxcbiAgICAgICAgICAgIGVuZCA9ICggc29ydGVkU2VsZWN0aW9uLmxlbmd0aCA+IDEgKSA/ICQoIHNvcnRlZFNlbGVjdGlvblsgc29ydGVkU2VsZWN0aW9uLmxlbmd0aCAtIDEgXSApLmRhdGEoJ3RvJykgOiAkKCBzb3J0ZWRTZWxlY3Rpb25bMF0gKS5kYXRhKCd0bycpLFxuICAgICAgICAgICAgcGF5bG9hZCA9IHtcbiAgICAgICAgICAgICAgICBcImlpZFwiOjMzMyxcbiAgICAgICAgICAgICAgICBcInN0YXJ0XCI6IHN0YXJ0LFxuICAgICAgICAgICAgICAgIFwiZm5hbWVcIjogdGhpcy4kZWxbMF0uZm5hbWUudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJsbmFtZVwiOiB0aGlzLiRlbFswXS5sbmFtZS52YWx1ZSxcbiAgICAgICAgICAgICAgICBcImVtYWlsXCI6IHRoaXMuJGVsWzBdLmVtYWlsLnZhbHVlLFxuICAgICAgICAgICAgICAgIFwibmlja25hbWVcIjogdGhpcy4kZWxbMF0ubmlja25hbWUudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJib29raW5nc1wiOltcbiAgICAgICAgICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5yb29tSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRvXCI6IGVuZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnY2NsLWlzLXN1Ym1pdHRpbmcnKTtcbiAgICAgICAgdGhpcy4kZm9ybUNhbmNlbC5wcm9wKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgIHRoaXMuJGZvcm1TdWJtaXQudGV4dCgnU2VuZGluZy4uLicpLnByb3AoJ2Rpc2FibGVkJyx0cnVlKTtcblxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIGFjdGlvbjogJ3JlcXVlc3RfYm9va2luZycsXG4gICAgICAgICAgICBjY2xfbm9uY2U6IENDTC5ub25jZSxcbiAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWRcbiAgICAgICAgfTtcblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTWFrZSBhIHJlcXVlc3QgaGVyZSB0byByZXNlcnZlIHNwYWNlXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgICAgICAkLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogQ0NMLmFqYXhfdXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgX2hhbmRsZVN1Ym1pdFJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLXN1Ym1pdHRpbmcnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIF9oYW5kbGVTdWJtaXRSZXNwb25zZShyZXNwb25zZSkge1xuXG4gICAgICAgICAgICB2YXIgcmVzcG9uc2VIVE1MLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlT2JqZWN0ID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG5cbiAgICAgICAgICAgIGlmICggcmVzcG9uc2VPYmplY3QuYm9va2luZ19pZCApIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwgPSAgWyc8cCBjbGFzcz1cImNjbC1oMiBjY2wtdS1tdC0wXCI+U3VjY2VzcyE8L3A+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxwIGNsYXNzPVwiY2NsLWg0XCI+WW91ciBib29raW5nIElEIGlzIDxzcGFuIGNsYXNzPVwiY2NsLXUtY29sb3Itc2Nob29sXCI+JyArIHJlc3BvbnNlT2JqZWN0LmJvb2tpbmdfaWQgKyAnPC9zcGFuPjwvcD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHAgY2xhc3M9XCJjY2wtaDRcIj5QbGVhc2UgY2hlY2sgeW91ciBlbWFpbCB0byBjb25maXJtIHlvdXIgYm9va2luZy48L3A+J107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTCA9ICBbJzxwIGNsYXNzPVwiY2NsLWgzIGNjbC11LW10LTBcIj5Tb3JyeSwgYnV0IHdlIGNvdWxkblxcJ3QgcHJvY2VzcyB5b3VyIHJlc2VydmF0aW9uLjwvcD4nLCc8cCBjbGFzcz1cImNjbC1oNFwiPkVycm9yczo8L3A+J107XG4gICAgICAgICAgICAgICAgJChyZXNwb25zZU9iamVjdC5lcnJvcnMpLmVhY2goZnVuY3Rpb24oaSwgZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwucHVzaCgnPHAgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3JcIj4nICsgZXJyb3IgKyAnPC9wPicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTC5wdXNoKCc8cCBjbGFzcz1cImNjbC1oNFwiPlBsZWFzZSB0YWxrIHRvIHlvdXIgbmVhcmVzdCBsaWJyYXJpYW4gZm9yIGhlbHAuPC9wPicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGF0LiRmb3JtQ2FuY2VsLnByb3AoJ2Rpc2FibGVkJyxmYWxzZSkudGV4dCgnQ2xvc2UnKTtcbiAgICAgICAgICAgIHRoYXQuJGZvcm1TdWJtaXQuaGlkZSgpO1xuICAgICAgICAgICAgdGhhdC4kZm9ybVJlbG9hZC5zaG93KCk7XG5cbiAgICAgICAgICAgIHRoYXQuJGZvcm1Db250ZW50LmFuaW1hdGUoe29wYWNpdHk6IDB9LCBDQ0wuRFVSQVRJT04pO1xuICAgICAgICAgICAgdGhhdC4kZm9ybVJlc3BvbnNlXG4gICAgICAgICAgICAgICAgLmRlbGF5KENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuaHRtbChyZXNwb25zZUhUTUwpO1xuICAgICAgICAgICAgdGhhdC4kZm9ybUNvbnRlbnRcbiAgICAgICAgICAgICAgICAuZGVsYXkoQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5hbmltYXRlKHtoZWlnaHQ6IHRoYXQuJGZvcm1SZXNwb25zZS5oZWlnaHQoKSArICdweCcgfSwgQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5jc3Moe3pJbmRleDogJy0xJ30pO1xuXG4gICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLXN1Ym1pdHRpbmcnKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnJlbG9hZEZvcm0gPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZm9ybUNhbmNlbC50ZXh0KCdDYW5jZWwnKTtcbiAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdC50ZXh0KCdTdWJtaXQnKS5wcm9wKCdkaXNhYmxlZCcsZmFsc2UpLnNob3coKTtcbiAgICAgICAgdGhpcy4kZm9ybVJlbG9hZC5oaWRlKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNsZWFyQWxsU2xvdHMoKTtcblxuICAgICAgICB0aGlzLiRmb3JtUmVzcG9uc2VcbiAgICAgICAgICAgIC5hbmltYXRlKHtvcGFjaXR5OiAwfSwgQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgLmRlbGF5KENDTC5EVVJBVElPTilcbiAgICAgICAgICAgIC5odG1sKCcnKTtcbiAgICAgICAgdGhpcy4kZm9ybUNvbnRlbnRcbiAgICAgICAgICAgIC5kZWxheShDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAuY3NzKHsgaGVpZ2h0OiAnJywgekluZGV4OiAnJyB9KVxuICAgICAgICAgICAgLmFuaW1hdGUoe29wYWNpdHk6IDF9LCBDQ0wuRFVSQVRJT04pO1xuXG4gICAgICAgIHRoaXMuc2V0TG9hZGluZygpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy51cGRhdGVTY2hlZHVsZURhdGEoKTtcbiAgICB9O1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuICAgIC8vIEhlbHBlcnNcblxuICAgIGZ1bmN0aW9uIF9zb3J0QnlLZXkoIGFyciwga2V5LCBvcmRlciApIHtcbiAgICAgICAgZnVuY3Rpb24gc29ydEFTQyhhLGIpIHtcbiAgICAgICAgICAgIGlmIChhW2tleV0gPCBiW2tleV0pe1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhW2tleV0gPiBiW2tleV0pe1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc29ydERFU0MoYSxiKSB7XG4gICAgICAgICAgICBpZiAoYVtrZXldID4gYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYVtrZXldIDwgYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICggJ0RFU0MnID09PSBvcmRlciApIHtcbiAgICAgICAgICAgIGFyci5zb3J0KHNvcnRERVNDKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyci5zb3J0KHNvcnRBU0MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmpzLXJvb20tcmVzLWZvcm0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgUm9vbVJlc0Zvcm0odGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKlxuICogU2xpZGVUb2dnbGVcbiAqIFxuICogIHRhYnMgZm9yIGhpZGluZyBhbmQgc2hvd2luZyBhZGRpdGlvbmFsIGNvbnRlbnRcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIHNsaWRlVG9nZ2xlTGlzdCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgICAgICAgICAgICAgICAgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kc2xpZGVUb2dnbGVMaW5rICAgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtc2xpZGVUb2dnbGVfX3RpdGxlJyk7XG4gICAgICAgIHRoaXMuJHRvZ2dsZUNvbnRhaW5lciAgID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNsaWRlVG9nZ2xlX19jb250YWluZXInKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBzbGlkZVRvZ2dsZUxpc3QucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoYXQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kc2xpZGVUb2dnbGVMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2dCl7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIC8vZ2V0IHRoZSB0YXJnZXQgdG8gYmUgb3BlbmVkXG4gICAgICAgICAgICB2YXIgY2xpY2tJdGVtID0gJCh0aGlzKTtcbiAgICAgICAgICAgIC8vZ2V0IHRoZSBkYXRhIHRhcmdldCB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoaXMgbGlua1xuICAgICAgICAgICAgdmFyIHRhcmdldF9jb250ZW50ID0gY2xpY2tJdGVtLmF0dHIoJ2RhdGEtdG9nZ2xlVGl0bGUnKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9hZGQgdGhlIGFjdGl2ZSBjbGFzcyBzbyB3ZSBjYW4gZG8gc3R5bGluZ3MgYW5kIHRyYW5zaXRpb25zXG4gICAgICAgICAgICBjbGlja0l0ZW1cbiAgICAgICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKVxuICAgICAgICAgICAgICAgIC5zaWJsaW5ncygpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvL3RvZ2dsZSBhcmlhXG4gICAgICAgICAgICBpZiAoY2xpY2tJdGVtLmF0dHIoICdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJykge1xuICAgICAgICAgICAgICAgICAgICAkKGNsaWNrSXRlbSkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKGNsaWNrSXRlbSkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL2xvY2F0ZSB0aGUgdGFyZ2V0IGVsZW1lbnQgYW5kIHNsaWRldG9nZ2xlIGl0XG4gICAgICAgICAgICBfdGhhdC4kdG9nZ2xlQ29udGFpbmVyXG4gICAgICAgICAgICAgICAgLmZpbmQoICdbZGF0YS10b2dnbGVUYXJnZXQ9XCInICsgdGFyZ2V0X2NvbnRlbnQgKyAnXCJdJyApXG4gICAgICAgICAgICAgICAgLnNsaWRlVG9nZ2xlKCdmYXN0Jyk7XG4gICAgICAgICAgICAgICAgLy90b2dnbGUgYXJpYS1leHBhbmRlZFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy90b2dnbGUgYXJpYVxuICAgICAgICAgICAgaWYgKF90aGF0LiR0b2dnbGVDb250YWluZXIuYXR0ciggJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoX3RoYXQuJHRvZ2dsZUNvbnRhaW5lcikuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKF90aGF0LiR0b2dnbGVDb250YWluZXIpLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWMtc2xpZGVUb2dnbGUnKS5lYWNoKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IHNsaWRlVG9nZ2xlTGlzdCh0aGlzKTsgICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU21vb3RoIFNjcm9sbGluZ1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXG4gICAgICAgICQoJy5qcy1zbW9vdGgtc2Nyb2xsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcykuZGF0YSgndGFyZ2V0JykgfHwgJCh0aGlzKS5hdHRyKCdocmVmJyksXG4gICAgICAgICAgICAgICAgJHRhcmdldCA9ICQodGFyZ2V0KSxcbiAgICAgICAgICAgICAgICBzY3JvbGxPZmZzZXQgPSAwO1xuXG4gICAgICAgICAgICAkKCcuY2NsLWlzLWZpeGVkJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHNjcm9sbE9mZnNldCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCAkdGFyZ2V0Lmxlbmd0aCApIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VG9wID0gJHRhcmdldC5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoIHsgJ3Njcm9sbFRvcCc6IHRhcmdldFRvcCAtIHNjcm9sbE9mZnNldCB9LCA4MDAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBTdGlja2llc1xuICogXG4gKiBCZWhhdmlvdXIgZm9yIHN0aWNreSBlbGVtZW50cy5cbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgICR3aW5kb3cgPSAkKHdpbmRvdyksXG4gICAgICAgIGNsYXNzTmFtZSA9IHtcbiAgICAgICAgICAgIGlzRml4ZWQ6ICdjY2wtaXMtZml4ZWQnXG4gICAgICAgIH07XG5cbiAgICB2YXIgU3RpY2t5ID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIC8vIHZhcmlhYmxlc1xuICAgICAgICB2YXIgJGVsID0gJChlbCksXG4gICAgICAgICAgICBoZWlnaHQgPSAkZWwub3V0ZXJIZWlnaHQoKSxcbiAgICAgICAgICAgIG9mZnNldCA9ICRlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgIG9wdGlvbnMgPSAkZWwuZGF0YSgnc3RpY2t5JyksXG4gICAgICAgICAgICB3cmFwcGVyID0gJCgnPGRpdiBjbGFzcz1cImpzLXN0aWNreS13cmFwcGVyXCI+PC9kaXY+JykuY3NzKHsgaGVpZ2h0OiBoZWlnaHQgKyAncHgnIH0pO1xuXG4gICAgICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG9mZnNldDogMFxuICAgICAgICB9O1xuXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCggZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMgKTtcblxuICAgICAgICAvLyB3cmFwIGVsZW1lbnRcbiAgICAgICAgJGVsLndyYXAoIHdyYXBwZXIgKTtcblxuICAgICAgICAvLyBzY3JvbGwgbGlzdGVuZXJcbiAgICAgICAgJHdpbmRvdy5zY3JvbGwoIENDTC50aHJvdHRsZSggX29uU2Nyb2xsLCAxMDAgKSApO1xuXG4gICAgICAgIC8vIG9uIHNjcm9sbFxuICAgICAgICBmdW5jdGlvbiBfb25TY3JvbGwoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpICsgb3B0aW9ucy5vZmZzZXQ7XG4gICAgXG4gICAgICAgICAgICBpZiAoIHNjcm9sbFRvcCA+PSBvZmZzZXQudG9wICkge1xuICAgICAgICAgICAgICAgICRlbC5hZGRDbGFzcyggY2xhc3NOYW1lLmlzRml4ZWQgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGVsLnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuaXNGaXhlZCApO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmpzLWlzLXN0aWNreScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBTdGlja3kodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBUb2dnbGUgU2Nob29sc1xuICogXG4gKiBCZWhhdmlvciBmb3Igc2Nob29sIHRvZ2dsZXNcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgaW5pdFNjaG9vbCA9ICQoJ2h0bWwnKS5kYXRhKCdzY2hvb2wnKTtcblxuICAgIHZhciBTY2hvb2xTZWxlY3QgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRzZWxlY3QgPSAkKGVsKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBTY2hvb2xTZWxlY3QucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBzY2hvb2wgPSBnZXRDb29raWUoICdjY2wtc2Nob29sJyApO1xuXG4gICAgICAgIGlmICggaW5pdFNjaG9vbCApIHtcblxuICAgICAgICAgICAgdGhpcy4kc2VsZWN0XG4gICAgICAgICAgICAgICAgLmZpbmQoICdvcHRpb25bdmFsdWU9XCInICsgc2Nob29sICsgJ1wiXScgKVxuICAgICAgICAgICAgICAgIC5hdHRyKCAnc2VsZWN0ZWQnLCAnc2VsZWN0ZWQnICk7XG5cbiAgICAgICAgXHRpZiAoIHNjaG9vbCApIHtcbiAgICAgICAgXHRcdCAkKCdodG1sJykuYXR0cignZGF0YS1zY2hvb2wnLCBzY2hvb2wpO1xuXHRcdFx0fVxuXG5cdFx0fVxuXG4gICAgICAgIHRoaXMuJHNlbGVjdC5jaGFuZ2UoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgJCgnaHRtbCcpLmF0dHIoICdkYXRhLXNjaG9vbCcsIGV2ZW50LnRhcmdldC52YWx1ZSApO1xuXG4gICAgICAgICAgICBlcmFzZUNvb2tpZSggJ2NjbC1zY2hvb2wnICk7XG4gICAgICAgICAgICBzZXRDb29raWUoICdjY2wtc2Nob29sJywgZXZlbnQudGFyZ2V0LnZhbHVlLCA3KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIC8vIENvb2tpZSBmdW5jdGlvbnMgbGlmdGVkIGZyb20gU3RhY2sgT3ZlcmZsb3cgZm9yIG5vd1xuICAgIC8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzE0NTczMjIzL3NldC1jb29raWUtYW5kLWdldC1jb29raWUtd2l0aC1qYXZhc2NyaXB0XG5cdGZ1bmN0aW9uIHNldENvb2tpZShuYW1lLCB2YWx1ZSwgZGF5cykge1xuXHRcdHZhciBleHBpcmVzID0gXCJcIjtcblx0XHRpZiAoZGF5cykge1xuXHRcdFx0dmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xuXHRcdFx0ZGF0ZS5zZXRUaW1lKGRhdGUuZ2V0VGltZSgpICsgKGRheXMgKiAyNCAqIDYwICogNjAgKiAxMDAwKSk7XG5cdFx0XHRleHBpcmVzID0gXCI7IGV4cGlyZXM9XCIgKyBkYXRlLnRvVVRDU3RyaW5nKCk7XG5cdFx0fVxuXHRcdGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArICh2YWx1ZSB8fCBcIlwiKSArIGV4cGlyZXMgKyBcIjsgcGF0aD0vXCI7XG5cdH1cblxuXHRmdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuXHRcdHZhciBuYW1lRVEgPSBuYW1lICsgXCI9XCI7XG5cdFx0dmFyIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBjYS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGMgPSBjYVtpXTtcblx0XHRcdHdoaWxlIChjLmNoYXJBdCgwKSA9PT0gJyAnKSBjID0gYy5zdWJzdHJpbmcoMSwgYy5sZW5ndGgpO1xuXHRcdFx0aWYgKGMuaW5kZXhPZihuYW1lRVEpID09PSAwKSByZXR1cm4gYy5zdWJzdHJpbmcobmFtZUVRLmxlbmd0aCwgYy5sZW5ndGgpO1xuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGZ1bmN0aW9uIGVyYXNlQ29va2llKG5hbWUpIHtcblx0XHRkb2N1bWVudC5jb29raWUgPSBuYW1lICsgJz07IE1heC1BZ2U9LTk5OTk5OTk5Oyc7XG5cdH1cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInNjaG9vbFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBTY2hvb2xTZWxlY3QodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICogVG9vbHRpcHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIHRvb2x0aXBzXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBUb29sdGlwID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLiRlbC5hdHRyKCd0aXRsZScpO1xuICAgICAgICB0aGlzLiR0b29sdGlwID0gJCgnPGRpdiBpZD1cImNjbC1jdXJyZW50LXRvb2x0aXBcIiBjbGFzcz1cImNjbC1jLXRvb2x0aXAgY2NsLWlzLXRvcFwiIHJvbGU9XCJ0b29sdGlwXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNjbC1jLXRvb2x0aXBfX2Fycm93XCI+PC9kaXY+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNjbC1jLXRvb2x0aXBfX2lubmVyXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIFRvb2x0aXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbC5ob3ZlcihmdW5jdGlvbihlKXtcblxuICAgICAgICAgICAgLy8gbW91c2VvdmVyXG5cbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCd0aXRsZScsICcnKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgJ2NjbC1jdXJyZW50LXRvb2x0aXAnKTtcbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuXG4gICAgICAgICAgICBDQ0wucmVmbG93KF90aGlzLiR0b29sdGlwWzBdKTtcblxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IF90aGlzLiRlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgICAgICB3aWR0aCAgPSBfdGhpcy4kZWwub3V0ZXJXaWR0aCgpLFxuICAgICAgICAgICAgICAgIHRvb2x0aXBIZWlnaHQgPSBfdGhpcy4kdG9vbHRpcC5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5jc3Moe1xuICAgICAgICAgICAgICAgIHRvcDogKG9mZnNldC50b3AgLSB0b29sdGlwSGVpZ2h0KSArICdweCcsXG4gICAgICAgICAgICAgICAgbGVmdDogKG9mZnNldC5sZWZ0ICsgKHdpZHRoLzIpKSArICdweCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5hZGRDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgfSwgZnVuY3Rpb24oZSl7IFxuXG4gICAgICAgICAgICAvL21vdXNlb3V0XG5cbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCd0aXRsZScsIF90aGlzLmNvbnRlbnQpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCAnJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5yZW1vdmVDbGFzcygnY2NsLWlzLXNob3duJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5yZW1vdmUoKTtcblxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFRvb2x0aXAodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBXYXlmaW5kaW5nXG4gKiBcbiAqIENvbnRyb2xzIGludGVyZmFjZSBmb3IgbG9va2luZyB1cCBjYWxsIG51bWJlciBsb2NhdGlvbnNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIHRhYnMsIHdheWZpbmRlcjtcbiAgICBcbiAgICB2YXIgVGFicyA9IGZ1bmN0aW9uKGVsKSB7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiR0YWJzID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXRhYicpO1xuICAgICAgICB0aGlzLiR0YWJDb250ZW50cyA9ICQoJy5jY2wtYy10YWJfX2NvbnRlbnQnKTtcbiAgICAgICAgXG5cbiAgICAgICAgdGhpcy4kdGFicy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgJHRhYiA9ICQodGhpcyk7XG4gICAgICAgICAgICAkdGFiLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJHRhYi5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgICAgICAgICAvLyBfdGhpcy4kdGFiQ29udGVudHMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAvLyBfdGhpcy4kdGFiQ29udGVudHMuZmlsdGVyKHRhcmdldCkuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zZXRBY3RpdmUodGFyZ2V0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgVGFicy5wcm90b3R5cGUuc2V0QWN0aXZlID0gZnVuY3Rpb24odGFyZ2V0KXtcbiAgICAgICAgdGhpcy4kdGFicy5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiR0YWJzLmZpbHRlcignW2hyZWY9XCInK3RhcmdldCsnXCJdJykuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMuZmlsdGVyKHRhcmdldCkuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICB9O1xuXG4gICAgdmFyIFdheWZpbmRlciA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5jYWxsTnVtYmVycyA9IHt9O1xuICAgICAgICB0aGlzLiRmb3JtID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtYmVyLXNlYXJjaCcpO1xuICAgICAgICB0aGlzLiRpbnB1dCA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bS1pbnB1dCcpO1xuICAgICAgICB0aGlzLiRzdWJtaXQgPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW0tc3VibWl0Jyk7XG4gICAgICAgIHRoaXMuJG1hcnF1ZWUgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19tYXJxdWVlJyk7XG4gICAgICAgIHRoaXMuJGNhbGxOdW0gPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19jYWxsLW51bScpO1xuICAgICAgICB0aGlzLiR3aW5nID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fd2luZycpO1xuICAgICAgICB0aGlzLiRmbG9vciA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX2Zsb29yJyk7XG4gICAgICAgIHRoaXMuJHN1YmplY3QgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19zdWJqZWN0Jyk7XG4gICAgICAgIHRoaXMuZXJyb3IgPSB7XG4gICAgICAgICAgICBnZXQ6ICc8ZGl2IGNsYXNzPVwiY2NsLWMtYWxlcnQgY2NsLWlzLWVycm9yIGNjbC13YXlmaW5kZXJfX2Vycm9yXCI+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjY2wtYi1jbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+PC9idXR0b24+PGkgY2xhc3M9XCJjY2wtYi1pY29uIGFsZXJ0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBUaGVyZSB3YXMgYW4gZXJyb3IgZmV0Y2hpbmcgY2FsbCBudW1iZXJzLjwvZGl2PicsXG4gICAgICAgICAgICBmaW5kOiAnPGRpdiBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvciBjY2wtd2F5ZmluZGVyX19lcnJvclwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2NsLWItY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPjxpIGNsYXNzPVwiY2NsLWItaWNvbiBhbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gQ291bGQgbm90IGZpbmQgdGhhdCBjYWxsIG51bWJlci4gUGxlYXNlIHRyeSBhZ2Fpbi48L2Rpdj4nXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuJGVycm9yQm94ID0gJCgnLmNjbC1lcnJvci1ib3gnKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICQuZ2V0SlNPTiggQ0NMLmFzc2V0cyArICdqcy9jYWxsLW51bWJlcnMuanNvbicgKVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2FsbE51bWJlcnMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIF90aGlzLmluaXQoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgdGhpcy4kZXJyb3JCb3guYXBwZW5kKCB0aGlzLmVycm9yLmdldCApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnY2NsLWFwcC1hY3RpdmUnKTtcblxuICAgICAgICB0aGlzLiRpbnB1dFxuICAgICAgICAgICAgLmtleXVwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcXVlcnkgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggcXVlcnkgPT09IFwiXCIgKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRzdWJtaXQuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZXNldCgpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3VibWl0LmF0dHIoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kZm9ybS5zdWJtaXQoZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIF90aGlzLnJlc2V0KCk7XG5cbiAgICAgICAgICAgIHZhciBxdWVyeSA9IF90aGlzLiRpbnB1dC52YWwoKTtcblxuICAgICAgICAgICAgJCgnLmNjbC13YXlmaW5kZXJfX2Vycm9yJykucmVtb3ZlKCk7XG4gICAgICAgICAgICBfdGhpcy4kbWFycXVlZS5zaG93KCk7XG4gICAgICAgICAgICBfdGhpcy4kY2FsbE51bS50ZXh0KHF1ZXJ5KTtcbiAgICAgICAgICAgIF90aGlzLmZpbmRSb29tKCBxdWVyeSApO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmdldENhbGxLZXkgPSBmdW5jdGlvbihjYWxsTnVtKSB7XG4gICAgICAgIHZhciBrZXksXG4gICAgICAgICAgICBjYWxsS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY2FsbE51bWJlcnMpO1xuXG4gICAgICAgIGlmICggY2FsbEtleXMubGVuZ3RoID09PSAwICl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsS2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGspe1xuICAgICAgICAgIGlmICggY2FsbE51bSA+PSBrICkge1xuICAgICAgICAgICAga2V5ID0gaztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUuZmluZFJvb20gPSBmdW5jdGlvbihxdWVyeSkge1xuXG4gICAgICAgIHF1ZXJ5ID0gcXVlcnkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBjYWxsS2V5ID0gdGhpcy5nZXRDYWxsS2V5KHF1ZXJ5KSxcbiAgICAgICAgICAgIGNhbGxEYXRhID0ge30sXG4gICAgICAgICAgICBmbG9vcklkO1xuXG4gICAgICAgIGlmICggISBjYWxsS2V5ICkge1xuICAgICAgICAgICAgdGhpcy50aHJvd0ZpbmRFcnJvcigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQoJy5jY2wtYy1zZWFyY2gnKS5vZmZzZXQoKS50b3AgfSk7XG4gICAgICAgIFxuICAgICAgICBjYWxsRGF0YSA9IHRoaXMuY2FsbE51bWJlcnNbY2FsbEtleV07XG5cbiAgICAgICAgdGhpcy4kZmxvb3IudGV4dCggY2FsbERhdGEuZmxvb3IgKTtcbiAgICAgICAgdGhpcy4kd2luZy50ZXh0KCBjYWxsRGF0YS53aW5nICk7XG4gICAgICAgIHRoaXMuJHN1YmplY3QudGV4dCggY2FsbERhdGEuc3ViamVjdCApO1xuXG4gICAgICAgIC8qIFRPRE86XG4gICAgICAgICAqIHNldCBBQ1RVQUwgcm9vbSwgbm90IGp1c3QgdGhlIGZsb29yLiBzdGlsbCB3YWl0aW5nIG9uIGNsaWVudCBcbiAgICAgICAgICogdG8gcHJvdmlkZSBkYXRhIGZvciB3aGljaCBjYWxsIG51bWJlcnMgYmVsb25nIHRvIHdoaWNoIHJvb21zXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiAgICAgICAgZmxvb3JJZCA9IGNhbGxEYXRhLmZsb29yX2ludDtcblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJ2FbaHJlZj1cIiNmbG9vci0nK2Zsb29ySWQrJ1wiXScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJ1tpZCo9XCJyb29tLScrZmxvb3JJZCsnLVwiXScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgdGFicy5zZXRBY3RpdmUoICcjZmxvb3ItJyArIGZsb29ySWQgKTtcbiAgICAgICAgXG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnYVtocmVmKj1cIiNmbG9vci1cIl0nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuY2NsLWMtZmxvb3JfX3Jvb20nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLnRocm93RmluZEVycm9yID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnYVtocmVmKj1cIiNmbG9vci1cIl0nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuY2NsLWMtZmxvb3JfX3Jvb20nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRmbG9vci50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiR3aW5nLnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJHN1YmplY3QudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kZXJyb3JCb3guYXBwZW5kKCB0aGlzLmVycm9yLmZpbmQgKTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1qcy10YWJzJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGFicyA9IG5ldyBUYWJzKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmNjbC1qcy13YXlmaW5kZXInKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB3YXlmaW5kZXIgPSBuZXcgV2F5ZmluZGVyKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiJdfQ==
