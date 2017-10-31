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
                    "from": "2017-10-20T08:00:00-07:00",
                    "to": "2017-10-20T08:30:00-07:00"
                },
                {
                    "from": "2017-10-20T08:30:00-07:00",
                    "to": "2017-10-20T09:00:00-07:00"
                },
                {
                    "from": "2017-10-20T09:00:00-07:00",
                    "to": "2017-10-20T09:30:00-07:00"
                },
                {
                    "from": "2017-10-20T09:30:00-07:00",
                    "to": "2017-10-20T10:00:00-07:00"
                },
                {
                    "from": "2017-10-20T10:00:00-07:00",
                    "to": "2017-10-20T10:30:00-07:00"
                },
                {
                    "from": "2017-10-20T10:30:00-07:00",
                    "to": "2017-10-20T11:00:00-07:00"
                },
                // {
                //     "from": "2017-10-20T11:00:00-07:00",
                //     "to": "2017-10-20T11:30:00-07:00"
                // },
                {
                    "from": "2017-10-20T11:30:00-07:00",
                    "to": "2017-10-20T12:00:00-07:00"
                },
                // {
                //     "from": "2017-10-20T12:00:00-07:00",
                //     "to": "2017-10-20T12:30:00-07:00"
                // },
                {
                    "from": "2017-10-20T12:30:00-07:00",
                    "to": "2017-10-20T13:00:00-07:00"
                },
                {
                    "from": "2017-10-20T13:00:00-07:00",
                    "to": "2017-10-20T13:30:00-07:00"
                },
                // {
                //     "from": "2017-10-20T13:30:00-07:00",
                //     "to": "2017-10-20T14:00:00-07:00"
                // },
                // {
                //     "from": "2017-10-20T14:00:00-07:00",
                //     "to": "2017-10-20T14:30:00-07:00"
                // },
                {
                    "from": "2017-10-20T14:30:00-07:00",
                    "to": "2017-10-20T15:00:00-07:00"
                },
                {
                    "from": "2017-10-20T15:00:00-07:00",
                    "to": "2017-10-20T15:30:00-07:00"
                },
                {
                    "from": "2017-10-20T15:30:00-07:00",
                    "to": "2017-10-20T16:00:00-07:00"
                },
                {
                    "from": "2017-10-20T16:00:00-07:00",
                    "to": "2017-10-20T16:30:00-07:00"
                },
                {
                    "from": "2017-10-20T16:30:00-07:00",
                    "to": "2017-10-20T17:00:00-07:00"
                },
                {
                    "from": "2017-10-20T17:00:00-07:00",
                    "to": "2017-10-20T17:30:00-07:00"
                },
                {
                    "from": "2017-10-20T17:30:00-07:00",
                    "to": "2017-10-20T18:00:00-07:00"
                },
                {
                    "from": "2017-10-20T18:00:00-07:00",
                    "to": "2017-10-20T18:30:00-07:00"
                },
                {
                    "from": "2017-10-20T18:30:00-07:00",
                    "to": "2017-10-20T19:00:00-07:00"
                },
                {
                    "from": "2017-10-20T19:00:00-07:00",
                    "to": "2017-10-20T19:30:00-07:00"
                },
                {
                    "from": "2017-10-20T19:30:00-07:00",
                    "to": "2017-10-20T20:00:00-07:00"
                },
                {
                    "from": "2017-10-20T20:00:00-07:00",
                    "to": "2017-10-20T20:30:00-07:00"
                },
                {
                    "from": "2017-10-20T20:30:00-07:00",
                    "to": "2017-10-20T21:00:00-07:00"
                },
                {
                    "from": "2017-10-20T21:00:00-07:00",
                    "to": "2017-10-20T21:30:00-07:00"
                },
                {
                    "from": "2017-10-20T21:30:00-07:00",
                    "to": "2017-10-20T22:00:00-07:00"
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
        this.roomId= this.$el.data('resource-id');
        this.$dateSelect = this.$el.find('.js-room-date-select');
        this.dateYmd = this.$dateSelect.val();
        this.$roomSchedule = this.$el.find('.js-room-schedule');
        this.$currentDurationText = this.$el.find('.js-current-duration');
        this.$resetSelectionBtn = this.$el.find('.js-reset-selection'); 
        this.$roomSlotInputs = null;
        this.selectedSlotInputs = [];
        this.lastSelectedSlot = false;
        this.maxSlots = 4;
        this.$maxTime = this.$el.find('.js-max-time');
        this.slotMinutes = 30;
        this.timeZone = '-700';
        this.openTime = new Date( now.getFullYear(), now.getMonth(), now.getDate(), 8 ); // 8am today
        this.closeTime = new Date( now.getFullYear(), now.getMonth(), now.getDate(), 17 ); // 5pm today;

        var _this = this;

        this.init();

    };

    RoomResForm.prototype.init = function(){

        var _this = this,
            todayYmd= new Date().toISOString().split('T')[0];

        this.$el.addClass('ccl-is-loading');

        this.setMaxTimeText();

        this.getSpaceAvailability(todayYmd)
            .done(function(data){
                
                // TODO: Remove
                // use dummy text
                data = dummyAvailabilityData;
                
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

        /* TODO:
         * Make a GET request here for space availability.
         * https://claremont.libcal.com/admin_api.php?version=1.1&endpoint=space_get
         * ------------------------------------------ */
        return $.get({
            // url: CCL.site_url + 'api/rooms/availability/9148',
            url: '#',
            data: {
                'availability': Ymd // e.g. '2017-10-19'
            }
        });

    };

    RoomResForm.prototype.makeSchedule = function(dayData){

        // get object for first room in array. we're only calling data for one room at a time.
        dayData = dayData[0];

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
                        value: _this.formatDateString( new Date(newUnix) ),
                        timeString: _this.formatDateString( new Date(newUnix), 'readable' )
                    }) );
                }

            }
            
            // build selectable time slots
            html.push( _this.makeTimeSlot({
                id: 'slot-' + _this.roomId + '-' + i,
                value: _this.formatDateString( slotDateTime ),
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
            value: '',
            timeString: ''
        };
        vars = $.extend(defaults, vars);

        var template = '' +
            '<div class="ccl-c-room__slot ' + vars.class + '">' +
                '<input type="checkbox" id="' + vars.id + '" name="' + vars.id + '" value="' + vars.value + '" ' + vars.disabled + '/>' +
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
            $('.ccl-c-room__slot').removeClass('ccl-is-disabled');
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

    RoomResForm.prototype.initSlotEvents = function(){
        var _this = this;
        
        if ( this.$roomSlotInputs && this.$roomSlotInputs.length ){

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

    RoomResForm.prototype.onDateChange = function() {

        var _this = this;
        
        this.dateYmd = this.$dateSelect.val();
        
        this.$el.removeClass('ccl-is-loading');

        this.getSpaceAvailability(this.dateYmd)
            .done(function(data){
                
                // TODO: Remove
                // use dummy text
                data = dummyAvailabilityData;
                
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
                    .removeClass('ccl-is-checked');

            // get index of the input from selected set
            inputIndex = this.selectedSlotInputs.indexOf(slot);
            
        // if it's the container
        } else {

            var $input = $(slot).find('[type="checkbox"]');

            $(slot).removeClass('ccl-is-checked');
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
        
        if ( selectionLength > 1 ) {

            var time1Val = sortedSelection[0].value.slice(0,-4),
                readableTime1 = this.formatDateString( new Date(time1Val), 'readable' );

            var time2Val = sortedSelection[sortedSelection.length - 1].value.slice(0,-4),
                time2T = new Date(time2Val).getTime() + ( this.slotMinutes * 60 * 1000 ),
                readableTime2 = this.formatDateString( new Date(time2T), 'readable' );
                
            this.$currentDurationText.text( readableTime1 + ' to ' + readableTime2 );

        } else if ( selectionLength > 0 ) {

            var timeVal = sortedSelection[0].value.slice(0,-4),
                readableTime = this.formatDateString( new Date(timeVal), 'readable' );
            this.$currentDurationText.text( readableTime + ' to ?' );

        } else {

            this.$currentDurationText.text('None');

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

    RoomResForm.prototype.onSubmit = function(){

        var _this = this;

        /* TODO:
         * Populate "bookings" array with correct data
         * ------------------------------------------ */
        var payload = {
            "iid":333,
            "start": this.selectedSlotInputs[0].value,
            "fname": this.$el[0].fname.value,
            "lname": this.$el[0].lname.value,
            "email": this.$el[0].email.value,
            "nickname": this.$el[0].nickname.value,
            "bookings":[
                { 
                    "id": this.roomId,
                    // using 3pm as end time for now
                    "to": this.dateYmd + "T15:00:00" + this.timeZone
                }
            ]
        };

        console.log( 'onSubmit » ', payload );

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
                handleSubmitResponse(response);
            })
            .fail(function(error){
                console.log(error);
            })
            .always(function(){
                _this.$el.removeClass('ccl-is-loading');
            });

        function handleSubmitResponse(response) {

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

    // Private Functions
    // ------------------------------------------------------- //

    function _sortObjectArray( array, key, order ) {
        if ( ! array || ! key ) {
            return;
        }
        if ( ! order ) {
            order = 'ASC';
        }
        if ( order === 'ASC' ) {
            return array.sort( function(a,b){ 
                return a[key] > b[key]; 
            });
        } else if ( order === 'DESC' ) {
            return array.sort( function(a,b){ 
                return a[key] < b[key]; 
            });
        } else {
            return array;
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkcm9wZG93bnMuanMiLCJtb2RhbHMuanMiLCJyb29tLXJlcy5qcyIsInN0aWNraWVzLmpzIiwidG9nZ2xlLXNjaG9vbHMuanMiLCJ0b29sdGlwcy5qcyIsIndheWZpbmRpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2x6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogR2xvYmFsIFZhcmlhYmxlcy4gXG4gKi9cblxuXG4oZnVuY3Rpb24gKCAkLCB3aW5kb3cgKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcbiAgICBcbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5EVVJBVElPTiA9IDMwMDtcblxuICAgIENDTC5CUkVBS1BPSU5UX1NNID0gNTAwO1xuICAgIENDTC5CUkVBS1BPSU5UX01EID0gNzY4O1xuICAgIENDTC5CUkVBS1BPSU5UX0xHID0gMTAwMDtcbiAgICBDQ0wuQlJFQUtQT0lOVF9YTCA9IDE1MDA7XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdodG1sJykudG9nZ2xlQ2xhc3MoJ25vLWpzIGpzJyk7XG4gICAgfSk7XG5cbn0pKGpRdWVyeSwgdGhpcyk7IiwiLyoqXG4gKiBSZWZsb3cgcGFnZSBlbGVtZW50cy4gXG4gKiBcbiAqIEVuYWJsZXMgYW5pbWF0aW9ucy90cmFuc2l0aW9ucyBvbiBlbGVtZW50cyBhZGRlZCB0byB0aGUgcGFnZSBhZnRlciB0aGUgRE9NIGhhcyBsb2FkZWQuXG4gKi9cblxuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wucmVmbG93ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH07XG5cbn0pKCk7IiwiLyoqXG4gKiBHZXQgdGhlIFNjcm9sbGJhciB3aWR0aFxuICogVGhhbmtzIHRvIGRhdmlkIHdhbHNoOiBodHRwczovL2Rhdmlkd2Fsc2gubmFtZS9kZXRlY3Qtc2Nyb2xsYmFyLXdpZHRoXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgXG4gICAgZnVuY3Rpb24gZ2V0U2Nyb2xsV2lkdGgoKSB7XG4gICAgICAgIFxuICAgICAgICAvLyBDcmVhdGUgdGhlIG1lYXN1cmVtZW50IG5vZGVcbiAgICAgICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIFxuICAgICAgICAvLyBwb3NpdGlvbiB3YXkgdGhlIGhlbGwgb2ZmIHNjcmVlblxuICAgICAgICAkKHNjcm9sbERpdikuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwcHgnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwcHgnLFxuICAgICAgICAgICAgb3ZlcmZsb3c6ICdzY3JvbGwnLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6ICctOTk5OXB4JyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnYm9keScpLmFwcGVuZChzY3JvbGxEaXYpO1xuXG4gICAgICAgIC8vIEdldCB0aGUgc2Nyb2xsYmFyIHdpZHRoXG4gICAgICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgICAgICAgLy8gY29uc29sZS53YXJuKHNjcm9sbGJhcldpZHRoKTsgLy8gTWFjOiAgMTVcblxuICAgICAgICAvLyBEZWxldGUgdGhlIERJViBcbiAgICAgICAgJChzY3JvbGxEaXYpLnJlbW92ZSgpO1xuXG4gICAgICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aDtcbiAgICB9XG4gICAgXG4gICAgaWYgKCAhIHdpbmRvdy5DQ0wgKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wuZ2V0U2Nyb2xsV2lkdGggPSBnZXRTY3JvbGxXaWR0aDtcbiAgICBDQ0wuU0NST0xMQkFSV0lEVEggPSBnZXRTY3JvbGxXaWR0aCgpO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiAuZGVib3VuY2UoKSBmdW5jdGlvblxuICogXG4gKiBTb3VyY2U6IGh0dHBzOi8vZGF2aWR3YWxzaC5uYW1lL2phdmFzY3JpcHQtZGVib3VuY2UtZnVuY3Rpb25cbiAqL1xuXG5cbihmdW5jdGlvbih3aW5kb3cpIHtcblxuICAgIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAgIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAgIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAgIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICAgIHZhciB0aHJvdHRsZSA9IGZ1bmN0aW9uIChmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgICAgIHZhciB0aW1lb3V0LCBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB0aHJvdHRsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcblxuICAgICAgICB0aHJvdHRsZWQuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgcHJldmlvdXMgPSAwO1xuICAgICAgICAgICAgdGltZW91dCA9IGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdGhyb3R0bGVkO1xuICAgIH07XG5cbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIHdpbmRvdy5DQ0wudGhyb3R0bGUgPSB0aHJvdHRsZTtcblxufSkodGhpcyk7IiwiLyoqXG4gKiBBY2NvcmRpb25zXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBhY2NvcmRpb24gY29tcG9uZW50c1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgQWNjb3JkaW9uID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiR0b2dnbGUgPSB0aGlzLiRlbC5jaGlsZHJlbignLmNjbC1jLWFjY29yZGlvbl9fdG9nZ2xlJyk7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQgPSB0aGlzLiRlbC5jaGlsZHJlbignLmNjbC1jLWFjY29yZGlvbl9fY29udGVudCcpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgQWNjb3JkaW9uLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiR0b2dnbGUub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy4kY29udGVudC5zbGlkZVRvZ2dsZSgpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLnRvZ2dsZUNsYXNzKCdjY2wtaXMtb3BlbicpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWMtYWNjb3JkaW9uJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IEFjY29yZGlvbih0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIEFsZXJ0c1xuICogXG4gKiBCZWhhdmlvciBmb3IgYWxlcnRzXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIERVUkFUSU9OID0gQ0NMLkRVUkFUSU9OO1xuXG4gICAgdmFyIEFsZXJ0RGlzbWlzcyA9IGZ1bmN0aW9uKCRlbCl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICAgICAgdGhpcy50YXJnZXQgPSAkZWwucGFyZW50KCk7XG4gICAgICAgIHRoaXMuJHRhcmdldCA9ICQodGhpcy50YXJnZXQpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEFsZXJ0RGlzbWlzcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgX3RoaXMuJHRhcmdldC5hbmltYXRlKCB7IG9wYWNpdHk6IDAgfSwge1xuICAgICAgICAgICAgZHVyYXRpb246IERVUkFUSU9OLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5zbGlkZVVwKCBEVVJBVElPTiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG5cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCAnY2xpY2snLCAnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICB2YXIgZGlzbWlzc0VsID0gJChlLnRhcmdldCkuY2xvc2VzdCgnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJyk7XG4gICAgICAgICAgICBuZXcgQWxlcnREaXNtaXNzKGRpc21pc3NFbCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICogQ2Fyb3VzZWxzXG4gKiBcbiAqIEluaXRpYWxpemUgYW5kIGRlZmluZSBiZWhhdmlvciBmb3IgY2Fyb3VzZWxzLiBcbiAqIFVzZXMgdGhlIFNsaWNrIFNsaWRlcyBqUXVlcnkgcGx1Z2luIC0tPiBodHRwOi8va2Vud2hlZWxlci5naXRodWIuaW8vc2xpY2svXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBDYXJvdXNlbCA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLmdsb2JhbERlZmF1bHRzID0ge1xuICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICBkb3RzQ2xhc3M6ICdjY2wtYy1jYXJvdXNlbF9fcGFnaW5nJyxcbiAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgIH07XG5cbiAgICBDYXJvdXNlbC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuJGVsLmRhdGEoKSxcbiAgICAgICAgICAgIG9wdGlvbnMgPSBkYXRhLm9wdGlvbnMgfHwge307XG4gICAgICAgICAgICBcbiAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlID0gW107XG5cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNTbSApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9TTSwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc1NtXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc01kICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX01ELCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zTWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zTGcgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfTEcsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNMZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNYbCApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9YTCwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc1hsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCggdGhpcy5nbG9iYWxEZWZhdWx0cywgb3B0aW9ucyApO1xuXG4gICAgICAgIHZhciBjYXJvdXNlbCA9IHRoaXMuJGVsLnNsaWNrKG9wdGlvbnMpLFxuICAgICAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGNhcm91c2VsLm9uKCdiZWZvcmVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKXtcbiAgICAgICAgICAgIF90aGlzLiRlbC5maW5kKCcuc2xpY2stc2xpZGUnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXBhc3QnKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5maW5kKCcuc2xpY2stc2xpZGVbZGF0YS1zbGljay1pbmRleD1cIicrbmV4dFNsaWRlKydcIl0nKS5wcmV2QWxsKCkuYWRkQ2xhc3MoJ2NjbC1pcy1wYXN0Jyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtcHJvbW8tY2Fyb3VzZWwnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgQ2Fyb3VzZWwodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBEcm9wZG93bnNcbiAqIFxuICogSW5pdGlhbGl6ZSBhbmQgY29udHJvbCBiZWhhdmlvciBmb3IgZHJvcGRvd24gbWVudXNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgVE9HR0xFOiAnW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBBQ1RJVkU6ICdjY2wtaXMtYWN0aXZlJyxcbiAgICAgICAgICAgIE1FTlU6ICdjY2wtYy1kcm9wZG93bl9fbWVudSdcbiAgICAgICAgfTtcblxuICAgIHZhciBEcm9wZG93blRvZ2dsZSA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHBhcmVudCA9IHRoaXMuJHRvZ2dsZS5wYXJlbnQoKTtcbiAgICAgICAgXG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLiR0b2dnbGUuZGF0YSgndGFyZ2V0Jyk7XG5cbiAgICAgICAgdGhpcy4kbWVudSA9ICQoIHRhcmdldCApO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHRvZ2dsZS5jbGljayggZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgX3RoaXMudG9nZ2xlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICB2YXIgaGFzQWN0aXZlTWVudXMgPSAkKCAnLicgKyBjbGFzc05hbWUuTUVOVSArICcuJyArIGNsYXNzTmFtZS5BQ1RJVkUgKS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoIGhhc0FjdGl2ZU1lbnVzICl7XG4gICAgICAgICAgICAgICAgX2NsZWFyTWVudXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGlzQWN0aXZlID0gdGhpcy4kdG9nZ2xlLmhhc0NsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG5cbiAgICAgICAgaWYgKCBpc0FjdGl2ZSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2hvd01lbnUoKTtcblxuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuc2hvd01lbnUgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiR0b2dnbGUuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgIHRoaXMuJG1lbnUuYWRkQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgdGhpcy4kcGFyZW50LmFkZENsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5oaWRlTWVudSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgIHRoaXMuJG1lbnUucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgdGhpcy4kcGFyZW50LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9jbGVhck1lbnVzKCkge1xuICAgICAgICAkKCcuY2NsLWMtZHJvcGRvd24sIC5jY2wtYy1kcm9wZG93bl9fbWVudScpLnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgICQoIHNlbGVjdG9yLlRPR0dMRSApLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCBzZWxlY3Rvci5UT0dHTEUgKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgRHJvcGRvd25Ub2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBNb2RhbHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIG1vZGFscy4gQmFzZWQgb24gQm9vdHN0cmFwJ3MgbW9kYWxzOiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy80LjAvY29tcG9uZW50cy9tb2RhbC9cbiAqIFxuICogR2xvYmFsczpcbiAqIFNDUk9MTEJBUldJRFRIXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIERVUkFUSU9OID0gMzAwO1xuXG4gICAgdmFyIE1vZGFsVG9nZ2xlID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSAkZWwuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgIHRoaXMuJHRhcmdldCA9ICQodGhpcy50YXJnZXQpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzOyBcblxuICAgICAgICBfdGhpcy4kZWwub24oICdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAoICQoZG9jdW1lbnQuYm9keSkuaGFzQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJykgKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2xvc2VNb2RhbCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93QmFja2Ryb3AoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2hvd01vZGFsKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5zaG93QmFja2Ryb3AgPSBmdW5jdGlvbihjYWxsYmFjayl7XG5cbiAgICAgICAgdmFyIGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHZhciAkYmFja2Ryb3AgPSAkKGJhY2tkcm9wKTtcblxuICAgICAgICAkYmFja2Ryb3AuYWRkQ2xhc3MoJ2NjbC1jLW1vZGFsX19iYWNrZHJvcCcpO1xuICAgICAgICAkYmFja2Ryb3AuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG4gICAgICAgIFxuICAgICAgICBDQ0wucmVmbG93KGJhY2tkcm9wKTtcbiAgICAgICAgXG4gICAgICAgICRiYWNrZHJvcC5hZGRDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgJChkb2N1bWVudC5ib2R5KVxuICAgICAgICAgICAgLmFkZENsYXNzKCdjY2wtbW9kYWwtb3BlbicpXG4gICAgICAgICAgICAuY3NzKCAncGFkZGluZy1yaWdodCcsIENDTC5TQ1JPTExCQVJXSURUSCApO1xuXG4gICAgICAgIGlmICggY2FsbGJhY2sgKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCBjYWxsYmFjaywgRFVSQVRJT04gKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuc2hvd01vZGFsID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgX3RoaXMuJHRhcmdldC5zaG93KCAwLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5hZGRDbGFzcygnY2NsLWlzLXNob3duJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgJCgnLmNjbC1jLW1vZGFsJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbCcpLmhpZGUoKTtcblxuICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsX19iYWNrZHJvcCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsX19iYWNrZHJvcCcpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJylcbiAgICAgICAgICAgICAgICAgICAgLmNzcyggJ3BhZGRpbmctcmlnaHQnLCAnJyApO1xuXG4gICAgICAgICAgICB9LCBEVVJBVElPTik7XG5cbiAgICAgICAgfSwgRFVSQVRJT04gKTsgXG5cbiAgICB9O1xuXG5cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IE1vZGFsVG9nZ2xlKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIFJvb20gUmVzZXJ2YXRpb25cbiAqIFxuICogSGFuZGxlIHJvb20gcmVzZXJ2YXRpb25zXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgLy8gVE9ETzogUmVtb3ZlXG4gICAgdmFyIGR1bW15QXZhaWxhYmlsaXR5RGF0YSA9IFtcbiAgICAgICAge1xuICAgICAgICAgICAgXCJpZFwiOiA5MTQ4LFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiR3JvdXAgU3R1ZHkgMVwiLFxuICAgICAgICAgICAgXCJkZXNjcmlwdGlvblwiOiBcIlwiLFxuICAgICAgICAgICAgXCJpbWFnZVwiOiBcIlwiLFxuICAgICAgICAgICAgXCJjYXBhY2l0eVwiOiBcIjZcIixcbiAgICAgICAgICAgIFwiYXZhaWxhYmlsaXR5XCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMDg6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMDg6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDA4OjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDA5OjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQwOTowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQwOTozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMDk6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTA6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDEwOjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDEwOjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxMDozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxMTowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTE6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTE6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDExOjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDEyOjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxMjowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgIC8vICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxMjozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTI6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTM6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDEzOjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDEzOjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8vIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxMzozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgIC8vICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxNDowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgLy8gfSxcbiAgICAgICAgICAgICAgICAvLyB7XG4gICAgICAgICAgICAgICAgLy8gICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTQ6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAvLyAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTQ6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIC8vIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDE0OjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDE1OjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxNTowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxNTozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTU6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTY6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDE2OjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDE2OjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxNjozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxNzowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTc6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTc6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDE3OjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDE4OjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxODowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxODozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTg6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTk6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDE5OjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDE5OjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxOTozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQyMDowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMjA6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMjA6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDIwOjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDIxOjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQyMTowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQyMTozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMjE6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMjI6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF07XG5cbiAgICB2YXIgUm9vbVJlc0Zvcm0gPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiRmb3JtQ29udGVudCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLWNvbnRlbnQnKS5jc3Moe3Bvc2l0aW9uOidyZWxhdGl2ZSd9KTtcbiAgICAgICAgdGhpcy4kZm9ybVJlc3BvbnNlID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tcmVzcG9uc2UnKS5jc3Moe3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6ICcxcmVtJywgbGVmdDogJzFyZW0nLCBvcGFjaXR5OiAwfSk7XG4gICAgICAgIHRoaXMuJGZvcm1DYW5jZWwgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1jYW5jZWwnKTtcbiAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLXN1Ym1pdCcpO1xuICAgICAgICB0aGlzLnJvb21JZD0gdGhpcy4kZWwuZGF0YSgncmVzb3VyY2UtaWQnKTtcbiAgICAgICAgdGhpcy4kZGF0ZVNlbGVjdCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLWRhdGUtc2VsZWN0Jyk7XG4gICAgICAgIHRoaXMuZGF0ZVltZCA9IHRoaXMuJGRhdGVTZWxlY3QudmFsKCk7XG4gICAgICAgIHRoaXMuJHJvb21TY2hlZHVsZSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXNjaGVkdWxlJyk7XG4gICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQgPSB0aGlzLiRlbC5maW5kKCcuanMtY3VycmVudC1kdXJhdGlvbicpO1xuICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0biA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yZXNldC1zZWxlY3Rpb24nKTsgXG4gICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbXTtcbiAgICAgICAgdGhpcy5sYXN0U2VsZWN0ZWRTbG90ID0gZmFsc2U7XG4gICAgICAgIHRoaXMubWF4U2xvdHMgPSA0O1xuICAgICAgICB0aGlzLiRtYXhUaW1lID0gdGhpcy4kZWwuZmluZCgnLmpzLW1heC10aW1lJyk7XG4gICAgICAgIHRoaXMuc2xvdE1pbnV0ZXMgPSAzMDtcbiAgICAgICAgdGhpcy50aW1lWm9uZSA9ICctNzAwJztcbiAgICAgICAgdGhpcy5vcGVuVGltZSA9IG5ldyBEYXRlKCBub3cuZ2V0RnVsbFllYXIoKSwgbm93LmdldE1vbnRoKCksIG5vdy5nZXREYXRlKCksIDggKTsgLy8gOGFtIHRvZGF5XG4gICAgICAgIHRoaXMuY2xvc2VUaW1lID0gbmV3IERhdGUoIG5vdy5nZXRGdWxsWWVhcigpLCBub3cuZ2V0TW9udGgoKSwgbm93LmdldERhdGUoKSwgMTcgKTsgLy8gNXBtIHRvZGF5O1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICB0b2RheVltZD0gbmV3IERhdGUoKS50b0lTT1N0cmluZygpLnNwbGl0KCdUJylbMF07XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG5cbiAgICAgICAgdGhpcy5zZXRNYXhUaW1lVGV4dCgpO1xuXG4gICAgICAgIHRoaXMuZ2V0U3BhY2VBdmFpbGFiaWxpdHkodG9kYXlZbWQpXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBSZW1vdmVcbiAgICAgICAgICAgICAgICAvLyB1c2UgZHVtbXkgdGV4dFxuICAgICAgICAgICAgICAgIGRhdGEgPSBkdW1teUF2YWlsYWJpbGl0eURhdGE7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgX3RoaXMubWFrZVNjaGVkdWxlKGRhdGEpO1xuXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBfdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmluaXREYXRlRXZlbnRzKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXRGb3JtRXZlbnRzKCk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5nZXRTcGFjZUF2YWlsYWJpbGl0eSA9IGZ1bmN0aW9uKFltZCl7XG5cbiAgICAgICAgLyogVE9ETzpcbiAgICAgICAgICogTWFrZSBhIEdFVCByZXF1ZXN0IGhlcmUgZm9yIHNwYWNlIGF2YWlsYWJpbGl0eS5cbiAgICAgICAgICogaHR0cHM6Ly9jbGFyZW1vbnQubGliY2FsLmNvbS9hZG1pbl9hcGkucGhwP3ZlcnNpb249MS4xJmVuZHBvaW50PXNwYWNlX2dldFxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgcmV0dXJuICQuZ2V0KHtcbiAgICAgICAgICAgIC8vIHVybDogQ0NMLnNpdGVfdXJsICsgJ2FwaS9yb29tcy9hdmFpbGFiaWxpdHkvOTE0OCcsXG4gICAgICAgICAgICB1cmw6ICcjJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAnYXZhaWxhYmlsaXR5JzogWW1kIC8vIGUuZy4gJzIwMTctMTAtMTknXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5tYWtlU2NoZWR1bGUgPSBmdW5jdGlvbihkYXlEYXRhKXtcblxuICAgICAgICAvLyBnZXQgb2JqZWN0IGZvciBmaXJzdCByb29tIGluIGFycmF5LiB3ZSdyZSBvbmx5IGNhbGxpbmcgZGF0YSBmb3Igb25lIHJvb20gYXQgYSB0aW1lLlxuICAgICAgICBkYXlEYXRhID0gZGF5RGF0YVswXTtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgaHRtbCA9IFtdLFxuICAgICAgICAgICAgYXZhaWxhYmlsaXR5ID0gZGF5RGF0YS5hdmFpbGFiaWxpdHksXG4gICAgICAgICAgICBvbGRUb1RpbWU7XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gY29uc3RydWN0IEhUTUwgZm9yIGVhY2ggdGltZSBzbG90XG4gICAgICAgICQoZGF5RGF0YS5hdmFpbGFiaWxpdHkpLmVhY2goZnVuY3Rpb24oaSxpdGVtKXtcblxuICAgICAgICAgICAgdmFyIG5ld0Zyb21UaW1lID0gaXRlbS5mcm9tLFxuICAgICAgICAgICAgICAgIHNsb3REYXRlVGltZSA9IG5ldyBEYXRlKCBpdGVtLmZyb20gKTtcblxuICAgICAgICAgICAgLy8gY29tcGFyZSB0aGlzIGl0ZW0gYW5kIHRoZSBwcmV2aW91cyBpdGVtIHRvIGxvb2sgZm9yIGdhcHMgaW4gdGltZS5cbiAgICAgICAgICAgIC8vIGdhcHMgaW5kaWNhdGVkIGEgcmVzZXJ2ZWQgYmxvY2sgb2YgdGltZVxuICAgICAgICAgICAgaWYgKCBvbGRUb1RpbWUgJiYgb2xkVG9UaW1lICE9IG5ld0Zyb21UaW1lICApIHtcblxuICAgICAgICAgICAgICAgIHZhciBuZXdGcm9tVGltZVVuaXggPSBuZXcgRGF0ZShuZXdGcm9tVGltZSkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgICAgICBvbGRUb1RpbWVVbml4ID0gbmV3IERhdGUob2xkVG9UaW1lKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgIGRpZmZlcmVuY2UgPSBuZXdGcm9tVGltZVVuaXggLSBvbGRUb1RpbWVVbml4LFxuICAgICAgICAgICAgICAgICAgICBzbG90cztcblxuICAgICAgICAgICAgICAgIC8vIGdldCBkaWZmZXJlbmNlIGluIG1pbnV0ZXNcbiAgICAgICAgICAgICAgICBkaWZmZXJlbmNlID0gZGlmZmVyZW5jZSAvIDEwMDAgLyA2MDtcbiAgICAgICAgICAgICAgICBzbG90cyA9IGRpZmZlcmVuY2UgLyBfdGhpcy5zbG90TWludXRlcztcblxuICAgICAgICAgICAgICAgIC8vIGJ1aWxkIHNsb3RzIGZvciBvY2N1cGllZCAodW5zZWxlY3RhYmxlKSB0aW1lXG4gICAgICAgICAgICAgICAgZm9yICggdmFyIGogPSAwOyBqIDwgc2xvdHM7IGorKyApIHtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgYWRkTWlsbGlzZWNvbmRzID0gaiAqIF90aGlzLnNsb3RNaW51dGVzICogNjAgKiAxMDAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VW5peCA9IG9sZFRvVGltZVVuaXggKyBhZGRNaWxsaXNlY29uZHM7XG5cbiAgICAgICAgICAgICAgICAgICAgaHRtbC5wdXNoKCBfdGhpcy5tYWtlVGltZVNsb3Qoe1xuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICdzbG90LScgKyBfdGhpcy5yb29tSWQgKyAnLScgKyBpICsgJy0nICsgaixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVkOiAnZGlzYWJsZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M6ICdjY2wtaXMtb2NjdXBpZWQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IF90aGlzLmZvcm1hdERhdGVTdHJpbmcoIG5ldyBEYXRlKG5ld1VuaXgpICksXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lU3RyaW5nOiBfdGhpcy5mb3JtYXREYXRlU3RyaW5nKCBuZXcgRGF0ZShuZXdVbml4KSwgJ3JlYWRhYmxlJyApXG4gICAgICAgICAgICAgICAgICAgIH0pICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGJ1aWxkIHNlbGVjdGFibGUgdGltZSBzbG90c1xuICAgICAgICAgICAgaHRtbC5wdXNoKCBfdGhpcy5tYWtlVGltZVNsb3Qoe1xuICAgICAgICAgICAgICAgIGlkOiAnc2xvdC0nICsgX3RoaXMucm9vbUlkICsgJy0nICsgaSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogX3RoaXMuZm9ybWF0RGF0ZVN0cmluZyggc2xvdERhdGVUaW1lICksXG4gICAgICAgICAgICAgICAgdGltZVN0cmluZzogX3RoaXMuZm9ybWF0RGF0ZVN0cmluZyggc2xvdERhdGVUaW1lLCAncmVhZGFibGUnIClcbiAgICAgICAgICAgIH0pICk7XG5cbiAgICAgICAgICAgIC8vIHVwZGF0ZSB2YXJpYWJsZSB0byB0aGUgY3VycmVudCBpdGVtJ3MgXCJ0b1wiIHZhbHVlLlxuICAgICAgICAgICAgb2xkVG9UaW1lID0gaXRlbS50bztcbiAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzID0gW107XG5cbiAgICAgICAgdGhpcy4kcm9vbVNjaGVkdWxlLmh0bWwoIGh0bWwuam9pbignJykgKTtcblxuICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1yb29tX19zbG90IFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcblxuICAgICAgICB0aGlzLnNldEN1cnJlbnREdXJhdGlvblRleHQoKTtcblxuICAgICAgICAvLyB0aGlzLnNldE9jY3VwaWVkUm9vbXMoKTtcblxuICAgICAgICB0aGlzLmluaXRTbG90RXZlbnRzKCk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm1ha2VUaW1lU2xvdCA9IGZ1bmN0aW9uKHZhcnMpe1xuICAgICAgICBcbiAgICAgICAgaWYgKCAhIHZhcnMgfHwgdHlwZW9mIHZhcnMgIT09ICdvYmplY3QnICkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgY2xhc3M6ICcnLFxuICAgICAgICAgICAgaWQ6ICcnLFxuICAgICAgICAgICAgZGlzYWJsZWQ6ICcnLFxuICAgICAgICAgICAgdmFsdWU6ICcnLFxuICAgICAgICAgICAgdGltZVN0cmluZzogJydcbiAgICAgICAgfTtcbiAgICAgICAgdmFycyA9ICQuZXh0ZW5kKGRlZmF1bHRzLCB2YXJzKTtcblxuICAgICAgICB2YXIgdGVtcGxhdGUgPSAnJyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNjbC1jLXJvb21fX3Nsb3QgJyArIHZhcnMuY2xhc3MgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cIicgKyB2YXJzLmlkICsgJ1wiIG5hbWU9XCInICsgdmFycy5pZCArICdcIiB2YWx1ZT1cIicgKyB2YXJzLnZhbHVlICsgJ1wiICcgKyB2YXJzLmRpc2FibGVkICsgJy8+JyArXG4gICAgICAgICAgICAgICAgJzxsYWJlbCBjbGFzcz1cImNjbC1jLXJvb21fX3Nsb3QtbGFiZWxcIiBmb3I9XCInICsgdmFycy5pZCArICdcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgdmFycy50aW1lU3RyaW5nICtcbiAgICAgICAgICAgICAgICAnPC9sYWJlbD4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nO1xuXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXRGb3JtRXZlbnRzID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHJlc2V0U2VsZWN0aW9uQnRuLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKF90aGlzLnNlbGVjdGVkU2xvdElucHV0cykuZWFjaChmdW5jdGlvbihpLGlucHV0KXtcbiAgICAgICAgICAgICAgICAkKGlucHV0KVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIC5jaGFuZ2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5yZW1vdmVDbGFzcygnY2NsLWlzLWRpc2FibGVkJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGVsLnN1Ym1pdChmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgX3RoaXMub25TdWJtaXQoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXREYXRlRXZlbnRzID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZGF0ZVNlbGVjdC5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIF90aGlzLm9uRGF0ZUNoYW5nZSgpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdFNsb3RFdmVudHMgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgaWYgKCB0aGlzLiRyb29tU2xvdElucHV0cyAmJiB0aGlzLiRyb29tU2xvdElucHV0cy5sZW5ndGggKXtcblxuICAgICAgICAgICAgLy8gY2xpY2sgZXZlbnQgZmlyZXMgQkVGT1JFIGNoYW5nZSBldmVudFxuICAgICAgICAgICAgdGhpcy4kcm9vbVNsb3RJbnB1dHMuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgX3RoaXMub25TbG90Q2xpY2soaW5wdXQsIGV2ZW50KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cy5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGlzO1xuICAgICAgICAgICAgICAgIF90aGlzLm9uU2xvdENoYW5nZShpbnB1dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vbkRhdGVDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5kYXRlWW1kID0gdGhpcy4kZGF0ZVNlbGVjdC52YWwoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuXG4gICAgICAgIHRoaXMuZ2V0U3BhY2VBdmFpbGFiaWxpdHkodGhpcy5kYXRlWW1kKVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogUmVtb3ZlXG4gICAgICAgICAgICAgICAgLy8gdXNlIGR1bW15IHRleHRcbiAgICAgICAgICAgICAgICBkYXRhID0gZHVtbXlBdmFpbGFiaWxpdHlEYXRhO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIF90aGlzLm1ha2VTY2hlZHVsZShkYXRhKTtcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX3RoaXMuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuICAgICAgICAgICAgICAgIF90aGlzLiRyZXNldFNlbGVjdGlvbkJ0bi5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblNsb3RDbGljayA9IGZ1bmN0aW9uKGNsaWNrZWRJbnB1dCwgZXZlbnQpe1xuICAgICAgICBcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIGNsaWNrSW5wdXRJbmRleCA9IF90aGlzLiRyb29tU2xvdElucHV0cy5pbmRleChjbGlja2VkSW5wdXQpLFxuICAgICAgICAgICAgbWluSW5kZXggPSBjbGlja0lucHV0SW5kZXggLSBfdGhpcy5tYXhTbG90cyxcbiAgICAgICAgICAgIG1heEluZGV4ID0gY2xpY2tJbnB1dEluZGV4ICsgX3RoaXMubWF4U2xvdHM7XG5cbiAgICAgICAgLy8gZGlzYWJsZXMgc2xvdHMgdGhhdCBhcmUgb3V0c2lkZSBvZiBtYXggc2VsZWN0YWJsZSBhcmVhXG4gICAgICAgIGZ1bmN0aW9uIF9pc29sYXRlU2VsZWN0YWJsZVNsb3RzKCkge1xuXG4gICAgICAgICAgICAvLyBvY2N1cGllZCBzbG90cyB3aWxsIGFmZmVjdCB3aGF0IG5lYXJieSBzbG90cyBjYW4gYmUgc2VsZWN0ZWRcbiAgICAgICAgICAgIC8vIExvb3AgdGhyb3VnaCBhbnkgb2NjdXBpZWQgc2xvdHMsIGlmIHRoZXkgZXhpc3RcbiAgICAgICAgICAgICQoJy5jY2wtYy1yb29tX19zbG90LmNjbC1pcy1vY2N1cGllZCcpLmVhY2goZnVuY3Rpb24oaSxzbG90KXtcblxuICAgICAgICAgICAgICAgIC8vIGdldCBvY2N1cGllZCBzbG90J3MgaW5wdXQsIGZpbmQgaXQncyBpbmRleCBhbW91bmcgYWxsIHNsb3QgaW5wdXRzXG4gICAgICAgICAgICAgICAgdmFyIHNsb3RJbnB1dCA9ICQoc2xvdCkuZmluZCgnW3R5cGU9XCJjaGVja2JveFwiXScpLFxuICAgICAgICAgICAgICAgICAgICBvY2N1cGllZEluZGV4ID0gX3RoaXMuJHJvb21TbG90SW5wdXRzLmluZGV4KHNsb3RJbnB1dCk7XG5cbiAgICAgICAgICAgICAgICAvLyBpZiBvY2N1cGllZCBzbG90IGZhbGxzIGluIHRoZSBzZWxlY3RhYmxlIGFyZWFcbiAgICAgICAgICAgICAgICBpZiAoIG1pbkluZGV4IDwgb2NjdXBpZWRJbmRleCAmJiBvY2N1cGllZEluZGV4IDwgbWF4SW5kZXggKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgb2NjdXBpZWQgc2xvdCBpcyBCRUZPUkUgY2xpY2tlZCBzbG90LCBzZXQgaXQgYXMgdGhlIG1pblxuICAgICAgICAgICAgICAgICAgICBpZiAoIG9jY3VwaWVkSW5kZXggPCBjbGlja0lucHV0SW5kZXggKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBtaW5JbmRleCA9IG9jY3VwaWVkSW5kZXg7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgb2NjdXBpZWQgc2xvdCBpcyBBRlRFUiBjbGlja2VkIHNsb3QsIHNldCBpdCBhcyB0aGUgbWF4XG4gICAgICAgICAgICAgICAgICAgIGlmICggb2NjdXBpZWRJbmRleCA+IGNsaWNrSW5wdXRJbmRleCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heEluZGV4ID0gb2NjdXBpZWRJbmRleDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCBzbG90cywgZGlzYWJsZSBvbmVzIHRoYXQgZmFsbCBvdXRzaWRlIG9mIG1pbi9tYXggaW5kZXhlc1xuICAgICAgICAgICAgX3RoaXMuJHJvb21TbG90SW5wdXRzLmVhY2goZnVuY3Rpb24oaSxpbnB1dCl7XG4gICAgICAgICAgICAgICAgaWYgKCBpIDw9IG1pbkluZGV4IHx8IGkgPj0gbWF4SW5kZXggKSB7XG4gICAgICAgICAgICAgICAgICAgICQoaW5wdXQpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5hZGRDbGFzcygnY2NsLWlzLWRpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogaWYgbm8gaW5wdXRzIHlldCBzZWxlY3RlZCwgdGhpcyBpcyB0aGUgZmlyc3RcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgICAgICBpZiAoIF90aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPT09IDAgKSB7XG5cbiAgICAgICAgICAgIF9pc29sYXRlU2VsZWN0YWJsZVNsb3RzKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogaWYgMSBpbnB1dCBzZWxlY3RlZCwgc2VsZWN0aW5nIDJuZCBzbG90XG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgaWYgKCBfdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoID09PSAxICkge1xuXG4gICAgICAgICAgICBpZiAoICQoY2xpY2tlZElucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykuaGFzQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpICkge1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIGlmIDIgb3IgbW9yZSBzbG90cyBhbHJlYWR5IHNlbGVjdGVkXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgaWYgKCBfdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoID49IDIgKSB7XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSBjbGlja2VkIGlucHV0IGlzIG5vdCBwYXJ0IG9mIGN1cnJlbnQgc2VsZWN0aW9uXG4gICAgICAgICAgICAvLyBjbGVhciBhbGwgc2VsZWN0ZWQgaW5wdXRzXG4gICAgICAgICAgICBpZiAoIF90aGlzLnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKCBjbGlja2VkSW5wdXQgKSA8IDAgKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBfdGhpcy5jbGVhckFsbFNsb3RzKCk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2VsZWN0ZWRTbG90SW5wdXRzID0gW107XG5cbiAgICAgICAgICAgIH0gXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGlmIGNsaWNrZWQgaW5wdXQgaXMgb25lIG9mIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgaW5wdXRzXG4gICAgICAgICAgICAvLyBrZWVwIHRoYXQgb25lIHNlbGVjdGVkIGFuZCBkZXNlbGVjdCB0aGUgcmVzdFxuICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvLyBwcmV2ZW50IGNoYW5nZSBldmVudCBmcm9tIGZpcmluZ1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgdGhlIGlucHV0IGluZGV4IGZyb20gYW1vbmcgc2VsZWN0ZWQgaW5wdXRzXG4gICAgICAgICAgICAgICAgdmFyIHNlbGVjdGVkU2xvdEluZGV4ID0gX3RoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2YoIGNsaWNrZWRJbnB1dCApLFxuICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZElucHV0cyA9ICQuZXh0ZW5kKCBbXSwgX3RoaXMuc2VsZWN0ZWRTbG90SW5wdXRzICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gY2xlYXIgYWxsIGlucHV0cyBFWENFUFQgdGhlIGNsaWNrZWQgb25lXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRJbnB1dHMuZm9yRWFjaChmdW5jdGlvbihpbnB1dCxpKXtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBzZWxlY3RlZFNsb3RJbmRleCAhPSBpICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2xlYXJTbG90KGlucHV0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIC8vIHNldCBzZWxlY3RlZCBpbnB1dHMgdG8ganVzdCB0aGlzIG9uZVxuICAgICAgICAgICAgICAgIC8vIF90aGlzLnNlbGVjdGVkU2xvdElucHV0cyA9IFsgX3RoaXMuc2VsZWN0ZWRTbG90SW5wdXRzW3NlbGVjdGVkU2xvdEluZGV4XSBdO1xuXG4gICAgICAgICAgICAgICAgLy8gdXBkYXRlIHRoZSBjdXJyZW50IGR1cmF0aW9uIHRleHRcbiAgICAgICAgICAgICAgICBfdGhpcy5zZXRDdXJyZW50RHVyYXRpb25UZXh0KCk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgX2lzb2xhdGVTZWxlY3RhYmxlU2xvdHMoKTtcblxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TbG90Q2hhbmdlID0gZnVuY3Rpb24oY2hhbmdlZElucHV0KXtcbiAgICAgICAgXG4gICAgICAgIC8vIGlmIGlucHV0IGNoZWNrZWQsIGFkZCBpdCB0byBzZWxlY3RlZCBzZXRcbiAgICAgICAgaWYgKCAkKGNoYW5nZWRJbnB1dCkucHJvcCgnY2hlY2tlZCcpICkge1xuXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5wdXNoKGNoYW5nZWRJbnB1dCk7XG4gICAgICAgICAgICAkKGNoYW5nZWRJbnB1dCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpLmFkZENsYXNzKCdjY2wtaXMtY2hlY2tlZCcpO1xuICAgXG4gICAgICAgIH0gXG4gICAgICAgIFxuICAgICAgICAvLyBpZiBpbnB1dCB1bmNoZWNrZWQsIHJlbW92ZSBpdCBmcm9tIHRoZSBzZWxlY3RlZCBzZXRcbiAgICAgICAgZWxzZSB7IFxuXG4gICAgICAgICAgICB2YXIgY2hhbmdlZElucHV0SW5kZXggPSB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKGNoYW5nZWRJbnB1dCk7XG5cbiAgICAgICAgICAgIGlmICggY2hhbmdlZElucHV0SW5kZXggPiAtMSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5zcGxpY2UoIGNoYW5nZWRJbnB1dEluZGV4LCAxICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKGNoYW5nZWRJbnB1dCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtY2hlY2tlZCcpO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyB0b2dnbGUgcmVzZXQgYnV0dG9uXG4gICAgICAgIGlmICggdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgIHRoaXMuJHJlc2V0U2VsZWN0aW9uQnRuLnNob3coKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJHJlc2V0U2VsZWN0aW9uQnRuLmhpZGUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGlmIGhpZ2hsaWdodCBzbG90cyBiZXR3ZWVuIHR3byBlbmRzXG4gICAgICAgIGlmICggdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoID09PSAyICkge1xuXG4gICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICBfdGhpcy4kZWwuZmluZCgnLmNjbC1pcy1jaGVja2VkJykuZmlyc3QoKS5uZXh0VW50aWwoJy5jY2wtaXMtY2hlY2tlZCcpLmVhY2goZnVuY3Rpb24oaSxzbG90KXtcbiAgICAgICAgICAgICAgICB2YXIgc2xvdElucHV0ID0gJChzbG90KS5maW5kKCdpbnB1dFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMucHVzaChzbG90SW5wdXRbMF0pO1xuICAgICAgICAgICAgICAgIF90aGlzLmFjdGl2YXRlU2xvdChzbG90KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRDdXJyZW50RHVyYXRpb25UZXh0KCk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmNsZWFyU2xvdCA9IGZ1bmN0aW9uKHNsb3QpIHtcbiAgICAgICAgLy8gc2xvdCBjYW4gYmUgZWl0aGVyIHRoZSBjaGVja2JveCBpbnB1dCAtT1ItIHRoZSBjaGVja2JveCdzIGNvbnRhaW5lclxuXG4gICAgICAgIHZhciBpbnB1dEluZGV4O1xuXG4gICAgICAgIC8vIGlmIGl0J3MgdGhlIGNoZWNrYm94LlxuICAgICAgICBpZiAoICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSApIHtcbiAgICAgICAgIFxuICAgICAgICAgICAgJChzbG90KVxuICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJyxmYWxzZSlcbiAgICAgICAgICAgICAgICAucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLWlzLWNoZWNrZWQnKTtcblxuICAgICAgICAgICAgLy8gZ2V0IGluZGV4IG9mIHRoZSBpbnB1dCBmcm9tIHNlbGVjdGVkIHNldFxuICAgICAgICAgICAgaW5wdXRJbmRleCA9IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2Yoc2xvdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gaWYgaXQncyB0aGUgY29udGFpbmVyXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkKHNsb3QpLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKTtcblxuICAgICAgICAgICAgJChzbG90KS5yZW1vdmVDbGFzcygnY2NsLWlzLWNoZWNrZWQnKTtcbiAgICAgICAgICAgICRpbnB1dC5wcm9wKCdjaGVja2VkJyxmYWxzZSk7XG5cbiAgICAgICAgICAgIC8vIGdldCBpbmRleCBvZiB0aGUgaW5wdXQgZnJvbSBzZWxlY3RlZCBzZXRcbiAgICAgICAgICAgIGlucHV0SW5kZXggPSB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKCAkaW5wdXRbMF0gKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGlucHV0IGZyb20gc2VsZWN0ZWQgc2V0XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnNwbGljZSggaW5wdXRJbmRleCwgMSApO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5jbGVhckFsbFNsb3RzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIC8vIEV4dGVuZCB0aGUgc2VsZWN0ZWQgaW5wdXRzIGFycmF5IHRvIGEgbmV3IHZhcmlhYmxlLlxuICAgICAgICAvLyBUaGUgc2VsZWN0ZWQgaW5wdXRzIGFycmF5IGNoYW5nZXMgd2l0aCBldmVyeSBjbGVhclNsb3QoKSBjYWxsXG4gICAgICAgIC8vIHNvLCBiZXN0IHRvIGxvb3AgdGhyb3VnaCBhbiB1bmNoYW5naW5nIGFycmF5LlxuICAgICAgICB2YXIgc2VsZWN0ZWRJbnB1dHMgPSAkLmV4dGVuZCggW10sIF90aGlzLnNlbGVjdGVkU2xvdElucHV0cyApO1xuXG4gICAgICAgICQoc2VsZWN0ZWRJbnB1dHMpLmVhY2goZnVuY3Rpb24oaSxpbnB1dCl7XG4gICAgICAgICAgICBfdGhpcy5jbGVhclNsb3QoaW5wdXQpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuYWN0aXZhdGVTbG90ID0gZnVuY3Rpb24oc2xvdCkge1xuICAgICAgICAvLyBzbG90IGNhbiBiZSBlaXRoZXIgdGhlIGNoZWNrYm94IC1PUi0gdGhlIGNoZWNrYm94J3MgY29udGFpbmVyXG5cbiAgICAgICAgdmFyIHNsb3RJc0NoZWNrYm94ID0gJChzbG90KS5pcygnW3R5cGU9XCJjaGVja2JveFwiXScpLFxuICAgICAgICAgICAgJGNvbnRhaW5lciA9IHNsb3RJc0NoZWNrYm94ID8gJChzbG90KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykgOiAkKHNsb3QpO1xuXG4gICAgICAgIC8vIG5ldmVyIHNldCBhbiBvY2N1cGllZCBzbG90IGFzIGFjdGl2ZVxuICAgICAgICBpZiAoICRjb250YWluZXIuaGFzQ2xhc3MoJ2NjbC1pcy1vY2N1cGllZCcpICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAkKHNsb3QpLmlzKCdbdHlwZT1cImNoZWNrYm94XCJdJykgKSB7XG5cbiAgICAgICAgICAgIC8vIGlmIGl0J3MgdGhlIGNoZWNrYm94LlxuICAgICAgICAgXG4gICAgICAgICAgICAkKHNsb3QpLnByb3AoJ2NoZWNrZWQnLHRydWUpO1xuICAgICAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcygnY2NsLWlzLWNoZWNrZWQnKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBpZiBpdCdzIHRoZSBjb250YWluZXJcblxuICAgICAgICAgICAgJGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnY2NsLWlzLWNoZWNrZWQnKVxuICAgICAgICAgICAgICAgIC5maW5kKCdbdHlwZT1cImNoZWNrYm94XCJdJylcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLHRydWUpO1xuXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnNldEN1cnJlbnREdXJhdGlvblRleHQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9ICQuZXh0ZW5kKFtdLHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzKSxcbiAgICAgICAgICAgIHNvcnRlZFNlbGVjdGlvbiA9IHNlbGVjdGlvbi5zb3J0KGZ1bmN0aW9uKGEsYil7IFxuICAgICAgICAgICAgICAgIHJldHVybiBhLnZhbHVlID4gYi52YWx1ZTsgXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHNlbGVjdGlvbkxlbmd0aCA9IHNvcnRlZFNlbGVjdGlvbi5sZW5ndGg7XG4gICAgICAgIFxuICAgICAgICBpZiAoIHNlbGVjdGlvbkxlbmd0aCA+IDEgKSB7XG5cbiAgICAgICAgICAgIHZhciB0aW1lMVZhbCA9IHNvcnRlZFNlbGVjdGlvblswXS52YWx1ZS5zbGljZSgwLC00KSxcbiAgICAgICAgICAgICAgICByZWFkYWJsZVRpbWUxID0gdGhpcy5mb3JtYXREYXRlU3RyaW5nKCBuZXcgRGF0ZSh0aW1lMVZhbCksICdyZWFkYWJsZScgKTtcblxuICAgICAgICAgICAgdmFyIHRpbWUyVmFsID0gc29ydGVkU2VsZWN0aW9uW3NvcnRlZFNlbGVjdGlvbi5sZW5ndGggLSAxXS52YWx1ZS5zbGljZSgwLC00KSxcbiAgICAgICAgICAgICAgICB0aW1lMlQgPSBuZXcgRGF0ZSh0aW1lMlZhbCkuZ2V0VGltZSgpICsgKCB0aGlzLnNsb3RNaW51dGVzICogNjAgKiAxMDAwICksXG4gICAgICAgICAgICAgICAgcmVhZGFibGVUaW1lMiA9IHRoaXMuZm9ybWF0RGF0ZVN0cmluZyggbmV3IERhdGUodGltZTJUKSwgJ3JlYWRhYmxlJyApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dC50ZXh0KCByZWFkYWJsZVRpbWUxICsgJyB0byAnICsgcmVhZGFibGVUaW1lMiApO1xuXG4gICAgICAgIH0gZWxzZSBpZiAoIHNlbGVjdGlvbkxlbmd0aCA+IDAgKSB7XG5cbiAgICAgICAgICAgIHZhciB0aW1lVmFsID0gc29ydGVkU2VsZWN0aW9uWzBdLnZhbHVlLnNsaWNlKDAsLTQpLFxuICAgICAgICAgICAgICAgIHJlYWRhYmxlVGltZSA9IHRoaXMuZm9ybWF0RGF0ZVN0cmluZyggbmV3IERhdGUodGltZVZhbCksICdyZWFkYWJsZScgKTtcbiAgICAgICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQudGV4dCggcmVhZGFibGVUaW1lICsgJyB0byA/JyApO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQudGV4dCgnTm9uZScpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuc2V0TWF4VGltZVRleHQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbWF4TWludXRlcyA9IHRoaXMubWF4U2xvdHMgKiB0aGlzLnNsb3RNaW51dGVzLFxuICAgICAgICAgICAgbWF4VGV4dDtcblxuICAgICAgICBzd2l0Y2gobWF4TWludXRlcykge1xuICAgICAgICAgICAgY2FzZSAyNDA6XG4gICAgICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgLyA2MCArICcgaG91cnMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxODA6XG4gICAgICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgLyA2MCArICcgaG91cnMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAxMjA6XG4gICAgICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgLyA2MCArICcgaG91cnMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA2MDpcbiAgICAgICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyAvIDYwICsgJyBob3Vycyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzICsgJ21pbnMnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kbWF4VGltZS50ZXh0KCBtYXhUZXh0ICk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5mb3JtYXREYXRlU3RyaW5nID0gZnVuY3Rpb24oZGF0ZU9iaiwgcmVhZGFibGUpe1xuXG4gICAgICAgIHZhciBtaW51dGVzID0gKCBkYXRlT2JqLmdldE1pbnV0ZXMoKS50b1N0cmluZygpLmxlbmd0aCA8IDIgKSA/ICcwJyArIGRhdGVPYmouZ2V0TWludXRlcygpLnRvU3RyaW5nKCkgOiBkYXRlT2JqLmdldE1pbnV0ZXMoKS50b1N0cmluZygpO1xuICAgICAgICAgICAgXG4gICAgICAgIGlmICggcmVhZGFibGUgKSB7XG5cbiAgICAgICAgICAgIHZhciBhbXBtID0gKCBkYXRlT2JqLmdldEhvdXJzKCkgPj0gMTIgKSA/ICdwJyA6ICdhJyxcbiAgICAgICAgICAgICAgICBob3VyMTJGb3JtYXQgPSAoIGRhdGVPYmouZ2V0SG91cnMoKSA+IDEyICkgPyBkYXRlT2JqLmdldEhvdXJzKCkgLSAxMiA6IGRhdGVPYmouZ2V0SG91cnMoKTtcblxuICAgICAgICAgICAgcmV0dXJuIGhvdXIxMkZvcm1hdCArICc6JyArIG1pbnV0ZXMgKyBhbXBtO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHZhciBob3VycyA9ICggZGF0ZU9iai5nZXRIb3VycygpLnRvU3RyaW5nKCkubGVuZ3RoIDwgMiApID8gJzAnICsgZGF0ZU9iai5nZXRIb3VycygpLnRvU3RyaW5nKCkgOiBkYXRlT2JqLmdldEhvdXJzKCkudG9TdHJpbmcoKSxcbiAgICAgICAgICAgICAgICBzZWNvbmRzID0gKCBkYXRlT2JqLmdldFNlY29uZHMoKS50b1N0cmluZygpLmxlbmd0aCA8IDIgKSA/ICcwJyArIGRhdGVPYmouZ2V0U2Vjb25kcygpLnRvU3RyaW5nKCkgOiBkYXRlT2JqLmdldFNlY29uZHMoKS50b1N0cmluZygpO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRlWW1kICsgJ1QnICsgaG91cnMgKyAnOicgKyBtaW51dGVzICsgJzonICsgc2Vjb25kcyArIHRoaXMudGltZVpvbmU7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblN1Ym1pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAvKiBUT0RPOlxuICAgICAgICAgKiBQb3B1bGF0ZSBcImJvb2tpbmdzXCIgYXJyYXkgd2l0aCBjb3JyZWN0IGRhdGFcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gICAgICAgIHZhciBwYXlsb2FkID0ge1xuICAgICAgICAgICAgXCJpaWRcIjozMzMsXG4gICAgICAgICAgICBcInN0YXJ0XCI6IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzWzBdLnZhbHVlLFxuICAgICAgICAgICAgXCJmbmFtZVwiOiB0aGlzLiRlbFswXS5mbmFtZS52YWx1ZSxcbiAgICAgICAgICAgIFwibG5hbWVcIjogdGhpcy4kZWxbMF0ubG5hbWUudmFsdWUsXG4gICAgICAgICAgICBcImVtYWlsXCI6IHRoaXMuJGVsWzBdLmVtYWlsLnZhbHVlLFxuICAgICAgICAgICAgXCJuaWNrbmFtZVwiOiB0aGlzLiRlbFswXS5uaWNrbmFtZS52YWx1ZSxcbiAgICAgICAgICAgIFwiYm9va2luZ3NcIjpbXG4gICAgICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICAgICAgLy8gdXNpbmcgM3BtIGFzIGVuZCB0aW1lIGZvciBub3dcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiB0aGlzLmRhdGVZbWQgKyBcIlQxNTowMDowMFwiICsgdGhpcy50aW1lWm9uZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zb2xlLmxvZyggJ29uU3VibWl0IMK7ICcsIHBheWxvYWQgKTtcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcbiAgICAgICAgdGhpcy4kZm9ybUNhbmNlbC5wcm9wKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgIHRoaXMuJGZvcm1TdWJtaXQudGV4dCgnU2VuZGluZy4uLicpLnByb3AoJ2Rpc2FibGVkJyx0cnVlKTtcblxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIGFjdGlvbjogJ3JlcXVlc3RfYm9va2luZycsXG4gICAgICAgICAgICBjY2xfbm9uY2U6IENDTC5ub25jZSxcbiAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWRcbiAgICAgICAgfTtcblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTWFrZSBhIHJlcXVlc3QgaGVyZSB0byByZXNlcnZlIHNwYWNlXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgICAgICAkLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogQ0NMLmFqYXhfdXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgaGFuZGxlU3VibWl0UmVzcG9uc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFsd2F5cyhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF90aGlzLiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdFJlc3BvbnNlKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgIHZhciByZXNwb25zZUhUTUwsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VPYmplY3QgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcblxuICAgICAgICAgICAgaWYgKCByZXNwb25zZU9iamVjdC5ib29raW5nX2lkICkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTCA9ICBbJzxwIGNsYXNzPVwiY2NsLWgyIGNjbC11LW10LTBcIj5TdWNjZXNzITwvcD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHAgY2xhc3M9XCJjY2wtaDRcIj5Zb3VyIGJvb2tpbmcgSUQgaXMgPHNwYW4gY2xhc3M9XCJjY2wtdS1jb2xvci1zY2hvb2xcIj4nICsgcmVzcG9uc2VPYmplY3QuYm9va2luZ19pZCArICc8L3NwYW4+PC9wPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cCBjbGFzcz1cImNjbC1oNFwiPlBsZWFzZSBjaGVjayB5b3VyIGVtYWlsIHRvIGNvbmZpcm0geW91ciBib29raW5nLjwvcD4nXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MID0gIFsnPHAgY2xhc3M9XCJjY2wtaDMgY2NsLXUtbXQtMFwiPlNvcnJ5LCBidXQgd2UgY291bGRuXFwndCBwcm9jZXNzIHlvdXIgcmVzZXJ2YXRpb24uPC9wPicsJzxwIGNsYXNzPVwiY2NsLWg0XCI+RXJyb3JzOjwvcD4nXTtcbiAgICAgICAgICAgICAgICAkKHJlc3BvbnNlT2JqZWN0LmVycm9ycykuZWFjaChmdW5jdGlvbihpLCBlcnJvcil7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTC5wdXNoKCc8cCBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvclwiPicgKyBlcnJvciArICc8L3A+Jyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MLnB1c2goJzxwIGNsYXNzPVwiY2NsLWg0XCI+UGxlYXNlIHRhbGsgdG8geW91ciBuZWFyZXN0IGxpYnJhcmlhbiBmb3IgaGVscC48L3A+Jyk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIF90aGlzLiRmb3JtQ2FuY2VsLnByb3AoJ2Rpc2FibGVkJyxmYWxzZSkudGV4dCgnQ2xvc2UnKTtcbiAgICAgICAgICAgIF90aGlzLiRmb3JtU3VibWl0LnJlbW92ZSgpO1xuICAgICAgICAgICAgX3RoaXMuJGZvcm1Db250ZW50LmFuaW1hdGUoe29wYWNpdHk6IDB9LCBDQ0wuRFVSQVRJT04pO1xuICAgICAgICAgICAgX3RoaXMuJGZvcm1SZXNwb25zZVxuICAgICAgICAgICAgICAgIC5kZWxheShDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAgICAgLmFuaW1hdGUoe29wYWNpdHk6IDF9LCBDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAgICAgLmh0bWwocmVzcG9uc2VIVE1MKTtcbiAgICAgICAgICAgIF90aGlzLiRmb3JtQ29udGVudFxuICAgICAgICAgICAgICAgIC5kZWxheShDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAgICAgLmFuaW1hdGUoe2hlaWdodDogX3RoaXMuJGZvcm1SZXNwb25zZS5oZWlnaHQoKSArICdweCcgfSwgQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5jc3Moe3pJbmRleDogJy0xJ30pO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICAvLyBQcml2YXRlIEZ1bmN0aW9uc1xuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICAgIGZ1bmN0aW9uIF9zb3J0T2JqZWN0QXJyYXkoIGFycmF5LCBrZXksIG9yZGVyICkge1xuICAgICAgICBpZiAoICEgYXJyYXkgfHwgISBrZXkgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCAhIG9yZGVyICkge1xuICAgICAgICAgICAgb3JkZXIgPSAnQVNDJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIG9yZGVyID09PSAnQVNDJyApIHtcbiAgICAgICAgICAgIHJldHVybiBhcnJheS5zb3J0KCBmdW5jdGlvbihhLGIpeyBcbiAgICAgICAgICAgICAgICByZXR1cm4gYVtrZXldID4gYltrZXldOyBcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKCBvcmRlciA9PT0gJ0RFU0MnICkge1xuICAgICAgICAgICAgcmV0dXJuIGFycmF5LnNvcnQoIGZ1bmN0aW9uKGEsYil7IFxuICAgICAgICAgICAgICAgIHJldHVybiBhW2tleV0gPCBiW2tleV07IFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIC8vXG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtcm9vbS1yZXMtZm9ybScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBSb29tUmVzRm9ybSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFN0aWNraWVzXG4gKiBcbiAqIEJlaGF2aW91ciBmb3Igc3RpY2t5IGVsZW1lbnRzLlxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgJHdpbmRvdyA9ICQod2luZG93KSxcbiAgICAgICAgY2xhc3NOYW1lID0ge1xuICAgICAgICAgICAgaXNGaXhlZDogJ2NjbC1pcy1maXhlZCdcbiAgICAgICAgfTtcblxuICAgIHZhciBTdGlja3kgPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgLy8gdmFyaWFibGVzXG4gICAgICAgIHZhciAkZWwgPSAkKGVsKSxcbiAgICAgICAgICAgIGhlaWdodCA9ICRlbC5vdXRlckhlaWdodCgpLFxuICAgICAgICAgICAgb2Zmc2V0ID0gJGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgb3B0aW9ucyA9ICRlbC5kYXRhKCdzdGlja3knKSxcbiAgICAgICAgICAgIHdyYXBwZXIgPSAkKCc8ZGl2IGNsYXNzPVwianMtc3RpY2t5LXdyYXBwZXJcIj48L2Rpdj4nKS5jc3MoeyBoZWlnaHQ6IGhlaWdodCArICdweCcgfSk7XG5cbiAgICAgICAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICAgICAgb2Zmc2V0OiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyApO1xuXG4gICAgICAgIC8vIHdyYXAgZWxlbWVudFxuICAgICAgICAkZWwud3JhcCggd3JhcHBlciApO1xuXG4gICAgICAgIC8vIHNjcm9sbCBsaXN0ZW5lclxuICAgICAgICAkd2luZG93LnNjcm9sbCggQ0NMLnRocm90dGxlKCBfb25TY3JvbGwsIDEwMCApICk7XG5cbiAgICAgICAgLy8gb24gc2Nyb2xsXG4gICAgICAgIGZ1bmN0aW9uIF9vblNjcm9sbCgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCkgKyBvcHRpb25zLm9mZnNldDtcbiAgICBcbiAgICAgICAgICAgIGlmICggc2Nyb2xsVG9wID49IG9mZnNldC50b3AgKSB7XG4gICAgICAgICAgICAgICAgJGVsLmFkZENsYXNzKCBjbGFzc05hbWUuaXNGaXhlZCApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5pc0ZpeGVkICk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtaXMtc3RpY2t5JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFN0aWNreSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFRvZ2dsZSBTY2hvb2xzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBzY2hvb2wgdG9nZ2xlc1xuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBpbml0U2Nob29sID0gJCgnaHRtbCcpLmRhdGEoJ3NjaG9vbCcpO1xuXG4gICAgdmFyIFNjaG9vbFNlbGVjdCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJHNlbGVjdCA9ICQoZWwpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIFNjaG9vbFNlbGVjdC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICBpZiAoIGluaXRTY2hvb2wgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuJHNlbGVjdFxuICAgICAgICAgICAgICAgIC5maW5kKCAnb3B0aW9uW3ZhbHVlPVwiJyArIGluaXRTY2hvb2wgKyAnXCJdJyApXG4gICAgICAgICAgICAgICAgLmF0dHIoICdzZWxlY3RlZCcsICdzZWxlY3RlZCcgKTsgICBcblxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kc2VsZWN0LmNoYW5nZShmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAkKCdodG1sJykuYXR0ciggICdkYXRhLXNjaG9vbCcsIGV2ZW50LnRhcmdldC52YWx1ZSApO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwic2Nob29sXCJdJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFNjaG9vbFNlbGVjdCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKHRoaXMsIGpRdWVyeSk7IiwiLyoqXG4gKiBUb29sdGlwc1xuICogXG4gKiBCZWhhdmlvciBmb3IgdG9vbHRpcHNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIFRvb2x0aXAgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuJGVsLmF0dHIoJ3RpdGxlJyk7XG4gICAgICAgIHRoaXMuJHRvb2x0aXAgPSAkKCc8ZGl2IGlkPVwiY2NsLWN1cnJlbnQtdG9vbHRpcFwiIGNsYXNzPVwiY2NsLWMtdG9vbHRpcCBjY2wtaXMtdG9wXCIgcm9sZT1cInRvb2x0aXBcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2NsLWMtdG9vbHRpcF9fYXJyb3dcIj48L2Rpdj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2NsLWMtdG9vbHRpcF9faW5uZXJcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+Jyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgVG9vbHRpcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsLmhvdmVyKGZ1bmN0aW9uKGUpe1xuXG4gICAgICAgICAgICAvLyBtb3VzZW92ZXJcblxuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ3RpdGxlJywgJycpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCAnY2NsLWN1cnJlbnQtdG9vbHRpcCcpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG5cbiAgICAgICAgICAgIENDTC5yZWZsb3coX3RoaXMuJHRvb2x0aXBbMF0pO1xuXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gX3RoaXMuJGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgICAgIHdpZHRoICA9IF90aGlzLiRlbC5vdXRlcldpZHRoKCksXG4gICAgICAgICAgICAgICAgdG9vbHRpcEhlaWdodCA9IF90aGlzLiR0b29sdGlwLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wOiAob2Zmc2V0LnRvcCAtIHRvb2x0aXBIZWlnaHQpICsgJ3B4JyxcbiAgICAgICAgICAgICAgICBsZWZ0OiAob2Zmc2V0LmxlZnQgKyAod2lkdGgvMikpICsgJ3B4J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICB9LCBmdW5jdGlvbihlKXsgXG5cbiAgICAgICAgICAgIC8vbW91c2VvdXRcblxuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ3RpdGxlJywgX3RoaXMuY29udGVudCk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cignYXJpYS1kZXNjcmliZWRieScsICcnKTtcbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLnJlbW92ZUNsYXNzKCdjY2wtaXMtc2hvd24nKTtcbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLnJlbW92ZSgpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgVG9vbHRpcCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFdheWZpbmRpbmdcbiAqIFxuICogQ29udHJvbHMgaW50ZXJmYWNlIGZvciBsb29raW5nIHVwIGNhbGwgbnVtYmVyIGxvY2F0aW9uc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgdGFicywgd2F5ZmluZGVyO1xuICAgIFxuICAgIHZhciBUYWJzID0gZnVuY3Rpb24oZWwpIHtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHRhYnMgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtdGFiJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzID0gJCgnLmNjbC1jLXRhYl9fY29udGVudCcpO1xuICAgICAgICBcblxuICAgICAgICB0aGlzLiR0YWJzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciAkdGFiID0gJCh0aGlzKTtcbiAgICAgICAgICAgICR0YWIuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkdGFiLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICAgICAgICAgIC8vIF90aGlzLiR0YWJDb250ZW50cy5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIC8vIF90aGlzLiR0YWJDb250ZW50cy5maWx0ZXIodGFyZ2V0KS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIF90aGlzLnNldEFjdGl2ZSh0YXJnZXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBUYWJzLnByb3RvdHlwZS5zZXRBY3RpdmUgPSBmdW5jdGlvbih0YXJnZXQpe1xuICAgICAgICB0aGlzLiR0YWJzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYnMuZmlsdGVyKCdbaHJlZj1cIicrdGFyZ2V0KydcIl0nKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiR0YWJDb250ZW50cy5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiR0YWJDb250ZW50cy5maWx0ZXIodGFyZ2V0KS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgIH07XG5cbiAgICB2YXIgV2F5ZmluZGVyID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLmNhbGxOdW1iZXJzID0ge307XG4gICAgICAgIHRoaXMuJGZvcm0gPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW1iZXItc2VhcmNoJyk7XG4gICAgICAgIHRoaXMuJGlucHV0ID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtLWlucHV0Jyk7XG4gICAgICAgIHRoaXMuJHN1Ym1pdCA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bS1zdWJtaXQnKTtcbiAgICAgICAgdGhpcy4kbWFycXVlZSA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX21hcnF1ZWUnKTtcbiAgICAgICAgdGhpcy4kY2FsbE51bSA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX2NhbGwtbnVtJyk7XG4gICAgICAgIHRoaXMuJHdpbmcgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX193aW5nJyk7XG4gICAgICAgIHRoaXMuJGZsb29yID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fZmxvb3InKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdCA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX3N1YmplY3QnKTtcbiAgICAgICAgdGhpcy5lcnJvciA9IHtcbiAgICAgICAgICAgIGdldDogJzxkaXYgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3IgY2NsLXdheWZpbmRlcl9fZXJyb3JcIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNjbC1iLWNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj48aSBjbGFzcz1cImNjbC1iLWljb24tYWxlcnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IFRoZXJlIHdhcyBhbiBlcnJvciBmZXRjaGluZyBjYWxsIG51bWJlcnMuPC9kaXY+JyxcbiAgICAgICAgICAgIGZpbmQ6ICc8ZGl2IGNsYXNzPVwiY2NsLWMtYWxlcnQgY2NsLWlzLWVycm9yIGNjbC13YXlmaW5kZXJfX2Vycm9yXCI+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjY2wtYi1jbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+PC9idXR0b24+PGkgY2xhc3M9XCJjY2wtYi1pY29uLWFsZXJ0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPiBDb3VsZCBub3QgZmluZCB0aGF0IGNhbGwgbnVtYmVyLiBQbGVhc2UgdHJ5IGFnYWluLjwvZGl2PidcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy4kZXJyb3JCb3ggPSAkKCcuY2NsLWVycm9yLWJveCcpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgJC5nZXRKU09OKCBDQ0wuYXNzZXRzICsgJ2pzL2NhbGwtbnVtYmVycy5qc29uJyApXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBfdGhpcy5jYWxsTnVtYmVycyA9IGRhdGE7XG4gICAgICAgICAgICAgICAgX3RoaXMuaW5pdCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRlcnJvckJveC5hcHBlbmQoIHRoaXMuZXJyb3IuZ2V0ICk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjY2wtYXBwLWFjdGl2ZScpO1xuXG4gICAgICAgIHRoaXMuJGlucHV0XG4gICAgICAgICAgICAua2V5dXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBxdWVyeSA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCBxdWVyeSA9PT0gXCJcIiApIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kbWFycXVlZS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJlc2V0KCk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRzdWJtaXQuYXR0cignZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRmb3JtLnN1Ym1pdChmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gX3RoaXMuJGlucHV0LnZhbCgpO1xuXG4gICAgICAgICAgICAkKCcuY2NsLXdheWZpbmRlcl9fZXJyb3InKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIF90aGlzLiRtYXJxdWVlLnNob3coKTtcbiAgICAgICAgICAgIF90aGlzLiRjYWxsTnVtLnRleHQocXVlcnkpO1xuICAgICAgICAgICAgX3RoaXMuZmluZFJvb20oIHF1ZXJ5ICk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUuZ2V0Q2FsbEtleSA9IGZ1bmN0aW9uKGNhbGxOdW0pIHtcbiAgICAgICAgdmFyIGtleSxcbiAgICAgICAgICAgIGNhbGxLZXlzID0gT2JqZWN0LmtleXModGhpcy5jYWxsTnVtYmVycyk7XG5cbiAgICAgICAgaWYgKCBjYWxsS2V5cy5sZW5ndGggPT09IDAgKXtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNhbGxLZXlzLmZvckVhY2goZnVuY3Rpb24oayl7XG4gICAgICAgICAgaWYgKCBjYWxsTnVtID49IGsgKSB7XG4gICAgICAgICAgICBrZXkgPSBrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5maW5kUm9vbSA9IGZ1bmN0aW9uKHF1ZXJ5KSB7XG5cbiAgICAgICAgcXVlcnkgPSBxdWVyeS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBcbiAgICAgICAgdmFyIGNhbGxLZXkgPSB0aGlzLmdldENhbGxLZXkocXVlcnkpLFxuICAgICAgICAgICAgY2FsbERhdGEgPSB7fSxcbiAgICAgICAgICAgIHJvb207XG5cbiAgICAgICAgaWYgKCAhIGNhbGxLZXkgKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93RmluZEVycm9yKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCgnLmNjbC1jLXNlYXJjaCcpLm9mZnNldCgpLnRvcCB9KTtcbiAgICAgICAgXG4gICAgICAgIGNhbGxEYXRhID0gdGhpcy5jYWxsTnVtYmVyc1tjYWxsS2V5XTtcblxuICAgICAgICB0aGlzLiRmbG9vci50ZXh0KCBjYWxsRGF0YS5mbG9vciApO1xuICAgICAgICB0aGlzLiR3aW5nLnRleHQoIGNhbGxEYXRhLndpbmcgKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdC50ZXh0KCBjYWxsRGF0YS5zdWJqZWN0ICk7XG5cbiAgICAgICAgLyogVE9ETzpcbiAgICAgICAgICogc2V0IEFDVFVBTCByb29tLCBub3QganVzdCB0aGUgZmxvb3IuIHN0aWxsIHdhaXRpbmcgb24gY2xpZW50IFxuICAgICAgICAgKiB0byBwcm92aWRlIGRhdGEgZm9yIHdoaWNoIGNhbGwgbnVtYmVycyBiZWxvbmcgdG8gd2hpY2ggcm9vbXNcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgICAgICByb29tID0gY2FsbERhdGEuZmxvb3JfaW50O1xuXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cbiAgICAgICAgdGhpcy4kZWwuZmluZCgnYVtocmVmPVwiI2Zsb29yLScrcm9vbSsnXCJdJykuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnI3Jvb20tJytyb29tKyctMScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgdGFicy5zZXRBY3RpdmUoICcjZmxvb3ItJyArIHJvb20gKTtcbiAgICAgICAgXG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnYVtocmVmKj1cIiNmbG9vci1cIl0nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuY2NsLWMtZmxvb3JfX3Jvb20nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLnRocm93RmluZEVycm9yID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnYVtocmVmKj1cIiNmbG9vci1cIl0nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuY2NsLWMtZmxvb3JfX3Jvb20nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRmbG9vci50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiR3aW5nLnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJHN1YmplY3QudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kZXJyb3JCb3guYXBwZW5kKCB0aGlzLmVycm9yLmZpbmQgKTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1qcy10YWJzJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGFicyA9IG5ldyBUYWJzKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmNjbC1qcy13YXlmaW5kZXInKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB3YXlmaW5kZXIgPSBuZXcgV2F5ZmluZGVyKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiJdfQ==
