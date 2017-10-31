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
        this.roomId= this.$el.data('resource-id');
        this.$dateSelect = this.$el.find('.js-room-date-select');
        this.dateYmd = this.$dateSelect.val();
        this.$roomSchedule = this.$el.find('.js-room-schedule');
        this.$currentDurationText = this.$el.find('.js-current-duration');
        this.$formNotification = $('<p class="ccl-c-alert"></p>');
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
        
    RoomResForm.prototype.initSlotEvents = function(){
        var _this = this;
        
        if ( this.$roomSlotInputs && this.$roomSlotInputs.length ){

            this.$el.find('.ccl-c-room__slot').hover(function(){
                // console.log('test in', this);
                _this.onSlotMouseIn(this);
            }, function(){
                // console.log('test out', this);
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

        console.log( 'on Submit » ', payload );

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
