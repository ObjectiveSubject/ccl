/**
 * LibGuides
 *
 * Powers the inline import of LibGuides in the admin
 */

( function( window, $, undefined ) {
	'use strict';
	var document = window.document;

	var libguidesAdmin = {

		init: function() {
			var submitButton = $('#libguides-import');

			submitButton.click( function(e) {
				e.preventDefault();
				libguidesAdmin.importGuides();
			});
		},

		importGuides: function( ) {

			var responseArea = $('#libguides-import-response'),
				infoBox      = $('#libguides-info'),
				spinner      = $('.spinner'),
				nonce        = $('#libguides-import-nonce').val();

			infoBox.removeClass('hidden');

			console.log(nonce);

			var data = {
				action: 'retrieve_guides', // this should probably be able to do people & assets too (maybe DBs)
				libguides_nonce: nonce
			};

			$.post(ajaxurl, data, function(response) {
				spinner.removeClass('is-active');
				spinner.hide();
				responseArea.append(response);
			});
		}

	};

	$(document).ready( function() {
		if ($('body').hasClass('guide_page_import')) {
			libguidesAdmin.init();
		}
	});

} )( this, jQuery );
