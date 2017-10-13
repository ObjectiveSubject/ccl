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
			 .keydown(function (event) {
			 	 if (event.which === 13 || event.keyCode === 13) {
			 	 	document.catalogSearch.submit(); // direct search to WorldCat on return
				 } else {
					 clearTimeout(timeout);
				 }
			 });
	 };

	SearchAutocomplete.prototype.fetchResults = function( query ) {

		var responseArea = $('.ccl-c-search-results__list'),
			responseItems = $('.ccl-c-search-item'),
			resultsLink = $(".ccl-c-search-results__footer");

		var data = {
			action: 'load_search_results', // this should probably be able to do people & assets too (maybe DBs)
			query : query.val()
		};

		$.post(searchAjax.ajaxurl, data, function (response) {
			var results = $.parseJSON(response),
				count = results.count,
				query = results.query,
				posts = results.posts;

			// Clear response area list items (update when Pattern Library view isn't necessary)
			responseItems.remove();
			resultsLink.remove();

			var listItem = '<li class="ccl-c-search-item">' +
				'<a href="https://ccl.on.worldcat.org/external-search?sortKey=library&queryString=' + query + '">' +
				'<span class="ccl-c-search-item__type">' +
				'<i class="ccl-b-icon-book" aria-hidden="true"></i>' +
				'<span class="ccl-c-search-item__type-text">WorldCat</span>' +
				'</span>' +
				'<span class="ccl-c-search-item__title\">Search for &ldquo;' + query + '&rdquo; on WorldCat</span>' +
				'</a>' +
				'</li>';

			responseArea.append(listItem);

			if ( count > 0 ) {
				// Build results list
				posts.forEach(function (post) {
					console.log(post);

					listItem = '<li class="ccl-c-search-item">' +
						'<a href="' + post["link"] + '">' +
						'<span class=\"ccl-c-search-item__type\">' +
						'<i class="ccl-b-icon-' + post["icon"] + '" aria-hidden="true"></i>' +
						'<span class="ccl-c-search-item__type-text">' + post["type"] + '</span>' +
						'</span>' +
						'<span class="ccl-c-search-item__title">' + post["title"] + '</span>' +
						'</a>' +
						'</li>';

					responseArea.append(listItem);
				});
			}

			// Build results count/link
			listItem = '<li class="ccl-c-search-results__footer">' +
				       '<a href="/?s=' + query + '" class="ccl-c-search-results__action">' +
				       'View all ' + count + ' Results ' +
				       '<i class="ccl-b-icon-arrow-right" aria-hidden="true"></i>' +
				       '</a>' +
			           '</li>';

			responseArea.append(listItem);

		});

	};

     $(document).ready(function(){
		// .each() will fail gracefully if no elements are found
		$('#ccl-search').each(function(){
			new SearchAutocomplete(this);
		 });
     });

} )( this, jQuery );
