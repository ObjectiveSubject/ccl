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

        var _this = this;

        this.$el.submit(function(event){
            event.preventDefault();
            console.log( 'form-submitted', _this.$el.serializeArray() );
        });

    };

    // RoomResForm.prototype.onSubmit = function(){

    //     console.log('form submitted',  );

    // };

    $(document).ready(function(){
        $('.js-room-res-form').each(function(){
            new RoomResForm(this);
        });
    });

} )( this, jQuery );
