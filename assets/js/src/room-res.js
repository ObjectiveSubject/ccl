/**
 * Room Reservation
 * 
 * Handle room reservations
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var RoomResForm = function(el){
        
        this.$el = $(el);
        this.$roomSlotInputs = this.$el.find('.ccl-c-room__slot [type="checkbox"]');
        this.selectedSlots = [];
        this.maxSlots = 2;

        var _this = this;

        this.init();

    };

    RoomResForm.prototype.init = function(){

        var _this = this;

        this.setOccupiedRooms();
        
        this.$roomSlotInputs.change(function(){
            var input = this;
            _this.onSlotChange(input);
        });

        this.$el.submit(function(event){
            event.preventDefault();
            _this.onSubmit();
        });

    };

    RoomResForm.prototype.setOccupiedRooms = function(){

        var _this = this;

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
            $(shiftedInput).attr('checked', false);
        }

    };

    RoomResForm.prototype.onSubmit = function(){

        console.log( 'room form submitted » ', this );

    };

    $(document).ready(function(){
        $('.js-room-res-form').each(function(){
            new RoomResForm(this);
        });
    });

} )( this, jQuery );
