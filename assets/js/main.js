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
         * Make a request here to reserve space.
         * I know the LibCal API request should be POST,
         * but should our internal admin-ajax request be GET?
         * ------------------------------------------ */
        $.get({
                // url: CCL.site_url + 'api/rooms/reserve',
                url: '#',
                data: payload
            })
            .done(function(response){

                // for now, just invoking the handler manually with dummy data
                var errorResponse = { "errors": [ "some error message" ]  },
                    successfulResponse = { "booking_id": "cs_L6v9gi8" };
                
                handleSubmitResponse(successfulResponse);

            })
            .fail(function(error){
                console.log(error);
            })
            .always(function(){
                _this.$el.removeClass('ccl-is-loading');
            });

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkcm9wZG93bnMuanMiLCJtb2RhbHMuanMiLCJyb29tLXJlcy5qcyIsInN0aWNraWVzLmpzIiwidG9nZ2xlLXNjaG9vbHMuanMiLCJ0b29sdGlwcy5qcyIsIndheWZpbmRpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBHbG9iYWwgVmFyaWFibGVzLiBcbiAqL1xuXG5cbihmdW5jdGlvbiAoICQsIHdpbmRvdyApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuICAgIFxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLkRVUkFUSU9OID0gMzAwO1xuXG4gICAgQ0NMLkJSRUFLUE9JTlRfU00gPSA1MDA7XG4gICAgQ0NMLkJSRUFLUE9JTlRfTUQgPSA3Njg7XG4gICAgQ0NMLkJSRUFLUE9JTlRfTEcgPSAxMDAwO1xuICAgIENDTC5CUkVBS1BPSU5UX1hMID0gMTUwMDtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ2h0bWwnKS50b2dnbGVDbGFzcygnbm8tanMganMnKTtcbiAgICB9KTtcblxufSkoalF1ZXJ5LCB0aGlzKTsiLCIvKipcbiAqIFJlZmxvdyBwYWdlIGVsZW1lbnRzLiBcbiAqIFxuICogRW5hYmxlcyBhbmltYXRpb25zL3RyYW5zaXRpb25zIG9uIGVsZW1lbnRzIGFkZGVkIHRvIHRoZSBwYWdlIGFmdGVyIHRoZSBET00gaGFzIGxvYWRlZC5cbiAqL1xuXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5yZWZsb3cgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgfTtcblxufSkoKTsiLCIvKipcbiAqIEdldCB0aGUgU2Nyb2xsYmFyIHdpZHRoXG4gKiBUaGFua3MgdG8gZGF2aWQgd2Fsc2g6IGh0dHBzOi8vZGF2aWR3YWxzaC5uYW1lL2RldGVjdC1zY3JvbGxiYXItd2lkdGhcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcbiAgICBcbiAgICBmdW5jdGlvbiBnZXRTY3JvbGxXaWR0aCgpIHtcbiAgICAgICAgXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWVhc3VyZW1lbnQgbm9kZVxuICAgICAgICB2YXIgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgXG4gICAgICAgIC8vIHBvc2l0aW9uIHdheSB0aGUgaGVsbCBvZmYgc2NyZWVuXG4gICAgICAgICQoc2Nyb2xsRGl2KS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6ICcxMDBweCcsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDBweCcsXG4gICAgICAgICAgICBvdmVyZmxvdzogJ3Njcm9sbCcsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogJy05OTk5cHgnLFxuICAgICAgICB9KTtcblxuICAgICAgICAkKCdib2R5JykuYXBwZW5kKHNjcm9sbERpdik7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBzY3JvbGxiYXIgd2lkdGhcbiAgICAgICAgdmFyIHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoO1xuICAgICAgICAvLyBjb25zb2xlLndhcm4oc2Nyb2xsYmFyV2lkdGgpOyAvLyBNYWM6ICAxNVxuXG4gICAgICAgIC8vIERlbGV0ZSB0aGUgRElWIFxuICAgICAgICAkKHNjcm9sbERpdikucmVtb3ZlKCk7XG5cbiAgICAgICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoO1xuICAgIH1cbiAgICBcbiAgICBpZiAoICEgd2luZG93LkNDTCApIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5nZXRTY3JvbGxXaWR0aCA9IGdldFNjcm9sbFdpZHRoO1xuICAgIENDTC5TQ1JPTExCQVJXSURUSCA9IGdldFNjcm9sbFdpZHRoKCk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIC5kZWJvdW5jZSgpIGZ1bmN0aW9uXG4gKiBcbiAqIFNvdXJjZTogaHR0cHM6Ly9kYXZpZHdhbHNoLm5hbWUvamF2YXNjcmlwdC1kZWJvdW5jZS1mdW5jdGlvblxuICovXG5cblxuKGZ1bmN0aW9uKHdpbmRvdykge1xuXG4gICAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gICAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gICAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAgIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gICAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4gICAgdmFyIHRocm90dGxlID0gZnVuY3Rpb24gKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHRpbWVvdXQsIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICAgICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICAgICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG5cbiAgICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHRocm90dGxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICAgICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICAgICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICAgICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHRocm90dGxlZC5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICBwcmV2aW91cyA9IDA7XG4gICAgICAgICAgICB0aW1lb3V0ID0gY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB0aHJvdHRsZWQ7XG4gICAgfTtcblxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgd2luZG93LkNDTC50aHJvdHRsZSA9IHRocm90dGxlO1xuXG59KSh0aGlzKTsiLCIvKipcbiAqIEFjY29yZGlvbnNcbiAqIFxuICogQmVoYXZpb3IgZm9yIGFjY29yZGlvbiBjb21wb25lbnRzXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBBY2NvcmRpb24gPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHRvZ2dsZSA9IHRoaXMuJGVsLmNoaWxkcmVuKCcuY2NsLWMtYWNjb3JkaW9uX190b2dnbGUnKTtcbiAgICAgICAgdGhpcy4kY29udGVudCA9IHRoaXMuJGVsLmNoaWxkcmVuKCcuY2NsLWMtYWNjb3JkaW9uX19jb250ZW50Jyk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBBY2NvcmRpb24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHRvZ2dsZS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLiRjb250ZW50LnNsaWRlVG9nZ2xlKCk7XG4gICAgICAgICAgICBfdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ2NjbC1pcy1vcGVuJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5jY2wtYy1hY2NvcmRpb24nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgQWNjb3JkaW9uKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogQWxlcnRzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBhbGVydHNcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgRFVSQVRJT04gPSBDQ0wuRFVSQVRJT047XG5cbiAgICB2YXIgQWxlcnREaXNtaXNzID0gZnVuY3Rpb24oJGVsKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJGVsO1xuICAgICAgICB0aGlzLnRhcmdldCA9ICRlbC5wYXJlbnQoKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgQWxlcnREaXNtaXNzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICBfdGhpcy4kdGFyZ2V0LmFuaW1hdGUoIHsgb3BhY2l0eTogMCB9LCB7XG4gICAgICAgICAgICBkdXJhdGlvbjogRFVSQVRJT04sXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LnNsaWRlVXAoIERVUkFUSU9OLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cblxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJChkb2N1bWVudCkub24oICdjbGljaycsICdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIHZhciBkaXNtaXNzRWwgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nKTtcbiAgICAgICAgICAgIG5ldyBBbGVydERpc21pc3MoZGlzbWlzc0VsKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKHRoaXMsIGpRdWVyeSk7IiwiLyoqXG4gKiBDYXJvdXNlbHNcbiAqIFxuICogSW5pdGlhbGl6ZSBhbmQgZGVmaW5lIGJlaGF2aW9yIGZvciBjYXJvdXNlbHMuIFxuICogVXNlcyB0aGUgU2xpY2sgU2xpZGVzIGpRdWVyeSBwbHVnaW4gLS0+IGh0dHA6Ly9rZW53aGVlbGVyLmdpdGh1Yi5pby9zbGljay9cbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIENhcm91c2VsID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuZ2xvYmFsRGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgIGRvdHNDbGFzczogJ2NjbC1jLWNhcm91c2VsX19wYWdpbmcnLFxuICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfTtcblxuICAgIENhcm91c2VsLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy4kZWwuZGF0YSgpLFxuICAgICAgICAgICAgb3B0aW9ucyA9IGRhdGEub3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIFxuICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUgPSBbXTtcblxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc1NtICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX1NNLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zU21cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zTWQgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfTUQsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNNZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNMZyApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9MRywgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc0xnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc1hsICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX1hMLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zWGxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKCB0aGlzLmdsb2JhbERlZmF1bHRzLCBvcHRpb25zICk7XG5cbiAgICAgICAgdmFyIGNhcm91c2VsID0gdGhpcy4kZWwuc2xpY2sob3B0aW9ucyksXG4gICAgICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgY2Fyb3VzZWwub24oJ2JlZm9yZUNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlLCBuZXh0U2xpZGUpe1xuICAgICAgICAgICAgX3RoaXMuJGVsLmZpbmQoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtcGFzdCcpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLmZpbmQoJy5zbGljay1zbGlkZVtkYXRhLXNsaWNrLWluZGV4PVwiJytuZXh0U2xpZGUrJ1wiXScpLnByZXZBbGwoKS5hZGRDbGFzcygnY2NsLWlzLXBhc3QnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1wcm9tby1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBDYXJvdXNlbCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIERyb3Bkb3duc1xuICogXG4gKiBJbml0aWFsaXplIGFuZCBjb250cm9sIGJlaGF2aW9yIGZvciBkcm9wZG93biBtZW51c1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICBUT0dHTEU6ICdbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXScsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZSA9IHtcbiAgICAgICAgICAgIEFDVElWRTogJ2NjbC1pcy1hY3RpdmUnLFxuICAgICAgICAgICAgTUVOVTogJ2NjbC1jLWRyb3Bkb3duX19tZW51J1xuICAgICAgICB9O1xuXG4gICAgdmFyIERyb3Bkb3duVG9nZ2xlID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiR0b2dnbGUgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kcGFyZW50ID0gdGhpcy4kdG9nZ2xlLnBhcmVudCgpO1xuICAgICAgICBcbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuJHRvZ2dsZS5kYXRhKCd0YXJnZXQnKTtcblxuICAgICAgICB0aGlzLiRtZW51ID0gJCggdGFyZ2V0ICk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kdG9nZ2xlLmNsaWNrKCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBfdGhpcy50b2dnbGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIHZhciBoYXNBY3RpdmVNZW51cyA9ICQoICcuJyArIGNsYXNzTmFtZS5NRU5VICsgJy4nICsgY2xhc3NOYW1lLkFDVElWRSApLmxlbmd0aDtcbiAgICAgICAgICAgIGlmICggaGFzQWN0aXZlTWVudXMgKXtcbiAgICAgICAgICAgICAgICBfY2xlYXJNZW51cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgaXNBY3RpdmUgPSB0aGlzLiR0b2dnbGUuaGFzQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcblxuICAgICAgICBpZiAoIGlzQWN0aXZlICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93TWVudSgpO1xuXG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5zaG93TWVudSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgdGhpcy4kbWVudS5hZGRDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICB0aGlzLiRwYXJlbnQuYWRkQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLmhpZGVNZW51ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgdGhpcy4kbWVudS5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICB0aGlzLiRwYXJlbnQucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX2NsZWFyTWVudXMoKSB7XG4gICAgICAgICQoJy5jY2wtYy1kcm9wZG93biwgLmNjbC1jLWRyb3Bkb3duX19tZW51JykucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgJCggc2VsZWN0b3IuVE9HR0xFICkuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoIHNlbGVjdG9yLlRPR0dMRSApLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBEcm9wZG93blRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIE1vZGFsc1xuICogXG4gKiBCZWhhdmlvciBmb3IgbW9kYWxzLiBCYXNlZCBvbiBCb290c3RyYXAncyBtb2RhbHM6IGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzQuMC9jb21wb25lbnRzL21vZGFsL1xuICogXG4gKiBHbG9iYWxzOlxuICogU0NST0xMQkFSV0lEVEhcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgRFVSQVRJT04gPSAzMDA7XG5cbiAgICB2YXIgTW9kYWxUb2dnbGUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgJGVsID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLnRhcmdldCA9ICRlbC5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7IFxuXG4gICAgICAgIF90aGlzLiRlbC5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmICggJChkb2N1bWVudC5ib2R5KS5oYXNDbGFzcygnY2NsLW1vZGFsLW9wZW4nKSApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jbG9zZU1vZGFsKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzLnNob3dCYWNrZHJvcChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zaG93TW9kYWwoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLnNob3dCYWNrZHJvcCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblxuICAgICAgICB2YXIgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdmFyICRiYWNrZHJvcCA9ICQoYmFja2Ryb3ApO1xuXG4gICAgICAgICRiYWNrZHJvcC5hZGRDbGFzcygnY2NsLWMtbW9kYWxfX2JhY2tkcm9wJyk7XG4gICAgICAgICRiYWNrZHJvcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgXG4gICAgICAgIENDTC5yZWZsb3coYmFja2Ryb3ApO1xuICAgICAgICBcbiAgICAgICAgJGJhY2tkcm9wLmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICAkKGRvY3VtZW50LmJvZHkpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJylcbiAgICAgICAgICAgIC5jc3MoICdwYWRkaW5nLXJpZ2h0JywgQ0NMLlNDUk9MTEJBUldJRFRIICk7XG5cbiAgICAgICAgaWYgKCBjYWxsYmFjayApIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoIGNhbGxiYWNrLCBEVVJBVElPTiApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5zaG93TW9kYWwgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBfdGhpcy4kdGFyZ2V0LnNob3coIDAsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAkKCcuY2NsLWMtbW9kYWwnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsJykuaGlkZSgpO1xuXG4gICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWxfX2JhY2tkcm9wJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWxfX2JhY2tkcm9wJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLW1vZGFsLW9wZW4nKVxuICAgICAgICAgICAgICAgICAgICAuY3NzKCAncGFkZGluZy1yaWdodCcsICcnICk7XG5cbiAgICAgICAgICAgIH0sIERVUkFUSU9OKTtcblxuICAgICAgICB9LCBEVVJBVElPTiApOyBcblxuICAgIH07XG5cblxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgTW9kYWxUb2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICogUm9vbSBSZXNlcnZhdGlvblxuICogXG4gKiBIYW5kbGUgcm9vbSByZXNlcnZhdGlvbnNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICAvLyBUT0RPOiBSZW1vdmVcbiAgICB2YXIgZHVtbXlBdmFpbGFiaWxpdHlEYXRhID0gW1xuICAgICAgICB7XG4gICAgICAgICAgICBcImlkXCI6IDkxNDgsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJHcm91cCBTdHVkeSAxXCIsXG4gICAgICAgICAgICBcImRlc2NyaXB0aW9uXCI6IFwiXCIsXG4gICAgICAgICAgICBcImltYWdlXCI6IFwiXCIsXG4gICAgICAgICAgICBcImNhcGFjaXR5XCI6IFwiNlwiLFxuICAgICAgICAgICAgXCJhdmFpbGFiaWxpdHlcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQwODowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQwODozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMDg6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMDk6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDA5OjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDA5OjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQwOTozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxMDowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTI6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTI6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDEyOjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDEzOjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxMzowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxMzozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTM6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTQ6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDE0OjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDE0OjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxNDozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxNTowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTU6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTU6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDE1OjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDE2OjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxNjowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxNjozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTY6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTc6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDE3OjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDE3OjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxNzozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxODowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTg6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMTg6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDE4OjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDE5OjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQxOTowMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQxOTozMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMTk6MzA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMjA6MDA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDIwOjAwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDIwOjMwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IFwiMjAxNy0xMC0yMFQyMDozMDowMC0wNzowMFwiLFxuICAgICAgICAgICAgICAgICAgICBcInRvXCI6IFwiMjAxNy0xMC0yMFQyMTowMDowMC0wNzowMFwiXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBcIjIwMTctMTAtMjBUMjE6MDA6MDAtMDc6MDBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBcIjIwMTctMTAtMjBUMjE6MzA6MDAtMDc6MDBcIlxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImZyb21cIjogXCIyMDE3LTEwLTIwVDIxOjMwOjAwLTA3OjAwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidG9cIjogXCIyMDE3LTEwLTIwVDIyOjAwOjAwLTA3OjAwXCJcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICBdO1xuXG4gICAgdmFyIFJvb21SZXNGb3JtID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kZm9ybUNvbnRlbnQgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1jb250ZW50JykuY3NzKHtwb3NpdGlvbjoncmVsYXRpdmUnfSk7XG4gICAgICAgIHRoaXMuJGZvcm1SZXNwb25zZSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLXJlc3BvbnNlJykuY3NzKHtwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnMXJlbScsIGxlZnQ6ICcxcmVtJywgb3BhY2l0eTogMH0pO1xuICAgICAgICB0aGlzLiRmb3JtQ2FuY2VsID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tY2FuY2VsJyk7XG4gICAgICAgIHRoaXMuJGZvcm1TdWJtaXQgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1zdWJtaXQnKTtcbiAgICAgICAgdGhpcy5yb29tSWQ9IHRoaXMuJGVsLmRhdGEoJ3Jlc291cmNlLWlkJyk7XG4gICAgICAgIHRoaXMuJGRhdGVTZWxlY3QgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1kYXRlLXNlbGVjdCcpO1xuICAgICAgICB0aGlzLmRhdGVZbWQgPSB0aGlzLiRkYXRlU2VsZWN0LnZhbCgpO1xuICAgICAgICB0aGlzLiRyb29tU2NoZWR1bGUgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1zY2hlZHVsZScpO1xuICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0ID0gdGhpcy4kZWwuZmluZCgnLmpzLWN1cnJlbnQtZHVyYXRpb24nKTtcbiAgICAgICAgdGhpcy4kcm9vbVNsb3RJbnB1dHMgPSBudWxsO1xuICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cyA9IFtdO1xuICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZFNsb3QgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5tYXhTbG90cyA9IDQ7XG4gICAgICAgIHRoaXMuJG1heFRpbWUgPSB0aGlzLiRlbC5maW5kKCcuanMtbWF4LXRpbWUnKTtcbiAgICAgICAgdGhpcy5zbG90TWludXRlcyA9IDMwO1xuICAgICAgICB0aGlzLnRpbWVab25lID0gJy03MDAnO1xuICAgICAgICB0aGlzLm9wZW5UaW1lID0gbmV3IERhdGUoIG5vdy5nZXRGdWxsWWVhcigpLCBub3cuZ2V0TW9udGgoKSwgbm93LmdldERhdGUoKSwgOCApOyAvLyA4YW0gdG9kYXlcbiAgICAgICAgdGhpcy5jbG9zZVRpbWUgPSBuZXcgRGF0ZSggbm93LmdldEZ1bGxZZWFyKCksIG5vdy5nZXRNb250aCgpLCBub3cuZ2V0RGF0ZSgpLCAxNyApOyAvLyA1cG0gdG9kYXk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgICAgIHRvZGF5WW1kPSBuZXcgRGF0ZSgpLnRvSVNPU3RyaW5nKCkuc3BsaXQoJ1QnKVswXTtcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcblxuICAgICAgICB0aGlzLnNldE1heFRpbWVUZXh0KCk7XG5cbiAgICAgICAgdGhpcy5nZXRSb29tQXZhaWxhYmlsaXR5KHRvZGF5WW1kKVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogUmVtb3ZlXG4gICAgICAgICAgICAgICAgLy8gdXNlIGR1bW15IHRleHRcbiAgICAgICAgICAgICAgICBkYXRhID0gZHVtbXlBdmFpbGFiaWxpdHlEYXRhO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIF90aGlzLm1ha2VTY2hlZHVsZShkYXRhKTtcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX3RoaXMuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pbml0RGF0ZUV2ZW50cygpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0Rm9ybUV2ZW50cygpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuZ2V0Um9vbUF2YWlsYWJpbGl0eSA9IGZ1bmN0aW9uKFltZCl7XG5cbiAgICAgICAgLyogVE9ETzpcbiAgICAgICAgICogTWFrZSBhIEdFVCByZXF1ZXN0IGhlcmUgZm9yIHNwYWNlIGF2YWlsYWJpbGl0eS5cbiAgICAgICAgICogaHR0cHM6Ly9jbGFyZW1vbnQubGliY2FsLmNvbS9hZG1pbl9hcGkucGhwP3ZlcnNpb249MS4xJmVuZHBvaW50PXNwYWNlX2dldFxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgcmV0dXJuICQuZ2V0KHtcbiAgICAgICAgICAgIC8vIHVybDogQ0NMLnNpdGVfdXJsICsgJ2FwaS9yb29tcy9hdmFpbGFiaWxpdHkvOTE0OCcsXG4gICAgICAgICAgICB1cmw6ICcjJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAnYXZhaWxhYmlsaXR5JzogWW1kIC8vIGUuZy4gJzIwMTctMTAtMTknXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5tYWtlU2NoZWR1bGUgPSBmdW5jdGlvbihkYXlEYXRhKXtcblxuICAgICAgICAvLyBnZXQgb2JqZWN0IGZvciBmaXJzdCByb29tIGluIGFycmF5LiB3ZSdyZSBvbmx5IGNhbGxpbmcgZGF0YSBmb3Igb25lIHJvb20gYXQgYSB0aW1lLlxuICAgICAgICBkYXlEYXRhID0gZGF5RGF0YVswXTtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICAgICAgaHRtbCA9IFtdLFxuICAgICAgICAgICAgYXZhaWxhYmlsaXR5ID0gZGF5RGF0YS5hdmFpbGFiaWxpdHksXG4gICAgICAgICAgICBvbGRUb1RpbWU7XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gY29uc3RydWN0IEhUTUwgZm9yIGVhY2ggdGltZSBzbG90XG4gICAgICAgICQoZGF5RGF0YS5hdmFpbGFiaWxpdHkpLmVhY2goZnVuY3Rpb24oaSxpdGVtKXtcblxuICAgICAgICAgICAgdmFyIG5ld0Zyb21UaW1lID0gaXRlbS5mcm9tLFxuICAgICAgICAgICAgICAgIHNsb3REYXRlVGltZSA9IG5ldyBEYXRlKCBpdGVtLmZyb20gKTtcblxuICAgICAgICAgICAgLy8gY29tcGFyZSB0aGlzIGl0ZW0gYW5kIHRoZSBwcmV2aW91cyBpdGVtIHRvIGxvb2sgZm9yIGdhcHMgaW4gdGltZS5cbiAgICAgICAgICAgIC8vIGdhcHMgaW5kaWNhdGVkIGEgcmVzZXJ2ZWQgYmxvY2sgb2YgdGltZVxuICAgICAgICAgICAgaWYgKCBvbGRUb1RpbWUgJiYgb2xkVG9UaW1lICE9IG5ld0Zyb21UaW1lICApIHtcblxuICAgICAgICAgICAgICAgIHZhciBuZXdGcm9tVGltZVVuaXggPSBuZXcgRGF0ZShuZXdGcm9tVGltZSkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgICAgICBvbGRUb1RpbWVVbml4ID0gbmV3IERhdGUob2xkVG9UaW1lKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgIGRpZmZlcmVuY2UgPSBuZXdGcm9tVGltZVVuaXggLSBvbGRUb1RpbWVVbml4LFxuICAgICAgICAgICAgICAgICAgICBzbG90cztcblxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpdGVtJyxpdGVtLCdzbG90cycsZGlmZmVyZW5jZS8pO1xuXG4gICAgICAgICAgICAgICAgLy8gZ2V0IGRpZmZlcmVuY2UgaW4gbWludXRlc1xuICAgICAgICAgICAgICAgIGRpZmZlcmVuY2UgPSBkaWZmZXJlbmNlIC8gMTAwMCAvIDYwO1xuICAgICAgICAgICAgICAgIHNsb3RzID0gZGlmZmVyZW5jZSAvIF90aGlzLnNsb3RNaW51dGVzO1xuXG4gICAgICAgICAgICAgICAgLy8gYnVpbGQgc2xvdHMgZm9yIG9jY3VwaWVkICh1bnNlbGVjdGFibGUpIHRpbWVcbiAgICAgICAgICAgICAgICBmb3IgKCB2YXIgaiA9IDA7IGogPCBzbG90czsgaisrICkge1xuXG4gICAgICAgICAgICAgICAgICAgIHZhciBhZGRNaWxsaXNlY29uZHMgPSBqICogX3RoaXMuc2xvdE1pbnV0ZXMgKiA2MCAqIDEwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdVbml4ID0gb2xkVG9UaW1lVW5peCArIGFkZE1pbGxpc2Vjb25kcztcblxuICAgICAgICAgICAgICAgICAgICBodG1sLnB1c2goIF90aGlzLm1ha2VUaW1lU2xvdCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogJ3Nsb3QtJyArIF90aGlzLnJvb21JZCArICctJyArIGkgKyAnLScgKyBqLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzYWJsZWQ6ICdkaXNhYmxlZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzczogJ2NjbC1pcy1vY2N1cGllZCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZTogX3RoaXMuZm9ybWF0RGF0ZVN0cmluZyggbmV3IERhdGUobmV3VW5peCkgKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVTdHJpbmc6IF90aGlzLmZvcm1hdERhdGVTdHJpbmcoIG5ldyBEYXRlKG5ld1VuaXgpLCAncmVhZGFibGUnIClcbiAgICAgICAgICAgICAgICAgICAgfSkgKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gYnVpbGQgc2VsZWN0YWJsZSB0aW1lIHNsb3RzXG4gICAgICAgICAgICBodG1sLnB1c2goIF90aGlzLm1ha2VUaW1lU2xvdCh7XG4gICAgICAgICAgICAgICAgaWQ6ICdzbG90LScgKyBfdGhpcy5yb29tSWQgKyAnLScgKyBpLFxuICAgICAgICAgICAgICAgIHZhbHVlOiBfdGhpcy5mb3JtYXREYXRlU3RyaW5nKCBzbG90RGF0ZVRpbWUgKSxcbiAgICAgICAgICAgICAgICB0aW1lU3RyaW5nOiBfdGhpcy5mb3JtYXREYXRlU3RyaW5nKCBzbG90RGF0ZVRpbWUsICdyZWFkYWJsZScgKVxuICAgICAgICAgICAgfSkgKTtcblxuICAgICAgICAgICAgLy8gdXBkYXRlIHZhcmlhYmxlIHRvIHRoZSBjdXJyZW50IGl0ZW0ncyBcInRvXCIgdmFsdWUuXG4gICAgICAgICAgICBvbGRUb1RpbWUgPSBpdGVtLnRvO1xuICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbXTtcblxuICAgICAgICB0aGlzLiRyb29tU2NoZWR1bGUuaHRtbCggaHRtbC5qb2luKCcnKSApO1xuXG4gICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXJvb21fX3Nsb3QgW3R5cGU9XCJjaGVja2JveFwiXScpO1xuXG4gICAgICAgIHRoaXMuc2V0Q3VycmVudER1cmF0aW9uVGV4dCgpO1xuXG4gICAgICAgIC8vIHRoaXMuc2V0T2NjdXBpZWRSb29tcygpO1xuXG4gICAgICAgIHRoaXMuaW5pdFNsb3RFdmVudHMoKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUubWFrZVRpbWVTbG90ID0gZnVuY3Rpb24odmFycyl7XG4gICAgICAgIFxuICAgICAgICBpZiAoICEgdmFycyB8fCB0eXBlb2YgdmFycyAhPT0gJ29iamVjdCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBjbGFzczogJycsXG4gICAgICAgICAgICBpZDogJycsXG4gICAgICAgICAgICBkaXNhYmxlZDogJycsXG4gICAgICAgICAgICB2YWx1ZTogJycsXG4gICAgICAgICAgICB0aW1lU3RyaW5nOiAnJ1xuICAgICAgICB9O1xuICAgICAgICB2YXJzID0gJC5leHRlbmQoZGVmYXVsdHMsIHZhcnMpO1xuXG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9ICcnICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2NsLWMtcm9vbV9fc2xvdCAnICsgdmFycy5jbGFzcyArICdcIj4nICtcbiAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwiJyArIHZhcnMuaWQgKyAnXCIgbmFtZT1cIicgKyB2YXJzLmlkICsgJ1wiIHZhbHVlPVwiJyArIHZhcnMudmFsdWUgKyAnXCIgJyArIHZhcnMuZGlzYWJsZWQgKyAnLz4nICtcbiAgICAgICAgICAgICAgICAnPGxhYmVsIGNsYXNzPVwiY2NsLWMtcm9vbV9fc2xvdC1sYWJlbFwiIGZvcj1cIicgKyB2YXJzLmlkICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICB2YXJzLnRpbWVTdHJpbmcgK1xuICAgICAgICAgICAgICAgICc8L2xhYmVsPicgK1xuICAgICAgICAgICAgJzwvZGl2Pic7XG5cbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdEZvcm1FdmVudHMgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuc3VibWl0KGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy5vblN1Ym1pdCgpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdERhdGVFdmVudHMgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRkYXRlU2VsZWN0LmNoYW5nZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgX3RoaXMub25EYXRlQ2hhbmdlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0U2xvdEV2ZW50cyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICBpZiAoIHRoaXMuJHJvb21TbG90SW5wdXRzICYmIHRoaXMuJHJvb21TbG90SW5wdXRzLmxlbmd0aCApe1xuXG4gICAgICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cy5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGlzO1xuICAgICAgICAgICAgICAgIF90aGlzLm9uU2xvdENoYW5nZShpbnB1dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vbkRhdGVDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5kYXRlWW1kID0gdGhpcy4kZGF0ZVNlbGVjdC52YWwoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuXG4gICAgICAgIHRoaXMuZ2V0Um9vbUF2YWlsYWJpbGl0eSh0aGlzLmRhdGVZbWQpXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBSZW1vdmVcbiAgICAgICAgICAgICAgICAvLyB1c2UgZHVtbXkgdGV4dFxuICAgICAgICAgICAgICAgIGRhdGEgPSBkdW1teUF2YWlsYWJpbGl0eURhdGE7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgX3RoaXMubWFrZVNjaGVkdWxlKGRhdGEpO1xuXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBfdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblNsb3RDaGFuZ2UgPSBmdW5jdGlvbihjaGFuZ2VkSW5wdXQpe1xuXG4gICAgICAgIC8vIGlmIGlucHV0IGNoZWNrZWQsIGFkZCBpdCB0byBzZWxlY3RlZCBzZXRcbiAgICAgICAgaWYgKCAkKGNoYW5nZWRJbnB1dCkucHJvcCgnY2hlY2tlZCcpICkge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMucHVzaChjaGFuZ2VkSW5wdXQpO1xuICAgICAgICAgICAgJChjaGFuZ2VkSW5wdXQpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5hZGRDbGFzcygnY2NsLWlzLWNoZWNrZWQnKTtcblxuICAgICAgICAvLyBpZiB1bmNoZWNrZWQsIHJlbW92ZSBpdCBmcm9tIHRoZSBzZWxlY3RlZCBzZXRcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBpbnB1dEluZGV4ID0gdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZihjaGFuZ2VkSW5wdXQpO1xuICAgICAgICAgICAgaWYgKCBpbnB1dEluZGV4ID4gLTEgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuc3BsaWNlKCBpbnB1dEluZGV4LCAxICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKGNoYW5nZWRJbnB1dCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtY2hlY2tlZCcpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbGltaXQgbnVtYmVyIG9mIHNlbGVjdGVkIHNsb3RzXG4gICAgICAgIGlmICggdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoID4gdGhpcy5tYXhTbG90cyApIHtcbiAgICAgICAgICAgIHZhciBzaGlmdGVkSW5wdXQgPSB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5zaGlmdCgpO1xuICAgICAgICAgICAgdGhpcy5jbGVhclNsb3Qoc2hpZnRlZElucHV0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGF1dG8gc2VsZWN0IHNsb3RzIGluIGJldHdlZW4gdGhlIDIgb3V0ZXJtb3N0IHNsb3RzXG4gICAgICAgIC8vIGlmICggdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoID4gMSApIHtcbiAgICAgICAgLy8gICAgIHZhciBzZWxlY3Rpb24gPSAkLmV4dGVuZChbXSx0aGlzLnNlbGVjdGVkU2xvdElucHV0cyksXG4gICAgICAgIC8vICAgICAgICAgc29ydGVkU2VsZWN0aW9uID0gc2VsZWN0aW9uLnNvcnQoZnVuY3Rpb24oYSxiKXsgXG4gICAgICAgIC8vICAgICAgICAgICAgIHJldHVybiBhLnZhbHVlID4gYi52YWx1ZTsgXG4gICAgICAgIC8vICAgICAgICAgfSksXG4gICAgICAgIC8vICAgICAgICAgZmlyc3RFbCA9IHNvcnRlZFNlbGVjdGlvblswXSxcbiAgICAgICAgLy8gICAgICAgICBmaXJzdEluZGV4ID0gdGhpcy4kcm9vbVNsb3RJbnB1dHMuaW5kZXgoZmlyc3RFbCksXG4gICAgICAgIC8vICAgICAgICAgbGFzdEVsID0gc29ydGVkU2VsZWN0aW9uW3NvcnRlZFNlbGVjdGlvbi5sZW5ndGggLSAxXSxcbiAgICAgICAgLy8gICAgICAgICBsYXN0SW5kZXggPSB0aGlzLiRyb29tU2xvdElucHV0cy5pbmRleChsYXN0RWwpLFxuICAgICAgICAvLyAgICAgICAgIGNoYW5nZWRJbnB1dEluZGV4ID0gdGhpcy4kcm9vbVNsb3RJbnB1dHMuaW5kZXgoY2hhbmdlZElucHV0KSxcbiAgICAgICAgLy8gICAgICAgICB1cFRvSW5kZXggPSBNYXRoLm1pbiggY2hhbmdlZElucHV0SW5kZXgsIGZpcnN0SW5kZXggKyB0aGlzLm1heFNsb3RzICk7XG5cbiAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKCdmaXJzdEluZGV4JywgZmlyc3RJbmRleCwgJ2NoYW5nZWRJbnB1dEluZGV4JywgY2hhbmdlZElucHV0SW5kZXgsICdmaXJzdEluZGV4ICsgdGhpcy5tYXhTbG90cycsIGZpcnN0SW5kZXggKyB0aGlzLm1heFNsb3RzICk7XG4gICAgICAgIC8vICAgICBjb25zb2xlLmxvZygndXBUb0luZGV4Jyx1cFRvSW5kZXgpO1xuXG4gICAgICAgIC8vICAgICAvLyBsb29wIHRocm91Z2ggYW5kIGFjdGl2YXRlIHNsb3RzLCBidXQgb25seSB1cCB0byBtYXhTbG90c1xuICAgICAgICAvLyAgICAgZm9yICggdmFyIGkgPSBmaXJzdEluZGV4ICsgMTsgaSA8IHVwVG9JbmRleDsgaSsrICkge1xuICAgICAgICAvLyAgICAgICAgIHRoaXMuYWN0aXZhdGVTbG90KCB0aGlzLiRyb29tU2xvdElucHV0cy5lcShpKSApO1xuICAgICAgICAvLyAgICAgfVxuXG4gICAgICAgIC8vICAgICAvLyBkZXNlbGVjdCBjaGFuZ2VkIGlucHV0IGlmIGl0cyBiZXlvbmQgdGhlIG1heFNsb3RzIHJhbmdlXG4gICAgICAgIC8vICAgICBpZiAoIGNoYW5nZWRJbnB1dEluZGV4ID49IGZpcnN0SW5kZXggKyB0aGlzLm1heFNsb3RzICkge1xuICAgICAgICAvLyAgICAgICAgIHRoaXMuY2xlYXJTbG90KCB0aGlzLiRyb29tU2xvdElucHV0cy5lcShjaGFuZ2VkSW5wdXRJbmRleCkgKTtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAvLyB9XG5cbiAgICAgICAgdGhpcy5zZXRDdXJyZW50RHVyYXRpb25UZXh0KCk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmNsZWFyU2xvdCA9IGZ1bmN0aW9uKHNsb3QpIHtcbiAgICAgICAgLy8gc2xvdCBjYW4gYmUgZWl0aGVyIHRoZSBjaGVja2JveCAtT1ItIHRoZSBjaGVja2JveCdzIGNvbnRhaW5lclxuXG4gICAgICAgIC8vIGlmIGl0J3MgdGhlIGNoZWNrYm94LlxuICAgICAgICBpZiAoICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSApIHtcbiAgICAgICAgIFxuICAgICAgICAgICAgJChzbG90KVxuICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJyxmYWxzZSlcbiAgICAgICAgICAgICAgICAucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLWlzLWNoZWNrZWQnKTtcbiAgICAgICAgICAgIFxuICAgICAgICAvLyBpZiBpdCdzIHRoZSBjb250YWluZXJcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgJChzbG90KVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLWlzLWNoZWNrZWQnKVxuICAgICAgICAgICAgICAgIC5maW5kKCdbdHlwZT1cImNoZWNrYm94XCJdJylcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLGZhbHNlKTtcblxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5hY3RpdmF0ZVNsb3QgPSBmdW5jdGlvbihzbG90KSB7XG4gICAgICAgIC8vIHNsb3QgY2FuIGJlIGVpdGhlciB0aGUgY2hlY2tib3ggLU9SLSB0aGUgY2hlY2tib3gncyBjb250YWluZXJcblxuICAgICAgICB2YXIgc2xvdElzQ2hlY2tib3ggPSAkKHNsb3QpLmlzKCdbdHlwZT1cImNoZWNrYm94XCJdJyksXG4gICAgICAgICAgICAkY29udGFpbmVyID0gc2xvdElzQ2hlY2tib3ggPyAkKHNsb3QpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKSA6ICQoc2xvdCk7XG5cbiAgICAgICAgLy8gbmV2ZXIgc2V0IGFuIG9jY3VwaWVkIHNsb3QgYXMgYWN0aXZlXG4gICAgICAgIGlmICggJGNvbnRhaW5lci5oYXNDbGFzcygnY2NsLWlzLW9jY3VwaWVkJykgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSApIHtcblxuICAgICAgICAgICAgLy8gaWYgaXQncyB0aGUgY2hlY2tib3guXG4gICAgICAgICBcbiAgICAgICAgICAgICQoc2xvdCkucHJvcCgnY2hlY2tlZCcsdHJ1ZSk7XG4gICAgICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKCdjY2wtaXMtY2hlY2tlZCcpO1xuICAgICAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIGlmIGl0J3MgdGhlIGNvbnRhaW5lclxuXG4gICAgICAgICAgICAkY29udGFpbmVyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdjY2wtaXMtY2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsdHJ1ZSk7XG5cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuc2V0Q3VycmVudER1cmF0aW9uVGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgc2VsZWN0aW9uID0gJC5leHRlbmQoW10sdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMpLFxuICAgICAgICAgICAgc29ydGVkU2VsZWN0aW9uID0gc2VsZWN0aW9uLnNvcnQoZnVuY3Rpb24oYSxiKXsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGEudmFsdWUgPiBiLnZhbHVlOyBcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgc2VsZWN0aW9uTGVuZ3RoID0gc29ydGVkU2VsZWN0aW9uLmxlbmd0aDtcbiAgICAgICAgXG4gICAgICAgIGlmICggc2VsZWN0aW9uTGVuZ3RoID4gMSApIHtcblxuICAgICAgICAgICAgdmFyIHRpbWUxVmFsID0gc29ydGVkU2VsZWN0aW9uWzBdLnZhbHVlLnNsaWNlKDAsLTQpLFxuICAgICAgICAgICAgICAgIHJlYWRhYmxlVGltZTEgPSB0aGlzLmZvcm1hdERhdGVTdHJpbmcoIG5ldyBEYXRlKHRpbWUxVmFsKSwgJ3JlYWRhYmxlJyApO1xuXG4gICAgICAgICAgICB2YXIgdGltZTJWYWwgPSBzb3J0ZWRTZWxlY3Rpb25bc29ydGVkU2VsZWN0aW9uLmxlbmd0aCAtIDFdLnZhbHVlLnNsaWNlKDAsLTQpLFxuICAgICAgICAgICAgICAgIHRpbWUyVCA9IG5ldyBEYXRlKHRpbWUyVmFsKS5nZXRUaW1lKCkgKyAoIHRoaXMuc2xvdE1pbnV0ZXMgKiA2MCAqIDEwMDAgKSxcbiAgICAgICAgICAgICAgICByZWFkYWJsZVRpbWUyID0gdGhpcy5mb3JtYXREYXRlU3RyaW5nKCBuZXcgRGF0ZSh0aW1lMlQpLCAncmVhZGFibGUnICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoIHJlYWRhYmxlVGltZTEgKyAnIHRvICcgKyByZWFkYWJsZVRpbWUyICk7XG5cbiAgICAgICAgfSBlbHNlIGlmICggc2VsZWN0aW9uTGVuZ3RoID4gMCApIHtcblxuICAgICAgICAgICAgdmFyIHRpbWVWYWwgPSBzb3J0ZWRTZWxlY3Rpb25bMF0udmFsdWUuc2xpY2UoMCwtNCksXG4gICAgICAgICAgICAgICAgcmVhZGFibGVUaW1lID0gdGhpcy5mb3JtYXREYXRlU3RyaW5nKCBuZXcgRGF0ZSh0aW1lVmFsKSwgJ3JlYWRhYmxlJyApO1xuICAgICAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dC50ZXh0KCByZWFkYWJsZVRpbWUgKyAnIHRvID8nICk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dC50ZXh0KCdOb25lJyk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5zZXRNYXhUaW1lVGV4dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBtYXhNaW51dGVzID0gdGhpcy5tYXhTbG90cyAqIHRoaXMuc2xvdE1pbnV0ZXMsXG4gICAgICAgICAgICBtYXhUZXh0O1xuXG4gICAgICAgIHN3aXRjaChtYXhNaW51dGVzKSB7XG4gICAgICAgICAgICBjYXNlIDI0MDpcbiAgICAgICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyAvIDYwICsgJyBob3Vycyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE4MDpcbiAgICAgICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyAvIDYwICsgJyBob3Vycyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDEyMDpcbiAgICAgICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyAvIDYwICsgJyBob3Vycyc7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDYwOlxuICAgICAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJztcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgKyAnbWlucyc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRtYXhUaW1lLnRleHQoIG1heFRleHQgKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmZvcm1hdERhdGVTdHJpbmcgPSBmdW5jdGlvbihkYXRlT2JqLCByZWFkYWJsZSl7XG5cbiAgICAgICAgdmFyIG1pbnV0ZXMgPSAoIGRhdGVPYmouZ2V0TWludXRlcygpLnRvU3RyaW5nKCkubGVuZ3RoIDwgMiApID8gJzAnICsgZGF0ZU9iai5nZXRNaW51dGVzKCkudG9TdHJpbmcoKSA6IGRhdGVPYmouZ2V0TWludXRlcygpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgaWYgKCByZWFkYWJsZSApIHtcblxuICAgICAgICAgICAgdmFyIGFtcG0gPSAoIGRhdGVPYmouZ2V0SG91cnMoKSA+PSAxMiApID8gJ3AnIDogJ2EnLFxuICAgICAgICAgICAgICAgIGhvdXIxMkZvcm1hdCA9ICggZGF0ZU9iai5nZXRIb3VycygpID4gMTIgKSA/IGRhdGVPYmouZ2V0SG91cnMoKSAtIDEyIDogZGF0ZU9iai5nZXRIb3VycygpO1xuXG4gICAgICAgICAgICByZXR1cm4gaG91cjEyRm9ybWF0ICsgJzonICsgbWludXRlcyArIGFtcG07XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdmFyIGhvdXJzID0gKCBkYXRlT2JqLmdldEhvdXJzKCkudG9TdHJpbmcoKS5sZW5ndGggPCAyICkgPyAnMCcgKyBkYXRlT2JqLmdldEhvdXJzKCkudG9TdHJpbmcoKSA6IGRhdGVPYmouZ2V0SG91cnMoKS50b1N0cmluZygpLFxuICAgICAgICAgICAgICAgIHNlY29uZHMgPSAoIGRhdGVPYmouZ2V0U2Vjb25kcygpLnRvU3RyaW5nKCkubGVuZ3RoIDwgMiApID8gJzAnICsgZGF0ZU9iai5nZXRTZWNvbmRzKCkudG9TdHJpbmcoKSA6IGRhdGVPYmouZ2V0U2Vjb25kcygpLnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGVZbWQgKyAnVCcgKyBob3VycyArICc6JyArIG1pbnV0ZXMgKyAnOicgKyBzZWNvbmRzICsgdGhpcy50aW1lWm9uZTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uU3VibWl0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIC8qIFRPRE86XG4gICAgICAgICAqIFBvcHVsYXRlIFwiYm9va2luZ3NcIiBhcnJheSB3aXRoIGNvcnJlY3QgZGF0YVxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgdmFyIHBheWxvYWQgPSB7XG4gICAgICAgICAgICBcImlpZFwiOjMzMyxcbiAgICAgICAgICAgIFwic3RhcnRcIjogdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHNbMF0udmFsdWUsXG4gICAgICAgICAgICBcImZuYW1lXCI6IHRoaXMuJGVsWzBdLmZuYW1lLnZhbHVlLFxuICAgICAgICAgICAgXCJsbmFtZVwiOiB0aGlzLiRlbFswXS5sbmFtZS52YWx1ZSxcbiAgICAgICAgICAgIFwiZW1haWxcIjogdGhpcy4kZWxbMF0uZW1haWwudmFsdWUsXG4gICAgICAgICAgICBcIm5pY2tuYW1lXCI6XCJUZXN0IFJvb20gUmVzZXJ2YXRpb25cIixcbiAgICAgICAgICAgIFwiYm9va2luZ3NcIjpbXG4gICAgICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICAgICAgLy8gdXNpbmcgM3BtIGFzIGVuZCB0aW1lIGZvciBub3dcbiAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiB0aGlzLmRhdGVZbWQgKyBcIlQxNTowMDowMFwiICsgdGhpcy50aW1lWm9uZVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfTtcblxuICAgICAgICBjb25zb2xlLmxvZyggJ29uU3VibWl0IMK7ICcsIHBheWxvYWQgKTtcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcbiAgICAgICAgdGhpcy4kZm9ybUNhbmNlbC5wcm9wKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgIHRoaXMuJGZvcm1TdWJtaXQudGV4dCgnU2VuZGluZy4uLicpLnByb3AoJ2Rpc2FibGVkJyx0cnVlKTtcblxuICAgICAgICAvKiBUT0RPOlxuICAgICAgICAgKiBNYWtlIGEgcmVxdWVzdCBoZXJlIHRvIHJlc2VydmUgc3BhY2UuXG4gICAgICAgICAqIEkga25vdyB0aGUgTGliQ2FsIEFQSSByZXF1ZXN0IHNob3VsZCBiZSBQT1NULFxuICAgICAgICAgKiBidXQgc2hvdWxkIG91ciBpbnRlcm5hbCBhZG1pbi1hamF4IHJlcXVlc3QgYmUgR0VUP1xuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgJC5nZXQoe1xuICAgICAgICAgICAgICAgIC8vIHVybDogQ0NMLnNpdGVfdXJsICsgJ2FwaS9yb29tcy9yZXNlcnZlJyxcbiAgICAgICAgICAgICAgICB1cmw6ICcjJyxcbiAgICAgICAgICAgICAgICBkYXRhOiBwYXlsb2FkXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2Upe1xuXG4gICAgICAgICAgICAgICAgLy8gZm9yIG5vdywganVzdCBpbnZva2luZyB0aGUgaGFuZGxlciBtYW51YWxseSB3aXRoIGR1bW15IGRhdGFcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3JSZXNwb25zZSA9IHsgXCJlcnJvcnNcIjogWyBcInNvbWUgZXJyb3IgbWVzc2FnZVwiIF0gIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3NmdWxSZXNwb25zZSA9IHsgXCJib29raW5nX2lkXCI6IFwiY3NfTDZ2OWdpOFwiIH07XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaGFuZGxlU3VibWl0UmVzcG9uc2Uoc3VjY2Vzc2Z1bFJlc3BvbnNlKTtcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFsd2F5cyhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF90aGlzLiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIGhhbmRsZVN1Ym1pdFJlc3BvbnNlKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgIHZhciByZXNwb25zZUhUTUw7XG5cbiAgICAgICAgICAgIGlmICggcmVzcG9uc2UuYm9va2luZ19pZCApIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwgPSAgWyc8cCBjbGFzcz1cImNjbC1oMiBjY2wtdS1tdC0wXCI+U3VjY2VzcyE8L3A+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxwIGNsYXNzPVwiY2NsLWg0XCI+WW91ciBib29raW5nIElEIGlzIDxzcGFuIGNsYXNzPVwiY2NsLXUtY29sb3Itc2Nob29sXCI+JyArIHJlc3BvbnNlLmJvb2tpbmdfaWQgKyAnPC9zcGFuPjwvcD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHAgY2xhc3M9XCJjY2wtaDRcIj5QbGVhc2UgY2hlY2sgeW91ciBlbWFpbCB0byBjb25maXJtIHlvdXIgYm9va2luZy48L3A+J107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTCA9ICBbJzxwIGNsYXNzPVwiY2NsLWgzIGNjbC11LW10LTBcIj5Tb3JyeSwgYnV0IHdlIGNvdWxkblxcJ3QgcHJvY2VzcyB5b3VyIHJlc2VydmF0aW9uLjwvcD4nLCc8cCBjbGFzcz1cImNjbC1oNFwiPkVycm9yczo8L3A+J107XG4gICAgICAgICAgICAgICAgJChyZXNwb25zZS5lcnJvcnMpLmVhY2goZnVuY3Rpb24oaSwgZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwucHVzaCgnPHAgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3JcIj4nICsgZXJyb3IgKyAnPC9wPicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTC5wdXNoKCc8cCBjbGFzcz1cImNjbC1oNFwiPlBsZWFzZSB0YWxrIHRvIHlvdXIgbmVhcmVzdCBsaWJyYXJpYW4gZm9yIGhlbHAuPC9wPicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBfdGhpcy4kZm9ybUNhbmNlbC5wcm9wKCdkaXNhYmxlZCcsZmFsc2UpLnRleHQoJ0Nsb3NlJyk7XG4gICAgICAgICAgICBfdGhpcy4kZm9ybVN1Ym1pdC5yZW1vdmUoKTtcbiAgICAgICAgICAgIF90aGlzLiRmb3JtQ29udGVudC5hbmltYXRlKHtvcGFjaXR5OiAwfSwgQ0NMLkRVUkFUSU9OKTtcbiAgICAgICAgICAgIF90aGlzLiRmb3JtUmVzcG9uc2VcbiAgICAgICAgICAgICAgICAuZGVsYXkoQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5hbmltYXRlKHtvcGFjaXR5OiAxfSwgQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5odG1sKHJlc3BvbnNlSFRNTCk7XG4gICAgICAgICAgICBfdGhpcy4kZm9ybUNvbnRlbnRcbiAgICAgICAgICAgICAgICAuZGVsYXkoQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5hbmltYXRlKHtoZWlnaHQ6IF90aGlzLiRmb3JtUmVzcG9uc2UuaGVpZ2h0KCkgKyAncHgnIH0sIENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuY3NzKHt6SW5kZXg6ICctMSd9KTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG5cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1yb29tLXJlcy1mb3JtJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFJvb21SZXNGb3JtKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU3RpY2tpZXNcbiAqIFxuICogQmVoYXZpb3VyIGZvciBzdGlja3kgZWxlbWVudHMuXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBpc0ZpeGVkOiAnY2NsLWlzLWZpeGVkJ1xuICAgICAgICB9O1xuXG4gICAgdmFyIFN0aWNreSA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICAvLyB2YXJpYWJsZXNcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpLFxuICAgICAgICAgICAgaGVpZ2h0ID0gJGVsLm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICBvZmZzZXQgPSAkZWwub2Zmc2V0KCksXG4gICAgICAgICAgICBvcHRpb25zID0gJGVsLmRhdGEoJ3N0aWNreScpLFxuICAgICAgICAgICAgd3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJqcy1zdGlja3ktd3JhcHBlclwiPjwvZGl2PicpLmNzcyh7IGhlaWdodDogaGVpZ2h0ICsgJ3B4JyB9KTtcblxuICAgICAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgfTtcblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zICk7XG5cbiAgICAgICAgLy8gd3JhcCBlbGVtZW50XG4gICAgICAgICRlbC53cmFwKCB3cmFwcGVyICk7XG5cbiAgICAgICAgLy8gc2Nyb2xsIGxpc3RlbmVyXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgMTAwICkgKTtcblxuICAgICAgICAvLyBvbiBzY3JvbGxcbiAgICAgICAgZnVuY3Rpb24gX29uU2Nyb2xsKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKSArIG9wdGlvbnMub2Zmc2V0O1xuICAgIFxuICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gb2Zmc2V0LnRvcCApIHtcbiAgICAgICAgICAgICAgICAkZWwuYWRkQ2xhc3MoIGNsYXNzTmFtZS5pc0ZpeGVkICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLmlzRml4ZWQgKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1pcy1zdGlja3knKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU3RpY2t5KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogVG9nZ2xlIFNjaG9vbHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIHNjaG9vbCB0b2dnbGVzXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIGluaXRTY2hvb2wgPSAkKCdodG1sJykuZGF0YSgnc2Nob29sJyk7XG5cbiAgICB2YXIgU2Nob29sU2VsZWN0ID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kc2VsZWN0ID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgU2Nob29sU2VsZWN0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIGlmICggaW5pdFNjaG9vbCApIHtcblxuICAgICAgICAgICAgdGhpcy4kc2VsZWN0XG4gICAgICAgICAgICAgICAgLmZpbmQoICdvcHRpb25bdmFsdWU9XCInICsgaW5pdFNjaG9vbCArICdcIl0nIClcbiAgICAgICAgICAgICAgICAuYXR0ciggJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyApOyAgIFxuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRzZWxlY3QuY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hdHRyKCAgJ2RhdGEtc2Nob29sJywgZXZlbnQudGFyZ2V0LnZhbHVlICk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJzY2hvb2xcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU2Nob29sU2VsZWN0KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIFRvb2x0aXBzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciB0b29sdGlwc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgVG9vbHRpcCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy4kZWwuYXR0cigndGl0bGUnKTtcbiAgICAgICAgdGhpcy4kdG9vbHRpcCA9ICQoJzxkaXYgaWQ9XCJjY2wtY3VycmVudC10b29sdGlwXCIgY2xhc3M9XCJjY2wtYy10b29sdGlwIGNjbC1pcy10b3BcIiByb2xlPVwidG9vbHRpcFwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19hcnJvd1wiPjwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19pbm5lclwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBUb29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuaG92ZXIoZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIC8vIG1vdXNlb3ZlclxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCAnJyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cignYXJpYS1kZXNjcmliZWRieScsICdjY2wtY3VycmVudC10b29sdGlwJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblxuICAgICAgICAgICAgQ0NMLnJlZmxvdyhfdGhpcy4kdG9vbHRpcFswXSk7XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBfdGhpcy4kZWwub2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgd2lkdGggID0gX3RoaXMuJGVsLm91dGVyV2lkdGgoKSxcbiAgICAgICAgICAgICAgICB0b29sdGlwSGVpZ2h0ID0gX3RoaXMuJHRvb2x0aXAub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuY3NzKHtcbiAgICAgICAgICAgICAgICB0b3A6IChvZmZzZXQudG9wIC0gdG9vbHRpcEhlaWdodCkgKyAncHgnLFxuICAgICAgICAgICAgICAgIGxlZnQ6IChvZmZzZXQubGVmdCArICh3aWR0aC8yKSkgKyAncHgnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgIH0sIGZ1bmN0aW9uKGUpeyBcblxuICAgICAgICAgICAgLy9tb3VzZW91dFxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCBfdGhpcy5jb250ZW50KTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgJycpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlKCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBUb29sdGlwKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogV2F5ZmluZGluZ1xuICogXG4gKiBDb250cm9scyBpbnRlcmZhY2UgZm9yIGxvb2tpbmcgdXAgY2FsbCBudW1iZXIgbG9jYXRpb25zXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICB0YWJzLCB3YXlmaW5kZXI7XG4gICAgXG4gICAgdmFyIFRhYnMgPSBmdW5jdGlvbihlbCkge1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdGFicyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy10YWInKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMgPSAkKCcuY2NsLWMtdGFiX19jb250ZW50Jyk7XG4gICAgICAgIFxuXG4gICAgICAgIHRoaXMuJHRhYnMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICR0YWIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHRhYi5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICR0YWIuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0QWN0aXZlKHRhcmdldCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFRhYnMucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKHRhcmdldCl7XG4gICAgICAgIHRoaXMuJHRhYnMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFicy5maWx0ZXIoJ1tocmVmPVwiJyt0YXJnZXQrJ1wiXScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIHZhciBXYXlmaW5kZXIgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuY2FsbE51bWJlcnMgPSB7fTtcbiAgICAgICAgdGhpcy4kZm9ybSA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bWJlci1zZWFyY2gnKTtcbiAgICAgICAgdGhpcy4kaW5wdXQgPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW0taW5wdXQnKTtcbiAgICAgICAgdGhpcy4kc3VibWl0ID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtLXN1Ym1pdCcpO1xuICAgICAgICB0aGlzLiRtYXJxdWVlID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fbWFycXVlZScpO1xuICAgICAgICB0aGlzLiRjYWxsTnVtID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fY2FsbC1udW0nKTtcbiAgICAgICAgdGhpcy4kd2luZyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX3dpbmcnKTtcbiAgICAgICAgdGhpcy4kZmxvb3IgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19mbG9vcicpO1xuICAgICAgICB0aGlzLiRzdWJqZWN0ID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fc3ViamVjdCcpO1xuICAgICAgICB0aGlzLmVycm9yID0ge1xuICAgICAgICAgICAgZ2V0OiAnPGRpdiBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvciBjY2wtd2F5ZmluZGVyX19lcnJvclwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2NsLWItY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPjxpIGNsYXNzPVwiY2NsLWItaWNvbi1hbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gVGhlcmUgd2FzIGFuIGVycm9yIGZldGNoaW5nIGNhbGwgbnVtYmVycy48L2Rpdj4nLFxuICAgICAgICAgICAgZmluZDogJzxkaXYgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3IgY2NsLXdheWZpbmRlcl9fZXJyb3JcIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNjbC1iLWNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj48aSBjbGFzcz1cImNjbC1iLWljb24tYWxlcnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IENvdWxkIG5vdCBmaW5kIHRoYXQgY2FsbCBudW1iZXIuIFBsZWFzZSB0cnkgYWdhaW4uPC9kaXY+J1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRlcnJvckJveCA9ICQoJy5jY2wtZXJyb3ItYm94Jyk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAkLmdldEpTT04oIENDTC5hc3NldHMgKyAnanMvY2FsbC1udW1iZXJzLmpzb24nIClcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIF90aGlzLmNhbGxOdW1iZXJzID0gZGF0YTtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGVycm9yQm94LmFwcGVuZCggdGhpcy5lcnJvci5nZXQgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1hcHAtYWN0aXZlJyk7XG5cbiAgICAgICAgdGhpcy4kaW5wdXRcbiAgICAgICAgICAgIC5rZXl1cChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHF1ZXJ5ID09PSBcIlwiICkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3VibWl0LmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRtYXJxdWVlLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVzZXQoKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGZvcm0uc3VibWl0KGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBfdGhpcy4kaW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgICQoJy5jY2wtd2F5ZmluZGVyX19lcnJvcicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuc2hvdygpO1xuICAgICAgICAgICAgX3RoaXMuJGNhbGxOdW0udGV4dChxdWVyeSk7XG4gICAgICAgICAgICBfdGhpcy5maW5kUm9vbSggcXVlcnkgKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5nZXRDYWxsS2V5ID0gZnVuY3Rpb24oY2FsbE51bSkge1xuICAgICAgICB2YXIga2V5LFxuICAgICAgICAgICAgY2FsbEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmNhbGxOdW1iZXJzKTtcblxuICAgICAgICBpZiAoIGNhbGxLZXlzLmxlbmd0aCA9PT0gMCApe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbEtleXMuZm9yRWFjaChmdW5jdGlvbihrKXtcbiAgICAgICAgICBpZiAoIGNhbGxOdW0gPj0gayApIHtcbiAgICAgICAgICAgIGtleSA9IGs7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmZpbmRSb29tID0gZnVuY3Rpb24ocXVlcnkpIHtcblxuICAgICAgICBxdWVyeSA9IHF1ZXJ5LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgY2FsbEtleSA9IHRoaXMuZ2V0Q2FsbEtleShxdWVyeSksXG4gICAgICAgICAgICBjYWxsRGF0YSA9IHt9LFxuICAgICAgICAgICAgcm9vbTtcblxuICAgICAgICBpZiAoICEgY2FsbEtleSApIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dGaW5kRXJyb3IoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKCcuY2NsLWMtc2VhcmNoJykub2Zmc2V0KCkudG9wIH0pO1xuICAgICAgICBcbiAgICAgICAgY2FsbERhdGEgPSB0aGlzLmNhbGxOdW1iZXJzW2NhbGxLZXldO1xuXG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoIGNhbGxEYXRhLmZsb29yICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggY2FsbERhdGEud2luZyApO1xuICAgICAgICB0aGlzLiRzdWJqZWN0LnRleHQoIGNhbGxEYXRhLnN1YmplY3QgKTtcblxuICAgICAgICAvKiBUT0RPOlxuICAgICAgICAgKiBzZXQgQUNUVUFMIHJvb20sIG5vdCBqdXN0IHRoZSBmbG9vci4gc3RpbGwgd2FpdGluZyBvbiBjbGllbnQgXG4gICAgICAgICAqIHRvIHByb3ZpZGUgZGF0YSBmb3Igd2hpY2ggY2FsbCBudW1iZXJzIGJlbG9uZyB0byB3aGljaCByb29tc1xuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgICAgIHJvb20gPSBjYWxsRGF0YS5mbG9vcl9pbnQ7XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWY9XCIjZmxvb3ItJytyb29tKydcIl0nKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjcm9vbS0nK3Jvb20rJy0xJykuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcblxuICAgICAgICB0YWJzLnNldEFjdGl2ZSggJyNmbG9vci0nICsgcm9vbSApO1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUudGhyb3dGaW5kRXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdC50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiRlcnJvckJveC5hcHBlbmQoIHRoaXMuZXJyb3IuZmluZCApO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWpzLXRhYnMnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0YWJzID0gbmV3IFRhYnModGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuY2NsLWpzLXdheWZpbmRlcicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHdheWZpbmRlciA9IG5ldyBXYXlmaW5kZXIodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIl19
