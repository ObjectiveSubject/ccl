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
		this.$form = this.$el.find('form');
		this.$input = $(elem).find('#ccl-search');
		this.$responseArea = this.$el.find('.ccl-c-search-results__list');
		this.$responseItems = this.$el.find('.ccl-c-search-item');
		this.$resultsLink = this.$el.find('.ccl-c-search-results__footer');
		this.$searchIndex = this.$el.find('.ccl-c-search-index');
		this.$worldCatLink = null;

        this.init();
     };

     SearchAutocomplete.prototype.init = function () {
		var _this = this,
			timeout;

		this.$input
			.keyup(function (event) {

				// if key is forbidden, return
				if ( forbiddenKeys.indexOf( event.keyCode ) > -1 ) {
					return;
				}

				// get value of search input
				var query = _this.$input.val();

				// set a timeout function to update results once 600ms passes
				timeout = setTimeout(function () {

					if ( query !== "" && query.length > 1 ) {
					 	_this.fetchResults( query );
					}
					else {
						_this.$responseArea.html('');
					}

				}, 600);

			})
			.keydown(function (event) {

				// if key is forbidden, return
				if ( forbiddenKeys.indexOf( event.keyCode ) > -1 ) {
					return;
				}
				// stop the timeout function
				clearTimeout(timeout);

			});

		this.$searchIndex.change(function(){
			_this.onSearchIndexChange();
		});

		this.$form.submit(function(event) {
			event.preventDefault();
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

			// wrap query
			var queryString = _this.$searchIndex.val() + ':(' + query + ')';

			// Clear response area list items (update when Pattern Library view isn't necessary)
			_this.$responseArea.html('');
			_this.$resultsLink.remove();

			// Create list item for Worldcat search.
			var listItem =  '<a href="https://ccl.on.worldcat.org/external-search?sortKey=library&queryString=' + queryString + '" class="ccl-c-search-item ccl-is-large" role="listitem" target="_blank">' +
								'<span class="ccl-c-search-item__type">' +
									'<i class="ccl-b-icon book" aria-hidden="true"></i>' +
									'<span class="ccl-c-search-item__type-text">WorldCat</span>' +
								'</span>' +
								'<span class="ccl-c-search-item__title\">' +
									'Search for &ldquo;' + query + '&rdquo; on WorldCat' +
								'</span>' +
								'<span class="ccl-c-search-item__cta">' +
									'<span class="ccl-u-color-school">Search <i class="ccl-b-icon arrow-right" aria-hidden="true" style="vertical-align:middle"></i></span>' +
								'</span>' +
							'</a>';

			_this.$responseArea.append(listItem);

			// Create list items for each post in results
			if ( count > 0 ) {
				// Build results list
				posts.forEach(function (post) {
					// console.log(post);

					var cta,
						target;

					switch( post["type"] ) {
						case 'Book':
						case 'FAQ':
						case 'Research Guide':
						case 'Journal':
						case 'Database':
							cta = 'View';
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
										'<i class="ccl-b-icon ' + post["icon"] + '" aria-hidden="true"></i>' +
										'<span class="ccl-c-search-item__type-text">' + post["type"] + '</span>' +
									'</span>' +
									'<span class="ccl-c-search-item__title">' + post["title"] + '</span>' +
									'<span class="ccl-c-search-item__cta">' +
										'<span>' + cta + ' <i class="ccl-b-icon arrow-right" aria-hidden="true" style="vertical-align:middle"></i></span>' +
									'</span>' +
								'</a>';

					_this.$responseArea.append(listItem);
				});
			}

			// Build results count/link
			listItem = '<div class="ccl-c-search-results__footer">' +
							'<a href="/?s=' + query + '" class="ccl-c-search-results__action">' +
								'View all ' + count + ' Results ' +
								'<i class="ccl-b-icon arrow-right" aria-hidden="true"></i>' +
							'</a>' +
			           '</div>';

			_this.$responseArea.append(listItem);

		});

	};

	SearchAutocomplete.prototype.onSearchIndexChange = function() {

		var query = this.$input.val();

		if ( ! query.length ) {
			return;
		}

		this.fetchResults( query );
	};

	// If the user hits return or presses submit, the query will go directly to WorldCat. This function wraps
	// the string in the specified index value (keyword, author, title, etc)
	SearchAutocomplete.prototype.wrapQuery = function() {
		// event.preventDefault();

		var wrappedQuery = this.$searchIndex.val() + ':(' + this.$input.val() + ')';
		
		this.$input.val(wrappedQuery); // wrap the query in the two-letter code provided by the index dropdown

		/* TODO:
		 * FIX: Currently document.catalogSearch.submit() this is not a function ...
		 * ---------------------------------------- */
		// document.catalogSearch.submit(); // direct search to WorldCat on return
	};

     $(document).ready(function(){
		// .each() will fail gracefully if no elements are found
		$('.ccl-c-search').each(function(){
			new SearchAutocomplete(this);
		 });
     });

} )( this, jQuery );
