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
                $(this).toggleClass('ccl-is-active');
                $subMenu.slideToggle();
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

        // console.log( 'on Submit » ', payload );

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
            that.$formSubmit.remove();
            that.$formContent.animate({opacity: 0}, CCL.DURATION);
            that.$formResponse
                .delay(CCL.DURATION)
                .animate({opacity: 1}, CCL.DURATION)
                .html(responseHTML);
            that.$formContent
                .delay(CCL.DURATION)
                .animate({height: that.$formResponse.height() + 'px' }, CCL.DURATION)
                .css({zIndex: '-1'});

        }

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkcm9wZG93bnMuanMiLCJoZWFkZXItbWVudS10b2dnbGVzLmpzIiwibW9kYWxzLmpzIiwicXVpY2stbmF2LmpzIiwicm9vbS1yZXMuanMiLCJzbW9vdGgtc2Nyb2xsLmpzIiwic3RpY2tpZXMuanMiLCJ0b2dnbGUtc2Nob29scy5qcyIsInRvb2x0aXBzLmpzIiwid2F5ZmluZGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2wwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEdsb2JhbCBWYXJpYWJsZXMuIFxuICovXG5cblxuKGZ1bmN0aW9uICggJCwgd2luZG93ICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wuRFVSQVRJT04gPSAzMDA7XG5cbiAgICBDQ0wuQlJFQUtQT0lOVF9TTSA9IDUwMDtcbiAgICBDQ0wuQlJFQUtQT0lOVF9NRCA9IDc2ODtcbiAgICBDQ0wuQlJFQUtQT0lOVF9MRyA9IDEwMDA7XG4gICAgQ0NMLkJSRUFLUE9JTlRfWEwgPSAxNTAwO1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnaHRtbCcpLnRvZ2dsZUNsYXNzKCduby1qcyBqcycpO1xuICAgIH0pO1xuXG59KShqUXVlcnksIHRoaXMpOyIsIi8qKlxuICogUmVmbG93IHBhZ2UgZWxlbWVudHMuIFxuICogXG4gKiBFbmFibGVzIGFuaW1hdGlvbnMvdHJhbnNpdGlvbnMgb24gZWxlbWVudHMgYWRkZWQgdG8gdGhlIHBhZ2UgYWZ0ZXIgdGhlIERPTSBoYXMgbG9hZGVkLlxuICovXG5cblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLnJlZmxvdyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICB9O1xuXG59KSgpOyIsIi8qKlxuICogR2V0IHRoZSBTY3JvbGxiYXIgd2lkdGhcbiAqIFRoYW5rcyB0byBkYXZpZCB3YWxzaDogaHR0cHM6Ly9kYXZpZHdhbHNoLm5hbWUvZGV0ZWN0LXNjcm9sbGJhci13aWR0aFxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuICAgIFxuICAgIGZ1bmN0aW9uIGdldFNjcm9sbFdpZHRoKCkge1xuICAgICAgICBcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtZWFzdXJlbWVudCBub2RlXG4gICAgICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gcG9zaXRpb24gd2F5IHRoZSBoZWxsIG9mZiBzY3JlZW5cbiAgICAgICAgJChzY3JvbGxEaXYpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogJzEwMHB4JyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMHB4JyxcbiAgICAgICAgICAgIG92ZXJmbG93OiAnc2Nyb2xsJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAnLTk5OTlweCcsXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQoc2Nyb2xsRGl2KTtcblxuICAgICAgICAvLyBHZXQgdGhlIHNjcm9sbGJhciB3aWR0aFxuICAgICAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybihzY3JvbGxiYXJXaWR0aCk7IC8vIE1hYzogIDE1XG5cbiAgICAgICAgLy8gRGVsZXRlIHRoZSBESVYgXG4gICAgICAgICQoc2Nyb2xsRGl2KS5yZW1vdmUoKTtcblxuICAgICAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG4gICAgfVxuICAgIFxuICAgIGlmICggISB3aW5kb3cuQ0NMICkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLmdldFNjcm9sbFdpZHRoID0gZ2V0U2Nyb2xsV2lkdGg7XG4gICAgQ0NMLlNDUk9MTEJBUldJRFRIID0gZ2V0U2Nyb2xsV2lkdGgoKTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogLmRlYm91bmNlKCkgZnVuY3Rpb25cbiAqIFxuICogU291cmNlOiBodHRwczovL2Rhdmlkd2Fsc2gubmFtZS9qYXZhc2NyaXB0LWRlYm91bmNlLWZ1bmN0aW9uXG4gKi9cblxuXG4oZnVuY3Rpb24od2luZG93KSB7XG5cbiAgICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gICAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgICB2YXIgdGhyb3R0bGUgPSBmdW5jdGlvbiAoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgdGltZW91dCwgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgICAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgICAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblxuICAgICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgdGhyb3R0bGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgICAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhyb3R0bGVkLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgIHByZXZpb3VzID0gMDtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHRocm90dGxlZDtcbiAgICB9O1xuXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICB3aW5kb3cuQ0NMLnRocm90dGxlID0gdGhyb3R0bGU7XG5cbn0pKHRoaXMpOyIsIi8qKlxuICogQWNjb3JkaW9uc1xuICogXG4gKiBCZWhhdmlvciBmb3IgYWNjb3JkaW9uIGNvbXBvbmVudHNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIEFjY29yZGlvbiA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdG9nZ2xlID0gdGhpcy4kZWwuY2hpbGRyZW4oJy5jY2wtYy1hY2NvcmRpb25fX3RvZ2dsZScpO1xuICAgICAgICB0aGlzLiRjb250ZW50ID0gdGhpcy4kZWwuY2hpbGRyZW4oJy5jY2wtYy1hY2NvcmRpb25fX2NvbnRlbnQnKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEFjY29yZGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kdG9nZ2xlLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgX3RoaXMuJGNvbnRlbnQuc2xpZGVUb2dnbGUoKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC50b2dnbGVDbGFzcygnY2NsLWlzLW9wZW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1jLWFjY29yZGlvbicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBBY2NvcmRpb24odGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBBbGVydHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIGFsZXJ0c1xuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBEVVJBVElPTiA9IENDTC5EVVJBVElPTjtcblxuICAgIHZhciBBbGVydERpc21pc3MgPSBmdW5jdGlvbigkZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gJGVsLnBhcmVudCgpO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBBbGVydERpc21pc3MucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIF90aGlzLiR0YXJnZXQuYW5pbWF0ZSggeyBvcGFjaXR5OiAwIH0sIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiBEVVJBVElPTixcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF90aGlzLiR0YXJnZXQuc2xpZGVVcCggRFVSQVRJT04sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiR0YXJnZXQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuXG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKGRvY3VtZW50KS5vbiggJ2NsaWNrJywgJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXScsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgdmFyIGRpc21pc3NFbCA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXScpO1xuICAgICAgICAgICAgbmV3IEFsZXJ0RGlzbWlzcyhkaXNtaXNzRWwpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIENhcm91c2Vsc1xuICogXG4gKiBJbml0aWFsaXplIGFuZCBkZWZpbmUgYmVoYXZpb3IgZm9yIGNhcm91c2Vscy4gXG4gKiBVc2VzIHRoZSBTbGljayBTbGlkZXMgalF1ZXJ5IHBsdWdpbiAtLT4gaHR0cDovL2tlbndoZWVsZXIuZ2l0aHViLmlvL3NsaWNrL1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgQ2Fyb3VzZWwgPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5nbG9iYWxEZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgZG90c0NsYXNzOiAnY2NsLWMtY2Fyb3VzZWxfX3BhZ2luZycsXG4gICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB9O1xuXG4gICAgQ2Fyb3VzZWwucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLiRlbC5kYXRhKCksXG4gICAgICAgICAgICBvcHRpb25zID0gZGF0YS5vcHRpb25zIHx8IHt9O1xuICAgICAgICAgICAgXG4gICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZSA9IFtdO1xuXG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zU20gKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfU00sIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNTbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNNZCApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9NRCwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc01kXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc0xnICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX0xHLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zTGdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zWGwgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfWEwsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNYbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoIHRoaXMuZ2xvYmFsRGVmYXVsdHMsIG9wdGlvbnMgKTtcblxuICAgICAgICB2YXIgY2Fyb3VzZWwgPSB0aGlzLiRlbC5zbGljayhvcHRpb25zKSxcbiAgICAgICAgICAgIF90aGlzID0gdGhpcztcblxuICAgICAgICBjYXJvdXNlbC5vbignYmVmb3JlQ2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSl7XG4gICAgICAgICAgICBfdGhpcy4kZWwuZmluZCgnLnNsaWNrLXNsaWRlJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1wYXN0Jyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuZmluZCgnLnNsaWNrLXNsaWRlW2RhdGEtc2xpY2staW5kZXg9XCInK25leHRTbGlkZSsnXCJdJykucHJldkFsbCgpLmFkZENsYXNzKCdjY2wtaXMtcGFzdCcpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmpzLXByb21vLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IENhcm91c2VsKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogRHJvcGRvd25zXG4gKiBcbiAqIEluaXRpYWxpemUgYW5kIGNvbnRyb2wgYmVoYXZpb3IgZm9yIGRyb3Bkb3duIG1lbnVzXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgIFRPR0dMRTogJ1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJyxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lID0ge1xuICAgICAgICAgICAgQUNUSVZFOiAnY2NsLWlzLWFjdGl2ZScsXG4gICAgICAgICAgICBDT05URU5UOiAnY2NsLWMtZHJvcGRvd25fX2NvbnRlbnQnXG4gICAgICAgIH07XG5cbiAgICB2YXIgRHJvcGRvd25Ub2dnbGUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZSA9ICQoZWwpO1xuICAgICAgICB0aGlzLiRwYXJlbnQgPSB0aGlzLiR0b2dnbGUucGFyZW50KCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy4kdG9nZ2xlLmRhdGEoJ3RhcmdldCcpO1xuXG4gICAgICAgIHRoaXMuJGNvbnRlbnQgPSAkKCB0YXJnZXQgKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiR0b2dnbGUuY2xpY2soIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIF90aGlzLnRvZ2dsZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgdmFyIGhhc0FjdGl2ZU1lbnVzID0gJCggJy4nICsgY2xhc3NOYW1lLkNPTlRFTlQgKyAnLicgKyBjbGFzc05hbWUuQUNUSVZFICkubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKCBoYXNBY3RpdmVNZW51cyApe1xuICAgICAgICAgICAgICAgIF9jbGVhck1lbnVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBpc0FjdGl2ZSA9IHRoaXMuJHRvZ2dsZS5oYXNDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuXG4gICAgICAgIGlmICggaXNBY3RpdmUgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNob3dDb250ZW50KCk7XG5cbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLnNob3dDb250ZW50ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB0aGlzLiRjb250ZW50LmFkZENsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgIHRoaXMuJHBhcmVudC5hZGRDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuaGlkZU1lbnUgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiR0b2dnbGUuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICB0aGlzLiRjb250ZW50LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgIHRoaXMuJHBhcmVudC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBfY2xlYXJNZW51cygpIHtcbiAgICAgICAgJCgnLmNjbC1jLWRyb3Bkb3duLCAuY2NsLWMtZHJvcGRvd25fX2NvbnRlbnQnKS5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICAkKCBzZWxlY3Rvci5UT0dHTEUgKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCggc2VsZWN0b3IuVE9HR0xFICkuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IERyb3Bkb3duVG9nZ2xlKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogSGVhZGVyIE1lbnUgVG9nZ2xlc1xuICogXG4gKiBDb250cm9scyBiZWhhdmlvciBvZiBtZW51IHRvZ2dsZXMgaW4gdGhlIGhlYWRlclxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgSGVhZGVyTWVudVRvZ2dsZSA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGhpcy4kZWwuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgIHRoaXMuJHRhcmdldCA9ICQodGhpcy50YXJnZXQpO1xuICAgICAgICB0aGlzLiRwYXJlbnRNZW51ID0gdGhpcy4kZWwuY2xvc2VzdCgnLmNjbC1jLW1lbnUnKTtcbiAgICAgICAgdGhpcy4kY2xvc2VJY29uID0gJCgnPGkgY2xhc3M9XCJjY2wtYi1pY29uIGNsb3NlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPicpO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBIZWFkZXJNZW51VG9nZ2xlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbC5jbGljayhmdW5jdGlvbihldmVudCl7XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSB0YXJnZXQgaXMgYWxyZWFkeSBvcGVuXG4gICAgICAgICAgICBpZiAoIHRoYXQuJHRhcmdldC5oYXNDbGFzcygnY2NsLWlzLWFjdGl2ZScpICkge1xuXG4gICAgICAgICAgICAgICAgLy8gY2xvc2UgdGFyZ2V0IGFuZCByZW1vdmUgYWN0aXZlIGNsYXNzZXMvZWxlbWVudHNcbiAgICAgICAgICAgICAgICB0aGF0LiRwYXJlbnRNZW51LnJlbW92ZUNsYXNzKCdjY2wtaGFzLWFjdGl2ZS1pdGVtJyk7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB0aGF0LiR0YXJnZXQucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKS5mYWRlT3V0KENDTC5EVVJBVElPTik7XG4gICAgICAgICAgICAgICAgdGhhdC4kY2xvc2VJY29uLnJlbW92ZSgpOyAgICAgICBcblxuICAgICAgICAgICAgfSBcblxuICAgICAgICAgICAgLy8gdGFyZ2V0IGlzIG5vdCBvcGVuXG4gICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgIC8vIGNsb3NlIGFuZCByZXNldCBhbGwgYWN0aXZlIG1lbnVzXG4gICAgICAgICAgICAgICAgJCgnLmNjbC1jLW1lbnUuY2NsLWhhcy1hY3RpdmUtaXRlbScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtaGFzLWFjdGl2ZS1pdGVtJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCdhLmNjbC1pcy1hY3RpdmUnKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLmNjbC1iLWljb24uY2xvc2UnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBjbG9zZSBhbmQgcmVzZXQgYWxsIGFjdGl2ZSBzdWItbWVudSBjb250YWluZXJzXG4gICAgICAgICAgICAgICAgJCgnLmNjbC1jLXN1Yi1tZW51LWNvbnRhaW5lci5jY2wtaXMtYWN0aXZlJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJykuZmFkZU91dChDQ0wuRFVSQVRJT04pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gYWN0aXZhdGUgdGhlIHNlbGVjdGVkIHRhcmdldFxuICAgICAgICAgICAgICAgIHRoYXQuJHBhcmVudE1lbnUuYWRkQ2xhc3MoJ2NjbC1oYXMtYWN0aXZlLWl0ZW0nKTtcbiAgICAgICAgICAgICAgICB0aGF0LiR0YXJnZXQuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKS5mYWRlSW4oQ0NMLkRVUkFUSU9OKTtcbiAgICAgICAgICAgICAgICAvLyBwcmVwZW5kIGNsb3NlIGljb25cbiAgICAgICAgICAgICAgICB0aGF0LiRjbG9zZUljb24ucHJlcGVuZFRvKHRoYXQuJGVsKTtcbiAgICAgICAgICAgICAgICBDQ0wucmVmbG93KHRoYXQuJGNsb3NlSWNvblswXSk7XG4gICAgICAgICAgICAgICAgdGhhdC4kY2xvc2VJY29uLmZhZGVJbigyMDApO1xuICAgICAgICAgICAgICAgIHRoYXQuJGVsLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtdG9nZ2xlLWhlYWRlci1tZW51JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IEhlYWRlck1lbnVUb2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBNb2RhbHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIG1vZGFscy4gQmFzZWQgb24gQm9vdHN0cmFwJ3MgbW9kYWxzOiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy80LjAvY29tcG9uZW50cy9tb2RhbC9cbiAqIFxuICogR2xvYmFsczpcbiAqIFNDUk9MTEJBUldJRFRIXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIERVUkFUSU9OID0gMzAwO1xuXG4gICAgdmFyIE1vZGFsVG9nZ2xlID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSAkZWwuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgIHRoaXMuJHRhcmdldCA9ICQodGhpcy50YXJnZXQpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzOyBcblxuICAgICAgICBfdGhpcy4kZWwub24oICdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAoICQoZG9jdW1lbnQuYm9keSkuaGFzQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJykgKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2xvc2VNb2RhbCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93QmFja2Ryb3AoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2hvd01vZGFsKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5zaG93QmFja2Ryb3AgPSBmdW5jdGlvbihjYWxsYmFjayl7XG5cbiAgICAgICAgdmFyIGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHZhciAkYmFja2Ryb3AgPSAkKGJhY2tkcm9wKTtcblxuICAgICAgICAkYmFja2Ryb3AuYWRkQ2xhc3MoJ2NjbC1jLW1vZGFsX19iYWNrZHJvcCcpO1xuICAgICAgICAkYmFja2Ryb3AuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG4gICAgICAgIFxuICAgICAgICBDQ0wucmVmbG93KGJhY2tkcm9wKTtcbiAgICAgICAgXG4gICAgICAgICRiYWNrZHJvcC5hZGRDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgJChkb2N1bWVudC5ib2R5KVxuICAgICAgICAgICAgLmFkZENsYXNzKCdjY2wtbW9kYWwtb3BlbicpXG4gICAgICAgICAgICAuY3NzKCAncGFkZGluZy1yaWdodCcsIENDTC5TQ1JPTExCQVJXSURUSCApO1xuXG4gICAgICAgIGlmICggY2FsbGJhY2sgKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCBjYWxsYmFjaywgRFVSQVRJT04gKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuc2hvd01vZGFsID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgX3RoaXMuJHRhcmdldC5zaG93KCAwLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5hZGRDbGFzcygnY2NsLWlzLXNob3duJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgJCgnLmNjbC1jLW1vZGFsJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbCcpLmhpZGUoKTtcblxuICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsX19iYWNrZHJvcCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsX19iYWNrZHJvcCcpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJylcbiAgICAgICAgICAgICAgICAgICAgLmNzcyggJ3BhZGRpbmctcmlnaHQnLCAnJyApO1xuXG4gICAgICAgICAgICB9LCBEVVJBVElPTik7XG5cbiAgICAgICAgfSwgRFVSQVRJT04gKTsgXG5cbiAgICB9O1xuXG5cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IE1vZGFsVG9nZ2xlKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIFF1aWNrIE5hdlxuICogXG4gKiBCZWhhdmlvciBmb3IgdGhlIHF1aWNrIG5hdlxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciAkd2luZG93ID0gJCh3aW5kb3cpLFxuICAgICAgICBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBRdWlja05hdiA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiRzdWJNZW51cyA9IHRoaXMuJGVsLmZpbmQoJy5zdWItbWVudScpO1xuICAgICAgICB0aGlzLiRzY3JvbGxTcHlJdGVtcyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1xdWljay1uYXZfX3Njcm9sbHNweSBzcGFuJyk7XG4gICAgICAgIHRoaXMuJHNlYXJjaFRvZ2dsZSA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtaXMtc2VhcmNoLXRvZ2dsZScpO1xuXG4gICAgICAgIC8vIHNldCB0aGUgdG9nZ2xlIG9mZnNldCBhbmQgYWNjb3VudCBmb3IgdGhlIFdQIGFkbWluIGJhciBcbiAgICBcbiAgICAgICAgaWYgKCAkKCdib2R5JykuaGFzQ2xhc3MoJ2FkbWluLWJhcicpICYmICQoJyN3cGFkbWluYmFyJykuY3NzKCdwb3NpdGlvbicpID09ICdmaXhlZCcgKSB7XG4gICAgICAgICAgICB2YXIgYWRtaW5CYXJIZWlnaHQgPSAkKCcjd3BhZG1pbmJhcicpLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU9mZnNldCA9ICQoJy5jY2wtYy11c2VyLW5hdicpLm9mZnNldCgpLnRvcCArICQoJy5jY2wtYy11c2VyLW5hdicpLm91dGVySGVpZ2h0KCkgLSBhZG1pbkJhckhlaWdodDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlT2Zmc2V0ID0gJCgnLmNjbC1jLXVzZXItbmF2Jykub2Zmc2V0KCkudG9wICsgJCgnLmNjbC1jLXVzZXItbmF2Jykub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5pbml0U2Nyb2xsKCk7XG4gICAgICAgIHRoaXMuaW5pdE1lbnVzKCk7XG4gICAgICAgIHRoaXMuaW5pdFNjcm9sbFNweSgpO1xuICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcblxuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdFNjcm9sbCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgJHdpbmRvdy5zY3JvbGwoIENDTC50aHJvdHRsZSggX29uU2Nyb2xsLCA1MCApICk7XG5cbiAgICAgICAgZnVuY3Rpb24gX29uU2Nyb2xsKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKTtcbiAgICBcbiAgICAgICAgICAgIGlmICggc2Nyb2xsVG9wID49IHRoYXQudG9nZ2xlT2Zmc2V0ICkge1xuICAgICAgICAgICAgICAgIHRoYXQuJGVsLmFkZENsYXNzKCdjY2wtaXMtZml4ZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1maXhlZCcpO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgUXVpY2tOYXYucHJvdG90eXBlLmluaXRNZW51cyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICggISB0aGlzLiRzdWJNZW51cy5sZW5ndGggKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRzdWJNZW51cy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgJHN1Yk1lbnUgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICR0b2dnbGUgPSAkc3ViTWVudS5zaWJsaW5ncygnYScpO1xuXG4gICAgICAgICAgICAkdG9nZ2xlLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkc3ViTWVudS5zbGlkZVRvZ2dsZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdFNjcm9sbFNweSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHNjcm9sbFNweUl0ZW1zLmVhY2goZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgdmFyICRzcHlJdGVtID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSAkc3B5SXRlbS5kYXRhKCd0YXJnZXQnKTtcblxuICAgICAgICAgICAgJHdpbmRvdy5zY3JvbGwoIENDTC50aHJvdHRsZSggX29uU2Nyb2xsLCAxMDAgKSApO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBfb25TY3JvbGwoKSB7XG4gICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCksXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRvcCA9ICQodGFyZ2V0KS5vZmZzZXQoKS50b3AgLSAxNTA7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHNjcm9sbFRvcCA+PSB0YXJnZXRUb3AgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuJHNjcm9sbFNweUl0ZW1zLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICRzcHlJdGVtLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNweUl0ZW0ucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdFNlYXJjaCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy4kc2VhcmNoVG9nZ2xlLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGF0LiRlbC50b2dnbGVDbGFzcygnY2NsLXNlYXJjaC1hY3RpdmUnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5jY2wtYy1xdWljay1uYXYnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgUXVpY2tOYXYodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBSb29tIFJlc2VydmF0aW9uXG4gKiBcbiAqIEhhbmRsZSByb29tIHJlc2VydmF0aW9uc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBSb29tUmVzRm9ybSA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJGZvcm1Db250ZW50ID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tY29udGVudCcpLmNzcyh7cG9zaXRpb246J3JlbGF0aXZlJ30pO1xuICAgICAgICB0aGlzLiRmb3JtUmVzcG9uc2UgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1yZXNwb25zZScpLmNzcyh7cG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogJzFyZW0nLCBsZWZ0OiAnMXJlbScsIG9wYWNpdHk6IDB9KTtcbiAgICAgICAgdGhpcy4kZm9ybUNhbmNlbCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLWNhbmNlbCcpO1xuICAgICAgICB0aGlzLiRmb3JtU3VibWl0ID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tc3VibWl0Jyk7XG4gICAgICAgIHRoaXMucm9vbUlkID0gdGhpcy4kZWwuZGF0YSgncmVzb3VyY2UtaWQnKTtcbiAgICAgICAgdGhpcy4kZGF0ZVNlbGVjdCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLWRhdGUtc2VsZWN0Jyk7XG4gICAgICAgIHRoaXMuZGF0ZVltZCA9IHRoaXMuJGRhdGVTZWxlY3QudmFsKCk7XG4gICAgICAgIHRoaXMuJHJvb21TY2hlZHVsZSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXNjaGVkdWxlJyk7XG4gICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQgPSB0aGlzLiRlbC5maW5kKCcuanMtY3VycmVudC1kdXJhdGlvbicpO1xuICAgICAgICB0aGlzLiRmb3JtTm90aWZpY2F0aW9uID0gJCgnPHAgY2xhc3M9XCJjY2wtYy1hbGVydFwiPjwvcD4nKTtcbiAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4gPSB0aGlzLiRlbC5maW5kKCcuanMtcmVzZXQtc2VsZWN0aW9uJyk7IFxuICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cyA9IG51bGw7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzID0gW107XG4gICAgICAgIHRoaXMubWF4U2xvdHMgPSA0O1xuICAgICAgICB0aGlzLiRtYXhUaW1lID0gdGhpcy4kZWwuZmluZCgnLmpzLW1heC10aW1lJyk7XG4gICAgICAgIHRoaXMuc2xvdE1pbnV0ZXMgPSAzMDtcbiAgICAgICAgdGhpcy5sb2NhbGUgPSBcImVuLVVTXCI7XG4gICAgICAgIHRoaXMudGltZVpvbmUgPSB7dGltZVpvbmU6IFwiQW1lcmljYS9Mb3NfQW5nZWxlc1wifTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5zZXRMb2FkaW5nKCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTY2hlZHVsZURhdGEoKTtcblxuICAgICAgICB0aGlzLnNldE1heFRpbWVUZXh0KCk7XG5cbiAgICAgICAgdGhpcy5pbml0RGF0ZUV2ZW50cygpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0Rm9ybUV2ZW50cygpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuZ2V0U3BhY2VBdmFpbGFiaWxpdHkgPSBmdW5jdGlvbihZbWQpe1xuXG5cdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRhY3Rpb246ICdnZXRfcm9vbV9pbmZvJyxcblx0XHRcdGNjbF9ub25jZTogQ0NMLm5vbmNlLFxuXHRcdFx0YXZhaWxhYmlsaXR5OiBZbWQgfHwgJycsIC8vIGUuZy4gJzIwMTctMTAtMTknLiBlbXB0eSBzdHJpbmcgd2lsbCBnZXQgYXZhaWxhYmlsaXR5IGZvciBjdXJyZW50IGRheVxuXHRcdFx0cm9vbTogdGhpcy5yb29tSWQgLy8gcm9vbV9pZCAoc3BhY2UpXG5cdFx0fTtcblxuICAgICAgICByZXR1cm4gJC5wb3N0KHtcblx0XHRcdHVybDogQ0NMLmFqYXhfdXJsLFxuXHRcdFx0ZGF0YTogZGF0YVxuXHRcdH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5nZXRTcGFjZUJvb2tpbmdzID0gZnVuY3Rpb24oWW1kKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgYWN0aW9uOiAnZ2V0X2Jvb2tpbmdzJyxcbiAgICAgICAgICAgIGNjbF9ub25jZTogQ0NMLm5vbmNlLFxuICAgICAgICAgICAgZGF0ZTogWW1kIHx8ICcnLCAvLyBlLmcuICcyMDE3LTEwLTE5Jy4gZW1wdHkgc3RyaW5nIHdpbGwgZ2V0IGJvb2tpbmdzIGZvciBjdXJyZW50IGRheVxuICAgICAgICAgICAgcm9vbTogdGhpcy5yb29tSWQsXG4gICAgICAgICAgICBsaW1pdDogNTBcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gJC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogQ0NMLmFqYXhfdXJsLFxuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUudXBkYXRlU2NoZWR1bGVEYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgZ2V0U3BhY2VqcVhIUiA9IHRoaXMuZ2V0U3BhY2VBdmFpbGFiaWxpdHkodGhpcy5kYXRlWW1kKTtcbiAgICAgICAgdmFyIGdldEJvb2tpbmdzanFYSFIgPSB0aGlzLmdldFNwYWNlQm9va2luZ3ModGhpcy5kYXRlWW1kKTtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgICQud2hlbihnZXRTcGFjZWpxWEhSLCBnZXRCb29raW5nc2pxWEhSKVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24oZ2V0U3BhY2UsZ2V0Qm9va2luZ3Mpe1xuXG4gICAgICAgICAgICAgICAgdmFyIHNwYWNlRGF0YSA9IGdldFNwYWNlWzBdLFxuICAgICAgICAgICAgICAgICAgICBib29raW5nc0RhdGEgPSBnZXRCb29raW5nc1swXSxcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VqcVhIUiA9IGdldFNwYWNlWzJdLFxuICAgICAgICAgICAgICAgICAgICBib29raW5nc2pxWEhSID0gZ2V0Qm9va2luZ3NbMl0sXG4gICAgICAgICAgICAgICAgICAgIHRpbWVTbG90c0FycmF5O1xuXG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgZGF0YSB0byBKU09OIGlmIGl0J3MgYSBzdHJpbmdcbiAgICAgICAgICAgICAgICBzcGFjZURhdGEgPSAoIHR5cGVvZiBzcGFjZURhdGEgPT09ICdzdHJpbmcnICkgPyBKU09OLnBhcnNlKCBzcGFjZURhdGEgKVswXSA6IHNwYWNlRGF0YVswXTtcbiAgICAgICAgICAgICAgICBib29raW5nc0RhdGEgPSAoIHR5cGVvZiBib29raW5nc0RhdGEgPT09ICdzdHJpbmcnICkgPyBKU09OLnBhcnNlKCBib29raW5nc0RhdGEgKSA6IGJvb2tpbmdzRGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIG1lcmdlIGJvb2tpbmdzIHdpdGggYXZhaWxhYmlsaXR5XG4gICAgICAgICAgICAgICAgaWYgKCBib29raW5nc0RhdGEubGVuZ3RoICl7XG5cbiAgICAgICAgICAgICAgICAgICAgYm9va2luZ3NEYXRhLmZvckVhY2goZnVuY3Rpb24oYm9va2luZyxpKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIG51bWJlciBvZiBzbG90cyBiYXNlZCBvbiBib29raW5nIGR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZnJvbVRpbWUgPSBuZXcgRGF0ZShib29raW5nLmZyb21EYXRlKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9UaW1lID0gbmV3IERhdGUoYm9va2luZy50b0RhdGUpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbk1pbnV0ZXMgPSAodG9UaW1lIC0gZnJvbVRpbWUpIC8gMTAwMCAvIDYwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsb3RDb3VudCA9IGR1cmF0aW9uTWludXRlcyAvIHRoYXQuc2xvdE1pbnV0ZXM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlRGF0YS5hdmFpbGFiaWxpdHkucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IGJvb2tpbmcuZnJvbURhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBib29raW5nLnRvRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNsb3RDb3VudFwiOiBzbG90Q291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0Jvb2tlZFwiOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIHNvcnQgdGltZSBzbG90IG9iamVjdHMgYnkgdGhlIFwiZnJvbVwiIGtleVxuICAgICAgICAgICAgICAgICAgICBfc29ydEJ5S2V5KCBzcGFjZURhdGEuYXZhaWxhYmlsaXR5LCAnZnJvbScgKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHBhcnNlIHRpbWUgc2xvdHMgYW5kIHJldHVybiBhbiBhcHByb3ByaWF0ZSBzdWJzZXQgKG9ubHkgb3BlbiB0byBjbG9zZSBob3VycylcbiAgICAgICAgICAgICAgICB0aW1lU2xvdHNBcnJheSA9IHRoYXQucGFyc2VTY2hlZHVsZShzcGFjZURhdGEuYXZhaWxhYmlsaXR5KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBidWlsZCBzY2hlZHVsZSBIVE1MXG4gICAgICAgICAgICAgICAgdGhhdC5idWlsZFNjaGVkdWxlKHRpbWVTbG90c0FycmF5KTtcblxuICAgICAgICAgICAgICAgIC8vIEVycm9yIGhhbmRsZXJzXG4gICAgICAgICAgICAgICAgc3BhY2VqcVhIUi5mYWlsKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYm9va2luZ3NqcVhIUi5mYWlsKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhhdC51bnNldExvYWRpbmcoKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRyZXNldFNlbGVjdGlvbkJ0bi5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuYnVpbGRTY2hlZHVsZSA9IGZ1bmN0aW9uKHRpbWVTbG90c0FycmF5KXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBodG1sID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gY29uc3RydWN0IEhUTUwgZm9yIGVhY2ggdGltZSBzbG90XG4gICAgICAgIHRpbWVTbG90c0FycmF5LmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSl7XG5cbiAgICAgICAgICAgIHZhciBmcm9tID0gbmV3IERhdGUoIGl0ZW0uZnJvbSApLFxuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmcsXG4gICAgICAgICAgICAgICAgaXRlbUNsYXNzID0gJyc7XG5cbiAgICAgICAgICAgIGlmICggZnJvbS5nZXRNaW51dGVzKCkgIT09IDAgKSB7XG4gICAgICAgICAgICAgICAgdGltZVN0cmluZyA9IHRoYXQucmVhZGFibGVUaW1lKCBmcm9tLCAnaDptJyApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aW1lU3RyaW5nID0gdGhhdC5yZWFkYWJsZVRpbWUoIGZyb20sICdoYScgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBpdGVtLmlzQm9va2VkICYmIGl0ZW0uaGFzT3duUHJvcGVydHkoJ3Nsb3RDb3VudCcpICkge1xuICAgICAgICAgICAgICAgIGl0ZW1DbGFzcyA9ICdjY2wtaXMtb2NjdXBpZWQgY2NsLWR1cmF0aW9uLScgKyBpdGVtLnNsb3RDb3VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gYnVpbGQgc2VsZWN0YWJsZSB0aW1lIHNsb3RzXG4gICAgICAgICAgICBodG1sLnB1c2goIHRoYXQuYnVpbGRUaW1lU2xvdCh7XG4gICAgICAgICAgICAgICAgaWQ6ICdzbG90LScgKyB0aGF0LnJvb21JZCArICctJyArIGksXG4gICAgICAgICAgICAgICAgZnJvbTogaXRlbS5mcm9tLFxuICAgICAgICAgICAgICAgIHRvOiBpdGVtLnRvLFxuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmc6IHRpbWVTdHJpbmcsXG4gICAgICAgICAgICAgICAgY2xhc3M6IGl0ZW1DbGFzc1xuICAgICAgICAgICAgfSkgKTtcbiAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzID0gW107XG5cbiAgICAgICAgdGhpcy4kcm9vbVNjaGVkdWxlLmh0bWwoIGh0bWwuam9pbignJykgKTtcblxuICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1yb29tX19zbG90IFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcblxuICAgICAgICB0aGlzLnNldEN1cnJlbnREdXJhdGlvblRleHQoKTtcblxuICAgICAgICB0aGlzLmluaXRTbG90RXZlbnRzKCk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmJ1aWxkVGltZVNsb3QgPSBmdW5jdGlvbih2YXJzKXtcbiAgICAgICAgXG4gICAgICAgIGlmICggISB2YXJzIHx8IHR5cGVvZiB2YXJzICE9PSAnb2JqZWN0JyApIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGNsYXNzOiAnJyxcbiAgICAgICAgICAgIGlkOiAnJyxcbiAgICAgICAgICAgIGRpc2FibGVkOiAnJyxcbiAgICAgICAgICAgIGZyb206ICcnLFxuICAgICAgICAgICAgdG86ICcnLFxuICAgICAgICAgICAgdGltZVN0cmluZzogJydcbiAgICAgICAgfTtcbiAgICAgICAgdmFycyA9ICQuZXh0ZW5kKGRlZmF1bHRzLCB2YXJzKTtcblxuICAgICAgICB2YXIgdGVtcGxhdGUgPSAnJyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNjbC1jLXJvb21fX3Nsb3QgJyArIHZhcnMuY2xhc3MgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cIicgKyB2YXJzLmlkICsgJ1wiIG5hbWU9XCInICsgdmFycy5pZCArICdcIiB2YWx1ZT1cIicgKyB2YXJzLmZyb20gKyAnXCIgZGF0YS10bz1cIicgKyB2YXJzLnRvICsgJ1wiICcgKyB2YXJzLmRpc2FibGVkICsgJy8+JyArXG4gICAgICAgICAgICAgICAgJzxsYWJlbCBjbGFzcz1cImNjbC1jLXJvb21fX3Nsb3QtbGFiZWxcIiBmb3I9XCInICsgdmFycy5pZCArICdcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgdmFycy50aW1lU3RyaW5nICtcbiAgICAgICAgICAgICAgICAnPC9sYWJlbD4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nO1xuXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnBhcnNlU2NoZWR1bGUgPSBmdW5jdGlvbihzY2hlZHVsZUFycmF5KXtcbiAgICAgICAgLy8gcmV0dXJucyB0aGUgYXBwcm9wcmlhdGUgc2NoZWR1bGUgZm9yIGEgZ2l2ZW4gYXJyYXkgb2YgdGltZSBzbG90c1xuICAgICAgICBcbiAgICAgICAgdmFyIHRvID0gbnVsbCxcbiAgICAgICAgICAgIHN0YXJ0RW5kSW5kZXhlcyA9IFtdLCBcbiAgICAgICAgICAgIHN0YXJ0LCBlbmQ7XG5cbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFycmF5IGFuZCBwaWNrIG91dCB0aW1lIGdhcHNcbiAgICAgICAgc2NoZWR1bGVBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0saSl7XG4gICAgICAgICAgICBpZiAoIHRvICYmIHRvICE9PSBpdGVtLmZyb20gKSB7XG4gICAgICAgICAgICAgICAgc3RhcnRFbmRJbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0byA9IGl0ZW0udG87XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGRlcGVuZGluZyBvbiBudW1iZXIgb2YgZ2FwcyBmb3VuZCwgZGV0ZXJtaW5lIHN0YXJ0IGFuZCBlbmQgaW5kZXhlc1xuICAgICAgICBpZiAoIHN0YXJ0RW5kSW5kZXhlcy5sZW5ndGggPj0gMiApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gc3RhcnRFbmRJbmRleGVzWzBdO1xuICAgICAgICAgICAgZW5kID0gc3RhcnRFbmRJbmRleGVzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgICAgICAgaWYgKCBzdGFydEVuZEluZGV4ZXMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAgICAgICAgIGVuZCA9IHN0YXJ0RW5kSW5kZXhlc1swXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZW5kID0gc2NoZWR1bGVBcnJheS5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIHJldHVybmVkIHNsaWNlZCBwb3J0aW9uIG9mIG9yaWdpbmFsIHNjaGVkdWxlXG4gICAgICAgIHJldHVybiBzY2hlZHVsZUFycmF5LnNsaWNlKHN0YXJ0LGVuZCk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0Rm9ybUV2ZW50cyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHJlc2V0U2VsZWN0aW9uQnRuLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzKS5lYWNoKGZ1bmN0aW9uKGksaW5wdXQpe1xuICAgICAgICAgICAgICAgICQoaW5wdXQpXG4gICAgICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJyxmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgLmNoYW5nZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcuY2NsLWMtcm9vbV9fc2xvdCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtZGlzYWJsZWQgY2NsLWhhcy1wb3RlbnRpYWwnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kZWwuc3VibWl0KGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGF0Lm9uU3VibWl0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0RGF0ZUV2ZW50cyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZGF0ZVNlbGVjdC5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoYXQub25EYXRlQ2hhbmdlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vbkRhdGVDaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZGF0ZVltZCA9IHRoaXMuJGRhdGVTZWxlY3QudmFsKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNldExvYWRpbmcoKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNjaGVkdWxlRGF0YSgpO1xuICAgICAgICBcbiAgICB9O1xuICAgICAgICBcbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdFNsb3RFdmVudHMgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICBpZiAoIHRoaXMuJHJvb21TbG90SW5wdXRzICYmIHRoaXMuJHJvb21TbG90SW5wdXRzLmxlbmd0aCApe1xuXG4gICAgICAgICAgICB0aGlzLiRlbC5maW5kKCcuY2NsLWMtcm9vbV9fc2xvdCcpLmhvdmVyKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhhdC5vblNsb3RNb3VzZUluKHRoaXMpO1xuICAgICAgICAgICAgfSwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGF0Lm9uU2xvdE1vdXNlT3V0KHRoaXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGNsaWNrIGV2ZW50IGZpcmVzIEJFRk9SRSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHRoYXQub25TbG90Q2xpY2soaW5wdXQsIGV2ZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cy5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHRoYXQub25TbG90Q2hhbmdlKGlucHV0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uU2xvdE1vdXNlSW4gPSBmdW5jdGlvbihob3ZlcmVkU2xvdCkge1xuXG4gICAgICAgIC8vIGlmIHlvdSdyZSBub3Qgc2VsZWN0aW5nIHlvdXIgMm5kIHNsb3QsIHJldHVyblxuICAgICAgICBpZiAoIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCAhPT0gMSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBob3ZlcmVkSW5wdXQgPSAkKGhvdmVyZWRTbG90KS5maW5kKCdbdHlwZT1cImNoZWNrYm94XCJdJyk7XG5cbiAgICAgICAgdmFyIGhvdmVyZWRJbnB1dEluZGV4ID0gdGhpcy4kcm9vbVNsb3RJbnB1dHMuaW5kZXgoaG92ZXJlZElucHV0KSxcbiAgICAgICAgICAgIHNlbGVjdGVkSW5wdXRJbmRleCA9IHRoaXMuJHJvb21TbG90SW5wdXRzLmluZGV4KCB0aGlzLnNlbGVjdGVkU2xvdElucHV0c1swXSApLFxuICAgICAgICAgICAgaW5wdXRJbmRleFNldCA9IFtob3ZlcmVkSW5wdXRJbmRleCwgc2VsZWN0ZWRJbnB1dEluZGV4XS5zb3J0KCk7XG5cbiAgICAgICAgLy8gaWYgeW91J3JlIGhvdmVyaW5nIHRoZSBhbHJlYWR5IHNlbGVjdGVkIHNsb3QsIHJldHVyblxuICAgICAgICBpZiAoIGlucHV0SW5kZXhTZXRbMF0gPT09IGlucHV0SW5kZXhTZXRbMV0gKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiB0aGUgZmlyc3Qgb3IgbGFzdCBpbnB1dCBpbmRleGVzIGFyZSBiZXlvbmQgYm91bmRhcmllcywgcmV0dXJuXG4gICAgICAgIGlmICggaW5wdXRJbmRleFNldFswXSA8PSBzZWxlY3RlZElucHV0SW5kZXggLSB0aGlzLm1heFNsb3RzIHx8IGlucHV0SW5kZXhTZXRbMV0gPj0gc2VsZWN0ZWRJbnB1dEluZGV4ICsgdGhpcy5tYXhTbG90cyApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGdldCBmaXJzdC9sYXN0IHNsb3QgZWxlbWVudHNcbiAgICAgICAgdmFyICRmaXJzdFNsb3QgPSB0aGlzLiRyb29tU2xvdElucHV0cy5lcShpbnB1dEluZGV4U2V0WzBdKS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JyksXG4gICAgICAgICAgICAkbGFzdFNsb3QgPSB0aGlzLiRyb29tU2xvdElucHV0cy5lcShpbnB1dEluZGV4U2V0WzFdKS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90Jyk7XG5cbiAgICAgICAgLy8gc2VsZWN0IHNsb3RzIGluIGJldHdlZW4gZmlyc3QgYW5kIGxhc3RcbiAgICAgICAgJGZpcnN0U2xvdC5uZXh0VW50aWwoJGxhc3RTbG90KS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgaWYgKCAhICR0aGlzLmhhc0NsYXNzKCdjY2wtaXMtZGlzYWJsZWQnKSApIHtcbiAgICAgICAgICAgICAgICAkdGhpcy5hZGRDbGFzcygnY2NsLWhhcy1wb3RlbnRpYWwnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uU2xvdE1vdXNlT3V0ID0gZnVuY3Rpb24oaG92ZXJlZElucHV0KSB7XG5cbiAgICAgICAgaWYgKCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggIT09IDEgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkKCcuY2NsLWMtcm9vbV9fc2xvdCcpLnJlbW92ZUNsYXNzKCdjY2wtaGFzLXBvdGVudGlhbCcpO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblNsb3RDbGljayA9IGZ1bmN0aW9uKGNsaWNrZWRJbnB1dCwgZXZlbnQpe1xuICAgICAgICBcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgY2xpY2tJbnB1dEluZGV4ID0gdGhhdC4kcm9vbVNsb3RJbnB1dHMuaW5kZXgoY2xpY2tlZElucHV0KSxcbiAgICAgICAgICAgIG1pbkluZGV4ID0gY2xpY2tJbnB1dEluZGV4IC0gdGhhdC5tYXhTbG90cyxcbiAgICAgICAgICAgIG1heEluZGV4ID0gY2xpY2tJbnB1dEluZGV4ICsgdGhhdC5tYXhTbG90cztcblxuICAgICAgICAvLyBkaXNhYmxlcyBzbG90cyB0aGF0IGFyZSBvdXRzaWRlIG9mIG1heCBzZWxlY3RhYmxlIGFyZWFcbiAgICAgICAgZnVuY3Rpb24gX2lzb2xhdGVTZWxlY3RhYmxlU2xvdHMoKSB7XG5cbiAgICAgICAgICAgIC8vIG9jY3VwaWVkIHNsb3RzIHdpbGwgYWZmZWN0IHdoYXQgbmVhcmJ5IHNsb3RzIGNhbiBiZSBzZWxlY3RlZFxuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGFueSBvY2N1cGllZCBzbG90cywgaWYgdGhleSBleGlzdFxuICAgICAgICAgICAgJCgnLmNjbC1jLXJvb21fX3Nsb3QuY2NsLWlzLW9jY3VwaWVkJykuZWFjaChmdW5jdGlvbihpLHNsb3Qpe1xuXG4gICAgICAgICAgICAgICAgLy8gZ2V0IG9jY3VwaWVkIHNsb3QncyBpbnB1dCwgZmluZCBpdCdzIGluZGV4IGFtb3VuZyBhbGwgc2xvdCBpbnB1dHNcbiAgICAgICAgICAgICAgICB2YXIgc2xvdElucHV0ID0gJChzbG90KS5maW5kKCdbdHlwZT1cImNoZWNrYm94XCJdJyksXG4gICAgICAgICAgICAgICAgICAgIG9jY3VwaWVkSW5kZXggPSB0aGF0LiRyb29tU2xvdElucHV0cy5pbmRleChzbG90SW5wdXQpO1xuXG4gICAgICAgICAgICAgICAgLy8gaWYgb2NjdXBpZWQgc2xvdCBmYWxscyBpbiB0aGUgc2VsZWN0YWJsZSBhcmVhXG4gICAgICAgICAgICAgICAgaWYgKCBtaW5JbmRleCA8IG9jY3VwaWVkSW5kZXggJiYgb2NjdXBpZWRJbmRleCA8IG1heEluZGV4ICkge1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIG9jY3VwaWVkIHNsb3QgaXMgQkVGT1JFIGNsaWNrZWQgc2xvdCwgc2V0IGl0IGFzIHRoZSBtaW5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCBvY2N1cGllZEluZGV4IDwgY2xpY2tJbnB1dEluZGV4ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWluSW5kZXggPSBvY2N1cGllZEluZGV4O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIG9jY3VwaWVkIHNsb3QgaXMgQUZURVIgY2xpY2tlZCBzbG90LCBzZXQgaXQgYXMgdGhlIG1heFxuICAgICAgICAgICAgICAgICAgICBpZiAoIG9jY3VwaWVkSW5kZXggPiBjbGlja0lucHV0SW5kZXggKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXhJbmRleCA9IG9jY3VwaWVkSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggc2xvdHMsIGRpc2FibGUgb25lcyB0aGF0IGZhbGwgb3V0c2lkZSBvZiBtaW4vbWF4IGluZGV4ZXNcbiAgICAgICAgICAgIHRoYXQuJHJvb21TbG90SW5wdXRzLmVhY2goZnVuY3Rpb24oaSxpbnB1dCl7XG4gICAgICAgICAgICAgICAgaWYgKCBpIDw9IG1pbkluZGV4IHx8IGkgPj0gbWF4SW5kZXggKSB7XG4gICAgICAgICAgICAgICAgICAgICQoaW5wdXQpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5hZGRDbGFzcygnY2NsLWlzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogaWYgbm8gaW5wdXRzIHlldCBzZWxlY3RlZCwgdGhpcyBpcyB0aGUgZmlyc3RcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgICAgICBpZiAoIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICAgICAgX2lzb2xhdGVTZWxlY3RhYmxlU2xvdHMoKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBpZiAxIGlucHV0IHNlbGVjdGVkLCBzZWxlY3RpbmcgMm5kIHNsb3RcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgICAgICBpZiAoIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCA9PT0gMSApIHtcblxuICAgICAgICAgICAgaWYgKCAkKGNsaWNrZWRJbnB1dCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpLmhhc0NsYXNzKCdjY2wtaXMtZGlzYWJsZWQnKSApIHtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtcm9vbV9fc2xvdCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBpZiAyIG9yIG1vcmUgc2xvdHMgYWxyZWFkeSBzZWxlY3RlZFxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gICAgICAgIGlmICggdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoID49IDIgKSB7XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSBjbGlja2VkIGlucHV0IGlzIG5vdCBwYXJ0IG9mIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAgICAgICAgICAvLyBjbGVhciBhbGwgc2VsZWN0ZWQgaW5wdXRzXG4gICAgICAgICAgICBpZiAoIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2YoIGNsaWNrZWRJbnB1dCApIDwgMCApIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHRoYXQuY2xlYXJBbGxTbG90cygpO1xuICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzID0gW107XG5cbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGlmIGNsaWNrZWQgaW5wdXQgaXMgb25lIG9mIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgaW5wdXRzXG4gICAgICAgICAgICAvLyBrZWVwIHRoYXQgb25lIHNlbGVjdGVkIGFuZCBkZXNlbGVjdCB0aGUgcmVzdFxuICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvLyBwcmV2ZW50IGNoYW5nZSBldmVudCBmcm9tIGZpcmluZ1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIGlucHV0IGluZGV4IGZyb20gYW1vbmcgc2VsZWN0ZWQgaW5wdXRzXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkU2xvdEluZGV4ID0gdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZiggY2xpY2tlZElucHV0ICksXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5wdXRzID0gJC5leHRlbmQoIFtdLCB0aGF0LnNlbGVjdGVkU2xvdElucHV0cyApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNsZWFyIGFsbCBpbnB1dHMgRVhDRVBUIHRoZSBjbGlja2VkIG9uZVxuICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5wdXRzLmZvckVhY2goZnVuY3Rpb24oaW5wdXQsaSl7XG4gICAgICAgICAgICAgICAgICAgIGlmICggc2VsZWN0ZWRTbG90SW5kZXggIT0gaSApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoYXQuY2xlYXJTbG90KGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIC8vIHNldCBzZWxlY3RlZCBpbnB1dHMgdG8ganVzdCB0aGlzIG9uZVxuICAgICAgICAgICAgICAgIC8vIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzID0gWyB0aGF0LnNlbGVjdGVkU2xvdElucHV0c1tzZWxlY3RlZFNsb3RJbmRleF0gXTtcblxuICAgICAgICAgICAgICAgIC8vIHVwZGF0ZSB0aGUgY3VycmVudCBkdXJhdGlvbiB0ZXh0XG4gICAgICAgICAgICAgICAgdGhhdC5zZXRDdXJyZW50RHVyYXRpb25UZXh0KCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX2lzb2xhdGVTZWxlY3RhYmxlU2xvdHMoKTtcblxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TbG90Q2hhbmdlID0gZnVuY3Rpb24oY2hhbmdlZElucHV0KXtcbiAgICAgICAgXG4gICAgICAgIC8vIGlmIGlucHV0IGNoZWNrZWQsIGFkZCBpdCB0byBzZWxlY3RlZCBzZXRcbiAgICAgICAgaWYgKCAkKGNoYW5nZWRJbnB1dCkucHJvcCgnY2hlY2tlZCcpICkge1xuXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5wdXNoKGNoYW5nZWRJbnB1dCk7XG4gICAgICAgICAgICAkKGNoYW5nZWRJbnB1dCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpLmFkZENsYXNzKCdjY2wtaXMtY2hlY2tlZCcpO1xuICAgXG4gICAgICAgIH0gXG4gICAgICAgIFxuICAgICAgICAvLyBpZiBpbnB1dCB1bmNoZWNrZWQsIHJlbW92ZSBpdCBmcm9tIHRoZSBzZWxlY3RlZCBzZXRcbiAgICAgICAgZWxzZSB7IFxuXG4gICAgICAgICAgICB2YXIgY2hhbmdlZElucHV0SW5kZXggPSB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKGNoYW5nZWRJbnB1dCk7XG5cbiAgICAgICAgICAgIGlmICggY2hhbmdlZElucHV0SW5kZXggPiAtMSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5zcGxpY2UoIGNoYW5nZWRJbnB1dEluZGV4LCAxICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKGNoYW5nZWRJbnB1dCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtY2hlY2tlZCcpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyB0b2dnbGUgcmVzZXQgYnV0dG9uXG4gICAgICAgIGlmICggdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgIHRoaXMuJHJlc2V0U2VsZWN0aW9uQnRuLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJHJlc2V0U2VsZWN0aW9uQnRuLmhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGhpZ2hsaWdodCBzbG90cyBiZXR3ZWVuIHR3byBlbmRzXG4gICAgICAgIGlmICggdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoID09PSAyICkge1xuXG4gICAgICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgICAgIHRoYXQuJGVsLmZpbmQoJy5jY2wtaXMtY2hlY2tlZCcpLmZpcnN0KCkubmV4dFVudGlsKCcuY2NsLWlzLWNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uKGksc2xvdCl7XG4gICAgICAgICAgICAgICAgdmFyIHNsb3RJbnB1dCA9ICQoc2xvdCkuZmluZCgnaW5wdXRbdHlwZT1cImNoZWNrYm94XCJdJyk7XG4gICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMucHVzaChzbG90SW5wdXRbMF0pO1xuICAgICAgICAgICAgICAgIHRoYXQuYWN0aXZhdGVTbG90KHNsb3QpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldEN1cnJlbnREdXJhdGlvblRleHQoKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuY2xlYXJTbG90ID0gZnVuY3Rpb24oc2xvdCkge1xuICAgICAgICAvLyBzbG90IGNhbiBiZSBlaXRoZXIgdGhlIGNoZWNrYm94IGlucHV0IC1PUi0gdGhlIGNoZWNrYm94J3MgY29udGFpbmVyXG5cbiAgICAgICAgdmFyIGlucHV0SW5kZXg7XG5cbiAgICAgICAgLy8gaWYgaXQncyB0aGUgY2hlY2tib3guXG4gICAgICAgIGlmICggJChzbG90KS5pcygnW3R5cGU9XCJjaGVja2JveFwiXScpICkge1xuICAgICAgICAgXG4gICAgICAgICAgICAkKHNsb3QpXG4gICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLGZhbHNlKVxuICAgICAgICAgICAgICAgIC5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JylcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtaXMtY2hlY2tlZCBjY2wtaGFzLXBvdGVudGlhbCcpO1xuXG4gICAgICAgICAgICAvLyBnZXQgaW5kZXggb2YgdGhlIGlucHV0IGZyb20gc2VsZWN0ZWQgc2V0XG4gICAgICAgICAgICBpbnB1dEluZGV4ID0gdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZihzbG90KTtcbiAgICAgICAgICAgIFxuICAgICAgICAvLyBpZiBpdCdzIHRoZSBjb250YWluZXJcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdmFyICRpbnB1dCA9ICQoc2xvdCkuZmluZCgnW3R5cGU9XCJjaGVja2JveFwiXScpO1xuXG4gICAgICAgICAgICAkKHNsb3QpLnJlbW92ZUNsYXNzKCdjY2wtaXMtY2hlY2tlZCBjY2wtaGFzLXBvdGVudGlhbCcpO1xuICAgICAgICAgICAgJGlucHV0LnByb3AoJ2NoZWNrZWQnLGZhbHNlKTtcblxuICAgICAgICAgICAgLy8gZ2V0IGluZGV4IG9mIHRoZSBpbnB1dCBmcm9tIHNlbGVjdGVkIHNldFxuICAgICAgICAgICAgaW5wdXRJbmRleCA9IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2YoICRpbnB1dFswXSApO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgaW5wdXQgZnJvbSBzZWxlY3RlZCBzZXRcbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuc3BsaWNlKCBpbnB1dEluZGV4LCAxICk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmNsZWFyQWxsU2xvdHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICAvLyBFeHRlbmQgdGhlIHNlbGVjdGVkIGlucHV0cyBhcnJheSB0byBhIG5ldyB2YXJpYWJsZS5cbiAgICAgICAgLy8gVGhlIHNlbGVjdGVkIGlucHV0cyBhcnJheSBjaGFuZ2VzIHdpdGggZXZlcnkgY2xlYXJTbG90KCkgY2FsbFxuICAgICAgICAvLyBzbywgYmVzdCB0byBsb29wIHRocm91Z2ggYW4gdW5jaGFuZ2luZyBhcnJheS5cbiAgICAgICAgdmFyIHNlbGVjdGVkSW5wdXRzID0gJC5leHRlbmQoIFtdLCB0aGF0LnNlbGVjdGVkU2xvdElucHV0cyApO1xuXG4gICAgICAgICQoc2VsZWN0ZWRJbnB1dHMpLmVhY2goZnVuY3Rpb24oaSxpbnB1dCl7XG4gICAgICAgICAgICB0aGF0LmNsZWFyU2xvdChpbnB1dCk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5hY3RpdmF0ZVNsb3QgPSBmdW5jdGlvbihzbG90KSB7XG4gICAgICAgIC8vIHNsb3QgY2FuIGJlIGVpdGhlciB0aGUgY2hlY2tib3ggLU9SLSB0aGUgY2hlY2tib3gncyBjb250YWluZXJcblxuICAgICAgICB2YXIgc2xvdElzQ2hlY2tib3ggPSAkKHNsb3QpLmlzKCdbdHlwZT1cImNoZWNrYm94XCJdJyksXG4gICAgICAgICAgICAkY29udGFpbmVyID0gc2xvdElzQ2hlY2tib3ggPyAkKHNsb3QpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKSA6ICQoc2xvdCk7XG5cbiAgICAgICAgLy8gbmV2ZXIgc2V0IGFuIG9jY3VwaWVkIHNsb3QgYXMgYWN0aXZlXG4gICAgICAgIGlmICggJGNvbnRhaW5lci5oYXNDbGFzcygnY2NsLWlzLW9jY3VwaWVkJykgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSApIHtcblxuICAgICAgICAgICAgLy8gaWYgaXQncyB0aGUgY2hlY2tib3guXG4gICAgICAgICBcbiAgICAgICAgICAgICQoc2xvdCkucHJvcCgnY2hlY2tlZCcsdHJ1ZSk7XG4gICAgICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKCdjY2wtaXMtY2hlY2tlZCcpO1xuICAgICAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIGlmIGl0J3MgdGhlIGNvbnRhaW5lclxuXG4gICAgICAgICAgICAkY29udGFpbmVyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdjY2wtaXMtY2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsdHJ1ZSk7XG5cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuc2V0TG9hZGluZyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQudGV4dCgnTG9hZGluZyBzY2hlZHVsZS4uLicpO1xuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnVuc2V0TG9hZGluZyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuc2V0Q3VycmVudER1cmF0aW9uVGV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSAkLmV4dGVuZChbXSx0aGlzLnNlbGVjdGVkU2xvdElucHV0cyksXG4gICAgICAgICAgICBzb3J0ZWRTZWxlY3Rpb24gPSBzZWxlY3Rpb24uc29ydChmdW5jdGlvbihhLGIpeyBcbiAgICAgICAgICAgICAgICByZXR1cm4gYS52YWx1ZSA+IGIudmFsdWU7IFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBzZWxlY3Rpb25MZW5ndGggPSBzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoO1xuICAgICAgICBcbiAgICAgICAgaWYgKCBzZWxlY3Rpb25MZW5ndGggPiAwICkge1xuXG4gICAgICAgICAgICB2YXIgdGltZTFWYWwgPSBzb3J0ZWRTZWxlY3Rpb25bMF0udmFsdWUsXG4gICAgICAgICAgICAgICAgcmVhZGFibGVUaW1lMSA9IHRoaXMucmVhZGFibGVUaW1lKCBuZXcgRGF0ZSh0aW1lMVZhbCkgKTtcblxuICAgICAgICAgICAgdmFyIHRpbWUyVmFsID0gKCBzZWxlY3Rpb25MZW5ndGggPj0gMiApID8gc29ydGVkU2VsZWN0aW9uW3NvcnRlZFNlbGVjdGlvbi5sZW5ndGggLSAxXS52YWx1ZSA6IHRpbWUxVmFsLFxuICAgICAgICAgICAgICAgIHRpbWUyVCA9IG5ldyBEYXRlKHRpbWUyVmFsKS5nZXRUaW1lKCkgKyAoIHRoaXMuc2xvdE1pbnV0ZXMgKiA2MCAqIDEwMDAgKSxcbiAgICAgICAgICAgICAgICByZWFkYWJsZVRpbWUyID0gdGhpcy5yZWFkYWJsZVRpbWUoIG5ldyBEYXRlKHRpbWUyVCkgKTtcblxuICAgICAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dC50ZXh0KCAnRnJvbSAnICsgcmVhZGFibGVUaW1lMSArICcgdG8gJyArIHJlYWRhYmxlVGltZTIgKTtcblxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dC50ZXh0KCdQbGVhc2Ugc2VsZWN0IGF2YWlsYWJsZSB0aW1lIHNsb3RzJyk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5zZXRNYXhUaW1lVGV4dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBtYXhNaW51dGVzID0gdGhpcy5tYXhTbG90cyAqIHRoaXMuc2xvdE1pbnV0ZXMsXG4gICAgICAgICAgICBtYXhUZXh0O1xuXG4gICAgICAgIHN3aXRjaChtYXhNaW51dGVzKSB7XG4gICAgICAgICAgICBjYXNlIDI0MDpcbiAgICAgICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyAvIDYwICsgJyBob3Vycyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE4MDpcbiAgICAgICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyAvIDYwICsgJyBob3Vycyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEyMDpcbiAgICAgICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyAvIDYwICsgJyBob3Vycyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDYwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgKyAnbWlucyc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRtYXhUaW1lLnRleHQoIG1heFRleHQgKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnJlYWRhYmxlVGltZSA9IGZ1bmN0aW9uKCBkYXRlT2JqLCBmb3JtYXQgKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgbG9jYWxlU3RyaW5nID0gZGF0ZU9iai50b0xvY2FsZVN0cmluZyggdGhpcy5sb2NhbGUsIHRoaXMudGltZVpvbmUgKSwgLy8gZS5nLiAtLT4gXCIxMS83LzIwMTcsIDQ6Mzg6MzMgQU1cIlxuICAgICAgICAgICAgbG9jYWxlVGltZSA9IGxvY2FsZVN0cmluZy5zcGxpdChcIiwgXCIpWzFdOyAvLyBcIjQ6Mzg6MzMgQU1cIlxuXG4gICAgICAgIHZhciB0aW1lID0gbG9jYWxlVGltZS5zcGxpdCgnICcpWzBdLCAvLyBcIjQ6Mzg6MzNcIixcbiAgICAgICAgICAgIHRpbWVPYmogPSB7XG4gICAgICAgICAgICAgICAgYTogbG9jYWxlVGltZS5zcGxpdCgnICcpWzFdLnRvTG93ZXJDYXNlKCksIC8vIChhbSBvciBwbSkgLS0+IFwiYVwiXG4gICAgICAgICAgICAgICAgaDogdGltZS5zcGxpdCgnOicpWzBdLCAvLyBcIjRcIlxuICAgICAgICAgICAgICAgIG06IHRpbWUuc3BsaXQoJzonKVsxXSwgLy8gXCIzOFwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGlmICggZm9ybWF0ICYmIHR5cGVvZiBmb3JtYXQgPT09ICdzdHJpbmcnICkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgZm9ybWF0QXJyID0gZm9ybWF0LnNwbGl0KCcnKSxcbiAgICAgICAgICAgICAgICByZWFkYWJsZUFyciA9IFtdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBmb3JtYXRBcnIubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCB0aW1lT2JqW2Zvcm1hdEFycltpXV0gKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlQXJyLnB1c2godGltZU9ialtmb3JtYXRBcnJbaV1dKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWFkYWJsZUFyci5wdXNoKGZvcm1hdEFycltpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVhZGFibGVBcnIuam9pbignJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aW1lT2JqLmggKyAnOicgKyB0aW1lT2JqLm0gKyB0aW1lT2JqLmE7XG4gICAgICAgIFxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TdWJtaXQgPSBmdW5jdGlvbihldmVudCl7XG5cbiAgICAgICAgaWYgKCAhIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCApIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy4kZm9ybU5vdGlmaWNhdGlvblxuICAgICAgICAgICAgICAgIC5jc3MoJ2Rpc3BsYXknLCdub25lJylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1pcy1lcnJvcicpXG4gICAgICAgICAgICAgICAgLnRleHQoJ1BsZWFzZSBzZWxlY3QgYSB0aW1lIGZvciB5b3VyIHJlc2VydmF0aW9uJylcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8odGhpcy4kZm9ybUNvbnRlbnQpXG4gICAgICAgICAgICAgICAgLnNsaWRlRG93bihDQ0wuRFVSQVRJT04pOyAgICAgICAgICAgIFxuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZm9ybU5vdGlmaWNhdGlvbi5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIHNvcnRlZFNlbGVjdGlvbiA9ICQuZXh0ZW5kKFtdLCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cykuc29ydChmdW5jdGlvbihhLGIpe1xuICAgICAgICAgICAgICAgIHJldHVybiBhLnZhbHVlID4gYi52YWx1ZTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgc3RhcnQgPSBzb3J0ZWRTZWxlY3Rpb25bMF0udmFsdWUsXG4gICAgICAgICAgICBlbmQgPSAoIHNvcnRlZFNlbGVjdGlvbi5sZW5ndGggPiAxICkgPyAkKCBzb3J0ZWRTZWxlY3Rpb25bIHNvcnRlZFNlbGVjdGlvbi5sZW5ndGggLSAxIF0gKS5kYXRhKCd0bycpIDogJCggc29ydGVkU2VsZWN0aW9uWzBdICkuZGF0YSgndG8nKSxcbiAgICAgICAgICAgIHBheWxvYWQgPSB7XG4gICAgICAgICAgICAgICAgXCJpaWRcIjozMzMsXG4gICAgICAgICAgICAgICAgXCJzdGFydFwiOiBzdGFydCxcbiAgICAgICAgICAgICAgICBcImZuYW1lXCI6IHRoaXMuJGVsWzBdLmZuYW1lLnZhbHVlLFxuICAgICAgICAgICAgICAgIFwibG5hbWVcIjogdGhpcy4kZWxbMF0ubG5hbWUudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJlbWFpbFwiOiB0aGlzLiRlbFswXS5lbWFpbC52YWx1ZSxcbiAgICAgICAgICAgICAgICBcIm5pY2tuYW1lXCI6IHRoaXMuJGVsWzBdLm5pY2tuYW1lLnZhbHVlLFxuICAgICAgICAgICAgICAgIFwiYm9va2luZ3NcIjpbXG4gICAgICAgICAgICAgICAgICAgIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMucm9vbUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBlbmRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgLy8gY29uc29sZS5sb2coICdvbiBTdWJtaXQgwrsgJywgcGF5bG9hZCApO1xuXG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjY2wtaXMtc3VibWl0dGluZycpO1xuICAgICAgICB0aGlzLiRmb3JtQ2FuY2VsLnByb3AoJ2Rpc2FibGVkJyx0cnVlKTtcbiAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdC50ZXh0KCdTZW5kaW5nLi4uJykucHJvcCgnZGlzYWJsZWQnLHRydWUpO1xuXG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgYWN0aW9uOiAncmVxdWVzdF9ib29raW5nJyxcbiAgICAgICAgICAgIGNjbF9ub25jZTogQ0NMLm5vbmNlLFxuICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZFxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBNYWtlIGEgcmVxdWVzdCBoZXJlIHRvIHJlc2VydmUgc3BhY2VcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gICAgICAgICQucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiBDQ0wuYWpheF91cmwsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICBfaGFuZGxlU3VibWl0UmVzcG9uc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFsd2F5cyhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoYXQuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtc3VibWl0dGluZycpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gX2hhbmRsZVN1Ym1pdFJlc3BvbnNlKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgIHZhciByZXNwb25zZUhUTUwsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VPYmplY3QgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcblxuICAgICAgICAgICAgaWYgKCByZXNwb25zZU9iamVjdC5ib29raW5nX2lkICkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTCA9ICBbJzxwIGNsYXNzPVwiY2NsLWgyIGNjbC11LW10LTBcIj5TdWNjZXNzITwvcD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHAgY2xhc3M9XCJjY2wtaDRcIj5Zb3VyIGJvb2tpbmcgSUQgaXMgPHNwYW4gY2xhc3M9XCJjY2wtdS1jb2xvci1zY2hvb2xcIj4nICsgcmVzcG9uc2VPYmplY3QuYm9va2luZ19pZCArICc8L3NwYW4+PC9wPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cCBjbGFzcz1cImNjbC1oNFwiPlBsZWFzZSBjaGVjayB5b3VyIGVtYWlsIHRvIGNvbmZpcm0geW91ciBib29raW5nLjwvcD4nXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MID0gIFsnPHAgY2xhc3M9XCJjY2wtaDMgY2NsLXUtbXQtMFwiPlNvcnJ5LCBidXQgd2UgY291bGRuXFwndCBwcm9jZXNzIHlvdXIgcmVzZXJ2YXRpb24uPC9wPicsJzxwIGNsYXNzPVwiY2NsLWg0XCI+RXJyb3JzOjwvcD4nXTtcbiAgICAgICAgICAgICAgICAkKHJlc3BvbnNlT2JqZWN0LmVycm9ycykuZWFjaChmdW5jdGlvbihpLCBlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTC5wdXNoKCc8cCBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvclwiPicgKyBlcnJvciArICc8L3A+Jyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MLnB1c2goJzxwIGNsYXNzPVwiY2NsLWg0XCI+UGxlYXNlIHRhbGsgdG8geW91ciBuZWFyZXN0IGxpYnJhcmlhbiBmb3IgaGVscC48L3A+Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoYXQuJGZvcm1DYW5jZWwucHJvcCgnZGlzYWJsZWQnLGZhbHNlKS50ZXh0KCdDbG9zZScpO1xuICAgICAgICAgICAgdGhhdC4kZm9ybVN1Ym1pdC5yZW1vdmUoKTtcbiAgICAgICAgICAgIHRoYXQuJGZvcm1Db250ZW50LmFuaW1hdGUoe29wYWNpdHk6IDB9LCBDQ0wuRFVSQVRJT04pO1xuICAgICAgICAgICAgdGhhdC4kZm9ybVJlc3BvbnNlXG4gICAgICAgICAgICAgICAgLmRlbGF5KENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuaHRtbChyZXNwb25zZUhUTUwpO1xuICAgICAgICAgICAgdGhhdC4kZm9ybUNvbnRlbnRcbiAgICAgICAgICAgICAgICAuZGVsYXkoQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5hbmltYXRlKHtoZWlnaHQ6IHRoYXQuJGZvcm1SZXNwb25zZS5oZWlnaHQoKSArICdweCcgfSwgQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5jc3Moe3pJbmRleDogJy0xJ30pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG4gICAgLy8gSGVscGVyc1xuXG4gICAgZnVuY3Rpb24gX3NvcnRCeUtleSggYXJyLCBrZXksIG9yZGVyICkge1xuICAgICAgICBmdW5jdGlvbiBzb3J0QVNDKGEsYikge1xuICAgICAgICAgICAgaWYgKGFba2V5XSA8IGJba2V5XSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFba2V5XSA+IGJba2V5XSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBzb3J0REVTQyhhLGIpIHtcbiAgICAgICAgICAgIGlmIChhW2tleV0gPiBiW2tleV0pe1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhW2tleV0gPCBiW2tleV0pe1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCAnREVTQycgPT09IG9yZGVyICkge1xuICAgICAgICAgICAgYXJyLnNvcnQoc29ydERFU0MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXJyLnNvcnQoc29ydEFTQyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtcm9vbS1yZXMtZm9ybScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBSb29tUmVzRm9ybSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFNtb290aCBTY3JvbGxpbmdcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblxuICAgICAgICAkKCcuanMtc21vb3RoLXNjcm9sbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMpLmRhdGEoJ3RhcmdldCcpIHx8ICQodGhpcykuYXR0cignaHJlZicpLFxuICAgICAgICAgICAgICAgICR0YXJnZXQgPSAkKHRhcmdldCksXG4gICAgICAgICAgICAgICAgc2Nyb2xsT2Zmc2V0ID0gMDtcblxuICAgICAgICAgICAgJCgnLmNjbC1pcy1maXhlZCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBzY3JvbGxPZmZzZXQgKz0gJCh0aGlzKS5vdXRlckhlaWdodCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggJHRhcmdldC5sZW5ndGggKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFRvcCA9ICR0YXJnZXQub2Zmc2V0KCkudG9wO1xuICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKCB7ICdzY3JvbGxUb3AnOiB0YXJnZXRUb3AgLSBzY3JvbGxPZmZzZXQgfSwgODAwICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU3RpY2tpZXNcbiAqIFxuICogQmVoYXZpb3VyIGZvciBzdGlja3kgZWxlbWVudHMuXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBpc0ZpeGVkOiAnY2NsLWlzLWZpeGVkJ1xuICAgICAgICB9O1xuXG4gICAgdmFyIFN0aWNreSA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICAvLyB2YXJpYWJsZXNcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpLFxuICAgICAgICAgICAgaGVpZ2h0ID0gJGVsLm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICBvZmZzZXQgPSAkZWwub2Zmc2V0KCksXG4gICAgICAgICAgICBvcHRpb25zID0gJGVsLmRhdGEoJ3N0aWNreScpLFxuICAgICAgICAgICAgd3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJqcy1zdGlja3ktd3JhcHBlclwiPjwvZGl2PicpLmNzcyh7IGhlaWdodDogaGVpZ2h0ICsgJ3B4JyB9KTtcblxuICAgICAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgfTtcblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zICk7XG5cbiAgICAgICAgLy8gd3JhcCBlbGVtZW50XG4gICAgICAgICRlbC53cmFwKCB3cmFwcGVyICk7XG5cbiAgICAgICAgLy8gc2Nyb2xsIGxpc3RlbmVyXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgMTAwICkgKTtcblxuICAgICAgICAvLyBvbiBzY3JvbGxcbiAgICAgICAgZnVuY3Rpb24gX29uU2Nyb2xsKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKSArIG9wdGlvbnMub2Zmc2V0O1xuICAgIFxuICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gb2Zmc2V0LnRvcCApIHtcbiAgICAgICAgICAgICAgICAkZWwuYWRkQ2xhc3MoIGNsYXNzTmFtZS5pc0ZpeGVkICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLmlzRml4ZWQgKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1pcy1zdGlja3knKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU3RpY2t5KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogVG9nZ2xlIFNjaG9vbHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIHNjaG9vbCB0b2dnbGVzXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIGluaXRTY2hvb2wgPSAkKCdodG1sJykuZGF0YSgnc2Nob29sJyk7XG5cbiAgICB2YXIgU2Nob29sU2VsZWN0ID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kc2VsZWN0ID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgU2Nob29sU2VsZWN0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIGlmICggaW5pdFNjaG9vbCApIHtcblxuICAgICAgICAgICAgdGhpcy4kc2VsZWN0XG4gICAgICAgICAgICAgICAgLmZpbmQoICdvcHRpb25bdmFsdWU9XCInICsgaW5pdFNjaG9vbCArICdcIl0nIClcbiAgICAgICAgICAgICAgICAuYXR0ciggJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyApOyAgIFxuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRzZWxlY3QuY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hdHRyKCAgJ2RhdGEtc2Nob29sJywgZXZlbnQudGFyZ2V0LnZhbHVlICk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJzY2hvb2xcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU2Nob29sU2VsZWN0KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIFRvb2x0aXBzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciB0b29sdGlwc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgVG9vbHRpcCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy4kZWwuYXR0cigndGl0bGUnKTtcbiAgICAgICAgdGhpcy4kdG9vbHRpcCA9ICQoJzxkaXYgaWQ9XCJjY2wtY3VycmVudC10b29sdGlwXCIgY2xhc3M9XCJjY2wtYy10b29sdGlwIGNjbC1pcy10b3BcIiByb2xlPVwidG9vbHRpcFwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19hcnJvd1wiPjwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19pbm5lclwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBUb29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuaG92ZXIoZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIC8vIG1vdXNlb3ZlclxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCAnJyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cignYXJpYS1kZXNjcmliZWRieScsICdjY2wtY3VycmVudC10b29sdGlwJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblxuICAgICAgICAgICAgQ0NMLnJlZmxvdyhfdGhpcy4kdG9vbHRpcFswXSk7XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBfdGhpcy4kZWwub2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgd2lkdGggID0gX3RoaXMuJGVsLm91dGVyV2lkdGgoKSxcbiAgICAgICAgICAgICAgICB0b29sdGlwSGVpZ2h0ID0gX3RoaXMuJHRvb2x0aXAub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuY3NzKHtcbiAgICAgICAgICAgICAgICB0b3A6IChvZmZzZXQudG9wIC0gdG9vbHRpcEhlaWdodCkgKyAncHgnLFxuICAgICAgICAgICAgICAgIGxlZnQ6IChvZmZzZXQubGVmdCArICh3aWR0aC8yKSkgKyAncHgnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgIH0sIGZ1bmN0aW9uKGUpeyBcblxuICAgICAgICAgICAgLy9tb3VzZW91dFxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCBfdGhpcy5jb250ZW50KTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgJycpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlKCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBUb29sdGlwKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogV2F5ZmluZGluZ1xuICogXG4gKiBDb250cm9scyBpbnRlcmZhY2UgZm9yIGxvb2tpbmcgdXAgY2FsbCBudW1iZXIgbG9jYXRpb25zXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICB0YWJzLCB3YXlmaW5kZXI7XG4gICAgXG4gICAgdmFyIFRhYnMgPSBmdW5jdGlvbihlbCkge1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdGFicyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy10YWInKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMgPSAkKCcuY2NsLWMtdGFiX19jb250ZW50Jyk7XG4gICAgICAgIFxuXG4gICAgICAgIHRoaXMuJHRhYnMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICR0YWIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHRhYi5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICR0YWIuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0QWN0aXZlKHRhcmdldCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFRhYnMucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKHRhcmdldCl7XG4gICAgICAgIHRoaXMuJHRhYnMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFicy5maWx0ZXIoJ1tocmVmPVwiJyt0YXJnZXQrJ1wiXScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIHZhciBXYXlmaW5kZXIgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuY2FsbE51bWJlcnMgPSB7fTtcbiAgICAgICAgdGhpcy4kZm9ybSA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bWJlci1zZWFyY2gnKTtcbiAgICAgICAgdGhpcy4kaW5wdXQgPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW0taW5wdXQnKTtcbiAgICAgICAgdGhpcy4kc3VibWl0ID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtLXN1Ym1pdCcpO1xuICAgICAgICB0aGlzLiRtYXJxdWVlID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fbWFycXVlZScpO1xuICAgICAgICB0aGlzLiRjYWxsTnVtID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fY2FsbC1udW0nKTtcbiAgICAgICAgdGhpcy4kd2luZyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX3dpbmcnKTtcbiAgICAgICAgdGhpcy4kZmxvb3IgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19mbG9vcicpO1xuICAgICAgICB0aGlzLiRzdWJqZWN0ID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fc3ViamVjdCcpO1xuICAgICAgICB0aGlzLmVycm9yID0ge1xuICAgICAgICAgICAgZ2V0OiAnPGRpdiBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvciBjY2wtd2F5ZmluZGVyX19lcnJvclwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2NsLWItY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPjxpIGNsYXNzPVwiY2NsLWItaWNvbiBhbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gVGhlcmUgd2FzIGFuIGVycm9yIGZldGNoaW5nIGNhbGwgbnVtYmVycy48L2Rpdj4nLFxuICAgICAgICAgICAgZmluZDogJzxkaXYgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3IgY2NsLXdheWZpbmRlcl9fZXJyb3JcIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNjbC1iLWNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj48aSBjbGFzcz1cImNjbC1iLWljb24gYWxlcnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IENvdWxkIG5vdCBmaW5kIHRoYXQgY2FsbCBudW1iZXIuIFBsZWFzZSB0cnkgYWdhaW4uPC9kaXY+J1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRlcnJvckJveCA9ICQoJy5jY2wtZXJyb3ItYm94Jyk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAkLmdldEpTT04oIENDTC5hc3NldHMgKyAnanMvY2FsbC1udW1iZXJzLmpzb24nIClcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIF90aGlzLmNhbGxOdW1iZXJzID0gZGF0YTtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGVycm9yQm94LmFwcGVuZCggdGhpcy5lcnJvci5nZXQgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1hcHAtYWN0aXZlJyk7XG5cbiAgICAgICAgdGhpcy4kaW5wdXRcbiAgICAgICAgICAgIC5rZXl1cChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHF1ZXJ5ID09PSBcIlwiICkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3VibWl0LmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRtYXJxdWVlLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVzZXQoKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGZvcm0uc3VibWl0KGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBfdGhpcy4kaW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgICQoJy5jY2wtd2F5ZmluZGVyX19lcnJvcicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuc2hvdygpO1xuICAgICAgICAgICAgX3RoaXMuJGNhbGxOdW0udGV4dChxdWVyeSk7XG4gICAgICAgICAgICBfdGhpcy5maW5kUm9vbSggcXVlcnkgKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5nZXRDYWxsS2V5ID0gZnVuY3Rpb24oY2FsbE51bSkge1xuICAgICAgICB2YXIga2V5LFxuICAgICAgICAgICAgY2FsbEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmNhbGxOdW1iZXJzKTtcblxuICAgICAgICBpZiAoIGNhbGxLZXlzLmxlbmd0aCA9PT0gMCApe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbEtleXMuZm9yRWFjaChmdW5jdGlvbihrKXtcbiAgICAgICAgICBpZiAoIGNhbGxOdW0gPj0gayApIHtcbiAgICAgICAgICAgIGtleSA9IGs7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmZpbmRSb29tID0gZnVuY3Rpb24ocXVlcnkpIHtcblxuICAgICAgICBxdWVyeSA9IHF1ZXJ5LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgY2FsbEtleSA9IHRoaXMuZ2V0Q2FsbEtleShxdWVyeSksXG4gICAgICAgICAgICBjYWxsRGF0YSA9IHt9LFxuICAgICAgICAgICAgcm9vbTtcblxuICAgICAgICBpZiAoICEgY2FsbEtleSApIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dGaW5kRXJyb3IoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKCcuY2NsLWMtc2VhcmNoJykub2Zmc2V0KCkudG9wIH0pO1xuICAgICAgICBcbiAgICAgICAgY2FsbERhdGEgPSB0aGlzLmNhbGxOdW1iZXJzW2NhbGxLZXldO1xuXG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoIGNhbGxEYXRhLmZsb29yICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggY2FsbERhdGEud2luZyApO1xuICAgICAgICB0aGlzLiRzdWJqZWN0LnRleHQoIGNhbGxEYXRhLnN1YmplY3QgKTtcblxuICAgICAgICAvKiBUT0RPOlxuICAgICAgICAgKiBzZXQgQUNUVUFMIHJvb20sIG5vdCBqdXN0IHRoZSBmbG9vci4gc3RpbGwgd2FpdGluZyBvbiBjbGllbnQgXG4gICAgICAgICAqIHRvIHByb3ZpZGUgZGF0YSBmb3Igd2hpY2ggY2FsbCBudW1iZXJzIGJlbG9uZyB0byB3aGljaCByb29tc1xuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgICAgIHJvb20gPSBjYWxsRGF0YS5mbG9vcl9pbnQ7XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWY9XCIjZmxvb3ItJytyb29tKydcIl0nKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjcm9vbS0nK3Jvb20rJy0xJykuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcblxuICAgICAgICB0YWJzLnNldEFjdGl2ZSggJyNmbG9vci0nICsgcm9vbSApO1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUudGhyb3dGaW5kRXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdC50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiRlcnJvckJveC5hcHBlbmQoIHRoaXMuZXJyb3IuZmluZCApO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWpzLXRhYnMnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0YWJzID0gbmV3IFRhYnModGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuY2NsLWpzLXdheWZpbmRlcicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHdheWZpbmRlciA9IG5ldyBXYXlmaW5kZXIodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIl19
