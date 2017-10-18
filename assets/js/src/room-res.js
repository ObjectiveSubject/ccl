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
        this.resourceId= this.$el.data('resource-id');
        this.$dateSelect = this.$el.find('.js-room-date-select');
        this.dateYmd = this.$dateSelect.val();
        this.$roomSchedule = this.$el.find('.js-room-schedule');
        this.$roomSlotInputs = null;
        this.selectedSlots = [];
        this.maxSlots = 4;
        this.slotMinutes = 30;
        this.timeZone = '-700';
        this.openTime = new Date( now.getFullYear(), now.getMonth(), now.getDate(), 8 ); // 8am today
        this.closeTime = new Date( now.getFullYear(), now.getMonth(), now.getDate(), 17 ); // 5pm today;

        var _this = this;

        this.init();

    };

    RoomResForm.prototype.init = function(){

        console.log(this);

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
            
            var slotDateTime = new Date( openTimeUnix + ( i * 30 * 60 * 1000 ) ),
                ampm = ( slotDateTime.getHours() >= 12 ) ? 'p' : 'a',
                hours = ( slotDateTime.getHours().toString().length < 2 ) ? '0' + slotDateTime.getHours().toString() : slotDateTime.getHours().toString(),
                hour12Format = ( slotDateTime.getHours() > 12 ) ? slotDateTime.getHours() - 12 : slotDateTime.getHours(),
                minutes = ( slotDateTime.getMinutes().toString().length < 2 ) ? '0' + slotDateTime.getMinutes().toString() : slotDateTime.getMinutes().toString(),
                seconds = ( slotDateTime.getSeconds().toString().length < 2 ) ? '0' + slotDateTime.getSeconds().toString() : slotDateTime.getSeconds().toString();
            
            html.push( this.makeTimeSlot({
                id: this.resourceId + '-slot-' + i,
                value: this.dateYmd + 'T' + hours + ':' + minutes + ':' + seconds + this.timeZone,
                timeString: hour12Format + ':' + minutes + ampm
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

        var _this = this;

        if ( ! _this.$roomSlotInputs || ! _this.$roomSlotInputs.length ) {
            return;
        }

        // make a request here to get status of time slots (occupied or available).
        
        // for now just picking 2 random slots
        // this logic might need to change based on how data is returned for occupied time slots
        var occupiedSlots = [ 1, 2 ];
        occupiedSlots.forEach(function(slot){
            var slotInput = _this.$roomSlotInputs[slot];
            if ( slotInput ) {
                $(slotInput).parent('.ccl-c-room__slot').addClass('ccl-is-occupied');
            }
        });

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
            this.selectedSlots.push(input);

        // if unchecked, remove it from the selected set
        } else {
            var inputIndex = this.selectedSlots.indexOf(input);
            if ( inputIndex > -1 ) {
                this.selectedSlots.splice( inputIndex, 1 );
            }
        }

        // keep selected set to max: 2
        if ( this.selectedSlots.length > this.maxSlots ) {
            var shiftedInput = this.selectedSlots.shift();
            $(shiftedInput).prop('checked', false);
        }

        // sort selected set
        this.selectedSlots = this.selectedSlots.sort(function(a,b){
            return a.value > b.value;
        });

        console.log( 'onSlotChange » ', this.selectedSlots );

    };

    RoomResForm.prototype.onSubmit = function(){

        var payload = {
            "iid":333,
            "start": this.selectedSlots[0].value,
            "fname": this.$el[0].fname.value,
            "lname": this.$el[0].lname.value,
            "email": this.$el[0].email.value,
            "nickname":"Test Room Reservation",
            "bookings":[
                { 
                    "id": this.resourceId,
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
