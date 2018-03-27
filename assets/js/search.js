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
		
		this.$el			= $(elem);
		this.$form			= this.$el.find('form');
		this.$input 		= $(elem).find('#ccl-search');
		this.$response		= this.$el.find('.ccl-c-search-results');
		this.$responseList	= this.$el.find('.ccl-c-search-results__list');
		this.$responseItems = this.$el.find('.ccl-c-search-item');
		this.$resultsLink	= this.$el.find('.ccl-c-search-results__footer');
		this.$searchIndex	= this.$el.find('.ccl-c-search-index');
		this.$indexContain	= this.$el.find('.ccl-c-search-index-container' );
		this.$searchScope	= this.$el.find('.ccl-c-search-location');
		this.$worldCatLink	= null;
		//check to see if this searchbox has livesearch enabled
		this.$activateLiveSearch	= $(this.$el).data('livesearch');
		

        this.init();
        
     };

    SearchAutocomplete.prototype.init = function () {
    	
    	if( this.$activateLiveSearch ){
			//if livesearch is enabled, then run the AJAX results
			this.isLiveSearch();
		
    	}else{
			//then simple generate generic search box requests
			this.isStaticSearch();
    	}
    	
	};
	
	SearchAutocomplete.prototype.toggleIndex	= function(){
		
		//watch for changes to the location - if not a WMS site, the remove index attribute
		var _this = this;
		
		this.$searchScope.on( 'change', function(){
			
			_this.locationType = _this.getLocID();				
			
			if( _this.locationType != 'wms' ){
				_this.$indexContain.fadeOut('fast');
			}else if( _this.locationType == 'wms' ){
				_this.$indexContain.fadeIn('fast');
			}
			
		} );
			
	};
	
	SearchAutocomplete.prototype.getLocID	= function(){
		//function to get the ID of location
		var _this = this;
		return $( _this.$searchScope ).find('option:selected').data('loc');
	};

	SearchAutocomplete.prototype.isLiveSearch = function(){
		//AJAX event watching for user input and outputting suggested results
		var _this = this,
			timeout;
		
		this.toggleIndex();
		
		//keyboard events for sending query to database
		this.$input
			.on('keyup keypress', function (event) {

				// clear any previous set timeout
				clearTimeout(timeout);

				// if key is forbidden, return
				if ( forbiddenKeys.indexOf( event.keyCode ) > -1 ) {
					return;
				}

				// get value of search input
				var query = _this.$input.val();
				//remove double quotations and other characters from string
				query = query.replace(/[^a-zA-Z0-9 -'.,]/g, "");
				//console.log(query);

				// set a timeout function to update results once 600ms passes
				timeout = setTimeout(function () {

					if ( query.length > 1 ) {

						//set this veriable here cuz we are going to need it later
						_this.locationType = _this.getLocID();						
						_this.$response.show();
					 	_this.fetchResults( query );
					 	
					 	
					}
					else {
						_this.$responseList.html('');
					}

				}, 300);

			})
			.focus(function(){
				if ( _this.$input.val() != '' ) {
					_this.$response.show();
				}
				
			})
			.blur(function(event){
				//console.log(' input blurred');
				$(document).on('click', _onBlurredClick);

			});
		
		function _onBlurredClick(event) {
			
			if ( ! $.contains( _this.$el[0], event.target ) ) {
				_this.$response.hide();
			}
			
			$(document).off('click', _onBlurredClick);

		}		

		//send query to database based on option change
		this.$searchIndex.add(this.$searchScope).change(function(){
			_this.onSearchIndexChange();
		});
		

		//on submit fire off catalog search to WMS
		this.$form.on('submit', function(event) {

			event.preventDefault();
			clearTimeout(timeout);
			
			//get search index and input value
			var searchIndex = _this.$searchIndex.val();
			var queryString = _this.$input.val();
			
			//check location type
			_this.locationType = _this.getLocID();		
			
			
			//setup array for constructSearchURL()
			var input_array = [];
			input_array['queryString']	= (_this.locationType === 'wms') ?  searchIndex + ":" + queryString : queryString;
			input_array['searchScope']	= _this.$searchScope.val();
			input_array['locationType']	= _this.locationType;

			//if query string has content, then run
			if ( queryString.length > 1 ) {
				_this.$response.show();
				//_this.fetchResults( queryString );

				var wmsConstructedUrl = _this.constructSearchURL(input_array);
				
				//console.log( wmsConstructedUrl );
				
				window.open(wmsConstructedUrl, '_blank');
		   }else{
		   	return;
		   }
		   
		});		
			
	};
	
	SearchAutocomplete.prototype.isStaticSearch = function(){
		//if static, no AJAX watching, in this case - just looking for submissions
		var _this = this;
		
		this.toggleIndex();
		
		//on submit fire off catalog search to WMS
		this.$form.on('submit', function(event) {

			event.preventDefault();
			
			//get search index and input value
			var searchIndex = _this.$searchIndex.val();
			var queryString = _this.$input.val();
			
			//check location type
			_this.locationType = _this.getLocID();
			
			//if this URL is for WMS, then append the searchindex to it, if not, then sent queryString only
			//setup array for constructSearchURL()
			var input_array = [];
			input_array['queryString']	= (_this.locationType === 'wms') ?  searchIndex + ":" + queryString : queryString;
			input_array['searchScope']	= _this.$searchScope.val();
			input_array['locationType']	= _this.locationType;

			//if query string has content, then run
			if ( queryString.length > 1 ) {

				var wmsConstructedUrl = _this.constructSearchURL(input_array);
				
				//console.log( wmsConstructedUrl );
				
				window.open(wmsConstructedUrl, '_blank');
		   }else{
		   	return;
		   }
		   
		});			
	};

	SearchAutocomplete.prototype.fetchResults = function( query ) {
		//send AJAX request to PHP file in WP
		var _this = this,
			data = {
				action: 'load_search_results', // this should probably be able to do people & assets too (maybe DBs)
				query : query
			};

		_this.$el.addClass('ccl-is-loading');

		$.post(searchAjax.ajaxurl, data)
			.done(function (response) {
				//function for processing results
				_this.fetchResultsDONE(response);

			})
			.always(function(){

				_this.$el.removeClass('ccl-is-loading');

			});

	};

	SearchAutocomplete.prototype.fetchResultsDONE = function( response ) {
		
		//Process the results from the API query and generate HTML for dispplay
		
		var _this = this,
			results = $.parseJSON(response),
			count = results.count,
			query = results.query,
			posts = results.posts,
			searchIndex =  $( _this.$indexContain ).is(':visible') ? _this.$searchIndex.val() : 'kw',
			searchIndexNicename = indexNames[searchIndex],
			searchScopeData = $( _this.$searchScope ),
			renderedResponse	= [];
			
		// wrap query
		//var queryString = searchIndex + ':' + query;
		
		//get wms_url input_array = [queryString, searchScope, locationType]
		var input_array = [];
		input_array['queryString']	= (_this.locationType === 'wms') ?  searchIndex + ":" + query : query;
		input_array['searchScope']	= _this.$searchScope.val();
		input_array['locationType']	= _this.locationType;
		
		//URL created!
		var wmsConstructedUrl = _this.constructSearchURL(input_array);

		// Clear response area list items (update when Pattern Library view isn't necessary)
		_this.$responseList.html('');
		_this.$resultsLink.remove();
		
		//add the close button
		var resultsClose = '<div class="ccl-c-search--close-results">' +
							'<button type="button" class="ccl-b-close ccl-c-search--close__button" aria-label="Close">' +
                            	'<span aria-hidden="true">×</span>' +
                            '</button>' +
                            '</div>';

		// Create list item for Worldcat search.
		var listItem =  '<a href="'+ wmsConstructedUrl +'" class="ccl-c-search-item ccl-is-large" role="listitem" target="_blank" style="border:none;">' +
							'<span class="ccl-c-search-item__type">' +
								'<i class="ccl-b-icon book" aria-hidden="true"></i>' +
								'<span class="ccl-c-search-item__type-text">WorldCat</span>' +
							'</span>' +
							'<span class=\"ccl-c-search-item__title\">' +
								'Search by ' + searchIndexNicename + ' for &ldquo;' + query + '&rdquo; in '+ searchScopeData.find('option:selected').text() +' ' +
								'<i class="ccl-b-icon arrow-right" aria-hidden="true" style="vertical-align:middle"></i>' +
							'</span>'+
						'</a>';

		
		//add HTML to the response array
		renderedResponse.push( resultsClose, listItem );

		// Create list items for each post in results
		if ( count > 0 ) {

			// Create a separator between worldcat and other results
			var separator = '<span class="ccl-c-search-item ccl-is-separator" role="presentation">' +
								'<span class=\"ccl-c-search-item__title\">' +
									'<i class="ccl-b-icon arrow-down" aria-hidden="true"></i>' +
									' Other suggested resources for &ldquo;' + query + '&rdquo;' +
								'</span>' +
							'</span>';

			//add HTML to response array
			renderedResponse.push( separator );

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
				
				//add HTML to the response array
				renderedResponse.push( listItem );
			});

			// Build results count/link
			listItem = '<div class="ccl-c-search-results__footer">' +
								'<a href="/?s=' + query + '" class="ccl-c-search-results__action">' +
									'View all ' + count + ' Results ' +
									'<i class="ccl-b-icon arrow-right" aria-hidden="true"></i>' +
								'</a>' +
						'</div>';

		//add HTML to the response array
		renderedResponse.push( listItem );
		
		}
		
		//append all response data all at once
		_this.$responseList.append( renderedResponse );
		
		//cache the response button after its added to the DOM
		_this.$responseClose	= _this.$el.find('.ccl-c-search--close__button');		
		
		//click event to close the results page
		_this.$responseClose.on( 'click', function(event){
				//hide
				if( $( _this.$response ).is(':visible') ){
					_this.$response.hide();					
				}
		});
		
		
	};

	SearchAutocomplete.prototype.onSearchIndexChange = function() {
		//on changes to the location or attribute index option, will watch and run fetchResults
		var query = this.$input.val();

		if ( ! query.length ) {
			return;
		}
		this.$response.show();		
		this.fetchResults( query );
	};
	
	SearchAutocomplete.prototype.constructSearchURL = function(input_array){
		//constructs URL with parameters from
		//input_array = [queryString, searchScope, locationType]
		
		//define variables
		var queryString, searchSrc, searchScopeKey, renderedURL, locationType;
		
		queryString 	= input_array['queryString'];
		searchSrc		= input_array['searchScope'];
		locationType	= input_array['locationType'];
		
		switch (locationType) {
			case 'wms':
				//check if search location is a scoped search location
				if( searchSrc.match(/::zs:/) ){
					searchScopeKey = 'subscope';
				}else{
					searchScopeKey = 'scope';
				}
	            //build the URL
	            var wms_params = {
	                sortKey         : 'BEST_MATCH',
	                databaseList    : '',
	                queryString     : queryString,
	                Facet           : '',
	                //scope added below
	                //format added below
	                format			: 'all',
	                database        :  'all',
	                author          : '',
	                year            : 'all',
	                yearFrom        : '',
	                yearTo          : '',
	                language        : 'all',
	                topic           : ''
	            };
	            
	            wms_params[searchScopeKey] = searchSrc;
	            
	            renderedURL = 'https://ccl.on.worldcat.org/search?' + $.param(wms_params);
		        renderedURL = renderedURL.replace( '%26', "&" );				
				break;
				
			case 'oac':
				
				renderedURL = 'http://www.oac.cdlib.org/search?query=' + queryString + '&institution=Claremont+Colleges';
				break;
				
			default:
				renderedURL = searchAjax.site_url + '/?s=' + queryString;
		}
            
            //console.log(wms_url);
            
        return renderedURL;

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
		$('.ccl-js-search-form').each(function(){
			new SearchAutocomplete(this);
		 });
     });

} )( this, jQuery );
