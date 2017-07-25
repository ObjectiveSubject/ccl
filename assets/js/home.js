/**
 * Home
 *
 * JavaScript unique to the home page
 *
 * @todo gulpify so we get linting, mininfication, remove console.logs
 */

( function( window, $ ) {
 	'use strict';
	var document = window.document;

     var SearchAutocomplete = function(){
         this.init();
     };

     SearchAutocomplete.prototype.init = function () {
		 var timeout,
			 form = $('#ccl-c-search__bar'),
			 input = $('#ccl-b-input');

		 input
			 .keyup(function () {
				 var query = $(this);
				 clearTimeout(timeout);
				 timeout = setTimeout(function () {
					 if (query.val() !== "") {

					 	SearchAutocomplete.fetchResults( query );

					 }
				 }, 600);
			 })
			 .keydown(function () {
				 clearTimeout(timeout);
			 });
	 };

	SearchAutocomplete.fetchResults = function( query ) {

		var responseArea = $('.ccl-c-search__results');

		var data = {
			action: 'load_search_results', // this should probably be able to do people & assets too (maybe DBs)
			query : query.val()
		};

		$.post(ajaxurl, data, function (response) {
			//responseArea.append( response );
			 console.log( response );
		});

	}

     $(document).ready(function(){
		 if ($('body').hasClass('home')) {
			 new SearchAutocomplete();
		 }

     });

} )( this, jQuery );
