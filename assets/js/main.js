/*! CCL - v0.1.0
 * http://github.com/ObjectiveSubject/ccl
 * Copyright (c) 2018; * Licensed GPLv2+ */

/**
 * Global Variables. 
 */


(function ( $, window ) {
    'use strict';
    var document = window.document;
    
    if (!window.CCL) {
        window.CCL = {};
    }

    CCL.DURATION = 300;

    CCL.BREAKPOINT_SM = 500;
    CCL.BREAKPOINT_MD = 768;
    CCL.BREAKPOINT_LG = 1000;
    CCL.BREAKPOINT_XL = 1500;

    $(document).ready(function(){
        $('html').toggleClass('no-js js');
    });

})(jQuery, this);
/**
 * Reflow page elements. 
 * 
 * Enables animations/transitions on elements added to the page after the DOM has loaded.
 */


(function () {

    if (!window.CCL) {
        window.CCL = {};
    }

    CCL.reflow = function (element) {
        return element.offsetHeight;
    };

})();
/**
 * Get the Scrollbar width
 * Thanks to david walsh: https://davidwalsh.name/detect-scrollbar-width
 */

( function( window, $ ) {
    'use strict';
    var document = window.document;
    
    function getScrollWidth() {
        
        // Create the measurement node
        var scrollDiv = document.createElement("div");
        
        // position way the hell off screen
        $(scrollDiv).css({
            width: '100px',
            height: '100px',
            overflow: 'scroll',
            position: 'absolute',
            top: '-9999px',
        });

        $('body').append(scrollDiv);

        // Get the scrollbar width
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        // console.warn(scrollbarWidth); // Mac:  15

        // Delete the DIV 
        $(scrollDiv).remove();

        return scrollbarWidth;
    }
    
    if ( ! window.CCL ) {
        window.CCL = {};
    }

    CCL.getScrollWidth = getScrollWidth;
    CCL.SCROLLBARWIDTH = getScrollWidth();

} )( this, jQuery );

/**
 * .debounce() function
 * 
 * Source: https://davidwalsh.name/javascript-debounce-function
 */


(function(window) {

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    var throttle = function (func, wait, options) {
        var timeout, context, args, result;
        var previous = 0;
        if (!options) options = {};

        var later = function () {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };

        var throttled = function () {
            var now = new Date().getTime();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };

        throttled.cancel = function () {
            clearTimeout(timeout);
            previous = 0;
            timeout = context = args = null;
        };

        return throttled;
    };

    if (!window.CCL) {
        window.CCL = {};
    }

    window.CCL.throttle = throttle;

})(this);
/**
 * Accordions
 * 
 * Behavior for accordion components
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var Accordion = function(el){
        this.$el = $(el);
        this.$toggle = this.$el.children('.ccl-c-accordion__toggle');
        this.$content = this.$el.children('.ccl-c-accordion__content');
        this.init();
    };

    Accordion.prototype.init = function(){
        var _this = this;

        this.$toggle.on('click', function(e){
            e.preventDefault();
            _this.$content.slideToggle();
            _this.$el.toggleClass('ccl-is-open');
        });

    };

    $(document).ready(function(){
        $('.ccl-c-accordion').each(function(){
            new Accordion(this);
        });
    });

} )( this, jQuery );

/**
 * Alerts
 * 
 * Behavior for alerts
 */

(function (window, $) {
    'use strict';

    var document = window.document,
        DURATION = CCL.DURATION;

    var AlertDismiss = function($el){
        
        this.$el = $el;
        this.target = $el.parent();
        this.$target = $(this.target);
        
        this.init();
    };

    AlertDismiss.prototype.init = function(){
        
        var _this = this;
        
        _this.$target.animate( { opacity: 0 }, {
            duration: DURATION,
            complete: function(){
                _this.$target.slideUp( DURATION, function(){
                    _this.$target.remove();
                });
            }
        });

    };



    $(document).ready(function(){
        $(document).on( 'click', '[data-dismiss="alert"]', function(e){
            var dismissEl = $(e.target).closest('[data-dismiss="alert"]');
            new AlertDismiss(dismissEl);
        });
    });

})(this, jQuery);
/**
 * Carousels
 * 
 * Initialize and define behavior for carousels. 
 * Uses the Slick Slides jQuery plugin --> http://kenwheeler.github.io/slick/
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var Carousel = function(el){

        this.$el = $(el);
        this.globalDefaults = {
            mobileFirst: true,
            dotsClass: 'ccl-c-carousel__paging',
            infinite: false,
            dots: true,
            slidesToScroll: 1,
            variableWidth: true
        };

        this.init();

    };

    Carousel.prototype.init = function() {
        var data = this.$el.data(),
            options = data.options || {};
            
        options.responsive = [];

        if ( data.optionsSm ) {
            options.responsive.push({
                breakpoint: CCL.BREAKPOINT_SM, 
                settings: data.optionsSm
            });
        }
        if ( data.optionsMd ) {
            options.responsive.push({
                breakpoint: CCL.BREAKPOINT_MD, 
                settings: data.optionsMd
            });
        }
        if ( data.optionsLg ) {
            options.responsive.push({
                breakpoint: CCL.BREAKPOINT_LG, 
                settings: data.optionsLg
            });
        }
        if ( data.optionsXl ) {
            options.responsive.push({
                breakpoint: CCL.BREAKPOINT_XL, 
                settings: data.optionsXl
            });
        }

        options = $.extend( this.globalDefaults, options );

        var carousel = this.$el.slick(options),
            _this = this;

        carousel.on('beforeChange', function(event, slick, currentSlide, nextSlide){
            _this.$el.find('.slick-slide').removeClass('ccl-is-past');
            _this.$el.find('.slick-slide[data-slick-index="'+nextSlide+'"]').prevAll().addClass('ccl-is-past');
        });
    };

    $(document).ready(function(){
        $('.js-promo-carousel').each(function(){
            new Carousel(this);
        });
    });

} )( this, jQuery );

/**
 *
 * Database Filtering
 * 
 * Initializes and defines the behavior for filtering using JPList
 * https://jplist.com/documentation
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var databaseFilters = function(el){
        this.$el                = $( el );
        this.panelOptions       = $(el).find( '.ccl-c-database-filter__panel' );
        this.nameTextbox        = $( el ).find( '[data-control-type="textbox"]' );
        this.database_displayed = $( this.panelOptions ).find('.ccl-c-database__displayed');
        this.database_avail     = $( this.panelOptions ).find('.ccl-c-database__avail');
        this.databaseContainer  = this.$el.find('.ccl-c-database-filter__container');
        this.database_count     = $(el).find( '.ccl-c-database-filter__count' );
        this.databaseReset      = $(el).find( '.ccl-c-database-filter--reset' );
        this.runTimes           = 0;
        
        this.init();
    };

    databaseFilters.prototype.init = function(){
        var _this = this;
        this.$el.jplist({
            itemsBox        : '.ccl-c-database-filter__container', 
            itemPath        : '.ccl-c-database', 
            panelPath       : '.ccl-c-database-filter__panel',
            effect          : 'fade',
            duration        : 300,
            redrawCallback  : function( collection, $dataview, statuses ){
                
                //check for initial load
                if( _this.runTimes === 0 ){
                    _this.runTimes++;
                    return;                    
                }
                
                //get the values of the updated results, and the total number of databases we started with
                var updatedDatabases = $dataview.length;
                var defaultDatabases =  parseInt( _this.database_avail.text(), 10 );                
                
                //on occasion, the plugin gives us the wrong number of databases, this will prevent this from happening
                if( updatedDatabases > defaultDatabases  ){
                    updatedDatabases = defaultDatabases;
                    //hardReset();
                    //_this.databaseReset.show();
                }
                
                //update the number of shown databases
                _this.database_displayed.text( updatedDatabases );
                
                //visual feedback for updating databases
                _this.pulseTwice( _this.database_count );
                _this.pulseTwice( _this.databaseContainer );

               //if filters are used, the show the reset options
                if( updatedDatabases != defaultDatabases ){
                    _this.databaseReset.show();
                }else{
                    _this.databaseReset.hide();
                }

            }
        });
        
        
        _this.databaseReset.on('click', hardReset );
        //the reset function is not working
        //this is a bit of a hack, but we are using triggers here to do a hard reset
        function hardReset(){
            $('.ccl-c-database-filter__panel').find('input:checked').trigger('click');
            console.log( $('.ccl-c-database-filter__panel').find('input:checked') );
            $( _this.nameTextbox ).val('').trigger('keyup');
        }
    };
    
    databaseFilters.prototype.pulseTwice = function( el ){
        el.addClass('ccl-c-database-filter--on-change');
        el.on( "webkitAnimationEnd oanimationend msAnimationEnd animationend", function(){
            $(el).removeClass('ccl-c-database-filter--on-change');
        } );
    };

    $(document).ready(function(){
        
        $('.ccl-database-filter').each( function(){
            new databaseFilters( this );           
        } );

    });

} )( this, jQuery );

/**
 * Dropdowns
 * 
 * Initialize and control behavior for dropdown menus
 */

( function( window, $ ) {
	'use strict';
    var document = window.document,
        selector = {
            TOGGLE: '[data-toggle="dropdown"]',
        },
        className = {
            ACTIVE: 'ccl-is-active',
            CONTENT: 'ccl-c-dropdown__content'
        };

    var DropdownToggle = function(el){
        this.$toggle = $(el);
        this.$parent = this.$toggle.parent();
        
        var target = this.$toggle.data('target');

        this.$content = $( target );
        
        this.init();
    };

    DropdownToggle.prototype.init = function(){

        var _this = this;

        this.$toggle.click( function(event){
            event.preventDefault();
            event.stopPropagation();
            _this.toggle();
        });

        $(document).on( 'click', function(event){
            var hasActiveMenus = $( '.' + className.CONTENT + '.' + className.ACTIVE ).length;
            if ( hasActiveMenus ){
                _clearMenus();
            }
        });

    };

    DropdownToggle.prototype.toggle = function(){

        var isActive = this.$toggle.hasClass( className.ACTIVE );

        if ( isActive ) {
            return;
        }

        this.showContent();

    };

    DropdownToggle.prototype.showContent = function(){
        this.$toggle.attr('aria-expanded', 'true');
        this.$content.addClass( className.ACTIVE );
        this.$parent.addClass( className.ACTIVE );
    };

    DropdownToggle.prototype.hideMenu = function(){
        this.$toggle.attr('aria-expanded', 'false');
        this.$content.removeClass( className.ACTIVE );
        this.$parent.removeClass( className.ACTIVE );
    };

    function _clearMenus() {
        $('.ccl-c-dropdown, .ccl-c-dropdown__content').removeClass( className.ACTIVE );
        $( selector.TOGGLE ).attr('aria-expanded', 'false');
    }

    $(document).ready(function(){
        $( selector.TOGGLE ).each(function(){
            new DropdownToggle(this);
        });
    });

} )( this, jQuery );

/**
 * Header Menu Toggles
 * 
 * Controls behavior of menu toggles in the header
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var HeaderMenuToggle = function(el){
        
        this.$el = $(el);
        this.target = this.$el.data('target');
        this.$target = $(this.target);
        this.$parentMenu = this.$el.closest('.ccl-c-menu');
        this.$closeIcon = $('<span class="ccl-b-icon close" aria-hidden="true"></span>');

        this.init();
    };

    HeaderMenuToggle.prototype.init = function(){
        
        var that = this;

        this.$el.click(function(event){

            event.preventDefault();

            // if the target is already open
            if ( that.$target.hasClass('ccl-is-active') ) {

                // close target and remove active classes/elements
                that.$parentMenu.removeClass('ccl-has-active-item');
                that.$el.removeClass('ccl-is-active');
                that.$target.removeClass('ccl-is-active').fadeOut(CCL.DURATION);
                that.$closeIcon.remove();       

            } 

            // target is not open
            else {

                // close and reset all active menus
                $('.ccl-c-menu.ccl-has-active-item').each(function(){
                    $(this)
                        .removeClass('ccl-has-active-item')
                        .find('a.ccl-is-active').removeClass('ccl-is-active')
                        .find('.ccl-b-icon.close').remove();
                });
                
                // close and reset all active sub-menu containers
                $('.ccl-c-sub-menu-container.ccl-is-active').each(function(){
                    $(this).removeClass('ccl-is-active').fadeOut(CCL.DURATION);
                });

                // activate the selected target
                that.$parentMenu.addClass('ccl-has-active-item');
                that.$target.addClass('ccl-is-active').fadeIn(CCL.DURATION);
                // prepend close icon
                that.$closeIcon.prependTo(that.$el);
                CCL.reflow(that.$closeIcon[0]);
                that.$closeIcon.fadeIn(200);
                that.$el.addClass('ccl-is-active');

            }

        });

    };

    $(document).ready(function(){
        $('.js-toggle-header-menu').each(function(){
            new HeaderMenuToggle(this);
        });
    });

} )( this, jQuery );

/**
 * Modals
 * 
 * Behavior for modals. Based on Bootstrap's modals: https://getbootstrap.com/docs/4.0/components/modal/
 * 
 * Globals:
 * SCROLLBARWIDTH
 */

(function (window, $) {
    'use strict';

    var document = window.document,
        DURATION = 300;

    var ModalToggle = function(el){
        
        var $el = $(el);
        
        this.$el = $(el);
        this.target = $el.data('target');
        this.$target = $(this.target);
        
        this.init();
    };

    ModalToggle.prototype.init = function(){

        var _this = this; 

        _this.$el.on( 'click', function(e){
            e.preventDefault();

            if ( $(document.body).hasClass('ccl-modal-open') ) {
                _this.closeModal();
            } else {
                _this.showBackdrop(function(){
                    _this.showModal();
                });
            }
        });

    };

    ModalToggle.prototype.showBackdrop = function(callback){

        var backdrop = document.createElement('div');
        var $backdrop = $(backdrop);

        $backdrop.addClass('ccl-c-modal__backdrop');
        $backdrop.appendTo(document.body);
        
        CCL.reflow(backdrop);
        
        $backdrop.addClass('ccl-is-shown');

        $(document.body)
            .addClass('ccl-modal-open')
            .css( 'padding-right', CCL.SCROLLBARWIDTH );

        if ( callback ) {
            setTimeout( callback, DURATION );
        }
    };

    ModalToggle.prototype.showModal = function(){
        var _this = this;
        _this.$target.show( 0, function(){
            _this.$target.addClass('ccl-is-shown');
        });
    };

    ModalToggle.prototype.closeModal = function(){

        $('.ccl-c-modal').removeClass('ccl-is-shown');

        setTimeout( function(){
            
            $('.ccl-c-modal').hide();

            $('.ccl-c-modal__backdrop').removeClass('ccl-is-shown');

            setTimeout(function(){

                $('.ccl-c-modal__backdrop').remove();

                $(document.body)
                    .removeClass('ccl-modal-open')
                    .css( 'padding-right', '' );

            }, DURATION);

        }, DURATION ); 

    };



    $(document).ready(function(){
        $('[data-toggle="modal"]').each(function(){
            new ModalToggle(this);
        });
    });

})(this, jQuery);
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

		$.post(CCL.ajax_url, data)
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
/**
 * Quick Nav
 * 
 * Behavior for the quick nav
 */

( function( window, $ ) {
	'use strict';
    var $window = $(window),
        document = window.document;

    var QuickNav = function(el){

        this.$el = $(el);
        this.$subMenus = this.$el.find('.sub-menu');
        this.$scrollSpyItems = this.$el.find('.ccl-c-quick-nav__scrollspy span');
        this.$searchToggle = this.$el.find('.ccl-is-search-toggle');

        // set the toggle offset and account for the WP admin bar 
    
        if ( $('body').hasClass('admin-bar') && $('#wpadminbar').css('position') == 'fixed' ) {
            var adminBarHeight = $('#wpadminbar').outerHeight();
            this.toggleOffset = $('.ccl-c-user-nav').offset().top + $('.ccl-c-user-nav').outerHeight() - adminBarHeight;
        } else {
            this.toggleOffset = $('.ccl-c-user-nav').offset().top + $('.ccl-c-user-nav').outerHeight();
        }

        this.init();
    };

    QuickNav.prototype.init = function(){

        this.initScroll();
        this.initMenus();
        this.initScrollSpy();
        this.initSearch();

    };

    QuickNav.prototype.initScroll = function(){

        var that = this;
        
        $window.scroll( CCL.throttle( _onScroll, 50 ) );

        function _onScroll() {
            
            var scrollTop = $window.scrollTop();
    
            if ( scrollTop >= that.toggleOffset ) {
                that.$el.addClass('ccl-is-fixed');
            } else {
                that.$el.removeClass('ccl-is-fixed');
            }
    
        }

    };

    QuickNav.prototype.initMenus = function(){
        if ( ! this.$subMenus.length ) {
            return;
        }

        this.$subMenus.each(function(){
            var $subMenu = $(this),
                $toggle = $subMenu.siblings('a');

            $toggle.click(function(event){
                event.stopPropagation();
                event.preventDefault();

                if ( $(this).hasClass('ccl-is-active') ) {
                    $(this).removeClass('ccl-is-active ccl-u-color-school');
                    $subMenu.fadeOut(250);
                    return;
                }

                $('.ccl-c-quick-nav__menu a.ccl-is-active')
                    .removeClass('ccl-is-active ccl-u-color-school')
                    .siblings('.sub-menu')
                        .fadeOut(250);
                
                $(this).toggleClass('ccl-is-active ccl-u-color-school');
                $subMenu.fadeToggle(250);
            });
        });
    };

    QuickNav.prototype.initScrollSpy = function(){

        var that = this;

        this.$scrollSpyItems.each(function(){

            var $spyItem = $(this),
                target = $spyItem.data('target');

            $window.scroll( CCL.throttle( _onScroll, 100 ) );

            function _onScroll() {
             
                var scrollTop = $window.scrollTop(),
                    targetTop = $(target).offset().top - 150;

                if ( scrollTop >= targetTop ) {
                    that.$scrollSpyItems.removeClass('ccl-is-active');
                    $spyItem.addClass('ccl-is-active');
                } else {
                    $spyItem.removeClass('ccl-is-active');
                }

            }

        });

    };

    QuickNav.prototype.initSearch = function(){
        var that = this;
        this.$searchToggle.click(function(event){
            event.preventDefault();
            that.$el.toggleClass('ccl-search-active');
        });
    };

    $(document).ready(function(){
        $('.ccl-c-quick-nav').each(function(){
            new QuickNav(this);
        });
    });

} )( this, jQuery );

/**
 * Room Reservation
 * 
 * Handle room reservations
 */

( function( window, $ ) {
	'use strict';
    var document = window.document;

    var RoomResForm = function(el){

        var now = new Date();
        
        this.$el = $(el);
        this.$formContent = this.$el.find('.js-room-res-form-content').css({position:'relative'});
        this.$formResponse = this.$el.find('.js-room-res-form-response').css({position: 'absolute', top: '1rem', left: '1rem', opacity: 0});
        this.$formCancel = this.$el.find('.js-room-res-form-cancel');
        this.$formSubmit = this.$el.find('.js-room-res-form-submit');
        this.$formReload = this.$el.find('.js-room-res-form-reload');
        this.roomId = this.$el.data('resource-id');
        this.$dateSelect = this.$el.find('.js-room-date-select');
        this.dateYmd = this.$dateSelect.val();
        this.$roomSchedule = this.$el.find('.js-room-schedule');
        this.$currentDurationText = this.$el.find('.js-current-duration');
        this.$formNotification = $('<p class="ccl-c-alert"></p>');
        this.$resetSelectionBtn = this.$el.find('.js-reset-selection'); 
        this.$roomSlotInputs = null;
        this.selectedSlotInputs = [];
        this.maxSlots = 4;
        this.$maxTime = this.$el.find('.js-max-time');
        this.slotMinutes = 30;
        this.locale = "en-US";
        this.timeZone = {timeZone: "America/Los_Angeles"};

        this.init();

    };

    RoomResForm.prototype.init = function(){

        this.setLoading();

        this.updateScheduleData();

        this.setMaxTimeText();

        this.initDateEvents();
        
        this.initFormEvents();
    };

    RoomResForm.prototype.getSpaceAvailability = function(Ymd){

		var data = {
			action: 'get_room_info',
			ccl_nonce: CCL.nonce,
			availability: Ymd || '', // e.g. '2017-10-19'. empty string will get availability for current day
			room: this.roomId // room_id (space)
        };

        return $.post({
			url: CCL.ajax_url,
			data: data
		});

    };

    RoomResForm.prototype.getSpaceBookings = function(Ymd){
        
        var data = {
            action: 'get_bookings',
            ccl_nonce: CCL.nonce,
            date: Ymd || '', // e.g. '2017-10-19'. empty string will get bookings for current day
            room: this.roomId,
            limit: 50
        };

        return $.post({
            url: CCL.ajax_url,
            data: data
        });

    };

    RoomResForm.prototype.updateScheduleData = function() {
        
        var getSpacejqXHR = this.getSpaceAvailability(this.dateYmd);
        var getBookingsjqXHR = this.getSpaceBookings(this.dateYmd);
        var that = this;

        $.when(getSpacejqXHR, getBookingsjqXHR)
            .done(function(getSpace,getBookings){

                var spaceData = getSpace[0],
                    bookingsData = getBookings[0],
                    spacejqXHR = getSpace[2],
                    bookingsjqXHR = getBookings[2],
                    timeSlotsArray;

                // parse data to JSON if it's a string
                spaceData = ( typeof spaceData === 'string' ) ? JSON.parse( spaceData )[0] : spaceData[0];
                bookingsData = ( typeof bookingsData === 'string' ) ? JSON.parse( bookingsData ) : bookingsData;

                // merge bookings with availability
                if ( bookingsData.length ){

                    bookingsData.forEach(function(booking,i){

                        // calculate number of slots based on booking duration
                        var fromTime = new Date(booking.fromDate).getTime(),
                            toTime = new Date(booking.toDate).getTime(),
                            durationMinutes = (toTime - fromTime) / 1000 / 60,
                            slotCount = durationMinutes / that.slotMinutes;

                        spaceData.availability.push({
                            "from": booking.fromDate,
                            "to": booking.toDate,
                            "slotCount": slotCount,
                            "isBooked": true
                        });
                        
                    });
                    
                    // sort time slot objects by the "from" key
                    _sortByKey( spaceData.availability, 'from' );

                }

                // parse time slots and return an appropriate subset (only open to close hours)
                timeSlotsArray = that.parseSchedule(spaceData.availability);
                
                // build schedule HTML
                that.buildSchedule(timeSlotsArray);

                // Error handlers
                spacejqXHR.fail(function(err){
                    console.log(err);
                });
                bookingsjqXHR.fail(function(err){
                    console.log(err);
                });

            })
            .always(function(){
                that.unsetLoading();
                that.$resetSelectionBtn.hide();
            });

    };

    RoomResForm.prototype.buildSchedule = function(timeSlotsArray){

        var that = this,
            html = [];
            
        // construct HTML for each time slot
        timeSlotsArray.forEach(function(item, i){

            var from = new Date( item.from ),
                timeString,
                itemClass = '';

            if ( from.getMinutes() !== 0 ) {
                timeString = that.readableTime( from, 'h:m' );
            } else {
                timeString = that.readableTime( from, 'ha' );
            }

            if ( item.isBooked && item.hasOwnProperty('slotCount') ) {
                itemClass = 'ccl-is-occupied ccl-duration-' + item.slotCount;
            }
            
            // build selectable time slots
            html.push( that.buildTimeSlot({
                id: 'slot-' + that.roomId + '-' + i,
                from: item.from,
                to: item.to,
                timeString: timeString,
                class: itemClass
            }) );
        
        });

        this.selectedSlotInputs = [];

        this.$roomSchedule.html( html.join('') );

        this.$roomSlotInputs = this.$el.find('.ccl-c-room__slot [type="checkbox"]');

        this.setCurrentDurationText();

        this.initSlotEvents();

    };

    RoomResForm.prototype.buildTimeSlot = function(vars){
        
        if ( ! vars || typeof vars !== 'object' ) {
            return '';
        }

        var defaults = {
            class: '',
            id: '',
            disabled: '',
            from: '',
            to: '',
            timeString: ''
        };
        vars = $.extend(defaults, vars);

        var template = '' +
            '<div class="ccl-c-room__slot ' + vars.class + '">' +
                '<input type="checkbox" id="' + vars.id + '" name="' + vars.id + '" value="' + vars.from + '" data-to="' + vars.to + '" ' + vars.disabled + '/>' +
                '<label class="ccl-c-room__slot-label" for="' + vars.id + '">' +
                    vars.timeString +
                '</label>' +
            '</div>';

        return template;
    };

    RoomResForm.prototype.parseSchedule = function(scheduleArray){
        // returns the appropriate schedule for a given array of time slots
        
        var to = null,
            startEndIndexes = [], 
            start, end;

        // loop through array and pick out time gaps
        scheduleArray.forEach(function(item,i){
            if ( to && to !== item.from ) {
                startEndIndexes.push(i);
            }
            to = item.to;
        });

        // depending on number of gaps found, determine start and end indexes
        if ( startEndIndexes.length >= 2 ) {
            start = startEndIndexes[0];
            end = startEndIndexes[1];
        } else {
            start = 0;
            if ( startEndIndexes.length === 1 ) {
                end = startEndIndexes[0];
            } else {
                end = scheduleArray.length;
            }
        }
        
        // returned sliced portion of original schedule
        return scheduleArray.slice(start,end);
    };

    RoomResForm.prototype.initFormEvents = function(){

        var that = this;

        this.$resetSelectionBtn.click(function(event){
            event.preventDefault();
            $(that.selectedSlotInputs).each(function(i,input){
                $(input)
                    .prop('checked',false)
                    .change();
            });
            $('.ccl-c-room__slot').removeClass('ccl-is-disabled');
        });

        this.$el.submit(function(event){
            event.preventDefault();
            that.onSubmit();
        });

        this.$formReload.click(function(event){
            event.preventDefault();
            that.reloadForm();
        });

    };

    RoomResForm.prototype.initDateEvents = function(){

        var that = this;
        
        this.$dateSelect.change(function(){
            that.onDateChange();
        });

    };

    RoomResForm.prototype.onDateChange = function() {
        
        this.dateYmd = this.$dateSelect.val();
        
        this.setLoading();

        this.updateScheduleData();
        
    };
        
    RoomResForm.prototype.initSlotEvents = function(){
        var that = this;
        
        if ( this.$roomSlotInputs && this.$roomSlotInputs.length ){
            
            // input change event handler
            this.$roomSlotInputs.change(function(){
                var input = this;
                that.onSlotChange(input);
            });
            
        }
    };
    
    RoomResForm.prototype.onSlotChange = function(changedInput){
        
        // if input checked, add it to selected set
        if ( $(changedInput).prop('checked') ) {

            this.selectedSlotInputs.push(changedInput);
            $(changedInput).parent('.ccl-c-room__slot').addClass('ccl-is-checked');
   
        } 
        
        // if input unchecked, remove it from the selected set
        else { 

            var changedInputIndex = this.selectedSlotInputs.indexOf(changedInput);

            if ( changedInputIndex > -1 ) {
                this.selectedSlotInputs.splice( changedInputIndex, 1 );
            }
            $(changedInput).parent('.ccl-c-room__slot').removeClass('ccl-is-checked');

        }
        
        // update the slots which can now be clickable
        this.updateSelectableSlots();
        
        // update button states
        if ( this.selectedSlotInputs.length > 0 ) {
            this.$resetSelectionBtn.show();
            this.$formSubmit.attr('disabled',false);
        }
        else {
            this.$formSubmit.attr('disabled',true);
            this.$resetSelectionBtn.hide(); 
        }

        // update text
        this.setCurrentDurationText();

    };

    RoomResForm.prototype.updateSelectableSlots = function() {

        var that = this;

        // IF there are selected slots
        if ( that.selectedSlotInputs.length ){
        
            // first, sort the selected slots
            that.selectedSlotInputs.sort(function(a,b){
                return a.getAttribute('value') > b.getAttribute('value');
            });

            // grab the first and last selected slots
            var minInput = that.selectedSlotInputs[0],
                maxInput = that.selectedSlotInputs[that.selectedSlotInputs.length - 1];
            
            // get the indexes of the first and last slots from the $roomSlotInputs jQuery object
            var minIndex = that.$roomSlotInputs.index(minInput),
                maxIndex = that.$roomSlotInputs.index(maxInput);
            
            // calculate the min and max slot indexes which are selectable
            var minAllowable = maxIndex - that.maxSlots,
                maxAllowable = minIndex + that.maxSlots;
    
            // loop through room slots and update them accordingly
            that.$roomSlotInputs.each(function(i, input){
                
                // enables or disables depending on whether slot falls within range
                if ( minAllowable < i && i < maxAllowable ) {
                    that.enableSlot(input);
                } else {
                    that.disableSlot(input);
                }
                
                // add a class to the slots that fall between the min and max selected slots
                if ( minIndex < i && i < maxIndex ) {
                    $(input).parent().addClass('ccl-is-between');
                } else {
                    $(input).parent().removeClass('ccl-is-between');
                }
            });
        
        } 
        // ELSE no selected slots
        else {

            // enable all slots
            that.$roomSlotInputs.each(function(i, input){
                that.enableSlot(input);
            });

        }
        
    };

    RoomResForm.prototype.clearSlot = function(slot) {
        // slot can be either the checkbox input -OR- the checkbox's container

        var inputIndex;

        // if it's the checkbox.
        if ( $(slot).is('[type="checkbox"]') ) {
         
            this.enableSlot(slot);

            // get index of the input from selected set
            inputIndex = this.selectedSlotInputs.indexOf(slot);
            
        // if it's the container
        } else {

            var $input = $(slot).find('[type="checkbox"]');

            this.enableSlot($input[0]);

            // get index of the input from selected set
            inputIndex = this.selectedSlotInputs.indexOf( $input[0] );

        }

        // remove input from selected set
        this.selectedSlotInputs.splice( inputIndex, 1 );

    };

    RoomResForm.prototype.clearAllSlots = function() {

        var that = this;

        this.$resetSelectionBtn.hide();
        
        // Extend the selected inputs array to a new variable.
        // The selected inputs array changes with every clearSlot() call
        // so, best to loop through an unchanging array.
        var selectedInputs = $.extend( [], that.selectedSlotInputs );

        $(selectedInputs).each(function(i,input){
            that.clearSlot(input);
        });

    };

    RoomResForm.prototype.activateSlot = function(slot) {
        // slot can be either the checkbox -OR- the checkbox's container

        var slotIsCheckbox = $(slot).is('[type="checkbox"]'),
            $container = slotIsCheckbox ? $(slot).parent('.ccl-c-room__slot') : $(slot);

        // never set an occupied slot as active
        if ( $container.hasClass('ccl-is-occupied') ) {
            return;
        }

        if ( $(slot).is('[type="checkbox"]') ) {

            // if it's the checkbox.
         
            $(slot).prop('checked',true);
            $container.addClass('ccl-is-checked');
            
        } else {

            // if it's the container

            $container
                .addClass('ccl-is-checked')
                .find('[type="checkbox"]')
                    .prop('checked',true);

        }
    };

    RoomResForm.prototype.enableSlot = function(slot) {
        $(slot)
            .prop('disabled', false)
            .parent('.ccl-c-room__slot')
                .removeClass('ccl-is-disabled');
    };

    RoomResForm.prototype.disableSlot = function(slot) {
        $(slot)
            .prop('disabled', true)
            .parent('.ccl-c-room__slot')
                .addClass('ccl-is-disabled');
    };

    RoomResForm.prototype.setLoading = function(){
        this.$currentDurationText.text('Loading schedule...');
        this.$el.addClass('ccl-is-loading');
    };

    RoomResForm.prototype.unsetLoading = function(){
        this.$el.removeClass('ccl-is-loading');
    };

    RoomResForm.prototype.setCurrentDurationText = function() {

        var selection = $.extend([],this.selectedSlotInputs),
            sortedSelection = selection.sort(function(a,b){ 
                return a.value > b.value; 
            }),
            selectionLength = sortedSelection.length;
        
        if ( selectionLength > 0 ) {

            var time1Val = sortedSelection[0].value,
                readableTime1 = this.readableTime( new Date(time1Val) );

            var time2Val = ( selectionLength >= 2 ) ? sortedSelection[sortedSelection.length - 1].value : time1Val,
                time2T = new Date(time2Val).getTime() + ( this.slotMinutes * 60 * 1000 ),
                readableTime2 = this.readableTime( new Date(time2T) );

            this.$currentDurationText.text( 'From ' + readableTime1 + ' to ' + readableTime2 );

        }
        
        else {

            this.$currentDurationText.text('Please select available time slots');

        }

    };

    RoomResForm.prototype.setMaxTimeText = function(){
        var maxMinutes = this.maxSlots * this.slotMinutes,
            maxText;

        if ( maxMinutes > 60 ) {
            maxText = maxMinutes / 60 + ' hours';    
        } 
        else {
            maxText = maxMinutes + ' minutes';
        }

        this.$maxTime.text( maxText );
    };

    RoomResForm.prototype.readableTime = function( dateObj, format ) {
        
        var localeString = dateObj.toLocaleString( this.locale, this.timeZone ), // e.g. --> "11/7/2017, 4:38:33 AM"
            localeTime = localeString.split(", ")[1]; // "4:38:33 AM"

        var time = localeTime.split(' ')[0], // "4:38:33",
            timeObj = {
                a: localeTime.split(' ')[1].toLowerCase(), // (am or pm) --> "a"
                h: time.split(':')[0], // "4"
                m: time.split(':')[1], // "38"
            };

        if ( format && typeof format === 'string' ) {
            
            var formatArr = format.split(''),
                readableArr = [];
            
            for ( var i = 0; i < formatArr.length; i++ ) {
                if ( timeObj[formatArr[i]] ) {
                    readableArr.push(timeObj[formatArr[i]]);
                } else {
                    readableArr.push(formatArr[i]);
                }
            }

            return readableArr.join('');
            
        }

        return timeObj.h + ':' + timeObj.m + timeObj.a;
        
    };

    RoomResForm.prototype.onSubmit = function(event){

        if ( ! this.selectedSlotInputs.length ) {
            
            this.$formNotification
                .css('display','none')
                .addClass('ccl-is-error')
                .text('Please select a time for your reservation')
                .appendTo(this.$formContent)
                .slideDown(CCL.DURATION);            

            return;
        } 
        else {
            this.$formNotification.remove();
        }

        var that = this,
            sortedSelection = $.extend([], this.selectedSlotInputs).sort(function(a,b){
                return a.value > b.value;
            }),
            start = sortedSelection[0].value,
            end = ( sortedSelection.length > 1 ) ? $( sortedSelection[ sortedSelection.length - 1 ] ).data('to') : $( sortedSelection[0] ).data('to'),
            payload = {
                "iid":333,
                "start": start,
                "fname": this.$el[0].fname.value,
                "lname": this.$el[0].lname.value,
                "email": this.$el[0].email.value,
                "nickname": this.$el[0].nickname.value,
                "bookings":[
                    { 
                        "id": this.roomId,
                        "to": end
                    }
                ]
            };

        this.$el.addClass('ccl-is-submitting');
        this.$formCancel.prop('disabled',true);
        this.$formSubmit.text('Sending...').prop('disabled',true);

        var data = {
            action: 'request_booking',
            ccl_nonce: CCL.nonce,
            payload: payload
        };

        /* ------------------------------------
         * Make a request here to reserve space
         * ------------------------------------ */
        $.post({
                url: CCL.ajax_url,
                data: data
            })
            .done(function(response){
                _handleSubmitResponse(response);
            })
            .fail(function(error){
                console.log(error);
            })
            .always(function(){
                that.$el.removeClass('ccl-is-submitting');
            });

        function _handleSubmitResponse(response) {

            var responseHTML,
                responseObject = JSON.parse(response);

            if ( responseObject.booking_id ) {
                responseHTML =  ['<p class="ccl-h2 ccl-u-mt-0">Success!</p>',
                                '<p class="ccl-h4">Your booking ID is <span class="ccl-u-color-school">' + responseObject.booking_id + '</span></p>',
                                '<p class="ccl-h4">Please check your email to confirm your booking.</p>'];
            } else {
                responseHTML =  ['<p class="ccl-h3 ccl-u-mt-0">Sorry, but we couldn\'t process your reservation.</p>','<p class="ccl-h4">Errors:</p>'];
                $(responseObject.errors).each(function(i, error){
                    responseHTML.push('<p class="ccl-c-alert ccl-is-error">' + error + '</p>');
                });
                responseHTML.push('<p class="ccl-h4">Please talk to your nearest librarian for help.</p>');
            }

            that.$formCancel.prop('disabled',false).text('Close');
            that.$formSubmit.hide();
            that.$formReload.show();

            that.$formContent.animate({opacity: 0}, CCL.DURATION);
            that.$formResponse
                .delay(CCL.DURATION)
                .animate({opacity: 1}, CCL.DURATION)
                .html(responseHTML);
            that.$formContent
                .delay(CCL.DURATION)
                .animate({height: that.$formResponse.height() + 'px' }, CCL.DURATION)
                .css({zIndex: '-1'});

            that.$el.removeClass('ccl-is-submitting');

        }

    };

    RoomResForm.prototype.reloadForm = function(){
        
        this.$formCancel.text('Cancel');
        this.$formSubmit.text('Submit').prop('disabled',false).show();
        this.$formReload.hide();
        
        this.clearAllSlots();

        this.$formResponse
            .animate({opacity: 0}, CCL.DURATION)
            .delay(CCL.DURATION)
            .html('');
        this.$formContent
            .delay(CCL.DURATION)
            .css({ height: '', zIndex: '' })
            .animate({opacity: 1}, CCL.DURATION);

        this.setLoading();
        
        this.updateScheduleData();
    };

    // ------------------------------------------------------- //
    // Helpers

    function _sortByKey( arr, key, order ) {
        function sortASC(a,b) {
            if (a[key] < b[key]){
                return -1;
            }
            if (a[key] > b[key]){
                return 1;
            }
            return 0;
        }
        function sortDESC(a,b) {
            if (a[key] > b[key]){
                return -1;
            }
            if (a[key] < b[key]){
                return 1;
            }
            return 0;
        }
        if ( 'DESC' === order ) {
            arr.sort(sortDESC);
        } else {
            arr.sort(sortASC);
        }
    }

    // ------------------------------------------------------- //

    $(document).ready(function(){
        $('.js-room-res-form').each(function(){
            new RoomResForm(this);
        });
    });

} )( this, jQuery );

/**
 * Searchbox Behavior
 */

( function( window, $ ) {
	'use strict';
	 
	// Global variables
	var document = window.document,
		ENTER = 13, TAB = 9, SHIFT = 16, CTRL = 17, ALT = 18, CAPS = 20, ESC = 27, LCMD = 91, RCMD = 92, LARR = 37, UARR = 38, RARR = 39, DARR = 40,
		forbiddenKeys = [ENTER, TAB, SHIFT, CTRL, ALT, CAPS, ESC, LCMD, RCMD, LARR, UARR, RARR, DARR],
		indexNames = {
			ti: 'Title',
			kw: 'Keyword',
			au: 'Author',
			su: 'Subject'
		};

	// Extend jQuery selector
	$.extend($.expr[':'], {
		focusable: function(el, index, selector){
			return $(el).is('a, button, :input, [tabindex], select');
		}
	});
		
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
		this.locationType	=  $( this.$searchScope ).find('option:selected').data('loc');	
		
		//lightbox elements
		this.$lightbox = null;
		this.lightboxIsOn = false;

        this.init();
        
    };

    SearchAutocomplete.prototype.init = function () {
    	
    	
    	if( this.$activateLiveSearch ){
			//if livesearch is enabled, then run the AJAX results
			this.initLiveSearch();
		
    	}else{
			//then simple generate generic search box requests
			this.initStaticSearch();
    	}
    	
	};
	
	SearchAutocomplete.prototype.toggleIndex = function(){
		
		//watch for changes to the location - if not a WMS site, the remove index attribute
		var that = this;
		
		this.$searchScope.on( 'change', function(){
			
			that.getLocID();				
			
			if( that.locationType != 'wms' ){
				that.$indexContain
					.addClass('ccl-search-index-fade')
					.fadeOut(250);
			}else if( that.locationType == 'wms' ){
				that.$indexContain
					.fadeIn(250)
					.removeClass('ccl-search-index-fade');

			}
			
		} );
			
	};
	
	SearchAutocomplete.prototype.getLocID = function(){
		//function to get the ID of location
		var that = this;
		that.locationType = $( that.$searchScope ).find('option:selected').attr('data-loc');
		
		//console.log( that.locationType );
	};

	SearchAutocomplete.prototype.initLiveSearch = function(){

		//AJAX event watching for user input and outputting suggested results
		var that = this,
			timeout;
		
		this.initLightBox();
		this.toggleIndex();
		
		//keyboard events for sending query to database
		this.$input
			.on('keyup', function (event) {

				// clear any previous set timeout
				clearTimeout(that.timeout);

				// if key is forbidden, return
				if ( forbiddenKeys.indexOf( event.keyCode ) > -1 ) {
					return;
				}

				// get value of search input
				var query = that.$input.val();
				//remove double quotations and other characters from string
				query = query.replace(/[^a-zA-Z0-9 -'.,]/g, "");
				//console.log(query);

				// set a timeout function to update results once 600ms passes
				that.timeout = setTimeout(function () {

					if ( query.length > 1 ) {
						
						//set this veriable here cuz we are going to need it later
						that.getLocID();						
						that.$response.show();
					 	that.fetchResults( query );
					 	
					 	
					}
					else {
						that.$responseList.html('');
					}

				}, 200);

			})
			.focus(function(){
				if ( that.$input.val() !== '' ) {
					that.$response.show();
				}
			})
			.blur(function(event){
				$(document).on('click', _onBlurredClick);
			});
		
		function _onBlurredClick(event) {
			
			if ( ! $.contains( that.$el[0], event.target ) ) {
				that.$response.hide();
			}
						
			$(document).off('click', _onBlurredClick);

		}		

		//send query to database based on option change
		this.$searchIndex.add(this.$searchScope).change(function(){
			that.onSearchIndexChange();
		});
		
		//on submit fire off catalog search to WMS
		this.$form.on('submit',  {that: this } , that.handleSubmit );
			
	};
	
	SearchAutocomplete.prototype.initStaticSearch = function(){
		//if static, no AJAX watching, in this case - just looking for submissions
		var that = this;
		
		this.toggleIndex();
		
		//on submit fire off catalog search to WMS
		this.$form.on('submit',  {that: this } , that.handleSubmit );		
		
	};
	
	SearchAutocomplete.prototype.handleSubmit = function(event){
		var that = event.data.that;
			event.preventDefault();
			
			if(that.$activateLiveSearch){
				clearTimeout(that.timeout);				
			}
			
			//get search index and input value
			var searchIndex = that.$searchIndex.val();
			var queryString = that.$input.val();
			
			//check location type
			that.getLocID();
			
			//if this URL is for WMS, then append the searchindex to it, if not, then sent queryString only
			//setup array for constructSearchURL()
			var inputObject = {};
			inputObject.queryString	= (that.locationType === 'wms') ?  searchIndex + ":" + queryString : queryString;
			inputObject.searchScope	= that.$searchScope.val();

			//if query string has content, then run
			if ( queryString.length > 1 ) {

				var wmsConstructedUrl = that.constructSearchURL(inputObject);
				
				//console.log( wmsConstructedUrl );
				
				if( that.locationType === 'wp_ccl' ){
					
					window.open(wmsConstructedUrl, '_self');
					
					$(window).unload( function(){

						that.$searchScope.prop( 'selectedIndex', 0 );
					});					
					
				}else{
					
					window.open(wmsConstructedUrl, '_blank');					
				}
				
		   }else{
		   	
		   	return;
		   	
		   }		
	};

	SearchAutocomplete.prototype.fetchResults = function( query ) {
		//send AJAX request to PHP file in WP
		var that = this,
			data = {
				s : query,
			};

		that.$el.addClass('ccl-is-loading');

		$.get(CCL.api.search, data)
			.done(function (response) {
				that.handleResponse(response);
			})
			.always(function(){
				that.$el.removeClass('ccl-is-loading');
			});

	};

	SearchAutocomplete.prototype.handleResponse = function( response ) {
		
		//Process the results from the API query and generate HTML for dispplay
		
		var that = this,
			results = response,
			count = results.count,
			query = results.query,
			posts = results.posts,
			searchIndex =  $( that.$indexContain ).is(':visible') ? that.$searchIndex.val() : 'kw',
			searchIndexNicename = indexNames[searchIndex],
			searchScopeData = $( that.$searchScope ),
			renderedResponse	= [];
			
		// wrap query
		//var queryString = searchIndex + ':' + query;
		
		//get wms_url inputObject = {queryString, searchScope, locationType}
		var inputObject = {};
		inputObject.queryString	= (that.locationType === 'wms') ?  searchIndex + ":" + query : query;
		inputObject.searchScope	= that.$searchScope.val();
		
		//URL created!
		var wmsConstructedUrl = that.constructSearchURL(inputObject);

		// Clear response area list items (update when Pattern Library view isn't necessary)
		that.$responseList.html('');
		that.$resultsLink.remove();
		
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

				switch( post.type ) {
					case 'Book':
					case 'FAQ':
					case 'Research Guide':
					case 'Journal':
					case 'Database':
						cta = 'View';
						target = '_blank';
						break;
					case 'Librarian':
					case 'Staff':
						cta = 'Contact';
						target = '_blank';
						break;
					default:
						cta = 'View';
						target = '_self';
				}

				listItem =  '<a href="' + post.link + '" class="ccl-c-search-item" role="listitem" target="' + target + '">' +
								'<span class=\"ccl-c-search-item__type\">' +
									'<i class="ccl-b-icon ' + post.icon + '" aria-hidden="true"></i>' +
									'<span class="ccl-c-search-item__type-text">' + post.type + '</span>' +
								'</span>' +
								'<span class="ccl-c-search-item__title">' + post.title + '</span>' +
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
		that.$responseList.append( renderedResponse );
		
		//cache the response button after its added to the DOM
		that.$responseClose	= that.$el.find('.ccl-c-search--close__button');		
		
		//click event to close the results page
		that.$responseClose.on( 'click', function(event){
				//hide
				if( $( that.$response ).is(':visible') ){
					that.$response.hide();	
					that.destroyLightBox();
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
	
	SearchAutocomplete.prototype.constructSearchURL = function(inputObject){
		//constructs URL with parameters from
		//inputObject = { queryString, searchScope, SearchLocation }
		
		//define variables
		var queryString, searchSrc, searchScopeKey, renderedURL;
		
		queryString 	= inputObject.queryString;
		searchSrc		= inputObject.searchScope;

		
		switch ( this.locationType) {
			case 'wms':
				//check if search location is a scoped search location
				if( searchSrc.match(/::zs:/) ){
					searchScopeKey = 'subscope';
				}else{
					searchScopeKey = 'scope';
				}
	            //build the URL
	            var wms_params = {
	                sortKey         : 'LIBRARY',
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
				renderedURL = CCL.site_url + '?s=' + queryString;
		}
            
            //console.log(wms_url);
            
        return renderedURL;

	};
	
	SearchAutocomplete.prototype.initLightBox = function() {

		var that = this,
			destroyTimeout = 0;
		
		this.$el
			.on( 'focusin', ':focusable', function(event){

				event.stopPropagation();

				// clear timeout because we're still inside the searchbox
				if ( destroyTimeout ) {
					clearTimeout(destroyTimeout);
				}

				if ( ! that.lightboxIsOn ){

					that.createLightBox();

				}
				
			})
			.on( 'focusout', ':focusable', function(event){
				
				// set a short timeout so that other functions can check and clear if need be
				destroyTimeout = setTimeout(function(){

					that.destroyLightBox();
					that.$response.hide();

				}, 100);

			});

		this.$response
			.on( 'click', function(event){

				// clear destroy timeout because we're still inside the searchbox
				if ( destroyTimeout ) {
					clearTimeout(destroyTimeout);
				}

			});

	};

	SearchAutocomplete.prototype.createLightBox = function() {

		this.lightboxIsOn = true;
					
		this.$el.addClass('is-lightboxed');
		this.$lightbox = $('<div class="ccl-c-lightbox">').appendTo('body');
		var searchBoxTop = this.$el.offset().top - 128 + 'px';
		var targetTop = $(event.target).offset().top - 128 + 'px';
		
		// prevents the scrollbar from jumping if the user is tabbing below the fold
		// if the searchbox and the target are the same - then it will jump, if not, 
		// then it won't jump
		if ( searchBoxTop == targetTop ){
			$('html, body').animate({ scrollTop: searchBoxTop } );						
		}		

	};

	SearchAutocomplete.prototype.destroyLightBox = function() {
		if ( this.$lightbox ) {
			this.$lightbox.remove();
			this.$lightbox = null;
			this.$el.removeClass('is-lightboxed');
			this.lightboxIsOn = false;
			
		}
	};

    $(document).ready(function(){
		// .each() will fail gracefully if no elements are found
		$('.ccl-js-search-form').each(function(){
			new SearchAutocomplete(this);
		});
    });

} )( this, jQuery );

/**
 *
 * SlideToggle
 * 
 *  tabs for hiding and showing additional content
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var slideToggleList = function(el){
        this.$el                = $(el);
        this.$slideToggleLink   = this.$el.find('.ccl-c-slideToggle__title');
        this.$toggleContainer   = this.$el.find('.ccl-c-slideToggle__container');
        
        this.init();
    };

    slideToggleList.prototype.init = function(){
        var _that = this;
        
        this.$slideToggleLink.on('click', function(evt){
            evt.preventDefault();
            //get the target to be opened
            var clickItem = $(this);
            //get the data target that corresponds to this link
            var target_content = clickItem.attr('data-toggleTitle');
            
            //add the active class so we can do stylings and transitions
            clickItem
                .toggleClass('ccl-is-active')
                .siblings()
                .removeClass('ccl-is-active');
                
            //toggle aria
            if (clickItem.attr( 'aria-expanded') === 'true') {
                    $(clickItem).attr( 'aria-expanded', 'false');
                } else {
                    $(clickItem).attr( 'aria-expanded', 'true');
            }
            
            //locate the target element and slidetoggle it
            _that.$toggleContainer
                .find( '[data-toggleTarget="' + target_content + '"]' )
                .slideToggle('fast');
                //toggle aria-expanded
                
            //toggle aria
            if (_that.$toggleContainer.attr( 'aria-expanded') === 'true') {
                    $(_that.$toggleContainer).attr( 'aria-expanded', 'false');
                } else {
                    $(_that.$toggleContainer).attr( 'aria-expanded', 'true');
                }
        });
    };

    $(document).ready(function(){
        $('.ccl-c-slideToggle').each( function(){
            new slideToggleList(this);            
        });

    });

} )( this, jQuery );

/**
 * Smooth Scrolling
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    $(document).ready(function(){

        $('.js-smooth-scroll').on('click', function(e){

            e.preventDefault();
            
            //set to blur
            $(this).blur();              
            
            var target = $(this).data('target') || $(this).attr('href'),
                $target = $(target),
                scrollOffset = 0;

            $('.ccl-c-quick-nav').each(function(){
                scrollOffset += $(this).outerHeight();
            });

            if ( $target.length ) {
                var targetTop = $target.offset().top;
                
                $('html, body').animate( { 
                    'scrollTop': targetTop - scrollOffset }, 
                    800 );
            
            }

           
            
        });

    });

} )( this, jQuery );

/**
 * Stickies
 * 
 * Behaviour for sticky elements.
 */

( function( window, $ ) {
	'use strict';
    var document = window.document,
        $window = $(window),
        className = {
            isFixed: 'ccl-is-fixed'
        };

    var Sticky = function(el){

        // variables
        var $el = $(el),
            height = $el.outerHeight(),
            offset = $el.offset(),
            options = $el.data('sticky'),
            wrapper = $('<div class="js-sticky-wrapper"></div>').css({ height: height + 'px' });

        var defaultOptions = {
            offset: 0
        };

        options = $.extend( defaultOptions, options );

        // wrap element
        $el.wrap( wrapper );

        // scroll listener
        $window.scroll( CCL.throttle( _onScroll, 100 ) );

        // on scroll
        function _onScroll() {
            
            var scrollTop = $window.scrollTop() + options.offset;
    
            if ( scrollTop >= offset.top ) {
                $el.addClass( className.isFixed );
            } else {
                $el.removeClass( className.isFixed );
            }
    
        }

        return this;

    };

    $(document).ready(function(){
        $('.js-is-sticky').each(function(){
            new Sticky(this);
        });
    });

} )( this, jQuery );

/**
 * Toggle Schools
 * 
 * Behavior for school toggles
 */

(function (window, $) {
    'use strict';

    var document = window.document,
        initSchool = $('html').data('school');

    var SchoolSelect = function(el){
        
        this.$select = $(el);
        
        this.init();
    };

    SchoolSelect.prototype.init = function(){

        var school = getCookie( 'ccl-school' );

        if ( initSchool ) {

            this.$select
                .find( 'option[value="' + school + '"]' )
                .attr( 'selected', 'selected' );

        	if ( school ) {
        		 $('html').attr('data-school', school);
			}

		}

        this.$select.change(function(event){
            $('html').attr( 'data-school', event.target.value );

            eraseCookie( 'ccl-school' );
            setCookie( 'ccl-school', event.target.value, 7);
        });
    };

    // Cookie functions lifted from Stack Overflow for now
    // https://stackoverflow.com/questions/14573223/set-cookie-and-get-cookie-with-javascript
	function setCookie(name, value, days) {
		var expires = "";
		if (days) {
			var date = new Date();
			date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
			expires = "; expires=" + date.toUTCString();
		}
		document.cookie = name + "=" + (value || "") + expires + "; path=/";
	}

	function getCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) === ' ') c = c.substring(1, c.length);
			if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
		}
		return null;
	}

	function eraseCookie(name) {
		document.cookie = name + '=; Max-Age=-99999999;';
	}

    $(document).ready(function(){
        $('[data-toggle="school"]').each(function(){
            new SchoolSelect(this);
        });
    });

})(this, jQuery);
/**
 * Tooltips
 * 
 * Behavior for tooltips
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var Tooltip = function(el){
        this.$el = $(el);
        this.content = this.$el.attr('title');
        this.$tooltip = $('<div id="ccl-current-tooltip" class="ccl-c-tooltip ccl-is-top" role="tooltip">'+
                            '<div class="ccl-c-tooltip__arrow"></div>'+
                            '<div class="ccl-c-tooltip__inner">'+
                                this.content +
                            '</div>'+
                          '</div>');
        
        this.init();
    };

    Tooltip.prototype.init = function(){
        
        var _this = this;

        this.$el.hover(function(e){

            // mouseover

            _this.$el.attr('title', '');
            _this.$el.attr('aria-describedby', 'ccl-current-tooltip');
            _this.$tooltip.appendTo(document.body);

            CCL.reflow(_this.$tooltip[0]);

            var offset = _this.$el.offset(),
                width  = _this.$el.outerWidth(),
                tooltipHeight = _this.$tooltip.outerHeight();

            _this.$tooltip.css({
                top: (offset.top - tooltipHeight) + 'px',
                left: (offset.left + (width/2)) + 'px'
            });

            _this.$tooltip.addClass('ccl-is-shown');

        }, function(e){ 

            //mouseout

            _this.$el.attr('title', _this.content);
            _this.$el.attr('aria-describedby', '');
            _this.$tooltip.removeClass('ccl-is-shown');
            _this.$tooltip.remove();

        });

    };

    $(document).ready(function(){
        $('[data-toggle="tooltip"]').each(function(){
            new Tooltip(this);
        });
    });

} )( this, jQuery );

/**
 * Wayfinding
 * 
 * Controls interface for looking up call number locations
 */

( function( window, $ ) {
	'use strict';
    var document = window.document,
        tabs, wayfinder;
    
    var Tabs = function(el) {

        var _this = this;

        this.$el = $(el);
        this.$tabs = this.$el.find('.ccl-c-tab');
        this.$tabContents = $('.ccl-c-tab__content');
        

        this.$tabs.each(function(){
            var $tab = $(this);
            $tab.click(function(e){
                e.preventDefault();
                var target = $tab.data('target');
                // _this.$tabContents.removeClass('ccl-is-active');
                // _this.$tabContents.filter(target).addClass('ccl-is-active');
                _this.setActive(target);
            });
        });

        return this;
    };

    Tabs.prototype.setActive = function(target){
        this.$tabs.removeClass('ccl-is-active');
        this.$tabs.filter('[href="'+target+'"]').addClass('ccl-is-active');
        this.$tabContents.removeClass('ccl-is-active');
        this.$tabContents.filter(target).addClass('ccl-is-active');
    };

    var Wayfinder = function(el){
        this.$el = $(el);
        this.callNumbers = {};
        this.$form = this.$el.find('#call-number-search');
        this.$input = this.$el.find('#call-num-input');
        this.$submit = this.$el.find('#call-num-submit');
        this.$marquee = this.$el.find('.ccl-c-wayfinder__marquee');
        this.$callNum = this.$el.find('.ccl-c-wayfinder__call-num');
        this.$wing = this.$el.find('.ccl-c-wayfinder__wing');
        this.$floor = this.$el.find('.ccl-c-wayfinder__floor');
        this.$subject = this.$el.find('.ccl-c-wayfinder__subject');
        this.error = {
            get: '<div class="ccl-c-alert ccl-is-error ccl-wayfinder__error"><button type="button" class="ccl-b-close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><span class="ccl-b-icon alert" aria-hidden="true"></span> There was an error fetching call numbers.</div>',
            find: '<div class="ccl-c-alert ccl-is-error ccl-wayfinder__error"><button type="button" class="ccl-b-close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><span class="ccl-b-icon alert" aria-hidden="true"></span> Could not find that call number. Please try again.</div>'
        };
        this.$errorBox = $('.ccl-error-box');

        var _this = this;

        $.getJSON( CCL.assets + 'js/call-numbers.json' )
            .done(function(data){
                _this.callNumbers = data;
                _this.init();
            })
            .fail(function(err){
                console.log(err);
                this.$errorBox.append( this.error.get );
            });

        return this;
    };

    Wayfinder.prototype.init = function() {
        
        var _this = this;

        this.$el.addClass('ccl-app-active');

        this.$input
            .keyup(function () {
                var query = $(this).val();
                
                if ( query === "" ) {
                    _this.$submit.attr('disabled', true);
                    _this.$marquee.hide();
                    _this.reset();                
                } else {
                    _this.$submit.attr('disabled', false);
                }

            });

        this.$form.submit(function(e){
            e.preventDefault();

            _this.reset();

            var query = _this.$input.val();

            $('.ccl-wayfinder__error').remove();
            _this.$marquee.show();
            _this.$callNum.text(query);
            _this.findRoom( query );
        });

    };

    Wayfinder.prototype.getCallKey = function(callNum) {
        callNum = callNum.replace(/ /g, '');
        
        var key,
            callKeys = Object.keys(this.callNumbers);

        if ( callKeys.length === 0 ){
            return;
        }

        callKeys.forEach(function(k){
            var k_noSpaces = k.replace(/ /g, '');

            if ( callNum >= k_noSpaces ) {
                key = k;
            }
        });

        return key;
    };

    Wayfinder.prototype.findRoom = function(query) {

        query = query.toUpperCase();
        
        var that = this,
            callKey = this.getCallKey(query),
            callData = {},
            floorId, roomId;

        if ( ! callKey ) {
            this.throwFindError();
            return;
        }

        $('html, body').animate({ scrollTop: $('.ccl-c-search').offset().top });
        
        callData = this.callNumbers[callKey];

        this.$floor.text( callData.floor );
        this.$wing.text( callData.wing );
        this.$subject.text( callData.subject );

        floorId = callData.floor_int;
        roomId = callData.room_int; // will be integer OR array

        // Make floor/room active

        this.$el.find('a[href="#floor-'+floorId+'"]').addClass('ccl-is-active');

        if ( typeof roomId !== 'number' ) {
            // if roomId is array
            roomId.forEach(function(id){
                that.$el.find('#room-'+floorId+'-'+id).addClass('ccl-is-active');
            });
        } else {
            // if roomId is number
            this.$el.find('#room-'+floorId+'-'+roomId).addClass('ccl-is-active');
        }

        // Set corresponding active floor tab

        tabs.setActive( '#floor-' + floorId );
        
    };

    Wayfinder.prototype.reset = function() {
        this.$el.find('a[href*="#floor-"]').removeClass('ccl-is-active');
        this.$el.find('.ccl-c-floor__room').removeClass('ccl-is-active');
    };

    Wayfinder.prototype.throwFindError = function(){
        this.$el.find('a[href*="#floor-"]').removeClass('ccl-is-active');
        this.$el.find('.ccl-c-floor__room').removeClass('ccl-is-active');
        this.$floor.text( '' );
        this.$wing.text( '' );
        this.$subject.text( '' );
        this.$errorBox.append( this.error.find );
    };

    $(document).ready(function(){
        $('.ccl-js-tabs').each(function(){
            tabs = new Tabs(this);
        });
        $('.ccl-js-wayfinder').each(function(){
            wayfinder = new Wayfinder(this);
        });
    });

} )( this, jQuery );

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkYXRhYmFzZS1maWx0ZXJzLmpzIiwiZHJvcGRvd25zLmpzIiwiaGVhZGVyLW1lbnUtdG9nZ2xlcy5qcyIsIm1vZGFscy5qcyIsInBvc3Qtc2VhcmNoLmpzIiwicXVpY2stbmF2LmpzIiwicm9vbS1yZXMuanMiLCJzZWFyY2guanMiLCJzbGlkZS10b2dnbGUtbGlzdC5qcyIsInNtb290aC1zY3JvbGwuanMiLCJzdGlja2llcy5qcyIsInRvZ2dsZS1zY2hvb2xzLmpzIiwidG9vbHRpcHMuanMiLCJ3YXlmaW5kaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzV1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1aEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEdsb2JhbCBWYXJpYWJsZXMuIFxuICovXG5cblxuKGZ1bmN0aW9uICggJCwgd2luZG93ICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wuRFVSQVRJT04gPSAzMDA7XG5cbiAgICBDQ0wuQlJFQUtQT0lOVF9TTSA9IDUwMDtcbiAgICBDQ0wuQlJFQUtQT0lOVF9NRCA9IDc2ODtcbiAgICBDQ0wuQlJFQUtQT0lOVF9MRyA9IDEwMDA7XG4gICAgQ0NMLkJSRUFLUE9JTlRfWEwgPSAxNTAwO1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnaHRtbCcpLnRvZ2dsZUNsYXNzKCduby1qcyBqcycpO1xuICAgIH0pO1xuXG59KShqUXVlcnksIHRoaXMpOyIsIi8qKlxuICogUmVmbG93IHBhZ2UgZWxlbWVudHMuIFxuICogXG4gKiBFbmFibGVzIGFuaW1hdGlvbnMvdHJhbnNpdGlvbnMgb24gZWxlbWVudHMgYWRkZWQgdG8gdGhlIHBhZ2UgYWZ0ZXIgdGhlIERPTSBoYXMgbG9hZGVkLlxuICovXG5cblxuKGZ1bmN0aW9uICgpIHtcblxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLnJlZmxvdyA9IGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiBlbGVtZW50Lm9mZnNldEhlaWdodDtcbiAgICB9O1xuXG59KSgpOyIsIi8qKlxuICogR2V0IHRoZSBTY3JvbGxiYXIgd2lkdGhcbiAqIFRoYW5rcyB0byBkYXZpZCB3YWxzaDogaHR0cHM6Ly9kYXZpZHdhbHNoLm5hbWUvZGV0ZWN0LXNjcm9sbGJhci13aWR0aFxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuICAgIFxuICAgIGZ1bmN0aW9uIGdldFNjcm9sbFdpZHRoKCkge1xuICAgICAgICBcbiAgICAgICAgLy8gQ3JlYXRlIHRoZSBtZWFzdXJlbWVudCBub2RlXG4gICAgICAgIHZhciBzY3JvbGxEaXYgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICBcbiAgICAgICAgLy8gcG9zaXRpb24gd2F5IHRoZSBoZWxsIG9mZiBzY3JlZW5cbiAgICAgICAgJChzY3JvbGxEaXYpLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogJzEwMHB4JyxcbiAgICAgICAgICAgIGhlaWdodDogJzEwMHB4JyxcbiAgICAgICAgICAgIG92ZXJmbG93OiAnc2Nyb2xsJyxcbiAgICAgICAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgICAgICAgdG9wOiAnLTk5OTlweCcsXG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJ2JvZHknKS5hcHBlbmQoc2Nyb2xsRGl2KTtcblxuICAgICAgICAvLyBHZXQgdGhlIHNjcm9sbGJhciB3aWR0aFxuICAgICAgICB2YXIgc2Nyb2xsYmFyV2lkdGggPSBzY3JvbGxEaXYub2Zmc2V0V2lkdGggLSBzY3JvbGxEaXYuY2xpZW50V2lkdGg7XG4gICAgICAgIC8vIGNvbnNvbGUud2FybihzY3JvbGxiYXJXaWR0aCk7IC8vIE1hYzogIDE1XG5cbiAgICAgICAgLy8gRGVsZXRlIHRoZSBESVYgXG4gICAgICAgICQoc2Nyb2xsRGl2KS5yZW1vdmUoKTtcblxuICAgICAgICByZXR1cm4gc2Nyb2xsYmFyV2lkdGg7XG4gICAgfVxuICAgIFxuICAgIGlmICggISB3aW5kb3cuQ0NMICkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLmdldFNjcm9sbFdpZHRoID0gZ2V0U2Nyb2xsV2lkdGg7XG4gICAgQ0NMLlNDUk9MTEJBUldJRFRIID0gZ2V0U2Nyb2xsV2lkdGgoKTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogLmRlYm91bmNlKCkgZnVuY3Rpb25cbiAqIFxuICogU291cmNlOiBodHRwczovL2Rhdmlkd2Fsc2gubmFtZS9qYXZhc2NyaXB0LWRlYm91bmNlLWZ1bmN0aW9uXG4gKi9cblxuXG4oZnVuY3Rpb24od2luZG93KSB7XG5cbiAgICAvLyBSZXR1cm5zIGEgZnVuY3Rpb24sIHRoYXQsIHdoZW4gaW52b2tlZCwgd2lsbCBvbmx5IGJlIHRyaWdnZXJlZCBhdCBtb3N0IG9uY2VcbiAgICAvLyBkdXJpbmcgYSBnaXZlbiB3aW5kb3cgb2YgdGltZS4gTm9ybWFsbHksIHRoZSB0aHJvdHRsZWQgZnVuY3Rpb24gd2lsbCBydW5cbiAgICAvLyBhcyBtdWNoIGFzIGl0IGNhbiwgd2l0aG91dCBldmVyIGdvaW5nIG1vcmUgdGhhbiBvbmNlIHBlciBgd2FpdGAgZHVyYXRpb247XG4gICAgLy8gYnV0IGlmIHlvdSdkIGxpa2UgdG8gZGlzYWJsZSB0aGUgZXhlY3V0aW9uIG9uIHRoZSBsZWFkaW5nIGVkZ2UsIHBhc3NcbiAgICAvLyBge2xlYWRpbmc6IGZhbHNlfWAuIFRvIGRpc2FibGUgZXhlY3V0aW9uIG9uIHRoZSB0cmFpbGluZyBlZGdlLCBkaXR0by5cbiAgICB2YXIgdGhyb3R0bGUgPSBmdW5jdGlvbiAoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICAgICAgICB2YXIgdGltZW91dCwgY29udGV4dCwgYXJncywgcmVzdWx0O1xuICAgICAgICB2YXIgcHJldmlvdXMgPSAwO1xuICAgICAgICBpZiAoIW9wdGlvbnMpIG9wdGlvbnMgPSB7fTtcblxuICAgICAgICB2YXIgbGF0ZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcmV2aW91cyA9IG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UgPyAwIDogbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICB2YXIgdGhyb3R0bGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgaWYgKCFwcmV2aW91cyAmJiBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlKSBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgICAgIHZhciByZW1haW5pbmcgPSB3YWl0IC0gKG5vdyAtIHByZXZpb3VzKTtcbiAgICAgICAgICAgIGNvbnRleHQgPSB0aGlzO1xuICAgICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICAgICAgICAgIGlmIChyZW1haW5pbmcgPD0gMCB8fCByZW1haW5pbmcgPiB3YWl0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRpbWVvdXQpIHtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcHJldmlvdXMgPSBub3c7XG4gICAgICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRpbWVvdXQpIGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoIXRpbWVvdXQgJiYgb3B0aW9ucy50cmFpbGluZyAhPT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0ID0gc2V0VGltZW91dChsYXRlciwgcmVtYWluaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhyb3R0bGVkLmNhbmNlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgIHByZXZpb3VzID0gMDtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHRocm90dGxlZDtcbiAgICB9O1xuXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICB3aW5kb3cuQ0NMLnRocm90dGxlID0gdGhyb3R0bGU7XG5cbn0pKHRoaXMpOyIsIi8qKlxuICogQWNjb3JkaW9uc1xuICogXG4gKiBCZWhhdmlvciBmb3IgYWNjb3JkaW9uIGNvbXBvbmVudHNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIEFjY29yZGlvbiA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdG9nZ2xlID0gdGhpcy4kZWwuY2hpbGRyZW4oJy5jY2wtYy1hY2NvcmRpb25fX3RvZ2dsZScpO1xuICAgICAgICB0aGlzLiRjb250ZW50ID0gdGhpcy4kZWwuY2hpbGRyZW4oJy5jY2wtYy1hY2NvcmRpb25fX2NvbnRlbnQnKTtcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEFjY29yZGlvbi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kdG9nZ2xlLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgX3RoaXMuJGNvbnRlbnQuc2xpZGVUb2dnbGUoKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC50b2dnbGVDbGFzcygnY2NsLWlzLW9wZW4nKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1jLWFjY29yZGlvbicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBBY2NvcmRpb24odGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBBbGVydHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIGFsZXJ0c1xuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBEVVJBVElPTiA9IENDTC5EVVJBVElPTjtcblxuICAgIHZhciBBbGVydERpc21pc3MgPSBmdW5jdGlvbigkZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkZWw7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gJGVsLnBhcmVudCgpO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBBbGVydERpc21pc3MucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIF90aGlzLiR0YXJnZXQuYW5pbWF0ZSggeyBvcGFjaXR5OiAwIH0sIHtcbiAgICAgICAgICAgIGR1cmF0aW9uOiBEVVJBVElPTixcbiAgICAgICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIF90aGlzLiR0YXJnZXQuc2xpZGVVcCggRFVSQVRJT04sIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiR0YXJnZXQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuXG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKGRvY3VtZW50KS5vbiggJ2NsaWNrJywgJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXScsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgdmFyIGRpc21pc3NFbCA9ICQoZS50YXJnZXQpLmNsb3Nlc3QoJ1tkYXRhLWRpc21pc3M9XCJhbGVydFwiXScpO1xuICAgICAgICAgICAgbmV3IEFsZXJ0RGlzbWlzcyhkaXNtaXNzRWwpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIENhcm91c2Vsc1xuICogXG4gKiBJbml0aWFsaXplIGFuZCBkZWZpbmUgYmVoYXZpb3IgZm9yIGNhcm91c2Vscy4gXG4gKiBVc2VzIHRoZSBTbGljayBTbGlkZXMgalF1ZXJ5IHBsdWdpbiAtLT4gaHR0cDovL2tlbndoZWVsZXIuZ2l0aHViLmlvL3NsaWNrL1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgQ2Fyb3VzZWwgPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5nbG9iYWxEZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIG1vYmlsZUZpcnN0OiB0cnVlLFxuICAgICAgICAgICAgZG90c0NsYXNzOiAnY2NsLWMtY2Fyb3VzZWxfX3BhZ2luZycsXG4gICAgICAgICAgICBpbmZpbml0ZTogZmFsc2UsXG4gICAgICAgICAgICBkb3RzOiB0cnVlLFxuICAgICAgICAgICAgc2xpZGVzVG9TY3JvbGw6IDEsXG4gICAgICAgICAgICB2YXJpYWJsZVdpZHRoOiB0cnVlXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB9O1xuXG4gICAgQ2Fyb3VzZWwucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLiRlbC5kYXRhKCksXG4gICAgICAgICAgICBvcHRpb25zID0gZGF0YS5vcHRpb25zIHx8IHt9O1xuICAgICAgICAgICAgXG4gICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZSA9IFtdO1xuXG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zU20gKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfU00sIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNTbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNNZCApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9NRCwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc01kXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc0xnICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX0xHLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zTGdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zWGwgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfWEwsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNYbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoIHRoaXMuZ2xvYmFsRGVmYXVsdHMsIG9wdGlvbnMgKTtcblxuICAgICAgICB2YXIgY2Fyb3VzZWwgPSB0aGlzLiRlbC5zbGljayhvcHRpb25zKSxcbiAgICAgICAgICAgIF90aGlzID0gdGhpcztcblxuICAgICAgICBjYXJvdXNlbC5vbignYmVmb3JlQ2hhbmdlJywgZnVuY3Rpb24oZXZlbnQsIHNsaWNrLCBjdXJyZW50U2xpZGUsIG5leHRTbGlkZSl7XG4gICAgICAgICAgICBfdGhpcy4kZWwuZmluZCgnLnNsaWNrLXNsaWRlJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1wYXN0Jyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuZmluZCgnLnNsaWNrLXNsaWRlW2RhdGEtc2xpY2staW5kZXg9XCInK25leHRTbGlkZSsnXCJdJykucHJldkFsbCgpLmFkZENsYXNzKCdjY2wtaXMtcGFzdCcpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmpzLXByb21vLWNhcm91c2VsJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IENhcm91c2VsKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICpcbiAqIERhdGFiYXNlIEZpbHRlcmluZ1xuICogXG4gKiBJbml0aWFsaXplcyBhbmQgZGVmaW5lcyB0aGUgYmVoYXZpb3IgZm9yIGZpbHRlcmluZyB1c2luZyBKUExpc3RcbiAqIGh0dHBzOi8vanBsaXN0LmNvbS9kb2N1bWVudGF0aW9uXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBkYXRhYmFzZUZpbHRlcnMgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsICAgICAgICAgICAgICAgID0gJCggZWwgKTtcbiAgICAgICAgdGhpcy5wYW5lbE9wdGlvbnMgICAgICAgPSAkKGVsKS5maW5kKCAnLmNjbC1jLWRhdGFiYXNlLWZpbHRlcl9fcGFuZWwnICk7XG4gICAgICAgIHRoaXMubmFtZVRleHRib3ggICAgICAgID0gJCggZWwgKS5maW5kKCAnW2RhdGEtY29udHJvbC10eXBlPVwidGV4dGJveFwiXScgKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZV9kaXNwbGF5ZWQgPSAkKCB0aGlzLnBhbmVsT3B0aW9ucyApLmZpbmQoJy5jY2wtYy1kYXRhYmFzZV9fZGlzcGxheWVkJyk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2VfYXZhaWwgICAgID0gJCggdGhpcy5wYW5lbE9wdGlvbnMgKS5maW5kKCcuY2NsLWMtZGF0YWJhc2VfX2F2YWlsJyk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2VDb250YWluZXIgID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLWRhdGFiYXNlLWZpbHRlcl9fY29udGFpbmVyJyk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2VfY291bnQgICAgID0gJChlbCkuZmluZCggJy5jY2wtYy1kYXRhYmFzZS1maWx0ZXJfX2NvdW50JyApO1xuICAgICAgICB0aGlzLmRhdGFiYXNlUmVzZXQgICAgICA9ICQoZWwpLmZpbmQoICcuY2NsLWMtZGF0YWJhc2UtZmlsdGVyLS1yZXNldCcgKTtcbiAgICAgICAgdGhpcy5ydW5UaW1lcyAgICAgICAgICAgPSAwO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIGRhdGFiYXNlRmlsdGVycy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuJGVsLmpwbGlzdCh7XG4gICAgICAgICAgICBpdGVtc0JveCAgICAgICAgOiAnLmNjbC1jLWRhdGFiYXNlLWZpbHRlcl9fY29udGFpbmVyJywgXG4gICAgICAgICAgICBpdGVtUGF0aCAgICAgICAgOiAnLmNjbC1jLWRhdGFiYXNlJywgXG4gICAgICAgICAgICBwYW5lbFBhdGggICAgICAgOiAnLmNjbC1jLWRhdGFiYXNlLWZpbHRlcl9fcGFuZWwnLFxuICAgICAgICAgICAgZWZmZWN0ICAgICAgICAgIDogJ2ZhZGUnLFxuICAgICAgICAgICAgZHVyYXRpb24gICAgICAgIDogMzAwLFxuICAgICAgICAgICAgcmVkcmF3Q2FsbGJhY2sgIDogZnVuY3Rpb24oIGNvbGxlY3Rpb24sICRkYXRhdmlldywgc3RhdHVzZXMgKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL2NoZWNrIGZvciBpbml0aWFsIGxvYWRcbiAgICAgICAgICAgICAgICBpZiggX3RoaXMucnVuVGltZXMgPT09IDAgKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucnVuVGltZXMrKztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuOyAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vZ2V0IHRoZSB2YWx1ZXMgb2YgdGhlIHVwZGF0ZWQgcmVzdWx0cywgYW5kIHRoZSB0b3RhbCBudW1iZXIgb2YgZGF0YWJhc2VzIHdlIHN0YXJ0ZWQgd2l0aFxuICAgICAgICAgICAgICAgIHZhciB1cGRhdGVkRGF0YWJhc2VzID0gJGRhdGF2aWV3Lmxlbmd0aDtcbiAgICAgICAgICAgICAgICB2YXIgZGVmYXVsdERhdGFiYXNlcyA9ICBwYXJzZUludCggX3RoaXMuZGF0YWJhc2VfYXZhaWwudGV4dCgpLCAxMCApOyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL29uIG9jY2FzaW9uLCB0aGUgcGx1Z2luIGdpdmVzIHVzIHRoZSB3cm9uZyBudW1iZXIgb2YgZGF0YWJhc2VzLCB0aGlzIHdpbGwgcHJldmVudCB0aGlzIGZyb20gaGFwcGVuaW5nXG4gICAgICAgICAgICAgICAgaWYoIHVwZGF0ZWREYXRhYmFzZXMgPiBkZWZhdWx0RGF0YWJhc2VzICApe1xuICAgICAgICAgICAgICAgICAgICB1cGRhdGVkRGF0YWJhc2VzID0gZGVmYXVsdERhdGFiYXNlcztcbiAgICAgICAgICAgICAgICAgICAgLy9oYXJkUmVzZXQoKTtcbiAgICAgICAgICAgICAgICAgICAgLy9fdGhpcy5kYXRhYmFzZVJlc2V0LnNob3coKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy91cGRhdGUgdGhlIG51bWJlciBvZiBzaG93biBkYXRhYmFzZXNcbiAgICAgICAgICAgICAgICBfdGhpcy5kYXRhYmFzZV9kaXNwbGF5ZWQudGV4dCggdXBkYXRlZERhdGFiYXNlcyApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vdmlzdWFsIGZlZWRiYWNrIGZvciB1cGRhdGluZyBkYXRhYmFzZXNcbiAgICAgICAgICAgICAgICBfdGhpcy5wdWxzZVR3aWNlKCBfdGhpcy5kYXRhYmFzZV9jb3VudCApO1xuICAgICAgICAgICAgICAgIF90aGlzLnB1bHNlVHdpY2UoIF90aGlzLmRhdGFiYXNlQ29udGFpbmVyICk7XG5cbiAgICAgICAgICAgICAgIC8vaWYgZmlsdGVycyBhcmUgdXNlZCwgdGhlIHNob3cgdGhlIHJlc2V0IG9wdGlvbnNcbiAgICAgICAgICAgICAgICBpZiggdXBkYXRlZERhdGFiYXNlcyAhPSBkZWZhdWx0RGF0YWJhc2VzICl7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRhdGFiYXNlUmVzZXQuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5kYXRhYmFzZVJlc2V0LmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICBcbiAgICAgICAgX3RoaXMuZGF0YWJhc2VSZXNldC5vbignY2xpY2snLCBoYXJkUmVzZXQgKTtcbiAgICAgICAgLy90aGUgcmVzZXQgZnVuY3Rpb24gaXMgbm90IHdvcmtpbmdcbiAgICAgICAgLy90aGlzIGlzIGEgYml0IG9mIGEgaGFjaywgYnV0IHdlIGFyZSB1c2luZyB0cmlnZ2VycyBoZXJlIHRvIGRvIGEgaGFyZCByZXNldFxuICAgICAgICBmdW5jdGlvbiBoYXJkUmVzZXQoKXtcbiAgICAgICAgICAgICQoJy5jY2wtYy1kYXRhYmFzZS1maWx0ZXJfX3BhbmVsJykuZmluZCgnaW5wdXQ6Y2hlY2tlZCcpLnRyaWdnZXIoJ2NsaWNrJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggJCgnLmNjbC1jLWRhdGFiYXNlLWZpbHRlcl9fcGFuZWwnKS5maW5kKCdpbnB1dDpjaGVja2VkJykgKTtcbiAgICAgICAgICAgICQoIF90aGlzLm5hbWVUZXh0Ym94ICkudmFsKCcnKS50cmlnZ2VyKCdrZXl1cCcpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBkYXRhYmFzZUZpbHRlcnMucHJvdG90eXBlLnB1bHNlVHdpY2UgPSBmdW5jdGlvbiggZWwgKXtcbiAgICAgICAgZWwuYWRkQ2xhc3MoJ2NjbC1jLWRhdGFiYXNlLWZpbHRlci0tb24tY2hhbmdlJyk7XG4gICAgICAgIGVsLm9uKCBcIndlYmtpdEFuaW1hdGlvbkVuZCBvYW5pbWF0aW9uZW5kIG1zQW5pbWF0aW9uRW5kIGFuaW1hdGlvbmVuZFwiLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJChlbCkucmVtb3ZlQ2xhc3MoJ2NjbC1jLWRhdGFiYXNlLWZpbHRlci0tb24tY2hhbmdlJyk7XG4gICAgICAgIH0gKTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgICQoJy5jY2wtZGF0YWJhc2UtZmlsdGVyJykuZWFjaCggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBkYXRhYmFzZUZpbHRlcnMoIHRoaXMgKTsgICAgICAgICAgIFxuICAgICAgICB9ICk7XG5cbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogRHJvcGRvd25zXG4gKiBcbiAqIEluaXRpYWxpemUgYW5kIGNvbnRyb2wgYmVoYXZpb3IgZm9yIGRyb3Bkb3duIG1lbnVzXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBzZWxlY3RvciA9IHtcbiAgICAgICAgICAgIFRPR0dMRTogJ1tkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCJdJyxcbiAgICAgICAgfSxcbiAgICAgICAgY2xhc3NOYW1lID0ge1xuICAgICAgICAgICAgQUNUSVZFOiAnY2NsLWlzLWFjdGl2ZScsXG4gICAgICAgICAgICBDT05URU5UOiAnY2NsLWMtZHJvcGRvd25fX2NvbnRlbnQnXG4gICAgICAgIH07XG5cbiAgICB2YXIgRHJvcGRvd25Ub2dnbGUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZSA9ICQoZWwpO1xuICAgICAgICB0aGlzLiRwYXJlbnQgPSB0aGlzLiR0b2dnbGUucGFyZW50KCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGFyZ2V0ID0gdGhpcy4kdG9nZ2xlLmRhdGEoJ3RhcmdldCcpO1xuXG4gICAgICAgIHRoaXMuJGNvbnRlbnQgPSAkKCB0YXJnZXQgKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiR0b2dnbGUuY2xpY2soIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIF90aGlzLnRvZ2dsZSgpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKGRvY3VtZW50KS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgdmFyIGhhc0FjdGl2ZU1lbnVzID0gJCggJy4nICsgY2xhc3NOYW1lLkNPTlRFTlQgKyAnLicgKyBjbGFzc05hbWUuQUNUSVZFICkubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKCBoYXNBY3RpdmVNZW51cyApe1xuICAgICAgICAgICAgICAgIF9jbGVhck1lbnVzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBpc0FjdGl2ZSA9IHRoaXMuJHRvZ2dsZS5oYXNDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuXG4gICAgICAgIGlmICggaXNBY3RpdmUgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNob3dDb250ZW50KCk7XG5cbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLnNob3dDb250ZW50ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICB0aGlzLiRjb250ZW50LmFkZENsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgIHRoaXMuJHBhcmVudC5hZGRDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuaGlkZU1lbnUgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiR0b2dnbGUuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgICAgICB0aGlzLiRjb250ZW50LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgIHRoaXMuJHBhcmVudC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBfY2xlYXJNZW51cygpIHtcbiAgICAgICAgJCgnLmNjbC1jLWRyb3Bkb3duLCAuY2NsLWMtZHJvcGRvd25fX2NvbnRlbnQnKS5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICAkKCBzZWxlY3Rvci5UT0dHTEUgKS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgfVxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCggc2VsZWN0b3IuVE9HR0xFICkuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IERyb3Bkb3duVG9nZ2xlKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogSGVhZGVyIE1lbnUgVG9nZ2xlc1xuICogXG4gKiBDb250cm9scyBiZWhhdmlvciBvZiBtZW51IHRvZ2dsZXMgaW4gdGhlIGhlYWRlclxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgSGVhZGVyTWVudVRvZ2dsZSA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gdGhpcy4kZWwuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgIHRoaXMuJHRhcmdldCA9ICQodGhpcy50YXJnZXQpO1xuICAgICAgICB0aGlzLiRwYXJlbnRNZW51ID0gdGhpcy4kZWwuY2xvc2VzdCgnLmNjbC1jLW1lbnUnKTtcbiAgICAgICAgdGhpcy4kY2xvc2VJY29uID0gJCgnPHNwYW4gY2xhc3M9XCJjY2wtYi1pY29uIGNsb3NlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPicpO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBIZWFkZXJNZW51VG9nZ2xlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLiRlbC5jbGljayhmdW5jdGlvbihldmVudCl7XG5cbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIC8vIGlmIHRoZSB0YXJnZXQgaXMgYWxyZWFkeSBvcGVuXG4gICAgICAgICAgICBpZiAoIHRoYXQuJHRhcmdldC5oYXNDbGFzcygnY2NsLWlzLWFjdGl2ZScpICkge1xuXG4gICAgICAgICAgICAgICAgLy8gY2xvc2UgdGFyZ2V0IGFuZCByZW1vdmUgYWN0aXZlIGNsYXNzZXMvZWxlbWVudHNcbiAgICAgICAgICAgICAgICB0aGF0LiRwYXJlbnRNZW51LnJlbW92ZUNsYXNzKCdjY2wtaGFzLWFjdGl2ZS1pdGVtJyk7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB0aGF0LiR0YXJnZXQucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKS5mYWRlT3V0KENDTC5EVVJBVElPTik7XG4gICAgICAgICAgICAgICAgdGhhdC4kY2xvc2VJY29uLnJlbW92ZSgpOyAgICAgICBcblxuICAgICAgICAgICAgfSBcblxuICAgICAgICAgICAgLy8gdGFyZ2V0IGlzIG5vdCBvcGVuXG4gICAgICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgICAgIC8vIGNsb3NlIGFuZCByZXNldCBhbGwgYWN0aXZlIG1lbnVzXG4gICAgICAgICAgICAgICAgJCgnLmNjbC1jLW1lbnUuY2NsLWhhcy1hY3RpdmUtaXRlbScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKVxuICAgICAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtaGFzLWFjdGl2ZS1pdGVtJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCdhLmNjbC1pcy1hY3RpdmUnKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnLmNjbC1iLWljb24uY2xvc2UnKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBjbG9zZSBhbmQgcmVzZXQgYWxsIGFjdGl2ZSBzdWItbWVudSBjb250YWluZXJzXG4gICAgICAgICAgICAgICAgJCgnLmNjbC1jLXN1Yi1tZW51LWNvbnRhaW5lci5jY2wtaXMtYWN0aXZlJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJykuZmFkZU91dChDQ0wuRFVSQVRJT04pO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgLy8gYWN0aXZhdGUgdGhlIHNlbGVjdGVkIHRhcmdldFxuICAgICAgICAgICAgICAgIHRoYXQuJHBhcmVudE1lbnUuYWRkQ2xhc3MoJ2NjbC1oYXMtYWN0aXZlLWl0ZW0nKTtcbiAgICAgICAgICAgICAgICB0aGF0LiR0YXJnZXQuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKS5mYWRlSW4oQ0NMLkRVUkFUSU9OKTtcbiAgICAgICAgICAgICAgICAvLyBwcmVwZW5kIGNsb3NlIGljb25cbiAgICAgICAgICAgICAgICB0aGF0LiRjbG9zZUljb24ucHJlcGVuZFRvKHRoYXQuJGVsKTtcbiAgICAgICAgICAgICAgICBDQ0wucmVmbG93KHRoYXQuJGNsb3NlSWNvblswXSk7XG4gICAgICAgICAgICAgICAgdGhhdC4kY2xvc2VJY29uLmZhZGVJbigyMDApO1xuICAgICAgICAgICAgICAgIHRoYXQuJGVsLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtdG9nZ2xlLWhlYWRlci1tZW51JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IEhlYWRlck1lbnVUb2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBNb2RhbHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIG1vZGFscy4gQmFzZWQgb24gQm9vdHN0cmFwJ3MgbW9kYWxzOiBodHRwczovL2dldGJvb3RzdHJhcC5jb20vZG9jcy80LjAvY29tcG9uZW50cy9tb2RhbC9cbiAqIFxuICogR2xvYmFsczpcbiAqIFNDUk9MTEJBUldJRFRIXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIERVUkFUSU9OID0gMzAwO1xuXG4gICAgdmFyIE1vZGFsVG9nZ2xlID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSAkZWwuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgIHRoaXMuJHRhcmdldCA9ICQodGhpcy50YXJnZXQpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzOyBcblxuICAgICAgICBfdGhpcy4kZWwub24oICdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBpZiAoICQoZG9jdW1lbnQuYm9keSkuaGFzQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJykgKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2xvc2VNb2RhbCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5zaG93QmFja2Ryb3AoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuc2hvd01vZGFsKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5zaG93QmFja2Ryb3AgPSBmdW5jdGlvbihjYWxsYmFjayl7XG5cbiAgICAgICAgdmFyIGJhY2tkcm9wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIHZhciAkYmFja2Ryb3AgPSAkKGJhY2tkcm9wKTtcblxuICAgICAgICAkYmFja2Ryb3AuYWRkQ2xhc3MoJ2NjbC1jLW1vZGFsX19iYWNrZHJvcCcpO1xuICAgICAgICAkYmFja2Ryb3AuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG4gICAgICAgIFxuICAgICAgICBDQ0wucmVmbG93KGJhY2tkcm9wKTtcbiAgICAgICAgXG4gICAgICAgICRiYWNrZHJvcC5hZGRDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgJChkb2N1bWVudC5ib2R5KVxuICAgICAgICAgICAgLmFkZENsYXNzKCdjY2wtbW9kYWwtb3BlbicpXG4gICAgICAgICAgICAuY3NzKCAncGFkZGluZy1yaWdodCcsIENDTC5TQ1JPTExCQVJXSURUSCApO1xuXG4gICAgICAgIGlmICggY2FsbGJhY2sgKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCBjYWxsYmFjaywgRFVSQVRJT04gKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuc2hvd01vZGFsID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgX3RoaXMuJHRhcmdldC5zaG93KCAwLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5hZGRDbGFzcygnY2NsLWlzLXNob3duJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuY2xvc2VNb2RhbCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgJCgnLmNjbC1jLW1vZGFsJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbCcpLmhpZGUoKTtcblxuICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsX19iYWNrZHJvcCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsX19iYWNrZHJvcCcpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgJChkb2N1bWVudC5ib2R5KVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJylcbiAgICAgICAgICAgICAgICAgICAgLmNzcyggJ3BhZGRpbmctcmlnaHQnLCAnJyApO1xuXG4gICAgICAgICAgICB9LCBEVVJBVElPTik7XG5cbiAgICAgICAgfSwgRFVSQVRJT04gKTsgXG5cbiAgICB9O1xuXG5cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cIm1vZGFsXCJdJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IE1vZGFsVG9nZ2xlKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqXG4gKiBQb3N0IFR5cGUgS2V5d29yZCBzZWFyY2hcbiAqIFxuICogT24gdXNlciBpbnB1dCwgZmlyZSByZXF1ZXN0IHRvIHNlYXJjaCB0aGUgZGF0YWJhc2UgY3VzdG9tIHBvc3QgdHlwZSBhbmQgcmV0dXJuIHJlc3VsdHMgdG8gcmVzdWx0cyBwYW5lbFxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG5cdFx0RU5URVIgPSAxMywgVEFCID0gOSwgU0hJRlQgPSAxNiwgQ1RSTCA9IDE3LCBBTFQgPSAxOCwgQ0FQUyA9IDIwLCBFU0MgPSAyNywgTENNRCA9IDkxLCBSQ01EID0gOTIsIExBUlIgPSAzNywgVUFSUiA9IDM4LCBSQVJSID0gMzksIERBUlIgPSA0MCxcblx0XHRmb3JiaWRkZW5LZXlzID0gW0VOVEVSLCBUQUIsIFNISUZULCBDVFJMLCBBTFQsIENBUFMsIEVTQywgTENNRCwgUkNNRCwgTEFSUiwgVUFSUiwgUkFSUiwgREFSUl07XG5cbiAgICB2YXIgcG9zdFNlYXJjaCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgICAgICAgICAgICA9ICQoIGVsICk7XG4gICAgICAgIHRoaXMuJGZvcm1cdFx0XHQ9IHRoaXMuJGVsLmZpbmQoICcuY2NsLWMtcG9zdC1zZWFyY2hfX2Zvcm0nICk7XG4gICAgICAgIHRoaXMuJHBvc3RUeXBlICAgICAgPSB0aGlzLiRlbC5hdHRyKCdkYXRhLXNlYXJjaC10eXBlJyk7XG4gICAgICAgIHRoaXMuJGlucHV0ICAgICAgICAgPSB0aGlzLiRlbC5maW5kKCcjY2NsLWMtcG9zdC1zZWFyY2hfX2lucHV0Jyk7XG4gICAgICAgIHRoaXMuJHJlc3VsdHNMaXN0ICAgPSB0aGlzLiRlbC5maW5kKCAnLmNjbC1jLXBvc3Qtc2VhcmNoX19yZXN1bHRzJyApO1xuICAgICAgICB0aGlzLiRpbnB1dFRleHRib3hcdD0gdGhpcy4kZWwuZmluZCggJy5jY2wtYy1wb3N0LXNlYXJjaF9fdGV4dGJveCcgKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBwb3N0U2VhcmNoLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAvL0FKQVggZXZlbnQgd2F0Y2hpbmcgZm9yIHVzZXIgaW5wdXQgYW5kIG91dHB1dHRpbmcgc3VnZ2VzdGVkIHJlc3VsdHNcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcyxcbiAgICAgICAgdGltZW91dCxcbiAgICAgICAgcXVlcnk7XG4gICAgICAgIFxuXG5cdFx0Ly9rZXlib2FyZCBldmVudHMgZm9yIHNlbmRpbmcgcXVlcnkgdG8gZGF0YWJhc2Vcblx0XHR0aGlzLiRpbnB1dFxuXHRcdFx0Lm9uKCdrZXl1cCBrZXlwcmVzcycsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0ICAgIFxuXHRcdFx0ICAgIGV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuXHRcdFx0ICAgIFxuXHRcdFx0XHQvLyBjbGVhciBhbnkgcHJldmlvdXMgc2V0IHRpbWVvdXRcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuXG5cdFx0XHRcdC8vIGlmIGtleSBpcyBmb3JiaWRkZW4sIHJldHVyblxuXHRcdFx0XHRpZiAoIGZvcmJpZGRlbktleXMuaW5kZXhPZiggZXZlbnQua2V5Q29kZSApID4gLTEgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZ2V0IHZhbHVlIG9mIHNlYXJjaCBpbnB1dFxuXHRcdFx0XHRfdGhpcy5xdWVyeSA9IF90aGlzLiRpbnB1dC52YWwoKTtcblx0XHRcdFx0Ly9yZW1vdmUgZG91YmxlIHF1b3RhdGlvbnMgYW5kIG90aGVyIGNoYXJhY3RlcnMgZnJvbSBzdHJpbmdcblx0XHRcdFx0X3RoaXMucXVlcnkgPSBfdGhpcy5xdWVyeS5yZXBsYWNlKC9bXmEtekEtWjAtOSAtJy4sXS9nLCBcIlwiKTtcblxuXHRcdFx0XHQvLyBzZXQgYSB0aW1lb3V0IGZ1bmN0aW9uIHRvIHVwZGF0ZSByZXN1bHRzIG9uY2UgNjAwbXMgcGFzc2VzXG5cdFx0XHRcdHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdGlmICggX3RoaXMucXVlcnkubGVuZ3RoID4gMiApIHtcblxuXHRcdFx0XHRcdCBcdF90aGlzLmZldGNoUG9zdFJlc3VsdHMoIF90aGlzLnF1ZXJ5ICk7XG5cdFx0XHRcdFx0IFx0XG5cdFx0XHRcdFx0IFx0XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdCAgICBfdGhpcy4kcmVzdWx0c0xpc3QuaGlkZSgpO1xuXHRcdFx0XHRcdFx0Ly9fdGhpcy4kcmVzdWx0c0xpc3QuaHRtbCgnJyk7XG5cdFx0XHRcdFx0fVxuXG5cdFx0XHRcdH0sIDIwMCk7XG5cblx0XHRcdH0pXG5cdFx0XHQuZm9jdXMoZnVuY3Rpb24oKXtcblx0XHRcdFx0aWYgKCBfdGhpcy4kaW5wdXQudmFsKCkgIT09ICcnICkge1xuXHRcdFx0XHRcdF90aGlzLiRyZXN1bHRzTGlzdC5zaG93KCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9KVxuXHRcdFx0LmJsdXIoZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCcgaW5wdXQgYmx1cnJlZCcpO1xuXHRcdFx0XHQkKGRvY3VtZW50KS5vbignY2xpY2snLCBfb25CbHVycmVkQ2xpY2spO1xuXG5cdFx0XHR9KTtcblx0XHRcblx0XHRmdW5jdGlvbiBfb25CbHVycmVkQ2xpY2soZXZlbnQpIHtcblx0XHRcdFxuXHRcdFx0aWYgKCAhICQuY29udGFpbnMoIF90aGlzLiRlbFswXSwgZXZlbnQudGFyZ2V0ICkgKSB7XG5cdFx0XHRcdF90aGlzLiRyZXN1bHRzTGlzdC5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdCQoZG9jdW1lbnQpLm9mZignY2xpY2snLCBfb25CbHVycmVkQ2xpY2spO1xuXG5cdFx0fVxuXHRcdFxuXHRcdHRoaXMuJGZvcm0ub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKCBldmVudCApe1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuXHRcdFx0Ly8gZ2V0IHZhbHVlIG9mIHNlYXJjaCBpbnB1dFxuXHRcdFx0Ly8gX3RoaXMucXVlcnkgPSBfdGhpcy4kaW5wdXQudmFsKCk7XG5cdFx0XHQvLyAvL3JlbW92ZSBkb3VibGUgcXVvdGF0aW9ucyBhbmQgb3RoZXIgY2hhcmFjdGVycyBmcm9tIHN0cmluZ1xuXHRcdFx0Ly8gX3RoaXMucXVlcnkgPSBfdGhpcy5xdWVyeS5yZXBsYWNlKC9bXmEtekEtWjAtOSAtJy4sXS9nLCBcIlwiKTtcblx0XHRcdGNvbnNvbGUubG9nKF90aGlzLnF1ZXJ5KTtcdFxuXHRcdFx0XG5cdFx0XHRcblx0XHRcdGlmICggX3RoaXMucXVlcnkubGVuZ3RoID4gMiApIHtcblxuXHRcdFx0IFx0X3RoaXMuZmV0Y2hQb3N0UmVzdWx0cyggX3RoaXMucXVlcnkgKTtcblx0XHRcdCBcdFxuXHRcdFx0IFx0XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdCAgICBfdGhpcy4kcmVzdWx0c0xpc3QuaGlkZSgpO1xuXHRcdFx0XHQvL190aGlzLiRyZXN1bHRzTGlzdC5odG1sKCcnKTtcblx0XHRcdH1cdFx0XHRcblx0XHRcdFxuXHRcdH0pO1xuICAgIH07XG4gICAgXG4gICAgcG9zdFNlYXJjaC5wcm90b3R5cGUuZmV0Y2hQb3N0UmVzdWx0cyA9IGZ1bmN0aW9uKCBxdWVyeSApe1xuXHRcdC8vc2VuZCBBSkFYIHJlcXVlc3QgdG8gUEhQIGZpbGUgaW4gV1Bcblx0XHR2YXIgX3RoaXMgPSB0aGlzLFxuXHRcdFx0ZGF0YSA9IHtcblx0XHRcdFx0YWN0aW9uICAgICAgOiAncmV0cmlldmVfcG9zdF9zZWFyY2hfcmVzdWx0cycsIC8vIHRoaXMgc2hvdWxkIHByb2JhYmx5IGJlIGFibGUgdG8gZG8gcGVvcGxlICYgYXNzZXRzIHRvbyAobWF5YmUgREJzKVxuXHRcdFx0XHRxdWVyeSAgICAgICA6IHF1ZXJ5LFxuXHRcdFx0XHRwb3N0VHlwZSAgICA6IF90aGlzLiRwb3N0VHlwZVxuXHRcdFx0fTtcblxuXHRcdF90aGlzLiRpbnB1dFRleHRib3guYWRkQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG5cdFx0XG5cdFx0Ly9jb25zb2xlLmxvZyggX3RoaXMgKTtcblxuXHRcdCQucG9zdChDQ0wuYWpheF91cmwsIGRhdGEpXG5cdFx0XHQuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdCAgICBcblx0XHRcdFx0Ly9mdW5jdGlvbiBmb3IgcHJvY2Vzc2luZyByZXN1bHRzXG5cdFx0XHRcdF90aGlzLnByb2Nlc3NQb3N0UmVzdWx0cyhyZXNwb25zZSk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCAncmVzcG9uc2UnLCByZXNwb25zZSApO1xuXG5cdFx0XHR9KVxuXHRcdFx0LmFsd2F5cyhmdW5jdGlvbigpe1xuXG5cdFx0XHRcdF90aGlzLiRpbnB1dFRleHRib3gucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG5cblx0XHRcdH0pOyAgICAgICAgXG4gICAgfTtcbiAgICBcbiAgICBwb3N0U2VhcmNoLnByb3RvdHlwZS5wcm9jZXNzUG9zdFJlc3VsdHMgPSBmdW5jdGlvbiggcmVzcG9uc2UgKXtcbiAgICAgICAgdmFyIF90aGlzICAgICAgID0gdGhpcyxcblx0XHQgICAgcmVzdWx0cyAgICAgPSAkLnBhcnNlSlNPTihyZXNwb25zZSksXG5cdFx0ICAgIHJlc3VsdENvdW50XHQ9IHJlc3VsdHMuY291bnQsXG5cdFx0ICAgIHJlc3VsdEl0ZW1zID0gJCgnPHVsIC8+JykuYWRkQ2xhc3MoJ2NjbC1jLXBvc3Qtc2VhcmNoX19yZXN1bHRzLXVsJyksXG4gICAgICAgICAgICByZXN1bHRzQ2xvc2UgPSAkKCc8bGkgLz4nKVxuICAgICAgICAgICAgXHQuYWRkQ2xhc3MoJ2NjbC1jLXNlYXJjaC0tY2xvc2UtcmVzdWx0cycpXG4gICAgICAgICAgICBcdC5hcHBlbmQoICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnY2NsLWMtcG9zdC1zZWFyY2hfX2NvdW50IGNjbC11LXdlaWdodC1ib2xkIGNjbC11LWZhZGVkJykgIFxuICAgICAgICBcdFx0XHRcdFx0LmFwcGVuZCggJCgnPGkgLz4nKS5hZGRDbGFzcygnY2NsLWItaWNvbiBhcnJvdy1kb3duJykgKVxuICAgIFx0XHRcdFx0XHRcdC5hcHBlbmQoICQoJzxzcGFuIC8+JykuaHRtbCggJyZuYnNwOyZuYnNwJyArIHJlc3VsdENvdW50ICsgJyBmb3VuZCcpIClcbiAgICAgICAgICAgIFx0XHQpXG4gICAgICAgICAgICBcdC5hcHBlbmQoICQoJzxidXR0b24gLz4nKS5hZGRDbGFzcygnY2NsLWItY2xvc2UgY2NsLWMtc2VhcmNoLS1jbG9zZV9fYnV0dG9uJykuYXR0cignYXJpYWwtbGFiZWwnLCAnQ2xvc2UnKVxuXHQgICAgICAgICAgICBcdFx0XHQuYXBwZW5kKCAkKCc8aSAvPicpLmF0dHIoJ2FyaWEtaGlkZGVuJywgdHJ1ZSApLmFkZENsYXNzKCdjY2wtYi1pY29uIGNsb3NlIGNjbC11LXdlaWdodC1ib2xkIGNjbC11LWZvbnQtc2l6ZS1zbScpIClcbiAgICAgICAgICAgIFx0XHQpO1xuXG5cblx0XHQgICAgXG5cdFx0ICAgIGlmKCByZXN1bHRzLnBvc3RzLmxlbmd0aCA9PT0gMCApe1xuXHRcdCAgICBcdHRoaXMuJHJlc3VsdHNMaXN0Lmh0bWwoJycpO1x0XHQgICAgXHRcblx0XHQgICAgICAgIHRoaXMuJHJlc3VsdHNMaXN0LnNob3coKS5hcHBlbmQoICQoJzxkaXYgLz4nKS5hZGRDbGFzcygnY2NsLXUtcHktbnVkZ2UgY2NsLXUtd2VpZ2h0LWJvbGQgY2NsLXUtZmFkZWQnKS5odG1sKCdTb3JyeSwgbm8gZGF0YWJhc2VzIGZvdW5kIC0gdHJ5IGFub3RoZXIgc2VhcmNoJykgKTtcblxuXHRcdCAgICAgICAgcmV0dXJuO1xuXHRcdCAgICB9XG5cdFx0ICAgXG5cdFx0ICAgIHRoaXMuJHJlc3VsdHNMaXN0Lmh0bWwoJycpO1xuXHRcdCAgICBcblx0XHQgICAgcmVzdWx0SXRlbXMuYXBwZW5kKCByZXN1bHRzQ2xvc2UgKTtcblx0XHQgICAgXG5cdFx0ICAgICQuZWFjaCggcmVzdWx0cy5wb3N0cywgZnVuY3Rpb24oIGtleSwgdmFsICl7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciByZW5kZXJJdGVtID0gJCgnPGxpIC8+JylcbiAgICAgICAgICAgICAgICBcdC5hcHBlbmQoXG4gICAgICAgICAgICAgICAgXHRcdCQoJzxhIC8+JylcbiAgICAgICAgICAgICAgICBcdFx0XHQuYXR0cih7XG5cdFx0XHQgICAgICAgICAgICAgICAgICAgJ2hyZWYnICAgOiB2YWwucG9zdF9saW5rLFxuXHRcdFx0ICAgICAgICAgICAgICAgICAgICd0YXJnZXQnIDogJ19ibGFuaycsICAgICAgICAgICAgICAgXHRcdFx0XHRcbiAgICAgICAgICAgICAgICBcdFx0XHR9KVxuICAgICAgICAgICAgICAgIFx0XHRcdC5hZGRDbGFzcygnY2NsLWMtZGF0YWJhc2Utc2VhcmNoX19yZXN1bHQtaXRlbScpXG4gICAgICAgICAgICAgICAgXHRcdFx0Lmh0bWwoIHZhbC5wb3N0X3RpdGxlICsgKHZhbC5wb3N0X2FsdF9uYW1lID8gJzxkaXYgY2xhc3M9XCJjY2wtdS13ZWlnaHQtbm9ybWFsIGNjbC11LW1sLW51ZGdlIGNjbC11LWZvbnQtc2l6ZS1zbVwiPignICsgdmFsLnBvc3RfYWx0X25hbWUgKyAnKTwvZGl2PicgOiAnJyApIClcbiAgICAgICAgICAgICAgICBcdFx0XHQuYXBwZW5kKCAkKCc8c3BhbiAvPicpXG5cdCAgICAgICAgICAgICAgICBcdFx0XHRcdFx0Lmh0bWwoICdBY2Nlc3MmbmJzcDsmbmJzcDsnIClcblx0ICAgICAgICAgICAgICAgIFx0XHRcdFx0XHQuYXBwZW5kKCAkKCc8aSAvPicpXG5cdCAgICAgICAgICAgICAgICBcdFx0XHRcdFx0XHRcdFx0LmFkZENsYXNzKCdjY2wtYi1pY29uIGFycm93LXJpZ2h0Jylcblx0ICAgICAgICAgICAgICAgIFx0XHRcdFx0XHRcdFx0XHQuYXR0cih7XG5cdCAgICAgICAgICAgICAgICBcdFx0XHRcdFx0XHRcdFx0J2FyaWEtaGlkZGVuJ1x0OiB0cnVlLFxuXHQgICAgICAgICAgICAgICAgXHRcdFx0XHRcdFx0XHRcdCdzdHlsZSdcdFx0XHQ6IFwidmVydGljYWwtYWxpZ246bWlkZGxlXCJcblx0ICAgICAgICAgICAgICAgIFx0XHRcdFx0XHRcdFx0XHR9KVxuXHQgICAgICAgICAgICAgICAgXHRcdFx0XHRcdFx0KSBcbiAgICAgICAgICAgICAgICBcdFx0XHRcdClcbiAgICAgICAgICAgICAgICBcdFx0KTtcblx0XHQgICAgXG5cdFx0ICAgICAgICByZXN1bHRJdGVtcy5hcHBlbmQoIHJlbmRlckl0ZW0gKTtcblx0XHQgICAgICAgIFxuXHRcdCAgICB9ICk7XG5cdFx0ICAgIFxuXHRcdCAgICB0aGlzLiRyZXN1bHRzTGlzdC5hcHBlbmQoIHJlc3VsdEl0ZW1zICkuc2hvdygpO1xuXHRcdCAgICBcblx0XHRcdC8vY2FjaGUgdGhlIHJlc3BvbnNlIGJ1dHRvbiBhZnRlciBpdHMgYWRkZWQgdG8gdGhlIERPTVxuXHRcdFx0X3RoaXMuJHJlc3BvbnNlQ2xvc2VcdD0gX3RoaXMuJGVsLmZpbmQoJy5jY2wtYy1zZWFyY2gtLWNsb3NlX19idXR0b24nKTtcdFx0XG5cdFx0XHRcblx0XHRcdC8vY2xpY2sgZXZlbnQgdG8gY2xvc2UgdGhlIHJlc3VsdHMgcGFnZVxuXHRcdFx0X3RoaXMuJHJlc3BvbnNlQ2xvc2Uub24oICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0XHQvL2hpZGVcblx0XHRcdFx0XHRpZiggJCggX3RoaXMuJHJlc3VsdHNMaXN0ICkuaXMoJzp2aXNpYmxlJykgKXtcblx0XHRcdFx0XHRcdF90aGlzLiRyZXN1bHRzTGlzdC5oaWRlKCk7XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH1cblx0XHRcdH0pO1x0XHQgICAgXG5cdFx0ICAgIFxuXHRcdCAgICBcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgICQoJy5jY2wtYy1wb3N0LXNlYXJjaCcpLmVhY2goIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgcG9zdFNlYXJjaCh0aGlzKTsgICAgICAgICAgIFxuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApOyIsIi8qKlxuICogUXVpY2sgTmF2XG4gKiBcbiAqIEJlaGF2aW9yIGZvciB0aGUgcXVpY2sgbmF2XG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyICR3aW5kb3cgPSAkKHdpbmRvdyksXG4gICAgICAgIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIFF1aWNrTmF2ID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHN1Yk1lbnVzID0gdGhpcy4kZWwuZmluZCgnLnN1Yi1tZW51Jyk7XG4gICAgICAgIHRoaXMuJHNjcm9sbFNweUl0ZW1zID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXF1aWNrLW5hdl9fc2Nyb2xsc3B5IHNwYW4nKTtcbiAgICAgICAgdGhpcy4kc2VhcmNoVG9nZ2xlID0gdGhpcy4kZWwuZmluZCgnLmNjbC1pcy1zZWFyY2gtdG9nZ2xlJyk7XG5cbiAgICAgICAgLy8gc2V0IHRoZSB0b2dnbGUgb2Zmc2V0IGFuZCBhY2NvdW50IGZvciB0aGUgV1AgYWRtaW4gYmFyIFxuICAgIFxuICAgICAgICBpZiAoICQoJ2JvZHknKS5oYXNDbGFzcygnYWRtaW4tYmFyJykgJiYgJCgnI3dwYWRtaW5iYXInKS5jc3MoJ3Bvc2l0aW9uJykgPT0gJ2ZpeGVkJyApIHtcbiAgICAgICAgICAgIHZhciBhZG1pbkJhckhlaWdodCA9ICQoJyN3cGFkbWluYmFyJykub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlT2Zmc2V0ID0gJCgnLmNjbC1jLXVzZXItbmF2Jykub2Zmc2V0KCkudG9wICsgJCgnLmNjbC1jLXVzZXItbmF2Jykub3V0ZXJIZWlnaHQoKSAtIGFkbWluQmFySGVpZ2h0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50b2dnbGVPZmZzZXQgPSAkKCcuY2NsLWMtdXNlci1uYXYnKS5vZmZzZXQoKS50b3AgKyAkKCcuY2NsLWMtdXNlci1uYXYnKS5vdXRlckhlaWdodCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIFF1aWNrTmF2LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB0aGlzLmluaXRTY3JvbGwoKTtcbiAgICAgICAgdGhpcy5pbml0TWVudXMoKTtcbiAgICAgICAgdGhpcy5pbml0U2Nyb2xsU3B5KCk7XG4gICAgICAgIHRoaXMuaW5pdFNlYXJjaCgpO1xuXG4gICAgfTtcblxuICAgIFF1aWNrTmF2LnByb3RvdHlwZS5pbml0U2Nyb2xsID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICAkd2luZG93LnNjcm9sbCggQ0NMLnRocm90dGxlKCBfb25TY3JvbGwsIDUwICkgKTtcblxuICAgICAgICBmdW5jdGlvbiBfb25TY3JvbGwoKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpO1xuICAgIFxuICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gdGhhdC50b2dnbGVPZmZzZXQgKSB7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1maXhlZCcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWZpeGVkJyk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdE1lbnVzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKCAhIHRoaXMuJHN1Yk1lbnVzLmxlbmd0aCApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJHN1Yk1lbnVzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciAkc3ViTWVudSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgJHRvZ2dsZSA9ICRzdWJNZW51LnNpYmxpbmdzKCdhJyk7XG5cbiAgICAgICAgICAgICR0b2dnbGUuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoICQodGhpcykuaGFzQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKSApIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZSBjY2wtdS1jb2xvci1zY2hvb2wnKTtcbiAgICAgICAgICAgICAgICAgICAgJHN1Yk1lbnUuZmFkZU91dCgyNTApO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgJCgnLmNjbC1jLXF1aWNrLW5hdl9fbWVudSBhLmNjbC1pcy1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUgY2NsLXUtY29sb3Itc2Nob29sJylcbiAgICAgICAgICAgICAgICAgICAgLnNpYmxpbmdzKCcuc3ViLW1lbnUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZhZGVPdXQoMjUwKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkKHRoaXMpLnRvZ2dsZUNsYXNzKCdjY2wtaXMtYWN0aXZlIGNjbC11LWNvbG9yLXNjaG9vbCcpO1xuICAgICAgICAgICAgICAgICRzdWJNZW51LmZhZGVUb2dnbGUoMjUwKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgUXVpY2tOYXYucHJvdG90eXBlLmluaXRTY3JvbGxTcHkgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLiRzY3JvbGxTcHlJdGVtcy5lYWNoKGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgIHZhciAkc3B5SXRlbSA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgdGFyZ2V0ID0gJHNweUl0ZW0uZGF0YSgndGFyZ2V0Jyk7XG5cbiAgICAgICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgMTAwICkgKTtcblxuICAgICAgICAgICAgZnVuY3Rpb24gX29uU2Nyb2xsKCkge1xuICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBzY3JvbGxUb3AgPSAkd2luZG93LnNjcm9sbFRvcCgpLFxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRUb3AgPSAkKHRhcmdldCkub2Zmc2V0KCkudG9wIC0gMTUwO1xuXG4gICAgICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gdGFyZ2V0VG9wICkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LiRzY3JvbGxTcHlJdGVtcy5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICAgICAkc3B5SXRlbS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICRzcHlJdGVtLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUXVpY2tOYXYucHJvdG90eXBlLmluaXRTZWFyY2ggPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHRoaXMuJHNlYXJjaFRvZ2dsZS5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhhdC4kZWwudG9nZ2xlQ2xhc3MoJ2NjbC1zZWFyY2gtYWN0aXZlJyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWMtcXVpY2stbmF2JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFF1aWNrTmF2KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogUm9vbSBSZXNlcnZhdGlvblxuICogXG4gKiBIYW5kbGUgcm9vbSByZXNlcnZhdGlvbnNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgUm9vbVJlc0Zvcm0gPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgdmFyIG5vdyA9IG5ldyBEYXRlKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiRmb3JtQ29udGVudCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLWNvbnRlbnQnKS5jc3Moe3Bvc2l0aW9uOidyZWxhdGl2ZSd9KTtcbiAgICAgICAgdGhpcy4kZm9ybVJlc3BvbnNlID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tcmVzcG9uc2UnKS5jc3Moe3Bvc2l0aW9uOiAnYWJzb2x1dGUnLCB0b3A6ICcxcmVtJywgbGVmdDogJzFyZW0nLCBvcGFjaXR5OiAwfSk7XG4gICAgICAgIHRoaXMuJGZvcm1DYW5jZWwgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1jYW5jZWwnKTtcbiAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLXN1Ym1pdCcpO1xuICAgICAgICB0aGlzLiRmb3JtUmVsb2FkID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tcmVsb2FkJyk7XG4gICAgICAgIHRoaXMucm9vbUlkID0gdGhpcy4kZWwuZGF0YSgncmVzb3VyY2UtaWQnKTtcbiAgICAgICAgdGhpcy4kZGF0ZVNlbGVjdCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLWRhdGUtc2VsZWN0Jyk7XG4gICAgICAgIHRoaXMuZGF0ZVltZCA9IHRoaXMuJGRhdGVTZWxlY3QudmFsKCk7XG4gICAgICAgIHRoaXMuJHJvb21TY2hlZHVsZSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXNjaGVkdWxlJyk7XG4gICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQgPSB0aGlzLiRlbC5maW5kKCcuanMtY3VycmVudC1kdXJhdGlvbicpO1xuICAgICAgICB0aGlzLiRmb3JtTm90aWZpY2F0aW9uID0gJCgnPHAgY2xhc3M9XCJjY2wtYy1hbGVydFwiPjwvcD4nKTtcbiAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4gPSB0aGlzLiRlbC5maW5kKCcuanMtcmVzZXQtc2VsZWN0aW9uJyk7IFxuICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cyA9IG51bGw7XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzID0gW107XG4gICAgICAgIHRoaXMubWF4U2xvdHMgPSA0O1xuICAgICAgICB0aGlzLiRtYXhUaW1lID0gdGhpcy4kZWwuZmluZCgnLmpzLW1heC10aW1lJyk7XG4gICAgICAgIHRoaXMuc2xvdE1pbnV0ZXMgPSAzMDtcbiAgICAgICAgdGhpcy5sb2NhbGUgPSBcImVuLVVTXCI7XG4gICAgICAgIHRoaXMudGltZVpvbmUgPSB7dGltZVpvbmU6IFwiQW1lcmljYS9Mb3NfQW5nZWxlc1wifTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5zZXRMb2FkaW5nKCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTY2hlZHVsZURhdGEoKTtcblxuICAgICAgICB0aGlzLnNldE1heFRpbWVUZXh0KCk7XG5cbiAgICAgICAgdGhpcy5pbml0RGF0ZUV2ZW50cygpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0Rm9ybUV2ZW50cygpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuZ2V0U3BhY2VBdmFpbGFiaWxpdHkgPSBmdW5jdGlvbihZbWQpe1xuXG5cdFx0dmFyIGRhdGEgPSB7XG5cdFx0XHRhY3Rpb246ICdnZXRfcm9vbV9pbmZvJyxcblx0XHRcdGNjbF9ub25jZTogQ0NMLm5vbmNlLFxuXHRcdFx0YXZhaWxhYmlsaXR5OiBZbWQgfHwgJycsIC8vIGUuZy4gJzIwMTctMTAtMTknLiBlbXB0eSBzdHJpbmcgd2lsbCBnZXQgYXZhaWxhYmlsaXR5IGZvciBjdXJyZW50IGRheVxuXHRcdFx0cm9vbTogdGhpcy5yb29tSWQgLy8gcm9vbV9pZCAoc3BhY2UpXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuICQucG9zdCh7XG5cdFx0XHR1cmw6IENDTC5hamF4X3VybCxcblx0XHRcdGRhdGE6IGRhdGFcblx0XHR9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuZ2V0U3BhY2VCb29raW5ncyA9IGZ1bmN0aW9uKFltZCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIGFjdGlvbjogJ2dldF9ib29raW5ncycsXG4gICAgICAgICAgICBjY2xfbm9uY2U6IENDTC5ub25jZSxcbiAgICAgICAgICAgIGRhdGU6IFltZCB8fCAnJywgLy8gZS5nLiAnMjAxNy0xMC0xOScuIGVtcHR5IHN0cmluZyB3aWxsIGdldCBib29raW5ncyBmb3IgY3VycmVudCBkYXlcbiAgICAgICAgICAgIHJvb206IHRoaXMucm9vbUlkLFxuICAgICAgICAgICAgbGltaXQ6IDUwXG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuICQucG9zdCh7XG4gICAgICAgICAgICB1cmw6IENDTC5hamF4X3VybCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnVwZGF0ZVNjaGVkdWxlRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGdldFNwYWNlanFYSFIgPSB0aGlzLmdldFNwYWNlQXZhaWxhYmlsaXR5KHRoaXMuZGF0ZVltZCk7XG4gICAgICAgIHZhciBnZXRCb29raW5nc2pxWEhSID0gdGhpcy5nZXRTcGFjZUJvb2tpbmdzKHRoaXMuZGF0ZVltZCk7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAkLndoZW4oZ2V0U3BhY2VqcVhIUiwgZ2V0Qm9va2luZ3NqcVhIUilcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGdldFNwYWNlLGdldEJvb2tpbmdzKXtcblxuICAgICAgICAgICAgICAgIHZhciBzcGFjZURhdGEgPSBnZXRTcGFjZVswXSxcbiAgICAgICAgICAgICAgICAgICAgYm9va2luZ3NEYXRhID0gZ2V0Qm9va2luZ3NbMF0sXG4gICAgICAgICAgICAgICAgICAgIHNwYWNlanFYSFIgPSBnZXRTcGFjZVsyXSxcbiAgICAgICAgICAgICAgICAgICAgYm9va2luZ3NqcVhIUiA9IGdldEJvb2tpbmdzWzJdLFxuICAgICAgICAgICAgICAgICAgICB0aW1lU2xvdHNBcnJheTtcblxuICAgICAgICAgICAgICAgIC8vIHBhcnNlIGRhdGEgdG8gSlNPTiBpZiBpdCdzIGEgc3RyaW5nXG4gICAgICAgICAgICAgICAgc3BhY2VEYXRhID0gKCB0eXBlb2Ygc3BhY2VEYXRhID09PSAnc3RyaW5nJyApID8gSlNPTi5wYXJzZSggc3BhY2VEYXRhIClbMF0gOiBzcGFjZURhdGFbMF07XG4gICAgICAgICAgICAgICAgYm9va2luZ3NEYXRhID0gKCB0eXBlb2YgYm9va2luZ3NEYXRhID09PSAnc3RyaW5nJyApID8gSlNPTi5wYXJzZSggYm9va2luZ3NEYXRhICkgOiBib29raW5nc0RhdGE7XG5cbiAgICAgICAgICAgICAgICAvLyBtZXJnZSBib29raW5ncyB3aXRoIGF2YWlsYWJpbGl0eVxuICAgICAgICAgICAgICAgIGlmICggYm9va2luZ3NEYXRhLmxlbmd0aCApe1xuXG4gICAgICAgICAgICAgICAgICAgIGJvb2tpbmdzRGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGJvb2tpbmcsaSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBudW1iZXIgb2Ygc2xvdHMgYmFzZWQgb24gYm9va2luZyBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21UaW1lID0gbmV3IERhdGUoYm9va2luZy5mcm9tRGF0ZSkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvVGltZSA9IG5ldyBEYXRlKGJvb2tpbmcudG9EYXRlKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25NaW51dGVzID0gKHRvVGltZSAtIGZyb21UaW1lKSAvIDEwMDAgLyA2MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbG90Q291bnQgPSBkdXJhdGlvbk1pbnV0ZXMgLyB0aGF0LnNsb3RNaW51dGVzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZURhdGEuYXZhaWxhYmlsaXR5LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBib29raW5nLmZyb21EYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidG9cIjogYm9va2luZy50b0RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzbG90Q291bnRcIjogc2xvdENvdW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXNCb29rZWRcIjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBzb3J0IHRpbWUgc2xvdCBvYmplY3RzIGJ5IHRoZSBcImZyb21cIiBrZXlcbiAgICAgICAgICAgICAgICAgICAgX3NvcnRCeUtleSggc3BhY2VEYXRhLmF2YWlsYWJpbGl0eSwgJ2Zyb20nICk7XG5cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAvLyBwYXJzZSB0aW1lIHNsb3RzIGFuZCByZXR1cm4gYW4gYXBwcm9wcmlhdGUgc3Vic2V0IChvbmx5IG9wZW4gdG8gY2xvc2UgaG91cnMpXG4gICAgICAgICAgICAgICAgdGltZVNsb3RzQXJyYXkgPSB0aGF0LnBhcnNlU2NoZWR1bGUoc3BhY2VEYXRhLmF2YWlsYWJpbGl0eSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYnVpbGQgc2NoZWR1bGUgSFRNTFxuICAgICAgICAgICAgICAgIHRoYXQuYnVpbGRTY2hlZHVsZSh0aW1lU2xvdHNBcnJheSk7XG5cbiAgICAgICAgICAgICAgICAvLyBFcnJvciBoYW5kbGVyc1xuICAgICAgICAgICAgICAgIHNwYWNlanFYSFIuZmFpbChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJvb2tpbmdzanFYSFIuZmFpbChmdW5jdGlvbihlcnIpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFsd2F5cyhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoYXQudW5zZXRMb2FkaW5nKCk7XG4gICAgICAgICAgICAgICAgdGhhdC4kcmVzZXRTZWxlY3Rpb25CdG4uaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmJ1aWxkU2NoZWR1bGUgPSBmdW5jdGlvbih0aW1lU2xvdHNBcnJheSl7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgaHRtbCA9IFtdO1xuICAgICAgICAgICAgXG4gICAgICAgIC8vIGNvbnN0cnVjdCBIVE1MIGZvciBlYWNoIHRpbWUgc2xvdFxuICAgICAgICB0aW1lU2xvdHNBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0sIGkpe1xuXG4gICAgICAgICAgICB2YXIgZnJvbSA9IG5ldyBEYXRlKCBpdGVtLmZyb20gKSxcbiAgICAgICAgICAgICAgICB0aW1lU3RyaW5nLFxuICAgICAgICAgICAgICAgIGl0ZW1DbGFzcyA9ICcnO1xuXG4gICAgICAgICAgICBpZiAoIGZyb20uZ2V0TWludXRlcygpICE9PSAwICkge1xuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmcgPSB0aGF0LnJlYWRhYmxlVGltZSggZnJvbSwgJ2g6bScgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGltZVN0cmluZyA9IHRoYXQucmVhZGFibGVUaW1lKCBmcm9tLCAnaGEnICk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICggaXRlbS5pc0Jvb2tlZCAmJiBpdGVtLmhhc093blByb3BlcnR5KCdzbG90Q291bnQnKSApIHtcbiAgICAgICAgICAgICAgICBpdGVtQ2xhc3MgPSAnY2NsLWlzLW9jY3VwaWVkIGNjbC1kdXJhdGlvbi0nICsgaXRlbS5zbG90Q291bnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGJ1aWxkIHNlbGVjdGFibGUgdGltZSBzbG90c1xuICAgICAgICAgICAgaHRtbC5wdXNoKCB0aGF0LmJ1aWxkVGltZVNsb3Qoe1xuICAgICAgICAgICAgICAgIGlkOiAnc2xvdC0nICsgdGhhdC5yb29tSWQgKyAnLScgKyBpLFxuICAgICAgICAgICAgICAgIGZyb206IGl0ZW0uZnJvbSxcbiAgICAgICAgICAgICAgICB0bzogaXRlbS50byxcbiAgICAgICAgICAgICAgICB0aW1lU3RyaW5nOiB0aW1lU3RyaW5nLFxuICAgICAgICAgICAgICAgIGNsYXNzOiBpdGVtQ2xhc3NcbiAgICAgICAgICAgIH0pICk7XG4gICAgICAgIFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cyA9IFtdO1xuXG4gICAgICAgIHRoaXMuJHJvb21TY2hlZHVsZS5odG1sKCBodG1sLmpvaW4oJycpICk7XG5cbiAgICAgICAgdGhpcy4kcm9vbVNsb3RJbnB1dHMgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtcm9vbV9fc2xvdCBbdHlwZT1cImNoZWNrYm94XCJdJyk7XG5cbiAgICAgICAgdGhpcy5zZXRDdXJyZW50RHVyYXRpb25UZXh0KCk7XG5cbiAgICAgICAgdGhpcy5pbml0U2xvdEV2ZW50cygpO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5idWlsZFRpbWVTbG90ID0gZnVuY3Rpb24odmFycyl7XG4gICAgICAgIFxuICAgICAgICBpZiAoICEgdmFycyB8fCB0eXBlb2YgdmFycyAhPT0gJ29iamVjdCcgKSB7XG4gICAgICAgICAgICByZXR1cm4gJyc7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBjbGFzczogJycsXG4gICAgICAgICAgICBpZDogJycsXG4gICAgICAgICAgICBkaXNhYmxlZDogJycsXG4gICAgICAgICAgICBmcm9tOiAnJyxcbiAgICAgICAgICAgIHRvOiAnJyxcbiAgICAgICAgICAgIHRpbWVTdHJpbmc6ICcnXG4gICAgICAgIH07XG4gICAgICAgIHZhcnMgPSAkLmV4dGVuZChkZWZhdWx0cywgdmFycyk7XG5cbiAgICAgICAgdmFyIHRlbXBsYXRlID0gJycgK1xuICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy1yb29tX19zbG90ICcgKyB2YXJzLmNsYXNzICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgaWQ9XCInICsgdmFycy5pZCArICdcIiBuYW1lPVwiJyArIHZhcnMuaWQgKyAnXCIgdmFsdWU9XCInICsgdmFycy5mcm9tICsgJ1wiIGRhdGEtdG89XCInICsgdmFycy50byArICdcIiAnICsgdmFycy5kaXNhYmxlZCArICcvPicgK1xuICAgICAgICAgICAgICAgICc8bGFiZWwgY2xhc3M9XCJjY2wtYy1yb29tX19zbG90LWxhYmVsXCIgZm9yPVwiJyArIHZhcnMuaWQgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgICAgIHZhcnMudGltZVN0cmluZyArXG4gICAgICAgICAgICAgICAgJzwvbGFiZWw+JyArXG4gICAgICAgICAgICAnPC9kaXY+JztcblxuICAgICAgICByZXR1cm4gdGVtcGxhdGU7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5wYXJzZVNjaGVkdWxlID0gZnVuY3Rpb24oc2NoZWR1bGVBcnJheSl7XG4gICAgICAgIC8vIHJldHVybnMgdGhlIGFwcHJvcHJpYXRlIHNjaGVkdWxlIGZvciBhIGdpdmVuIGFycmF5IG9mIHRpbWUgc2xvdHNcbiAgICAgICAgXG4gICAgICAgIHZhciB0byA9IG51bGwsXG4gICAgICAgICAgICBzdGFydEVuZEluZGV4ZXMgPSBbXSwgXG4gICAgICAgICAgICBzdGFydCwgZW5kO1xuXG4gICAgICAgIC8vIGxvb3AgdGhyb3VnaCBhcnJheSBhbmQgcGljayBvdXQgdGltZSBnYXBzXG4gICAgICAgIHNjaGVkdWxlQXJyYXkuZm9yRWFjaChmdW5jdGlvbihpdGVtLGkpe1xuICAgICAgICAgICAgaWYgKCB0byAmJiB0byAhPT0gaXRlbS5mcm9tICkge1xuICAgICAgICAgICAgICAgIHN0YXJ0RW5kSW5kZXhlcy5wdXNoKGkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdG8gPSBpdGVtLnRvO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyBkZXBlbmRpbmcgb24gbnVtYmVyIG9mIGdhcHMgZm91bmQsIGRldGVybWluZSBzdGFydCBhbmQgZW5kIGluZGV4ZXNcbiAgICAgICAgaWYgKCBzdGFydEVuZEluZGV4ZXMubGVuZ3RoID49IDIgKSB7XG4gICAgICAgICAgICBzdGFydCA9IHN0YXJ0RW5kSW5kZXhlc1swXTtcbiAgICAgICAgICAgIGVuZCA9IHN0YXJ0RW5kSW5kZXhlc1sxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gMDtcbiAgICAgICAgICAgIGlmICggc3RhcnRFbmRJbmRleGVzLmxlbmd0aCA9PT0gMSApIHtcbiAgICAgICAgICAgICAgICBlbmQgPSBzdGFydEVuZEluZGV4ZXNbMF07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGVuZCA9IHNjaGVkdWxlQXJyYXkubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyByZXR1cm5lZCBzbGljZWQgcG9ydGlvbiBvZiBvcmlnaW5hbCBzY2hlZHVsZVxuICAgICAgICByZXR1cm4gc2NoZWR1bGVBcnJheS5zbGljZShzdGFydCxlbmQpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdEZvcm1FdmVudHMgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0bi5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJCh0aGF0LnNlbGVjdGVkU2xvdElucHV0cykuZWFjaChmdW5jdGlvbihpLGlucHV0KXtcbiAgICAgICAgICAgICAgICAkKGlucHV0KVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIC5jaGFuZ2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5yZW1vdmVDbGFzcygnY2NsLWlzLWRpc2FibGVkJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGVsLnN1Ym1pdChmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhhdC5vblN1Ym1pdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRmb3JtUmVsb2FkLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGF0LnJlbG9hZEZvcm0oKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXREYXRlRXZlbnRzID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRkYXRlU2VsZWN0LmNoYW5nZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhhdC5vbkRhdGVDaGFuZ2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uRGF0ZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5kYXRlWW1kID0gdGhpcy4kZGF0ZVNlbGVjdC52YWwoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0TG9hZGluZygpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2NoZWR1bGVEYXRhKCk7XG4gICAgICAgIFxuICAgIH07XG4gICAgICAgIFxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0U2xvdEV2ZW50cyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIGlmICggdGhpcy4kcm9vbVNsb3RJbnB1dHMgJiYgdGhpcy4kcm9vbVNsb3RJbnB1dHMubGVuZ3RoICl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGlucHV0IGNoYW5nZSBldmVudCBoYW5kbGVyXG4gICAgICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cy5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHRoYXQub25TbG90Q2hhbmdlKGlucHV0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblNsb3RDaGFuZ2UgPSBmdW5jdGlvbihjaGFuZ2VkSW5wdXQpe1xuICAgICAgICBcbiAgICAgICAgLy8gaWYgaW5wdXQgY2hlY2tlZCwgYWRkIGl0IHRvIHNlbGVjdGVkIHNldFxuICAgICAgICBpZiAoICQoY2hhbmdlZElucHV0KS5wcm9wKCdjaGVja2VkJykgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnB1c2goY2hhbmdlZElucHV0KTtcbiAgICAgICAgICAgICQoY2hhbmdlZElucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG4gICBcbiAgICAgICAgfSBcbiAgICAgICAgXG4gICAgICAgIC8vIGlmIGlucHV0IHVuY2hlY2tlZCwgcmVtb3ZlIGl0IGZyb20gdGhlIHNlbGVjdGVkIHNldFxuICAgICAgICBlbHNlIHsgXG5cbiAgICAgICAgICAgIHZhciBjaGFuZ2VkSW5wdXRJbmRleCA9IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2YoY2hhbmdlZElucHV0KTtcblxuICAgICAgICAgICAgaWYgKCBjaGFuZ2VkSW5wdXRJbmRleCA+IC0xICkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnNwbGljZSggY2hhbmdlZElucHV0SW5kZXgsIDEgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoY2hhbmdlZElucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG5cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzbG90cyB3aGljaCBjYW4gbm93IGJlIGNsaWNrYWJsZVxuICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdGFibGVTbG90cygpO1xuICAgICAgICBcbiAgICAgICAgLy8gdXBkYXRlIGJ1dHRvbiBzdGF0ZXNcbiAgICAgICAgaWYgKCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4uc2hvdygpO1xuICAgICAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0bi5oaWRlKCk7IFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIHRleHRcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50RHVyYXRpb25UZXh0KCk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnVwZGF0ZVNlbGVjdGFibGVTbG90cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAvLyBJRiB0aGVyZSBhcmUgc2VsZWN0ZWQgc2xvdHNcbiAgICAgICAgaWYgKCB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggKXtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBmaXJzdCwgc29ydCB0aGUgc2VsZWN0ZWQgc2xvdHNcbiAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzLnNvcnQoZnVuY3Rpb24oYSxiKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykgPiBiLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBncmFiIHRoZSBmaXJzdCBhbmQgbGFzdCBzZWxlY3RlZCBzbG90c1xuICAgICAgICAgICAgdmFyIG1pbklucHV0ID0gdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHNbMF0sXG4gICAgICAgICAgICAgICAgbWF4SW5wdXQgPSB0aGF0LnNlbGVjdGVkU2xvdElucHV0c1t0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbmRleGVzIG9mIHRoZSBmaXJzdCBhbmQgbGFzdCBzbG90cyBmcm9tIHRoZSAkcm9vbVNsb3RJbnB1dHMgalF1ZXJ5IG9iamVjdFxuICAgICAgICAgICAgdmFyIG1pbkluZGV4ID0gdGhhdC4kcm9vbVNsb3RJbnB1dHMuaW5kZXgobWluSW5wdXQpLFxuICAgICAgICAgICAgICAgIG1heEluZGV4ID0gdGhhdC4kcm9vbVNsb3RJbnB1dHMuaW5kZXgobWF4SW5wdXQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIG1pbiBhbmQgbWF4IHNsb3QgaW5kZXhlcyB3aGljaCBhcmUgc2VsZWN0YWJsZVxuICAgICAgICAgICAgdmFyIG1pbkFsbG93YWJsZSA9IG1heEluZGV4IC0gdGhhdC5tYXhTbG90cyxcbiAgICAgICAgICAgICAgICBtYXhBbGxvd2FibGUgPSBtaW5JbmRleCArIHRoYXQubWF4U2xvdHM7XG4gICAgXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggcm9vbSBzbG90cyBhbmQgdXBkYXRlIHRoZW0gYWNjb3JkaW5nbHlcbiAgICAgICAgICAgIHRoYXQuJHJvb21TbG90SW5wdXRzLmVhY2goZnVuY3Rpb24oaSwgaW5wdXQpe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGVuYWJsZXMgb3IgZGlzYWJsZXMgZGVwZW5kaW5nIG9uIHdoZXRoZXIgc2xvdCBmYWxscyB3aXRoaW4gcmFuZ2VcbiAgICAgICAgICAgICAgICBpZiAoIG1pbkFsbG93YWJsZSA8IGkgJiYgaSA8IG1heEFsbG93YWJsZSApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5lbmFibGVTbG90KGlucHV0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmRpc2FibGVTbG90KGlucHV0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYWRkIGEgY2xhc3MgdG8gdGhlIHNsb3RzIHRoYXQgZmFsbCBiZXR3ZWVuIHRoZSBtaW4gYW5kIG1heCBzZWxlY3RlZCBzbG90c1xuICAgICAgICAgICAgICAgIGlmICggbWluSW5kZXggPCBpICYmIGkgPCBtYXhJbmRleCApIHtcbiAgICAgICAgICAgICAgICAgICAgJChpbnB1dCkucGFyZW50KCkuYWRkQ2xhc3MoJ2NjbC1pcy1iZXR3ZWVuJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChpbnB1dCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1iZXR3ZWVuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB9IFxuICAgICAgICAvLyBFTFNFIG5vIHNlbGVjdGVkIHNsb3RzXG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBlbmFibGUgYWxsIHNsb3RzXG4gICAgICAgICAgICB0aGF0LiRyb29tU2xvdElucHV0cy5lYWNoKGZ1bmN0aW9uKGksIGlucHV0KXtcbiAgICAgICAgICAgICAgICB0aGF0LmVuYWJsZVNsb3QoaW5wdXQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmNsZWFyU2xvdCA9IGZ1bmN0aW9uKHNsb3QpIHtcbiAgICAgICAgLy8gc2xvdCBjYW4gYmUgZWl0aGVyIHRoZSBjaGVja2JveCBpbnB1dCAtT1ItIHRoZSBjaGVja2JveCdzIGNvbnRhaW5lclxuXG4gICAgICAgIHZhciBpbnB1dEluZGV4O1xuXG4gICAgICAgIC8vIGlmIGl0J3MgdGhlIGNoZWNrYm94LlxuICAgICAgICBpZiAoICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSApIHtcbiAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5lbmFibGVTbG90KHNsb3QpO1xuXG4gICAgICAgICAgICAvLyBnZXQgaW5kZXggb2YgdGhlIGlucHV0IGZyb20gc2VsZWN0ZWQgc2V0XG4gICAgICAgICAgICBpbnB1dEluZGV4ID0gdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZihzbG90KTtcbiAgICAgICAgICAgIFxuICAgICAgICAvLyBpZiBpdCdzIHRoZSBjb250YWluZXJcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdmFyICRpbnB1dCA9ICQoc2xvdCkuZmluZCgnW3R5cGU9XCJjaGVja2JveFwiXScpO1xuXG4gICAgICAgICAgICB0aGlzLmVuYWJsZVNsb3QoJGlucHV0WzBdKTtcblxuICAgICAgICAgICAgLy8gZ2V0IGluZGV4IG9mIHRoZSBpbnB1dCBmcm9tIHNlbGVjdGVkIHNldFxuICAgICAgICAgICAgaW5wdXRJbmRleCA9IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2YoICRpbnB1dFswXSApO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgaW5wdXQgZnJvbSBzZWxlY3RlZCBzZXRcbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuc3BsaWNlKCBpbnB1dEluZGV4LCAxICk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmNsZWFyQWxsU2xvdHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4uaGlkZSgpO1xuICAgICAgICBcbiAgICAgICAgLy8gRXh0ZW5kIHRoZSBzZWxlY3RlZCBpbnB1dHMgYXJyYXkgdG8gYSBuZXcgdmFyaWFibGUuXG4gICAgICAgIC8vIFRoZSBzZWxlY3RlZCBpbnB1dHMgYXJyYXkgY2hhbmdlcyB3aXRoIGV2ZXJ5IGNsZWFyU2xvdCgpIGNhbGxcbiAgICAgICAgLy8gc28sIGJlc3QgdG8gbG9vcCB0aHJvdWdoIGFuIHVuY2hhbmdpbmcgYXJyYXkuXG4gICAgICAgIHZhciBzZWxlY3RlZElucHV0cyA9ICQuZXh0ZW5kKCBbXSwgdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMgKTtcblxuICAgICAgICAkKHNlbGVjdGVkSW5wdXRzKS5lYWNoKGZ1bmN0aW9uKGksaW5wdXQpe1xuICAgICAgICAgICAgdGhhdC5jbGVhclNsb3QoaW5wdXQpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuYWN0aXZhdGVTbG90ID0gZnVuY3Rpb24oc2xvdCkge1xuICAgICAgICAvLyBzbG90IGNhbiBiZSBlaXRoZXIgdGhlIGNoZWNrYm94IC1PUi0gdGhlIGNoZWNrYm94J3MgY29udGFpbmVyXG5cbiAgICAgICAgdmFyIHNsb3RJc0NoZWNrYm94ID0gJChzbG90KS5pcygnW3R5cGU9XCJjaGVja2JveFwiXScpLFxuICAgICAgICAgICAgJGNvbnRhaW5lciA9IHNsb3RJc0NoZWNrYm94ID8gJChzbG90KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykgOiAkKHNsb3QpO1xuXG4gICAgICAgIC8vIG5ldmVyIHNldCBhbiBvY2N1cGllZCBzbG90IGFzIGFjdGl2ZVxuICAgICAgICBpZiAoICRjb250YWluZXIuaGFzQ2xhc3MoJ2NjbC1pcy1vY2N1cGllZCcpICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAkKHNsb3QpLmlzKCdbdHlwZT1cImNoZWNrYm94XCJdJykgKSB7XG5cbiAgICAgICAgICAgIC8vIGlmIGl0J3MgdGhlIGNoZWNrYm94LlxuICAgICAgICAgXG4gICAgICAgICAgICAkKHNsb3QpLnByb3AoJ2NoZWNrZWQnLHRydWUpO1xuICAgICAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcygnY2NsLWlzLWNoZWNrZWQnKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBpZiBpdCdzIHRoZSBjb250YWluZXJcblxuICAgICAgICAgICAgJGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnY2NsLWlzLWNoZWNrZWQnKVxuICAgICAgICAgICAgICAgIC5maW5kKCdbdHlwZT1cImNoZWNrYm94XCJdJylcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLHRydWUpO1xuXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmVuYWJsZVNsb3QgPSBmdW5jdGlvbihzbG90KSB7XG4gICAgICAgICQoc2xvdClcbiAgICAgICAgICAgIC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKVxuICAgICAgICAgICAgLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLWlzLWRpc2FibGVkJyk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5kaXNhYmxlU2xvdCA9IGZ1bmN0aW9uKHNsb3QpIHtcbiAgICAgICAgJChzbG90KVxuICAgICAgICAgICAgLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICAgICAgICAgIC5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuc2V0TG9hZGluZyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQudGV4dCgnTG9hZGluZyBzY2hlZHVsZS4uLicpO1xuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnVuc2V0TG9hZGluZyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuc2V0Q3VycmVudER1cmF0aW9uVGV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSAkLmV4dGVuZChbXSx0aGlzLnNlbGVjdGVkU2xvdElucHV0cyksXG4gICAgICAgICAgICBzb3J0ZWRTZWxlY3Rpb24gPSBzZWxlY3Rpb24uc29ydChmdW5jdGlvbihhLGIpeyBcbiAgICAgICAgICAgICAgICByZXR1cm4gYS52YWx1ZSA+IGIudmFsdWU7IFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBzZWxlY3Rpb25MZW5ndGggPSBzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoO1xuICAgICAgICBcbiAgICAgICAgaWYgKCBzZWxlY3Rpb25MZW5ndGggPiAwICkge1xuXG4gICAgICAgICAgICB2YXIgdGltZTFWYWwgPSBzb3J0ZWRTZWxlY3Rpb25bMF0udmFsdWUsXG4gICAgICAgICAgICAgICAgcmVhZGFibGVUaW1lMSA9IHRoaXMucmVhZGFibGVUaW1lKCBuZXcgRGF0ZSh0aW1lMVZhbCkgKTtcblxuICAgICAgICAgICAgdmFyIHRpbWUyVmFsID0gKCBzZWxlY3Rpb25MZW5ndGggPj0gMiApID8gc29ydGVkU2VsZWN0aW9uW3NvcnRlZFNlbGVjdGlvbi5sZW5ndGggLSAxXS52YWx1ZSA6IHRpbWUxVmFsLFxuICAgICAgICAgICAgICAgIHRpbWUyVCA9IG5ldyBEYXRlKHRpbWUyVmFsKS5nZXRUaW1lKCkgKyAoIHRoaXMuc2xvdE1pbnV0ZXMgKiA2MCAqIDEwMDAgKSxcbiAgICAgICAgICAgICAgICByZWFkYWJsZVRpbWUyID0gdGhpcy5yZWFkYWJsZVRpbWUoIG5ldyBEYXRlKHRpbWUyVCkgKTtcblxuICAgICAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dC50ZXh0KCAnRnJvbSAnICsgcmVhZGFibGVUaW1lMSArICcgdG8gJyArIHJlYWRhYmxlVGltZTIgKTtcblxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dC50ZXh0KCdQbGVhc2Ugc2VsZWN0IGF2YWlsYWJsZSB0aW1lIHNsb3RzJyk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5zZXRNYXhUaW1lVGV4dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBtYXhNaW51dGVzID0gdGhpcy5tYXhTbG90cyAqIHRoaXMuc2xvdE1pbnV0ZXMsXG4gICAgICAgICAgICBtYXhUZXh0O1xuXG4gICAgICAgIGlmICggbWF4TWludXRlcyA+IDYwICkge1xuICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgLyA2MCArICcgaG91cnMnOyAgICBcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyArICcgbWludXRlcyc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRtYXhUaW1lLnRleHQoIG1heFRleHQgKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnJlYWRhYmxlVGltZSA9IGZ1bmN0aW9uKCBkYXRlT2JqLCBmb3JtYXQgKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgbG9jYWxlU3RyaW5nID0gZGF0ZU9iai50b0xvY2FsZVN0cmluZyggdGhpcy5sb2NhbGUsIHRoaXMudGltZVpvbmUgKSwgLy8gZS5nLiAtLT4gXCIxMS83LzIwMTcsIDQ6Mzg6MzMgQU1cIlxuICAgICAgICAgICAgbG9jYWxlVGltZSA9IGxvY2FsZVN0cmluZy5zcGxpdChcIiwgXCIpWzFdOyAvLyBcIjQ6Mzg6MzMgQU1cIlxuXG4gICAgICAgIHZhciB0aW1lID0gbG9jYWxlVGltZS5zcGxpdCgnICcpWzBdLCAvLyBcIjQ6Mzg6MzNcIixcbiAgICAgICAgICAgIHRpbWVPYmogPSB7XG4gICAgICAgICAgICAgICAgYTogbG9jYWxlVGltZS5zcGxpdCgnICcpWzFdLnRvTG93ZXJDYXNlKCksIC8vIChhbSBvciBwbSkgLS0+IFwiYVwiXG4gICAgICAgICAgICAgICAgaDogdGltZS5zcGxpdCgnOicpWzBdLCAvLyBcIjRcIlxuICAgICAgICAgICAgICAgIG06IHRpbWUuc3BsaXQoJzonKVsxXSwgLy8gXCIzOFwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGlmICggZm9ybWF0ICYmIHR5cGVvZiBmb3JtYXQgPT09ICdzdHJpbmcnICkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgZm9ybWF0QXJyID0gZm9ybWF0LnNwbGl0KCcnKSxcbiAgICAgICAgICAgICAgICByZWFkYWJsZUFyciA9IFtdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBmb3JtYXRBcnIubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCB0aW1lT2JqW2Zvcm1hdEFycltpXV0gKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlQXJyLnB1c2godGltZU9ialtmb3JtYXRBcnJbaV1dKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWFkYWJsZUFyci5wdXNoKGZvcm1hdEFycltpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVhZGFibGVBcnIuam9pbignJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aW1lT2JqLmggKyAnOicgKyB0aW1lT2JqLm0gKyB0aW1lT2JqLmE7XG4gICAgICAgIFxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TdWJtaXQgPSBmdW5jdGlvbihldmVudCl7XG5cbiAgICAgICAgaWYgKCAhIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCApIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy4kZm9ybU5vdGlmaWNhdGlvblxuICAgICAgICAgICAgICAgIC5jc3MoJ2Rpc3BsYXknLCdub25lJylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1pcy1lcnJvcicpXG4gICAgICAgICAgICAgICAgLnRleHQoJ1BsZWFzZSBzZWxlY3QgYSB0aW1lIGZvciB5b3VyIHJlc2VydmF0aW9uJylcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8odGhpcy4kZm9ybUNvbnRlbnQpXG4gICAgICAgICAgICAgICAgLnNsaWRlRG93bihDQ0wuRFVSQVRJT04pOyAgICAgICAgICAgIFxuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZm9ybU5vdGlmaWNhdGlvbi5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIHNvcnRlZFNlbGVjdGlvbiA9ICQuZXh0ZW5kKFtdLCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cykuc29ydChmdW5jdGlvbihhLGIpe1xuICAgICAgICAgICAgICAgIHJldHVybiBhLnZhbHVlID4gYi52YWx1ZTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgc3RhcnQgPSBzb3J0ZWRTZWxlY3Rpb25bMF0udmFsdWUsXG4gICAgICAgICAgICBlbmQgPSAoIHNvcnRlZFNlbGVjdGlvbi5sZW5ndGggPiAxICkgPyAkKCBzb3J0ZWRTZWxlY3Rpb25bIHNvcnRlZFNlbGVjdGlvbi5sZW5ndGggLSAxIF0gKS5kYXRhKCd0bycpIDogJCggc29ydGVkU2VsZWN0aW9uWzBdICkuZGF0YSgndG8nKSxcbiAgICAgICAgICAgIHBheWxvYWQgPSB7XG4gICAgICAgICAgICAgICAgXCJpaWRcIjozMzMsXG4gICAgICAgICAgICAgICAgXCJzdGFydFwiOiBzdGFydCxcbiAgICAgICAgICAgICAgICBcImZuYW1lXCI6IHRoaXMuJGVsWzBdLmZuYW1lLnZhbHVlLFxuICAgICAgICAgICAgICAgIFwibG5hbWVcIjogdGhpcy4kZWxbMF0ubG5hbWUudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJlbWFpbFwiOiB0aGlzLiRlbFswXS5lbWFpbC52YWx1ZSxcbiAgICAgICAgICAgICAgICBcIm5pY2tuYW1lXCI6IHRoaXMuJGVsWzBdLm5pY2tuYW1lLnZhbHVlLFxuICAgICAgICAgICAgICAgIFwiYm9va2luZ3NcIjpbXG4gICAgICAgICAgICAgICAgICAgIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMucm9vbUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBlbmRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1zdWJtaXR0aW5nJyk7XG4gICAgICAgIHRoaXMuJGZvcm1DYW5jZWwucHJvcCgnZGlzYWJsZWQnLHRydWUpO1xuICAgICAgICB0aGlzLiRmb3JtU3VibWl0LnRleHQoJ1NlbmRpbmcuLi4nKS5wcm9wKCdkaXNhYmxlZCcsdHJ1ZSk7XG5cbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBhY3Rpb246ICdyZXF1ZXN0X2Jvb2tpbmcnLFxuICAgICAgICAgICAgY2NsX25vbmNlOiBDQ0wubm9uY2UsXG4gICAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIE1ha2UgYSByZXF1ZXN0IGhlcmUgdG8gcmVzZXJ2ZSBzcGFjZVxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgJC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IENDTC5hamF4X3VybCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIF9oYW5kbGVTdWJtaXRSZXNwb25zZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zdWJtaXR0aW5nJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBfaGFuZGxlU3VibWl0UmVzcG9uc2UocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgdmFyIHJlc3BvbnNlSFRNTCxcbiAgICAgICAgICAgICAgICByZXNwb25zZU9iamVjdCA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuXG4gICAgICAgICAgICBpZiAoIHJlc3BvbnNlT2JqZWN0LmJvb2tpbmdfaWQgKSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MID0gIFsnPHAgY2xhc3M9XCJjY2wtaDIgY2NsLXUtbXQtMFwiPlN1Y2Nlc3MhPC9wPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cCBjbGFzcz1cImNjbC1oNFwiPllvdXIgYm9va2luZyBJRCBpcyA8c3BhbiBjbGFzcz1cImNjbC11LWNvbG9yLXNjaG9vbFwiPicgKyByZXNwb25zZU9iamVjdC5ib29raW5nX2lkICsgJzwvc3Bhbj48L3A+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxwIGNsYXNzPVwiY2NsLWg0XCI+UGxlYXNlIGNoZWNrIHlvdXIgZW1haWwgdG8gY29uZmlybSB5b3VyIGJvb2tpbmcuPC9wPiddO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwgPSAgWyc8cCBjbGFzcz1cImNjbC1oMyBjY2wtdS1tdC0wXCI+U29ycnksIGJ1dCB3ZSBjb3VsZG5cXCd0IHByb2Nlc3MgeW91ciByZXNlcnZhdGlvbi48L3A+JywnPHAgY2xhc3M9XCJjY2wtaDRcIj5FcnJvcnM6PC9wPiddO1xuICAgICAgICAgICAgICAgICQocmVzcG9uc2VPYmplY3QuZXJyb3JzKS5lYWNoKGZ1bmN0aW9uKGksIGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MLnB1c2goJzxwIGNsYXNzPVwiY2NsLWMtYWxlcnQgY2NsLWlzLWVycm9yXCI+JyArIGVycm9yICsgJzwvcD4nKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwucHVzaCgnPHAgY2xhc3M9XCJjY2wtaDRcIj5QbGVhc2UgdGFsayB0byB5b3VyIG5lYXJlc3QgbGlicmFyaWFuIGZvciBoZWxwLjwvcD4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhhdC4kZm9ybUNhbmNlbC5wcm9wKCdkaXNhYmxlZCcsZmFsc2UpLnRleHQoJ0Nsb3NlJyk7XG4gICAgICAgICAgICB0aGF0LiRmb3JtU3VibWl0LmhpZGUoKTtcbiAgICAgICAgICAgIHRoYXQuJGZvcm1SZWxvYWQuc2hvdygpO1xuXG4gICAgICAgICAgICB0aGF0LiRmb3JtQ29udGVudC5hbmltYXRlKHtvcGFjaXR5OiAwfSwgQ0NMLkRVUkFUSU9OKTtcbiAgICAgICAgICAgIHRoYXQuJGZvcm1SZXNwb25zZVxuICAgICAgICAgICAgICAgIC5kZWxheShDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAgICAgLmFuaW1hdGUoe29wYWNpdHk6IDF9LCBDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAgICAgLmh0bWwocmVzcG9uc2VIVE1MKTtcbiAgICAgICAgICAgIHRoYXQuJGZvcm1Db250ZW50XG4gICAgICAgICAgICAgICAgLmRlbGF5KENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZSh7aGVpZ2h0OiB0aGF0LiRmb3JtUmVzcG9uc2UuaGVpZ2h0KCkgKyAncHgnIH0sIENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuY3NzKHt6SW5kZXg6ICctMSd9KTtcblxuICAgICAgICAgICAgdGhhdC4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zdWJtaXR0aW5nJyk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5yZWxvYWRGb3JtID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGZvcm1DYW5jZWwudGV4dCgnQ2FuY2VsJyk7XG4gICAgICAgIHRoaXMuJGZvcm1TdWJtaXQudGV4dCgnU3VibWl0JykucHJvcCgnZGlzYWJsZWQnLGZhbHNlKS5zaG93KCk7XG4gICAgICAgIHRoaXMuJGZvcm1SZWxvYWQuaGlkZSgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jbGVhckFsbFNsb3RzKCk7XG5cbiAgICAgICAgdGhpcy4kZm9ybVJlc3BvbnNlXG4gICAgICAgICAgICAuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIENDTC5EVVJBVElPTilcbiAgICAgICAgICAgIC5kZWxheShDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAuaHRtbCgnJyk7XG4gICAgICAgIHRoaXMuJGZvcm1Db250ZW50XG4gICAgICAgICAgICAuZGVsYXkoQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgLmNzcyh7IGhlaWdodDogJycsIHpJbmRleDogJycgfSlcbiAgICAgICAgICAgIC5hbmltYXRlKHtvcGFjaXR5OiAxfSwgQ0NMLkRVUkFUSU9OKTtcblxuICAgICAgICB0aGlzLnNldExvYWRpbmcoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMudXBkYXRlU2NoZWR1bGVEYXRhKCk7XG4gICAgfTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAvLyBIZWxwZXJzXG5cbiAgICBmdW5jdGlvbiBfc29ydEJ5S2V5KCBhcnIsIGtleSwgb3JkZXIgKSB7XG4gICAgICAgIGZ1bmN0aW9uIHNvcnRBU0MoYSxiKSB7XG4gICAgICAgICAgICBpZiAoYVtrZXldIDwgYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYVtrZXldID4gYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNvcnRERVNDKGEsYikge1xuICAgICAgICAgICAgaWYgKGFba2V5XSA+IGJba2V5XSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFba2V5XSA8IGJba2V5XSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoICdERVNDJyA9PT0gb3JkZXIgKSB7XG4gICAgICAgICAgICBhcnIuc29ydChzb3J0REVTQyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcnIuc29ydChzb3J0QVNDKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1yb29tLXJlcy1mb3JtJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFJvb21SZXNGb3JtKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU2VhcmNoYm94IEJlaGF2aW9yXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdCBcblx0Ly8gR2xvYmFsIHZhcmlhYmxlc1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG5cdFx0RU5URVIgPSAxMywgVEFCID0gOSwgU0hJRlQgPSAxNiwgQ1RSTCA9IDE3LCBBTFQgPSAxOCwgQ0FQUyA9IDIwLCBFU0MgPSAyNywgTENNRCA9IDkxLCBSQ01EID0gOTIsIExBUlIgPSAzNywgVUFSUiA9IDM4LCBSQVJSID0gMzksIERBUlIgPSA0MCxcblx0XHRmb3JiaWRkZW5LZXlzID0gW0VOVEVSLCBUQUIsIFNISUZULCBDVFJMLCBBTFQsIENBUFMsIEVTQywgTENNRCwgUkNNRCwgTEFSUiwgVUFSUiwgUkFSUiwgREFSUl0sXG5cdFx0aW5kZXhOYW1lcyA9IHtcblx0XHRcdHRpOiAnVGl0bGUnLFxuXHRcdFx0a3c6ICdLZXl3b3JkJyxcblx0XHRcdGF1OiAnQXV0aG9yJyxcblx0XHRcdHN1OiAnU3ViamVjdCdcblx0XHR9O1xuXG5cdC8vIEV4dGVuZCBqUXVlcnkgc2VsZWN0b3Jcblx0JC5leHRlbmQoJC5leHByWyc6J10sIHtcblx0XHRmb2N1c2FibGU6IGZ1bmN0aW9uKGVsLCBpbmRleCwgc2VsZWN0b3Ipe1xuXHRcdFx0cmV0dXJuICQoZWwpLmlzKCdhLCBidXR0b24sIDppbnB1dCwgW3RhYmluZGV4XSwgc2VsZWN0Jyk7XG5cdFx0fVxuXHR9KTtcblx0XHRcbiAgICB2YXIgU2VhcmNoQXV0b2NvbXBsZXRlID0gZnVuY3Rpb24oZWxlbSl7XG5cdFx0XG5cdFx0dGhpcy4kZWxcdFx0XHQ9ICQoZWxlbSk7XG5cdFx0dGhpcy4kZm9ybVx0XHRcdD0gdGhpcy4kZWwuZmluZCgnZm9ybScpO1xuXHRcdHRoaXMuJGlucHV0IFx0XHQ9ICQoZWxlbSkuZmluZCgnI2NjbC1zZWFyY2gnKTtcblx0XHR0aGlzLiRyZXNwb25zZVx0XHQ9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1zZWFyY2gtcmVzdWx0cycpO1xuXHRcdHRoaXMuJHJlc3BvbnNlTGlzdFx0PSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtc2VhcmNoLXJlc3VsdHNfX2xpc3QnKTtcblx0XHR0aGlzLiRyZXNwb25zZUl0ZW1zID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNlYXJjaC1pdGVtJyk7XG5cdFx0dGhpcy4kcmVzdWx0c0xpbmtcdD0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNlYXJjaC1yZXN1bHRzX19mb290ZXInKTtcblx0XHR0aGlzLiRzZWFyY2hJbmRleFx0PSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtc2VhcmNoLWluZGV4Jyk7XG5cdFx0dGhpcy4kaW5kZXhDb250YWluXHQ9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1zZWFyY2gtaW5kZXgtY29udGFpbmVyJyApO1xuXHRcdHRoaXMuJHNlYXJjaFNjb3BlXHQ9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1zZWFyY2gtbG9jYXRpb24nKTtcblx0XHR0aGlzLiR3b3JsZENhdExpbmtcdD0gbnVsbDtcblx0XHRcblx0XHQvL2NoZWNrIHRvIHNlZSBpZiB0aGlzIHNlYXJjaGJveCBoYXMgbGl2ZXNlYXJjaCBlbmFibGVkXG5cdFx0dGhpcy4kYWN0aXZhdGVMaXZlU2VhcmNoXHQ9ICQodGhpcy4kZWwpLmRhdGEoJ2xpdmVzZWFyY2gnKTtcblx0XHR0aGlzLmxvY2F0aW9uVHlwZVx0PSAgJCggdGhpcy4kc2VhcmNoU2NvcGUgKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5kYXRhKCdsb2MnKTtcdFxuXHRcdFxuXHRcdC8vbGlnaHRib3ggZWxlbWVudHNcblx0XHR0aGlzLiRsaWdodGJveCA9IG51bGw7XG5cdFx0dGhpcy5saWdodGJveElzT24gPSBmYWxzZTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICAgICAgXG4gICAgfTtcblxuICAgIFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICBcdFxuICAgIFx0XG4gICAgXHRpZiggdGhpcy4kYWN0aXZhdGVMaXZlU2VhcmNoICl7XG5cdFx0XHQvL2lmIGxpdmVzZWFyY2ggaXMgZW5hYmxlZCwgdGhlbiBydW4gdGhlIEFKQVggcmVzdWx0c1xuXHRcdFx0dGhpcy5pbml0TGl2ZVNlYXJjaCgpO1xuXHRcdFxuICAgIFx0fWVsc2V7XG5cdFx0XHQvL3RoZW4gc2ltcGxlIGdlbmVyYXRlIGdlbmVyaWMgc2VhcmNoIGJveCByZXF1ZXN0c1xuXHRcdFx0dGhpcy5pbml0U3RhdGljU2VhcmNoKCk7XG4gICAgXHR9XG4gICAgXHRcblx0fTtcblx0XG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUudG9nZ2xlSW5kZXggPSBmdW5jdGlvbigpe1xuXHRcdFxuXHRcdC8vd2F0Y2ggZm9yIGNoYW5nZXMgdG8gdGhlIGxvY2F0aW9uIC0gaWYgbm90IGEgV01TIHNpdGUsIHRoZSByZW1vdmUgaW5kZXggYXR0cmlidXRlXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFxuXHRcdHRoaXMuJHNlYXJjaFNjb3BlLm9uKCAnY2hhbmdlJywgZnVuY3Rpb24oKXtcblx0XHRcdFxuXHRcdFx0dGhhdC5nZXRMb2NJRCgpO1x0XHRcdFx0XG5cdFx0XHRcblx0XHRcdGlmKCB0aGF0LmxvY2F0aW9uVHlwZSAhPSAnd21zJyApe1xuXHRcdFx0XHR0aGF0LiRpbmRleENvbnRhaW5cblx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2NjbC1zZWFyY2gtaW5kZXgtZmFkZScpXG5cdFx0XHRcdFx0LmZhZGVPdXQoMjUwKTtcblx0XHRcdH1lbHNlIGlmKCB0aGF0LmxvY2F0aW9uVHlwZSA9PSAnd21zJyApe1xuXHRcdFx0XHR0aGF0LiRpbmRleENvbnRhaW5cblx0XHRcdFx0XHQuZmFkZUluKDI1MClcblx0XHRcdFx0XHQucmVtb3ZlQ2xhc3MoJ2NjbC1zZWFyY2gtaW5kZXgtZmFkZScpO1xuXG5cdFx0XHR9XG5cdFx0XHRcblx0XHR9ICk7XG5cdFx0XHRcblx0fTtcblx0XG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuZ2V0TG9jSUQgPSBmdW5jdGlvbigpe1xuXHRcdC8vZnVuY3Rpb24gdG8gZ2V0IHRoZSBJRCBvZiBsb2NhdGlvblxuXHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHR0aGF0LmxvY2F0aW9uVHlwZSA9ICQoIHRoYXQuJHNlYXJjaFNjb3BlICkuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuYXR0cignZGF0YS1sb2MnKTtcblx0XHRcblx0XHQvL2NvbnNvbGUubG9nKCB0aGF0LmxvY2F0aW9uVHlwZSApO1xuXHR9O1xuXG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuaW5pdExpdmVTZWFyY2ggPSBmdW5jdGlvbigpe1xuXG5cdFx0Ly9BSkFYIGV2ZW50IHdhdGNoaW5nIGZvciB1c2VyIGlucHV0IGFuZCBvdXRwdXR0aW5nIHN1Z2dlc3RlZCByZXN1bHRzXG5cdFx0dmFyIHRoYXQgPSB0aGlzLFxuXHRcdFx0dGltZW91dDtcblx0XHRcblx0XHR0aGlzLmluaXRMaWdodEJveCgpO1xuXHRcdHRoaXMudG9nZ2xlSW5kZXgoKTtcblx0XHRcblx0XHQvL2tleWJvYXJkIGV2ZW50cyBmb3Igc2VuZGluZyBxdWVyeSB0byBkYXRhYmFzZVxuXHRcdHRoaXMuJGlucHV0XG5cdFx0XHQub24oJ2tleXVwJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cblx0XHRcdFx0Ly8gY2xlYXIgYW55IHByZXZpb3VzIHNldCB0aW1lb3V0XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aGF0LnRpbWVvdXQpO1xuXG5cdFx0XHRcdC8vIGlmIGtleSBpcyBmb3JiaWRkZW4sIHJldHVyblxuXHRcdFx0XHRpZiAoIGZvcmJpZGRlbktleXMuaW5kZXhPZiggZXZlbnQua2V5Q29kZSApID4gLTEgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZ2V0IHZhbHVlIG9mIHNlYXJjaCBpbnB1dFxuXHRcdFx0XHR2YXIgcXVlcnkgPSB0aGF0LiRpbnB1dC52YWwoKTtcblx0XHRcdFx0Ly9yZW1vdmUgZG91YmxlIHF1b3RhdGlvbnMgYW5kIG90aGVyIGNoYXJhY3RlcnMgZnJvbSBzdHJpbmdcblx0XHRcdFx0cXVlcnkgPSBxdWVyeS5yZXBsYWNlKC9bXmEtekEtWjAtOSAtJy4sXS9nLCBcIlwiKTtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhxdWVyeSk7XG5cblx0XHRcdFx0Ly8gc2V0IGEgdGltZW91dCBmdW5jdGlvbiB0byB1cGRhdGUgcmVzdWx0cyBvbmNlIDYwMG1zIHBhc3Nlc1xuXHRcdFx0XHR0aGF0LnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdGlmICggcXVlcnkubGVuZ3RoID4gMSApIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0Ly9zZXQgdGhpcyB2ZXJpYWJsZSBoZXJlIGN1eiB3ZSBhcmUgZ29pbmcgdG8gbmVlZCBpdCBsYXRlclxuXHRcdFx0XHRcdFx0dGhhdC5nZXRMb2NJRCgpO1x0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0dGhhdC4kcmVzcG9uc2Uuc2hvdygpO1xuXHRcdFx0XHRcdCBcdHRoYXQuZmV0Y2hSZXN1bHRzKCBxdWVyeSApO1xuXHRcdFx0XHRcdCBcdFxuXHRcdFx0XHRcdCBcdFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHRoYXQuJHJlc3BvbnNlTGlzdC5odG1sKCcnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSwgMjAwKTtcblxuXHRcdFx0fSlcblx0XHRcdC5mb2N1cyhmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAoIHRoYXQuJGlucHV0LnZhbCgpICE9PSAnJyApIHtcblx0XHRcdFx0XHR0aGF0LiRyZXNwb25zZS5zaG93KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuYmx1cihmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsIF9vbkJsdXJyZWRDbGljayk7XG5cdFx0XHR9KTtcblx0XHRcblx0XHRmdW5jdGlvbiBfb25CbHVycmVkQ2xpY2soZXZlbnQpIHtcblx0XHRcdFxuXHRcdFx0aWYgKCAhICQuY29udGFpbnMoIHRoYXQuJGVsWzBdLCBldmVudC50YXJnZXQgKSApIHtcblx0XHRcdFx0dGhhdC4kcmVzcG9uc2UuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0XHRcdFx0XG5cdFx0XHQkKGRvY3VtZW50KS5vZmYoJ2NsaWNrJywgX29uQmx1cnJlZENsaWNrKTtcblxuXHRcdH1cdFx0XG5cblx0XHQvL3NlbmQgcXVlcnkgdG8gZGF0YWJhc2UgYmFzZWQgb24gb3B0aW9uIGNoYW5nZVxuXHRcdHRoaXMuJHNlYXJjaEluZGV4LmFkZCh0aGlzLiRzZWFyY2hTY29wZSkuY2hhbmdlKGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGF0Lm9uU2VhcmNoSW5kZXhDaGFuZ2UoKTtcblx0XHR9KTtcblx0XHRcblx0XHQvL29uIHN1Ym1pdCBmaXJlIG9mZiBjYXRhbG9nIHNlYXJjaCB0byBXTVNcblx0XHR0aGlzLiRmb3JtLm9uKCdzdWJtaXQnLCAge3RoYXQ6IHRoaXMgfSAsIHRoYXQuaGFuZGxlU3VibWl0ICk7XG5cdFx0XHRcblx0fTtcblx0XG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuaW5pdFN0YXRpY1NlYXJjaCA9IGZ1bmN0aW9uKCl7XG5cdFx0Ly9pZiBzdGF0aWMsIG5vIEFKQVggd2F0Y2hpbmcsIGluIHRoaXMgY2FzZSAtIGp1c3QgbG9va2luZyBmb3Igc3VibWlzc2lvbnNcblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XG5cdFx0dGhpcy50b2dnbGVJbmRleCgpO1xuXHRcdFxuXHRcdC8vb24gc3VibWl0IGZpcmUgb2ZmIGNhdGFsb2cgc2VhcmNoIHRvIFdNU1xuXHRcdHRoaXMuJGZvcm0ub24oJ3N1Ym1pdCcsICB7dGhhdDogdGhpcyB9ICwgdGhhdC5oYW5kbGVTdWJtaXQgKTtcdFx0XG5cdFx0XG5cdH07XG5cdFxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmhhbmRsZVN1Ym1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcblx0XHR2YXIgdGhhdCA9IGV2ZW50LmRhdGEudGhhdDtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcblx0XHRcdGlmKHRoYXQuJGFjdGl2YXRlTGl2ZVNlYXJjaCl7XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aGF0LnRpbWVvdXQpO1x0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vZ2V0IHNlYXJjaCBpbmRleCBhbmQgaW5wdXQgdmFsdWVcblx0XHRcdHZhciBzZWFyY2hJbmRleCA9IHRoYXQuJHNlYXJjaEluZGV4LnZhbCgpO1xuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gdGhhdC4kaW5wdXQudmFsKCk7XG5cdFx0XHRcblx0XHRcdC8vY2hlY2sgbG9jYXRpb24gdHlwZVxuXHRcdFx0dGhhdC5nZXRMb2NJRCgpO1xuXHRcdFx0XG5cdFx0XHQvL2lmIHRoaXMgVVJMIGlzIGZvciBXTVMsIHRoZW4gYXBwZW5kIHRoZSBzZWFyY2hpbmRleCB0byBpdCwgaWYgbm90LCB0aGVuIHNlbnQgcXVlcnlTdHJpbmcgb25seVxuXHRcdFx0Ly9zZXR1cCBhcnJheSBmb3IgY29uc3RydWN0U2VhcmNoVVJMKClcblx0XHRcdHZhciBpbnB1dE9iamVjdCA9IHt9O1xuXHRcdFx0aW5wdXRPYmplY3QucXVlcnlTdHJpbmdcdD0gKHRoYXQubG9jYXRpb25UeXBlID09PSAnd21zJykgPyAgc2VhcmNoSW5kZXggKyBcIjpcIiArIHF1ZXJ5U3RyaW5nIDogcXVlcnlTdHJpbmc7XG5cdFx0XHRpbnB1dE9iamVjdC5zZWFyY2hTY29wZVx0PSB0aGF0LiRzZWFyY2hTY29wZS52YWwoKTtcblxuXHRcdFx0Ly9pZiBxdWVyeSBzdHJpbmcgaGFzIGNvbnRlbnQsIHRoZW4gcnVuXG5cdFx0XHRpZiAoIHF1ZXJ5U3RyaW5nLmxlbmd0aCA+IDEgKSB7XG5cblx0XHRcdFx0dmFyIHdtc0NvbnN0cnVjdGVkVXJsID0gdGhhdC5jb25zdHJ1Y3RTZWFyY2hVUkwoaW5wdXRPYmplY3QpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyggd21zQ29uc3RydWN0ZWRVcmwgKTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmKCB0aGF0LmxvY2F0aW9uVHlwZSA9PT0gJ3dwX2NjbCcgKXtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR3aW5kb3cub3Blbih3bXNDb25zdHJ1Y3RlZFVybCwgJ19zZWxmJyk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0JCh3aW5kb3cpLnVubG9hZCggZnVuY3Rpb24oKXtcblxuXHRcdFx0XHRcdFx0dGhhdC4kc2VhcmNoU2NvcGUucHJvcCggJ3NlbGVjdGVkSW5kZXgnLCAwICk7XG5cdFx0XHRcdFx0fSk7XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR3aW5kb3cub3Blbih3bXNDb25zdHJ1Y3RlZFVybCwgJ19ibGFuaycpO1x0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHQgICB9ZWxzZXtcblx0XHQgICBcdFxuXHRcdCAgIFx0cmV0dXJuO1xuXHRcdCAgIFx0XG5cdFx0ICAgfVx0XHRcblx0fTtcblxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmZldGNoUmVzdWx0cyA9IGZ1bmN0aW9uKCBxdWVyeSApIHtcblx0XHQvL3NlbmQgQUpBWCByZXF1ZXN0IHRvIFBIUCBmaWxlIGluIFdQXG5cdFx0dmFyIHRoYXQgPSB0aGlzLFxuXHRcdFx0ZGF0YSA9IHtcblx0XHRcdFx0cyA6IHF1ZXJ5LFxuXHRcdFx0fTtcblxuXHRcdHRoYXQuJGVsLmFkZENsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuXG5cdFx0JC5nZXQoQ0NMLmFwaS5zZWFyY2gsIGRhdGEpXG5cdFx0XHQuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0dGhhdC5oYW5kbGVSZXNwb25zZShyZXNwb25zZSk7XG5cdFx0XHR9KVxuXHRcdFx0LmFsd2F5cyhmdW5jdGlvbigpe1xuXHRcdFx0XHR0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcblx0XHRcdH0pO1xuXG5cdH07XG5cblx0U2VhcmNoQXV0b2NvbXBsZXRlLnByb3RvdHlwZS5oYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcblx0XHQvL1Byb2Nlc3MgdGhlIHJlc3VsdHMgZnJvbSB0aGUgQVBJIHF1ZXJ5IGFuZCBnZW5lcmF0ZSBIVE1MIGZvciBkaXNwcGxheVxuXHRcdFxuXHRcdHZhciB0aGF0ID0gdGhpcyxcblx0XHRcdHJlc3VsdHMgPSByZXNwb25zZSxcblx0XHRcdGNvdW50ID0gcmVzdWx0cy5jb3VudCxcblx0XHRcdHF1ZXJ5ID0gcmVzdWx0cy5xdWVyeSxcblx0XHRcdHBvc3RzID0gcmVzdWx0cy5wb3N0cyxcblx0XHRcdHNlYXJjaEluZGV4ID0gICQoIHRoYXQuJGluZGV4Q29udGFpbiApLmlzKCc6dmlzaWJsZScpID8gdGhhdC4kc2VhcmNoSW5kZXgudmFsKCkgOiAna3cnLFxuXHRcdFx0c2VhcmNoSW5kZXhOaWNlbmFtZSA9IGluZGV4TmFtZXNbc2VhcmNoSW5kZXhdLFxuXHRcdFx0c2VhcmNoU2NvcGVEYXRhID0gJCggdGhhdC4kc2VhcmNoU2NvcGUgKSxcblx0XHRcdHJlbmRlcmVkUmVzcG9uc2VcdD0gW107XG5cdFx0XHRcblx0XHQvLyB3cmFwIHF1ZXJ5XG5cdFx0Ly92YXIgcXVlcnlTdHJpbmcgPSBzZWFyY2hJbmRleCArICc6JyArIHF1ZXJ5O1xuXHRcdFxuXHRcdC8vZ2V0IHdtc191cmwgaW5wdXRPYmplY3QgPSB7cXVlcnlTdHJpbmcsIHNlYXJjaFNjb3BlLCBsb2NhdGlvblR5cGV9XG5cdFx0dmFyIGlucHV0T2JqZWN0ID0ge307XG5cdFx0aW5wdXRPYmplY3QucXVlcnlTdHJpbmdcdD0gKHRoYXQubG9jYXRpb25UeXBlID09PSAnd21zJykgPyAgc2VhcmNoSW5kZXggKyBcIjpcIiArIHF1ZXJ5IDogcXVlcnk7XG5cdFx0aW5wdXRPYmplY3Quc2VhcmNoU2NvcGVcdD0gdGhhdC4kc2VhcmNoU2NvcGUudmFsKCk7XG5cdFx0XG5cdFx0Ly9VUkwgY3JlYXRlZCFcblx0XHR2YXIgd21zQ29uc3RydWN0ZWRVcmwgPSB0aGF0LmNvbnN0cnVjdFNlYXJjaFVSTChpbnB1dE9iamVjdCk7XG5cblx0XHQvLyBDbGVhciByZXNwb25zZSBhcmVhIGxpc3QgaXRlbXMgKHVwZGF0ZSB3aGVuIFBhdHRlcm4gTGlicmFyeSB2aWV3IGlzbid0IG5lY2Vzc2FyeSlcblx0XHR0aGF0LiRyZXNwb25zZUxpc3QuaHRtbCgnJyk7XG5cdFx0dGhhdC4kcmVzdWx0c0xpbmsucmVtb3ZlKCk7XG5cdFx0XG5cdFx0Ly9hZGQgdGhlIGNsb3NlIGJ1dHRvblxuXHRcdHZhciByZXN1bHRzQ2xvc2UgPSAnPGRpdiBjbGFzcz1cImNjbC1jLXNlYXJjaC0tY2xvc2UtcmVzdWx0c1wiPicgK1xuXHRcdFx0XHRcdFx0XHQnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjY2wtYi1jbG9zZSBjY2wtYy1zZWFyY2gtLWNsb3NlX19idXR0b25cIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdCc8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2Pic7XG5cblx0XHQvLyBDcmVhdGUgbGlzdCBpdGVtIGZvciBXb3JsZGNhdCBzZWFyY2guXG5cdFx0dmFyIGxpc3RJdGVtID0gICc8YSBocmVmPVwiJysgd21zQ29uc3RydWN0ZWRVcmwgKydcIiBjbGFzcz1cImNjbC1jLXNlYXJjaC1pdGVtIGNjbC1pcy1sYXJnZVwiIHJvbGU9XCJsaXN0aXRlbVwiIHRhcmdldD1cIl9ibGFua1wiIHN0eWxlPVwiYm9yZGVyOm5vbmU7XCI+JyArXG5cdFx0XHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cImNjbC1jLXNlYXJjaC1pdGVtX190eXBlXCI+JyArXG5cdFx0XHRcdFx0XHRcdFx0JzxpIGNsYXNzPVwiY2NsLWItaWNvbiBib29rXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPicgK1xuXHRcdFx0XHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cImNjbC1jLXNlYXJjaC1pdGVtX190eXBlLXRleHRcIj5Xb3JsZENhdDwvc3Bhbj4nICtcblx0XHRcdFx0XHRcdFx0Jzwvc3Bhbj4nICtcblx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVxcXCJjY2wtYy1zZWFyY2gtaXRlbV9fdGl0bGVcXFwiPicgK1xuXHRcdFx0XHRcdFx0XHRcdCdTZWFyY2ggYnkgJyArIHNlYXJjaEluZGV4TmljZW5hbWUgKyAnIGZvciAmbGRxdW87JyArIHF1ZXJ5ICsgJyZyZHF1bzsgaW4gJysgc2VhcmNoU2NvcGVEYXRhLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnRleHQoKSArJyAnICtcblx0XHRcdFx0XHRcdFx0XHQnPGkgY2xhc3M9XCJjY2wtYi1pY29uIGFycm93LXJpZ2h0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjptaWRkbGVcIj48L2k+JyArXG5cdFx0XHRcdFx0XHRcdCc8L3NwYW4+Jytcblx0XHRcdFx0XHRcdCc8L2E+JztcblxuXHRcdFxuXHRcdC8vYWRkIEhUTUwgdG8gdGhlIHJlc3BvbnNlIGFycmF5XG5cdFx0cmVuZGVyZWRSZXNwb25zZS5wdXNoKCByZXN1bHRzQ2xvc2UsIGxpc3RJdGVtICk7XG5cblx0XHQvLyBDcmVhdGUgbGlzdCBpdGVtcyBmb3IgZWFjaCBwb3N0IGluIHJlc3VsdHNcblx0XHRpZiAoIGNvdW50ID4gMCApIHtcblxuXHRcdFx0Ly8gQ3JlYXRlIGEgc2VwYXJhdG9yIGJldHdlZW4gd29ybGRjYXQgYW5kIG90aGVyIHJlc3VsdHNcblx0XHRcdHZhciBzZXBhcmF0b3IgPSAnPHNwYW4gY2xhc3M9XCJjY2wtYy1zZWFyY2gtaXRlbSBjY2wtaXMtc2VwYXJhdG9yXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPicgK1xuXHRcdFx0XHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cXFwiY2NsLWMtc2VhcmNoLWl0ZW1fX3RpdGxlXFxcIj4nICtcblx0XHRcdFx0XHRcdFx0XHRcdCc8aSBjbGFzcz1cImNjbC1iLWljb24gYXJyb3ctZG93blwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4nICtcblx0XHRcdFx0XHRcdFx0XHRcdCcgT3RoZXIgc3VnZ2VzdGVkIHJlc291cmNlcyBmb3IgJmxkcXVvOycgKyBxdWVyeSArICcmcmRxdW87JyArXG5cdFx0XHRcdFx0XHRcdFx0Jzwvc3Bhbj4nICtcblx0XHRcdFx0XHRcdFx0Jzwvc3Bhbj4nO1xuXG5cdFx0XHQvL2FkZCBIVE1MIHRvIHJlc3BvbnNlIGFycmF5XG5cdFx0XHRyZW5kZXJlZFJlc3BvbnNlLnB1c2goIHNlcGFyYXRvciApO1xuXG5cdFx0XHQvLyBCdWlsZCByZXN1bHRzIGxpc3Rcblx0XHRcdHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcblx0XHRcdFx0Ly8gY29uc29sZS5sb2cocG9zdCk7XG5cblx0XHRcdFx0dmFyIGN0YSxcblx0XHRcdFx0XHR0YXJnZXQ7XG5cblx0XHRcdFx0c3dpdGNoKCBwb3N0LnR5cGUgKSB7XG5cdFx0XHRcdFx0Y2FzZSAnQm9vayc6XG5cdFx0XHRcdFx0Y2FzZSAnRkFRJzpcblx0XHRcdFx0XHRjYXNlICdSZXNlYXJjaCBHdWlkZSc6XG5cdFx0XHRcdFx0Y2FzZSAnSm91cm5hbCc6XG5cdFx0XHRcdFx0Y2FzZSAnRGF0YWJhc2UnOlxuXHRcdFx0XHRcdFx0Y3RhID0gJ1ZpZXcnO1xuXHRcdFx0XHRcdFx0dGFyZ2V0ID0gJ19ibGFuayc7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICdMaWJyYXJpYW4nOlxuXHRcdFx0XHRcdGNhc2UgJ1N0YWZmJzpcblx0XHRcdFx0XHRcdGN0YSA9ICdDb250YWN0Jztcblx0XHRcdFx0XHRcdHRhcmdldCA9ICdfYmxhbmsnO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdGN0YSA9ICdWaWV3Jztcblx0XHRcdFx0XHRcdHRhcmdldCA9ICdfc2VsZic7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsaXN0SXRlbSA9ICAnPGEgaHJlZj1cIicgKyBwb3N0LmxpbmsgKyAnXCIgY2xhc3M9XCJjY2wtYy1zZWFyY2gtaXRlbVwiIHJvbGU9XCJsaXN0aXRlbVwiIHRhcmdldD1cIicgKyB0YXJnZXQgKyAnXCI+JyArXG5cdFx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVxcXCJjY2wtYy1zZWFyY2gtaXRlbV9fdHlwZVxcXCI+JyArXG5cdFx0XHRcdFx0XHRcdFx0XHQnPGkgY2xhc3M9XCJjY2wtYi1pY29uICcgKyBwb3N0Lmljb24gKyAnXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPicgK1xuXHRcdFx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwiY2NsLWMtc2VhcmNoLWl0ZW1fX3R5cGUtdGV4dFwiPicgKyBwb3N0LnR5cGUgKyAnPC9zcGFuPicgK1xuXHRcdFx0XHRcdFx0XHRcdCc8L3NwYW4+JyArXG5cdFx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwiY2NsLWMtc2VhcmNoLWl0ZW1fX3RpdGxlXCI+JyArIHBvc3QudGl0bGUgKyAnPC9zcGFuPicgK1xuXHRcdFx0XHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cImNjbC1jLXNlYXJjaC1pdGVtX19jdGFcIj4nICtcblx0XHRcdFx0XHRcdFx0XHRcdCc8c3Bhbj4nICsgY3RhICsgJyA8aSBjbGFzcz1cImNjbC1iLWljb24gYXJyb3ctcmlnaHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOm1pZGRsZVwiPjwvaT48L3NwYW4+JyArXG5cdFx0XHRcdFx0XHRcdFx0Jzwvc3Bhbj4nICtcblx0XHRcdFx0XHRcdFx0JzwvYT4nO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly9hZGQgSFRNTCB0byB0aGUgcmVzcG9uc2UgYXJyYXlcblx0XHRcdFx0cmVuZGVyZWRSZXNwb25zZS5wdXNoKCBsaXN0SXRlbSApO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIEJ1aWxkIHJlc3VsdHMgY291bnQvbGlua1xuXHRcdFx0bGlzdEl0ZW0gPSAnPGRpdiBjbGFzcz1cImNjbC1jLXNlYXJjaC1yZXN1bHRzX19mb290ZXJcIj4nICtcblx0XHRcdFx0XHRcdFx0XHQnPGEgaHJlZj1cIi8/cz0nICsgcXVlcnkgKyAnXCIgY2xhc3M9XCJjY2wtYy1zZWFyY2gtcmVzdWx0c19fYWN0aW9uXCI+JyArXG5cdFx0XHRcdFx0XHRcdFx0XHQnVmlldyBhbGwgJyArIGNvdW50ICsgJyBSZXN1bHRzICcgK1xuXHRcdFx0XHRcdFx0XHRcdFx0JzxpIGNsYXNzPVwiY2NsLWItaWNvbiBhcnJvdy1yaWdodFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4nICtcblx0XHRcdFx0XHRcdFx0XHQnPC9hPicgK1xuXHRcdFx0XHRcdFx0JzwvZGl2Pic7XG5cblx0XHRcdC8vYWRkIEhUTUwgdG8gdGhlIHJlc3BvbnNlIGFycmF5XG5cdFx0XHRyZW5kZXJlZFJlc3BvbnNlLnB1c2goIGxpc3RJdGVtICk7XG5cdFx0XG5cdFx0fVxuXHRcdFxuXHRcdC8vYXBwZW5kIGFsbCByZXNwb25zZSBkYXRhIGFsbCBhdCBvbmNlXG5cdFx0dGhhdC4kcmVzcG9uc2VMaXN0LmFwcGVuZCggcmVuZGVyZWRSZXNwb25zZSApO1xuXHRcdFxuXHRcdC8vY2FjaGUgdGhlIHJlc3BvbnNlIGJ1dHRvbiBhZnRlciBpdHMgYWRkZWQgdG8gdGhlIERPTVxuXHRcdHRoYXQuJHJlc3BvbnNlQ2xvc2VcdD0gdGhhdC4kZWwuZmluZCgnLmNjbC1jLXNlYXJjaC0tY2xvc2VfX2J1dHRvbicpO1x0XHRcblx0XHRcblx0XHQvL2NsaWNrIGV2ZW50IHRvIGNsb3NlIHRoZSByZXN1bHRzIHBhZ2Vcblx0XHR0aGF0LiRyZXNwb25zZUNsb3NlLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdC8vaGlkZVxuXHRcdFx0XHRpZiggJCggdGhhdC4kcmVzcG9uc2UgKS5pcygnOnZpc2libGUnKSApe1xuXHRcdFx0XHRcdHRoYXQuJHJlc3BvbnNlLmhpZGUoKTtcdFxuXHRcdFx0XHRcdHRoYXQuZGVzdHJveUxpZ2h0Qm94KCk7XG5cdFx0XHRcdH1cblx0XHR9KTtcblx0XHRcblx0XHRcblx0fTtcblxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLm9uU2VhcmNoSW5kZXhDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHQvL29uIGNoYW5nZXMgdG8gdGhlIGxvY2F0aW9uIG9yIGF0dHJpYnV0ZSBpbmRleCBvcHRpb24sIHdpbGwgd2F0Y2ggYW5kIHJ1biBmZXRjaFJlc3VsdHNcblx0XHR2YXIgcXVlcnkgPSB0aGlzLiRpbnB1dC52YWwoKTtcblxuXHRcdGlmICggISBxdWVyeS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuJHJlc3BvbnNlLnNob3coKTtcdFx0XG5cdFx0dGhpcy5mZXRjaFJlc3VsdHMoIHF1ZXJ5ICk7XG5cdH07XG5cdFxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmNvbnN0cnVjdFNlYXJjaFVSTCA9IGZ1bmN0aW9uKGlucHV0T2JqZWN0KXtcblx0XHQvL2NvbnN0cnVjdHMgVVJMIHdpdGggcGFyYW1ldGVycyBmcm9tXG5cdFx0Ly9pbnB1dE9iamVjdCA9IHsgcXVlcnlTdHJpbmcsIHNlYXJjaFNjb3BlLCBTZWFyY2hMb2NhdGlvbiB9XG5cdFx0XG5cdFx0Ly9kZWZpbmUgdmFyaWFibGVzXG5cdFx0dmFyIHF1ZXJ5U3RyaW5nLCBzZWFyY2hTcmMsIHNlYXJjaFNjb3BlS2V5LCByZW5kZXJlZFVSTDtcblx0XHRcblx0XHRxdWVyeVN0cmluZyBcdD0gaW5wdXRPYmplY3QucXVlcnlTdHJpbmc7XG5cdFx0c2VhcmNoU3JjXHRcdD0gaW5wdXRPYmplY3Quc2VhcmNoU2NvcGU7XG5cblx0XHRcblx0XHRzd2l0Y2ggKCB0aGlzLmxvY2F0aW9uVHlwZSkge1xuXHRcdFx0Y2FzZSAnd21zJzpcblx0XHRcdFx0Ly9jaGVjayBpZiBzZWFyY2ggbG9jYXRpb24gaXMgYSBzY29wZWQgc2VhcmNoIGxvY2F0aW9uXG5cdFx0XHRcdGlmKCBzZWFyY2hTcmMubWF0Y2goLzo6enM6LykgKXtcblx0XHRcdFx0XHRzZWFyY2hTY29wZUtleSA9ICdzdWJzY29wZSc7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHNlYXJjaFNjb3BlS2V5ID0gJ3Njb3BlJztcblx0XHRcdFx0fVxuXHQgICAgICAgICAgICAvL2J1aWxkIHRoZSBVUkxcblx0ICAgICAgICAgICAgdmFyIHdtc19wYXJhbXMgPSB7XG5cdCAgICAgICAgICAgICAgICBzb3J0S2V5ICAgICAgICAgOiAnTElCUkFSWScsXG5cdCAgICAgICAgICAgICAgICBkYXRhYmFzZUxpc3QgICAgOiAnJyxcblx0ICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nICAgICA6IHF1ZXJ5U3RyaW5nLFxuXHQgICAgICAgICAgICAgICAgRmFjZXQgICAgICAgICAgIDogJycsXG5cdCAgICAgICAgICAgICAgICAvL3Njb3BlIGFkZGVkIGJlbG93XG5cdCAgICAgICAgICAgICAgICAvL2Zvcm1hdCBhZGRlZCBiZWxvd1xuXHQgICAgICAgICAgICAgICAgZm9ybWF0XHRcdFx0OiAnYWxsJyxcblx0ICAgICAgICAgICAgICAgIGRhdGFiYXNlICAgICAgICA6ICAnYWxsJyxcblx0ICAgICAgICAgICAgICAgIGF1dGhvciAgICAgICAgICA6ICcnLFxuXHQgICAgICAgICAgICAgICAgeWVhciAgICAgICAgICAgIDogJ2FsbCcsXG5cdCAgICAgICAgICAgICAgICB5ZWFyRnJvbSAgICAgICAgOiAnJyxcblx0ICAgICAgICAgICAgICAgIHllYXJUbyAgICAgICAgICA6ICcnLFxuXHQgICAgICAgICAgICAgICAgbGFuZ3VhZ2UgICAgICAgIDogJ2FsbCcsXG5cdCAgICAgICAgICAgICAgICB0b3BpYyAgICAgICAgICAgOiAnJ1xuXHQgICAgICAgICAgICB9O1xuXHQgICAgICAgICAgICBcblx0ICAgICAgICAgICAgd21zX3BhcmFtc1tzZWFyY2hTY29wZUtleV0gPSBzZWFyY2hTcmM7XG5cdCAgICAgICAgICAgIFxuXHQgICAgICAgICAgICByZW5kZXJlZFVSTCA9ICdodHRwczovL2NjbC5vbi53b3JsZGNhdC5vcmcvc2VhcmNoPycgKyAkLnBhcmFtKHdtc19wYXJhbXMpO1xuXHRcdCAgICAgICAgcmVuZGVyZWRVUkwgPSByZW5kZXJlZFVSTC5yZXBsYWNlKCAnJTI2JywgXCImXCIgKTtcdFx0XHRcdFxuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0XG5cdFx0XHRjYXNlICdvYWMnOlxuXHRcdFx0XHRcblx0XHRcdFx0cmVuZGVyZWRVUkwgPSAnaHR0cDovL3d3dy5vYWMuY2RsaWIub3JnL3NlYXJjaD9xdWVyeT0nICsgcXVlcnlTdHJpbmcgKyAnJmluc3RpdHV0aW9uPUNsYXJlbW9udCtDb2xsZWdlcyc7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcblx0XHRcdGRlZmF1bHQ6XG5cdFx0XHRcdHJlbmRlcmVkVVJMID0gQ0NMLnNpdGVfdXJsICsgJz9zPScgKyBxdWVyeVN0cmluZztcblx0XHR9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cod21zX3VybCk7XG4gICAgICAgICAgICBcbiAgICAgICAgcmV0dXJuIHJlbmRlcmVkVVJMO1xuXG5cdH07XG5cdFxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmluaXRMaWdodEJveCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIHRoYXQgPSB0aGlzLFxuXHRcdFx0ZGVzdHJveVRpbWVvdXQgPSAwO1xuXHRcdFxuXHRcdHRoaXMuJGVsXG5cdFx0XHQub24oICdmb2N1c2luJywgJzpmb2N1c2FibGUnLCBmdW5jdGlvbihldmVudCl7XG5cblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cblx0XHRcdFx0Ly8gY2xlYXIgdGltZW91dCBiZWNhdXNlIHdlJ3JlIHN0aWxsIGluc2lkZSB0aGUgc2VhcmNoYm94XG5cdFx0XHRcdGlmICggZGVzdHJveVRpbWVvdXQgKSB7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KGRlc3Ryb3lUaW1lb3V0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICggISB0aGF0LmxpZ2h0Ym94SXNPbiApe1xuXG5cdFx0XHRcdFx0dGhhdC5jcmVhdGVMaWdodEJveCgpO1xuXG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHR9KVxuXHRcdFx0Lm9uKCAnZm9jdXNvdXQnLCAnOmZvY3VzYWJsZScsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0XG5cdFx0XHRcdC8vIHNldCBhIHNob3J0IHRpbWVvdXQgc28gdGhhdCBvdGhlciBmdW5jdGlvbnMgY2FuIGNoZWNrIGFuZCBjbGVhciBpZiBuZWVkIGJlXG5cdFx0XHRcdGRlc3Ryb3lUaW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuXG5cdFx0XHRcdFx0dGhhdC5kZXN0cm95TGlnaHRCb3goKTtcblx0XHRcdFx0XHR0aGF0LiRyZXNwb25zZS5oaWRlKCk7XG5cblx0XHRcdFx0fSwgMTAwKTtcblxuXHRcdFx0fSk7XG5cblx0XHR0aGlzLiRyZXNwb25zZVxuXHRcdFx0Lm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cblx0XHRcdFx0Ly8gY2xlYXIgZGVzdHJveSB0aW1lb3V0IGJlY2F1c2Ugd2UncmUgc3RpbGwgaW5zaWRlIHRoZSBzZWFyY2hib3hcblx0XHRcdFx0aWYgKCBkZXN0cm95VGltZW91dCApIHtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoZGVzdHJveVRpbWVvdXQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdH0pO1xuXG5cdH07XG5cblx0U2VhcmNoQXV0b2NvbXBsZXRlLnByb3RvdHlwZS5jcmVhdGVMaWdodEJveCA9IGZ1bmN0aW9uKCkge1xuXG5cdFx0dGhpcy5saWdodGJveElzT24gPSB0cnVlO1xuXHRcdFx0XHRcdFxuXHRcdHRoaXMuJGVsLmFkZENsYXNzKCdpcy1saWdodGJveGVkJyk7XG5cdFx0dGhpcy4kbGlnaHRib3ggPSAkKCc8ZGl2IGNsYXNzPVwiY2NsLWMtbGlnaHRib3hcIj4nKS5hcHBlbmRUbygnYm9keScpO1xuXHRcdHZhciBzZWFyY2hCb3hUb3AgPSB0aGlzLiRlbC5vZmZzZXQoKS50b3AgLSAxMjggKyAncHgnO1xuXHRcdHZhciB0YXJnZXRUb3AgPSAkKGV2ZW50LnRhcmdldCkub2Zmc2V0KCkudG9wIC0gMTI4ICsgJ3B4Jztcblx0XHRcblx0XHQvLyBwcmV2ZW50cyB0aGUgc2Nyb2xsYmFyIGZyb20ganVtcGluZyBpZiB0aGUgdXNlciBpcyB0YWJiaW5nIGJlbG93IHRoZSBmb2xkXG5cdFx0Ly8gaWYgdGhlIHNlYXJjaGJveCBhbmQgdGhlIHRhcmdldCBhcmUgdGhlIHNhbWUgLSB0aGVuIGl0IHdpbGwganVtcCwgaWYgbm90LCBcblx0XHQvLyB0aGVuIGl0IHdvbid0IGp1bXBcblx0XHRpZiAoIHNlYXJjaEJveFRvcCA9PSB0YXJnZXRUb3AgKXtcblx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBzZWFyY2hCb3hUb3AgfSApO1x0XHRcdFx0XHRcdFxuXHRcdH1cdFx0XG5cblx0fTtcblxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmRlc3Ryb3lMaWdodEJveCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggdGhpcy4kbGlnaHRib3ggKSB7XG5cdFx0XHR0aGlzLiRsaWdodGJveC5yZW1vdmUoKTtcblx0XHRcdHRoaXMuJGxpZ2h0Ym94ID0gbnVsbDtcblx0XHRcdHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdpcy1saWdodGJveGVkJyk7XG5cdFx0XHR0aGlzLmxpZ2h0Ym94SXNPbiA9IGZhbHNlO1xuXHRcdFx0XG5cdFx0fVxuXHR9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0XHQvLyAuZWFjaCgpIHdpbGwgZmFpbCBncmFjZWZ1bGx5IGlmIG5vIGVsZW1lbnRzIGFyZSBmb3VuZFxuXHRcdCQoJy5jY2wtanMtc2VhcmNoLWZvcm0nKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRuZXcgU2VhcmNoQXV0b2NvbXBsZXRlKHRoaXMpO1xuXHRcdH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKlxuICogU2xpZGVUb2dnbGVcbiAqIFxuICogIHRhYnMgZm9yIGhpZGluZyBhbmQgc2hvd2luZyBhZGRpdGlvbmFsIGNvbnRlbnRcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIHNsaWRlVG9nZ2xlTGlzdCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgICAgICAgICAgICAgICAgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kc2xpZGVUb2dnbGVMaW5rICAgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtc2xpZGVUb2dnbGVfX3RpdGxlJyk7XG4gICAgICAgIHRoaXMuJHRvZ2dsZUNvbnRhaW5lciAgID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNsaWRlVG9nZ2xlX19jb250YWluZXInKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBzbGlkZVRvZ2dsZUxpc3QucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoYXQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kc2xpZGVUb2dnbGVMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2dCl7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIC8vZ2V0IHRoZSB0YXJnZXQgdG8gYmUgb3BlbmVkXG4gICAgICAgICAgICB2YXIgY2xpY2tJdGVtID0gJCh0aGlzKTtcbiAgICAgICAgICAgIC8vZ2V0IHRoZSBkYXRhIHRhcmdldCB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoaXMgbGlua1xuICAgICAgICAgICAgdmFyIHRhcmdldF9jb250ZW50ID0gY2xpY2tJdGVtLmF0dHIoJ2RhdGEtdG9nZ2xlVGl0bGUnKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9hZGQgdGhlIGFjdGl2ZSBjbGFzcyBzbyB3ZSBjYW4gZG8gc3R5bGluZ3MgYW5kIHRyYW5zaXRpb25zXG4gICAgICAgICAgICBjbGlja0l0ZW1cbiAgICAgICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKVxuICAgICAgICAgICAgICAgIC5zaWJsaW5ncygpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvL3RvZ2dsZSBhcmlhXG4gICAgICAgICAgICBpZiAoY2xpY2tJdGVtLmF0dHIoICdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJykge1xuICAgICAgICAgICAgICAgICAgICAkKGNsaWNrSXRlbSkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKGNsaWNrSXRlbSkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL2xvY2F0ZSB0aGUgdGFyZ2V0IGVsZW1lbnQgYW5kIHNsaWRldG9nZ2xlIGl0XG4gICAgICAgICAgICBfdGhhdC4kdG9nZ2xlQ29udGFpbmVyXG4gICAgICAgICAgICAgICAgLmZpbmQoICdbZGF0YS10b2dnbGVUYXJnZXQ9XCInICsgdGFyZ2V0X2NvbnRlbnQgKyAnXCJdJyApXG4gICAgICAgICAgICAgICAgLnNsaWRlVG9nZ2xlKCdmYXN0Jyk7XG4gICAgICAgICAgICAgICAgLy90b2dnbGUgYXJpYS1leHBhbmRlZFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy90b2dnbGUgYXJpYVxuICAgICAgICAgICAgaWYgKF90aGF0LiR0b2dnbGVDb250YWluZXIuYXR0ciggJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoX3RoYXQuJHRvZ2dsZUNvbnRhaW5lcikuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKF90aGF0LiR0b2dnbGVDb250YWluZXIpLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWMtc2xpZGVUb2dnbGUnKS5lYWNoKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IHNsaWRlVG9nZ2xlTGlzdCh0aGlzKTsgICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU21vb3RoIFNjcm9sbGluZ1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXG4gICAgICAgICQoJy5qcy1zbW9vdGgtc2Nyb2xsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9zZXQgdG8gYmx1clxuICAgICAgICAgICAgJCh0aGlzKS5ibHVyKCk7ICAgICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcykuZGF0YSgndGFyZ2V0JykgfHwgJCh0aGlzKS5hdHRyKCdocmVmJyksXG4gICAgICAgICAgICAgICAgJHRhcmdldCA9ICQodGFyZ2V0KSxcbiAgICAgICAgICAgICAgICBzY3JvbGxPZmZzZXQgPSAwO1xuXG4gICAgICAgICAgICAkKCcuY2NsLWMtcXVpY2stbmF2JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHNjcm9sbE9mZnNldCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCAkdGFyZ2V0Lmxlbmd0aCApIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VG9wID0gJHRhcmdldC5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoIHsgXG4gICAgICAgICAgICAgICAgICAgICdzY3JvbGxUb3AnOiB0YXJnZXRUb3AgLSBzY3JvbGxPZmZzZXQgfSwgXG4gICAgICAgICAgICAgICAgICAgIDgwMCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU3RpY2tpZXNcbiAqIFxuICogQmVoYXZpb3VyIGZvciBzdGlja3kgZWxlbWVudHMuXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBpc0ZpeGVkOiAnY2NsLWlzLWZpeGVkJ1xuICAgICAgICB9O1xuXG4gICAgdmFyIFN0aWNreSA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICAvLyB2YXJpYWJsZXNcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpLFxuICAgICAgICAgICAgaGVpZ2h0ID0gJGVsLm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICBvZmZzZXQgPSAkZWwub2Zmc2V0KCksXG4gICAgICAgICAgICBvcHRpb25zID0gJGVsLmRhdGEoJ3N0aWNreScpLFxuICAgICAgICAgICAgd3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJqcy1zdGlja3ktd3JhcHBlclwiPjwvZGl2PicpLmNzcyh7IGhlaWdodDogaGVpZ2h0ICsgJ3B4JyB9KTtcblxuICAgICAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgfTtcblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zICk7XG5cbiAgICAgICAgLy8gd3JhcCBlbGVtZW50XG4gICAgICAgICRlbC53cmFwKCB3cmFwcGVyICk7XG5cbiAgICAgICAgLy8gc2Nyb2xsIGxpc3RlbmVyXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgMTAwICkgKTtcblxuICAgICAgICAvLyBvbiBzY3JvbGxcbiAgICAgICAgZnVuY3Rpb24gX29uU2Nyb2xsKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKSArIG9wdGlvbnMub2Zmc2V0O1xuICAgIFxuICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gb2Zmc2V0LnRvcCApIHtcbiAgICAgICAgICAgICAgICAkZWwuYWRkQ2xhc3MoIGNsYXNzTmFtZS5pc0ZpeGVkICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLmlzRml4ZWQgKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1pcy1zdGlja3knKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU3RpY2t5KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogVG9nZ2xlIFNjaG9vbHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIHNjaG9vbCB0b2dnbGVzXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIGluaXRTY2hvb2wgPSAkKCdodG1sJykuZGF0YSgnc2Nob29sJyk7XG5cbiAgICB2YXIgU2Nob29sU2VsZWN0ID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kc2VsZWN0ID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgU2Nob29sU2VsZWN0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgc2Nob29sID0gZ2V0Q29va2llKCAnY2NsLXNjaG9vbCcgKTtcblxuICAgICAgICBpZiAoIGluaXRTY2hvb2wgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuJHNlbGVjdFxuICAgICAgICAgICAgICAgIC5maW5kKCAnb3B0aW9uW3ZhbHVlPVwiJyArIHNjaG9vbCArICdcIl0nIClcbiAgICAgICAgICAgICAgICAuYXR0ciggJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyApO1xuXG4gICAgICAgIFx0aWYgKCBzY2hvb2wgKSB7XG4gICAgICAgIFx0XHQgJCgnaHRtbCcpLmF0dHIoJ2RhdGEtc2Nob29sJywgc2Nob29sKTtcblx0XHRcdH1cblxuXHRcdH1cblxuICAgICAgICB0aGlzLiRzZWxlY3QuY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hdHRyKCAnZGF0YS1zY2hvb2wnLCBldmVudC50YXJnZXQudmFsdWUgKTtcblxuICAgICAgICAgICAgZXJhc2VDb29raWUoICdjY2wtc2Nob29sJyApO1xuICAgICAgICAgICAgc2V0Q29va2llKCAnY2NsLXNjaG9vbCcsIGV2ZW50LnRhcmdldC52YWx1ZSwgNyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBDb29raWUgZnVuY3Rpb25zIGxpZnRlZCBmcm9tIFN0YWNrIE92ZXJmbG93IGZvciBub3dcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNDU3MzIyMy9zZXQtY29va2llLWFuZC1nZXQtY29va2llLXdpdGgtamF2YXNjcmlwdFxuXHRmdW5jdGlvbiBzZXRDb29raWUobmFtZSwgdmFsdWUsIGRheXMpIHtcblx0XHR2YXIgZXhwaXJlcyA9IFwiXCI7XG5cdFx0aWYgKGRheXMpIHtcblx0XHRcdHZhciBkYXRlID0gbmV3IERhdGUoKTtcblx0XHRcdGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChkYXlzICogMjQgKiA2MCAqIDYwICogMTAwMCkpO1xuXHRcdFx0ZXhwaXJlcyA9IFwiOyBleHBpcmVzPVwiICsgZGF0ZS50b1VUQ1N0cmluZygpO1xuXHRcdH1cblx0XHRkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyAodmFsdWUgfHwgXCJcIikgKyBleHBpcmVzICsgXCI7IHBhdGg9L1wiO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcblx0XHR2YXIgbmFtZUVRID0gbmFtZSArIFwiPVwiO1xuXHRcdHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBjID0gY2FbaV07XG5cdFx0XHR3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcblx0XHRcdGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRmdW5jdGlvbiBlcmFzZUNvb2tpZShuYW1lKSB7XG5cdFx0ZG9jdW1lbnQuY29va2llID0gbmFtZSArICc9OyBNYXgtQWdlPS05OTk5OTk5OTsnO1xuXHR9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJzY2hvb2xcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU2Nob29sU2VsZWN0KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIFRvb2x0aXBzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciB0b29sdGlwc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgVG9vbHRpcCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy4kZWwuYXR0cigndGl0bGUnKTtcbiAgICAgICAgdGhpcy4kdG9vbHRpcCA9ICQoJzxkaXYgaWQ9XCJjY2wtY3VycmVudC10b29sdGlwXCIgY2xhc3M9XCJjY2wtYy10b29sdGlwIGNjbC1pcy10b3BcIiByb2xlPVwidG9vbHRpcFwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19hcnJvd1wiPjwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19pbm5lclwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBUb29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuaG92ZXIoZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIC8vIG1vdXNlb3ZlclxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCAnJyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cignYXJpYS1kZXNjcmliZWRieScsICdjY2wtY3VycmVudC10b29sdGlwJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblxuICAgICAgICAgICAgQ0NMLnJlZmxvdyhfdGhpcy4kdG9vbHRpcFswXSk7XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBfdGhpcy4kZWwub2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgd2lkdGggID0gX3RoaXMuJGVsLm91dGVyV2lkdGgoKSxcbiAgICAgICAgICAgICAgICB0b29sdGlwSGVpZ2h0ID0gX3RoaXMuJHRvb2x0aXAub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuY3NzKHtcbiAgICAgICAgICAgICAgICB0b3A6IChvZmZzZXQudG9wIC0gdG9vbHRpcEhlaWdodCkgKyAncHgnLFxuICAgICAgICAgICAgICAgIGxlZnQ6IChvZmZzZXQubGVmdCArICh3aWR0aC8yKSkgKyAncHgnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgIH0sIGZ1bmN0aW9uKGUpeyBcblxuICAgICAgICAgICAgLy9tb3VzZW91dFxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCBfdGhpcy5jb250ZW50KTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgJycpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlKCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBUb29sdGlwKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogV2F5ZmluZGluZ1xuICogXG4gKiBDb250cm9scyBpbnRlcmZhY2UgZm9yIGxvb2tpbmcgdXAgY2FsbCBudW1iZXIgbG9jYXRpb25zXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICB0YWJzLCB3YXlmaW5kZXI7XG4gICAgXG4gICAgdmFyIFRhYnMgPSBmdW5jdGlvbihlbCkge1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdGFicyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy10YWInKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMgPSAkKCcuY2NsLWMtdGFiX19jb250ZW50Jyk7XG4gICAgICAgIFxuXG4gICAgICAgIHRoaXMuJHRhYnMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICR0YWIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHRhYi5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICR0YWIuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0QWN0aXZlKHRhcmdldCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFRhYnMucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKHRhcmdldCl7XG4gICAgICAgIHRoaXMuJHRhYnMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFicy5maWx0ZXIoJ1tocmVmPVwiJyt0YXJnZXQrJ1wiXScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIHZhciBXYXlmaW5kZXIgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuY2FsbE51bWJlcnMgPSB7fTtcbiAgICAgICAgdGhpcy4kZm9ybSA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bWJlci1zZWFyY2gnKTtcbiAgICAgICAgdGhpcy4kaW5wdXQgPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW0taW5wdXQnKTtcbiAgICAgICAgdGhpcy4kc3VibWl0ID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtLXN1Ym1pdCcpO1xuICAgICAgICB0aGlzLiRtYXJxdWVlID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fbWFycXVlZScpO1xuICAgICAgICB0aGlzLiRjYWxsTnVtID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fY2FsbC1udW0nKTtcbiAgICAgICAgdGhpcy4kd2luZyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX3dpbmcnKTtcbiAgICAgICAgdGhpcy4kZmxvb3IgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19mbG9vcicpO1xuICAgICAgICB0aGlzLiRzdWJqZWN0ID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fc3ViamVjdCcpO1xuICAgICAgICB0aGlzLmVycm9yID0ge1xuICAgICAgICAgICAgZ2V0OiAnPGRpdiBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvciBjY2wtd2F5ZmluZGVyX19lcnJvclwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2NsLWItY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPjxzcGFuIGNsYXNzPVwiY2NsLWItaWNvbiBhbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gVGhlcmUgd2FzIGFuIGVycm9yIGZldGNoaW5nIGNhbGwgbnVtYmVycy48L2Rpdj4nLFxuICAgICAgICAgICAgZmluZDogJzxkaXYgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3IgY2NsLXdheWZpbmRlcl9fZXJyb3JcIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNjbC1iLWNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj48c3BhbiBjbGFzcz1cImNjbC1iLWljb24gYWxlcnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IENvdWxkIG5vdCBmaW5kIHRoYXQgY2FsbCBudW1iZXIuIFBsZWFzZSB0cnkgYWdhaW4uPC9kaXY+J1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRlcnJvckJveCA9ICQoJy5jY2wtZXJyb3ItYm94Jyk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAkLmdldEpTT04oIENDTC5hc3NldHMgKyAnanMvY2FsbC1udW1iZXJzLmpzb24nIClcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIF90aGlzLmNhbGxOdW1iZXJzID0gZGF0YTtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGVycm9yQm94LmFwcGVuZCggdGhpcy5lcnJvci5nZXQgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1hcHAtYWN0aXZlJyk7XG5cbiAgICAgICAgdGhpcy4kaW5wdXRcbiAgICAgICAgICAgIC5rZXl1cChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHF1ZXJ5ID09PSBcIlwiICkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3VibWl0LmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRtYXJxdWVlLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVzZXQoKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGZvcm0uc3VibWl0KGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBfdGhpcy5yZXNldCgpO1xuXG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBfdGhpcy4kaW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgICQoJy5jY2wtd2F5ZmluZGVyX19lcnJvcicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuc2hvdygpO1xuICAgICAgICAgICAgX3RoaXMuJGNhbGxOdW0udGV4dChxdWVyeSk7XG4gICAgICAgICAgICBfdGhpcy5maW5kUm9vbSggcXVlcnkgKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5nZXRDYWxsS2V5ID0gZnVuY3Rpb24oY2FsbE51bSkge1xuICAgICAgICBjYWxsTnVtID0gY2FsbE51bS5yZXBsYWNlKC8gL2csICcnKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBrZXksXG4gICAgICAgICAgICBjYWxsS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY2FsbE51bWJlcnMpO1xuXG4gICAgICAgIGlmICggY2FsbEtleXMubGVuZ3RoID09PSAwICl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsS2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGspe1xuICAgICAgICAgICAgdmFyIGtfbm9TcGFjZXMgPSBrLnJlcGxhY2UoLyAvZywgJycpO1xuXG4gICAgICAgICAgICBpZiAoIGNhbGxOdW0gPj0ga19ub1NwYWNlcyApIHtcbiAgICAgICAgICAgICAgICBrZXkgPSBrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmZpbmRSb29tID0gZnVuY3Rpb24ocXVlcnkpIHtcblxuICAgICAgICBxdWVyeSA9IHF1ZXJ5LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBjYWxsS2V5ID0gdGhpcy5nZXRDYWxsS2V5KHF1ZXJ5KSxcbiAgICAgICAgICAgIGNhbGxEYXRhID0ge30sXG4gICAgICAgICAgICBmbG9vcklkLCByb29tSWQ7XG5cbiAgICAgICAgaWYgKCAhIGNhbGxLZXkgKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93RmluZEVycm9yKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCgnLmNjbC1jLXNlYXJjaCcpLm9mZnNldCgpLnRvcCB9KTtcbiAgICAgICAgXG4gICAgICAgIGNhbGxEYXRhID0gdGhpcy5jYWxsTnVtYmVyc1tjYWxsS2V5XTtcblxuICAgICAgICB0aGlzLiRmbG9vci50ZXh0KCBjYWxsRGF0YS5mbG9vciApO1xuICAgICAgICB0aGlzLiR3aW5nLnRleHQoIGNhbGxEYXRhLndpbmcgKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdC50ZXh0KCBjYWxsRGF0YS5zdWJqZWN0ICk7XG5cbiAgICAgICAgZmxvb3JJZCA9IGNhbGxEYXRhLmZsb29yX2ludDtcbiAgICAgICAgcm9vbUlkID0gY2FsbERhdGEucm9vbV9pbnQ7IC8vIHdpbGwgYmUgaW50ZWdlciBPUiBhcnJheVxuXG4gICAgICAgIC8vIE1ha2UgZmxvb3Ivcm9vbSBhY3RpdmVcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWY9XCIjZmxvb3ItJytmbG9vcklkKydcIl0nKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuXG4gICAgICAgIGlmICggdHlwZW9mIHJvb21JZCAhPT0gJ251bWJlcicgKSB7XG4gICAgICAgICAgICAvLyBpZiByb29tSWQgaXMgYXJyYXlcbiAgICAgICAgICAgIHJvb21JZC5mb3JFYWNoKGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5maW5kKCcjcm9vbS0nK2Zsb29ySWQrJy0nK2lkKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiByb29tSWQgaXMgbnVtYmVyXG4gICAgICAgICAgICB0aGlzLiRlbC5maW5kKCcjcm9vbS0nK2Zsb29ySWQrJy0nK3Jvb21JZCkuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCBjb3JyZXNwb25kaW5nIGFjdGl2ZSBmbG9vciB0YWJcblxuICAgICAgICB0YWJzLnNldEFjdGl2ZSggJyNmbG9vci0nICsgZmxvb3JJZCApO1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUudGhyb3dGaW5kRXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdC50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiRlcnJvckJveC5hcHBlbmQoIHRoaXMuZXJyb3IuZmluZCApO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWpzLXRhYnMnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0YWJzID0gbmV3IFRhYnModGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuY2NsLWpzLXdheWZpbmRlcicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHdheWZpbmRlciA9IG5ldyBXYXlmaW5kZXIodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIl19
