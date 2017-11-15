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
        this.toggleOffset = $('.site-content').offset().top;
        this.$subMenus = this.$el.find('.sub-menu');
        this.$scrollSpyItems = this.$el.find('.ccl-c-quick-nav__scrollspy span');
        this.$searchToggle = this.$el.find('.ccl-is-search-toggle');

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
        
        $window.scroll( CCL.throttle( _onScroll, 100 ) );

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
                $target = $(target);

            if ( $target.length ) {
                var targetOffset = $target.offset().top;
                $('html, body').animate( {'scrollTop': targetOffset}, 800 );
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkcm9wZG93bnMuanMiLCJoZWFkZXItbWVudS10b2dnbGVzLmpzIiwibW9kYWxzLmpzIiwicXVpY2stbmF2LmpzIiwicm9vbS1yZXMuanMiLCJzbW9vdGgtc2Nyb2xsLmpzIiwic3RpY2tpZXMuanMiLCJ0b2dnbGUtc2Nob29scy5qcyIsInRvb2x0aXBzLmpzIiwid2F5ZmluZGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbDBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBHbG9iYWwgVmFyaWFibGVzLiBcbiAqL1xuXG5cbihmdW5jdGlvbiAoICQsIHdpbmRvdyApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuICAgIFxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLkRVUkFUSU9OID0gMzAwO1xuXG4gICAgQ0NMLkJSRUFLUE9JTlRfU00gPSA1MDA7XG4gICAgQ0NMLkJSRUFLUE9JTlRfTUQgPSA3Njg7XG4gICAgQ0NMLkJSRUFLUE9JTlRfTEcgPSAxMDAwO1xuICAgIENDTC5CUkVBS1BPSU5UX1hMID0gMTUwMDtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ2h0bWwnKS50b2dnbGVDbGFzcygnbm8tanMganMnKTtcbiAgICB9KTtcblxufSkoalF1ZXJ5LCB0aGlzKTsiLCIvKipcbiAqIFJlZmxvdyBwYWdlIGVsZW1lbnRzLiBcbiAqIFxuICogRW5hYmxlcyBhbmltYXRpb25zL3RyYW5zaXRpb25zIG9uIGVsZW1lbnRzIGFkZGVkIHRvIHRoZSBwYWdlIGFmdGVyIHRoZSBET00gaGFzIGxvYWRlZC5cbiAqL1xuXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5yZWZsb3cgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgfTtcblxufSkoKTsiLCIvKipcbiAqIEdldCB0aGUgU2Nyb2xsYmFyIHdpZHRoXG4gKiBUaGFua3MgdG8gZGF2aWQgd2Fsc2g6IGh0dHBzOi8vZGF2aWR3YWxzaC5uYW1lL2RldGVjdC1zY3JvbGxiYXItd2lkdGhcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcbiAgICBcbiAgICBmdW5jdGlvbiBnZXRTY3JvbGxXaWR0aCgpIHtcbiAgICAgICAgXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWVhc3VyZW1lbnQgbm9kZVxuICAgICAgICB2YXIgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgXG4gICAgICAgIC8vIHBvc2l0aW9uIHdheSB0aGUgaGVsbCBvZmYgc2NyZWVuXG4gICAgICAgICQoc2Nyb2xsRGl2KS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6ICcxMDBweCcsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDBweCcsXG4gICAgICAgICAgICBvdmVyZmxvdzogJ3Njcm9sbCcsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogJy05OTk5cHgnLFxuICAgICAgICB9KTtcblxuICAgICAgICAkKCdib2R5JykuYXBwZW5kKHNjcm9sbERpdik7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBzY3JvbGxiYXIgd2lkdGhcbiAgICAgICAgdmFyIHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoO1xuICAgICAgICAvLyBjb25zb2xlLndhcm4oc2Nyb2xsYmFyV2lkdGgpOyAvLyBNYWM6ICAxNVxuXG4gICAgICAgIC8vIERlbGV0ZSB0aGUgRElWIFxuICAgICAgICAkKHNjcm9sbERpdikucmVtb3ZlKCk7XG5cbiAgICAgICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoO1xuICAgIH1cbiAgICBcbiAgICBpZiAoICEgd2luZG93LkNDTCApIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5nZXRTY3JvbGxXaWR0aCA9IGdldFNjcm9sbFdpZHRoO1xuICAgIENDTC5TQ1JPTExCQVJXSURUSCA9IGdldFNjcm9sbFdpZHRoKCk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIC5kZWJvdW5jZSgpIGZ1bmN0aW9uXG4gKiBcbiAqIFNvdXJjZTogaHR0cHM6Ly9kYXZpZHdhbHNoLm5hbWUvamF2YXNjcmlwdC1kZWJvdW5jZS1mdW5jdGlvblxuICovXG5cblxuKGZ1bmN0aW9uKHdpbmRvdykge1xuXG4gICAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gICAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gICAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAgIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gICAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4gICAgdmFyIHRocm90dGxlID0gZnVuY3Rpb24gKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHRpbWVvdXQsIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICAgICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICAgICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG5cbiAgICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHRocm90dGxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICAgICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICAgICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICAgICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHRocm90dGxlZC5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICBwcmV2aW91cyA9IDA7XG4gICAgICAgICAgICB0aW1lb3V0ID0gY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB0aHJvdHRsZWQ7XG4gICAgfTtcblxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgd2luZG93LkNDTC50aHJvdHRsZSA9IHRocm90dGxlO1xuXG59KSh0aGlzKTsiLCIvKipcbiAqIEFjY29yZGlvbnNcbiAqIFxuICogQmVoYXZpb3IgZm9yIGFjY29yZGlvbiBjb21wb25lbnRzXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBBY2NvcmRpb24gPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHRvZ2dsZSA9IHRoaXMuJGVsLmNoaWxkcmVuKCcuY2NsLWMtYWNjb3JkaW9uX190b2dnbGUnKTtcbiAgICAgICAgdGhpcy4kY29udGVudCA9IHRoaXMuJGVsLmNoaWxkcmVuKCcuY2NsLWMtYWNjb3JkaW9uX19jb250ZW50Jyk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBBY2NvcmRpb24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHRvZ2dsZS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLiRjb250ZW50LnNsaWRlVG9nZ2xlKCk7XG4gICAgICAgICAgICBfdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ2NjbC1pcy1vcGVuJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5jY2wtYy1hY2NvcmRpb24nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgQWNjb3JkaW9uKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogQWxlcnRzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBhbGVydHNcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgRFVSQVRJT04gPSBDQ0wuRFVSQVRJT047XG5cbiAgICB2YXIgQWxlcnREaXNtaXNzID0gZnVuY3Rpb24oJGVsKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJGVsO1xuICAgICAgICB0aGlzLnRhcmdldCA9ICRlbC5wYXJlbnQoKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgQWxlcnREaXNtaXNzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICBfdGhpcy4kdGFyZ2V0LmFuaW1hdGUoIHsgb3BhY2l0eTogMCB9LCB7XG4gICAgICAgICAgICBkdXJhdGlvbjogRFVSQVRJT04sXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LnNsaWRlVXAoIERVUkFUSU9OLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cblxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJChkb2N1bWVudCkub24oICdjbGljaycsICdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIHZhciBkaXNtaXNzRWwgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nKTtcbiAgICAgICAgICAgIG5ldyBBbGVydERpc21pc3MoZGlzbWlzc0VsKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKHRoaXMsIGpRdWVyeSk7IiwiLyoqXG4gKiBDYXJvdXNlbHNcbiAqIFxuICogSW5pdGlhbGl6ZSBhbmQgZGVmaW5lIGJlaGF2aW9yIGZvciBjYXJvdXNlbHMuIFxuICogVXNlcyB0aGUgU2xpY2sgU2xpZGVzIGpRdWVyeSBwbHVnaW4gLS0+IGh0dHA6Ly9rZW53aGVlbGVyLmdpdGh1Yi5pby9zbGljay9cbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIENhcm91c2VsID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuZ2xvYmFsRGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgIGRvdHNDbGFzczogJ2NjbC1jLWNhcm91c2VsX19wYWdpbmcnLFxuICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfTtcblxuICAgIENhcm91c2VsLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy4kZWwuZGF0YSgpLFxuICAgICAgICAgICAgb3B0aW9ucyA9IGRhdGEub3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIFxuICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUgPSBbXTtcblxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc1NtICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX1NNLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zU21cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zTWQgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfTUQsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNNZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNMZyApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9MRywgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc0xnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc1hsICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX1hMLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zWGxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKCB0aGlzLmdsb2JhbERlZmF1bHRzLCBvcHRpb25zICk7XG5cbiAgICAgICAgdmFyIGNhcm91c2VsID0gdGhpcy4kZWwuc2xpY2sob3B0aW9ucyksXG4gICAgICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgY2Fyb3VzZWwub24oJ2JlZm9yZUNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlLCBuZXh0U2xpZGUpe1xuICAgICAgICAgICAgX3RoaXMuJGVsLmZpbmQoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtcGFzdCcpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLmZpbmQoJy5zbGljay1zbGlkZVtkYXRhLXNsaWNrLWluZGV4PVwiJytuZXh0U2xpZGUrJ1wiXScpLnByZXZBbGwoKS5hZGRDbGFzcygnY2NsLWlzLXBhc3QnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1wcm9tby1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBDYXJvdXNlbCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIERyb3Bkb3duc1xuICogXG4gKiBJbml0aWFsaXplIGFuZCBjb250cm9sIGJlaGF2aW9yIGZvciBkcm9wZG93biBtZW51c1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICBUT0dHTEU6ICdbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXScsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZSA9IHtcbiAgICAgICAgICAgIEFDVElWRTogJ2NjbC1pcy1hY3RpdmUnLFxuICAgICAgICAgICAgQ09OVEVOVDogJ2NjbC1jLWRyb3Bkb3duX19jb250ZW50J1xuICAgICAgICB9O1xuXG4gICAgdmFyIERyb3Bkb3duVG9nZ2xlID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiR0b2dnbGUgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kcGFyZW50ID0gdGhpcy4kdG9nZ2xlLnBhcmVudCgpO1xuICAgICAgICBcbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuJHRvZ2dsZS5kYXRhKCd0YXJnZXQnKTtcblxuICAgICAgICB0aGlzLiRjb250ZW50ID0gJCggdGFyZ2V0ICk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kdG9nZ2xlLmNsaWNrKCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBfdGhpcy50b2dnbGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIHZhciBoYXNBY3RpdmVNZW51cyA9ICQoICcuJyArIGNsYXNzTmFtZS5DT05URU5UICsgJy4nICsgY2xhc3NOYW1lLkFDVElWRSApLmxlbmd0aDtcbiAgICAgICAgICAgIGlmICggaGFzQWN0aXZlTWVudXMgKXtcbiAgICAgICAgICAgICAgICBfY2xlYXJNZW51cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgaXNBY3RpdmUgPSB0aGlzLiR0b2dnbGUuaGFzQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcblxuICAgICAgICBpZiAoIGlzQWN0aXZlICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93Q29udGVudCgpO1xuXG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5zaG93Q29udGVudCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgdGhpcy4kY29udGVudC5hZGRDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICB0aGlzLiRwYXJlbnQuYWRkQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLmhpZGVNZW51ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgdGhpcy4kY29udGVudC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICB0aGlzLiRwYXJlbnQucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX2NsZWFyTWVudXMoKSB7XG4gICAgICAgICQoJy5jY2wtYy1kcm9wZG93biwgLmNjbC1jLWRyb3Bkb3duX19jb250ZW50JykucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgJCggc2VsZWN0b3IuVE9HR0xFICkuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoIHNlbGVjdG9yLlRPR0dMRSApLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBEcm9wZG93blRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIEhlYWRlciBNZW51IFRvZ2dsZXNcbiAqIFxuICogQ29udHJvbHMgYmVoYXZpb3Igb2YgbWVudSB0b2dnbGVzIGluIHRoZSBoZWFkZXJcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIEhlYWRlck1lbnVUb2dnbGUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLnRhcmdldCA9IHRoaXMuJGVsLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgdGhpcy4kcGFyZW50TWVudSA9IHRoaXMuJGVsLmNsb3Nlc3QoJy5jY2wtYy1tZW51Jyk7XG4gICAgICAgIHRoaXMuJGNsb3NlSWNvbiA9ICQoJzxpIGNsYXNzPVwiY2NsLWItaWNvbiBjbG9zZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4nKTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgSGVhZGVyTWVudVRvZ2dsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGUgdGFyZ2V0IGlzIGFscmVhZHkgb3BlblxuICAgICAgICAgICAgaWYgKCB0aGF0LiR0YXJnZXQuaGFzQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKSApIHtcblxuICAgICAgICAgICAgICAgIC8vIGNsb3NlIHRhcmdldCBhbmQgcmVtb3ZlIGFjdGl2ZSBjbGFzc2VzL2VsZW1lbnRzXG4gICAgICAgICAgICAgICAgdGhhdC4kcGFyZW50TWVudS5yZW1vdmVDbGFzcygnY2NsLWhhcy1hY3RpdmUtaXRlbScpO1xuICAgICAgICAgICAgICAgIHRoYXQuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgdGhhdC4kdGFyZ2V0LnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJykuZmFkZU91dChDQ0wuRFVSQVRJT04pO1xuICAgICAgICAgICAgICAgIHRoYXQuJGNsb3NlSWNvbi5yZW1vdmUoKTsgICAgICAgXG5cbiAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgIC8vIHRhcmdldCBpcyBub3Qgb3BlblxuICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvLyBjbG9zZSBhbmQgcmVzZXQgYWxsIGFjdGl2ZSBtZW51c1xuICAgICAgICAgICAgICAgICQoJy5jY2wtYy1tZW51LmNjbC1oYXMtYWN0aXZlLWl0ZW0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLWhhcy1hY3RpdmUtaXRlbScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnYS5jY2wtaXMtYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5jY2wtYi1pY29uLmNsb3NlJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gY2xvc2UgYW5kIHJlc2V0IGFsbCBhY3RpdmUgc3ViLW1lbnUgY29udGFpbmVyc1xuICAgICAgICAgICAgICAgICQoJy5jY2wtYy1zdWItbWVudS1jb250YWluZXIuY2NsLWlzLWFjdGl2ZScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpLmZhZGVPdXQoQ0NMLkRVUkFUSU9OKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIGFjdGl2YXRlIHRoZSBzZWxlY3RlZCB0YXJnZXRcbiAgICAgICAgICAgICAgICB0aGF0LiRwYXJlbnRNZW51LmFkZENsYXNzKCdjY2wtaGFzLWFjdGl2ZS1pdGVtJyk7XG4gICAgICAgICAgICAgICAgdGhhdC4kdGFyZ2V0LmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJykuZmFkZUluKENDTC5EVVJBVElPTik7XG4gICAgICAgICAgICAgICAgLy8gcHJlcGVuZCBjbG9zZSBpY29uXG4gICAgICAgICAgICAgICAgdGhhdC4kY2xvc2VJY29uLnByZXBlbmRUbyh0aGF0LiRlbCk7XG4gICAgICAgICAgICAgICAgQ0NMLnJlZmxvdyh0aGF0LiRjbG9zZUljb25bMF0pO1xuICAgICAgICAgICAgICAgIHRoYXQuJGNsb3NlSWNvbi5mYWRlSW4oMjAwKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmpzLXRvZ2dsZS1oZWFkZXItbWVudScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBIZWFkZXJNZW51VG9nZ2xlKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogTW9kYWxzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBtb2RhbHMuIEJhc2VkIG9uIEJvb3RzdHJhcCdzIG1vZGFsczogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvNC4wL2NvbXBvbmVudHMvbW9kYWwvXG4gKiBcbiAqIEdsb2JhbHM6XG4gKiBTQ1JPTExCQVJXSURUSFxuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBEVVJBVElPTiA9IDMwMDtcblxuICAgIHZhciBNb2RhbFRvZ2dsZSA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgXG4gICAgICAgIHZhciAkZWwgPSAkKGVsKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gJGVsLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpczsgXG5cbiAgICAgICAgX3RoaXMuJGVsLm9uKCAnY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKCAkKGRvY3VtZW50LmJvZHkpLmhhc0NsYXNzKCdjY2wtbW9kYWwtb3BlbicpICkge1xuICAgICAgICAgICAgICAgIF90aGlzLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0JhY2tkcm9wKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnNob3dNb2RhbCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuc2hvd0JhY2tkcm9wID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuXG4gICAgICAgIHZhciBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB2YXIgJGJhY2tkcm9wID0gJChiYWNrZHJvcCk7XG5cbiAgICAgICAgJGJhY2tkcm9wLmFkZENsYXNzKCdjY2wtYy1tb2RhbF9fYmFja2Ryb3AnKTtcbiAgICAgICAgJGJhY2tkcm9wLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuICAgICAgICBcbiAgICAgICAgQ0NMLnJlZmxvdyhiYWNrZHJvcCk7XG4gICAgICAgIFxuICAgICAgICAkYmFja2Ryb3AuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgICQoZG9jdW1lbnQuYm9keSlcbiAgICAgICAgICAgIC5hZGRDbGFzcygnY2NsLW1vZGFsLW9wZW4nKVxuICAgICAgICAgICAgLmNzcyggJ3BhZGRpbmctcmlnaHQnLCBDQ0wuU0NST0xMQkFSV0lEVEggKTtcblxuICAgICAgICBpZiAoIGNhbGxiYWNrICkge1xuICAgICAgICAgICAgc2V0VGltZW91dCggY2FsbGJhY2ssIERVUkFUSU9OICk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLnNob3dNb2RhbCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIF90aGlzLiR0YXJnZXQuc2hvdyggMCwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIF90aGlzLiR0YXJnZXQuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICQoJy5jY2wtYy1tb2RhbCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWwnKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbF9fYmFja2Ryb3AnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbF9fYmFja2Ryb3AnKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuYm9keSlcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtbW9kYWwtb3BlbicpXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoICdwYWRkaW5nLXJpZ2h0JywgJycgKTtcblxuICAgICAgICAgICAgfSwgRFVSQVRJT04pO1xuXG4gICAgICAgIH0sIERVUkFUSU9OICk7IFxuXG4gICAgfTtcblxuXG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBNb2RhbFRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKHRoaXMsIGpRdWVyeSk7IiwiLyoqXG4gKiBRdWljayBOYXZcbiAqIFxuICogQmVoYXZpb3IgZm9yIHRoZSBxdWljayBuYXZcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KSxcbiAgICAgICAgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgUXVpY2tOYXYgPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy50b2dnbGVPZmZzZXQgPSAkKCcuc2l0ZS1jb250ZW50Jykub2Zmc2V0KCkudG9wO1xuICAgICAgICB0aGlzLiRzdWJNZW51cyA9IHRoaXMuJGVsLmZpbmQoJy5zdWItbWVudScpO1xuICAgICAgICB0aGlzLiRzY3JvbGxTcHlJdGVtcyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1xdWljay1uYXZfX3Njcm9sbHNweSBzcGFuJyk7XG4gICAgICAgIHRoaXMuJHNlYXJjaFRvZ2dsZSA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtaXMtc2VhcmNoLXRvZ2dsZScpO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5pbml0U2Nyb2xsKCk7XG4gICAgICAgIHRoaXMuaW5pdE1lbnVzKCk7XG4gICAgICAgIHRoaXMuaW5pdFNjcm9sbFNweSgpO1xuICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcblxuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdFNjcm9sbCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgJHdpbmRvdy5zY3JvbGwoIENDTC50aHJvdHRsZSggX29uU2Nyb2xsLCAxMDAgKSApO1xuXG4gICAgICAgIGZ1bmN0aW9uIF9vblNjcm9sbCgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCk7XG4gICAgXG4gICAgICAgICAgICBpZiAoIHNjcm9sbFRvcCA+PSB0aGF0LnRvZ2dsZU9mZnNldCApIHtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5hZGRDbGFzcygnY2NsLWlzLWZpeGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoYXQuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtZml4ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFF1aWNrTmF2LnByb3RvdHlwZS5pbml0TWVudXMgPSBmdW5jdGlvbigpe1xuICAgICAgICBpZiAoICEgdGhpcy4kc3ViTWVudXMubGVuZ3RoICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kc3ViTWVudXMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICRzdWJNZW51ID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAkdG9nZ2xlID0gJHN1Yk1lbnUuc2libGluZ3MoJ2EnKTtcblxuICAgICAgICAgICAgJHRvZ2dsZS5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgJHN1Yk1lbnUuc2xpZGVUb2dnbGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgUXVpY2tOYXYucHJvdG90eXBlLmluaXRTY3JvbGxTcHkgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLiRzY3JvbGxTcHlJdGVtcy5lYWNoKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHZhciAkc3B5SXRlbSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gJHNweUl0ZW0uZGF0YSgndGFyZ2V0Jyk7XG5cbiAgICAgICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgMTAwICkgKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gX29uU2Nyb2xsKCkge1xuICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUb3AgPSAkKHRhcmdldCkub2Zmc2V0KCkudG9wIC0gMTUwO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gdGFyZ2V0VG9wICkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LiRzY3JvbGxTcHlJdGVtcy5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAkc3B5SXRlbS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzcHlJdGVtLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUXVpY2tOYXYucHJvdG90eXBlLmluaXRTZWFyY2ggPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuJHNlYXJjaFRvZ2dsZS5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhhdC4kZWwudG9nZ2xlQ2xhc3MoJ2NjbC1zZWFyY2gtYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWMtcXVpY2stbmF2JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFF1aWNrTmF2KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogUm9vbSBSZXNlcnZhdGlvblxuICogXG4gKiBIYW5kbGUgcm9vbSByZXNlcnZhdGlvbnNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgUm9vbVJlc0Zvcm0gPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiRmb3JtQ29udGVudCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLWNvbnRlbnQnKS5jc3Moe3Bvc2l0aW9uOidyZWxhdGl2ZSd9KTtcbiAgICAgICAgdGhpcy4kZm9ybVJlc3BvbnNlID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tcmVzcG9uc2UnKS5jc3Moe3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6ICcxcmVtJywgbGVmdDogJzFyZW0nLCBvcGFjaXR5OiAwfSk7XG4gICAgICAgIHRoaXMuJGZvcm1DYW5jZWwgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1jYW5jZWwnKTtcbiAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLXN1Ym1pdCcpO1xuICAgICAgICB0aGlzLnJvb21JZCA9IHRoaXMuJGVsLmRhdGEoJ3Jlc291cmNlLWlkJyk7XG4gICAgICAgIHRoaXMuJGRhdGVTZWxlY3QgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1kYXRlLXNlbGVjdCcpO1xuICAgICAgICB0aGlzLmRhdGVZbWQgPSB0aGlzLiRkYXRlU2VsZWN0LnZhbCgpO1xuICAgICAgICB0aGlzLiRyb29tU2NoZWR1bGUgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1zY2hlZHVsZScpO1xuICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0ID0gdGhpcy4kZWwuZmluZCgnLmpzLWN1cnJlbnQtZHVyYXRpb24nKTtcbiAgICAgICAgdGhpcy4kZm9ybU5vdGlmaWNhdGlvbiA9ICQoJzxwIGNsYXNzPVwiY2NsLWMtYWxlcnRcIj48L3A+Jyk7XG4gICAgICAgIHRoaXMuJHJlc2V0U2VsZWN0aW9uQnRuID0gdGhpcy4kZWwuZmluZCgnLmpzLXJlc2V0LXNlbGVjdGlvbicpOyBcbiAgICAgICAgdGhpcy4kcm9vbVNsb3RJbnB1dHMgPSBudWxsO1xuICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cyA9IFtdO1xuICAgICAgICB0aGlzLm1heFNsb3RzID0gNDtcbiAgICAgICAgdGhpcy4kbWF4VGltZSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1tYXgtdGltZScpO1xuICAgICAgICB0aGlzLnNsb3RNaW51dGVzID0gMzA7XG4gICAgICAgIHRoaXMubG9jYWxlID0gXCJlbi1VU1wiO1xuICAgICAgICB0aGlzLnRpbWVab25lID0ge3RpbWVab25lOiBcIkFtZXJpY2EvTG9zX0FuZ2VsZXNcIn07XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHRoaXMuc2V0TG9hZGluZygpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2NoZWR1bGVEYXRhKCk7XG5cbiAgICAgICAgdGhpcy5zZXRNYXhUaW1lVGV4dCgpO1xuXG4gICAgICAgIHRoaXMuaW5pdERhdGVFdmVudHMoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdEZvcm1FdmVudHMoKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmdldFNwYWNlQXZhaWxhYmlsaXR5ID0gZnVuY3Rpb24oWW1kKXtcblxuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0YWN0aW9uOiAnZ2V0X3Jvb21faW5mbycsXG5cdFx0XHRjY2xfbm9uY2U6IENDTC5ub25jZSxcblx0XHRcdGF2YWlsYWJpbGl0eTogWW1kIHx8ICcnLCAvLyBlLmcuICcyMDE3LTEwLTE5Jy4gZW1wdHkgc3RyaW5nIHdpbGwgZ2V0IGF2YWlsYWJpbGl0eSBmb3IgY3VycmVudCBkYXlcblx0XHRcdHJvb206IHRoaXMucm9vbUlkIC8vIHJvb21faWQgKHNwYWNlKVxuXHRcdH07XG5cbiAgICAgICAgcmV0dXJuICQucG9zdCh7XG5cdFx0XHR1cmw6IENDTC5hamF4X3VybCxcblx0XHRcdGRhdGE6IGRhdGFcblx0XHR9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuZ2V0U3BhY2VCb29raW5ncyA9IGZ1bmN0aW9uKFltZCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIGFjdGlvbjogJ2dldF9ib29raW5ncycsXG4gICAgICAgICAgICBjY2xfbm9uY2U6IENDTC5ub25jZSxcbiAgICAgICAgICAgIGRhdGU6IFltZCB8fCAnJywgLy8gZS5nLiAnMjAxNy0xMC0xOScuIGVtcHR5IHN0cmluZyB3aWxsIGdldCBib29raW5ncyBmb3IgY3VycmVudCBkYXlcbiAgICAgICAgICAgIHJvb206IHRoaXMucm9vbUlkLFxuICAgICAgICAgICAgbGltaXQ6IDUwXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuICQucG9zdCh7XG4gICAgICAgICAgICB1cmw6IENDTC5hamF4X3VybCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnVwZGF0ZVNjaGVkdWxlRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGdldFNwYWNlanFYSFIgPSB0aGlzLmdldFNwYWNlQXZhaWxhYmlsaXR5KHRoaXMuZGF0ZVltZCk7XG4gICAgICAgIHZhciBnZXRCb29raW5nc2pxWEhSID0gdGhpcy5nZXRTcGFjZUJvb2tpbmdzKHRoaXMuZGF0ZVltZCk7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAkLndoZW4oZ2V0U3BhY2VqcVhIUiwgZ2V0Qm9va2luZ3NqcVhIUilcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGdldFNwYWNlLGdldEJvb2tpbmdzKXtcblxuICAgICAgICAgICAgICAgIHZhciBzcGFjZURhdGEgPSBnZXRTcGFjZVswXSxcbiAgICAgICAgICAgICAgICAgICAgYm9va2luZ3NEYXRhID0gZ2V0Qm9va2luZ3NbMF0sXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlanFYSFIgPSBnZXRTcGFjZVsyXSxcbiAgICAgICAgICAgICAgICAgICAgYm9va2luZ3NqcVhIUiA9IGdldEJvb2tpbmdzWzJdLFxuICAgICAgICAgICAgICAgICAgICB0aW1lU2xvdHNBcnJheTtcblxuICAgICAgICAgICAgICAgIC8vIHBhcnNlIGRhdGEgdG8gSlNPTiBpZiBpdCdzIGEgc3RyaW5nXG4gICAgICAgICAgICAgICAgc3BhY2VEYXRhID0gKCB0eXBlb2Ygc3BhY2VEYXRhID09PSAnc3RyaW5nJyApID8gSlNPTi5wYXJzZSggc3BhY2VEYXRhIClbMF0gOiBzcGFjZURhdGFbMF07XG4gICAgICAgICAgICAgICAgYm9va2luZ3NEYXRhID0gKCB0eXBlb2YgYm9va2luZ3NEYXRhID09PSAnc3RyaW5nJyApID8gSlNPTi5wYXJzZSggYm9va2luZ3NEYXRhICkgOiBib29raW5nc0RhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBtZXJnZSBib29raW5ncyB3aXRoIGF2YWlsYWJpbGl0eVxuICAgICAgICAgICAgICAgIGlmICggYm9va2luZ3NEYXRhLmxlbmd0aCApe1xuXG4gICAgICAgICAgICAgICAgICAgIGJvb2tpbmdzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGJvb2tpbmcsaSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBudW1iZXIgb2Ygc2xvdHMgYmFzZWQgb24gYm9va2luZyBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21UaW1lID0gbmV3IERhdGUoYm9va2luZy5mcm9tRGF0ZSkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvVGltZSA9IG5ldyBEYXRlKGJvb2tpbmcudG9EYXRlKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25NaW51dGVzID0gKHRvVGltZSAtIGZyb21UaW1lKSAvIDEwMDAgLyA2MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbG90Q291bnQgPSBkdXJhdGlvbk1pbnV0ZXMgLyB0aGF0LnNsb3RNaW51dGVzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZURhdGEuYXZhaWxhYmlsaXR5LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBib29raW5nLmZyb21EYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidG9cIjogYm9va2luZy50b0RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzbG90Q291bnRcIjogc2xvdENvdW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXNCb29rZWRcIjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBzb3J0IHRpbWUgc2xvdCBvYmplY3RzIGJ5IHRoZSBcImZyb21cIiBrZXlcbiAgICAgICAgICAgICAgICAgICAgX3NvcnRCeUtleSggc3BhY2VEYXRhLmF2YWlsYWJpbGl0eSwgJ2Zyb20nICk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBwYXJzZSB0aW1lIHNsb3RzIGFuZCByZXR1cm4gYW4gYXBwcm9wcmlhdGUgc3Vic2V0IChvbmx5IG9wZW4gdG8gY2xvc2UgaG91cnMpXG4gICAgICAgICAgICAgICAgdGltZVNsb3RzQXJyYXkgPSB0aGF0LnBhcnNlU2NoZWR1bGUoc3BhY2VEYXRhLmF2YWlsYWJpbGl0eSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYnVpbGQgc2NoZWR1bGUgSFRNTFxuICAgICAgICAgICAgICAgIHRoYXQuYnVpbGRTY2hlZHVsZSh0aW1lU2xvdHNBcnJheSk7XG5cbiAgICAgICAgICAgICAgICAvLyBFcnJvciBoYW5kbGVyc1xuICAgICAgICAgICAgICAgIHNwYWNlanFYSFIuZmFpbChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJvb2tpbmdzanFYSFIuZmFpbChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFsd2F5cyhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoYXQudW5zZXRMb2FkaW5nKCk7XG4gICAgICAgICAgICAgICAgdGhhdC4kcmVzZXRTZWxlY3Rpb25CdG4uaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmJ1aWxkU2NoZWR1bGUgPSBmdW5jdGlvbih0aW1lU2xvdHNBcnJheSl7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgaHRtbCA9IFtdO1xuICAgICAgICAgICAgXG4gICAgICAgIC8vIGNvbnN0cnVjdCBIVE1MIGZvciBlYWNoIHRpbWUgc2xvdFxuICAgICAgICB0aW1lU2xvdHNBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpe1xuXG4gICAgICAgICAgICB2YXIgZnJvbSA9IG5ldyBEYXRlKCBpdGVtLmZyb20gKSxcbiAgICAgICAgICAgICAgICB0aW1lU3RyaW5nLFxuICAgICAgICAgICAgICAgIGl0ZW1DbGFzcyA9ICcnO1xuXG4gICAgICAgICAgICBpZiAoIGZyb20uZ2V0TWludXRlcygpICE9PSAwICkge1xuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmcgPSB0aGF0LnJlYWRhYmxlVGltZSggZnJvbSwgJ2g6bScgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGltZVN0cmluZyA9IHRoYXQucmVhZGFibGVUaW1lKCBmcm9tLCAnaGEnICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggaXRlbS5pc0Jvb2tlZCAmJiBpdGVtLmhhc093blByb3BlcnR5KCdzbG90Q291bnQnKSApIHtcbiAgICAgICAgICAgICAgICBpdGVtQ2xhc3MgPSAnY2NsLWlzLW9jY3VwaWVkIGNjbC1kdXJhdGlvbi0nICsgaXRlbS5zbG90Q291bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGJ1aWxkIHNlbGVjdGFibGUgdGltZSBzbG90c1xuICAgICAgICAgICAgaHRtbC5wdXNoKCB0aGF0LmJ1aWxkVGltZVNsb3Qoe1xuICAgICAgICAgICAgICAgIGlkOiAnc2xvdC0nICsgdGhhdC5yb29tSWQgKyAnLScgKyBpLFxuICAgICAgICAgICAgICAgIGZyb206IGl0ZW0uZnJvbSxcbiAgICAgICAgICAgICAgICB0bzogaXRlbS50byxcbiAgICAgICAgICAgICAgICB0aW1lU3RyaW5nOiB0aW1lU3RyaW5nLFxuICAgICAgICAgICAgICAgIGNsYXNzOiBpdGVtQ2xhc3NcbiAgICAgICAgICAgIH0pICk7XG4gICAgICAgIFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cyA9IFtdO1xuXG4gICAgICAgIHRoaXMuJHJvb21TY2hlZHVsZS5odG1sKCBodG1sLmpvaW4oJycpICk7XG5cbiAgICAgICAgdGhpcy4kcm9vbVNsb3RJbnB1dHMgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtcm9vbV9fc2xvdCBbdHlwZT1cImNoZWNrYm94XCJdJyk7XG5cbiAgICAgICAgdGhpcy5zZXRDdXJyZW50RHVyYXRpb25UZXh0KCk7XG5cbiAgICAgICAgdGhpcy5pbml0U2xvdEV2ZW50cygpO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5idWlsZFRpbWVTbG90ID0gZnVuY3Rpb24odmFycyl7XG4gICAgICAgIFxuICAgICAgICBpZiAoICEgdmFycyB8fCB0eXBlb2YgdmFycyAhPT0gJ29iamVjdCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBjbGFzczogJycsXG4gICAgICAgICAgICBpZDogJycsXG4gICAgICAgICAgICBkaXNhYmxlZDogJycsXG4gICAgICAgICAgICBmcm9tOiAnJyxcbiAgICAgICAgICAgIHRvOiAnJyxcbiAgICAgICAgICAgIHRpbWVTdHJpbmc6ICcnXG4gICAgICAgIH07XG4gICAgICAgIHZhcnMgPSAkLmV4dGVuZChkZWZhdWx0cywgdmFycyk7XG5cbiAgICAgICAgdmFyIHRlbXBsYXRlID0gJycgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy1yb29tX19zbG90ICcgKyB2YXJzLmNsYXNzICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCInICsgdmFycy5pZCArICdcIiBuYW1lPVwiJyArIHZhcnMuaWQgKyAnXCIgdmFsdWU9XCInICsgdmFycy5mcm9tICsgJ1wiIGRhdGEtdG89XCInICsgdmFycy50byArICdcIiAnICsgdmFycy5kaXNhYmxlZCArICcvPicgK1xuICAgICAgICAgICAgICAgICc8bGFiZWwgY2xhc3M9XCJjY2wtYy1yb29tX19zbG90LWxhYmVsXCIgZm9yPVwiJyArIHZhcnMuaWQgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgICAgIHZhcnMudGltZVN0cmluZyArXG4gICAgICAgICAgICAgICAgJzwvbGFiZWw+JyArXG4gICAgICAgICAgICAnPC9kaXY+JztcblxuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5wYXJzZVNjaGVkdWxlID0gZnVuY3Rpb24oc2NoZWR1bGVBcnJheSl7XG4gICAgICAgIC8vIHJldHVybnMgdGhlIGFwcHJvcHJpYXRlIHNjaGVkdWxlIGZvciBhIGdpdmVuIGFycmF5IG9mIHRpbWUgc2xvdHNcbiAgICAgICAgXG4gICAgICAgIHZhciB0byA9IG51bGwsXG4gICAgICAgICAgICBzdGFydEVuZEluZGV4ZXMgPSBbXSwgXG4gICAgICAgICAgICBzdGFydCwgZW5kO1xuXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhcnJheSBhbmQgcGljayBvdXQgdGltZSBnYXBzXG4gICAgICAgIHNjaGVkdWxlQXJyYXkuZm9yRWFjaChmdW5jdGlvbihpdGVtLGkpe1xuICAgICAgICAgICAgaWYgKCB0byAmJiB0byAhPT0gaXRlbS5mcm9tICkge1xuICAgICAgICAgICAgICAgIHN0YXJ0RW5kSW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG8gPSBpdGVtLnRvO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBkZXBlbmRpbmcgb24gbnVtYmVyIG9mIGdhcHMgZm91bmQsIGRldGVybWluZSBzdGFydCBhbmQgZW5kIGluZGV4ZXNcbiAgICAgICAgaWYgKCBzdGFydEVuZEluZGV4ZXMubGVuZ3RoID49IDIgKSB7XG4gICAgICAgICAgICBzdGFydCA9IHN0YXJ0RW5kSW5kZXhlc1swXTtcbiAgICAgICAgICAgIGVuZCA9IHN0YXJ0RW5kSW5kZXhlc1sxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgICAgICAgIGlmICggc3RhcnRFbmRJbmRleGVzLmxlbmd0aCA9PT0gMSApIHtcbiAgICAgICAgICAgICAgICBlbmQgPSBzdGFydEVuZEluZGV4ZXNbMF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVuZCA9IHNjaGVkdWxlQXJyYXkubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyByZXR1cm5lZCBzbGljZWQgcG9ydGlvbiBvZiBvcmlnaW5hbCBzY2hlZHVsZVxuICAgICAgICByZXR1cm4gc2NoZWR1bGVBcnJheS5zbGljZShzdGFydCxlbmQpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdEZvcm1FdmVudHMgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0bi5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJCh0aGF0LnNlbGVjdGVkU2xvdElucHV0cykuZWFjaChmdW5jdGlvbihpLGlucHV0KXtcbiAgICAgICAgICAgICAgICAkKGlucHV0KVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIC5jaGFuZ2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5yZW1vdmVDbGFzcygnY2NsLWlzLWRpc2FibGVkIGNjbC1oYXMtcG90ZW50aWFsJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGVsLnN1Ym1pdChmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhhdC5vblN1Ym1pdCgpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdERhdGVFdmVudHMgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGRhdGVTZWxlY3QuY2hhbmdlKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGF0Lm9uRGF0ZUNoYW5nZSgpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25EYXRlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRhdGVZbWQgPSB0aGlzLiRkYXRlU2VsZWN0LnZhbCgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zZXRMb2FkaW5nKCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTY2hlZHVsZURhdGEoKTtcbiAgICAgICAgXG4gICAgfTtcbiAgICAgICAgXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXRTbG90RXZlbnRzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgaWYgKCB0aGlzLiRyb29tU2xvdElucHV0cyAmJiB0aGlzLiRyb29tU2xvdElucHV0cy5sZW5ndGggKXtcblxuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5ob3ZlcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoYXQub25TbG90TW91c2VJbih0aGlzKTtcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhhdC5vblNsb3RNb3VzZU91dCh0aGlzKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBjbGljayBldmVudCBmaXJlcyBCRUZPUkUgY2hhbmdlIGV2ZW50XG4gICAgICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cy5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhpcztcbiAgICAgICAgICAgICAgICB0aGF0Lm9uU2xvdENsaWNrKGlucHV0LCBldmVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy4kcm9vbVNsb3RJbnB1dHMuY2hhbmdlKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhpcztcbiAgICAgICAgICAgICAgICB0aGF0Lm9uU2xvdENoYW5nZShpbnB1dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblNsb3RNb3VzZUluID0gZnVuY3Rpb24oaG92ZXJlZFNsb3QpIHtcblxuICAgICAgICAvLyBpZiB5b3UncmUgbm90IHNlbGVjdGluZyB5b3VyIDJuZCBzbG90LCByZXR1cm5cbiAgICAgICAgaWYgKCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggIT09IDEgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgaG92ZXJlZElucHV0ID0gJChob3ZlcmVkU2xvdCkuZmluZCgnW3R5cGU9XCJjaGVja2JveFwiXScpO1xuXG4gICAgICAgIHZhciBob3ZlcmVkSW5wdXRJbmRleCA9IHRoaXMuJHJvb21TbG90SW5wdXRzLmluZGV4KGhvdmVyZWRJbnB1dCksXG4gICAgICAgICAgICBzZWxlY3RlZElucHV0SW5kZXggPSB0aGlzLiRyb29tU2xvdElucHV0cy5pbmRleCggdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHNbMF0gKSxcbiAgICAgICAgICAgIGlucHV0SW5kZXhTZXQgPSBbaG92ZXJlZElucHV0SW5kZXgsIHNlbGVjdGVkSW5wdXRJbmRleF0uc29ydCgpO1xuXG4gICAgICAgIC8vIGlmIHlvdSdyZSBob3ZlcmluZyB0aGUgYWxyZWFkeSBzZWxlY3RlZCBzbG90LCByZXR1cm5cbiAgICAgICAgaWYgKCBpbnB1dEluZGV4U2V0WzBdID09PSBpbnB1dEluZGV4U2V0WzFdICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgdGhlIGZpcnN0IG9yIGxhc3QgaW5wdXQgaW5kZXhlcyBhcmUgYmV5b25kIGJvdW5kYXJpZXMsIHJldHVyblxuICAgICAgICBpZiAoIGlucHV0SW5kZXhTZXRbMF0gPD0gc2VsZWN0ZWRJbnB1dEluZGV4IC0gdGhpcy5tYXhTbG90cyB8fCBpbnB1dEluZGV4U2V0WzFdID49IHNlbGVjdGVkSW5wdXRJbmRleCArIHRoaXMubWF4U2xvdHMgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBnZXQgZmlyc3QvbGFzdCBzbG90IGVsZW1lbnRzXG4gICAgICAgIHZhciAkZmlyc3RTbG90ID0gdGhpcy4kcm9vbVNsb3RJbnB1dHMuZXEoaW5wdXRJbmRleFNldFswXSkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpLFxuICAgICAgICAgICAgJGxhc3RTbG90ID0gdGhpcy4kcm9vbVNsb3RJbnB1dHMuZXEoaW5wdXRJbmRleFNldFsxXSkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpO1xuXG4gICAgICAgIC8vIHNlbGVjdCBzbG90cyBpbiBiZXR3ZWVuIGZpcnN0IGFuZCBsYXN0XG4gICAgICAgICRmaXJzdFNsb3QubmV4dFVudGlsKCRsYXN0U2xvdCkuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKTtcbiAgICAgICAgICAgIGlmICggISAkdGhpcy5oYXNDbGFzcygnY2NsLWlzLWRpc2FibGVkJykgKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMuYWRkQ2xhc3MoJ2NjbC1oYXMtcG90ZW50aWFsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblNsb3RNb3VzZU91dCA9IGZ1bmN0aW9uKGhvdmVyZWRJbnB1dCkge1xuXG4gICAgICAgIGlmICggdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoICE9PSAxICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5yZW1vdmVDbGFzcygnY2NsLWhhcy1wb3RlbnRpYWwnKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TbG90Q2xpY2sgPSBmdW5jdGlvbihjbGlja2VkSW5wdXQsIGV2ZW50KXtcbiAgICAgICAgXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGNsaWNrSW5wdXRJbmRleCA9IHRoYXQuJHJvb21TbG90SW5wdXRzLmluZGV4KGNsaWNrZWRJbnB1dCksXG4gICAgICAgICAgICBtaW5JbmRleCA9IGNsaWNrSW5wdXRJbmRleCAtIHRoYXQubWF4U2xvdHMsXG4gICAgICAgICAgICBtYXhJbmRleCA9IGNsaWNrSW5wdXRJbmRleCArIHRoYXQubWF4U2xvdHM7XG5cbiAgICAgICAgLy8gZGlzYWJsZXMgc2xvdHMgdGhhdCBhcmUgb3V0c2lkZSBvZiBtYXggc2VsZWN0YWJsZSBhcmVhXG4gICAgICAgIGZ1bmN0aW9uIF9pc29sYXRlU2VsZWN0YWJsZVNsb3RzKCkge1xuXG4gICAgICAgICAgICAvLyBvY2N1cGllZCBzbG90cyB3aWxsIGFmZmVjdCB3aGF0IG5lYXJieSBzbG90cyBjYW4gYmUgc2VsZWN0ZWRcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBhbnkgb2NjdXBpZWQgc2xvdHMsIGlmIHRoZXkgZXhpc3RcbiAgICAgICAgICAgICQoJy5jY2wtYy1yb29tX19zbG90LmNjbC1pcy1vY2N1cGllZCcpLmVhY2goZnVuY3Rpb24oaSxzbG90KXtcblxuICAgICAgICAgICAgICAgIC8vIGdldCBvY2N1cGllZCBzbG90J3MgaW5wdXQsIGZpbmQgaXQncyBpbmRleCBhbW91bmcgYWxsIHNsb3QgaW5wdXRzXG4gICAgICAgICAgICAgICAgdmFyIHNsb3RJbnB1dCA9ICQoc2xvdCkuZmluZCgnW3R5cGU9XCJjaGVja2JveFwiXScpLFxuICAgICAgICAgICAgICAgICAgICBvY2N1cGllZEluZGV4ID0gdGhhdC4kcm9vbVNsb3RJbnB1dHMuaW5kZXgoc2xvdElucHV0KTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIG9jY3VwaWVkIHNsb3QgZmFsbHMgaW4gdGhlIHNlbGVjdGFibGUgYXJlYVxuICAgICAgICAgICAgICAgIGlmICggbWluSW5kZXggPCBvY2N1cGllZEluZGV4ICYmIG9jY3VwaWVkSW5kZXggPCBtYXhJbmRleCApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBvY2N1cGllZCBzbG90IGlzIEJFRk9SRSBjbGlja2VkIHNsb3QsIHNldCBpdCBhcyB0aGUgbWluXG4gICAgICAgICAgICAgICAgICAgIGlmICggb2NjdXBpZWRJbmRleCA8IGNsaWNrSW5wdXRJbmRleCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkluZGV4ID0gb2NjdXBpZWRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBvY2N1cGllZCBzbG90IGlzIEFGVEVSIGNsaWNrZWQgc2xvdCwgc2V0IGl0IGFzIHRoZSBtYXhcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBvY2N1cGllZEluZGV4ID4gY2xpY2tJbnB1dEluZGV4ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4SW5kZXggPSBvY2N1cGllZEluZGV4O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHNsb3RzLCBkaXNhYmxlIG9uZXMgdGhhdCBmYWxsIG91dHNpZGUgb2YgbWluL21heCBpbmRleGVzXG4gICAgICAgICAgICB0aGF0LiRyb29tU2xvdElucHV0cy5lYWNoKGZ1bmN0aW9uKGksaW5wdXQpe1xuICAgICAgICAgICAgICAgIGlmICggaSA8PSBtaW5JbmRleCB8fCBpID49IG1heEluZGV4ICkge1xuICAgICAgICAgICAgICAgICAgICAkKGlucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykuYWRkQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIGlmIG5vIGlucHV0cyB5ZXQgc2VsZWN0ZWQsIHRoaXMgaXMgdGhlIGZpcnN0XG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgaWYgKCB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPT09IDAgKSB7XG5cbiAgICAgICAgICAgIF9pc29sYXRlU2VsZWN0YWJsZVNsb3RzKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogaWYgMSBpbnB1dCBzZWxlY3RlZCwgc2VsZWN0aW5nIDJuZCBzbG90XG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgaWYgKCB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPT09IDEgKSB7XG5cbiAgICAgICAgICAgIGlmICggJChjbGlja2VkSW5wdXQpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5oYXNDbGFzcygnY2NsLWlzLWRpc2FibGVkJykgKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5yZW1vdmVDbGFzcygnY2NsLWlzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogaWYgMiBvciBtb3JlIHNsb3RzIGFscmVhZHkgc2VsZWN0ZWRcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgICAgICBpZiAoIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCA+PSAyICkge1xuXG4gICAgICAgICAgICAvLyBpZiB0aGUgY2xpY2tlZCBpbnB1dCBpcyBub3QgcGFydCBvZiBjdXJyZW50IHNlbGVjdGlvblxuICAgICAgICAgICAgLy8gY2xlYXIgYWxsIHNlbGVjdGVkIGlucHV0c1xuICAgICAgICAgICAgaWYgKCB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKCBjbGlja2VkSW5wdXQgKSA8IDAgKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB0aGF0LmNsZWFyQWxsU2xvdHMoKTtcbiAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdGVkU2xvdElucHV0cyA9IFtdO1xuXG4gICAgICAgICAgICB9IFxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBpZiBjbGlja2VkIGlucHV0IGlzIG9uZSBvZiB0aGUgY3VycmVudGx5IHNlbGVjdGVkIGlucHV0c1xuICAgICAgICAgICAgLy8ga2VlcCB0aGF0IG9uZSBzZWxlY3RlZCBhbmQgZGVzZWxlY3QgdGhlIHJlc3RcbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gcHJldmVudCBjaGFuZ2UgZXZlbnQgZnJvbSBmaXJpbmdcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbnB1dCBpbmRleCBmcm9tIGFtb25nIHNlbGVjdGVkIGlucHV0c1xuICAgICAgICAgICAgICAgIHZhciBzZWxlY3RlZFNsb3RJbmRleCA9IHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2YoIGNsaWNrZWRJbnB1dCApLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZElucHV0cyA9ICQuZXh0ZW5kKCBbXSwgdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMgKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBjbGVhciBhbGwgaW5wdXRzIEVYQ0VQVCB0aGUgY2xpY2tlZCBvbmVcbiAgICAgICAgICAgICAgICBzZWxlY3RlZElucHV0cy5mb3JFYWNoKGZ1bmN0aW9uKGlucHV0LGkpe1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHNlbGVjdGVkU2xvdEluZGV4ICE9IGkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGF0LmNsZWFyU2xvdChpbnB1dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyAvLyBzZXQgc2VsZWN0ZWQgaW5wdXRzIHRvIGp1c3QgdGhpcyBvbmVcbiAgICAgICAgICAgICAgICAvLyB0aGF0LnNlbGVjdGVkU2xvdElucHV0cyA9IFsgdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHNbc2VsZWN0ZWRTbG90SW5kZXhdIF07XG5cbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGN1cnJlbnQgZHVyYXRpb24gdGV4dFxuICAgICAgICAgICAgICAgIHRoYXQuc2V0Q3VycmVudER1cmF0aW9uVGV4dCgpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF9pc29sYXRlU2VsZWN0YWJsZVNsb3RzKCk7XG5cbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uU2xvdENoYW5nZSA9IGZ1bmN0aW9uKGNoYW5nZWRJbnB1dCl7XG4gICAgICAgIFxuICAgICAgICAvLyBpZiBpbnB1dCBjaGVja2VkLCBhZGQgaXQgdG8gc2VsZWN0ZWQgc2V0XG4gICAgICAgIGlmICggJChjaGFuZ2VkSW5wdXQpLnByb3AoJ2NoZWNrZWQnKSApIHtcblxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMucHVzaChjaGFuZ2VkSW5wdXQpO1xuICAgICAgICAgICAgJChjaGFuZ2VkSW5wdXQpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5hZGRDbGFzcygnY2NsLWlzLWNoZWNrZWQnKTtcbiAgIFxuICAgICAgICB9IFxuICAgICAgICBcbiAgICAgICAgLy8gaWYgaW5wdXQgdW5jaGVja2VkLCByZW1vdmUgaXQgZnJvbSB0aGUgc2VsZWN0ZWQgc2V0XG4gICAgICAgIGVsc2UgeyBcblxuICAgICAgICAgICAgdmFyIGNoYW5nZWRJbnB1dEluZGV4ID0gdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZihjaGFuZ2VkSW5wdXQpO1xuXG4gICAgICAgICAgICBpZiAoIGNoYW5nZWRJbnB1dEluZGV4ID4gLTEgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuc3BsaWNlKCBjaGFuZ2VkSW5wdXRJbmRleCwgMSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChjaGFuZ2VkSW5wdXQpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5yZW1vdmVDbGFzcygnY2NsLWlzLWNoZWNrZWQnKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdG9nZ2xlIHJlc2V0IGJ1dHRvblxuICAgICAgICBpZiAoIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0bi5zaG93KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0bi5oaWRlKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBpZiBoaWdobGlnaHQgc2xvdHMgYmV0d2VlbiB0d28gZW5kc1xuICAgICAgICBpZiAoIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCA9PT0gMiApIHtcblxuICAgICAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgICAgICB0aGF0LiRlbC5maW5kKCcuY2NsLWlzLWNoZWNrZWQnKS5maXJzdCgpLm5leHRVbnRpbCgnLmNjbC1pcy1jaGVja2VkJykuZWFjaChmdW5jdGlvbihpLHNsb3Qpe1xuICAgICAgICAgICAgICAgIHZhciBzbG90SW5wdXQgPSAkKHNsb3QpLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpO1xuICAgICAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzLnB1c2goc2xvdElucHV0WzBdKTtcbiAgICAgICAgICAgICAgICB0aGF0LmFjdGl2YXRlU2xvdChzbG90KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRDdXJyZW50RHVyYXRpb25UZXh0KCk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmNsZWFyU2xvdCA9IGZ1bmN0aW9uKHNsb3QpIHtcbiAgICAgICAgLy8gc2xvdCBjYW4gYmUgZWl0aGVyIHRoZSBjaGVja2JveCBpbnB1dCAtT1ItIHRoZSBjaGVja2JveCdzIGNvbnRhaW5lclxuXG4gICAgICAgIHZhciBpbnB1dEluZGV4O1xuXG4gICAgICAgIC8vIGlmIGl0J3MgdGhlIGNoZWNrYm94LlxuICAgICAgICBpZiAoICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSApIHtcbiAgICAgICAgIFxuICAgICAgICAgICAgJChzbG90KVxuICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJyxmYWxzZSlcbiAgICAgICAgICAgICAgICAucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLWlzLWNoZWNrZWQgY2NsLWhhcy1wb3RlbnRpYWwnKTtcblxuICAgICAgICAgICAgLy8gZ2V0IGluZGV4IG9mIHRoZSBpbnB1dCBmcm9tIHNlbGVjdGVkIHNldFxuICAgICAgICAgICAgaW5wdXRJbmRleCA9IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2Yoc2xvdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gaWYgaXQncyB0aGUgY29udGFpbmVyXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkKHNsb3QpLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKTtcblxuICAgICAgICAgICAgJChzbG90KS5yZW1vdmVDbGFzcygnY2NsLWlzLWNoZWNrZWQgY2NsLWhhcy1wb3RlbnRpYWwnKTtcbiAgICAgICAgICAgICRpbnB1dC5wcm9wKCdjaGVja2VkJyxmYWxzZSk7XG5cbiAgICAgICAgICAgIC8vIGdldCBpbmRleCBvZiB0aGUgaW5wdXQgZnJvbSBzZWxlY3RlZCBzZXRcbiAgICAgICAgICAgIGlucHV0SW5kZXggPSB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKCAkaW5wdXRbMF0gKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGlucHV0IGZyb20gc2VsZWN0ZWQgc2V0XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnNwbGljZSggaW5wdXRJbmRleCwgMSApO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5jbGVhckFsbFNsb3RzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgLy8gRXh0ZW5kIHRoZSBzZWxlY3RlZCBpbnB1dHMgYXJyYXkgdG8gYSBuZXcgdmFyaWFibGUuXG4gICAgICAgIC8vIFRoZSBzZWxlY3RlZCBpbnB1dHMgYXJyYXkgY2hhbmdlcyB3aXRoIGV2ZXJ5IGNsZWFyU2xvdCgpIGNhbGxcbiAgICAgICAgLy8gc28sIGJlc3QgdG8gbG9vcCB0aHJvdWdoIGFuIHVuY2hhbmdpbmcgYXJyYXkuXG4gICAgICAgIHZhciBzZWxlY3RlZElucHV0cyA9ICQuZXh0ZW5kKCBbXSwgdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMgKTtcblxuICAgICAgICAkKHNlbGVjdGVkSW5wdXRzKS5lYWNoKGZ1bmN0aW9uKGksaW5wdXQpe1xuICAgICAgICAgICAgdGhhdC5jbGVhclNsb3QoaW5wdXQpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuYWN0aXZhdGVTbG90ID0gZnVuY3Rpb24oc2xvdCkge1xuICAgICAgICAvLyBzbG90IGNhbiBiZSBlaXRoZXIgdGhlIGNoZWNrYm94IC1PUi0gdGhlIGNoZWNrYm94J3MgY29udGFpbmVyXG5cbiAgICAgICAgdmFyIHNsb3RJc0NoZWNrYm94ID0gJChzbG90KS5pcygnW3R5cGU9XCJjaGVja2JveFwiXScpLFxuICAgICAgICAgICAgJGNvbnRhaW5lciA9IHNsb3RJc0NoZWNrYm94ID8gJChzbG90KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykgOiAkKHNsb3QpO1xuXG4gICAgICAgIC8vIG5ldmVyIHNldCBhbiBvY2N1cGllZCBzbG90IGFzIGFjdGl2ZVxuICAgICAgICBpZiAoICRjb250YWluZXIuaGFzQ2xhc3MoJ2NjbC1pcy1vY2N1cGllZCcpICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAkKHNsb3QpLmlzKCdbdHlwZT1cImNoZWNrYm94XCJdJykgKSB7XG5cbiAgICAgICAgICAgIC8vIGlmIGl0J3MgdGhlIGNoZWNrYm94LlxuICAgICAgICAgXG4gICAgICAgICAgICAkKHNsb3QpLnByb3AoJ2NoZWNrZWQnLHRydWUpO1xuICAgICAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcygnY2NsLWlzLWNoZWNrZWQnKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBpZiBpdCdzIHRoZSBjb250YWluZXJcblxuICAgICAgICAgICAgJGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnY2NsLWlzLWNoZWNrZWQnKVxuICAgICAgICAgICAgICAgIC5maW5kKCdbdHlwZT1cImNoZWNrYm94XCJdJylcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLHRydWUpO1xuXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnNldExvYWRpbmcgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoJ0xvYWRpbmcgc2NoZWR1bGUuLi4nKTtcbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS51bnNldExvYWRpbmcgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnNldEN1cnJlbnREdXJhdGlvblRleHQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgc2VsZWN0aW9uID0gJC5leHRlbmQoW10sdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMpLFxuICAgICAgICAgICAgc29ydGVkU2VsZWN0aW9uID0gc2VsZWN0aW9uLnNvcnQoZnVuY3Rpb24oYSxiKXsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGEudmFsdWUgPiBiLnZhbHVlOyBcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgc2VsZWN0aW9uTGVuZ3RoID0gc29ydGVkU2VsZWN0aW9uLmxlbmd0aDtcbiAgICAgICAgXG4gICAgICAgIGlmICggc2VsZWN0aW9uTGVuZ3RoID4gMCApIHtcblxuICAgICAgICAgICAgdmFyIHRpbWUxVmFsID0gc29ydGVkU2VsZWN0aW9uWzBdLnZhbHVlLFxuICAgICAgICAgICAgICAgIHJlYWRhYmxlVGltZTEgPSB0aGlzLnJlYWRhYmxlVGltZSggbmV3IERhdGUodGltZTFWYWwpICk7XG5cbiAgICAgICAgICAgIHZhciB0aW1lMlZhbCA9ICggc2VsZWN0aW9uTGVuZ3RoID49IDIgKSA/IHNvcnRlZFNlbGVjdGlvbltzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoIC0gMV0udmFsdWUgOiB0aW1lMVZhbCxcbiAgICAgICAgICAgICAgICB0aW1lMlQgPSBuZXcgRGF0ZSh0aW1lMlZhbCkuZ2V0VGltZSgpICsgKCB0aGlzLnNsb3RNaW51dGVzICogNjAgKiAxMDAwICksXG4gICAgICAgICAgICAgICAgcmVhZGFibGVUaW1lMiA9IHRoaXMucmVhZGFibGVUaW1lKCBuZXcgRGF0ZSh0aW1lMlQpICk7XG5cbiAgICAgICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQudGV4dCggJ0Zyb20gJyArIHJlYWRhYmxlVGltZTEgKyAnIHRvICcgKyByZWFkYWJsZVRpbWUyICk7XG5cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQudGV4dCgnUGxlYXNlIHNlbGVjdCBhdmFpbGFibGUgdGltZSBzbG90cycpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuc2V0TWF4VGltZVRleHQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbWF4TWludXRlcyA9IHRoaXMubWF4U2xvdHMgKiB0aGlzLnNsb3RNaW51dGVzLFxuICAgICAgICAgICAgbWF4VGV4dDtcblxuICAgICAgICBzd2l0Y2gobWF4TWludXRlcykge1xuICAgICAgICAgICAgY2FzZSAyNDA6XG4gICAgICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgLyA2MCArICcgaG91cnMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxODA6XG4gICAgICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgLyA2MCArICcgaG91cnMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMjA6XG4gICAgICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgLyA2MCArICcgaG91cnMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA2MDpcbiAgICAgICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyAvIDYwICsgJyBob3Vycyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzICsgJ21pbnMnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kbWF4VGltZS50ZXh0KCBtYXhUZXh0ICk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5yZWFkYWJsZVRpbWUgPSBmdW5jdGlvbiggZGF0ZU9iaiwgZm9ybWF0ICkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGxvY2FsZVN0cmluZyA9IGRhdGVPYmoudG9Mb2NhbGVTdHJpbmcoIHRoaXMubG9jYWxlLCB0aGlzLnRpbWVab25lICksIC8vIGUuZy4gLS0+IFwiMTEvNy8yMDE3LCA0OjM4OjMzIEFNXCJcbiAgICAgICAgICAgIGxvY2FsZVRpbWUgPSBsb2NhbGVTdHJpbmcuc3BsaXQoXCIsIFwiKVsxXTsgLy8gXCI0OjM4OjMzIEFNXCJcblxuICAgICAgICB2YXIgdGltZSA9IGxvY2FsZVRpbWUuc3BsaXQoJyAnKVswXSwgLy8gXCI0OjM4OjMzXCIsXG4gICAgICAgICAgICB0aW1lT2JqID0ge1xuICAgICAgICAgICAgICAgIGE6IGxvY2FsZVRpbWUuc3BsaXQoJyAnKVsxXS50b0xvd2VyQ2FzZSgpLCAvLyAoYW0gb3IgcG0pIC0tPiBcImFcIlxuICAgICAgICAgICAgICAgIGg6IHRpbWUuc3BsaXQoJzonKVswXSwgLy8gXCI0XCJcbiAgICAgICAgICAgICAgICBtOiB0aW1lLnNwbGl0KCc6JylbMV0sIC8vIFwiMzhcIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICBpZiAoIGZvcm1hdCAmJiB0eXBlb2YgZm9ybWF0ID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGZvcm1hdEFyciA9IGZvcm1hdC5zcGxpdCgnJyksXG4gICAgICAgICAgICAgICAgcmVhZGFibGVBcnIgPSBbXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgZm9ybWF0QXJyLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgICAgIGlmICggdGltZU9ialtmb3JtYXRBcnJbaV1dICkge1xuICAgICAgICAgICAgICAgICAgICByZWFkYWJsZUFyci5wdXNoKHRpbWVPYmpbZm9ybWF0QXJyW2ldXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVBcnIucHVzaChmb3JtYXRBcnJbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlYWRhYmxlQXJyLmpvaW4oJycpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGltZU9iai5oICsgJzonICsgdGltZU9iai5tICsgdGltZU9iai5hO1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uU3VibWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuXG4gICAgICAgIGlmICggISB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuJGZvcm1Ob3RpZmljYXRpb25cbiAgICAgICAgICAgICAgICAuY3NzKCdkaXNwbGF5Jywnbm9uZScpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdjY2wtaXMtZXJyb3InKVxuICAgICAgICAgICAgICAgIC50ZXh0KCdQbGVhc2Ugc2VsZWN0IGEgdGltZSBmb3IgeW91ciByZXNlcnZhdGlvbicpXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHRoaXMuJGZvcm1Db250ZW50KVxuICAgICAgICAgICAgICAgIC5zbGlkZURvd24oQ0NMLkRVUkFUSU9OKTsgICAgICAgICAgICBcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1Ob3RpZmljYXRpb24ucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBzb3J0ZWRTZWxlY3Rpb24gPSAkLmV4dGVuZChbXSwgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMpLnNvcnQoZnVuY3Rpb24oYSxiKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS52YWx1ZSA+IGIudmFsdWU7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHN0YXJ0ID0gc29ydGVkU2VsZWN0aW9uWzBdLnZhbHVlLFxuICAgICAgICAgICAgZW5kID0gKCBzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoID4gMSApID8gJCggc29ydGVkU2VsZWN0aW9uWyBzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoIC0gMSBdICkuZGF0YSgndG8nKSA6ICQoIHNvcnRlZFNlbGVjdGlvblswXSApLmRhdGEoJ3RvJyksXG4gICAgICAgICAgICBwYXlsb2FkID0ge1xuICAgICAgICAgICAgICAgIFwiaWlkXCI6MzMzLFxuICAgICAgICAgICAgICAgIFwic3RhcnRcIjogc3RhcnQsXG4gICAgICAgICAgICAgICAgXCJmbmFtZVwiOiB0aGlzLiRlbFswXS5mbmFtZS52YWx1ZSxcbiAgICAgICAgICAgICAgICBcImxuYW1lXCI6IHRoaXMuJGVsWzBdLmxuYW1lLnZhbHVlLFxuICAgICAgICAgICAgICAgIFwiZW1haWxcIjogdGhpcy4kZWxbMF0uZW1haWwudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJuaWNrbmFtZVwiOiB0aGlzLiRlbFswXS5uaWNrbmFtZS52YWx1ZSxcbiAgICAgICAgICAgICAgICBcImJvb2tpbmdzXCI6W1xuICAgICAgICAgICAgICAgICAgICB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidG9cIjogZW5kXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnb24gU3VibWl0IMK7ICcsIHBheWxvYWQgKTtcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnY2NsLWlzLXN1Ym1pdHRpbmcnKTtcbiAgICAgICAgdGhpcy4kZm9ybUNhbmNlbC5wcm9wKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgIHRoaXMuJGZvcm1TdWJtaXQudGV4dCgnU2VuZGluZy4uLicpLnByb3AoJ2Rpc2FibGVkJyx0cnVlKTtcblxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIGFjdGlvbjogJ3JlcXVlc3RfYm9va2luZycsXG4gICAgICAgICAgICBjY2xfbm9uY2U6IENDTC5ub25jZSxcbiAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWRcbiAgICAgICAgfTtcblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTWFrZSBhIHJlcXVlc3QgaGVyZSB0byByZXNlcnZlIHNwYWNlXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgICAgICAkLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogQ0NMLmFqYXhfdXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgX2hhbmRsZVN1Ym1pdFJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLXN1Ym1pdHRpbmcnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIF9oYW5kbGVTdWJtaXRSZXNwb25zZShyZXNwb25zZSkge1xuXG4gICAgICAgICAgICB2YXIgcmVzcG9uc2VIVE1MLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlT2JqZWN0ID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG5cbiAgICAgICAgICAgIGlmICggcmVzcG9uc2VPYmplY3QuYm9va2luZ19pZCApIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwgPSAgWyc8cCBjbGFzcz1cImNjbC1oMiBjY2wtdS1tdC0wXCI+U3VjY2VzcyE8L3A+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxwIGNsYXNzPVwiY2NsLWg0XCI+WW91ciBib29raW5nIElEIGlzIDxzcGFuIGNsYXNzPVwiY2NsLXUtY29sb3Itc2Nob29sXCI+JyArIHJlc3BvbnNlT2JqZWN0LmJvb2tpbmdfaWQgKyAnPC9zcGFuPjwvcD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHAgY2xhc3M9XCJjY2wtaDRcIj5QbGVhc2UgY2hlY2sgeW91ciBlbWFpbCB0byBjb25maXJtIHlvdXIgYm9va2luZy48L3A+J107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTCA9ICBbJzxwIGNsYXNzPVwiY2NsLWgzIGNjbC11LW10LTBcIj5Tb3JyeSwgYnV0IHdlIGNvdWxkblxcJ3QgcHJvY2VzcyB5b3VyIHJlc2VydmF0aW9uLjwvcD4nLCc8cCBjbGFzcz1cImNjbC1oNFwiPkVycm9yczo8L3A+J107XG4gICAgICAgICAgICAgICAgJChyZXNwb25zZU9iamVjdC5lcnJvcnMpLmVhY2goZnVuY3Rpb24oaSwgZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwucHVzaCgnPHAgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3JcIj4nICsgZXJyb3IgKyAnPC9wPicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTC5wdXNoKCc8cCBjbGFzcz1cImNjbC1oNFwiPlBsZWFzZSB0YWxrIHRvIHlvdXIgbmVhcmVzdCBsaWJyYXJpYW4gZm9yIGhlbHAuPC9wPicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGF0LiRmb3JtQ2FuY2VsLnByb3AoJ2Rpc2FibGVkJyxmYWxzZSkudGV4dCgnQ2xvc2UnKTtcbiAgICAgICAgICAgIHRoYXQuJGZvcm1TdWJtaXQucmVtb3ZlKCk7XG4gICAgICAgICAgICB0aGF0LiRmb3JtQ29udGVudC5hbmltYXRlKHtvcGFjaXR5OiAwfSwgQ0NMLkRVUkFUSU9OKTtcbiAgICAgICAgICAgIHRoYXQuJGZvcm1SZXNwb25zZVxuICAgICAgICAgICAgICAgIC5kZWxheShDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAgICAgLmFuaW1hdGUoe29wYWNpdHk6IDF9LCBDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAgICAgLmh0bWwocmVzcG9uc2VIVE1MKTtcbiAgICAgICAgICAgIHRoYXQuJGZvcm1Db250ZW50XG4gICAgICAgICAgICAgICAgLmRlbGF5KENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZSh7aGVpZ2h0OiB0aGF0LiRmb3JtUmVzcG9uc2UuaGVpZ2h0KCkgKyAncHgnIH0sIENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuY3NzKHt6SW5kZXg6ICctMSd9KTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuICAgIC8vIEhlbHBlcnNcblxuICAgIGZ1bmN0aW9uIF9zb3J0QnlLZXkoIGFyciwga2V5LCBvcmRlciApIHtcbiAgICAgICAgZnVuY3Rpb24gc29ydEFTQyhhLGIpIHtcbiAgICAgICAgICAgIGlmIChhW2tleV0gPCBiW2tleV0pe1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhW2tleV0gPiBiW2tleV0pe1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc29ydERFU0MoYSxiKSB7XG4gICAgICAgICAgICBpZiAoYVtrZXldID4gYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYVtrZXldIDwgYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICggJ0RFU0MnID09PSBvcmRlciApIHtcbiAgICAgICAgICAgIGFyci5zb3J0KHNvcnRERVNDKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyci5zb3J0KHNvcnRBU0MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmpzLXJvb20tcmVzLWZvcm0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgUm9vbVJlc0Zvcm0odGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBTbW9vdGggU2Nyb2xsaW5nXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgJCgnLmpzLXNtb290aC1zY3JvbGwnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcblxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJCh0aGlzKS5kYXRhKCd0YXJnZXQnKSB8fCAkKHRoaXMpLmF0dHIoJ2hyZWYnKSxcbiAgICAgICAgICAgICAgICAkdGFyZ2V0ID0gJCh0YXJnZXQpO1xuXG4gICAgICAgICAgICBpZiAoICR0YXJnZXQubGVuZ3RoICkge1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXRPZmZzZXQgPSAkdGFyZ2V0Lm9mZnNldCgpLnRvcDtcbiAgICAgICAgICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSggeydzY3JvbGxUb3AnOiB0YXJnZXRPZmZzZXR9LCA4MDAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBTdGlja2llc1xuICogXG4gKiBCZWhhdmlvdXIgZm9yIHN0aWNreSBlbGVtZW50cy5cbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgICR3aW5kb3cgPSAkKHdpbmRvdyksXG4gICAgICAgIGNsYXNzTmFtZSA9IHtcbiAgICAgICAgICAgIGlzRml4ZWQ6ICdjY2wtaXMtZml4ZWQnXG4gICAgICAgIH07XG5cbiAgICB2YXIgU3RpY2t5ID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIC8vIHZhcmlhYmxlc1xuICAgICAgICB2YXIgJGVsID0gJChlbCksXG4gICAgICAgICAgICBoZWlnaHQgPSAkZWwub3V0ZXJIZWlnaHQoKSxcbiAgICAgICAgICAgIG9mZnNldCA9ICRlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgIG9wdGlvbnMgPSAkZWwuZGF0YSgnc3RpY2t5JyksXG4gICAgICAgICAgICB3cmFwcGVyID0gJCgnPGRpdiBjbGFzcz1cImpzLXN0aWNreS13cmFwcGVyXCI+PC9kaXY+JykuY3NzKHsgaGVpZ2h0OiBoZWlnaHQgKyAncHgnIH0pO1xuXG4gICAgICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG9mZnNldDogMFxuICAgICAgICB9O1xuXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCggZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMgKTtcblxuICAgICAgICAvLyB3cmFwIGVsZW1lbnRcbiAgICAgICAgJGVsLndyYXAoIHdyYXBwZXIgKTtcblxuICAgICAgICAvLyBzY3JvbGwgbGlzdGVuZXJcbiAgICAgICAgJHdpbmRvdy5zY3JvbGwoIENDTC50aHJvdHRsZSggX29uU2Nyb2xsLCAxMDAgKSApO1xuXG4gICAgICAgIC8vIG9uIHNjcm9sbFxuICAgICAgICBmdW5jdGlvbiBfb25TY3JvbGwoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpICsgb3B0aW9ucy5vZmZzZXQ7XG4gICAgXG4gICAgICAgICAgICBpZiAoIHNjcm9sbFRvcCA+PSBvZmZzZXQudG9wICkge1xuICAgICAgICAgICAgICAgICRlbC5hZGRDbGFzcyggY2xhc3NOYW1lLmlzRml4ZWQgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGVsLnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuaXNGaXhlZCApO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmpzLWlzLXN0aWNreScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBTdGlja3kodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBUb2dnbGUgU2Nob29sc1xuICogXG4gKiBCZWhhdmlvciBmb3Igc2Nob29sIHRvZ2dsZXNcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgaW5pdFNjaG9vbCA9ICQoJ2h0bWwnKS5kYXRhKCdzY2hvb2wnKTtcblxuICAgIHZhciBTY2hvb2xTZWxlY3QgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRzZWxlY3QgPSAkKGVsKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBTY2hvb2xTZWxlY3QucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgaWYgKCBpbml0U2Nob29sICkge1xuXG4gICAgICAgICAgICB0aGlzLiRzZWxlY3RcbiAgICAgICAgICAgICAgICAuZmluZCggJ29wdGlvblt2YWx1ZT1cIicgKyBpbml0U2Nob29sICsgJ1wiXScgKVxuICAgICAgICAgICAgICAgIC5hdHRyKCAnc2VsZWN0ZWQnLCAnc2VsZWN0ZWQnICk7ICAgXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJHNlbGVjdC5jaGFuZ2UoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgJCgnaHRtbCcpLmF0dHIoICAnZGF0YS1zY2hvb2wnLCBldmVudC50YXJnZXQudmFsdWUgKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInNjaG9vbFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBTY2hvb2xTZWxlY3QodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICogVG9vbHRpcHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIHRvb2x0aXBzXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBUb29sdGlwID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLiRlbC5hdHRyKCd0aXRsZScpO1xuICAgICAgICB0aGlzLiR0b29sdGlwID0gJCgnPGRpdiBpZD1cImNjbC1jdXJyZW50LXRvb2x0aXBcIiBjbGFzcz1cImNjbC1jLXRvb2x0aXAgY2NsLWlzLXRvcFwiIHJvbGU9XCJ0b29sdGlwXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNjbC1jLXRvb2x0aXBfX2Fycm93XCI+PC9kaXY+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNjbC1jLXRvb2x0aXBfX2lubmVyXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIFRvb2x0aXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbC5ob3ZlcihmdW5jdGlvbihlKXtcblxuICAgICAgICAgICAgLy8gbW91c2VvdmVyXG5cbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCd0aXRsZScsICcnKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgJ2NjbC1jdXJyZW50LXRvb2x0aXAnKTtcbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuXG4gICAgICAgICAgICBDQ0wucmVmbG93KF90aGlzLiR0b29sdGlwWzBdKTtcblxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IF90aGlzLiRlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgICAgICB3aWR0aCAgPSBfdGhpcy4kZWwub3V0ZXJXaWR0aCgpLFxuICAgICAgICAgICAgICAgIHRvb2x0aXBIZWlnaHQgPSBfdGhpcy4kdG9vbHRpcC5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5jc3Moe1xuICAgICAgICAgICAgICAgIHRvcDogKG9mZnNldC50b3AgLSB0b29sdGlwSGVpZ2h0KSArICdweCcsXG4gICAgICAgICAgICAgICAgbGVmdDogKG9mZnNldC5sZWZ0ICsgKHdpZHRoLzIpKSArICdweCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5hZGRDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgfSwgZnVuY3Rpb24oZSl7IFxuXG4gICAgICAgICAgICAvL21vdXNlb3V0XG5cbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCd0aXRsZScsIF90aGlzLmNvbnRlbnQpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCAnJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5yZW1vdmVDbGFzcygnY2NsLWlzLXNob3duJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5yZW1vdmUoKTtcblxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFRvb2x0aXAodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBXYXlmaW5kaW5nXG4gKiBcbiAqIENvbnRyb2xzIGludGVyZmFjZSBmb3IgbG9va2luZyB1cCBjYWxsIG51bWJlciBsb2NhdGlvbnNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIHRhYnMsIHdheWZpbmRlcjtcbiAgICBcbiAgICB2YXIgVGFicyA9IGZ1bmN0aW9uKGVsKSB7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiR0YWJzID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXRhYicpO1xuICAgICAgICB0aGlzLiR0YWJDb250ZW50cyA9ICQoJy5jY2wtYy10YWJfX2NvbnRlbnQnKTtcbiAgICAgICAgXG5cbiAgICAgICAgdGhpcy4kdGFicy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgJHRhYiA9ICQodGhpcyk7XG4gICAgICAgICAgICAkdGFiLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJHRhYi5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgICAgICAgICAvLyBfdGhpcy4kdGFiQ29udGVudHMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAvLyBfdGhpcy4kdGFiQ29udGVudHMuZmlsdGVyKHRhcmdldCkuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zZXRBY3RpdmUodGFyZ2V0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgVGFicy5wcm90b3R5cGUuc2V0QWN0aXZlID0gZnVuY3Rpb24odGFyZ2V0KXtcbiAgICAgICAgdGhpcy4kdGFicy5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiR0YWJzLmZpbHRlcignW2hyZWY9XCInK3RhcmdldCsnXCJdJykuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMuZmlsdGVyKHRhcmdldCkuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICB9O1xuXG4gICAgdmFyIFdheWZpbmRlciA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5jYWxsTnVtYmVycyA9IHt9O1xuICAgICAgICB0aGlzLiRmb3JtID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtYmVyLXNlYXJjaCcpO1xuICAgICAgICB0aGlzLiRpbnB1dCA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bS1pbnB1dCcpO1xuICAgICAgICB0aGlzLiRzdWJtaXQgPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW0tc3VibWl0Jyk7XG4gICAgICAgIHRoaXMuJG1hcnF1ZWUgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19tYXJxdWVlJyk7XG4gICAgICAgIHRoaXMuJGNhbGxOdW0gPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19jYWxsLW51bScpO1xuICAgICAgICB0aGlzLiR3aW5nID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fd2luZycpO1xuICAgICAgICB0aGlzLiRmbG9vciA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX2Zsb29yJyk7XG4gICAgICAgIHRoaXMuJHN1YmplY3QgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19zdWJqZWN0Jyk7XG4gICAgICAgIHRoaXMuZXJyb3IgPSB7XG4gICAgICAgICAgICBnZXQ6ICc8ZGl2IGNsYXNzPVwiY2NsLWMtYWxlcnQgY2NsLWlzLWVycm9yIGNjbC13YXlmaW5kZXJfX2Vycm9yXCI+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjY2wtYi1jbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+PC9idXR0b24+PGkgY2xhc3M9XCJjY2wtYi1pY29uIGFsZXJ0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBUaGVyZSB3YXMgYW4gZXJyb3IgZmV0Y2hpbmcgY2FsbCBudW1iZXJzLjwvZGl2PicsXG4gICAgICAgICAgICBmaW5kOiAnPGRpdiBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvciBjY2wtd2F5ZmluZGVyX19lcnJvclwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2NsLWItY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPjxpIGNsYXNzPVwiY2NsLWItaWNvbiBhbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gQ291bGQgbm90IGZpbmQgdGhhdCBjYWxsIG51bWJlci4gUGxlYXNlIHRyeSBhZ2Fpbi48L2Rpdj4nXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuJGVycm9yQm94ID0gJCgnLmNjbC1lcnJvci1ib3gnKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICQuZ2V0SlNPTiggQ0NMLmFzc2V0cyArICdqcy9jYWxsLW51bWJlcnMuanNvbicgKVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2FsbE51bWJlcnMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIF90aGlzLmluaXQoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgdGhpcy4kZXJyb3JCb3guYXBwZW5kKCB0aGlzLmVycm9yLmdldCApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnY2NsLWFwcC1hY3RpdmUnKTtcblxuICAgICAgICB0aGlzLiRpbnB1dFxuICAgICAgICAgICAgLmtleXVwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcXVlcnkgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggcXVlcnkgPT09IFwiXCIgKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRzdWJtaXQuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZXNldCgpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3VibWl0LmF0dHIoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kZm9ybS5zdWJtaXQoZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciBxdWVyeSA9IF90aGlzLiRpbnB1dC52YWwoKTtcblxuICAgICAgICAgICAgJCgnLmNjbC13YXlmaW5kZXJfX2Vycm9yJykucmVtb3ZlKCk7XG4gICAgICAgICAgICBfdGhpcy4kbWFycXVlZS5zaG93KCk7XG4gICAgICAgICAgICBfdGhpcy4kY2FsbE51bS50ZXh0KHF1ZXJ5KTtcbiAgICAgICAgICAgIF90aGlzLmZpbmRSb29tKCBxdWVyeSApO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmdldENhbGxLZXkgPSBmdW5jdGlvbihjYWxsTnVtKSB7XG4gICAgICAgIHZhciBrZXksXG4gICAgICAgICAgICBjYWxsS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY2FsbE51bWJlcnMpO1xuXG4gICAgICAgIGlmICggY2FsbEtleXMubGVuZ3RoID09PSAwICl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsS2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGspe1xuICAgICAgICAgIGlmICggY2FsbE51bSA+PSBrICkge1xuICAgICAgICAgICAga2V5ID0gaztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUuZmluZFJvb20gPSBmdW5jdGlvbihxdWVyeSkge1xuXG4gICAgICAgIHF1ZXJ5ID0gcXVlcnkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBjYWxsS2V5ID0gdGhpcy5nZXRDYWxsS2V5KHF1ZXJ5KSxcbiAgICAgICAgICAgIGNhbGxEYXRhID0ge30sXG4gICAgICAgICAgICByb29tO1xuXG4gICAgICAgIGlmICggISBjYWxsS2V5ICkge1xuICAgICAgICAgICAgdGhpcy50aHJvd0ZpbmRFcnJvcigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQoJy5jY2wtYy1zZWFyY2gnKS5vZmZzZXQoKS50b3AgfSk7XG4gICAgICAgIFxuICAgICAgICBjYWxsRGF0YSA9IHRoaXMuY2FsbE51bWJlcnNbY2FsbEtleV07XG5cbiAgICAgICAgdGhpcy4kZmxvb3IudGV4dCggY2FsbERhdGEuZmxvb3IgKTtcbiAgICAgICAgdGhpcy4kd2luZy50ZXh0KCBjYWxsRGF0YS53aW5nICk7XG4gICAgICAgIHRoaXMuJHN1YmplY3QudGV4dCggY2FsbERhdGEuc3ViamVjdCApO1xuXG4gICAgICAgIC8qIFRPRE86XG4gICAgICAgICAqIHNldCBBQ1RVQUwgcm9vbSwgbm90IGp1c3QgdGhlIGZsb29yLiBzdGlsbCB3YWl0aW5nIG9uIGNsaWVudCBcbiAgICAgICAgICogdG8gcHJvdmlkZSBkYXRhIGZvciB3aGljaCBjYWxsIG51bWJlcnMgYmVsb25nIHRvIHdoaWNoIHJvb21zXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiAgICAgICAgcm9vbSA9IGNhbGxEYXRhLmZsb29yX2ludDtcblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJ2FbaHJlZj1cIiNmbG9vci0nK3Jvb20rJ1wiXScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNyb29tLScrcm9vbSsnLTEnKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuXG4gICAgICAgIHRhYnMuc2V0QWN0aXZlKCAnI2Zsb29yLScgKyByb29tICk7XG4gICAgICAgIFxuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJ2FbaHJlZio9XCIjZmxvb3ItXCJdJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLmNjbC1jLWZsb29yX19yb29tJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS50aHJvd0ZpbmRFcnJvciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJ2FbaHJlZio9XCIjZmxvb3ItXCJdJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLmNjbC1jLWZsb29yX19yb29tJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kZmxvb3IudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kd2luZy50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiRzdWJqZWN0LnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJGVycm9yQm94LmFwcGVuZCggdGhpcy5lcnJvci5maW5kICk7XG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5jY2wtanMtdGFicycpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRhYnMgPSBuZXcgVGFicyh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5jY2wtanMtd2F5ZmluZGVyJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgd2F5ZmluZGVyID0gbmV3IFdheWZpbmRlcih0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iXX0=
