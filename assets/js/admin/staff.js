/**
 * Staff
 *
 * Powers the inline import of Staff in the admin
 */

( function( window, $, undefined ) {
	'use strict';
	var document = window.document;

	var staffAdmin = {

		init: function() {
			var submitButton = $('#staff-import');

			submitButton.click( function(e) {
				e.preventDefault();
				staffAdmin.importStaff();
			});
		},

		importStaff: function( ) {

			var responseArea = $('#staff-import-response'),
				infoBox      = $('#staff-info'),
				spinner      = $('.spinner'),
				nonce        = $('#staff-import-nonce').val();

			infoBox.removeClass('hidden');

			console.log(nonce);

			var data = {
				action: 'retrieve_staff', // this should probably be able to do people & assets too (maybe DBs)
				staff_nonce: nonce
			};

			$.post(ajaxurl, data, function(response) {
				spinner.removeClass('is-active');
				spinner.hide();
				responseArea.append(response);
			});
		}

	};

	$(document).ready( function() {
		if ($('body').hasClass('staff_page_staff_import')) {
			staffAdmin.init();
		}
	});

} )( this, jQuery );
