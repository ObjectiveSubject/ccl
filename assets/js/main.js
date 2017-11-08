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

        this.init();
    };

    HeaderMenuToggle.prototype.init = function(){
        
        var that = this;

        this.$el.click(function(event){
            event.preventDefault();
            that.$target.fadeToggle();    
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkcm9wZG93bnMuanMiLCJoZWFkZXItbWVudS10b2dnbGVzLmpzIiwibW9kYWxzLmpzIiwicm9vbS1yZXMuanMiLCJzdGlja2llcy5qcyIsInRvZ2dsZS1zY2hvb2xzLmpzIiwidG9vbHRpcHMuanMiLCJ3YXlmaW5kaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbDBCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBHbG9iYWwgVmFyaWFibGVzLiBcbiAqL1xuXG5cbihmdW5jdGlvbiAoICQsIHdpbmRvdyApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuICAgIFxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLkRVUkFUSU9OID0gMzAwO1xuXG4gICAgQ0NMLkJSRUFLUE9JTlRfU00gPSA1MDA7XG4gICAgQ0NMLkJSRUFLUE9JTlRfTUQgPSA3Njg7XG4gICAgQ0NMLkJSRUFLUE9JTlRfTEcgPSAxMDAwO1xuICAgIENDTC5CUkVBS1BPSU5UX1hMID0gMTUwMDtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ2h0bWwnKS50b2dnbGVDbGFzcygnbm8tanMganMnKTtcbiAgICB9KTtcblxufSkoalF1ZXJ5LCB0aGlzKTsiLCIvKipcbiAqIFJlZmxvdyBwYWdlIGVsZW1lbnRzLiBcbiAqIFxuICogRW5hYmxlcyBhbmltYXRpb25zL3RyYW5zaXRpb25zIG9uIGVsZW1lbnRzIGFkZGVkIHRvIHRoZSBwYWdlIGFmdGVyIHRoZSBET00gaGFzIGxvYWRlZC5cbiAqL1xuXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5yZWZsb3cgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgfTtcblxufSkoKTsiLCIvKipcbiAqIEdldCB0aGUgU2Nyb2xsYmFyIHdpZHRoXG4gKiBUaGFua3MgdG8gZGF2aWQgd2Fsc2g6IGh0dHBzOi8vZGF2aWR3YWxzaC5uYW1lL2RldGVjdC1zY3JvbGxiYXItd2lkdGhcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcbiAgICBcbiAgICBmdW5jdGlvbiBnZXRTY3JvbGxXaWR0aCgpIHtcbiAgICAgICAgXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWVhc3VyZW1lbnQgbm9kZVxuICAgICAgICB2YXIgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgXG4gICAgICAgIC8vIHBvc2l0aW9uIHdheSB0aGUgaGVsbCBvZmYgc2NyZWVuXG4gICAgICAgICQoc2Nyb2xsRGl2KS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6ICcxMDBweCcsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDBweCcsXG4gICAgICAgICAgICBvdmVyZmxvdzogJ3Njcm9sbCcsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogJy05OTk5cHgnLFxuICAgICAgICB9KTtcblxuICAgICAgICAkKCdib2R5JykuYXBwZW5kKHNjcm9sbERpdik7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBzY3JvbGxiYXIgd2lkdGhcbiAgICAgICAgdmFyIHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoO1xuICAgICAgICAvLyBjb25zb2xlLndhcm4oc2Nyb2xsYmFyV2lkdGgpOyAvLyBNYWM6ICAxNVxuXG4gICAgICAgIC8vIERlbGV0ZSB0aGUgRElWIFxuICAgICAgICAkKHNjcm9sbERpdikucmVtb3ZlKCk7XG5cbiAgICAgICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoO1xuICAgIH1cbiAgICBcbiAgICBpZiAoICEgd2luZG93LkNDTCApIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5nZXRTY3JvbGxXaWR0aCA9IGdldFNjcm9sbFdpZHRoO1xuICAgIENDTC5TQ1JPTExCQVJXSURUSCA9IGdldFNjcm9sbFdpZHRoKCk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIC5kZWJvdW5jZSgpIGZ1bmN0aW9uXG4gKiBcbiAqIFNvdXJjZTogaHR0cHM6Ly9kYXZpZHdhbHNoLm5hbWUvamF2YXNjcmlwdC1kZWJvdW5jZS1mdW5jdGlvblxuICovXG5cblxuKGZ1bmN0aW9uKHdpbmRvdykge1xuXG4gICAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gICAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gICAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAgIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gICAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4gICAgdmFyIHRocm90dGxlID0gZnVuY3Rpb24gKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHRpbWVvdXQsIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICAgICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICAgICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG5cbiAgICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHRocm90dGxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICAgICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICAgICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICAgICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHRocm90dGxlZC5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICBwcmV2aW91cyA9IDA7XG4gICAgICAgICAgICB0aW1lb3V0ID0gY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB0aHJvdHRsZWQ7XG4gICAgfTtcblxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgd2luZG93LkNDTC50aHJvdHRsZSA9IHRocm90dGxlO1xuXG59KSh0aGlzKTsiLCIvKipcbiAqIEFjY29yZGlvbnNcbiAqIFxuICogQmVoYXZpb3IgZm9yIGFjY29yZGlvbiBjb21wb25lbnRzXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBBY2NvcmRpb24gPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHRvZ2dsZSA9IHRoaXMuJGVsLmNoaWxkcmVuKCcuY2NsLWMtYWNjb3JkaW9uX190b2dnbGUnKTtcbiAgICAgICAgdGhpcy4kY29udGVudCA9IHRoaXMuJGVsLmNoaWxkcmVuKCcuY2NsLWMtYWNjb3JkaW9uX19jb250ZW50Jyk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBBY2NvcmRpb24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHRvZ2dsZS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLiRjb250ZW50LnNsaWRlVG9nZ2xlKCk7XG4gICAgICAgICAgICBfdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ2NjbC1pcy1vcGVuJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5jY2wtYy1hY2NvcmRpb24nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgQWNjb3JkaW9uKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogQWxlcnRzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBhbGVydHNcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgRFVSQVRJT04gPSBDQ0wuRFVSQVRJT047XG5cbiAgICB2YXIgQWxlcnREaXNtaXNzID0gZnVuY3Rpb24oJGVsKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJGVsO1xuICAgICAgICB0aGlzLnRhcmdldCA9ICRlbC5wYXJlbnQoKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgQWxlcnREaXNtaXNzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICBfdGhpcy4kdGFyZ2V0LmFuaW1hdGUoIHsgb3BhY2l0eTogMCB9LCB7XG4gICAgICAgICAgICBkdXJhdGlvbjogRFVSQVRJT04sXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LnNsaWRlVXAoIERVUkFUSU9OLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cblxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJChkb2N1bWVudCkub24oICdjbGljaycsICdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIHZhciBkaXNtaXNzRWwgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nKTtcbiAgICAgICAgICAgIG5ldyBBbGVydERpc21pc3MoZGlzbWlzc0VsKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKHRoaXMsIGpRdWVyeSk7IiwiLyoqXG4gKiBDYXJvdXNlbHNcbiAqIFxuICogSW5pdGlhbGl6ZSBhbmQgZGVmaW5lIGJlaGF2aW9yIGZvciBjYXJvdXNlbHMuIFxuICogVXNlcyB0aGUgU2xpY2sgU2xpZGVzIGpRdWVyeSBwbHVnaW4gLS0+IGh0dHA6Ly9rZW53aGVlbGVyLmdpdGh1Yi5pby9zbGljay9cbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIENhcm91c2VsID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuZ2xvYmFsRGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgIGRvdHNDbGFzczogJ2NjbC1jLWNhcm91c2VsX19wYWdpbmcnLFxuICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfTtcblxuICAgIENhcm91c2VsLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy4kZWwuZGF0YSgpLFxuICAgICAgICAgICAgb3B0aW9ucyA9IGRhdGEub3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIFxuICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUgPSBbXTtcblxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc1NtICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX1NNLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zU21cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zTWQgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfTUQsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNNZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNMZyApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9MRywgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc0xnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc1hsICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX1hMLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zWGxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKCB0aGlzLmdsb2JhbERlZmF1bHRzLCBvcHRpb25zICk7XG5cbiAgICAgICAgdmFyIGNhcm91c2VsID0gdGhpcy4kZWwuc2xpY2sob3B0aW9ucyksXG4gICAgICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgY2Fyb3VzZWwub24oJ2JlZm9yZUNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlLCBuZXh0U2xpZGUpe1xuICAgICAgICAgICAgX3RoaXMuJGVsLmZpbmQoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtcGFzdCcpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLmZpbmQoJy5zbGljay1zbGlkZVtkYXRhLXNsaWNrLWluZGV4PVwiJytuZXh0U2xpZGUrJ1wiXScpLnByZXZBbGwoKS5hZGRDbGFzcygnY2NsLWlzLXBhc3QnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1wcm9tby1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBDYXJvdXNlbCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIERyb3Bkb3duc1xuICogXG4gKiBJbml0aWFsaXplIGFuZCBjb250cm9sIGJlaGF2aW9yIGZvciBkcm9wZG93biBtZW51c1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICBUT0dHTEU6ICdbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXScsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZSA9IHtcbiAgICAgICAgICAgIEFDVElWRTogJ2NjbC1pcy1hY3RpdmUnLFxuICAgICAgICAgICAgTUVOVTogJ2NjbC1jLWRyb3Bkb3duX19tZW51J1xuICAgICAgICB9O1xuXG4gICAgdmFyIERyb3Bkb3duVG9nZ2xlID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiR0b2dnbGUgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kcGFyZW50ID0gdGhpcy4kdG9nZ2xlLnBhcmVudCgpO1xuICAgICAgICBcbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuJHRvZ2dsZS5kYXRhKCd0YXJnZXQnKTtcblxuICAgICAgICB0aGlzLiRtZW51ID0gJCggdGFyZ2V0ICk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kdG9nZ2xlLmNsaWNrKCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBfdGhpcy50b2dnbGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIHZhciBoYXNBY3RpdmVNZW51cyA9ICQoICcuJyArIGNsYXNzTmFtZS5NRU5VICsgJy4nICsgY2xhc3NOYW1lLkFDVElWRSApLmxlbmd0aDtcbiAgICAgICAgICAgIGlmICggaGFzQWN0aXZlTWVudXMgKXtcbiAgICAgICAgICAgICAgICBfY2xlYXJNZW51cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgaXNBY3RpdmUgPSB0aGlzLiR0b2dnbGUuaGFzQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcblxuICAgICAgICBpZiAoIGlzQWN0aXZlICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93TWVudSgpO1xuXG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5zaG93TWVudSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgdGhpcy4kbWVudS5hZGRDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICB0aGlzLiRwYXJlbnQuYWRkQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLmhpZGVNZW51ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgdGhpcy4kbWVudS5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICB0aGlzLiRwYXJlbnQucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX2NsZWFyTWVudXMoKSB7XG4gICAgICAgICQoJy5jY2wtYy1kcm9wZG93biwgLmNjbC1jLWRyb3Bkb3duX19tZW51JykucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgJCggc2VsZWN0b3IuVE9HR0xFICkuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoIHNlbGVjdG9yLlRPR0dMRSApLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBEcm9wZG93blRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIEhlYWRlciBNZW51IFRvZ2dsZXNcbiAqIFxuICogQ29udHJvbHMgYmVoYXZpb3Igb2YgbWVudSB0b2dnbGVzIGluIHRoZSBoZWFkZXJcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIEhlYWRlck1lbnVUb2dnbGUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLnRhcmdldCA9IHRoaXMuJGVsLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgSGVhZGVyTWVudVRvZ2dsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoYXQuJHRhcmdldC5mYWRlVG9nZ2xlKCk7ICAgIFxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtdG9nZ2xlLWhlYWRlci1tZW51JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IEhlYWRlck1lbnVUb2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBNb2RhbHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIG1vZGFscy4gQmFzZWQgb24gQm9vdHN0cmFwJ3MgbW9kYWxzOiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy80LjAvY29tcG9uZW50cy9tb2RhbC9cbiAqIFxuICogR2xvYmFsczpcbiAqIFNDUk9MTEJBUldJRFRIXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIERVUkFUSU9OID0gMzAwO1xuXG4gICAgdmFyIE1vZGFsVG9nZ2xlID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSAkZWwuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgIHRoaXMuJHRhcmdldCA9ICQodGhpcy50YXJnZXQpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzOyBcblxuICAgICAgICBfdGhpcy4kZWwub24oICdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAoICQoZG9jdW1lbnQuYm9keSkuaGFzQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJykgKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2xvc2VNb2RhbCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93QmFja2Ryb3AoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2hvd01vZGFsKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5zaG93QmFja2Ryb3AgPSBmdW5jdGlvbihjYWxsYmFjayl7XG5cbiAgICAgICAgdmFyIGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHZhciAkYmFja2Ryb3AgPSAkKGJhY2tkcm9wKTtcblxuICAgICAgICAkYmFja2Ryb3AuYWRkQ2xhc3MoJ2NjbC1jLW1vZGFsX19iYWNrZHJvcCcpO1xuICAgICAgICAkYmFja2Ryb3AuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG4gICAgICAgIFxuICAgICAgICBDQ0wucmVmbG93KGJhY2tkcm9wKTtcbiAgICAgICAgXG4gICAgICAgICRiYWNrZHJvcC5hZGRDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgJChkb2N1bWVudC5ib2R5KVxuICAgICAgICAgICAgLmFkZENsYXNzKCdjY2wtbW9kYWwtb3BlbicpXG4gICAgICAgICAgICAuY3NzKCAncGFkZGluZy1yaWdodCcsIENDTC5TQ1JPTExCQVJXSURUSCApO1xuXG4gICAgICAgIGlmICggY2FsbGJhY2sgKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCBjYWxsYmFjaywgRFVSQVRJT04gKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuc2hvd01vZGFsID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgX3RoaXMuJHRhcmdldC5zaG93KCAwLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5hZGRDbGFzcygnY2NsLWlzLXNob3duJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgJCgnLmNjbC1jLW1vZGFsJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbCcpLmhpZGUoKTtcblxuICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsX19iYWNrZHJvcCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsX19iYWNrZHJvcCcpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJylcbiAgICAgICAgICAgICAgICAgICAgLmNzcyggJ3BhZGRpbmctcmlnaHQnLCAnJyApO1xuXG4gICAgICAgICAgICB9LCBEVVJBVElPTik7XG5cbiAgICAgICAgfSwgRFVSQVRJT04gKTsgXG5cbiAgICB9O1xuXG5cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IE1vZGFsVG9nZ2xlKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIFJvb20gUmVzZXJ2YXRpb25cbiAqIFxuICogSGFuZGxlIHJvb20gcmVzZXJ2YXRpb25zXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIFJvb21SZXNGb3JtID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kZm9ybUNvbnRlbnQgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1jb250ZW50JykuY3NzKHtwb3NpdGlvbjoncmVsYXRpdmUnfSk7XG4gICAgICAgIHRoaXMuJGZvcm1SZXNwb25zZSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLXJlc3BvbnNlJykuY3NzKHtwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnMXJlbScsIGxlZnQ6ICcxcmVtJywgb3BhY2l0eTogMH0pO1xuICAgICAgICB0aGlzLiRmb3JtQ2FuY2VsID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tY2FuY2VsJyk7XG4gICAgICAgIHRoaXMuJGZvcm1TdWJtaXQgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1zdWJtaXQnKTtcbiAgICAgICAgdGhpcy5yb29tSWQgPSB0aGlzLiRlbC5kYXRhKCdyZXNvdXJjZS1pZCcpO1xuICAgICAgICB0aGlzLiRkYXRlU2VsZWN0ID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tZGF0ZS1zZWxlY3QnKTtcbiAgICAgICAgdGhpcy5kYXRlWW1kID0gdGhpcy4kZGF0ZVNlbGVjdC52YWwoKTtcbiAgICAgICAgdGhpcy4kcm9vbVNjaGVkdWxlID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tc2NoZWR1bGUnKTtcbiAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1jdXJyZW50LWR1cmF0aW9uJyk7XG4gICAgICAgIHRoaXMuJGZvcm1Ob3RpZmljYXRpb24gPSAkKCc8cCBjbGFzcz1cImNjbC1jLWFsZXJ0XCI+PC9wPicpO1xuICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0biA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yZXNldC1zZWxlY3Rpb24nKTsgXG4gICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbXTtcbiAgICAgICAgdGhpcy5tYXhTbG90cyA9IDQ7XG4gICAgICAgIHRoaXMuJG1heFRpbWUgPSB0aGlzLiRlbC5maW5kKCcuanMtbWF4LXRpbWUnKTtcbiAgICAgICAgdGhpcy5zbG90TWludXRlcyA9IDMwO1xuICAgICAgICB0aGlzLmxvY2FsZSA9IFwiZW4tVVNcIjtcbiAgICAgICAgdGhpcy50aW1lWm9uZSA9IHt0aW1lWm9uZTogXCJBbWVyaWNhL0xvc19BbmdlbGVzXCJ9O1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB0aGlzLnNldExvYWRpbmcoKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNjaGVkdWxlRGF0YSgpO1xuXG4gICAgICAgIHRoaXMuc2V0TWF4VGltZVRleHQoKTtcblxuICAgICAgICB0aGlzLmluaXREYXRlRXZlbnRzKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXRGb3JtRXZlbnRzKCk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5nZXRTcGFjZUF2YWlsYWJpbGl0eSA9IGZ1bmN0aW9uKFltZCl7XG5cblx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdGFjdGlvbjogJ2dldF9yb29tX2luZm8nLFxuXHRcdFx0Y2NsX25vbmNlOiBDQ0wubm9uY2UsXG5cdFx0XHRhdmFpbGFiaWxpdHk6IFltZCB8fCAnJywgLy8gZS5nLiAnMjAxNy0xMC0xOScuIGVtcHR5IHN0cmluZyB3aWxsIGdldCBhdmFpbGFiaWxpdHkgZm9yIGN1cnJlbnQgZGF5XG5cdFx0XHRyb29tOiB0aGlzLnJvb21JZCAvLyByb29tX2lkIChzcGFjZSlcblx0XHR9O1xuXG4gICAgICAgIHJldHVybiAkLnBvc3Qoe1xuXHRcdFx0dXJsOiBDQ0wuYWpheF91cmwsXG5cdFx0XHRkYXRhOiBkYXRhXG5cdFx0fSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmdldFNwYWNlQm9va2luZ3MgPSBmdW5jdGlvbihZbWQpe1xuICAgICAgICBcbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBhY3Rpb246ICdnZXRfYm9va2luZ3MnLFxuICAgICAgICAgICAgY2NsX25vbmNlOiBDQ0wubm9uY2UsXG4gICAgICAgICAgICBkYXRlOiBZbWQgfHwgJycsIC8vIGUuZy4gJzIwMTctMTAtMTknLiBlbXB0eSBzdHJpbmcgd2lsbCBnZXQgYm9va2luZ3MgZm9yIGN1cnJlbnQgZGF5XG4gICAgICAgICAgICByb29tOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgIGxpbWl0OiA1MFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiAkLnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiBDQ0wuYWpheF91cmwsXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS51cGRhdGVTY2hlZHVsZURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBnZXRTcGFjZWpxWEhSID0gdGhpcy5nZXRTcGFjZUF2YWlsYWJpbGl0eSh0aGlzLmRhdGVZbWQpO1xuICAgICAgICB2YXIgZ2V0Qm9va2luZ3NqcVhIUiA9IHRoaXMuZ2V0U3BhY2VCb29raW5ncyh0aGlzLmRhdGVZbWQpO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgJC53aGVuKGdldFNwYWNlanFYSFIsIGdldEJvb2tpbmdzanFYSFIpXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihnZXRTcGFjZSxnZXRCb29raW5ncyl7XG5cbiAgICAgICAgICAgICAgICB2YXIgc3BhY2VEYXRhID0gZ2V0U3BhY2VbMF0sXG4gICAgICAgICAgICAgICAgICAgIGJvb2tpbmdzRGF0YSA9IGdldEJvb2tpbmdzWzBdLFxuICAgICAgICAgICAgICAgICAgICBzcGFjZWpxWEhSID0gZ2V0U3BhY2VbMl0sXG4gICAgICAgICAgICAgICAgICAgIGJvb2tpbmdzanFYSFIgPSBnZXRCb29raW5nc1syXSxcbiAgICAgICAgICAgICAgICAgICAgdGltZVNsb3RzQXJyYXk7XG5cbiAgICAgICAgICAgICAgICAvLyBwYXJzZSBkYXRhIHRvIEpTT04gaWYgaXQncyBhIHN0cmluZ1xuICAgICAgICAgICAgICAgIHNwYWNlRGF0YSA9ICggdHlwZW9mIHNwYWNlRGF0YSA9PT0gJ3N0cmluZycgKSA/IEpTT04ucGFyc2UoIHNwYWNlRGF0YSApWzBdIDogc3BhY2VEYXRhWzBdO1xuICAgICAgICAgICAgICAgIGJvb2tpbmdzRGF0YSA9ICggdHlwZW9mIGJvb2tpbmdzRGF0YSA9PT0gJ3N0cmluZycgKSA/IEpTT04ucGFyc2UoIGJvb2tpbmdzRGF0YSApIDogYm9va2luZ3NEYXRhO1xuXG4gICAgICAgICAgICAgICAgLy8gbWVyZ2UgYm9va2luZ3Mgd2l0aCBhdmFpbGFiaWxpdHlcbiAgICAgICAgICAgICAgICBpZiAoIGJvb2tpbmdzRGF0YS5sZW5ndGggKXtcblxuICAgICAgICAgICAgICAgICAgICBib29raW5nc0RhdGEuZm9yRWFjaChmdW5jdGlvbihib29raW5nLGkpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjYWxjdWxhdGUgbnVtYmVyIG9mIHNsb3RzIGJhc2VkIG9uIGJvb2tpbmcgZHVyYXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBmcm9tVGltZSA9IG5ldyBEYXRlKGJvb2tpbmcuZnJvbURhdGUpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b1RpbWUgPSBuZXcgRGF0ZShib29raW5nLnRvRGF0ZSkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGR1cmF0aW9uTWludXRlcyA9ICh0b1RpbWUgLSBmcm9tVGltZSkgLyAxMDAwIC8gNjAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2xvdENvdW50ID0gZHVyYXRpb25NaW51dGVzIC8gdGhhdC5zbG90TWludXRlcztcblxuICAgICAgICAgICAgICAgICAgICAgICAgc3BhY2VEYXRhLmF2YWlsYWJpbGl0eS5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogYm9va2luZy5mcm9tRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRvXCI6IGJvb2tpbmcudG9EYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2xvdENvdW50XCI6IHNsb3RDb3VudCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImlzQm9va2VkXCI6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgLy8gc29ydCB0aW1lIHNsb3Qgb2JqZWN0cyBieSB0aGUgXCJmcm9tXCIga2V5XG4gICAgICAgICAgICAgICAgICAgIF9zb3J0QnlLZXkoIHNwYWNlRGF0YS5hdmFpbGFiaWxpdHksICdmcm9tJyApO1xuXG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgdGltZSBzbG90cyBhbmQgcmV0dXJuIGFuIGFwcHJvcHJpYXRlIHN1YnNldCAob25seSBvcGVuIHRvIGNsb3NlIGhvdXJzKVxuICAgICAgICAgICAgICAgIHRpbWVTbG90c0FycmF5ID0gdGhhdC5wYXJzZVNjaGVkdWxlKHNwYWNlRGF0YS5hdmFpbGFiaWxpdHkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGJ1aWxkIHNjaGVkdWxlIEhUTUxcbiAgICAgICAgICAgICAgICB0aGF0LmJ1aWxkU2NoZWR1bGUodGltZVNsb3RzQXJyYXkpO1xuXG4gICAgICAgICAgICAgICAgLy8gRXJyb3IgaGFuZGxlcnNcbiAgICAgICAgICAgICAgICBzcGFjZWpxWEhSLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBib29raW5nc2pxWEhSLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGF0LnVuc2V0TG9hZGluZygpO1xuICAgICAgICAgICAgICAgIHRoYXQuJHJlc2V0U2VsZWN0aW9uQnRuLmhpZGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5idWlsZFNjaGVkdWxlID0gZnVuY3Rpb24odGltZVNsb3RzQXJyYXkpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGh0bWwgPSBbXTtcbiAgICAgICAgICAgIFxuICAgICAgICAvLyBjb25zdHJ1Y3QgSFRNTCBmb3IgZWFjaCB0aW1lIHNsb3RcbiAgICAgICAgdGltZVNsb3RzQXJyYXkuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKXtcblxuICAgICAgICAgICAgdmFyIGZyb20gPSBuZXcgRGF0ZSggaXRlbS5mcm9tICksXG4gICAgICAgICAgICAgICAgdGltZVN0cmluZyxcbiAgICAgICAgICAgICAgICBpdGVtQ2xhc3MgPSAnJztcblxuICAgICAgICAgICAgaWYgKCBmcm9tLmdldE1pbnV0ZXMoKSAhPT0gMCApIHtcbiAgICAgICAgICAgICAgICB0aW1lU3RyaW5nID0gdGhhdC5yZWFkYWJsZVRpbWUoIGZyb20sICdoOm0nICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmcgPSB0aGF0LnJlYWRhYmxlVGltZSggZnJvbSwgJ2hhJyApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIGl0ZW0uaXNCb29rZWQgJiYgaXRlbS5oYXNPd25Qcm9wZXJ0eSgnc2xvdENvdW50JykgKSB7XG4gICAgICAgICAgICAgICAgaXRlbUNsYXNzID0gJ2NjbC1pcy1vY2N1cGllZCBjY2wtZHVyYXRpb24tJyArIGl0ZW0uc2xvdENvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBidWlsZCBzZWxlY3RhYmxlIHRpbWUgc2xvdHNcbiAgICAgICAgICAgIGh0bWwucHVzaCggdGhhdC5idWlsZFRpbWVTbG90KHtcbiAgICAgICAgICAgICAgICBpZDogJ3Nsb3QtJyArIHRoYXQucm9vbUlkICsgJy0nICsgaSxcbiAgICAgICAgICAgICAgICBmcm9tOiBpdGVtLmZyb20sXG4gICAgICAgICAgICAgICAgdG86IGl0ZW0udG8sXG4gICAgICAgICAgICAgICAgdGltZVN0cmluZzogdGltZVN0cmluZyxcbiAgICAgICAgICAgICAgICBjbGFzczogaXRlbUNsYXNzXG4gICAgICAgICAgICB9KSApO1xuICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbXTtcblxuICAgICAgICB0aGlzLiRyb29tU2NoZWR1bGUuaHRtbCggaHRtbC5qb2luKCcnKSApO1xuXG4gICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXJvb21fX3Nsb3QgW3R5cGU9XCJjaGVja2JveFwiXScpO1xuXG4gICAgICAgIHRoaXMuc2V0Q3VycmVudER1cmF0aW9uVGV4dCgpO1xuXG4gICAgICAgIHRoaXMuaW5pdFNsb3RFdmVudHMoKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuYnVpbGRUaW1lU2xvdCA9IGZ1bmN0aW9uKHZhcnMpe1xuICAgICAgICBcbiAgICAgICAgaWYgKCAhIHZhcnMgfHwgdHlwZW9mIHZhcnMgIT09ICdvYmplY3QnICkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgY2xhc3M6ICcnLFxuICAgICAgICAgICAgaWQ6ICcnLFxuICAgICAgICAgICAgZGlzYWJsZWQ6ICcnLFxuICAgICAgICAgICAgZnJvbTogJycsXG4gICAgICAgICAgICB0bzogJycsXG4gICAgICAgICAgICB0aW1lU3RyaW5nOiAnJ1xuICAgICAgICB9O1xuICAgICAgICB2YXJzID0gJC5leHRlbmQoZGVmYXVsdHMsIHZhcnMpO1xuXG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9ICcnICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2NsLWMtcm9vbV9fc2xvdCAnICsgdmFycy5jbGFzcyArICdcIj4nICtcbiAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwiJyArIHZhcnMuaWQgKyAnXCIgbmFtZT1cIicgKyB2YXJzLmlkICsgJ1wiIHZhbHVlPVwiJyArIHZhcnMuZnJvbSArICdcIiBkYXRhLXRvPVwiJyArIHZhcnMudG8gKyAnXCIgJyArIHZhcnMuZGlzYWJsZWQgKyAnLz4nICtcbiAgICAgICAgICAgICAgICAnPGxhYmVsIGNsYXNzPVwiY2NsLWMtcm9vbV9fc2xvdC1sYWJlbFwiIGZvcj1cIicgKyB2YXJzLmlkICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICB2YXJzLnRpbWVTdHJpbmcgK1xuICAgICAgICAgICAgICAgICc8L2xhYmVsPicgK1xuICAgICAgICAgICAgJzwvZGl2Pic7XG5cbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUucGFyc2VTY2hlZHVsZSA9IGZ1bmN0aW9uKHNjaGVkdWxlQXJyYXkpe1xuICAgICAgICAvLyByZXR1cm5zIHRoZSBhcHByb3ByaWF0ZSBzY2hlZHVsZSBmb3IgYSBnaXZlbiBhcnJheSBvZiB0aW1lIHNsb3RzXG4gICAgICAgIFxuICAgICAgICB2YXIgdG8gPSBudWxsLFxuICAgICAgICAgICAgc3RhcnRFbmRJbmRleGVzID0gW10sIFxuICAgICAgICAgICAgc3RhcnQsIGVuZDtcblxuICAgICAgICAvLyBsb29wIHRocm91Z2ggYXJyYXkgYW5kIHBpY2sgb3V0IHRpbWUgZ2Fwc1xuICAgICAgICBzY2hlZHVsZUFycmF5LmZvckVhY2goZnVuY3Rpb24oaXRlbSxpKXtcbiAgICAgICAgICAgIGlmICggdG8gJiYgdG8gIT09IGl0ZW0uZnJvbSApIHtcbiAgICAgICAgICAgICAgICBzdGFydEVuZEluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRvID0gaXRlbS50bztcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8gZGVwZW5kaW5nIG9uIG51bWJlciBvZiBnYXBzIGZvdW5kLCBkZXRlcm1pbmUgc3RhcnQgYW5kIGVuZCBpbmRleGVzXG4gICAgICAgIGlmICggc3RhcnRFbmRJbmRleGVzLmxlbmd0aCA+PSAyICkge1xuICAgICAgICAgICAgc3RhcnQgPSBzdGFydEVuZEluZGV4ZXNbMF07XG4gICAgICAgICAgICBlbmQgPSBzdGFydEVuZEluZGV4ZXNbMV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGFydCA9IDA7XG4gICAgICAgICAgICBpZiAoIHN0YXJ0RW5kSW5kZXhlcy5sZW5ndGggPT09IDEgKSB7XG4gICAgICAgICAgICAgICAgZW5kID0gc3RhcnRFbmRJbmRleGVzWzBdO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBlbmQgPSBzY2hlZHVsZUFycmF5Lmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gcmV0dXJuZWQgc2xpY2VkIHBvcnRpb24gb2Ygb3JpZ2luYWwgc2NoZWR1bGVcbiAgICAgICAgcmV0dXJuIHNjaGVkdWxlQXJyYXkuc2xpY2Uoc3RhcnQsZW5kKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXRGb3JtRXZlbnRzID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4uY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICQodGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMpLmVhY2goZnVuY3Rpb24oaSxpbnB1dCl7XG4gICAgICAgICAgICAgICAgJChpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAuY2hhbmdlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCBjY2wtaGFzLXBvdGVudGlhbCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRlbC5zdWJtaXQoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoYXQub25TdWJtaXQoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXREYXRlRXZlbnRzID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRkYXRlU2VsZWN0LmNoYW5nZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhhdC5vbkRhdGVDaGFuZ2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uRGF0ZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5kYXRlWW1kID0gdGhpcy4kZGF0ZVNlbGVjdC52YWwoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0TG9hZGluZygpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2NoZWR1bGVEYXRhKCk7XG4gICAgICAgIFxuICAgIH07XG4gICAgICAgIFxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0U2xvdEV2ZW50cyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIGlmICggdGhpcy4kcm9vbVNsb3RJbnB1dHMgJiYgdGhpcy4kcm9vbVNsb3RJbnB1dHMubGVuZ3RoICl7XG5cbiAgICAgICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1yb29tX19zbG90JykuaG92ZXIoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGF0Lm9uU2xvdE1vdXNlSW4odGhpcyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoYXQub25TbG90TW91c2VPdXQodGhpcyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gY2xpY2sgZXZlbnQgZmlyZXMgQkVGT1JFIGNoYW5nZSBldmVudFxuICAgICAgICAgICAgdGhpcy4kcm9vbVNsb3RJbnB1dHMuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhhdC5vblNsb3RDbGljayhpbnB1dCwgZXZlbnQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzLmNoYW5nZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhhdC5vblNsb3RDaGFuZ2UoaW5wdXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TbG90TW91c2VJbiA9IGZ1bmN0aW9uKGhvdmVyZWRTbG90KSB7XG5cbiAgICAgICAgLy8gaWYgeW91J3JlIG5vdCBzZWxlY3RpbmcgeW91ciAybmQgc2xvdCwgcmV0dXJuXG4gICAgICAgIGlmICggdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoICE9PSAxICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhvdmVyZWRJbnB1dCA9ICQoaG92ZXJlZFNsb3QpLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKTtcblxuICAgICAgICB2YXIgaG92ZXJlZElucHV0SW5kZXggPSB0aGlzLiRyb29tU2xvdElucHV0cy5pbmRleChob3ZlcmVkSW5wdXQpLFxuICAgICAgICAgICAgc2VsZWN0ZWRJbnB1dEluZGV4ID0gdGhpcy4kcm9vbVNsb3RJbnB1dHMuaW5kZXgoIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzWzBdICksXG4gICAgICAgICAgICBpbnB1dEluZGV4U2V0ID0gW2hvdmVyZWRJbnB1dEluZGV4LCBzZWxlY3RlZElucHV0SW5kZXhdLnNvcnQoKTtcblxuICAgICAgICAvLyBpZiB5b3UncmUgaG92ZXJpbmcgdGhlIGFscmVhZHkgc2VsZWN0ZWQgc2xvdCwgcmV0dXJuXG4gICAgICAgIGlmICggaW5wdXRJbmRleFNldFswXSA9PT0gaW5wdXRJbmRleFNldFsxXSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBmaXJzdCBvciBsYXN0IGlucHV0IGluZGV4ZXMgYXJlIGJleW9uZCBib3VuZGFyaWVzLCByZXR1cm5cbiAgICAgICAgaWYgKCBpbnB1dEluZGV4U2V0WzBdIDw9IHNlbGVjdGVkSW5wdXRJbmRleCAtIHRoaXMubWF4U2xvdHMgfHwgaW5wdXRJbmRleFNldFsxXSA+PSBzZWxlY3RlZElucHV0SW5kZXggKyB0aGlzLm1heFNsb3RzICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0IGZpcnN0L2xhc3Qgc2xvdCBlbGVtZW50c1xuICAgICAgICB2YXIgJGZpcnN0U2xvdCA9IHRoaXMuJHJvb21TbG90SW5wdXRzLmVxKGlucHV0SW5kZXhTZXRbMF0pLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKSxcbiAgICAgICAgICAgICRsYXN0U2xvdCA9IHRoaXMuJHJvb21TbG90SW5wdXRzLmVxKGlucHV0SW5kZXhTZXRbMV0pLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKTtcblxuICAgICAgICAvLyBzZWxlY3Qgc2xvdHMgaW4gYmV0d2VlbiBmaXJzdCBhbmQgbGFzdFxuICAgICAgICAkZmlyc3RTbG90Lm5leHRVbnRpbCgkbGFzdFNsb3QpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICBpZiAoICEgJHRoaXMuaGFzQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpICkge1xuICAgICAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCdjY2wtaGFzLXBvdGVudGlhbCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TbG90TW91c2VPdXQgPSBmdW5jdGlvbihob3ZlcmVkSW5wdXQpIHtcblxuICAgICAgICBpZiAoIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCAhPT0gMSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1oYXMtcG90ZW50aWFsJyk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uU2xvdENsaWNrID0gZnVuY3Rpb24oY2xpY2tlZElucHV0LCBldmVudCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBjbGlja0lucHV0SW5kZXggPSB0aGF0LiRyb29tU2xvdElucHV0cy5pbmRleChjbGlja2VkSW5wdXQpLFxuICAgICAgICAgICAgbWluSW5kZXggPSBjbGlja0lucHV0SW5kZXggLSB0aGF0Lm1heFNsb3RzLFxuICAgICAgICAgICAgbWF4SW5kZXggPSBjbGlja0lucHV0SW5kZXggKyB0aGF0Lm1heFNsb3RzO1xuXG4gICAgICAgIC8vIGRpc2FibGVzIHNsb3RzIHRoYXQgYXJlIG91dHNpZGUgb2YgbWF4IHNlbGVjdGFibGUgYXJlYVxuICAgICAgICBmdW5jdGlvbiBfaXNvbGF0ZVNlbGVjdGFibGVTbG90cygpIHtcblxuICAgICAgICAgICAgLy8gb2NjdXBpZWQgc2xvdHMgd2lsbCBhZmZlY3Qgd2hhdCBuZWFyYnkgc2xvdHMgY2FuIGJlIHNlbGVjdGVkXG4gICAgICAgICAgICAvLyBMb29wIHRocm91Z2ggYW55IG9jY3VwaWVkIHNsb3RzLCBpZiB0aGV5IGV4aXN0XG4gICAgICAgICAgICAkKCcuY2NsLWMtcm9vbV9fc2xvdC5jY2wtaXMtb2NjdXBpZWQnKS5lYWNoKGZ1bmN0aW9uKGksc2xvdCl7XG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgb2NjdXBpZWQgc2xvdCdzIGlucHV0LCBmaW5kIGl0J3MgaW5kZXggYW1vdW5nIGFsbCBzbG90IGlucHV0c1xuICAgICAgICAgICAgICAgIHZhciBzbG90SW5wdXQgPSAkKHNsb3QpLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSxcbiAgICAgICAgICAgICAgICAgICAgb2NjdXBpZWRJbmRleCA9IHRoYXQuJHJvb21TbG90SW5wdXRzLmluZGV4KHNsb3RJbnB1dCk7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBvY2N1cGllZCBzbG90IGZhbGxzIGluIHRoZSBzZWxlY3RhYmxlIGFyZWFcbiAgICAgICAgICAgICAgICBpZiAoIG1pbkluZGV4IDwgb2NjdXBpZWRJbmRleCAmJiBvY2N1cGllZEluZGV4IDwgbWF4SW5kZXggKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgb2NjdXBpZWQgc2xvdCBpcyBCRUZPUkUgY2xpY2tlZCBzbG90LCBzZXQgaXQgYXMgdGhlIG1pblxuICAgICAgICAgICAgICAgICAgICBpZiAoIG9jY3VwaWVkSW5kZXggPCBjbGlja0lucHV0SW5kZXggKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5JbmRleCA9IG9jY3VwaWVkSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgb2NjdXBpZWQgc2xvdCBpcyBBRlRFUiBjbGlja2VkIHNsb3QsIHNldCBpdCBhcyB0aGUgbWF4XG4gICAgICAgICAgICAgICAgICAgIGlmICggb2NjdXBpZWRJbmRleCA+IGNsaWNrSW5wdXRJbmRleCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heEluZGV4ID0gb2NjdXBpZWRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBzbG90cywgZGlzYWJsZSBvbmVzIHRoYXQgZmFsbCBvdXRzaWRlIG9mIG1pbi9tYXggaW5kZXhlc1xuICAgICAgICAgICAgdGhhdC4kcm9vbVNsb3RJbnB1dHMuZWFjaChmdW5jdGlvbihpLGlucHV0KXtcbiAgICAgICAgICAgICAgICBpZiAoIGkgPD0gbWluSW5kZXggfHwgaSA+PSBtYXhJbmRleCApIHtcbiAgICAgICAgICAgICAgICAgICAgJChpbnB1dCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpLmFkZENsYXNzKCdjY2wtaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBpZiBubyBpbnB1dHMgeWV0IHNlbGVjdGVkLCB0aGlzIGlzIHRoZSBmaXJzdFxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gICAgICAgIGlmICggdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoID09PSAwICkge1xuXG4gICAgICAgICAgICBfaXNvbGF0ZVNlbGVjdGFibGVTbG90cygpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIGlmIDEgaW5wdXQgc2VsZWN0ZWQsIHNlbGVjdGluZyAybmQgc2xvdFxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gICAgICAgIGlmICggdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoID09PSAxICkge1xuXG4gICAgICAgICAgICBpZiAoICQoY2xpY2tlZElucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykuaGFzQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpICkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIGlmIDIgb3IgbW9yZSBzbG90cyBhbHJlYWR5IHNlbGVjdGVkXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgaWYgKCB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPj0gMiApIHtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIGNsaWNrZWQgaW5wdXQgaXMgbm90IHBhcnQgb2YgY3VycmVudCBzZWxlY3Rpb25cbiAgICAgICAgICAgIC8vIGNsZWFyIGFsbCBzZWxlY3RlZCBpbnB1dHNcbiAgICAgICAgICAgIGlmICggdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZiggY2xpY2tlZElucHV0ICkgPCAwICkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdGhhdC5jbGVhckFsbFNsb3RzKCk7XG4gICAgICAgICAgICAgICAgdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbXTtcblxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gaWYgY2xpY2tlZCBpbnB1dCBpcyBvbmUgb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBpbnB1dHNcbiAgICAgICAgICAgIC8vIGtlZXAgdGhhdCBvbmUgc2VsZWN0ZWQgYW5kIGRlc2VsZWN0IHRoZSByZXN0XG4gICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgIC8vIHByZXZlbnQgY2hhbmdlIGV2ZW50IGZyb20gZmlyaW5nXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgaW5wdXQgaW5kZXggZnJvbSBhbW9uZyBzZWxlY3RlZCBpbnB1dHNcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWRTbG90SW5kZXggPSB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKCBjbGlja2VkSW5wdXQgKSxcbiAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWRJbnB1dHMgPSAkLmV4dGVuZCggW10sIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gY2xlYXIgYWxsIGlucHV0cyBFWENFUFQgdGhlIGNsaWNrZWQgb25lXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJbnB1dHMuZm9yRWFjaChmdW5jdGlvbihpbnB1dCxpKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBzZWxlY3RlZFNsb3RJbmRleCAhPSBpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhhdC5jbGVhclNsb3QoaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gLy8gc2V0IHNlbGVjdGVkIGlucHV0cyB0byBqdXN0IHRoaXMgb25lXG4gICAgICAgICAgICAgICAgLy8gdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzW3NlbGVjdGVkU2xvdEluZGV4XSBdO1xuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBjdXJyZW50IGR1cmF0aW9uIHRleHRcbiAgICAgICAgICAgICAgICB0aGF0LnNldEN1cnJlbnREdXJhdGlvblRleHQoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfaXNvbGF0ZVNlbGVjdGFibGVTbG90cygpO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblNsb3RDaGFuZ2UgPSBmdW5jdGlvbihjaGFuZ2VkSW5wdXQpe1xuICAgICAgICBcbiAgICAgICAgLy8gaWYgaW5wdXQgY2hlY2tlZCwgYWRkIGl0IHRvIHNlbGVjdGVkIHNldFxuICAgICAgICBpZiAoICQoY2hhbmdlZElucHV0KS5wcm9wKCdjaGVja2VkJykgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnB1c2goY2hhbmdlZElucHV0KTtcbiAgICAgICAgICAgICQoY2hhbmdlZElucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG4gICBcbiAgICAgICAgfSBcbiAgICAgICAgXG4gICAgICAgIC8vIGlmIGlucHV0IHVuY2hlY2tlZCwgcmVtb3ZlIGl0IGZyb20gdGhlIHNlbGVjdGVkIHNldFxuICAgICAgICBlbHNlIHsgXG5cbiAgICAgICAgICAgIHZhciBjaGFuZ2VkSW5wdXRJbmRleCA9IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2YoY2hhbmdlZElucHV0KTtcblxuICAgICAgICAgICAgaWYgKCBjaGFuZ2VkSW5wdXRJbmRleCA+IC0xICkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnNwbGljZSggY2hhbmdlZElucHV0SW5kZXgsIDEgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoY2hhbmdlZElucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRvZ2dsZSByZXNldCBidXR0b25cbiAgICAgICAgaWYgKCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4uc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4uaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgaGlnaGxpZ2h0IHNsb3RzIGJldHdlZW4gdHdvIGVuZHNcbiAgICAgICAgaWYgKCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPT09IDIgKSB7XG5cbiAgICAgICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAgICAgdGhhdC4kZWwuZmluZCgnLmNjbC1pcy1jaGVja2VkJykuZmlyc3QoKS5uZXh0VW50aWwoJy5jY2wtaXMtY2hlY2tlZCcpLmVhY2goZnVuY3Rpb24oaSxzbG90KXtcbiAgICAgICAgICAgICAgICB2YXIgc2xvdElucHV0ID0gJChzbG90KS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcbiAgICAgICAgICAgICAgICB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5wdXNoKHNsb3RJbnB1dFswXSk7XG4gICAgICAgICAgICAgICAgdGhhdC5hY3RpdmF0ZVNsb3Qoc2xvdCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0Q3VycmVudER1cmF0aW9uVGV4dCgpO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5jbGVhclNsb3QgPSBmdW5jdGlvbihzbG90KSB7XG4gICAgICAgIC8vIHNsb3QgY2FuIGJlIGVpdGhlciB0aGUgY2hlY2tib3ggaW5wdXQgLU9SLSB0aGUgY2hlY2tib3gncyBjb250YWluZXJcblxuICAgICAgICB2YXIgaW5wdXRJbmRleDtcblxuICAgICAgICAvLyBpZiBpdCdzIHRoZSBjaGVja2JveC5cbiAgICAgICAgaWYgKCAkKHNsb3QpLmlzKCdbdHlwZT1cImNoZWNrYm94XCJdJykgKSB7XG4gICAgICAgICBcbiAgICAgICAgICAgICQoc2xvdClcbiAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsZmFsc2UpXG4gICAgICAgICAgICAgICAgLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1jaGVja2VkIGNjbC1oYXMtcG90ZW50aWFsJyk7XG5cbiAgICAgICAgICAgIC8vIGdldCBpbmRleCBvZiB0aGUgaW5wdXQgZnJvbSBzZWxlY3RlZCBzZXRcbiAgICAgICAgICAgIGlucHV0SW5kZXggPSB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKHNsb3QpO1xuICAgICAgICAgICAgXG4gICAgICAgIC8vIGlmIGl0J3MgdGhlIGNvbnRhaW5lclxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB2YXIgJGlucHV0ID0gJChzbG90KS5maW5kKCdbdHlwZT1cImNoZWNrYm94XCJdJyk7XG5cbiAgICAgICAgICAgICQoc2xvdCkucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1jaGVja2VkIGNjbC1oYXMtcG90ZW50aWFsJyk7XG4gICAgICAgICAgICAkaW5wdXQucHJvcCgnY2hlY2tlZCcsZmFsc2UpO1xuXG4gICAgICAgICAgICAvLyBnZXQgaW5kZXggb2YgdGhlIGlucHV0IGZyb20gc2VsZWN0ZWQgc2V0XG4gICAgICAgICAgICBpbnB1dEluZGV4ID0gdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZiggJGlucHV0WzBdICk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlbW92ZSBpbnB1dCBmcm9tIHNlbGVjdGVkIHNldFxuICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5zcGxpY2UoIGlucHV0SW5kZXgsIDEgKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuY2xlYXJBbGxTbG90cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIC8vIEV4dGVuZCB0aGUgc2VsZWN0ZWQgaW5wdXRzIGFycmF5IHRvIGEgbmV3IHZhcmlhYmxlLlxuICAgICAgICAvLyBUaGUgc2VsZWN0ZWQgaW5wdXRzIGFycmF5IGNoYW5nZXMgd2l0aCBldmVyeSBjbGVhclNsb3QoKSBjYWxsXG4gICAgICAgIC8vIHNvLCBiZXN0IHRvIGxvb3AgdGhyb3VnaCBhbiB1bmNoYW5naW5nIGFycmF5LlxuICAgICAgICB2YXIgc2VsZWN0ZWRJbnB1dHMgPSAkLmV4dGVuZCggW10sIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzICk7XG5cbiAgICAgICAgJChzZWxlY3RlZElucHV0cykuZWFjaChmdW5jdGlvbihpLGlucHV0KXtcbiAgICAgICAgICAgIHRoYXQuY2xlYXJTbG90KGlucHV0KTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmFjdGl2YXRlU2xvdCA9IGZ1bmN0aW9uKHNsb3QpIHtcbiAgICAgICAgLy8gc2xvdCBjYW4gYmUgZWl0aGVyIHRoZSBjaGVja2JveCAtT1ItIHRoZSBjaGVja2JveCdzIGNvbnRhaW5lclxuXG4gICAgICAgIHZhciBzbG90SXNDaGVja2JveCA9ICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSxcbiAgICAgICAgICAgICRjb250YWluZXIgPSBzbG90SXNDaGVja2JveCA/ICQoc2xvdCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpIDogJChzbG90KTtcblxuICAgICAgICAvLyBuZXZlciBzZXQgYW4gb2NjdXBpZWQgc2xvdCBhcyBhY3RpdmVcbiAgICAgICAgaWYgKCAkY29udGFpbmVyLmhhc0NsYXNzKCdjY2wtaXMtb2NjdXBpZWQnKSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggJChzbG90KS5pcygnW3R5cGU9XCJjaGVja2JveFwiXScpICkge1xuXG4gICAgICAgICAgICAvLyBpZiBpdCdzIHRoZSBjaGVja2JveC5cbiAgICAgICAgIFxuICAgICAgICAgICAgJChzbG90KS5wcm9wKCdjaGVja2VkJyx0cnVlKTtcbiAgICAgICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gaWYgaXQncyB0aGUgY29udGFpbmVyXG5cbiAgICAgICAgICAgICRjb250YWluZXJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJylcbiAgICAgICAgICAgICAgICAuZmluZCgnW3R5cGU9XCJjaGVja2JveFwiXScpXG4gICAgICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJyx0cnVlKTtcblxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5zZXRMb2FkaW5nID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dC50ZXh0KCdMb2FkaW5nIHNjaGVkdWxlLi4uJyk7XG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUudW5zZXRMb2FkaW5nID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5zZXRDdXJyZW50RHVyYXRpb25UZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9ICQuZXh0ZW5kKFtdLHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzKSxcbiAgICAgICAgICAgIHNvcnRlZFNlbGVjdGlvbiA9IHNlbGVjdGlvbi5zb3J0KGZ1bmN0aW9uKGEsYil7IFxuICAgICAgICAgICAgICAgIHJldHVybiBhLnZhbHVlID4gYi52YWx1ZTsgXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHNlbGVjdGlvbkxlbmd0aCA9IHNvcnRlZFNlbGVjdGlvbi5sZW5ndGg7XG4gICAgICAgIFxuICAgICAgICBpZiAoIHNlbGVjdGlvbkxlbmd0aCA+IDAgKSB7XG5cbiAgICAgICAgICAgIHZhciB0aW1lMVZhbCA9IHNvcnRlZFNlbGVjdGlvblswXS52YWx1ZSxcbiAgICAgICAgICAgICAgICByZWFkYWJsZVRpbWUxID0gdGhpcy5yZWFkYWJsZVRpbWUoIG5ldyBEYXRlKHRpbWUxVmFsKSApO1xuXG4gICAgICAgICAgICB2YXIgdGltZTJWYWwgPSAoIHNlbGVjdGlvbkxlbmd0aCA+PSAyICkgPyBzb3J0ZWRTZWxlY3Rpb25bc29ydGVkU2VsZWN0aW9uLmxlbmd0aCAtIDFdLnZhbHVlIDogdGltZTFWYWwsXG4gICAgICAgICAgICAgICAgdGltZTJUID0gbmV3IERhdGUodGltZTJWYWwpLmdldFRpbWUoKSArICggdGhpcy5zbG90TWludXRlcyAqIDYwICogMTAwMCApLFxuICAgICAgICAgICAgICAgIHJlYWRhYmxlVGltZTIgPSB0aGlzLnJlYWRhYmxlVGltZSggbmV3IERhdGUodGltZTJUKSApO1xuXG4gICAgICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoICdGcm9tICcgKyByZWFkYWJsZVRpbWUxICsgJyB0byAnICsgcmVhZGFibGVUaW1lMiApO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoJ1BsZWFzZSBzZWxlY3QgYXZhaWxhYmxlIHRpbWUgc2xvdHMnKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnNldE1heFRpbWVUZXh0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG1heE1pbnV0ZXMgPSB0aGlzLm1heFNsb3RzICogdGhpcy5zbG90TWludXRlcyxcbiAgICAgICAgICAgIG1heFRleHQ7XG5cbiAgICAgICAgc3dpdGNoKG1heE1pbnV0ZXMpIHtcbiAgICAgICAgICAgIGNhc2UgMjQwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTgwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTIwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjA6XG4gICAgICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgLyA2MCArICcgaG91cnMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyArICdtaW5zJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJG1heFRpbWUudGV4dCggbWF4VGV4dCApO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUucmVhZGFibGVUaW1lID0gZnVuY3Rpb24oIGRhdGVPYmosIGZvcm1hdCApIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBsb2NhbGVTdHJpbmcgPSBkYXRlT2JqLnRvTG9jYWxlU3RyaW5nKCB0aGlzLmxvY2FsZSwgdGhpcy50aW1lWm9uZSApLCAvLyBlLmcuIC0tPiBcIjExLzcvMjAxNywgNDozODozMyBBTVwiXG4gICAgICAgICAgICBsb2NhbGVUaW1lID0gbG9jYWxlU3RyaW5nLnNwbGl0KFwiLCBcIilbMV07IC8vIFwiNDozODozMyBBTVwiXG5cbiAgICAgICAgdmFyIHRpbWUgPSBsb2NhbGVUaW1lLnNwbGl0KCcgJylbMF0sIC8vIFwiNDozODozM1wiLFxuICAgICAgICAgICAgdGltZU9iaiA9IHtcbiAgICAgICAgICAgICAgICBhOiBsb2NhbGVUaW1lLnNwbGl0KCcgJylbMV0udG9Mb3dlckNhc2UoKSwgLy8gKGFtIG9yIHBtKSAtLT4gXCJhXCJcbiAgICAgICAgICAgICAgICBoOiB0aW1lLnNwbGl0KCc6JylbMF0sIC8vIFwiNFwiXG4gICAgICAgICAgICAgICAgbTogdGltZS5zcGxpdCgnOicpWzFdLCAvLyBcIjM4XCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgaWYgKCBmb3JtYXQgJiYgdHlwZW9mIGZvcm1hdCA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBmb3JtYXRBcnIgPSBmb3JtYXQuc3BsaXQoJycpLFxuICAgICAgICAgICAgICAgIHJlYWRhYmxlQXJyID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IGZvcm1hdEFyci5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHRpbWVPYmpbZm9ybWF0QXJyW2ldXSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVBcnIucHVzaCh0aW1lT2JqW2Zvcm1hdEFycltpXV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlQXJyLnB1c2goZm9ybWF0QXJyW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZWFkYWJsZUFyci5qb2luKCcnKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRpbWVPYmouaCArICc6JyArIHRpbWVPYmoubSArIHRpbWVPYmouYTtcbiAgICAgICAgXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblN1Ym1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcblxuICAgICAgICBpZiAoICEgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoICkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLiRmb3JtTm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgLmNzcygnZGlzcGxheScsJ25vbmUnKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnY2NsLWlzLWVycm9yJylcbiAgICAgICAgICAgICAgICAudGV4dCgnUGxlYXNlIHNlbGVjdCBhIHRpbWUgZm9yIHlvdXIgcmVzZXJ2YXRpb24nKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyh0aGlzLiRmb3JtQ29udGVudClcbiAgICAgICAgICAgICAgICAuc2xpZGVEb3duKENDTC5EVVJBVElPTik7ICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRmb3JtTm90aWZpY2F0aW9uLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgc29ydGVkU2VsZWN0aW9uID0gJC5leHRlbmQoW10sIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzKS5zb3J0KGZ1bmN0aW9uKGEsYil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEudmFsdWUgPiBiLnZhbHVlO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBzdGFydCA9IHNvcnRlZFNlbGVjdGlvblswXS52YWx1ZSxcbiAgICAgICAgICAgIGVuZCA9ICggc29ydGVkU2VsZWN0aW9uLmxlbmd0aCA+IDEgKSA/ICQoIHNvcnRlZFNlbGVjdGlvblsgc29ydGVkU2VsZWN0aW9uLmxlbmd0aCAtIDEgXSApLmRhdGEoJ3RvJykgOiAkKCBzb3J0ZWRTZWxlY3Rpb25bMF0gKS5kYXRhKCd0bycpLFxuICAgICAgICAgICAgcGF5bG9hZCA9IHtcbiAgICAgICAgICAgICAgICBcImlpZFwiOjMzMyxcbiAgICAgICAgICAgICAgICBcInN0YXJ0XCI6IHN0YXJ0LFxuICAgICAgICAgICAgICAgIFwiZm5hbWVcIjogdGhpcy4kZWxbMF0uZm5hbWUudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJsbmFtZVwiOiB0aGlzLiRlbFswXS5sbmFtZS52YWx1ZSxcbiAgICAgICAgICAgICAgICBcImVtYWlsXCI6IHRoaXMuJGVsWzBdLmVtYWlsLnZhbHVlLFxuICAgICAgICAgICAgICAgIFwibmlja25hbWVcIjogdGhpcy4kZWxbMF0ubmlja25hbWUudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJib29raW5nc1wiOltcbiAgICAgICAgICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5yb29tSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRvXCI6IGVuZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyggJ29uIFN1Ym1pdCDCuyAnLCBwYXlsb2FkICk7XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1zdWJtaXR0aW5nJyk7XG4gICAgICAgIHRoaXMuJGZvcm1DYW5jZWwucHJvcCgnZGlzYWJsZWQnLHRydWUpO1xuICAgICAgICB0aGlzLiRmb3JtU3VibWl0LnRleHQoJ1NlbmRpbmcuLi4nKS5wcm9wKCdkaXNhYmxlZCcsdHJ1ZSk7XG5cbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBhY3Rpb246ICdyZXF1ZXN0X2Jvb2tpbmcnLFxuICAgICAgICAgICAgY2NsX25vbmNlOiBDQ0wubm9uY2UsXG4gICAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIE1ha2UgYSByZXF1ZXN0IGhlcmUgdG8gcmVzZXJ2ZSBzcGFjZVxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgJC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IENDTC5hamF4X3VybCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIF9oYW5kbGVTdWJtaXRSZXNwb25zZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zdWJtaXR0aW5nJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBfaGFuZGxlU3VibWl0UmVzcG9uc2UocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgdmFyIHJlc3BvbnNlSFRNTCxcbiAgICAgICAgICAgICAgICByZXNwb25zZU9iamVjdCA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuXG4gICAgICAgICAgICBpZiAoIHJlc3BvbnNlT2JqZWN0LmJvb2tpbmdfaWQgKSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MID0gIFsnPHAgY2xhc3M9XCJjY2wtaDIgY2NsLXUtbXQtMFwiPlN1Y2Nlc3MhPC9wPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cCBjbGFzcz1cImNjbC1oNFwiPllvdXIgYm9va2luZyBJRCBpcyA8c3BhbiBjbGFzcz1cImNjbC11LWNvbG9yLXNjaG9vbFwiPicgKyByZXNwb25zZU9iamVjdC5ib29raW5nX2lkICsgJzwvc3Bhbj48L3A+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxwIGNsYXNzPVwiY2NsLWg0XCI+UGxlYXNlIGNoZWNrIHlvdXIgZW1haWwgdG8gY29uZmlybSB5b3VyIGJvb2tpbmcuPC9wPiddO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwgPSAgWyc8cCBjbGFzcz1cImNjbC1oMyBjY2wtdS1tdC0wXCI+U29ycnksIGJ1dCB3ZSBjb3VsZG5cXCd0IHByb2Nlc3MgeW91ciByZXNlcnZhdGlvbi48L3A+JywnPHAgY2xhc3M9XCJjY2wtaDRcIj5FcnJvcnM6PC9wPiddO1xuICAgICAgICAgICAgICAgICQocmVzcG9uc2VPYmplY3QuZXJyb3JzKS5lYWNoKGZ1bmN0aW9uKGksIGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MLnB1c2goJzxwIGNsYXNzPVwiY2NsLWMtYWxlcnQgY2NsLWlzLWVycm9yXCI+JyArIGVycm9yICsgJzwvcD4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwucHVzaCgnPHAgY2xhc3M9XCJjY2wtaDRcIj5QbGVhc2UgdGFsayB0byB5b3VyIG5lYXJlc3QgbGlicmFyaWFuIGZvciBoZWxwLjwvcD4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhhdC4kZm9ybUNhbmNlbC5wcm9wKCdkaXNhYmxlZCcsZmFsc2UpLnRleHQoJ0Nsb3NlJyk7XG4gICAgICAgICAgICB0aGF0LiRmb3JtU3VibWl0LnJlbW92ZSgpO1xuICAgICAgICAgICAgdGhhdC4kZm9ybUNvbnRlbnQuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIENDTC5EVVJBVElPTik7XG4gICAgICAgICAgICB0aGF0LiRmb3JtUmVzcG9uc2VcbiAgICAgICAgICAgICAgICAuZGVsYXkoQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5hbmltYXRlKHtvcGFjaXR5OiAxfSwgQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5odG1sKHJlc3BvbnNlSFRNTCk7XG4gICAgICAgICAgICB0aGF0LiRmb3JtQ29udGVudFxuICAgICAgICAgICAgICAgIC5kZWxheShDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAgICAgLmFuaW1hdGUoe2hlaWdodDogdGhhdC4kZm9ybVJlc3BvbnNlLmhlaWdodCgpICsgJ3B4JyB9LCBDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAgICAgLmNzcyh7ekluZGV4OiAnLTEnfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAvLyBIZWxwZXJzXG5cbiAgICBmdW5jdGlvbiBfc29ydEJ5S2V5KCBhcnIsIGtleSwgb3JkZXIgKSB7XG4gICAgICAgIGZ1bmN0aW9uIHNvcnRBU0MoYSxiKSB7XG4gICAgICAgICAgICBpZiAoYVtrZXldIDwgYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYVtrZXldID4gYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNvcnRERVNDKGEsYikge1xuICAgICAgICAgICAgaWYgKGFba2V5XSA+IGJba2V5XSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFba2V5XSA8IGJba2V5XSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoICdERVNDJyA9PT0gb3JkZXIgKSB7XG4gICAgICAgICAgICBhcnIuc29ydChzb3J0REVTQyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcnIuc29ydChzb3J0QVNDKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1yb29tLXJlcy1mb3JtJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFJvb21SZXNGb3JtKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU3RpY2tpZXNcbiAqIFxuICogQmVoYXZpb3VyIGZvciBzdGlja3kgZWxlbWVudHMuXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBpc0ZpeGVkOiAnY2NsLWlzLWZpeGVkJ1xuICAgICAgICB9O1xuXG4gICAgdmFyIFN0aWNreSA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICAvLyB2YXJpYWJsZXNcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpLFxuICAgICAgICAgICAgaGVpZ2h0ID0gJGVsLm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICBvZmZzZXQgPSAkZWwub2Zmc2V0KCksXG4gICAgICAgICAgICBvcHRpb25zID0gJGVsLmRhdGEoJ3N0aWNreScpLFxuICAgICAgICAgICAgd3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJqcy1zdGlja3ktd3JhcHBlclwiPjwvZGl2PicpLmNzcyh7IGhlaWdodDogaGVpZ2h0ICsgJ3B4JyB9KTtcblxuICAgICAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgfTtcblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zICk7XG5cbiAgICAgICAgLy8gd3JhcCBlbGVtZW50XG4gICAgICAgICRlbC53cmFwKCB3cmFwcGVyICk7XG5cbiAgICAgICAgLy8gc2Nyb2xsIGxpc3RlbmVyXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgMTAwICkgKTtcblxuICAgICAgICAvLyBvbiBzY3JvbGxcbiAgICAgICAgZnVuY3Rpb24gX29uU2Nyb2xsKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKSArIG9wdGlvbnMub2Zmc2V0O1xuICAgIFxuICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gb2Zmc2V0LnRvcCApIHtcbiAgICAgICAgICAgICAgICAkZWwuYWRkQ2xhc3MoIGNsYXNzTmFtZS5pc0ZpeGVkICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLmlzRml4ZWQgKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1pcy1zdGlja3knKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU3RpY2t5KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogVG9nZ2xlIFNjaG9vbHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIHNjaG9vbCB0b2dnbGVzXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIGluaXRTY2hvb2wgPSAkKCdodG1sJykuZGF0YSgnc2Nob29sJyk7XG5cbiAgICB2YXIgU2Nob29sU2VsZWN0ID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kc2VsZWN0ID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgU2Nob29sU2VsZWN0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIGlmICggaW5pdFNjaG9vbCApIHtcblxuICAgICAgICAgICAgdGhpcy4kc2VsZWN0XG4gICAgICAgICAgICAgICAgLmZpbmQoICdvcHRpb25bdmFsdWU9XCInICsgaW5pdFNjaG9vbCArICdcIl0nIClcbiAgICAgICAgICAgICAgICAuYXR0ciggJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyApOyAgIFxuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRzZWxlY3QuY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hdHRyKCAgJ2RhdGEtc2Nob29sJywgZXZlbnQudGFyZ2V0LnZhbHVlICk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJzY2hvb2xcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU2Nob29sU2VsZWN0KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIFRvb2x0aXBzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciB0b29sdGlwc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgVG9vbHRpcCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy4kZWwuYXR0cigndGl0bGUnKTtcbiAgICAgICAgdGhpcy4kdG9vbHRpcCA9ICQoJzxkaXYgaWQ9XCJjY2wtY3VycmVudC10b29sdGlwXCIgY2xhc3M9XCJjY2wtYy10b29sdGlwIGNjbC1pcy10b3BcIiByb2xlPVwidG9vbHRpcFwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19hcnJvd1wiPjwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19pbm5lclwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBUb29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuaG92ZXIoZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIC8vIG1vdXNlb3ZlclxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCAnJyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cignYXJpYS1kZXNjcmliZWRieScsICdjY2wtY3VycmVudC10b29sdGlwJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblxuICAgICAgICAgICAgQ0NMLnJlZmxvdyhfdGhpcy4kdG9vbHRpcFswXSk7XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBfdGhpcy4kZWwub2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgd2lkdGggID0gX3RoaXMuJGVsLm91dGVyV2lkdGgoKSxcbiAgICAgICAgICAgICAgICB0b29sdGlwSGVpZ2h0ID0gX3RoaXMuJHRvb2x0aXAub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuY3NzKHtcbiAgICAgICAgICAgICAgICB0b3A6IChvZmZzZXQudG9wIC0gdG9vbHRpcEhlaWdodCkgKyAncHgnLFxuICAgICAgICAgICAgICAgIGxlZnQ6IChvZmZzZXQubGVmdCArICh3aWR0aC8yKSkgKyAncHgnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgIH0sIGZ1bmN0aW9uKGUpeyBcblxuICAgICAgICAgICAgLy9tb3VzZW91dFxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCBfdGhpcy5jb250ZW50KTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgJycpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlKCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBUb29sdGlwKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogV2F5ZmluZGluZ1xuICogXG4gKiBDb250cm9scyBpbnRlcmZhY2UgZm9yIGxvb2tpbmcgdXAgY2FsbCBudW1iZXIgbG9jYXRpb25zXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICB0YWJzLCB3YXlmaW5kZXI7XG4gICAgXG4gICAgdmFyIFRhYnMgPSBmdW5jdGlvbihlbCkge1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdGFicyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy10YWInKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMgPSAkKCcuY2NsLWMtdGFiX19jb250ZW50Jyk7XG4gICAgICAgIFxuXG4gICAgICAgIHRoaXMuJHRhYnMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICR0YWIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHRhYi5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICR0YWIuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0QWN0aXZlKHRhcmdldCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFRhYnMucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKHRhcmdldCl7XG4gICAgICAgIHRoaXMuJHRhYnMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFicy5maWx0ZXIoJ1tocmVmPVwiJyt0YXJnZXQrJ1wiXScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIHZhciBXYXlmaW5kZXIgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuY2FsbE51bWJlcnMgPSB7fTtcbiAgICAgICAgdGhpcy4kZm9ybSA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bWJlci1zZWFyY2gnKTtcbiAgICAgICAgdGhpcy4kaW5wdXQgPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW0taW5wdXQnKTtcbiAgICAgICAgdGhpcy4kc3VibWl0ID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtLXN1Ym1pdCcpO1xuICAgICAgICB0aGlzLiRtYXJxdWVlID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fbWFycXVlZScpO1xuICAgICAgICB0aGlzLiRjYWxsTnVtID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fY2FsbC1udW0nKTtcbiAgICAgICAgdGhpcy4kd2luZyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX3dpbmcnKTtcbiAgICAgICAgdGhpcy4kZmxvb3IgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19mbG9vcicpO1xuICAgICAgICB0aGlzLiRzdWJqZWN0ID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fc3ViamVjdCcpO1xuICAgICAgICB0aGlzLmVycm9yID0ge1xuICAgICAgICAgICAgZ2V0OiAnPGRpdiBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvciBjY2wtd2F5ZmluZGVyX19lcnJvclwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2NsLWItY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPjxpIGNsYXNzPVwiY2NsLWItaWNvbiBhbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gVGhlcmUgd2FzIGFuIGVycm9yIGZldGNoaW5nIGNhbGwgbnVtYmVycy48L2Rpdj4nLFxuICAgICAgICAgICAgZmluZDogJzxkaXYgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3IgY2NsLXdheWZpbmRlcl9fZXJyb3JcIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNjbC1iLWNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj48aSBjbGFzcz1cImNjbC1iLWljb24gYWxlcnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IENvdWxkIG5vdCBmaW5kIHRoYXQgY2FsbCBudW1iZXIuIFBsZWFzZSB0cnkgYWdhaW4uPC9kaXY+J1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRlcnJvckJveCA9ICQoJy5jY2wtZXJyb3ItYm94Jyk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAkLmdldEpTT04oIENDTC5hc3NldHMgKyAnanMvY2FsbC1udW1iZXJzLmpzb24nIClcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIF90aGlzLmNhbGxOdW1iZXJzID0gZGF0YTtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGVycm9yQm94LmFwcGVuZCggdGhpcy5lcnJvci5nZXQgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1hcHAtYWN0aXZlJyk7XG5cbiAgICAgICAgdGhpcy4kaW5wdXRcbiAgICAgICAgICAgIC5rZXl1cChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHF1ZXJ5ID09PSBcIlwiICkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3VibWl0LmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRtYXJxdWVlLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVzZXQoKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGZvcm0uc3VibWl0KGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBfdGhpcy4kaW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgICQoJy5jY2wtd2F5ZmluZGVyX19lcnJvcicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuc2hvdygpO1xuICAgICAgICAgICAgX3RoaXMuJGNhbGxOdW0udGV4dChxdWVyeSk7XG4gICAgICAgICAgICBfdGhpcy5maW5kUm9vbSggcXVlcnkgKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5nZXRDYWxsS2V5ID0gZnVuY3Rpb24oY2FsbE51bSkge1xuICAgICAgICB2YXIga2V5LFxuICAgICAgICAgICAgY2FsbEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmNhbGxOdW1iZXJzKTtcblxuICAgICAgICBpZiAoIGNhbGxLZXlzLmxlbmd0aCA9PT0gMCApe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbEtleXMuZm9yRWFjaChmdW5jdGlvbihrKXtcbiAgICAgICAgICBpZiAoIGNhbGxOdW0gPj0gayApIHtcbiAgICAgICAgICAgIGtleSA9IGs7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmZpbmRSb29tID0gZnVuY3Rpb24ocXVlcnkpIHtcblxuICAgICAgICBxdWVyeSA9IHF1ZXJ5LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgY2FsbEtleSA9IHRoaXMuZ2V0Q2FsbEtleShxdWVyeSksXG4gICAgICAgICAgICBjYWxsRGF0YSA9IHt9LFxuICAgICAgICAgICAgcm9vbTtcblxuICAgICAgICBpZiAoICEgY2FsbEtleSApIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dGaW5kRXJyb3IoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKCcuY2NsLWMtc2VhcmNoJykub2Zmc2V0KCkudG9wIH0pO1xuICAgICAgICBcbiAgICAgICAgY2FsbERhdGEgPSB0aGlzLmNhbGxOdW1iZXJzW2NhbGxLZXldO1xuXG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoIGNhbGxEYXRhLmZsb29yICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggY2FsbERhdGEud2luZyApO1xuICAgICAgICB0aGlzLiRzdWJqZWN0LnRleHQoIGNhbGxEYXRhLnN1YmplY3QgKTtcblxuICAgICAgICAvKiBUT0RPOlxuICAgICAgICAgKiBzZXQgQUNUVUFMIHJvb20sIG5vdCBqdXN0IHRoZSBmbG9vci4gc3RpbGwgd2FpdGluZyBvbiBjbGllbnQgXG4gICAgICAgICAqIHRvIHByb3ZpZGUgZGF0YSBmb3Igd2hpY2ggY2FsbCBudW1iZXJzIGJlbG9uZyB0byB3aGljaCByb29tc1xuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgICAgIHJvb20gPSBjYWxsRGF0YS5mbG9vcl9pbnQ7XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWY9XCIjZmxvb3ItJytyb29tKydcIl0nKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjcm9vbS0nK3Jvb20rJy0xJykuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcblxuICAgICAgICB0YWJzLnNldEFjdGl2ZSggJyNmbG9vci0nICsgcm9vbSApO1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUudGhyb3dGaW5kRXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdC50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiRlcnJvckJveC5hcHBlbmQoIHRoaXMuZXJyb3IuZmluZCApO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWpzLXRhYnMnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0YWJzID0gbmV3IFRhYnModGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuY2NsLWpzLXdheWZpbmRlcicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHdheWZpbmRlciA9IG5ldyBXYXlmaW5kZXIodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIl19
