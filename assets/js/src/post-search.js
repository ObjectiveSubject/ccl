/**
 *
 * Post Type Keyword search
 * 
 * On user input, fire request to search the database custom post type and return results to results panel
 */

( function( window, $ ) {
	'use strict';
	var document = window.document,
		ENTER = 13, TAB = 9, SHIFT = 16, CTRL = 17, ALT = 18, CAPS = 20, ESC = 27, LCMD = 91, RCMD = 92, LARR = 37, UARR = 38, RARR = 39, DARR = 40,
		forbiddenKeys = [ENTER, TAB, SHIFT, CTRL, ALT, CAPS, ESC, LCMD, RCMD, LARR, UARR, RARR, DARR];

    var postSearch = function(el){
        this.$el            = $( el );
        this.$form			= this.$el.find( '.ccl-c-post-search__form' );
        this.$postType      = this.$el.attr('data-search-type');
        this.$input         = this.$el.find('#ccl-c-post-search__input');
        this.$resultsList   = this.$el.find( '.ccl-c-post-search__results' );
        this.$inputTextbox	= this.$el.find( '.ccl-c-post-search__textbox' );
        
        this.init();
    };

    postSearch.prototype.init = function(){

        //AJAX event watching for user input and outputting suggested results
        var _this = this,
        timeout,
        query;
        

		//keyboard events for sending query to database
		this.$input
			.on('keyup keypress', function (event) {
			    
			    event.stopImmediatePropagation();
			    
				// clear any previous set timeout
				clearTimeout(timeout);

				// if key is forbidden, return
				if ( forbiddenKeys.indexOf( event.keyCode ) > -1 ) {
					return;
				}

				// get value of search input
				_this.query = _this.$input.val();
				//remove double quotations and other characters from string
				_this.query = _this.query.replace(/[^a-zA-Z0-9 -'.,]/g, "");

				// set a timeout function to update results once 600ms passes
				timeout = setTimeout(function () {

					if ( _this.query.length > 2 ) {

					 	_this.fetchPostResults( _this.query );
					 	
					 	
					}
					else {
					    _this.$resultsList.hide();
						//_this.$resultsList.html('');
					}

				}, 200);

			})
			.focus(function(){
				if ( _this.$input.val() !== '' ) {
					_this.$resultsList.show();
				}
				
			})
			.blur(function(event){
				//console.log(' input blurred');
				$(document).on('click', _onBlurredClick);

			});
		
		function _onBlurredClick(event) {
			
			if ( ! $.contains( _this.$el[0], event.target ) ) {
				_this.$resultsList.hide();
			}
			
			$(document).off('click', _onBlurredClick);

		}
		
		this.$form.on('submit', function( event ){
			event.preventDefault();

			// get value of search input
			// _this.query = _this.$input.val();
			// //remove double quotations and other characters from string
			// _this.query = _this.query.replace(/[^a-zA-Z0-9 -'.,]/g, "");
			console.log(_this.query);	
			
			
			if ( _this.query.length > 2 ) {

			 	_this.fetchPostResults( _this.query );
			 	
			 	
			}
			else {
			    _this.$resultsList.hide();
				//_this.$resultsList.html('');
			}			
			
		});
    };
    
    postSearch.prototype.fetchPostResults = function( query ){
		//send AJAX request to PHP file in WP
		var _this = this,
			data = {
				action      : 'retrieve_post_search_results', // this should probably be able to do people & assets too (maybe DBs)
				query       : query,
				postType    : _this.$postType
			};

		_this.$inputTextbox.addClass('ccl-is-loading');
		
		//console.log( _this );

		$.post(searchAjax.ajaxurl, data)
			.done(function (response) {
			    
				//function for processing results
				_this.processPostResults(response);
				
				//console.log( 'response', response );

			})
			.always(function(){

				_this.$inputTextbox.removeClass('ccl-is-loading');

			});        
    };
    
    postSearch.prototype.processPostResults = function( response ){
        var _this       = this,
		    results     = $.parseJSON(response),
		    resultCount	= results.count,
		    resultItems = $('<ul />').addClass('ccl-c-post-search__results-ul'),
            resultsClose = $('<li />')
            	.addClass('ccl-c-search--close-results')
            	.append( $('<div />').addClass('ccl-c-post-search__count ccl-u-weight-bold ccl-u-faded')  
        					.append( $('<i />').addClass('ccl-b-icon arrow-down') )
    						.append( $('<span />').html( '&nbsp;&nbsp' + resultCount + ' found') )
            		)
            	.append( $('<button />').addClass('ccl-b-close ccl-c-search--close__button').attr('arial-label', 'Close')
	            			.append( $('<i />').attr('aria-hidden', true ).addClass('ccl-b-icon close ccl-u-weight-bold ccl-u-font-size-sm') )
            		);


		    
		    if( results.posts.length === 0 ){
		    	this.$resultsList.html('');		    	
		        this.$resultsList.show().append( $('<div />').addClass('ccl-u-py-nudge ccl-u-weight-bold ccl-u-faded').html('Sorry, no databases found - try another search') );

		        return;
		    }
		   
		    this.$resultsList.html('');
		    
		    resultItems.append( resultsClose );
		    
		    $.each( results.posts, function( key, val ){
                    
                var renderItem = $('<li />')
                	.append(
                		$('<a />')
                			.attr({
			                   'href'   : val.post_link,
			                   'target' : '_blank',               				
                			})
                			.addClass('ccl-c-database-search__result-item')
                			.html( val.post_title + (val.post_alt_name ? '<div class="ccl-u-weight-normal ccl-u-ml-nudge ccl-u-font-size-sm">(' + val.post_alt_name + ')</div>' : '' ) )
                			.append( $('<span />')
	                					.html( 'Access&nbsp;&nbsp;' )
	                					.append( $('<i />')
	                								.addClass('ccl-b-icon arrow-right')
	                								.attr({
	                								'aria-hidden'	: true,
	                								'style'			: "vertical-align:middle"
	                								})
	                						) 
                				)
                		);
		    
		        resultItems.append( renderItem );
		        
		    } );
		    
		    this.$resultsList.append( resultItems ).show();
		    
			//cache the response button after its added to the DOM
			_this.$responseClose	= _this.$el.find('.ccl-c-search--close__button');		
			
			//click event to close the results page
			_this.$responseClose.on( 'click', function(event){
					//hide
					if( $( _this.$resultsList ).is(':visible') ){
						_this.$resultsList.hide();					
					}
			});		    
		    
		    
    };

    $(document).ready(function(){
        
        $('.ccl-c-post-search').each( function(){
            new postSearch(this);           
        });

    });

} )( this, jQuery );