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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkcm9wZG93bnMuanMiLCJoZWFkZXItbWVudS10b2dnbGVzLmpzIiwibW9kYWxzLmpzIiwicXVpY2stbmF2LmpzIiwicm9vbS1yZXMuanMiLCJzbW9vdGgtc2Nyb2xsLmpzIiwic3RpY2tpZXMuanMiLCJ0b2dnbGUtc2Nob29scy5qcyIsInRvb2x0aXBzLmpzIiwid2F5ZmluZGluZy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbDBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogR2xvYmFsIFZhcmlhYmxlcy4gXG4gKi9cblxuXG4oZnVuY3Rpb24gKCAkLCB3aW5kb3cgKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcbiAgICBcbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5EVVJBVElPTiA9IDMwMDtcblxuICAgIENDTC5CUkVBS1BPSU5UX1NNID0gNTAwO1xuICAgIENDTC5CUkVBS1BPSU5UX01EID0gNzY4O1xuICAgIENDTC5CUkVBS1BPSU5UX0xHID0gMTAwMDtcbiAgICBDQ0wuQlJFQUtQT0lOVF9YTCA9IDE1MDA7XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdodG1sJykudG9nZ2xlQ2xhc3MoJ25vLWpzIGpzJyk7XG4gICAgfSk7XG5cbn0pKGpRdWVyeSwgdGhpcyk7IiwiLyoqXG4gKiBSZWZsb3cgcGFnZSBlbGVtZW50cy4gXG4gKiBcbiAqIEVuYWJsZXMgYW5pbWF0aW9ucy90cmFuc2l0aW9ucyBvbiBlbGVtZW50cyBhZGRlZCB0byB0aGUgcGFnZSBhZnRlciB0aGUgRE9NIGhhcyBsb2FkZWQuXG4gKi9cblxuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wucmVmbG93ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH07XG5cbn0pKCk7IiwiLyoqXG4gKiBHZXQgdGhlIFNjcm9sbGJhciB3aWR0aFxuICogVGhhbmtzIHRvIGRhdmlkIHdhbHNoOiBodHRwczovL2Rhdmlkd2Fsc2gubmFtZS9kZXRlY3Qtc2Nyb2xsYmFyLXdpZHRoXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgXG4gICAgZnVuY3Rpb24gZ2V0U2Nyb2xsV2lkdGgoKSB7XG4gICAgICAgIFxuICAgICAgICAvLyBDcmVhdGUgdGhlIG1lYXN1cmVtZW50IG5vZGVcbiAgICAgICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIFxuICAgICAgICAvLyBwb3NpdGlvbiB3YXkgdGhlIGhlbGwgb2ZmIHNjcmVlblxuICAgICAgICAkKHNjcm9sbERpdikuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwcHgnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwcHgnLFxuICAgICAgICAgICAgb3ZlcmZsb3c6ICdzY3JvbGwnLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6ICctOTk5OXB4JyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnYm9keScpLmFwcGVuZChzY3JvbGxEaXYpO1xuXG4gICAgICAgIC8vIEdldCB0aGUgc2Nyb2xsYmFyIHdpZHRoXG4gICAgICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgICAgICAgLy8gY29uc29sZS53YXJuKHNjcm9sbGJhcldpZHRoKTsgLy8gTWFjOiAgMTVcblxuICAgICAgICAvLyBEZWxldGUgdGhlIERJViBcbiAgICAgICAgJChzY3JvbGxEaXYpLnJlbW92ZSgpO1xuXG4gICAgICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aDtcbiAgICB9XG4gICAgXG4gICAgaWYgKCAhIHdpbmRvdy5DQ0wgKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wuZ2V0U2Nyb2xsV2lkdGggPSBnZXRTY3JvbGxXaWR0aDtcbiAgICBDQ0wuU0NST0xMQkFSV0lEVEggPSBnZXRTY3JvbGxXaWR0aCgpO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiAuZGVib3VuY2UoKSBmdW5jdGlvblxuICogXG4gKiBTb3VyY2U6IGh0dHBzOi8vZGF2aWR3YWxzaC5uYW1lL2phdmFzY3JpcHQtZGVib3VuY2UtZnVuY3Rpb25cbiAqL1xuXG5cbihmdW5jdGlvbih3aW5kb3cpIHtcblxuICAgIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAgIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAgIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAgIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICAgIHZhciB0aHJvdHRsZSA9IGZ1bmN0aW9uIChmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgICAgIHZhciB0aW1lb3V0LCBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB0aHJvdHRsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcblxuICAgICAgICB0aHJvdHRsZWQuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgcHJldmlvdXMgPSAwO1xuICAgICAgICAgICAgdGltZW91dCA9IGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdGhyb3R0bGVkO1xuICAgIH07XG5cbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIHdpbmRvdy5DQ0wudGhyb3R0bGUgPSB0aHJvdHRsZTtcblxufSkodGhpcyk7IiwiLyoqXG4gKiBBY2NvcmRpb25zXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBhY2NvcmRpb24gY29tcG9uZW50c1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgQWNjb3JkaW9uID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiR0b2dnbGUgPSB0aGlzLiRlbC5jaGlsZHJlbignLmNjbC1jLWFjY29yZGlvbl9fdG9nZ2xlJyk7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQgPSB0aGlzLiRlbC5jaGlsZHJlbignLmNjbC1jLWFjY29yZGlvbl9fY29udGVudCcpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgQWNjb3JkaW9uLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiR0b2dnbGUub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy4kY29udGVudC5zbGlkZVRvZ2dsZSgpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLnRvZ2dsZUNsYXNzKCdjY2wtaXMtb3BlbicpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWMtYWNjb3JkaW9uJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IEFjY29yZGlvbih0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIEFsZXJ0c1xuICogXG4gKiBCZWhhdmlvciBmb3IgYWxlcnRzXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIERVUkFUSU9OID0gQ0NMLkRVUkFUSU9OO1xuXG4gICAgdmFyIEFsZXJ0RGlzbWlzcyA9IGZ1bmN0aW9uKCRlbCl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICAgICAgdGhpcy50YXJnZXQgPSAkZWwucGFyZW50KCk7XG4gICAgICAgIHRoaXMuJHRhcmdldCA9ICQodGhpcy50YXJnZXQpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEFsZXJ0RGlzbWlzcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgX3RoaXMuJHRhcmdldC5hbmltYXRlKCB7IG9wYWNpdHk6IDAgfSwge1xuICAgICAgICAgICAgZHVyYXRpb246IERVUkFUSU9OLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5zbGlkZVVwKCBEVVJBVElPTiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG5cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCAnY2xpY2snLCAnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICB2YXIgZGlzbWlzc0VsID0gJChlLnRhcmdldCkuY2xvc2VzdCgnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJyk7XG4gICAgICAgICAgICBuZXcgQWxlcnREaXNtaXNzKGRpc21pc3NFbCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICogQ2Fyb3VzZWxzXG4gKiBcbiAqIEluaXRpYWxpemUgYW5kIGRlZmluZSBiZWhhdmlvciBmb3IgY2Fyb3VzZWxzLiBcbiAqIFVzZXMgdGhlIFNsaWNrIFNsaWRlcyBqUXVlcnkgcGx1Z2luIC0tPiBodHRwOi8va2Vud2hlZWxlci5naXRodWIuaW8vc2xpY2svXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBDYXJvdXNlbCA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLmdsb2JhbERlZmF1bHRzID0ge1xuICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICBkb3RzQ2xhc3M6ICdjY2wtYy1jYXJvdXNlbF9fcGFnaW5nJyxcbiAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgIH07XG5cbiAgICBDYXJvdXNlbC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuJGVsLmRhdGEoKSxcbiAgICAgICAgICAgIG9wdGlvbnMgPSBkYXRhLm9wdGlvbnMgfHwge307XG4gICAgICAgICAgICBcbiAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlID0gW107XG5cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNTbSApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9TTSwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc1NtXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc01kICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX01ELCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zTWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zTGcgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfTEcsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNMZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNYbCApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9YTCwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc1hsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCggdGhpcy5nbG9iYWxEZWZhdWx0cywgb3B0aW9ucyApO1xuXG4gICAgICAgIHZhciBjYXJvdXNlbCA9IHRoaXMuJGVsLnNsaWNrKG9wdGlvbnMpLFxuICAgICAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGNhcm91c2VsLm9uKCdiZWZvcmVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKXtcbiAgICAgICAgICAgIF90aGlzLiRlbC5maW5kKCcuc2xpY2stc2xpZGUnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXBhc3QnKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5maW5kKCcuc2xpY2stc2xpZGVbZGF0YS1zbGljay1pbmRleD1cIicrbmV4dFNsaWRlKydcIl0nKS5wcmV2QWxsKCkuYWRkQ2xhc3MoJ2NjbC1pcy1wYXN0Jyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtcHJvbW8tY2Fyb3VzZWwnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgQ2Fyb3VzZWwodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBEcm9wZG93bnNcbiAqIFxuICogSW5pdGlhbGl6ZSBhbmQgY29udHJvbCBiZWhhdmlvciBmb3IgZHJvcGRvd24gbWVudXNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgVE9HR0xFOiAnW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBBQ1RJVkU6ICdjY2wtaXMtYWN0aXZlJyxcbiAgICAgICAgICAgIENPTlRFTlQ6ICdjY2wtYy1kcm9wZG93bl9fY29udGVudCdcbiAgICAgICAgfTtcblxuICAgIHZhciBEcm9wZG93blRvZ2dsZSA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHBhcmVudCA9IHRoaXMuJHRvZ2dsZS5wYXJlbnQoKTtcbiAgICAgICAgXG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLiR0b2dnbGUuZGF0YSgndGFyZ2V0Jyk7XG5cbiAgICAgICAgdGhpcy4kY29udGVudCA9ICQoIHRhcmdldCApO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHRvZ2dsZS5jbGljayggZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgX3RoaXMudG9nZ2xlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICB2YXIgaGFzQWN0aXZlTWVudXMgPSAkKCAnLicgKyBjbGFzc05hbWUuQ09OVEVOVCArICcuJyArIGNsYXNzTmFtZS5BQ1RJVkUgKS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoIGhhc0FjdGl2ZU1lbnVzICl7XG4gICAgICAgICAgICAgICAgX2NsZWFyTWVudXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGlzQWN0aXZlID0gdGhpcy4kdG9nZ2xlLmhhc0NsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG5cbiAgICAgICAgaWYgKCBpc0FjdGl2ZSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2hvd0NvbnRlbnQoKTtcblxuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuc2hvd0NvbnRlbnQgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiR0b2dnbGUuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQuYWRkQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgdGhpcy4kcGFyZW50LmFkZENsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5oaWRlTWVudSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgdGhpcy4kcGFyZW50LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9jbGVhck1lbnVzKCkge1xuICAgICAgICAkKCcuY2NsLWMtZHJvcGRvd24sIC5jY2wtYy1kcm9wZG93bl9fY29udGVudCcpLnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgICQoIHNlbGVjdG9yLlRPR0dMRSApLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCBzZWxlY3Rvci5UT0dHTEUgKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgRHJvcGRvd25Ub2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBIZWFkZXIgTWVudSBUb2dnbGVzXG4gKiBcbiAqIENvbnRyb2xzIGJlaGF2aW9yIG9mIG1lbnUgdG9nZ2xlcyBpbiB0aGUgaGVhZGVyXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBIZWFkZXJNZW51VG9nZ2xlID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0aGlzLiRlbC5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIHRoaXMuJHBhcmVudE1lbnUgPSB0aGlzLiRlbC5jbG9zZXN0KCcuY2NsLWMtbWVudScpO1xuICAgICAgICB0aGlzLiRjbG9zZUljb24gPSAkKCc8aSBjbGFzcz1cImNjbC1iLWljb24gY2xvc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+Jyk7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEhlYWRlck1lbnVUb2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIHRhcmdldCBpcyBhbHJlYWR5IG9wZW5cbiAgICAgICAgICAgIGlmICggdGhhdC4kdGFyZ2V0Lmhhc0NsYXNzKCdjY2wtaXMtYWN0aXZlJykgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBjbG9zZSB0YXJnZXQgYW5kIHJlbW92ZSBhY3RpdmUgY2xhc3Nlcy9lbGVtZW50c1xuICAgICAgICAgICAgICAgIHRoYXQuJHBhcmVudE1lbnUucmVtb3ZlQ2xhc3MoJ2NjbC1oYXMtYWN0aXZlLWl0ZW0nKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHRoYXQuJHRhcmdldC5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpLmZhZGVPdXQoQ0NMLkRVUkFUSU9OKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRjbG9zZUljb24ucmVtb3ZlKCk7ICAgICAgIFxuXG4gICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICAvLyB0YXJnZXQgaXMgbm90IG9wZW5cbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gY2xvc2UgYW5kIHJlc2V0IGFsbCBhY3RpdmUgbWVudXNcbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtbWVudS5jY2wtaGFzLWFjdGl2ZS1pdGVtJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NjbC1oYXMtYWN0aXZlLWl0ZW0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJ2EuY2NsLWlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuY2NsLWItaWNvbi5jbG9zZScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNsb3NlIGFuZCByZXNldCBhbGwgYWN0aXZlIHN1Yi1tZW51IGNvbnRhaW5lcnNcbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtc3ViLW1lbnUtY29udGFpbmVyLmNjbC1pcy1hY3RpdmUnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKS5mYWRlT3V0KENDTC5EVVJBVElPTik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBhY3RpdmF0ZSB0aGUgc2VsZWN0ZWQgdGFyZ2V0XG4gICAgICAgICAgICAgICAgdGhhdC4kcGFyZW50TWVudS5hZGRDbGFzcygnY2NsLWhhcy1hY3RpdmUtaXRlbScpO1xuICAgICAgICAgICAgICAgIHRoYXQuJHRhcmdldC5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpLmZhZGVJbihDQ0wuRFVSQVRJT04pO1xuICAgICAgICAgICAgICAgIC8vIHByZXBlbmQgY2xvc2UgaWNvblxuICAgICAgICAgICAgICAgIHRoYXQuJGNsb3NlSWNvbi5wcmVwZW5kVG8odGhhdC4kZWwpO1xuICAgICAgICAgICAgICAgIENDTC5yZWZsb3codGhhdC4kY2xvc2VJY29uWzBdKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRjbG9zZUljb24uZmFkZUluKDIwMCk7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy10b2dnbGUtaGVhZGVyLW1lbnUnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgSGVhZGVyTWVudVRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIE1vZGFsc1xuICogXG4gKiBCZWhhdmlvciBmb3IgbW9kYWxzLiBCYXNlZCBvbiBCb290c3RyYXAncyBtb2RhbHM6IGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzQuMC9jb21wb25lbnRzL21vZGFsL1xuICogXG4gKiBHbG9iYWxzOlxuICogU0NST0xMQkFSV0lEVEhcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgRFVSQVRJT04gPSAzMDA7XG5cbiAgICB2YXIgTW9kYWxUb2dnbGUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgJGVsID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLnRhcmdldCA9ICRlbC5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7IFxuXG4gICAgICAgIF90aGlzLiRlbC5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmICggJChkb2N1bWVudC5ib2R5KS5oYXNDbGFzcygnY2NsLW1vZGFsLW9wZW4nKSApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jbG9zZU1vZGFsKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzLnNob3dCYWNrZHJvcChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zaG93TW9kYWwoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLnNob3dCYWNrZHJvcCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblxuICAgICAgICB2YXIgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdmFyICRiYWNrZHJvcCA9ICQoYmFja2Ryb3ApO1xuXG4gICAgICAgICRiYWNrZHJvcC5hZGRDbGFzcygnY2NsLWMtbW9kYWxfX2JhY2tkcm9wJyk7XG4gICAgICAgICRiYWNrZHJvcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgXG4gICAgICAgIENDTC5yZWZsb3coYmFja2Ryb3ApO1xuICAgICAgICBcbiAgICAgICAgJGJhY2tkcm9wLmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICAkKGRvY3VtZW50LmJvZHkpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJylcbiAgICAgICAgICAgIC5jc3MoICdwYWRkaW5nLXJpZ2h0JywgQ0NMLlNDUk9MTEJBUldJRFRIICk7XG5cbiAgICAgICAgaWYgKCBjYWxsYmFjayApIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoIGNhbGxiYWNrLCBEVVJBVElPTiApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5zaG93TW9kYWwgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBfdGhpcy4kdGFyZ2V0LnNob3coIDAsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAkKCcuY2NsLWMtbW9kYWwnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsJykuaGlkZSgpO1xuXG4gICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWxfX2JhY2tkcm9wJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWxfX2JhY2tkcm9wJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLW1vZGFsLW9wZW4nKVxuICAgICAgICAgICAgICAgICAgICAuY3NzKCAncGFkZGluZy1yaWdodCcsICcnICk7XG5cbiAgICAgICAgICAgIH0sIERVUkFUSU9OKTtcblxuICAgICAgICB9LCBEVVJBVElPTiApOyBcblxuICAgIH07XG5cblxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgTW9kYWxUb2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICogUXVpY2sgTmF2XG4gKiBcbiAqIEJlaGF2aW9yIGZvciB0aGUgcXVpY2sgbmF2XG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyksXG4gICAgICAgIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIFF1aWNrTmF2ID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMudG9nZ2xlT2Zmc2V0ID0gJCgnLnNpdGUtY29udGVudCcpLm9mZnNldCgpLnRvcDtcbiAgICAgICAgdGhpcy4kc3ViTWVudXMgPSB0aGlzLiRlbC5maW5kKCcuc3ViLW1lbnUnKTtcbiAgICAgICAgdGhpcy4kc2Nyb2xsU3B5SXRlbXMgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtcXVpY2stbmF2X19zY3JvbGxzcHkgc3BhbicpO1xuICAgICAgICB0aGlzLiRzZWFyY2hUb2dnbGUgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWlzLXNlYXJjaC10b2dnbGUnKTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgUXVpY2tOYXYucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHRoaXMuaW5pdFNjcm9sbCgpO1xuICAgICAgICB0aGlzLmluaXRNZW51cygpO1xuICAgICAgICB0aGlzLmluaXRTY3JvbGxTcHkoKTtcbiAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG5cbiAgICB9O1xuXG4gICAgUXVpY2tOYXYucHJvdG90eXBlLmluaXRTY3JvbGwgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgMTAwICkgKTtcblxuICAgICAgICBmdW5jdGlvbiBfb25TY3JvbGwoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xuICAgIFxuICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gdGhhdC50b2dnbGVPZmZzZXQgKSB7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1maXhlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWZpeGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdE1lbnVzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCAhIHRoaXMuJHN1Yk1lbnVzLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJHN1Yk1lbnVzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciAkc3ViTWVudSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgJHRvZ2dsZSA9ICRzdWJNZW51LnNpYmxpbmdzKCdhJyk7XG5cbiAgICAgICAgICAgICR0b2dnbGUuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICRzdWJNZW51LnNsaWRlVG9nZ2xlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFF1aWNrTmF2LnByb3RvdHlwZS5pbml0U2Nyb2xsU3B5ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kc2Nyb2xsU3B5SXRlbXMuZWFjaChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICB2YXIgJHNweUl0ZW0gPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIHRhcmdldCA9ICRzcHlJdGVtLmRhdGEoJ3RhcmdldCcpO1xuXG4gICAgICAgICAgICAkd2luZG93LnNjcm9sbCggQ0NMLnRocm90dGxlKCBfb25TY3JvbGwsIDEwMCApICk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIF9vblNjcm9sbCgpIHtcbiAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKSxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VG9wID0gJCh0YXJnZXQpLm9mZnNldCgpLnRvcCAtIDE1MDtcblxuICAgICAgICAgICAgICAgIGlmICggc2Nyb2xsVG9wID49IHRhcmdldFRvcCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC4kc2Nyb2xsU3B5SXRlbXMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgJHNweUl0ZW0uYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc3B5SXRlbS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFF1aWNrTmF2LnByb3RvdHlwZS5pbml0U2VhcmNoID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB0aGlzLiRzZWFyY2hUb2dnbGUuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoYXQuJGVsLnRvZ2dsZUNsYXNzKCdjY2wtc2VhcmNoLWFjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1jLXF1aWNrLW5hdicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBRdWlja05hdih0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFJvb20gUmVzZXJ2YXRpb25cbiAqIFxuICogSGFuZGxlIHJvb20gcmVzZXJ2YXRpb25zXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIFJvb21SZXNGb3JtID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kZm9ybUNvbnRlbnQgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1jb250ZW50JykuY3NzKHtwb3NpdGlvbjoncmVsYXRpdmUnfSk7XG4gICAgICAgIHRoaXMuJGZvcm1SZXNwb25zZSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLXJlc3BvbnNlJykuY3NzKHtwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnMXJlbScsIGxlZnQ6ICcxcmVtJywgb3BhY2l0eTogMH0pO1xuICAgICAgICB0aGlzLiRmb3JtQ2FuY2VsID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tY2FuY2VsJyk7XG4gICAgICAgIHRoaXMuJGZvcm1TdWJtaXQgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1zdWJtaXQnKTtcbiAgICAgICAgdGhpcy5yb29tSWQgPSB0aGlzLiRlbC5kYXRhKCdyZXNvdXJjZS1pZCcpO1xuICAgICAgICB0aGlzLiRkYXRlU2VsZWN0ID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tZGF0ZS1zZWxlY3QnKTtcbiAgICAgICAgdGhpcy5kYXRlWW1kID0gdGhpcy4kZGF0ZVNlbGVjdC52YWwoKTtcbiAgICAgICAgdGhpcy4kcm9vbVNjaGVkdWxlID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tc2NoZWR1bGUnKTtcbiAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1jdXJyZW50LWR1cmF0aW9uJyk7XG4gICAgICAgIHRoaXMuJGZvcm1Ob3RpZmljYXRpb24gPSAkKCc8cCBjbGFzcz1cImNjbC1jLWFsZXJ0XCI+PC9wPicpO1xuICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0biA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yZXNldC1zZWxlY3Rpb24nKTsgXG4gICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbXTtcbiAgICAgICAgdGhpcy5tYXhTbG90cyA9IDQ7XG4gICAgICAgIHRoaXMuJG1heFRpbWUgPSB0aGlzLiRlbC5maW5kKCcuanMtbWF4LXRpbWUnKTtcbiAgICAgICAgdGhpcy5zbG90TWludXRlcyA9IDMwO1xuICAgICAgICB0aGlzLmxvY2FsZSA9IFwiZW4tVVNcIjtcbiAgICAgICAgdGhpcy50aW1lWm9uZSA9IHt0aW1lWm9uZTogXCJBbWVyaWNhL0xvc19BbmdlbGVzXCJ9O1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB0aGlzLnNldExvYWRpbmcoKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNjaGVkdWxlRGF0YSgpO1xuXG4gICAgICAgIHRoaXMuc2V0TWF4VGltZVRleHQoKTtcblxuICAgICAgICB0aGlzLmluaXREYXRlRXZlbnRzKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXRGb3JtRXZlbnRzKCk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5nZXRTcGFjZUF2YWlsYWJpbGl0eSA9IGZ1bmN0aW9uKFltZCl7XG5cblx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdGFjdGlvbjogJ2dldF9yb29tX2luZm8nLFxuXHRcdFx0Y2NsX25vbmNlOiBDQ0wubm9uY2UsXG5cdFx0XHRhdmFpbGFiaWxpdHk6IFltZCB8fCAnJywgLy8gZS5nLiAnMjAxNy0xMC0xOScuIGVtcHR5IHN0cmluZyB3aWxsIGdldCBhdmFpbGFiaWxpdHkgZm9yIGN1cnJlbnQgZGF5XG5cdFx0XHRyb29tOiB0aGlzLnJvb21JZCAvLyByb29tX2lkIChzcGFjZSlcblx0XHR9O1xuXG4gICAgICAgIHJldHVybiAkLnBvc3Qoe1xuXHRcdFx0dXJsOiBDQ0wuYWpheF91cmwsXG5cdFx0XHRkYXRhOiBkYXRhXG5cdFx0fSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmdldFNwYWNlQm9va2luZ3MgPSBmdW5jdGlvbihZbWQpe1xuICAgICAgICBcbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBhY3Rpb246ICdnZXRfYm9va2luZ3MnLFxuICAgICAgICAgICAgY2NsX25vbmNlOiBDQ0wubm9uY2UsXG4gICAgICAgICAgICBkYXRlOiBZbWQgfHwgJycsIC8vIGUuZy4gJzIwMTctMTAtMTknLiBlbXB0eSBzdHJpbmcgd2lsbCBnZXQgYm9va2luZ3MgZm9yIGN1cnJlbnQgZGF5XG4gICAgICAgICAgICByb29tOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgIGxpbWl0OiA1MFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiAkLnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiBDQ0wuYWpheF91cmwsXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS51cGRhdGVTY2hlZHVsZURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBnZXRTcGFjZWpxWEhSID0gdGhpcy5nZXRTcGFjZUF2YWlsYWJpbGl0eSh0aGlzLmRhdGVZbWQpO1xuICAgICAgICB2YXIgZ2V0Qm9va2luZ3NqcVhIUiA9IHRoaXMuZ2V0U3BhY2VCb29raW5ncyh0aGlzLmRhdGVZbWQpO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgJC53aGVuKGdldFNwYWNlanFYSFIsIGdldEJvb2tpbmdzanFYSFIpXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihnZXRTcGFjZSxnZXRCb29raW5ncyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgc3BhY2VEYXRhID0gZ2V0U3BhY2VbMF0sXG4gICAgICAgICAgICAgICAgICAgIGJvb2tpbmdzRGF0YSA9IGdldEJvb2tpbmdzWzBdLFxuICAgICAgICAgICAgICAgICAgICBzcGFjZWpxWEhSID0gZ2V0U3BhY2VbMl0sXG4gICAgICAgICAgICAgICAgICAgIGJvb2tpbmdzanFYSFIgPSBnZXRCb29raW5nc1syXSxcbiAgICAgICAgICAgICAgICAgICAgdGltZVNsb3RzQXJyYXk7XG5cbiAgICAgICAgICAgICAgICAvLyBwYXJzZSBkYXRhIHRvIEpTT04gaWYgaXQncyBhIHN0cmluZ1xuICAgICAgICAgICAgICAgIHNwYWNlRGF0YSA9ICggdHlwZW9mIHNwYWNlRGF0YSA9PT0gJ3N0cmluZycgKSA/IEpTT04ucGFyc2UoIHNwYWNlRGF0YSApWzBdIDogc3BhY2VEYXRhWzBdO1xuICAgICAgICAgICAgICAgIGJvb2tpbmdzRGF0YSA9ICggdHlwZW9mIGJvb2tpbmdzRGF0YSA9PT0gJ3N0cmluZycgKSA/IEpTT04ucGFyc2UoIGJvb2tpbmdzRGF0YSApIDogYm9va2luZ3NEYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gbWVyZ2UgYm9va2luZ3Mgd2l0aCBhdmFpbGFiaWxpdHlcbiAgICAgICAgICAgICAgICBpZiAoIGJvb2tpbmdzRGF0YS5sZW5ndGggKXtcblxuICAgICAgICAgICAgICAgICAgICBib29raW5nc0RhdGEuZm9yRWFjaChmdW5jdGlvbihib29raW5nLGkpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgbnVtYmVyIG9mIHNsb3RzIGJhc2VkIG9uIGJvb2tpbmcgZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmcm9tVGltZSA9IG5ldyBEYXRlKGJvb2tpbmcuZnJvbURhdGUpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1RpbWUgPSBuZXcgRGF0ZShib29raW5nLnRvRGF0ZSkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uTWludXRlcyA9ICh0b1RpbWUgLSBmcm9tVGltZSkgLyAxMDAwIC8gNjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xvdENvdW50ID0gZHVyYXRpb25NaW51dGVzIC8gdGhhdC5zbG90TWludXRlcztcblxuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2VEYXRhLmF2YWlsYWJpbGl0eS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogYm9va2luZy5mcm9tRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRvXCI6IGJvb2tpbmcudG9EYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2xvdENvdW50XCI6IHNsb3RDb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlzQm9va2VkXCI6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gc29ydCB0aW1lIHNsb3Qgb2JqZWN0cyBieSB0aGUgXCJmcm9tXCIga2V5XG4gICAgICAgICAgICAgICAgICAgIF9zb3J0QnlLZXkoIHNwYWNlRGF0YS5hdmFpbGFiaWxpdHksICdmcm9tJyApO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgdGltZSBzbG90cyBhbmQgcmV0dXJuIGFuIGFwcHJvcHJpYXRlIHN1YnNldCAob25seSBvcGVuIHRvIGNsb3NlIGhvdXJzKVxuICAgICAgICAgICAgICAgIHRpbWVTbG90c0FycmF5ID0gdGhhdC5wYXJzZVNjaGVkdWxlKHNwYWNlRGF0YS5hdmFpbGFiaWxpdHkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGJ1aWxkIHNjaGVkdWxlIEhUTUxcbiAgICAgICAgICAgICAgICB0aGF0LmJ1aWxkU2NoZWR1bGUodGltZVNsb3RzQXJyYXkpO1xuXG4gICAgICAgICAgICAgICAgLy8gRXJyb3IgaGFuZGxlcnNcbiAgICAgICAgICAgICAgICBzcGFjZWpxWEhSLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBib29raW5nc2pxWEhSLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGF0LnVuc2V0TG9hZGluZygpO1xuICAgICAgICAgICAgICAgIHRoYXQuJHJlc2V0U2VsZWN0aW9uQnRuLmhpZGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5idWlsZFNjaGVkdWxlID0gZnVuY3Rpb24odGltZVNsb3RzQXJyYXkpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGh0bWwgPSBbXTtcbiAgICAgICAgICAgIFxuICAgICAgICAvLyBjb25zdHJ1Y3QgSFRNTCBmb3IgZWFjaCB0aW1lIHNsb3RcbiAgICAgICAgdGltZVNsb3RzQXJyYXkuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKXtcblxuICAgICAgICAgICAgdmFyIGZyb20gPSBuZXcgRGF0ZSggaXRlbS5mcm9tICksXG4gICAgICAgICAgICAgICAgdGltZVN0cmluZyxcbiAgICAgICAgICAgICAgICBpdGVtQ2xhc3MgPSAnJztcblxuICAgICAgICAgICAgaWYgKCBmcm9tLmdldE1pbnV0ZXMoKSAhPT0gMCApIHtcbiAgICAgICAgICAgICAgICB0aW1lU3RyaW5nID0gdGhhdC5yZWFkYWJsZVRpbWUoIGZyb20sICdoOm0nICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmcgPSB0aGF0LnJlYWRhYmxlVGltZSggZnJvbSwgJ2hhJyApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIGl0ZW0uaXNCb29rZWQgJiYgaXRlbS5oYXNPd25Qcm9wZXJ0eSgnc2xvdENvdW50JykgKSB7XG4gICAgICAgICAgICAgICAgaXRlbUNsYXNzID0gJ2NjbC1pcy1vY2N1cGllZCBjY2wtZHVyYXRpb24tJyArIGl0ZW0uc2xvdENvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBidWlsZCBzZWxlY3RhYmxlIHRpbWUgc2xvdHNcbiAgICAgICAgICAgIGh0bWwucHVzaCggdGhhdC5idWlsZFRpbWVTbG90KHtcbiAgICAgICAgICAgICAgICBpZDogJ3Nsb3QtJyArIHRoYXQucm9vbUlkICsgJy0nICsgaSxcbiAgICAgICAgICAgICAgICBmcm9tOiBpdGVtLmZyb20sXG4gICAgICAgICAgICAgICAgdG86IGl0ZW0udG8sXG4gICAgICAgICAgICAgICAgdGltZVN0cmluZzogdGltZVN0cmluZyxcbiAgICAgICAgICAgICAgICBjbGFzczogaXRlbUNsYXNzXG4gICAgICAgICAgICB9KSApO1xuICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbXTtcblxuICAgICAgICB0aGlzLiRyb29tU2NoZWR1bGUuaHRtbCggaHRtbC5qb2luKCcnKSApO1xuXG4gICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXJvb21fX3Nsb3QgW3R5cGU9XCJjaGVja2JveFwiXScpO1xuXG4gICAgICAgIHRoaXMuc2V0Q3VycmVudER1cmF0aW9uVGV4dCgpO1xuXG4gICAgICAgIHRoaXMuaW5pdFNsb3RFdmVudHMoKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuYnVpbGRUaW1lU2xvdCA9IGZ1bmN0aW9uKHZhcnMpe1xuICAgICAgICBcbiAgICAgICAgaWYgKCAhIHZhcnMgfHwgdHlwZW9mIHZhcnMgIT09ICdvYmplY3QnICkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgY2xhc3M6ICcnLFxuICAgICAgICAgICAgaWQ6ICcnLFxuICAgICAgICAgICAgZGlzYWJsZWQ6ICcnLFxuICAgICAgICAgICAgZnJvbTogJycsXG4gICAgICAgICAgICB0bzogJycsXG4gICAgICAgICAgICB0aW1lU3RyaW5nOiAnJ1xuICAgICAgICB9O1xuICAgICAgICB2YXJzID0gJC5leHRlbmQoZGVmYXVsdHMsIHZhcnMpO1xuXG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9ICcnICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2NsLWMtcm9vbV9fc2xvdCAnICsgdmFycy5jbGFzcyArICdcIj4nICtcbiAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwiJyArIHZhcnMuaWQgKyAnXCIgbmFtZT1cIicgKyB2YXJzLmlkICsgJ1wiIHZhbHVlPVwiJyArIHZhcnMuZnJvbSArICdcIiBkYXRhLXRvPVwiJyArIHZhcnMudG8gKyAnXCIgJyArIHZhcnMuZGlzYWJsZWQgKyAnLz4nICtcbiAgICAgICAgICAgICAgICAnPGxhYmVsIGNsYXNzPVwiY2NsLWMtcm9vbV9fc2xvdC1sYWJlbFwiIGZvcj1cIicgKyB2YXJzLmlkICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICB2YXJzLnRpbWVTdHJpbmcgK1xuICAgICAgICAgICAgICAgICc8L2xhYmVsPicgK1xuICAgICAgICAgICAgJzwvZGl2Pic7XG5cbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUucGFyc2VTY2hlZHVsZSA9IGZ1bmN0aW9uKHNjaGVkdWxlQXJyYXkpe1xuICAgICAgICAvLyByZXR1cm5zIHRoZSBhcHByb3ByaWF0ZSBzY2hlZHVsZSBmb3IgYSBnaXZlbiBhcnJheSBvZiB0aW1lIHNsb3RzXG4gICAgICAgIFxuICAgICAgICB2YXIgdG8gPSBudWxsLFxuICAgICAgICAgICAgc3RhcnRFbmRJbmRleGVzID0gW10sIFxuICAgICAgICAgICAgc3RhcnQsIGVuZDtcblxuICAgICAgICAvLyBsb29wIHRocm91Z2ggYXJyYXkgYW5kIHBpY2sgb3V0IHRpbWUgZ2Fwc1xuICAgICAgICBzY2hlZHVsZUFycmF5LmZvckVhY2goZnVuY3Rpb24oaXRlbSxpKXtcbiAgICAgICAgICAgIGlmICggdG8gJiYgdG8gIT09IGl0ZW0uZnJvbSApIHtcbiAgICAgICAgICAgICAgICBzdGFydEVuZEluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRvID0gaXRlbS50bztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZGVwZW5kaW5nIG9uIG51bWJlciBvZiBnYXBzIGZvdW5kLCBkZXRlcm1pbmUgc3RhcnQgYW5kIGVuZCBpbmRleGVzXG4gICAgICAgIGlmICggc3RhcnRFbmRJbmRleGVzLmxlbmd0aCA+PSAyICkge1xuICAgICAgICAgICAgc3RhcnQgPSBzdGFydEVuZEluZGV4ZXNbMF07XG4gICAgICAgICAgICBlbmQgPSBzdGFydEVuZEluZGV4ZXNbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGFydCA9IDA7XG4gICAgICAgICAgICBpZiAoIHN0YXJ0RW5kSW5kZXhlcy5sZW5ndGggPT09IDEgKSB7XG4gICAgICAgICAgICAgICAgZW5kID0gc3RhcnRFbmRJbmRleGVzWzBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbmQgPSBzY2hlZHVsZUFycmF5Lmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gcmV0dXJuZWQgc2xpY2VkIHBvcnRpb24gb2Ygb3JpZ2luYWwgc2NoZWR1bGVcbiAgICAgICAgcmV0dXJuIHNjaGVkdWxlQXJyYXkuc2xpY2Uoc3RhcnQsZW5kKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXRGb3JtRXZlbnRzID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4uY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICQodGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMpLmVhY2goZnVuY3Rpb24oaSxpbnB1dCl7XG4gICAgICAgICAgICAgICAgJChpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAuY2hhbmdlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCBjY2wtaGFzLXBvdGVudGlhbCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRlbC5zdWJtaXQoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoYXQub25TdWJtaXQoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXREYXRlRXZlbnRzID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRkYXRlU2VsZWN0LmNoYW5nZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhhdC5vbkRhdGVDaGFuZ2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uRGF0ZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5kYXRlWW1kID0gdGhpcy4kZGF0ZVNlbGVjdC52YWwoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0TG9hZGluZygpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2NoZWR1bGVEYXRhKCk7XG4gICAgICAgIFxuICAgIH07XG4gICAgICAgIFxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0U2xvdEV2ZW50cyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIGlmICggdGhpcy4kcm9vbVNsb3RJbnB1dHMgJiYgdGhpcy4kcm9vbVNsb3RJbnB1dHMubGVuZ3RoICl7XG5cbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1yb29tX19zbG90JykuaG92ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGF0Lm9uU2xvdE1vdXNlSW4odGhpcyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoYXQub25TbG90TW91c2VPdXQodGhpcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gY2xpY2sgZXZlbnQgZmlyZXMgQkVGT1JFIGNoYW5nZSBldmVudFxuICAgICAgICAgICAgdGhpcy4kcm9vbVNsb3RJbnB1dHMuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhhdC5vblNsb3RDbGljayhpbnB1dCwgZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzLmNoYW5nZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhhdC5vblNsb3RDaGFuZ2UoaW5wdXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TbG90TW91c2VJbiA9IGZ1bmN0aW9uKGhvdmVyZWRTbG90KSB7XG5cbiAgICAgICAgLy8gaWYgeW91J3JlIG5vdCBzZWxlY3RpbmcgeW91ciAybmQgc2xvdCwgcmV0dXJuXG4gICAgICAgIGlmICggdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoICE9PSAxICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhvdmVyZWRJbnB1dCA9ICQoaG92ZXJlZFNsb3QpLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKTtcblxuICAgICAgICB2YXIgaG92ZXJlZElucHV0SW5kZXggPSB0aGlzLiRyb29tU2xvdElucHV0cy5pbmRleChob3ZlcmVkSW5wdXQpLFxuICAgICAgICAgICAgc2VsZWN0ZWRJbnB1dEluZGV4ID0gdGhpcy4kcm9vbVNsb3RJbnB1dHMuaW5kZXgoIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzWzBdICksXG4gICAgICAgICAgICBpbnB1dEluZGV4U2V0ID0gW2hvdmVyZWRJbnB1dEluZGV4LCBzZWxlY3RlZElucHV0SW5kZXhdLnNvcnQoKTtcblxuICAgICAgICAvLyBpZiB5b3UncmUgaG92ZXJpbmcgdGhlIGFscmVhZHkgc2VsZWN0ZWQgc2xvdCwgcmV0dXJuXG4gICAgICAgIGlmICggaW5wdXRJbmRleFNldFswXSA9PT0gaW5wdXRJbmRleFNldFsxXSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBmaXJzdCBvciBsYXN0IGlucHV0IGluZGV4ZXMgYXJlIGJleW9uZCBib3VuZGFyaWVzLCByZXR1cm5cbiAgICAgICAgaWYgKCBpbnB1dEluZGV4U2V0WzBdIDw9IHNlbGVjdGVkSW5wdXRJbmRleCAtIHRoaXMubWF4U2xvdHMgfHwgaW5wdXRJbmRleFNldFsxXSA+PSBzZWxlY3RlZElucHV0SW5kZXggKyB0aGlzLm1heFNsb3RzICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0IGZpcnN0L2xhc3Qgc2xvdCBlbGVtZW50c1xuICAgICAgICB2YXIgJGZpcnN0U2xvdCA9IHRoaXMuJHJvb21TbG90SW5wdXRzLmVxKGlucHV0SW5kZXhTZXRbMF0pLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKSxcbiAgICAgICAgICAgICRsYXN0U2xvdCA9IHRoaXMuJHJvb21TbG90SW5wdXRzLmVxKGlucHV0SW5kZXhTZXRbMV0pLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKTtcblxuICAgICAgICAvLyBzZWxlY3Qgc2xvdHMgaW4gYmV0d2VlbiBmaXJzdCBhbmQgbGFzdFxuICAgICAgICAkZmlyc3RTbG90Lm5leHRVbnRpbCgkbGFzdFNsb3QpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICBpZiAoICEgJHRoaXMuaGFzQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpICkge1xuICAgICAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCdjY2wtaGFzLXBvdGVudGlhbCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TbG90TW91c2VPdXQgPSBmdW5jdGlvbihob3ZlcmVkSW5wdXQpIHtcblxuICAgICAgICBpZiAoIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCAhPT0gMSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1oYXMtcG90ZW50aWFsJyk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uU2xvdENsaWNrID0gZnVuY3Rpb24oY2xpY2tlZElucHV0LCBldmVudCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBjbGlja0lucHV0SW5kZXggPSB0aGF0LiRyb29tU2xvdElucHV0cy5pbmRleChjbGlja2VkSW5wdXQpLFxuICAgICAgICAgICAgbWluSW5kZXggPSBjbGlja0lucHV0SW5kZXggLSB0aGF0Lm1heFNsb3RzLFxuICAgICAgICAgICAgbWF4SW5kZXggPSBjbGlja0lucHV0SW5kZXggKyB0aGF0Lm1heFNsb3RzO1xuXG4gICAgICAgIC8vIGRpc2FibGVzIHNsb3RzIHRoYXQgYXJlIG91dHNpZGUgb2YgbWF4IHNlbGVjdGFibGUgYXJlYVxuICAgICAgICBmdW5jdGlvbiBfaXNvbGF0ZVNlbGVjdGFibGVTbG90cygpIHtcblxuICAgICAgICAgICAgLy8gb2NjdXBpZWQgc2xvdHMgd2lsbCBhZmZlY3Qgd2hhdCBuZWFyYnkgc2xvdHMgY2FuIGJlIHNlbGVjdGVkXG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggYW55IG9jY3VwaWVkIHNsb3RzLCBpZiB0aGV5IGV4aXN0XG4gICAgICAgICAgICAkKCcuY2NsLWMtcm9vbV9fc2xvdC5jY2wtaXMtb2NjdXBpZWQnKS5lYWNoKGZ1bmN0aW9uKGksc2xvdCl7XG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgb2NjdXBpZWQgc2xvdCdzIGlucHV0LCBmaW5kIGl0J3MgaW5kZXggYW1vdW5nIGFsbCBzbG90IGlucHV0c1xuICAgICAgICAgICAgICAgIHZhciBzbG90SW5wdXQgPSAkKHNsb3QpLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSxcbiAgICAgICAgICAgICAgICAgICAgb2NjdXBpZWRJbmRleCA9IHRoYXQuJHJvb21TbG90SW5wdXRzLmluZGV4KHNsb3RJbnB1dCk7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBvY2N1cGllZCBzbG90IGZhbGxzIGluIHRoZSBzZWxlY3RhYmxlIGFyZWFcbiAgICAgICAgICAgICAgICBpZiAoIG1pbkluZGV4IDwgb2NjdXBpZWRJbmRleCAmJiBvY2N1cGllZEluZGV4IDwgbWF4SW5kZXggKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgb2NjdXBpZWQgc2xvdCBpcyBCRUZPUkUgY2xpY2tlZCBzbG90LCBzZXQgaXQgYXMgdGhlIG1pblxuICAgICAgICAgICAgICAgICAgICBpZiAoIG9jY3VwaWVkSW5kZXggPCBjbGlja0lucHV0SW5kZXggKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5JbmRleCA9IG9jY3VwaWVkSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgb2NjdXBpZWQgc2xvdCBpcyBBRlRFUiBjbGlja2VkIHNsb3QsIHNldCBpdCBhcyB0aGUgbWF4XG4gICAgICAgICAgICAgICAgICAgIGlmICggb2NjdXBpZWRJbmRleCA+IGNsaWNrSW5wdXRJbmRleCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heEluZGV4ID0gb2NjdXBpZWRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBzbG90cywgZGlzYWJsZSBvbmVzIHRoYXQgZmFsbCBvdXRzaWRlIG9mIG1pbi9tYXggaW5kZXhlc1xuICAgICAgICAgICAgdGhhdC4kcm9vbVNsb3RJbnB1dHMuZWFjaChmdW5jdGlvbihpLGlucHV0KXtcbiAgICAgICAgICAgICAgICBpZiAoIGkgPD0gbWluSW5kZXggfHwgaSA+PSBtYXhJbmRleCApIHtcbiAgICAgICAgICAgICAgICAgICAgJChpbnB1dCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpLmFkZENsYXNzKCdjY2wtaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBpZiBubyBpbnB1dHMgeWV0IHNlbGVjdGVkLCB0aGlzIGlzIHRoZSBmaXJzdFxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gICAgICAgIGlmICggdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoID09PSAwICkge1xuXG4gICAgICAgICAgICBfaXNvbGF0ZVNlbGVjdGFibGVTbG90cygpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIGlmIDEgaW5wdXQgc2VsZWN0ZWQsIHNlbGVjdGluZyAybmQgc2xvdFxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gICAgICAgIGlmICggdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoID09PSAxICkge1xuXG4gICAgICAgICAgICBpZiAoICQoY2xpY2tlZElucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykuaGFzQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpICkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIGlmIDIgb3IgbW9yZSBzbG90cyBhbHJlYWR5IHNlbGVjdGVkXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgaWYgKCB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPj0gMiApIHtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIGNsaWNrZWQgaW5wdXQgaXMgbm90IHBhcnQgb2YgY3VycmVudCBzZWxlY3Rpb25cbiAgICAgICAgICAgIC8vIGNsZWFyIGFsbCBzZWxlY3RlZCBpbnB1dHNcbiAgICAgICAgICAgIGlmICggdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZiggY2xpY2tlZElucHV0ICkgPCAwICkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhhdC5jbGVhckFsbFNsb3RzKCk7XG4gICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbXTtcblxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gaWYgY2xpY2tlZCBpbnB1dCBpcyBvbmUgb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBpbnB1dHNcbiAgICAgICAgICAgIC8vIGtlZXAgdGhhdCBvbmUgc2VsZWN0ZWQgYW5kIGRlc2VsZWN0IHRoZSByZXN0XG4gICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgIC8vIHByZXZlbnQgY2hhbmdlIGV2ZW50IGZyb20gZmlyaW5nXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgaW5wdXQgaW5kZXggZnJvbSBhbW9uZyBzZWxlY3RlZCBpbnB1dHNcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWRTbG90SW5kZXggPSB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKCBjbGlja2VkSW5wdXQgKSxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJbnB1dHMgPSAkLmV4dGVuZCggW10sIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gY2xlYXIgYWxsIGlucHV0cyBFWENFUFQgdGhlIGNsaWNrZWQgb25lXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJbnB1dHMuZm9yRWFjaChmdW5jdGlvbihpbnB1dCxpKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBzZWxlY3RlZFNsb3RJbmRleCAhPSBpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5jbGVhclNsb3QoaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gLy8gc2V0IHNlbGVjdGVkIGlucHV0cyB0byBqdXN0IHRoaXMgb25lXG4gICAgICAgICAgICAgICAgLy8gdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzW3NlbGVjdGVkU2xvdEluZGV4XSBdO1xuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBjdXJyZW50IGR1cmF0aW9uIHRleHRcbiAgICAgICAgICAgICAgICB0aGF0LnNldEN1cnJlbnREdXJhdGlvblRleHQoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfaXNvbGF0ZVNlbGVjdGFibGVTbG90cygpO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblNsb3RDaGFuZ2UgPSBmdW5jdGlvbihjaGFuZ2VkSW5wdXQpe1xuICAgICAgICBcbiAgICAgICAgLy8gaWYgaW5wdXQgY2hlY2tlZCwgYWRkIGl0IHRvIHNlbGVjdGVkIHNldFxuICAgICAgICBpZiAoICQoY2hhbmdlZElucHV0KS5wcm9wKCdjaGVja2VkJykgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnB1c2goY2hhbmdlZElucHV0KTtcbiAgICAgICAgICAgICQoY2hhbmdlZElucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG4gICBcbiAgICAgICAgfSBcbiAgICAgICAgXG4gICAgICAgIC8vIGlmIGlucHV0IHVuY2hlY2tlZCwgcmVtb3ZlIGl0IGZyb20gdGhlIHNlbGVjdGVkIHNldFxuICAgICAgICBlbHNlIHsgXG5cbiAgICAgICAgICAgIHZhciBjaGFuZ2VkSW5wdXRJbmRleCA9IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2YoY2hhbmdlZElucHV0KTtcblxuICAgICAgICAgICAgaWYgKCBjaGFuZ2VkSW5wdXRJbmRleCA+IC0xICkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnNwbGljZSggY2hhbmdlZElucHV0SW5kZXgsIDEgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoY2hhbmdlZElucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRvZ2dsZSByZXNldCBidXR0b25cbiAgICAgICAgaWYgKCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4uc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4uaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgaGlnaGxpZ2h0IHNsb3RzIGJldHdlZW4gdHdvIGVuZHNcbiAgICAgICAgaWYgKCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPT09IDIgKSB7XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgdGhhdC4kZWwuZmluZCgnLmNjbC1pcy1jaGVja2VkJykuZmlyc3QoKS5uZXh0VW50aWwoJy5jY2wtaXMtY2hlY2tlZCcpLmVhY2goZnVuY3Rpb24oaSxzbG90KXtcbiAgICAgICAgICAgICAgICB2YXIgc2xvdElucHV0ID0gJChzbG90KS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcbiAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5wdXNoKHNsb3RJbnB1dFswXSk7XG4gICAgICAgICAgICAgICAgdGhhdC5hY3RpdmF0ZVNsb3Qoc2xvdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0Q3VycmVudER1cmF0aW9uVGV4dCgpO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5jbGVhclNsb3QgPSBmdW5jdGlvbihzbG90KSB7XG4gICAgICAgIC8vIHNsb3QgY2FuIGJlIGVpdGhlciB0aGUgY2hlY2tib3ggaW5wdXQgLU9SLSB0aGUgY2hlY2tib3gncyBjb250YWluZXJcblxuICAgICAgICB2YXIgaW5wdXRJbmRleDtcblxuICAgICAgICAvLyBpZiBpdCdzIHRoZSBjaGVja2JveC5cbiAgICAgICAgaWYgKCAkKHNsb3QpLmlzKCdbdHlwZT1cImNoZWNrYm94XCJdJykgKSB7XG4gICAgICAgICBcbiAgICAgICAgICAgICQoc2xvdClcbiAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsZmFsc2UpXG4gICAgICAgICAgICAgICAgLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1jaGVja2VkIGNjbC1oYXMtcG90ZW50aWFsJyk7XG5cbiAgICAgICAgICAgIC8vIGdldCBpbmRleCBvZiB0aGUgaW5wdXQgZnJvbSBzZWxlY3RlZCBzZXRcbiAgICAgICAgICAgIGlucHV0SW5kZXggPSB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKHNsb3QpO1xuICAgICAgICAgICAgXG4gICAgICAgIC8vIGlmIGl0J3MgdGhlIGNvbnRhaW5lclxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB2YXIgJGlucHV0ID0gJChzbG90KS5maW5kKCdbdHlwZT1cImNoZWNrYm94XCJdJyk7XG5cbiAgICAgICAgICAgICQoc2xvdCkucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1jaGVja2VkIGNjbC1oYXMtcG90ZW50aWFsJyk7XG4gICAgICAgICAgICAkaW5wdXQucHJvcCgnY2hlY2tlZCcsZmFsc2UpO1xuXG4gICAgICAgICAgICAvLyBnZXQgaW5kZXggb2YgdGhlIGlucHV0IGZyb20gc2VsZWN0ZWQgc2V0XG4gICAgICAgICAgICBpbnB1dEluZGV4ID0gdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZiggJGlucHV0WzBdICk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlbW92ZSBpbnB1dCBmcm9tIHNlbGVjdGVkIHNldFxuICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5zcGxpY2UoIGlucHV0SW5kZXgsIDEgKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuY2xlYXJBbGxTbG90cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIC8vIEV4dGVuZCB0aGUgc2VsZWN0ZWQgaW5wdXRzIGFycmF5IHRvIGEgbmV3IHZhcmlhYmxlLlxuICAgICAgICAvLyBUaGUgc2VsZWN0ZWQgaW5wdXRzIGFycmF5IGNoYW5nZXMgd2l0aCBldmVyeSBjbGVhclNsb3QoKSBjYWxsXG4gICAgICAgIC8vIHNvLCBiZXN0IHRvIGxvb3AgdGhyb3VnaCBhbiB1bmNoYW5naW5nIGFycmF5LlxuICAgICAgICB2YXIgc2VsZWN0ZWRJbnB1dHMgPSAkLmV4dGVuZCggW10sIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzICk7XG5cbiAgICAgICAgJChzZWxlY3RlZElucHV0cykuZWFjaChmdW5jdGlvbihpLGlucHV0KXtcbiAgICAgICAgICAgIHRoYXQuY2xlYXJTbG90KGlucHV0KTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmFjdGl2YXRlU2xvdCA9IGZ1bmN0aW9uKHNsb3QpIHtcbiAgICAgICAgLy8gc2xvdCBjYW4gYmUgZWl0aGVyIHRoZSBjaGVja2JveCAtT1ItIHRoZSBjaGVja2JveCdzIGNvbnRhaW5lclxuXG4gICAgICAgIHZhciBzbG90SXNDaGVja2JveCA9ICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSxcbiAgICAgICAgICAgICRjb250YWluZXIgPSBzbG90SXNDaGVja2JveCA/ICQoc2xvdCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpIDogJChzbG90KTtcblxuICAgICAgICAvLyBuZXZlciBzZXQgYW4gb2NjdXBpZWQgc2xvdCBhcyBhY3RpdmVcbiAgICAgICAgaWYgKCAkY29udGFpbmVyLmhhc0NsYXNzKCdjY2wtaXMtb2NjdXBpZWQnKSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggJChzbG90KS5pcygnW3R5cGU9XCJjaGVja2JveFwiXScpICkge1xuXG4gICAgICAgICAgICAvLyBpZiBpdCdzIHRoZSBjaGVja2JveC5cbiAgICAgICAgIFxuICAgICAgICAgICAgJChzbG90KS5wcm9wKCdjaGVja2VkJyx0cnVlKTtcbiAgICAgICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gaWYgaXQncyB0aGUgY29udGFpbmVyXG5cbiAgICAgICAgICAgICRjb250YWluZXJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJylcbiAgICAgICAgICAgICAgICAuZmluZCgnW3R5cGU9XCJjaGVja2JveFwiXScpXG4gICAgICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJyx0cnVlKTtcblxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5zZXRMb2FkaW5nID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dC50ZXh0KCdMb2FkaW5nIHNjaGVkdWxlLi4uJyk7XG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUudW5zZXRMb2FkaW5nID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5zZXRDdXJyZW50RHVyYXRpb25UZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9ICQuZXh0ZW5kKFtdLHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzKSxcbiAgICAgICAgICAgIHNvcnRlZFNlbGVjdGlvbiA9IHNlbGVjdGlvbi5zb3J0KGZ1bmN0aW9uKGEsYil7IFxuICAgICAgICAgICAgICAgIHJldHVybiBhLnZhbHVlID4gYi52YWx1ZTsgXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHNlbGVjdGlvbkxlbmd0aCA9IHNvcnRlZFNlbGVjdGlvbi5sZW5ndGg7XG4gICAgICAgIFxuICAgICAgICBpZiAoIHNlbGVjdGlvbkxlbmd0aCA+IDAgKSB7XG5cbiAgICAgICAgICAgIHZhciB0aW1lMVZhbCA9IHNvcnRlZFNlbGVjdGlvblswXS52YWx1ZSxcbiAgICAgICAgICAgICAgICByZWFkYWJsZVRpbWUxID0gdGhpcy5yZWFkYWJsZVRpbWUoIG5ldyBEYXRlKHRpbWUxVmFsKSApO1xuXG4gICAgICAgICAgICB2YXIgdGltZTJWYWwgPSAoIHNlbGVjdGlvbkxlbmd0aCA+PSAyICkgPyBzb3J0ZWRTZWxlY3Rpb25bc29ydGVkU2VsZWN0aW9uLmxlbmd0aCAtIDFdLnZhbHVlIDogdGltZTFWYWwsXG4gICAgICAgICAgICAgICAgdGltZTJUID0gbmV3IERhdGUodGltZTJWYWwpLmdldFRpbWUoKSArICggdGhpcy5zbG90TWludXRlcyAqIDYwICogMTAwMCApLFxuICAgICAgICAgICAgICAgIHJlYWRhYmxlVGltZTIgPSB0aGlzLnJlYWRhYmxlVGltZSggbmV3IERhdGUodGltZTJUKSApO1xuXG4gICAgICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoICdGcm9tICcgKyByZWFkYWJsZVRpbWUxICsgJyB0byAnICsgcmVhZGFibGVUaW1lMiApO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoJ1BsZWFzZSBzZWxlY3QgYXZhaWxhYmxlIHRpbWUgc2xvdHMnKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnNldE1heFRpbWVUZXh0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG1heE1pbnV0ZXMgPSB0aGlzLm1heFNsb3RzICogdGhpcy5zbG90TWludXRlcyxcbiAgICAgICAgICAgIG1heFRleHQ7XG5cbiAgICAgICAgc3dpdGNoKG1heE1pbnV0ZXMpIHtcbiAgICAgICAgICAgIGNhc2UgMjQwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTgwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTIwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjA6XG4gICAgICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgLyA2MCArICcgaG91cnMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyArICdtaW5zJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJG1heFRpbWUudGV4dCggbWF4VGV4dCApO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUucmVhZGFibGVUaW1lID0gZnVuY3Rpb24oIGRhdGVPYmosIGZvcm1hdCApIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBsb2NhbGVTdHJpbmcgPSBkYXRlT2JqLnRvTG9jYWxlU3RyaW5nKCB0aGlzLmxvY2FsZSwgdGhpcy50aW1lWm9uZSApLCAvLyBlLmcuIC0tPiBcIjExLzcvMjAxNywgNDozODozMyBBTVwiXG4gICAgICAgICAgICBsb2NhbGVUaW1lID0gbG9jYWxlU3RyaW5nLnNwbGl0KFwiLCBcIilbMV07IC8vIFwiNDozODozMyBBTVwiXG5cbiAgICAgICAgdmFyIHRpbWUgPSBsb2NhbGVUaW1lLnNwbGl0KCcgJylbMF0sIC8vIFwiNDozODozM1wiLFxuICAgICAgICAgICAgdGltZU9iaiA9IHtcbiAgICAgICAgICAgICAgICBhOiBsb2NhbGVUaW1lLnNwbGl0KCcgJylbMV0udG9Mb3dlckNhc2UoKSwgLy8gKGFtIG9yIHBtKSAtLT4gXCJhXCJcbiAgICAgICAgICAgICAgICBoOiB0aW1lLnNwbGl0KCc6JylbMF0sIC8vIFwiNFwiXG4gICAgICAgICAgICAgICAgbTogdGltZS5zcGxpdCgnOicpWzFdLCAvLyBcIjM4XCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgaWYgKCBmb3JtYXQgJiYgdHlwZW9mIGZvcm1hdCA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBmb3JtYXRBcnIgPSBmb3JtYXQuc3BsaXQoJycpLFxuICAgICAgICAgICAgICAgIHJlYWRhYmxlQXJyID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IGZvcm1hdEFyci5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHRpbWVPYmpbZm9ybWF0QXJyW2ldXSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVBcnIucHVzaCh0aW1lT2JqW2Zvcm1hdEFycltpXV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlQXJyLnB1c2goZm9ybWF0QXJyW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZWFkYWJsZUFyci5qb2luKCcnKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRpbWVPYmouaCArICc6JyArIHRpbWVPYmoubSArIHRpbWVPYmouYTtcbiAgICAgICAgXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblN1Ym1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcblxuICAgICAgICBpZiAoICEgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoICkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLiRmb3JtTm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgLmNzcygnZGlzcGxheScsJ25vbmUnKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnY2NsLWlzLWVycm9yJylcbiAgICAgICAgICAgICAgICAudGV4dCgnUGxlYXNlIHNlbGVjdCBhIHRpbWUgZm9yIHlvdXIgcmVzZXJ2YXRpb24nKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyh0aGlzLiRmb3JtQ29udGVudClcbiAgICAgICAgICAgICAgICAuc2xpZGVEb3duKENDTC5EVVJBVElPTik7ICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRmb3JtTm90aWZpY2F0aW9uLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgc29ydGVkU2VsZWN0aW9uID0gJC5leHRlbmQoW10sIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzKS5zb3J0KGZ1bmN0aW9uKGEsYil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEudmFsdWUgPiBiLnZhbHVlO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBzdGFydCA9IHNvcnRlZFNlbGVjdGlvblswXS52YWx1ZSxcbiAgICAgICAgICAgIGVuZCA9ICggc29ydGVkU2VsZWN0aW9uLmxlbmd0aCA+IDEgKSA/ICQoIHNvcnRlZFNlbGVjdGlvblsgc29ydGVkU2VsZWN0aW9uLmxlbmd0aCAtIDEgXSApLmRhdGEoJ3RvJykgOiAkKCBzb3J0ZWRTZWxlY3Rpb25bMF0gKS5kYXRhKCd0bycpLFxuICAgICAgICAgICAgcGF5bG9hZCA9IHtcbiAgICAgICAgICAgICAgICBcImlpZFwiOjMzMyxcbiAgICAgICAgICAgICAgICBcInN0YXJ0XCI6IHN0YXJ0LFxuICAgICAgICAgICAgICAgIFwiZm5hbWVcIjogdGhpcy4kZWxbMF0uZm5hbWUudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJsbmFtZVwiOiB0aGlzLiRlbFswXS5sbmFtZS52YWx1ZSxcbiAgICAgICAgICAgICAgICBcImVtYWlsXCI6IHRoaXMuJGVsWzBdLmVtYWlsLnZhbHVlLFxuICAgICAgICAgICAgICAgIFwibmlja25hbWVcIjogdGhpcy4kZWxbMF0ubmlja25hbWUudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJib29raW5nc1wiOltcbiAgICAgICAgICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5yb29tSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRvXCI6IGVuZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ29uIFN1Ym1pdCDCuyAnLCBwYXlsb2FkICk7XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1zdWJtaXR0aW5nJyk7XG4gICAgICAgIHRoaXMuJGZvcm1DYW5jZWwucHJvcCgnZGlzYWJsZWQnLHRydWUpO1xuICAgICAgICB0aGlzLiRmb3JtU3VibWl0LnRleHQoJ1NlbmRpbmcuLi4nKS5wcm9wKCdkaXNhYmxlZCcsdHJ1ZSk7XG5cbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBhY3Rpb246ICdyZXF1ZXN0X2Jvb2tpbmcnLFxuICAgICAgICAgICAgY2NsX25vbmNlOiBDQ0wubm9uY2UsXG4gICAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIE1ha2UgYSByZXF1ZXN0IGhlcmUgdG8gcmVzZXJ2ZSBzcGFjZVxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgJC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IENDTC5hamF4X3VybCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIF9oYW5kbGVTdWJtaXRSZXNwb25zZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zdWJtaXR0aW5nJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBfaGFuZGxlU3VibWl0UmVzcG9uc2UocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgdmFyIHJlc3BvbnNlSFRNTCxcbiAgICAgICAgICAgICAgICByZXNwb25zZU9iamVjdCA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuXG4gICAgICAgICAgICBpZiAoIHJlc3BvbnNlT2JqZWN0LmJvb2tpbmdfaWQgKSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MID0gIFsnPHAgY2xhc3M9XCJjY2wtaDIgY2NsLXUtbXQtMFwiPlN1Y2Nlc3MhPC9wPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cCBjbGFzcz1cImNjbC1oNFwiPllvdXIgYm9va2luZyBJRCBpcyA8c3BhbiBjbGFzcz1cImNjbC11LWNvbG9yLXNjaG9vbFwiPicgKyByZXNwb25zZU9iamVjdC5ib29raW5nX2lkICsgJzwvc3Bhbj48L3A+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxwIGNsYXNzPVwiY2NsLWg0XCI+UGxlYXNlIGNoZWNrIHlvdXIgZW1haWwgdG8gY29uZmlybSB5b3VyIGJvb2tpbmcuPC9wPiddO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwgPSAgWyc8cCBjbGFzcz1cImNjbC1oMyBjY2wtdS1tdC0wXCI+U29ycnksIGJ1dCB3ZSBjb3VsZG5cXCd0IHByb2Nlc3MgeW91ciByZXNlcnZhdGlvbi48L3A+JywnPHAgY2xhc3M9XCJjY2wtaDRcIj5FcnJvcnM6PC9wPiddO1xuICAgICAgICAgICAgICAgICQocmVzcG9uc2VPYmplY3QuZXJyb3JzKS5lYWNoKGZ1bmN0aW9uKGksIGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MLnB1c2goJzxwIGNsYXNzPVwiY2NsLWMtYWxlcnQgY2NsLWlzLWVycm9yXCI+JyArIGVycm9yICsgJzwvcD4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwucHVzaCgnPHAgY2xhc3M9XCJjY2wtaDRcIj5QbGVhc2UgdGFsayB0byB5b3VyIG5lYXJlc3QgbGlicmFyaWFuIGZvciBoZWxwLjwvcD4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhhdC4kZm9ybUNhbmNlbC5wcm9wKCdkaXNhYmxlZCcsZmFsc2UpLnRleHQoJ0Nsb3NlJyk7XG4gICAgICAgICAgICB0aGF0LiRmb3JtU3VibWl0LnJlbW92ZSgpO1xuICAgICAgICAgICAgdGhhdC4kZm9ybUNvbnRlbnQuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIENDTC5EVVJBVElPTik7XG4gICAgICAgICAgICB0aGF0LiRmb3JtUmVzcG9uc2VcbiAgICAgICAgICAgICAgICAuZGVsYXkoQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5hbmltYXRlKHtvcGFjaXR5OiAxfSwgQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5odG1sKHJlc3BvbnNlSFRNTCk7XG4gICAgICAgICAgICB0aGF0LiRmb3JtQ29udGVudFxuICAgICAgICAgICAgICAgIC5kZWxheShDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAgICAgLmFuaW1hdGUoe2hlaWdodDogdGhhdC4kZm9ybVJlc3BvbnNlLmhlaWdodCgpICsgJ3B4JyB9LCBDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAgICAgLmNzcyh7ekluZGV4OiAnLTEnfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAvLyBIZWxwZXJzXG5cbiAgICBmdW5jdGlvbiBfc29ydEJ5S2V5KCBhcnIsIGtleSwgb3JkZXIgKSB7XG4gICAgICAgIGZ1bmN0aW9uIHNvcnRBU0MoYSxiKSB7XG4gICAgICAgICAgICBpZiAoYVtrZXldIDwgYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYVtrZXldID4gYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNvcnRERVNDKGEsYikge1xuICAgICAgICAgICAgaWYgKGFba2V5XSA+IGJba2V5XSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFba2V5XSA8IGJba2V5XSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoICdERVNDJyA9PT0gb3JkZXIgKSB7XG4gICAgICAgICAgICBhcnIuc29ydChzb3J0REVTQyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcnIuc29ydChzb3J0QVNDKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1yb29tLXJlcy1mb3JtJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFJvb21SZXNGb3JtKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU21vb3RoIFNjcm9sbGluZ1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXG4gICAgICAgICQoJy5qcy1zbW9vdGgtc2Nyb2xsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcykuZGF0YSgndGFyZ2V0JykgfHwgJCh0aGlzKS5hdHRyKCdocmVmJyksXG4gICAgICAgICAgICAgICAgJHRhcmdldCA9ICQodGFyZ2V0KSxcbiAgICAgICAgICAgICAgICBzY3JvbGxPZmZzZXQgPSAwO1xuXG4gICAgICAgICAgICAkKCcuY2NsLWlzLWZpeGVkJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHNjcm9sbE9mZnNldCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCAkdGFyZ2V0Lmxlbmd0aCApIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VG9wID0gJHRhcmdldC5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoIHsgJ3Njcm9sbFRvcCc6IHRhcmdldFRvcCAtIHNjcm9sbE9mZnNldCB9LCA4MDAgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBTdGlja2llc1xuICogXG4gKiBCZWhhdmlvdXIgZm9yIHN0aWNreSBlbGVtZW50cy5cbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgICR3aW5kb3cgPSAkKHdpbmRvdyksXG4gICAgICAgIGNsYXNzTmFtZSA9IHtcbiAgICAgICAgICAgIGlzRml4ZWQ6ICdjY2wtaXMtZml4ZWQnXG4gICAgICAgIH07XG5cbiAgICB2YXIgU3RpY2t5ID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIC8vIHZhcmlhYmxlc1xuICAgICAgICB2YXIgJGVsID0gJChlbCksXG4gICAgICAgICAgICBoZWlnaHQgPSAkZWwub3V0ZXJIZWlnaHQoKSxcbiAgICAgICAgICAgIG9mZnNldCA9ICRlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgIG9wdGlvbnMgPSAkZWwuZGF0YSgnc3RpY2t5JyksXG4gICAgICAgICAgICB3cmFwcGVyID0gJCgnPGRpdiBjbGFzcz1cImpzLXN0aWNreS13cmFwcGVyXCI+PC9kaXY+JykuY3NzKHsgaGVpZ2h0OiBoZWlnaHQgKyAncHgnIH0pO1xuXG4gICAgICAgIHZhciBkZWZhdWx0T3B0aW9ucyA9IHtcbiAgICAgICAgICAgIG9mZnNldDogMFxuICAgICAgICB9O1xuXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCggZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMgKTtcblxuICAgICAgICAvLyB3cmFwIGVsZW1lbnRcbiAgICAgICAgJGVsLndyYXAoIHdyYXBwZXIgKTtcblxuICAgICAgICAvLyBzY3JvbGwgbGlzdGVuZXJcbiAgICAgICAgJHdpbmRvdy5zY3JvbGwoIENDTC50aHJvdHRsZSggX29uU2Nyb2xsLCAxMDAgKSApO1xuXG4gICAgICAgIC8vIG9uIHNjcm9sbFxuICAgICAgICBmdW5jdGlvbiBfb25TY3JvbGwoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpICsgb3B0aW9ucy5vZmZzZXQ7XG4gICAgXG4gICAgICAgICAgICBpZiAoIHNjcm9sbFRvcCA+PSBvZmZzZXQudG9wICkge1xuICAgICAgICAgICAgICAgICRlbC5hZGRDbGFzcyggY2xhc3NOYW1lLmlzRml4ZWQgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJGVsLnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuaXNGaXhlZCApO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmpzLWlzLXN0aWNreScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBTdGlja3kodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBUb2dnbGUgU2Nob29sc1xuICogXG4gKiBCZWhhdmlvciBmb3Igc2Nob29sIHRvZ2dsZXNcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgaW5pdFNjaG9vbCA9ICQoJ2h0bWwnKS5kYXRhKCdzY2hvb2wnKTtcblxuICAgIHZhciBTY2hvb2xTZWxlY3QgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRzZWxlY3QgPSAkKGVsKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBTY2hvb2xTZWxlY3QucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgaWYgKCBpbml0U2Nob29sICkge1xuXG4gICAgICAgICAgICB0aGlzLiRzZWxlY3RcbiAgICAgICAgICAgICAgICAuZmluZCggJ29wdGlvblt2YWx1ZT1cIicgKyBpbml0U2Nob29sICsgJ1wiXScgKVxuICAgICAgICAgICAgICAgIC5hdHRyKCAnc2VsZWN0ZWQnLCAnc2VsZWN0ZWQnICk7ICAgXG5cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJHNlbGVjdC5jaGFuZ2UoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgJCgnaHRtbCcpLmF0dHIoICAnZGF0YS1zY2hvb2wnLCBldmVudC50YXJnZXQudmFsdWUgKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInNjaG9vbFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBTY2hvb2xTZWxlY3QodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICogVG9vbHRpcHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIHRvb2x0aXBzXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBUb29sdGlwID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLmNvbnRlbnQgPSB0aGlzLiRlbC5hdHRyKCd0aXRsZScpO1xuICAgICAgICB0aGlzLiR0b29sdGlwID0gJCgnPGRpdiBpZD1cImNjbC1jdXJyZW50LXRvb2x0aXBcIiBjbGFzcz1cImNjbC1jLXRvb2x0aXAgY2NsLWlzLXRvcFwiIHJvbGU9XCJ0b29sdGlwXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNjbC1jLXRvb2x0aXBfX2Fycm93XCI+PC9kaXY+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNjbC1jLXRvb2x0aXBfX2lubmVyXCI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50ICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIFRvb2x0aXAucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbC5ob3ZlcihmdW5jdGlvbihlKXtcblxuICAgICAgICAgICAgLy8gbW91c2VvdmVyXG5cbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCd0aXRsZScsICcnKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgJ2NjbC1jdXJyZW50LXRvb2x0aXAnKTtcbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuXG4gICAgICAgICAgICBDQ0wucmVmbG93KF90aGlzLiR0b29sdGlwWzBdKTtcblxuICAgICAgICAgICAgdmFyIG9mZnNldCA9IF90aGlzLiRlbC5vZmZzZXQoKSxcbiAgICAgICAgICAgICAgICB3aWR0aCAgPSBfdGhpcy4kZWwub3V0ZXJXaWR0aCgpLFxuICAgICAgICAgICAgICAgIHRvb2x0aXBIZWlnaHQgPSBfdGhpcy4kdG9vbHRpcC5vdXRlckhlaWdodCgpO1xuXG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5jc3Moe1xuICAgICAgICAgICAgICAgIHRvcDogKG9mZnNldC50b3AgLSB0b29sdGlwSGVpZ2h0KSArICdweCcsXG4gICAgICAgICAgICAgICAgbGVmdDogKG9mZnNldC5sZWZ0ICsgKHdpZHRoLzIpKSArICdweCdcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5hZGRDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgfSwgZnVuY3Rpb24oZSl7IFxuXG4gICAgICAgICAgICAvL21vdXNlb3V0XG5cbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCd0aXRsZScsIF90aGlzLmNvbnRlbnQpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCAnJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5yZW1vdmVDbGFzcygnY2NsLWlzLXNob3duJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5yZW1vdmUoKTtcblxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJ0b29sdGlwXCJdJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFRvb2x0aXAodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBXYXlmaW5kaW5nXG4gKiBcbiAqIENvbnRyb2xzIGludGVyZmFjZSBmb3IgbG9va2luZyB1cCBjYWxsIG51bWJlciBsb2NhdGlvbnNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIHRhYnMsIHdheWZpbmRlcjtcbiAgICBcbiAgICB2YXIgVGFicyA9IGZ1bmN0aW9uKGVsKSB7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiR0YWJzID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXRhYicpO1xuICAgICAgICB0aGlzLiR0YWJDb250ZW50cyA9ICQoJy5jY2wtYy10YWJfX2NvbnRlbnQnKTtcbiAgICAgICAgXG5cbiAgICAgICAgdGhpcy4kdGFicy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgJHRhYiA9ICQodGhpcyk7XG4gICAgICAgICAgICAkdGFiLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0ID0gJHRhYi5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgICAgICAgICAvLyBfdGhpcy4kdGFiQ29udGVudHMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAvLyBfdGhpcy4kdGFiQ29udGVudHMuZmlsdGVyKHRhcmdldCkuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zZXRBY3RpdmUodGFyZ2V0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgVGFicy5wcm90b3R5cGUuc2V0QWN0aXZlID0gZnVuY3Rpb24odGFyZ2V0KXtcbiAgICAgICAgdGhpcy4kdGFicy5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiR0YWJzLmZpbHRlcignW2hyZWY9XCInK3RhcmdldCsnXCJdJykuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMuZmlsdGVyKHRhcmdldCkuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICB9O1xuXG4gICAgdmFyIFdheWZpbmRlciA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5jYWxsTnVtYmVycyA9IHt9O1xuICAgICAgICB0aGlzLiRmb3JtID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtYmVyLXNlYXJjaCcpO1xuICAgICAgICB0aGlzLiRpbnB1dCA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bS1pbnB1dCcpO1xuICAgICAgICB0aGlzLiRzdWJtaXQgPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW0tc3VibWl0Jyk7XG4gICAgICAgIHRoaXMuJG1hcnF1ZWUgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19tYXJxdWVlJyk7XG4gICAgICAgIHRoaXMuJGNhbGxOdW0gPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19jYWxsLW51bScpO1xuICAgICAgICB0aGlzLiR3aW5nID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fd2luZycpO1xuICAgICAgICB0aGlzLiRmbG9vciA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX2Zsb29yJyk7XG4gICAgICAgIHRoaXMuJHN1YmplY3QgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19zdWJqZWN0Jyk7XG4gICAgICAgIHRoaXMuZXJyb3IgPSB7XG4gICAgICAgICAgICBnZXQ6ICc8ZGl2IGNsYXNzPVwiY2NsLWMtYWxlcnQgY2NsLWlzLWVycm9yIGNjbC13YXlmaW5kZXJfX2Vycm9yXCI+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjY2wtYi1jbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+PC9idXR0b24+PGkgY2xhc3M9XCJjY2wtYi1pY29uIGFsZXJ0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBUaGVyZSB3YXMgYW4gZXJyb3IgZmV0Y2hpbmcgY2FsbCBudW1iZXJzLjwvZGl2PicsXG4gICAgICAgICAgICBmaW5kOiAnPGRpdiBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvciBjY2wtd2F5ZmluZGVyX19lcnJvclwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2NsLWItY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPjxpIGNsYXNzPVwiY2NsLWItaWNvbiBhbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gQ291bGQgbm90IGZpbmQgdGhhdCBjYWxsIG51bWJlci4gUGxlYXNlIHRyeSBhZ2Fpbi48L2Rpdj4nXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuJGVycm9yQm94ID0gJCgnLmNjbC1lcnJvci1ib3gnKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICQuZ2V0SlNPTiggQ0NMLmFzc2V0cyArICdqcy9jYWxsLW51bWJlcnMuanNvbicgKVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2FsbE51bWJlcnMgPSBkYXRhO1xuICAgICAgICAgICAgICAgIF90aGlzLmluaXQoKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgdGhpcy4kZXJyb3JCb3guYXBwZW5kKCB0aGlzLmVycm9yLmdldCApO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnY2NsLWFwcC1hY3RpdmUnKTtcblxuICAgICAgICB0aGlzLiRpbnB1dFxuICAgICAgICAgICAgLmtleXVwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcXVlcnkgPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmICggcXVlcnkgPT09IFwiXCIgKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRzdWJtaXQuYXR0cignZGlzYWJsZWQnLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZXNldCgpOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3VibWl0LmF0dHIoJ2Rpc2FibGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kZm9ybS5zdWJtaXQoZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIHZhciBxdWVyeSA9IF90aGlzLiRpbnB1dC52YWwoKTtcblxuICAgICAgICAgICAgJCgnLmNjbC13YXlmaW5kZXJfX2Vycm9yJykucmVtb3ZlKCk7XG4gICAgICAgICAgICBfdGhpcy4kbWFycXVlZS5zaG93KCk7XG4gICAgICAgICAgICBfdGhpcy4kY2FsbE51bS50ZXh0KHF1ZXJ5KTtcbiAgICAgICAgICAgIF90aGlzLmZpbmRSb29tKCBxdWVyeSApO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmdldENhbGxLZXkgPSBmdW5jdGlvbihjYWxsTnVtKSB7XG4gICAgICAgIHZhciBrZXksXG4gICAgICAgICAgICBjYWxsS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY2FsbE51bWJlcnMpO1xuXG4gICAgICAgIGlmICggY2FsbEtleXMubGVuZ3RoID09PSAwICl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsS2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGspe1xuICAgICAgICAgIGlmICggY2FsbE51bSA+PSBrICkge1xuICAgICAgICAgICAga2V5ID0gaztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBrZXk7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUuZmluZFJvb20gPSBmdW5jdGlvbihxdWVyeSkge1xuXG4gICAgICAgIHF1ZXJ5ID0gcXVlcnkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBjYWxsS2V5ID0gdGhpcy5nZXRDYWxsS2V5KHF1ZXJ5KSxcbiAgICAgICAgICAgIGNhbGxEYXRhID0ge30sXG4gICAgICAgICAgICByb29tO1xuXG4gICAgICAgIGlmICggISBjYWxsS2V5ICkge1xuICAgICAgICAgICAgdGhpcy50aHJvd0ZpbmRFcnJvcigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQoJy5jY2wtYy1zZWFyY2gnKS5vZmZzZXQoKS50b3AgfSk7XG4gICAgICAgIFxuICAgICAgICBjYWxsRGF0YSA9IHRoaXMuY2FsbE51bWJlcnNbY2FsbEtleV07XG5cbiAgICAgICAgdGhpcy4kZmxvb3IudGV4dCggY2FsbERhdGEuZmxvb3IgKTtcbiAgICAgICAgdGhpcy4kd2luZy50ZXh0KCBjYWxsRGF0YS53aW5nICk7XG4gICAgICAgIHRoaXMuJHN1YmplY3QudGV4dCggY2FsbERhdGEuc3ViamVjdCApO1xuXG4gICAgICAgIC8qIFRPRE86XG4gICAgICAgICAqIHNldCBBQ1RVQUwgcm9vbSwgbm90IGp1c3QgdGhlIGZsb29yLiBzdGlsbCB3YWl0aW5nIG9uIGNsaWVudCBcbiAgICAgICAgICogdG8gcHJvdmlkZSBkYXRhIGZvciB3aGljaCBjYWxsIG51bWJlcnMgYmVsb25nIHRvIHdoaWNoIHJvb21zXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiAgICAgICAgcm9vbSA9IGNhbGxEYXRhLmZsb29yX2ludDtcblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJ2FbaHJlZj1cIiNmbG9vci0nK3Jvb20rJ1wiXScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJyNyb29tLScrcm9vbSsnLTEnKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuXG4gICAgICAgIHRhYnMuc2V0QWN0aXZlKCAnI2Zsb29yLScgKyByb29tICk7XG4gICAgICAgIFxuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJ2FbaHJlZio9XCIjZmxvb3ItXCJdJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLmNjbC1jLWZsb29yX19yb29tJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS50aHJvd0ZpbmRFcnJvciA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJ2FbaHJlZio9XCIjZmxvb3ItXCJdJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnLmNjbC1jLWZsb29yX19yb29tJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kZmxvb3IudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kd2luZy50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiRzdWJqZWN0LnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJGVycm9yQm94LmFwcGVuZCggdGhpcy5lcnJvci5maW5kICk7XG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5jY2wtanMtdGFicycpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRhYnMgPSBuZXcgVGFicyh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5jY2wtanMtd2F5ZmluZGVyJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgd2F5ZmluZGVyID0gbmV3IFdheWZpbmRlcih0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iXX0=
