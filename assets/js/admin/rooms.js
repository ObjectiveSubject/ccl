/**
 * Rooms
 *
 * Powers the inline import of Rooms in the admin
 */

( function( window, $, undefined ) {
	'use strict';
	var document = window.document;

	var roomsAdmin = {

		init: function() {
			var submitButton = $('#rooms-import');

			submitButton.click( function(e) {
				e.preventDefault();
				roomsAdmin.importRooms();
			});
		},

		importRooms: function( ) {

			var responseArea = $('#rooms-import-response'),
				infoBox      = $('#rooms-info'),
				spinner      = $('.spinner'),
				nonce        = $('#rooms-import-nonce').val();

			infoBox.removeClass('hidden');

			console.log(nonce);

			var data = {
				action: 'retrieve_rooms', // this should probably be able to do people & assets too (maybe DBs)
				rooms_nonce: nonce
			};

			$.post(ajaxurl, data, function(response) {
				spinner.removeClass('is-active');
				spinner.hide();
				responseArea.append(response);
			});
		}

	};

	$(document).ready( function() {
		if ($('body').hasClass('room_page_rooms_import')) {
			roomsAdmin.init();
		}
	});

} )( this, jQuery );
