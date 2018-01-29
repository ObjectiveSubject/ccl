/**
 * Events
 *
 * Powers the inline import of Events in the admin
 */

( function( window, $, undefined ) {
	'use strict';
	var document = window.document;

	var eventsAdmin = {

		init: function() {
			var submitButton = $('#events-import');

			submitButton.click( function(e) {
				e.preventDefault();
				eventsAdmin.importEvents();
			});
		},

		importEvents: function( ) {

			var responseArea = $('#events-import-response'),
				infoBox      = $('#events-info'),
				spinner      = $('.spinner'),
				nonce        = $('#events-import-nonce').val();

			infoBox.removeClass('hidden');

			console.log(nonce);

			var data = {
				action: 'retrieve_events',
				events_nonce: nonce
			};

			$.post(ajaxurl, data, function(response) {
				spinner.removeClass('is-active');
				spinner.hide();
				responseArea.append(response);
			});
		}

	};

	$(document).ready( function() {
		if ($('body').hasClass('event_page_events_import')) {
			eventsAdmin.init();
		}
	});

} )( this, jQuery );
