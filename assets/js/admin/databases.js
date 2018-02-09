/**
 * Databases
 *
 * Powers the inline import of Databases in the admin
 */

( function( window, $, undefined ) {
	'use strict';
	var document = window.document;

	var databasesAdmin = {

		init: function() {
			var submitButton = $('#databases-import');

			submitButton.click( function(e) {
				e.preventDefault();
				console.log( this );
				databasesAdmin.importDatabases();
			});
		},

		importDatabases: function( ) {

			var responseArea = $('#databases-import-response'),
				infoBox      = $('#databases-info'),
				spinner      = $('.spinner'),
				nonce        = $('#databases-import-nonce').val();

			infoBox.removeClass('hidden');

			console.log(nonce);

			var data = {
				action: 'retrieve_databases', // this should probably be able to do people & assets too (maybe DBs)
				databases_nonce: nonce
			};

			$.post(ajaxurl, data, function(response, XMLHttpRequest) {
				
				console.log( XMLHttpRequest );
				spinner.removeClass('is-active');
				spinner.hide();
				responseArea.append(response);
			})
			.fail(function( response, XMLHttpRequest ){
				
				console.log( XMLHttpRequest );
				spinner.removeClass('is-active');
				spinner.hide();				
				responseArea.append(response);
			});
		}

	};

	$(document).ready( function() {
		if ($('body').hasClass('database_page_databases_import')) {
			databasesAdmin.init();
		}
	});

} )( this, jQuery );
