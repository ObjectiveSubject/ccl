/**
 * Home
 *
 * JavaScript unique to the home page
 *
 * @todo gulpify so we get linting, mininfication, remove console.logs
 * @todo rename home to search (reflect the nature of the file)
 */

( function( window, $ ) {
 	'use strict';
	var document = window.document;

     var SearchAutocomplete = function(elem){
		this.input = $(elem);
        this.init();
     };

     SearchAutocomplete.prototype.init = function (elem) {
		var _this = this,
			timeout;

		 this.input
			 .keyup(function () {
				 var query = $(this);
				 clearTimeout(timeout);
				 timeout = setTimeout(function () {
					 if (query.val() !== "") {

					 	_this.fetchResults( query );

					 }
				 }, 600);
			 })
			 .keydown(function () {
				 clearTimeout(timeout);
			 });
	 };

	SearchAutocomplete.prototype.fetchResults = function( query ) {

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
			resultsLink.attr("href", "/?s=" + query);

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
		// .each() will fail gracefully if no elements are found
		$('#ccl-search').each(function(){
			new SearchAutocomplete(this);
		 });
     });

} )( this, jQuery );
