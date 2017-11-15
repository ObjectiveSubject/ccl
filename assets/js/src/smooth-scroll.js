/**
 * Smooth Scrolling
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    $(document).ready(function(){

        $('.js-smooth-scroll').on('click', function(e){

            e.preventDefault();

            var target = $(this).data('target') || $(this).attr('href'),
                $target = $(target);

            if ( $target.length ) {
                var targetOffset = $target.offset().top;
                $('html, body').animate( {'scrollTop': targetOffset}, 800 );
            }

        });

    });

} )( this, jQuery );
