/**
 * FAQs
 *
 * Powers the inline import of FAQs in the admin
 */

( function( window, $, undefined ) {
	'use strict';
	var document = window.document;

	var faqsAdmin = {

		init: function() {
			var submitButton = $('#faqs-import');

			submitButton.click( function(e) {
				e.preventDefault();
				faqsAdmin.importGuides();
			});
		},

		importGuides: function( ) {

			var responseArea = $('#faqs-import-response'),
				infoBox      = $('#faqs-info'),
				spinner      = $('.spinner'),
				nonce        = $('#faqs-import-nonce').val();

			infoBox.removeClass('hidden');

			console.log(nonce);

			var data = {
				action: 'retrieve_faqs', // this should probably be able to do people & assets too (maybe DBs)
				faqs_nonce: nonce
			};

			$.post(ajaxurl, data, function(response) {
				spinner.removeClass('is-active');
				spinner.hide();
				responseArea.append(response);
			});
		}

	};

	$(document).ready( function() {
		if ($('body').hasClass('faq_page_import')) {
			faqsAdmin.init();
		}
	});

} )( this, jQuery );
