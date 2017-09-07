/**
 * Wayfinding
 * 
 * Controls interface for looking up call number locations
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var Wayfinder = function(el){
        this.$el = $(el);
        this.init();
    };

    Wayfinder.prototype.init = function() {
        
        

    };

    $(document).ready(function(){
        $('.ccl-js-wayfinder').each(function(){
            new Carousel(this);
        });
    });

} )( this, jQuery );
