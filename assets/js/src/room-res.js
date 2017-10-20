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

        this.setMaxTimeText();

        this.makeSchedule();
        
        this.initDateEvents();

        this.initFormEvents();

    };

    RoomResForm.prototype.makeSchedule = function(day){

        var html = [],
            openTimeUnix = this.openTime.getTime(),
            closeTimeUnix = this.closeTime.getTime(),
            duration = closeTimeUnix - openTimeUnix, // returns milliseconds
            slotCount;

        // get duration in minutes
        duration = duration / 1000 / 60;
        // get slot count based on predefined slotMinutes
        slotCount = Math.floor( duration / this.slotMinutes );

        // construct HTML for each time slot
        for ( var i = 0; i < slotCount; i++ ) {
            
            var slotDateTime = new Date( openTimeUnix + ( i * 30 * 60 * 1000 ) );
            
            html.push( this.makeTimeSlot({
                id: 'slot-' + this.roomId + '-' + i,
                value: this.formatDateString( slotDateTime ),
                timeString: this.formatDateString( slotDateTime, 'readable' )
            }) );

        }

        this.selectedSlotInputs = [];

        this.$roomSchedule.html( html.join('') );

        this.$roomSlotInputs = this.$el.find('.ccl-c-room__slot [type="checkbox"]');

        this.setCurrentDurationText();

        this.setOccupiedRooms();

        this.initSlotEvents();

    };

    RoomResForm.prototype.makeTimeSlot = function(vars){
        
        if ( ! vars || typeof vars !== 'object' ) {
            return '';
        }

        var template = '' +
            '<div class="ccl-c-room__slot">' +
                '<input type="checkbox" id="'+vars.id+'" name="'+vars.id+'" value="'+vars.value+'" />' +
                '<label class="ccl-c-room__slot-label" for="'+vars.id+'">' +
                    vars.timeString +
                '</label>' +
            '</div>';

        return template;
    };

    RoomResForm.prototype.setOccupiedRooms = function(){

        // if form doesnt have slot inputs, return;
        if ( ! this.$roomSlotInputs || ! this.$roomSlotInputs.length ) {
            return;
        }

        // Get booking data

        var bookings = [];

        /* TODO:
         * Make a request here to get bookings for this room.
         * ------------------------------------------------ */
        // $.get({
        //         url: CCL.site_url + 'api/rooms/bookings',
        //         data: {
        //             eid: this.roomId,
        //             limit:50,
        //         }
        //     })
        //     .done(function(data){
        //         bookings = data;
        //     })
        //     .fail(function(error){
        //         console.log(error);
        //     })
        //     .always(function(){
        //         //
        //     });
        
        // For now just setting up dummy data
        bookings = [
            {
                "booking_id": "abc123",
                "eid": this.roomId,
                "cid": 37,
                "lid": 12,
                "fromDate": this.dateYmd + "T12:00:00" + this.timeZone,
                "toDate": this.dateYmd + "T13:00:00" + this.timeZone,
                "firstName": "John",
                "lastName": "Patron",
                "email": "john.patron@somewhere.com",
                "status": "Confirmed",
                "q43": "Chocolate"
            },
            {
                "booking_id": "abc123",
                "eid": this.roomId,
                "cid": 37,
                "lid": 12,
                "fromDate": this.dateYmd + "T14:00:00" + this.timeZone,
                "toDate": this.dateYmd + "T16:00:00" + this.timeZone,
                "firstName": "Jane",
                "lastName": "Patron",
                "email": "jane.patron@somewhere.com",
                "status": "Confirmed",
                "q43": "Chocolate"
            },
        ];

        var _this = this;

        // loop through booking data

        $(bookings).each(function(i, booking){

            // setup data concerning booking time/duration

            var fromDate = new Date( booking.fromDate.slice(0,-4) ),
                toDate = new Date( booking.toDate.slice(0,-4) ),
                duration = toDate.getTime() - fromDate.getTime(),
                durationMinutes = Math.floor( duration / 1000 / 60 ),
                slots = durationMinutes / _this.slotMinutes,
                slotDateStrArray = [], addMilliseconds, slotTime, slotDate, slotDateString;
                
            // populate slotDateStrArray with date strings that match time slot input values

            for ( var j = 0; j < slots; j++ ) {
                addMilliseconds = j * _this.slotMinutes * 60 * 1000;
                slotTime = fromDate.getTime() + addMilliseconds;
                slotDate = new Date(slotTime);
                slotDateString = _this.formatDateString(slotDate);

                slotDateStrArray.push(slotDateString);
            }

            // loop through array of date strings

            $(slotDateStrArray).each(function(j,slotDateStr){
                // find time slot input that matches date string,
                // disabled it, and add occupied class to parent element
                _this.$roomSlotInputs.filter(function(){
                    var input = this;
                    if ( $(input).val() == slotDateStr ) {
                        $(input).prop('disabled',true);
                        return true;
                    }
                })
                .parent('.ccl-c-room__slot')
                .addClass('ccl-is-occupied');
            });
            
        });

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
        this.dateYmd = this.$dateSelect.val();
        this.makeSchedule();
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

        console.log('sortedSelection',sortedSelection, 'this.selectedSlotInputs', this.selectedSlotInputs);
        
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
