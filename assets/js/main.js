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

            if ( responseObject.booking_id ) {
                responseHTML =  ['<p class="ccl-h2 ccl-u-mt-0">Success!</p>',
                                '<p class="ccl-h4">Your booking ID is <span class="ccl-u-color-school">' + responseObject.booking_id + '</span></p>',
                                '<p class="ccl-h4">Please check your email to confirm your booking.</p>'];
            } else {
                responseHTML =  ['<p class="ccl-h3 ccl-u-mt-0">Sorry, but we couldn\'t process your reservation.</p>','<p class="ccl-h4">Errors:</p>'];
                $(responseObject.errors).each(function(i, error){
                    console.log( error );
                    responseHTML.push('<p class="ccl-c-alert ccl-is-error">' + error + '</p>');
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkYXRhYmFzZS1maWx0ZXJzLmpzIiwiZHJvcGRvd25zLmpzIiwiaGVhZGVyLW1lbnUtdG9nZ2xlcy5qcyIsIm1vZGFscy5qcyIsInBvc3Qtc2VhcmNoLmpzIiwicXVpY2stbmF2LmpzIiwicm9vbS1yZXMuanMiLCJzZWFyY2guanMiLCJzbGlkZS10b2dnbGUtbGlzdC5qcyIsInNtb290aC1zY3JvbGwuanMiLCJzdGlja2llcy5qcyIsInRvZ2dsZS1zY2hvb2xzLmpzIiwidG9vbHRpcHMuanMiLCJ3YXlmaW5kaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNTRCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBHbG9iYWwgVmFyaWFibGVzLiBcbiAqL1xuXG5cbihmdW5jdGlvbiAoICQsIHdpbmRvdyApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuICAgIFxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLkRVUkFUSU9OID0gMzAwO1xuXG4gICAgQ0NMLkJSRUFLUE9JTlRfU00gPSA1MDA7XG4gICAgQ0NMLkJSRUFLUE9JTlRfTUQgPSA3Njg7XG4gICAgQ0NMLkJSRUFLUE9JTlRfTEcgPSAxMDAwO1xuICAgIENDTC5CUkVBS1BPSU5UX1hMID0gMTUwMDtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ2h0bWwnKS50b2dnbGVDbGFzcygnbm8tanMganMnKTtcbiAgICB9KTtcblxufSkoalF1ZXJ5LCB0aGlzKTsiLCIvKipcbiAqIFJlZmxvdyBwYWdlIGVsZW1lbnRzLiBcbiAqIFxuICogRW5hYmxlcyBhbmltYXRpb25zL3RyYW5zaXRpb25zIG9uIGVsZW1lbnRzIGFkZGVkIHRvIHRoZSBwYWdlIGFmdGVyIHRoZSBET00gaGFzIGxvYWRlZC5cbiAqL1xuXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5yZWZsb3cgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgfTtcblxufSkoKTsiLCIvKipcbiAqIEdldCB0aGUgU2Nyb2xsYmFyIHdpZHRoXG4gKiBUaGFua3MgdG8gZGF2aWQgd2Fsc2g6IGh0dHBzOi8vZGF2aWR3YWxzaC5uYW1lL2RldGVjdC1zY3JvbGxiYXItd2lkdGhcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcbiAgICBcbiAgICBmdW5jdGlvbiBnZXRTY3JvbGxXaWR0aCgpIHtcbiAgICAgICAgXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWVhc3VyZW1lbnQgbm9kZVxuICAgICAgICB2YXIgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgXG4gICAgICAgIC8vIHBvc2l0aW9uIHdheSB0aGUgaGVsbCBvZmYgc2NyZWVuXG4gICAgICAgICQoc2Nyb2xsRGl2KS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6ICcxMDBweCcsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDBweCcsXG4gICAgICAgICAgICBvdmVyZmxvdzogJ3Njcm9sbCcsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogJy05OTk5cHgnLFxuICAgICAgICB9KTtcblxuICAgICAgICAkKCdib2R5JykuYXBwZW5kKHNjcm9sbERpdik7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBzY3JvbGxiYXIgd2lkdGhcbiAgICAgICAgdmFyIHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoO1xuICAgICAgICAvLyBjb25zb2xlLndhcm4oc2Nyb2xsYmFyV2lkdGgpOyAvLyBNYWM6ICAxNVxuXG4gICAgICAgIC8vIERlbGV0ZSB0aGUgRElWIFxuICAgICAgICAkKHNjcm9sbERpdikucmVtb3ZlKCk7XG5cbiAgICAgICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoO1xuICAgIH1cbiAgICBcbiAgICBpZiAoICEgd2luZG93LkNDTCApIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5nZXRTY3JvbGxXaWR0aCA9IGdldFNjcm9sbFdpZHRoO1xuICAgIENDTC5TQ1JPTExCQVJXSURUSCA9IGdldFNjcm9sbFdpZHRoKCk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIC5kZWJvdW5jZSgpIGZ1bmN0aW9uXG4gKiBcbiAqIFNvdXJjZTogaHR0cHM6Ly9kYXZpZHdhbHNoLm5hbWUvamF2YXNjcmlwdC1kZWJvdW5jZS1mdW5jdGlvblxuICovXG5cblxuKGZ1bmN0aW9uKHdpbmRvdykge1xuXG4gICAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gICAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gICAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAgIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gICAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4gICAgdmFyIHRocm90dGxlID0gZnVuY3Rpb24gKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHRpbWVvdXQsIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICAgICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICAgICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG5cbiAgICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHRocm90dGxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICAgICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICAgICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICAgICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHRocm90dGxlZC5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICBwcmV2aW91cyA9IDA7XG4gICAgICAgICAgICB0aW1lb3V0ID0gY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB0aHJvdHRsZWQ7XG4gICAgfTtcblxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgd2luZG93LkNDTC50aHJvdHRsZSA9IHRocm90dGxlO1xuXG59KSh0aGlzKTsiLCIvKipcbiAqIEFjY29yZGlvbnNcbiAqIFxuICogQmVoYXZpb3IgZm9yIGFjY29yZGlvbiBjb21wb25lbnRzXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBBY2NvcmRpb24gPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHRvZ2dsZSA9IHRoaXMuJGVsLmNoaWxkcmVuKCcuY2NsLWMtYWNjb3JkaW9uX190b2dnbGUnKTtcbiAgICAgICAgdGhpcy4kY29udGVudCA9IHRoaXMuJGVsLmNoaWxkcmVuKCcuY2NsLWMtYWNjb3JkaW9uX19jb250ZW50Jyk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBBY2NvcmRpb24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHRvZ2dsZS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLiRjb250ZW50LnNsaWRlVG9nZ2xlKCk7XG4gICAgICAgICAgICBfdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ2NjbC1pcy1vcGVuJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5jY2wtYy1hY2NvcmRpb24nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgQWNjb3JkaW9uKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogQWxlcnRzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBhbGVydHNcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgRFVSQVRJT04gPSBDQ0wuRFVSQVRJT047XG5cbiAgICB2YXIgQWxlcnREaXNtaXNzID0gZnVuY3Rpb24oJGVsKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJGVsO1xuICAgICAgICB0aGlzLnRhcmdldCA9ICRlbC5wYXJlbnQoKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgQWxlcnREaXNtaXNzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICBfdGhpcy4kdGFyZ2V0LmFuaW1hdGUoIHsgb3BhY2l0eTogMCB9LCB7XG4gICAgICAgICAgICBkdXJhdGlvbjogRFVSQVRJT04sXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LnNsaWRlVXAoIERVUkFUSU9OLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cblxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJChkb2N1bWVudCkub24oICdjbGljaycsICdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIHZhciBkaXNtaXNzRWwgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nKTtcbiAgICAgICAgICAgIG5ldyBBbGVydERpc21pc3MoZGlzbWlzc0VsKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKHRoaXMsIGpRdWVyeSk7IiwiLyoqXG4gKiBDYXJvdXNlbHNcbiAqIFxuICogSW5pdGlhbGl6ZSBhbmQgZGVmaW5lIGJlaGF2aW9yIGZvciBjYXJvdXNlbHMuIFxuICogVXNlcyB0aGUgU2xpY2sgU2xpZGVzIGpRdWVyeSBwbHVnaW4gLS0+IGh0dHA6Ly9rZW53aGVlbGVyLmdpdGh1Yi5pby9zbGljay9cbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIENhcm91c2VsID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuZ2xvYmFsRGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgIGRvdHNDbGFzczogJ2NjbC1jLWNhcm91c2VsX19wYWdpbmcnLFxuICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfTtcblxuICAgIENhcm91c2VsLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy4kZWwuZGF0YSgpLFxuICAgICAgICAgICAgb3B0aW9ucyA9IGRhdGEub3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIFxuICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUgPSBbXTtcblxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc1NtICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX1NNLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zU21cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zTWQgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfTUQsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNNZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNMZyApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9MRywgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc0xnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc1hsICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX1hMLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zWGxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKCB0aGlzLmdsb2JhbERlZmF1bHRzLCBvcHRpb25zICk7XG5cbiAgICAgICAgdmFyIGNhcm91c2VsID0gdGhpcy4kZWwuc2xpY2sob3B0aW9ucyksXG4gICAgICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgY2Fyb3VzZWwub24oJ2JlZm9yZUNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlLCBuZXh0U2xpZGUpe1xuICAgICAgICAgICAgX3RoaXMuJGVsLmZpbmQoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtcGFzdCcpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLmZpbmQoJy5zbGljay1zbGlkZVtkYXRhLXNsaWNrLWluZGV4PVwiJytuZXh0U2xpZGUrJ1wiXScpLnByZXZBbGwoKS5hZGRDbGFzcygnY2NsLWlzLXBhc3QnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1wcm9tby1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBDYXJvdXNlbCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqXG4gKiBEYXRhYmFzZSBGaWx0ZXJpbmdcbiAqIFxuICogSW5pdGlhbGl6ZXMgYW5kIGRlZmluZXMgdGhlIGJlaGF2aW9yIGZvciBmaWx0ZXJpbmcgdXNpbmcgSlBMaXN0XG4gKiBodHRwczovL2pwbGlzdC5jb20vZG9jdW1lbnRhdGlvblxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgZGF0YWJhc2VGaWx0ZXJzID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCAgICAgICAgICAgICAgICA9ICQoIGVsICk7XG4gICAgICAgIHRoaXMucGFuZWxPcHRpb25zICAgICAgID0gJChlbCkuZmluZCggJy5jY2wtYy1kYXRhYmFzZS1maWx0ZXJfX3BhbmVsJyApO1xuICAgICAgICB0aGlzLm5hbWVUZXh0Ym94ICAgICAgICA9ICQoIGVsICkuZmluZCggJ1tkYXRhLWNvbnRyb2wtdHlwZT1cInRleHRib3hcIl0nICk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2VfZGlzcGxheWVkID0gJCggdGhpcy5wYW5lbE9wdGlvbnMgKS5maW5kKCcuY2NsLWMtZGF0YWJhc2VfX2Rpc3BsYXllZCcpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlX2F2YWlsICAgICA9ICQoIHRoaXMucGFuZWxPcHRpb25zICkuZmluZCgnLmNjbC1jLWRhdGFiYXNlX19hdmFpbCcpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlQ29udGFpbmVyICA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1kYXRhYmFzZS1maWx0ZXJfX2NvbnRhaW5lcicpO1xuICAgICAgICB0aGlzLmRhdGFiYXNlX2NvdW50ICAgICA9ICQoZWwpLmZpbmQoICcuY2NsLWMtZGF0YWJhc2UtZmlsdGVyX19jb3VudCcgKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZVJlc2V0ICAgICAgPSAkKGVsKS5maW5kKCAnLmNjbC1jLWRhdGFiYXNlLWZpbHRlci0tcmVzZXQnICk7XG4gICAgICAgIHRoaXMucnVuVGltZXMgICAgICAgICAgID0gMDtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBkYXRhYmFzZUZpbHRlcnMucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLiRlbC5qcGxpc3Qoe1xuICAgICAgICAgICAgaXRlbXNCb3ggICAgICAgIDogJy5jY2wtYy1kYXRhYmFzZS1maWx0ZXJfX2NvbnRhaW5lcicsIFxuICAgICAgICAgICAgaXRlbVBhdGggICAgICAgIDogJy5jY2wtYy1kYXRhYmFzZScsIFxuICAgICAgICAgICAgcGFuZWxQYXRoICAgICAgIDogJy5jY2wtYy1kYXRhYmFzZS1maWx0ZXJfX3BhbmVsJyxcbiAgICAgICAgICAgIGVmZmVjdCAgICAgICAgICA6ICdmYWRlJyxcbiAgICAgICAgICAgIGR1cmF0aW9uICAgICAgICA6IDMwMCxcbiAgICAgICAgICAgIHJlZHJhd0NhbGxiYWNrICA6IGZ1bmN0aW9uKCBjb2xsZWN0aW9uLCAkZGF0YXZpZXcsIHN0YXR1c2VzICl7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9jaGVjayBmb3IgaW5pdGlhbCBsb2FkXG4gICAgICAgICAgICAgICAgaWYoIF90aGlzLnJ1blRpbWVzID09PSAwICl7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJ1blRpbWVzKys7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjsgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL2dldCB0aGUgdmFsdWVzIG9mIHRoZSB1cGRhdGVkIHJlc3VsdHMsIGFuZCB0aGUgdG90YWwgbnVtYmVyIG9mIGRhdGFiYXNlcyB3ZSBzdGFydGVkIHdpdGhcbiAgICAgICAgICAgICAgICB2YXIgdXBkYXRlZERhdGFiYXNlcyA9ICRkYXRhdmlldy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIGRlZmF1bHREYXRhYmFzZXMgPSAgcGFyc2VJbnQoIF90aGlzLmRhdGFiYXNlX2F2YWlsLnRleHQoKSwgMTAgKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9vbiBvY2Nhc2lvbiwgdGhlIHBsdWdpbiBnaXZlcyB1cyB0aGUgd3JvbmcgbnVtYmVyIG9mIGRhdGFiYXNlcywgdGhpcyB3aWxsIHByZXZlbnQgdGhpcyBmcm9tIGhhcHBlbmluZ1xuICAgICAgICAgICAgICAgIGlmKCB1cGRhdGVkRGF0YWJhc2VzID4gZGVmYXVsdERhdGFiYXNlcyAgKXtcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlZERhdGFiYXNlcyA9IGRlZmF1bHREYXRhYmFzZXM7XG4gICAgICAgICAgICAgICAgICAgIC8vaGFyZFJlc2V0KCk7XG4gICAgICAgICAgICAgICAgICAgIC8vX3RoaXMuZGF0YWJhc2VSZXNldC5zaG93KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vdXBkYXRlIHRoZSBudW1iZXIgb2Ygc2hvd24gZGF0YWJhc2VzXG4gICAgICAgICAgICAgICAgX3RoaXMuZGF0YWJhc2VfZGlzcGxheWVkLnRleHQoIHVwZGF0ZWREYXRhYmFzZXMgKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL3Zpc3VhbCBmZWVkYmFjayBmb3IgdXBkYXRpbmcgZGF0YWJhc2VzXG4gICAgICAgICAgICAgICAgX3RoaXMucHVsc2VUd2ljZSggX3RoaXMuZGF0YWJhc2VfY291bnQgKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5wdWxzZVR3aWNlKCBfdGhpcy5kYXRhYmFzZUNvbnRhaW5lciApO1xuXG4gICAgICAgICAgICAgICAvL2lmIGZpbHRlcnMgYXJlIHVzZWQsIHRoZSBzaG93IHRoZSByZXNldCBvcHRpb25zXG4gICAgICAgICAgICAgICAgaWYoIHVwZGF0ZWREYXRhYmFzZXMgIT0gZGVmYXVsdERhdGFiYXNlcyApe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5kYXRhYmFzZVJlc2V0LnNob3coKTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGF0YWJhc2VSZXNldC5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgXG4gICAgICAgIF90aGlzLmRhdGFiYXNlUmVzZXQub24oJ2NsaWNrJywgaGFyZFJlc2V0ICk7XG4gICAgICAgIC8vdGhlIHJlc2V0IGZ1bmN0aW9uIGlzIG5vdCB3b3JraW5nXG4gICAgICAgIC8vdGhpcyBpcyBhIGJpdCBvZiBhIGhhY2ssIGJ1dCB3ZSBhcmUgdXNpbmcgdHJpZ2dlcnMgaGVyZSB0byBkbyBhIGhhcmQgcmVzZXRcbiAgICAgICAgZnVuY3Rpb24gaGFyZFJlc2V0KCl7XG4gICAgICAgICAgICAkKCcuY2NsLWMtZGF0YWJhc2UtZmlsdGVyX19wYW5lbCcpLmZpbmQoJ2lucHV0OmNoZWNrZWQnKS50cmlnZ2VyKCdjbGljaycpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coICQoJy5jY2wtYy1kYXRhYmFzZS1maWx0ZXJfX3BhbmVsJykuZmluZCgnaW5wdXQ6Y2hlY2tlZCcpICk7XG4gICAgICAgICAgICAkKCBfdGhpcy5uYW1lVGV4dGJveCApLnZhbCgnJykudHJpZ2dlcigna2V5dXAnKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgZGF0YWJhc2VGaWx0ZXJzLnByb3RvdHlwZS5wdWxzZVR3aWNlID0gZnVuY3Rpb24oIGVsICl7XG4gICAgICAgIGVsLmFkZENsYXNzKCdjY2wtYy1kYXRhYmFzZS1maWx0ZXItLW9uLWNoYW5nZScpO1xuICAgICAgICBlbC5vbiggXCJ3ZWJraXRBbmltYXRpb25FbmQgb2FuaW1hdGlvbmVuZCBtc0FuaW1hdGlvbkVuZCBhbmltYXRpb25lbmRcIiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICQoZWwpLnJlbW92ZUNsYXNzKCdjY2wtYy1kYXRhYmFzZS1maWx0ZXItLW9uLWNoYW5nZScpO1xuICAgICAgICB9ICk7XG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICAkKCcuY2NsLWRhdGFiYXNlLWZpbHRlcicpLmVhY2goIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgZGF0YWJhc2VGaWx0ZXJzKCB0aGlzICk7ICAgICAgICAgICBcbiAgICAgICAgfSApO1xuXG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIERyb3Bkb3duc1xuICogXG4gKiBJbml0aWFsaXplIGFuZCBjb250cm9sIGJlaGF2aW9yIGZvciBkcm9wZG93biBtZW51c1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICBUT0dHTEU6ICdbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXScsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZSA9IHtcbiAgICAgICAgICAgIEFDVElWRTogJ2NjbC1pcy1hY3RpdmUnLFxuICAgICAgICAgICAgQ09OVEVOVDogJ2NjbC1jLWRyb3Bkb3duX19jb250ZW50J1xuICAgICAgICB9O1xuXG4gICAgdmFyIERyb3Bkb3duVG9nZ2xlID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiR0b2dnbGUgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kcGFyZW50ID0gdGhpcy4kdG9nZ2xlLnBhcmVudCgpO1xuICAgICAgICBcbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuJHRvZ2dsZS5kYXRhKCd0YXJnZXQnKTtcblxuICAgICAgICB0aGlzLiRjb250ZW50ID0gJCggdGFyZ2V0ICk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kdG9nZ2xlLmNsaWNrKCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBfdGhpcy50b2dnbGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIHZhciBoYXNBY3RpdmVNZW51cyA9ICQoICcuJyArIGNsYXNzTmFtZS5DT05URU5UICsgJy4nICsgY2xhc3NOYW1lLkFDVElWRSApLmxlbmd0aDtcbiAgICAgICAgICAgIGlmICggaGFzQWN0aXZlTWVudXMgKXtcbiAgICAgICAgICAgICAgICBfY2xlYXJNZW51cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgaXNBY3RpdmUgPSB0aGlzLiR0b2dnbGUuaGFzQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcblxuICAgICAgICBpZiAoIGlzQWN0aXZlICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93Q29udGVudCgpO1xuXG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5zaG93Q29udGVudCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgdGhpcy4kY29udGVudC5hZGRDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICB0aGlzLiRwYXJlbnQuYWRkQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLmhpZGVNZW51ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgdGhpcy4kY29udGVudC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICB0aGlzLiRwYXJlbnQucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX2NsZWFyTWVudXMoKSB7XG4gICAgICAgICQoJy5jY2wtYy1kcm9wZG93biwgLmNjbC1jLWRyb3Bkb3duX19jb250ZW50JykucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgJCggc2VsZWN0b3IuVE9HR0xFICkuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoIHNlbGVjdG9yLlRPR0dMRSApLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBEcm9wZG93blRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIEhlYWRlciBNZW51IFRvZ2dsZXNcbiAqIFxuICogQ29udHJvbHMgYmVoYXZpb3Igb2YgbWVudSB0b2dnbGVzIGluIHRoZSBoZWFkZXJcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIEhlYWRlck1lbnVUb2dnbGUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLnRhcmdldCA9IHRoaXMuJGVsLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgdGhpcy4kcGFyZW50TWVudSA9IHRoaXMuJGVsLmNsb3Nlc3QoJy5jY2wtYy1tZW51Jyk7XG4gICAgICAgIHRoaXMuJGNsb3NlSWNvbiA9ICQoJzxzcGFuIGNsYXNzPVwiY2NsLWItaWNvbiBjbG9zZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4nKTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgSGVhZGVyTWVudVRvZ2dsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAvLyBpZiB0aGUgdGFyZ2V0IGlzIGFscmVhZHkgb3BlblxuICAgICAgICAgICAgaWYgKCB0aGF0LiR0YXJnZXQuaGFzQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKSApIHtcblxuICAgICAgICAgICAgICAgIC8vIGNsb3NlIHRhcmdldCBhbmQgcmVtb3ZlIGFjdGl2ZSBjbGFzc2VzL2VsZW1lbnRzXG4gICAgICAgICAgICAgICAgdGhhdC4kcGFyZW50TWVudS5yZW1vdmVDbGFzcygnY2NsLWhhcy1hY3RpdmUtaXRlbScpO1xuICAgICAgICAgICAgICAgIHRoYXQuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgdGhhdC4kdGFyZ2V0LnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJykuZmFkZU91dChDQ0wuRFVSQVRJT04pO1xuICAgICAgICAgICAgICAgIHRoYXQuJGNsb3NlSWNvbi5yZW1vdmUoKTsgICAgICAgXG5cbiAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgIC8vIHRhcmdldCBpcyBub3Qgb3BlblxuICAgICAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgICAgICAvLyBjbG9zZSBhbmQgcmVzZXQgYWxsIGFjdGl2ZSBtZW51c1xuICAgICAgICAgICAgICAgICQoJy5jY2wtYy1tZW51LmNjbC1oYXMtYWN0aXZlLWl0ZW0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLWhhcy1hY3RpdmUtaXRlbScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmluZCgnYS5jY2wtaXMtYWN0aXZlJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJy5jY2wtYi1pY29uLmNsb3NlJykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gY2xvc2UgYW5kIHJlc2V0IGFsbCBhY3RpdmUgc3ViLW1lbnUgY29udGFpbmVyc1xuICAgICAgICAgICAgICAgICQoJy5jY2wtYy1zdWItbWVudS1jb250YWluZXIuY2NsLWlzLWFjdGl2ZScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpLmZhZGVPdXQoQ0NMLkRVUkFUSU9OKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIGFjdGl2YXRlIHRoZSBzZWxlY3RlZCB0YXJnZXRcbiAgICAgICAgICAgICAgICB0aGF0LiRwYXJlbnRNZW51LmFkZENsYXNzKCdjY2wtaGFzLWFjdGl2ZS1pdGVtJyk7XG4gICAgICAgICAgICAgICAgdGhhdC4kdGFyZ2V0LmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJykuZmFkZUluKENDTC5EVVJBVElPTik7XG4gICAgICAgICAgICAgICAgLy8gcHJlcGVuZCBjbG9zZSBpY29uXG4gICAgICAgICAgICAgICAgdGhhdC4kY2xvc2VJY29uLnByZXBlbmRUbyh0aGF0LiRlbCk7XG4gICAgICAgICAgICAgICAgQ0NMLnJlZmxvdyh0aGF0LiRjbG9zZUljb25bMF0pO1xuICAgICAgICAgICAgICAgIHRoYXQuJGNsb3NlSWNvbi5mYWRlSW4oMjAwKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmpzLXRvZ2dsZS1oZWFkZXItbWVudScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBIZWFkZXJNZW51VG9nZ2xlKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogTW9kYWxzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBtb2RhbHMuIEJhc2VkIG9uIEJvb3RzdHJhcCdzIG1vZGFsczogaHR0cHM6Ly9nZXRib290c3RyYXAuY29tL2RvY3MvNC4wL2NvbXBvbmVudHMvbW9kYWwvXG4gKiBcbiAqIEdsb2JhbHM6XG4gKiBTQ1JPTExCQVJXSURUSFxuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBEVVJBVElPTiA9IDMwMDtcblxuICAgIHZhciBNb2RhbFRvZ2dsZSA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgXG4gICAgICAgIHZhciAkZWwgPSAkKGVsKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMudGFyZ2V0ID0gJGVsLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICB0aGlzLiR0YXJnZXQgPSAkKHRoaXMudGFyZ2V0KTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpczsgXG5cbiAgICAgICAgX3RoaXMuJGVsLm9uKCAnY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgaWYgKCAkKGRvY3VtZW50LmJvZHkpLmhhc0NsYXNzKCdjY2wtbW9kYWwtb3BlbicpICkge1xuICAgICAgICAgICAgICAgIF90aGlzLmNsb3NlTW9kYWwoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2hvd0JhY2tkcm9wKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnNob3dNb2RhbCgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBNb2RhbFRvZ2dsZS5wcm90b3R5cGUuc2hvd0JhY2tkcm9wID0gZnVuY3Rpb24oY2FsbGJhY2spe1xuXG4gICAgICAgIHZhciBiYWNrZHJvcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICB2YXIgJGJhY2tkcm9wID0gJChiYWNrZHJvcCk7XG5cbiAgICAgICAgJGJhY2tkcm9wLmFkZENsYXNzKCdjY2wtYy1tb2RhbF9fYmFja2Ryb3AnKTtcbiAgICAgICAgJGJhY2tkcm9wLmFwcGVuZFRvKGRvY3VtZW50LmJvZHkpO1xuICAgICAgICBcbiAgICAgICAgQ0NMLnJlZmxvdyhiYWNrZHJvcCk7XG4gICAgICAgIFxuICAgICAgICAkYmFja2Ryb3AuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgICQoZG9jdW1lbnQuYm9keSlcbiAgICAgICAgICAgIC5hZGRDbGFzcygnY2NsLW1vZGFsLW9wZW4nKVxuICAgICAgICAgICAgLmNzcyggJ3BhZGRpbmctcmlnaHQnLCBDQ0wuU0NST0xMQkFSV0lEVEggKTtcblxuICAgICAgICBpZiAoIGNhbGxiYWNrICkge1xuICAgICAgICAgICAgc2V0VGltZW91dCggY2FsbGJhY2ssIERVUkFUSU9OICk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLnNob3dNb2RhbCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIF90aGlzLiR0YXJnZXQuc2hvdyggMCwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIF90aGlzLiR0YXJnZXQuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLmNsb3NlTW9kYWwgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgICQoJy5jY2wtYy1tb2RhbCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICBzZXRUaW1lb3V0KCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWwnKS5oaWRlKCk7XG5cbiAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbF9fYmFja2Ryb3AnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgICAgICQoJy5jY2wtYy1tb2RhbF9fYmFja2Ryb3AnKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICQoZG9jdW1lbnQuYm9keSlcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtbW9kYWwtb3BlbicpXG4gICAgICAgICAgICAgICAgICAgIC5jc3MoICdwYWRkaW5nLXJpZ2h0JywgJycgKTtcblxuICAgICAgICAgICAgfSwgRFVSQVRJT04pO1xuXG4gICAgICAgIH0sIERVUkFUSU9OICk7IFxuXG4gICAgfTtcblxuXG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJtb2RhbFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBNb2RhbFRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKHRoaXMsIGpRdWVyeSk7IiwiLyoqXG4gKlxuICogUG9zdCBUeXBlIEtleXdvcmQgc2VhcmNoXG4gKiBcbiAqIE9uIHVzZXIgaW5wdXQsIGZpcmUgcmVxdWVzdCB0byBzZWFyY2ggdGhlIGRhdGFiYXNlIGN1c3RvbSBwb3N0IHR5cGUgYW5kIHJldHVybiByZXN1bHRzIHRvIHJlc3VsdHMgcGFuZWxcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuXHRcdEVOVEVSID0gMTMsIFRBQiA9IDksIFNISUZUID0gMTYsIENUUkwgPSAxNywgQUxUID0gMTgsIENBUFMgPSAyMCwgRVNDID0gMjcsIExDTUQgPSA5MSwgUkNNRCA9IDkyLCBMQVJSID0gMzcsIFVBUlIgPSAzOCwgUkFSUiA9IDM5LCBEQVJSID0gNDAsXG5cdFx0Zm9yYmlkZGVuS2V5cyA9IFtFTlRFUiwgVEFCLCBTSElGVCwgQ1RSTCwgQUxULCBDQVBTLCBFU0MsIExDTUQsIFJDTUQsIExBUlIsIFVBUlIsIFJBUlIsIERBUlJdO1xuXG4gICAgdmFyIHBvc3RTZWFyY2ggPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsICAgICAgICAgICAgPSAkKCBlbCApO1xuICAgICAgICB0aGlzLiRmb3JtXHRcdFx0PSB0aGlzLiRlbC5maW5kKCAnLmNjbC1jLXBvc3Qtc2VhcmNoX19mb3JtJyApO1xuICAgICAgICB0aGlzLiRwb3N0VHlwZSAgICAgID0gdGhpcy4kZWwuYXR0cignZGF0YS1zZWFyY2gtdHlwZScpO1xuICAgICAgICB0aGlzLiRpbnB1dCAgICAgICAgID0gdGhpcy4kZWwuZmluZCgnI2NjbC1jLXBvc3Qtc2VhcmNoX19pbnB1dCcpO1xuICAgICAgICB0aGlzLiRyZXN1bHRzTGlzdCAgID0gdGhpcy4kZWwuZmluZCggJy5jY2wtYy1wb3N0LXNlYXJjaF9fcmVzdWx0cycgKTtcbiAgICAgICAgdGhpcy4kaW5wdXRUZXh0Ym94XHQ9IHRoaXMuJGVsLmZpbmQoICcuY2NsLWMtcG9zdC1zZWFyY2hfX3RleHRib3gnICk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgcG9zdFNlYXJjaC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgLy9BSkFYIGV2ZW50IHdhdGNoaW5nIGZvciB1c2VyIGlucHV0IGFuZCBvdXRwdXR0aW5nIHN1Z2dlc3RlZCByZXN1bHRzXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXMsXG4gICAgICAgIHRpbWVvdXQsXG4gICAgICAgIHF1ZXJ5O1xuICAgICAgICBcblxuXHRcdC8va2V5Ym9hcmQgZXZlbnRzIGZvciBzZW5kaW5nIHF1ZXJ5IHRvIGRhdGFiYXNlXG5cdFx0dGhpcy4kaW5wdXRcblx0XHRcdC5vbigna2V5dXAga2V5cHJlc3MnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblx0XHRcdCAgICBcblx0XHRcdCAgICBldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcblx0XHRcdCAgICBcblx0XHRcdFx0Ly8gY2xlYXIgYW55IHByZXZpb3VzIHNldCB0aW1lb3V0XG5cdFx0XHRcdGNsZWFyVGltZW91dCh0aW1lb3V0KTtcblxuXHRcdFx0XHQvLyBpZiBrZXkgaXMgZm9yYmlkZGVuLCByZXR1cm5cblx0XHRcdFx0aWYgKCBmb3JiaWRkZW5LZXlzLmluZGV4T2YoIGV2ZW50LmtleUNvZGUgKSA+IC0xICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGdldCB2YWx1ZSBvZiBzZWFyY2ggaW5wdXRcblx0XHRcdFx0X3RoaXMucXVlcnkgPSBfdGhpcy4kaW5wdXQudmFsKCk7XG5cdFx0XHRcdC8vcmVtb3ZlIGRvdWJsZSBxdW90YXRpb25zIGFuZCBvdGhlciBjaGFyYWN0ZXJzIGZyb20gc3RyaW5nXG5cdFx0XHRcdF90aGlzLnF1ZXJ5ID0gX3RoaXMucXVlcnkucmVwbGFjZSgvW15hLXpBLVowLTkgLScuLF0vZywgXCJcIik7XG5cblx0XHRcdFx0Ly8gc2V0IGEgdGltZW91dCBmdW5jdGlvbiB0byB1cGRhdGUgcmVzdWx0cyBvbmNlIDYwMG1zIHBhc3Nlc1xuXHRcdFx0XHR0aW1lb3V0ID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cblx0XHRcdFx0XHRpZiAoIF90aGlzLnF1ZXJ5Lmxlbmd0aCA+IDIgKSB7XG5cblx0XHRcdFx0XHQgXHRfdGhpcy5mZXRjaFBvc3RSZXN1bHRzKCBfdGhpcy5xdWVyeSApO1xuXHRcdFx0XHRcdCBcdFxuXHRcdFx0XHRcdCBcdFxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHQgICAgX3RoaXMuJHJlc3VsdHNMaXN0LmhpZGUoKTtcblx0XHRcdFx0XHRcdC8vX3RoaXMuJHJlc3VsdHNMaXN0Lmh0bWwoJycpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9LCAyMDApO1xuXG5cdFx0XHR9KVxuXHRcdFx0LmZvY3VzKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmICggX3RoaXMuJGlucHV0LnZhbCgpICE9PSAnJyApIHtcblx0XHRcdFx0XHRfdGhpcy4kcmVzdWx0c0xpc3Quc2hvdygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0fSlcblx0XHRcdC5ibHVyKGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0Ly9jb25zb2xlLmxvZygnIGlucHV0IGJsdXJyZWQnKTtcblx0XHRcdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgX29uQmx1cnJlZENsaWNrKTtcblxuXHRcdFx0fSk7XG5cdFx0XG5cdFx0ZnVuY3Rpb24gX29uQmx1cnJlZENsaWNrKGV2ZW50KSB7XG5cdFx0XHRcblx0XHRcdGlmICggISAkLmNvbnRhaW5zKCBfdGhpcy4kZWxbMF0sIGV2ZW50LnRhcmdldCApICkge1xuXHRcdFx0XHRfdGhpcy4kcmVzdWx0c0xpc3QuaGlkZSgpO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQkKGRvY3VtZW50KS5vZmYoJ2NsaWNrJywgX29uQmx1cnJlZENsaWNrKTtcblxuXHRcdH1cblx0XHRcblx0XHR0aGlzLiRmb3JtLm9uKCdzdWJtaXQnLCBmdW5jdGlvbiggZXZlbnQgKXtcblx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cblx0XHRcdC8vIGdldCB2YWx1ZSBvZiBzZWFyY2ggaW5wdXRcblx0XHRcdC8vIF90aGlzLnF1ZXJ5ID0gX3RoaXMuJGlucHV0LnZhbCgpO1xuXHRcdFx0Ly8gLy9yZW1vdmUgZG91YmxlIHF1b3RhdGlvbnMgYW5kIG90aGVyIGNoYXJhY3RlcnMgZnJvbSBzdHJpbmdcblx0XHRcdC8vIF90aGlzLnF1ZXJ5ID0gX3RoaXMucXVlcnkucmVwbGFjZSgvW15hLXpBLVowLTkgLScuLF0vZywgXCJcIik7XG5cdFx0XHRjb25zb2xlLmxvZyhfdGhpcy5xdWVyeSk7XHRcblx0XHRcdFxuXHRcdFx0XG5cdFx0XHRpZiAoIF90aGlzLnF1ZXJ5Lmxlbmd0aCA+IDIgKSB7XG5cblx0XHRcdCBcdF90aGlzLmZldGNoUG9zdFJlc3VsdHMoIF90aGlzLnF1ZXJ5ICk7XG5cdFx0XHQgXHRcblx0XHRcdCBcdFxuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHQgICAgX3RoaXMuJHJlc3VsdHNMaXN0LmhpZGUoKTtcblx0XHRcdFx0Ly9fdGhpcy4kcmVzdWx0c0xpc3QuaHRtbCgnJyk7XG5cdFx0XHR9XHRcdFx0XG5cdFx0XHRcblx0XHR9KTtcbiAgICB9O1xuICAgIFxuICAgIHBvc3RTZWFyY2gucHJvdG90eXBlLmZldGNoUG9zdFJlc3VsdHMgPSBmdW5jdGlvbiggcXVlcnkgKXtcblx0XHQvL3NlbmQgQUpBWCByZXF1ZXN0IHRvIFBIUCBmaWxlIGluIFdQXG5cdFx0dmFyIF90aGlzID0gdGhpcyxcblx0XHRcdGRhdGEgPSB7XG5cdFx0XHRcdGFjdGlvbiAgICAgIDogJ3JldHJpZXZlX3Bvc3Rfc2VhcmNoX3Jlc3VsdHMnLCAvLyB0aGlzIHNob3VsZCBwcm9iYWJseSBiZSBhYmxlIHRvIGRvIHBlb3BsZSAmIGFzc2V0cyB0b28gKG1heWJlIERCcylcblx0XHRcdFx0cXVlcnkgICAgICAgOiBxdWVyeSxcblx0XHRcdFx0cG9zdFR5cGUgICAgOiBfdGhpcy4kcG9zdFR5cGVcblx0XHRcdH07XG5cblx0XHRfdGhpcy4kaW5wdXRUZXh0Ym94LmFkZENsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuXHRcdFxuXHRcdC8vY29uc29sZS5sb2coIF90aGlzICk7XG5cblx0XHQkLnBvc3QoQ0NMLmFqYXhfdXJsLCBkYXRhKVxuXHRcdFx0LmRvbmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG5cdFx0XHQgICAgXG5cdFx0XHRcdC8vZnVuY3Rpb24gZm9yIHByb2Nlc3NpbmcgcmVzdWx0c1xuXHRcdFx0XHRfdGhpcy5wcm9jZXNzUG9zdFJlc3VsdHMocmVzcG9uc2UpO1xuXHRcdFx0XHRcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyggJ3Jlc3BvbnNlJywgcmVzcG9uc2UgKTtcblxuXHRcdFx0fSlcblx0XHRcdC5hbHdheXMoZnVuY3Rpb24oKXtcblxuXHRcdFx0XHRfdGhpcy4kaW5wdXRUZXh0Ym94LnJlbW92ZUNsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuXG5cdFx0XHR9KTsgICAgICAgIFxuICAgIH07XG4gICAgXG4gICAgcG9zdFNlYXJjaC5wcm90b3R5cGUucHJvY2Vzc1Bvc3RSZXN1bHRzID0gZnVuY3Rpb24oIHJlc3BvbnNlICl7XG4gICAgICAgIHZhciBfdGhpcyAgICAgICA9IHRoaXMsXG5cdFx0ICAgIHJlc3VsdHMgICAgID0gJC5wYXJzZUpTT04ocmVzcG9uc2UpLFxuXHRcdCAgICByZXN1bHRDb3VudFx0PSByZXN1bHRzLmNvdW50LFxuXHRcdCAgICByZXN1bHRJdGVtcyA9ICQoJzx1bCAvPicpLmFkZENsYXNzKCdjY2wtYy1wb3N0LXNlYXJjaF9fcmVzdWx0cy11bCcpLFxuICAgICAgICAgICAgcmVzdWx0c0Nsb3NlID0gJCgnPGxpIC8+JylcbiAgICAgICAgICAgIFx0LmFkZENsYXNzKCdjY2wtYy1zZWFyY2gtLWNsb3NlLXJlc3VsdHMnKVxuICAgICAgICAgICAgXHQuYXBwZW5kKCAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ2NjbC1jLXBvc3Qtc2VhcmNoX19jb3VudCBjY2wtdS13ZWlnaHQtYm9sZCBjY2wtdS1mYWRlZCcpICBcbiAgICAgICAgXHRcdFx0XHRcdC5hcHBlbmQoICQoJzxpIC8+JykuYWRkQ2xhc3MoJ2NjbC1iLWljb24gYXJyb3ctZG93bicpIClcbiAgICBcdFx0XHRcdFx0XHQuYXBwZW5kKCAkKCc8c3BhbiAvPicpLmh0bWwoICcmbmJzcDsmbmJzcCcgKyByZXN1bHRDb3VudCArICcgZm91bmQnKSApXG4gICAgICAgICAgICBcdFx0KVxuICAgICAgICAgICAgXHQuYXBwZW5kKCAkKCc8YnV0dG9uIC8+JykuYWRkQ2xhc3MoJ2NjbC1iLWNsb3NlIGNjbC1jLXNlYXJjaC0tY2xvc2VfX2J1dHRvbicpLmF0dHIoJ2FyaWFsLWxhYmVsJywgJ0Nsb3NlJylcblx0ICAgICAgICAgICAgXHRcdFx0LmFwcGVuZCggJCgnPGkgLz4nKS5hdHRyKCdhcmlhLWhpZGRlbicsIHRydWUgKS5hZGRDbGFzcygnY2NsLWItaWNvbiBjbG9zZSBjY2wtdS13ZWlnaHQtYm9sZCBjY2wtdS1mb250LXNpemUtc20nKSApXG4gICAgICAgICAgICBcdFx0KTtcblxuXG5cdFx0ICAgIFxuXHRcdCAgICBpZiggcmVzdWx0cy5wb3N0cy5sZW5ndGggPT09IDAgKXtcblx0XHQgICAgXHR0aGlzLiRyZXN1bHRzTGlzdC5odG1sKCcnKTtcdFx0ICAgIFx0XG5cdFx0ICAgICAgICB0aGlzLiRyZXN1bHRzTGlzdC5zaG93KCkuYXBwZW5kKCAkKCc8ZGl2IC8+JykuYWRkQ2xhc3MoJ2NjbC11LXB5LW51ZGdlIGNjbC11LXdlaWdodC1ib2xkIGNjbC11LWZhZGVkJykuaHRtbCgnU29ycnksIG5vIGRhdGFiYXNlcyBmb3VuZCAtIHRyeSBhbm90aGVyIHNlYXJjaCcpICk7XG5cblx0XHQgICAgICAgIHJldHVybjtcblx0XHQgICAgfVxuXHRcdCAgIFxuXHRcdCAgICB0aGlzLiRyZXN1bHRzTGlzdC5odG1sKCcnKTtcblx0XHQgICAgXG5cdFx0ICAgIHJlc3VsdEl0ZW1zLmFwcGVuZCggcmVzdWx0c0Nsb3NlICk7XG5cdFx0ICAgIFxuXHRcdCAgICAkLmVhY2goIHJlc3VsdHMucG9zdHMsIGZ1bmN0aW9uKCBrZXksIHZhbCApe1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgcmVuZGVySXRlbSA9ICQoJzxsaSAvPicpXG4gICAgICAgICAgICAgICAgXHQuYXBwZW5kKFxuICAgICAgICAgICAgICAgIFx0XHQkKCc8YSAvPicpXG4gICAgICAgICAgICAgICAgXHRcdFx0LmF0dHIoe1xuXHRcdFx0ICAgICAgICAgICAgICAgICAgICdocmVmJyAgIDogdmFsLnBvc3RfbGluayxcblx0XHRcdCAgICAgICAgICAgICAgICAgICAndGFyZ2V0JyA6ICdfYmxhbmsnLCAgICAgICAgICAgICAgIFx0XHRcdFx0XG4gICAgICAgICAgICAgICAgXHRcdFx0fSlcbiAgICAgICAgICAgICAgICBcdFx0XHQuYWRkQ2xhc3MoJ2NjbC1jLWRhdGFiYXNlLXNlYXJjaF9fcmVzdWx0LWl0ZW0nKVxuICAgICAgICAgICAgICAgIFx0XHRcdC5odG1sKCB2YWwucG9zdF90aXRsZSArICh2YWwucG9zdF9hbHRfbmFtZSA/ICc8ZGl2IGNsYXNzPVwiY2NsLXUtd2VpZ2h0LW5vcm1hbCBjY2wtdS1tbC1udWRnZSBjY2wtdS1mb250LXNpemUtc21cIj4oJyArIHZhbC5wb3N0X2FsdF9uYW1lICsgJyk8L2Rpdj4nIDogJycgKSApXG4gICAgICAgICAgICAgICAgXHRcdFx0LmFwcGVuZCggJCgnPHNwYW4gLz4nKVxuXHQgICAgICAgICAgICAgICAgXHRcdFx0XHRcdC5odG1sKCAnQWNjZXNzJm5ic3A7Jm5ic3A7JyApXG5cdCAgICAgICAgICAgICAgICBcdFx0XHRcdFx0LmFwcGVuZCggJCgnPGkgLz4nKVxuXHQgICAgICAgICAgICAgICAgXHRcdFx0XHRcdFx0XHRcdC5hZGRDbGFzcygnY2NsLWItaWNvbiBhcnJvdy1yaWdodCcpXG5cdCAgICAgICAgICAgICAgICBcdFx0XHRcdFx0XHRcdFx0LmF0dHIoe1xuXHQgICAgICAgICAgICAgICAgXHRcdFx0XHRcdFx0XHRcdCdhcmlhLWhpZGRlbidcdDogdHJ1ZSxcblx0ICAgICAgICAgICAgICAgIFx0XHRcdFx0XHRcdFx0XHQnc3R5bGUnXHRcdFx0OiBcInZlcnRpY2FsLWFsaWduOm1pZGRsZVwiXG5cdCAgICAgICAgICAgICAgICBcdFx0XHRcdFx0XHRcdFx0fSlcblx0ICAgICAgICAgICAgICAgIFx0XHRcdFx0XHRcdCkgXG4gICAgICAgICAgICAgICAgXHRcdFx0XHQpXG4gICAgICAgICAgICAgICAgXHRcdCk7XG5cdFx0ICAgIFxuXHRcdCAgICAgICAgcmVzdWx0SXRlbXMuYXBwZW5kKCByZW5kZXJJdGVtICk7XG5cdFx0ICAgICAgICBcblx0XHQgICAgfSApO1xuXHRcdCAgICBcblx0XHQgICAgdGhpcy4kcmVzdWx0c0xpc3QuYXBwZW5kKCByZXN1bHRJdGVtcyApLnNob3coKTtcblx0XHQgICAgXG5cdFx0XHQvL2NhY2hlIHRoZSByZXNwb25zZSBidXR0b24gYWZ0ZXIgaXRzIGFkZGVkIHRvIHRoZSBET01cblx0XHRcdF90aGlzLiRyZXNwb25zZUNsb3NlXHQ9IF90aGlzLiRlbC5maW5kKCcuY2NsLWMtc2VhcmNoLS1jbG9zZV9fYnV0dG9uJyk7XHRcdFxuXHRcdFx0XG5cdFx0XHQvL2NsaWNrIGV2ZW50IHRvIGNsb3NlIHRoZSByZXN1bHRzIHBhZ2Vcblx0XHRcdF90aGlzLiRyZXNwb25zZUNsb3NlLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdFx0Ly9oaWRlXG5cdFx0XHRcdFx0aWYoICQoIF90aGlzLiRyZXN1bHRzTGlzdCApLmlzKCc6dmlzaWJsZScpICl7XG5cdFx0XHRcdFx0XHRfdGhpcy4kcmVzdWx0c0xpc3QuaGlkZSgpO1x0XHRcdFx0XHRcblx0XHRcdFx0XHR9XG5cdFx0XHR9KTtcdFx0ICAgIFxuXHRcdCAgICBcblx0XHQgICAgXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICAkKCcuY2NsLWMtcG9zdC1zZWFyY2gnKS5lYWNoKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IHBvc3RTZWFyY2godGhpcyk7ICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTsiLCIvKipcbiAqIFF1aWNrIE5hdlxuICogXG4gKiBCZWhhdmlvciBmb3IgdGhlIHF1aWNrIG5hdlxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciAkd2luZG93ID0gJCh3aW5kb3cpLFxuICAgICAgICBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBRdWlja05hdiA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiRzdWJNZW51cyA9IHRoaXMuJGVsLmZpbmQoJy5zdWItbWVudScpO1xuICAgICAgICB0aGlzLiRzY3JvbGxTcHlJdGVtcyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1xdWljay1uYXZfX3Njcm9sbHNweSBzcGFuJyk7XG4gICAgICAgIHRoaXMuJHNlYXJjaFRvZ2dsZSA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtaXMtc2VhcmNoLXRvZ2dsZScpO1xuXG4gICAgICAgIC8vIHNldCB0aGUgdG9nZ2xlIG9mZnNldCBhbmQgYWNjb3VudCBmb3IgdGhlIFdQIGFkbWluIGJhciBcbiAgICBcbiAgICAgICAgaWYgKCAkKCdib2R5JykuaGFzQ2xhc3MoJ2FkbWluLWJhcicpICYmICQoJyN3cGFkbWluYmFyJykuY3NzKCdwb3NpdGlvbicpID09ICdmaXhlZCcgKSB7XG4gICAgICAgICAgICB2YXIgYWRtaW5CYXJIZWlnaHQgPSAkKCcjd3BhZG1pbmJhcicpLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU9mZnNldCA9ICQoJy5jY2wtYy11c2VyLW5hdicpLm9mZnNldCgpLnRvcCArICQoJy5jY2wtYy11c2VyLW5hdicpLm91dGVySGVpZ2h0KCkgLSBhZG1pbkJhckhlaWdodDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMudG9nZ2xlT2Zmc2V0ID0gJCgnLmNjbC1jLXVzZXItbmF2Jykub2Zmc2V0KCkudG9wICsgJCgnLmNjbC1jLXVzZXItbmF2Jykub3V0ZXJIZWlnaHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdGhpcy5pbml0U2Nyb2xsKCk7XG4gICAgICAgIHRoaXMuaW5pdE1lbnVzKCk7XG4gICAgICAgIHRoaXMuaW5pdFNjcm9sbFNweSgpO1xuICAgICAgICB0aGlzLmluaXRTZWFyY2goKTtcblxuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdFNjcm9sbCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgJHdpbmRvdy5zY3JvbGwoIENDTC50aHJvdHRsZSggX29uU2Nyb2xsLCA1MCApICk7XG5cbiAgICAgICAgZnVuY3Rpb24gX29uU2Nyb2xsKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKTtcbiAgICBcbiAgICAgICAgICAgIGlmICggc2Nyb2xsVG9wID49IHRoYXQudG9nZ2xlT2Zmc2V0ICkge1xuICAgICAgICAgICAgICAgIHRoYXQuJGVsLmFkZENsYXNzKCdjY2wtaXMtZml4ZWQnKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1maXhlZCcpO1xuICAgICAgICAgICAgfVxuICAgIFxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgUXVpY2tOYXYucHJvdG90eXBlLmluaXRNZW51cyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICggISB0aGlzLiRzdWJNZW51cy5sZW5ndGggKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRzdWJNZW51cy5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgJHN1Yk1lbnUgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICR0b2dnbGUgPSAkc3ViTWVudS5zaWJsaW5ncygnYScpO1xuXG4gICAgICAgICAgICAkdG9nZ2xlLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCAkKHRoaXMpLmhhc0NsYXNzKCdjY2wtaXMtYWN0aXZlJykgKSB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUgY2NsLXUtY29sb3Itc2Nob29sJyk7XG4gICAgICAgICAgICAgICAgICAgICRzdWJNZW51LmZhZGVPdXQoMjUwKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICQoJy5jY2wtYy1xdWljay1uYXZfX21lbnUgYS5jY2wtaXMtYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlIGNjbC11LWNvbG9yLXNjaG9vbCcpXG4gICAgICAgICAgICAgICAgICAgIC5zaWJsaW5ncygnLnN1Yi1tZW51JylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5mYWRlT3V0KDI1MCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygnY2NsLWlzLWFjdGl2ZSBjY2wtdS1jb2xvci1zY2hvb2wnKTtcbiAgICAgICAgICAgICAgICAkc3ViTWVudS5mYWRlVG9nZ2xlKDI1MCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIFF1aWNrTmF2LnByb3RvdHlwZS5pbml0U2Nyb2xsU3B5ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kc2Nyb2xsU3B5SXRlbXMuZWFjaChmdW5jdGlvbigpe1xuXG4gICAgICAgICAgICB2YXIgJHNweUl0ZW0gPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgIHRhcmdldCA9ICRzcHlJdGVtLmRhdGEoJ3RhcmdldCcpO1xuXG4gICAgICAgICAgICAkd2luZG93LnNjcm9sbCggQ0NMLnRocm90dGxlKCBfb25TY3JvbGwsIDEwMCApICk7XG5cbiAgICAgICAgICAgIGZ1bmN0aW9uIF9vblNjcm9sbCgpIHtcbiAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKSxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0VG9wID0gJCh0YXJnZXQpLm9mZnNldCgpLnRvcCAtIDE1MDtcblxuICAgICAgICAgICAgICAgIGlmICggc2Nyb2xsVG9wID49IHRhcmdldFRvcCApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC4kc2Nyb2xsU3B5SXRlbXMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAgICAgJHNweUl0ZW0uYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkc3B5SXRlbS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFF1aWNrTmF2LnByb3RvdHlwZS5pbml0U2VhcmNoID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICB0aGlzLiRzZWFyY2hUb2dnbGUuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoYXQuJGVsLnRvZ2dsZUNsYXNzKCdjY2wtc2VhcmNoLWFjdGl2ZScpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1jLXF1aWNrLW5hdicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBRdWlja05hdih0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFJvb20gUmVzZXJ2YXRpb25cbiAqIFxuICogSGFuZGxlIHJvb20gcmVzZXJ2YXRpb25zXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIFJvb21SZXNGb3JtID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kZm9ybUNvbnRlbnQgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1jb250ZW50JykuY3NzKHtwb3NpdGlvbjoncmVsYXRpdmUnfSk7XG4gICAgICAgIHRoaXMuJGZvcm1SZXNwb25zZSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLXJlc3BvbnNlJykuY3NzKHtwb3NpdGlvbjogJ2Fic29sdXRlJywgdG9wOiAnMXJlbScsIGxlZnQ6ICcxcmVtJywgb3BhY2l0eTogMH0pO1xuICAgICAgICB0aGlzLiRmb3JtQ2FuY2VsID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tY2FuY2VsJyk7XG4gICAgICAgIHRoaXMuJGZvcm1TdWJtaXQgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1zdWJtaXQnKTtcbiAgICAgICAgdGhpcy4kZm9ybVJlbG9hZCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLXJlbG9hZCcpO1xuICAgICAgICB0aGlzLnJvb21JZCA9IHRoaXMuJGVsLmRhdGEoJ3Jlc291cmNlLWlkJyk7XG4gICAgICAgIHRoaXMuJGRhdGVTZWxlY3QgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1kYXRlLXNlbGVjdCcpO1xuICAgICAgICB0aGlzLmRhdGVZbWQgPSB0aGlzLiRkYXRlU2VsZWN0LnZhbCgpO1xuICAgICAgICB0aGlzLiRyb29tU2NoZWR1bGUgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1zY2hlZHVsZScpO1xuICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0ID0gdGhpcy4kZWwuZmluZCgnLmpzLWN1cnJlbnQtZHVyYXRpb24nKTtcbiAgICAgICAgdGhpcy4kZm9ybU5vdGlmaWNhdGlvbiA9ICQoJzxwIGNsYXNzPVwiY2NsLWMtYWxlcnRcIj48L3A+Jyk7XG4gICAgICAgIHRoaXMuJHJlc2V0U2VsZWN0aW9uQnRuID0gdGhpcy4kZWwuZmluZCgnLmpzLXJlc2V0LXNlbGVjdGlvbicpOyBcbiAgICAgICAgdGhpcy4kcm9vbVNsb3RJbnB1dHMgPSBudWxsO1xuICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cyA9IFtdO1xuICAgICAgICB0aGlzLm1heFNsb3RzID0gNjtcbiAgICAgICAgdGhpcy4kbWF4VGltZSA9IHRoaXMuJGVsLmZpbmQoJy5qcy1tYXgtdGltZScpO1xuICAgICAgICB0aGlzLnNsb3RNaW51dGVzID0gMzA7XG4gICAgICAgIHRoaXMubG9jYWxlID0gXCJlbi1VU1wiO1xuICAgICAgICB0aGlzLnRpbWVab25lID0ge3RpbWVab25lOiBcIkFtZXJpY2EvTG9zX0FuZ2VsZXNcIn07XG4gICAgICAgIHRoaXMubGlkICAgICAgICA9IDQ4MTY7IC8vIDQ4MTYgODczOVxuICAgICAgICB0aGlzLm9wZW5UaW1lID0gbnVsbDtcbiAgICAgICAgdGhpcy5jbG9zaW5nVGltZSA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHRoaXMuc2V0TG9hZGluZygpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2NoZWR1bGVEYXRhKCk7XG5cbiAgICAgICAgdGhpcy5zZXRNYXhUaW1lVGV4dCgpO1xuXG4gICAgICAgIHRoaXMuaW5pdERhdGVFdmVudHMoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdEZvcm1FdmVudHMoKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmdldFNwYWNlQXZhaWxhYmlsaXR5ID0gZnVuY3Rpb24oWW1kKXtcblxuXHRcdHZhciBkYXRhID0ge1xuXHRcdFx0YWN0aW9uOiAnZ2V0X3Jvb21faW5mbycsXG5cdFx0XHRjY2xfbm9uY2U6IENDTC5ub25jZSxcblx0XHRcdGF2YWlsYWJpbGl0eTogWW1kIHx8ICcnLCAvLyBlLmcuICcyMDE3LTEwLTE5Jy4gZW1wdHkgc3RyaW5nIHdpbGwgZ2V0IGF2YWlsYWJpbGl0eSBmb3IgY3VycmVudCBkYXlcblx0XHRcdHJvb206IHRoaXMucm9vbUlkIC8vIHJvb21faWQgKHNwYWNlKVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiAkLnBvc3Qoe1xuXHRcdFx0dXJsOiBDQ0wuYWpheF91cmwsXG5cdFx0XHRkYXRhOiBkYXRhXG5cdFx0fSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmdldFNwYWNlQm9va2luZ3MgPSBmdW5jdGlvbihZbWQpe1xuICAgICAgICBcbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBhY3Rpb246ICdnZXRfYm9va2luZ3MnLFxuICAgICAgICAgICAgY2NsX25vbmNlOiBDQ0wubm9uY2UsXG4gICAgICAgICAgICBkYXRlOiBZbWQgfHwgJycsIC8vIGUuZy4gJzIwMTctMTAtMTknLiBlbXB0eSBzdHJpbmcgd2lsbCBnZXQgYm9va2luZ3MgZm9yIGN1cnJlbnQgZGF5XG4gICAgICAgICAgICByb29tOiB0aGlzLnJvb21JZCxcbiAgICAgICAgICAgIGxpbWl0OiA1MFxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiAkLnBvc3Qoe1xuICAgICAgICAgICAgdXJsOiBDQ0wuYWpheF91cmwsXG4gICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgIH0pO1xuXG4gICAgfTtcbiAgICBcbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuZ2V0TWFpbkxpYnJhcnlIb3VycyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vZ2V0IHRoZSBob3VycyBmb3IgdGhlIG1haW4gbGlicmFyeSB2aWEgQUpBWFxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIGFjdGlvbjogJ2dldF9tYWluX2xpYnJhcnlfaG91cnMnLFxuICAgICAgICAgICAgY2NsX25vbmNlOiBDQ0wubm9uY2UgICAgICAgICAgIFxuICAgICAgICB9O1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuICQucG9zdCh7XG4gICAgICAgICAgICB1cmw6IENDTC5hamF4X3VybCxcbiAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgfSk7ICAgICAgICBcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnVwZGF0ZVNjaGVkdWxlRGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdmFyIGdldFNwYWNlanFYSFIgPSB0aGlzLmdldFNwYWNlQXZhaWxhYmlsaXR5KHRoaXMuZGF0ZVltZCk7XG4gICAgICAgIHZhciBnZXRCb29raW5nc2pxWEhSID0gdGhpcy5nZXRTcGFjZUJvb2tpbmdzKHRoaXMuZGF0ZVltZCk7XG4gICAgICAgIHZhciBnZXRNYWluSG91cnNqcVhIUiA9IHRoaXMuZ2V0TWFpbkxpYnJhcnlIb3VycygpO1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICAkLndoZW4oZ2V0U3BhY2VqcVhIUiwgZ2V0Qm9va2luZ3NqcVhIUiwgZ2V0TWFpbkhvdXJzanFYSFIpXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihnZXRTcGFjZSxnZXRCb29raW5ncywgZ2V0TWFpbkhvdXJzKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgc3BhY2VEYXRhID0gZ2V0U3BhY2VbMF0sXG4gICAgICAgICAgICAgICAgICAgIGJvb2tpbmdzRGF0YSA9IGdldEJvb2tpbmdzWzBdLFxuICAgICAgICAgICAgICAgICAgICBtYWluSG91cnNEYXRhID0gZ2V0TWFpbkhvdXJzWzBdLFxuICAgICAgICAgICAgICAgICAgICBzcGFjZWpxWEhSID0gZ2V0U3BhY2VbMl0sXG4gICAgICAgICAgICAgICAgICAgIGJvb2tpbmdzanFYSFIgPSBnZXRCb29raW5nc1syXSxcbiAgICAgICAgICAgICAgICAgICAgdGltZVNsb3RzQXJyYXk7XG5cbiAgICAgICAgICAgICAgICAvLyBwYXJzZSBkYXRhIHRvIEpTT04gaWYgaXQncyBhIHN0cmluZ1xuICAgICAgICAgICAgICAgIHNwYWNlRGF0YSA9ICggdHlwZW9mIHNwYWNlRGF0YSA9PT0gJ3N0cmluZycgKSA/IEpTT04ucGFyc2UoIHNwYWNlRGF0YSApWzBdIDogc3BhY2VEYXRhWzBdO1xuICAgICAgICAgICAgICAgIGJvb2tpbmdzRGF0YSA9ICggdHlwZW9mIGJvb2tpbmdzRGF0YSA9PT0gJ3N0cmluZycgKSA/IEpTT04ucGFyc2UoIGJvb2tpbmdzRGF0YSApIDogYm9va2luZ3NEYXRhO1xuICAgICAgICAgICAgICAgIG1haW5Ib3Vyc0RhdGEgPSAoIHR5cGVvZiBtYWluSG91cnNEYXRhID09PSAnc3RyaW5nJyApID8gSlNPTi5wYXJzZSggbWFpbkhvdXJzRGF0YSApIDogbWFpbkhvdXJzRGF0YTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL2dldCB0aGUgb3BlbiBob3VycyBvZiB0aGUgbGlicmFyeSBhbmQgcmV0dXJuIHRoZXNlIHRpbWVzIGFzIHZhcmlhYmxlc1xuICAgICAgICAgICAgICAgIHRoYXQuZ2V0T3BlbkhvdXJzKCBtYWluSG91cnNEYXRhICk7ICAgXG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYoICF0aGF0Lm9wZW5UaW1lICYmICF0aGF0LmNsb3NpbmdUaW1lICl7XG4gICAgICAgICAgICAgICAgICAgIC8vaWYgdGhlIGxpYnJhcnkgaXMgY2xvc2VkLCB0aGVuIHRoZSBvcGVuVGltZSBhbmQgY2xvc2luZ1RpbWUgd2lsbCBzdGlsbCBiZSBudWxsXG4gICAgICAgICAgICAgICAgICAgIC8vdGhlbiB3ZSBleGl0IG91dCBvZiB0aGUgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgdGhhdC4kcm9vbVNjaGVkdWxlLmh0bWwoICdObyByZXNlcnZhdGlvbnMgYXJlIGF2YWlsYWJsZScgKTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC51bnNldExvYWRpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC4kY3VycmVudER1cmF0aW9uVGV4dC50ZXh0KCdMaWJyYXJ5IENsb3NlZCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGF0LiRyZXNldFNlbGVjdGlvbkJ0bi5oaWRlKCk7ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgICAgIC8vIG1lcmdlIGJvb2tpbmdzIHdpdGggYXZhaWxhYmlsaXR5XG4gICAgICAgICAgICAgICAgaWYgKCBib29raW5nc0RhdGEubGVuZ3RoICl7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY2hlY2tTdGF0dXNlcyA9IFsnQXZhaWxhYmxlJywgJ0NvbmZpcm1lZCddO1xuICAgICAgICAgICAgICAgICAgICBib29raW5nc0RhdGEuZm9yRWFjaChmdW5jdGlvbihib29raW5nLGkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggICQuaW5BcnJheSggYm9va2luZy5zdGF0dXMsIGNoZWNrU3RhdHVzZXMgKSA9PSAtMSApe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCBib29raW5nLnN0YXR1cyApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjsgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIG51bWJlciBvZiBzbG90cyBiYXNlZCBvbiBib29raW5nIGR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZnJvbVRpbWUgPSBuZXcgRGF0ZShib29raW5nLmZyb21EYXRlKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9UaW1lID0gbmV3IERhdGUoYm9va2luZy50b0RhdGUpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbk1pbnV0ZXMgPSAodG9UaW1lIC0gZnJvbVRpbWUpIC8gMTAwMCAvIDYwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsb3RDb3VudCA9IGR1cmF0aW9uTWludXRlcyAvIHRoYXQuc2xvdE1pbnV0ZXM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlRGF0YS5hdmFpbGFiaWxpdHkucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IGJvb2tpbmcuZnJvbURhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBib29raW5nLnRvRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNsb3RDb3VudFwiOiBzbG90Q291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0Jvb2tlZFwiOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIHNvcnQgdGltZSBzbG90IG9iamVjdHMgYnkgdGhlIFwiZnJvbVwiIGtleVxuICAgICAgICAgICAgICAgICAgICBfc29ydEJ5S2V5KCBzcGFjZURhdGEuYXZhaWxhYmlsaXR5LCAnZnJvbScgKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcblxuXG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgdGltZSBzbG90cyBhbmQgcmV0dXJuIGFuIGFwcHJvcHJpYXRlIHN1YnNldCAob25seSBvcGVuIHRvIGNsb3NlIGhvdXJzKVxuICAgICAgICAgICAgICAgIHRpbWVTbG90c0FycmF5ID0gdGhhdC5wYXJzZVNjaGVkdWxlKHNwYWNlRGF0YS5hdmFpbGFiaWxpdHkpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGJ1aWxkIHNjaGVkdWxlIEhUTUxcbiAgICAgICAgICAgICAgICB0aGF0LmJ1aWxkU2NoZWR1bGUodGltZVNsb3RzQXJyYXkpO1xuXG4gICAgICAgICAgICAgICAgLy8gRXJyb3IgaGFuZGxlcnNcbiAgICAgICAgICAgICAgICBzcGFjZWpxWEhSLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBib29raW5nc2pxWEhSLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGF0LnVuc2V0TG9hZGluZygpO1xuICAgICAgICAgICAgICAgIHRoYXQuJHJlc2V0U2VsZWN0aW9uQnRuLmhpZGUoKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5idWlsZFNjaGVkdWxlID0gZnVuY3Rpb24odGltZVNsb3RzQXJyYXkpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIGh0bWwgPSBbXTtcbiAgICAgICAgICAgIFxuICAgICAgICAvLyBjb25zdHJ1Y3QgSFRNTCBmb3IgZWFjaCB0aW1lIHNsb3RcbiAgICAgICAgdGltZVNsb3RzQXJyYXkuZm9yRWFjaChmdW5jdGlvbihpdGVtLCBpKXtcblxuICAgICAgICAgICAgdmFyIGZyb20gPSBuZXcgRGF0ZSggaXRlbS5mcm9tICksXG4gICAgICAgICAgICAgICAgdGltZVN0cmluZyxcbiAgICAgICAgICAgICAgICBpdGVtQ2xhc3MgPSAnJztcblxuICAgICAgICAgICAgaWYgKCBmcm9tLmdldE1pbnV0ZXMoKSAhPT0gMCApIHtcbiAgICAgICAgICAgICAgICB0aW1lU3RyaW5nID0gdGhhdC5yZWFkYWJsZVRpbWUoIGZyb20sICdoOm0nICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmcgPSB0aGF0LnJlYWRhYmxlVGltZSggZnJvbSwgJ2hhJyApO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIGl0ZW0uaXNCb29rZWQgJiYgaXRlbS5oYXNPd25Qcm9wZXJ0eSgnc2xvdENvdW50JykgKSB7XG4gICAgICAgICAgICAgICAgaXRlbUNsYXNzID0gJ2NjbC1pcy1vY2N1cGllZCBjY2wtZHVyYXRpb24tJyArIGl0ZW0uc2xvdENvdW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBidWlsZCBzZWxlY3RhYmxlIHRpbWUgc2xvdHNcbiAgICAgICAgICAgIGh0bWwucHVzaCggdGhhdC5idWlsZFRpbWVTbG90KHtcbiAgICAgICAgICAgICAgICBpZDogJ3Nsb3QtJyArIHRoYXQucm9vbUlkICsgJy0nICsgaSxcbiAgICAgICAgICAgICAgICBmcm9tOiBpdGVtLmZyb20sXG4gICAgICAgICAgICAgICAgdG86IGl0ZW0udG8sXG4gICAgICAgICAgICAgICAgdGltZVN0cmluZzogdGltZVN0cmluZyxcbiAgICAgICAgICAgICAgICBjbGFzczogaXRlbUNsYXNzXG4gICAgICAgICAgICB9KSApO1xuICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbXTtcblxuICAgICAgICB0aGlzLiRyb29tU2NoZWR1bGUuaHRtbCggaHRtbC5qb2luKCcnKSApO1xuXG4gICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXJvb21fX3Nsb3QgW3R5cGU9XCJjaGVja2JveFwiXScpO1xuXG4gICAgICAgIHRoaXMuc2V0Q3VycmVudER1cmF0aW9uVGV4dCgpO1xuXG4gICAgICAgIHRoaXMuaW5pdFNsb3RFdmVudHMoKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuYnVpbGRUaW1lU2xvdCA9IGZ1bmN0aW9uKHZhcnMpe1xuICAgICAgICBcbiAgICAgICAgaWYgKCAhIHZhcnMgfHwgdHlwZW9mIHZhcnMgIT09ICdvYmplY3QnICkge1xuICAgICAgICAgICAgcmV0dXJuICcnO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGRlZmF1bHRzID0ge1xuICAgICAgICAgICAgY2xhc3M6ICcnLFxuICAgICAgICAgICAgaWQ6ICcnLFxuICAgICAgICAgICAgZGlzYWJsZWQ6ICcnLFxuICAgICAgICAgICAgZnJvbTogJycsXG4gICAgICAgICAgICB0bzogJycsXG4gICAgICAgICAgICB0aW1lU3RyaW5nOiAnJ1xuICAgICAgICB9O1xuICAgICAgICB2YXJzID0gJC5leHRlbmQoZGVmYXVsdHMsIHZhcnMpO1xuXG4gICAgICAgIHZhciB0ZW1wbGF0ZSA9ICcnICtcbiAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2NsLWMtcm9vbV9fc2xvdCAnICsgdmFycy5jbGFzcyArICdcIj4nICtcbiAgICAgICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGlkPVwiJyArIHZhcnMuaWQgKyAnXCIgbmFtZT1cIicgKyB2YXJzLmlkICsgJ1wiIHZhbHVlPVwiJyArIHZhcnMuZnJvbSArICdcIiBkYXRhLXRvPVwiJyArIHZhcnMudG8gKyAnXCIgJyArIHZhcnMuZGlzYWJsZWQgKyAnLz4nICtcbiAgICAgICAgICAgICAgICAnPGxhYmVsIGNsYXNzPVwiY2NsLWMtcm9vbV9fc2xvdC1sYWJlbFwiIGZvcj1cIicgKyB2YXJzLmlkICsgJ1wiPicgK1xuICAgICAgICAgICAgICAgICAgICB2YXJzLnRpbWVTdHJpbmcgK1xuICAgICAgICAgICAgICAgICc8L2xhYmVsPicgK1xuICAgICAgICAgICAgJzwvZGl2Pic7XG5cbiAgICAgICAgcmV0dXJuIHRlbXBsYXRlO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUucGFyc2VTY2hlZHVsZSA9IGZ1bmN0aW9uKHNjaGVkdWxlQXJyYXkpe1xuICAgICAgICAvLyByZXR1cm5zIHRoZSBhcHByb3ByaWF0ZSBzY2hlZHVsZSBmb3IgYSBnaXZlbiBhcnJheSBvZiB0aW1lIHNsb3RzXG4gICAgICAgIFxuICAgICAgICB2YXIgdG8gPSBudWxsLFxuICAgICAgICAgICAgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBzdGFydEVuZEluZGV4ZXMgPSBbXSwgXG4gICAgICAgICAgICBzdGFydCwgZW5kLFxuICAgICAgICAgICAgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBcbiAgICAgICAgLy9jb25zb2xlLmxvZyggc2NoZWR1bGVBcnJheSApO1xuXG4gICAgICAgICQuZWFjaCggc2NoZWR1bGVBcnJheSwgZnVuY3Rpb24oIGksIGl0ZW0gKXtcbiAgICAgICAgICAgIHN0YXJ0ID0gbmV3IERhdGUoIGl0ZW0uZnJvbSApLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGVuZCA9IG5ldyBEYXRlKCBpdGVtLnRvICkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL2FkZCB0byBzY2hlZHVsZSBhcnJheSBpZlxuICAgICAgICAgICAgLy9iZWdpbm5pbmcgaXMgYWZ0ZXIgb3BlbmluZyBhbmQgZW5kIGlmIGJlZm9yZSBjbG9zaW5nIGFuZCBlbmQgaXMgZ3JlYXRlciB0aGFuIHJpZ2h0IG5vd1xuICAgICAgICAgICAgaWYoIHRoYXQub3BlblRpbWUgPD0gc3RhcnQgJiYgdGhhdC5jbG9zaW5nVGltZSA+PSBlbmQgJiYgZW5kID4gbm93ICl7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIHN0YXJ0RW5kSW5kZXhlcy5wdXNoKCBpdGVtICk7ICAgICAgICAgICAgICAgICAgICBcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnNvbGUubG9nKCAnU2NoZWR1bGUgQXJyYXkgc2xvdHM6ICcsIHN0YXJ0RW5kSW5kZXhlcy5sZW5ndGggKycvJyArIHNjaGVkdWxlQXJyYXkubGVuZ3RoICk7XG5cbiAgICAgICAgLy9yZXNldCB0aGlzIHZhcmlhYmxlIGluY2FzZSB3ZSB1c2UgdGhpcyBzY3JpcHQgZm9yIG90aGVyIGRheXNcbiAgICAgICAgdGhhdC5vcGVuVGltZSA9IG51bGw7XG4gICAgICAgIHRoYXQuY2xvc2luZ1RpbWUgPSBudWxsO1xuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHN0YXJ0RW5kSW5kZXhlcztcblxuICAgICAgICAvLyBsb29wIHRocm91Z2ggYXJyYXkgYW5kIHBpY2sgb3V0IHRpbWUgZ2Fwc1xuICAgICAgICAvLyBzY2hlZHVsZUFycmF5LmZvckVhY2goZnVuY3Rpb24oaXRlbSxpKXtcbiAgICAgICAgLy8gICAgIGlmICggdG8gJiYgdG8gIT09IGl0ZW0uZnJvbSApIHtcbiAgICAgICAgLy8gICAgICAgICBzdGFydEVuZEluZGV4ZXMucHVzaChpKTtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gICAgIHRvID0gaXRlbS50bztcbiAgICAgICAgLy8gfSk7XG5cbiAgICAgICAgLy8gLy8gZGVwZW5kaW5nIG9uIG51bWJlciBvZiBnYXBzIGZvdW5kLCBkZXRlcm1pbmUgc3RhcnQgYW5kIGVuZCBpbmRleGVzXG4gICAgICAgIC8vIGlmICggc3RhcnRFbmRJbmRleGVzLmxlbmd0aCA+PSAyICkge1xuICAgICAgICAvLyAgICAgc3RhcnQgPSBzdGFydEVuZEluZGV4ZXNbMF07XG4gICAgICAgIC8vICAgICBlbmQgPSBzdGFydEVuZEluZGV4ZXNbMV07XG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vICAgICBzdGFydCA9IDA7XG4gICAgICAgIC8vICAgICBpZiAoIHN0YXJ0RW5kSW5kZXhlcy5sZW5ndGggPT09IDEgKSB7XG4gICAgICAgIC8vICAgICAgICAgZW5kID0gc3RhcnRFbmRJbmRleGVzWzBdO1xuICAgICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gICAgICAgICBlbmQgPSBzY2hlZHVsZUFycmF5Lmxlbmd0aDtcbiAgICAgICAgLy8gICAgIH1cbiAgICAgICAgLy8gfVxuICAgICAgICBcbiAgICAgICAgLy8gcmV0dXJuZWQgc2xpY2VkIHBvcnRpb24gb2Ygb3JpZ2luYWwgc2NoZWR1bGVcbiAgICAgICAgLy9yZXR1cm4gc2NoZWR1bGVBcnJheS5zbGljZShzdGFydCxlbmQpO1xuICAgIH07XG4gICAgXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmdldE9wZW5Ib3VycyA9IGZ1bmN0aW9uKGhvdXJzRGF0YSl7XG4gICAgICAgIC8vcmV0dXJucyB0aGUgb3BlbmluZyBhbmQgY2xvc2luZyBob3VycyBmb3IgdGhlIG1haW4gbGlicmFyeVxuICAgICAgICB2YXIgaG91cnNPYmosXG4gICAgICAgICAgICB0aGF0ID0gdGhpcztcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggaG91cnNEYXRhICk7XG4gICAgICAgIFxuICAgICAgICAvL2ZpbHRlciBvYmplY3QgZm9yIHRoZSBtYWluIGxpYnJhcnkgYW5kIHRoZSBjdXJyZW50IGRhdGUgcGFzc2VkIGluXG4gICAgICAgIGhvdXJzT2JqID0gJC5ncmVwKCBob3Vyc0RhdGEubG9jYXRpb25zLCBmdW5jdGlvbihsaWJyYXJ5KXtcbiAgICAgICAgICAgIHJldHVybiBsaWJyYXJ5LmxpZCA9PSB0aGF0LmxpZCA7XG4gICAgICAgIH0gKTtcbiAgICAgICAgLy91c2UgdGhpcyByZWN1cnNpdmUgZnVuY3Rpb24gdG8gbG9jYXRlIHRoZSBkYXkncyBob3VycyBmb3IgdGhlIGRhdGUgcGFzc2VkXG4gICAgICAgIGhvdXJzT2JqID0gX2ZpbmRPYmplY3RCeUtleVZhbCggaG91cnNPYmpbMF0ud2Vla3MsICdkYXRlJywgdGhhdC5kYXRlWW1kICk7XG4gICAgICAgIFxuICAgICAgICAvL2lkZW50aWZ5IHRoZSBkYXRlIHNpdHVhdGlvbiBhbmQgY3JlYXRlIGdsb2JhbCB2YXJpYWJsZXNcbiAgICAgICAgaWYoICdob3VycycgaW4gaG91cnNPYmoudGltZXMgKXtcbiAgICAgICAgICAgIC8vdXNlIHRoZSBmdW5jdGlvbiB0byBjb252ZXJ0IGEgc2VyaWVzIG9mIHN0cmluZ3MgaW50byBhbiBhY3R1YWwgRGF0ZSBPYmplY3RcbiAgICAgICAgICAgIHRoYXQub3BlblRpbWUgICAgPSBfY29udmVydFRvRGF0ZU9iaiggaG91cnNPYmosICdmcm9tJyApO1xuICAgICAgICAgICAgdGhhdC5jbG9zaW5nVGltZSA9IF9jb252ZXJ0VG9EYXRlT2JqKCBob3Vyc09iaiwgJ3RvJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vaWYgdGhpcyBkYXkgY2xvc2VzIGF0IDFhbSwgdGhlbiB3ZSBuZWVkIHRvIGtpY2sgdGhlIGNsb3NpbmcgdGltZSB0byB0aGUgbmV4dCBkYXlcbiAgICAgICAgICAgIGlmKCAoaG91cnNPYmoudGltZXMuaG91cnNbMF0udG8pLmluZGV4T2YoICdhbScgKSAhPSAtMSApe1xuICAgICAgICAgICAgICAgIC8vdGhhdC5jbG9zaW5nVGltZSA9IHRoYXQuY2xvc2luZ1RpbWUuc2V0RGF0ZSh0aGF0LmNsb3NpbmdUaW1lLmdldERhdGUoKSArIDEgKTtcbiAgICAgICAgICAgICAgICB0aGF0LmNsb3NpbmdUaW1lID0gbmV3IERhdGUoIHRoYXQuY2xvc2luZ1RpbWUuZ2V0VGltZSgpICsgKCAxKjI0KjYwKjYwKjEwMDAgKSApO1xuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coIHRoYXQuY2xvc2luZ1RpbWUudG9TdHJpbmcoKSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL2Nhc3QgaW50byBtaWxsaXNlY29uZHNcbiAgICAgICAgICAgIHRoYXQub3BlblRpbWUgICA9IHRoYXQub3BlblRpbWUuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdGhhdC5jbG9zaW5nVGltZSA9IHRoYXQuY2xvc2luZ1RpbWUuZ2V0VGltZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCBob3Vyc09iai5kYXRlLCAnOiBjdXN0b20gSG91cnMgZGlmZmVyZW5jZSAnLCBNYXRoLmFicyh0aGF0LmNsb3NpbmdUaW1lIC0gdGhhdC5vcGVuVGltZSkgLyAzNmU1ICk7XG4gICAgXG4gICAgICAgIH1lbHNlIGlmKCBob3Vyc09iai50aW1lcy5zdGF0dXMgPT0gJzI0aG91cnMnICl7XG4gICAgICAgICAgICAvL2lmIHRoZSBzdGF0dXMgaXMgMjQgaG91cnMsIHdlIG5lZWQgdG8gc2V0IHRoZSBiZWdpbm5pbmcgZW5kIG9mIHRoaXMgZGF5XG4gICAgICAgICAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCBob3Vyc09iai5kYXRlICk7XG5cbiAgICAgICAgICAgIHRoYXQub3BlblRpbWUgICAgPSBkYXRlLmdldFRpbWUoKTsgICAgICAgICAgICBcblxuICAgICAgICAgICAgLy9jb3VsZCBiZSBlbmQuc2V0SG91cnMoMjMsNTksNTksOTk5KTtcbiAgICAgICAgICAgIC8vdGhhdC5jbG9zaW5nVGltZSA9IHRoYXQub3BlblRpbWUuc2V0RGF0ZSh0aGF0Lm9wZW5UaW1lLmdldERhdGUoKSArIDEgKTtcbiAgICAgICAgICAgIHRoYXQuY2xvc2luZ1RpbWUgPSAgIG5ldyBEYXRlKCB0aGF0Lm9wZW5UaW1lICsgKCAxKjI0KjYwKjYwKjEwMDAgKSApLmdldFRpbWUoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggaG91cnNPYmouZGF0ZSwgICc6IDI0IGhvdXJzIGRpZmZlcmVuY2UgJywgTWF0aC5hYnModGhhdC5jbG9zaW5nVGltZSAtIHRoYXQub3BlblRpbWUpIC8gMzZlNSApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCAnMjQgaG91ciBjbG9zaW5nIHRpbWUnLCAgbmV3IERhdGUgKHRoYXQub3BlblRpbWUpLnRvU3RyaW5nKCkgLCBuZXcgRGF0ZSAodGhhdC5jbG9zaW5nVGltZSApLnRvU3RyaW5nKCkgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyggJzI0IGhvdXIgY2xvc2luZyB0aW1lJywgdGhhdC5vcGVuVGltZSwgdGhhdC5jbG9zaW5nVGltZSAgKTtcbiAgICAgICAgfVxuICAgICAgICBcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdEZvcm1FdmVudHMgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0bi5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgJCh0aGF0LnNlbGVjdGVkU2xvdElucHV0cykuZWFjaChmdW5jdGlvbihpLGlucHV0KXtcbiAgICAgICAgICAgICAgICAkKGlucHV0KVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsZmFsc2UpXG4gICAgICAgICAgICAgICAgICAgIC5jaGFuZ2UoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5yZW1vdmVDbGFzcygnY2NsLWlzLWRpc2FibGVkJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGVsLnN1Ym1pdChmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhhdC5vblN1Ym1pdCgpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRmb3JtUmVsb2FkLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGF0LnJlbG9hZEZvcm0oKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXREYXRlRXZlbnRzID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRkYXRlU2VsZWN0LmNoYW5nZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGhhdC5vbkRhdGVDaGFuZ2UoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uRGF0ZUNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBcbiAgICAgICAgdGhpcy5kYXRlWW1kID0gdGhpcy4kZGF0ZVNlbGVjdC52YWwoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2V0TG9hZGluZygpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2NoZWR1bGVEYXRhKCk7XG4gICAgICAgIFxuICAgIH07XG4gICAgICAgIFxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0U2xvdEV2ZW50cyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIGlmICggdGhpcy4kcm9vbVNsb3RJbnB1dHMgJiYgdGhpcy4kcm9vbVNsb3RJbnB1dHMubGVuZ3RoICl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGlucHV0IGNoYW5nZSBldmVudCBoYW5kbGVyXG4gICAgICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cy5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgaW5wdXQgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHRoYXQub25TbG90Q2hhbmdlKGlucHV0KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblNsb3RDaGFuZ2UgPSBmdW5jdGlvbihjaGFuZ2VkSW5wdXQpe1xuICAgICAgICBcbiAgICAgICAgLy8gaWYgaW5wdXQgY2hlY2tlZCwgYWRkIGl0IHRvIHNlbGVjdGVkIHNldFxuICAgICAgICBpZiAoICQoY2hhbmdlZElucHV0KS5wcm9wKCdjaGVja2VkJykgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnB1c2goY2hhbmdlZElucHV0KTtcbiAgICAgICAgICAgICQoY2hhbmdlZElucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykuYWRkQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG4gICBcbiAgICAgICAgfSBcbiAgICAgICAgXG4gICAgICAgIC8vIGlmIGlucHV0IHVuY2hlY2tlZCwgcmVtb3ZlIGl0IGZyb20gdGhlIHNlbGVjdGVkIHNldFxuICAgICAgICBlbHNlIHsgXG5cbiAgICAgICAgICAgIHZhciBjaGFuZ2VkSW5wdXRJbmRleCA9IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2YoY2hhbmdlZElucHV0KTtcblxuICAgICAgICAgICAgaWYgKCBjaGFuZ2VkSW5wdXRJbmRleCA+IC0xICkge1xuICAgICAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLnNwbGljZSggY2hhbmdlZElucHV0SW5kZXgsIDEgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoY2hhbmdlZElucHV0KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1jaGVja2VkJyk7XG5cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgLy8gdXBkYXRlIHRoZSBzbG90cyB3aGljaCBjYW4gbm93IGJlIGNsaWNrYWJsZVxuICAgICAgICB0aGlzLnVwZGF0ZVNlbGVjdGFibGVTbG90cygpO1xuICAgICAgICBcbiAgICAgICAgLy8gdXBkYXRlIGJ1dHRvbiBzdGF0ZXNcbiAgICAgICAgaWYgKCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4uc2hvdygpO1xuICAgICAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0bi5oaWRlKCk7IFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIHRleHRcbiAgICAgICAgdGhpcy5zZXRDdXJyZW50RHVyYXRpb25UZXh0KCk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnVwZGF0ZVNlbGVjdGFibGVTbG90cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICAvLyBJRiB0aGVyZSBhcmUgc2VsZWN0ZWQgc2xvdHNcbiAgICAgICAgaWYgKCB0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggKXtcbiAgICAgICAgXG4gICAgICAgICAgICAvLyBmaXJzdCwgc29ydCB0aGUgc2VsZWN0ZWQgc2xvdHNcbiAgICAgICAgICAgIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzLnNvcnQoZnVuY3Rpb24oYSxiKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gYS5nZXRBdHRyaWJ1dGUoJ3ZhbHVlJykgPiBiLmdldEF0dHJpYnV0ZSgndmFsdWUnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBncmFiIHRoZSBmaXJzdCBhbmQgbGFzdCBzZWxlY3RlZCBzbG90c1xuICAgICAgICAgICAgdmFyIG1pbklucHV0ID0gdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHNbMF0sXG4gICAgICAgICAgICAgICAgbWF4SW5wdXQgPSB0aGF0LnNlbGVjdGVkU2xvdElucHV0c1t0aGF0LnNlbGVjdGVkU2xvdElucHV0cy5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gZ2V0IHRoZSBpbmRleGVzIG9mIHRoZSBmaXJzdCBhbmQgbGFzdCBzbG90cyBmcm9tIHRoZSAkcm9vbVNsb3RJbnB1dHMgalF1ZXJ5IG9iamVjdFxuICAgICAgICAgICAgdmFyIG1pbkluZGV4ID0gdGhhdC4kcm9vbVNsb3RJbnB1dHMuaW5kZXgobWluSW5wdXQpLFxuICAgICAgICAgICAgICAgIG1heEluZGV4ID0gdGhhdC4kcm9vbVNsb3RJbnB1dHMuaW5kZXgobWF4SW5wdXQpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBjYWxjdWxhdGUgdGhlIG1pbiBhbmQgbWF4IHNsb3QgaW5kZXhlcyB3aGljaCBhcmUgc2VsZWN0YWJsZVxuICAgICAgICAgICAgdmFyIG1pbkFsbG93YWJsZSA9IG1heEluZGV4IC0gdGhhdC5tYXhTbG90cyxcbiAgICAgICAgICAgICAgICBtYXhBbGxvd2FibGUgPSBtaW5JbmRleCArIHRoYXQubWF4U2xvdHM7XG4gICAgXG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggcm9vbSBzbG90cyBhbmQgdXBkYXRlIHRoZW0gYWNjb3JkaW5nbHlcbiAgICAgICAgICAgIHRoYXQuJHJvb21TbG90SW5wdXRzLmVhY2goZnVuY3Rpb24oaSwgaW5wdXQpe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGVuYWJsZXMgb3IgZGlzYWJsZXMgZGVwZW5kaW5nIG9uIHdoZXRoZXIgc2xvdCBmYWxscyB3aXRoaW4gcmFuZ2VcbiAgICAgICAgICAgICAgICBpZiAoIG1pbkFsbG93YWJsZSA8IGkgJiYgaSA8IG1heEFsbG93YWJsZSApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhhdC5lbmFibGVTbG90KGlucHV0KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmRpc2FibGVTbG90KGlucHV0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gYWRkIGEgY2xhc3MgdG8gdGhlIHNsb3RzIHRoYXQgZmFsbCBiZXR3ZWVuIHRoZSBtaW4gYW5kIG1heCBzZWxlY3RlZCBzbG90c1xuICAgICAgICAgICAgICAgIGlmICggbWluSW5kZXggPCBpICYmIGkgPCBtYXhJbmRleCApIHtcbiAgICAgICAgICAgICAgICAgICAgJChpbnB1dCkucGFyZW50KCkuYWRkQ2xhc3MoJ2NjbC1pcy1iZXR3ZWVuJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChpbnB1dCkucGFyZW50KCkucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1iZXR3ZWVuJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICB9IFxuICAgICAgICAvLyBFTFNFIG5vIHNlbGVjdGVkIHNsb3RzXG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBlbmFibGUgYWxsIHNsb3RzXG4gICAgICAgICAgICB0aGF0LiRyb29tU2xvdElucHV0cy5lYWNoKGZ1bmN0aW9uKGksIGlucHV0KXtcbiAgICAgICAgICAgICAgICB0aGF0LmVuYWJsZVNsb3QoaW5wdXQpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmNsZWFyU2xvdCA9IGZ1bmN0aW9uKHNsb3QpIHtcbiAgICAgICAgLy8gc2xvdCBjYW4gYmUgZWl0aGVyIHRoZSBjaGVja2JveCBpbnB1dCAtT1ItIHRoZSBjaGVja2JveCdzIGNvbnRhaW5lclxuXG4gICAgICAgIHZhciBpbnB1dEluZGV4O1xuXG4gICAgICAgIC8vIGlmIGl0J3MgdGhlIGNoZWNrYm94LlxuICAgICAgICBpZiAoICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSApIHtcbiAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy5lbmFibGVTbG90KHNsb3QpO1xuXG4gICAgICAgICAgICAvLyBnZXQgaW5kZXggb2YgdGhlIGlucHV0IGZyb20gc2VsZWN0ZWQgc2V0XG4gICAgICAgICAgICBpbnB1dEluZGV4ID0gdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZihzbG90KTtcbiAgICAgICAgICAgIFxuICAgICAgICAvLyBpZiBpdCdzIHRoZSBjb250YWluZXJcbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgdmFyICRpbnB1dCA9ICQoc2xvdCkuZmluZCgnW3R5cGU9XCJjaGVja2JveFwiXScpO1xuXG4gICAgICAgICAgICB0aGlzLmVuYWJsZVNsb3QoJGlucHV0WzBdKTtcblxuICAgICAgICAgICAgLy8gZ2V0IGluZGV4IG9mIHRoZSBpbnB1dCBmcm9tIHNlbGVjdGVkIHNldFxuICAgICAgICAgICAgaW5wdXRJbmRleCA9IHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmluZGV4T2YoICRpbnB1dFswXSApO1xuXG4gICAgICAgIH1cblxuICAgICAgICAvLyByZW1vdmUgaW5wdXQgZnJvbSBzZWxlY3RlZCBzZXRcbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuc3BsaWNlKCBpbnB1dEluZGV4LCAxICk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmNsZWFyQWxsU2xvdHMgPSBmdW5jdGlvbigpIHtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kcmVzZXRTZWxlY3Rpb25CdG4uaGlkZSgpO1xuICAgICAgICBcbiAgICAgICAgLy8gRXh0ZW5kIHRoZSBzZWxlY3RlZCBpbnB1dHMgYXJyYXkgdG8gYSBuZXcgdmFyaWFibGUuXG4gICAgICAgIC8vIFRoZSBzZWxlY3RlZCBpbnB1dHMgYXJyYXkgY2hhbmdlcyB3aXRoIGV2ZXJ5IGNsZWFyU2xvdCgpIGNhbGxcbiAgICAgICAgLy8gc28sIGJlc3QgdG8gbG9vcCB0aHJvdWdoIGFuIHVuY2hhbmdpbmcgYXJyYXkuXG4gICAgICAgIHZhciBzZWxlY3RlZElucHV0cyA9ICQuZXh0ZW5kKCBbXSwgdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMgKTtcblxuICAgICAgICAkKHNlbGVjdGVkSW5wdXRzKS5lYWNoKGZ1bmN0aW9uKGksaW5wdXQpe1xuICAgICAgICAgICAgdGhhdC5jbGVhclNsb3QoaW5wdXQpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuYWN0aXZhdGVTbG90ID0gZnVuY3Rpb24oc2xvdCkge1xuICAgICAgICAvLyBzbG90IGNhbiBiZSBlaXRoZXIgdGhlIGNoZWNrYm94IC1PUi0gdGhlIGNoZWNrYm94J3MgY29udGFpbmVyXG5cbiAgICAgICAgdmFyIHNsb3RJc0NoZWNrYm94ID0gJChzbG90KS5pcygnW3R5cGU9XCJjaGVja2JveFwiXScpLFxuICAgICAgICAgICAgJGNvbnRhaW5lciA9IHNsb3RJc0NoZWNrYm94ID8gJChzbG90KS5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JykgOiAkKHNsb3QpO1xuXG4gICAgICAgIC8vIG5ldmVyIHNldCBhbiBvY2N1cGllZCBzbG90IGFzIGFjdGl2ZVxuICAgICAgICBpZiAoICRjb250YWluZXIuaGFzQ2xhc3MoJ2NjbC1pcy1vY2N1cGllZCcpICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCAkKHNsb3QpLmlzKCdbdHlwZT1cImNoZWNrYm94XCJdJykgKSB7XG5cbiAgICAgICAgICAgIC8vIGlmIGl0J3MgdGhlIGNoZWNrYm94LlxuICAgICAgICAgXG4gICAgICAgICAgICAkKHNsb3QpLnByb3AoJ2NoZWNrZWQnLHRydWUpO1xuICAgICAgICAgICAgJGNvbnRhaW5lci5hZGRDbGFzcygnY2NsLWlzLWNoZWNrZWQnKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICAvLyBpZiBpdCdzIHRoZSBjb250YWluZXJcblxuICAgICAgICAgICAgJGNvbnRhaW5lclxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnY2NsLWlzLWNoZWNrZWQnKVxuICAgICAgICAgICAgICAgIC5maW5kKCdbdHlwZT1cImNoZWNrYm94XCJdJylcbiAgICAgICAgICAgICAgICAgICAgLnByb3AoJ2NoZWNrZWQnLHRydWUpO1xuXG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmVuYWJsZVNsb3QgPSBmdW5jdGlvbihzbG90KSB7XG4gICAgICAgICQoc2xvdClcbiAgICAgICAgICAgIC5wcm9wKCdkaXNhYmxlZCcsIGZhbHNlKVxuICAgICAgICAgICAgLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLWlzLWRpc2FibGVkJyk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5kaXNhYmxlU2xvdCA9IGZ1bmN0aW9uKHNsb3QpIHtcbiAgICAgICAgJChzbG90KVxuICAgICAgICAgICAgLnByb3AoJ2Rpc2FibGVkJywgdHJ1ZSlcbiAgICAgICAgICAgIC5wYXJlbnQoJy5jY2wtYy1yb29tX19zbG90JylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1pcy1kaXNhYmxlZCcpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuc2V0TG9hZGluZyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJGN1cnJlbnREdXJhdGlvblRleHQudGV4dCgnTG9hZGluZyBzY2hlZHVsZS4uLicpO1xuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnVuc2V0TG9hZGluZyA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuc2V0Q3VycmVudER1cmF0aW9uVGV4dCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciBzZWxlY3Rpb24gPSAkLmV4dGVuZChbXSx0aGlzLnNlbGVjdGVkU2xvdElucHV0cyksXG4gICAgICAgICAgICBzb3J0ZWRTZWxlY3Rpb24gPSBzZWxlY3Rpb24uc29ydChmdW5jdGlvbihhLGIpeyBcbiAgICAgICAgICAgICAgICByZXR1cm4gYS52YWx1ZSA+IGIudmFsdWU7IFxuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBzZWxlY3Rpb25MZW5ndGggPSBzb3J0ZWRTZWxlY3Rpb24ubGVuZ3RoO1xuICAgICAgICBcbiAgICAgICAgaWYgKCBzZWxlY3Rpb25MZW5ndGggPiAwICkge1xuXG4gICAgICAgICAgICB2YXIgdGltZTFWYWwgPSBzb3J0ZWRTZWxlY3Rpb25bMF0udmFsdWUsXG4gICAgICAgICAgICAgICAgcmVhZGFibGVUaW1lMSA9IHRoaXMucmVhZGFibGVUaW1lKCBuZXcgRGF0ZSh0aW1lMVZhbCkgKTtcblxuICAgICAgICAgICAgdmFyIHRpbWUyVmFsID0gKCBzZWxlY3Rpb25MZW5ndGggPj0gMiApID8gc29ydGVkU2VsZWN0aW9uW3NvcnRlZFNlbGVjdGlvbi5sZW5ndGggLSAxXS52YWx1ZSA6IHRpbWUxVmFsLFxuICAgICAgICAgICAgICAgIHRpbWUyVCA9IG5ldyBEYXRlKHRpbWUyVmFsKS5nZXRUaW1lKCkgKyAoIHRoaXMuc2xvdE1pbnV0ZXMgKiA2MCAqIDEwMDAgKSxcbiAgICAgICAgICAgICAgICByZWFkYWJsZVRpbWUyID0gdGhpcy5yZWFkYWJsZVRpbWUoIG5ldyBEYXRlKHRpbWUyVCkgKTtcblxuICAgICAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dC50ZXh0KCAnRnJvbSAnICsgcmVhZGFibGVUaW1lMSArICcgdG8gJyArIHJlYWRhYmxlVGltZTIgKTtcblxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBlbHNlIHtcblxuICAgICAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dC50ZXh0KCdQbGVhc2Ugc2VsZWN0IGF2YWlsYWJsZSB0aW1lIHNsb3RzJyk7XG5cbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5zZXRNYXhUaW1lVGV4dCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBtYXhNaW51dGVzID0gdGhpcy5tYXhTbG90cyAqIHRoaXMuc2xvdE1pbnV0ZXMsXG4gICAgICAgICAgICBtYXhUZXh0O1xuXG4gICAgICAgIGlmICggbWF4TWludXRlcyA+IDYwICkge1xuICAgICAgICAgICAgbWF4VGV4dCA9IG1heE1pbnV0ZXMgLyA2MCArICcgaG91cnMnOyAgICBcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyArICcgbWludXRlcyc7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRtYXhUaW1lLnRleHQoIG1heFRleHQgKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnJlYWRhYmxlVGltZSA9IGZ1bmN0aW9uKCBkYXRlT2JqLCBmb3JtYXQgKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgbG9jYWxlU3RyaW5nID0gZGF0ZU9iai50b0xvY2FsZVN0cmluZyggdGhpcy5sb2NhbGUsIHRoaXMudGltZVpvbmUgKSwgLy8gZS5nLiAtLT4gXCIxMS83LzIwMTcsIDQ6Mzg6MzMgQU1cIlxuICAgICAgICAgICAgbG9jYWxlVGltZSA9IGxvY2FsZVN0cmluZy5zcGxpdChcIiwgXCIpWzFdOyAvLyBcIjQ6Mzg6MzMgQU1cIlxuXG4gICAgICAgIHZhciB0aW1lID0gbG9jYWxlVGltZS5zcGxpdCgnICcpWzBdLCAvLyBcIjQ6Mzg6MzNcIixcbiAgICAgICAgICAgIHRpbWVPYmogPSB7XG4gICAgICAgICAgICAgICAgYTogbG9jYWxlVGltZS5zcGxpdCgnICcpWzFdLnRvTG93ZXJDYXNlKCksIC8vIChhbSBvciBwbSkgLS0+IFwiYVwiXG4gICAgICAgICAgICAgICAgaDogdGltZS5zcGxpdCgnOicpWzBdLCAvLyBcIjRcIlxuICAgICAgICAgICAgICAgIG06IHRpbWUuc3BsaXQoJzonKVsxXSwgLy8gXCIzOFwiXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgIGlmICggZm9ybWF0ICYmIHR5cGVvZiBmb3JtYXQgPT09ICdzdHJpbmcnICkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgZm9ybWF0QXJyID0gZm9ybWF0LnNwbGl0KCcnKSxcbiAgICAgICAgICAgICAgICByZWFkYWJsZUFyciA9IFtdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBmb3IgKCB2YXIgaSA9IDA7IGkgPCBmb3JtYXRBcnIubGVuZ3RoOyBpKysgKSB7XG4gICAgICAgICAgICAgICAgaWYgKCB0aW1lT2JqW2Zvcm1hdEFycltpXV0gKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlQXJyLnB1c2godGltZU9ialtmb3JtYXRBcnJbaV1dKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZWFkYWJsZUFyci5wdXNoKGZvcm1hdEFycltpXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gcmVhZGFibGVBcnIuam9pbignJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aW1lT2JqLmggKyAnOicgKyB0aW1lT2JqLm0gKyB0aW1lT2JqLmE7XG4gICAgICAgIFxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25TdWJtaXQgPSBmdW5jdGlvbihldmVudCl7XG5cbiAgICAgICAgaWYgKCAhIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCApIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdGhpcy4kZm9ybU5vdGlmaWNhdGlvblxuICAgICAgICAgICAgICAgIC5jc3MoJ2Rpc3BsYXknLCdub25lJylcbiAgICAgICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1pcy1lcnJvcicpXG4gICAgICAgICAgICAgICAgLnRleHQoJ1BsZWFzZSBzZWxlY3QgYSB0aW1lIGZvciB5b3VyIHJlc2VydmF0aW9uJylcbiAgICAgICAgICAgICAgICAuYXBwZW5kVG8odGhpcy4kZm9ybUNvbnRlbnQpXG4gICAgICAgICAgICAgICAgLnNsaWRlRG93bihDQ0wuRFVSQVRJT04pOyAgICAgICAgICAgIFxuXG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gXG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy4kZm9ybU5vdGlmaWNhdGlvbi5yZW1vdmUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcyxcbiAgICAgICAgICAgIHNvcnRlZFNlbGVjdGlvbiA9ICQuZXh0ZW5kKFtdLCB0aGlzLnNlbGVjdGVkU2xvdElucHV0cykuc29ydChmdW5jdGlvbihhLGIpe1xuICAgICAgICAgICAgICAgIHJldHVybiBhLnZhbHVlID4gYi52YWx1ZTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgc3RhcnQgPSBzb3J0ZWRTZWxlY3Rpb25bMF0udmFsdWUsXG4gICAgICAgICAgICBlbmQgPSAoIHNvcnRlZFNlbGVjdGlvbi5sZW5ndGggPiAxICkgPyAkKCBzb3J0ZWRTZWxlY3Rpb25bIHNvcnRlZFNlbGVjdGlvbi5sZW5ndGggLSAxIF0gKS5kYXRhKCd0bycpIDogJCggc29ydGVkU2VsZWN0aW9uWzBdICkuZGF0YSgndG8nKSxcbiAgICAgICAgICAgIHBheWxvYWQgPSB7XG4gICAgICAgICAgICAgICAgXCJpaWRcIjozMzMsXG4gICAgICAgICAgICAgICAgXCJzdGFydFwiOiBzdGFydCxcbiAgICAgICAgICAgICAgICBcImZuYW1lXCI6IHRoaXMuJGVsWzBdLmZuYW1lLnZhbHVlLFxuICAgICAgICAgICAgICAgIFwibG5hbWVcIjogdGhpcy4kZWxbMF0ubG5hbWUudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJlbWFpbFwiOiB0aGlzLiRlbFswXS5lbWFpbC52YWx1ZSxcbiAgICAgICAgICAgICAgICBcIm5pY2tuYW1lXCI6IHRoaXMuJGVsWzBdLm5pY2tuYW1lLnZhbHVlLFxuICAgICAgICAgICAgICAgIFwiYm9va2luZ3NcIjpbXG4gICAgICAgICAgICAgICAgICAgIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBcImlkXCI6IHRoaXMucm9vbUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBlbmRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1zdWJtaXR0aW5nJyk7XG4gICAgICAgIHRoaXMuJGZvcm1DYW5jZWwucHJvcCgnZGlzYWJsZWQnLHRydWUpO1xuICAgICAgICB0aGlzLiRmb3JtU3VibWl0LnRleHQoJ1NlbmRpbmcuLi4nKS5wcm9wKCdkaXNhYmxlZCcsdHJ1ZSk7XG5cbiAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICBhY3Rpb246ICdyZXF1ZXN0X2Jvb2tpbmcnLFxuICAgICAgICAgICAgY2NsX25vbmNlOiBDQ0wubm9uY2UsXG4gICAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkXG4gICAgICAgIH07XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIE1ha2UgYSByZXF1ZXN0IGhlcmUgdG8gcmVzZXJ2ZSBzcGFjZVxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cbiAgICAgICAgJC5wb3N0KHtcbiAgICAgICAgICAgICAgICB1cmw6IENDTC5hamF4X3VybCxcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgICAgIF9oYW5kbGVTdWJtaXRSZXNwb25zZShyZXNwb25zZSk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyb3Ipe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zdWJtaXR0aW5nJyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBmdW5jdGlvbiBfaGFuZGxlU3VibWl0UmVzcG9uc2UocmVzcG9uc2UpIHtcblxuICAgICAgICAgICAgdmFyIHJlc3BvbnNlSFRNTCxcbiAgICAgICAgICAgICAgICByZXNwb25zZU9iamVjdCA9IEpTT04ucGFyc2UocmVzcG9uc2UpO1xuXG4gICAgICAgICAgICBpZiAoIHJlc3BvbnNlT2JqZWN0LmJvb2tpbmdfaWQgKSB7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MID0gIFsnPHAgY2xhc3M9XCJjY2wtaDIgY2NsLXUtbXQtMFwiPlN1Y2Nlc3MhPC9wPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8cCBjbGFzcz1cImNjbC1oNFwiPllvdXIgYm9va2luZyBJRCBpcyA8c3BhbiBjbGFzcz1cImNjbC11LWNvbG9yLXNjaG9vbFwiPicgKyByZXNwb25zZU9iamVjdC5ib29raW5nX2lkICsgJzwvc3Bhbj48L3A+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxwIGNsYXNzPVwiY2NsLWg0XCI+UGxlYXNlIGNoZWNrIHlvdXIgZW1haWwgdG8gY29uZmlybSB5b3VyIGJvb2tpbmcuPC9wPiddO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwgPSAgWyc8cCBjbGFzcz1cImNjbC1oMyBjY2wtdS1tdC0wXCI+U29ycnksIGJ1dCB3ZSBjb3VsZG5cXCd0IHByb2Nlc3MgeW91ciByZXNlcnZhdGlvbi48L3A+JywnPHAgY2xhc3M9XCJjY2wtaDRcIj5FcnJvcnM6PC9wPiddO1xuICAgICAgICAgICAgICAgICQocmVzcG9uc2VPYmplY3QuZXJyb3JzKS5lYWNoKGZ1bmN0aW9uKGksIGVycm9yKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coIGVycm9yICk7XG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTC5wdXNoKCc8cCBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvclwiPicgKyBlcnJvciArICc8L3A+Jyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmVzcG9uc2VIVE1MLnB1c2goJzxwIGNsYXNzPVwiY2NsLWg0XCI+UGxlYXNlIGNvbnRhY3QgdGhlIG1haW4gc2VydmljZXMgZGVzayBmb3IgaGVscDogOTA5LTYyMS04MTUwPC9wPicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGF0LiRmb3JtQ2FuY2VsLnByb3AoJ2Rpc2FibGVkJyxmYWxzZSkudGV4dCgnQ2xvc2UnKTtcbiAgICAgICAgICAgIHRoYXQuJGZvcm1TdWJtaXQuaGlkZSgpO1xuICAgICAgICAgICAgdGhhdC4kZm9ybVJlbG9hZC5zaG93KCk7XG5cbiAgICAgICAgICAgIHRoYXQuJGZvcm1Db250ZW50LmFuaW1hdGUoe29wYWNpdHk6IDB9LCBDQ0wuRFVSQVRJT04pO1xuICAgICAgICAgICAgdGhhdC4kZm9ybVJlc3BvbnNlXG4gICAgICAgICAgICAgICAgLmRlbGF5KENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuaHRtbChyZXNwb25zZUhUTUwpO1xuICAgICAgICAgICAgdGhhdC4kZm9ybUNvbnRlbnRcbiAgICAgICAgICAgICAgICAuZGVsYXkoQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5hbmltYXRlKHtoZWlnaHQ6IHRoYXQuJGZvcm1SZXNwb25zZS5oZWlnaHQoKSArICdweCcgfSwgQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5jc3Moe3pJbmRleDogJy0xJ30pO1xuXG4gICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLXN1Ym1pdHRpbmcnKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnJlbG9hZEZvcm0gPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZm9ybUNhbmNlbC50ZXh0KCdDYW5jZWwnKTtcbiAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdC50ZXh0KCdTdWJtaXQnKS5wcm9wKCdkaXNhYmxlZCcsZmFsc2UpLnNob3coKTtcbiAgICAgICAgdGhpcy4kZm9ybVJlbG9hZC5oaWRlKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNsZWFyQWxsU2xvdHMoKTtcblxuICAgICAgICB0aGlzLiRmb3JtUmVzcG9uc2VcbiAgICAgICAgICAgIC5hbmltYXRlKHtvcGFjaXR5OiAwfSwgQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgLmRlbGF5KENDTC5EVVJBVElPTilcbiAgICAgICAgICAgIC5odG1sKCcnKTtcbiAgICAgICAgdGhpcy4kZm9ybUNvbnRlbnRcbiAgICAgICAgICAgIC5kZWxheShDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAuY3NzKHsgaGVpZ2h0OiAnJywgekluZGV4OiAnJyB9KVxuICAgICAgICAgICAgLmFuaW1hdGUoe29wYWNpdHk6IDF9LCBDQ0wuRFVSQVRJT04pO1xuXG4gICAgICAgIHRoaXMuc2V0TG9hZGluZygpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy51cGRhdGVTY2hlZHVsZURhdGEoKTtcbiAgICB9O1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuICAgIC8vIEhlbHBlcnNcblxuICAgIGZ1bmN0aW9uIF9zb3J0QnlLZXkoIGFyciwga2V5LCBvcmRlciApIHtcbiAgICAgICAgZnVuY3Rpb24gc29ydEFTQyhhLGIpIHtcbiAgICAgICAgICAgIGlmIChhW2tleV0gPCBiW2tleV0pe1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhW2tleV0gPiBiW2tleV0pe1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc29ydERFU0MoYSxiKSB7XG4gICAgICAgICAgICBpZiAoYVtrZXldID4gYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYVtrZXldIDwgYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICggJ0RFU0MnID09PSBvcmRlciApIHtcbiAgICAgICAgICAgIGFyci5zb3J0KHNvcnRERVNDKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyci5zb3J0KHNvcnRBU0MpO1xuICAgICAgICB9XG4gICAgfVxuXG5mdW5jdGlvbiBfZmluZE9iamVjdEJ5S2V5VmFsIChvYmosIGtleSwgdmFsKSB7XG4gICAgaWYgKCFvYmogfHwgKHR5cGVvZiBvYmogPT09ICdzdHJpbmcnKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKG9ialtrZXldID09PSB2YWwpIHtcbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgXG4gICAgZm9yICh2YXIgaSBpbiBvYmopIHtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShpKSkge1xuICAgICAgICAgIHZhciBmb3VuZCA9IF9maW5kT2JqZWN0QnlLZXlWYWwob2JqW2ldLCBrZXksIHZhbCk7XG4gICAgICAgICAgaWYgKGZvdW5kKSB7XG4gICAgICAgICAgICByZXR1cm4gZm91bmQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xufVxuXG5mdW5jdGlvbiBfY29udmVydFRvRGF0ZU9iaiggaG91cnNPYmosIHN0YXJ0RW5kICl7XG4gICAgLy9uZWVkIHRvIGNyZWF0ZSBhIGRhdGUgb2JqZWN0IGluIEphdmFzY3JpcHQsIGJ1dCB0aGUgZGF0ZSBmb3JtYXRzIGZyb20gTGliQ2FsIGFyZSBncm9zc1xuICAgIC8vZ2V0cyB0aGUgaG91cnMgYW5kIG1pbnV0ZXMgYW5kIHNwbGl0cyBpbnRvIGFycmF5XG4gICAgdmFyIGhvdXJzTWludXRlcyA9ICQubWFwKGhvdXJzT2JqLnRpbWVzLmhvdXJzWzBdW3N0YXJ0RW5kXS5zcGxpdCgnOicpLCBmdW5jdGlvbiggdmFsLCBpICl7XG4gICAgICAgIHJldHVybiBwYXJzZUludCh2YWwpO1xuICAgIH0pO1xuICAgIC8vY2hlY2tzIHdoZXRoZXIgaXQgaXMgQW0gb3IgUG1cbiAgICBpZiggaG91cnNPYmoudGltZXMuaG91cnNbMF1bc3RhcnRFbmRdLmluZGV4T2YoICdwbScgKSAhPSAtMSApe1xuICAgICAgICBob3Vyc01pbnV0ZXNbMF0gKz0gMTI7XG4gICAgfVxuICAgIC8vZ2V0IHRoZSBkYXkgb2JqZWN0cyBhbmQgc3BsaXRzIGludG8gIGFycmF5XG4gICAgdmFyIGNhbGRhdGUgPSAkLm1hcCggaG91cnNPYmouZGF0ZS5zcGxpdChcIi1cIiksIGZ1bmN0aW9uKCB2YWwsIGkgKXtcbiAgICAgICAgcmV0dXJuIHZhbCAtIChpID09PSAxKTtcbiAgICB9ICApO1xuICAgIFxuICAgIC8vaWRlYWxseSB3ZSBjb3VsZCB1c2UgYXBwbHkgLSBidXQgaXQncyB0aHJvd2luZyBzb21lIGVycm9yIFxuICAgIC8vdmFyIGRhdGUgPSBuZXcgKCBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5hcHBseSggRGF0ZSAsIFtudWxsXS5jb25jYXQoIGNhbGRhdGUgKSApICk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCAgY2FsZGF0ZVswXSwgY2FsZGF0ZVsxXSwgY2FsZGF0ZVsyXSwgaG91cnNNaW51dGVzWzBdLCBob3Vyc01pbnV0ZXNbMV0gKTsgXG59XG4gICAgICAgIFxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmpzLXJvb20tcmVzLWZvcm0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgUm9vbVJlc0Zvcm0odGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBTZWFyY2hib3ggQmVoYXZpb3JcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0IFxuXHQvLyBHbG9iYWwgdmFyaWFibGVzXG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcblx0XHRFTlRFUiA9IDEzLCBUQUIgPSA5LCBTSElGVCA9IDE2LCBDVFJMID0gMTcsIEFMVCA9IDE4LCBDQVBTID0gMjAsIEVTQyA9IDI3LCBMQ01EID0gOTEsIFJDTUQgPSA5MiwgTEFSUiA9IDM3LCBVQVJSID0gMzgsIFJBUlIgPSAzOSwgREFSUiA9IDQwLFxuXHRcdGZvcmJpZGRlbktleXMgPSBbRU5URVIsIFRBQiwgQ1RSTCwgQUxULCBDQVBTLCBFU0MsIExDTUQsIFJDTUQsIExBUlIsIFVBUlIsIFJBUlIsIERBUlJdLFxuXHRcdGluZGV4TmFtZXMgPSB7XG5cdFx0XHR0aTogJ1RpdGxlJyxcblx0XHRcdGt3OiAnS2V5d29yZCcsXG5cdFx0XHRhdTogJ0F1dGhvcicsXG5cdFx0XHRzdTogJ1N1YmplY3QnXG5cdFx0fTtcblxuXHQvLyBFeHRlbmQgalF1ZXJ5IHNlbGVjdG9yXG5cdCQuZXh0ZW5kKCQuZXhwclsnOiddLCB7XG5cdFx0Zm9jdXNhYmxlOiBmdW5jdGlvbihlbCwgaW5kZXgsIHNlbGVjdG9yKXtcblx0XHRcdHJldHVybiAkKGVsKS5pcygnYSwgYnV0dG9uLCA6aW5wdXQsIFt0YWJpbmRleF0sIHNlbGVjdCcpO1xuXHRcdH1cblx0fSk7XG5cdFx0XG4gICAgdmFyIFNlYXJjaEF1dG9jb21wbGV0ZSA9IGZ1bmN0aW9uKGVsZW0pe1xuXHRcdFxuXHRcdHRoaXMuJGVsXHRcdFx0PSAkKGVsZW0pO1xuXHRcdHRoaXMuJGZvcm1cdFx0XHQ9IHRoaXMuJGVsLmZpbmQoJ2Zvcm0nKTtcblx0XHR0aGlzLiRpbnB1dCBcdFx0PSAkKGVsZW0pLmZpbmQoJy5jY2wtc2VhcmNoJyk7XG5cdFx0dGhpcy4kcmVzcG9uc2VcdFx0PSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtc2VhcmNoLXJlc3VsdHMnKTtcblx0XHR0aGlzLiRyZXNwb25zZUxpc3RcdD0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNlYXJjaC1yZXN1bHRzX19saXN0Jyk7XG5cdFx0dGhpcy4kcmVzcG9uc2VJdGVtcyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1zZWFyY2gtaXRlbScpO1xuXHRcdHRoaXMuJHJlc3VsdHNMaW5rXHQ9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1zZWFyY2gtcmVzdWx0c19fZm9vdGVyJyk7XG5cdFx0dGhpcy4kc2VhcmNoSW5kZXhcdD0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNlYXJjaC1pbmRleCcpO1xuXHRcdHRoaXMuJGluZGV4Q29udGFpblx0PSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtc2VhcmNoLWluZGV4LWNvbnRhaW5lcicgKTtcblx0XHR0aGlzLiRzZWFyY2hTY29wZVx0PSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtc2VhcmNoLWxvY2F0aW9uJyk7XG5cdFx0dGhpcy4kd29ybGRDYXRMaW5rXHQ9IG51bGw7XG5cdFx0XG5cdFx0Ly9jaGVjayB0byBzZWUgaWYgdGhpcyBzZWFyY2hib3ggaGFzIGxpdmVzZWFyY2ggZW5hYmxlZFxuXHRcdHRoaXMuJGFjdGl2YXRlTGl2ZVNlYXJjaFx0PSAkKHRoaXMuJGVsKS5kYXRhKCdsaXZlc2VhcmNoJyk7XG5cdFx0dGhpcy5sb2NhdGlvblR5cGVcdD0gICQoIHRoaXMuJHNlYXJjaFNjb3BlICkuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykuZGF0YSgnbG9jJyk7XHRcblx0XHRcblx0XHQvL2xpZ2h0Ym94IGVsZW1lbnRzXG5cdFx0dGhpcy4kbGlnaHRib3ggPSBudWxsO1xuXHRcdHRoaXMubGlnaHRib3hJc09uID0gZmFsc2U7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIFxuICAgIH07XG5cbiAgICBTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgXHRcbiAgICBcdFxuICAgIFx0aWYoIHRoaXMuJGFjdGl2YXRlTGl2ZVNlYXJjaCApe1xuXHRcdFx0Ly9pZiBsaXZlc2VhcmNoIGlzIGVuYWJsZWQsIHRoZW4gcnVuIHRoZSBBSkFYIHJlc3VsdHNcblx0XHRcdHRoaXMuaW5pdExpdmVTZWFyY2goKTtcblx0XHRcbiAgICBcdH1lbHNle1xuXHRcdFx0Ly90aGVuIHNpbXBsZSBnZW5lcmF0ZSBnZW5lcmljIHNlYXJjaCBib3ggcmVxdWVzdHNcblx0XHRcdHRoaXMuaW5pdFN0YXRpY1NlYXJjaCgpO1xuICAgIFx0fVxuICAgIFx0XG5cdH07XG5cdFxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLnRvZ2dsZUluZGV4ID0gZnVuY3Rpb24oKXtcblx0XHRcblx0XHQvL3dhdGNoIGZvciBjaGFuZ2VzIHRvIHRoZSBsb2NhdGlvbiAtIGlmIG5vdCBhIFdNUyBzaXRlLCB0aGUgcmVtb3ZlIGluZGV4IGF0dHJpYnV0ZVxuXHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcblx0XHR0aGlzLiRzZWFyY2hTY29wZS5vbiggJ2NoYW5nZScsIGZ1bmN0aW9uKCl7XG5cdFx0XHRcblx0XHRcdHRoYXQuZ2V0TG9jSUQoKTtcdFx0XHRcdFxuXHRcdFx0XG5cdFx0XHRpZiggdGhhdC5sb2NhdGlvblR5cGUgIT0gJ3dtcycgKXtcblx0XHRcdFx0dGhhdC4kaW5kZXhDb250YWluXG5cdFx0XHRcdFx0LmFkZENsYXNzKCdjY2wtc2VhcmNoLWluZGV4LWZhZGUnKVxuXHRcdFx0XHRcdC5mYWRlT3V0KDI1MCk7XG5cdFx0XHR9ZWxzZSBpZiggdGhhdC5sb2NhdGlvblR5cGUgPT0gJ3dtcycgKXtcblx0XHRcdFx0dGhhdC4kaW5kZXhDb250YWluXG5cdFx0XHRcdFx0LmZhZGVJbigyNTApXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdjY2wtc2VhcmNoLWluZGV4LWZhZGUnKTtcblxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fSApO1xuXHRcdFx0XG5cdH07XG5cdFxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmdldExvY0lEID0gZnVuY3Rpb24oKXtcblx0XHQvL2Z1bmN0aW9uIHRvIGdldCB0aGUgSUQgb2YgbG9jYXRpb25cblx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0dGhhdC5sb2NhdGlvblR5cGUgPSAkKCB0aGF0LiRzZWFyY2hTY29wZSApLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmF0dHIoJ2RhdGEtbG9jJyk7XG5cdFx0XG5cdFx0Ly9jb25zb2xlLmxvZyggdGhhdC5sb2NhdGlvblR5cGUgKTtcblx0fTtcblxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmluaXRMaXZlU2VhcmNoID0gZnVuY3Rpb24oKXtcblxuXHRcdC8vQUpBWCBldmVudCB3YXRjaGluZyBmb3IgdXNlciBpbnB1dCBhbmQgb3V0cHV0dGluZyBzdWdnZXN0ZWQgcmVzdWx0c1xuXHRcdHZhciB0aGF0ID0gdGhpcyxcblx0XHRcdHRpbWVvdXQ7XG5cdFx0XG5cdFx0dGhpcy5pbml0TGlnaHRCb3goKTtcblx0XHR0aGlzLnRvZ2dsZUluZGV4KCk7XG5cdFx0XG5cdFx0Ly9rZXlib2FyZCBldmVudHMgZm9yIHNlbmRpbmcgcXVlcnkgdG8gZGF0YWJhc2Vcblx0XHR0aGlzLiRpbnB1dFxuXHRcdFx0Lm9uKCdrZXl1cCcsIGZ1bmN0aW9uIChldmVudCkge1xuXG5cdFx0XHRcdC8vIGNsZWFyIGFueSBwcmV2aW91cyBzZXQgdGltZW91dFxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGhhdC50aW1lb3V0KTtcblxuXHRcdFx0XHQvLyBpZiBrZXkgaXMgZm9yYmlkZGVuLCByZXR1cm5cblx0XHRcdFx0aWYgKCBmb3JiaWRkZW5LZXlzLmluZGV4T2YoIGV2ZW50LmtleUNvZGUgKSA+IC0xICkge1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vIGdldCB2YWx1ZSBvZiBzZWFyY2ggaW5wdXRcblx0XHRcdFx0dmFyIHF1ZXJ5ID0gdGhhdC4kaW5wdXQudmFsKCk7XG5cdFx0XHRcdC8vcmVtb3ZlIGRvdWJsZSBxdW90YXRpb25zIGFuZCBvdGhlciBjaGFyYWN0ZXJzIGZyb20gc3RyaW5nXG5cdFx0XHRcdHF1ZXJ5ID0gcXVlcnkucmVwbGFjZSgvW15hLXpBLVowLTkgLScuLEA6XS9nLCBcIlwiKTtcblxuXHRcdFx0XHQvLyBzZXQgYSB0aW1lb3V0IGZ1bmN0aW9uIHRvIHVwZGF0ZSByZXN1bHRzIG9uY2UgNjAwbXMgcGFzc2VzXG5cdFx0XHRcdHRoYXQudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0aWYgKCBxdWVyeS5sZW5ndGggPiAxICkge1xuXHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHQvL3NldCB0aGlzIHZlcmlhYmxlIGhlcmUgY3V6IHdlIGFyZSBnb2luZyB0byBuZWVkIGl0IGxhdGVyXG5cdFx0XHRcdFx0XHR0aGF0LmdldExvY0lEKCk7XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR0aGF0LiRyZXNwb25zZS5zaG93KCk7XG5cdFx0XHRcdFx0IFx0dGhhdC5mZXRjaFJlc3VsdHMoIHF1ZXJ5ICk7XG5cdFx0XHRcdFx0IFx0XG5cdFx0XHRcdFx0IFx0XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0dGhhdC4kcmVzcG9uc2VMaXN0Lmh0bWwoJycpO1xuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9LCAzMDApO1xuXG5cdFx0XHR9KVxuXHRcdFx0LmZvY3VzKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGlmICggdGhhdC4kaW5wdXQudmFsKCkgIT09ICcnICkge1xuXHRcdFx0XHRcdHRoYXQuJHJlc3BvbnNlLnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0fSlcblx0XHRcdC5ibHVyKGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0JChkb2N1bWVudCkub24oJ2NsaWNrJywgX29uQmx1cnJlZENsaWNrKTtcblx0XHRcdH0pO1xuXHRcdFxuXHRcdGZ1bmN0aW9uIF9vbkJsdXJyZWRDbGljayhldmVudCkge1xuXHRcdFx0XG5cdFx0XHRpZiAoICEgJC5jb250YWlucyggdGhhdC4kZWxbMF0sIGV2ZW50LnRhcmdldCApICkge1xuXHRcdFx0XHR0aGF0LiRyZXNwb25zZS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRcdFx0XHRcblx0XHRcdCQoZG9jdW1lbnQpLm9mZignY2xpY2snLCBfb25CbHVycmVkQ2xpY2spO1xuXG5cdFx0fVx0XHRcblxuXHRcdC8vc2VuZCBxdWVyeSB0byBkYXRhYmFzZSBiYXNlZCBvbiBvcHRpb24gY2hhbmdlXG5cdFx0dGhpcy4kc2VhcmNoSW5kZXguYWRkKHRoaXMuJHNlYXJjaFNjb3BlKS5jaGFuZ2UoZnVuY3Rpb24oKXtcblx0XHRcdHRoYXQub25TZWFyY2hJbmRleENoYW5nZSgpO1xuXHRcdH0pO1xuXHRcdFxuXHRcdC8vb24gc3VibWl0IGZpcmUgb2ZmIGNhdGFsb2cgc2VhcmNoIHRvIFdNU1xuXHRcdHRoaXMuJGZvcm0ub24oJ3N1Ym1pdCcsICB7dGhhdDogdGhpcyB9ICwgdGhhdC5oYW5kbGVTdWJtaXQgKTtcblx0XHRcdFxuXHR9O1xuXHRcblx0U2VhcmNoQXV0b2NvbXBsZXRlLnByb3RvdHlwZS5pbml0U3RhdGljU2VhcmNoID0gZnVuY3Rpb24oKXtcblx0XHQvL2lmIHN0YXRpYywgbm8gQUpBWCB3YXRjaGluZywgaW4gdGhpcyBjYXNlIC0ganVzdCBsb29raW5nIGZvciBzdWJtaXNzaW9uc1xuXHRcdHZhciB0aGF0ID0gdGhpcztcblx0XHRcblx0XHR0aGlzLnRvZ2dsZUluZGV4KCk7XG5cdFx0XG5cdFx0Ly9vbiBzdWJtaXQgZmlyZSBvZmYgY2F0YWxvZyBzZWFyY2ggdG8gV01TXG5cdFx0dGhpcy4kZm9ybS5vbignc3VibWl0JywgIHt0aGF0OiB0aGlzIH0gLCB0aGF0LmhhbmRsZVN1Ym1pdCApO1x0XHRcblx0XHRcblx0fTtcblx0XG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuaGFuZGxlU3VibWl0ID0gZnVuY3Rpb24oZXZlbnQpe1xuXHRcdHZhciB0aGF0ID0gZXZlbnQuZGF0YS50aGF0O1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFxuXHRcdFx0aWYodGhhdC4kYWN0aXZhdGVMaXZlU2VhcmNoKXtcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KHRoYXQudGltZW91dCk7XHRcdFx0XHRcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0Ly9nZXQgc2VhcmNoIGluZGV4IGFuZCBpbnB1dCB2YWx1ZVxuXHRcdFx0dmFyIHNlYXJjaEluZGV4ID0gdGhhdC4kc2VhcmNoSW5kZXgudmFsKCk7XG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSB0aGF0LiRpbnB1dC52YWwoKTtcblx0XHRcdFxuXHRcdFx0Ly9jaGVjayBsb2NhdGlvbiB0eXBlXG5cdFx0XHR0aGF0LmdldExvY0lEKCk7XG5cdFx0XHRcblx0XHRcdC8vaWYgdGhpcyBVUkwgaXMgZm9yIFdNUywgdGhlbiBhcHBlbmQgdGhlIHNlYXJjaGluZGV4IHRvIGl0LCBpZiBub3QsIHRoZW4gc2VudCBxdWVyeVN0cmluZyBvbmx5XG5cdFx0XHQvL3NldHVwIGFycmF5IGZvciBjb25zdHJ1Y3RTZWFyY2hVUkwoKVxuXHRcdFx0dmFyIGlucHV0T2JqZWN0ID0ge307XG5cdFx0XHRpbnB1dE9iamVjdC5xdWVyeVN0cmluZ1x0PSAodGhhdC5sb2NhdGlvblR5cGUgPT09ICd3bXMnKSA/ICBzZWFyY2hJbmRleCArIFwiOlwiICsgcXVlcnlTdHJpbmcgOiBxdWVyeVN0cmluZztcblx0XHRcdGlucHV0T2JqZWN0LnNlYXJjaFNjb3BlXHQ9IHRoYXQuJHNlYXJjaFNjb3BlLnZhbCgpO1xuXG5cdFx0XHQvL2lmIHF1ZXJ5IHN0cmluZyBoYXMgY29udGVudCwgdGhlbiBydW5cblx0XHRcdGlmICggcXVlcnlTdHJpbmcubGVuZ3RoID4gMSApIHtcblxuXHRcdFx0XHR2YXIgd21zQ29uc3RydWN0ZWRVcmwgPSB0aGF0LmNvbnN0cnVjdFNlYXJjaFVSTChpbnB1dE9iamVjdCk7XG5cdFx0XHRcdFxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKCB3bXNDb25zdHJ1Y3RlZFVybCApO1xuXHRcdFx0XHRcblx0XHRcdFx0aWYoIHRoYXQubG9jYXRpb25UeXBlID09PSAnd3BfY2NsJyApe1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHdpbmRvdy5vcGVuKHdtc0NvbnN0cnVjdGVkVXJsLCAnX3NlbGYnKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQkKHdpbmRvdykudW5sb2FkKCBmdW5jdGlvbigpe1xuXG5cdFx0XHRcdFx0XHR0aGF0LiRzZWFyY2hTY29wZS5wcm9wKCAnc2VsZWN0ZWRJbmRleCcsIDAgKTtcblx0XHRcdFx0XHR9KTtcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XG5cdFx0XHRcdH1lbHNle1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHdpbmRvdy5vcGVuKHdtc0NvbnN0cnVjdGVkVXJsLCAnX2JsYW5rJyk7XHRcdFx0XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdCAgIH1lbHNle1xuXHRcdCAgIFx0XG5cdFx0ICAgXHRyZXR1cm47XG5cdFx0ICAgXHRcblx0XHQgICB9XHRcdFxuXHR9O1xuXG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuZmV0Y2hSZXN1bHRzID0gZnVuY3Rpb24oIHF1ZXJ5ICkge1xuXHRcdC8vc2VuZCBBSkFYIHJlcXVlc3QgdG8gUEhQIGZpbGUgaW4gV1Bcblx0XHR2YXIgdGhhdCA9IHRoaXMsXG5cdFx0XHRkYXRhID0ge1xuXHRcdFx0XHRzIDogcXVlcnksXG5cdFx0XHR9O1xuXG5cdFx0dGhhdC4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG5cblx0XHQkLmdldChDQ0wuYXBpLnNlYXJjaCwgZGF0YSlcblx0XHRcdC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHR0aGF0LmhhbmRsZVJlc3BvbnNlKHJlc3BvbnNlKTtcblx0XHRcdH0pXG5cdFx0XHQuYWx3YXlzKGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHRoYXQuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuXHRcdFx0fSk7XG5cblx0fTtcblxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmhhbmRsZVJlc3BvbnNlID0gZnVuY3Rpb24oIHJlc3BvbnNlICkge1xuXHRcdFxuXHRcdC8vUHJvY2VzcyB0aGUgcmVzdWx0cyBmcm9tIHRoZSBBUEkgcXVlcnkgYW5kIGdlbmVyYXRlIEhUTUwgZm9yIGRpc3BwbGF5XG5cdFx0XG5cdFx0Y29uc29sZS5sb2coIHJlc3BvbnNlICk7XG5cdFx0XG5cdFx0dmFyIHRoYXQgPSB0aGlzLFxuXHRcdFx0cmVzdWx0cyA9IHJlc3BvbnNlLFxuXHRcdFx0Y291bnQgPSByZXN1bHRzLmNvdW50LFxuXHRcdFx0cXVlcnkgPSByZXN1bHRzLnF1ZXJ5LFxuXHRcdFx0cG9zdHMgPSByZXN1bHRzLnBvc3RzLFxuXHRcdFx0c2VhcmNoSW5kZXggPSAgJCggdGhhdC4kaW5kZXhDb250YWluICkuaXMoJzp2aXNpYmxlJykgPyB0aGF0LiRzZWFyY2hJbmRleC52YWwoKSA6ICdrdycsXG5cdFx0XHRzZWFyY2hJbmRleE5pY2VuYW1lID0gaW5kZXhOYW1lc1tzZWFyY2hJbmRleF0sXG5cdFx0XHRzZWFyY2hTY29wZURhdGEgPSAkKCB0aGF0LiRzZWFyY2hTY29wZSApLFxuXHRcdFx0cmVuZGVyZWRSZXNwb25zZVx0PSBbXTtcblx0XHRcdFxuXHRcdC8vIHdyYXAgcXVlcnlcblx0XHQvL3ZhciBxdWVyeVN0cmluZyA9IHNlYXJjaEluZGV4ICsgJzonICsgcXVlcnk7XG5cdFx0XG5cdFx0Ly9nZXQgd21zX3VybCBpbnB1dE9iamVjdCA9IHtxdWVyeVN0cmluZywgc2VhcmNoU2NvcGUsIGxvY2F0aW9uVHlwZX1cblx0XHR2YXIgaW5wdXRPYmplY3QgPSB7fTtcblx0XHRpbnB1dE9iamVjdC5xdWVyeVN0cmluZ1x0PSAodGhhdC5sb2NhdGlvblR5cGUgPT09ICd3bXMnKSA/ICBzZWFyY2hJbmRleCArIFwiOlwiICsgcXVlcnkgOiBxdWVyeTtcblx0XHRpbnB1dE9iamVjdC5zZWFyY2hTY29wZVx0PSB0aGF0LiRzZWFyY2hTY29wZS52YWwoKTtcblx0XHRcblx0XHQvL1VSTCBjcmVhdGVkIVxuXHRcdHZhciB3bXNDb25zdHJ1Y3RlZFVybCA9IHRoYXQuY29uc3RydWN0U2VhcmNoVVJMKGlucHV0T2JqZWN0KTtcblxuXHRcdC8vIENsZWFyIHJlc3BvbnNlIGFyZWEgbGlzdCBpdGVtcyAodXBkYXRlIHdoZW4gUGF0dGVybiBMaWJyYXJ5IHZpZXcgaXNuJ3QgbmVjZXNzYXJ5KVxuXHRcdHRoYXQuJHJlc3BvbnNlTGlzdC5odG1sKCcnKTtcblx0XHR0aGF0LiRyZXN1bHRzTGluay5yZW1vdmUoKTtcblx0XHRcblx0XHQvL2FkZCB0aGUgY2xvc2UgYnV0dG9uXG5cdFx0dmFyIHJlc3VsdHNDbG9zZSA9ICc8ZGl2IGNsYXNzPVwiY2NsLWMtc2VhcmNoLS1jbG9zZS1yZXN1bHRzXCI+JyArXG5cdFx0XHRcdFx0XHRcdCc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNjbC1iLWNsb3NlIGNjbC1jLXNlYXJjaC0tY2xvc2VfX2J1dHRvblwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFx0JzxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2J1dHRvbj4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JztcblxuXHRcdC8vIENyZWF0ZSBsaXN0IGl0ZW0gZm9yIFdvcmxkY2F0IHNlYXJjaC5cblx0XHR2YXIgbGlzdEl0ZW0gPSAgJzxhIGhyZWY9XCInKyB3bXNDb25zdHJ1Y3RlZFVybCArJ1wiIGNsYXNzPVwiY2NsLWMtc2VhcmNoLWl0ZW0gY2NsLWlzLWxhcmdlXCIgcm9sZT1cImxpc3RpdGVtXCIgdGFyZ2V0PVwiX2JsYW5rXCIgc3R5bGU9XCJib3JkZXI6bm9uZTtcIj4nICtcblx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwiY2NsLWMtc2VhcmNoLWl0ZW1fX3R5cGVcIj4nICtcblx0XHRcdFx0XHRcdFx0XHQnPGkgY2xhc3M9XCJjY2wtYi1pY29uIGJvb2tcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+JyArXG5cdFx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwiY2NsLWMtc2VhcmNoLWl0ZW1fX3R5cGUtdGV4dFwiPldvcmxkQ2F0PC9zcGFuPicgK1xuXHRcdFx0XHRcdFx0XHQnPC9zcGFuPicgK1xuXHRcdFx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XFxcImNjbC1jLXNlYXJjaC1pdGVtX190aXRsZVxcXCI+JyArXG5cdFx0XHRcdFx0XHRcdFx0J1NlYXJjaCBieSAnICsgc2VhcmNoSW5kZXhOaWNlbmFtZSArICcgZm9yICZsZHF1bzsnICsgcXVlcnkgKyAnJnJkcXVvOyBpbiAnKyBzZWFyY2hTY29wZURhdGEuZmluZCgnb3B0aW9uOnNlbGVjdGVkJykudGV4dCgpICsnICcgK1xuXHRcdFx0XHRcdFx0XHRcdCc8aSBjbGFzcz1cImNjbC1iLWljb24gYXJyb3ctcmlnaHRcIiBhcmlhLWhpZGRlbj1cInRydWVcIiBzdHlsZT1cInZlcnRpY2FsLWFsaWduOm1pZGRsZVwiPjwvaT4nICtcblx0XHRcdFx0XHRcdFx0Jzwvc3Bhbj4nK1xuXHRcdFx0XHRcdFx0JzwvYT4nO1xuXG5cdFx0XG5cdFx0Ly9hZGQgSFRNTCB0byB0aGUgcmVzcG9uc2UgYXJyYXlcblx0XHRyZW5kZXJlZFJlc3BvbnNlLnB1c2goIHJlc3VsdHNDbG9zZSwgbGlzdEl0ZW0gKTtcblxuXHRcdC8vIENyZWF0ZSBsaXN0IGl0ZW1zIGZvciBlYWNoIHBvc3QgaW4gcmVzdWx0c1xuXHRcdGlmICggY291bnQgPiAwICkge1xuXG5cdFx0XHQvLyBDcmVhdGUgYSBzZXBhcmF0b3IgYmV0d2VlbiB3b3JsZGNhdCBhbmQgb3RoZXIgcmVzdWx0c1xuXHRcdFx0dmFyIHNlcGFyYXRvciA9ICc8c3BhbiBjbGFzcz1cImNjbC1jLXNlYXJjaC1pdGVtIGNjbC1pcy1zZXBhcmF0b3JcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+JyArXG5cdFx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVxcXCJjY2wtYy1zZWFyY2gtaXRlbV9fdGl0bGVcXFwiPicgK1xuXHRcdFx0XHRcdFx0XHRcdFx0JzxpIGNsYXNzPVwiY2NsLWItaWNvbiBhcnJvdy1kb3duXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPicgK1xuXHRcdFx0XHRcdFx0XHRcdFx0JyBPdGhlciBzdWdnZXN0ZWQgcmVzb3VyY2VzIGZvciAmbGRxdW87JyArIHF1ZXJ5ICsgJyZyZHF1bzsnICtcblx0XHRcdFx0XHRcdFx0XHQnPC9zcGFuPicgK1xuXHRcdFx0XHRcdFx0XHQnPC9zcGFuPic7XG5cblx0XHRcdC8vYWRkIEhUTUwgdG8gcmVzcG9uc2UgYXJyYXlcblx0XHRcdHJlbmRlcmVkUmVzcG9uc2UucHVzaCggc2VwYXJhdG9yICk7XG5cblx0XHRcdC8vIEJ1aWxkIHJlc3VsdHMgbGlzdFxuXHRcdFx0cG9zdHMuZm9yRWFjaChmdW5jdGlvbiAocG9zdCkge1xuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhwb3N0KTtcblxuXHRcdFx0XHR2YXIgY3RhLFxuXHRcdFx0XHRcdHRhcmdldDtcblxuXHRcdFx0XHRzd2l0Y2goIHBvc3QudHlwZSApIHtcblx0XHRcdFx0XHRjYXNlICdCb29rJzpcblx0XHRcdFx0XHRjYXNlICdGQVEnOlxuXHRcdFx0XHRcdGNhc2UgJ1Jlc2VhcmNoIEd1aWRlJzpcblx0XHRcdFx0XHRjYXNlICdKb3VybmFsJzpcblx0XHRcdFx0XHRjYXNlICdEYXRhYmFzZSc6XG5cdFx0XHRcdFx0XHRjdGEgPSAnVmlldyc7XG5cdFx0XHRcdFx0XHR0YXJnZXQgPSAnX2JsYW5rJztcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ0xpYnJhcmlhbic6XG5cdFx0XHRcdFx0Y2FzZSAnU3RhZmYnOlxuXHRcdFx0XHRcdFx0Y3RhID0gJ0NvbnRhY3QnO1xuXHRcdFx0XHRcdFx0dGFyZ2V0ID0gJ19ibGFuayc7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHRcdFx0Y3RhID0gJ1ZpZXcnO1xuXHRcdFx0XHRcdFx0dGFyZ2V0ID0gJ19zZWxmJztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGxpc3RJdGVtID0gICc8YSBocmVmPVwiJyArIHBvc3QubGluayArICdcIiBjbGFzcz1cImNjbC1jLXNlYXJjaC1pdGVtXCIgcm9sZT1cImxpc3RpdGVtXCIgdGFyZ2V0PVwiJyArIHRhcmdldCArICdcIj4nICtcblx0XHRcdFx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XFxcImNjbC1jLXNlYXJjaC1pdGVtX190eXBlXFxcIj4nICtcblx0XHRcdFx0XHRcdFx0XHRcdCc8aSBjbGFzcz1cImNjbC1iLWljb24gJyArIHBvc3QuaWNvbiArICdcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+JyArXG5cdFx0XHRcdFx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJjY2wtYy1zZWFyY2gtaXRlbV9fdHlwZS10ZXh0XCI+JyArIHBvc3QudHlwZSArICc8L3NwYW4+JyArXG5cdFx0XHRcdFx0XHRcdFx0Jzwvc3Bhbj4nICtcblx0XHRcdFx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJjY2wtYy1zZWFyY2gtaXRlbV9fdGl0bGVcIj4nICsgcG9zdC50aXRsZSArICc8L3NwYW4+JyArXG5cdFx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwiY2NsLWMtc2VhcmNoLWl0ZW1fX2N0YVwiPicgK1xuXHRcdFx0XHRcdFx0XHRcdFx0JzxzcGFuPicgKyBjdGEgKyAnIDxpIGNsYXNzPVwiY2NsLWItaWNvbiBhcnJvdy1yaWdodFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246bWlkZGxlXCI+PC9pPjwvc3Bhbj4nICtcblx0XHRcdFx0XHRcdFx0XHQnPC9zcGFuPicgK1xuXHRcdFx0XHRcdFx0XHQnPC9hPic7XG5cdFx0XHRcdFxuXHRcdFx0XHQvL2FkZCBIVE1MIHRvIHRoZSByZXNwb25zZSBhcnJheVxuXHRcdFx0XHRyZW5kZXJlZFJlc3BvbnNlLnB1c2goIGxpc3RJdGVtICk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gQnVpbGQgcmVzdWx0cyBjb3VudC9saW5rXG5cdFx0XHRsaXN0SXRlbSA9ICc8ZGl2IGNsYXNzPVwiY2NsLWMtc2VhcmNoLXJlc3VsdHNfX2Zvb3RlclwiPicgK1xuXHRcdFx0XHRcdFx0XHRcdCc8YSBocmVmPVwiLz9zPScgKyBxdWVyeSArICdcIiBjbGFzcz1cImNjbC1jLXNlYXJjaC1yZXN1bHRzX19hY3Rpb25cIj4nICtcblx0XHRcdFx0XHRcdFx0XHRcdCdWaWV3IGFsbCAnICsgY291bnQgKyAnIFJlc3VsdHMgJyArXG5cdFx0XHRcdFx0XHRcdFx0XHQnPGkgY2xhc3M9XCJjY2wtYi1pY29uIGFycm93LXJpZ2h0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPicgK1xuXHRcdFx0XHRcdFx0XHRcdCc8L2E+JyArXG5cdFx0XHRcdFx0XHQnPC9kaXY+JztcblxuXHRcdFx0Ly9hZGQgSFRNTCB0byB0aGUgcmVzcG9uc2UgYXJyYXlcblx0XHRcdHJlbmRlcmVkUmVzcG9uc2UucHVzaCggbGlzdEl0ZW0gKTtcblx0XHRcblx0XHR9XG5cdFx0XG5cdFx0Ly9hcHBlbmQgYWxsIHJlc3BvbnNlIGRhdGEgYWxsIGF0IG9uY2Vcblx0XHR0aGF0LiRyZXNwb25zZUxpc3QuYXBwZW5kKCByZW5kZXJlZFJlc3BvbnNlICk7XG5cdFx0XG5cdFx0Ly9jYWNoZSB0aGUgcmVzcG9uc2UgYnV0dG9uIGFmdGVyIGl0cyBhZGRlZCB0byB0aGUgRE9NXG5cdFx0dGhhdC4kcmVzcG9uc2VDbG9zZVx0PSB0aGF0LiRlbC5maW5kKCcuY2NsLWMtc2VhcmNoLS1jbG9zZV9fYnV0dG9uJyk7XHRcdFxuXHRcdFxuXHRcdC8vY2xpY2sgZXZlbnQgdG8gY2xvc2UgdGhlIHJlc3VsdHMgcGFnZVxuXHRcdHRoYXQuJHJlc3BvbnNlQ2xvc2Uub24oICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcblx0XHRcdFx0Ly9oaWRlXG5cdFx0XHRcdGlmKCAkKCB0aGF0LiRyZXNwb25zZSApLmlzKCc6dmlzaWJsZScpICl7XG5cdFx0XHRcdFx0dGhhdC4kcmVzcG9uc2UuaGlkZSgpO1x0XG5cdFx0XHRcdFx0dGhhdC5kZXN0cm95TGlnaHRCb3goKTtcblx0XHRcdFx0fVxuXHRcdH0pO1xuXHRcdFxuXHRcdFxuXHR9O1xuXG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUub25TZWFyY2hJbmRleENoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdC8vb24gY2hhbmdlcyB0byB0aGUgbG9jYXRpb24gb3IgYXR0cmlidXRlIGluZGV4IG9wdGlvbiwgd2lsbCB3YXRjaCBhbmQgcnVuIGZldGNoUmVzdWx0c1xuXHRcdHZhciBxdWVyeSA9IHRoaXMuJGlucHV0LnZhbCgpO1xuXG5cdFx0aWYgKCAhIHF1ZXJ5Lmxlbmd0aCApIHtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhpcy4kcmVzcG9uc2Uuc2hvdygpO1x0XHRcblx0XHR0aGlzLmZldGNoUmVzdWx0cyggcXVlcnkgKTtcblx0fTtcblx0XG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuY29uc3RydWN0U2VhcmNoVVJMID0gZnVuY3Rpb24oaW5wdXRPYmplY3Qpe1xuXHRcdC8vY29uc3RydWN0cyBVUkwgd2l0aCBwYXJhbWV0ZXJzIGZyb21cblx0XHQvL2lucHV0T2JqZWN0ID0geyBxdWVyeVN0cmluZywgc2VhcmNoU2NvcGUsIFNlYXJjaExvY2F0aW9uIH1cblx0XHRcblx0XHQvL2RlZmluZSB2YXJpYWJsZXNcblx0XHR2YXIgcXVlcnlTdHJpbmcsIHNlYXJjaFNyYywgc2VhcmNoU2NvcGVLZXksIHJlbmRlcmVkVVJMO1xuXHRcdFxuXHRcdHF1ZXJ5U3RyaW5nIFx0PSBpbnB1dE9iamVjdC5xdWVyeVN0cmluZztcblx0XHRzZWFyY2hTcmNcdFx0PSBpbnB1dE9iamVjdC5zZWFyY2hTY29wZTtcblxuXHRcdFxuXHRcdHN3aXRjaCAoIHRoaXMubG9jYXRpb25UeXBlKSB7XG5cdFx0XHRjYXNlICd3bXMnOlxuXHRcdFx0XHQvL2NoZWNrIGlmIHNlYXJjaCBsb2NhdGlvbiBpcyBhIHNjb3BlZCBzZWFyY2ggbG9jYXRpb25cblx0XHRcdFx0aWYoIHNlYXJjaFNyYy5tYXRjaCgvOjp6czovKSApe1xuXHRcdFx0XHRcdHNlYXJjaFNjb3BlS2V5ID0gJ3N1YnNjb3BlJztcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0c2VhcmNoU2NvcGVLZXkgPSAnc2NvcGUnO1xuXHRcdFx0XHR9XG5cdCAgICAgICAgICAgIC8vYnVpbGQgdGhlIFVSTFxuXHQgICAgICAgICAgICB2YXIgd21zX3BhcmFtcyA9IHtcblx0ICAgICAgICAgICAgICAgIHNvcnRLZXkgICAgICAgICA6ICdMSUJSQVJZJyxcblx0ICAgICAgICAgICAgICAgIGRhdGFiYXNlTGlzdCAgICA6ICcnLFxuXHQgICAgICAgICAgICAgICAgcXVlcnlTdHJpbmcgICAgIDogcXVlcnlTdHJpbmcsXG5cdCAgICAgICAgICAgICAgICBGYWNldCAgICAgICAgICAgOiAnJyxcblx0ICAgICAgICAgICAgICAgIC8vc2NvcGUgYWRkZWQgYmVsb3dcblx0ICAgICAgICAgICAgICAgIC8vZm9ybWF0IGFkZGVkIGJlbG93XG5cdCAgICAgICAgICAgICAgICBmb3JtYXRcdFx0XHQ6ICdhbGwnLFxuXHQgICAgICAgICAgICAgICAgZGF0YWJhc2UgICAgICAgIDogICdhbGwnLFxuXHQgICAgICAgICAgICAgICAgYXV0aG9yICAgICAgICAgIDogJycsXG5cdCAgICAgICAgICAgICAgICB5ZWFyICAgICAgICAgICAgOiAnYWxsJyxcblx0ICAgICAgICAgICAgICAgIHllYXJGcm9tICAgICAgICA6ICcnLFxuXHQgICAgICAgICAgICAgICAgeWVhclRvICAgICAgICAgIDogJycsXG5cdCAgICAgICAgICAgICAgICBsYW5ndWFnZSAgICAgICAgOiAnYWxsJyxcblx0ICAgICAgICAgICAgICAgIHRvcGljICAgICAgICAgICA6ICcnXG5cdCAgICAgICAgICAgIH07XG5cdCAgICAgICAgICAgIFxuXHQgICAgICAgICAgICB3bXNfcGFyYW1zW3NlYXJjaFNjb3BlS2V5XSA9IHNlYXJjaFNyYztcblx0ICAgICAgICAgICAgXG5cdCAgICAgICAgICAgIHJlbmRlcmVkVVJMID0gJ2h0dHBzOi8vY2NsLm9uLndvcmxkY2F0Lm9yZy9zZWFyY2g/JyArICQucGFyYW0od21zX3BhcmFtcyk7XG5cdFx0ICAgICAgICByZW5kZXJlZFVSTCA9IHJlbmRlcmVkVVJMLnJlcGxhY2UoICclMjYnLCBcIiZcIiApO1x0XHRcdFx0XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcblx0XHRcdGNhc2UgJ29hYyc6XG5cdFx0XHRcdFxuXHRcdFx0XHRyZW5kZXJlZFVSTCA9ICdodHRwOi8vd3d3Lm9hYy5jZGxpYi5vcmcvc2VhcmNoP3F1ZXJ5PScgKyBxdWVyeVN0cmluZyArICcmaW5zdGl0dXRpb249Q2xhcmVtb250K0NvbGxlZ2VzJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmVuZGVyZWRVUkwgPSBDQ0wuc2l0ZV91cmwgKyAnP3M9JyArIHF1ZXJ5U3RyaW5nO1xuXHRcdH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh3bXNfdXJsKTtcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gcmVuZGVyZWRVUkw7XG5cblx0fTtcblx0XG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuaW5pdExpZ2h0Qm94ID0gZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgdGhhdCA9IHRoaXMsXG5cdFx0XHRkZXN0cm95VGltZW91dCA9IDA7XG5cdFx0XG5cdFx0dGhpcy4kZWxcblx0XHRcdC5vbiggJ2ZvY3VzaW4nLCAnOmZvY3VzYWJsZScsIGZ1bmN0aW9uKGV2ZW50KXtcblxuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHQvLyBjbGVhciB0aW1lb3V0IGJlY2F1c2Ugd2UncmUgc3RpbGwgaW5zaWRlIHRoZSBzZWFyY2hib3hcblx0XHRcdFx0aWYgKCBkZXN0cm95VGltZW91dCApIHtcblx0XHRcdFx0XHRjbGVhclRpbWVvdXQoZGVzdHJveVRpbWVvdXQpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKCAhIHRoYXQubGlnaHRib3hJc09uICl7XG5cblx0XHRcdFx0XHR0aGF0LmNyZWF0ZUxpZ2h0Qm94KGV2ZW50KTtcblxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0fSlcblx0XHRcdC5vbiggJ2ZvY3Vzb3V0JywgJzpmb2N1c2FibGUnLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdFxuXHRcdFx0XHQvLyBzZXQgYSBzaG9ydCB0aW1lb3V0IHNvIHRoYXQgb3RoZXIgZnVuY3Rpb25zIGNhbiBjaGVjayBhbmQgY2xlYXIgaWYgbmVlZCBiZVxuXHRcdFx0XHRkZXN0cm95VGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblxuXHRcdFx0XHRcdHRoYXQuZGVzdHJveUxpZ2h0Qm94KCk7XG5cdFx0XHRcdFx0dGhhdC4kcmVzcG9uc2UuaGlkZSgpO1xuXG5cdFx0XHRcdH0sIDEwMCk7XG5cblx0XHRcdH0pO1xuXG5cdFx0dGhpcy4kcmVzcG9uc2Vcblx0XHRcdC5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXG5cdFx0XHRcdC8vIGNsZWFyIGRlc3Ryb3kgdGltZW91dCBiZWNhdXNlIHdlJ3JlIHN0aWxsIGluc2lkZSB0aGUgc2VhcmNoYm94XG5cdFx0XHRcdGlmICggZGVzdHJveVRpbWVvdXQgKSB7XG5cdFx0XHRcdFx0Y2xlYXJUaW1lb3V0KGRlc3Ryb3lUaW1lb3V0KTtcblx0XHRcdFx0fVxuXG5cdFx0XHR9KTtcblxuXHR9O1xuXG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuY3JlYXRlTGlnaHRCb3ggPSBmdW5jdGlvbihldmVudCkge1xuXG5cdFx0dGhpcy5saWdodGJveElzT24gPSB0cnVlO1xuXHRcdFx0XHRcdFxuXHRcdHRoaXMuJGVsLmFkZENsYXNzKCdpcy1saWdodGJveGVkJyk7XG5cdFx0dGhpcy4kbGlnaHRib3ggPSAkKCc8ZGl2IGNsYXNzPVwiY2NsLWMtbGlnaHRib3hcIj4nKS5hcHBlbmRUbygnYm9keScpO1xuXHRcdHZhciBzZWFyY2hCb3hUb3AgPSB0aGlzLiRlbC5vZmZzZXQoKS50b3AgLSAxMjggKyAncHgnO1xuXHRcdHZhciB0YXJnZXRUb3AgPSAkKGV2ZW50LnRhcmdldCkub2Zmc2V0KCkudG9wIC0gMTI4ICsgJ3B4Jztcblx0XHRcblx0XHQvLyBwcmV2ZW50cyB0aGUgc2Nyb2xsYmFyIGZyb20ganVtcGluZyBpZiB0aGUgdXNlciBpcyB0YWJiaW5nIGJlbG93IHRoZSBmb2xkXG5cdFx0Ly8gaWYgdGhlIHNlYXJjaGJveCBhbmQgdGhlIHRhcmdldCBhcmUgdGhlIHNhbWUgLSB0aGVuIGl0IHdpbGwganVtcCwgaWYgbm90LCBcblx0XHQvLyB0aGVuIGl0IHdvbid0IGp1bXBcblx0XHRpZiAoIHNlYXJjaEJveFRvcCA9PSB0YXJnZXRUb3AgKXtcblx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBzZWFyY2hCb3hUb3AgfSApO1x0XHRcdFx0XHRcdFxuXHRcdH1cdFx0XG5cblx0fTtcblxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmRlc3Ryb3lMaWdodEJveCA9IGZ1bmN0aW9uKCkge1xuXHRcdGlmICggdGhpcy4kbGlnaHRib3ggKSB7XG5cdFx0XHR0aGlzLiRsaWdodGJveC5yZW1vdmUoKTtcblx0XHRcdHRoaXMuJGxpZ2h0Ym94ID0gbnVsbDtcblx0XHRcdHRoaXMuJGVsLnJlbW92ZUNsYXNzKCdpcy1saWdodGJveGVkJyk7XG5cdFx0XHR0aGlzLmxpZ2h0Ym94SXNPbiA9IGZhbHNlO1xuXHRcdFx0XG5cdFx0fVxuXHR9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0XHQvLyAuZWFjaCgpIHdpbGwgZmFpbCBncmFjZWZ1bGx5IGlmIG5vIGVsZW1lbnRzIGFyZSBmb3VuZFxuXHRcdCQoJy5jY2wtanMtc2VhcmNoLWZvcm0nKS5lYWNoKGZ1bmN0aW9uKCl7XG5cdFx0XHRuZXcgU2VhcmNoQXV0b2NvbXBsZXRlKHRoaXMpO1xuXHRcdH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKlxuICogU2xpZGVUb2dnbGVcbiAqIFxuICogIHRhYnMgZm9yIGhpZGluZyBhbmQgc2hvd2luZyBhZGRpdGlvbmFsIGNvbnRlbnRcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIHNsaWRlVG9nZ2xlTGlzdCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgICAgICAgICAgICAgICAgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kc2xpZGVUb2dnbGVMaW5rICAgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtc2xpZGVUb2dnbGVfX3RpdGxlJyk7XG4gICAgICAgIHRoaXMuJHRvZ2dsZUNvbnRhaW5lciAgID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNsaWRlVG9nZ2xlX19jb250YWluZXInKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBzbGlkZVRvZ2dsZUxpc3QucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoYXQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kc2xpZGVUb2dnbGVMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2dCl7XG4gICAgICAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIC8vZ2V0IHRoZSB0YXJnZXQgdG8gYmUgb3BlbmVkXG4gICAgICAgICAgICB2YXIgY2xpY2tJdGVtID0gJCh0aGlzKTtcbiAgICAgICAgICAgIC8vZ2V0IHRoZSBkYXRhIHRhcmdldCB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoaXMgbGlua1xuICAgICAgICAgICAgdmFyIHRhcmdldF9jb250ZW50ID0gY2xpY2tJdGVtLmF0dHIoJ2RhdGEtdG9nZ2xlVGl0bGUnKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9hZGQgdGhlIGFjdGl2ZSBjbGFzcyBzbyB3ZSBjYW4gZG8gc3R5bGluZ3MgYW5kIHRyYW5zaXRpb25zXG4gICAgICAgICAgICBjbGlja0l0ZW1cbiAgICAgICAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKVxuICAgICAgICAgICAgICAgIC5zaWJsaW5ncygpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAvL3RvZ2dsZSBhcmlhXG4gICAgICAgICAgICBpZiAoY2xpY2tJdGVtLmF0dHIoICdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJykge1xuICAgICAgICAgICAgICAgICAgICAkKGNsaWNrSXRlbSkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKGNsaWNrSXRlbSkuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAndHJ1ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICAvL2xvY2F0ZSB0aGUgdGFyZ2V0IGVsZW1lbnQgYW5kIHNsaWRldG9nZ2xlIGl0XG4gICAgICAgICAgICBfdGhhdC4kdG9nZ2xlQ29udGFpbmVyXG4gICAgICAgICAgICAgICAgLmZpbmQoICdbZGF0YS10b2dnbGVUYXJnZXQ9XCInICsgdGFyZ2V0X2NvbnRlbnQgKyAnXCJdJyApXG4gICAgICAgICAgICAgICAgLnNsaWRlVG9nZ2xlKCdmYXN0Jyk7XG4gICAgICAgICAgICAgICAgLy90b2dnbGUgYXJpYS1leHBhbmRlZFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy90b2dnbGUgYXJpYVxuICAgICAgICAgICAgaWYgKF90aGF0LiR0b2dnbGVDb250YWluZXIuYXR0ciggJ2FyaWEtZXhwYW5kZWQnKSA9PT0gJ3RydWUnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoX3RoYXQuJHRvZ2dsZUNvbnRhaW5lcikuYXR0ciggJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKF90aGF0LiR0b2dnbGVDb250YWluZXIpLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWMtc2xpZGVUb2dnbGUnKS5lYWNoKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IHNsaWRlVG9nZ2xlTGlzdCh0aGlzKTsgICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU21vb3RoIFNjcm9sbGluZ1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXG4gICAgICAgICQoJy5qcy1zbW9vdGgtc2Nyb2xsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9zZXQgdG8gYmx1clxuICAgICAgICAgICAgJCh0aGlzKS5ibHVyKCk7ICAgICAgICAgICAgICBcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHRhcmdldCA9ICQodGhpcykuZGF0YSgndGFyZ2V0JykgfHwgJCh0aGlzKS5hdHRyKCdocmVmJyksXG4gICAgICAgICAgICAgICAgJHRhcmdldCA9ICQodGFyZ2V0KSxcbiAgICAgICAgICAgICAgICBzY3JvbGxPZmZzZXQgPSAwO1xuXG4gICAgICAgICAgICAkKCcuY2NsLWMtcXVpY2stbmF2JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHNjcm9sbE9mZnNldCArPSAkKHRoaXMpLm91dGVySGVpZ2h0KCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgaWYgKCAkdGFyZ2V0Lmxlbmd0aCApIHtcbiAgICAgICAgICAgICAgICB2YXIgdGFyZ2V0VG9wID0gJHRhcmdldC5vZmZzZXQoKS50b3A7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoIHsgXG4gICAgICAgICAgICAgICAgICAgICdzY3JvbGxUb3AnOiB0YXJnZXRUb3AgLSBzY3JvbGxPZmZzZXQgfSwgXG4gICAgICAgICAgICAgICAgICAgIDgwMCApO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogU3RpY2tpZXNcbiAqIFxuICogQmVoYXZpb3VyIGZvciBzdGlja3kgZWxlbWVudHMuXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBpc0ZpeGVkOiAnY2NsLWlzLWZpeGVkJ1xuICAgICAgICB9O1xuXG4gICAgdmFyIFN0aWNreSA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICAvLyB2YXJpYWJsZXNcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpLFxuICAgICAgICAgICAgaGVpZ2h0ID0gJGVsLm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICBvZmZzZXQgPSAkZWwub2Zmc2V0KCksXG4gICAgICAgICAgICBvcHRpb25zID0gJGVsLmRhdGEoJ3N0aWNreScpLFxuICAgICAgICAgICAgd3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJqcy1zdGlja3ktd3JhcHBlclwiPjwvZGl2PicpLmNzcyh7IGhlaWdodDogaGVpZ2h0ICsgJ3B4JyB9KTtcblxuICAgICAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgfTtcblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zICk7XG5cbiAgICAgICAgLy8gd3JhcCBlbGVtZW50XG4gICAgICAgICRlbC53cmFwKCB3cmFwcGVyICk7XG5cbiAgICAgICAgLy8gc2Nyb2xsIGxpc3RlbmVyXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgMTAwICkgKTtcblxuICAgICAgICAvLyBvbiBzY3JvbGxcbiAgICAgICAgZnVuY3Rpb24gX29uU2Nyb2xsKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKSArIG9wdGlvbnMub2Zmc2V0O1xuICAgIFxuICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gb2Zmc2V0LnRvcCApIHtcbiAgICAgICAgICAgICAgICAkZWwuYWRkQ2xhc3MoIGNsYXNzTmFtZS5pc0ZpeGVkICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLmlzRml4ZWQgKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1pcy1zdGlja3knKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU3RpY2t5KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogVG9nZ2xlIFNjaG9vbHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIHNjaG9vbCB0b2dnbGVzXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIGluaXRTY2hvb2wgPSAkKCdodG1sJykuZGF0YSgnc2Nob29sJyk7XG5cbiAgICB2YXIgU2Nob29sU2VsZWN0ID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kc2VsZWN0ID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgU2Nob29sU2VsZWN0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgc2Nob29sID0gZ2V0Q29va2llKCAnY2NsLXNjaG9vbCcgKTtcblxuICAgICAgICBpZiAoIGluaXRTY2hvb2wgKSB7XG5cbiAgICAgICAgICAgIHRoaXMuJHNlbGVjdFxuICAgICAgICAgICAgICAgIC5maW5kKCAnb3B0aW9uW3ZhbHVlPVwiJyArIHNjaG9vbCArICdcIl0nIClcbiAgICAgICAgICAgICAgICAuYXR0ciggJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyApO1xuXG4gICAgICAgIFx0aWYgKCBzY2hvb2wgKSB7XG4gICAgICAgIFx0XHQgJCgnaHRtbCcpLmF0dHIoJ2RhdGEtc2Nob29sJywgc2Nob29sKTtcblx0XHRcdH1cblxuXHRcdH1cblxuICAgICAgICB0aGlzLiRzZWxlY3QuY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hdHRyKCAnZGF0YS1zY2hvb2wnLCBldmVudC50YXJnZXQudmFsdWUgKTtcblxuICAgICAgICAgICAgZXJhc2VDb29raWUoICdjY2wtc2Nob29sJyApO1xuICAgICAgICAgICAgc2V0Q29va2llKCAnY2NsLXNjaG9vbCcsIGV2ZW50LnRhcmdldC52YWx1ZSwgNyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvLyBDb29raWUgZnVuY3Rpb25zIGxpZnRlZCBmcm9tIFN0YWNrIE92ZXJmbG93IGZvciBub3dcbiAgICAvLyBodHRwczovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy8xNDU3MzIyMy9zZXQtY29va2llLWFuZC1nZXQtY29va2llLXdpdGgtamF2YXNjcmlwdFxuXHRmdW5jdGlvbiBzZXRDb29raWUobmFtZSwgdmFsdWUsIGRheXMpIHtcblx0XHR2YXIgZXhwaXJlcyA9IFwiXCI7XG5cdFx0aWYgKGRheXMpIHtcblx0XHRcdHZhciBkYXRlID0gbmV3IERhdGUoKTtcblx0XHRcdGRhdGUuc2V0VGltZShkYXRlLmdldFRpbWUoKSArIChkYXlzICogMjQgKiA2MCAqIDYwICogMTAwMCkpO1xuXHRcdFx0ZXhwaXJlcyA9IFwiOyBleHBpcmVzPVwiICsgZGF0ZS50b1VUQ1N0cmluZygpO1xuXHRcdH1cblx0XHRkb2N1bWVudC5jb29raWUgPSBuYW1lICsgXCI9XCIgKyAodmFsdWUgfHwgXCJcIikgKyBleHBpcmVzICsgXCI7IHBhdGg9L1wiO1xuXHR9XG5cblx0ZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcblx0XHR2YXIgbmFtZUVRID0gbmFtZSArIFwiPVwiO1xuXHRcdHZhciBjYSA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2EubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBjID0gY2FbaV07XG5cdFx0XHR3aGlsZSAoYy5jaGFyQXQoMCkgPT09ICcgJykgYyA9IGMuc3Vic3RyaW5nKDEsIGMubGVuZ3RoKTtcblx0XHRcdGlmIChjLmluZGV4T2YobmFtZUVRKSA9PT0gMCkgcmV0dXJuIGMuc3Vic3RyaW5nKG5hbWVFUS5sZW5ndGgsIGMubGVuZ3RoKTtcblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRmdW5jdGlvbiBlcmFzZUNvb2tpZShuYW1lKSB7XG5cdFx0ZG9jdW1lbnQuY29va2llID0gbmFtZSArICc9OyBNYXgtQWdlPS05OTk5OTk5OTsnO1xuXHR9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJzY2hvb2xcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU2Nob29sU2VsZWN0KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIFRvb2x0aXBzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciB0b29sdGlwc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgVG9vbHRpcCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy4kZWwuYXR0cigndGl0bGUnKTtcbiAgICAgICAgdGhpcy4kdG9vbHRpcCA9ICQoJzxkaXYgaWQ9XCJjY2wtY3VycmVudC10b29sdGlwXCIgY2xhc3M9XCJjY2wtYy10b29sdGlwIGNjbC1pcy10b3BcIiByb2xlPVwidG9vbHRpcFwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19hcnJvd1wiPjwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19pbm5lclwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBUb29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuaG92ZXIoZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIC8vIG1vdXNlb3ZlclxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCAnJyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cignYXJpYS1kZXNjcmliZWRieScsICdjY2wtY3VycmVudC10b29sdGlwJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblxuICAgICAgICAgICAgQ0NMLnJlZmxvdyhfdGhpcy4kdG9vbHRpcFswXSk7XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBfdGhpcy4kZWwub2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgd2lkdGggID0gX3RoaXMuJGVsLm91dGVyV2lkdGgoKSxcbiAgICAgICAgICAgICAgICB0b29sdGlwSGVpZ2h0ID0gX3RoaXMuJHRvb2x0aXAub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuY3NzKHtcbiAgICAgICAgICAgICAgICB0b3A6IChvZmZzZXQudG9wIC0gdG9vbHRpcEhlaWdodCkgKyAncHgnLFxuICAgICAgICAgICAgICAgIGxlZnQ6IChvZmZzZXQubGVmdCArICh3aWR0aC8yKSkgKyAncHgnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgIH0sIGZ1bmN0aW9uKGUpeyBcblxuICAgICAgICAgICAgLy9tb3VzZW91dFxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCBfdGhpcy5jb250ZW50KTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgJycpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlKCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBUb29sdGlwKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogV2F5ZmluZGluZ1xuICogXG4gKiBDb250cm9scyBpbnRlcmZhY2UgZm9yIGxvb2tpbmcgdXAgY2FsbCBudW1iZXIgbG9jYXRpb25zXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICB0YWJzLCB3YXlmaW5kZXI7XG4gICAgXG4gICAgdmFyIFRhYnMgPSBmdW5jdGlvbihlbCkge1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdGFicyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy10YWInKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMgPSAkKCcuY2NsLWMtdGFiX19jb250ZW50Jyk7XG4gICAgICAgIFxuXG4gICAgICAgIHRoaXMuJHRhYnMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICR0YWIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHRhYi5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICR0YWIuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0QWN0aXZlKHRhcmdldCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFRhYnMucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKHRhcmdldCl7XG4gICAgICAgIHRoaXMuJHRhYnMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFicy5maWx0ZXIoJ1tocmVmPVwiJyt0YXJnZXQrJ1wiXScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIHZhciBXYXlmaW5kZXIgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuY2FsbE51bWJlcnMgPSB7fTtcbiAgICAgICAgdGhpcy4kZm9ybSA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bWJlci1zZWFyY2gnKTtcbiAgICAgICAgdGhpcy4kaW5wdXQgPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW0taW5wdXQnKTtcbiAgICAgICAgdGhpcy4kc3VibWl0ID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtLXN1Ym1pdCcpO1xuICAgICAgICB0aGlzLiRtYXJxdWVlID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fbWFycXVlZScpO1xuICAgICAgICB0aGlzLiRjYWxsTnVtID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fY2FsbC1udW0nKTtcbiAgICAgICAgdGhpcy4kd2luZyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX3dpbmcnKTtcbiAgICAgICAgdGhpcy4kZmxvb3IgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19mbG9vcicpO1xuICAgICAgICB0aGlzLiRzdWJqZWN0ID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fc3ViamVjdCcpO1xuICAgICAgICB0aGlzLmVycm9yID0ge1xuICAgICAgICAgICAgZ2V0OiAnPGRpdiBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvciBjY2wtd2F5ZmluZGVyX19lcnJvclwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2NsLWItY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPjxzcGFuIGNsYXNzPVwiY2NsLWItaWNvbiBhbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gVGhlcmUgd2FzIGFuIGVycm9yIGZldGNoaW5nIGNhbGwgbnVtYmVycy48L2Rpdj4nLFxuICAgICAgICAgICAgZmluZDogJzxkaXYgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3IgY2NsLXdheWZpbmRlcl9fZXJyb3JcIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNjbC1iLWNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj48c3BhbiBjbGFzcz1cImNjbC1iLWljb24gYWxlcnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IENvdWxkIG5vdCBmaW5kIHRoYXQgY2FsbCBudW1iZXIuIFBsZWFzZSB0cnkgYWdhaW4uPC9kaXY+J1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRlcnJvckJveCA9ICQoJy5jY2wtZXJyb3ItYm94Jyk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAkLmdldEpTT04oIENDTC5hc3NldHMgKyAnanMvY2FsbC1udW1iZXJzLmpzb24nIClcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIF90aGlzLmNhbGxOdW1iZXJzID0gZGF0YTtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGVycm9yQm94LmFwcGVuZCggdGhpcy5lcnJvci5nZXQgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1hcHAtYWN0aXZlJyk7XG5cbiAgICAgICAgdGhpcy4kaW5wdXRcbiAgICAgICAgICAgIC5rZXl1cChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHF1ZXJ5ID09PSBcIlwiICkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3VibWl0LmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRtYXJxdWVlLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVzZXQoKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGZvcm0uc3VibWl0KGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBfdGhpcy5yZXNldCgpO1xuXG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBfdGhpcy4kaW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgICQoJy5jY2wtd2F5ZmluZGVyX19lcnJvcicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuc2hvdygpO1xuICAgICAgICAgICAgX3RoaXMuJGNhbGxOdW0udGV4dChxdWVyeSk7XG4gICAgICAgICAgICBfdGhpcy5maW5kUm9vbSggcXVlcnkgKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5nZXRDYWxsS2V5ID0gZnVuY3Rpb24oY2FsbE51bSkge1xuICAgICAgICBjYWxsTnVtID0gY2FsbE51bS5yZXBsYWNlKC8gL2csICcnKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBrZXksXG4gICAgICAgICAgICBjYWxsS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuY2FsbE51bWJlcnMpO1xuXG4gICAgICAgIGlmICggY2FsbEtleXMubGVuZ3RoID09PSAwICl7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjYWxsS2V5cy5mb3JFYWNoKGZ1bmN0aW9uKGspe1xuICAgICAgICAgICAgdmFyIGtfbm9TcGFjZXMgPSBrLnJlcGxhY2UoLyAvZywgJycpO1xuXG4gICAgICAgICAgICBpZiAoIGNhbGxOdW0gPj0ga19ub1NwYWNlcyApIHtcbiAgICAgICAgICAgICAgICBrZXkgPSBrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmZpbmRSb29tID0gZnVuY3Rpb24ocXVlcnkpIHtcblxuICAgICAgICBxdWVyeSA9IHF1ZXJ5LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBjYWxsS2V5ID0gdGhpcy5nZXRDYWxsS2V5KHF1ZXJ5KSxcbiAgICAgICAgICAgIGNhbGxEYXRhID0ge30sXG4gICAgICAgICAgICBmbG9vcklkLCByb29tSWQ7XG5cbiAgICAgICAgaWYgKCAhIGNhbGxLZXkgKSB7XG4gICAgICAgICAgICB0aGlzLnRocm93RmluZEVycm9yKCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkKCdodG1sLCBib2R5JykuYW5pbWF0ZSh7IHNjcm9sbFRvcDogJCgnLmNjbC1jLXNlYXJjaCcpLm9mZnNldCgpLnRvcCB9KTtcbiAgICAgICAgXG4gICAgICAgIGNhbGxEYXRhID0gdGhpcy5jYWxsTnVtYmVyc1tjYWxsS2V5XTtcblxuICAgICAgICB0aGlzLiRmbG9vci50ZXh0KCBjYWxsRGF0YS5mbG9vciApO1xuICAgICAgICB0aGlzLiR3aW5nLnRleHQoIGNhbGxEYXRhLndpbmcgKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdC50ZXh0KCBjYWxsRGF0YS5zdWJqZWN0ICk7XG5cbiAgICAgICAgZmxvb3JJZCA9IGNhbGxEYXRhLmZsb29yX2ludDtcbiAgICAgICAgcm9vbUlkID0gY2FsbERhdGEucm9vbV9pbnQ7IC8vIHdpbGwgYmUgaW50ZWdlciBPUiBhcnJheVxuXG4gICAgICAgIC8vIE1ha2UgZmxvb3Ivcm9vbSBhY3RpdmVcblxuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWY9XCIjZmxvb3ItJytmbG9vcklkKydcIl0nKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuXG4gICAgICAgIGlmICggdHlwZW9mIHJvb21JZCAhPT0gJ251bWJlcicgKSB7XG4gICAgICAgICAgICAvLyBpZiByb29tSWQgaXMgYXJyYXlcbiAgICAgICAgICAgIHJvb21JZC5mb3JFYWNoKGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5maW5kKCcjcm9vbS0nK2Zsb29ySWQrJy0nK2lkKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyBpZiByb29tSWQgaXMgbnVtYmVyXG4gICAgICAgICAgICB0aGlzLiRlbC5maW5kKCcjcm9vbS0nK2Zsb29ySWQrJy0nK3Jvb21JZCkuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFNldCBjb3JyZXNwb25kaW5nIGFjdGl2ZSBmbG9vciB0YWJcblxuICAgICAgICB0YWJzLnNldEFjdGl2ZSggJyNmbG9vci0nICsgZmxvb3JJZCApO1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUudGhyb3dGaW5kRXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdC50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiRlcnJvckJveC5hcHBlbmQoIHRoaXMuZXJyb3IuZmluZCApO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWpzLXRhYnMnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0YWJzID0gbmV3IFRhYnModGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuY2NsLWpzLXdheWZpbmRlcicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHdheWZpbmRlciA9IG5ldyBXYXlmaW5kZXIodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIl19
