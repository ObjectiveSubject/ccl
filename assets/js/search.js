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
	var document = window.document,
		TAB = 9, SHIFT = 16, CTRL = 17, ALT = 18, CAPS = 20, ESC = 27, LCMD = 91, RCMD = 92, LARR = 37, UARR = 38, RARR = 39, DARR = 40,
		forbiddenKeys = [TAB, SHIFT, CTRL, ALT, CAPS, ESC, LCMD, RCMD, LARR, UARR, RARR, DARR];
		
     var SearchAutocomplete = function(elem){
		
		this.$el = $(elem);
		this.$input = $(elem).find('#ccl-search');
		this.$responseArea = this.$el.find('.ccl-c-search-results__list'),
		this.$responseItems = this.$el.find('.ccl-c-search-item'),
		this.$resultsLink = this.$el.find('.ccl-c-search-results__footer');

        this.init();
     };

     SearchAutocomplete.prototype.init = function () {
		var _this = this,
			timeout;

		_this.$input
			.keyup(function (event) {

				if ( forbiddenKeys.indexOf( event.keyCode ) > -1 ) {
					return;
				}

				console.log('keyup');

				var query = _this.$input.val();

				if ( query !== '' && (event.which === 13 || event.keyCode === 13) ) {
					_this.wrapQuery();
					return;
				}

				timeout = setTimeout(function () {

					if ( query !== "" && query.length > 1 ) {
						console.log('fetchResults');
					 	_this.fetchResults( query );
					}
					else {
						_this.$responseArea.html('');
					}

				}, 600);

			})
			.keydown(function (event) {

				if ( forbiddenKeys.indexOf( event.keyCode ) > -1 ) {
					return;
				}

				console.log('keydown');
				 
				clearTimeout(timeout);

			});

		$('.ccl-c-search-bar').submit(function() {
			_this.wrapQuery();
		});
	};

	SearchAutocomplete.prototype.fetchResults = function( query ) {

		var _this = this,
			data = {
				action: 'load_search_results', // this should probably be able to do people & assets too (maybe DBs)
				query : query
			};
		
		$.post(searchAjax.ajaxurl, data, function (response) {
			var results = $.parseJSON(response),
				count = results.count,
				query = results.query,
				posts = results.posts;

			// Clear response area list items (update when Pattern Library view isn't necessary)
			_this.$responseArea.html('');
			_this.$resultsLink.remove();

			// Create list item for Worldcat search.
			var listItem =  '<a href="https://ccl.on.worldcat.org/external-search?sortKey=library&queryString=' + query + '" class="ccl-c-search-item ccl-is-large" role="listitem" target="_blank">' +
								'<span class="ccl-c-search-item__type">' +
									'<i class="ccl-b-icon-book" aria-hidden="true"></i>' +
									'<span class="ccl-c-search-item__type-text">WorldCat</span>' +
								'</span>' +
								'<span class="ccl-c-search-item__title\">' +
									'Search for &ldquo;' + query + '&rdquo; on WorldCat' +
								'</span>' +
								'<span class="ccl-c-search-item__cta">' +
									'<span class="ccl-u-color-school">Search <i class="ccl-b-icon-arrow-right" aria-hidden="true" style="vertical-align:middle"></i></span>' +
								'</span>' +
							'</a>';

			_this.$responseArea.append(listItem);

			// Create list items for each post in results
			if ( count > 0 ) {
				// Build results list
				posts.forEach(function (post) {
					console.log(post);

					var cta,
						target;

					switch( post["type"] ) {
						case 'Database':
							cta = 'View on Worldcat';
							target = '_blank';
							break;
						case 'Librarian':
							cta = 'Contact';
							target = '_blank';
							break;
						default:
							cta = 'View';
							target = '_self';
					}

					listItem =  '<a href="' + post["link"] + '" class="ccl-c-search-item" role="listitem" target="' + target + '">' +
									'<span class=\"ccl-c-search-item__type\">' +
										'<i class="ccl-b-icon-' + post["icon"] + '" aria-hidden="true"></i>' +
										'<span class="ccl-c-search-item__type-text">' + post["type"] + '</span>' +
									'</span>' +
									'<span class="ccl-c-search-item__title">' + post["title"] + '</span>' +
									'<span class="ccl-c-search-item__cta">' +
										'<span>' + cta + ' <i class="ccl-b-icon-arrow-right" aria-hidden="true" style="vertical-align:middle"></i></span>' +
									'</span>' +
								'</a>';

					_this.$responseArea.append(listItem);
				});
			}

			// Build results count/link
			listItem = '<div class="ccl-c-search-results__footer">' +
							'<a href="/?s=' + query + '" class="ccl-c-search-results__action">' +
								'View all ' + count + ' Results ' +
								'<i class="ccl-b-icon-arrow-right" aria-hidden="true"></i>' +
							'</a>' +
			           '</div>';

			_this.$responseArea.append(listItem);

		});

	};

	// If the user hits return or presses submit, the query will go directly to WorldCat. This function wraps
	// the string in the specified index value (keyword, author, title, etc)
	SearchAutocomplete.prototype.wrapQuery = function() {
		event.preventDefault();

		var searchIndex  = $('.ccl-c-search-index'),
			query        = $('#ccl-search'),
			wrappedQuery = searchIndex.val() + ':(' + query.val() + ')';
		
		query.val(wrappedQuery); // wrap the query in the two-letter code provided by the index dropdown

		document.catalogSearch.submit(); // direct search to WorldCat on return
	};

     $(document).ready(function(){
		// .each() will fail gracefully if no elements are found
		$('.ccl-c-search').each(function(){
			new SearchAutocomplete(this);
		 });
     });

} )( this, jQuery );
