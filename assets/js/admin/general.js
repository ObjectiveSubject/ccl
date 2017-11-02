/**
 * General Javascript for the Admin area
 */

( function( window, $, undefined ) {
	'use strict';
	var document = window.document;

	// Toggle Raw Data display on various post types
	var rawData = {

		init: function() {
			var toggleButton = $('#raw-data-toggle');

			toggleButton.click( function() {
				rawData.toggle();
			});
		},

		toggle: function( ) {

			var rawDataArea = $('#raw-api-data'),
				toggleButton = $('#raw-data-toggle');

			if ( toggleButton.text() == 'hide' ) {
				rawDataArea.addClass('hidden');
				toggleButton.text('show');
			}
			else {
				rawDataArea.removeClass('hidden');
				toggleButton.text('hide');
			}

		}

	};

	$(document).ready( function() {
		var body = $('body');

		// Toggle Raw Data display on Staff posts
		if ( body.hasClass('post-type-database') || body.hasClass('post-type-faq') || body.hasClass('post-type-guide') || body.hasClass('post-type-staff' ) || body.hasClass('post-type-room') ) {
			rawData.init();
		}
	});

} )( this, jQuery );
