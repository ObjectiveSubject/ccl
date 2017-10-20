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
        this.$formBody = this.$el.find('.js-room-res-form-body');
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

        console.log(this);

        this.setMaxTime();

        this.makeSchedule();
        
        this.initEventHandlers();

    };

    RoomResForm.prototype.makeSchedule = function(){

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

        this.$roomSchedule.html( html.join('') );

        this.$roomSlotInputs = this.$el.find('.ccl-c-room__slot [type="checkbox"]');

        this.setOccupiedRooms();

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

    RoomResForm.prototype.setSelectableSlots = function(){

        // if ( this.selectedSlotInputs.length === 0 ) {
            
        //     this.$roomSlotInputs.parent('.ccl-c-room__slot').removeClass('ccl-is-disabled');
        //     return;

        // } else {

        //     var firstSlotInput = this.selectedSlotInputs[0],
        //         firstSlotIndex = this.$roomSlotInputs.index(firstSlotInput),
        //         firstSlot = this.$roomSlotInputs.eq(firstSlotIndex).parent('.ccl-c-room__slot'),
        //         lastSlotInput,
        //         foundOccupiedSlot = false;

        //     for ( var i = 1; i <= this.maxSlots; i++ ) {
        //         if ( this.$roomSlotInputs.eq( firstSlotIndex + i ).parent('.ccl-c-room__slot').hasClass('ccl-is-occupied') ) {
        //             foundOccupiedSlot = true;
        //         } else {
        //             lastSlotInput = this.$roomSlotInputs.eq( firstSlotIndex + i );
        //         }
        //     }

        //     var selectableSlots = firstSlot.nextUntil( lastSlotInput.parent('.ccl-c-room__slot') );

        //     console.log( selectableSlots );

        // }

    };

    RoomResForm.prototype.initEventHandlers = function(){

        var _this = this;
        
        if ( this.$roomSlotInputs && this.$roomSlotInputs.length ){
            this.$roomSlotInputs.change(function(){
                var input = this;
                _this.onSlotChange(input);
            });
        }

        this.$dateSelect.change(function(){
            _this.onDateChange();
        });

        this.$el.submit(function(event){
            event.preventDefault();
            _this.onSubmit();
        });

    };

    RoomResForm.prototype.onDateChange = function() {
        this.dateYmd = this.$dateSelect.val();
        this.makeSchedule();
    };

    RoomResForm.prototype.onSlotChange = function(input){

        // if input checked, add it to selected set
        if ( $(input).prop('checked') ) {
            this.selectedSlotInputs.push(input);
            $(input).parent('.ccl-c-room__slot').addClass('ccl-is-checked');

        // if unchecked, remove it from the selected set
        } else {
            var inputIndex = this.selectedSlotInputs.indexOf(input);
            if ( inputIndex > -1 ) {
                this.selectedSlotInputs.splice( inputIndex, 1 );
            }
            $(input).parent('.ccl-c-room__slot').removeClass('ccl-is-checked');
        }

        // limit number of selected slots
        if ( this.selectedSlotInputs.length > this.maxSlots ) {
            var shiftedInput = this.selectedSlotInputs.shift();
            this.clearSlot(shiftedInput);
        }

        this.setCurrentDurationText();

        // this.setSelectableSlots();

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

    RoomResForm.prototype.setCurrentDurationText = function() {
        var selection = jQuery.extend([],this.selectedSlotInputs),
            sortedSelection = selection.sort(function(a,b){ 
                return a.value > b.value; 
            }),
            selectionLength = sortedSelection.length;
        
        console.log('sortedSelection', sortedSelection);

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

    RoomResForm.prototype.setMaxTime = function(){
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

    };



    // ------------------------------------------------------- //

    $(document).ready(function(){
        $('.js-room-res-form').each(function(){
            new RoomResForm(this);
        });
    });

} )( this, jQuery );
