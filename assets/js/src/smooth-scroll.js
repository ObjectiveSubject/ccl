/**
 * Smooth Scrolling
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    $(document).ready(function(){

        $('.js-smooth-scroll').on('click', function(e){

            e.preventDefault();
            
            //set to blur
            $(this).blur();              
            
            var target = $(this).data('target') || $(this).attr('href'),
                $target = $(target),
                scrollOffset = 0;

            $('.ccl-c-quick-nav').each(function(){
                scrollOffset += $(this).outerHeight();
            });

            if ( $target.length ) {
                var targetTop = $target.offset().top;
                
                $('html, body').animate( { 
                    'scrollTop': targetTop - scrollOffset }, 
                    800 );
            
            }

           
            
        });

    });

} )( this, jQuery );
