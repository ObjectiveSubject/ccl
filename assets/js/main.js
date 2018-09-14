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
        this.maxSlots = 6;
        this.$maxTime = this.$el.find('.js-max-time');
        this.slotMinutes = 30;
        this.locale = "en-US";
        this.timeZone = {timeZone: "America/Los_Angeles"};
        this.lid        = 4816; // 4816 8739
        this.openTime = null;
        this.closingTime = null;

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
    
    RoomResForm.prototype.getMainLibraryHours = function(){
        //get the hours for the main library via AJAX
        var data = {
            action: 'get_main_library_hours',
            ccl_nonce: CCL.nonce           
        };
        
        return $.post({
            url: CCL.ajax_url,
            data: data
        });        
    };

    RoomResForm.prototype.updateScheduleData = function() {
        
        var getSpacejqXHR = this.getSpaceAvailability(this.dateYmd);
        var getBookingsjqXHR = this.getSpaceBookings(this.dateYmd);
        var getMainHoursjqXHR = this.getMainLibraryHours();
        var that = this;
        
        $.when(getSpacejqXHR, getBookingsjqXHR, getMainHoursjqXHR)
            .done(function(getSpace,getBookings, getMainHours){
                
                var spaceData = getSpace[0],
                    bookingsData = getBookings[0],
                    mainHoursData = getMainHours[0],
                    spacejqXHR = getSpace[2],
                    bookingsjqXHR = getBookings[2],
                    timeSlotsArray;

                // parse data to JSON if it's a string
                spaceData = ( typeof spaceData === 'string' ) ? JSON.parse( spaceData )[0] : spaceData[0];
                bookingsData = ( typeof bookingsData === 'string' ) ? JSON.parse( bookingsData ) : bookingsData;
                mainHoursData = ( typeof mainHoursData === 'string' ) ? JSON.parse( mainHoursData ) : mainHoursData;
                
                //get the open hours of the library and return these times as variables
                that.getOpenHours( mainHoursData );   
                
                if( !that.openTime && !that.closingTime ){
                    //if the library is closed, then the openTime and closingTime will still be null
                    //then we exit out of the function
                    that.$roomSchedule.html( 'No reservations are available' );
                    that.unsetLoading();
                    that.$currentDurationText.text('Library Closed');
                    that.$resetSelectionBtn.hide();                    
                    return;
                }
                

                // merge bookings with availability
                if ( bookingsData.length ){
                        var checkStatuses = ['Available', 'Confirmed'];
                    bookingsData.forEach(function(booking,i){
                        
                        if(  $.inArray( booking.status, checkStatuses ) == -1 ){
                            console.log( booking.status );
                            return;   
                        }

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
            that = this,
            startEndIndexes = [], 
            start, end,
            now = new Date().getTime();
            
        //console.log( scheduleArray );

        $.each( scheduleArray, function( i, item ){
            start = new Date( item.from ).getTime();
            end = new Date( item.to ).getTime();
            
            //add to schedule array if
            //beginning is after opening and end if before closing and end is greater than right now
            if( that.openTime <= start && that.closingTime >= end && end > now ){
                
                    startEndIndexes.push( item );                    

            }

        } );
        
        console.log( 'Schedule Array slots: ', startEndIndexes.length +'/' + scheduleArray.length );

        //reset this variable incase we use this script for other days
        that.openTime = null;
        that.closingTime = null;
        
        return startEndIndexes;

        // loop through array and pick out time gaps
        // scheduleArray.forEach(function(item,i){
        //     if ( to && to !== item.from ) {
        //         startEndIndexes.push(i);
        //     }
        //     to = item.to;
        // });

        // // depending on number of gaps found, determine start and end indexes
        // if ( startEndIndexes.length >= 2 ) {
        //     start = startEndIndexes[0];
        //     end = startEndIndexes[1];
        // } else {
        //     start = 0;
        //     if ( startEndIndexes.length === 1 ) {
        //         end = startEndIndexes[0];
        //     } else {
        //         end = scheduleArray.length;
        //     }
        // }
        
        // returned sliced portion of original schedule
        //return scheduleArray.slice(start,end);
    };
    
    RoomResForm.prototype.getOpenHours = function(hoursData){
        //returns the opening and closing hours for the main library
        var hoursObj,
            that = this;
            
            //console.log( hoursData );
        
        //filter object for the main library and the current date passed in
        hoursObj = $.grep( hoursData.locations, function(library){
            return library.lid == that.lid ;
        } );
        //use this recursive function to locate the day's hours for the date passed
        hoursObj = _findObjectByKeyVal( hoursObj[0].weeks, 'date', that.dateYmd );
        
        //identify the date situation and create global variables
        if( 'hours' in hoursObj.times ){
            //use the function to convert a series of strings into an actual Date Object
            that.openTime    = _convertToDateObj( hoursObj, 'from' );
            that.closingTime = _convertToDateObj( hoursObj, 'to');
            
            //if this day closes at 1am, then we need to kick the closing time to the next day
            if( (hoursObj.times.hours[0].to).indexOf( 'am' ) != -1 ){
                //that.closingTime = that.closingTime.setDate(that.closingTime.getDate() + 1 );
                that.closingTime = new Date( that.closingTime.getTime() + ( 1*24*60*60*1000 ) );
                //console.log( that.closingTime.toString() );
            }
            
            //cast into milliseconds
            that.openTime   = that.openTime.getTime();
            that.closingTime = that.closingTime.getTime();
            
            //console.log( hoursObj.date, ': custom Hours difference ', Math.abs(that.closingTime - that.openTime) / 36e5 );
    
        }else if( hoursObj.times.status == '24hours' ){
            //if the status is 24 hours, we need to set the beginning end of this day
            var date = new Date( hoursObj.date );

            that.openTime    = date.getTime();            

            //could be end.setHours(23,59,59,999);
            //that.closingTime = that.openTime.setDate(that.openTime.getDate() + 1 );
            that.closingTime =   new Date( that.openTime + ( 1*24*60*60*1000 ) ).getTime();
            
            //console.log( hoursObj.date,  ': 24 hours difference ', Math.abs(that.closingTime - that.openTime) / 36e5 );
            
            //console.log( '24 hour closing time',  new Date (that.openTime).toString() , new Date (that.closingTime ).toString() );
            
            //console.log( '24 hour closing time', that.openTime, that.closingTime  );
        }
        

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
                
                //for testing purposes
                //console.log( responseObject );

            if ( responseObject.booking_id ) {
                responseHTML =  ['<p class="ccl-h2 ccl-u-mt-0">Success!</p>',
                                '<p class="ccl-h4">Your booking ID is <span class="ccl-u-color-school">' + responseObject.booking_id + '</span></p>',
                                '<p class="ccl-h4">Please check your email to confirm your booking.</p>'];
            } else {
                
                responseHTML =  ['<p class="ccl-h3 ccl-u-mt-0">Sorry, but we couldn\'t process your reservation.</p>','<p class="ccl-h4">Errors:</p>'];
                
                
                $(responseObject).each(function(i, error){
                    //rewrite the error message of the error pertains to email domain
                    if( error.errors.match( /\semail domain/ ) ){
                        responseHTML.push( $('<p />').addClass('ccl-c-alert ccl-is-error').html('Please use a valid Claremont Colleges email address.') );
                    }else{
                        responseHTML.push( $('<p />').addClass('ccl-c-alert ccl-is-error').html(error.errors) );                       
                    }             

                    
                });
                responseHTML.push('<p class="ccl-h4">Please contact the main services desk for help: 909-621-8150</p>');
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

function _findObjectByKeyVal (obj, key, val) {
    if (!obj || (typeof obj === 'string')) {
        return null;
    }
    if (obj[key] === val) {
        return obj;
    }
    
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          var found = _findObjectByKeyVal(obj[i], key, val);
          if (found) {
            return found;
          }
        }
    }
    return null;
}

function _convertToDateObj( hoursObj, startEnd ){
    //need to create a date object in Javascript, but the date formats from LibCal are gross
    //gets the hours and minutes and splits into array
    var hoursMinutes = $.map(hoursObj.times.hours[0][startEnd].split(':'), function( val, i ){
        return parseInt(val);
    });
    //checks whether it is Am or Pm
    if( hoursObj.times.hours[0][startEnd].indexOf( 'pm' ) != -1 ){
        hoursMinutes[0] += 12;
    }
    //get the day objects and splits into  array
    var caldate = $.map( hoursObj.date.split("-"), function( val, i ){
        return val - (i === 1);
    }  );
    
    //ideally we could use apply - but it's throwing some error 
    //var date = new ( Function.prototype.bind.apply( Date , [null].concat( caldate ) ) );
    return new Date(  caldate[0], caldate[1], caldate[2], hoursMinutes[0], hoursMinutes[1] ); 
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
		forbiddenKeys = [ENTER, TAB, CTRL, ALT, CAPS, ESC, LCMD, RCMD, LARR, UARR, RARR, DARR],
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
		this.$input 		= $(elem).find('.ccl-search');
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
				query = query.replace(/[^a-zA-Z0-9 -'.,@:]/g, "");

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

				}, 300);

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
		
		console.log( response );
		
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
				var oacParams;
				oacParams = {query :  queryString };
				
				renderedURL = 'http://www.oac.cdlib.org/search?' +  $.param( oacParams ) + '&institution=Claremont+Colleges';
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

					that.createLightBox(event);

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

	SearchAutocomplete.prototype.createLightBox = function(event) {

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkYXRhYmFzZS1maWx0ZXJzLmpzIiwiZHJvcGRvd25zLmpzIiwiaGVhZGVyLW1lbnUtdG9nZ2xlcy5qcyIsIm1vZGFscy5qcyIsInBvc3Qtc2VhcmNoLmpzIiwicXVpY2stbmF2LmpzIiwicm9vbS1yZXMuanMiLCJzZWFyY2guanMiLCJzbGlkZS10b2dnbGUtbGlzdC5qcyIsInNtb290aC1zY3JvbGwuanMiLCJzdGlja2llcy5qcyIsInRvZ2dsZS1zY2hvb2xzLmpzIiwidG9vbHRpcHMuanMiLCJ3YXlmaW5kaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeDVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9oQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogR2xvYmFsIFZhcmlhYmxlcy4gXG4gKi9cblxuXG4oZnVuY3Rpb24gKCAkLCB3aW5kb3cgKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcbiAgICBcbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5EVVJBVElPTiA9IDMwMDtcblxuICAgIENDTC5CUkVBS1BPSU5UX1NNID0gNTAwO1xuICAgIENDTC5CUkVBS1BPSU5UX01EID0gNzY4O1xuICAgIENDTC5CUkVBS1BPSU5UX0xHID0gMTAwMDtcbiAgICBDQ0wuQlJFQUtQT0lOVF9YTCA9IDE1MDA7XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdodG1sJykudG9nZ2xlQ2xhc3MoJ25vLWpzIGpzJyk7XG4gICAgfSk7XG5cbn0pKGpRdWVyeSwgdGhpcyk7IiwiLyoqXG4gKiBSZWZsb3cgcGFnZSBlbGVtZW50cy4gXG4gKiBcbiAqIEVuYWJsZXMgYW5pbWF0aW9ucy90cmFuc2l0aW9ucyBvbiBlbGVtZW50cyBhZGRlZCB0byB0aGUgcGFnZSBhZnRlciB0aGUgRE9NIGhhcyBsb2FkZWQuXG4gKi9cblxuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wucmVmbG93ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH07XG5cbn0pKCk7IiwiLyoqXG4gKiBHZXQgdGhlIFNjcm9sbGJhciB3aWR0aFxuICogVGhhbmtzIHRvIGRhdmlkIHdhbHNoOiBodHRwczovL2Rhdmlkd2Fsc2gubmFtZS9kZXRlY3Qtc2Nyb2xsYmFyLXdpZHRoXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgXG4gICAgZnVuY3Rpb24gZ2V0U2Nyb2xsV2lkdGgoKSB7XG4gICAgICAgIFxuICAgICAgICAvLyBDcmVhdGUgdGhlIG1lYXN1cmVtZW50IG5vZGVcbiAgICAgICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIFxuICAgICAgICAvLyBwb3NpdGlvbiB3YXkgdGhlIGhlbGwgb2ZmIHNjcmVlblxuICAgICAgICAkKHNjcm9sbERpdikuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwcHgnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwcHgnLFxuICAgICAgICAgICAgb3ZlcmZsb3c6ICdzY3JvbGwnLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6ICctOTk5OXB4JyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnYm9keScpLmFwcGVuZChzY3JvbGxEaXYpO1xuXG4gICAgICAgIC8vIEdldCB0aGUgc2Nyb2xsYmFyIHdpZHRoXG4gICAgICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgICAgICAgLy8gY29uc29sZS53YXJuKHNjcm9sbGJhcldpZHRoKTsgLy8gTWFjOiAgMTVcblxuICAgICAgICAvLyBEZWxldGUgdGhlIERJViBcbiAgICAgICAgJChzY3JvbGxEaXYpLnJlbW92ZSgpO1xuXG4gICAgICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aDtcbiAgICB9XG4gICAgXG4gICAgaWYgKCAhIHdpbmRvdy5DQ0wgKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wuZ2V0U2Nyb2xsV2lkdGggPSBnZXRTY3JvbGxXaWR0aDtcbiAgICBDQ0wuU0NST0xMQkFSV0lEVEggPSBnZXRTY3JvbGxXaWR0aCgpO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiAuZGVib3VuY2UoKSBmdW5jdGlvblxuICogXG4gKiBTb3VyY2U6IGh0dHBzOi8vZGF2aWR3YWxzaC5uYW1lL2phdmFzY3JpcHQtZGVib3VuY2UtZnVuY3Rpb25cbiAqL1xuXG5cbihmdW5jdGlvbih3aW5kb3cpIHtcblxuICAgIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAgIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAgIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAgIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICAgIHZhciB0aHJvdHRsZSA9IGZ1bmN0aW9uIChmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgICAgIHZhciB0aW1lb3V0LCBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB0aHJvdHRsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcblxuICAgICAgICB0aHJvdHRsZWQuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgcHJldmlvdXMgPSAwO1xuICAgICAgICAgICAgdGltZW91dCA9IGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdGhyb3R0bGVkO1xuICAgIH07XG5cbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIHdpbmRvdy5DQ0wudGhyb3R0bGUgPSB0aHJvdHRsZTtcblxufSkodGhpcyk7IiwiLyoqXG4gKiBBY2NvcmRpb25zXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBhY2NvcmRpb24gY29tcG9uZW50c1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgQWNjb3JkaW9uID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiR0b2dnbGUgPSB0aGlzLiRlbC5jaGlsZHJlbignLmNjbC1jLWFjY29yZGlvbl9fdG9nZ2xlJyk7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQgPSB0aGlzLiRlbC5jaGlsZHJlbignLmNjbC1jLWFjY29yZGlvbl9fY29udGVudCcpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgQWNjb3JkaW9uLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiR0b2dnbGUub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy4kY29udGVudC5zbGlkZVRvZ2dsZSgpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLnRvZ2dsZUNsYXNzKCdjY2wtaXMtb3BlbicpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWMtYWNjb3JkaW9uJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IEFjY29yZGlvbih0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIEFsZXJ0c1xuICogXG4gKiBCZWhhdmlvciBmb3IgYWxlcnRzXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIERVUkFUSU9OID0gQ0NMLkRVUkFUSU9OO1xuXG4gICAgdmFyIEFsZXJ0RGlzbWlzcyA9IGZ1bmN0aW9uKCRlbCl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICAgICAgdGhpcy50YXJnZXQgPSAkZWwucGFyZW50KCk7XG4gICAgICAgIHRoaXMuJHRhcmdldCA9ICQodGhpcy50YXJnZXQpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEFsZXJ0RGlzbWlzcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgX3RoaXMuJHRhcmdldC5hbmltYXRlKCB7IG9wYWNpdHk6IDAgfSwge1xuICAgICAgICAgICAgZHVyYXRpb246IERVUkFUSU9OLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5zbGlkZVVwKCBEVVJBVElPTiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG5cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCAnY2xpY2snLCAnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICB2YXIgZGlzbWlzc0VsID0gJChlLnRhcmdldCkuY2xvc2VzdCgnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJyk7XG4gICAgICAgICAgICBuZXcgQWxlcnREaXNtaXNzKGRpc21pc3NFbCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICogQ2Fyb3VzZWxzXG4gKiBcbiAqIEluaXRpYWxpemUgYW5kIGRlZmluZSBiZWhhdmlvciBmb3IgY2Fyb3VzZWxzLiBcbiAqIFVzZXMgdGhlIFNsaWNrIFNsaWRlcyBqUXVlcnkgcGx1Z2luIC0tPiBodHRwOi8va2Vud2hlZWxlci5naXRodWIuaW8vc2xpY2svXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBDYXJvdXNlbCA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLmdsb2JhbERlZmF1bHRzID0ge1xuICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICBkb3RzQ2xhc3M6ICdjY2wtYy1jYXJvdXNlbF9fcGFnaW5nJyxcbiAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgIH07XG5cbiAgICBDYXJvdXNlbC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuJGVsLmRhdGEoKSxcbiAgICAgICAgICAgIG9wdGlvbnMgPSBkYXRhLm9wdGlvbnMgfHwge307XG4gICAgICAgICAgICBcbiAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlID0gW107XG5cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNTbSApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9TTSwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc1NtXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc01kICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX01ELCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zTWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zTGcgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfTEcsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNMZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNYbCApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9YTCwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc1hsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCggdGhpcy5nbG9iYWxEZWZhdWx0cywgb3B0aW9ucyApO1xuXG4gICAgICAgIHZhciBjYXJvdXNlbCA9IHRoaXMuJGVsLnNsaWNrKG9wdGlvbnMpLFxuICAgICAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGNhcm91c2VsLm9uKCdiZWZvcmVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKXtcbiAgICAgICAgICAgIF90aGlzLiRlbC5maW5kKCcuc2xpY2stc2xpZGUnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXBhc3QnKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5maW5kKCcuc2xpY2stc2xpZGVbZGF0YS1zbGljay1pbmRleD1cIicrbmV4dFNsaWRlKydcIl0nKS5wcmV2QWxsKCkuYWRkQ2xhc3MoJ2NjbC1pcy1wYXN0Jyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtcHJvbW8tY2Fyb3VzZWwnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgQ2Fyb3VzZWwodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKlxuICogRGF0YWJhc2UgRmlsdGVyaW5nXG4gKiBcbiAqIEluaXRpYWxpemVzIGFuZCBkZWZpbmVzIHRoZSBiZWhhdmlvciBmb3IgZmlsdGVyaW5nIHVzaW5nIEpQTGlzdFxuICogaHR0cHM6Ly9qcGxpc3QuY29tL2RvY3VtZW50YXRpb25cbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIGRhdGFiYXNlRmlsdGVycyA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgICAgICAgICAgICAgICAgPSAkKCBlbCApO1xuICAgICAgICB0aGlzLnBhbmVsT3B0aW9ucyAgICAgICA9ICQoZWwpLmZpbmQoICcuY2NsLWMtZGF0YWJhc2UtZmlsdGVyX19wYW5lbCcgKTtcbiAgICAgICAgdGhpcy5uYW1lVGV4dGJveCAgICAgICAgPSAkKCBlbCApLmZpbmQoICdbZGF0YS1jb250cm9sLXR5cGU9XCJ0ZXh0Ym94XCJdJyApO1xuICAgICAgICB0aGlzLmRhdGFiYXNlX2Rpc3BsYXllZCA9ICQoIHRoaXMucGFuZWxPcHRpb25zICkuZmluZCgnLmNjbC1jLWRhdGFiYXNlX19kaXNwbGF5ZWQnKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZV9hdmFpbCAgICAgPSAkKCB0aGlzLnBhbmVsT3B0aW9ucyApLmZpbmQoJy5jY2wtYy1kYXRhYmFzZV9fYXZhaWwnKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZUNvbnRhaW5lciAgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtZGF0YWJhc2UtZmlsdGVyX19jb250YWluZXInKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZV9jb3VudCAgICAgPSAkKGVsKS5maW5kKCAnLmNjbC1jLWRhdGFiYXNlLWZpbHRlcl9fY291bnQnICk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2VSZXNldCAgICAgID0gJChlbCkuZmluZCggJy5jY2wtYy1kYXRhYmFzZS1maWx0ZXItLXJlc2V0JyApO1xuICAgICAgICB0aGlzLnJ1blRpbWVzICAgICAgICAgICA9IDA7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgZGF0YWJhc2VGaWx0ZXJzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy4kZWwuanBsaXN0KHtcbiAgICAgICAgICAgIGl0ZW1zQm94ICAgICAgICA6ICcuY2NsLWMtZGF0YWJhc2UtZmlsdGVyX19jb250YWluZXInLCBcbiAgICAgICAgICAgIGl0ZW1QYXRoICAgICAgICA6ICcuY2NsLWMtZGF0YWJhc2UnLCBcbiAgICAgICAgICAgIHBhbmVsUGF0aCAgICAgICA6ICcuY2NsLWMtZGF0YWJhc2UtZmlsdGVyX19wYW5lbCcsXG4gICAgICAgICAgICBlZmZlY3QgICAgICAgICAgOiAnZmFkZScsXG4gICAgICAgICAgICBkdXJhdGlvbiAgICAgICAgOiAzMDAsXG4gICAgICAgICAgICByZWRyYXdDYWxsYmFjayAgOiBmdW5jdGlvbiggY29sbGVjdGlvbiwgJGRhdGF2aWV3LCBzdGF0dXNlcyApe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vY2hlY2sgZm9yIGluaXRpYWwgbG9hZFxuICAgICAgICAgICAgICAgIGlmKCBfdGhpcy5ydW5UaW1lcyA9PT0gMCApe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5ydW5UaW1lcysrO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9nZXQgdGhlIHZhbHVlcyBvZiB0aGUgdXBkYXRlZCByZXN1bHRzLCBhbmQgdGhlIHRvdGFsIG51bWJlciBvZiBkYXRhYmFzZXMgd2Ugc3RhcnRlZCB3aXRoXG4gICAgICAgICAgICAgICAgdmFyIHVwZGF0ZWREYXRhYmFzZXMgPSAkZGF0YXZpZXcubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBkZWZhdWx0RGF0YWJhc2VzID0gIHBhcnNlSW50KCBfdGhpcy5kYXRhYmFzZV9hdmFpbC50ZXh0KCksIDEwICk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vb24gb2NjYXNpb24sIHRoZSBwbHVnaW4gZ2l2ZXMgdXMgdGhlIHdyb25nIG51bWJlciBvZiBkYXRhYmFzZXMsIHRoaXMgd2lsbCBwcmV2ZW50IHRoaXMgZnJvbSBoYXBwZW5pbmdcbiAgICAgICAgICAgICAgICBpZiggdXBkYXRlZERhdGFiYXNlcyA+IGRlZmF1bHREYXRhYmFzZXMgICl7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWREYXRhYmFzZXMgPSBkZWZhdWx0RGF0YWJhc2VzO1xuICAgICAgICAgICAgICAgICAgICAvL2hhcmRSZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAvL190aGlzLmRhdGFiYXNlUmVzZXQuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL3VwZGF0ZSB0aGUgbnVtYmVyIG9mIHNob3duIGRhdGFiYXNlc1xuICAgICAgICAgICAgICAgIF90aGlzLmRhdGFiYXNlX2Rpc3BsYXllZC50ZXh0KCB1cGRhdGVkRGF0YWJhc2VzICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy92aXN1YWwgZmVlZGJhY2sgZm9yIHVwZGF0aW5nIGRhdGFiYXNlc1xuICAgICAgICAgICAgICAgIF90aGlzLnB1bHNlVHdpY2UoIF90aGlzLmRhdGFiYXNlX2NvdW50ICk7XG4gICAgICAgICAgICAgICAgX3RoaXMucHVsc2VUd2ljZSggX3RoaXMuZGF0YWJhc2VDb250YWluZXIgKTtcblxuICAgICAgICAgICAgICAgLy9pZiBmaWx0ZXJzIGFyZSB1c2VkLCB0aGUgc2hvdyB0aGUgcmVzZXQgb3B0aW9uc1xuICAgICAgICAgICAgICAgIGlmKCB1cGRhdGVkRGF0YWJhc2VzICE9IGRlZmF1bHREYXRhYmFzZXMgKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGF0YWJhc2VSZXNldC5zaG93KCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRhdGFiYXNlUmVzZXQuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBfdGhpcy5kYXRhYmFzZVJlc2V0Lm9uKCdjbGljaycsIGhhcmRSZXNldCApO1xuICAgICAgICAvL3RoZSByZXNldCBmdW5jdGlvbiBpcyBub3Qgd29ya2luZ1xuICAgICAgICAvL3RoaXMgaXMgYSBiaXQgb2YgYSBoYWNrLCBidXQgd2UgYXJlIHVzaW5nIHRyaWdnZXJzIGhlcmUgdG8gZG8gYSBoYXJkIHJlc2V0XG4gICAgICAgIGZ1bmN0aW9uIGhhcmRSZXNldCgpe1xuICAgICAgICAgICAgJCgnLmNjbC1jLWRhdGFiYXNlLWZpbHRlcl9fcGFuZWwnKS5maW5kKCdpbnB1dDpjaGVja2VkJykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAkKCcuY2NsLWMtZGF0YWJhc2UtZmlsdGVyX19wYW5lbCcpLmZpbmQoJ2lucHV0OmNoZWNrZWQnKSApO1xuICAgICAgICAgICAgJCggX3RoaXMubmFtZVRleHRib3ggKS52YWwoJycpLnRyaWdnZXIoJ2tleXVwJyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIGRhdGFiYXNlRmlsdGVycy5wcm90b3R5cGUucHVsc2VUd2ljZSA9IGZ1bmN0aW9uKCBlbCApe1xuICAgICAgICBlbC5hZGRDbGFzcygnY2NsLWMtZGF0YWJhc2UtZmlsdGVyLS1vbi1jaGFuZ2UnKTtcbiAgICAgICAgZWwub24oIFwid2Via2l0QW5pbWF0aW9uRW5kIG9hbmltYXRpb25lbmQgbXNBbmltYXRpb25FbmQgYW5pbWF0aW9uZW5kXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkKGVsKS5yZW1vdmVDbGFzcygnY2NsLWMtZGF0YWJhc2UtZmlsdGVyLS1vbi1jaGFuZ2UnKTtcbiAgICAgICAgfSApO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgJCgnLmNjbC1kYXRhYmFzZS1maWx0ZXInKS5lYWNoKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IGRhdGFiYXNlRmlsdGVycyggdGhpcyApOyAgICAgICAgICAgXG4gICAgICAgIH0gKTtcblxuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBEcm9wZG93bnNcbiAqIFxuICogSW5pdGlhbGl6ZSBhbmQgY29udHJvbCBiZWhhdmlvciBmb3IgZHJvcGRvd24gbWVudXNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgVE9HR0xFOiAnW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBBQ1RJVkU6ICdjY2wtaXMtYWN0aXZlJyxcbiAgICAgICAgICAgIENPTlRFTlQ6ICdjY2wtYy1kcm9wZG93bl9fY29udGVudCdcbiAgICAgICAgfTtcblxuICAgIHZhciBEcm9wZG93blRvZ2dsZSA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHBhcmVudCA9IHRoaXMuJHRvZ2dsZS5wYXJlbnQoKTtcbiAgICAgICAgXG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLiR0b2dnbGUuZGF0YSgndGFyZ2V0Jyk7XG5cbiAgICAgICAgdGhpcy4kY29udGVudCA9ICQoIHRhcmdldCApO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHRvZ2dsZS5jbGljayggZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgX3RoaXMudG9nZ2xlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICB2YXIgaGFzQWN0aXZlTWVudXMgPSAkKCAnLicgKyBjbGFzc05hbWUuQ09OVEVOVCArICcuJyArIGNsYXNzTmFtZS5BQ1RJVkUgKS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoIGhhc0FjdGl2ZU1lbnVzICl7XG4gICAgICAgICAgICAgICAgX2NsZWFyTWVudXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGlzQWN0aXZlID0gdGhpcy4kdG9nZ2xlLmhhc0NsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG5cbiAgICAgICAgaWYgKCBpc0FjdGl2ZSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2hvd0NvbnRlbnQoKTtcblxuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuc2hvd0NvbnRlbnQgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiR0b2dnbGUuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQuYWRkQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgdGhpcy4kcGFyZW50LmFkZENsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5oaWRlTWVudSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgdGhpcy4kcGFyZW50LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9jbGVhck1lbnVzKCkge1xuICAgICAgICAkKCcuY2NsLWMtZHJvcGRvd24sIC5jY2wtYy1kcm9wZG93bl9fY29udGVudCcpLnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgICQoIHNlbGVjdG9yLlRPR0dMRSApLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCBzZWxlY3Rvci5UT0dHTEUgKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgRHJvcGRvd25Ub2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBIZWFkZXIgTWVudSBUb2dnbGVzXG4gKiBcbiAqIENvbnRyb2xzIGJlaGF2aW9yIG9mIG1lbnUgdG9nZ2xlcyBpbiB0aGUgaGVhZGVyXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBIZWFkZXJNZW51VG9nZ2xlID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0aGlzLiRlbC5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIHRoaXMuJHBhcmVudE1lbnUgPSB0aGlzLiRlbC5jbG9zZXN0KCcuY2NsLWMtbWVudScpO1xuICAgICAgICB0aGlzLiRjbG9zZUljb24gPSAkKCc8c3BhbiBjbGFzcz1cImNjbC1iLWljb24gY2xvc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+Jyk7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEhlYWRlck1lbnVUb2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIHRhcmdldCBpcyBhbHJlYWR5IG9wZW5cbiAgICAgICAgICAgIGlmICggdGhhdC4kdGFyZ2V0Lmhhc0NsYXNzKCdjY2wtaXMtYWN0aXZlJykgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBjbG9zZSB0YXJnZXQgYW5kIHJlbW92ZSBhY3RpdmUgY2xhc3Nlcy9lbGVtZW50c1xuICAgICAgICAgICAgICAgIHRoYXQuJHBhcmVudE1lbnUucmVtb3ZlQ2xhc3MoJ2NjbC1oYXMtYWN0aXZlLWl0ZW0nKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHRoYXQuJHRhcmdldC5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpLmZhZGVPdXQoQ0NMLkRVUkFUSU9OKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRjbG9zZUljb24ucmVtb3ZlKCk7ICAgICAgIFxuXG4gICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICAvLyB0YXJnZXQgaXMgbm90IG9wZW5cbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gY2xvc2UgYW5kIHJlc2V0IGFsbCBhY3RpdmUgbWVudXNcbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtbWVudS5jY2wtaGFzLWFjdGl2ZS1pdGVtJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NjbC1oYXMtYWN0aXZlLWl0ZW0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJ2EuY2NsLWlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuY2NsLWItaWNvbi5jbG9zZScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNsb3NlIGFuZCByZXNldCBhbGwgYWN0aXZlIHN1Yi1tZW51IGNvbnRhaW5lcnNcbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtc3ViLW1lbnUtY29udGFpbmVyLmNjbC1pcy1hY3RpdmUnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKS5mYWRlT3V0KENDTC5EVVJBVElPTik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBhY3RpdmF0ZSB0aGUgc2VsZWN0ZWQgdGFyZ2V0XG4gICAgICAgICAgICAgICAgdGhhdC4kcGFyZW50TWVudS5hZGRDbGFzcygnY2NsLWhhcy1hY3RpdmUtaXRlbScpO1xuICAgICAgICAgICAgICAgIHRoYXQuJHRhcmdldC5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpLmZhZGVJbihDQ0wuRFVSQVRJT04pO1xuICAgICAgICAgICAgICAgIC8vIHByZXBlbmQgY2xvc2UgaWNvblxuICAgICAgICAgICAgICAgIHRoYXQuJGNsb3NlSWNvbi5wcmVwZW5kVG8odGhhdC4kZWwpO1xuICAgICAgICAgICAgICAgIENDTC5yZWZsb3codGhhdC4kY2xvc2VJY29uWzBdKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRjbG9zZUljb24uZmFkZUluKDIwMCk7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy10b2dnbGUtaGVhZGVyLW1lbnUnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgSGVhZGVyTWVudVRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIE1vZGFsc1xuICogXG4gKiBCZWhhdmlvciBmb3IgbW9kYWxzLiBCYXNlZCBvbiBCb290c3RyYXAncyBtb2RhbHM6IGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzQuMC9jb21wb25lbnRzL21vZGFsL1xuICogXG4gKiBHbG9iYWxzOlxuICogU0NST0xMQkFSV0lEVEhcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgRFVSQVRJT04gPSAzMDA7XG5cbiAgICB2YXIgTW9kYWxUb2dnbGUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgJGVsID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLnRhcmdldCA9ICRlbC5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7IFxuXG4gICAgICAgIF90aGlzLiRlbC5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmICggJChkb2N1bWVudC5ib2R5KS5oYXNDbGFzcygnY2NsLW1vZGFsLW9wZW4nKSApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jbG9zZU1vZGFsKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzLnNob3dCYWNrZHJvcChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zaG93TW9kYWwoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLnNob3dCYWNrZHJvcCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblxuICAgICAgICB2YXIgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdmFyICRiYWNrZHJvcCA9ICQoYmFja2Ryb3ApO1xuXG4gICAgICAgICRiYWNrZHJvcC5hZGRDbGFzcygnY2NsLWMtbW9kYWxfX2JhY2tkcm9wJyk7XG4gICAgICAgICRiYWNrZHJvcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgXG4gICAgICAgIENDTC5yZWZsb3coYmFja2Ryb3ApO1xuICAgICAgICBcbiAgICAgICAgJGJhY2tkcm9wLmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICAkKGRvY3VtZW50LmJvZHkpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJylcbiAgICAgICAgICAgIC5jc3MoICdwYWRkaW5nLXJpZ2h0JywgQ0NMLlNDUk9MTEJBUldJRFRIICk7XG5cbiAgICAgICAgaWYgKCBjYWxsYmFjayApIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoIGNhbGxiYWNrLCBEVVJBVElPTiApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5zaG93TW9kYWwgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBfdGhpcy4kdGFyZ2V0LnNob3coIDAsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAkKCcuY2NsLWMtbW9kYWwnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsJykuaGlkZSgpO1xuXG4gICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWxfX2JhY2tkcm9wJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWxfX2JhY2tkcm9wJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLW1vZGFsLW9wZW4nKVxuICAgICAgICAgICAgICAgICAgICAuY3NzKCAncGFkZGluZy1yaWdodCcsICcnICk7XG5cbiAgICAgICAgICAgIH0sIERVUkFUSU9OKTtcblxuICAgICAgICB9LCBEVVJBVElPTiApOyBcblxuICAgIH07XG5cblxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgTW9kYWxUb2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICpcbiAqIFBvc3QgVHlwZSBLZXl3b3JkIHNlYXJjaFxuICogXG4gKiBPbiB1c2VyIGlucHV0LCBmaXJlIHJlcXVlc3QgdG8gc2VhcmNoIHRoZSBkYXRhYmFzZSBjdXN0b20gcG9zdCB0eXBlIGFuZCByZXR1cm4gcmVzdWx0cyB0byByZXN1bHRzIHBhbmVsXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcblx0XHRFTlRFUiA9IDEzLCBUQUIgPSA5LCBTSElGVCA9IDE2LCBDVFJMID0gMTcsIEFMVCA9IDE4LCBDQVBTID0gMjAsIEVTQyA9IDI3LCBMQ01EID0gOTEsIFJDTUQgPSA5MiwgTEFSUiA9IDM3LCBVQVJSID0gMzgsIFJBUlIgPSAzOSwgREFSUiA9IDQwLFxuXHRcdGZvcmJpZGRlbktleXMgPSBbRU5URVIsIFRBQiwgU0hJRlQsIENUUkwsIEFMVCwgQ0FQUywgRVNDLCBMQ01ELCBSQ01ELCBMQVJSLCBVQVJSLCBSQVJSLCBEQVJSXTtcblxuICAgIHZhciBwb3N0U2VhcmNoID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCAgICAgICAgICAgID0gJCggZWwgKTtcbiAgICAgICAgdGhpcy4kZm9ybVx0XHRcdD0gdGhpcy4kZWwuZmluZCggJy5jY2wtYy1wb3N0LXNlYXJjaF9fZm9ybScgKTtcbiAgICAgICAgdGhpcy4kcG9zdFR5cGUgICAgICA9IHRoaXMuJGVsLmF0dHIoJ2RhdGEtc2VhcmNoLXR5cGUnKTtcbiAgICAgICAgdGhpcy4kaW5wdXQgICAgICAgICA9IHRoaXMuJGVsLmZpbmQoJyNjY2wtYy1wb3N0LXNlYXJjaF9faW5wdXQnKTtcbiAgICAgICAgdGhpcy4kcmVzdWx0c0xpc3QgICA9IHRoaXMuJGVsLmZpbmQoICcuY2NsLWMtcG9zdC1zZWFyY2hfX3Jlc3VsdHMnICk7XG4gICAgICAgIHRoaXMuJGlucHV0VGV4dGJveFx0PSB0aGlzLiRlbC5maW5kKCAnLmNjbC1jLXBvc3Qtc2VhcmNoX190ZXh0Ym94JyApO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIHBvc3RTZWFyY2gucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIC8vQUpBWCBldmVudCB3YXRjaGluZyBmb3IgdXNlciBpbnB1dCBhbmQgb3V0cHV0dGluZyBzdWdnZXN0ZWQgcmVzdWx0c1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICB0aW1lb3V0LFxuICAgICAgICBxdWVyeTtcbiAgICAgICAgXG5cblx0XHQvL2tleWJvYXJkIGV2ZW50cyBmb3Igc2VuZGluZyBxdWVyeSB0byBkYXRhYmFzZVxuXHRcdHRoaXMuJGlucHV0XG5cdFx0XHQub24oJ2tleXVwIGtleXByZXNzJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHQgICAgXG5cdFx0XHQgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHQgICAgXG5cdFx0XHRcdC8vIGNsZWFyIGFueSBwcmV2aW91cyBzZXQgdGltZW91dFxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cblx0XHRcdFx0Ly8gaWYga2V5IGlzIGZvcmJpZGRlbiwgcmV0dXJuXG5cdFx0XHRcdGlmICggZm9yYmlkZGVuS2V5cy5pbmRleE9mKCBldmVudC5rZXlDb2RlICkgPiAtMSApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBnZXQgdmFsdWUgb2Ygc2VhcmNoIGlucHV0XG5cdFx0XHRcdF90aGlzLnF1ZXJ5ID0gX3RoaXMuJGlucHV0LnZhbCgpO1xuXHRcdFx0XHQvL3JlbW92ZSBkb3VibGUgcXVvdGF0aW9ucyBhbmQgb3RoZXIgY2hhcmFjdGVycyBmcm9tIHN0cmluZ1xuXHRcdFx0XHRfdGhpcy5xdWVyeSA9IF90aGlzLnF1ZXJ5LnJlcGxhY2UoL1teYS16QS1aMC05IC0nLixdL2csIFwiXCIpO1xuXG5cdFx0XHRcdC8vIHNldCBhIHRpbWVvdXQgZnVuY3Rpb24gdG8gdXBkYXRlIHJlc3VsdHMgb25jZSA2MDBtcyBwYXNzZXNcblx0XHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0aWYgKCBfdGhpcy5xdWVyeS5sZW5ndGggPiAyICkge1xuXG5cdFx0XHRcdFx0IFx0X3RoaXMuZmV0Y2hQb3N0UmVzdWx0cyggX3RoaXMucXVlcnkgKTtcblx0XHRcdFx0XHQgXHRcblx0XHRcdFx0XHQgXHRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ICAgIF90aGlzLiRyZXN1bHRzTGlzdC5oaWRlKCk7XG5cdFx0XHRcdFx0XHQvL190aGlzLiRyZXN1bHRzTGlzdC5odG1sKCcnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSwgMjAwKTtcblxuXHRcdFx0fSlcblx0XHRcdC5mb2N1cyhmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAoIF90aGlzLiRpbnB1dC52YWwoKSAhPT0gJycgKSB7XG5cdFx0XHRcdFx0X3RoaXMuJHJlc3VsdHNMaXN0LnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdH0pXG5cdFx0XHQuYmx1cihmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJyBpbnB1dCBibHVycmVkJyk7XG5cdFx0XHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsIF9vbkJsdXJyZWRDbGljayk7XG5cblx0XHRcdH0pO1xuXHRcdFxuXHRcdGZ1bmN0aW9uIF9vbkJsdXJyZWRDbGljayhldmVudCkge1xuXHRcdFx0XG5cdFx0XHRpZiAoICEgJC5jb250YWlucyggX3RoaXMuJGVsWzBdLCBldmVudC50YXJnZXQgKSApIHtcblx0XHRcdFx0X3RoaXMuJHJlc3VsdHNMaXN0LmhpZGUoKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0JChkb2N1bWVudCkub2ZmKCdjbGljaycsIF9vbkJsdXJyZWRDbGljayk7XG5cblx0XHR9XG5cdFx0XG5cdFx0dGhpcy4kZm9ybS5vbignc3VibWl0JywgZnVuY3Rpb24oIGV2ZW50ICl7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHQvLyBnZXQgdmFsdWUgb2Ygc2VhcmNoIGlucHV0XG5cdFx0XHQvLyBfdGhpcy5xdWVyeSA9IF90aGlzLiRpbnB1dC52YWwoKTtcblx0XHRcdC8vIC8vcmVtb3ZlIGRvdWJsZSBxdW90YXRpb25zIGFuZCBvdGhlciBjaGFyYWN0ZXJzIGZyb20gc3RyaW5nXG5cdFx0XHQvLyBfdGhpcy5xdWVyeSA9IF90aGlzLnF1ZXJ5LnJlcGxhY2UoL1teYS16QS1aMC05IC0nLixdL2csIFwiXCIpO1xuXHRcdFx0Y29uc29sZS5sb2coX3RoaXMucXVlcnkpO1x0XG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0aWYgKCBfdGhpcy5xdWVyeS5sZW5ndGggPiAyICkge1xuXG5cdFx0XHQgXHRfdGhpcy5mZXRjaFBvc3RSZXN1bHRzKCBfdGhpcy5xdWVyeSApO1xuXHRcdFx0IFx0XG5cdFx0XHQgXHRcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0ICAgIF90aGlzLiRyZXN1bHRzTGlzdC5oaWRlKCk7XG5cdFx0XHRcdC8vX3RoaXMuJHJlc3VsdHNMaXN0Lmh0bWwoJycpO1xuXHRcdFx0fVx0XHRcdFxuXHRcdFx0XG5cdFx0fSk7XG4gICAgfTtcbiAgICBcbiAgICBwb3N0U2VhcmNoLnByb3RvdHlwZS5mZXRjaFBvc3RSZXN1bHRzID0gZnVuY3Rpb24oIHF1ZXJ5ICl7XG5cdFx0Ly9zZW5kIEFKQVggcmVxdWVzdCB0byBQSFAgZmlsZSBpbiBXUFxuXHRcdHZhciBfdGhpcyA9IHRoaXMsXG5cdFx0XHRkYXRhID0ge1xuXHRcdFx0XHRhY3Rpb24gICAgICA6ICdyZXRyaWV2ZV9wb3N0X3NlYXJjaF9yZXN1bHRzJywgLy8gdGhpcyBzaG91bGQgcHJvYmFibHkgYmUgYWJsZSB0byBkbyBwZW9wbGUgJiBhc3NldHMgdG9vIChtYXliZSBEQnMpXG5cdFx0XHRcdHF1ZXJ5ICAgICAgIDogcXVlcnksXG5cdFx0XHRcdHBvc3RUeXBlICAgIDogX3RoaXMuJHBvc3RUeXBlXG5cdFx0XHR9O1xuXG5cdFx0X3RoaXMuJGlucHV0VGV4dGJveC5hZGRDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcblx0XHRcblx0XHQvL2NvbnNvbGUubG9nKCBfdGhpcyApO1xuXG5cdFx0JC5wb3N0KENDTC5hamF4X3VybCwgZGF0YSlcblx0XHRcdC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0ICAgIFxuXHRcdFx0XHQvL2Z1bmN0aW9uIGZvciBwcm9jZXNzaW5nIHJlc3VsdHNcblx0XHRcdFx0X3RoaXMucHJvY2Vzc1Bvc3RSZXN1bHRzKHJlc3BvbnNlKTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vY29uc29sZS5sb2coICdyZXNwb25zZScsIHJlc3BvbnNlICk7XG5cblx0XHRcdH0pXG5cdFx0XHQuYWx3YXlzKGZ1bmN0aW9uKCl7XG5cblx0XHRcdFx0X3RoaXMuJGlucHV0VGV4dGJveC5yZW1vdmVDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcblxuXHRcdFx0fSk7ICAgICAgICBcbiAgICB9O1xuICAgIFxuICAgIHBvc3RTZWFyY2gucHJvdG90eXBlLnByb2Nlc3NQb3N0UmVzdWx0cyA9IGZ1bmN0aW9uKCByZXNwb25zZSApe1xuICAgICAgICB2YXIgX3RoaXMgICAgICAgPSB0aGlzLFxuXHRcdCAgICByZXN1bHRzICAgICA9ICQucGFyc2VKU09OKHJlc3BvbnNlKSxcblx0XHQgICAgcmVzdWx0Q291bnRcdD0gcmVzdWx0cy5jb3VudCxcblx0XHQgICAgcmVzdWx0SXRlbXMgPSAkKCc8dWwgLz4nKS5hZGRDbGFzcygnY2NsLWMtcG9zdC1zZWFyY2hfX3Jlc3VsdHMtdWwnKSxcbiAgICAgICAgICAgIHJlc3VsdHNDbG9zZSA9ICQoJzxsaSAvPicpXG4gICAgICAgICAgICBcdC5hZGRDbGFzcygnY2NsLWMtc2VhcmNoLS1jbG9zZS1yZXN1bHRzJylcbiAgICAgICAgICAgIFx0LmFwcGVuZCggJCgnPGRpdiAvPicpLmFkZENsYXNzKCdjY2wtYy1wb3N0LXNlYXJjaF9fY291bnQgY2NsLXUtd2VpZ2h0LWJvbGQgY2NsLXUtZmFkZWQnKSAgXG4gICAgICAgIFx0XHRcdFx0XHQuYXBwZW5kKCAkKCc8aSAvPicpLmFkZENsYXNzKCdjY2wtYi1pY29uIGFycm93LWRvd24nKSApXG4gICAgXHRcdFx0XHRcdFx0LmFwcGVuZCggJCgnPHNwYW4gLz4nKS5odG1sKCAnJm5ic3A7Jm5ic3AnICsgcmVzdWx0Q291bnQgKyAnIGZvdW5kJykgKVxuICAgICAgICAgICAgXHRcdClcbiAgICAgICAgICAgIFx0LmFwcGVuZCggJCgnPGJ1dHRvbiAvPicpLmFkZENsYXNzKCdjY2wtYi1jbG9zZSBjY2wtYy1zZWFyY2gtLWNsb3NlX19idXR0b24nKS5hdHRyKCdhcmlhbC1sYWJlbCcsICdDbG9zZScpXG5cdCAgICAgICAgICAgIFx0XHRcdC5hcHBlbmQoICQoJzxpIC8+JykuYXR0cignYXJpYS1oaWRkZW4nLCB0cnVlICkuYWRkQ2xhc3MoJ2NjbC1iLWljb24gY2xvc2UgY2NsLXUtd2VpZ2h0LWJvbGQgY2NsLXUtZm9udC1zaXplLXNtJykgKVxuICAgICAgICAgICAgXHRcdCk7XG5cblxuXHRcdCAgICBcblx0XHQgICAgaWYoIHJlc3VsdHMucG9zdHMubGVuZ3RoID09PSAwICl7XG5cdFx0ICAgIFx0dGhpcy4kcmVzdWx0c0xpc3QuaHRtbCgnJyk7XHRcdCAgICBcdFxuXHRcdCAgICAgICAgdGhpcy4kcmVzdWx0c0xpc3Quc2hvdygpLmFwcGVuZCggJCgnPGRpdiAvPicpLmFkZENsYXNzKCdjY2wtdS1weS1udWRnZSBjY2wtdS13ZWlnaHQtYm9sZCBjY2wtdS1mYWRlZCcpLmh0bWwoJ1NvcnJ5LCBubyBkYXRhYmFzZXMgZm91bmQgLSB0cnkgYW5vdGhlciBzZWFyY2gnKSApO1xuXG5cdFx0ICAgICAgICByZXR1cm47XG5cdFx0ICAgIH1cblx0XHQgICBcblx0XHQgICAgdGhpcy4kcmVzdWx0c0xpc3QuaHRtbCgnJyk7XG5cdFx0ICAgIFxuXHRcdCAgICByZXN1bHRJdGVtcy5hcHBlbmQoIHJlc3VsdHNDbG9zZSApO1xuXHRcdCAgICBcblx0XHQgICAgJC5lYWNoKCByZXN1bHRzLnBvc3RzLCBmdW5jdGlvbigga2V5LCB2YWwgKXtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlckl0ZW0gPSAkKCc8bGkgLz4nKVxuICAgICAgICAgICAgICAgIFx0LmFwcGVuZChcbiAgICAgICAgICAgICAgICBcdFx0JCgnPGEgLz4nKVxuICAgICAgICAgICAgICAgIFx0XHRcdC5hdHRyKHtcblx0XHRcdCAgICAgICAgICAgICAgICAgICAnaHJlZicgICA6IHZhbC5wb3N0X2xpbmssXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgJ3RhcmdldCcgOiAnX2JsYW5rJywgICAgICAgICAgICAgICBcdFx0XHRcdFxuICAgICAgICAgICAgICAgIFx0XHRcdH0pXG4gICAgICAgICAgICAgICAgXHRcdFx0LmFkZENsYXNzKCdjY2wtYy1kYXRhYmFzZS1zZWFyY2hfX3Jlc3VsdC1pdGVtJylcbiAgICAgICAgICAgICAgICBcdFx0XHQuaHRtbCggdmFsLnBvc3RfdGl0bGUgKyAodmFsLnBvc3RfYWx0X25hbWUgPyAnPGRpdiBjbGFzcz1cImNjbC11LXdlaWdodC1ub3JtYWwgY2NsLXUtbWwtbnVkZ2UgY2NsLXUtZm9udC1zaXplLXNtXCI+KCcgKyB2YWwucG9zdF9hbHRfbmFtZSArICcpPC9kaXY+JyA6ICcnICkgKVxuICAgICAgICAgICAgICAgIFx0XHRcdC5hcHBlbmQoICQoJzxzcGFuIC8+Jylcblx0ICAgICAgICAgICAgICAgIFx0XHRcdFx0XHQuaHRtbCggJ0FjY2VzcyZuYnNwOyZuYnNwOycgKVxuXHQgICAgICAgICAgICAgICAgXHRcdFx0XHRcdC5hcHBlbmQoICQoJzxpIC8+Jylcblx0ICAgICAgICAgICAgICAgIFx0XHRcdFx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2NjbC1iLWljb24gYXJyb3ctcmlnaHQnKVxuXHQgICAgICAgICAgICAgICAgXHRcdFx0XHRcdFx0XHRcdC5hdHRyKHtcblx0ICAgICAgICAgICAgICAgIFx0XHRcdFx0XHRcdFx0XHQnYXJpYS1oaWRkZW4nXHQ6IHRydWUsXG5cdCAgICAgICAgICAgICAgICBcdFx0XHRcdFx0XHRcdFx0J3N0eWxlJ1x0XHRcdDogXCJ2ZXJ0aWNhbC1hbGlnbjptaWRkbGVcIlxuXHQgICAgICAgICAgICAgICAgXHRcdFx0XHRcdFx0XHRcdH0pXG5cdCAgICAgICAgICAgICAgICBcdFx0XHRcdFx0XHQpIFxuICAgICAgICAgICAgICAgIFx0XHRcdFx0KVxuICAgICAgICAgICAgICAgIFx0XHQpO1xuXHRcdCAgICBcblx0XHQgICAgICAgIHJlc3VsdEl0ZW1zLmFwcGVuZCggcmVuZGVySXRlbSApO1xuXHRcdCAgICAgICAgXG5cdFx0ICAgIH0gKTtcblx0XHQgICAgXG5cdFx0ICAgIHRoaXMuJHJlc3VsdHNMaXN0LmFwcGVuZCggcmVzdWx0SXRlbXMgKS5zaG93KCk7XG5cdFx0ICAgIFxuXHRcdFx0Ly9jYWNoZSB0aGUgcmVzcG9uc2UgYnV0dG9uIGFmdGVyIGl0cyBhZGRlZCB0byB0aGUgRE9NXG5cdFx0XHRfdGhpcy4kcmVzcG9uc2VDbG9zZVx0PSBfdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNlYXJjaC0tY2xvc2VfX2J1dHRvbicpO1x0XHRcblx0XHRcdFxuXHRcdFx0Ly9jbGljayBldmVudCB0byBjbG9zZSB0aGUgcmVzdWx0cyBwYWdlXG5cdFx0XHRfdGhpcy4kcmVzcG9uc2VDbG9zZS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRcdC8vaGlkZVxuXHRcdFx0XHRcdGlmKCAkKCBfdGhpcy4kcmVzdWx0c0xpc3QgKS5pcygnOnZpc2libGUnKSApe1xuXHRcdFx0XHRcdFx0X3RoaXMuJHJlc3VsdHNMaXN0LmhpZGUoKTtcdFx0XHRcdFx0XG5cdFx0XHRcdFx0fVxuXHRcdFx0fSk7XHRcdCAgICBcblx0XHQgICAgXG5cdFx0ICAgIFxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgJCgnLmNjbC1jLXBvc3Qtc2VhcmNoJykuZWFjaCggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBwb3N0U2VhcmNoKHRoaXMpOyAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7IiwiLyoqXG4gKiBRdWljayBOYXZcbiAqIFxuICogQmVoYXZpb3IgZm9yIHRoZSBxdWljayBuYXZcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KSxcbiAgICAgICAgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgUXVpY2tOYXYgPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kc3ViTWVudXMgPSB0aGlzLiRlbC5maW5kKCcuc3ViLW1lbnUnKTtcbiAgICAgICAgdGhpcy4kc2Nyb2xsU3B5SXRlbXMgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtcXVpY2stbmF2X19zY3JvbGxzcHkgc3BhbicpO1xuICAgICAgICB0aGlzLiRzZWFyY2hUb2dnbGUgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWlzLXNlYXJjaC10b2dnbGUnKTtcblxuICAgICAgICAvLyBzZXQgdGhlIHRvZ2dsZSBvZmZzZXQgYW5kIGFjY291bnQgZm9yIHRoZSBXUCBhZG1pbiBiYXIgXG4gICAgXG4gICAgICAgIGlmICggJCgnYm9keScpLmhhc0NsYXNzKCdhZG1pbi1iYXInKSAmJiAkKCcjd3BhZG1pbmJhcicpLmNzcygncG9zaXRpb24nKSA9PSAnZml4ZWQnICkge1xuICAgICAgICAgICAgdmFyIGFkbWluQmFySGVpZ2h0ID0gJCgnI3dwYWRtaW5iYXInKS5vdXRlckhlaWdodCgpO1xuICAgICAgICAgICAgdGhpcy50b2dnbGVPZmZzZXQgPSAkKCcuY2NsLWMtdXNlci1uYXYnKS5vZmZzZXQoKS50b3AgKyAkKCcuY2NsLWMtdXNlci1uYXYnKS5vdXRlckhlaWdodCgpIC0gYWRtaW5CYXJIZWlnaHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU9mZnNldCA9ICQoJy5jY2wtYy11c2VyLW5hdicpLm9mZnNldCgpLnRvcCArICQoJy5jY2wtYy11c2VyLW5hdicpLm91dGVySGVpZ2h0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgUXVpY2tOYXYucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHRoaXMuaW5pdFNjcm9sbCgpO1xuICAgICAgICB0aGlzLmluaXRNZW51cygpO1xuICAgICAgICB0aGlzLmluaXRTY3JvbGxTcHkoKTtcbiAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG5cbiAgICB9O1xuXG4gICAgUXVpY2tOYXYucHJvdG90eXBlLmluaXRTY3JvbGwgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgNTAgKSApO1xuXG4gICAgICAgIGZ1bmN0aW9uIF9vblNjcm9sbCgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCk7XG4gICAgXG4gICAgICAgICAgICBpZiAoIHNjcm9sbFRvcCA+PSB0aGF0LnRvZ2dsZU9mZnNldCApIHtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5hZGRDbGFzcygnY2NsLWlzLWZpeGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoYXQuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtZml4ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFF1aWNrTmF2LnByb3RvdHlwZS5pbml0TWVudXMgPSBmdW5jdGlvbigpe1xuICAgICAgICBpZiAoICEgdGhpcy4kc3ViTWVudXMubGVuZ3RoICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kc3ViTWVudXMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICRzdWJNZW51ID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAkdG9nZ2xlID0gJHN1Yk1lbnUuc2libGluZ3MoJ2EnKTtcblxuICAgICAgICAgICAgJHRvZ2dsZS5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGlmICggJCh0aGlzKS5oYXNDbGFzcygnY2NsLWlzLWFjdGl2ZScpICkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlIGNjbC11LWNvbG9yLXNjaG9vbCcpO1xuICAgICAgICAgICAgICAgICAgICAkc3ViTWVudS5mYWRlT3V0KDI1MCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtcXVpY2stbmF2X19tZW51IGEuY2NsLWlzLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZSBjY2wtdS1jb2xvci1zY2hvb2wnKVxuICAgICAgICAgICAgICAgICAgICAuc2libGluZ3MoJy5zdWItbWVudScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmFkZU91dCgyNTApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUgY2NsLXUtY29sb3Itc2Nob29sJyk7XG4gICAgICAgICAgICAgICAgJHN1Yk1lbnUuZmFkZVRvZ2dsZSgyNTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdFNjcm9sbFNweSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHNjcm9sbFNweUl0ZW1zLmVhY2goZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgdmFyICRzcHlJdGVtID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSAkc3B5SXRlbS5kYXRhKCd0YXJnZXQnKTtcblxuICAgICAgICAgICAgJHdpbmRvdy5zY3JvbGwoIENDTC50aHJvdHRsZSggX29uU2Nyb2xsLCAxMDAgKSApO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBfb25TY3JvbGwoKSB7XG4gICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCksXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRvcCA9ICQodGFyZ2V0KS5vZmZzZXQoKS50b3AgLSAxNTA7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHNjcm9sbFRvcCA+PSB0YXJnZXRUb3AgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuJHNjcm9sbFNweUl0ZW1zLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICRzcHlJdGVtLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNweUl0ZW0ucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdFNlYXJjaCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy4kc2VhcmNoVG9nZ2xlLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGF0LiRlbC50b2dnbGVDbGFzcygnY2NsLXNlYXJjaC1hY3RpdmUnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5jY2wtYy1xdWljay1uYXYnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgUXVpY2tOYXYodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBSb29tIFJlc2VydmF0aW9uXG4gKiBcbiAqIEhhbmRsZSByb29tIHJlc2VydmF0aW9uc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBSb29tUmVzRm9ybSA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJGZvcm1Db250ZW50ID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tY29udGVudCcpLmNzcyh7cG9zaXRpb246J3JlbGF0aXZlJ30pO1xuICAgICAgICB0aGlzLiRmb3JtUmVzcG9uc2UgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1yZXNwb25zZScpLmNzcyh7cG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogJzFyZW0nLCBsZWZ0OiAnMXJlbScsIG9wYWNpdHk6IDB9KTtcbiAgICAgICAgdGhpcy4kZm9ybUNhbmNlbCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLWNhbmNlbCcpO1xuICAgICAgICB0aGlzLiRmb3JtU3VibWl0ID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tc3VibWl0Jyk7XG4gICAgICAgIHRoaXMuJGZvcm1SZWxvYWQgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1yZWxvYWQnKTtcbiAgICAgICAgdGhpcy5yb29tSWQgPSB0aGlzLiRlbC5kYXRhKCdyZXNvdXJjZS1pZCcpO1xuICAgICAgICB0aGlzLiRkYXRlU2VsZWN0ID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tZGF0ZS1zZWxlY3QnKTtcbiAgICAgICAgdGhpcy5kYXRlWW1kID0gdGhpcy4kZGF0ZVNlbGVjdC52YWwoKTtcbiAgICAgICAgdGhpcy4kcm9vbVNjaGVkdWxlID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tc2NoZWR1bGUnKTtcbiAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1jdXJyZW50LWR1cmF0aW9uJyk7XG4gICAgICAgIHRoaXMuJGZvcm1Ob3RpZmljYXRpb24gPSAkKCc8cCBjbGFzcz1cImNjbC1jLWFsZXJ0XCI+PC9wPicpO1xuICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0biA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yZXNldC1zZWxlY3Rpb24nKTsgXG4gICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbXTtcbiAgICAgICAgdGhpcy5tYXhTbG90cyA9IDY7XG4gICAgICAgIHRoaXMuJG1heFRpbWUgPSB0aGlzLiRlbC5maW5kKCcuanMtbWF4LXRpbWUnKTtcbiAgICAgICAgdGhpcy5zbG90TWludXRlcyA9IDMwO1xuICAgICAgICB0aGlzLmxvY2FsZSA9IFwiZW4tVVNcIjtcbiAgICAgICAgdGhpcy50aW1lWm9uZSA9IHt0aW1lWm9uZTogXCJBbWVyaWNhL0xvc19BbmdlbGVzXCJ9O1xuICAgICAgICB0aGlzLmxpZCAgICAgICAgPSA0ODE2OyAvLyA0ODE2IDg3MzlcbiAgICAgICAgdGhpcy5vcGVuVGltZSA9IG51bGw7XG4gICAgICAgIHRoaXMuY2xvc2luZ1RpbWUgPSBudWxsO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB0aGlzLnNldExvYWRpbmcoKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNjaGVkdWxlRGF0YSgpO1xuXG4gICAgICAgIHRoaXMuc2V0TWF4VGltZVRleHQoKTtcblxuICAgICAgICB0aGlzLmluaXREYXRlRXZlbnRzKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXRGb3JtRXZlbnRzKCk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5nZXRTcGFjZUF2YWlsYWJpbGl0eSA9IGZ1bmN0aW9uKFltZCl7XG5cblx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdGFjdGlvbjogJ2dldF9yb29tX2luZm8nLFxuXHRcdFx0Y2NsX25vbmNlOiBDQ0wubm9uY2UsXG5cdFx0XHRhdmFpbGFiaWxpdHk6IFltZCB8fCAnJywgLy8gZS5nLiAnMjAxNy0xMC0xOScuIGVtcHR5IHN0cmluZyB3aWxsIGdldCBhdmFpbGFiaWxpdHkgZm9yIGN1cnJlbnQgZGF5XG5cdFx0XHRyb29tOiB0aGlzLnJvb21JZCAvLyByb29tX2lkIChzcGFjZSlcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gJC5wb3N0KHtcblx0XHRcdHVybDogQ0NMLmFqYXhfdXJsLFxuXHRcdFx0ZGF0YTogZGF0YVxuXHRcdH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5nZXRTcGFjZUJvb2tpbmdzID0gZnVuY3Rpb24oWW1kKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgYWN0aW9uOiAnZ2V0X2Jvb2tpbmdzJyxcbiAgICAgICAgICAgIGNjbF9ub25jZTogQ0NMLm5vbmNlLFxuICAgICAgICAgICAgZGF0ZTogWW1kIHx8ICcnLCAvLyBlLmcuICcyMDE3LTEwLTE5Jy4gZW1wdHkgc3RyaW5nIHdpbGwgZ2V0IGJvb2tpbmdzIGZvciBjdXJyZW50IGRheVxuICAgICAgICAgICAgcm9vbTogdGhpcy5yb29tSWQsXG4gICAgICAgICAgICBsaW1pdDogNTBcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gJC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogQ0NMLmFqYXhfdXJsLFxuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcblxuICAgIH07XG4gICAgXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmdldE1haW5MaWJyYXJ5SG91cnMgPSBmdW5jdGlvbigpe1xuICAgICAgICAvL2dldCB0aGUgaG91cnMgZm9yIHRoZSBtYWluIGxpYnJhcnkgdmlhIEFKQVhcbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBhY3Rpb246ICdnZXRfbWFpbl9saWJyYXJ5X2hvdXJzJyxcbiAgICAgICAgICAgIGNjbF9ub25jZTogQ0NMLm5vbmNlICAgICAgICAgICBcbiAgICAgICAgfTtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiAkLnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiBDQ0wuYWpheF91cmwsXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pOyAgICAgICAgXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS51cGRhdGVTY2hlZHVsZURhdGEgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBnZXRTcGFjZWpxWEhSID0gdGhpcy5nZXRTcGFjZUF2YWlsYWJpbGl0eSh0aGlzLmRhdGVZbWQpO1xuICAgICAgICB2YXIgZ2V0Qm9va2luZ3NqcVhIUiA9IHRoaXMuZ2V0U3BhY2VCb29raW5ncyh0aGlzLmRhdGVZbWQpO1xuICAgICAgICB2YXIgZ2V0TWFpbkhvdXJzanFYSFIgPSB0aGlzLmdldE1haW5MaWJyYXJ5SG91cnMoKTtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgJC53aGVuKGdldFNwYWNlanFYSFIsIGdldEJvb2tpbmdzanFYSFIsIGdldE1haW5Ib3Vyc2pxWEhSKVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24oZ2V0U3BhY2UsZ2V0Qm9va2luZ3MsIGdldE1haW5Ib3Vycyl7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHNwYWNlRGF0YSA9IGdldFNwYWNlWzBdLFxuICAgICAgICAgICAgICAgICAgICBib29raW5nc0RhdGEgPSBnZXRCb29raW5nc1swXSxcbiAgICAgICAgICAgICAgICAgICAgbWFpbkhvdXJzRGF0YSA9IGdldE1haW5Ib3Vyc1swXSxcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VqcVhIUiA9IGdldFNwYWNlWzJdLFxuICAgICAgICAgICAgICAgICAgICBib29raW5nc2pxWEhSID0gZ2V0Qm9va2luZ3NbMl0sXG4gICAgICAgICAgICAgICAgICAgIHRpbWVTbG90c0FycmF5O1xuXG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgZGF0YSB0byBKU09OIGlmIGl0J3MgYSBzdHJpbmdcbiAgICAgICAgICAgICAgICBzcGFjZURhdGEgPSAoIHR5cGVvZiBzcGFjZURhdGEgPT09ICdzdHJpbmcnICkgPyBKU09OLnBhcnNlKCBzcGFjZURhdGEgKVswXSA6IHNwYWNlRGF0YVswXTtcbiAgICAgICAgICAgICAgICBib29raW5nc0RhdGEgPSAoIHR5cGVvZiBib29raW5nc0RhdGEgPT09ICdzdHJpbmcnICkgPyBKU09OLnBhcnNlKCBib29raW5nc0RhdGEgKSA6IGJvb2tpbmdzRGF0YTtcbiAgICAgICAgICAgICAgICBtYWluSG91cnNEYXRhID0gKCB0eXBlb2YgbWFpbkhvdXJzRGF0YSA9PT0gJ3N0cmluZycgKSA/IEpTT04ucGFyc2UoIG1haW5Ib3Vyc0RhdGEgKSA6IG1haW5Ib3Vyc0RhdGE7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9nZXQgdGhlIG9wZW4gaG91cnMgb2YgdGhlIGxpYnJhcnkgYW5kIHJldHVybiB0aGVzZSB0aW1lcyBhcyB2YXJpYWJsZXNcbiAgICAgICAgICAgICAgICB0aGF0LmdldE9wZW5Ib3VycyggbWFpbkhvdXJzRGF0YSApOyAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIGlmKCAhdGhhdC5vcGVuVGltZSAmJiAhdGhhdC5jbG9zaW5nVGltZSApe1xuICAgICAgICAgICAgICAgICAgICAvL2lmIHRoZSBsaWJyYXJ5IGlzIGNsb3NlZCwgdGhlbiB0aGUgb3BlblRpbWUgYW5kIGNsb3NpbmdUaW1lIHdpbGwgc3RpbGwgYmUgbnVsbFxuICAgICAgICAgICAgICAgICAgICAvL3RoZW4gd2UgZXhpdCBvdXQgb2YgdGhlIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgIHRoYXQuJHJvb21TY2hlZHVsZS5odG1sKCAnTm8gcmVzZXJ2YXRpb25zIGFyZSBhdmFpbGFibGUnICk7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQudW5zZXRMb2FkaW5nKCk7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuJGN1cnJlbnREdXJhdGlvblRleHQudGV4dCgnTGlicmFyeSBDbG9zZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC4kcmVzZXRTZWxlY3Rpb25CdG4uaGlkZSgpOyAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgICAgICAvLyBtZXJnZSBib29raW5ncyB3aXRoIGF2YWlsYWJpbGl0eVxuICAgICAgICAgICAgICAgIGlmICggYm9va2luZ3NEYXRhLmxlbmd0aCApe1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNoZWNrU3RhdHVzZXMgPSBbJ0F2YWlsYWJsZScsICdDb25maXJtZWQnXTtcbiAgICAgICAgICAgICAgICAgICAgYm9va2luZ3NEYXRhLmZvckVhY2goZnVuY3Rpb24oYm9va2luZyxpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoICAkLmluQXJyYXkoIGJvb2tpbmcuc3RhdHVzLCBjaGVja1N0YXR1c2VzICkgPT0gLTEgKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyggYm9va2luZy5zdGF0dXMgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSBudW1iZXIgb2Ygc2xvdHMgYmFzZWQgb24gYm9va2luZyBkdXJhdGlvblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZyb21UaW1lID0gbmV3IERhdGUoYm9va2luZy5mcm9tRGF0ZSkuZ2V0VGltZSgpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvVGltZSA9IG5ldyBEYXRlKGJvb2tpbmcudG9EYXRlKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZHVyYXRpb25NaW51dGVzID0gKHRvVGltZSAtIGZyb21UaW1lKSAvIDEwMDAgLyA2MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzbG90Q291bnQgPSBkdXJhdGlvbk1pbnV0ZXMgLyB0aGF0LnNsb3RNaW51dGVzO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzcGFjZURhdGEuYXZhaWxhYmlsaXR5LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZnJvbVwiOiBib29raW5nLmZyb21EYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidG9cIjogYm9va2luZy50b0RhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzbG90Q291bnRcIjogc2xvdENvdW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaXNCb29rZWRcIjogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAvLyBzb3J0IHRpbWUgc2xvdCBvYmplY3RzIGJ5IHRoZSBcImZyb21cIiBrZXlcbiAgICAgICAgICAgICAgICAgICAgX3NvcnRCeUtleSggc3BhY2VEYXRhLmF2YWlsYWJpbGl0eSwgJ2Zyb20nICk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG5cblxuICAgICAgICAgICAgICAgIC8vIHBhcnNlIHRpbWUgc2xvdHMgYW5kIHJldHVybiBhbiBhcHByb3ByaWF0ZSBzdWJzZXQgKG9ubHkgb3BlbiB0byBjbG9zZSBob3VycylcbiAgICAgICAgICAgICAgICB0aW1lU2xvdHNBcnJheSA9IHRoYXQucGFyc2VTY2hlZHVsZShzcGFjZURhdGEuYXZhaWxhYmlsaXR5KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBidWlsZCBzY2hlZHVsZSBIVE1MXG4gICAgICAgICAgICAgICAgdGhhdC5idWlsZFNjaGVkdWxlKHRpbWVTbG90c0FycmF5KTtcblxuICAgICAgICAgICAgICAgIC8vIEVycm9yIGhhbmRsZXJzXG4gICAgICAgICAgICAgICAgc3BhY2VqcVhIUi5mYWlsKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYm9va2luZ3NqcVhIUi5mYWlsKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhhdC51bnNldExvYWRpbmcoKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRyZXNldFNlbGVjdGlvbkJ0bi5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuYnVpbGRTY2hlZHVsZSA9IGZ1bmN0aW9uKHRpbWVTbG90c0FycmF5KXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBodG1sID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gY29uc3RydWN0IEhUTUwgZm9yIGVhY2ggdGltZSBzbG90XG4gICAgICAgIHRpbWVTbG90c0FycmF5LmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSl7XG5cbiAgICAgICAgICAgIHZhciBmcm9tID0gbmV3IERhdGUoIGl0ZW0uZnJvbSApLFxuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmcsXG4gICAgICAgICAgICAgICAgaXRlbUNsYXNzID0gJyc7XG5cbiAgICAgICAgICAgIGlmICggZnJvbS5nZXRNaW51dGVzKCkgIT09IDAgKSB7XG4gICAgICAgICAgICAgICAgdGltZVN0cmluZyA9IHRoYXQucmVhZGFibGVUaW1lKCBmcm9tLCAnaDptJyApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aW1lU3RyaW5nID0gdGhhdC5yZWFkYWJsZVRpbWUoIGZyb20sICdoYScgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBpdGVtLmlzQm9va2VkICYmIGl0ZW0uaGFzT3duUHJvcGVydHkoJ3Nsb3RDb3VudCcpICkge1xuICAgICAgICAgICAgICAgIGl0ZW1DbGFzcyA9ICdjY2wtaXMtb2NjdXBpZWQgY2NsLWR1cmF0aW9uLScgKyBpdGVtLnNsb3RDb3VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gYnVpbGQgc2VsZWN0YWJsZSB0aW1lIHNsb3RzXG4gICAgICAgICAgICBodG1sLnB1c2goIHRoYXQuYnVpbGRUaW1lU2xvdCh7XG4gICAgICAgICAgICAgICAgaWQ6ICdzbG90LScgKyB0aGF0LnJvb21JZCArICctJyArIGksXG4gICAgICAgICAgICAgICAgZnJvbTogaXRlbS5mcm9tLFxuICAgICAgICAgICAgICAgIHRvOiBpdGVtLnRvLFxuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmc6IHRpbWVTdHJpbmcsXG4gICAgICAgICAgICAgICAgY2xhc3M6IGl0ZW1DbGFzc1xuICAgICAgICAgICAgfSkgKTtcbiAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzID0gW107XG5cbiAgICAgICAgdGhpcy4kcm9vbVNjaGVkdWxlLmh0bWwoIGh0bWwuam9pbignJykgKTtcblxuICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1yb29tX19zbG90IFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcblxuICAgICAgICB0aGlzLnNldEN1cnJlbnREdXJhdGlvblRleHQoKTtcblxuICAgICAgICB0aGlzLmluaXRTbG90RXZlbnRzKCk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmJ1aWxkVGltZVNsb3QgPSBmdW5jdGlvbih2YXJzKXtcbiAgICAgICAgXG4gICAgICAgIGlmICggISB2YXJzIHx8IHR5cGVvZiB2YXJzICE9PSAnb2JqZWN0JyApIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGNsYXNzOiAnJyxcbiAgICAgICAgICAgIGlkOiAnJyxcbiAgICAgICAgICAgIGRpc2FibGVkOiAnJyxcbiAgICAgICAgICAgIGZyb206ICcnLFxuICAgICAgICAgICAgdG86ICcnLFxuICAgICAgICAgICAgdGltZVN0cmluZzogJydcbiAgICAgICAgfTtcbiAgICAgICAgdmFycyA9ICQuZXh0ZW5kKGRlZmF1bHRzLCB2YXJzKTtcblxuICAgICAgICB2YXIgdGVtcGxhdGUgPSAnJyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNjbC1jLXJvb21fX3Nsb3QgJyArIHZhcnMuY2xhc3MgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cIicgKyB2YXJzLmlkICsgJ1wiIG5hbWU9XCInICsgdmFycy5pZCArICdcIiB2YWx1ZT1cIicgKyB2YXJzLmZyb20gKyAnXCIgZGF0YS10bz1cIicgKyB2YXJzLnRvICsgJ1wiICcgKyB2YXJzLmRpc2FibGVkICsgJy8+JyArXG4gICAgICAgICAgICAgICAgJzxsYWJlbCBjbGFzcz1cImNjbC1jLXJvb21fX3Nsb3QtbGFiZWxcIiBmb3I9XCInICsgdmFycy5pZCArICdcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgdmFycy50aW1lU3RyaW5nICtcbiAgICAgICAgICAgICAgICAnPC9sYWJlbD4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nO1xuXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnBhcnNlU2NoZWR1bGUgPSBmdW5jdGlvbihzY2hlZHVsZUFycmF5KXtcbiAgICAgICAgLy8gcmV0dXJucyB0aGUgYXBwcm9wcmlhdGUgc2NoZWR1bGUgZm9yIGEgZ2l2ZW4gYXJyYXkgb2YgdGltZSBzbG90c1xuICAgICAgICBcbiAgICAgICAgdmFyIHRvID0gbnVsbCxcbiAgICAgICAgICAgIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgc3RhcnRFbmRJbmRleGVzID0gW10sIFxuICAgICAgICAgICAgc3RhcnQsIGVuZCxcbiAgICAgICAgICAgIG5vdyA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgIC8vY29uc29sZS5sb2coIHNjaGVkdWxlQXJyYXkgKTtcblxuICAgICAgICAkLmVhY2goIHNjaGVkdWxlQXJyYXksIGZ1bmN0aW9uKCBpLCBpdGVtICl7XG4gICAgICAgICAgICBzdGFydCA9IG5ldyBEYXRlKCBpdGVtLmZyb20gKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBlbmQgPSBuZXcgRGF0ZSggaXRlbS50byApLmdldFRpbWUoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9hZGQgdG8gc2NoZWR1bGUgYXJyYXkgaWZcbiAgICAgICAgICAgIC8vYmVnaW5uaW5nIGlzIGFmdGVyIG9wZW5pbmcgYW5kIGVuZCBpZiBiZWZvcmUgY2xvc2luZyBhbmQgZW5kIGlzIGdyZWF0ZXIgdGhhbiByaWdodCBub3dcbiAgICAgICAgICAgIGlmKCB0aGF0Lm9wZW5UaW1lIDw9IHN0YXJ0ICYmIHRoYXQuY2xvc2luZ1RpbWUgPj0gZW5kICYmIGVuZCA+IG5vdyApe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBzdGFydEVuZEluZGV4ZXMucHVzaCggaXRlbSApOyAgICAgICAgICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9ICk7XG4gICAgICAgIFxuICAgICAgICBjb25zb2xlLmxvZyggJ1NjaGVkdWxlIEFycmF5IHNsb3RzOiAnLCBzdGFydEVuZEluZGV4ZXMubGVuZ3RoICsnLycgKyBzY2hlZHVsZUFycmF5Lmxlbmd0aCApO1xuXG4gICAgICAgIC8vcmVzZXQgdGhpcyB2YXJpYWJsZSBpbmNhc2Ugd2UgdXNlIHRoaXMgc2NyaXB0IGZvciBvdGhlciBkYXlzXG4gICAgICAgIHRoYXQub3BlblRpbWUgPSBudWxsO1xuICAgICAgICB0aGF0LmNsb3NpbmdUaW1lID0gbnVsbDtcbiAgICAgICAgXG4gICAgICAgIHJldHVybiBzdGFydEVuZEluZGV4ZXM7XG5cbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFycmF5IGFuZCBwaWNrIG91dCB0aW1lIGdhcHNcbiAgICAgICAgLy8gc2NoZWR1bGVBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0saSl7XG4gICAgICAgIC8vICAgICBpZiAoIHRvICYmIHRvICE9PSBpdGVtLmZyb20gKSB7XG4gICAgICAgIC8vICAgICAgICAgc3RhcnRFbmRJbmRleGVzLnB1c2goaSk7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vICAgICB0byA9IGl0ZW0udG87XG4gICAgICAgIC8vIH0pO1xuXG4gICAgICAgIC8vIC8vIGRlcGVuZGluZyBvbiBudW1iZXIgb2YgZ2FwcyBmb3VuZCwgZGV0ZXJtaW5lIHN0YXJ0IGFuZCBlbmQgaW5kZXhlc1xuICAgICAgICAvLyBpZiAoIHN0YXJ0RW5kSW5kZXhlcy5sZW5ndGggPj0gMiApIHtcbiAgICAgICAgLy8gICAgIHN0YXJ0ID0gc3RhcnRFbmRJbmRleGVzWzBdO1xuICAgICAgICAvLyAgICAgZW5kID0gc3RhcnRFbmRJbmRleGVzWzFdO1xuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgc3RhcnQgPSAwO1xuICAgICAgICAvLyAgICAgaWYgKCBzdGFydEVuZEluZGV4ZXMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAvLyAgICAgICAgIGVuZCA9IHN0YXJ0RW5kSW5kZXhlc1swXTtcbiAgICAgICAgLy8gICAgIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICAgICAgZW5kID0gc2NoZWR1bGVBcnJheS5sZW5ndGg7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cbiAgICAgICAgXG4gICAgICAgIC8vIHJldHVybmVkIHNsaWNlZCBwb3J0aW9uIG9mIG9yaWdpbmFsIHNjaGVkdWxlXG4gICAgICAgIC8vcmV0dXJuIHNjaGVkdWxlQXJyYXkuc2xpY2Uoc3RhcnQsZW5kKTtcbiAgICB9O1xuICAgIFxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5nZXRPcGVuSG91cnMgPSBmdW5jdGlvbihob3Vyc0RhdGEpe1xuICAgICAgICAvL3JldHVybnMgdGhlIG9wZW5pbmcgYW5kIGNsb3NpbmcgaG91cnMgZm9yIHRoZSBtYWluIGxpYnJhcnlcbiAgICAgICAgdmFyIGhvdXJzT2JqLFxuICAgICAgICAgICAgdGhhdCA9IHRoaXM7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coIGhvdXJzRGF0YSApO1xuICAgICAgICBcbiAgICAgICAgLy9maWx0ZXIgb2JqZWN0IGZvciB0aGUgbWFpbiBsaWJyYXJ5IGFuZCB0aGUgY3VycmVudCBkYXRlIHBhc3NlZCBpblxuICAgICAgICBob3Vyc09iaiA9ICQuZ3JlcCggaG91cnNEYXRhLmxvY2F0aW9ucywgZnVuY3Rpb24obGlicmFyeSl7XG4gICAgICAgICAgICByZXR1cm4gbGlicmFyeS5saWQgPT0gdGhhdC5saWQgO1xuICAgICAgICB9ICk7XG4gICAgICAgIC8vdXNlIHRoaXMgcmVjdXJzaXZlIGZ1bmN0aW9uIHRvIGxvY2F0ZSB0aGUgZGF5J3MgaG91cnMgZm9yIHRoZSBkYXRlIHBhc3NlZFxuICAgICAgICBob3Vyc09iaiA9IF9maW5kT2JqZWN0QnlLZXlWYWwoIGhvdXJzT2JqWzBdLndlZWtzLCAnZGF0ZScsIHRoYXQuZGF0ZVltZCApO1xuICAgICAgICBcbiAgICAgICAgLy9pZGVudGlmeSB0aGUgZGF0ZSBzaXR1YXRpb24gYW5kIGNyZWF0ZSBnbG9iYWwgdmFyaWFibGVzXG4gICAgICAgIGlmKCAnaG91cnMnIGluIGhvdXJzT2JqLnRpbWVzICl7XG4gICAgICAgICAgICAvL3VzZSB0aGUgZnVuY3Rpb24gdG8gY29udmVydCBhIHNlcmllcyBvZiBzdHJpbmdzIGludG8gYW4gYWN0dWFsIERhdGUgT2JqZWN0XG4gICAgICAgICAgICB0aGF0Lm9wZW5UaW1lICAgID0gX2NvbnZlcnRUb0RhdGVPYmooIGhvdXJzT2JqLCAnZnJvbScgKTtcbiAgICAgICAgICAgIHRoYXQuY2xvc2luZ1RpbWUgPSBfY29udmVydFRvRGF0ZU9iaiggaG91cnNPYmosICd0bycpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL2lmIHRoaXMgZGF5IGNsb3NlcyBhdCAxYW0sIHRoZW4gd2UgbmVlZCB0byBraWNrIHRoZSBjbG9zaW5nIHRpbWUgdG8gdGhlIG5leHQgZGF5XG4gICAgICAgICAgICBpZiggKGhvdXJzT2JqLnRpbWVzLmhvdXJzWzBdLnRvKS5pbmRleE9mKCAnYW0nICkgIT0gLTEgKXtcbiAgICAgICAgICAgICAgICAvL3RoYXQuY2xvc2luZ1RpbWUgPSB0aGF0LmNsb3NpbmdUaW1lLnNldERhdGUodGhhdC5jbG9zaW5nVGltZS5nZXREYXRlKCkgKyAxICk7XG4gICAgICAgICAgICAgICAgdGhhdC5jbG9zaW5nVGltZSA9IG5ldyBEYXRlKCB0aGF0LmNsb3NpbmdUaW1lLmdldFRpbWUoKSArICggMSoyNCo2MCo2MCoxMDAwICkgKTtcbiAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKCB0aGF0LmNsb3NpbmdUaW1lLnRvU3RyaW5nKCkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9jYXN0IGludG8gbWlsbGlzZWNvbmRzXG4gICAgICAgICAgICB0aGF0Lm9wZW5UaW1lICAgPSB0aGF0Lm9wZW5UaW1lLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHRoYXQuY2xvc2luZ1RpbWUgPSB0aGF0LmNsb3NpbmdUaW1lLmdldFRpbWUoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggaG91cnNPYmouZGF0ZSwgJzogY3VzdG9tIEhvdXJzIGRpZmZlcmVuY2UgJywgTWF0aC5hYnModGhhdC5jbG9zaW5nVGltZSAtIHRoYXQub3BlblRpbWUpIC8gMzZlNSApO1xuICAgIFxuICAgICAgICB9ZWxzZSBpZiggaG91cnNPYmoudGltZXMuc3RhdHVzID09ICcyNGhvdXJzJyApe1xuICAgICAgICAgICAgLy9pZiB0aGUgc3RhdHVzIGlzIDI0IGhvdXJzLCB3ZSBuZWVkIHRvIHNldCB0aGUgYmVnaW5uaW5nIGVuZCBvZiB0aGlzIGRheVxuICAgICAgICAgICAgdmFyIGRhdGUgPSBuZXcgRGF0ZSggaG91cnNPYmouZGF0ZSApO1xuXG4gICAgICAgICAgICB0aGF0Lm9wZW5UaW1lICAgID0gZGF0ZS5nZXRUaW1lKCk7ICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIC8vY291bGQgYmUgZW5kLnNldEhvdXJzKDIzLDU5LDU5LDk5OSk7XG4gICAgICAgICAgICAvL3RoYXQuY2xvc2luZ1RpbWUgPSB0aGF0Lm9wZW5UaW1lLnNldERhdGUodGhhdC5vcGVuVGltZS5nZXREYXRlKCkgKyAxICk7XG4gICAgICAgICAgICB0aGF0LmNsb3NpbmdUaW1lID0gICBuZXcgRGF0ZSggdGhhdC5vcGVuVGltZSArICggMSoyNCo2MCo2MCoxMDAwICkgKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coIGhvdXJzT2JqLmRhdGUsICAnOiAyNCBob3VycyBkaWZmZXJlbmNlICcsIE1hdGguYWJzKHRoYXQuY2xvc2luZ1RpbWUgLSB0aGF0Lm9wZW5UaW1lKSAvIDM2ZTUgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJzI0IGhvdXIgY2xvc2luZyB0aW1lJywgIG5ldyBEYXRlICh0aGF0Lm9wZW5UaW1lKS50b1N0cmluZygpICwgbmV3IERhdGUgKHRoYXQuY2xvc2luZ1RpbWUgKS50b1N0cmluZygpICk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coICcyNCBob3VyIGNsb3NpbmcgdGltZScsIHRoYXQub3BlblRpbWUsIHRoYXQuY2xvc2luZ1RpbWUgICk7XG4gICAgICAgIH1cbiAgICAgICAgXG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXRGb3JtRXZlbnRzID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4uY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICQodGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMpLmVhY2goZnVuY3Rpb24oaSxpbnB1dCl7XG4gICAgICAgICAgICAgICAgJChpbnB1dClcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLGZhbHNlKVxuICAgICAgICAgICAgICAgICAgICAuY2hhbmdlKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRlbC5zdWJtaXQoZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoYXQub25TdWJtaXQoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kZm9ybVJlbG9hZC5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhhdC5yZWxvYWRGb3JtKCk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0RGF0ZUV2ZW50cyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZGF0ZVNlbGVjdC5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHRoYXQub25EYXRlQ2hhbmdlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vbkRhdGVDaGFuZ2UgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZGF0ZVltZCA9IHRoaXMuJGRhdGVTZWxlY3QudmFsKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnNldExvYWRpbmcoKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNjaGVkdWxlRGF0YSgpO1xuICAgICAgICBcbiAgICB9O1xuICAgICAgICBcbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdFNsb3RFdmVudHMgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICBpZiAoIHRoaXMuJHJvb21TbG90SW5wdXRzICYmIHRoaXMuJHJvb21TbG90SW5wdXRzLmxlbmd0aCApe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBpbnB1dCBjaGFuZ2UgZXZlbnQgaGFuZGxlclxuICAgICAgICAgICAgdGhpcy4kcm9vbVNsb3RJbnB1dHMuY2hhbmdlKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIGlucHV0ID0gdGhpcztcbiAgICAgICAgICAgICAgICB0aGF0Lm9uU2xvdENoYW5nZShpbnB1dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfTtcbiAgICBcbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TbG90Q2hhbmdlID0gZnVuY3Rpb24oY2hhbmdlZElucHV0KXtcbiAgICAgICAgXG4gICAgICAgIC8vIGlmIGlucHV0IGNoZWNrZWQsIGFkZCBpdCB0byBzZWxlY3RlZCBzZXRcbiAgICAgICAgaWYgKCAkKGNoYW5nZWRJbnB1dCkucHJvcCgnY2hlY2tlZCcpICkge1xuXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5wdXNoKGNoYW5nZWRJbnB1dCk7XG4gICAgICAgICAgICAkKGNoYW5nZWRJbnB1dCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpLmFkZENsYXNzKCdjY2wtaXMtY2hlY2tlZCcpO1xuICAgXG4gICAgICAgIH0gXG4gICAgICAgIFxuICAgICAgICAvLyBpZiBpbnB1dCB1bmNoZWNrZWQsIHJlbW92ZSBpdCBmcm9tIHRoZSBzZWxlY3RlZCBzZXRcbiAgICAgICAgZWxzZSB7IFxuXG4gICAgICAgICAgICB2YXIgY2hhbmdlZElucHV0SW5kZXggPSB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKGNoYW5nZWRJbnB1dCk7XG5cbiAgICAgICAgICAgIGlmICggY2hhbmdlZElucHV0SW5kZXggPiAtMSApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5zcGxpY2UoIGNoYW5nZWRJbnB1dEluZGV4LCAxICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKGNoYW5nZWRJbnB1dCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtY2hlY2tlZCcpO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIHVwZGF0ZSB0aGUgc2xvdHMgd2hpY2ggY2FuIG5vdyBiZSBjbGlja2FibGVcbiAgICAgICAgdGhpcy51cGRhdGVTZWxlY3RhYmxlU2xvdHMoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIHVwZGF0ZSBidXR0b24gc3RhdGVzXG4gICAgICAgIGlmICggdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgIHRoaXMuJHJlc2V0U2VsZWN0aW9uQnRuLnNob3coKTtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1TdWJtaXQuYXR0cignZGlzYWJsZWQnLGZhbHNlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1TdWJtaXQuYXR0cignZGlzYWJsZWQnLHRydWUpO1xuICAgICAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4uaGlkZSgpOyBcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSB0ZXh0XG4gICAgICAgIHRoaXMuc2V0Q3VycmVudER1cmF0aW9uVGV4dCgpO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS51cGRhdGVTZWxlY3RhYmxlU2xvdHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgLy8gSUYgdGhlcmUgYXJlIHNlbGVjdGVkIHNsb3RzXG4gICAgICAgIGlmICggdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoICl7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gZmlyc3QsIHNvcnQgdGhlIHNlbGVjdGVkIHNsb3RzXG4gICAgICAgICAgICB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5zb3J0KGZ1bmN0aW9uKGEsYil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEuZ2V0QXR0cmlidXRlKCd2YWx1ZScpID4gYi5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgLy8gZ3JhYiB0aGUgZmlyc3QgYW5kIGxhc3Qgc2VsZWN0ZWQgc2xvdHNcbiAgICAgICAgICAgIHZhciBtaW5JbnB1dCA9IHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzWzBdLFxuICAgICAgICAgICAgICAgIG1heElucHV0ID0gdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHNbdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGdldCB0aGUgaW5kZXhlcyBvZiB0aGUgZmlyc3QgYW5kIGxhc3Qgc2xvdHMgZnJvbSB0aGUgJHJvb21TbG90SW5wdXRzIGpRdWVyeSBvYmplY3RcbiAgICAgICAgICAgIHZhciBtaW5JbmRleCA9IHRoYXQuJHJvb21TbG90SW5wdXRzLmluZGV4KG1pbklucHV0KSxcbiAgICAgICAgICAgICAgICBtYXhJbmRleCA9IHRoYXQuJHJvb21TbG90SW5wdXRzLmluZGV4KG1heElucHV0KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gY2FsY3VsYXRlIHRoZSBtaW4gYW5kIG1heCBzbG90IGluZGV4ZXMgd2hpY2ggYXJlIHNlbGVjdGFibGVcbiAgICAgICAgICAgIHZhciBtaW5BbGxvd2FibGUgPSBtYXhJbmRleCAtIHRoYXQubWF4U2xvdHMsXG4gICAgICAgICAgICAgICAgbWF4QWxsb3dhYmxlID0gbWluSW5kZXggKyB0aGF0Lm1heFNsb3RzO1xuICAgIFxuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIHJvb20gc2xvdHMgYW5kIHVwZGF0ZSB0aGVtIGFjY29yZGluZ2x5XG4gICAgICAgICAgICB0aGF0LiRyb29tU2xvdElucHV0cy5lYWNoKGZ1bmN0aW9uKGksIGlucHV0KXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBlbmFibGVzIG9yIGRpc2FibGVzIGRlcGVuZGluZyBvbiB3aGV0aGVyIHNsb3QgZmFsbHMgd2l0aGluIHJhbmdlXG4gICAgICAgICAgICAgICAgaWYgKCBtaW5BbGxvd2FibGUgPCBpICYmIGkgPCBtYXhBbGxvd2FibGUgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuZW5hYmxlU2xvdChpbnB1dCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5kaXNhYmxlU2xvdChpbnB1dCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGFkZCBhIGNsYXNzIHRvIHRoZSBzbG90cyB0aGF0IGZhbGwgYmV0d2VlbiB0aGUgbWluIGFuZCBtYXggc2VsZWN0ZWQgc2xvdHNcbiAgICAgICAgICAgICAgICBpZiAoIG1pbkluZGV4IDwgaSAmJiBpIDwgbWF4SW5kZXggKSB7XG4gICAgICAgICAgICAgICAgICAgICQoaW5wdXQpLnBhcmVudCgpLmFkZENsYXNzKCdjY2wtaXMtYmV0d2VlbicpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoaW5wdXQpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYmV0d2VlbicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgfSBcbiAgICAgICAgLy8gRUxTRSBubyBzZWxlY3RlZCBzbG90c1xuICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgLy8gZW5hYmxlIGFsbCBzbG90c1xuICAgICAgICAgICAgdGhhdC4kcm9vbVNsb3RJbnB1dHMuZWFjaChmdW5jdGlvbihpLCBpbnB1dCl7XG4gICAgICAgICAgICAgICAgdGhhdC5lbmFibGVTbG90KGlucHV0KTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5jbGVhclNsb3QgPSBmdW5jdGlvbihzbG90KSB7XG4gICAgICAgIC8vIHNsb3QgY2FuIGJlIGVpdGhlciB0aGUgY2hlY2tib3ggaW5wdXQgLU9SLSB0aGUgY2hlY2tib3gncyBjb250YWluZXJcblxuICAgICAgICB2YXIgaW5wdXRJbmRleDtcblxuICAgICAgICAvLyBpZiBpdCdzIHRoZSBjaGVja2JveC5cbiAgICAgICAgaWYgKCAkKHNsb3QpLmlzKCdbdHlwZT1cImNoZWNrYm94XCJdJykgKSB7XG4gICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuZW5hYmxlU2xvdChzbG90KTtcblxuICAgICAgICAgICAgLy8gZ2V0IGluZGV4IG9mIHRoZSBpbnB1dCBmcm9tIHNlbGVjdGVkIHNldFxuICAgICAgICAgICAgaW5wdXRJbmRleCA9IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2Yoc2xvdCk7XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gaWYgaXQncyB0aGUgY29udGFpbmVyXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkKHNsb3QpLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKTtcblxuICAgICAgICAgICAgdGhpcy5lbmFibGVTbG90KCRpbnB1dFswXSk7XG5cbiAgICAgICAgICAgIC8vIGdldCBpbmRleCBvZiB0aGUgaW5wdXQgZnJvbSBzZWxlY3RlZCBzZXRcbiAgICAgICAgICAgIGlucHV0SW5kZXggPSB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKCAkaW5wdXRbMF0gKTtcblxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGlucHV0IGZyb20gc2VsZWN0ZWQgc2V0XG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnNwbGljZSggaW5wdXRJbmRleCwgMSApO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5jbGVhckFsbFNsb3RzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHJlc2V0U2VsZWN0aW9uQnRuLmhpZGUoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIEV4dGVuZCB0aGUgc2VsZWN0ZWQgaW5wdXRzIGFycmF5IHRvIGEgbmV3IHZhcmlhYmxlLlxuICAgICAgICAvLyBUaGUgc2VsZWN0ZWQgaW5wdXRzIGFycmF5IGNoYW5nZXMgd2l0aCBldmVyeSBjbGVhclNsb3QoKSBjYWxsXG4gICAgICAgIC8vIHNvLCBiZXN0IHRvIGxvb3AgdGhyb3VnaCBhbiB1bmNoYW5naW5nIGFycmF5LlxuICAgICAgICB2YXIgc2VsZWN0ZWRJbnB1dHMgPSAkLmV4dGVuZCggW10sIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzICk7XG5cbiAgICAgICAgJChzZWxlY3RlZElucHV0cykuZWFjaChmdW5jdGlvbihpLGlucHV0KXtcbiAgICAgICAgICAgIHRoYXQuY2xlYXJTbG90KGlucHV0KTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmFjdGl2YXRlU2xvdCA9IGZ1bmN0aW9uKHNsb3QpIHtcbiAgICAgICAgLy8gc2xvdCBjYW4gYmUgZWl0aGVyIHRoZSBjaGVja2JveCAtT1ItIHRoZSBjaGVja2JveCdzIGNvbnRhaW5lclxuXG4gICAgICAgIHZhciBzbG90SXNDaGVja2JveCA9ICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSxcbiAgICAgICAgICAgICRjb250YWluZXIgPSBzbG90SXNDaGVja2JveCA/ICQoc2xvdCkucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpIDogJChzbG90KTtcblxuICAgICAgICAvLyBuZXZlciBzZXQgYW4gb2NjdXBpZWQgc2xvdCBhcyBhY3RpdmVcbiAgICAgICAgaWYgKCAkY29udGFpbmVyLmhhc0NsYXNzKCdjY2wtaXMtb2NjdXBpZWQnKSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICggJChzbG90KS5pcygnW3R5cGU9XCJjaGVja2JveFwiXScpICkge1xuXG4gICAgICAgICAgICAvLyBpZiBpdCdzIHRoZSBjaGVja2JveC5cbiAgICAgICAgIFxuICAgICAgICAgICAgJChzbG90KS5wcm9wKCdjaGVja2VkJyx0cnVlKTtcbiAgICAgICAgICAgICRjb250YWluZXIuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgLy8gaWYgaXQncyB0aGUgY29udGFpbmVyXG5cbiAgICAgICAgICAgICRjb250YWluZXJcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJylcbiAgICAgICAgICAgICAgICAuZmluZCgnW3R5cGU9XCJjaGVja2JveFwiXScpXG4gICAgICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJyx0cnVlKTtcblxuICAgICAgICB9XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5lbmFibGVTbG90ID0gZnVuY3Rpb24oc2xvdCkge1xuICAgICAgICAkKHNsb3QpXG4gICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCBmYWxzZSlcbiAgICAgICAgICAgIC5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JylcbiAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuZGlzYWJsZVNsb3QgPSBmdW5jdGlvbihzbG90KSB7XG4gICAgICAgICQoc2xvdClcbiAgICAgICAgICAgIC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpXG4gICAgICAgICAgICAucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdjY2wtaXMtZGlzYWJsZWQnKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnNldExvYWRpbmcgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoJ0xvYWRpbmcgc2NoZWR1bGUuLi4nKTtcbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS51bnNldExvYWRpbmcgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnNldEN1cnJlbnREdXJhdGlvblRleHQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgc2VsZWN0aW9uID0gJC5leHRlbmQoW10sdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMpLFxuICAgICAgICAgICAgc29ydGVkU2VsZWN0aW9uID0gc2VsZWN0aW9uLnNvcnQoZnVuY3Rpb24oYSxiKXsgXG4gICAgICAgICAgICAgICAgcmV0dXJuIGEudmFsdWUgPiBiLnZhbHVlOyBcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgc2VsZWN0aW9uTGVuZ3RoID0gc29ydGVkU2VsZWN0aW9uLmxlbmd0aDtcbiAgICAgICAgXG4gICAgICAgIGlmICggc2VsZWN0aW9uTGVuZ3RoID4gMCApIHtcblxuICAgICAgICAgICAgdmFyIHRpbWUxVmFsID0gc29ydGVkU2VsZWN0aW9uWzBdLnZhbHVlLFxuICAgICAgICAgICAgICAgIHJlYWRhYmxlVGltZTEgPSB0aGlzLnJlYWRhYmxlVGltZSggbmV3IERhdGUodGltZTFWYWwpICk7XG5cbiAgICAgICAgICAgIHZhciB0aW1lMlZhbCA9ICggc2VsZWN0aW9uTGVuZ3RoID49IDIgKSA/IHNvcnRlZFNlbGVjdGlvbltzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoIC0gMV0udmFsdWUgOiB0aW1lMVZhbCxcbiAgICAgICAgICAgICAgICB0aW1lMlQgPSBuZXcgRGF0ZSh0aW1lMlZhbCkuZ2V0VGltZSgpICsgKCB0aGlzLnNsb3RNaW51dGVzICogNjAgKiAxMDAwICksXG4gICAgICAgICAgICAgICAgcmVhZGFibGVUaW1lMiA9IHRoaXMucmVhZGFibGVUaW1lKCBuZXcgRGF0ZSh0aW1lMlQpICk7XG5cbiAgICAgICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQudGV4dCggJ0Zyb20gJyArIHJlYWRhYmxlVGltZTEgKyAnIHRvICcgKyByZWFkYWJsZVRpbWUyICk7XG5cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQudGV4dCgnUGxlYXNlIHNlbGVjdCBhdmFpbGFibGUgdGltZSBzbG90cycpO1xuXG4gICAgICAgIH1cblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuc2V0TWF4VGltZVRleHQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbWF4TWludXRlcyA9IHRoaXMubWF4U2xvdHMgKiB0aGlzLnNsb3RNaW51dGVzLFxuICAgICAgICAgICAgbWF4VGV4dDtcblxuICAgICAgICBpZiAoIG1heE1pbnV0ZXMgPiA2MCApIHtcbiAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzIC8gNjAgKyAnIGhvdXJzJzsgICAgXG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgKyAnIG1pbnV0ZXMnO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kbWF4VGltZS50ZXh0KCBtYXhUZXh0ICk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5yZWFkYWJsZVRpbWUgPSBmdW5jdGlvbiggZGF0ZU9iaiwgZm9ybWF0ICkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGxvY2FsZVN0cmluZyA9IGRhdGVPYmoudG9Mb2NhbGVTdHJpbmcoIHRoaXMubG9jYWxlLCB0aGlzLnRpbWVab25lICksIC8vIGUuZy4gLS0+IFwiMTEvNy8yMDE3LCA0OjM4OjMzIEFNXCJcbiAgICAgICAgICAgIGxvY2FsZVRpbWUgPSBsb2NhbGVTdHJpbmcuc3BsaXQoXCIsIFwiKVsxXTsgLy8gXCI0OjM4OjMzIEFNXCJcblxuICAgICAgICB2YXIgdGltZSA9IGxvY2FsZVRpbWUuc3BsaXQoJyAnKVswXSwgLy8gXCI0OjM4OjMzXCIsXG4gICAgICAgICAgICB0aW1lT2JqID0ge1xuICAgICAgICAgICAgICAgIGE6IGxvY2FsZVRpbWUuc3BsaXQoJyAnKVsxXS50b0xvd2VyQ2FzZSgpLCAvLyAoYW0gb3IgcG0pIC0tPiBcImFcIlxuICAgICAgICAgICAgICAgIGg6IHRpbWUuc3BsaXQoJzonKVswXSwgLy8gXCI0XCJcbiAgICAgICAgICAgICAgICBtOiB0aW1lLnNwbGl0KCc6JylbMV0sIC8vIFwiMzhcIlxuICAgICAgICAgICAgfTtcblxuICAgICAgICBpZiAoIGZvcm1hdCAmJiB0eXBlb2YgZm9ybWF0ID09PSAnc3RyaW5nJyApIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIGZvcm1hdEFyciA9IGZvcm1hdC5zcGxpdCgnJyksXG4gICAgICAgICAgICAgICAgcmVhZGFibGVBcnIgPSBbXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yICggdmFyIGkgPSAwOyBpIDwgZm9ybWF0QXJyLmxlbmd0aDsgaSsrICkge1xuICAgICAgICAgICAgICAgIGlmICggdGltZU9ialtmb3JtYXRBcnJbaV1dICkge1xuICAgICAgICAgICAgICAgICAgICByZWFkYWJsZUFyci5wdXNoKHRpbWVPYmpbZm9ybWF0QXJyW2ldXSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVBcnIucHVzaChmb3JtYXRBcnJbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlYWRhYmxlQXJyLmpvaW4oJycpO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGltZU9iai5oICsgJzonICsgdGltZU9iai5tICsgdGltZU9iai5hO1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uU3VibWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuXG4gICAgICAgIGlmICggISB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuJGZvcm1Ob3RpZmljYXRpb25cbiAgICAgICAgICAgICAgICAuY3NzKCdkaXNwbGF5Jywnbm9uZScpXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdjY2wtaXMtZXJyb3InKVxuICAgICAgICAgICAgICAgIC50ZXh0KCdQbGVhc2Ugc2VsZWN0IGEgdGltZSBmb3IgeW91ciByZXNlcnZhdGlvbicpXG4gICAgICAgICAgICAgICAgLmFwcGVuZFRvKHRoaXMuJGZvcm1Db250ZW50KVxuICAgICAgICAgICAgICAgIC5zbGlkZURvd24oQ0NMLkRVUkFUSU9OKTsgICAgICAgICAgICBcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuJGZvcm1Ob3RpZmljYXRpb24ucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBzb3J0ZWRTZWxlY3Rpb24gPSAkLmV4dGVuZChbXSwgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMpLnNvcnQoZnVuY3Rpb24oYSxiKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS52YWx1ZSA+IGIudmFsdWU7XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHN0YXJ0ID0gc29ydGVkU2VsZWN0aW9uWzBdLnZhbHVlLFxuICAgICAgICAgICAgZW5kID0gKCBzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoID4gMSApID8gJCggc29ydGVkU2VsZWN0aW9uWyBzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoIC0gMSBdICkuZGF0YSgndG8nKSA6ICQoIHNvcnRlZFNlbGVjdGlvblswXSApLmRhdGEoJ3RvJyksXG4gICAgICAgICAgICBwYXlsb2FkID0ge1xuICAgICAgICAgICAgICAgIFwiaWlkXCI6MzMzLFxuICAgICAgICAgICAgICAgIFwic3RhcnRcIjogc3RhcnQsXG4gICAgICAgICAgICAgICAgXCJmbmFtZVwiOiB0aGlzLiRlbFswXS5mbmFtZS52YWx1ZSxcbiAgICAgICAgICAgICAgICBcImxuYW1lXCI6IHRoaXMuJGVsWzBdLmxuYW1lLnZhbHVlLFxuICAgICAgICAgICAgICAgIFwiZW1haWxcIjogdGhpcy4kZWxbMF0uZW1haWwudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJuaWNrbmFtZVwiOiB0aGlzLiRlbFswXS5uaWNrbmFtZS52YWx1ZSxcbiAgICAgICAgICAgICAgICBcImJvb2tpbmdzXCI6W1xuICAgICAgICAgICAgICAgICAgICB7IFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJpZFwiOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwidG9cIjogZW5kXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjY2wtaXMtc3VibWl0dGluZycpO1xuICAgICAgICB0aGlzLiRmb3JtQ2FuY2VsLnByb3AoJ2Rpc2FibGVkJyx0cnVlKTtcbiAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdC50ZXh0KCdTZW5kaW5nLi4uJykucHJvcCgnZGlzYWJsZWQnLHRydWUpO1xuXG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgYWN0aW9uOiAncmVxdWVzdF9ib29raW5nJyxcbiAgICAgICAgICAgIGNjbF9ub25jZTogQ0NMLm5vbmNlLFxuICAgICAgICAgICAgcGF5bG9hZDogcGF5bG9hZFxuICAgICAgICB9O1xuXG4gICAgICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBNYWtlIGEgcmVxdWVzdCBoZXJlIHRvIHJlc2VydmUgc3BhY2VcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG4gICAgICAgICQucG9zdCh7XG4gICAgICAgICAgICAgICAgdXJsOiBDQ0wuYWpheF91cmwsXG4gICAgICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKHJlc3BvbnNlKXtcbiAgICAgICAgICAgICAgICBfaGFuZGxlU3VibWl0UmVzcG9uc2UocmVzcG9uc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGVycm9yKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmFsd2F5cyhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHRoYXQuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtc3VibWl0dGluZycpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgZnVuY3Rpb24gX2hhbmRsZVN1Ym1pdFJlc3BvbnNlKHJlc3BvbnNlKSB7XG5cbiAgICAgICAgICAgIHZhciByZXNwb25zZUhUTUwsXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VPYmplY3QgPSBKU09OLnBhcnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL2ZvciB0ZXN0aW5nIHB1cnBvc2VzXG4gICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggcmVzcG9uc2VPYmplY3QgKTtcblxuICAgICAgICAgICAgaWYgKCByZXNwb25zZU9iamVjdC5ib29raW5nX2lkICkge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTCA9ICBbJzxwIGNsYXNzPVwiY2NsLWgyIGNjbC11LW10LTBcIj5TdWNjZXNzITwvcD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHAgY2xhc3M9XCJjY2wtaDRcIj5Zb3VyIGJvb2tpbmcgSUQgaXMgPHNwYW4gY2xhc3M9XCJjY2wtdS1jb2xvci1zY2hvb2xcIj4nICsgcmVzcG9uc2VPYmplY3QuYm9va2luZ19pZCArICc8L3NwYW4+PC9wPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cCBjbGFzcz1cImNjbC1oNFwiPlBsZWFzZSBjaGVjayB5b3VyIGVtYWlsIHRvIGNvbmZpcm0geW91ciBib29raW5nLjwvcD4nXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MID0gIFsnPHAgY2xhc3M9XCJjY2wtaDMgY2NsLXUtbXQtMFwiPlNvcnJ5LCBidXQgd2UgY291bGRuXFwndCBwcm9jZXNzIHlvdXIgcmVzZXJ2YXRpb24uPC9wPicsJzxwIGNsYXNzPVwiY2NsLWg0XCI+RXJyb3JzOjwvcD4nXTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkKHJlc3BvbnNlT2JqZWN0KS5lYWNoKGZ1bmN0aW9uKGksIGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgLy9yZXdyaXRlIHRoZSBlcnJvciBtZXNzYWdlIG9mIHRoZSBlcnJvciBwZXJ0YWlucyB0byBlbWFpbCBkb21haW5cbiAgICAgICAgICAgICAgICAgICAgaWYoIGVycm9yLmVycm9ycy5tYXRjaCggL1xcc2VtYWlsIGRvbWFpbi8gKSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MLnB1c2goICQoJzxwIC8+JykuYWRkQ2xhc3MoJ2NjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvcicpLmh0bWwoJ1BsZWFzZSB1c2UgYSB2YWxpZCBDbGFyZW1vbnQgQ29sbGVnZXMgZW1haWwgYWRkcmVzcy4nKSApO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTC5wdXNoKCAkKCc8cCAvPicpLmFkZENsYXNzKCdjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3InKS5odG1sKGVycm9yLmVycm9ycykgKTsgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9ICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTC5wdXNoKCc8cCBjbGFzcz1cImNjbC1oNFwiPlBsZWFzZSBjb250YWN0IHRoZSBtYWluIHNlcnZpY2VzIGRlc2sgZm9yIGhlbHA6IDkwOS02MjEtODE1MDwvcD4nKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhhdC4kZm9ybUNhbmNlbC5wcm9wKCdkaXNhYmxlZCcsZmFsc2UpLnRleHQoJ0Nsb3NlJyk7XG4gICAgICAgICAgICB0aGF0LiRmb3JtU3VibWl0LmhpZGUoKTtcbiAgICAgICAgICAgIHRoYXQuJGZvcm1SZWxvYWQuc2hvdygpO1xuXG4gICAgICAgICAgICB0aGF0LiRmb3JtQ29udGVudC5hbmltYXRlKHtvcGFjaXR5OiAwfSwgQ0NMLkRVUkFUSU9OKTtcbiAgICAgICAgICAgIHRoYXQuJGZvcm1SZXNwb25zZVxuICAgICAgICAgICAgICAgIC5kZWxheShDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAgICAgLmFuaW1hdGUoe29wYWNpdHk6IDF9LCBDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAgICAgLmh0bWwocmVzcG9uc2VIVE1MKTtcbiAgICAgICAgICAgIHRoYXQuJGZvcm1Db250ZW50XG4gICAgICAgICAgICAgICAgLmRlbGF5KENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZSh7aGVpZ2h0OiB0aGF0LiRmb3JtUmVzcG9uc2UuaGVpZ2h0KCkgKyAncHgnIH0sIENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuY3NzKHt6SW5kZXg6ICctMSd9KTtcblxuICAgICAgICAgICAgdGhhdC4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zdWJtaXR0aW5nJyk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5yZWxvYWRGb3JtID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGZvcm1DYW5jZWwudGV4dCgnQ2FuY2VsJyk7XG4gICAgICAgIHRoaXMuJGZvcm1TdWJtaXQudGV4dCgnU3VibWl0JykucHJvcCgnZGlzYWJsZWQnLGZhbHNlKS5zaG93KCk7XG4gICAgICAgIHRoaXMuJGZvcm1SZWxvYWQuaGlkZSgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jbGVhckFsbFNsb3RzKCk7XG5cbiAgICAgICAgdGhpcy4kZm9ybVJlc3BvbnNlXG4gICAgICAgICAgICAuYW5pbWF0ZSh7b3BhY2l0eTogMH0sIENDTC5EVVJBVElPTilcbiAgICAgICAgICAgIC5kZWxheShDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAuaHRtbCgnJyk7XG4gICAgICAgIHRoaXMuJGZvcm1Db250ZW50XG4gICAgICAgICAgICAuZGVsYXkoQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgLmNzcyh7IGhlaWdodDogJycsIHpJbmRleDogJycgfSlcbiAgICAgICAgICAgIC5hbmltYXRlKHtvcGFjaXR5OiAxfSwgQ0NMLkRVUkFUSU9OKTtcblxuICAgICAgICB0aGlzLnNldExvYWRpbmcoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMudXBkYXRlU2NoZWR1bGVEYXRhKCk7XG4gICAgfTtcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cbiAgICAvLyBIZWxwZXJzXG5cbiAgICBmdW5jdGlvbiBfc29ydEJ5S2V5KCBhcnIsIGtleSwgb3JkZXIgKSB7XG4gICAgICAgIGZ1bmN0aW9uIHNvcnRBU0MoYSxiKSB7XG4gICAgICAgICAgICBpZiAoYVtrZXldIDwgYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYVtrZXldID4gYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIHNvcnRERVNDKGEsYikge1xuICAgICAgICAgICAgaWYgKGFba2V5XSA+IGJba2V5XSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGFba2V5XSA8IGJba2V5XSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoICdERVNDJyA9PT0gb3JkZXIgKSB7XG4gICAgICAgICAgICBhcnIuc29ydChzb3J0REVTQyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcnIuc29ydChzb3J0QVNDKTtcbiAgICAgICAgfVxuICAgIH1cblxuZnVuY3Rpb24gX2ZpbmRPYmplY3RCeUtleVZhbCAob2JqLCBrZXksIHZhbCkge1xuICAgIGlmICghb2JqIHx8ICh0eXBlb2Ygb2JqID09PSAnc3RyaW5nJykpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGlmIChvYmpba2V5XSA9PT0gdmFsKSB7XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIFxuICAgIGZvciAodmFyIGkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoaSkpIHtcbiAgICAgICAgICB2YXIgZm91bmQgPSBfZmluZE9iamVjdEJ5S2V5VmFsKG9ialtpXSwga2V5LCB2YWwpO1xuICAgICAgICAgIGlmIChmb3VuZCkge1xuICAgICAgICAgICAgcmV0dXJuIGZvdW5kO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbn1cblxuZnVuY3Rpb24gX2NvbnZlcnRUb0RhdGVPYmooIGhvdXJzT2JqLCBzdGFydEVuZCApe1xuICAgIC8vbmVlZCB0byBjcmVhdGUgYSBkYXRlIG9iamVjdCBpbiBKYXZhc2NyaXB0LCBidXQgdGhlIGRhdGUgZm9ybWF0cyBmcm9tIExpYkNhbCBhcmUgZ3Jvc3NcbiAgICAvL2dldHMgdGhlIGhvdXJzIGFuZCBtaW51dGVzIGFuZCBzcGxpdHMgaW50byBhcnJheVxuICAgIHZhciBob3Vyc01pbnV0ZXMgPSAkLm1hcChob3Vyc09iai50aW1lcy5ob3Vyc1swXVtzdGFydEVuZF0uc3BsaXQoJzonKSwgZnVuY3Rpb24oIHZhbCwgaSApe1xuICAgICAgICByZXR1cm4gcGFyc2VJbnQodmFsKTtcbiAgICB9KTtcbiAgICAvL2NoZWNrcyB3aGV0aGVyIGl0IGlzIEFtIG9yIFBtXG4gICAgaWYoIGhvdXJzT2JqLnRpbWVzLmhvdXJzWzBdW3N0YXJ0RW5kXS5pbmRleE9mKCAncG0nICkgIT0gLTEgKXtcbiAgICAgICAgaG91cnNNaW51dGVzWzBdICs9IDEyO1xuICAgIH1cbiAgICAvL2dldCB0aGUgZGF5IG9iamVjdHMgYW5kIHNwbGl0cyBpbnRvICBhcnJheVxuICAgIHZhciBjYWxkYXRlID0gJC5tYXAoIGhvdXJzT2JqLmRhdGUuc3BsaXQoXCItXCIpLCBmdW5jdGlvbiggdmFsLCBpICl7XG4gICAgICAgIHJldHVybiB2YWwgLSAoaSA9PT0gMSk7XG4gICAgfSAgKTtcbiAgICBcbiAgICAvL2lkZWFsbHkgd2UgY291bGQgdXNlIGFwcGx5IC0gYnV0IGl0J3MgdGhyb3dpbmcgc29tZSBlcnJvciBcbiAgICAvL3ZhciBkYXRlID0gbmV3ICggRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuYXBwbHkoIERhdGUgLCBbbnVsbF0uY29uY2F0KCBjYWxkYXRlICkgKSApO1xuICAgIHJldHVybiBuZXcgRGF0ZSggIGNhbGRhdGVbMF0sIGNhbGRhdGVbMV0sIGNhbGRhdGVbMl0sIGhvdXJzTWludXRlc1swXSwgaG91cnNNaW51dGVzWzFdICk7IFxufVxuICAgICAgICBcblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gLy9cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1yb29tLXJlcy1mb3JtJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFJvb21SZXNGb3JtKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU2VhcmNoYm94IEJlaGF2aW9yXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdCBcblx0Ly8gR2xvYmFsIHZhcmlhYmxlc1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG5cdFx0RU5URVIgPSAxMywgVEFCID0gOSwgU0hJRlQgPSAxNiwgQ1RSTCA9IDE3LCBBTFQgPSAxOCwgQ0FQUyA9IDIwLCBFU0MgPSAyNywgTENNRCA9IDkxLCBSQ01EID0gOTIsIExBUlIgPSAzNywgVUFSUiA9IDM4LCBSQVJSID0gMzksIERBUlIgPSA0MCxcblx0XHRmb3JiaWRkZW5LZXlzID0gW0VOVEVSLCBUQUIsIENUUkwsIEFMVCwgQ0FQUywgRVNDLCBMQ01ELCBSQ01ELCBMQVJSLCBVQVJSLCBSQVJSLCBEQVJSXSxcblx0XHRpbmRleE5hbWVzID0ge1xuXHRcdFx0dGk6ICdUaXRsZScsXG5cdFx0XHRrdzogJ0tleXdvcmQnLFxuXHRcdFx0YXU6ICdBdXRob3InLFxuXHRcdFx0c3U6ICdTdWJqZWN0J1xuXHRcdH07XG5cblx0Ly8gRXh0ZW5kIGpRdWVyeSBzZWxlY3RvclxuXHQkLmV4dGVuZCgkLmV4cHJbJzonXSwge1xuXHRcdGZvY3VzYWJsZTogZnVuY3Rpb24oZWwsIGluZGV4LCBzZWxlY3Rvcil7XG5cdFx0XHRyZXR1cm4gJChlbCkuaXMoJ2EsIGJ1dHRvbiwgOmlucHV0LCBbdGFiaW5kZXhdLCBzZWxlY3QnKTtcblx0XHR9XG5cdH0pO1xuXHRcdFxuICAgIHZhciBTZWFyY2hBdXRvY29tcGxldGUgPSBmdW5jdGlvbihlbGVtKXtcblx0XHRcblx0XHR0aGlzLiRlbFx0XHRcdD0gJChlbGVtKTtcblx0XHR0aGlzLiRmb3JtXHRcdFx0PSB0aGlzLiRlbC5maW5kKCdmb3JtJyk7XG5cdFx0dGhpcy4kaW5wdXQgXHRcdD0gJChlbGVtKS5maW5kKCcuY2NsLXNlYXJjaCcpO1xuXHRcdHRoaXMuJHJlc3BvbnNlXHRcdD0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNlYXJjaC1yZXN1bHRzJyk7XG5cdFx0dGhpcy4kcmVzcG9uc2VMaXN0XHQ9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1zZWFyY2gtcmVzdWx0c19fbGlzdCcpO1xuXHRcdHRoaXMuJHJlc3BvbnNlSXRlbXMgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtc2VhcmNoLWl0ZW0nKTtcblx0XHR0aGlzLiRyZXN1bHRzTGlua1x0PSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtc2VhcmNoLXJlc3VsdHNfX2Zvb3RlcicpO1xuXHRcdHRoaXMuJHNlYXJjaEluZGV4XHQ9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1zZWFyY2gtaW5kZXgnKTtcblx0XHR0aGlzLiRpbmRleENvbnRhaW5cdD0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNlYXJjaC1pbmRleC1jb250YWluZXInICk7XG5cdFx0dGhpcy4kc2VhcmNoU2NvcGVcdD0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNlYXJjaC1sb2NhdGlvbicpO1xuXHRcdHRoaXMuJHdvcmxkQ2F0TGlua1x0PSBudWxsO1xuXHRcdFxuXHRcdC8vY2hlY2sgdG8gc2VlIGlmIHRoaXMgc2VhcmNoYm94IGhhcyBsaXZlc2VhcmNoIGVuYWJsZWRcblx0XHR0aGlzLiRhY3RpdmF0ZUxpdmVTZWFyY2hcdD0gJCh0aGlzLiRlbCkuZGF0YSgnbGl2ZXNlYXJjaCcpO1xuXHRcdHRoaXMubG9jYXRpb25UeXBlXHQ9ICAkKCB0aGlzLiRzZWFyY2hTY29wZSApLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmRhdGEoJ2xvYycpO1x0XG5cdFx0XG5cdFx0Ly9saWdodGJveCBlbGVtZW50c1xuXHRcdHRoaXMuJGxpZ2h0Ym94ID0gbnVsbDtcblx0XHR0aGlzLmxpZ2h0Ym94SXNPbiA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgU2VhcmNoQXV0b2NvbXBsZXRlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24gKCkge1xuICAgIFx0XG4gICAgXHRcbiAgICBcdGlmKCB0aGlzLiRhY3RpdmF0ZUxpdmVTZWFyY2ggKXtcblx0XHRcdC8vaWYgbGl2ZXNlYXJjaCBpcyBlbmFibGVkLCB0aGVuIHJ1biB0aGUgQUpBWCByZXN1bHRzXG5cdFx0XHR0aGlzLmluaXRMaXZlU2VhcmNoKCk7XG5cdFx0XG4gICAgXHR9ZWxzZXtcblx0XHRcdC8vdGhlbiBzaW1wbGUgZ2VuZXJhdGUgZ2VuZXJpYyBzZWFyY2ggYm94IHJlcXVlc3RzXG5cdFx0XHR0aGlzLmluaXRTdGF0aWNTZWFyY2goKTtcbiAgICBcdH1cbiAgICBcdFxuXHR9O1xuXHRcblx0U2VhcmNoQXV0b2NvbXBsZXRlLnByb3RvdHlwZS50b2dnbGVJbmRleCA9IGZ1bmN0aW9uKCl7XG5cdFx0XG5cdFx0Ly93YXRjaCBmb3IgY2hhbmdlcyB0byB0aGUgbG9jYXRpb24gLSBpZiBub3QgYSBXTVMgc2l0ZSwgdGhlIHJlbW92ZSBpbmRleCBhdHRyaWJ1dGVcblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XG5cdFx0dGhpcy4kc2VhcmNoU2NvcGUub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuXHRcdFx0XG5cdFx0XHR0aGF0LmdldExvY0lEKCk7XHRcdFx0XHRcblx0XHRcdFxuXHRcdFx0aWYoIHRoYXQubG9jYXRpb25UeXBlICE9ICd3bXMnICl7XG5cdFx0XHRcdHRoYXQuJGluZGV4Q29udGFpblxuXHRcdFx0XHRcdC5hZGRDbGFzcygnY2NsLXNlYXJjaC1pbmRleC1mYWRlJylcblx0XHRcdFx0XHQuZmFkZU91dCgyNTApO1xuXHRcdFx0fWVsc2UgaWYoIHRoYXQubG9jYXRpb25UeXBlID09ICd3bXMnICl7XG5cdFx0XHRcdHRoYXQuJGluZGV4Q29udGFpblxuXHRcdFx0XHRcdC5mYWRlSW4oMjUwKVxuXHRcdFx0XHRcdC5yZW1vdmVDbGFzcygnY2NsLXNlYXJjaC1pbmRleC1mYWRlJyk7XG5cblx0XHRcdH1cblx0XHRcdFxuXHRcdH0gKTtcblx0XHRcdFxuXHR9O1xuXHRcblx0U2VhcmNoQXV0b2NvbXBsZXRlLnByb3RvdHlwZS5nZXRMb2NJRCA9IGZ1bmN0aW9uKCl7XG5cdFx0Ly9mdW5jdGlvbiB0byBnZXQgdGhlIElEIG9mIGxvY2F0aW9uXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdHRoYXQubG9jYXRpb25UeXBlID0gJCggdGhhdC4kc2VhcmNoU2NvcGUgKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5hdHRyKCdkYXRhLWxvYycpO1xuXHRcdFxuXHRcdC8vY29uc29sZS5sb2coIHRoYXQubG9jYXRpb25UeXBlICk7XG5cdH07XG5cblx0U2VhcmNoQXV0b2NvbXBsZXRlLnByb3RvdHlwZS5pbml0TGl2ZVNlYXJjaCA9IGZ1bmN0aW9uKCl7XG5cblx0XHQvL0FKQVggZXZlbnQgd2F0Y2hpbmcgZm9yIHVzZXIgaW5wdXQgYW5kIG91dHB1dHRpbmcgc3VnZ2VzdGVkIHJlc3VsdHNcblx0XHR2YXIgdGhhdCA9IHRoaXMsXG5cdFx0XHR0aW1lb3V0O1xuXHRcdFxuXHRcdHRoaXMuaW5pdExpZ2h0Qm94KCk7XG5cdFx0dGhpcy50b2dnbGVJbmRleCgpO1xuXHRcdFxuXHRcdC8va2V5Ym9hcmQgZXZlbnRzIGZvciBzZW5kaW5nIHF1ZXJ5IHRvIGRhdGFiYXNlXG5cdFx0dGhpcy4kaW5wdXRcblx0XHRcdC5vbigna2V5dXAnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblxuXHRcdFx0XHQvLyBjbGVhciBhbnkgcHJldmlvdXMgc2V0IHRpbWVvdXRcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRoYXQudGltZW91dCk7XG5cblx0XHRcdFx0Ly8gaWYga2V5IGlzIGZvcmJpZGRlbiwgcmV0dXJuXG5cdFx0XHRcdGlmICggZm9yYmlkZGVuS2V5cy5pbmRleE9mKCBldmVudC5rZXlDb2RlICkgPiAtMSApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBnZXQgdmFsdWUgb2Ygc2VhcmNoIGlucHV0XG5cdFx0XHRcdHZhciBxdWVyeSA9IHRoYXQuJGlucHV0LnZhbCgpO1xuXHRcdFx0XHQvL3JlbW92ZSBkb3VibGUgcXVvdGF0aW9ucyBhbmQgb3RoZXIgY2hhcmFjdGVycyBmcm9tIHN0cmluZ1xuXHRcdFx0XHRxdWVyeSA9IHF1ZXJ5LnJlcGxhY2UoL1teYS16QS1aMC05IC0nLixAOl0vZywgXCJcIik7XG5cblx0XHRcdFx0Ly8gc2V0IGEgdGltZW91dCBmdW5jdGlvbiB0byB1cGRhdGUgcmVzdWx0cyBvbmNlIDYwMG1zIHBhc3Nlc1xuXHRcdFx0XHR0aGF0LnRpbWVvdXQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcblxuXHRcdFx0XHRcdGlmICggcXVlcnkubGVuZ3RoID4gMSApIHtcblx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0Ly9zZXQgdGhpcyB2ZXJpYWJsZSBoZXJlIGN1eiB3ZSBhcmUgZ29pbmcgdG8gbmVlZCBpdCBsYXRlclxuXHRcdFx0XHRcdFx0dGhhdC5nZXRMb2NJRCgpO1x0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0dGhhdC4kcmVzcG9uc2Uuc2hvdygpO1xuXHRcdFx0XHRcdCBcdHRoYXQuZmV0Y2hSZXN1bHRzKCBxdWVyeSApO1xuXHRcdFx0XHRcdCBcdFxuXHRcdFx0XHRcdCBcdFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHRcdHRoYXQuJHJlc3BvbnNlTGlzdC5odG1sKCcnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSwgMzAwKTtcblxuXHRcdFx0fSlcblx0XHRcdC5mb2N1cyhmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAoIHRoYXQuJGlucHV0LnZhbCgpICE9PSAnJyApIHtcblx0XHRcdFx0XHR0aGF0LiRyZXNwb25zZS5zaG93KCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pXG5cdFx0XHQuYmx1cihmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsIF9vbkJsdXJyZWRDbGljayk7XG5cdFx0XHR9KTtcblx0XHRcblx0XHRmdW5jdGlvbiBfb25CbHVycmVkQ2xpY2soZXZlbnQpIHtcblx0XHRcdFxuXHRcdFx0aWYgKCAhICQuY29udGFpbnMoIHRoYXQuJGVsWzBdLCBldmVudC50YXJnZXQgKSApIHtcblx0XHRcdFx0dGhhdC4kcmVzcG9uc2UuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0XHRcdFx0XG5cdFx0XHQkKGRvY3VtZW50KS5vZmYoJ2NsaWNrJywgX29uQmx1cnJlZENsaWNrKTtcblxuXHRcdH1cdFx0XG5cblx0XHQvL3NlbmQgcXVlcnkgdG8gZGF0YWJhc2UgYmFzZWQgb24gb3B0aW9uIGNoYW5nZVxuXHRcdHRoaXMuJHNlYXJjaEluZGV4LmFkZCh0aGlzLiRzZWFyY2hTY29wZSkuY2hhbmdlKGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGF0Lm9uU2VhcmNoSW5kZXhDaGFuZ2UoKTtcblx0XHR9KTtcblx0XHRcblx0XHQvL29uIHN1Ym1pdCBmaXJlIG9mZiBjYXRhbG9nIHNlYXJjaCB0byBXTVNcblx0XHR0aGlzLiRmb3JtLm9uKCdzdWJtaXQnLCAge3RoYXQ6IHRoaXMgfSAsIHRoYXQuaGFuZGxlU3VibWl0ICk7XG5cdFx0XHRcblx0fTtcblx0XG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuaW5pdFN0YXRpY1NlYXJjaCA9IGZ1bmN0aW9uKCl7XG5cdFx0Ly9pZiBzdGF0aWMsIG5vIEFKQVggd2F0Y2hpbmcsIGluIHRoaXMgY2FzZSAtIGp1c3QgbG9va2luZyBmb3Igc3VibWlzc2lvbnNcblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XG5cdFx0dGhpcy50b2dnbGVJbmRleCgpO1xuXHRcdFxuXHRcdC8vb24gc3VibWl0IGZpcmUgb2ZmIGNhdGFsb2cgc2VhcmNoIHRvIFdNU1xuXHRcdHRoaXMuJGZvcm0ub24oJ3N1Ym1pdCcsICB7dGhhdDogdGhpcyB9ICwgdGhhdC5oYW5kbGVTdWJtaXQgKTtcdFx0XG5cdFx0XG5cdH07XG5cdFxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmhhbmRsZVN1Ym1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcblx0XHR2YXIgdGhhdCA9IGV2ZW50LmRhdGEudGhhdDtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcblx0XHRcdGlmKHRoYXQuJGFjdGl2YXRlTGl2ZVNlYXJjaCl7XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aGF0LnRpbWVvdXQpO1x0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vZ2V0IHNlYXJjaCBpbmRleCBhbmQgaW5wdXQgdmFsdWVcblx0XHRcdHZhciBzZWFyY2hJbmRleCA9IHRoYXQuJHNlYXJjaEluZGV4LnZhbCgpO1xuXHRcdFx0dmFyIHF1ZXJ5U3RyaW5nID0gdGhhdC4kaW5wdXQudmFsKCk7XG5cdFx0XHRcblx0XHRcdC8vY2hlY2sgbG9jYXRpb24gdHlwZVxuXHRcdFx0dGhhdC5nZXRMb2NJRCgpO1xuXHRcdFx0XG5cdFx0XHQvL2lmIHRoaXMgVVJMIGlzIGZvciBXTVMsIHRoZW4gYXBwZW5kIHRoZSBzZWFyY2hpbmRleCB0byBpdCwgaWYgbm90LCB0aGVuIHNlbnQgcXVlcnlTdHJpbmcgb25seVxuXHRcdFx0Ly9zZXR1cCBhcnJheSBmb3IgY29uc3RydWN0U2VhcmNoVVJMKClcblx0XHRcdHZhciBpbnB1dE9iamVjdCA9IHt9O1xuXHRcdFx0aW5wdXRPYmplY3QucXVlcnlTdHJpbmdcdD0gKHRoYXQubG9jYXRpb25UeXBlID09PSAnd21zJykgPyAgc2VhcmNoSW5kZXggKyBcIjpcIiArIHF1ZXJ5U3RyaW5nIDogcXVlcnlTdHJpbmc7XG5cdFx0XHRpbnB1dE9iamVjdC5zZWFyY2hTY29wZVx0PSB0aGF0LiRzZWFyY2hTY29wZS52YWwoKTtcblxuXHRcdFx0Ly9pZiBxdWVyeSBzdHJpbmcgaGFzIGNvbnRlbnQsIHRoZW4gcnVuXG5cdFx0XHRpZiAoIHF1ZXJ5U3RyaW5nLmxlbmd0aCA+IDEgKSB7XG5cblx0XHRcdFx0dmFyIHdtc0NvbnN0cnVjdGVkVXJsID0gdGhhdC5jb25zdHJ1Y3RTZWFyY2hVUkwoaW5wdXRPYmplY3QpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyggd21zQ29uc3RydWN0ZWRVcmwgKTtcblx0XHRcdFx0XG5cdFx0XHRcdGlmKCB0aGF0LmxvY2F0aW9uVHlwZSA9PT0gJ3dwX2NjbCcgKXtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR3aW5kb3cub3Blbih3bXNDb25zdHJ1Y3RlZFVybCwgJ19zZWxmJyk7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0JCh3aW5kb3cpLnVubG9hZCggZnVuY3Rpb24oKXtcblxuXHRcdFx0XHRcdFx0dGhhdC4kc2VhcmNoU2NvcGUucHJvcCggJ3NlbGVjdGVkSW5kZXgnLCAwICk7XG5cdFx0XHRcdFx0fSk7XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR3aW5kb3cub3Blbih3bXNDb25zdHJ1Y3RlZFVybCwgJ19ibGFuaycpO1x0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHQgICB9ZWxzZXtcblx0XHQgICBcdFxuXHRcdCAgIFx0cmV0dXJuO1xuXHRcdCAgIFx0XG5cdFx0ICAgfVx0XHRcblx0fTtcblxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmZldGNoUmVzdWx0cyA9IGZ1bmN0aW9uKCBxdWVyeSApIHtcblx0XHQvL3NlbmQgQUpBWCByZXF1ZXN0IHRvIFBIUCBmaWxlIGluIFdQXG5cdFx0dmFyIHRoYXQgPSB0aGlzLFxuXHRcdFx0ZGF0YSA9IHtcblx0XHRcdFx0cyA6IHF1ZXJ5LFxuXHRcdFx0fTtcblxuXHRcdHRoYXQuJGVsLmFkZENsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuXG5cdFx0JC5nZXQoQ0NMLmFwaS5zZWFyY2gsIGRhdGEpXG5cdFx0XHQuZG9uZShmdW5jdGlvbiAocmVzcG9uc2UpIHtcblx0XHRcdFx0dGhhdC5oYW5kbGVSZXNwb25zZShyZXNwb25zZSk7XG5cdFx0XHR9KVxuXHRcdFx0LmFsd2F5cyhmdW5jdGlvbigpe1xuXHRcdFx0XHR0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcblx0XHRcdH0pO1xuXG5cdH07XG5cblx0U2VhcmNoQXV0b2NvbXBsZXRlLnByb3RvdHlwZS5oYW5kbGVSZXNwb25zZSA9IGZ1bmN0aW9uKCByZXNwb25zZSApIHtcblx0XHRcblx0XHQvL1Byb2Nlc3MgdGhlIHJlc3VsdHMgZnJvbSB0aGUgQVBJIHF1ZXJ5IGFuZCBnZW5lcmF0ZSBIVE1MIGZvciBkaXNwcGxheVxuXHRcdFxuXHRcdGNvbnNvbGUubG9nKCByZXNwb25zZSApO1xuXHRcdFxuXHRcdHZhciB0aGF0ID0gdGhpcyxcblx0XHRcdHJlc3VsdHMgPSByZXNwb25zZSxcblx0XHRcdGNvdW50ID0gcmVzdWx0cy5jb3VudCxcblx0XHRcdHF1ZXJ5ID0gcmVzdWx0cy5xdWVyeSxcblx0XHRcdHBvc3RzID0gcmVzdWx0cy5wb3N0cyxcblx0XHRcdHNlYXJjaEluZGV4ID0gICQoIHRoYXQuJGluZGV4Q29udGFpbiApLmlzKCc6dmlzaWJsZScpID8gdGhhdC4kc2VhcmNoSW5kZXgudmFsKCkgOiAna3cnLFxuXHRcdFx0c2VhcmNoSW5kZXhOaWNlbmFtZSA9IGluZGV4TmFtZXNbc2VhcmNoSW5kZXhdLFxuXHRcdFx0c2VhcmNoU2NvcGVEYXRhID0gJCggdGhhdC4kc2VhcmNoU2NvcGUgKSxcblx0XHRcdHJlbmRlcmVkUmVzcG9uc2VcdD0gW107XG5cdFx0XHRcblx0XHQvLyB3cmFwIHF1ZXJ5XG5cdFx0Ly92YXIgcXVlcnlTdHJpbmcgPSBzZWFyY2hJbmRleCArICc6JyArIHF1ZXJ5O1xuXHRcdFxuXHRcdC8vZ2V0IHdtc191cmwgaW5wdXRPYmplY3QgPSB7cXVlcnlTdHJpbmcsIHNlYXJjaFNjb3BlLCBsb2NhdGlvblR5cGV9XG5cdFx0dmFyIGlucHV0T2JqZWN0ID0ge307XG5cdFx0aW5wdXRPYmplY3QucXVlcnlTdHJpbmdcdD0gKHRoYXQubG9jYXRpb25UeXBlID09PSAnd21zJykgPyAgc2VhcmNoSW5kZXggKyBcIjpcIiArIHF1ZXJ5IDogcXVlcnk7XG5cdFx0aW5wdXRPYmplY3Quc2VhcmNoU2NvcGVcdD0gdGhhdC4kc2VhcmNoU2NvcGUudmFsKCk7XG5cdFx0XG5cdFx0Ly9VUkwgY3JlYXRlZCFcblx0XHR2YXIgd21zQ29uc3RydWN0ZWRVcmwgPSB0aGF0LmNvbnN0cnVjdFNlYXJjaFVSTChpbnB1dE9iamVjdCk7XG5cblx0XHQvLyBDbGVhciByZXNwb25zZSBhcmVhIGxpc3QgaXRlbXMgKHVwZGF0ZSB3aGVuIFBhdHRlcm4gTGlicmFyeSB2aWV3IGlzbid0IG5lY2Vzc2FyeSlcblx0XHR0aGF0LiRyZXNwb25zZUxpc3QuaHRtbCgnJyk7XG5cdFx0dGhhdC4kcmVzdWx0c0xpbmsucmVtb3ZlKCk7XG5cdFx0XG5cdFx0Ly9hZGQgdGhlIGNsb3NlIGJ1dHRvblxuXHRcdHZhciByZXN1bHRzQ2xvc2UgPSAnPGRpdiBjbGFzcz1cImNjbC1jLXNlYXJjaC0tY2xvc2UtcmVzdWx0c1wiPicgK1xuXHRcdFx0XHRcdFx0XHQnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjY2wtYi1jbG9zZSBjY2wtYy1zZWFyY2gtLWNsb3NlX19idXR0b25cIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcdCc8c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9idXR0b24+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2Pic7XG5cblx0XHQvLyBDcmVhdGUgbGlzdCBpdGVtIGZvciBXb3JsZGNhdCBzZWFyY2guXG5cdFx0dmFyIGxpc3RJdGVtID0gICc8YSBocmVmPVwiJysgd21zQ29uc3RydWN0ZWRVcmwgKydcIiBjbGFzcz1cImNjbC1jLXNlYXJjaC1pdGVtIGNjbC1pcy1sYXJnZVwiIHJvbGU9XCJsaXN0aXRlbVwiIHRhcmdldD1cIl9ibGFua1wiIHN0eWxlPVwiYm9yZGVyOm5vbmU7XCI+JyArXG5cdFx0XHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cImNjbC1jLXNlYXJjaC1pdGVtX190eXBlXCI+JyArXG5cdFx0XHRcdFx0XHRcdFx0JzxpIGNsYXNzPVwiY2NsLWItaWNvbiBib29rXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPicgK1xuXHRcdFx0XHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cImNjbC1jLXNlYXJjaC1pdGVtX190eXBlLXRleHRcIj5Xb3JsZENhdDwvc3Bhbj4nICtcblx0XHRcdFx0XHRcdFx0Jzwvc3Bhbj4nICtcblx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVxcXCJjY2wtYy1zZWFyY2gtaXRlbV9fdGl0bGVcXFwiPicgK1xuXHRcdFx0XHRcdFx0XHRcdCdTZWFyY2ggYnkgJyArIHNlYXJjaEluZGV4TmljZW5hbWUgKyAnIGZvciAmbGRxdW87JyArIHF1ZXJ5ICsgJyZyZHF1bzsgaW4gJysgc2VhcmNoU2NvcGVEYXRhLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLnRleHQoKSArJyAnICtcblx0XHRcdFx0XHRcdFx0XHQnPGkgY2xhc3M9XCJjY2wtYi1pY29uIGFycm93LXJpZ2h0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgc3R5bGU9XCJ2ZXJ0aWNhbC1hbGlnbjptaWRkbGVcIj48L2k+JyArXG5cdFx0XHRcdFx0XHRcdCc8L3NwYW4+Jytcblx0XHRcdFx0XHRcdCc8L2E+JztcblxuXHRcdFxuXHRcdC8vYWRkIEhUTUwgdG8gdGhlIHJlc3BvbnNlIGFycmF5XG5cdFx0cmVuZGVyZWRSZXNwb25zZS5wdXNoKCByZXN1bHRzQ2xvc2UsIGxpc3RJdGVtICk7XG5cblx0XHQvLyBDcmVhdGUgbGlzdCBpdGVtcyBmb3IgZWFjaCBwb3N0IGluIHJlc3VsdHNcblx0XHRpZiAoIGNvdW50ID4gMCApIHtcblxuXHRcdFx0Ly8gQ3JlYXRlIGEgc2VwYXJhdG9yIGJldHdlZW4gd29ybGRjYXQgYW5kIG90aGVyIHJlc3VsdHNcblx0XHRcdHZhciBzZXBhcmF0b3IgPSAnPHNwYW4gY2xhc3M9XCJjY2wtYy1zZWFyY2gtaXRlbSBjY2wtaXMtc2VwYXJhdG9yXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPicgK1xuXHRcdFx0XHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cXFwiY2NsLWMtc2VhcmNoLWl0ZW1fX3RpdGxlXFxcIj4nICtcblx0XHRcdFx0XHRcdFx0XHRcdCc8aSBjbGFzcz1cImNjbC1iLWljb24gYXJyb3ctZG93blwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4nICtcblx0XHRcdFx0XHRcdFx0XHRcdCcgT3RoZXIgc3VnZ2VzdGVkIHJlc291cmNlcyBmb3IgJmxkcXVvOycgKyBxdWVyeSArICcmcmRxdW87JyArXG5cdFx0XHRcdFx0XHRcdFx0Jzwvc3Bhbj4nICtcblx0XHRcdFx0XHRcdFx0Jzwvc3Bhbj4nO1xuXG5cdFx0XHQvL2FkZCBIVE1MIHRvIHJlc3BvbnNlIGFycmF5XG5cdFx0XHRyZW5kZXJlZFJlc3BvbnNlLnB1c2goIHNlcGFyYXRvciApO1xuXG5cdFx0XHQvLyBCdWlsZCByZXN1bHRzIGxpc3Rcblx0XHRcdHBvc3RzLmZvckVhY2goZnVuY3Rpb24gKHBvc3QpIHtcblx0XHRcdFx0Ly8gY29uc29sZS5sb2cocG9zdCk7XG5cblx0XHRcdFx0dmFyIGN0YSxcblx0XHRcdFx0XHR0YXJnZXQ7XG5cblx0XHRcdFx0c3dpdGNoKCBwb3N0LnR5cGUgKSB7XG5cdFx0XHRcdFx0Y2FzZSAnQm9vayc6XG5cdFx0XHRcdFx0Y2FzZSAnRkFRJzpcblx0XHRcdFx0XHRjYXNlICdSZXNlYXJjaCBHdWlkZSc6XG5cdFx0XHRcdFx0Y2FzZSAnSm91cm5hbCc6XG5cdFx0XHRcdFx0Y2FzZSAnRGF0YWJhc2UnOlxuXHRcdFx0XHRcdFx0Y3RhID0gJ1ZpZXcnO1xuXHRcdFx0XHRcdFx0dGFyZ2V0ID0gJ19ibGFuayc7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICdMaWJyYXJpYW4nOlxuXHRcdFx0XHRcdGNhc2UgJ1N0YWZmJzpcblx0XHRcdFx0XHRcdGN0YSA9ICdDb250YWN0Jztcblx0XHRcdFx0XHRcdHRhcmdldCA9ICdfYmxhbmsnO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdGN0YSA9ICdWaWV3Jztcblx0XHRcdFx0XHRcdHRhcmdldCA9ICdfc2VsZic7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsaXN0SXRlbSA9ICAnPGEgaHJlZj1cIicgKyBwb3N0LmxpbmsgKyAnXCIgY2xhc3M9XCJjY2wtYy1zZWFyY2gtaXRlbVwiIHJvbGU9XCJsaXN0aXRlbVwiIHRhcmdldD1cIicgKyB0YXJnZXQgKyAnXCI+JyArXG5cdFx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVxcXCJjY2wtYy1zZWFyY2gtaXRlbV9fdHlwZVxcXCI+JyArXG5cdFx0XHRcdFx0XHRcdFx0XHQnPGkgY2xhc3M9XCJjY2wtYi1pY29uICcgKyBwb3N0Lmljb24gKyAnXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPicgK1xuXHRcdFx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwiY2NsLWMtc2VhcmNoLWl0ZW1fX3R5cGUtdGV4dFwiPicgKyBwb3N0LnR5cGUgKyAnPC9zcGFuPicgK1xuXHRcdFx0XHRcdFx0XHRcdCc8L3NwYW4+JyArXG5cdFx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwiY2NsLWMtc2VhcmNoLWl0ZW1fX3RpdGxlXCI+JyArIHBvc3QudGl0bGUgKyAnPC9zcGFuPicgK1xuXHRcdFx0XHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cImNjbC1jLXNlYXJjaC1pdGVtX19jdGFcIj4nICtcblx0XHRcdFx0XHRcdFx0XHRcdCc8c3Bhbj4nICsgY3RhICsgJyA8aSBjbGFzcz1cImNjbC1iLWljb24gYXJyb3ctcmlnaHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOm1pZGRsZVwiPjwvaT48L3NwYW4+JyArXG5cdFx0XHRcdFx0XHRcdFx0Jzwvc3Bhbj4nICtcblx0XHRcdFx0XHRcdFx0JzwvYT4nO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly9hZGQgSFRNTCB0byB0aGUgcmVzcG9uc2UgYXJyYXlcblx0XHRcdFx0cmVuZGVyZWRSZXNwb25zZS5wdXNoKCBsaXN0SXRlbSApO1xuXHRcdFx0fSk7XG5cblx0XHRcdC8vIEJ1aWxkIHJlc3VsdHMgY291bnQvbGlua1xuXHRcdFx0bGlzdEl0ZW0gPSAnPGRpdiBjbGFzcz1cImNjbC1jLXNlYXJjaC1yZXN1bHRzX19mb290ZXJcIj4nICtcblx0XHRcdFx0XHRcdFx0XHQnPGEgaHJlZj1cIi8/cz0nICsgcXVlcnkgKyAnXCIgY2xhc3M9XCJjY2wtYy1zZWFyY2gtcmVzdWx0c19fYWN0aW9uXCI+JyArXG5cdFx0XHRcdFx0XHRcdFx0XHQnVmlldyBhbGwgJyArIGNvdW50ICsgJyBSZXN1bHRzICcgK1xuXHRcdFx0XHRcdFx0XHRcdFx0JzxpIGNsYXNzPVwiY2NsLWItaWNvbiBhcnJvdy1yaWdodFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4nICtcblx0XHRcdFx0XHRcdFx0XHQnPC9hPicgK1xuXHRcdFx0XHRcdFx0JzwvZGl2Pic7XG5cblx0XHRcdC8vYWRkIEhUTUwgdG8gdGhlIHJlc3BvbnNlIGFycmF5XG5cdFx0XHRyZW5kZXJlZFJlc3BvbnNlLnB1c2goIGxpc3RJdGVtICk7XG5cdFx0XG5cdFx0fVxuXHRcdFxuXHRcdC8vYXBwZW5kIGFsbCByZXNwb25zZSBkYXRhIGFsbCBhdCBvbmNlXG5cdFx0dGhhdC4kcmVzcG9uc2VMaXN0LmFwcGVuZCggcmVuZGVyZWRSZXNwb25zZSApO1xuXHRcdFxuXHRcdC8vY2FjaGUgdGhlIHJlc3BvbnNlIGJ1dHRvbiBhZnRlciBpdHMgYWRkZWQgdG8gdGhlIERPTVxuXHRcdHRoYXQuJHJlc3BvbnNlQ2xvc2VcdD0gdGhhdC4kZWwuZmluZCgnLmNjbC1jLXNlYXJjaC0tY2xvc2VfX2J1dHRvbicpO1x0XHRcblx0XHRcblx0XHQvL2NsaWNrIGV2ZW50IHRvIGNsb3NlIHRoZSByZXN1bHRzIHBhZ2Vcblx0XHR0aGF0LiRyZXNwb25zZUNsb3NlLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdC8vaGlkZVxuXHRcdFx0XHRpZiggJCggdGhhdC4kcmVzcG9uc2UgKS5pcygnOnZpc2libGUnKSApe1xuXHRcdFx0XHRcdHRoYXQuJHJlc3BvbnNlLmhpZGUoKTtcdFxuXHRcdFx0XHRcdHRoYXQuZGVzdHJveUxpZ2h0Qm94KCk7XG5cdFx0XHRcdH1cblx0XHR9KTtcblx0XHRcblx0XHRcblx0fTtcblxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLm9uU2VhcmNoSW5kZXhDaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHQvL29uIGNoYW5nZXMgdG8gdGhlIGxvY2F0aW9uIG9yIGF0dHJpYnV0ZSBpbmRleCBvcHRpb24sIHdpbGwgd2F0Y2ggYW5kIHJ1biBmZXRjaFJlc3VsdHNcblx0XHR2YXIgcXVlcnkgPSB0aGlzLiRpbnB1dC52YWwoKTtcblxuXHRcdGlmICggISBxdWVyeS5sZW5ndGggKSB7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHRoaXMuJHJlc3BvbnNlLnNob3coKTtcdFx0XG5cdFx0dGhpcy5mZXRjaFJlc3VsdHMoIHF1ZXJ5ICk7XG5cdH07XG5cdFxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmNvbnN0cnVjdFNlYXJjaFVSTCA9IGZ1bmN0aW9uKGlucHV0T2JqZWN0KXtcblx0XHQvL2NvbnN0cnVjdHMgVVJMIHdpdGggcGFyYW1ldGVycyBmcm9tXG5cdFx0Ly9pbnB1dE9iamVjdCA9IHsgcXVlcnlTdHJpbmcsIHNlYXJjaFNjb3BlLCBTZWFyY2hMb2NhdGlvbiB9XG5cdFx0XG5cdFx0Ly9kZWZpbmUgdmFyaWFibGVzXG5cdFx0dmFyIHF1ZXJ5U3RyaW5nLCBzZWFyY2hTcmMsIHNlYXJjaFNjb3BlS2V5LCByZW5kZXJlZFVSTDtcblx0XHRcblx0XHRxdWVyeVN0cmluZyBcdD0gaW5wdXRPYmplY3QucXVlcnlTdHJpbmc7XG5cdFx0c2VhcmNoU3JjXHRcdD0gaW5wdXRPYmplY3Quc2VhcmNoU2NvcGU7XG5cblx0XHRcblx0XHRzd2l0Y2ggKCB0aGlzLmxvY2F0aW9uVHlwZSkge1xuXHRcdFx0Y2FzZSAnd21zJzpcblx0XHRcdFx0Ly9jaGVjayBpZiBzZWFyY2ggbG9jYXRpb24gaXMgYSBzY29wZWQgc2VhcmNoIGxvY2F0aW9uXG5cdFx0XHRcdGlmKCBzZWFyY2hTcmMubWF0Y2goLzo6enM6LykgKXtcblx0XHRcdFx0XHRzZWFyY2hTY29wZUtleSA9ICdzdWJzY29wZSc7XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdHNlYXJjaFNjb3BlS2V5ID0gJ3Njb3BlJztcblx0XHRcdFx0fVxuXHQgICAgICAgICAgICAvL2J1aWxkIHRoZSBVUkxcblx0ICAgICAgICAgICAgdmFyIHdtc19wYXJhbXMgPSB7XG5cdCAgICAgICAgICAgICAgICBzb3J0S2V5ICAgICAgICAgOiAnTElCUkFSWScsXG5cdCAgICAgICAgICAgICAgICBkYXRhYmFzZUxpc3QgICAgOiAnJyxcblx0ICAgICAgICAgICAgICAgIHF1ZXJ5U3RyaW5nICAgICA6IHF1ZXJ5U3RyaW5nLFxuXHQgICAgICAgICAgICAgICAgRmFjZXQgICAgICAgICAgIDogJycsXG5cdCAgICAgICAgICAgICAgICAvL3Njb3BlIGFkZGVkIGJlbG93XG5cdCAgICAgICAgICAgICAgICAvL2Zvcm1hdCBhZGRlZCBiZWxvd1xuXHQgICAgICAgICAgICAgICAgZm9ybWF0XHRcdFx0OiAnYWxsJyxcblx0ICAgICAgICAgICAgICAgIGRhdGFiYXNlICAgICAgICA6ICAnYWxsJyxcblx0ICAgICAgICAgICAgICAgIGF1dGhvciAgICAgICAgICA6ICcnLFxuXHQgICAgICAgICAgICAgICAgeWVhciAgICAgICAgICAgIDogJ2FsbCcsXG5cdCAgICAgICAgICAgICAgICB5ZWFyRnJvbSAgICAgICAgOiAnJyxcblx0ICAgICAgICAgICAgICAgIHllYXJUbyAgICAgICAgICA6ICcnLFxuXHQgICAgICAgICAgICAgICAgbGFuZ3VhZ2UgICAgICAgIDogJ2FsbCcsXG5cdCAgICAgICAgICAgICAgICB0b3BpYyAgICAgICAgICAgOiAnJ1xuXHQgICAgICAgICAgICB9O1xuXHQgICAgICAgICAgICBcblx0ICAgICAgICAgICAgd21zX3BhcmFtc1tzZWFyY2hTY29wZUtleV0gPSBzZWFyY2hTcmM7XG5cdCAgICAgICAgICAgIFxuXHQgICAgICAgICAgICByZW5kZXJlZFVSTCA9ICdodHRwczovL2NjbC5vbi53b3JsZGNhdC5vcmcvc2VhcmNoPycgKyAkLnBhcmFtKHdtc19wYXJhbXMpO1xuXHRcdCAgICAgICAgcmVuZGVyZWRVUkwgPSByZW5kZXJlZFVSTC5yZXBsYWNlKCAnJTI2JywgXCImXCIgKTtcdFx0XHRcdFxuXHRcdFx0XHRicmVhaztcblx0XHRcdFx0XG5cdFx0XHRjYXNlICdvYWMnOlxuXHRcdFx0XHR2YXIgb2FjUGFyYW1zO1xuXHRcdFx0XHRvYWNQYXJhbXMgPSB7cXVlcnkgOiAgcXVlcnlTdHJpbmcgfTtcblx0XHRcdFx0XG5cdFx0XHRcdHJlbmRlcmVkVVJMID0gJ2h0dHA6Ly93d3cub2FjLmNkbGliLm9yZy9zZWFyY2g/JyArICAkLnBhcmFtKCBvYWNQYXJhbXMgKSArICcmaW5zdGl0dXRpb249Q2xhcmVtb250K0NvbGxlZ2VzJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmVuZGVyZWRVUkwgPSBDQ0wuc2l0ZV91cmwgKyAnP3M9JyArIHF1ZXJ5U3RyaW5nO1xuXHRcdH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh3bXNfdXJsKTtcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gcmVuZGVyZWRVUkw7XG5cblx0fTtcblx0XG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuaW5pdExpZ2h0Qm94ID0gZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgdGhhdCA9IHRoaXMsXG5cdFx0XHRkZXN0cm95VGltZW91dCA9IDA7XG5cdFx0XG5cdFx0dGhpcy4kZWxcblx0XHRcdC5vbiggJ2ZvY3VzaW4nLCAnOmZvY3VzYWJsZScsIGZ1bmN0aW9uKGV2ZW50KXtcblxuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHQvLyBjbGVhciB0aW1lb3V0IGJlY2F1c2Ugd2UncmUgc3RpbGwgaW5zaWRlIHRoZSBzZWFyY2hib3hcblx0XHRcdFx0aWYgKCBkZXN0cm95VGltZW91dCApIHtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoZGVzdHJveVRpbWVvdXQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCAhIHRoYXQubGlnaHRib3hJc09uICl7XG5cblx0XHRcdFx0XHR0aGF0LmNyZWF0ZUxpZ2h0Qm94KGV2ZW50KTtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0fSlcblx0XHRcdC5vbiggJ2ZvY3Vzb3V0JywgJzpmb2N1c2FibGUnLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBzZXQgYSBzaG9ydCB0aW1lb3V0IHNvIHRoYXQgb3RoZXIgZnVuY3Rpb25zIGNhbiBjaGVjayBhbmQgY2xlYXIgaWYgbmVlZCBiZVxuXHRcdFx0XHRkZXN0cm95VGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuXHRcdFx0XHRcdHRoYXQuZGVzdHJveUxpZ2h0Qm94KCk7XG5cdFx0XHRcdFx0dGhhdC4kcmVzcG9uc2UuaGlkZSgpO1xuXG5cdFx0XHRcdH0sIDEwMCk7XG5cblx0XHRcdH0pO1xuXG5cdFx0dGhpcy4kcmVzcG9uc2Vcblx0XHRcdC5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXG5cdFx0XHRcdC8vIGNsZWFyIGRlc3Ryb3kgdGltZW91dCBiZWNhdXNlIHdlJ3JlIHN0aWxsIGluc2lkZSB0aGUgc2VhcmNoYm94XG5cdFx0XHRcdGlmICggZGVzdHJveVRpbWVvdXQgKSB7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KGRlc3Ryb3lUaW1lb3V0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9KTtcblxuXHR9O1xuXG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuY3JlYXRlTGlnaHRCb3ggPSBmdW5jdGlvbihldmVudCkge1xuXG5cdFx0dGhpcy5saWdodGJveElzT24gPSB0cnVlO1xuXHRcdFx0XHRcdFxuXHRcdHRoaXMuJGVsLmFkZENsYXNzKCdpcy1saWdodGJveGVkJyk7XG5cdFx0dGhpcy4kbGlnaHRib3ggPSAkKCc8ZGl2IGNsYXNzPVwiY2NsLWMtbGlnaHRib3hcIj4nKS5hcHBlbmRUbygnYm9keScpO1xuXHRcdHZhciBzZWFyY2hCb3hUb3AgPSB0aGlzLiRlbC5vZmZzZXQoKS50b3AgLSAxMjggKyAncHgnO1xuXHRcdHZhciB0YXJnZXRUb3AgPSAkKGV2ZW50LnRhcmdldCkub2Zmc2V0KCkudG9wIC0gMTI4ICsgJ3B4Jztcblx0XHRcblx0XHQvLyBwcmV2ZW50cyB0aGUgc2Nyb2xsYmFyIGZyb20ganVtcGluZyBpZiB0aGUgdXNlciBpcyB0YWJiaW5nIGJlbG93IHRoZSBmb2xkXG5cdFx0Ly8gaWYgdGhlIHNlYXJjaGJveCBhbmQgdGhlIHRhcmdldCBhcmUgdGhlIHNhbWUgLSB0aGVuIGl0IHdpbGwganVtcCwgaWYgbm90LCBcblx0XHQvLyB0aGVuIGl0IHdvbid0IGp1bXBcblx0XHRpZiAoIHNlYXJjaEJveFRvcCA9PSB0YXJnZXRUb3AgKXtcblx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBzZWFyY2hCb3hUb3AgfSApO1x0XHRcdFx0XHRcdFxuXHRcdH1cdFx0XG5cblx0fTtcblxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmRlc3Ryb3lMaWdodEJveCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggdGhpcy4kbGlnaHRib3ggKSB7XG5cdFx0XHR0aGlzLiRsaWdodGJveC5yZW1vdmUoKTtcblx0XHRcdHRoaXMuJGxpZ2h0Ym94ID0gbnVsbDtcblx0XHRcdHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdpcy1saWdodGJveGVkJyk7XG5cdFx0XHR0aGlzLmxpZ2h0Ym94SXNPbiA9IGZhbHNlO1xuXHRcdFx0XG5cdFx0fVxuXHR9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0XHQvLyAuZWFjaCgpIHdpbGwgZmFpbCBncmFjZWZ1bGx5IGlmIG5vIGVsZW1lbnRzIGFyZSBmb3VuZFxuXHRcdCQoJy5jY2wtanMtc2VhcmNoLWZvcm0nKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRuZXcgU2VhcmNoQXV0b2NvbXBsZXRlKHRoaXMpO1xuXHRcdH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKlxuICogU2xpZGVUb2dnbGVcbiAqIFxuICogIHRhYnMgZm9yIGhpZGluZyBhbmQgc2hvd2luZyBhZGRpdGlvbmFsIGNvbnRlbnRcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIHNsaWRlVG9nZ2xlTGlzdCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgICAgICAgICAgICAgICAgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kc2xpZGVUb2dnbGVMaW5rICAgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtc2xpZGVUb2dnbGVfX3RpdGxlJyk7XG4gICAgICAgIHRoaXMuJHRvZ2dsZUNvbnRhaW5lciAgID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNsaWRlVG9nZ2xlX19jb250YWluZXInKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBzbGlkZVRvZ2dsZUxpc3QucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoYXQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kc2xpZGVUb2dnbGVMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2dCl7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIC8vZ2V0IHRoZSB0YXJnZXQgdG8gYmUgb3BlbmVkXG4gICAgICAgICAgICB2YXIgY2xpY2tJdGVtID0gJCh0aGlzKTtcbiAgICAgICAgICAgIC8vZ2V0IHRoZSBkYXRhIHRhcmdldCB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoaXMgbGlua1xuICAgICAgICAgICAgdmFyIHRhcmdldF9jb250ZW50ID0gY2xpY2tJdGVtLmF0dHIoJ2RhdGEtdG9nZ2xlVGl0bGUnKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9hZGQgdGhlIGFjdGl2ZSBjbGFzcyBzbyB3ZSBjYW4gZG8gc3R5bGluZ3MgYW5kIHRyYW5zaXRpb25zXG4gICAgICAgICAgICBjbGlja0l0ZW1cbiAgICAgICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKVxuICAgICAgICAgICAgICAgIC5zaWJsaW5ncygpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvL3RvZ2dsZSBhcmlhXG4gICAgICAgICAgICBpZiAoY2xpY2tJdGVtLmF0dHIoICdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJykge1xuICAgICAgICAgICAgICAgICAgICAkKGNsaWNrSXRlbSkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKGNsaWNrSXRlbSkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL2xvY2F0ZSB0aGUgdGFyZ2V0IGVsZW1lbnQgYW5kIHNsaWRldG9nZ2xlIGl0XG4gICAgICAgICAgICBfdGhhdC4kdG9nZ2xlQ29udGFpbmVyXG4gICAgICAgICAgICAgICAgLmZpbmQoICdbZGF0YS10b2dnbGVUYXJnZXQ9XCInICsgdGFyZ2V0X2NvbnRlbnQgKyAnXCJdJyApXG4gICAgICAgICAgICAgICAgLnNsaWRlVG9nZ2xlKCdmYXN0Jyk7XG4gICAgICAgICAgICAgICAgLy90b2dnbGUgYXJpYS1leHBhbmRlZFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy90b2dnbGUgYXJpYVxuICAgICAgICAgICAgaWYgKF90aGF0LiR0b2dnbGVDb250YWluZXIuYXR0ciggJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoX3RoYXQuJHRvZ2dsZUNvbnRhaW5lcikuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKF90aGF0LiR0b2dnbGVDb250YWluZXIpLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWMtc2xpZGVUb2dnbGUnKS5lYWNoKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IHNsaWRlVG9nZ2xlTGlzdCh0aGlzKTsgICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU21vb3RoIFNjcm9sbGluZ1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXG4gICAgICAgICQoJy5qcy1zbW9vdGgtc2Nyb2xsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9zZXQgdG8gYmx1clxuICAgICAgICAgICAgJCh0aGlzKS5ibHVyKCk7ICAgICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcykuZGF0YSgndGFyZ2V0JykgfHwgJCh0aGlzKS5hdHRyKCdocmVmJyksXG4gICAgICAgICAgICAgICAgJHRhcmdldCA9ICQodGFyZ2V0KSxcbiAgICAgICAgICAgICAgICBzY3JvbGxPZmZzZXQgPSAwO1xuXG4gICAgICAgICAgICAkKCcuY2NsLWMtcXVpY2stbmF2JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHNjcm9sbE9mZnNldCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCAkdGFyZ2V0Lmxlbmd0aCApIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VG9wID0gJHRhcmdldC5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoIHsgXG4gICAgICAgICAgICAgICAgICAgICdzY3JvbGxUb3AnOiB0YXJnZXRUb3AgLSBzY3JvbGxPZmZzZXQgfSwgXG4gICAgICAgICAgICAgICAgICAgIDgwMCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU3RpY2tpZXNcbiAqIFxuICogQmVoYXZpb3VyIGZvciBzdGlja3kgZWxlbWVudHMuXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBpc0ZpeGVkOiAnY2NsLWlzLWZpeGVkJ1xuICAgICAgICB9O1xuXG4gICAgdmFyIFN0aWNreSA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICAvLyB2YXJpYWJsZXNcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpLFxuICAgICAgICAgICAgaGVpZ2h0ID0gJGVsLm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICBvZmZzZXQgPSAkZWwub2Zmc2V0KCksXG4gICAgICAgICAgICBvcHRpb25zID0gJGVsLmRhdGEoJ3N0aWNreScpLFxuICAgICAgICAgICAgd3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJqcy1zdGlja3ktd3JhcHBlclwiPjwvZGl2PicpLmNzcyh7IGhlaWdodDogaGVpZ2h0ICsgJ3B4JyB9KTtcblxuICAgICAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgfTtcblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zICk7XG5cbiAgICAgICAgLy8gd3JhcCBlbGVtZW50XG4gICAgICAgICRlbC53cmFwKCB3cmFwcGVyICk7XG5cbiAgICAgICAgLy8gc2Nyb2xsIGxpc3RlbmVyXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgMTAwICkgKTtcblxuICAgICAgICAvLyBvbiBzY3JvbGxcbiAgICAgICAgZnVuY3Rpb24gX29uU2Nyb2xsKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKSArIG9wdGlvbnMub2Zmc2V0O1xuICAgIFxuICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gb2Zmc2V0LnRvcCApIHtcbiAgICAgICAgICAgICAgICAkZWwuYWRkQ2xhc3MoIGNsYXNzTmFtZS5pc0ZpeGVkICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLmlzRml4ZWQgKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1pcy1zdGlja3knKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU3RpY2t5KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogVG9nZ2xlIFNjaG9vbHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIHNjaG9vbCB0b2dnbGVzXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIGluaXRTY2hvb2wgPSAkKCdodG1sJykuZGF0YSgnc2Nob29sJyk7XG5cbiAgICB2YXIgU2Nob29sU2VsZWN0ID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kc2VsZWN0ID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgU2Nob29sU2VsZWN0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgc2Nob29sID0gZ2V0Q29va2llKCAnY2NsLXNjaG9vbCcgKTtcblxuICAgICAgICBpZiAoIGluaXRTY2hvb2wgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuJHNlbGVjdFxuICAgICAgICAgICAgICAgIC5maW5kKCAnb3B0aW9uW3ZhbHVlPVwiJyArIHNjaG9vbCArICdcIl0nIClcbiAgICAgICAgICAgICAgICAuYXR0ciggJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyApO1xuXG4gICAgICAgIFx0aWYgKCBzY2hvb2wgKSB7XG4gICAgICAgIFx0XHQgJCgnaHRtbCcpLmF0dHIoJ2RhdGEtc2Nob29sJywgc2Nob29sKTtcblx0XHRcdH1cblxuXHRcdH1cblxuICAgICAgICB0aGlzLiRzZWxlY3QuY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hdHRyKCAnZGF0YS1zY2hvb2wnLCBldmVudC50YXJnZXQudmFsdWUgKTtcblxuICAgICAgICAgICAgZXJhc2VDb29raWUoICdjY2wtc2Nob29sJyApO1xuICAgICAgICAgICAgc2V0Q29va2llKCAnY2NsLXNjaG9vbCcsIGV2ZW50LnRhcmdldC52YWx1ZSwgNyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBDb29raWUgZnVuY3Rpb25zIGxpZnRlZCBmcm9tIFN0YWNrIE92ZXJmbG93IGZvciBub3dcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNDU3MzIyMy9zZXQtY29va2llLWFuZC1nZXQtY29va2llLXdpdGgtamF2YXNjcmlwdFxuXHRmdW5jdGlvbiBzZXRDb29raWUobmFtZSwgdmFsdWUsIGRheXMpIHtcblx0XHR2YXIgZXhwaXJlcyA9IFwiXCI7XG5cdFx0aWYgKGRheXMpIHtcblx0XHRcdHZhciBkYXRlID0gbmV3IERhdGUoKTtcblx0XHRcdGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChkYXlzICogMjQgKiA2MCAqIDYwICogMTAwMCkpO1xuXHRcdFx0ZXhwaXJlcyA9IFwiOyBleHBpcmVzPVwiICsgZGF0ZS50b1VUQ1N0cmluZygpO1xuXHRcdH1cblx0XHRkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyAodmFsdWUgfHwgXCJcIikgKyBleHBpcmVzICsgXCI7IHBhdGg9L1wiO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcblx0XHR2YXIgbmFtZUVRID0gbmFtZSArIFwiPVwiO1xuXHRcdHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBjID0gY2FbaV07XG5cdFx0XHR3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcblx0XHRcdGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRmdW5jdGlvbiBlcmFzZUNvb2tpZShuYW1lKSB7XG5cdFx0ZG9jdW1lbnQuY29va2llID0gbmFtZSArICc9OyBNYXgtQWdlPS05OTk5OTk5OTsnO1xuXHR9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJzY2hvb2xcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU2Nob29sU2VsZWN0KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIFRvb2x0aXBzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciB0b29sdGlwc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgVG9vbHRpcCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy4kZWwuYXR0cigndGl0bGUnKTtcbiAgICAgICAgdGhpcy4kdG9vbHRpcCA9ICQoJzxkaXYgaWQ9XCJjY2wtY3VycmVudC10b29sdGlwXCIgY2xhc3M9XCJjY2wtYy10b29sdGlwIGNjbC1pcy10b3BcIiByb2xlPVwidG9vbHRpcFwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19hcnJvd1wiPjwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19pbm5lclwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBUb29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuaG92ZXIoZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIC8vIG1vdXNlb3ZlclxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCAnJyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cignYXJpYS1kZXNjcmliZWRieScsICdjY2wtY3VycmVudC10b29sdGlwJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblxuICAgICAgICAgICAgQ0NMLnJlZmxvdyhfdGhpcy4kdG9vbHRpcFswXSk7XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBfdGhpcy4kZWwub2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgd2lkdGggID0gX3RoaXMuJGVsLm91dGVyV2lkdGgoKSxcbiAgICAgICAgICAgICAgICB0b29sdGlwSGVpZ2h0ID0gX3RoaXMuJHRvb2x0aXAub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuY3NzKHtcbiAgICAgICAgICAgICAgICB0b3A6IChvZmZzZXQudG9wIC0gdG9vbHRpcEhlaWdodCkgKyAncHgnLFxuICAgICAgICAgICAgICAgIGxlZnQ6IChvZmZzZXQubGVmdCArICh3aWR0aC8yKSkgKyAncHgnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgIH0sIGZ1bmN0aW9uKGUpeyBcblxuICAgICAgICAgICAgLy9tb3VzZW91dFxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCBfdGhpcy5jb250ZW50KTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgJycpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlKCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBUb29sdGlwKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogV2F5ZmluZGluZ1xuICogXG4gKiBDb250cm9scyBpbnRlcmZhY2UgZm9yIGxvb2tpbmcgdXAgY2FsbCBudW1iZXIgbG9jYXRpb25zXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICB0YWJzLCB3YXlmaW5kZXI7XG4gICAgXG4gICAgdmFyIFRhYnMgPSBmdW5jdGlvbihlbCkge1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdGFicyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy10YWInKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMgPSAkKCcuY2NsLWMtdGFiX19jb250ZW50Jyk7XG4gICAgICAgIFxuXG4gICAgICAgIHRoaXMuJHRhYnMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICR0YWIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHRhYi5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICR0YWIuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0QWN0aXZlKHRhcmdldCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFRhYnMucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKHRhcmdldCl7XG4gICAgICAgIHRoaXMuJHRhYnMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFicy5maWx0ZXIoJ1tocmVmPVwiJyt0YXJnZXQrJ1wiXScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIHZhciBXYXlmaW5kZXIgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuY2FsbE51bWJlcnMgPSB7fTtcbiAgICAgICAgdGhpcy4kZm9ybSA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bWJlci1zZWFyY2gnKTtcbiAgICAgICAgdGhpcy4kaW5wdXQgPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW0taW5wdXQnKTtcbiAgICAgICAgdGhpcy4kc3VibWl0ID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtLXN1Ym1pdCcpO1xuICAgICAgICB0aGlzLiRtYXJxdWVlID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fbWFycXVlZScpO1xuICAgICAgICB0aGlzLiRjYWxsTnVtID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fY2FsbC1udW0nKTtcbiAgICAgICAgdGhpcy4kd2luZyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX3dpbmcnKTtcbiAgICAgICAgdGhpcy4kZmxvb3IgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19mbG9vcicpO1xuICAgICAgICB0aGlzLiRzdWJqZWN0ID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fc3ViamVjdCcpO1xuICAgICAgICB0aGlzLmVycm9yID0ge1xuICAgICAgICAgICAgZ2V0OiAnPGRpdiBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvciBjY2wtd2F5ZmluZGVyX19lcnJvclwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2NsLWItY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPjxzcGFuIGNsYXNzPVwiY2NsLWItaWNvbiBhbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gVGhlcmUgd2FzIGFuIGVycm9yIGZldGNoaW5nIGNhbGwgbnVtYmVycy48L2Rpdj4nLFxuICAgICAgICAgICAgZmluZDogJzxkaXYgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3IgY2NsLXdheWZpbmRlcl9fZXJyb3JcIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNjbC1iLWNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj48c3BhbiBjbGFzcz1cImNjbC1iLWljb24gYWxlcnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IENvdWxkIG5vdCBmaW5kIHRoYXQgY2FsbCBudW1iZXIuIFBsZWFzZSB0cnkgYWdhaW4uPC9kaXY+J1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRlcnJvckJveCA9ICQoJy5jY2wtZXJyb3ItYm94Jyk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAkLmdldEpTT04oIENDTC5hc3NldHMgKyAnanMvY2FsbC1udW1iZXJzLmpzb24nIClcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIF90aGlzLmNhbGxOdW1iZXJzID0gZGF0YTtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGVycm9yQm94LmFwcGVuZCggdGhpcy5lcnJvci5nZXQgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1hcHAtYWN0aXZlJyk7XG5cbiAgICAgICAgdGhpcy4kaW5wdXRcbiAgICAgICAgICAgIC5rZXl1cChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHF1ZXJ5ID09PSBcIlwiICkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3VibWl0LmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRtYXJxdWVlLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVzZXQoKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGZvcm0uc3VibWl0KGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBfdGhpcy5yZXNldCgpO1xuXG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBfdGhpcy4kaW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgICQoJy5jY2wtd2F5ZmluZGVyX19lcnJvcicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuc2hvdygpO1xuICAgICAgICAgICAgX3RoaXMuJGNhbGxOdW0udGV4dChxdWVyeSk7XG4gICAgICAgICAgICBfdGhpcy5maW5kUm9vbSggcXVlcnkgKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5nZXRDYWxsS2V5ID0gZnVuY3Rpb24oY2FsbE51bSkge1xuICAgICAgICBjYWxsTnVtID0gY2FsbE51bS5yZXBsYWNlKC8gL2csICcnKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBrZXksXG4gICAgICAgICAgICBjYWxsS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY2FsbE51bWJlcnMpO1xuXG4gICAgICAgIGlmICggY2FsbEtleXMubGVuZ3RoID09PSAwICl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsS2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGspe1xuICAgICAgICAgICAgdmFyIGtfbm9TcGFjZXMgPSBrLnJlcGxhY2UoLyAvZywgJycpO1xuXG4gICAgICAgICAgICBpZiAoIGNhbGxOdW0gPj0ga19ub1NwYWNlcyApIHtcbiAgICAgICAgICAgICAgICBrZXkgPSBrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmZpbmRSb29tID0gZnVuY3Rpb24ocXVlcnkpIHtcblxuICAgICAgICBxdWVyeSA9IHF1ZXJ5LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBjYWxsS2V5ID0gdGhpcy5nZXRDYWxsS2V5KHF1ZXJ5KSxcbiAgICAgICAgICAgIGNhbGxEYXRhID0ge30sXG4gICAgICAgICAgICBmbG9vcklkLCByb29tSWQ7XG5cbiAgICAgICAgaWYgKCAhIGNhbGxLZXkgKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93RmluZEVycm9yKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCgnLmNjbC1jLXNlYXJjaCcpLm9mZnNldCgpLnRvcCB9KTtcbiAgICAgICAgXG4gICAgICAgIGNhbGxEYXRhID0gdGhpcy5jYWxsTnVtYmVyc1tjYWxsS2V5XTtcblxuICAgICAgICB0aGlzLiRmbG9vci50ZXh0KCBjYWxsRGF0YS5mbG9vciApO1xuICAgICAgICB0aGlzLiR3aW5nLnRleHQoIGNhbGxEYXRhLndpbmcgKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdC50ZXh0KCBjYWxsRGF0YS5zdWJqZWN0ICk7XG5cbiAgICAgICAgZmxvb3JJZCA9IGNhbGxEYXRhLmZsb29yX2ludDtcbiAgICAgICAgcm9vbUlkID0gY2FsbERhdGEucm9vbV9pbnQ7IC8vIHdpbGwgYmUgaW50ZWdlciBPUiBhcnJheVxuXG4gICAgICAgIC8vIE1ha2UgZmxvb3Ivcm9vbSBhY3RpdmVcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWY9XCIjZmxvb3ItJytmbG9vcklkKydcIl0nKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuXG4gICAgICAgIGlmICggdHlwZW9mIHJvb21JZCAhPT0gJ251bWJlcicgKSB7XG4gICAgICAgICAgICAvLyBpZiByb29tSWQgaXMgYXJyYXlcbiAgICAgICAgICAgIHJvb21JZC5mb3JFYWNoKGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5maW5kKCcjcm9vbS0nK2Zsb29ySWQrJy0nK2lkKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiByb29tSWQgaXMgbnVtYmVyXG4gICAgICAgICAgICB0aGlzLiRlbC5maW5kKCcjcm9vbS0nK2Zsb29ySWQrJy0nK3Jvb21JZCkuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCBjb3JyZXNwb25kaW5nIGFjdGl2ZSBmbG9vciB0YWJcblxuICAgICAgICB0YWJzLnNldEFjdGl2ZSggJyNmbG9vci0nICsgZmxvb3JJZCApO1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUudGhyb3dGaW5kRXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdC50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiRlcnJvckJveC5hcHBlbmQoIHRoaXMuZXJyb3IuZmluZCApO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWpzLXRhYnMnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0YWJzID0gbmV3IFRhYnModGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuY2NsLWpzLXdheWZpbmRlcicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHdheWZpbmRlciA9IG5ldyBXYXlmaW5kZXIodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIl19
