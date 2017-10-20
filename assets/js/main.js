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
                    "from": "2017-10-20T12:00:00-07:00",
                    "to": "2017-10-20T12:30:00-07:00"
                },
                {
                    "from": "2017-10-20T12:30:00-07:00",
                    "to": "2017-10-20T13:00:00-07:00"
                },
                {
                    "from": "2017-10-20T13:00:00-07:00",
                    "to": "2017-10-20T13:30:00-07:00"
                },
                {
                    "from": "2017-10-20T13:30:00-07:00",
                    "to": "2017-10-20T14:00:00-07:00"
                },
                {
                    "from": "2017-10-20T14:00:00-07:00",
                    "to": "2017-10-20T14:30:00-07:00"
                },
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

        this.getRoomAvailability(todayYmd)
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

    RoomResForm.prototype.getRoomAvailability = function(Ymd){

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

                // console.log('item',item,'slots',difference/);

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

        this.getRoomAvailability(this.dateYmd)
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
        
    };

    RoomResForm.prototype.onSlotChange = function(changedInput){

        // if input checked, add it to selected set
        if ( $(changedInput).prop('checked') ) {
            this.selectedSlotInputs.push(changedInput);
            $(changedInput).parent('.ccl-c-room__slot').addClass('ccl-is-checked');

        // if unchecked, remove it from the selected set
        } else {
            var inputIndex = this.selectedSlotInputs.indexOf(changedInput);
            if ( inputIndex > -1 ) {
                this.selectedSlotInputs.splice( inputIndex, 1 );
            }
            $(changedInput).parent('.ccl-c-room__slot').removeClass('ccl-is-checked');
        }

        // limit number of selected slots
        if ( this.selectedSlotInputs.length > this.maxSlots ) {
            var shiftedInput = this.selectedSlotInputs.shift();
            this.clearSlot(shiftedInput);
        }

        // auto select slots in between the 2 outermost slots
        // if ( this.selectedSlotInputs.length > 1 ) {
        //     var selection = $.extend([],this.selectedSlotInputs),
        //         sortedSelection = selection.sort(function(a,b){ 
        //             return a.value > b.value; 
        //         }),
        //         firstEl = sortedSelection[0],
        //         firstIndex = this.$roomSlotInputs.index(firstEl),
        //         lastEl = sortedSelection[sortedSelection.length - 1],
        //         lastIndex = this.$roomSlotInputs.index(lastEl),
        //         changedInputIndex = this.$roomSlotInputs.index(changedInput),
        //         upToIndex = Math.min( changedInputIndex, firstIndex + this.maxSlots );

        //     console.log('firstIndex', firstIndex, 'changedInputIndex', changedInputIndex, 'firstIndex + this.maxSlots', firstIndex + this.maxSlots );
        //     console.log('upToIndex',upToIndex);

        //     // loop through and activate slots, but only up to maxSlots
        //     for ( var i = firstIndex + 1; i < upToIndex; i++ ) {
        //         this.activateSlot( this.$roomSlotInputs.eq(i) );
        //     }

        //     // deselect changed input if its beyond the maxSlots range
        //     if ( changedInputIndex >= firstIndex + this.maxSlots ) {
        //         this.clearSlot( this.$roomSlotInputs.eq(changedInputIndex) );
        //     }
            
        // }

        this.setCurrentDurationText();

    };

    RoomResForm.prototype.clearSlot = function(slot) {
        // slot can be either the checkbox -OR- the checkbox's container

        // if it's the checkbox.
        if ( $(slot).is('[type="checkbox"]') ) {
         
            $(slot)
                .prop('checked',false)
                .parent('.ccl-c-room__slot')
                    .removeClass('ccl-is-checked');
            
        // if it's the container
        } else {

            $(slot)
                .removeClass('ccl-is-checked')
                .find('[type="checkbox"]')
                    .prop('checked',false);

        }
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
            "nickname":"Test Room Reservation",
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

        /* TODO:
         * Make a POST request here to reserve space.
         * ------------------------------------------ */
        // $.post({
        //         url: CCL.site_url + 'api/rooms/reserve',
        //         data: payload
        //     })
        //     .done(function(response){
        //         handleSubmitResponse(response);
        //     })
        //     .fail(function(error){
        //         console.log(error);
        //     })
        //     .always(function(){
        //         this.$el.removeClass('ccl-is-loading');
        //     });

        // for now, just invoking the handler manually with dummy data
        var errorResponse = { 
                "errors": [ "some error message" ] 
            },
            successfulResponse = {
                "booking_id": "cs_L6v9gi8"
            };

        handleSubmitResponse(successfulResponse);

        function handleSubmitResponse(response) {

            var responseHTML;

            if ( response.booking_id ) {
                responseHTML =  ['<p class="ccl-h2 ccl-u-mt-0">Success!</p>',
                                '<p class="ccl-h4">Your booking ID is <span class="ccl-u-color-school">' + response.booking_id + '</span></p>',
                                '<p class="ccl-h4">Please check your email to confirm your booking.</p>'];
            } else {
                responseHTML =  ['<p class="ccl-h3 ccl-u-mt-0">Sorry, but we couldn\'t process your reservation.</p>','<p class="ccl-h4">Errors:</p>'];
                $(response.errors).each(function(i, error){
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkcm9wZG93bnMuanMiLCJtb2RhbHMuanMiLCJyb29tLXJlcy5qcyIsInN0aWNraWVzLmpzIiwidG9nZ2xlLXNjaG9vbHMuanMiLCJ0b29sdGlwcy5qcyIsIndheWZpbmRpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNob0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEdsb2JhbCBWYXJpYWJsZXMuIFxuICovXG5cblxuKGZ1bmN0aW9uICggJCwgd2luZG93ICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wuRFVSQVRJT04gPSAzMDA7XG5cbiAgICBDQ0wuQlJFQUtQT0lOVF9TTSA9IDUwMDtcbiAgICBDQ0wuQlJFQUtQT0lOVF9NRCA9IDc2ODtcbiAgICBDQ0wuQlJFQUtQT0lOVF9MRyA9IDEwMDA7XG4gICAgQ0NMLkJSRUFLUE9JTlRfWEwgPSAxNTAwO1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnaHRtbCcpLnRvZ2dsZUNsYXNzKCduby1qcyBqcycpO1xuICAgIH0pO1xuXG59KShqUXVlcnksIHRoaXMpOyIsIi8qKlxuICogUmVmbG93IHBhZ2UgZWxlbWVudHMuIFxuICogXG4gKiBFbmFibGVzIGFuaW1hdGlvbnMvdHJhbnNpdGlvbnMgb24gZWxlbWVudHMgYWRkZWQgdG8gdGhlIHBhZ2UgYWZ0ZXIgdGhlIERPTSBoYXMgbG9hZGVkLlxuICovXG5cblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLnJlZmxvdyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICB9O1xuXG59KSgpOyIsIi8qKlxuICogR2V0IHRoZSBTY3JvbGxiYXIgd2lkdGhcbiAqIFRoYW5rcyB0byBkYXZpZCB3YWxzaDogaHR0cHM6Ly9kYXZpZHdhbHNoLm5hbWUvZGV0ZWN0LXNjcm9sbGJhci13aWR0aFxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuICAgIFxuICAgIGZ1bmN0aW9uIGdldFNjcm9sbFdpZHRoKCkge1xuICAgICAgICBcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtZWFzdXJlbWVudCBub2RlXG4gICAgICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gcG9zaXRpb24gd2F5IHRoZSBoZWxsIG9mZiBzY3JlZW5cbiAgICAgICAgJChzY3JvbGxEaXYpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogJzEwMHB4JyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMHB4JyxcbiAgICAgICAgICAgIG92ZXJmbG93OiAnc2Nyb2xsJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAnLTk5OTlweCcsXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQoc2Nyb2xsRGl2KTtcblxuICAgICAgICAvLyBHZXQgdGhlIHNjcm9sbGJhciB3aWR0aFxuICAgICAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybihzY3JvbGxiYXJXaWR0aCk7IC8vIE1hYzogIDE1XG5cbiAgICAgICAgLy8gRGVsZXRlIHRoZSBESVYgXG4gICAgICAgICQoc2Nyb2xsRGl2KS5yZW1vdmUoKTtcblxuICAgICAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG4gICAgfVxuICAgIFxuICAgIGlmICggISB3aW5kb3cuQ0NMICkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLmdldFNjcm9sbFdpZHRoID0gZ2V0U2Nyb2xsV2lkdGg7XG4gICAgQ0NMLlNDUk9MTEJBUldJRFRIID0gZ2V0U2Nyb2xsV2lkdGgoKTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogLmRlYm91bmNlKCkgZnVuY3Rpb25cbiAqIFxuICogU291cmNlOiBodHRwczovL2Rhdmlkd2Fsc2gubmFtZS9qYXZhc2NyaXB0LWRlYm91bmNlLWZ1bmN0aW9uXG4gKi9cblxuXG4oZnVuY3Rpb24od2luZG93KSB7XG5cbiAgICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gICAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgICB2YXIgdGhyb3R0bGUgPSBmdW5jdGlvbiAoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgdGltZW91dCwgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgICAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgICAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblxuICAgICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgdGhyb3R0bGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgICAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhyb3R0bGVkLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgIHByZXZpb3VzID0gMDtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHRocm90dGxlZDtcbiAgICB9O1xuXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICB3aW5kb3cuQ0NMLnRocm90dGxlID0gdGhyb3R0bGU7XG5cbn0pKHRoaXMpOyIsIi8qKlxuICogQWNjb3JkaW9uc1xuICogXG4gKiBCZWhhdmlvciBmb3IgYWNjb3JkaW9uIGNvbXBvbmVudHNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIEFjY29yZGlvbiA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdG9nZ2xlID0gdGhpcy4kZWwuY2hpbGRyZW4oJy5jY2wtYy1hY2NvcmRpb25fX3RvZ2dsZScpO1xuICAgICAgICB0aGlzLiRjb250ZW50ID0gdGhpcy4kZWwuY2hpbGRyZW4oJy5jY2wtYy1hY2NvcmRpb25fX2NvbnRlbnQnKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEFjY29yZGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kdG9nZ2xlLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgX3RoaXMuJGNvbnRlbnQuc2xpZGVUb2dnbGUoKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC50b2dnbGVDbGFzcygnY2NsLWlzLW9wZW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1jLWFjY29yZGlvbicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBBY2NvcmRpb24odGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBBbGVydHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIGFsZXJ0c1xuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBEVVJBVElPTiA9IENDTC5EVVJBVElPTjtcblxuICAgIHZhciBBbGVydERpc21pc3MgPSBmdW5jdGlvbigkZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gJGVsLnBhcmVudCgpO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBBbGVydERpc21pc3MucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIF90aGlzLiR0YXJnZXQuYW5pbWF0ZSggeyBvcGFjaXR5OiAwIH0sIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiBEVVJBVElPTixcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF90aGlzLiR0YXJnZXQuc2xpZGVVcCggRFVSQVRJT04sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiR0YXJnZXQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuXG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKGRvY3VtZW50KS5vbiggJ2NsaWNrJywgJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXScsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgdmFyIGRpc21pc3NFbCA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXScpO1xuICAgICAgICAgICAgbmV3IEFsZXJ0RGlzbWlzcyhkaXNtaXNzRWwpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIENhcm91c2Vsc1xuICogXG4gKiBJbml0aWFsaXplIGFuZCBkZWZpbmUgYmVoYXZpb3IgZm9yIGNhcm91c2Vscy4gXG4gKiBVc2VzIHRoZSBTbGljayBTbGlkZXMgalF1ZXJ5IHBsdWdpbiAtLT4gaHR0cDovL2tlbndoZWVsZXIuZ2l0aHViLmlvL3NsaWNrL1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgQ2Fyb3VzZWwgPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5nbG9iYWxEZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgZG90c0NsYXNzOiAnY2NsLWMtY2Fyb3VzZWxfX3BhZ2luZycsXG4gICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB9O1xuXG4gICAgQ2Fyb3VzZWwucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLiRlbC5kYXRhKCksXG4gICAgICAgICAgICBvcHRpb25zID0gZGF0YS5vcHRpb25zIHx8IHt9O1xuICAgICAgICAgICAgXG4gICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZSA9IFtdO1xuXG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zU20gKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfU00sIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNTbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNNZCApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9NRCwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc01kXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc0xnICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX0xHLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zTGdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zWGwgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfWEwsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNYbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoIHRoaXMuZ2xvYmFsRGVmYXVsdHMsIG9wdGlvbnMgKTtcblxuICAgICAgICB2YXIgY2Fyb3VzZWwgPSB0aGlzLiRlbC5zbGljayhvcHRpb25zKSxcbiAgICAgICAgICAgIF90aGlzID0gdGhpcztcblxuICAgICAgICBjYXJvdXNlbC5vbignYmVmb3JlQ2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSl7XG4gICAgICAgICAgICBfdGhpcy4kZWwuZmluZCgnLnNsaWNrLXNsaWRlJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1wYXN0Jyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuZmluZCgnLnNsaWNrLXNsaWRlW2RhdGEtc2xpY2staW5kZXg9XCInK25leHRTbGlkZSsnXCJdJykucHJldkFsbCgpLmFkZENsYXNzKCdjY2wtaXMtcGFzdCcpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmpzLXByb21vLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IENhcm91c2VsKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogRHJvcGRvd25zXG4gKiBcbiAqIEluaXRpYWxpemUgYW5kIGNvbnRyb2wgYmVoYXZpb3IgZm9yIGRyb3Bkb3duIG1lbnVzXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgIFRPR0dMRTogJ1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJyxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lID0ge1xuICAgICAgICAgICAgQUNUSVZFOiAnY2NsLWlzLWFjdGl2ZScsXG4gICAgICAgICAgICBNRU5VOiAnY2NsLWMtZHJvcGRvd25fX21lbnUnXG4gICAgICAgIH07XG5cbiAgICB2YXIgRHJvcGRvd25Ub2dnbGUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZSA9ICQoZWwpO1xuICAgICAgICB0aGlzLiRwYXJlbnQgPSB0aGlzLiR0b2dnbGUucGFyZW50KCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy4kdG9nZ2xlLmRhdGEoJ3RhcmdldCcpO1xuXG4gICAgICAgIHRoaXMuJG1lbnUgPSAkKCB0YXJnZXQgKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiR0b2dnbGUuY2xpY2soIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIF90aGlzLnRvZ2dsZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgdmFyIGhhc0FjdGl2ZU1lbnVzID0gJCggJy4nICsgY2xhc3NOYW1lLk1FTlUgKyAnLicgKyBjbGFzc05hbWUuQUNUSVZFICkubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKCBoYXNBY3RpdmVNZW51cyApe1xuICAgICAgICAgICAgICAgIF9jbGVhck1lbnVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBpc0FjdGl2ZSA9IHRoaXMuJHRvZ2dsZS5oYXNDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuXG4gICAgICAgIGlmICggaXNBY3RpdmUgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNob3dNZW51KCk7XG5cbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLnNob3dNZW51ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB0aGlzLiRtZW51LmFkZENsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgIHRoaXMuJHBhcmVudC5hZGRDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuaGlkZU1lbnUgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiR0b2dnbGUuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICB0aGlzLiRtZW51LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgIHRoaXMuJHBhcmVudC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBfY2xlYXJNZW51cygpIHtcbiAgICAgICAgJCgnLmNjbC1jLWRyb3Bkb3duLCAuY2NsLWMtZHJvcGRvd25fX21lbnUnKS5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICAkKCBzZWxlY3Rvci5UT0dHTEUgKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCggc2VsZWN0b3IuVE9HR0xFICkuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IERyb3Bkb3duVG9nZ2xlKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogTW9kYWxzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBtb2RhbHMuIEJhc2VkIG9uIEJvb3RzdHJhcCdzIG1vZGFsczogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvNC4wL2NvbXBvbmVudHMvbW9kYWwvXG4gKiBcbiAqIEdsb2JhbHM6XG4gKiBTQ1JPTExCQVJXSURUSFxuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBEVVJBVElPTiA9IDMwMDtcblxuICAgIHZhciBNb2RhbFRvZ2dsZSA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgXG4gICAgICAgIHZhciAkZWwgPSAkKGVsKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gJGVsLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpczsgXG5cbiAgICAgICAgX3RoaXMuJGVsLm9uKCAnY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKCAkKGRvY3VtZW50LmJvZHkpLmhhc0NsYXNzKCdjY2wtbW9kYWwtb3BlbicpICkge1xuICAgICAgICAgICAgICAgIF90aGlzLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0JhY2tkcm9wKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnNob3dNb2RhbCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuc2hvd0JhY2tkcm9wID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuXG4gICAgICAgIHZhciBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB2YXIgJGJhY2tkcm9wID0gJChiYWNrZHJvcCk7XG5cbiAgICAgICAgJGJhY2tkcm9wLmFkZENsYXNzKCdjY2wtYy1tb2RhbF9fYmFja2Ryb3AnKTtcbiAgICAgICAgJGJhY2tkcm9wLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuICAgICAgICBcbiAgICAgICAgQ0NMLnJlZmxvdyhiYWNrZHJvcCk7XG4gICAgICAgIFxuICAgICAgICAkYmFja2Ryb3AuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgICQoZG9jdW1lbnQuYm9keSlcbiAgICAgICAgICAgIC5hZGRDbGFzcygnY2NsLW1vZGFsLW9wZW4nKVxuICAgICAgICAgICAgLmNzcyggJ3BhZGRpbmctcmlnaHQnLCBDQ0wuU0NST0xMQkFSV0lEVEggKTtcblxuICAgICAgICBpZiAoIGNhbGxiYWNrICkge1xuICAgICAgICAgICAgc2V0VGltZW91dCggY2FsbGJhY2ssIERVUkFUSU9OICk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLnNob3dNb2RhbCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIF90aGlzLiR0YXJnZXQuc2hvdyggMCwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIF90aGlzLiR0YXJnZXQuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICQoJy5jY2wtYy1tb2RhbCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWwnKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbF9fYmFja2Ryb3AnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbF9fYmFja2Ryb3AnKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuYm9keSlcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtbW9kYWwtb3BlbicpXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoICdwYWRkaW5nLXJpZ2h0JywgJycgKTtcblxuICAgICAgICAgICAgfSwgRFVSQVRJT04pO1xuXG4gICAgICAgIH0sIERVUkFUSU9OICk7IFxuXG4gICAgfTtcblxuXG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBNb2RhbFRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKHRoaXMsIGpRdWVyeSk7IiwiLyoqXG4gKiBSb29tIFJlc2VydmF0aW9uXG4gKiBcbiAqIEhhbmRsZSByb29tIHJlc2VydmF0aW9uc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIC8vIFRPRE86IFJlbW92ZVxuICAgIHZhciBkdW1teUF2YWlsYWJpbGl0eURhdGEgPSBbXG4gICAgICAgIHtcbiAgICAgICAgICAgIFwiaWRcIjogOTE0OCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIkdyb3VwIFN0dWR5IDFcIixcbiAgICAgICAgICAgIFwiZGVzY3JpcHRpb25cIjogXCJcIixcbiAgICAgICAgICAgIFwiaW1hZ2VcIjogXCJcIixcbiAgICAgICAgICAgIFwiY2FwYWNpdHlcIjogXCI2XCIsXG4gICAgICAgICAgICBcImF2YWlsYWJpbGl0eVwiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDA4OjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDA4OjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQwODozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQwOTowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMDk6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMDk6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDA5OjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDEwOjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxMjowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxMjozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTI6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTM6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDEzOjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDEzOjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxMzozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxNDowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTQ6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTQ6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDE0OjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDE1OjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxNTowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxNTozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTU6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTY6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDE2OjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDE2OjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxNjozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxNzowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTc6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTc6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDE3OjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDE4OjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxODowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxODozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTg6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTk6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDE5OjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDE5OjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxOTozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQyMDowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMjA6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMjA6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDIwOjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDIxOjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQyMTowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQyMTozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMjE6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMjI6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgIF07XG5cbiAgICB2YXIgUm9vbVJlc0Zvcm0gPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiRmb3JtQ29udGVudCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLWNvbnRlbnQnKS5jc3Moe3Bvc2l0aW9uOidyZWxhdGl2ZSd9KTtcbiAgICAgICAgdGhpcy4kZm9ybVJlc3BvbnNlID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tcmVzcG9uc2UnKS5jc3Moe3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6ICcxcmVtJywgbGVmdDogJzFyZW0nLCBvcGFjaXR5OiAwfSk7XG4gICAgICAgIHRoaXMuJGZvcm1DYW5jZWwgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1jYW5jZWwnKTtcbiAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLXN1Ym1pdCcpO1xuICAgICAgICB0aGlzLnJvb21JZD0gdGhpcy4kZWwuZGF0YSgncmVzb3VyY2UtaWQnKTtcbiAgICAgICAgdGhpcy4kZGF0ZVNlbGVjdCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLWRhdGUtc2VsZWN0Jyk7XG4gICAgICAgIHRoaXMuZGF0ZVltZCA9IHRoaXMuJGRhdGVTZWxlY3QudmFsKCk7XG4gICAgICAgIHRoaXMuJHJvb21TY2hlZHVsZSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXNjaGVkdWxlJyk7XG4gICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQgPSB0aGlzLiRlbC5maW5kKCcuanMtY3VycmVudC1kdXJhdGlvbicpO1xuICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cyA9IG51bGw7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzID0gW107XG4gICAgICAgIHRoaXMubGFzdFNlbGVjdGVkU2xvdCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1heFNsb3RzID0gNDtcbiAgICAgICAgdGhpcy4kbWF4VGltZSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1tYXgtdGltZScpO1xuICAgICAgICB0aGlzLnNsb3RNaW51dGVzID0gMzA7XG4gICAgICAgIHRoaXMudGltZVpvbmUgPSAnLTcwMCc7XG4gICAgICAgIHRoaXMub3BlblRpbWUgPSBuZXcgRGF0ZSggbm93LmdldEZ1bGxZZWFyKCksIG5vdy5nZXRNb250aCgpLCBub3cuZ2V0RGF0ZSgpLCA4ICk7IC8vIDhhbSB0b2RheVxuICAgICAgICB0aGlzLmNsb3NlVGltZSA9IG5ldyBEYXRlKCBub3cuZ2V0RnVsbFllYXIoKSwgbm93LmdldE1vbnRoKCksIG5vdy5nZXREYXRlKCksIDE3ICk7IC8vIDVwbSB0b2RheTtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgdG9kYXlZbWQ9IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKS5zcGxpdCgnVCcpWzBdO1xuXG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuXG4gICAgICAgIHRoaXMuc2V0TWF4VGltZVRleHQoKTtcblxuICAgICAgICB0aGlzLmdldFJvb21BdmFpbGFiaWxpdHkodG9kYXlZbWQpXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBSZW1vdmVcbiAgICAgICAgICAgICAgICAvLyB1c2UgZHVtbXkgdGV4dFxuICAgICAgICAgICAgICAgIGRhdGEgPSBkdW1teUF2YWlsYWJpbGl0eURhdGE7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgX3RoaXMubWFrZVNjaGVkdWxlKGRhdGEpO1xuXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBfdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLmluaXREYXRlRXZlbnRzKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXRGb3JtRXZlbnRzKCk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5nZXRSb29tQXZhaWxhYmlsaXR5ID0gZnVuY3Rpb24oWW1kKXtcblxuICAgICAgICAvKiBUT0RPOlxuICAgICAgICAgKiBNYWtlIGEgR0VUIHJlcXVlc3QgaGVyZSBmb3Igc3BhY2UgYXZhaWxhYmlsaXR5LlxuICAgICAgICAgKiBodHRwczovL2NsYXJlbW9udC5saWJjYWwuY29tL2FkbWluX2FwaS5waHA/dmVyc2lvbj0xLjEmZW5kcG9pbnQ9c3BhY2VfZ2V0XG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgICAgICByZXR1cm4gJC5nZXQoe1xuICAgICAgICAgICAgLy8gdXJsOiBDQ0wuc2l0ZV91cmwgKyAnYXBpL3Jvb21zL2F2YWlsYWJpbGl0eS85MTQ4JyxcbiAgICAgICAgICAgIHVybDogJyMnLFxuICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICdhdmFpbGFiaWxpdHknOiBZbWQgLy8gZS5nLiAnMjAxNy0xMC0xOSdcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm1ha2VTY2hlZHVsZSA9IGZ1bmN0aW9uKGRheURhdGEpe1xuXG4gICAgICAgIC8vIGdldCBvYmplY3QgZm9yIGZpcnN0IHJvb20gaW4gYXJyYXkuIHdlJ3JlIG9ubHkgY2FsbGluZyBkYXRhIGZvciBvbmUgcm9vbSBhdCBhIHRpbWUuXG4gICAgICAgIGRheURhdGEgPSBkYXlEYXRhWzBdO1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgICAgICBodG1sID0gW10sXG4gICAgICAgICAgICBhdmFpbGFiaWxpdHkgPSBkYXlEYXRhLmF2YWlsYWJpbGl0eSxcbiAgICAgICAgICAgIG9sZFRvVGltZTtcbiAgICAgICAgICAgIFxuICAgICAgICAvLyBjb25zdHJ1Y3QgSFRNTCBmb3IgZWFjaCB0aW1lIHNsb3RcbiAgICAgICAgJChkYXlEYXRhLmF2YWlsYWJpbGl0eSkuZWFjaChmdW5jdGlvbihpLGl0ZW0pe1xuXG4gICAgICAgICAgICB2YXIgbmV3RnJvbVRpbWUgPSBpdGVtLmZyb20sXG4gICAgICAgICAgICAgICAgc2xvdERhdGVUaW1lID0gbmV3IERhdGUoIGl0ZW0uZnJvbSApO1xuXG4gICAgICAgICAgICAvLyBjb21wYXJlIHRoaXMgaXRlbSBhbmQgdGhlIHByZXZpb3VzIGl0ZW0gdG8gbG9vayBmb3IgZ2FwcyBpbiB0aW1lLlxuICAgICAgICAgICAgLy8gZ2FwcyBpbmRpY2F0ZWQgYSByZXNlcnZlZCBibG9jayBvZiB0aW1lXG4gICAgICAgICAgICBpZiAoIG9sZFRvVGltZSAmJiBvbGRUb1RpbWUgIT0gbmV3RnJvbVRpbWUgICkge1xuXG4gICAgICAgICAgICAgICAgdmFyIG5ld0Zyb21UaW1lVW5peCA9IG5ldyBEYXRlKG5ld0Zyb21UaW1lKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgIG9sZFRvVGltZVVuaXggPSBuZXcgRGF0ZShvbGRUb1RpbWUpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgZGlmZmVyZW5jZSA9IG5ld0Zyb21UaW1lVW5peCAtIG9sZFRvVGltZVVuaXgsXG4gICAgICAgICAgICAgICAgICAgIHNsb3RzO1xuXG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2l0ZW0nLGl0ZW0sJ3Nsb3RzJyxkaWZmZXJlbmNlLyk7XG5cbiAgICAgICAgICAgICAgICAvLyBnZXQgZGlmZmVyZW5jZSBpbiBtaW51dGVzXG4gICAgICAgICAgICAgICAgZGlmZmVyZW5jZSA9IGRpZmZlcmVuY2UgLyAxMDAwIC8gNjA7XG4gICAgICAgICAgICAgICAgc2xvdHMgPSBkaWZmZXJlbmNlIC8gX3RoaXMuc2xvdE1pbnV0ZXM7XG5cbiAgICAgICAgICAgICAgICAvLyBidWlsZCBzbG90cyBmb3Igb2NjdXBpZWQgKHVuc2VsZWN0YWJsZSkgdGltZVxuICAgICAgICAgICAgICAgIGZvciAoIHZhciBqID0gMDsgaiA8IHNsb3RzOyBqKysgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGFkZE1pbGxpc2Vjb25kcyA9IGogKiBfdGhpcy5zbG90TWludXRlcyAqIDYwICogMTAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1VuaXggPSBvbGRUb1RpbWVVbml4ICsgYWRkTWlsbGlzZWNvbmRzO1xuXG4gICAgICAgICAgICAgICAgICAgIGh0bWwucHVzaCggX3RoaXMubWFrZVRpbWVTbG90KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiAnc2xvdC0nICsgX3RoaXMucm9vbUlkICsgJy0nICsgaSArICctJyArIGosXG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZDogJ2Rpc2FibGVkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsYXNzOiAnY2NsLWlzLW9jY3VwaWVkJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlOiBfdGhpcy5mb3JtYXREYXRlU3RyaW5nKCBuZXcgRGF0ZShuZXdVbml4KSApLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZVN0cmluZzogX3RoaXMuZm9ybWF0RGF0ZVN0cmluZyggbmV3IERhdGUobmV3VW5peCksICdyZWFkYWJsZScgKVxuICAgICAgICAgICAgICAgICAgICB9KSApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBidWlsZCBzZWxlY3RhYmxlIHRpbWUgc2xvdHNcbiAgICAgICAgICAgIGh0bWwucHVzaCggX3RoaXMubWFrZVRpbWVTbG90KHtcbiAgICAgICAgICAgICAgICBpZDogJ3Nsb3QtJyArIF90aGlzLnJvb21JZCArICctJyArIGksXG4gICAgICAgICAgICAgICAgdmFsdWU6IF90aGlzLmZvcm1hdERhdGVTdHJpbmcoIHNsb3REYXRlVGltZSApLFxuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmc6IF90aGlzLmZvcm1hdERhdGVTdHJpbmcoIHNsb3REYXRlVGltZSwgJ3JlYWRhYmxlJyApXG4gICAgICAgICAgICB9KSApO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGUgdmFyaWFibGUgdG8gdGhlIGN1cnJlbnQgaXRlbSdzIFwidG9cIiB2YWx1ZS5cbiAgICAgICAgICAgIG9sZFRvVGltZSA9IGl0ZW0udG87XG4gICAgICAgIFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cyA9IFtdO1xuXG4gICAgICAgIHRoaXMuJHJvb21TY2hlZHVsZS5odG1sKCBodG1sLmpvaW4oJycpICk7XG5cbiAgICAgICAgdGhpcy4kcm9vbVNsb3RJbnB1dHMgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtcm9vbV9fc2xvdCBbdHlwZT1cImNoZWNrYm94XCJdJyk7XG5cbiAgICAgICAgdGhpcy5zZXRDdXJyZW50RHVyYXRpb25UZXh0KCk7XG5cbiAgICAgICAgLy8gdGhpcy5zZXRPY2N1cGllZFJvb21zKCk7XG5cbiAgICAgICAgdGhpcy5pbml0U2xvdEV2ZW50cygpO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5tYWtlVGltZVNsb3QgPSBmdW5jdGlvbih2YXJzKXtcbiAgICAgICAgXG4gICAgICAgIGlmICggISB2YXJzIHx8IHR5cGVvZiB2YXJzICE9PSAnb2JqZWN0JyApIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGNsYXNzOiAnJyxcbiAgICAgICAgICAgIGlkOiAnJyxcbiAgICAgICAgICAgIGRpc2FibGVkOiAnJyxcbiAgICAgICAgICAgIHZhbHVlOiAnJyxcbiAgICAgICAgICAgIHRpbWVTdHJpbmc6ICcnXG4gICAgICAgIH07XG4gICAgICAgIHZhcnMgPSAkLmV4dGVuZChkZWZhdWx0cywgdmFycyk7XG5cbiAgICAgICAgdmFyIHRlbXBsYXRlID0gJycgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy1yb29tX19zbG90ICcgKyB2YXJzLmNsYXNzICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCInICsgdmFycy5pZCArICdcIiBuYW1lPVwiJyArIHZhcnMuaWQgKyAnXCIgdmFsdWU9XCInICsgdmFycy52YWx1ZSArICdcIiAnICsgdmFycy5kaXNhYmxlZCArICcvPicgK1xuICAgICAgICAgICAgICAgICc8bGFiZWwgY2xhc3M9XCJjY2wtYy1yb29tX19zbG90LWxhYmVsXCIgZm9yPVwiJyArIHZhcnMuaWQgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgICAgIHZhcnMudGltZVN0cmluZyArXG4gICAgICAgICAgICAgICAgJzwvbGFiZWw+JyArXG4gICAgICAgICAgICAnPC9kaXY+JztcblxuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0Rm9ybUV2ZW50cyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbC5zdWJtaXQoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLm9uU3VibWl0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0RGF0ZUV2ZW50cyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGRhdGVTZWxlY3QuY2hhbmdlKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBfdGhpcy5vbkRhdGVDaGFuZ2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXRTbG90RXZlbnRzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIGlmICggdGhpcy4kcm9vbVNsb3RJbnB1dHMgJiYgdGhpcy4kcm9vbVNsb3RJbnB1dHMubGVuZ3RoICl7XG5cbiAgICAgICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzLmNoYW5nZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgX3RoaXMub25TbG90Q2hhbmdlKGlucHV0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uRGF0ZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRhdGVZbWQgPSB0aGlzLiRkYXRlU2VsZWN0LnZhbCgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG5cbiAgICAgICAgdGhpcy5nZXRSb29tQXZhaWxhYmlsaXR5KHRoaXMuZGF0ZVltZClcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFRPRE86IFJlbW92ZVxuICAgICAgICAgICAgICAgIC8vIHVzZSBkdW1teSB0ZXh0XG4gICAgICAgICAgICAgICAgZGF0YSA9IGR1bW15QXZhaWxhYmlsaXR5RGF0YTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBfdGhpcy5tYWtlU2NoZWR1bGUoZGF0YSk7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFsd2F5cyhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF90aGlzLiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uU2xvdENoYW5nZSA9IGZ1bmN0aW9uKGNoYW5nZWRJbnB1dCl7XG5cbiAgICAgICAgLy8gaWYgaW5wdXQgY2hlY2tlZCwgYWRkIGl0IHRvIHNlbGVjdGVkIHNldFxuICAgICAgICBpZiAoICQoY2hhbmdlZElucHV0KS5wcm9wKCdjaGVja2VkJykgKSB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5wdXNoKGNoYW5nZWRJbnB1dCk7XG4gICAgICAgICAgICAkKGNoYW5nZWRJbnB1dCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpLmFkZENsYXNzKCdjY2wtaXMtY2hlY2tlZCcpO1xuXG4gICAgICAgIC8vIGlmIHVuY2hlY2tlZCwgcmVtb3ZlIGl0IGZyb20gdGhlIHNlbGVjdGVkIHNldFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdmFyIGlucHV0SW5kZXggPSB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKGNoYW5nZWRJbnB1dCk7XG4gICAgICAgICAgICBpZiAoIGlucHV0SW5kZXggPiAtMSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5zcGxpY2UoIGlucHV0SW5kZXgsIDEgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoY2hhbmdlZElucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBsaW1pdCBudW1iZXIgb2Ygc2VsZWN0ZWQgc2xvdHNcbiAgICAgICAgaWYgKCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPiB0aGlzLm1heFNsb3RzICkge1xuICAgICAgICAgICAgdmFyIHNoaWZ0ZWRJbnB1dCA9IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnNoaWZ0KCk7XG4gICAgICAgICAgICB0aGlzLmNsZWFyU2xvdChzaGlmdGVkSW5wdXQpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gYXV0byBzZWxlY3Qgc2xvdHMgaW4gYmV0d2VlbiB0aGUgMiBvdXRlcm1vc3Qgc2xvdHNcbiAgICAgICAgLy8gaWYgKCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPiAxICkge1xuICAgICAgICAvLyAgICAgdmFyIHNlbGVjdGlvbiA9ICQuZXh0ZW5kKFtdLHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzKSxcbiAgICAgICAgLy8gICAgICAgICBzb3J0ZWRTZWxlY3Rpb24gPSBzZWxlY3Rpb24uc29ydChmdW5jdGlvbihhLGIpeyBcbiAgICAgICAgLy8gICAgICAgICAgICAgcmV0dXJuIGEudmFsdWUgPiBiLnZhbHVlOyBcbiAgICAgICAgLy8gICAgICAgICB9KSxcbiAgICAgICAgLy8gICAgICAgICBmaXJzdEVsID0gc29ydGVkU2VsZWN0aW9uWzBdLFxuICAgICAgICAvLyAgICAgICAgIGZpcnN0SW5kZXggPSB0aGlzLiRyb29tU2xvdElucHV0cy5pbmRleChmaXJzdEVsKSxcbiAgICAgICAgLy8gICAgICAgICBsYXN0RWwgPSBzb3J0ZWRTZWxlY3Rpb25bc29ydGVkU2VsZWN0aW9uLmxlbmd0aCAtIDFdLFxuICAgICAgICAvLyAgICAgICAgIGxhc3RJbmRleCA9IHRoaXMuJHJvb21TbG90SW5wdXRzLmluZGV4KGxhc3RFbCksXG4gICAgICAgIC8vICAgICAgICAgY2hhbmdlZElucHV0SW5kZXggPSB0aGlzLiRyb29tU2xvdElucHV0cy5pbmRleChjaGFuZ2VkSW5wdXQpLFxuICAgICAgICAvLyAgICAgICAgIHVwVG9JbmRleCA9IE1hdGgubWluKCBjaGFuZ2VkSW5wdXRJbmRleCwgZmlyc3RJbmRleCArIHRoaXMubWF4U2xvdHMgKTtcblxuICAgICAgICAvLyAgICAgY29uc29sZS5sb2coJ2ZpcnN0SW5kZXgnLCBmaXJzdEluZGV4LCAnY2hhbmdlZElucHV0SW5kZXgnLCBjaGFuZ2VkSW5wdXRJbmRleCwgJ2ZpcnN0SW5kZXggKyB0aGlzLm1heFNsb3RzJywgZmlyc3RJbmRleCArIHRoaXMubWF4U2xvdHMgKTtcbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCd1cFRvSW5kZXgnLHVwVG9JbmRleCk7XG5cbiAgICAgICAgLy8gICAgIC8vIGxvb3AgdGhyb3VnaCBhbmQgYWN0aXZhdGUgc2xvdHMsIGJ1dCBvbmx5IHVwIHRvIG1heFNsb3RzXG4gICAgICAgIC8vICAgICBmb3IgKCB2YXIgaSA9IGZpcnN0SW5kZXggKyAxOyBpIDwgdXBUb0luZGV4OyBpKysgKSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5hY3RpdmF0ZVNsb3QoIHRoaXMuJHJvb21TbG90SW5wdXRzLmVxKGkpICk7XG4gICAgICAgIC8vICAgICB9XG5cbiAgICAgICAgLy8gICAgIC8vIGRlc2VsZWN0IGNoYW5nZWQgaW5wdXQgaWYgaXRzIGJleW9uZCB0aGUgbWF4U2xvdHMgcmFuZ2VcbiAgICAgICAgLy8gICAgIGlmICggY2hhbmdlZElucHV0SW5kZXggPj0gZmlyc3RJbmRleCArIHRoaXMubWF4U2xvdHMgKSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5jbGVhclNsb3QoIHRoaXMuJHJvb21TbG90SW5wdXRzLmVxKGNoYW5nZWRJbnB1dEluZGV4KSApO1xuICAgICAgICAvLyAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgIC8vIH1cblxuICAgICAgICB0aGlzLnNldEN1cnJlbnREdXJhdGlvblRleHQoKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuY2xlYXJTbG90ID0gZnVuY3Rpb24oc2xvdCkge1xuICAgICAgICAvLyBzbG90IGNhbiBiZSBlaXRoZXIgdGhlIGNoZWNrYm94IC1PUi0gdGhlIGNoZWNrYm94J3MgY29udGFpbmVyXG5cbiAgICAgICAgLy8gaWYgaXQncyB0aGUgY2hlY2tib3guXG4gICAgICAgIGlmICggJChzbG90KS5pcygnW3R5cGU9XCJjaGVja2JveFwiXScpICkge1xuICAgICAgICAgXG4gICAgICAgICAgICAkKHNsb3QpXG4gICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLGZhbHNlKVxuICAgICAgICAgICAgICAgIC5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JylcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtaXMtY2hlY2tlZCcpO1xuICAgICAgICAgICAgXG4gICAgICAgIC8vIGlmIGl0J3MgdGhlIGNvbnRhaW5lclxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAkKHNsb3QpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtaXMtY2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsZmFsc2UpO1xuXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmFjdGl2YXRlU2xvdCA9IGZ1bmN0aW9uKHNsb3QpIHtcbiAgICAgICAgLy8gc2xvdCBjYW4gYmUgZWl0aGVyIHRoZSBjaGVja2JveCAtT1ItIHRoZSBjaGVja2JveCdzIGNvbnRhaW5lclxuXG4gICAgICAgIHZhciBzbG90SXNDaGVja2JveCA9ICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSxcbiAgICAgICAgICAgICRjb250YWluZXIgPSBzbG90SXNDaGVja2JveCA/ICQoc2xvdCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpIDogJChzbG90KTtcblxuICAgICAgICAvLyBuZXZlciBzZXQgYW4gb2NjdXBpZWQgc2xvdCBhcyBhY3RpdmVcbiAgICAgICAgaWYgKCAkY29udGFpbmVyLmhhc0NsYXNzKCdjY2wtaXMtb2NjdXBpZWQnKSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggJChzbG90KS5pcygnW3R5cGU9XCJjaGVja2JveFwiXScpICkge1xuXG4gICAgICAgICAgICAvLyBpZiBpdCdzIHRoZSBjaGVja2JveC5cbiAgICAgICAgIFxuICAgICAgICAgICAgJChzbG90KS5wcm9wKCdjaGVja2VkJyx0cnVlKTtcbiAgICAgICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gaWYgaXQncyB0aGUgY29udGFpbmVyXG5cbiAgICAgICAgICAgICRjb250YWluZXJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJylcbiAgICAgICAgICAgICAgICAuZmluZCgnW3R5cGU9XCJjaGVja2JveFwiXScpXG4gICAgICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJyx0cnVlKTtcblxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5zZXRDdXJyZW50RHVyYXRpb25UZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSAkLmV4dGVuZChbXSx0aGlzLnNlbGVjdGVkU2xvdElucHV0cyksXG4gICAgICAgICAgICBzb3J0ZWRTZWxlY3Rpb24gPSBzZWxlY3Rpb24uc29ydChmdW5jdGlvbihhLGIpeyBcbiAgICAgICAgICAgICAgICByZXR1cm4gYS52YWx1ZSA+IGIudmFsdWU7IFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBzZWxlY3Rpb25MZW5ndGggPSBzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoO1xuICAgICAgICBcbiAgICAgICAgaWYgKCBzZWxlY3Rpb25MZW5ndGggPiAxICkge1xuXG4gICAgICAgICAgICB2YXIgdGltZTFWYWwgPSBzb3J0ZWRTZWxlY3Rpb25bMF0udmFsdWUuc2xpY2UoMCwtNCksXG4gICAgICAgICAgICAgICAgcmVhZGFibGVUaW1lMSA9IHRoaXMuZm9ybWF0RGF0ZVN0cmluZyggbmV3IERhdGUodGltZTFWYWwpLCAncmVhZGFibGUnICk7XG5cbiAgICAgICAgICAgIHZhciB0aW1lMlZhbCA9IHNvcnRlZFNlbGVjdGlvbltzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoIC0gMV0udmFsdWUuc2xpY2UoMCwtNCksXG4gICAgICAgICAgICAgICAgdGltZTJUID0gbmV3IERhdGUodGltZTJWYWwpLmdldFRpbWUoKSArICggdGhpcy5zbG90TWludXRlcyAqIDYwICogMTAwMCApLFxuICAgICAgICAgICAgICAgIHJlYWRhYmxlVGltZTIgPSB0aGlzLmZvcm1hdERhdGVTdHJpbmcoIG5ldyBEYXRlKHRpbWUyVCksICdyZWFkYWJsZScgKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQudGV4dCggcmVhZGFibGVUaW1lMSArICcgdG8gJyArIHJlYWRhYmxlVGltZTIgKTtcblxuICAgICAgICB9IGVsc2UgaWYgKCBzZWxlY3Rpb25MZW5ndGggPiAwICkge1xuXG4gICAgICAgICAgICB2YXIgdGltZVZhbCA9IHNvcnRlZFNlbGVjdGlvblswXS52YWx1ZS5zbGljZSgwLC00KSxcbiAgICAgICAgICAgICAgICByZWFkYWJsZVRpbWUgPSB0aGlzLmZvcm1hdERhdGVTdHJpbmcoIG5ldyBEYXRlKHRpbWVWYWwpLCAncmVhZGFibGUnICk7XG4gICAgICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoIHJlYWRhYmxlVGltZSArICcgdG8gPycgKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoJ05vbmUnKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnNldE1heFRpbWVUZXh0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG1heE1pbnV0ZXMgPSB0aGlzLm1heFNsb3RzICogdGhpcy5zbG90TWludXRlcyxcbiAgICAgICAgICAgIG1heFRleHQ7XG5cbiAgICAgICAgc3dpdGNoKG1heE1pbnV0ZXMpIHtcbiAgICAgICAgICAgIGNhc2UgMjQwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTgwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTIwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjA6XG4gICAgICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgLyA2MCArICcgaG91cnMnO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyArICdtaW5zJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJG1heFRpbWUudGV4dCggbWF4VGV4dCApO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuZm9ybWF0RGF0ZVN0cmluZyA9IGZ1bmN0aW9uKGRhdGVPYmosIHJlYWRhYmxlKXtcblxuICAgICAgICB2YXIgbWludXRlcyA9ICggZGF0ZU9iai5nZXRNaW51dGVzKCkudG9TdHJpbmcoKS5sZW5ndGggPCAyICkgPyAnMCcgKyBkYXRlT2JqLmdldE1pbnV0ZXMoKS50b1N0cmluZygpIDogZGF0ZU9iai5nZXRNaW51dGVzKCkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIFxuICAgICAgICBpZiAoIHJlYWRhYmxlICkge1xuXG4gICAgICAgICAgICB2YXIgYW1wbSA9ICggZGF0ZU9iai5nZXRIb3VycygpID49IDEyICkgPyAncCcgOiAnYScsXG4gICAgICAgICAgICAgICAgaG91cjEyRm9ybWF0ID0gKCBkYXRlT2JqLmdldEhvdXJzKCkgPiAxMiApID8gZGF0ZU9iai5nZXRIb3VycygpIC0gMTIgOiBkYXRlT2JqLmdldEhvdXJzKCk7XG5cbiAgICAgICAgICAgIHJldHVybiBob3VyMTJGb3JtYXQgKyAnOicgKyBtaW51dGVzICsgYW1wbTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB2YXIgaG91cnMgPSAoIGRhdGVPYmouZ2V0SG91cnMoKS50b1N0cmluZygpLmxlbmd0aCA8IDIgKSA/ICcwJyArIGRhdGVPYmouZ2V0SG91cnMoKS50b1N0cmluZygpIDogZGF0ZU9iai5nZXRIb3VycygpLnRvU3RyaW5nKCksXG4gICAgICAgICAgICAgICAgc2Vjb25kcyA9ICggZGF0ZU9iai5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKS5sZW5ndGggPCAyICkgPyAnMCcgKyBkYXRlT2JqLmdldFNlY29uZHMoKS50b1N0cmluZygpIDogZGF0ZU9iai5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0ZVltZCArICdUJyArIGhvdXJzICsgJzonICsgbWludXRlcyArICc6JyArIHNlY29uZHMgKyB0aGlzLnRpbWVab25lO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TdWJtaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgLyogVE9ETzpcbiAgICAgICAgICogUG9wdWxhdGUgXCJib29raW5nc1wiIGFycmF5IHdpdGggY29ycmVjdCBkYXRhXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgICAgICB2YXIgcGF5bG9hZCA9IHtcbiAgICAgICAgICAgIFwiaWlkXCI6MzMzLFxuICAgICAgICAgICAgXCJzdGFydFwiOiB0aGlzLnNlbGVjdGVkU2xvdElucHV0c1swXS52YWx1ZSxcbiAgICAgICAgICAgIFwiZm5hbWVcIjogdGhpcy4kZWxbMF0uZm5hbWUudmFsdWUsXG4gICAgICAgICAgICBcImxuYW1lXCI6IHRoaXMuJGVsWzBdLmxuYW1lLnZhbHVlLFxuICAgICAgICAgICAgXCJlbWFpbFwiOiB0aGlzLiRlbFswXS5lbWFpbC52YWx1ZSxcbiAgICAgICAgICAgIFwibmlja25hbWVcIjpcIlRlc3QgUm9vbSBSZXNlcnZhdGlvblwiLFxuICAgICAgICAgICAgXCJib29raW5nc1wiOltcbiAgICAgICAgICAgICAgICB7IFxuICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMucm9vbUlkLFxuICAgICAgICAgICAgICAgICAgICAvLyB1c2luZyAzcG0gYXMgZW5kIHRpbWUgZm9yIG5vd1xuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IHRoaXMuZGF0ZVltZCArIFwiVDE1OjAwOjAwXCIgKyB0aGlzLnRpbWVab25lXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuXG4gICAgICAgIGNvbnNvbGUubG9nKCAnb25TdWJtaXQgwrsgJywgcGF5bG9hZCApO1xuXG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuICAgICAgICB0aGlzLiRmb3JtQ2FuY2VsLnByb3AoJ2Rpc2FibGVkJyx0cnVlKTtcbiAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdC50ZXh0KCdTZW5kaW5nLi4uJykucHJvcCgnZGlzYWJsZWQnLHRydWUpO1xuXG4gICAgICAgIC8qIFRPRE86XG4gICAgICAgICAqIE1ha2UgYSBQT1NUIHJlcXVlc3QgaGVyZSB0byByZXNlcnZlIHNwYWNlLlxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgLy8gJC5wb3N0KHtcbiAgICAgICAgLy8gICAgICAgICB1cmw6IENDTC5zaXRlX3VybCArICdhcGkvcm9vbXMvcmVzZXJ2ZScsXG4gICAgICAgIC8vICAgICAgICAgZGF0YTogcGF5bG9hZFxuICAgICAgICAvLyAgICAgfSlcbiAgICAgICAgLy8gICAgIC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgLy8gICAgICAgICBoYW5kbGVTdWJtaXRSZXNwb25zZShyZXNwb25zZSk7XG4gICAgICAgIC8vICAgICB9KVxuICAgICAgICAvLyAgICAgLmZhaWwoZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAvLyAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgLy8gICAgIH0pXG4gICAgICAgIC8vICAgICAuYWx3YXlzKGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG4gICAgICAgIC8vICAgICB9KTtcblxuICAgICAgICAvLyBmb3Igbm93LCBqdXN0IGludm9raW5nIHRoZSBoYW5kbGVyIG1hbnVhbGx5IHdpdGggZHVtbXkgZGF0YVxuICAgICAgICB2YXIgZXJyb3JSZXNwb25zZSA9IHsgXG4gICAgICAgICAgICAgICAgXCJlcnJvcnNcIjogWyBcInNvbWUgZXJyb3IgbWVzc2FnZVwiIF0gXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2Vzc2Z1bFJlc3BvbnNlID0ge1xuICAgICAgICAgICAgICAgIFwiYm9va2luZ19pZFwiOiBcImNzX0w2djlnaThcIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICBoYW5kbGVTdWJtaXRSZXNwb25zZShzdWNjZXNzZnVsUmVzcG9uc2UpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdFJlc3BvbnNlKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgIHZhciByZXNwb25zZUhUTUw7XG5cbiAgICAgICAgICAgIGlmICggcmVzcG9uc2UuYm9va2luZ19pZCApIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwgPSAgWyc8cCBjbGFzcz1cImNjbC1oMiBjY2wtdS1tdC0wXCI+U3VjY2VzcyE8L3A+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxwIGNsYXNzPVwiY2NsLWg0XCI+WW91ciBib29raW5nIElEIGlzIDxzcGFuIGNsYXNzPVwiY2NsLXUtY29sb3Itc2Nob29sXCI+JyArIHJlc3BvbnNlLmJvb2tpbmdfaWQgKyAnPC9zcGFuPjwvcD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHAgY2xhc3M9XCJjY2wtaDRcIj5QbGVhc2UgY2hlY2sgeW91ciBlbWFpbCB0byBjb25maXJtIHlvdXIgYm9va2luZy48L3A+J107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTCA9ICBbJzxwIGNsYXNzPVwiY2NsLWgzIGNjbC11LW10LTBcIj5Tb3JyeSwgYnV0IHdlIGNvdWxkblxcJ3QgcHJvY2VzcyB5b3VyIHJlc2VydmF0aW9uLjwvcD4nLCc8cCBjbGFzcz1cImNjbC1oNFwiPkVycm9yczo8L3A+J107XG4gICAgICAgICAgICAgICAgJChyZXNwb25zZS5lcnJvcnMpLmVhY2goZnVuY3Rpb24oaSwgZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwucHVzaCgnPHAgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3JcIj4nICsgZXJyb3IgKyAnPC9wPicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTC5wdXNoKCc8cCBjbGFzcz1cImNjbC1oNFwiPlBsZWFzZSB0YWxrIHRvIHlvdXIgbmVhcmVzdCBsaWJyYXJpYW4gZm9yIGhlbHAuPC9wPicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfdGhpcy4kZm9ybUNhbmNlbC5wcm9wKCdkaXNhYmxlZCcsZmFsc2UpLnRleHQoJ0Nsb3NlJyk7XG4gICAgICAgICAgICBfdGhpcy4kZm9ybVN1Ym1pdC5yZW1vdmUoKTtcbiAgICAgICAgICAgIF90aGlzLiRmb3JtQ29udGVudC5hbmltYXRlKHtvcGFjaXR5OiAwfSwgQ0NMLkRVUkFUSU9OKTtcbiAgICAgICAgICAgIF90aGlzLiRmb3JtUmVzcG9uc2VcbiAgICAgICAgICAgICAgICAuZGVsYXkoQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5hbmltYXRlKHtvcGFjaXR5OiAxfSwgQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5odG1sKHJlc3BvbnNlSFRNTCk7XG4gICAgICAgICAgICBfdGhpcy4kZm9ybUNvbnRlbnRcbiAgICAgICAgICAgICAgICAuZGVsYXkoQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5hbmltYXRlKHtoZWlnaHQ6IF90aGlzLiRmb3JtUmVzcG9uc2UuaGVpZ2h0KCkgKyAncHgnIH0sIENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuY3NzKHt6SW5kZXg6ICctMSd9KTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG5cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1yb29tLXJlcy1mb3JtJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFJvb21SZXNGb3JtKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU3RpY2tpZXNcbiAqIFxuICogQmVoYXZpb3VyIGZvciBzdGlja3kgZWxlbWVudHMuXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBpc0ZpeGVkOiAnY2NsLWlzLWZpeGVkJ1xuICAgICAgICB9O1xuXG4gICAgdmFyIFN0aWNreSA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICAvLyB2YXJpYWJsZXNcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpLFxuICAgICAgICAgICAgaGVpZ2h0ID0gJGVsLm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICBvZmZzZXQgPSAkZWwub2Zmc2V0KCksXG4gICAgICAgICAgICBvcHRpb25zID0gJGVsLmRhdGEoJ3N0aWNreScpLFxuICAgICAgICAgICAgd3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJqcy1zdGlja3ktd3JhcHBlclwiPjwvZGl2PicpLmNzcyh7IGhlaWdodDogaGVpZ2h0ICsgJ3B4JyB9KTtcblxuICAgICAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgfTtcblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zICk7XG5cbiAgICAgICAgLy8gd3JhcCBlbGVtZW50XG4gICAgICAgICRlbC53cmFwKCB3cmFwcGVyICk7XG5cbiAgICAgICAgLy8gc2Nyb2xsIGxpc3RlbmVyXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgMTAwICkgKTtcblxuICAgICAgICAvLyBvbiBzY3JvbGxcbiAgICAgICAgZnVuY3Rpb24gX29uU2Nyb2xsKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKSArIG9wdGlvbnMub2Zmc2V0O1xuICAgIFxuICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gb2Zmc2V0LnRvcCApIHtcbiAgICAgICAgICAgICAgICAkZWwuYWRkQ2xhc3MoIGNsYXNzTmFtZS5pc0ZpeGVkICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLmlzRml4ZWQgKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1pcy1zdGlja3knKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU3RpY2t5KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogVG9nZ2xlIFNjaG9vbHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIHNjaG9vbCB0b2dnbGVzXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIGluaXRTY2hvb2wgPSAkKCdodG1sJykuZGF0YSgnc2Nob29sJyk7XG5cbiAgICB2YXIgU2Nob29sU2VsZWN0ID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kc2VsZWN0ID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgU2Nob29sU2VsZWN0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIGlmICggaW5pdFNjaG9vbCApIHtcblxuICAgICAgICAgICAgdGhpcy4kc2VsZWN0XG4gICAgICAgICAgICAgICAgLmZpbmQoICdvcHRpb25bdmFsdWU9XCInICsgaW5pdFNjaG9vbCArICdcIl0nIClcbiAgICAgICAgICAgICAgICAuYXR0ciggJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyApOyAgIFxuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRzZWxlY3QuY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hdHRyKCAgJ2RhdGEtc2Nob29sJywgZXZlbnQudGFyZ2V0LnZhbHVlICk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJzY2hvb2xcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU2Nob29sU2VsZWN0KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIFRvb2x0aXBzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciB0b29sdGlwc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgVG9vbHRpcCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy4kZWwuYXR0cigndGl0bGUnKTtcbiAgICAgICAgdGhpcy4kdG9vbHRpcCA9ICQoJzxkaXYgaWQ9XCJjY2wtY3VycmVudC10b29sdGlwXCIgY2xhc3M9XCJjY2wtYy10b29sdGlwIGNjbC1pcy10b3BcIiByb2xlPVwidG9vbHRpcFwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19hcnJvd1wiPjwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19pbm5lclwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBUb29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuaG92ZXIoZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIC8vIG1vdXNlb3ZlclxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCAnJyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cignYXJpYS1kZXNjcmliZWRieScsICdjY2wtY3VycmVudC10b29sdGlwJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblxuICAgICAgICAgICAgQ0NMLnJlZmxvdyhfdGhpcy4kdG9vbHRpcFswXSk7XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBfdGhpcy4kZWwub2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgd2lkdGggID0gX3RoaXMuJGVsLm91dGVyV2lkdGgoKSxcbiAgICAgICAgICAgICAgICB0b29sdGlwSGVpZ2h0ID0gX3RoaXMuJHRvb2x0aXAub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuY3NzKHtcbiAgICAgICAgICAgICAgICB0b3A6IChvZmZzZXQudG9wIC0gdG9vbHRpcEhlaWdodCkgKyAncHgnLFxuICAgICAgICAgICAgICAgIGxlZnQ6IChvZmZzZXQubGVmdCArICh3aWR0aC8yKSkgKyAncHgnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgIH0sIGZ1bmN0aW9uKGUpeyBcblxuICAgICAgICAgICAgLy9tb3VzZW91dFxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCBfdGhpcy5jb250ZW50KTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgJycpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlKCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBUb29sdGlwKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogV2F5ZmluZGluZ1xuICogXG4gKiBDb250cm9scyBpbnRlcmZhY2UgZm9yIGxvb2tpbmcgdXAgY2FsbCBudW1iZXIgbG9jYXRpb25zXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICB0YWJzLCB3YXlmaW5kZXI7XG4gICAgXG4gICAgdmFyIFRhYnMgPSBmdW5jdGlvbihlbCkge1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdGFicyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy10YWInKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMgPSAkKCcuY2NsLWMtdGFiX19jb250ZW50Jyk7XG4gICAgICAgIFxuXG4gICAgICAgIHRoaXMuJHRhYnMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICR0YWIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHRhYi5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICR0YWIuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0QWN0aXZlKHRhcmdldCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFRhYnMucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKHRhcmdldCl7XG4gICAgICAgIHRoaXMuJHRhYnMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFicy5maWx0ZXIoJ1tocmVmPVwiJyt0YXJnZXQrJ1wiXScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIHZhciBXYXlmaW5kZXIgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuY2FsbE51bWJlcnMgPSB7fTtcbiAgICAgICAgdGhpcy4kZm9ybSA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bWJlci1zZWFyY2gnKTtcbiAgICAgICAgdGhpcy4kaW5wdXQgPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW0taW5wdXQnKTtcbiAgICAgICAgdGhpcy4kc3VibWl0ID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtLXN1Ym1pdCcpO1xuICAgICAgICB0aGlzLiRtYXJxdWVlID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fbWFycXVlZScpO1xuICAgICAgICB0aGlzLiRjYWxsTnVtID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fY2FsbC1udW0nKTtcbiAgICAgICAgdGhpcy4kd2luZyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX3dpbmcnKTtcbiAgICAgICAgdGhpcy4kZmxvb3IgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19mbG9vcicpO1xuICAgICAgICB0aGlzLiRzdWJqZWN0ID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fc3ViamVjdCcpO1xuICAgICAgICB0aGlzLmVycm9yID0ge1xuICAgICAgICAgICAgZ2V0OiAnPGRpdiBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvciBjY2wtd2F5ZmluZGVyX19lcnJvclwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2NsLWItY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPjxpIGNsYXNzPVwiY2NsLWItaWNvbi1hbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gVGhlcmUgd2FzIGFuIGVycm9yIGZldGNoaW5nIGNhbGwgbnVtYmVycy48L2Rpdj4nLFxuICAgICAgICAgICAgZmluZDogJzxkaXYgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3IgY2NsLXdheWZpbmRlcl9fZXJyb3JcIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNjbC1iLWNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj48aSBjbGFzcz1cImNjbC1iLWljb24tYWxlcnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IENvdWxkIG5vdCBmaW5kIHRoYXQgY2FsbCBudW1iZXIuIFBsZWFzZSB0cnkgYWdhaW4uPC9kaXY+J1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRlcnJvckJveCA9ICQoJy5jY2wtZXJyb3ItYm94Jyk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAkLmdldEpTT04oIENDTC5hc3NldHMgKyAnanMvY2FsbC1udW1iZXJzLmpzb24nIClcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIF90aGlzLmNhbGxOdW1iZXJzID0gZGF0YTtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGVycm9yQm94LmFwcGVuZCggdGhpcy5lcnJvci5nZXQgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1hcHAtYWN0aXZlJyk7XG5cbiAgICAgICAgdGhpcy4kaW5wdXRcbiAgICAgICAgICAgIC5rZXl1cChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHF1ZXJ5ID09PSBcIlwiICkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3VibWl0LmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRtYXJxdWVlLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVzZXQoKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGZvcm0uc3VibWl0KGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBfdGhpcy4kaW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgICQoJy5jY2wtd2F5ZmluZGVyX19lcnJvcicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuc2hvdygpO1xuICAgICAgICAgICAgX3RoaXMuJGNhbGxOdW0udGV4dChxdWVyeSk7XG4gICAgICAgICAgICBfdGhpcy5maW5kUm9vbSggcXVlcnkgKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5nZXRDYWxsS2V5ID0gZnVuY3Rpb24oY2FsbE51bSkge1xuICAgICAgICB2YXIga2V5LFxuICAgICAgICAgICAgY2FsbEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmNhbGxOdW1iZXJzKTtcblxuICAgICAgICBpZiAoIGNhbGxLZXlzLmxlbmd0aCA9PT0gMCApe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbEtleXMuZm9yRWFjaChmdW5jdGlvbihrKXtcbiAgICAgICAgICBpZiAoIGNhbGxOdW0gPj0gayApIHtcbiAgICAgICAgICAgIGtleSA9IGs7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmZpbmRSb29tID0gZnVuY3Rpb24ocXVlcnkpIHtcblxuICAgICAgICBxdWVyeSA9IHF1ZXJ5LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgY2FsbEtleSA9IHRoaXMuZ2V0Q2FsbEtleShxdWVyeSksXG4gICAgICAgICAgICBjYWxsRGF0YSA9IHt9LFxuICAgICAgICAgICAgcm9vbTtcblxuICAgICAgICBpZiAoICEgY2FsbEtleSApIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dGaW5kRXJyb3IoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKCcuY2NsLWMtc2VhcmNoJykub2Zmc2V0KCkudG9wIH0pO1xuICAgICAgICBcbiAgICAgICAgY2FsbERhdGEgPSB0aGlzLmNhbGxOdW1iZXJzW2NhbGxLZXldO1xuXG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoIGNhbGxEYXRhLmZsb29yICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggY2FsbERhdGEud2luZyApO1xuICAgICAgICB0aGlzLiRzdWJqZWN0LnRleHQoIGNhbGxEYXRhLnN1YmplY3QgKTtcblxuICAgICAgICAvKiBUT0RPOlxuICAgICAgICAgKiBzZXQgQUNUVUFMIHJvb20sIG5vdCBqdXN0IHRoZSBmbG9vci4gc3RpbGwgd2FpdGluZyBvbiBjbGllbnQgXG4gICAgICAgICAqIHRvIHByb3ZpZGUgZGF0YSBmb3Igd2hpY2ggY2FsbCBudW1iZXJzIGJlbG9uZyB0byB3aGljaCByb29tc1xuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgICAgIHJvb20gPSBjYWxsRGF0YS5mbG9vcl9pbnQ7XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWY9XCIjZmxvb3ItJytyb29tKydcIl0nKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjcm9vbS0nK3Jvb20rJy0xJykuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcblxuICAgICAgICB0YWJzLnNldEFjdGl2ZSggJyNmbG9vci0nICsgcm9vbSApO1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUudGhyb3dGaW5kRXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdC50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiRlcnJvckJveC5hcHBlbmQoIHRoaXMuZXJyb3IuZmluZCApO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWpzLXRhYnMnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0YWJzID0gbmV3IFRhYnModGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuY2NsLWpzLXdheWZpbmRlcicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHdheWZpbmRlciA9IG5ldyBXYXlmaW5kZXIodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIl19
