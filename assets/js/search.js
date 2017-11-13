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
		ENTER = 13, TAB = 9, SHIFT = 16, CTRL = 17, ALT = 18, CAPS = 20, ESC = 27, LCMD = 91, RCMD = 92, LARR = 37, UARR = 38, RARR = 39, DARR = 40,
		forbiddenKeys = [ENTER, TAB, SHIFT, CTRL, ALT, CAPS, ESC, LCMD, RCMD, LARR, UARR, RARR, DARR],
		indexNames = {
			ti: 'Title',
			kw: 'Keyword',
			au: 'Author',
			su: 'Subject'
		};
		
     var SearchAutocomplete = function(elem){
		
		this.$el = $(elem);
		this.$form = this.$el.find('form');
		this.$input = $(elem).find('#ccl-search');
		this.$response = this.$el.find('.ccl-c-search-results');
		this.$responseList = this.$el.find('.ccl-c-search-results__list');
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

				// clear any previous set timeout
				clearTimeout(timeout);

				// if key is forbidden, return
				if ( forbiddenKeys.indexOf( event.keyCode ) > -1 ) {
					return;
				}

				// get value of search input
				var query = _this.$input.val();

				// set a timeout function to update results once 600ms passes
				timeout = setTimeout(function () {

					if ( query.length > 1 ) {
						_this.$response.show();
					 	_this.fetchResults( query );
					}
					else {
						_this.$responseList.html('');
					}

				}, 1500);

			})
			.focus(function(){
				if ( _this.$input.val() != '' ) {
					_this.$response.show();
				}
			})
			.blur(function(){
				_this.$response.hide();
			});

		this.$searchIndex.change(function(){
			_this.onSearchIndexChange();
		});

		this.$form.submit(function(event) {

			event.preventDefault();

			var query = _this.$input.val();

			clearTimeout(timeout);

			if ( query.length > 1 ) {
				_this.$response.show();
				_this.fetchResults( query );
		   }
		});
	};

	SearchAutocomplete.prototype.fetchResults = function( query ) {

		var _this = this,
			data = {
				action: 'load_search_results', // this should probably be able to do people & assets too (maybe DBs)
				query : query
			};

		_this.$el.addClass('ccl-is-loading');

		$.post(searchAjax.ajaxurl, data)
			.done(function (response) {

				_this.fetchResultsDONE(response);

			})
			.always(function(){

				_this.$el.removeClass('ccl-is-loading');

			});

	};

	SearchAutocomplete.prototype.fetchResultsDONE = function( response ) {
		
		var _this = this,
			results = $.parseJSON(response),
			count = results.count,
			query = results.query,
			posts = results.posts,
			searchIndex = _this.$searchIndex.val(),
			searchIndexNicename = indexNames[searchIndex];

		// wrap query
		var queryString = searchIndex + ':(' + query + ')';

		// Clear response area list items (update when Pattern Library view isn't necessary)
		_this.$responseList.html('');
		_this.$resultsLink.remove();

		// Create list item for Worldcat search.
		var listItem =  '<a href="https://ccl.on.worldcat.org/external-search?sortKey=library&queryString=' + queryString + '" class="ccl-c-search-item ccl-is-large" role="listitem" target="_blank">' +
							'<span class="ccl-c-search-item__type">' +
								'<i class="ccl-b-icon book" aria-hidden="true"></i>' +
								'<span class="ccl-c-search-item__type-text">WorldCat</span>' +
							'</span>' +
							'<span class="ccl-c-search-item__title\">' +
								'Search by ' + searchIndexNicename + ' for &ldquo;' + query + '&rdquo; on WorldCat ' +
								'<i class="ccl-b-icon arrow-right" aria-hidden="true" style="vertical-align:middle"></i>' +
							'</span>' +
							'<span class="ccl-c-search-item__cta">' +
								'<i class="ccl-b-icon search" aria-hidden="true" style="vertical-align:middle"></i>' +
							'</span>' +
						'</a>';

		_this.$responseList.append(listItem);

		// Create list items for each post in results
		if ( count > 0 ) {

			// Create a separator between worldcat and other results
			var separator = '<span class="ccl-c-search-item ccl-is-separator" role="presentation">' +
								'<span class="ccl-c-search-item__title\">' +
									'<i class="ccl-b-icon arrow-down" aria-hidden="true"></i>' +
									' Other suggested resources for &ldquo;' + query + '&rdquo;' +
								'</span>' +
							'</span>';

			_this.$responseList.append(separator);


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

				_this.$responseList.append(listItem);
			});

			// Build results count/link
			listItem = '<div class="ccl-c-search-results__footer">' +
								'<a href="/?s=' + query + '" class="ccl-c-search-results__action">' +
									'View all ' + count + ' Results ' +
									'<i class="ccl-b-icon arrow-right" aria-hidden="true"></i>' +
								'</a>' +
						'</div>';

		_this.$responseList.append(listItem);
		}
	};

	SearchAutocomplete.prototype.onSearchIndexChange = function() {

		var query = this.$input.val();

		if ( ! query.length ) {
			return;
		}

		this.fetchResults( query );
	};

	// If the user hits return or presses submit, the query will go directly to WorldCat. 
	// This function wraps the string in the specified index value (keyword, author, title, etc)
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
