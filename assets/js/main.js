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

    // TODO: Remove
    var dummyAvailabilityData = [
        {
            "id": 9148,
            "name": "Group Study 1",
            "description": "",
            "image": "",
            "capacity": "6",
            "availability": [
                {
                    "from": "2017-11-01T08:00:00-07:00",
                    "to": "2017-11-01T08:30:00-07:00"
                },
                {
                    "from": "2017-11-01T08:30:00-07:00",
                    "to": "2017-11-01T09:00:00-07:00"
                },
                {
                    "from": "2017-11-01T09:00:00-07:00",
                    "to": "2017-11-01T09:30:00-07:00"
                },
                {
                    "from": "2017-11-01T09:30:00-07:00",
                    "to": "2017-11-01T10:00:00-07:00"
                },
                {
                    "from": "2017-11-01T10:00:00-07:00",
                    "to": "2017-11-01T10:30:00-07:00"
                },
                {
                    "from": "2017-11-01T10:30:00-07:00",
                    "to": "2017-11-01T11:00:00-07:00"
                },
                // {
                //     "from": "2017-11-01T11:00:00-07:00",
                //     "to": "2017-11-01T11:30:00-07:00"
                // },
                {
                    "from": "2017-11-01T11:30:00-07:00",
                    "to": "2017-11-01T12:00:00-07:00"
                },
                // {
                //     "from": "2017-11-01T12:00:00-07:00",
                //     "to": "2017-11-01T12:30:00-07:00"
                // },
                {
                    "from": "2017-11-01T12:30:00-07:00",
                    "to": "2017-11-01T13:00:00-07:00"
                },
                {
                    "from": "2017-11-01T13:00:00-07:00",
                    "to": "2017-11-01T13:30:00-07:00"
                },
                // {
                //     "from": "2017-11-01T13:30:00-07:00",
                //     "to": "2017-11-01T14:00:00-07:00"
                // },
                // {
                //     "from": "2017-11-01T14:00:00-07:00",
                //     "to": "2017-11-01T14:30:00-07:00"
                // },
                {
                    "from": "2017-11-01T14:30:00-07:00",
                    "to": "2017-11-01T15:00:00-07:00"
                },
                {
                    "from": "2017-11-01T15:00:00-07:00",
                    "to": "2017-11-01T15:30:00-07:00"
                },
                {
                    "from": "2017-11-01T15:30:00-07:00",
                    "to": "2017-11-01T16:00:00-07:00"
                },
                {
                    "from": "2017-11-01T16:00:00-07:00",
                    "to": "2017-11-01T16:30:00-07:00"
                },
                {
                    "from": "2017-11-01T16:30:00-07:00",
                    "to": "2017-11-01T17:00:00-07:00"
                },
                {
                    "from": "2017-11-01T17:00:00-07:00",
                    "to": "2017-11-01T17:30:00-07:00"
                },
                {
                    "from": "2017-11-01T17:30:00-07:00",
                    "to": "2017-11-01T18:00:00-07:00"
                },
                {
                    "from": "2017-11-01T18:00:00-07:00",
                    "to": "2017-11-01T18:30:00-07:00"
                },
                {
                    "from": "2017-11-01T18:30:00-07:00",
                    "to": "2017-11-01T19:00:00-07:00"
                },
                {
                    "from": "2017-11-01T19:00:00-07:00",
                    "to": "2017-11-01T19:30:00-07:00"
                },
                {
                    "from": "2017-11-01T19:30:00-07:00",
                    "to": "2017-11-01T20:00:00-07:00"
                },
                {
                    "from": "2017-11-01T20:00:00-07:00",
                    "to": "2017-11-01T20:30:00-07:00"
                },
                {
                    "from": "2017-11-01T20:30:00-07:00",
                    "to": "2017-11-01T21:00:00-07:00"
                },
                {
                    "from": "2017-11-01T21:00:00-07:00",
                    "to": "2017-11-01T21:30:00-07:00"
                },
                {
                    "from": "2017-11-01T21:30:00-07:00",
                    "to": "2017-11-01T22:00:00-07:00"
                }
            ]
        }
    ];

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
        this.timeZone = '-700';

        this.init();

    };

    RoomResForm.prototype.init = function(){

        var _this = this,
            todayYmd= new Date().toISOString().split('T')[0];

        this.$el.addClass('ccl-is-loading');

        this.setMaxTimeText();

        this.getSpaceAvailability()
            .done(function(data){
                _this.makeSchedule(data);
            })
            .fail(function(err){
                console.log(err);
            })
            .always(function(){
                _this.$el.removeClass('ccl-is-loading');
            });

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

    RoomResForm.prototype.makeSchedule = function(dayData){

        // get object for first room in array. we're only calling data for one room at a time.
        // check data type as well. If it's a string, parse to JSON.
        dayData = ( typeof dayData === 'string' ) ? JSON.parse( dayData )[0] : dayData[0];

        var _this = this,
            html = [],
            availability = dayData.availability,
            oldToTime;
            
        // construct HTML for each time slot
        $(dayData.availability).each(function(i,item){

            var newFromTime = item.from,
                slotDateTime = new Date( item.from );

            // compare this item and the previous item to look for gaps in time.
            // gaps indicated a reserved block of time
            if ( oldToTime && oldToTime != newFromTime  ) {

                var newFromTimeUnix = new Date(newFromTime).getTime(),
                    oldToTimeUnix = new Date(oldToTime).getTime(),
                    difference = newFromTimeUnix - oldToTimeUnix,
                    slots;

                // get difference in minutes
                difference = difference / 1000 / 60;
                slots = difference / _this.slotMinutes;

                // build slots for occupied (unselectable) time
                for ( var j = 0; j < slots; j++ ) {

                    var addMilliseconds = j * _this.slotMinutes * 60 * 1000,
                        newUnix = oldToTimeUnix + addMilliseconds;

                    html.push( _this.makeTimeSlot({
                        id: 'slot-' + _this.roomId + '-' + i + '-' + j,
                        disabled: 'disabled',
                        class: 'ccl-is-occupied',
                        from: _this.formatDateString( new Date(newUnix) ),
                        timeString: _this.formatDateString( new Date(newUnix), 'readable' )
                    }) );
                }

            }
            
            // build selectable time slots
            html.push( _this.makeTimeSlot({
                id: 'slot-' + _this.roomId + '-' + i,
                from: item.from,
                to: item.to,
                timeString: _this.formatDateString( slotDateTime, 'readable' )
            }) );

            // update variable to the current item's "to" value.
            oldToTime = item.to;
        
        });

        this.selectedSlotInputs = [];

        this.$roomSchedule.html( html.join('') );

        this.$roomSlotInputs = this.$el.find('.ccl-c-room__slot [type="checkbox"]');

        this.setCurrentDurationText();

        // this.setOccupiedRooms();

        this.initSlotEvents();

    };

    RoomResForm.prototype.makeTimeSlot = function(vars){
        
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

    RoomResForm.prototype.initFormEvents = function(){

        var _this = this;

        this.$resetSelectionBtn.click(function(event){
            event.preventDefault();
            $(_this.selectedSlotInputs).each(function(i,input){
                $(input)
                    .prop('checked',false)
                    .change();
            });
            $('.ccl-c-room__slot').removeClass('ccl-is-disabled ccl-has-potential');
        });

        this.$el.submit(function(event){
            event.preventDefault();
            _this.onSubmit();
        });

    };

    RoomResForm.prototype.initDateEvents = function(){

        var _this = this;
        
        this.$dateSelect.change(function(){
            _this.onDateChange();
        });

    };

    RoomResForm.prototype.onDateChange = function() {
        
        var _this = this;
        
        this.dateYmd = this.$dateSelect.val();
        
        this.$el.removeClass('ccl-is-loading');

        this.getSpaceAvailability(this.dateYmd)
            .done(function(data){                
                _this.makeSchedule(data);
            })
            .fail(function(err){
                console.log(err);
            })
            .always(function(){
                _this.$el.removeClass('ccl-is-loading');
                _this.$resetSelectionBtn.hide();
            });
        
    };
        
    RoomResForm.prototype.initSlotEvents = function(){
        var _this = this;
        
        if ( this.$roomSlotInputs && this.$roomSlotInputs.length ){

            this.$el.find('.ccl-c-room__slot').hover(function(){
                _this.onSlotMouseIn(this);
            }, function(){
                _this.onSlotMouseOut(this);
            });

            // click event fires BEFORE change event
            this.$roomSlotInputs.click(function(event){
                var input = this;
                _this.onSlotClick(input, event);
            });
            
            this.$roomSlotInputs.change(function(){
                var input = this;
                _this.onSlotChange(input);
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
        
        var _this = this,
            clickInputIndex = _this.$roomSlotInputs.index(clickedInput),
            minIndex = clickInputIndex - _this.maxSlots,
            maxIndex = clickInputIndex + _this.maxSlots;

        // disables slots that are outside of max selectable area
        function _isolateSelectableSlots() {

            // occupied slots will affect what nearby slots can be selected
            // Loop through any occupied slots, if they exist
            $('.ccl-c-room__slot.ccl-is-occupied').each(function(i,slot){

                // get occupied slot's input, find it's index amoung all slot inputs
                var slotInput = $(slot).find('[type="checkbox"]'),
                    occupiedIndex = _this.$roomSlotInputs.index(slotInput);

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
            _this.$roomSlotInputs.each(function(i,input){
                if ( i <= minIndex || i >= maxIndex ) {
                    $(input).parent('.ccl-c-room__slot').addClass('ccl-is-disabled');
                }
            });

        }

        /* -------------------------------------------------------------
         * if no inputs yet selected, this is the first
         * ------------------------------------------------------------- */
        if ( _this.selectedSlotInputs.length === 0 ) {

            _isolateSelectableSlots();
            
        }

        /* -------------------------------------------------------------
         * if 1 input selected, selecting 2nd slot
         * ------------------------------------------------------------- */
        if ( _this.selectedSlotInputs.length === 1 ) {

            if ( $(clickedInput).parent('.ccl-c-room__slot').hasClass('ccl-is-disabled') ) {
                event.preventDefault();
            } else {
                $('.ccl-c-room__slot').removeClass('ccl-is-disabled');
            }

        }

        /* -------------------------------------------------------------
         * if 2 or more slots already selected
         * ------------------------------------------------------------- */
        if ( _this.selectedSlotInputs.length >= 2 ) {

            // if the clicked input is not part of current selection
            // clear all selected inputs
            if ( _this.selectedSlotInputs.indexOf( clickedInput ) < 0 ) {
            
                _this.clearAllSlots();
                _this.selectedSlotInputs = [];

            } 
            
            // if clicked input is one of the currently selected inputs
            // keep that one selected and deselect the rest
            else {

                // prevent change event from firing
                event.preventDefault();

                // get the input index from among selected inputs
                var selectedSlotIndex = _this.selectedSlotInputs.indexOf( clickedInput ),
                    selectedInputs = $.extend( [], _this.selectedSlotInputs );
                
                // clear all inputs EXCEPT the clicked one
                selectedInputs.forEach(function(input,i){
                    if ( selectedSlotIndex != i ) {
                        _this.clearSlot(input);
                    }
                });
                
                // // set selected inputs to just this one
                // _this.selectedSlotInputs = [ _this.selectedSlotInputs[selectedSlotIndex] ];

                // update the current duration text
                _this.setCurrentDurationText();

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

            var _this = this;

            _this.$el.find('.ccl-is-checked').first().nextUntil('.ccl-is-checked').each(function(i,slot){
                var slotInput = $(slot).find('input[type="checkbox"]');
                _this.selectedSlotInputs.push(slotInput[0]);
                _this.activateSlot(slot);
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

        var _this = this;
        
        // Extend the selected inputs array to a new variable.
        // The selected inputs array changes with every clearSlot() call
        // so, best to loop through an unchanging array.
        var selectedInputs = $.extend( [], _this.selectedSlotInputs );

        $(selectedInputs).each(function(i,input){
            _this.clearSlot(input);
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

    RoomResForm.prototype.setCurrentDurationText = function() {

        var selection = $.extend([],this.selectedSlotInputs),
            sortedSelection = selection.sort(function(a,b){ 
                return a.value > b.value; 
            }),
            selectionLength = sortedSelection.length;
        
        if ( selectionLength > 0 ) {

            var time1Val = sortedSelection[0].value,
                readableTime1 = this.formatDateString( new Date(time1Val), 'readable' );

            var time2Val = ( selectionLength >= 2 ) ? sortedSelection[sortedSelection.length - 1].value : time1Val,
                time2T = new Date(time2Val).getTime() + ( this.slotMinutes * 60 * 1000 ),
                readableTime2 = this.formatDateString( new Date(time2T), 'readable' );

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

    RoomResForm.prototype.formatDateString = function(dateObj, readable){

        var minutes = ( dateObj.getMinutes().toString().length < 2 ) ? '0' + dateObj.getMinutes().toString() : dateObj.getMinutes().toString();
            
        if ( readable ) {

            var ampm = ( dateObj.getHours() >= 12 ) ? 'p' : 'a',
                hour12Format = ( dateObj.getHours() > 12 ) ? dateObj.getHours() - 12 : dateObj.getHours();

            return hour12Format + ':' + minutes + ampm;

        } else {

            var hours = ( dateObj.getHours().toString().length < 2 ) ? '0' + dateObj.getHours().toString() : dateObj.getHours().toString(),
                seconds = ( dateObj.getSeconds().toString().length < 2 ) ? '0' + dateObj.getSeconds().toString() : dateObj.getSeconds().toString();

            return this.dateYmd + 'T' + hours + ':' + minutes + ':' + seconds + this.timeZone;

        }

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

        var _this = this,
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

        this.$el.addClass('ccl-is-loading');
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
                _this.$el.removeClass('ccl-is-loading');
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

            _this.$formCancel.prop('disabled',false).text('Close');
            _this.$formSubmit.remove();
            _this.$formContent.animate({opacity: 0}, CCL.DURATION);
            _this.$formResponse
                .delay(CCL.DURATION)
                .animate({opacity: 1}, CCL.DURATION)
                .html(responseHTML);
            _this.$formContent
                .delay(CCL.DURATION)
                .animate({height: _this.$formResponse.height() + 'px' }, CCL.DURATION)
                .css({zIndex: '-1'});

        }

    };

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkcm9wZG93bnMuanMiLCJtb2RhbHMuanMiLCJyb29tLXJlcy5qcyIsInN0aWNraWVzLmpzIiwidG9nZ2xlLXNjaG9vbHMuanMiLCJ0b29sdGlwcy5qcyIsIndheWZpbmRpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvMEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEdsb2JhbCBWYXJpYWJsZXMuIFxuICovXG5cblxuKGZ1bmN0aW9uICggJCwgd2luZG93ICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wuRFVSQVRJT04gPSAzMDA7XG5cbiAgICBDQ0wuQlJFQUtQT0lOVF9TTSA9IDUwMDtcbiAgICBDQ0wuQlJFQUtQT0lOVF9NRCA9IDc2ODtcbiAgICBDQ0wuQlJFQUtQT0lOVF9MRyA9IDEwMDA7XG4gICAgQ0NMLkJSRUFLUE9JTlRfWEwgPSAxNTAwO1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnaHRtbCcpLnRvZ2dsZUNsYXNzKCduby1qcyBqcycpO1xuICAgIH0pO1xuXG59KShqUXVlcnksIHRoaXMpOyIsIi8qKlxuICogUmVmbG93IHBhZ2UgZWxlbWVudHMuIFxuICogXG4gKiBFbmFibGVzIGFuaW1hdGlvbnMvdHJhbnNpdGlvbnMgb24gZWxlbWVudHMgYWRkZWQgdG8gdGhlIHBhZ2UgYWZ0ZXIgdGhlIERPTSBoYXMgbG9hZGVkLlxuICovXG5cblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLnJlZmxvdyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICB9O1xuXG59KSgpOyIsIi8qKlxuICogR2V0IHRoZSBTY3JvbGxiYXIgd2lkdGhcbiAqIFRoYW5rcyB0byBkYXZpZCB3YWxzaDogaHR0cHM6Ly9kYXZpZHdhbHNoLm5hbWUvZGV0ZWN0LXNjcm9sbGJhci13aWR0aFxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuICAgIFxuICAgIGZ1bmN0aW9uIGdldFNjcm9sbFdpZHRoKCkge1xuICAgICAgICBcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtZWFzdXJlbWVudCBub2RlXG4gICAgICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gcG9zaXRpb24gd2F5IHRoZSBoZWxsIG9mZiBzY3JlZW5cbiAgICAgICAgJChzY3JvbGxEaXYpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogJzEwMHB4JyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMHB4JyxcbiAgICAgICAgICAgIG92ZXJmbG93OiAnc2Nyb2xsJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAnLTk5OTlweCcsXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQoc2Nyb2xsRGl2KTtcblxuICAgICAgICAvLyBHZXQgdGhlIHNjcm9sbGJhciB3aWR0aFxuICAgICAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybihzY3JvbGxiYXJXaWR0aCk7IC8vIE1hYzogIDE1XG5cbiAgICAgICAgLy8gRGVsZXRlIHRoZSBESVYgXG4gICAgICAgICQoc2Nyb2xsRGl2KS5yZW1vdmUoKTtcblxuICAgICAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG4gICAgfVxuICAgIFxuICAgIGlmICggISB3aW5kb3cuQ0NMICkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLmdldFNjcm9sbFdpZHRoID0gZ2V0U2Nyb2xsV2lkdGg7XG4gICAgQ0NMLlNDUk9MTEJBUldJRFRIID0gZ2V0U2Nyb2xsV2lkdGgoKTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogLmRlYm91bmNlKCkgZnVuY3Rpb25cbiAqIFxuICogU291cmNlOiBodHRwczovL2Rhdmlkd2Fsc2gubmFtZS9qYXZhc2NyaXB0LWRlYm91bmNlLWZ1bmN0aW9uXG4gKi9cblxuXG4oZnVuY3Rpb24od2luZG93KSB7XG5cbiAgICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gICAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgICB2YXIgdGhyb3R0bGUgPSBmdW5jdGlvbiAoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgdGltZW91dCwgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgICAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgICAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblxuICAgICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgdGhyb3R0bGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgICAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhyb3R0bGVkLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgIHByZXZpb3VzID0gMDtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHRocm90dGxlZDtcbiAgICB9O1xuXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICB3aW5kb3cuQ0NMLnRocm90dGxlID0gdGhyb3R0bGU7XG5cbn0pKHRoaXMpOyIsIi8qKlxuICogQWNjb3JkaW9uc1xuICogXG4gKiBCZWhhdmlvciBmb3IgYWNjb3JkaW9uIGNvbXBvbmVudHNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIEFjY29yZGlvbiA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdG9nZ2xlID0gdGhpcy4kZWwuY2hpbGRyZW4oJy5jY2wtYy1hY2NvcmRpb25fX3RvZ2dsZScpO1xuICAgICAgICB0aGlzLiRjb250ZW50ID0gdGhpcy4kZWwuY2hpbGRyZW4oJy5jY2wtYy1hY2NvcmRpb25fX2NvbnRlbnQnKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEFjY29yZGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kdG9nZ2xlLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgX3RoaXMuJGNvbnRlbnQuc2xpZGVUb2dnbGUoKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC50b2dnbGVDbGFzcygnY2NsLWlzLW9wZW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1jLWFjY29yZGlvbicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBBY2NvcmRpb24odGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBBbGVydHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIGFsZXJ0c1xuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBEVVJBVElPTiA9IENDTC5EVVJBVElPTjtcblxuICAgIHZhciBBbGVydERpc21pc3MgPSBmdW5jdGlvbigkZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gJGVsLnBhcmVudCgpO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBBbGVydERpc21pc3MucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIF90aGlzLiR0YXJnZXQuYW5pbWF0ZSggeyBvcGFjaXR5OiAwIH0sIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiBEVVJBVElPTixcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF90aGlzLiR0YXJnZXQuc2xpZGVVcCggRFVSQVRJT04sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiR0YXJnZXQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuXG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKGRvY3VtZW50KS5vbiggJ2NsaWNrJywgJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXScsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgdmFyIGRpc21pc3NFbCA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXScpO1xuICAgICAgICAgICAgbmV3IEFsZXJ0RGlzbWlzcyhkaXNtaXNzRWwpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIENhcm91c2Vsc1xuICogXG4gKiBJbml0aWFsaXplIGFuZCBkZWZpbmUgYmVoYXZpb3IgZm9yIGNhcm91c2Vscy4gXG4gKiBVc2VzIHRoZSBTbGljayBTbGlkZXMgalF1ZXJ5IHBsdWdpbiAtLT4gaHR0cDovL2tlbndoZWVsZXIuZ2l0aHViLmlvL3NsaWNrL1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgQ2Fyb3VzZWwgPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5nbG9iYWxEZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgZG90c0NsYXNzOiAnY2NsLWMtY2Fyb3VzZWxfX3BhZ2luZycsXG4gICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB9O1xuXG4gICAgQ2Fyb3VzZWwucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLiRlbC5kYXRhKCksXG4gICAgICAgICAgICBvcHRpb25zID0gZGF0YS5vcHRpb25zIHx8IHt9O1xuICAgICAgICAgICAgXG4gICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZSA9IFtdO1xuXG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zU20gKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfU00sIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNTbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNNZCApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9NRCwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc01kXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc0xnICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX0xHLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zTGdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zWGwgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfWEwsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNYbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoIHRoaXMuZ2xvYmFsRGVmYXVsdHMsIG9wdGlvbnMgKTtcblxuICAgICAgICB2YXIgY2Fyb3VzZWwgPSB0aGlzLiRlbC5zbGljayhvcHRpb25zKSxcbiAgICAgICAgICAgIF90aGlzID0gdGhpcztcblxuICAgICAgICBjYXJvdXNlbC5vbignYmVmb3JlQ2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSl7XG4gICAgICAgICAgICBfdGhpcy4kZWwuZmluZCgnLnNsaWNrLXNsaWRlJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1wYXN0Jyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuZmluZCgnLnNsaWNrLXNsaWRlW2RhdGEtc2xpY2staW5kZXg9XCInK25leHRTbGlkZSsnXCJdJykucHJldkFsbCgpLmFkZENsYXNzKCdjY2wtaXMtcGFzdCcpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmpzLXByb21vLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IENhcm91c2VsKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogRHJvcGRvd25zXG4gKiBcbiAqIEluaXRpYWxpemUgYW5kIGNvbnRyb2wgYmVoYXZpb3IgZm9yIGRyb3Bkb3duIG1lbnVzXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgIFRPR0dMRTogJ1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJyxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lID0ge1xuICAgICAgICAgICAgQUNUSVZFOiAnY2NsLWlzLWFjdGl2ZScsXG4gICAgICAgICAgICBNRU5VOiAnY2NsLWMtZHJvcGRvd25fX21lbnUnXG4gICAgICAgIH07XG5cbiAgICB2YXIgRHJvcGRvd25Ub2dnbGUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZSA9ICQoZWwpO1xuICAgICAgICB0aGlzLiRwYXJlbnQgPSB0aGlzLiR0b2dnbGUucGFyZW50KCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy4kdG9nZ2xlLmRhdGEoJ3RhcmdldCcpO1xuXG4gICAgICAgIHRoaXMuJG1lbnUgPSAkKCB0YXJnZXQgKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiR0b2dnbGUuY2xpY2soIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIF90aGlzLnRvZ2dsZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgdmFyIGhhc0FjdGl2ZU1lbnVzID0gJCggJy4nICsgY2xhc3NOYW1lLk1FTlUgKyAnLicgKyBjbGFzc05hbWUuQUNUSVZFICkubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKCBoYXNBY3RpdmVNZW51cyApe1xuICAgICAgICAgICAgICAgIF9jbGVhck1lbnVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBpc0FjdGl2ZSA9IHRoaXMuJHRvZ2dsZS5oYXNDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuXG4gICAgICAgIGlmICggaXNBY3RpdmUgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNob3dNZW51KCk7XG5cbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLnNob3dNZW51ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB0aGlzLiRtZW51LmFkZENsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgIHRoaXMuJHBhcmVudC5hZGRDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuaGlkZU1lbnUgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiR0b2dnbGUuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICB0aGlzLiRtZW51LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgIHRoaXMuJHBhcmVudC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBfY2xlYXJNZW51cygpIHtcbiAgICAgICAgJCgnLmNjbC1jLWRyb3Bkb3duLCAuY2NsLWMtZHJvcGRvd25fX21lbnUnKS5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICAkKCBzZWxlY3Rvci5UT0dHTEUgKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCggc2VsZWN0b3IuVE9HR0xFICkuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IERyb3Bkb3duVG9nZ2xlKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogTW9kYWxzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBtb2RhbHMuIEJhc2VkIG9uIEJvb3RzdHJhcCdzIG1vZGFsczogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvNC4wL2NvbXBvbmVudHMvbW9kYWwvXG4gKiBcbiAqIEdsb2JhbHM6XG4gKiBTQ1JPTExCQVJXSURUSFxuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBEVVJBVElPTiA9IDMwMDtcblxuICAgIHZhciBNb2RhbFRvZ2dsZSA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgXG4gICAgICAgIHZhciAkZWwgPSAkKGVsKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gJGVsLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpczsgXG5cbiAgICAgICAgX3RoaXMuJGVsLm9uKCAnY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKCAkKGRvY3VtZW50LmJvZHkpLmhhc0NsYXNzKCdjY2wtbW9kYWwtb3BlbicpICkge1xuICAgICAgICAgICAgICAgIF90aGlzLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0JhY2tkcm9wKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnNob3dNb2RhbCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuc2hvd0JhY2tkcm9wID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuXG4gICAgICAgIHZhciBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB2YXIgJGJhY2tkcm9wID0gJChiYWNrZHJvcCk7XG5cbiAgICAgICAgJGJhY2tkcm9wLmFkZENsYXNzKCdjY2wtYy1tb2RhbF9fYmFja2Ryb3AnKTtcbiAgICAgICAgJGJhY2tkcm9wLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuICAgICAgICBcbiAgICAgICAgQ0NMLnJlZmxvdyhiYWNrZHJvcCk7XG4gICAgICAgIFxuICAgICAgICAkYmFja2Ryb3AuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgICQoZG9jdW1lbnQuYm9keSlcbiAgICAgICAgICAgIC5hZGRDbGFzcygnY2NsLW1vZGFsLW9wZW4nKVxuICAgICAgICAgICAgLmNzcyggJ3BhZGRpbmctcmlnaHQnLCBDQ0wuU0NST0xMQkFSV0lEVEggKTtcblxuICAgICAgICBpZiAoIGNhbGxiYWNrICkge1xuICAgICAgICAgICAgc2V0VGltZW91dCggY2FsbGJhY2ssIERVUkFUSU9OICk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLnNob3dNb2RhbCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIF90aGlzLiR0YXJnZXQuc2hvdyggMCwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIF90aGlzLiR0YXJnZXQuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICQoJy5jY2wtYy1tb2RhbCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWwnKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbF9fYmFja2Ryb3AnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbF9fYmFja2Ryb3AnKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuYm9keSlcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtbW9kYWwtb3BlbicpXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoICdwYWRkaW5nLXJpZ2h0JywgJycgKTtcblxuICAgICAgICAgICAgfSwgRFVSQVRJT04pO1xuXG4gICAgICAgIH0sIERVUkFUSU9OICk7IFxuXG4gICAgfTtcblxuXG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBNb2RhbFRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKHRoaXMsIGpRdWVyeSk7IiwiLyoqXG4gKiBSb29tIFJlc2VydmF0aW9uXG4gKiBcbiAqIEhhbmRsZSByb29tIHJlc2VydmF0aW9uc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIC8vIFRPRE86IFJlbW92ZVxuICAgIHZhciBkdW1teUF2YWlsYWJpbGl0eURhdGEgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogOTE0OCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkdyb3VwIFN0dWR5IDFcIixcbiAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJcIixcbiAgICAgICAgICAgIFwiaW1hZ2VcIjogXCJcIixcbiAgICAgICAgICAgIFwiY2FwYWNpdHlcIjogXCI2XCIsXG4gICAgICAgICAgICBcImF2YWlsYWJpbGl0eVwiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTExLTAxVDA4OjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTExLTAxVDA4OjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMS0wMVQwODozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMS0wMVQwOTowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTEtMDFUMDk6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTEtMDFUMDk6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTExLTAxVDA5OjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTExLTAxVDEwOjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMS0wMVQxMDowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMS0wMVQxMDozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTEtMDFUMTA6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTEtMDFUMTE6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBcImZyb21cIjogXCIyMDE3LTExLTAxVDExOjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgLy8gICAgIFwidG9cIjogXCIyMDE3LTExLTAxVDExOjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMS0wMVQxMTozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMS0wMVQxMjowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwiZnJvbVwiOiBcIjIwMTctMTEtMDFUMTI6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJ0b1wiOiBcIjIwMTctMTEtMDFUMTI6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTExLTAxVDEyOjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTExLTAxVDEzOjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMS0wMVQxMzowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMS0wMVQxMzozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwiZnJvbVwiOiBcIjIwMTctMTEtMDFUMTM6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJ0b1wiOiBcIjIwMTctMTEtMDFUMTQ6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAgICAgLy8ge1xuICAgICAgICAgICAgICAgIC8vICAgICBcImZyb21cIjogXCIyMDE3LTExLTAxVDE0OjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgLy8gICAgIFwidG9cIjogXCIyMDE3LTExLTAxVDE0OjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICAvLyB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMS0wMVQxNDozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMS0wMVQxNTowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTEtMDFUMTU6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTEtMDFUMTU6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTExLTAxVDE1OjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTExLTAxVDE2OjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMS0wMVQxNjowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMS0wMVQxNjozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTEtMDFUMTY6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTEtMDFUMTc6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTExLTAxVDE3OjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTExLTAxVDE3OjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMS0wMVQxNzozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMS0wMVQxODowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTEtMDFUMTg6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTEtMDFUMTg6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTExLTAxVDE4OjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTExLTAxVDE5OjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMS0wMVQxOTowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMS0wMVQxOTozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTEtMDFUMTk6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTEtMDFUMjA6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTExLTAxVDIwOjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTExLTAxVDIwOjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMS0wMVQyMDozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMS0wMVQyMTowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTEtMDFUMjE6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTEtMDFUMjE6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTExLTAxVDIxOjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTExLTAxVDIyOjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgdmFyIFJvb21SZXNGb3JtID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kZm9ybUNvbnRlbnQgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1jb250ZW50JykuY3NzKHtwb3NpdGlvbjoncmVsYXRpdmUnfSk7XG4gICAgICAgIHRoaXMuJGZvcm1SZXNwb25zZSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLXJlc3BvbnNlJykuY3NzKHtwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnMXJlbScsIGxlZnQ6ICcxcmVtJywgb3BhY2l0eTogMH0pO1xuICAgICAgICB0aGlzLiRmb3JtQ2FuY2VsID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tY2FuY2VsJyk7XG4gICAgICAgIHRoaXMuJGZvcm1TdWJtaXQgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1zdWJtaXQnKTtcbiAgICAgICAgdGhpcy5yb29tSWQgPSB0aGlzLiRlbC5kYXRhKCdyZXNvdXJjZS1pZCcpO1xuICAgICAgICB0aGlzLiRkYXRlU2VsZWN0ID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tZGF0ZS1zZWxlY3QnKTtcbiAgICAgICAgdGhpcy5kYXRlWW1kID0gdGhpcy4kZGF0ZVNlbGVjdC52YWwoKTtcbiAgICAgICAgdGhpcy4kcm9vbVNjaGVkdWxlID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tc2NoZWR1bGUnKTtcbiAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1jdXJyZW50LWR1cmF0aW9uJyk7XG4gICAgICAgIHRoaXMuJGZvcm1Ob3RpZmljYXRpb24gPSAkKCc8cCBjbGFzcz1cImNjbC1jLWFsZXJ0XCI+PC9wPicpO1xuICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0biA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yZXNldC1zZWxlY3Rpb24nKTsgXG4gICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbXTtcbiAgICAgICAgdGhpcy5tYXhTbG90cyA9IDQ7XG4gICAgICAgIHRoaXMuJG1heFRpbWUgPSB0aGlzLiRlbC5maW5kKCcuanMtbWF4LXRpbWUnKTtcbiAgICAgICAgdGhpcy5zbG90TWludXRlcyA9IDMwO1xuICAgICAgICB0aGlzLnRpbWVab25lID0gJy03MDAnO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgdG9kYXlZbWQ9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zcGxpdCgnVCcpWzBdO1xuXG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuXG4gICAgICAgIHRoaXMuc2V0TWF4VGltZVRleHQoKTtcblxuICAgICAgICB0aGlzLmdldFNwYWNlQXZhaWxhYmlsaXR5KClcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIF90aGlzLm1ha2VTY2hlZHVsZShkYXRhKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFsd2F5cyhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF90aGlzLiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuaW5pdERhdGVFdmVudHMoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdEZvcm1FdmVudHMoKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmdldFNwYWNlQXZhaWxhYmlsaXR5ID0gZnVuY3Rpb24oWW1kKXtcblxuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0YWN0aW9uOiAnZ2V0X3Jvb21faW5mbycsXG5cdFx0XHRjY2xfbm9uY2U6IENDTC5ub25jZSxcblx0XHRcdGF2YWlsYWJpbGl0eTogWW1kIHx8ICcnLCAvLyBlLmcuICcyMDE3LTEwLTE5Jy4gZW1wdHkgc3RyaW5nIHdpbGwgZ2V0IGF2YWlsYWJpbGl0eSBmb3IgY3VycmVudCBkYXlcblx0XHRcdHJvb206IHRoaXMucm9vbUlkIC8vIHJvb21faWQgKHNwYWNlKVxuXHRcdH07XG5cbiAgICAgICAgcmV0dXJuICQucG9zdCh7XG5cdFx0XHR1cmw6IENDTC5hamF4X3VybCxcblx0XHRcdGRhdGE6IGRhdGFcblx0XHR9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUubWFrZVNjaGVkdWxlID0gZnVuY3Rpb24oZGF5RGF0YSl7XG5cbiAgICAgICAgLy8gZ2V0IG9iamVjdCBmb3IgZmlyc3Qgcm9vbSBpbiBhcnJheS4gd2UncmUgb25seSBjYWxsaW5nIGRhdGEgZm9yIG9uZSByb29tIGF0IGEgdGltZS5cbiAgICAgICAgLy8gY2hlY2sgZGF0YSB0eXBlIGFzIHdlbGwuIElmIGl0J3MgYSBzdHJpbmcsIHBhcnNlIHRvIEpTT04uXG4gICAgICAgIGRheURhdGEgPSAoIHR5cGVvZiBkYXlEYXRhID09PSAnc3RyaW5nJyApID8gSlNPTi5wYXJzZSggZGF5RGF0YSApWzBdIDogZGF5RGF0YVswXTtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgaHRtbCA9IFtdLFxuICAgICAgICAgICAgYXZhaWxhYmlsaXR5ID0gZGF5RGF0YS5hdmFpbGFiaWxpdHksXG4gICAgICAgICAgICBvbGRUb1RpbWU7XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gY29uc3RydWN0IEhUTUwgZm9yIGVhY2ggdGltZSBzbG90XG4gICAgICAgICQoZGF5RGF0YS5hdmFpbGFiaWxpdHkpLmVhY2goZnVuY3Rpb24oaSxpdGVtKXtcblxuICAgICAgICAgICAgdmFyIG5ld0Zyb21UaW1lID0gaXRlbS5mcm9tLFxuICAgICAgICAgICAgICAgIHNsb3REYXRlVGltZSA9IG5ldyBEYXRlKCBpdGVtLmZyb20gKTtcblxuICAgICAgICAgICAgLy8gY29tcGFyZSB0aGlzIGl0ZW0gYW5kIHRoZSBwcmV2aW91cyBpdGVtIHRvIGxvb2sgZm9yIGdhcHMgaW4gdGltZS5cbiAgICAgICAgICAgIC8vIGdhcHMgaW5kaWNhdGVkIGEgcmVzZXJ2ZWQgYmxvY2sgb2YgdGltZVxuICAgICAgICAgICAgaWYgKCBvbGRUb1RpbWUgJiYgb2xkVG9UaW1lICE9IG5ld0Zyb21UaW1lICApIHtcblxuICAgICAgICAgICAgICAgIHZhciBuZXdGcm9tVGltZVVuaXggPSBuZXcgRGF0ZShuZXdGcm9tVGltZSkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgICAgICBvbGRUb1RpbWVVbml4ID0gbmV3IERhdGUob2xkVG9UaW1lKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgIGRpZmZlcmVuY2UgPSBuZXdGcm9tVGltZVVuaXggLSBvbGRUb1RpbWVVbml4LFxuICAgICAgICAgICAgICAgICAgICBzbG90cztcblxuICAgICAgICAgICAgICAgIC8vIGdldCBkaWZmZXJlbmNlIGluIG1pbnV0ZXNcbiAgICAgICAgICAgICAgICBkaWZmZXJlbmNlID0gZGlmZmVyZW5jZSAvIDEwMDAgLyA2MDtcbiAgICAgICAgICAgICAgICBzbG90cyA9IGRpZmZlcmVuY2UgLyBfdGhpcy5zbG90TWludXRlcztcblxuICAgICAgICAgICAgICAgIC8vIGJ1aWxkIHNsb3RzIGZvciBvY2N1cGllZCAodW5zZWxlY3RhYmxlKSB0aW1lXG4gICAgICAgICAgICAgICAgZm9yICggdmFyIGogPSAwOyBqIDwgc2xvdHM7IGorKyApIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYWRkTWlsbGlzZWNvbmRzID0gaiAqIF90aGlzLnNsb3RNaW51dGVzICogNjAgKiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VW5peCA9IG9sZFRvVGltZVVuaXggKyBhZGRNaWxsaXNlY29uZHM7XG5cbiAgICAgICAgICAgICAgICAgICAgaHRtbC5wdXNoKCBfdGhpcy5tYWtlVGltZVNsb3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdzbG90LScgKyBfdGhpcy5yb29tSWQgKyAnLScgKyBpICsgJy0nICsgaixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiAnZGlzYWJsZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdjY2wtaXMtb2NjdXBpZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZnJvbTogX3RoaXMuZm9ybWF0RGF0ZVN0cmluZyggbmV3IERhdGUobmV3VW5peCkgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVTdHJpbmc6IF90aGlzLmZvcm1hdERhdGVTdHJpbmcoIG5ldyBEYXRlKG5ld1VuaXgpLCAncmVhZGFibGUnIClcbiAgICAgICAgICAgICAgICAgICAgfSkgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gYnVpbGQgc2VsZWN0YWJsZSB0aW1lIHNsb3RzXG4gICAgICAgICAgICBodG1sLnB1c2goIF90aGlzLm1ha2VUaW1lU2xvdCh7XG4gICAgICAgICAgICAgICAgaWQ6ICdzbG90LScgKyBfdGhpcy5yb29tSWQgKyAnLScgKyBpLFxuICAgICAgICAgICAgICAgIGZyb206IGl0ZW0uZnJvbSxcbiAgICAgICAgICAgICAgICB0bzogaXRlbS50byxcbiAgICAgICAgICAgICAgICB0aW1lU3RyaW5nOiBfdGhpcy5mb3JtYXREYXRlU3RyaW5nKCBzbG90RGF0ZVRpbWUsICdyZWFkYWJsZScgKVxuICAgICAgICAgICAgfSkgKTtcblxuICAgICAgICAgICAgLy8gdXBkYXRlIHZhcmlhYmxlIHRvIHRoZSBjdXJyZW50IGl0ZW0ncyBcInRvXCIgdmFsdWUuXG4gICAgICAgICAgICBvbGRUb1RpbWUgPSBpdGVtLnRvO1xuICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbXTtcblxuICAgICAgICB0aGlzLiRyb29tU2NoZWR1bGUuaHRtbCggaHRtbC5qb2luKCcnKSApO1xuXG4gICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXJvb21fX3Nsb3QgW3R5cGU9XCJjaGVja2JveFwiXScpO1xuXG4gICAgICAgIHRoaXMuc2V0Q3VycmVudER1cmF0aW9uVGV4dCgpO1xuXG4gICAgICAgIC8vIHRoaXMuc2V0T2NjdXBpZWRSb29tcygpO1xuXG4gICAgICAgIHRoaXMuaW5pdFNsb3RFdmVudHMoKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUubWFrZVRpbWVTbG90ID0gZnVuY3Rpb24odmFycyl7XG4gICAgICAgIFxuICAgICAgICBpZiAoICEgdmFycyB8fCB0eXBlb2YgdmFycyAhPT0gJ29iamVjdCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBjbGFzczogJycsXG4gICAgICAgICAgICBpZDogJycsXG4gICAgICAgICAgICBkaXNhYmxlZDogJycsXG4gICAgICAgICAgICBmcm9tOiAnJyxcbiAgICAgICAgICAgIHRvOiAnJyxcbiAgICAgICAgICAgIHRpbWVTdHJpbmc6ICcnXG4gICAgICAgIH07XG4gICAgICAgIHZhcnMgPSAkLmV4dGVuZChkZWZhdWx0cywgdmFycyk7XG5cbiAgICAgICAgdmFyIHRlbXBsYXRlID0gJycgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy1yb29tX19zbG90ICcgKyB2YXJzLmNsYXNzICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCInICsgdmFycy5pZCArICdcIiBuYW1lPVwiJyArIHZhcnMuaWQgKyAnXCIgdmFsdWU9XCInICsgdmFycy5mcm9tICsgJ1wiIGRhdGEtdG89XCInICsgdmFycy50byArICdcIiAnICsgdmFycy5kaXNhYmxlZCArICcvPicgK1xuICAgICAgICAgICAgICAgICc8bGFiZWwgY2xhc3M9XCJjY2wtYy1yb29tX19zbG90LWxhYmVsXCIgZm9yPVwiJyArIHZhcnMuaWQgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgICAgIHZhcnMudGltZVN0cmluZyArXG4gICAgICAgICAgICAgICAgJzwvbGFiZWw+JyArXG4gICAgICAgICAgICAnPC9kaXY+JztcblxuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0Rm9ybUV2ZW50cyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0bi5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJChfdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMpLmVhY2goZnVuY3Rpb24oaSxpbnB1dCl7XG4gICAgICAgICAgICAgICAgJChpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAuY2hhbmdlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCBjY2wtaGFzLXBvdGVudGlhbCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRlbC5zdWJtaXQoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLm9uU3VibWl0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0RGF0ZUV2ZW50cyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGRhdGVTZWxlY3QuY2hhbmdlKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBfdGhpcy5vbkRhdGVDaGFuZ2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uRGF0ZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZGF0ZVltZCA9IHRoaXMuJGRhdGVTZWxlY3QudmFsKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcblxuICAgICAgICB0aGlzLmdldFNwYWNlQXZhaWxhYmlsaXR5KHRoaXMuZGF0ZVltZClcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBfdGhpcy5tYWtlU2NoZWR1bGUoZGF0YSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBfdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuJHJlc2V0U2VsZWN0aW9uQnRuLmhpZGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICB9O1xuICAgICAgICBcbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdFNsb3RFdmVudHMgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgaWYgKCB0aGlzLiRyb29tU2xvdElucHV0cyAmJiB0aGlzLiRyb29tU2xvdElucHV0cy5sZW5ndGggKXtcblxuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5ob3ZlcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF90aGlzLm9uU2xvdE1vdXNlSW4odGhpcyk7XG4gICAgICAgICAgICB9LCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF90aGlzLm9uU2xvdE1vdXNlT3V0KHRoaXMpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGNsaWNrIGV2ZW50IGZpcmVzIEJFRk9SRSBjaGFuZ2UgZXZlbnRcbiAgICAgICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGlzO1xuICAgICAgICAgICAgICAgIF90aGlzLm9uU2xvdENsaWNrKGlucHV0LCBldmVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy4kcm9vbVNsb3RJbnB1dHMuY2hhbmdlKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhpcztcbiAgICAgICAgICAgICAgICBfdGhpcy5vblNsb3RDaGFuZ2UoaW5wdXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TbG90TW91c2VJbiA9IGZ1bmN0aW9uKGhvdmVyZWRTbG90KSB7XG5cbiAgICAgICAgLy8gaWYgeW91J3JlIG5vdCBzZWxlY3RpbmcgeW91ciAybmQgc2xvdCwgcmV0dXJuXG4gICAgICAgIGlmICggdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoICE9PSAxICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGhvdmVyZWRJbnB1dCA9ICQoaG92ZXJlZFNsb3QpLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKTtcblxuICAgICAgICB2YXIgaG92ZXJlZElucHV0SW5kZXggPSB0aGlzLiRyb29tU2xvdElucHV0cy5pbmRleChob3ZlcmVkSW5wdXQpLFxuICAgICAgICAgICAgc2VsZWN0ZWRJbnB1dEluZGV4ID0gdGhpcy4kcm9vbVNsb3RJbnB1dHMuaW5kZXgoIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzWzBdICksXG4gICAgICAgICAgICBpbnB1dEluZGV4U2V0ID0gW2hvdmVyZWRJbnB1dEluZGV4LCBzZWxlY3RlZElucHV0SW5kZXhdLnNvcnQoKTtcblxuICAgICAgICAvLyBpZiB5b3UncmUgaG92ZXJpbmcgdGhlIGFscmVhZHkgc2VsZWN0ZWQgc2xvdCwgcmV0dXJuXG4gICAgICAgIGlmICggaW5wdXRJbmRleFNldFswXSA9PT0gaW5wdXRJbmRleFNldFsxXSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIHRoZSBmaXJzdCBvciBsYXN0IGlucHV0IGluZGV4ZXMgYXJlIGJleW9uZCBib3VuZGFyaWVzLCByZXR1cm5cbiAgICAgICAgaWYgKCBpbnB1dEluZGV4U2V0WzBdIDw9IHNlbGVjdGVkSW5wdXRJbmRleCAtIHRoaXMubWF4U2xvdHMgfHwgaW5wdXRJbmRleFNldFsxXSA+PSBzZWxlY3RlZElucHV0SW5kZXggKyB0aGlzLm1heFNsb3RzICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZ2V0IGZpcnN0L2xhc3Qgc2xvdCBlbGVtZW50c1xuICAgICAgICB2YXIgJGZpcnN0U2xvdCA9IHRoaXMuJHJvb21TbG90SW5wdXRzLmVxKGlucHV0SW5kZXhTZXRbMF0pLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKSxcbiAgICAgICAgICAgICRsYXN0U2xvdCA9IHRoaXMuJHJvb21TbG90SW5wdXRzLmVxKGlucHV0SW5kZXhTZXRbMV0pLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKTtcblxuICAgICAgICAvLyBzZWxlY3Qgc2xvdHMgaW4gYmV0d2VlbiBmaXJzdCBhbmQgbGFzdFxuICAgICAgICAkZmlyc3RTbG90Lm5leHRVbnRpbCgkbGFzdFNsb3QpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICBpZiAoICEgJHRoaXMuaGFzQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpICkge1xuICAgICAgICAgICAgICAgICR0aGlzLmFkZENsYXNzKCdjY2wtaGFzLXBvdGVudGlhbCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TbG90TW91c2VPdXQgPSBmdW5jdGlvbihob3ZlcmVkSW5wdXQpIHtcblxuICAgICAgICBpZiAoIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCAhPT0gMSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1oYXMtcG90ZW50aWFsJyk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uU2xvdENsaWNrID0gZnVuY3Rpb24oY2xpY2tlZElucHV0LCBldmVudCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgY2xpY2tJbnB1dEluZGV4ID0gX3RoaXMuJHJvb21TbG90SW5wdXRzLmluZGV4KGNsaWNrZWRJbnB1dCksXG4gICAgICAgICAgICBtaW5JbmRleCA9IGNsaWNrSW5wdXRJbmRleCAtIF90aGlzLm1heFNsb3RzLFxuICAgICAgICAgICAgbWF4SW5kZXggPSBjbGlja0lucHV0SW5kZXggKyBfdGhpcy5tYXhTbG90cztcblxuICAgICAgICAvLyBkaXNhYmxlcyBzbG90cyB0aGF0IGFyZSBvdXRzaWRlIG9mIG1heCBzZWxlY3RhYmxlIGFyZWFcbiAgICAgICAgZnVuY3Rpb24gX2lzb2xhdGVTZWxlY3RhYmxlU2xvdHMoKSB7XG5cbiAgICAgICAgICAgIC8vIG9jY3VwaWVkIHNsb3RzIHdpbGwgYWZmZWN0IHdoYXQgbmVhcmJ5IHNsb3RzIGNhbiBiZSBzZWxlY3RlZFxuICAgICAgICAgICAgLy8gTG9vcCB0aHJvdWdoIGFueSBvY2N1cGllZCBzbG90cywgaWYgdGhleSBleGlzdFxuICAgICAgICAgICAgJCgnLmNjbC1jLXJvb21fX3Nsb3QuY2NsLWlzLW9jY3VwaWVkJykuZWFjaChmdW5jdGlvbihpLHNsb3Qpe1xuXG4gICAgICAgICAgICAgICAgLy8gZ2V0IG9jY3VwaWVkIHNsb3QncyBpbnB1dCwgZmluZCBpdCdzIGluZGV4IGFtb3VuZyBhbGwgc2xvdCBpbnB1dHNcbiAgICAgICAgICAgICAgICB2YXIgc2xvdElucHV0ID0gJChzbG90KS5maW5kKCdbdHlwZT1cImNoZWNrYm94XCJdJyksXG4gICAgICAgICAgICAgICAgICAgIG9jY3VwaWVkSW5kZXggPSBfdGhpcy4kcm9vbVNsb3RJbnB1dHMuaW5kZXgoc2xvdElucHV0KTtcblxuICAgICAgICAgICAgICAgIC8vIGlmIG9jY3VwaWVkIHNsb3QgZmFsbHMgaW4gdGhlIHNlbGVjdGFibGUgYXJlYVxuICAgICAgICAgICAgICAgIGlmICggbWluSW5kZXggPCBvY2N1cGllZEluZGV4ICYmIG9jY3VwaWVkSW5kZXggPCBtYXhJbmRleCApIHtcblxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBvY2N1cGllZCBzbG90IGlzIEJFRk9SRSBjbGlja2VkIHNsb3QsIHNldCBpdCBhcyB0aGUgbWluXG4gICAgICAgICAgICAgICAgICAgIGlmICggb2NjdXBpZWRJbmRleCA8IGNsaWNrSW5wdXRJbmRleCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbkluZGV4ID0gb2NjdXBpZWRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBpZiBvY2N1cGllZCBzbG90IGlzIEFGVEVSIGNsaWNrZWQgc2xvdCwgc2V0IGl0IGFzIHRoZSBtYXhcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBvY2N1cGllZEluZGV4ID4gY2xpY2tJbnB1dEluZGV4ICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4SW5kZXggPSBvY2N1cGllZEluZGV4O1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHNsb3RzLCBkaXNhYmxlIG9uZXMgdGhhdCBmYWxsIG91dHNpZGUgb2YgbWluL21heCBpbmRleGVzXG4gICAgICAgICAgICBfdGhpcy4kcm9vbVNsb3RJbnB1dHMuZWFjaChmdW5jdGlvbihpLGlucHV0KXtcbiAgICAgICAgICAgICAgICBpZiAoIGkgPD0gbWluSW5kZXggfHwgaSA+PSBtYXhJbmRleCApIHtcbiAgICAgICAgICAgICAgICAgICAgJChpbnB1dCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpLmFkZENsYXNzKCdjY2wtaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBpZiBubyBpbnB1dHMgeWV0IHNlbGVjdGVkLCB0aGlzIGlzIHRoZSBmaXJzdFxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gICAgICAgIGlmICggX3RoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCA9PT0gMCApIHtcblxuICAgICAgICAgICAgX2lzb2xhdGVTZWxlY3RhYmxlU2xvdHMoKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBpZiAxIGlucHV0IHNlbGVjdGVkLCBzZWxlY3RpbmcgMm5kIHNsb3RcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgICAgICBpZiAoIF90aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPT09IDEgKSB7XG5cbiAgICAgICAgICAgIGlmICggJChjbGlja2VkSW5wdXQpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5oYXNDbGFzcygnY2NsLWlzLWRpc2FibGVkJykgKSB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgJCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5yZW1vdmVDbGFzcygnY2NsLWlzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogaWYgMiBvciBtb3JlIHNsb3RzIGFscmVhZHkgc2VsZWN0ZWRcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgICAgICBpZiAoIF90aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPj0gMiApIHtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIGNsaWNrZWQgaW5wdXQgaXMgbm90IHBhcnQgb2YgY3VycmVudCBzZWxlY3Rpb25cbiAgICAgICAgICAgIC8vIGNsZWFyIGFsbCBzZWxlY3RlZCBpbnB1dHNcbiAgICAgICAgICAgIGlmICggX3RoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2YoIGNsaWNrZWRJbnB1dCApIDwgMCApIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIF90aGlzLmNsZWFyQWxsU2xvdHMoKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbXTtcblxuICAgICAgICAgICAgfSBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gaWYgY2xpY2tlZCBpbnB1dCBpcyBvbmUgb2YgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCBpbnB1dHNcbiAgICAgICAgICAgIC8vIGtlZXAgdGhhdCBvbmUgc2VsZWN0ZWQgYW5kIGRlc2VsZWN0IHRoZSByZXN0XG4gICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgIC8vIHByZXZlbnQgY2hhbmdlIGV2ZW50IGZyb20gZmlyaW5nXG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIC8vIGdldCB0aGUgaW5wdXQgaW5kZXggZnJvbSBhbW9uZyBzZWxlY3RlZCBpbnB1dHNcbiAgICAgICAgICAgICAgICB2YXIgc2VsZWN0ZWRTbG90SW5kZXggPSBfdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZiggY2xpY2tlZElucHV0ICksXG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkSW5wdXRzID0gJC5leHRlbmQoIFtdLCBfdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMgKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBjbGVhciBhbGwgaW5wdXRzIEVYQ0VQVCB0aGUgY2xpY2tlZCBvbmVcbiAgICAgICAgICAgICAgICBzZWxlY3RlZElucHV0cy5mb3JFYWNoKGZ1bmN0aW9uKGlucHV0LGkpe1xuICAgICAgICAgICAgICAgICAgICBpZiAoIHNlbGVjdGVkU2xvdEluZGV4ICE9IGkgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5jbGVhclNsb3QoaW5wdXQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gLy8gc2V0IHNlbGVjdGVkIGlucHV0cyB0byBqdXN0IHRoaXMgb25lXG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuc2VsZWN0ZWRTbG90SW5wdXRzID0gWyBfdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHNbc2VsZWN0ZWRTbG90SW5kZXhdIF07XG5cbiAgICAgICAgICAgICAgICAvLyB1cGRhdGUgdGhlIGN1cnJlbnQgZHVyYXRpb24gdGV4dFxuICAgICAgICAgICAgICAgIF90aGlzLnNldEN1cnJlbnREdXJhdGlvblRleHQoKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfaXNvbGF0ZVNlbGVjdGFibGVTbG90cygpO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblNsb3RDaGFuZ2UgPSBmdW5jdGlvbihjaGFuZ2VkSW5wdXQpe1xuICAgICAgICBcbiAgICAgICAgLy8gaWYgaW5wdXQgY2hlY2tlZCwgYWRkIGl0IHRvIHNlbGVjdGVkIHNldFxuICAgICAgICBpZiAoICQoY2hhbmdlZElucHV0KS5wcm9wKCdjaGVja2VkJykgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnB1c2goY2hhbmdlZElucHV0KTtcbiAgICAgICAgICAgICQoY2hhbmdlZElucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG4gICBcbiAgICAgICAgfSBcbiAgICAgICAgXG4gICAgICAgIC8vIGlmIGlucHV0IHVuY2hlY2tlZCwgcmVtb3ZlIGl0IGZyb20gdGhlIHNlbGVjdGVkIHNldFxuICAgICAgICBlbHNlIHsgXG5cbiAgICAgICAgICAgIHZhciBjaGFuZ2VkSW5wdXRJbmRleCA9IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2YoY2hhbmdlZElucHV0KTtcblxuICAgICAgICAgICAgaWYgKCBjaGFuZ2VkSW5wdXRJbmRleCA+IC0xICkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnNwbGljZSggY2hhbmdlZElucHV0SW5kZXgsIDEgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoY2hhbmdlZElucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRvZ2dsZSByZXNldCBidXR0b25cbiAgICAgICAgaWYgKCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4uc2hvdygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4uaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaWYgaGlnaGxpZ2h0IHNsb3RzIGJldHdlZW4gdHdvIGVuZHNcbiAgICAgICAgaWYgKCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPT09IDIgKSB7XG5cbiAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIF90aGlzLiRlbC5maW5kKCcuY2NsLWlzLWNoZWNrZWQnKS5maXJzdCgpLm5leHRVbnRpbCgnLmNjbC1pcy1jaGVja2VkJykuZWFjaChmdW5jdGlvbihpLHNsb3Qpe1xuICAgICAgICAgICAgICAgIHZhciBzbG90SW5wdXQgPSAkKHNsb3QpLmZpbmQoJ2lucHV0W3R5cGU9XCJjaGVja2JveFwiXScpO1xuICAgICAgICAgICAgICAgIF90aGlzLnNlbGVjdGVkU2xvdElucHV0cy5wdXNoKHNsb3RJbnB1dFswXSk7XG4gICAgICAgICAgICAgICAgX3RoaXMuYWN0aXZhdGVTbG90KHNsb3QpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldEN1cnJlbnREdXJhdGlvblRleHQoKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuY2xlYXJTbG90ID0gZnVuY3Rpb24oc2xvdCkge1xuICAgICAgICAvLyBzbG90IGNhbiBiZSBlaXRoZXIgdGhlIGNoZWNrYm94IGlucHV0IC1PUi0gdGhlIGNoZWNrYm94J3MgY29udGFpbmVyXG5cbiAgICAgICAgdmFyIGlucHV0SW5kZXg7XG5cbiAgICAgICAgLy8gaWYgaXQncyB0aGUgY2hlY2tib3guXG4gICAgICAgIGlmICggJChzbG90KS5pcygnW3R5cGU9XCJjaGVja2JveFwiXScpICkge1xuICAgICAgICAgXG4gICAgICAgICAgICAkKHNsb3QpXG4gICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLGZhbHNlKVxuICAgICAgICAgICAgICAgIC5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JylcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtaXMtY2hlY2tlZCBjY2wtaGFzLXBvdGVudGlhbCcpO1xuXG4gICAgICAgICAgICAvLyBnZXQgaW5kZXggb2YgdGhlIGlucHV0IGZyb20gc2VsZWN0ZWQgc2V0XG4gICAgICAgICAgICBpbnB1dEluZGV4ID0gdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZihzbG90KTtcbiAgICAgICAgICAgIFxuICAgICAgICAvLyBpZiBpdCdzIHRoZSBjb250YWluZXJcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdmFyICRpbnB1dCA9ICQoc2xvdCkuZmluZCgnW3R5cGU9XCJjaGVja2JveFwiXScpO1xuXG4gICAgICAgICAgICAkKHNsb3QpLnJlbW92ZUNsYXNzKCdjY2wtaXMtY2hlY2tlZCBjY2wtaGFzLXBvdGVudGlhbCcpO1xuICAgICAgICAgICAgJGlucHV0LnByb3AoJ2NoZWNrZWQnLGZhbHNlKTtcblxuICAgICAgICAgICAgLy8gZ2V0IGluZGV4IG9mIHRoZSBpbnB1dCBmcm9tIHNlbGVjdGVkIHNldFxuICAgICAgICAgICAgaW5wdXRJbmRleCA9IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2YoICRpbnB1dFswXSApO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgaW5wdXQgZnJvbSBzZWxlY3RlZCBzZXRcbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuc3BsaWNlKCBpbnB1dEluZGV4LCAxICk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmNsZWFyQWxsU2xvdHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgLy8gRXh0ZW5kIHRoZSBzZWxlY3RlZCBpbnB1dHMgYXJyYXkgdG8gYSBuZXcgdmFyaWFibGUuXG4gICAgICAgIC8vIFRoZSBzZWxlY3RlZCBpbnB1dHMgYXJyYXkgY2hhbmdlcyB3aXRoIGV2ZXJ5IGNsZWFyU2xvdCgpIGNhbGxcbiAgICAgICAgLy8gc28sIGJlc3QgdG8gbG9vcCB0aHJvdWdoIGFuIHVuY2hhbmdpbmcgYXJyYXkuXG4gICAgICAgIHZhciBzZWxlY3RlZElucHV0cyA9ICQuZXh0ZW5kKCBbXSwgX3RoaXMuc2VsZWN0ZWRTbG90SW5wdXRzICk7XG5cbiAgICAgICAgJChzZWxlY3RlZElucHV0cykuZWFjaChmdW5jdGlvbihpLGlucHV0KXtcbiAgICAgICAgICAgIF90aGlzLmNsZWFyU2xvdChpbnB1dCk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5hY3RpdmF0ZVNsb3QgPSBmdW5jdGlvbihzbG90KSB7XG4gICAgICAgIC8vIHNsb3QgY2FuIGJlIGVpdGhlciB0aGUgY2hlY2tib3ggLU9SLSB0aGUgY2hlY2tib3gncyBjb250YWluZXJcblxuICAgICAgICB2YXIgc2xvdElzQ2hlY2tib3ggPSAkKHNsb3QpLmlzKCdbdHlwZT1cImNoZWNrYm94XCJdJyksXG4gICAgICAgICAgICAkY29udGFpbmVyID0gc2xvdElzQ2hlY2tib3ggPyAkKHNsb3QpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKSA6ICQoc2xvdCk7XG5cbiAgICAgICAgLy8gbmV2ZXIgc2V0IGFuIG9jY3VwaWVkIHNsb3QgYXMgYWN0aXZlXG4gICAgICAgIGlmICggJGNvbnRhaW5lci5oYXNDbGFzcygnY2NsLWlzLW9jY3VwaWVkJykgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSApIHtcblxuICAgICAgICAgICAgLy8gaWYgaXQncyB0aGUgY2hlY2tib3guXG4gICAgICAgICBcbiAgICAgICAgICAgICQoc2xvdCkucHJvcCgnY2hlY2tlZCcsdHJ1ZSk7XG4gICAgICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKCdjY2wtaXMtY2hlY2tlZCcpO1xuICAgICAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIGlmIGl0J3MgdGhlIGNvbnRhaW5lclxuXG4gICAgICAgICAgICAkY29udGFpbmVyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdjY2wtaXMtY2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsdHJ1ZSk7XG5cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuc2V0Q3VycmVudER1cmF0aW9uVGV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSAkLmV4dGVuZChbXSx0aGlzLnNlbGVjdGVkU2xvdElucHV0cyksXG4gICAgICAgICAgICBzb3J0ZWRTZWxlY3Rpb24gPSBzZWxlY3Rpb24uc29ydChmdW5jdGlvbihhLGIpeyBcbiAgICAgICAgICAgICAgICByZXR1cm4gYS52YWx1ZSA+IGIudmFsdWU7IFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBzZWxlY3Rpb25MZW5ndGggPSBzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoO1xuICAgICAgICBcbiAgICAgICAgaWYgKCBzZWxlY3Rpb25MZW5ndGggPiAwICkge1xuXG4gICAgICAgICAgICB2YXIgdGltZTFWYWwgPSBzb3J0ZWRTZWxlY3Rpb25bMF0udmFsdWUsXG4gICAgICAgICAgICAgICAgcmVhZGFibGVUaW1lMSA9IHRoaXMuZm9ybWF0RGF0ZVN0cmluZyggbmV3IERhdGUodGltZTFWYWwpLCAncmVhZGFibGUnICk7XG5cbiAgICAgICAgICAgIHZhciB0aW1lMlZhbCA9ICggc2VsZWN0aW9uTGVuZ3RoID49IDIgKSA/IHNvcnRlZFNlbGVjdGlvbltzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoIC0gMV0udmFsdWUgOiB0aW1lMVZhbCxcbiAgICAgICAgICAgICAgICB0aW1lMlQgPSBuZXcgRGF0ZSh0aW1lMlZhbCkuZ2V0VGltZSgpICsgKCB0aGlzLnNsb3RNaW51dGVzICogNjAgKiAxMDAwICksXG4gICAgICAgICAgICAgICAgcmVhZGFibGVUaW1lMiA9IHRoaXMuZm9ybWF0RGF0ZVN0cmluZyggbmV3IERhdGUodGltZTJUKSwgJ3JlYWRhYmxlJyApO1xuXG4gICAgICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoICdGcm9tICcgKyByZWFkYWJsZVRpbWUxICsgJyB0byAnICsgcmVhZGFibGVUaW1lMiApO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoJ1BsZWFzZSBzZWxlY3QgYXZhaWxhYmxlIHRpbWUgc2xvdHMnKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnNldE1heFRpbWVUZXh0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG1heE1pbnV0ZXMgPSB0aGlzLm1heFNsb3RzICogdGhpcy5zbG90TWludXRlcyxcbiAgICAgICAgICAgIG1heFRleHQ7XG5cbiAgICAgICAgc3dpdGNoKG1heE1pbnV0ZXMpIHtcbiAgICAgICAgICAgIGNhc2UgMjQwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTgwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTIwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjA6XG4gICAgICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgLyA2MCArICcgaG91cnMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyArICdtaW5zJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJG1heFRpbWUudGV4dCggbWF4VGV4dCApO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuZm9ybWF0RGF0ZVN0cmluZyA9IGZ1bmN0aW9uKGRhdGVPYmosIHJlYWRhYmxlKXtcblxuICAgICAgICB2YXIgbWludXRlcyA9ICggZGF0ZU9iai5nZXRNaW51dGVzKCkudG9TdHJpbmcoKS5sZW5ndGggPCAyICkgPyAnMCcgKyBkYXRlT2JqLmdldE1pbnV0ZXMoKS50b1N0cmluZygpIDogZGF0ZU9iai5nZXRNaW51dGVzKCkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAoIHJlYWRhYmxlICkge1xuXG4gICAgICAgICAgICB2YXIgYW1wbSA9ICggZGF0ZU9iai5nZXRIb3VycygpID49IDEyICkgPyAncCcgOiAnYScsXG4gICAgICAgICAgICAgICAgaG91cjEyRm9ybWF0ID0gKCBkYXRlT2JqLmdldEhvdXJzKCkgPiAxMiApID8gZGF0ZU9iai5nZXRIb3VycygpIC0gMTIgOiBkYXRlT2JqLmdldEhvdXJzKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBob3VyMTJGb3JtYXQgKyAnOicgKyBtaW51dGVzICsgYW1wbTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB2YXIgaG91cnMgPSAoIGRhdGVPYmouZ2V0SG91cnMoKS50b1N0cmluZygpLmxlbmd0aCA8IDIgKSA/ICcwJyArIGRhdGVPYmouZ2V0SG91cnMoKS50b1N0cmluZygpIDogZGF0ZU9iai5nZXRIb3VycygpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9ICggZGF0ZU9iai5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKS5sZW5ndGggPCAyICkgPyAnMCcgKyBkYXRlT2JqLmdldFNlY29uZHMoKS50b1N0cmluZygpIDogZGF0ZU9iai5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZVltZCArICdUJyArIGhvdXJzICsgJzonICsgbWludXRlcyArICc6JyArIHNlY29uZHMgKyB0aGlzLnRpbWVab25lO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TdWJtaXQgPSBmdW5jdGlvbihldmVudCl7XG5cbiAgICAgICAgaWYgKCAhIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCApIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy4kZm9ybU5vdGlmaWNhdGlvblxuICAgICAgICAgICAgICAgIC5jc3MoJ2Rpc3BsYXknLCdub25lJylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1pcy1lcnJvcicpXG4gICAgICAgICAgICAgICAgLnRleHQoJ1BsZWFzZSBzZWxlY3QgYSB0aW1lIGZvciB5b3VyIHJlc2VydmF0aW9uJylcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8odGhpcy4kZm9ybUNvbnRlbnQpXG4gICAgICAgICAgICAgICAgLnNsaWRlRG93bihDQ0wuRFVSQVRJT04pOyAgICAgICAgICAgIFxuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZm9ybU5vdGlmaWNhdGlvbi5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBzb3J0ZWRTZWxlY3Rpb24gPSAkLmV4dGVuZChbXSwgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMpLnNvcnQoZnVuY3Rpb24oYSxiKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS52YWx1ZSA+IGIudmFsdWU7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHN0YXJ0ID0gc29ydGVkU2VsZWN0aW9uWzBdLnZhbHVlLFxuICAgICAgICAgICAgZW5kID0gKCBzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoID4gMSApID8gJCggc29ydGVkU2VsZWN0aW9uWyBzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoIC0gMSBdICkuZGF0YSgndG8nKSA6ICQoIHNvcnRlZFNlbGVjdGlvblswXSApLmRhdGEoJ3RvJyksXG4gICAgICAgICAgICBwYXlsb2FkID0ge1xuICAgICAgICAgICAgICAgIFwiaWlkXCI6MzMzLFxuICAgICAgICAgICAgICAgIFwic3RhcnRcIjogc3RhcnQsXG4gICAgICAgICAgICAgICAgXCJmbmFtZVwiOiB0aGlzLiRlbFswXS5mbmFtZS52YWx1ZSxcbiAgICAgICAgICAgICAgICBcImxuYW1lXCI6IHRoaXMuJGVsWzBdLmxuYW1lLnZhbHVlLFxuICAgICAgICAgICAgICAgIFwiZW1haWxcIjogdGhpcy4kZWxbMF0uZW1haWwudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJuaWNrbmFtZVwiOiB0aGlzLiRlbFswXS5uaWNrbmFtZS52YWx1ZSxcbiAgICAgICAgICAgICAgICBcImJvb2tpbmdzXCI6W1xuICAgICAgICAgICAgICAgICAgICB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidG9cIjogZW5kXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCAnb24gU3VibWl0IMK7ICcsIHBheWxvYWQgKTtcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcbiAgICAgICAgdGhpcy4kZm9ybUNhbmNlbC5wcm9wKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgIHRoaXMuJGZvcm1TdWJtaXQudGV4dCgnU2VuZGluZy4uLicpLnByb3AoJ2Rpc2FibGVkJyx0cnVlKTtcblxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIGFjdGlvbjogJ3JlcXVlc3RfYm9va2luZycsXG4gICAgICAgICAgICBjY2xfbm9uY2U6IENDTC5ub25jZSxcbiAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWRcbiAgICAgICAgfTtcblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTWFrZSBhIHJlcXVlc3QgaGVyZSB0byByZXNlcnZlIHNwYWNlXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgICAgICAkLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogQ0NMLmFqYXhfdXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgX2hhbmRsZVN1Ym1pdFJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBfdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBfaGFuZGxlU3VibWl0UmVzcG9uc2UocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgdmFyIHJlc3BvbnNlSFRNTCxcbiAgICAgICAgICAgICAgICByZXNwb25zZU9iamVjdCA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuXG4gICAgICAgICAgICBpZiAoIHJlc3BvbnNlT2JqZWN0LmJvb2tpbmdfaWQgKSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MID0gIFsnPHAgY2xhc3M9XCJjY2wtaDIgY2NsLXUtbXQtMFwiPlN1Y2Nlc3MhPC9wPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cCBjbGFzcz1cImNjbC1oNFwiPllvdXIgYm9va2luZyBJRCBpcyA8c3BhbiBjbGFzcz1cImNjbC11LWNvbG9yLXNjaG9vbFwiPicgKyByZXNwb25zZU9iamVjdC5ib29raW5nX2lkICsgJzwvc3Bhbj48L3A+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxwIGNsYXNzPVwiY2NsLWg0XCI+UGxlYXNlIGNoZWNrIHlvdXIgZW1haWwgdG8gY29uZmlybSB5b3VyIGJvb2tpbmcuPC9wPiddO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwgPSAgWyc8cCBjbGFzcz1cImNjbC1oMyBjY2wtdS1tdC0wXCI+U29ycnksIGJ1dCB3ZSBjb3VsZG5cXCd0IHByb2Nlc3MgeW91ciByZXNlcnZhdGlvbi48L3A+JywnPHAgY2xhc3M9XCJjY2wtaDRcIj5FcnJvcnM6PC9wPiddO1xuICAgICAgICAgICAgICAgICQocmVzcG9uc2VPYmplY3QuZXJyb3JzKS5lYWNoKGZ1bmN0aW9uKGksIGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MLnB1c2goJzxwIGNsYXNzPVwiY2NsLWMtYWxlcnQgY2NsLWlzLWVycm9yXCI+JyArIGVycm9yICsgJzwvcD4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwucHVzaCgnPHAgY2xhc3M9XCJjY2wtaDRcIj5QbGVhc2UgdGFsayB0byB5b3VyIG5lYXJlc3QgbGlicmFyaWFuIGZvciBoZWxwLjwvcD4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX3RoaXMuJGZvcm1DYW5jZWwucHJvcCgnZGlzYWJsZWQnLGZhbHNlKS50ZXh0KCdDbG9zZScpO1xuICAgICAgICAgICAgX3RoaXMuJGZvcm1TdWJtaXQucmVtb3ZlKCk7XG4gICAgICAgICAgICBfdGhpcy4kZm9ybUNvbnRlbnQuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIENDTC5EVVJBVElPTik7XG4gICAgICAgICAgICBfdGhpcy4kZm9ybVJlc3BvbnNlXG4gICAgICAgICAgICAgICAgLmRlbGF5KENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuaHRtbChyZXNwb25zZUhUTUwpO1xuICAgICAgICAgICAgX3RoaXMuJGZvcm1Db250ZW50XG4gICAgICAgICAgICAgICAgLmRlbGF5KENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZSh7aGVpZ2h0OiBfdGhpcy4kZm9ybVJlc3BvbnNlLmhlaWdodCgpICsgJ3B4JyB9LCBDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAgICAgLmNzcyh7ekluZGV4OiAnLTEnfSk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1yb29tLXJlcy1mb3JtJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFJvb21SZXNGb3JtKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU3RpY2tpZXNcbiAqIFxuICogQmVoYXZpb3VyIGZvciBzdGlja3kgZWxlbWVudHMuXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBpc0ZpeGVkOiAnY2NsLWlzLWZpeGVkJ1xuICAgICAgICB9O1xuXG4gICAgdmFyIFN0aWNreSA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICAvLyB2YXJpYWJsZXNcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpLFxuICAgICAgICAgICAgaGVpZ2h0ID0gJGVsLm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICBvZmZzZXQgPSAkZWwub2Zmc2V0KCksXG4gICAgICAgICAgICBvcHRpb25zID0gJGVsLmRhdGEoJ3N0aWNreScpLFxuICAgICAgICAgICAgd3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJqcy1zdGlja3ktd3JhcHBlclwiPjwvZGl2PicpLmNzcyh7IGhlaWdodDogaGVpZ2h0ICsgJ3B4JyB9KTtcblxuICAgICAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgfTtcblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zICk7XG5cbiAgICAgICAgLy8gd3JhcCBlbGVtZW50XG4gICAgICAgICRlbC53cmFwKCB3cmFwcGVyICk7XG5cbiAgICAgICAgLy8gc2Nyb2xsIGxpc3RlbmVyXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgMTAwICkgKTtcblxuICAgICAgICAvLyBvbiBzY3JvbGxcbiAgICAgICAgZnVuY3Rpb24gX29uU2Nyb2xsKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKSArIG9wdGlvbnMub2Zmc2V0O1xuICAgIFxuICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gb2Zmc2V0LnRvcCApIHtcbiAgICAgICAgICAgICAgICAkZWwuYWRkQ2xhc3MoIGNsYXNzTmFtZS5pc0ZpeGVkICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLmlzRml4ZWQgKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1pcy1zdGlja3knKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU3RpY2t5KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogVG9nZ2xlIFNjaG9vbHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIHNjaG9vbCB0b2dnbGVzXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIGluaXRTY2hvb2wgPSAkKCdodG1sJykuZGF0YSgnc2Nob29sJyk7XG5cbiAgICB2YXIgU2Nob29sU2VsZWN0ID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kc2VsZWN0ID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgU2Nob29sU2VsZWN0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIGlmICggaW5pdFNjaG9vbCApIHtcblxuICAgICAgICAgICAgdGhpcy4kc2VsZWN0XG4gICAgICAgICAgICAgICAgLmZpbmQoICdvcHRpb25bdmFsdWU9XCInICsgaW5pdFNjaG9vbCArICdcIl0nIClcbiAgICAgICAgICAgICAgICAuYXR0ciggJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyApOyAgIFxuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRzZWxlY3QuY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hdHRyKCAgJ2RhdGEtc2Nob29sJywgZXZlbnQudGFyZ2V0LnZhbHVlICk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJzY2hvb2xcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU2Nob29sU2VsZWN0KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIFRvb2x0aXBzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciB0b29sdGlwc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgVG9vbHRpcCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy4kZWwuYXR0cigndGl0bGUnKTtcbiAgICAgICAgdGhpcy4kdG9vbHRpcCA9ICQoJzxkaXYgaWQ9XCJjY2wtY3VycmVudC10b29sdGlwXCIgY2xhc3M9XCJjY2wtYy10b29sdGlwIGNjbC1pcy10b3BcIiByb2xlPVwidG9vbHRpcFwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19hcnJvd1wiPjwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19pbm5lclwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBUb29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuaG92ZXIoZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIC8vIG1vdXNlb3ZlclxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCAnJyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cignYXJpYS1kZXNjcmliZWRieScsICdjY2wtY3VycmVudC10b29sdGlwJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblxuICAgICAgICAgICAgQ0NMLnJlZmxvdyhfdGhpcy4kdG9vbHRpcFswXSk7XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBfdGhpcy4kZWwub2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgd2lkdGggID0gX3RoaXMuJGVsLm91dGVyV2lkdGgoKSxcbiAgICAgICAgICAgICAgICB0b29sdGlwSGVpZ2h0ID0gX3RoaXMuJHRvb2x0aXAub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuY3NzKHtcbiAgICAgICAgICAgICAgICB0b3A6IChvZmZzZXQudG9wIC0gdG9vbHRpcEhlaWdodCkgKyAncHgnLFxuICAgICAgICAgICAgICAgIGxlZnQ6IChvZmZzZXQubGVmdCArICh3aWR0aC8yKSkgKyAncHgnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgIH0sIGZ1bmN0aW9uKGUpeyBcblxuICAgICAgICAgICAgLy9tb3VzZW91dFxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCBfdGhpcy5jb250ZW50KTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgJycpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlKCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBUb29sdGlwKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogV2F5ZmluZGluZ1xuICogXG4gKiBDb250cm9scyBpbnRlcmZhY2UgZm9yIGxvb2tpbmcgdXAgY2FsbCBudW1iZXIgbG9jYXRpb25zXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICB0YWJzLCB3YXlmaW5kZXI7XG4gICAgXG4gICAgdmFyIFRhYnMgPSBmdW5jdGlvbihlbCkge1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdGFicyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy10YWInKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMgPSAkKCcuY2NsLWMtdGFiX19jb250ZW50Jyk7XG4gICAgICAgIFxuXG4gICAgICAgIHRoaXMuJHRhYnMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICR0YWIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHRhYi5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICR0YWIuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0QWN0aXZlKHRhcmdldCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFRhYnMucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKHRhcmdldCl7XG4gICAgICAgIHRoaXMuJHRhYnMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFicy5maWx0ZXIoJ1tocmVmPVwiJyt0YXJnZXQrJ1wiXScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIHZhciBXYXlmaW5kZXIgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuY2FsbE51bWJlcnMgPSB7fTtcbiAgICAgICAgdGhpcy4kZm9ybSA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bWJlci1zZWFyY2gnKTtcbiAgICAgICAgdGhpcy4kaW5wdXQgPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW0taW5wdXQnKTtcbiAgICAgICAgdGhpcy4kc3VibWl0ID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtLXN1Ym1pdCcpO1xuICAgICAgICB0aGlzLiRtYXJxdWVlID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fbWFycXVlZScpO1xuICAgICAgICB0aGlzLiRjYWxsTnVtID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fY2FsbC1udW0nKTtcbiAgICAgICAgdGhpcy4kd2luZyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX3dpbmcnKTtcbiAgICAgICAgdGhpcy4kZmxvb3IgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19mbG9vcicpO1xuICAgICAgICB0aGlzLiRzdWJqZWN0ID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fc3ViamVjdCcpO1xuICAgICAgICB0aGlzLmVycm9yID0ge1xuICAgICAgICAgICAgZ2V0OiAnPGRpdiBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvciBjY2wtd2F5ZmluZGVyX19lcnJvclwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2NsLWItY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPjxpIGNsYXNzPVwiY2NsLWItaWNvbiBhbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gVGhlcmUgd2FzIGFuIGVycm9yIGZldGNoaW5nIGNhbGwgbnVtYmVycy48L2Rpdj4nLFxuICAgICAgICAgICAgZmluZDogJzxkaXYgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3IgY2NsLXdheWZpbmRlcl9fZXJyb3JcIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNjbC1iLWNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj48aSBjbGFzcz1cImNjbC1iLWljb24gYWxlcnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IENvdWxkIG5vdCBmaW5kIHRoYXQgY2FsbCBudW1iZXIuIFBsZWFzZSB0cnkgYWdhaW4uPC9kaXY+J1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRlcnJvckJveCA9ICQoJy5jY2wtZXJyb3ItYm94Jyk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAkLmdldEpTT04oIENDTC5hc3NldHMgKyAnanMvY2FsbC1udW1iZXJzLmpzb24nIClcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIF90aGlzLmNhbGxOdW1iZXJzID0gZGF0YTtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGVycm9yQm94LmFwcGVuZCggdGhpcy5lcnJvci5nZXQgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1hcHAtYWN0aXZlJyk7XG5cbiAgICAgICAgdGhpcy4kaW5wdXRcbiAgICAgICAgICAgIC5rZXl1cChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHF1ZXJ5ID09PSBcIlwiICkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3VibWl0LmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRtYXJxdWVlLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVzZXQoKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGZvcm0uc3VibWl0KGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBfdGhpcy4kaW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgICQoJy5jY2wtd2F5ZmluZGVyX19lcnJvcicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuc2hvdygpO1xuICAgICAgICAgICAgX3RoaXMuJGNhbGxOdW0udGV4dChxdWVyeSk7XG4gICAgICAgICAgICBfdGhpcy5maW5kUm9vbSggcXVlcnkgKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5nZXRDYWxsS2V5ID0gZnVuY3Rpb24oY2FsbE51bSkge1xuICAgICAgICB2YXIga2V5LFxuICAgICAgICAgICAgY2FsbEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmNhbGxOdW1iZXJzKTtcblxuICAgICAgICBpZiAoIGNhbGxLZXlzLmxlbmd0aCA9PT0gMCApe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbEtleXMuZm9yRWFjaChmdW5jdGlvbihrKXtcbiAgICAgICAgICBpZiAoIGNhbGxOdW0gPj0gayApIHtcbiAgICAgICAgICAgIGtleSA9IGs7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmZpbmRSb29tID0gZnVuY3Rpb24ocXVlcnkpIHtcblxuICAgICAgICBxdWVyeSA9IHF1ZXJ5LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgY2FsbEtleSA9IHRoaXMuZ2V0Q2FsbEtleShxdWVyeSksXG4gICAgICAgICAgICBjYWxsRGF0YSA9IHt9LFxuICAgICAgICAgICAgcm9vbTtcblxuICAgICAgICBpZiAoICEgY2FsbEtleSApIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dGaW5kRXJyb3IoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKCcuY2NsLWMtc2VhcmNoJykub2Zmc2V0KCkudG9wIH0pO1xuICAgICAgICBcbiAgICAgICAgY2FsbERhdGEgPSB0aGlzLmNhbGxOdW1iZXJzW2NhbGxLZXldO1xuXG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoIGNhbGxEYXRhLmZsb29yICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggY2FsbERhdGEud2luZyApO1xuICAgICAgICB0aGlzLiRzdWJqZWN0LnRleHQoIGNhbGxEYXRhLnN1YmplY3QgKTtcblxuICAgICAgICAvKiBUT0RPOlxuICAgICAgICAgKiBzZXQgQUNUVUFMIHJvb20sIG5vdCBqdXN0IHRoZSBmbG9vci4gc3RpbGwgd2FpdGluZyBvbiBjbGllbnQgXG4gICAgICAgICAqIHRvIHByb3ZpZGUgZGF0YSBmb3Igd2hpY2ggY2FsbCBudW1iZXJzIGJlbG9uZyB0byB3aGljaCByb29tc1xuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgICAgIHJvb20gPSBjYWxsRGF0YS5mbG9vcl9pbnQ7XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWY9XCIjZmxvb3ItJytyb29tKydcIl0nKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjcm9vbS0nK3Jvb20rJy0xJykuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcblxuICAgICAgICB0YWJzLnNldEFjdGl2ZSggJyNmbG9vci0nICsgcm9vbSApO1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUudGhyb3dGaW5kRXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdC50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiRlcnJvckJveC5hcHBlbmQoIHRoaXMuZXJyb3IuZmluZCApO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWpzLXRhYnMnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0YWJzID0gbmV3IFRhYnModGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuY2NsLWpzLXdheWZpbmRlcicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHdheWZpbmRlciA9IG5ldyBXYXlmaW5kZXIodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIl19
