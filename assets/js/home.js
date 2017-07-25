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

		var responseArea = $('.ccl-c-search__list'),
			responseItems = $('.ccl-c-search-item');

		var data = {
			action: 'load_search_results', // this should probably be able to do people & assets too (maybe DBs)
			query : query.val()
		};

		$.post(ajaxurl, data, function (response) {
			var results = $.parseJSON( response ),
				count = results.count,
				query = results.query,
				posts = results.posts,
				resultsLink = $(".ccl-c-search__results-action");

			// Clear response area list items (update when Pattern Library view isn't necessary)
			responseItems.remove();

			// Build results count/link
			resultsLink.html( "View all " + count + " results <i class=\"ccl-b-icon-arrow-right\" aria-hidden=\"true\"></i>" );
			resultsLink.prop("href", "/?s=" + query);

			// Build results list
			posts.forEach(function(post) {
				console.log(post);

				var listItem = "<li class=\"ccl-c-search-item\">" +
					"<a href=\"" + post["link"] + "\">" +
					"<span class=\"ccl-c-search-item__type\">" +
					"<i class=\"ccl-b-icon-clip\" aria-hidden=\"true\"></i>" +
					"<span class=\"ccl-c-search-item__type-text\">" + post["type"] + "</span>" +
					"</span>" +
					"<span class=\"ccl-c-search-item__title\">" + post["title"] + "</span>" +
					"</a>" +
					"</li>";

				responseArea.append(listItem);
			});

			// Append results to bottom again (might be better to just rebuild link here)
			responseArea.append( $(".ccl-c-search__results-footer") );
		});

	}

     $(document).ready(function(){
		 if ($('body').hasClass('home')) {
			 new SearchAutocomplete();
		 }

     });

} )( this, jQuery );
