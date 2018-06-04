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
    	this.$focusable = this.$el.find( ':focusable' );

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
			
			_this.getLocID();				
			
			if( _this.locationType != 'wms' ){
				_this.$indexContain
					.addClass('ccl-search-index-fade')
					.fadeOut(250);
			}else if( _this.locationType == 'wms' ){
				_this.$indexContain
					.fadeIn(250)
					.removeClass('ccl-search-index-fade');

			}
			
		} );
			
	};
	
	SearchAutocomplete.prototype.getLocID	= function(){
		//function to get the ID of location
		var _this = this;
		_this.locationType = $( _this.$searchScope ).find('option:selected').attr('data-loc');
		
		//console.log( _this.locationType );
	};

	SearchAutocomplete.prototype.isLiveSearch = function(){
		//AJAX event watching for user input and outputting suggested results
		var _this = this,
			timeout;
		
		this.createLightBox();
		this.toggleIndex();
		
		//keyboard events for sending query to database
		this.$input
			.on('keyup keypress', function (event) {

				// clear any previous set timeout
				clearTimeout(_this.timeout);

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
				_this.timeout = setTimeout(function () {

					if ( query.length > 1 ) {

						//set this veriable here cuz we are going to need it later
						_this.getLocID();						
						_this.$response.show();
					 	_this.fetchResults( query );
					 	
					 	
					}
					else {
						_this.$responseList.html('');
					}

				}, 200);

			})
			.focus(function(){
				if ( _this.$input.val() != '' ) {
					_this.$response.show();
				}
				//_this.createLightBox();
			})
			.blur(function(event){
				$(document).on('click', _onBlurredClick);
			});
		
		function _onBlurredClick(event) {
			
			if ( ! $.contains( _this.$el[0], event.target ) ) {
				_this.$response.hide();
			}
			
			//_this.destroyLightBox();
			
			$(document).off('click', _onBlurredClick);

		}		

		//send query to database based on option change
		this.$searchIndex.add(this.$searchScope).change(function(){
			_this.onSearchIndexChange();
		});
		
		//on submit fire off catalog search to WMS
		this.$form.on('submit',  {_this: this } , _this.handleSubmit );
			
	};
	
	SearchAutocomplete.prototype.isStaticSearch = function(){
		//if static, no AJAX watching, in this case - just looking for submissions
		var _this = this;
		
		this.toggleIndex();
		
		//on submit fire off catalog search to WMS
		this.$form.on('submit',  {_this: this } , _this.handleSubmit );		
		
	};
	
	SearchAutocomplete.prototype.handleSubmit = function(event){
		var _this = event.data._this;
			event.preventDefault();
			
			if(_this.$activateLiveSearch){
				clearTimeout(_this.timeout);				
			}
			
			//get search index and input value
			var searchIndex = _this.$searchIndex.val();
			var queryString = _this.$input.val();
			
			//check location type
			_this.getLocID();
			
			//if this URL is for WMS, then append the searchindex to it, if not, then sent queryString only
			//setup array for constructSearchURL()
			var input_array = [];
			input_array['queryString']	= (_this.locationType === 'wms') ?  searchIndex + ":" + queryString : queryString;
			input_array['searchScope']	= _this.$searchScope.val();

			//if query string has content, then run
			if ( queryString.length > 1 ) {

				var wmsConstructedUrl = _this.constructSearchURL(input_array);
				
				//console.log( wmsConstructedUrl );
				
				if( _this.locationType === 'wp_ccl' ){
					
					window.open(wmsConstructedUrl, '_self');
					
					$(window).unload( function(){

						_this.$searchScope.prop( 'selectedIndex', 0 );
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
		var _this = this,
			data = {
				s : query,
			};

		_this.$el.addClass('ccl-is-loading');

		$.get(CCL.api.search, data)
			.done(function (response) {
				_this.handleResponse(response);
			})
			.always(function(){
				_this.$el.removeClass('ccl-is-loading');
			});

	};

	SearchAutocomplete.prototype.handleResponse = function( response ) {
		
		//Process the results from the API query and generate HTML for dispplay
		
		var _this = this,
			results = response,
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
					case 'Staff':
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
					_this.destroyLightBox();
				}
		});
		
		
		 _this.$focusable = this.$el.find( ':focusable' );

		
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
		//input_array = [queryString, searchScope, SearchLocation]
		
		//define variables
		var queryString, searchSrc, searchScopeKey, renderedURL;
		
		queryString 	= input_array['queryString'];
		searchSrc		= input_array['searchScope'];

		
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
	
	SearchAutocomplete.prototype.createLightBox = function() {
		var _this = this;

		
		this.$el
			.on( 'focusin', ':focusable', function(event){

				event.stopPropagation();

				if ( ! _this.lightboxIsOn ){
					
					_this.lightboxIsOn = true;
					
					_this.$el.addClass('is-lightboxed');
					_this.$lightbox = $('<div class="ccl-c-lightbox">').appendTo('body');
					var searchBoxTop = _this.$el.offset().top - 128 + 'px';
					var targetTop = $(event.target).offset().top - 128 + 'px';
					
					// prevents the scrollbar from jumping if the user is tabbing below the fold
					// if the searchbox and the target are the same - then it will jump, if not, 
					// then it won't jump
					if ( searchBoxTop == targetTop ){

						$('html, body').animate({ scrollTop: searchBoxTop } );						
					}

				}
				
			})

			.on( 'focusout', function(event){
				_this.destroyLightBox();

			} );		
		

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkYXRhYmFzZS1maWx0ZXJzLmpzIiwiZHJvcGRvd25zLmpzIiwiaGVhZGVyLW1lbnUtdG9nZ2xlcy5qcyIsIm1vZGFscy5qcyIsInBvc3Qtc2VhcmNoLmpzIiwicXVpY2stbmF2LmpzIiwicm9vbS1yZXMuanMiLCJzZWFyY2guanMiLCJzbGlkZS10b2dnbGUtbGlzdC5qcyIsInNtb290aC1zY3JvbGwuanMiLCJzdGlja2llcy5qcyIsInRvZ2dsZS1zY2hvb2xzLmpzIiwidG9vbHRpcHMuanMiLCJ3YXlmaW5kaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzV1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hnQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzVFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogR2xvYmFsIFZhcmlhYmxlcy4gXG4gKi9cblxuXG4oZnVuY3Rpb24gKCAkLCB3aW5kb3cgKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcbiAgICBcbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5EVVJBVElPTiA9IDMwMDtcblxuICAgIENDTC5CUkVBS1BPSU5UX1NNID0gNTAwO1xuICAgIENDTC5CUkVBS1BPSU5UX01EID0gNzY4O1xuICAgIENDTC5CUkVBS1BPSU5UX0xHID0gMTAwMDtcbiAgICBDQ0wuQlJFQUtQT0lOVF9YTCA9IDE1MDA7XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdodG1sJykudG9nZ2xlQ2xhc3MoJ25vLWpzIGpzJyk7XG4gICAgfSk7XG5cbn0pKGpRdWVyeSwgdGhpcyk7IiwiLyoqXG4gKiBSZWZsb3cgcGFnZSBlbGVtZW50cy4gXG4gKiBcbiAqIEVuYWJsZXMgYW5pbWF0aW9ucy90cmFuc2l0aW9ucyBvbiBlbGVtZW50cyBhZGRlZCB0byB0aGUgcGFnZSBhZnRlciB0aGUgRE9NIGhhcyBsb2FkZWQuXG4gKi9cblxuXG4oZnVuY3Rpb24gKCkge1xuXG4gICAgaWYgKCF3aW5kb3cuQ0NMKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wucmVmbG93ID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgcmV0dXJuIGVsZW1lbnQub2Zmc2V0SGVpZ2h0O1xuICAgIH07XG5cbn0pKCk7IiwiLyoqXG4gKiBHZXQgdGhlIFNjcm9sbGJhciB3aWR0aFxuICogVGhhbmtzIHRvIGRhdmlkIHdhbHNoOiBodHRwczovL2Rhdmlkd2Fsc2gubmFtZS9kZXRlY3Qtc2Nyb2xsYmFyLXdpZHRoXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG4gICAgXG4gICAgZnVuY3Rpb24gZ2V0U2Nyb2xsV2lkdGgoKSB7XG4gICAgICAgIFxuICAgICAgICAvLyBDcmVhdGUgdGhlIG1lYXN1cmVtZW50IG5vZGVcbiAgICAgICAgdmFyIHNjcm9sbERpdiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICAgIFxuICAgICAgICAvLyBwb3NpdGlvbiB3YXkgdGhlIGhlbGwgb2ZmIHNjcmVlblxuICAgICAgICAkKHNjcm9sbERpdikuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiAnMTAwcHgnLFxuICAgICAgICAgICAgaGVpZ2h0OiAnMTAwcHgnLFxuICAgICAgICAgICAgb3ZlcmZsb3c6ICdzY3JvbGwnLFxuICAgICAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXG4gICAgICAgICAgICB0b3A6ICctOTk5OXB4JyxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnYm9keScpLmFwcGVuZChzY3JvbGxEaXYpO1xuXG4gICAgICAgIC8vIEdldCB0aGUgc2Nyb2xsYmFyIHdpZHRoXG4gICAgICAgIHZhciBzY3JvbGxiYXJXaWR0aCA9IHNjcm9sbERpdi5vZmZzZXRXaWR0aCAtIHNjcm9sbERpdi5jbGllbnRXaWR0aDtcbiAgICAgICAgLy8gY29uc29sZS53YXJuKHNjcm9sbGJhcldpZHRoKTsgLy8gTWFjOiAgMTVcblxuICAgICAgICAvLyBEZWxldGUgdGhlIERJViBcbiAgICAgICAgJChzY3JvbGxEaXYpLnJlbW92ZSgpO1xuXG4gICAgICAgIHJldHVybiBzY3JvbGxiYXJXaWR0aDtcbiAgICB9XG4gICAgXG4gICAgaWYgKCAhIHdpbmRvdy5DQ0wgKSB7XG4gICAgICAgIHdpbmRvdy5DQ0wgPSB7fTtcbiAgICB9XG5cbiAgICBDQ0wuZ2V0U2Nyb2xsV2lkdGggPSBnZXRTY3JvbGxXaWR0aDtcbiAgICBDQ0wuU0NST0xMQkFSV0lEVEggPSBnZXRTY3JvbGxXaWR0aCgpO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiAuZGVib3VuY2UoKSBmdW5jdGlvblxuICogXG4gKiBTb3VyY2U6IGh0dHBzOi8vZGF2aWR3YWxzaC5uYW1lL2phdmFzY3JpcHQtZGVib3VuY2UtZnVuY3Rpb25cbiAqL1xuXG5cbihmdW5jdGlvbih3aW5kb3cpIHtcblxuICAgIC8vIFJldHVybnMgYSBmdW5jdGlvbiwgdGhhdCwgd2hlbiBpbnZva2VkLCB3aWxsIG9ubHkgYmUgdHJpZ2dlcmVkIGF0IG1vc3Qgb25jZVxuICAgIC8vIGR1cmluZyBhIGdpdmVuIHdpbmRvdyBvZiB0aW1lLiBOb3JtYWxseSwgdGhlIHRocm90dGxlZCBmdW5jdGlvbiB3aWxsIHJ1blxuICAgIC8vIGFzIG11Y2ggYXMgaXQgY2FuLCB3aXRob3V0IGV2ZXIgZ29pbmcgbW9yZSB0aGFuIG9uY2UgcGVyIGB3YWl0YCBkdXJhdGlvbjtcbiAgICAvLyBidXQgaWYgeW91J2QgbGlrZSB0byBkaXNhYmxlIHRoZSBleGVjdXRpb24gb24gdGhlIGxlYWRpbmcgZWRnZSwgcGFzc1xuICAgIC8vIGB7bGVhZGluZzogZmFsc2V9YC4gVG8gZGlzYWJsZSBleGVjdXRpb24gb24gdGhlIHRyYWlsaW5nIGVkZ2UsIGRpdHRvLlxuICAgIHZhciB0aHJvdHRsZSA9IGZ1bmN0aW9uIChmdW5jLCB3YWl0LCBvcHRpb25zKSB7XG4gICAgICAgIHZhciB0aW1lb3V0LCBjb250ZXh0LCBhcmdzLCByZXN1bHQ7XG4gICAgICAgIHZhciBwcmV2aW91cyA9IDA7XG4gICAgICAgIGlmICghb3B0aW9ucykgb3B0aW9ucyA9IHt9O1xuXG4gICAgICAgIHZhciBsYXRlciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHByZXZpb3VzID0gb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSA/IDAgOiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgcmVzdWx0ID0gZnVuYy5hcHBseShjb250ZXh0LCBhcmdzKTtcbiAgICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZhciB0aHJvdHRsZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgICAgICAgICBpZiAoIXByZXZpb3VzICYmIG9wdGlvbnMubGVhZGluZyA9PT0gZmFsc2UpIHByZXZpb3VzID0gbm93O1xuICAgICAgICAgICAgdmFyIHJlbWFpbmluZyA9IHdhaXQgLSAobm93IC0gcHJldmlvdXMpO1xuICAgICAgICAgICAgY29udGV4dCA9IHRoaXM7XG4gICAgICAgICAgICBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgaWYgKHJlbWFpbmluZyA8PSAwIHx8IHJlbWFpbmluZyA+IHdhaXQpIHtcbiAgICAgICAgICAgICAgICBpZiAodGltZW91dCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBwcmV2aW91cyA9IG5vdztcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgICAgIGlmICghdGltZW91dCkgY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICAgICAgfSBlbHNlIGlmICghdGltZW91dCAmJiBvcHRpb25zLnRyYWlsaW5nICE9PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGxhdGVyLCByZW1haW5pbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfTtcblxuICAgICAgICB0aHJvdHRsZWQuY2FuY2VsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgICAgICAgcHJldmlvdXMgPSAwO1xuICAgICAgICAgICAgdGltZW91dCA9IGNvbnRleHQgPSBhcmdzID0gbnVsbDtcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gdGhyb3R0bGVkO1xuICAgIH07XG5cbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIHdpbmRvdy5DQ0wudGhyb3R0bGUgPSB0aHJvdHRsZTtcblxufSkodGhpcyk7IiwiLyoqXG4gKiBBY2NvcmRpb25zXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBhY2NvcmRpb24gY29tcG9uZW50c1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgQWNjb3JkaW9uID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLiR0b2dnbGUgPSB0aGlzLiRlbC5jaGlsZHJlbignLmNjbC1jLWFjY29yZGlvbl9fdG9nZ2xlJyk7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQgPSB0aGlzLiRlbC5jaGlsZHJlbignLmNjbC1jLWFjY29yZGlvbl9fY29udGVudCcpO1xuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgQWNjb3JkaW9uLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICB0aGlzLiR0b2dnbGUub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBfdGhpcy4kY29udGVudC5zbGlkZVRvZ2dsZSgpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLnRvZ2dsZUNsYXNzKCdjY2wtaXMtb3BlbicpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWMtYWNjb3JkaW9uJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IEFjY29yZGlvbih0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIEFsZXJ0c1xuICogXG4gKiBCZWhhdmlvciBmb3IgYWxlcnRzXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIERVUkFUSU9OID0gQ0NMLkRVUkFUSU9OO1xuXG4gICAgdmFyIEFsZXJ0RGlzbWlzcyA9IGZ1bmN0aW9uKCRlbCl7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICRlbDtcbiAgICAgICAgdGhpcy50YXJnZXQgPSAkZWwucGFyZW50KCk7XG4gICAgICAgIHRoaXMuJHRhcmdldCA9ICQodGhpcy50YXJnZXQpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEFsZXJ0RGlzbWlzcy5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgX3RoaXMuJHRhcmdldC5hbmltYXRlKCB7IG9wYWNpdHk6IDAgfSwge1xuICAgICAgICAgICAgZHVyYXRpb246IERVUkFUSU9OLFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5zbGlkZVVwKCBEVVJBVElPTiwgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHRhcmdldC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG5cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCAnY2xpY2snLCAnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICB2YXIgZGlzbWlzc0VsID0gJChlLnRhcmdldCkuY2xvc2VzdCgnW2RhdGEtZGlzbWlzcz1cImFsZXJ0XCJdJyk7XG4gICAgICAgICAgICBuZXcgQWxlcnREaXNtaXNzKGRpc21pc3NFbCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICogQ2Fyb3VzZWxzXG4gKiBcbiAqIEluaXRpYWxpemUgYW5kIGRlZmluZSBiZWhhdmlvciBmb3IgY2Fyb3VzZWxzLiBcbiAqIFVzZXMgdGhlIFNsaWNrIFNsaWRlcyBqUXVlcnkgcGx1Z2luIC0tPiBodHRwOi8va2Vud2hlZWxlci5naXRodWIuaW8vc2xpY2svXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBDYXJvdXNlbCA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLmdsb2JhbERlZmF1bHRzID0ge1xuICAgICAgICAgICAgbW9iaWxlRmlyc3Q6IHRydWUsXG4gICAgICAgICAgICBkb3RzQ2xhc3M6ICdjY2wtYy1jYXJvdXNlbF9fcGFnaW5nJyxcbiAgICAgICAgICAgIGluZmluaXRlOiBmYWxzZSxcbiAgICAgICAgICAgIGRvdHM6IHRydWUsXG4gICAgICAgICAgICBzbGlkZXNUb1Njcm9sbDogMSxcbiAgICAgICAgICAgIHZhcmlhYmxlV2lkdGg6IHRydWVcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmluaXQoKTtcblxuICAgIH07XG5cbiAgICBDYXJvdXNlbC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuJGVsLmRhdGEoKSxcbiAgICAgICAgICAgIG9wdGlvbnMgPSBkYXRhLm9wdGlvbnMgfHwge307XG4gICAgICAgICAgICBcbiAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlID0gW107XG5cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNTbSApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9TTSwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc1NtXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc01kICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX01ELCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zTWRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zTGcgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfTEcsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNMZ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNYbCApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9YTCwgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc1hsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9wdGlvbnMgPSAkLmV4dGVuZCggdGhpcy5nbG9iYWxEZWZhdWx0cywgb3B0aW9ucyApO1xuXG4gICAgICAgIHZhciBjYXJvdXNlbCA9IHRoaXMuJGVsLnNsaWNrKG9wdGlvbnMpLFxuICAgICAgICAgICAgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIGNhcm91c2VsLm9uKCdiZWZvcmVDaGFuZ2UnLCBmdW5jdGlvbihldmVudCwgc2xpY2ssIGN1cnJlbnRTbGlkZSwgbmV4dFNsaWRlKXtcbiAgICAgICAgICAgIF90aGlzLiRlbC5maW5kKCcuc2xpY2stc2xpZGUnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXBhc3QnKTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5maW5kKCcuc2xpY2stc2xpZGVbZGF0YS1zbGljay1pbmRleD1cIicrbmV4dFNsaWRlKydcIl0nKS5wcmV2QWxsKCkuYWRkQ2xhc3MoJ2NjbC1pcy1wYXN0Jyk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtcHJvbW8tY2Fyb3VzZWwnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgQ2Fyb3VzZWwodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKlxuICogRGF0YWJhc2UgRmlsdGVyaW5nXG4gKiBcbiAqIEluaXRpYWxpemVzIGFuZCBkZWZpbmVzIHRoZSBiZWhhdmlvciBmb3IgZmlsdGVyaW5nIHVzaW5nIEpQTGlzdFxuICogaHR0cHM6Ly9qcGxpc3QuY29tL2RvY3VtZW50YXRpb25cbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIGRhdGFiYXNlRmlsdGVycyA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgICAgICAgICAgICAgICAgPSAkKCBlbCApO1xuICAgICAgICB0aGlzLnBhbmVsT3B0aW9ucyAgICAgICA9ICQoZWwpLmZpbmQoICcuY2NsLWMtZGF0YWJhc2UtZmlsdGVyX19wYW5lbCcgKTtcbiAgICAgICAgdGhpcy5uYW1lVGV4dGJveCAgICAgICAgPSAkKCBlbCApLmZpbmQoICdbZGF0YS1jb250cm9sLXR5cGU9XCJ0ZXh0Ym94XCJdJyApO1xuICAgICAgICB0aGlzLmRhdGFiYXNlX2Rpc3BsYXllZCA9ICQoIHRoaXMucGFuZWxPcHRpb25zICkuZmluZCgnLmNjbC1jLWRhdGFiYXNlX19kaXNwbGF5ZWQnKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZV9hdmFpbCAgICAgPSAkKCB0aGlzLnBhbmVsT3B0aW9ucyApLmZpbmQoJy5jY2wtYy1kYXRhYmFzZV9fYXZhaWwnKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZUNvbnRhaW5lciAgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtZGF0YWJhc2UtZmlsdGVyX19jb250YWluZXInKTtcbiAgICAgICAgdGhpcy5kYXRhYmFzZV9jb3VudCAgICAgPSAkKGVsKS5maW5kKCAnLmNjbC1jLWRhdGFiYXNlLWZpbHRlcl9fY291bnQnICk7XG4gICAgICAgIHRoaXMuZGF0YWJhc2VSZXNldCAgICAgID0gJChlbCkuZmluZCggJy5jY2wtYy1kYXRhYmFzZS1maWx0ZXItLXJlc2V0JyApO1xuICAgICAgICB0aGlzLnJ1blRpbWVzICAgICAgICAgICA9IDA7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgZGF0YWJhc2VGaWx0ZXJzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy4kZWwuanBsaXN0KHtcbiAgICAgICAgICAgIGl0ZW1zQm94ICAgICAgICA6ICcuY2NsLWMtZGF0YWJhc2UtZmlsdGVyX19jb250YWluZXInLCBcbiAgICAgICAgICAgIGl0ZW1QYXRoICAgICAgICA6ICcuY2NsLWMtZGF0YWJhc2UnLCBcbiAgICAgICAgICAgIHBhbmVsUGF0aCAgICAgICA6ICcuY2NsLWMtZGF0YWJhc2UtZmlsdGVyX19wYW5lbCcsXG4gICAgICAgICAgICBlZmZlY3QgICAgICAgICAgOiAnZmFkZScsXG4gICAgICAgICAgICBkdXJhdGlvbiAgICAgICAgOiAzMDAsXG4gICAgICAgICAgICByZWRyYXdDYWxsYmFjayAgOiBmdW5jdGlvbiggY29sbGVjdGlvbiwgJGRhdGF2aWV3LCBzdGF0dXNlcyApe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vY2hlY2sgZm9yIGluaXRpYWwgbG9hZFxuICAgICAgICAgICAgICAgIGlmKCBfdGhpcy5ydW5UaW1lcyA9PT0gMCApe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5ydW5UaW1lcysrO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47ICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy9nZXQgdGhlIHZhbHVlcyBvZiB0aGUgdXBkYXRlZCByZXN1bHRzLCBhbmQgdGhlIHRvdGFsIG51bWJlciBvZiBkYXRhYmFzZXMgd2Ugc3RhcnRlZCB3aXRoXG4gICAgICAgICAgICAgICAgdmFyIHVwZGF0ZWREYXRhYmFzZXMgPSAkZGF0YXZpZXcubGVuZ3RoO1xuICAgICAgICAgICAgICAgIHZhciBkZWZhdWx0RGF0YWJhc2VzID0gIHBhcnNlSW50KCBfdGhpcy5kYXRhYmFzZV9hdmFpbC50ZXh0KCksIDEwICk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vb24gb2NjYXNpb24sIHRoZSBwbHVnaW4gZ2l2ZXMgdXMgdGhlIHdyb25nIG51bWJlciBvZiBkYXRhYmFzZXMsIHRoaXMgd2lsbCBwcmV2ZW50IHRoaXMgZnJvbSBoYXBwZW5pbmdcbiAgICAgICAgICAgICAgICBpZiggdXBkYXRlZERhdGFiYXNlcyA+IGRlZmF1bHREYXRhYmFzZXMgICl7XG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZWREYXRhYmFzZXMgPSBkZWZhdWx0RGF0YWJhc2VzO1xuICAgICAgICAgICAgICAgICAgICAvL2hhcmRSZXNldCgpO1xuICAgICAgICAgICAgICAgICAgICAvL190aGlzLmRhdGFiYXNlUmVzZXQuc2hvdygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvL3VwZGF0ZSB0aGUgbnVtYmVyIG9mIHNob3duIGRhdGFiYXNlc1xuICAgICAgICAgICAgICAgIF90aGlzLmRhdGFiYXNlX2Rpc3BsYXllZC50ZXh0KCB1cGRhdGVkRGF0YWJhc2VzICk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy92aXN1YWwgZmVlZGJhY2sgZm9yIHVwZGF0aW5nIGRhdGFiYXNlc1xuICAgICAgICAgICAgICAgIF90aGlzLnB1bHNlVHdpY2UoIF90aGlzLmRhdGFiYXNlX2NvdW50ICk7XG4gICAgICAgICAgICAgICAgX3RoaXMucHVsc2VUd2ljZSggX3RoaXMuZGF0YWJhc2VDb250YWluZXIgKTtcblxuICAgICAgICAgICAgICAgLy9pZiBmaWx0ZXJzIGFyZSB1c2VkLCB0aGUgc2hvdyB0aGUgcmVzZXQgb3B0aW9uc1xuICAgICAgICAgICAgICAgIGlmKCB1cGRhdGVkRGF0YWJhc2VzICE9IGRlZmF1bHREYXRhYmFzZXMgKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGF0YWJhc2VSZXNldC5zaG93KCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRhdGFiYXNlUmVzZXQuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIFxuICAgICAgICBfdGhpcy5kYXRhYmFzZVJlc2V0Lm9uKCdjbGljaycsIGhhcmRSZXNldCApO1xuICAgICAgICAvL3RoZSByZXNldCBmdW5jdGlvbiBpcyBub3Qgd29ya2luZ1xuICAgICAgICAvL3RoaXMgaXMgYSBiaXQgb2YgYSBoYWNrLCBidXQgd2UgYXJlIHVzaW5nIHRyaWdnZXJzIGhlcmUgdG8gZG8gYSBoYXJkIHJlc2V0XG4gICAgICAgIGZ1bmN0aW9uIGhhcmRSZXNldCgpe1xuICAgICAgICAgICAgJCgnLmNjbC1jLWRhdGFiYXNlLWZpbHRlcl9fcGFuZWwnKS5maW5kKCdpbnB1dDpjaGVja2VkJykudHJpZ2dlcignY2xpY2snKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCAkKCcuY2NsLWMtZGF0YWJhc2UtZmlsdGVyX19wYW5lbCcpLmZpbmQoJ2lucHV0OmNoZWNrZWQnKSApO1xuICAgICAgICAgICAgJCggX3RoaXMubmFtZVRleHRib3ggKS52YWwoJycpLnRyaWdnZXIoJ2tleXVwJyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFxuICAgIGRhdGFiYXNlRmlsdGVycy5wcm90b3R5cGUucHVsc2VUd2ljZSA9IGZ1bmN0aW9uKCBlbCApe1xuICAgICAgICBlbC5hZGRDbGFzcygnY2NsLWMtZGF0YWJhc2UtZmlsdGVyLS1vbi1jaGFuZ2UnKTtcbiAgICAgICAgZWwub24oIFwid2Via2l0QW5pbWF0aW9uRW5kIG9hbmltYXRpb25lbmQgbXNBbmltYXRpb25FbmQgYW5pbWF0aW9uZW5kXCIsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkKGVsKS5yZW1vdmVDbGFzcygnY2NsLWMtZGF0YWJhc2UtZmlsdGVyLS1vbi1jaGFuZ2UnKTtcbiAgICAgICAgfSApO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgJCgnLmNjbC1kYXRhYmFzZS1maWx0ZXInKS5lYWNoKCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IGRhdGFiYXNlRmlsdGVycyggdGhpcyApOyAgICAgICAgICAgXG4gICAgICAgIH0gKTtcblxuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBEcm9wZG93bnNcbiAqIFxuICogSW5pdGlhbGl6ZSBhbmQgY29udHJvbCBiZWhhdmlvciBmb3IgZHJvcGRvd24gbWVudXNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIHNlbGVjdG9yID0ge1xuICAgICAgICAgICAgVE9HR0xFOiAnW2RhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIl0nLFxuICAgICAgICB9LFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBBQ1RJVkU6ICdjY2wtaXMtYWN0aXZlJyxcbiAgICAgICAgICAgIENPTlRFTlQ6ICdjY2wtYy1kcm9wZG93bl9fY29udGVudCdcbiAgICAgICAgfTtcblxuICAgIHZhciBEcm9wZG93blRvZ2dsZSA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHBhcmVudCA9IHRoaXMuJHRvZ2dsZS5wYXJlbnQoKTtcbiAgICAgICAgXG4gICAgICAgIHZhciB0YXJnZXQgPSB0aGlzLiR0b2dnbGUuZGF0YSgndGFyZ2V0Jyk7XG5cbiAgICAgICAgdGhpcy4kY29udGVudCA9ICQoIHRhcmdldCApO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHRvZ2dsZS5jbGljayggZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgX3RoaXMudG9nZ2xlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICB2YXIgaGFzQWN0aXZlTWVudXMgPSAkKCAnLicgKyBjbGFzc05hbWUuQ09OVEVOVCArICcuJyArIGNsYXNzTmFtZS5BQ1RJVkUgKS5sZW5ndGg7XG4gICAgICAgICAgICBpZiAoIGhhc0FjdGl2ZU1lbnVzICl7XG4gICAgICAgICAgICAgICAgX2NsZWFyTWVudXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIGlzQWN0aXZlID0gdGhpcy4kdG9nZ2xlLmhhc0NsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG5cbiAgICAgICAgaWYgKCBpc0FjdGl2ZSApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2hvd0NvbnRlbnQoKTtcblxuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUuc2hvd0NvbnRlbnQgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiR0b2dnbGUuYXR0cignYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQuYWRkQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgdGhpcy4kcGFyZW50LmFkZENsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5oaWRlTWVudSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgIHRoaXMuJGNvbnRlbnQucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgdGhpcy4kcGFyZW50LnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIF9jbGVhck1lbnVzKCkge1xuICAgICAgICAkKCcuY2NsLWMtZHJvcGRvd24sIC5jY2wtYy1kcm9wZG93bl9fY29udGVudCcpLnJlbW92ZUNsYXNzKCBjbGFzc05hbWUuQUNUSVZFICk7XG4gICAgICAgICQoIHNlbGVjdG9yLlRPR0dMRSApLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICB9XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCBzZWxlY3Rvci5UT0dHTEUgKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgRHJvcGRvd25Ub2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBIZWFkZXIgTWVudSBUb2dnbGVzXG4gKiBcbiAqIENvbnRyb2xzIGJlaGF2aW9yIG9mIG1lbnUgdG9nZ2xlcyBpbiB0aGUgaGVhZGVyXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBIZWFkZXJNZW51VG9nZ2xlID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy50YXJnZXQgPSB0aGlzLiRlbC5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIHRoaXMuJHBhcmVudE1lbnUgPSB0aGlzLiRlbC5jbG9zZXN0KCcuY2NsLWMtbWVudScpO1xuICAgICAgICB0aGlzLiRjbG9zZUljb24gPSAkKCc8c3BhbiBjbGFzcz1cImNjbC1iLWljb24gY2xvc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+Jyk7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIEhlYWRlck1lbnVUb2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcblxuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgLy8gaWYgdGhlIHRhcmdldCBpcyBhbHJlYWR5IG9wZW5cbiAgICAgICAgICAgIGlmICggdGhhdC4kdGFyZ2V0Lmhhc0NsYXNzKCdjY2wtaXMtYWN0aXZlJykgKSB7XG5cbiAgICAgICAgICAgICAgICAvLyBjbG9zZSB0YXJnZXQgYW5kIHJlbW92ZSBhY3RpdmUgY2xhc3Nlcy9lbGVtZW50c1xuICAgICAgICAgICAgICAgIHRoYXQuJHBhcmVudE1lbnUucmVtb3ZlQ2xhc3MoJ2NjbC1oYXMtYWN0aXZlLWl0ZW0nKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIHRoYXQuJHRhcmdldC5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpLmZhZGVPdXQoQ0NMLkRVUkFUSU9OKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRjbG9zZUljb24ucmVtb3ZlKCk7ICAgICAgIFxuXG4gICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICAvLyB0YXJnZXQgaXMgbm90IG9wZW5cbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgLy8gY2xvc2UgYW5kIHJlc2V0IGFsbCBhY3RpdmUgbWVudXNcbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtbWVudS5jY2wtaGFzLWFjdGl2ZS1pdGVtJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAucmVtb3ZlQ2xhc3MoJ2NjbC1oYXMtYWN0aXZlLWl0ZW0nKVxuICAgICAgICAgICAgICAgICAgICAgICAgLmZpbmQoJ2EuY2NsLWlzLWFjdGl2ZScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJylcbiAgICAgICAgICAgICAgICAgICAgICAgIC5maW5kKCcuY2NsLWItaWNvbi5jbG9zZScpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIGNsb3NlIGFuZCByZXNldCBhbGwgYWN0aXZlIHN1Yi1tZW51IGNvbnRhaW5lcnNcbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtc3ViLW1lbnUtY29udGFpbmVyLmNjbC1pcy1hY3RpdmUnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKS5mYWRlT3V0KENDTC5EVVJBVElPTik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAvLyBhY3RpdmF0ZSB0aGUgc2VsZWN0ZWQgdGFyZ2V0XG4gICAgICAgICAgICAgICAgdGhhdC4kcGFyZW50TWVudS5hZGRDbGFzcygnY2NsLWhhcy1hY3RpdmUtaXRlbScpO1xuICAgICAgICAgICAgICAgIHRoYXQuJHRhcmdldC5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpLmZhZGVJbihDQ0wuRFVSQVRJT04pO1xuICAgICAgICAgICAgICAgIC8vIHByZXBlbmQgY2xvc2UgaWNvblxuICAgICAgICAgICAgICAgIHRoYXQuJGNsb3NlSWNvbi5wcmVwZW5kVG8odGhhdC4kZWwpO1xuICAgICAgICAgICAgICAgIENDTC5yZWZsb3codGhhdC4kY2xvc2VJY29uWzBdKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRjbG9zZUljb24uZmFkZUluKDIwMCk7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcblxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy10b2dnbGUtaGVhZGVyLW1lbnUnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgSGVhZGVyTWVudVRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIE1vZGFsc1xuICogXG4gKiBCZWhhdmlvciBmb3IgbW9kYWxzLiBCYXNlZCBvbiBCb290c3RyYXAncyBtb2RhbHM6IGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzQuMC9jb21wb25lbnRzL21vZGFsL1xuICogXG4gKiBHbG9iYWxzOlxuICogU0NST0xMQkFSV0lEVEhcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgRFVSQVRJT04gPSAzMDA7XG5cbiAgICB2YXIgTW9kYWxUb2dnbGUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgJGVsID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLnRhcmdldCA9ICRlbC5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7IFxuXG4gICAgICAgIF90aGlzLiRlbC5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmICggJChkb2N1bWVudC5ib2R5KS5oYXNDbGFzcygnY2NsLW1vZGFsLW9wZW4nKSApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jbG9zZU1vZGFsKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzLnNob3dCYWNrZHJvcChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zaG93TW9kYWwoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLnNob3dCYWNrZHJvcCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblxuICAgICAgICB2YXIgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdmFyICRiYWNrZHJvcCA9ICQoYmFja2Ryb3ApO1xuXG4gICAgICAgICRiYWNrZHJvcC5hZGRDbGFzcygnY2NsLWMtbW9kYWxfX2JhY2tkcm9wJyk7XG4gICAgICAgICRiYWNrZHJvcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgXG4gICAgICAgIENDTC5yZWZsb3coYmFja2Ryb3ApO1xuICAgICAgICBcbiAgICAgICAgJGJhY2tkcm9wLmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICAkKGRvY3VtZW50LmJvZHkpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJylcbiAgICAgICAgICAgIC5jc3MoICdwYWRkaW5nLXJpZ2h0JywgQ0NMLlNDUk9MTEJBUldJRFRIICk7XG5cbiAgICAgICAgaWYgKCBjYWxsYmFjayApIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoIGNhbGxiYWNrLCBEVVJBVElPTiApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5zaG93TW9kYWwgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBfdGhpcy4kdGFyZ2V0LnNob3coIDAsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAkKCcuY2NsLWMtbW9kYWwnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsJykuaGlkZSgpO1xuXG4gICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWxfX2JhY2tkcm9wJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWxfX2JhY2tkcm9wJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLW1vZGFsLW9wZW4nKVxuICAgICAgICAgICAgICAgICAgICAuY3NzKCAncGFkZGluZy1yaWdodCcsICcnICk7XG5cbiAgICAgICAgICAgIH0sIERVUkFUSU9OKTtcblxuICAgICAgICB9LCBEVVJBVElPTiApOyBcblxuICAgIH07XG5cblxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgTW9kYWxUb2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICpcbiAqIFBvc3QgVHlwZSBLZXl3b3JkIHNlYXJjaFxuICogXG4gKiBPbiB1c2VyIGlucHV0LCBmaXJlIHJlcXVlc3QgdG8gc2VhcmNoIHRoZSBkYXRhYmFzZSBjdXN0b20gcG9zdCB0eXBlIGFuZCByZXR1cm4gcmVzdWx0cyB0byByZXN1bHRzIHBhbmVsXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcblx0XHRFTlRFUiA9IDEzLCBUQUIgPSA5LCBTSElGVCA9IDE2LCBDVFJMID0gMTcsIEFMVCA9IDE4LCBDQVBTID0gMjAsIEVTQyA9IDI3LCBMQ01EID0gOTEsIFJDTUQgPSA5MiwgTEFSUiA9IDM3LCBVQVJSID0gMzgsIFJBUlIgPSAzOSwgREFSUiA9IDQwLFxuXHRcdGZvcmJpZGRlbktleXMgPSBbRU5URVIsIFRBQiwgU0hJRlQsIENUUkwsIEFMVCwgQ0FQUywgRVNDLCBMQ01ELCBSQ01ELCBMQVJSLCBVQVJSLCBSQVJSLCBEQVJSXTtcblxuICAgIHZhciBwb3N0U2VhcmNoID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCAgICAgICAgICAgID0gJCggZWwgKTtcbiAgICAgICAgdGhpcy4kZm9ybVx0XHRcdD0gdGhpcy4kZWwuZmluZCggJy5jY2wtYy1wb3N0LXNlYXJjaF9fZm9ybScgKTtcbiAgICAgICAgdGhpcy4kcG9zdFR5cGUgICAgICA9IHRoaXMuJGVsLmF0dHIoJ2RhdGEtc2VhcmNoLXR5cGUnKTtcbiAgICAgICAgdGhpcy4kaW5wdXQgICAgICAgICA9IHRoaXMuJGVsLmZpbmQoJyNjY2wtYy1wb3N0LXNlYXJjaF9faW5wdXQnKTtcbiAgICAgICAgdGhpcy4kcmVzdWx0c0xpc3QgICA9IHRoaXMuJGVsLmZpbmQoICcuY2NsLWMtcG9zdC1zZWFyY2hfX3Jlc3VsdHMnICk7XG4gICAgICAgIHRoaXMuJGlucHV0VGV4dGJveFx0PSB0aGlzLiRlbC5maW5kKCAnLmNjbC1jLXBvc3Qtc2VhcmNoX190ZXh0Ym94JyApO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIHBvc3RTZWFyY2gucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIC8vQUpBWCBldmVudCB3YXRjaGluZyBmb3IgdXNlciBpbnB1dCBhbmQgb3V0cHV0dGluZyBzdWdnZXN0ZWQgcmVzdWx0c1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzLFxuICAgICAgICB0aW1lb3V0LFxuICAgICAgICBxdWVyeTtcbiAgICAgICAgXG5cblx0XHQvL2tleWJvYXJkIGV2ZW50cyBmb3Igc2VuZGluZyBxdWVyeSB0byBkYXRhYmFzZVxuXHRcdHRoaXMuJGlucHV0XG5cdFx0XHQub24oJ2tleXVwIGtleXByZXNzJywgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHQgICAgXG5cdFx0XHQgICAgZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG5cdFx0XHQgICAgXG5cdFx0XHRcdC8vIGNsZWFyIGFueSBwcmV2aW91cyBzZXQgdGltZW91dFxuXHRcdFx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cblx0XHRcdFx0Ly8gaWYga2V5IGlzIGZvcmJpZGRlbiwgcmV0dXJuXG5cdFx0XHRcdGlmICggZm9yYmlkZGVuS2V5cy5pbmRleE9mKCBldmVudC5rZXlDb2RlICkgPiAtMSApIHtcblx0XHRcdFx0XHRyZXR1cm47XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvLyBnZXQgdmFsdWUgb2Ygc2VhcmNoIGlucHV0XG5cdFx0XHRcdF90aGlzLnF1ZXJ5ID0gX3RoaXMuJGlucHV0LnZhbCgpO1xuXHRcdFx0XHQvL3JlbW92ZSBkb3VibGUgcXVvdGF0aW9ucyBhbmQgb3RoZXIgY2hhcmFjdGVycyBmcm9tIHN0cmluZ1xuXHRcdFx0XHRfdGhpcy5xdWVyeSA9IF90aGlzLnF1ZXJ5LnJlcGxhY2UoL1teYS16QS1aMC05IC0nLixdL2csIFwiXCIpO1xuXG5cdFx0XHRcdC8vIHNldCBhIHRpbWVvdXQgZnVuY3Rpb24gdG8gdXBkYXRlIHJlc3VsdHMgb25jZSA2MDBtcyBwYXNzZXNcblx0XHRcdFx0dGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0aWYgKCBfdGhpcy5xdWVyeS5sZW5ndGggPiAyICkge1xuXG5cdFx0XHRcdFx0IFx0X3RoaXMuZmV0Y2hQb3N0UmVzdWx0cyggX3RoaXMucXVlcnkgKTtcblx0XHRcdFx0XHQgXHRcblx0XHRcdFx0XHQgXHRcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0ICAgIF90aGlzLiRyZXN1bHRzTGlzdC5oaWRlKCk7XG5cdFx0XHRcdFx0XHQvL190aGlzLiRyZXN1bHRzTGlzdC5odG1sKCcnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSwgMjAwKTtcblxuXHRcdFx0fSlcblx0XHRcdC5mb2N1cyhmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAoIF90aGlzLiRpbnB1dC52YWwoKSAhPT0gJycgKSB7XG5cdFx0XHRcdFx0X3RoaXMuJHJlc3VsdHNMaXN0LnNob3coKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdH0pXG5cdFx0XHQuYmx1cihmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdC8vY29uc29sZS5sb2coJyBpbnB1dCBibHVycmVkJyk7XG5cdFx0XHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsIF9vbkJsdXJyZWRDbGljayk7XG5cblx0XHRcdH0pO1xuXHRcdFxuXHRcdGZ1bmN0aW9uIF9vbkJsdXJyZWRDbGljayhldmVudCkge1xuXHRcdFx0XG5cdFx0XHRpZiAoICEgJC5jb250YWlucyggX3RoaXMuJGVsWzBdLCBldmVudC50YXJnZXQgKSApIHtcblx0XHRcdFx0X3RoaXMuJHJlc3VsdHNMaXN0LmhpZGUoKTtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0JChkb2N1bWVudCkub2ZmKCdjbGljaycsIF9vbkJsdXJyZWRDbGljayk7XG5cblx0XHR9XG5cdFx0XG5cdFx0dGhpcy4kZm9ybS5vbignc3VibWl0JywgZnVuY3Rpb24oIGV2ZW50ICl7XG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG5cdFx0XHQvLyBnZXQgdmFsdWUgb2Ygc2VhcmNoIGlucHV0XG5cdFx0XHQvLyBfdGhpcy5xdWVyeSA9IF90aGlzLiRpbnB1dC52YWwoKTtcblx0XHRcdC8vIC8vcmVtb3ZlIGRvdWJsZSBxdW90YXRpb25zIGFuZCBvdGhlciBjaGFyYWN0ZXJzIGZyb20gc3RyaW5nXG5cdFx0XHQvLyBfdGhpcy5xdWVyeSA9IF90aGlzLnF1ZXJ5LnJlcGxhY2UoL1teYS16QS1aMC05IC0nLixdL2csIFwiXCIpO1xuXHRcdFx0Y29uc29sZS5sb2coX3RoaXMucXVlcnkpO1x0XG5cdFx0XHRcblx0XHRcdFxuXHRcdFx0aWYgKCBfdGhpcy5xdWVyeS5sZW5ndGggPiAyICkge1xuXG5cdFx0XHQgXHRfdGhpcy5mZXRjaFBvc3RSZXN1bHRzKCBfdGhpcy5xdWVyeSApO1xuXHRcdFx0IFx0XG5cdFx0XHQgXHRcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0ICAgIF90aGlzLiRyZXN1bHRzTGlzdC5oaWRlKCk7XG5cdFx0XHRcdC8vX3RoaXMuJHJlc3VsdHNMaXN0Lmh0bWwoJycpO1xuXHRcdFx0fVx0XHRcdFxuXHRcdFx0XG5cdFx0fSk7XG4gICAgfTtcbiAgICBcbiAgICBwb3N0U2VhcmNoLnByb3RvdHlwZS5mZXRjaFBvc3RSZXN1bHRzID0gZnVuY3Rpb24oIHF1ZXJ5ICl7XG5cdFx0Ly9zZW5kIEFKQVggcmVxdWVzdCB0byBQSFAgZmlsZSBpbiBXUFxuXHRcdHZhciBfdGhpcyA9IHRoaXMsXG5cdFx0XHRkYXRhID0ge1xuXHRcdFx0XHRhY3Rpb24gICAgICA6ICdyZXRyaWV2ZV9wb3N0X3NlYXJjaF9yZXN1bHRzJywgLy8gdGhpcyBzaG91bGQgcHJvYmFibHkgYmUgYWJsZSB0byBkbyBwZW9wbGUgJiBhc3NldHMgdG9vIChtYXliZSBEQnMpXG5cdFx0XHRcdHF1ZXJ5ICAgICAgIDogcXVlcnksXG5cdFx0XHRcdHBvc3RUeXBlICAgIDogX3RoaXMuJHBvc3RUeXBlXG5cdFx0XHR9O1xuXG5cdFx0X3RoaXMuJGlucHV0VGV4dGJveC5hZGRDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcblx0XHRcblx0XHQvL2NvbnNvbGUubG9nKCBfdGhpcyApO1xuXG5cdFx0JC5wb3N0KENDTC5hamF4X3VybCwgZGF0YSlcblx0XHRcdC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0ICAgIFxuXHRcdFx0XHQvL2Z1bmN0aW9uIGZvciBwcm9jZXNzaW5nIHJlc3VsdHNcblx0XHRcdFx0X3RoaXMucHJvY2Vzc1Bvc3RSZXN1bHRzKHJlc3BvbnNlKTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vY29uc29sZS5sb2coICdyZXNwb25zZScsIHJlc3BvbnNlICk7XG5cblx0XHRcdH0pXG5cdFx0XHQuYWx3YXlzKGZ1bmN0aW9uKCl7XG5cblx0XHRcdFx0X3RoaXMuJGlucHV0VGV4dGJveC5yZW1vdmVDbGFzcygnY2NsLWlzLWxvYWRpbmcnKTtcblxuXHRcdFx0fSk7ICAgICAgICBcbiAgICB9O1xuICAgIFxuICAgIHBvc3RTZWFyY2gucHJvdG90eXBlLnByb2Nlc3NQb3N0UmVzdWx0cyA9IGZ1bmN0aW9uKCByZXNwb25zZSApe1xuICAgICAgICB2YXIgX3RoaXMgICAgICAgPSB0aGlzLFxuXHRcdCAgICByZXN1bHRzICAgICA9ICQucGFyc2VKU09OKHJlc3BvbnNlKSxcblx0XHQgICAgcmVzdWx0Q291bnRcdD0gcmVzdWx0cy5jb3VudCxcblx0XHQgICAgcmVzdWx0SXRlbXMgPSAkKCc8dWwgLz4nKS5hZGRDbGFzcygnY2NsLWMtcG9zdC1zZWFyY2hfX3Jlc3VsdHMtdWwnKSxcbiAgICAgICAgICAgIHJlc3VsdHNDbG9zZSA9ICQoJzxsaSAvPicpXG4gICAgICAgICAgICBcdC5hZGRDbGFzcygnY2NsLWMtc2VhcmNoLS1jbG9zZS1yZXN1bHRzJylcbiAgICAgICAgICAgIFx0LmFwcGVuZCggJCgnPGRpdiAvPicpLmFkZENsYXNzKCdjY2wtYy1wb3N0LXNlYXJjaF9fY291bnQgY2NsLXUtd2VpZ2h0LWJvbGQgY2NsLXUtZmFkZWQnKSAgXG4gICAgICAgIFx0XHRcdFx0XHQuYXBwZW5kKCAkKCc8aSAvPicpLmFkZENsYXNzKCdjY2wtYi1pY29uIGFycm93LWRvd24nKSApXG4gICAgXHRcdFx0XHRcdFx0LmFwcGVuZCggJCgnPHNwYW4gLz4nKS5odG1sKCAnJm5ic3A7Jm5ic3AnICsgcmVzdWx0Q291bnQgKyAnIGZvdW5kJykgKVxuICAgICAgICAgICAgXHRcdClcbiAgICAgICAgICAgIFx0LmFwcGVuZCggJCgnPGJ1dHRvbiAvPicpLmFkZENsYXNzKCdjY2wtYi1jbG9zZSBjY2wtYy1zZWFyY2gtLWNsb3NlX19idXR0b24nKS5hdHRyKCdhcmlhbC1sYWJlbCcsICdDbG9zZScpXG5cdCAgICAgICAgICAgIFx0XHRcdC5hcHBlbmQoICQoJzxpIC8+JykuYXR0cignYXJpYS1oaWRkZW4nLCB0cnVlICkuYWRkQ2xhc3MoJ2NjbC1iLWljb24gY2xvc2UgY2NsLXUtd2VpZ2h0LWJvbGQgY2NsLXUtZm9udC1zaXplLXNtJykgKVxuICAgICAgICAgICAgXHRcdCk7XG5cblxuXHRcdCAgICBcblx0XHQgICAgaWYoIHJlc3VsdHMucG9zdHMubGVuZ3RoID09PSAwICl7XG5cdFx0ICAgIFx0dGhpcy4kcmVzdWx0c0xpc3QuaHRtbCgnJyk7XHRcdCAgICBcdFxuXHRcdCAgICAgICAgdGhpcy4kcmVzdWx0c0xpc3Quc2hvdygpLmFwcGVuZCggJCgnPGRpdiAvPicpLmFkZENsYXNzKCdjY2wtdS1weS1udWRnZSBjY2wtdS13ZWlnaHQtYm9sZCBjY2wtdS1mYWRlZCcpLmh0bWwoJ1NvcnJ5LCBubyBkYXRhYmFzZXMgZm91bmQgLSB0cnkgYW5vdGhlciBzZWFyY2gnKSApO1xuXG5cdFx0ICAgICAgICByZXR1cm47XG5cdFx0ICAgIH1cblx0XHQgICBcblx0XHQgICAgdGhpcy4kcmVzdWx0c0xpc3QuaHRtbCgnJyk7XG5cdFx0ICAgIFxuXHRcdCAgICByZXN1bHRJdGVtcy5hcHBlbmQoIHJlc3VsdHNDbG9zZSApO1xuXHRcdCAgICBcblx0XHQgICAgJC5lYWNoKCByZXN1bHRzLnBvc3RzLCBmdW5jdGlvbigga2V5LCB2YWwgKXtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHJlbmRlckl0ZW0gPSAkKCc8bGkgLz4nKVxuICAgICAgICAgICAgICAgIFx0LmFwcGVuZChcbiAgICAgICAgICAgICAgICBcdFx0JCgnPGEgLz4nKVxuICAgICAgICAgICAgICAgIFx0XHRcdC5hdHRyKHtcblx0XHRcdCAgICAgICAgICAgICAgICAgICAnaHJlZicgICA6IHZhbC5wb3N0X2xpbmssXG5cdFx0XHQgICAgICAgICAgICAgICAgICAgJ3RhcmdldCcgOiAnX2JsYW5rJywgICAgICAgICAgICAgICBcdFx0XHRcdFxuICAgICAgICAgICAgICAgIFx0XHRcdH0pXG4gICAgICAgICAgICAgICAgXHRcdFx0LmFkZENsYXNzKCdjY2wtYy1kYXRhYmFzZS1zZWFyY2hfX3Jlc3VsdC1pdGVtJylcbiAgICAgICAgICAgICAgICBcdFx0XHQuaHRtbCggdmFsLnBvc3RfdGl0bGUgKyAodmFsLnBvc3RfYWx0X25hbWUgPyAnPGRpdiBjbGFzcz1cImNjbC11LXdlaWdodC1ub3JtYWwgY2NsLXUtbWwtbnVkZ2UgY2NsLXUtZm9udC1zaXplLXNtXCI+KCcgKyB2YWwucG9zdF9hbHRfbmFtZSArICcpPC9kaXY+JyA6ICcnICkgKVxuICAgICAgICAgICAgICAgIFx0XHRcdC5hcHBlbmQoICQoJzxzcGFuIC8+Jylcblx0ICAgICAgICAgICAgICAgIFx0XHRcdFx0XHQuaHRtbCggJ0FjY2VzcyZuYnNwOyZuYnNwOycgKVxuXHQgICAgICAgICAgICAgICAgXHRcdFx0XHRcdC5hcHBlbmQoICQoJzxpIC8+Jylcblx0ICAgICAgICAgICAgICAgIFx0XHRcdFx0XHRcdFx0XHQuYWRkQ2xhc3MoJ2NjbC1iLWljb24gYXJyb3ctcmlnaHQnKVxuXHQgICAgICAgICAgICAgICAgXHRcdFx0XHRcdFx0XHRcdC5hdHRyKHtcblx0ICAgICAgICAgICAgICAgIFx0XHRcdFx0XHRcdFx0XHQnYXJpYS1oaWRkZW4nXHQ6IHRydWUsXG5cdCAgICAgICAgICAgICAgICBcdFx0XHRcdFx0XHRcdFx0J3N0eWxlJ1x0XHRcdDogXCJ2ZXJ0aWNhbC1hbGlnbjptaWRkbGVcIlxuXHQgICAgICAgICAgICAgICAgXHRcdFx0XHRcdFx0XHRcdH0pXG5cdCAgICAgICAgICAgICAgICBcdFx0XHRcdFx0XHQpIFxuICAgICAgICAgICAgICAgIFx0XHRcdFx0KVxuICAgICAgICAgICAgICAgIFx0XHQpO1xuXHRcdCAgICBcblx0XHQgICAgICAgIHJlc3VsdEl0ZW1zLmFwcGVuZCggcmVuZGVySXRlbSApO1xuXHRcdCAgICAgICAgXG5cdFx0ICAgIH0gKTtcblx0XHQgICAgXG5cdFx0ICAgIHRoaXMuJHJlc3VsdHNMaXN0LmFwcGVuZCggcmVzdWx0SXRlbXMgKS5zaG93KCk7XG5cdFx0ICAgIFxuXHRcdFx0Ly9jYWNoZSB0aGUgcmVzcG9uc2UgYnV0dG9uIGFmdGVyIGl0cyBhZGRlZCB0byB0aGUgRE9NXG5cdFx0XHRfdGhpcy4kcmVzcG9uc2VDbG9zZVx0PSBfdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNlYXJjaC0tY2xvc2VfX2J1dHRvbicpO1x0XHRcblx0XHRcdFxuXHRcdFx0Ly9jbGljayBldmVudCB0byBjbG9zZSB0aGUgcmVzdWx0cyBwYWdlXG5cdFx0XHRfdGhpcy4kcmVzcG9uc2VDbG9zZS5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZXZlbnQpe1xuXHRcdFx0XHRcdC8vaGlkZVxuXHRcdFx0XHRcdGlmKCAkKCBfdGhpcy4kcmVzdWx0c0xpc3QgKS5pcygnOnZpc2libGUnKSApe1xuXHRcdFx0XHRcdFx0X3RoaXMuJHJlc3VsdHNMaXN0LmhpZGUoKTtcdFx0XHRcdFx0XG5cdFx0XHRcdFx0fVxuXHRcdFx0fSk7XHRcdCAgICBcblx0XHQgICAgXG5cdFx0ICAgIFxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgJCgnLmNjbC1jLXBvc3Qtc2VhcmNoJykuZWFjaCggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBwb3N0U2VhcmNoKHRoaXMpOyAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7IiwiLyoqXG4gKiBRdWljayBOYXZcbiAqIFxuICogQmVoYXZpb3IgZm9yIHRoZSBxdWljayBuYXZcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0JztcbiAgICB2YXIgJHdpbmRvdyA9ICQod2luZG93KSxcbiAgICAgICAgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgUXVpY2tOYXYgPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kc3ViTWVudXMgPSB0aGlzLiRlbC5maW5kKCcuc3ViLW1lbnUnKTtcbiAgICAgICAgdGhpcy4kc2Nyb2xsU3B5SXRlbXMgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtcXVpY2stbmF2X19zY3JvbGxzcHkgc3BhbicpO1xuICAgICAgICB0aGlzLiRzZWFyY2hUb2dnbGUgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWlzLXNlYXJjaC10b2dnbGUnKTtcblxuICAgICAgICAvLyBzZXQgdGhlIHRvZ2dsZSBvZmZzZXQgYW5kIGFjY291bnQgZm9yIHRoZSBXUCBhZG1pbiBiYXIgXG4gICAgXG4gICAgICAgIGlmICggJCgnYm9keScpLmhhc0NsYXNzKCdhZG1pbi1iYXInKSAmJiAkKCcjd3BhZG1pbmJhcicpLmNzcygncG9zaXRpb24nKSA9PSAnZml4ZWQnICkge1xuICAgICAgICAgICAgdmFyIGFkbWluQmFySGVpZ2h0ID0gJCgnI3dwYWRtaW5iYXInKS5vdXRlckhlaWdodCgpO1xuICAgICAgICAgICAgdGhpcy50b2dnbGVPZmZzZXQgPSAkKCcuY2NsLWMtdXNlci1uYXYnKS5vZmZzZXQoKS50b3AgKyAkKCcuY2NsLWMtdXNlci1uYXYnKS5vdXRlckhlaWdodCgpIC0gYWRtaW5CYXJIZWlnaHQ7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnRvZ2dsZU9mZnNldCA9ICQoJy5jY2wtYy11c2VyLW5hdicpLm9mZnNldCgpLnRvcCArICQoJy5jY2wtYy11c2VyLW5hdicpLm91dGVySGVpZ2h0KCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgUXVpY2tOYXYucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHRoaXMuaW5pdFNjcm9sbCgpO1xuICAgICAgICB0aGlzLmluaXRNZW51cygpO1xuICAgICAgICB0aGlzLmluaXRTY3JvbGxTcHkoKTtcbiAgICAgICAgdGhpcy5pbml0U2VhcmNoKCk7XG5cbiAgICB9O1xuXG4gICAgUXVpY2tOYXYucHJvdG90eXBlLmluaXRTY3JvbGwgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgNTAgKSApO1xuXG4gICAgICAgIGZ1bmN0aW9uIF9vblNjcm9sbCgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCk7XG4gICAgXG4gICAgICAgICAgICBpZiAoIHNjcm9sbFRvcCA+PSB0aGF0LnRvZ2dsZU9mZnNldCApIHtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5hZGRDbGFzcygnY2NsLWlzLWZpeGVkJyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoYXQuJGVsLnJlbW92ZUNsYXNzKCdjY2wtaXMtZml4ZWQnKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgfVxuXG4gICAgfTtcblxuICAgIFF1aWNrTmF2LnByb3RvdHlwZS5pbml0TWVudXMgPSBmdW5jdGlvbigpe1xuICAgICAgICBpZiAoICEgdGhpcy4kc3ViTWVudXMubGVuZ3RoICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kc3ViTWVudXMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICRzdWJNZW51ID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAkdG9nZ2xlID0gJHN1Yk1lbnUuc2libGluZ3MoJ2EnKTtcblxuICAgICAgICAgICAgJHRvZ2dsZS5jbGljayhmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGlmICggJCh0aGlzKS5oYXNDbGFzcygnY2NsLWlzLWFjdGl2ZScpICkge1xuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlIGNjbC11LWNvbG9yLXNjaG9vbCcpO1xuICAgICAgICAgICAgICAgICAgICAkc3ViTWVudS5mYWRlT3V0KDI1MCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtcXVpY2stbmF2X19tZW51IGEuY2NsLWlzLWFjdGl2ZScpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZSBjY2wtdS1jb2xvci1zY2hvb2wnKVxuICAgICAgICAgICAgICAgICAgICAuc2libGluZ3MoJy5zdWItbWVudScpXG4gICAgICAgICAgICAgICAgICAgICAgICAuZmFkZU91dCgyNTApO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUgY2NsLXUtY29sb3Itc2Nob29sJyk7XG4gICAgICAgICAgICAgICAgJHN1Yk1lbnUuZmFkZVRvZ2dsZSgyNTApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdFNjcm9sbFNweSA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHNjcm9sbFNweUl0ZW1zLmVhY2goZnVuY3Rpb24oKXtcblxuICAgICAgICAgICAgdmFyICRzcHlJdGVtID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSAkc3B5SXRlbS5kYXRhKCd0YXJnZXQnKTtcblxuICAgICAgICAgICAgJHdpbmRvdy5zY3JvbGwoIENDTC50aHJvdHRsZSggX29uU2Nyb2xsLCAxMDAgKSApO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBfb25TY3JvbGwoKSB7XG4gICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCksXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldFRvcCA9ICQodGFyZ2V0KS5vZmZzZXQoKS50b3AgLSAxNTA7XG5cbiAgICAgICAgICAgICAgICBpZiAoIHNjcm9sbFRvcCA+PSB0YXJnZXRUb3AgKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuJHNjcm9sbFNweUl0ZW1zLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgICRzcHlJdGVtLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJHNweUl0ZW0ucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBRdWlja05hdi5wcm90b3R5cGUuaW5pdFNlYXJjaCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdGhpcy4kc2VhcmNoVG9nZ2xlLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGF0LiRlbC50b2dnbGVDbGFzcygnY2NsLXNlYXJjaC1hY3RpdmUnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5jY2wtYy1xdWljay1uYXYnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgUXVpY2tOYXYodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBSb29tIFJlc2VydmF0aW9uXG4gKiBcbiAqIEhhbmRsZSByb29tIHJlc2VydmF0aW9uc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBSb29tUmVzRm9ybSA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJGZvcm1Db250ZW50ID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tY29udGVudCcpLmNzcyh7cG9zaXRpb246J3JlbGF0aXZlJ30pO1xuICAgICAgICB0aGlzLiRmb3JtUmVzcG9uc2UgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1yZXNwb25zZScpLmNzcyh7cG9zaXRpb246ICdhYnNvbHV0ZScsIHRvcDogJzFyZW0nLCBsZWZ0OiAnMXJlbScsIG9wYWNpdHk6IDB9KTtcbiAgICAgICAgdGhpcy4kZm9ybUNhbmNlbCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yb29tLXJlcy1mb3JtLWNhbmNlbCcpO1xuICAgICAgICB0aGlzLiRmb3JtU3VibWl0ID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tcmVzLWZvcm0tc3VibWl0Jyk7XG4gICAgICAgIHRoaXMuJGZvcm1SZWxvYWQgPSB0aGlzLiRlbC5maW5kKCcuanMtcm9vbS1yZXMtZm9ybS1yZWxvYWQnKTtcbiAgICAgICAgdGhpcy5yb29tSWQgPSB0aGlzLiRlbC5kYXRhKCdyZXNvdXJjZS1pZCcpO1xuICAgICAgICB0aGlzLiRkYXRlU2VsZWN0ID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tZGF0ZS1zZWxlY3QnKTtcbiAgICAgICAgdGhpcy5kYXRlWW1kID0gdGhpcy4kZGF0ZVNlbGVjdC52YWwoKTtcbiAgICAgICAgdGhpcy4kcm9vbVNjaGVkdWxlID0gdGhpcy4kZWwuZmluZCgnLmpzLXJvb20tc2NoZWR1bGUnKTtcbiAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dCA9IHRoaXMuJGVsLmZpbmQoJy5qcy1jdXJyZW50LWR1cmF0aW9uJyk7XG4gICAgICAgIHRoaXMuJGZvcm1Ob3RpZmljYXRpb24gPSAkKCc8cCBjbGFzcz1cImNjbC1jLWFsZXJ0XCI+PC9wPicpO1xuICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0biA9IHRoaXMuJGVsLmZpbmQoJy5qcy1yZXNldC1zZWxlY3Rpb24nKTsgXG4gICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzID0gbnVsbDtcbiAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMgPSBbXTtcbiAgICAgICAgdGhpcy5tYXhTbG90cyA9IDQ7XG4gICAgICAgIHRoaXMuJG1heFRpbWUgPSB0aGlzLiRlbC5maW5kKCcuanMtbWF4LXRpbWUnKTtcbiAgICAgICAgdGhpcy5zbG90TWludXRlcyA9IDMwO1xuICAgICAgICB0aGlzLmxvY2FsZSA9IFwiZW4tVVNcIjtcbiAgICAgICAgdGhpcy50aW1lWm9uZSA9IHt0aW1lWm9uZTogXCJBbWVyaWNhL0xvc19BbmdlbGVzXCJ9O1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB0aGlzLnNldExvYWRpbmcoKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNjaGVkdWxlRGF0YSgpO1xuXG4gICAgICAgIHRoaXMuc2V0TWF4VGltZVRleHQoKTtcblxuICAgICAgICB0aGlzLmluaXREYXRlRXZlbnRzKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXRGb3JtRXZlbnRzKCk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5nZXRTcGFjZUF2YWlsYWJpbGl0eSA9IGZ1bmN0aW9uKFltZCl7XG5cblx0XHR2YXIgZGF0YSA9IHtcblx0XHRcdGFjdGlvbjogJ2dldF9yb29tX2luZm8nLFxuXHRcdFx0Y2NsX25vbmNlOiBDQ0wubm9uY2UsXG5cdFx0XHRhdmFpbGFiaWxpdHk6IFltZCB8fCAnJywgLy8gZS5nLiAnMjAxNy0xMC0xOScuIGVtcHR5IHN0cmluZyB3aWxsIGdldCBhdmFpbGFiaWxpdHkgZm9yIGN1cnJlbnQgZGF5XG5cdFx0XHRyb29tOiB0aGlzLnJvb21JZCAvLyByb29tX2lkIChzcGFjZSlcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gJC5wb3N0KHtcblx0XHRcdHVybDogQ0NMLmFqYXhfdXJsLFxuXHRcdFx0ZGF0YTogZGF0YVxuXHRcdH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5nZXRTcGFjZUJvb2tpbmdzID0gZnVuY3Rpb24oWW1kKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBkYXRhID0ge1xuICAgICAgICAgICAgYWN0aW9uOiAnZ2V0X2Jvb2tpbmdzJyxcbiAgICAgICAgICAgIGNjbF9ub25jZTogQ0NMLm5vbmNlLFxuICAgICAgICAgICAgZGF0ZTogWW1kIHx8ICcnLCAvLyBlLmcuICcyMDE3LTEwLTE5Jy4gZW1wdHkgc3RyaW5nIHdpbGwgZ2V0IGJvb2tpbmdzIGZvciBjdXJyZW50IGRheVxuICAgICAgICAgICAgcm9vbTogdGhpcy5yb29tSWQsXG4gICAgICAgICAgICBsaW1pdDogNTBcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gJC5wb3N0KHtcbiAgICAgICAgICAgIHVybDogQ0NMLmFqYXhfdXJsLFxuICAgICAgICAgICAgZGF0YTogZGF0YVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUudXBkYXRlU2NoZWR1bGVEYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgZ2V0U3BhY2VqcVhIUiA9IHRoaXMuZ2V0U3BhY2VBdmFpbGFiaWxpdHkodGhpcy5kYXRlWW1kKTtcbiAgICAgICAgdmFyIGdldEJvb2tpbmdzanFYSFIgPSB0aGlzLmdldFNwYWNlQm9va2luZ3ModGhpcy5kYXRlWW1kKTtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgICQud2hlbihnZXRTcGFjZWpxWEhSLCBnZXRCb29raW5nc2pxWEhSKVxuICAgICAgICAgICAgLmRvbmUoZnVuY3Rpb24oZ2V0U3BhY2UsZ2V0Qm9va2luZ3Mpe1xuXG4gICAgICAgICAgICAgICAgdmFyIHNwYWNlRGF0YSA9IGdldFNwYWNlWzBdLFxuICAgICAgICAgICAgICAgICAgICBib29raW5nc0RhdGEgPSBnZXRCb29raW5nc1swXSxcbiAgICAgICAgICAgICAgICAgICAgc3BhY2VqcVhIUiA9IGdldFNwYWNlWzJdLFxuICAgICAgICAgICAgICAgICAgICBib29raW5nc2pxWEhSID0gZ2V0Qm9va2luZ3NbMl0sXG4gICAgICAgICAgICAgICAgICAgIHRpbWVTbG90c0FycmF5O1xuXG4gICAgICAgICAgICAgICAgLy8gcGFyc2UgZGF0YSB0byBKU09OIGlmIGl0J3MgYSBzdHJpbmdcbiAgICAgICAgICAgICAgICBzcGFjZURhdGEgPSAoIHR5cGVvZiBzcGFjZURhdGEgPT09ICdzdHJpbmcnICkgPyBKU09OLnBhcnNlKCBzcGFjZURhdGEgKVswXSA6IHNwYWNlRGF0YVswXTtcbiAgICAgICAgICAgICAgICBib29raW5nc0RhdGEgPSAoIHR5cGVvZiBib29raW5nc0RhdGEgPT09ICdzdHJpbmcnICkgPyBKU09OLnBhcnNlKCBib29raW5nc0RhdGEgKSA6IGJvb2tpbmdzRGF0YTtcblxuICAgICAgICAgICAgICAgIC8vIG1lcmdlIGJvb2tpbmdzIHdpdGggYXZhaWxhYmlsaXR5XG4gICAgICAgICAgICAgICAgaWYgKCBib29raW5nc0RhdGEubGVuZ3RoICl7XG5cbiAgICAgICAgICAgICAgICAgICAgYm9va2luZ3NEYXRhLmZvckVhY2goZnVuY3Rpb24oYm9va2luZyxpKXtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY2FsY3VsYXRlIG51bWJlciBvZiBzbG90cyBiYXNlZCBvbiBib29raW5nIGR1cmF0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZnJvbVRpbWUgPSBuZXcgRGF0ZShib29raW5nLmZyb21EYXRlKS5nZXRUaW1lKCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9UaW1lID0gbmV3IERhdGUoYm9va2luZy50b0RhdGUpLmdldFRpbWUoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkdXJhdGlvbk1pbnV0ZXMgPSAodG9UaW1lIC0gZnJvbVRpbWUpIC8gMTAwMCAvIDYwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNsb3RDb3VudCA9IGR1cmF0aW9uTWludXRlcyAvIHRoYXQuc2xvdE1pbnV0ZXM7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNwYWNlRGF0YS5hdmFpbGFiaWxpdHkucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmcm9tXCI6IGJvb2tpbmcuZnJvbURhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0b1wiOiBib29raW5nLnRvRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNsb3RDb3VudFwiOiBzbG90Q291bnQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJpc0Jvb2tlZFwiOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIC8vIHNvcnQgdGltZSBzbG90IG9iamVjdHMgYnkgdGhlIFwiZnJvbVwiIGtleVxuICAgICAgICAgICAgICAgICAgICBfc29ydEJ5S2V5KCBzcGFjZURhdGEuYXZhaWxhYmlsaXR5LCAnZnJvbScgKTtcblxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vIHBhcnNlIHRpbWUgc2xvdHMgYW5kIHJldHVybiBhbiBhcHByb3ByaWF0ZSBzdWJzZXQgKG9ubHkgb3BlbiB0byBjbG9zZSBob3VycylcbiAgICAgICAgICAgICAgICB0aW1lU2xvdHNBcnJheSA9IHRoYXQucGFyc2VTY2hlZHVsZShzcGFjZURhdGEuYXZhaWxhYmlsaXR5KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBidWlsZCBzY2hlZHVsZSBIVE1MXG4gICAgICAgICAgICAgICAgdGhhdC5idWlsZFNjaGVkdWxlKHRpbWVTbG90c0FycmF5KTtcblxuICAgICAgICAgICAgICAgIC8vIEVycm9yIGhhbmRsZXJzXG4gICAgICAgICAgICAgICAgc3BhY2VqcVhIUi5mYWlsKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYm9va2luZ3NqcVhIUi5mYWlsKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuYWx3YXlzKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhhdC51bnNldExvYWRpbmcoKTtcbiAgICAgICAgICAgICAgICB0aGF0LiRyZXNldFNlbGVjdGlvbkJ0bi5oaWRlKCk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuYnVpbGRTY2hlZHVsZSA9IGZ1bmN0aW9uKHRpbWVTbG90c0FycmF5KXtcblxuICAgICAgICB2YXIgdGhhdCA9IHRoaXMsXG4gICAgICAgICAgICBodG1sID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgLy8gY29uc3RydWN0IEhUTUwgZm9yIGVhY2ggdGltZSBzbG90XG4gICAgICAgIHRpbWVTbG90c0FycmF5LmZvckVhY2goZnVuY3Rpb24oaXRlbSwgaSl7XG5cbiAgICAgICAgICAgIHZhciBmcm9tID0gbmV3IERhdGUoIGl0ZW0uZnJvbSApLFxuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmcsXG4gICAgICAgICAgICAgICAgaXRlbUNsYXNzID0gJyc7XG5cbiAgICAgICAgICAgIGlmICggZnJvbS5nZXRNaW51dGVzKCkgIT09IDAgKSB7XG4gICAgICAgICAgICAgICAgdGltZVN0cmluZyA9IHRoYXQucmVhZGFibGVUaW1lKCBmcm9tLCAnaDptJyApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aW1lU3RyaW5nID0gdGhhdC5yZWFkYWJsZVRpbWUoIGZyb20sICdoYScgKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCBpdGVtLmlzQm9va2VkICYmIGl0ZW0uaGFzT3duUHJvcGVydHkoJ3Nsb3RDb3VudCcpICkge1xuICAgICAgICAgICAgICAgIGl0ZW1DbGFzcyA9ICdjY2wtaXMtb2NjdXBpZWQgY2NsLWR1cmF0aW9uLScgKyBpdGVtLnNsb3RDb3VudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gYnVpbGQgc2VsZWN0YWJsZSB0aW1lIHNsb3RzXG4gICAgICAgICAgICBodG1sLnB1c2goIHRoYXQuYnVpbGRUaW1lU2xvdCh7XG4gICAgICAgICAgICAgICAgaWQ6ICdzbG90LScgKyB0aGF0LnJvb21JZCArICctJyArIGksXG4gICAgICAgICAgICAgICAgZnJvbTogaXRlbS5mcm9tLFxuICAgICAgICAgICAgICAgIHRvOiBpdGVtLnRvLFxuICAgICAgICAgICAgICAgIHRpbWVTdHJpbmc6IHRpbWVTdHJpbmcsXG4gICAgICAgICAgICAgICAgY2xhc3M6IGl0ZW1DbGFzc1xuICAgICAgICAgICAgfSkgKTtcbiAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzID0gW107XG5cbiAgICAgICAgdGhpcy4kcm9vbVNjaGVkdWxlLmh0bWwoIGh0bWwuam9pbignJykgKTtcblxuICAgICAgICB0aGlzLiRyb29tU2xvdElucHV0cyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1yb29tX19zbG90IFt0eXBlPVwiY2hlY2tib3hcIl0nKTtcblxuICAgICAgICB0aGlzLnNldEN1cnJlbnREdXJhdGlvblRleHQoKTtcblxuICAgICAgICB0aGlzLmluaXRTbG90RXZlbnRzKCk7XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmJ1aWxkVGltZVNsb3QgPSBmdW5jdGlvbih2YXJzKXtcbiAgICAgICAgXG4gICAgICAgIGlmICggISB2YXJzIHx8IHR5cGVvZiB2YXJzICE9PSAnb2JqZWN0JyApIHtcbiAgICAgICAgICAgIHJldHVybiAnJztcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBkZWZhdWx0cyA9IHtcbiAgICAgICAgICAgIGNsYXNzOiAnJyxcbiAgICAgICAgICAgIGlkOiAnJyxcbiAgICAgICAgICAgIGRpc2FibGVkOiAnJyxcbiAgICAgICAgICAgIGZyb206ICcnLFxuICAgICAgICAgICAgdG86ICcnLFxuICAgICAgICAgICAgdGltZVN0cmluZzogJydcbiAgICAgICAgfTtcbiAgICAgICAgdmFycyA9ICQuZXh0ZW5kKGRlZmF1bHRzLCB2YXJzKTtcblxuICAgICAgICB2YXIgdGVtcGxhdGUgPSAnJyArXG4gICAgICAgICAgICAnPGRpdiBjbGFzcz1cImNjbC1jLXJvb21fX3Nsb3QgJyArIHZhcnMuY2xhc3MgKyAnXCI+JyArXG4gICAgICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBpZD1cIicgKyB2YXJzLmlkICsgJ1wiIG5hbWU9XCInICsgdmFycy5pZCArICdcIiB2YWx1ZT1cIicgKyB2YXJzLmZyb20gKyAnXCIgZGF0YS10bz1cIicgKyB2YXJzLnRvICsgJ1wiICcgKyB2YXJzLmRpc2FibGVkICsgJy8+JyArXG4gICAgICAgICAgICAgICAgJzxsYWJlbCBjbGFzcz1cImNjbC1jLXJvb21fX3Nsb3QtbGFiZWxcIiBmb3I9XCInICsgdmFycy5pZCArICdcIj4nICtcbiAgICAgICAgICAgICAgICAgICAgdmFycy50aW1lU3RyaW5nICtcbiAgICAgICAgICAgICAgICAnPC9sYWJlbD4nICtcbiAgICAgICAgICAgICc8L2Rpdj4nO1xuXG4gICAgICAgIHJldHVybiB0ZW1wbGF0ZTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnBhcnNlU2NoZWR1bGUgPSBmdW5jdGlvbihzY2hlZHVsZUFycmF5KXtcbiAgICAgICAgLy8gcmV0dXJucyB0aGUgYXBwcm9wcmlhdGUgc2NoZWR1bGUgZm9yIGEgZ2l2ZW4gYXJyYXkgb2YgdGltZSBzbG90c1xuICAgICAgICBcbiAgICAgICAgdmFyIHRvID0gbnVsbCxcbiAgICAgICAgICAgIHN0YXJ0RW5kSW5kZXhlcyA9IFtdLCBcbiAgICAgICAgICAgIHN0YXJ0LCBlbmQ7XG5cbiAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFycmF5IGFuZCBwaWNrIG91dCB0aW1lIGdhcHNcbiAgICAgICAgc2NoZWR1bGVBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0saSl7XG4gICAgICAgICAgICBpZiAoIHRvICYmIHRvICE9PSBpdGVtLmZyb20gKSB7XG4gICAgICAgICAgICAgICAgc3RhcnRFbmRJbmRleGVzLnB1c2goaSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0byA9IGl0ZW0udG87XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIGRlcGVuZGluZyBvbiBudW1iZXIgb2YgZ2FwcyBmb3VuZCwgZGV0ZXJtaW5lIHN0YXJ0IGFuZCBlbmQgaW5kZXhlc1xuICAgICAgICBpZiAoIHN0YXJ0RW5kSW5kZXhlcy5sZW5ndGggPj0gMiApIHtcbiAgICAgICAgICAgIHN0YXJ0ID0gc3RhcnRFbmRJbmRleGVzWzBdO1xuICAgICAgICAgICAgZW5kID0gc3RhcnRFbmRJbmRleGVzWzFdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgICAgICAgaWYgKCBzdGFydEVuZEluZGV4ZXMubGVuZ3RoID09PSAxICkge1xuICAgICAgICAgICAgICAgIGVuZCA9IHN0YXJ0RW5kSW5kZXhlc1swXTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgZW5kID0gc2NoZWR1bGVBcnJheS5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIC8vIHJldHVybmVkIHNsaWNlZCBwb3J0aW9uIG9mIG9yaWdpbmFsIHNjaGVkdWxlXG4gICAgICAgIHJldHVybiBzY2hlZHVsZUFycmF5LnNsaWNlKHN0YXJ0LGVuZCk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5pbml0Rm9ybUV2ZW50cyA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHJlc2V0U2VsZWN0aW9uQnRuLmNsaWNrKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAkKHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzKS5lYWNoKGZ1bmN0aW9uKGksaW5wdXQpe1xuICAgICAgICAgICAgICAgICQoaW5wdXQpXG4gICAgICAgICAgICAgICAgICAgIC5wcm9wKCdjaGVja2VkJyxmYWxzZSlcbiAgICAgICAgICAgICAgICAgICAgLmNoYW5nZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcuY2NsLWMtcm9vbV9fc2xvdCcpLnJlbW92ZUNsYXNzKCdjY2wtaXMtZGlzYWJsZWQnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy4kZWwuc3VibWl0KGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGF0Lm9uU3VibWl0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGZvcm1SZWxvYWQuY2xpY2soZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHRoYXQucmVsb2FkRm9ybSgpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuaW5pdERhdGVFdmVudHMgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGRhdGVTZWxlY3QuY2hhbmdlKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0aGF0Lm9uRGF0ZUNoYW5nZSgpO1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUub25EYXRlQ2hhbmdlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmRhdGVZbWQgPSB0aGlzLiRkYXRlU2VsZWN0LnZhbCgpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zZXRMb2FkaW5nKCk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTY2hlZHVsZURhdGEoKTtcbiAgICAgICAgXG4gICAgfTtcbiAgICAgICAgXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmluaXRTbG90RXZlbnRzID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICBcbiAgICAgICAgaWYgKCB0aGlzLiRyb29tU2xvdElucHV0cyAmJiB0aGlzLiRyb29tU2xvdElucHV0cy5sZW5ndGggKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gaW5wdXQgY2hhbmdlIGV2ZW50IGhhbmRsZXJcbiAgICAgICAgICAgIHRoaXMuJHJvb21TbG90SW5wdXRzLmNoYW5nZShmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBpbnB1dCA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdGhhdC5vblNsb3RDaGFuZ2UoaW5wdXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH07XG4gICAgXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLm9uU2xvdENoYW5nZSA9IGZ1bmN0aW9uKGNoYW5nZWRJbnB1dCl7XG4gICAgICAgIFxuICAgICAgICAvLyBpZiBpbnB1dCBjaGVja2VkLCBhZGQgaXQgdG8gc2VsZWN0ZWQgc2V0XG4gICAgICAgIGlmICggJChjaGFuZ2VkSW5wdXQpLnByb3AoJ2NoZWNrZWQnKSApIHtcblxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMucHVzaChjaGFuZ2VkSW5wdXQpO1xuICAgICAgICAgICAgJChjaGFuZ2VkSW5wdXQpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5hZGRDbGFzcygnY2NsLWlzLWNoZWNrZWQnKTtcbiAgIFxuICAgICAgICB9IFxuICAgICAgICBcbiAgICAgICAgLy8gaWYgaW5wdXQgdW5jaGVja2VkLCByZW1vdmUgaXQgZnJvbSB0aGUgc2VsZWN0ZWQgc2V0XG4gICAgICAgIGVsc2UgeyBcblxuICAgICAgICAgICAgdmFyIGNoYW5nZWRJbnB1dEluZGV4ID0gdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZihjaGFuZ2VkSW5wdXQpO1xuXG4gICAgICAgICAgICBpZiAoIGNoYW5nZWRJbnB1dEluZGV4ID4gLTEgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuc3BsaWNlKCBjaGFuZ2VkSW5wdXRJbmRleCwgMSApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJChjaGFuZ2VkSW5wdXQpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKS5yZW1vdmVDbGFzcygnY2NsLWlzLWNoZWNrZWQnKTtcblxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICAvLyB1cGRhdGUgdGhlIHNsb3RzIHdoaWNoIGNhbiBub3cgYmUgY2xpY2thYmxlXG4gICAgICAgIHRoaXMudXBkYXRlU2VsZWN0YWJsZVNsb3RzKCk7XG4gICAgICAgIFxuICAgICAgICAvLyB1cGRhdGUgYnV0dG9uIHN0YXRlc1xuICAgICAgICBpZiAoIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCA+IDAgKSB7XG4gICAgICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0bi5zaG93KCk7XG4gICAgICAgICAgICB0aGlzLiRmb3JtU3VibWl0LmF0dHIoJ2Rpc2FibGVkJyxmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRmb3JtU3VibWl0LmF0dHIoJ2Rpc2FibGVkJyx0cnVlKTtcbiAgICAgICAgICAgIHRoaXMuJHJlc2V0U2VsZWN0aW9uQnRuLmhpZGUoKTsgXG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGUgdGV4dFxuICAgICAgICB0aGlzLnNldEN1cnJlbnREdXJhdGlvblRleHQoKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUudXBkYXRlU2VsZWN0YWJsZVNsb3RzID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgICAgIC8vIElGIHRoZXJlIGFyZSBzZWxlY3RlZCBzbG90c1xuICAgICAgICBpZiAoIHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCApe1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIGZpcnN0LCBzb3J0IHRoZSBzZWxlY3RlZCBzbG90c1xuICAgICAgICAgICAgdGhhdC5zZWxlY3RlZFNsb3RJbnB1dHMuc29ydChmdW5jdGlvbihhLGIpe1xuICAgICAgICAgICAgICAgIHJldHVybiBhLmdldEF0dHJpYnV0ZSgndmFsdWUnKSA+IGIuZ2V0QXR0cmlidXRlKCd2YWx1ZScpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIC8vIGdyYWIgdGhlIGZpcnN0IGFuZCBsYXN0IHNlbGVjdGVkIHNsb3RzXG4gICAgICAgICAgICB2YXIgbWluSW5wdXQgPSB0aGF0LnNlbGVjdGVkU2xvdElucHV0c1swXSxcbiAgICAgICAgICAgICAgICBtYXhJbnB1dCA9IHRoYXQuc2VsZWN0ZWRTbG90SW5wdXRzW3RoYXQuc2VsZWN0ZWRTbG90SW5wdXRzLmxlbmd0aCAtIDFdO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBnZXQgdGhlIGluZGV4ZXMgb2YgdGhlIGZpcnN0IGFuZCBsYXN0IHNsb3RzIGZyb20gdGhlICRyb29tU2xvdElucHV0cyBqUXVlcnkgb2JqZWN0XG4gICAgICAgICAgICB2YXIgbWluSW5kZXggPSB0aGF0LiRyb29tU2xvdElucHV0cy5pbmRleChtaW5JbnB1dCksXG4gICAgICAgICAgICAgICAgbWF4SW5kZXggPSB0aGF0LiRyb29tU2xvdElucHV0cy5pbmRleChtYXhJbnB1dCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGNhbGN1bGF0ZSB0aGUgbWluIGFuZCBtYXggc2xvdCBpbmRleGVzIHdoaWNoIGFyZSBzZWxlY3RhYmxlXG4gICAgICAgICAgICB2YXIgbWluQWxsb3dhYmxlID0gbWF4SW5kZXggLSB0aGF0Lm1heFNsb3RzLFxuICAgICAgICAgICAgICAgIG1heEFsbG93YWJsZSA9IG1pbkluZGV4ICsgdGhhdC5tYXhTbG90cztcbiAgICBcbiAgICAgICAgICAgIC8vIGxvb3AgdGhyb3VnaCByb29tIHNsb3RzIGFuZCB1cGRhdGUgdGhlbSBhY2NvcmRpbmdseVxuICAgICAgICAgICAgdGhhdC4kcm9vbVNsb3RJbnB1dHMuZWFjaChmdW5jdGlvbihpLCBpbnB1dCl7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gZW5hYmxlcyBvciBkaXNhYmxlcyBkZXBlbmRpbmcgb24gd2hldGhlciBzbG90IGZhbGxzIHdpdGhpbiByYW5nZVxuICAgICAgICAgICAgICAgIGlmICggbWluQWxsb3dhYmxlIDwgaSAmJiBpIDwgbWF4QWxsb3dhYmxlICkge1xuICAgICAgICAgICAgICAgICAgICB0aGF0LmVuYWJsZVNsb3QoaW5wdXQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoYXQuZGlzYWJsZVNsb3QoaW5wdXQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBhZGQgYSBjbGFzcyB0byB0aGUgc2xvdHMgdGhhdCBmYWxsIGJldHdlZW4gdGhlIG1pbiBhbmQgbWF4IHNlbGVjdGVkIHNsb3RzXG4gICAgICAgICAgICAgICAgaWYgKCBtaW5JbmRleCA8IGkgJiYgaSA8IG1heEluZGV4ICkge1xuICAgICAgICAgICAgICAgICAgICAkKGlucHV0KS5wYXJlbnQoKS5hZGRDbGFzcygnY2NsLWlzLWJldHdlZW4nKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKGlucHV0KS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnY2NsLWlzLWJldHdlZW4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIH0gXG4gICAgICAgIC8vIEVMU0Ugbm8gc2VsZWN0ZWQgc2xvdHNcbiAgICAgICAgZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIGVuYWJsZSBhbGwgc2xvdHNcbiAgICAgICAgICAgIHRoYXQuJHJvb21TbG90SW5wdXRzLmVhY2goZnVuY3Rpb24oaSwgaW5wdXQpe1xuICAgICAgICAgICAgICAgIHRoYXQuZW5hYmxlU2xvdChpbnB1dCk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuY2xlYXJTbG90ID0gZnVuY3Rpb24oc2xvdCkge1xuICAgICAgICAvLyBzbG90IGNhbiBiZSBlaXRoZXIgdGhlIGNoZWNrYm94IGlucHV0IC1PUi0gdGhlIGNoZWNrYm94J3MgY29udGFpbmVyXG5cbiAgICAgICAgdmFyIGlucHV0SW5kZXg7XG5cbiAgICAgICAgLy8gaWYgaXQncyB0aGUgY2hlY2tib3guXG4gICAgICAgIGlmICggJChzbG90KS5pcygnW3R5cGU9XCJjaGVja2JveFwiXScpICkge1xuICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLmVuYWJsZVNsb3Qoc2xvdCk7XG5cbiAgICAgICAgICAgIC8vIGdldCBpbmRleCBvZiB0aGUgaW5wdXQgZnJvbSBzZWxlY3RlZCBzZXRcbiAgICAgICAgICAgIGlucHV0SW5kZXggPSB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5pbmRleE9mKHNsb3QpO1xuICAgICAgICAgICAgXG4gICAgICAgIC8vIGlmIGl0J3MgdGhlIGNvbnRhaW5lclxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICB2YXIgJGlucHV0ID0gJChzbG90KS5maW5kKCdbdHlwZT1cImNoZWNrYm94XCJdJyk7XG5cbiAgICAgICAgICAgIHRoaXMuZW5hYmxlU2xvdCgkaW5wdXRbMF0pO1xuXG4gICAgICAgICAgICAvLyBnZXQgaW5kZXggb2YgdGhlIGlucHV0IGZyb20gc2VsZWN0ZWQgc2V0XG4gICAgICAgICAgICBpbnB1dEluZGV4ID0gdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMuaW5kZXhPZiggJGlucHV0WzBdICk7XG5cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlbW92ZSBpbnB1dCBmcm9tIHNlbGVjdGVkIHNldFxuICAgICAgICB0aGlzLnNlbGVjdGVkU2xvdElucHV0cy5zcGxpY2UoIGlucHV0SW5kZXgsIDEgKTtcblxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuY2xlYXJBbGxTbG90cyA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcblxuICAgICAgICB0aGlzLiRyZXNldFNlbGVjdGlvbkJ0bi5oaWRlKCk7XG4gICAgICAgIFxuICAgICAgICAvLyBFeHRlbmQgdGhlIHNlbGVjdGVkIGlucHV0cyBhcnJheSB0byBhIG5ldyB2YXJpYWJsZS5cbiAgICAgICAgLy8gVGhlIHNlbGVjdGVkIGlucHV0cyBhcnJheSBjaGFuZ2VzIHdpdGggZXZlcnkgY2xlYXJTbG90KCkgY2FsbFxuICAgICAgICAvLyBzbywgYmVzdCB0byBsb29wIHRocm91Z2ggYW4gdW5jaGFuZ2luZyBhcnJheS5cbiAgICAgICAgdmFyIHNlbGVjdGVkSW5wdXRzID0gJC5leHRlbmQoIFtdLCB0aGF0LnNlbGVjdGVkU2xvdElucHV0cyApO1xuXG4gICAgICAgICQoc2VsZWN0ZWRJbnB1dHMpLmVhY2goZnVuY3Rpb24oaSxpbnB1dCl7XG4gICAgICAgICAgICB0aGF0LmNsZWFyU2xvdChpbnB1dCk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5hY3RpdmF0ZVNsb3QgPSBmdW5jdGlvbihzbG90KSB7XG4gICAgICAgIC8vIHNsb3QgY2FuIGJlIGVpdGhlciB0aGUgY2hlY2tib3ggLU9SLSB0aGUgY2hlY2tib3gncyBjb250YWluZXJcblxuICAgICAgICB2YXIgc2xvdElzQ2hlY2tib3ggPSAkKHNsb3QpLmlzKCdbdHlwZT1cImNoZWNrYm94XCJdJyksXG4gICAgICAgICAgICAkY29udGFpbmVyID0gc2xvdElzQ2hlY2tib3ggPyAkKHNsb3QpLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKSA6ICQoc2xvdCk7XG5cbiAgICAgICAgLy8gbmV2ZXIgc2V0IGFuIG9jY3VwaWVkIHNsb3QgYXMgYWN0aXZlXG4gICAgICAgIGlmICggJGNvbnRhaW5lci5oYXNDbGFzcygnY2NsLWlzLW9jY3VwaWVkJykgKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoICQoc2xvdCkuaXMoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKSApIHtcblxuICAgICAgICAgICAgLy8gaWYgaXQncyB0aGUgY2hlY2tib3guXG4gICAgICAgICBcbiAgICAgICAgICAgICQoc2xvdCkucHJvcCgnY2hlY2tlZCcsdHJ1ZSk7XG4gICAgICAgICAgICAkY29udGFpbmVyLmFkZENsYXNzKCdjY2wtaXMtY2hlY2tlZCcpO1xuICAgICAgICAgICAgXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIC8vIGlmIGl0J3MgdGhlIGNvbnRhaW5lclxuXG4gICAgICAgICAgICAkY29udGFpbmVyXG4gICAgICAgICAgICAgICAgLmFkZENsYXNzKCdjY2wtaXMtY2hlY2tlZCcpXG4gICAgICAgICAgICAgICAgLmZpbmQoJ1t0eXBlPVwiY2hlY2tib3hcIl0nKVxuICAgICAgICAgICAgICAgICAgICAucHJvcCgnY2hlY2tlZCcsdHJ1ZSk7XG5cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUuZW5hYmxlU2xvdCA9IGZ1bmN0aW9uKHNsb3QpIHtcbiAgICAgICAgJChzbG90KVxuICAgICAgICAgICAgLnByb3AoJ2Rpc2FibGVkJywgZmFsc2UpXG4gICAgICAgICAgICAucGFyZW50KCcuY2NsLWMtcm9vbV9fc2xvdCcpXG4gICAgICAgICAgICAgICAgLnJlbW92ZUNsYXNzKCdjY2wtaXMtZGlzYWJsZWQnKTtcbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLmRpc2FibGVTbG90ID0gZnVuY3Rpb24oc2xvdCkge1xuICAgICAgICAkKHNsb3QpXG4gICAgICAgICAgICAucHJvcCgnZGlzYWJsZWQnLCB0cnVlKVxuICAgICAgICAgICAgLnBhcmVudCgnLmNjbC1jLXJvb21fX3Nsb3QnKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnY2NsLWlzLWRpc2FibGVkJyk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5zZXRMb2FkaW5nID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kY3VycmVudER1cmF0aW9uVGV4dC50ZXh0KCdMb2FkaW5nIHNjaGVkdWxlLi4uJyk7XG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjY2wtaXMtbG9hZGluZycpO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUudW5zZXRMb2FkaW5nID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5zZXRDdXJyZW50RHVyYXRpb25UZXh0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgdmFyIHNlbGVjdGlvbiA9ICQuZXh0ZW5kKFtdLHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzKSxcbiAgICAgICAgICAgIHNvcnRlZFNlbGVjdGlvbiA9IHNlbGVjdGlvbi5zb3J0KGZ1bmN0aW9uKGEsYil7IFxuICAgICAgICAgICAgICAgIHJldHVybiBhLnZhbHVlID4gYi52YWx1ZTsgXG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIHNlbGVjdGlvbkxlbmd0aCA9IHNvcnRlZFNlbGVjdGlvbi5sZW5ndGg7XG4gICAgICAgIFxuICAgICAgICBpZiAoIHNlbGVjdGlvbkxlbmd0aCA+IDAgKSB7XG5cbiAgICAgICAgICAgIHZhciB0aW1lMVZhbCA9IHNvcnRlZFNlbGVjdGlvblswXS52YWx1ZSxcbiAgICAgICAgICAgICAgICByZWFkYWJsZVRpbWUxID0gdGhpcy5yZWFkYWJsZVRpbWUoIG5ldyBEYXRlKHRpbWUxVmFsKSApO1xuXG4gICAgICAgICAgICB2YXIgdGltZTJWYWwgPSAoIHNlbGVjdGlvbkxlbmd0aCA+PSAyICkgPyBzb3J0ZWRTZWxlY3Rpb25bc29ydGVkU2VsZWN0aW9uLmxlbmd0aCAtIDFdLnZhbHVlIDogdGltZTFWYWwsXG4gICAgICAgICAgICAgICAgdGltZTJUID0gbmV3IERhdGUodGltZTJWYWwpLmdldFRpbWUoKSArICggdGhpcy5zbG90TWludXRlcyAqIDYwICogMTAwMCApLFxuICAgICAgICAgICAgICAgIHJlYWRhYmxlVGltZTIgPSB0aGlzLnJlYWRhYmxlVGltZSggbmV3IERhdGUodGltZTJUKSApO1xuXG4gICAgICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoICdGcm9tICcgKyByZWFkYWJsZVRpbWUxICsgJyB0byAnICsgcmVhZGFibGVUaW1lMiApO1xuXG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICB0aGlzLiRjdXJyZW50RHVyYXRpb25UZXh0LnRleHQoJ1BsZWFzZSBzZWxlY3QgYXZhaWxhYmxlIHRpbWUgc2xvdHMnKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnNldE1heFRpbWVUZXh0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG1heE1pbnV0ZXMgPSB0aGlzLm1heFNsb3RzICogdGhpcy5zbG90TWludXRlcyxcbiAgICAgICAgICAgIG1heFRleHQ7XG5cbiAgICAgICAgaWYgKCBtYXhNaW51dGVzID4gNjAgKSB7XG4gICAgICAgICAgICBtYXhUZXh0ID0gbWF4TWludXRlcyAvIDYwICsgJyBob3Vycyc7ICAgIFxuICAgICAgICB9IFxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIG1heFRleHQgPSBtYXhNaW51dGVzICsgJyBtaW51dGVzJztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJG1heFRpbWUudGV4dCggbWF4VGV4dCApO1xuICAgIH07XG5cbiAgICBSb29tUmVzRm9ybS5wcm90b3R5cGUucmVhZGFibGVUaW1lID0gZnVuY3Rpb24oIGRhdGVPYmosIGZvcm1hdCApIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBsb2NhbGVTdHJpbmcgPSBkYXRlT2JqLnRvTG9jYWxlU3RyaW5nKCB0aGlzLmxvY2FsZSwgdGhpcy50aW1lWm9uZSApLCAvLyBlLmcuIC0tPiBcIjExLzcvMjAxNywgNDozODozMyBBTVwiXG4gICAgICAgICAgICBsb2NhbGVUaW1lID0gbG9jYWxlU3RyaW5nLnNwbGl0KFwiLCBcIilbMV07IC8vIFwiNDozODozMyBBTVwiXG5cbiAgICAgICAgdmFyIHRpbWUgPSBsb2NhbGVUaW1lLnNwbGl0KCcgJylbMF0sIC8vIFwiNDozODozM1wiLFxuICAgICAgICAgICAgdGltZU9iaiA9IHtcbiAgICAgICAgICAgICAgICBhOiBsb2NhbGVUaW1lLnNwbGl0KCcgJylbMV0udG9Mb3dlckNhc2UoKSwgLy8gKGFtIG9yIHBtKSAtLT4gXCJhXCJcbiAgICAgICAgICAgICAgICBoOiB0aW1lLnNwbGl0KCc6JylbMF0sIC8vIFwiNFwiXG4gICAgICAgICAgICAgICAgbTogdGltZS5zcGxpdCgnOicpWzFdLCAvLyBcIjM4XCJcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgaWYgKCBmb3JtYXQgJiYgdHlwZW9mIGZvcm1hdCA9PT0gJ3N0cmluZycgKSB7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciBmb3JtYXRBcnIgPSBmb3JtYXQuc3BsaXQoJycpLFxuICAgICAgICAgICAgICAgIHJlYWRhYmxlQXJyID0gW107XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGZvciAoIHZhciBpID0gMDsgaSA8IGZvcm1hdEFyci5sZW5ndGg7IGkrKyApIHtcbiAgICAgICAgICAgICAgICBpZiAoIHRpbWVPYmpbZm9ybWF0QXJyW2ldXSApIHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZGFibGVBcnIucHVzaCh0aW1lT2JqW2Zvcm1hdEFycltpXV0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJlYWRhYmxlQXJyLnB1c2goZm9ybWF0QXJyW2ldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiByZWFkYWJsZUFyci5qb2luKCcnKTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRpbWVPYmouaCArICc6JyArIHRpbWVPYmoubSArIHRpbWVPYmouYTtcbiAgICAgICAgXG4gICAgfTtcblxuICAgIFJvb21SZXNGb3JtLnByb3RvdHlwZS5vblN1Ym1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcblxuICAgICAgICBpZiAoICEgdGhpcy5zZWxlY3RlZFNsb3RJbnB1dHMubGVuZ3RoICkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLiRmb3JtTm90aWZpY2F0aW9uXG4gICAgICAgICAgICAgICAgLmNzcygnZGlzcGxheScsJ25vbmUnKVxuICAgICAgICAgICAgICAgIC5hZGRDbGFzcygnY2NsLWlzLWVycm9yJylcbiAgICAgICAgICAgICAgICAudGV4dCgnUGxlYXNlIHNlbGVjdCBhIHRpbWUgZm9yIHlvdXIgcmVzZXJ2YXRpb24nKVxuICAgICAgICAgICAgICAgIC5hcHBlbmRUbyh0aGlzLiRmb3JtQ29udGVudClcbiAgICAgICAgICAgICAgICAuc2xpZGVEb3duKENDTC5EVVJBVElPTik7ICAgICAgICAgICAgXG5cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSBcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLiRmb3JtTm90aWZpY2F0aW9uLnJlbW92ZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgc29ydGVkU2VsZWN0aW9uID0gJC5leHRlbmQoW10sIHRoaXMuc2VsZWN0ZWRTbG90SW5wdXRzKS5zb3J0KGZ1bmN0aW9uKGEsYil7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGEudmFsdWUgPiBiLnZhbHVlO1xuICAgICAgICAgICAgfSksXG4gICAgICAgICAgICBzdGFydCA9IHNvcnRlZFNlbGVjdGlvblswXS52YWx1ZSxcbiAgICAgICAgICAgIGVuZCA9ICggc29ydGVkU2VsZWN0aW9uLmxlbmd0aCA+IDEgKSA/ICQoIHNvcnRlZFNlbGVjdGlvblsgc29ydGVkU2VsZWN0aW9uLmxlbmd0aCAtIDEgXSApLmRhdGEoJ3RvJykgOiAkKCBzb3J0ZWRTZWxlY3Rpb25bMF0gKS5kYXRhKCd0bycpLFxuICAgICAgICAgICAgcGF5bG9hZCA9IHtcbiAgICAgICAgICAgICAgICBcImlpZFwiOjMzMyxcbiAgICAgICAgICAgICAgICBcInN0YXJ0XCI6IHN0YXJ0LFxuICAgICAgICAgICAgICAgIFwiZm5hbWVcIjogdGhpcy4kZWxbMF0uZm5hbWUudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJsbmFtZVwiOiB0aGlzLiRlbFswXS5sbmFtZS52YWx1ZSxcbiAgICAgICAgICAgICAgICBcImVtYWlsXCI6IHRoaXMuJGVsWzBdLmVtYWlsLnZhbHVlLFxuICAgICAgICAgICAgICAgIFwibmlja25hbWVcIjogdGhpcy4kZWxbMF0ubmlja25hbWUudmFsdWUsXG4gICAgICAgICAgICAgICAgXCJib29raW5nc1wiOltcbiAgICAgICAgICAgICAgICAgICAgeyBcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiaWRcIjogdGhpcy5yb29tSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInRvXCI6IGVuZFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfTtcblxuICAgICAgICB0aGlzLiRlbC5hZGRDbGFzcygnY2NsLWlzLXN1Ym1pdHRpbmcnKTtcbiAgICAgICAgdGhpcy4kZm9ybUNhbmNlbC5wcm9wKCdkaXNhYmxlZCcsdHJ1ZSk7XG4gICAgICAgIHRoaXMuJGZvcm1TdWJtaXQudGV4dCgnU2VuZGluZy4uLicpLnByb3AoJ2Rpc2FibGVkJyx0cnVlKTtcblxuICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgIGFjdGlvbjogJ3JlcXVlc3RfYm9va2luZycsXG4gICAgICAgICAgICBjY2xfbm9uY2U6IENDTC5ub25jZSxcbiAgICAgICAgICAgIHBheWxvYWQ6IHBheWxvYWRcbiAgICAgICAgfTtcblxuICAgICAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTWFrZSBhIHJlcXVlc3QgaGVyZSB0byByZXNlcnZlIHNwYWNlXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuICAgICAgICAkLnBvc3Qoe1xuICAgICAgICAgICAgICAgIHVybDogQ0NMLmFqYXhfdXJsLFxuICAgICAgICAgICAgICAgIGRhdGE6IGRhdGFcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihyZXNwb25zZSl7XG4gICAgICAgICAgICAgICAgX2hhbmRsZVN1Ym1pdFJlc3BvbnNlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAuZmFpbChmdW5jdGlvbihlcnJvcil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5hbHdheXMoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLXN1Ym1pdHRpbmcnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIGZ1bmN0aW9uIF9oYW5kbGVTdWJtaXRSZXNwb25zZShyZXNwb25zZSkge1xuXG4gICAgICAgICAgICB2YXIgcmVzcG9uc2VIVE1MLFxuICAgICAgICAgICAgICAgIHJlc3BvbnNlT2JqZWN0ID0gSlNPTi5wYXJzZShyZXNwb25zZSk7XG5cbiAgICAgICAgICAgIGlmICggcmVzcG9uc2VPYmplY3QuYm9va2luZ19pZCApIHtcbiAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwgPSAgWyc8cCBjbGFzcz1cImNjbC1oMiBjY2wtdS1tdC0wXCI+U3VjY2VzcyE8L3A+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxwIGNsYXNzPVwiY2NsLWg0XCI+WW91ciBib29raW5nIElEIGlzIDxzcGFuIGNsYXNzPVwiY2NsLXUtY29sb3Itc2Nob29sXCI+JyArIHJlc3BvbnNlT2JqZWN0LmJvb2tpbmdfaWQgKyAnPC9zcGFuPjwvcD4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHAgY2xhc3M9XCJjY2wtaDRcIj5QbGVhc2UgY2hlY2sgeW91ciBlbWFpbCB0byBjb25maXJtIHlvdXIgYm9va2luZy48L3A+J107XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTCA9ICBbJzxwIGNsYXNzPVwiY2NsLWgzIGNjbC11LW10LTBcIj5Tb3JyeSwgYnV0IHdlIGNvdWxkblxcJ3QgcHJvY2VzcyB5b3VyIHJlc2VydmF0aW9uLjwvcD4nLCc8cCBjbGFzcz1cImNjbC1oNFwiPkVycm9yczo8L3A+J107XG4gICAgICAgICAgICAgICAgJChyZXNwb25zZU9iamVjdC5lcnJvcnMpLmVhY2goZnVuY3Rpb24oaSwgZXJyb3Ipe1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZUhUTUwucHVzaCgnPHAgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3JcIj4nICsgZXJyb3IgKyAnPC9wPicpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJlc3BvbnNlSFRNTC5wdXNoKCc8cCBjbGFzcz1cImNjbC1oNFwiPlBsZWFzZSB0YWxrIHRvIHlvdXIgbmVhcmVzdCBsaWJyYXJpYW4gZm9yIGhlbHAuPC9wPicpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGF0LiRmb3JtQ2FuY2VsLnByb3AoJ2Rpc2FibGVkJyxmYWxzZSkudGV4dCgnQ2xvc2UnKTtcbiAgICAgICAgICAgIHRoYXQuJGZvcm1TdWJtaXQuaGlkZSgpO1xuICAgICAgICAgICAgdGhhdC4kZm9ybVJlbG9hZC5zaG93KCk7XG5cbiAgICAgICAgICAgIHRoYXQuJGZvcm1Db250ZW50LmFuaW1hdGUoe29wYWNpdHk6IDB9LCBDQ0wuRFVSQVRJT04pO1xuICAgICAgICAgICAgdGhhdC4kZm9ybVJlc3BvbnNlXG4gICAgICAgICAgICAgICAgLmRlbGF5KENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuYW5pbWF0ZSh7b3BhY2l0eTogMX0sIENDTC5EVVJBVElPTilcbiAgICAgICAgICAgICAgICAuaHRtbChyZXNwb25zZUhUTUwpO1xuICAgICAgICAgICAgdGhhdC4kZm9ybUNvbnRlbnRcbiAgICAgICAgICAgICAgICAuZGVsYXkoQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5hbmltYXRlKHtoZWlnaHQ6IHRoYXQuJGZvcm1SZXNwb25zZS5oZWlnaHQoKSArICdweCcgfSwgQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgICAgIC5jc3Moe3pJbmRleDogJy0xJ30pO1xuXG4gICAgICAgICAgICB0aGF0LiRlbC5yZW1vdmVDbGFzcygnY2NsLWlzLXN1Ym1pdHRpbmcnKTtcblxuICAgICAgICB9XG5cbiAgICB9O1xuXG4gICAgUm9vbVJlc0Zvcm0ucHJvdG90eXBlLnJlbG9hZEZvcm0gPSBmdW5jdGlvbigpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kZm9ybUNhbmNlbC50ZXh0KCdDYW5jZWwnKTtcbiAgICAgICAgdGhpcy4kZm9ybVN1Ym1pdC50ZXh0KCdTdWJtaXQnKS5wcm9wKCdkaXNhYmxlZCcsZmFsc2UpLnNob3coKTtcbiAgICAgICAgdGhpcy4kZm9ybVJlbG9hZC5oaWRlKCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmNsZWFyQWxsU2xvdHMoKTtcblxuICAgICAgICB0aGlzLiRmb3JtUmVzcG9uc2VcbiAgICAgICAgICAgIC5hbmltYXRlKHtvcGFjaXR5OiAwfSwgQ0NMLkRVUkFUSU9OKVxuICAgICAgICAgICAgLmRlbGF5KENDTC5EVVJBVElPTilcbiAgICAgICAgICAgIC5odG1sKCcnKTtcbiAgICAgICAgdGhpcy4kZm9ybUNvbnRlbnRcbiAgICAgICAgICAgIC5kZWxheShDQ0wuRFVSQVRJT04pXG4gICAgICAgICAgICAuY3NzKHsgaGVpZ2h0OiAnJywgekluZGV4OiAnJyB9KVxuICAgICAgICAgICAgLmFuaW1hdGUoe29wYWNpdHk6IDF9LCBDQ0wuRFVSQVRJT04pO1xuXG4gICAgICAgIHRoaXMuc2V0TG9hZGluZygpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy51cGRhdGVTY2hlZHVsZURhdGEoKTtcbiAgICB9O1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuICAgIC8vIEhlbHBlcnNcblxuICAgIGZ1bmN0aW9uIF9zb3J0QnlLZXkoIGFyciwga2V5LCBvcmRlciApIHtcbiAgICAgICAgZnVuY3Rpb24gc29ydEFTQyhhLGIpIHtcbiAgICAgICAgICAgIGlmIChhW2tleV0gPCBiW2tleV0pe1xuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChhW2tleV0gPiBiW2tleV0pe1xuICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gc29ydERFU0MoYSxiKSB7XG4gICAgICAgICAgICBpZiAoYVtrZXldID4gYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYVtrZXldIDwgYltrZXldKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICggJ0RFU0MnID09PSBvcmRlciApIHtcbiAgICAgICAgICAgIGFyci5zb3J0KHNvcnRERVNDKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyci5zb3J0KHNvcnRBU0MpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAvL1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmpzLXJvb20tcmVzLWZvcm0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgUm9vbVJlc0Zvcm0odGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIiwiLyoqXG4gKiBTZWFyY2hib3ggQmVoYXZpb3JcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0IFxuXHQvLyBHbG9iYWwgdmFyaWFibGVzXG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcblx0XHRFTlRFUiA9IDEzLCBUQUIgPSA5LCBTSElGVCA9IDE2LCBDVFJMID0gMTcsIEFMVCA9IDE4LCBDQVBTID0gMjAsIEVTQyA9IDI3LCBMQ01EID0gOTEsIFJDTUQgPSA5MiwgTEFSUiA9IDM3LCBVQVJSID0gMzgsIFJBUlIgPSAzOSwgREFSUiA9IDQwLFxuXHRcdGZvcmJpZGRlbktleXMgPSBbRU5URVIsIFRBQiwgU0hJRlQsIENUUkwsIEFMVCwgQ0FQUywgRVNDLCBMQ01ELCBSQ01ELCBMQVJSLCBVQVJSLCBSQVJSLCBEQVJSXSxcblx0XHRpbmRleE5hbWVzID0ge1xuXHRcdFx0dGk6ICdUaXRsZScsXG5cdFx0XHRrdzogJ0tleXdvcmQnLFxuXHRcdFx0YXU6ICdBdXRob3InLFxuXHRcdFx0c3U6ICdTdWJqZWN0J1xuXHRcdH07XG5cblx0Ly8gRXh0ZW5kIGpRdWVyeSBzZWxlY3RvclxuXHQkLmV4dGVuZCgkLmV4cHJbJzonXSwge1xuXHRcdGZvY3VzYWJsZTogZnVuY3Rpb24oZWwsIGluZGV4LCBzZWxlY3Rvcil7XG5cdFx0XHRyZXR1cm4gJChlbCkuaXMoJ2EsIGJ1dHRvbiwgOmlucHV0LCBbdGFiaW5kZXhdLCBzZWxlY3QnKTtcblx0XHR9XG5cdH0pO1xuXHRcdFxuICAgIHZhciBTZWFyY2hBdXRvY29tcGxldGUgPSBmdW5jdGlvbihlbGVtKXtcblx0XHRcblx0XHR0aGlzLiRlbFx0XHRcdD0gJChlbGVtKTtcblx0XHR0aGlzLiRmb3JtXHRcdFx0PSB0aGlzLiRlbC5maW5kKCdmb3JtJyk7XG5cdFx0dGhpcy4kaW5wdXQgXHRcdD0gJChlbGVtKS5maW5kKCcjY2NsLXNlYXJjaCcpO1xuXHRcdHRoaXMuJHJlc3BvbnNlXHRcdD0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNlYXJjaC1yZXN1bHRzJyk7XG5cdFx0dGhpcy4kcmVzcG9uc2VMaXN0XHQ9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1zZWFyY2gtcmVzdWx0c19fbGlzdCcpO1xuXHRcdHRoaXMuJHJlc3BvbnNlSXRlbXMgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtc2VhcmNoLWl0ZW0nKTtcblx0XHR0aGlzLiRyZXN1bHRzTGlua1x0PSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtc2VhcmNoLXJlc3VsdHNfX2Zvb3RlcicpO1xuXHRcdHRoaXMuJHNlYXJjaEluZGV4XHQ9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1zZWFyY2gtaW5kZXgnKTtcblx0XHR0aGlzLiRpbmRleENvbnRhaW5cdD0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNlYXJjaC1pbmRleC1jb250YWluZXInICk7XG5cdFx0dGhpcy4kc2VhcmNoU2NvcGVcdD0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNlYXJjaC1sb2NhdGlvbicpO1xuXHRcdHRoaXMuJHdvcmxkQ2F0TGlua1x0PSBudWxsO1xuXHRcdFxuXHRcdC8vY2hlY2sgdG8gc2VlIGlmIHRoaXMgc2VhcmNoYm94IGhhcyBsaXZlc2VhcmNoIGVuYWJsZWRcblx0XHR0aGlzLiRhY3RpdmF0ZUxpdmVTZWFyY2hcdD0gJCh0aGlzLiRlbCkuZGF0YSgnbGl2ZXNlYXJjaCcpO1xuXHRcdHRoaXMubG9jYXRpb25UeXBlXHQ9ICAkKCB0aGlzLiRzZWFyY2hTY29wZSApLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpLmRhdGEoJ2xvYycpO1x0XG5cdFx0XG5cdFx0Ly9saWdodGJveCBlbGVtZW50c1xuXHRcdHRoaXMuJGxpZ2h0Ym94ID0gbnVsbDtcblx0XHR0aGlzLmxpZ2h0Ym94SXNPbiA9IGZhbHNlO1xuICAgIFx0dGhpcy4kZm9jdXNhYmxlID0gdGhpcy4kZWwuZmluZCggJzpmb2N1c2FibGUnICk7XG5cbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgIFxuICAgIH07XG5cbiAgICBTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgXHRcbiAgICBcdFxuICAgIFx0aWYoIHRoaXMuJGFjdGl2YXRlTGl2ZVNlYXJjaCApe1xuXHRcdFx0Ly9pZiBsaXZlc2VhcmNoIGlzIGVuYWJsZWQsIHRoZW4gcnVuIHRoZSBBSkFYIHJlc3VsdHNcblx0XHRcdHRoaXMuaXNMaXZlU2VhcmNoKCk7XG5cdFx0XG4gICAgXHR9ZWxzZXtcblx0XHRcdC8vdGhlbiBzaW1wbGUgZ2VuZXJhdGUgZ2VuZXJpYyBzZWFyY2ggYm94IHJlcXVlc3RzXG5cdFx0XHR0aGlzLmlzU3RhdGljU2VhcmNoKCk7XG4gICAgXHR9XG4gICAgXHRcblx0fTtcblx0XG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUudG9nZ2xlSW5kZXhcdD0gZnVuY3Rpb24oKXtcblx0XHRcblx0XHQvL3dhdGNoIGZvciBjaGFuZ2VzIHRvIHRoZSBsb2NhdGlvbiAtIGlmIG5vdCBhIFdNUyBzaXRlLCB0aGUgcmVtb3ZlIGluZGV4IGF0dHJpYnV0ZVxuXHRcdHZhciBfdGhpcyA9IHRoaXM7XG5cdFx0XG5cdFx0dGhpcy4kc2VhcmNoU2NvcGUub24oICdjaGFuZ2UnLCBmdW5jdGlvbigpe1xuXHRcdFx0XG5cdFx0XHRfdGhpcy5nZXRMb2NJRCgpO1x0XHRcdFx0XG5cdFx0XHRcblx0XHRcdGlmKCBfdGhpcy5sb2NhdGlvblR5cGUgIT0gJ3dtcycgKXtcblx0XHRcdFx0X3RoaXMuJGluZGV4Q29udGFpblxuXHRcdFx0XHRcdC5hZGRDbGFzcygnY2NsLXNlYXJjaC1pbmRleC1mYWRlJylcblx0XHRcdFx0XHQuZmFkZU91dCgyNTApO1xuXHRcdFx0fWVsc2UgaWYoIF90aGlzLmxvY2F0aW9uVHlwZSA9PSAnd21zJyApe1xuXHRcdFx0XHRfdGhpcy4kaW5kZXhDb250YWluXG5cdFx0XHRcdFx0LmZhZGVJbigyNTApXG5cdFx0XHRcdFx0LnJlbW92ZUNsYXNzKCdjY2wtc2VhcmNoLWluZGV4LWZhZGUnKTtcblxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0fSApO1xuXHRcdFx0XG5cdH07XG5cdFxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmdldExvY0lEXHQ9IGZ1bmN0aW9uKCl7XG5cdFx0Ly9mdW5jdGlvbiB0byBnZXQgdGhlIElEIG9mIGxvY2F0aW9uXG5cdFx0dmFyIF90aGlzID0gdGhpcztcblx0XHRfdGhpcy5sb2NhdGlvblR5cGUgPSAkKCBfdGhpcy4kc2VhcmNoU2NvcGUgKS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS5hdHRyKCdkYXRhLWxvYycpO1xuXHRcdFxuXHRcdC8vY29uc29sZS5sb2coIF90aGlzLmxvY2F0aW9uVHlwZSApO1xuXHR9O1xuXG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuaXNMaXZlU2VhcmNoID0gZnVuY3Rpb24oKXtcblx0XHQvL0FKQVggZXZlbnQgd2F0Y2hpbmcgZm9yIHVzZXIgaW5wdXQgYW5kIG91dHB1dHRpbmcgc3VnZ2VzdGVkIHJlc3VsdHNcblx0XHR2YXIgX3RoaXMgPSB0aGlzLFxuXHRcdFx0dGltZW91dDtcblx0XHRcblx0XHR0aGlzLmNyZWF0ZUxpZ2h0Qm94KCk7XG5cdFx0dGhpcy50b2dnbGVJbmRleCgpO1xuXHRcdFxuXHRcdC8va2V5Ym9hcmQgZXZlbnRzIGZvciBzZW5kaW5nIHF1ZXJ5IHRvIGRhdGFiYXNlXG5cdFx0dGhpcy4kaW5wdXRcblx0XHRcdC5vbigna2V5dXAga2V5cHJlc3MnLCBmdW5jdGlvbiAoZXZlbnQpIHtcblxuXHRcdFx0XHQvLyBjbGVhciBhbnkgcHJldmlvdXMgc2V0IHRpbWVvdXRcblx0XHRcdFx0Y2xlYXJUaW1lb3V0KF90aGlzLnRpbWVvdXQpO1xuXG5cdFx0XHRcdC8vIGlmIGtleSBpcyBmb3JiaWRkZW4sIHJldHVyblxuXHRcdFx0XHRpZiAoIGZvcmJpZGRlbktleXMuaW5kZXhPZiggZXZlbnQua2V5Q29kZSApID4gLTEgKSB7XG5cdFx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly8gZ2V0IHZhbHVlIG9mIHNlYXJjaCBpbnB1dFxuXHRcdFx0XHR2YXIgcXVlcnkgPSBfdGhpcy4kaW5wdXQudmFsKCk7XG5cdFx0XHRcdC8vcmVtb3ZlIGRvdWJsZSBxdW90YXRpb25zIGFuZCBvdGhlciBjaGFyYWN0ZXJzIGZyb20gc3RyaW5nXG5cdFx0XHRcdHF1ZXJ5ID0gcXVlcnkucmVwbGFjZSgvW15hLXpBLVowLTkgLScuLF0vZywgXCJcIik7XG5cdFx0XHRcdC8vY29uc29sZS5sb2cocXVlcnkpO1xuXG5cdFx0XHRcdC8vIHNldCBhIHRpbWVvdXQgZnVuY3Rpb24gdG8gdXBkYXRlIHJlc3VsdHMgb25jZSA2MDBtcyBwYXNzZXNcblx0XHRcdFx0X3RoaXMudGltZW91dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXG5cdFx0XHRcdFx0aWYgKCBxdWVyeS5sZW5ndGggPiAxICkge1xuXG5cdFx0XHRcdFx0XHQvL3NldCB0aGlzIHZlcmlhYmxlIGhlcmUgY3V6IHdlIGFyZSBnb2luZyB0byBuZWVkIGl0IGxhdGVyXG5cdFx0XHRcdFx0XHRfdGhpcy5nZXRMb2NJRCgpO1x0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0X3RoaXMuJHJlc3BvbnNlLnNob3coKTtcblx0XHRcdFx0XHQgXHRfdGhpcy5mZXRjaFJlc3VsdHMoIHF1ZXJ5ICk7XG5cdFx0XHRcdFx0IFx0XG5cdFx0XHRcdFx0IFx0XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdFx0X3RoaXMuJHJlc3BvbnNlTGlzdC5odG1sKCcnKTtcblx0XHRcdFx0XHR9XG5cblx0XHRcdFx0fSwgMjAwKTtcblxuXHRcdFx0fSlcblx0XHRcdC5mb2N1cyhmdW5jdGlvbigpe1xuXHRcdFx0XHRpZiAoIF90aGlzLiRpbnB1dC52YWwoKSAhPSAnJyApIHtcblx0XHRcdFx0XHRfdGhpcy4kcmVzcG9uc2Uuc2hvdygpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vX3RoaXMuY3JlYXRlTGlnaHRCb3goKTtcblx0XHRcdH0pXG5cdFx0XHQuYmx1cihmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdCQoZG9jdW1lbnQpLm9uKCdjbGljaycsIF9vbkJsdXJyZWRDbGljayk7XG5cdFx0XHR9KTtcblx0XHRcblx0XHRmdW5jdGlvbiBfb25CbHVycmVkQ2xpY2soZXZlbnQpIHtcblx0XHRcdFxuXHRcdFx0aWYgKCAhICQuY29udGFpbnMoIF90aGlzLiRlbFswXSwgZXZlbnQudGFyZ2V0ICkgKSB7XG5cdFx0XHRcdF90aGlzLiRyZXNwb25zZS5oaWRlKCk7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdC8vX3RoaXMuZGVzdHJveUxpZ2h0Qm94KCk7XG5cdFx0XHRcblx0XHRcdCQoZG9jdW1lbnQpLm9mZignY2xpY2snLCBfb25CbHVycmVkQ2xpY2spO1xuXG5cdFx0fVx0XHRcblxuXHRcdC8vc2VuZCBxdWVyeSB0byBkYXRhYmFzZSBiYXNlZCBvbiBvcHRpb24gY2hhbmdlXG5cdFx0dGhpcy4kc2VhcmNoSW5kZXguYWRkKHRoaXMuJHNlYXJjaFNjb3BlKS5jaGFuZ2UoZnVuY3Rpb24oKXtcblx0XHRcdF90aGlzLm9uU2VhcmNoSW5kZXhDaGFuZ2UoKTtcblx0XHR9KTtcblx0XHRcblx0XHQvL29uIHN1Ym1pdCBmaXJlIG9mZiBjYXRhbG9nIHNlYXJjaCB0byBXTVNcblx0XHR0aGlzLiRmb3JtLm9uKCdzdWJtaXQnLCAge190aGlzOiB0aGlzIH0gLCBfdGhpcy5oYW5kbGVTdWJtaXQgKTtcblx0XHRcdFxuXHR9O1xuXHRcblx0U2VhcmNoQXV0b2NvbXBsZXRlLnByb3RvdHlwZS5pc1N0YXRpY1NlYXJjaCA9IGZ1bmN0aW9uKCl7XG5cdFx0Ly9pZiBzdGF0aWMsIG5vIEFKQVggd2F0Y2hpbmcsIGluIHRoaXMgY2FzZSAtIGp1c3QgbG9va2luZyBmb3Igc3VibWlzc2lvbnNcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXHRcdFxuXHRcdHRoaXMudG9nZ2xlSW5kZXgoKTtcblx0XHRcblx0XHQvL29uIHN1Ym1pdCBmaXJlIG9mZiBjYXRhbG9nIHNlYXJjaCB0byBXTVNcblx0XHR0aGlzLiRmb3JtLm9uKCdzdWJtaXQnLCAge190aGlzOiB0aGlzIH0gLCBfdGhpcy5oYW5kbGVTdWJtaXQgKTtcdFx0XG5cdFx0XG5cdH07XG5cdFxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmhhbmRsZVN1Ym1pdCA9IGZ1bmN0aW9uKGV2ZW50KXtcblx0XHR2YXIgX3RoaXMgPSBldmVudC5kYXRhLl90aGlzO1xuXHRcdFx0ZXZlbnQucHJldmVudERlZmF1bHQoKTtcblx0XHRcdFxuXHRcdFx0aWYoX3RoaXMuJGFjdGl2YXRlTGl2ZVNlYXJjaCl7XG5cdFx0XHRcdGNsZWFyVGltZW91dChfdGhpcy50aW1lb3V0KTtcdFx0XHRcdFxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHQvL2dldCBzZWFyY2ggaW5kZXggYW5kIGlucHV0IHZhbHVlXG5cdFx0XHR2YXIgc2VhcmNoSW5kZXggPSBfdGhpcy4kc2VhcmNoSW5kZXgudmFsKCk7XG5cdFx0XHR2YXIgcXVlcnlTdHJpbmcgPSBfdGhpcy4kaW5wdXQudmFsKCk7XG5cdFx0XHRcblx0XHRcdC8vY2hlY2sgbG9jYXRpb24gdHlwZVxuXHRcdFx0X3RoaXMuZ2V0TG9jSUQoKTtcblx0XHRcdFxuXHRcdFx0Ly9pZiB0aGlzIFVSTCBpcyBmb3IgV01TLCB0aGVuIGFwcGVuZCB0aGUgc2VhcmNoaW5kZXggdG8gaXQsIGlmIG5vdCwgdGhlbiBzZW50IHF1ZXJ5U3RyaW5nIG9ubHlcblx0XHRcdC8vc2V0dXAgYXJyYXkgZm9yIGNvbnN0cnVjdFNlYXJjaFVSTCgpXG5cdFx0XHR2YXIgaW5wdXRfYXJyYXkgPSBbXTtcblx0XHRcdGlucHV0X2FycmF5WydxdWVyeVN0cmluZyddXHQ9IChfdGhpcy5sb2NhdGlvblR5cGUgPT09ICd3bXMnKSA/ICBzZWFyY2hJbmRleCArIFwiOlwiICsgcXVlcnlTdHJpbmcgOiBxdWVyeVN0cmluZztcblx0XHRcdGlucHV0X2FycmF5WydzZWFyY2hTY29wZSddXHQ9IF90aGlzLiRzZWFyY2hTY29wZS52YWwoKTtcblxuXHRcdFx0Ly9pZiBxdWVyeSBzdHJpbmcgaGFzIGNvbnRlbnQsIHRoZW4gcnVuXG5cdFx0XHRpZiAoIHF1ZXJ5U3RyaW5nLmxlbmd0aCA+IDEgKSB7XG5cblx0XHRcdFx0dmFyIHdtc0NvbnN0cnVjdGVkVXJsID0gX3RoaXMuY29uc3RydWN0U2VhcmNoVVJMKGlucHV0X2FycmF5KTtcblx0XHRcdFx0XG5cdFx0XHRcdC8vY29uc29sZS5sb2coIHdtc0NvbnN0cnVjdGVkVXJsICk7XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiggX3RoaXMubG9jYXRpb25UeXBlID09PSAnd3BfY2NsJyApe1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHdpbmRvdy5vcGVuKHdtc0NvbnN0cnVjdGVkVXJsLCAnX3NlbGYnKTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHQkKHdpbmRvdykudW5sb2FkKCBmdW5jdGlvbigpe1xuXG5cdFx0XHRcdFx0XHRfdGhpcy4kc2VhcmNoU2NvcGUucHJvcCggJ3NlbGVjdGVkSW5kZXgnLCAwICk7XG5cdFx0XHRcdFx0fSk7XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFxuXHRcdFx0XHR9ZWxzZXtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHR3aW5kb3cub3Blbih3bXNDb25zdHJ1Y3RlZFVybCwgJ19ibGFuaycpO1x0XHRcdFx0XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHQgICB9ZWxzZXtcblx0XHQgICBcdFxuXHRcdCAgIFx0cmV0dXJuO1xuXHRcdCAgIFx0XG5cdFx0ICAgfVx0XHRcblx0fTtcblxuXHRTZWFyY2hBdXRvY29tcGxldGUucHJvdG90eXBlLmZldGNoUmVzdWx0cyA9IGZ1bmN0aW9uKCBxdWVyeSApIHtcblx0XHQvL3NlbmQgQUpBWCByZXF1ZXN0IHRvIFBIUCBmaWxlIGluIFdQXG5cdFx0dmFyIF90aGlzID0gdGhpcyxcblx0XHRcdGRhdGEgPSB7XG5cdFx0XHRcdHMgOiBxdWVyeSxcblx0XHRcdH07XG5cblx0XHRfdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG5cblx0XHQkLmdldChDQ0wuYXBpLnNlYXJjaCwgZGF0YSlcblx0XHRcdC5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuXHRcdFx0XHRfdGhpcy5oYW5kbGVSZXNwb25zZShyZXNwb25zZSk7XG5cdFx0XHR9KVxuXHRcdFx0LmFsd2F5cyhmdW5jdGlvbigpe1xuXHRcdFx0XHRfdGhpcy4kZWwucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1sb2FkaW5nJyk7XG5cdFx0XHR9KTtcblxuXHR9O1xuXG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuaGFuZGxlUmVzcG9uc2UgPSBmdW5jdGlvbiggcmVzcG9uc2UgKSB7XG5cdFx0XG5cdFx0Ly9Qcm9jZXNzIHRoZSByZXN1bHRzIGZyb20gdGhlIEFQSSBxdWVyeSBhbmQgZ2VuZXJhdGUgSFRNTCBmb3IgZGlzcHBsYXlcblx0XHRcblx0XHR2YXIgX3RoaXMgPSB0aGlzLFxuXHRcdFx0cmVzdWx0cyA9IHJlc3BvbnNlLFxuXHRcdFx0Y291bnQgPSByZXN1bHRzLmNvdW50LFxuXHRcdFx0cXVlcnkgPSByZXN1bHRzLnF1ZXJ5LFxuXHRcdFx0cG9zdHMgPSByZXN1bHRzLnBvc3RzLFxuXHRcdFx0c2VhcmNoSW5kZXggPSAgJCggX3RoaXMuJGluZGV4Q29udGFpbiApLmlzKCc6dmlzaWJsZScpID8gX3RoaXMuJHNlYXJjaEluZGV4LnZhbCgpIDogJ2t3Jyxcblx0XHRcdHNlYXJjaEluZGV4TmljZW5hbWUgPSBpbmRleE5hbWVzW3NlYXJjaEluZGV4XSxcblx0XHRcdHNlYXJjaFNjb3BlRGF0YSA9ICQoIF90aGlzLiRzZWFyY2hTY29wZSApLFxuXHRcdFx0cmVuZGVyZWRSZXNwb25zZVx0PSBbXTtcblx0XHRcdFxuXHRcdC8vIHdyYXAgcXVlcnlcblx0XHQvL3ZhciBxdWVyeVN0cmluZyA9IHNlYXJjaEluZGV4ICsgJzonICsgcXVlcnk7XG5cdFx0XG5cdFx0Ly9nZXQgd21zX3VybCBpbnB1dF9hcnJheSA9IFtxdWVyeVN0cmluZywgc2VhcmNoU2NvcGUsIGxvY2F0aW9uVHlwZV1cblx0XHR2YXIgaW5wdXRfYXJyYXkgPSBbXTtcblx0XHRpbnB1dF9hcnJheVsncXVlcnlTdHJpbmcnXVx0PSAoX3RoaXMubG9jYXRpb25UeXBlID09PSAnd21zJykgPyAgc2VhcmNoSW5kZXggKyBcIjpcIiArIHF1ZXJ5IDogcXVlcnk7XG5cdFx0aW5wdXRfYXJyYXlbJ3NlYXJjaFNjb3BlJ11cdD0gX3RoaXMuJHNlYXJjaFNjb3BlLnZhbCgpO1xuXHRcdFxuXHRcdC8vVVJMIGNyZWF0ZWQhXG5cdFx0dmFyIHdtc0NvbnN0cnVjdGVkVXJsID0gX3RoaXMuY29uc3RydWN0U2VhcmNoVVJMKGlucHV0X2FycmF5KTtcblxuXHRcdC8vIENsZWFyIHJlc3BvbnNlIGFyZWEgbGlzdCBpdGVtcyAodXBkYXRlIHdoZW4gUGF0dGVybiBMaWJyYXJ5IHZpZXcgaXNuJ3QgbmVjZXNzYXJ5KVxuXHRcdF90aGlzLiRyZXNwb25zZUxpc3QuaHRtbCgnJyk7XG5cdFx0X3RoaXMuJHJlc3VsdHNMaW5rLnJlbW92ZSgpO1xuXHRcdFxuXHRcdC8vYWRkIHRoZSBjbG9zZSBidXR0b25cblx0XHR2YXIgcmVzdWx0c0Nsb3NlID0gJzxkaXYgY2xhc3M9XCJjY2wtYy1zZWFyY2gtLWNsb3NlLXJlc3VsdHNcIj4nICtcblx0XHRcdFx0XHRcdFx0JzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2NsLWItY2xvc2UgY2NsLWMtc2VhcmNoLS1jbG9zZV9fYnV0dG9uXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXHQnPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+JyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvYnV0dG9uPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nO1xuXG5cdFx0Ly8gQ3JlYXRlIGxpc3QgaXRlbSBmb3IgV29ybGRjYXQgc2VhcmNoLlxuXHRcdHZhciBsaXN0SXRlbSA9ICAnPGEgaHJlZj1cIicrIHdtc0NvbnN0cnVjdGVkVXJsICsnXCIgY2xhc3M9XCJjY2wtYy1zZWFyY2gtaXRlbSBjY2wtaXMtbGFyZ2VcIiByb2xlPVwibGlzdGl0ZW1cIiB0YXJnZXQ9XCJfYmxhbmtcIiBzdHlsZT1cImJvcmRlcjpub25lO1wiPicgK1xuXHRcdFx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJjY2wtYy1zZWFyY2gtaXRlbV9fdHlwZVwiPicgK1xuXHRcdFx0XHRcdFx0XHRcdCc8aSBjbGFzcz1cImNjbC1iLWljb24gYm9va1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4nICtcblx0XHRcdFx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XCJjY2wtYy1zZWFyY2gtaXRlbV9fdHlwZS10ZXh0XCI+V29ybGRDYXQ8L3NwYW4+JyArXG5cdFx0XHRcdFx0XHRcdCc8L3NwYW4+JyArXG5cdFx0XHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cXFwiY2NsLWMtc2VhcmNoLWl0ZW1fX3RpdGxlXFxcIj4nICtcblx0XHRcdFx0XHRcdFx0XHQnU2VhcmNoIGJ5ICcgKyBzZWFyY2hJbmRleE5pY2VuYW1lICsgJyBmb3IgJmxkcXVvOycgKyBxdWVyeSArICcmcmRxdW87IGluICcrIHNlYXJjaFNjb3BlRGF0YS5maW5kKCdvcHRpb246c2VsZWN0ZWQnKS50ZXh0KCkgKycgJyArXG5cdFx0XHRcdFx0XHRcdFx0JzxpIGNsYXNzPVwiY2NsLWItaWNvbiBhcnJvdy1yaWdodFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246bWlkZGxlXCI+PC9pPicgK1xuXHRcdFx0XHRcdFx0XHQnPC9zcGFuPicrXG5cdFx0XHRcdFx0XHQnPC9hPic7XG5cblx0XHRcblx0XHQvL2FkZCBIVE1MIHRvIHRoZSByZXNwb25zZSBhcnJheVxuXHRcdHJlbmRlcmVkUmVzcG9uc2UucHVzaCggcmVzdWx0c0Nsb3NlLCBsaXN0SXRlbSApO1xuXG5cdFx0Ly8gQ3JlYXRlIGxpc3QgaXRlbXMgZm9yIGVhY2ggcG9zdCBpbiByZXN1bHRzXG5cdFx0aWYgKCBjb3VudCA+IDAgKSB7XG5cblx0XHRcdC8vIENyZWF0ZSBhIHNlcGFyYXRvciBiZXR3ZWVuIHdvcmxkY2F0IGFuZCBvdGhlciByZXN1bHRzXG5cdFx0XHR2YXIgc2VwYXJhdG9yID0gJzxzcGFuIGNsYXNzPVwiY2NsLWMtc2VhcmNoLWl0ZW0gY2NsLWlzLXNlcGFyYXRvclwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj4nICtcblx0XHRcdFx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XFxcImNjbC1jLXNlYXJjaC1pdGVtX190aXRsZVxcXCI+JyArXG5cdFx0XHRcdFx0XHRcdFx0XHQnPGkgY2xhc3M9XCJjY2wtYi1pY29uIGFycm93LWRvd25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+JyArXG5cdFx0XHRcdFx0XHRcdFx0XHQnIE90aGVyIHN1Z2dlc3RlZCByZXNvdXJjZXMgZm9yICZsZHF1bzsnICsgcXVlcnkgKyAnJnJkcXVvOycgK1xuXHRcdFx0XHRcdFx0XHRcdCc8L3NwYW4+JyArXG5cdFx0XHRcdFx0XHRcdCc8L3NwYW4+JztcblxuXHRcdFx0Ly9hZGQgSFRNTCB0byByZXNwb25zZSBhcnJheVxuXHRcdFx0cmVuZGVyZWRSZXNwb25zZS5wdXNoKCBzZXBhcmF0b3IgKTtcblxuXHRcdFx0Ly8gQnVpbGQgcmVzdWx0cyBsaXN0XG5cdFx0XHRwb3N0cy5mb3JFYWNoKGZ1bmN0aW9uIChwb3N0KSB7XG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKHBvc3QpO1xuXG5cdFx0XHRcdHZhciBjdGEsXG5cdFx0XHRcdFx0dGFyZ2V0O1xuXG5cdFx0XHRcdHN3aXRjaCggcG9zdFtcInR5cGVcIl0gKSB7XG5cdFx0XHRcdFx0Y2FzZSAnQm9vayc6XG5cdFx0XHRcdFx0Y2FzZSAnRkFRJzpcblx0XHRcdFx0XHRjYXNlICdSZXNlYXJjaCBHdWlkZSc6XG5cdFx0XHRcdFx0Y2FzZSAnSm91cm5hbCc6XG5cdFx0XHRcdFx0Y2FzZSAnRGF0YWJhc2UnOlxuXHRcdFx0XHRcdFx0Y3RhID0gJ1ZpZXcnO1xuXHRcdFx0XHRcdFx0dGFyZ2V0ID0gJ19ibGFuayc7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICdMaWJyYXJpYW4nOlxuXHRcdFx0XHRcdGNhc2UgJ1N0YWZmJzpcblx0XHRcdFx0XHRcdGN0YSA9ICdDb250YWN0Jztcblx0XHRcdFx0XHRcdHRhcmdldCA9ICdfYmxhbmsnO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0XHRcdGN0YSA9ICdWaWV3Jztcblx0XHRcdFx0XHRcdHRhcmdldCA9ICdfc2VsZic7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRsaXN0SXRlbSA9ICAnPGEgaHJlZj1cIicgKyBwb3N0W1wibGlua1wiXSArICdcIiBjbGFzcz1cImNjbC1jLXNlYXJjaC1pdGVtXCIgcm9sZT1cImxpc3RpdGVtXCIgdGFyZ2V0PVwiJyArIHRhcmdldCArICdcIj4nICtcblx0XHRcdFx0XHRcdFx0XHQnPHNwYW4gY2xhc3M9XFxcImNjbC1jLXNlYXJjaC1pdGVtX190eXBlXFxcIj4nICtcblx0XHRcdFx0XHRcdFx0XHRcdCc8aSBjbGFzcz1cImNjbC1iLWljb24gJyArIHBvc3RbXCJpY29uXCJdICsgJ1wiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4nICtcblx0XHRcdFx0XHRcdFx0XHRcdCc8c3BhbiBjbGFzcz1cImNjbC1jLXNlYXJjaC1pdGVtX190eXBlLXRleHRcIj4nICsgcG9zdFtcInR5cGVcIl0gKyAnPC9zcGFuPicgK1xuXHRcdFx0XHRcdFx0XHRcdCc8L3NwYW4+JyArXG5cdFx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwiY2NsLWMtc2VhcmNoLWl0ZW1fX3RpdGxlXCI+JyArIHBvc3RbXCJ0aXRsZVwiXSArICc8L3NwYW4+JyArXG5cdFx0XHRcdFx0XHRcdFx0JzxzcGFuIGNsYXNzPVwiY2NsLWMtc2VhcmNoLWl0ZW1fX2N0YVwiPicgK1xuXHRcdFx0XHRcdFx0XHRcdFx0JzxzcGFuPicgKyBjdGEgKyAnIDxpIGNsYXNzPVwiY2NsLWItaWNvbiBhcnJvdy1yaWdodFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246bWlkZGxlXCI+PC9pPjwvc3Bhbj4nICtcblx0XHRcdFx0XHRcdFx0XHQnPC9zcGFuPicgK1xuXHRcdFx0XHRcdFx0XHQnPC9hPic7XG5cdFx0XHRcdFxuXHRcdFx0XHQvL2FkZCBIVE1MIHRvIHRoZSByZXNwb25zZSBhcnJheVxuXHRcdFx0XHRyZW5kZXJlZFJlc3BvbnNlLnB1c2goIGxpc3RJdGVtICk7XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8gQnVpbGQgcmVzdWx0cyBjb3VudC9saW5rXG5cdFx0XHRsaXN0SXRlbSA9ICc8ZGl2IGNsYXNzPVwiY2NsLWMtc2VhcmNoLXJlc3VsdHNfX2Zvb3RlclwiPicgK1xuXHRcdFx0XHRcdFx0XHRcdCc8YSBocmVmPVwiLz9zPScgKyBxdWVyeSArICdcIiBjbGFzcz1cImNjbC1jLXNlYXJjaC1yZXN1bHRzX19hY3Rpb25cIj4nICtcblx0XHRcdFx0XHRcdFx0XHRcdCdWaWV3IGFsbCAnICsgY291bnQgKyAnIFJlc3VsdHMgJyArXG5cdFx0XHRcdFx0XHRcdFx0XHQnPGkgY2xhc3M9XCJjY2wtYi1pY29uIGFycm93LXJpZ2h0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9pPicgK1xuXHRcdFx0XHRcdFx0XHRcdCc8L2E+JyArXG5cdFx0XHRcdFx0XHQnPC9kaXY+JztcblxuXHRcdFx0Ly9hZGQgSFRNTCB0byB0aGUgcmVzcG9uc2UgYXJyYXlcblx0XHRcdHJlbmRlcmVkUmVzcG9uc2UucHVzaCggbGlzdEl0ZW0gKTtcblx0XHRcblx0XHR9XG5cdFx0XG5cdFx0Ly9hcHBlbmQgYWxsIHJlc3BvbnNlIGRhdGEgYWxsIGF0IG9uY2Vcblx0XHRfdGhpcy4kcmVzcG9uc2VMaXN0LmFwcGVuZCggcmVuZGVyZWRSZXNwb25zZSApO1xuXHRcdFxuXHRcdC8vY2FjaGUgdGhlIHJlc3BvbnNlIGJ1dHRvbiBhZnRlciBpdHMgYWRkZWQgdG8gdGhlIERPTVxuXHRcdF90aGlzLiRyZXNwb25zZUNsb3NlXHQ9IF90aGlzLiRlbC5maW5kKCcuY2NsLWMtc2VhcmNoLS1jbG9zZV9fYnV0dG9uJyk7XHRcdFxuXHRcdFxuXHRcdC8vY2xpY2sgZXZlbnQgdG8gY2xvc2UgdGhlIHJlc3VsdHMgcGFnZVxuXHRcdF90aGlzLiRyZXNwb25zZUNsb3NlLm9uKCAnY2xpY2snLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdC8vaGlkZVxuXHRcdFx0XHRpZiggJCggX3RoaXMuJHJlc3BvbnNlICkuaXMoJzp2aXNpYmxlJykgKXtcblx0XHRcdFx0XHRfdGhpcy4kcmVzcG9uc2UuaGlkZSgpO1x0XG5cdFx0XHRcdFx0X3RoaXMuZGVzdHJveUxpZ2h0Qm94KCk7XG5cdFx0XHRcdH1cblx0XHR9KTtcblx0XHRcblx0XHRcblx0XHQgX3RoaXMuJGZvY3VzYWJsZSA9IHRoaXMuJGVsLmZpbmQoICc6Zm9jdXNhYmxlJyApO1xuXG5cdFx0XG5cdH07XG5cblx0U2VhcmNoQXV0b2NvbXBsZXRlLnByb3RvdHlwZS5vblNlYXJjaEluZGV4Q2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0Ly9vbiBjaGFuZ2VzIHRvIHRoZSBsb2NhdGlvbiBvciBhdHRyaWJ1dGUgaW5kZXggb3B0aW9uLCB3aWxsIHdhdGNoIGFuZCBydW4gZmV0Y2hSZXN1bHRzXG5cdFx0dmFyIHF1ZXJ5ID0gdGhpcy4kaW5wdXQudmFsKCk7XG5cblx0XHRpZiAoICEgcXVlcnkubGVuZ3RoICkge1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR0aGlzLiRyZXNwb25zZS5zaG93KCk7XHRcdFxuXHRcdHRoaXMuZmV0Y2hSZXN1bHRzKCBxdWVyeSApO1xuXHR9O1xuXHRcblx0U2VhcmNoQXV0b2NvbXBsZXRlLnByb3RvdHlwZS5jb25zdHJ1Y3RTZWFyY2hVUkwgPSBmdW5jdGlvbihpbnB1dF9hcnJheSl7XG5cdFx0Ly9jb25zdHJ1Y3RzIFVSTCB3aXRoIHBhcmFtZXRlcnMgZnJvbVxuXHRcdC8vaW5wdXRfYXJyYXkgPSBbcXVlcnlTdHJpbmcsIHNlYXJjaFNjb3BlLCBTZWFyY2hMb2NhdGlvbl1cblx0XHRcblx0XHQvL2RlZmluZSB2YXJpYWJsZXNcblx0XHR2YXIgcXVlcnlTdHJpbmcsIHNlYXJjaFNyYywgc2VhcmNoU2NvcGVLZXksIHJlbmRlcmVkVVJMO1xuXHRcdFxuXHRcdHF1ZXJ5U3RyaW5nIFx0PSBpbnB1dF9hcnJheVsncXVlcnlTdHJpbmcnXTtcblx0XHRzZWFyY2hTcmNcdFx0PSBpbnB1dF9hcnJheVsnc2VhcmNoU2NvcGUnXTtcblxuXHRcdFxuXHRcdHN3aXRjaCAoIHRoaXMubG9jYXRpb25UeXBlKSB7XG5cdFx0XHRjYXNlICd3bXMnOlxuXHRcdFx0XHQvL2NoZWNrIGlmIHNlYXJjaCBsb2NhdGlvbiBpcyBhIHNjb3BlZCBzZWFyY2ggbG9jYXRpb25cblx0XHRcdFx0aWYoIHNlYXJjaFNyYy5tYXRjaCgvOjp6czovKSApe1xuXHRcdFx0XHRcdHNlYXJjaFNjb3BlS2V5ID0gJ3N1YnNjb3BlJztcblx0XHRcdFx0fWVsc2V7XG5cdFx0XHRcdFx0c2VhcmNoU2NvcGVLZXkgPSAnc2NvcGUnO1xuXHRcdFx0XHR9XG5cdCAgICAgICAgICAgIC8vYnVpbGQgdGhlIFVSTFxuXHQgICAgICAgICAgICB2YXIgd21zX3BhcmFtcyA9IHtcblx0ICAgICAgICAgICAgICAgIHNvcnRLZXkgICAgICAgICA6ICdMSUJSQVJZJyxcblx0ICAgICAgICAgICAgICAgIGRhdGFiYXNlTGlzdCAgICA6ICcnLFxuXHQgICAgICAgICAgICAgICAgcXVlcnlTdHJpbmcgICAgIDogcXVlcnlTdHJpbmcsXG5cdCAgICAgICAgICAgICAgICBGYWNldCAgICAgICAgICAgOiAnJyxcblx0ICAgICAgICAgICAgICAgIC8vc2NvcGUgYWRkZWQgYmVsb3dcblx0ICAgICAgICAgICAgICAgIC8vZm9ybWF0IGFkZGVkIGJlbG93XG5cdCAgICAgICAgICAgICAgICBmb3JtYXRcdFx0XHQ6ICdhbGwnLFxuXHQgICAgICAgICAgICAgICAgZGF0YWJhc2UgICAgICAgIDogICdhbGwnLFxuXHQgICAgICAgICAgICAgICAgYXV0aG9yICAgICAgICAgIDogJycsXG5cdCAgICAgICAgICAgICAgICB5ZWFyICAgICAgICAgICAgOiAnYWxsJyxcblx0ICAgICAgICAgICAgICAgIHllYXJGcm9tICAgICAgICA6ICcnLFxuXHQgICAgICAgICAgICAgICAgeWVhclRvICAgICAgICAgIDogJycsXG5cdCAgICAgICAgICAgICAgICBsYW5ndWFnZSAgICAgICAgOiAnYWxsJyxcblx0ICAgICAgICAgICAgICAgIHRvcGljICAgICAgICAgICA6ICcnXG5cdCAgICAgICAgICAgIH07XG5cdCAgICAgICAgICAgIFxuXHQgICAgICAgICAgICB3bXNfcGFyYW1zW3NlYXJjaFNjb3BlS2V5XSA9IHNlYXJjaFNyYztcblx0ICAgICAgICAgICAgXG5cdCAgICAgICAgICAgIHJlbmRlcmVkVVJMID0gJ2h0dHBzOi8vY2NsLm9uLndvcmxkY2F0Lm9yZy9zZWFyY2g/JyArICQucGFyYW0od21zX3BhcmFtcyk7XG5cdFx0ICAgICAgICByZW5kZXJlZFVSTCA9IHJlbmRlcmVkVVJMLnJlcGxhY2UoICclMjYnLCBcIiZcIiApO1x0XHRcdFx0XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcblx0XHRcdGNhc2UgJ29hYyc6XG5cdFx0XHRcdFxuXHRcdFx0XHRyZW5kZXJlZFVSTCA9ICdodHRwOi8vd3d3Lm9hYy5jZGxpYi5vcmcvc2VhcmNoP3F1ZXJ5PScgKyBxdWVyeVN0cmluZyArICcmaW5zdGl0dXRpb249Q2xhcmVtb250K0NvbGxlZ2VzJztcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFxuXHRcdFx0ZGVmYXVsdDpcblx0XHRcdFx0cmVuZGVyZWRVUkwgPSBDQ0wuc2l0ZV91cmwgKyAnP3M9JyArIHF1ZXJ5U3RyaW5nO1xuXHRcdH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyh3bXNfdXJsKTtcbiAgICAgICAgICAgIFxuICAgICAgICByZXR1cm4gcmVuZGVyZWRVUkw7XG5cblx0fTtcblx0XG5cdFNlYXJjaEF1dG9jb21wbGV0ZS5wcm90b3R5cGUuY3JlYXRlTGlnaHRCb3ggPSBmdW5jdGlvbigpIHtcblx0XHR2YXIgX3RoaXMgPSB0aGlzO1xuXG5cdFx0XG5cdFx0dGhpcy4kZWxcblx0XHRcdC5vbiggJ2ZvY3VzaW4nLCAnOmZvY3VzYWJsZScsIGZ1bmN0aW9uKGV2ZW50KXtcblxuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuXHRcdFx0XHRpZiAoICEgX3RoaXMubGlnaHRib3hJc09uICl7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0X3RoaXMubGlnaHRib3hJc09uID0gdHJ1ZTtcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRfdGhpcy4kZWwuYWRkQ2xhc3MoJ2lzLWxpZ2h0Ym94ZWQnKTtcblx0XHRcdFx0XHRfdGhpcy4kbGlnaHRib3ggPSAkKCc8ZGl2IGNsYXNzPVwiY2NsLWMtbGlnaHRib3hcIj4nKS5hcHBlbmRUbygnYm9keScpO1xuXHRcdFx0XHRcdHZhciBzZWFyY2hCb3hUb3AgPSBfdGhpcy4kZWwub2Zmc2V0KCkudG9wIC0gMTI4ICsgJ3B4Jztcblx0XHRcdFx0XHR2YXIgdGFyZ2V0VG9wID0gJChldmVudC50YXJnZXQpLm9mZnNldCgpLnRvcCAtIDEyOCArICdweCc7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0Ly8gcHJldmVudHMgdGhlIHNjcm9sbGJhciBmcm9tIGp1bXBpbmcgaWYgdGhlIHVzZXIgaXMgdGFiYmluZyBiZWxvdyB0aGUgZm9sZFxuXHRcdFx0XHRcdC8vIGlmIHRoZSBzZWFyY2hib3ggYW5kIHRoZSB0YXJnZXQgYXJlIHRoZSBzYW1lIC0gdGhlbiBpdCB3aWxsIGp1bXAsIGlmIG5vdCwgXG5cdFx0XHRcdFx0Ly8gdGhlbiBpdCB3b24ndCBqdW1wXG5cdFx0XHRcdFx0aWYgKCBzZWFyY2hCb3hUb3AgPT0gdGFyZ2V0VG9wICl7XG5cblx0XHRcdFx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiBzZWFyY2hCb3hUb3AgfSApO1x0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0fSlcblxuXHRcdFx0Lm9uKCAnZm9jdXNvdXQnLCBmdW5jdGlvbihldmVudCl7XG5cdFx0XHRcdF90aGlzLmRlc3Ryb3lMaWdodEJveCgpO1xuXG5cdFx0XHR9ICk7XHRcdFxuXHRcdFxuXG5cdH07XG5cblx0U2VhcmNoQXV0b2NvbXBsZXRlLnByb3RvdHlwZS5kZXN0cm95TGlnaHRCb3ggPSBmdW5jdGlvbigpIHtcblx0XHRpZiAoIHRoaXMuJGxpZ2h0Ym94ICkge1xuXHRcdFx0dGhpcy4kbGlnaHRib3gucmVtb3ZlKCk7XG5cdFx0XHR0aGlzLiRsaWdodGJveCA9IG51bGw7XG5cdFx0XHR0aGlzLiRlbC5yZW1vdmVDbGFzcygnaXMtbGlnaHRib3hlZCcpO1xuXHRcdFx0dGhpcy5saWdodGJveElzT24gPSBmYWxzZTtcblx0XHRcdFxuXHRcdH1cblx0fTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG5cdFx0Ly8gLmVhY2goKSB3aWxsIGZhaWwgZ3JhY2VmdWxseSBpZiBubyBlbGVtZW50cyBhcmUgZm91bmRcblx0XHQkKCcuY2NsLWpzLXNlYXJjaC1mb3JtJykuZWFjaChmdW5jdGlvbigpe1xuXHRcdFx0bmV3IFNlYXJjaEF1dG9jb21wbGV0ZSh0aGlzKTtcblx0XHR9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICpcbiAqIFNsaWRlVG9nZ2xlXG4gKiBcbiAqICB0YWJzIGZvciBoaWRpbmcgYW5kIHNob3dpbmcgYWRkaXRpb25hbCBjb250ZW50XG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBzbGlkZVRvZ2dsZUxpc3QgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsICAgICAgICAgICAgICAgID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHNsaWRlVG9nZ2xlTGluayAgID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXNsaWRlVG9nZ2xlX190aXRsZScpO1xuICAgICAgICB0aGlzLiR0b2dnbGVDb250YWluZXIgICA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1zbGlkZVRvZ2dsZV9fY29udGFpbmVyJyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgc2xpZGVUb2dnbGVMaXN0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIF90aGF0ID0gdGhpcztcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJHNsaWRlVG9nZ2xlTGluay5vbignY2xpY2snLCBmdW5jdGlvbihldnQpe1xuICAgICAgICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAvL2dldCB0aGUgdGFyZ2V0IHRvIGJlIG9wZW5lZFxuICAgICAgICAgICAgdmFyIGNsaWNrSXRlbSA9ICQodGhpcyk7XG4gICAgICAgICAgICAvL2dldCB0aGUgZGF0YSB0YXJnZXQgdGhhdCBjb3JyZXNwb25kcyB0byB0aGlzIGxpbmtcbiAgICAgICAgICAgIHZhciB0YXJnZXRfY29udGVudCA9IGNsaWNrSXRlbS5hdHRyKCdkYXRhLXRvZ2dsZVRpdGxlJyk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vYWRkIHRoZSBhY3RpdmUgY2xhc3Mgc28gd2UgY2FuIGRvIHN0eWxpbmdzIGFuZCB0cmFuc2l0aW9uc1xuICAgICAgICAgICAgY2xpY2tJdGVtXG4gICAgICAgICAgICAgICAgLnRvZ2dsZUNsYXNzKCdjY2wtaXMtYWN0aXZlJylcbiAgICAgICAgICAgICAgICAuc2libGluZ3MoKVxuICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgLy90b2dnbGUgYXJpYVxuICAgICAgICAgICAgaWYgKGNsaWNrSXRlbS5hdHRyKCAnYXJpYS1leHBhbmRlZCcpID09PSAndHJ1ZScpIHtcbiAgICAgICAgICAgICAgICAgICAgJChjbGlja0l0ZW0pLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChjbGlja0l0ZW0pLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy9sb2NhdGUgdGhlIHRhcmdldCBlbGVtZW50IGFuZCBzbGlkZXRvZ2dsZSBpdFxuICAgICAgICAgICAgX3RoYXQuJHRvZ2dsZUNvbnRhaW5lclxuICAgICAgICAgICAgICAgIC5maW5kKCAnW2RhdGEtdG9nZ2xlVGFyZ2V0PVwiJyArIHRhcmdldF9jb250ZW50ICsgJ1wiXScgKVxuICAgICAgICAgICAgICAgIC5zbGlkZVRvZ2dsZSgnZmFzdCcpO1xuICAgICAgICAgICAgICAgIC8vdG9nZ2xlIGFyaWEtZXhwYW5kZWRcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vdG9nZ2xlIGFyaWFcbiAgICAgICAgICAgIGlmIChfdGhhdC4kdG9nZ2xlQ29udGFpbmVyLmF0dHIoICdhcmlhLWV4cGFuZGVkJykgPT09ICd0cnVlJykge1xuICAgICAgICAgICAgICAgICAgICAkKF90aGF0LiR0b2dnbGVDb250YWluZXIpLmF0dHIoICdhcmlhLWV4cGFuZGVkJywgJ2ZhbHNlJyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChfdGhhdC4kdG9nZ2xlQ29udGFpbmVyKS5hdHRyKCAnYXJpYS1leHBhbmRlZCcsICd0cnVlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1jLXNsaWRlVG9nZ2xlJykuZWFjaCggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBzbGlkZVRvZ2dsZUxpc3QodGhpcyk7ICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFNtb290aCBTY3JvbGxpbmdcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblxuICAgICAgICAkKCcuanMtc21vb3RoLXNjcm9sbCcpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vc2V0IHRvIGJsdXJcbiAgICAgICAgICAgICQodGhpcykuYmx1cigpOyAgICAgICAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkKHRoaXMpLmRhdGEoJ3RhcmdldCcpIHx8ICQodGhpcykuYXR0cignaHJlZicpLFxuICAgICAgICAgICAgICAgICR0YXJnZXQgPSAkKHRhcmdldCksXG4gICAgICAgICAgICAgICAgc2Nyb2xsT2Zmc2V0ID0gMDtcblxuICAgICAgICAgICAgJCgnLmNjbC1jLXF1aWNrLW5hdicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBzY3JvbGxPZmZzZXQgKz0gJCh0aGlzKS5vdXRlckhlaWdodCgpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGlmICggJHRhcmdldC5sZW5ndGggKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldFRvcCA9ICR0YXJnZXQub2Zmc2V0KCkudG9wO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKCB7IFxuICAgICAgICAgICAgICAgICAgICAnc2Nyb2xsVG9wJzogdGFyZ2V0VG9wIC0gc2Nyb2xsT2Zmc2V0IH0sIFxuICAgICAgICAgICAgICAgICAgICA4MDAgKTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgIFxuICAgICAgICAgICAgXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFN0aWNraWVzXG4gKiBcbiAqIEJlaGF2aW91ciBmb3Igc3RpY2t5IGVsZW1lbnRzLlxuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgJHdpbmRvdyA9ICQod2luZG93KSxcbiAgICAgICAgY2xhc3NOYW1lID0ge1xuICAgICAgICAgICAgaXNGaXhlZDogJ2NjbC1pcy1maXhlZCdcbiAgICAgICAgfTtcblxuICAgIHZhciBTdGlja3kgPSBmdW5jdGlvbihlbCl7XG5cbiAgICAgICAgLy8gdmFyaWFibGVzXG4gICAgICAgIHZhciAkZWwgPSAkKGVsKSxcbiAgICAgICAgICAgIGhlaWdodCA9ICRlbC5vdXRlckhlaWdodCgpLFxuICAgICAgICAgICAgb2Zmc2V0ID0gJGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgb3B0aW9ucyA9ICRlbC5kYXRhKCdzdGlja3knKSxcbiAgICAgICAgICAgIHdyYXBwZXIgPSAkKCc8ZGl2IGNsYXNzPVwianMtc3RpY2t5LXdyYXBwZXJcIj48L2Rpdj4nKS5jc3MoeyBoZWlnaHQ6IGhlaWdodCArICdweCcgfSk7XG5cbiAgICAgICAgdmFyIGRlZmF1bHRPcHRpb25zID0ge1xuICAgICAgICAgICAgb2Zmc2V0OiAwXG4gICAgICAgIH07XG5cbiAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKCBkZWZhdWx0T3B0aW9ucywgb3B0aW9ucyApO1xuXG4gICAgICAgIC8vIHdyYXAgZWxlbWVudFxuICAgICAgICAkZWwud3JhcCggd3JhcHBlciApO1xuXG4gICAgICAgIC8vIHNjcm9sbCBsaXN0ZW5lclxuICAgICAgICAkd2luZG93LnNjcm9sbCggQ0NMLnRocm90dGxlKCBfb25TY3JvbGwsIDEwMCApICk7XG5cbiAgICAgICAgLy8gb24gc2Nyb2xsXG4gICAgICAgIGZ1bmN0aW9uIF9vblNjcm9sbCgpIHtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIHNjcm9sbFRvcCA9ICR3aW5kb3cuc2Nyb2xsVG9wKCkgKyBvcHRpb25zLm9mZnNldDtcbiAgICBcbiAgICAgICAgICAgIGlmICggc2Nyb2xsVG9wID49IG9mZnNldC50b3AgKSB7XG4gICAgICAgICAgICAgICAgJGVsLmFkZENsYXNzKCBjbGFzc05hbWUuaXNGaXhlZCApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAkZWwucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5pc0ZpeGVkICk7XG4gICAgICAgICAgICB9XG4gICAgXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuanMtaXMtc3RpY2t5JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFN0aWNreSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFRvZ2dsZSBTY2hvb2xzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBzY2hvb2wgdG9nZ2xlc1xuICovXG5cbihmdW5jdGlvbiAod2luZG93LCAkKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICBpbml0U2Nob29sID0gJCgnaHRtbCcpLmRhdGEoJ3NjaG9vbCcpO1xuXG4gICAgdmFyIFNjaG9vbFNlbGVjdCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJHNlbGVjdCA9ICQoZWwpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgfTtcblxuICAgIFNjaG9vbFNlbGVjdC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgdmFyIHNjaG9vbCA9IGdldENvb2tpZSggJ2NjbC1zY2hvb2wnICk7XG5cbiAgICAgICAgaWYgKCBpbml0U2Nob29sICkge1xuXG4gICAgICAgICAgICB0aGlzLiRzZWxlY3RcbiAgICAgICAgICAgICAgICAuZmluZCggJ29wdGlvblt2YWx1ZT1cIicgKyBzY2hvb2wgKyAnXCJdJyApXG4gICAgICAgICAgICAgICAgLmF0dHIoICdzZWxlY3RlZCcsICdzZWxlY3RlZCcgKTtcblxuICAgICAgICBcdGlmICggc2Nob29sICkge1xuICAgICAgICBcdFx0ICQoJ2h0bWwnKS5hdHRyKCdkYXRhLXNjaG9vbCcsIHNjaG9vbCk7XG5cdFx0XHR9XG5cblx0XHR9XG5cbiAgICAgICAgdGhpcy4kc2VsZWN0LmNoYW5nZShmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICAkKCdodG1sJykuYXR0ciggJ2RhdGEtc2Nob29sJywgZXZlbnQudGFyZ2V0LnZhbHVlICk7XG5cbiAgICAgICAgICAgIGVyYXNlQ29va2llKCAnY2NsLXNjaG9vbCcgKTtcbiAgICAgICAgICAgIHNldENvb2tpZSggJ2NjbC1zY2hvb2wnLCBldmVudC50YXJnZXQudmFsdWUsIDcpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLy8gQ29va2llIGZ1bmN0aW9ucyBsaWZ0ZWQgZnJvbSBTdGFjayBPdmVyZmxvdyBmb3Igbm93XG4gICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMTQ1NzMyMjMvc2V0LWNvb2tpZS1hbmQtZ2V0LWNvb2tpZS13aXRoLWphdmFzY3JpcHRcblx0ZnVuY3Rpb24gc2V0Q29va2llKG5hbWUsIHZhbHVlLCBkYXlzKSB7XG5cdFx0dmFyIGV4cGlyZXMgPSBcIlwiO1xuXHRcdGlmIChkYXlzKSB7XG5cdFx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XG5cdFx0XHRkYXRlLnNldFRpbWUoZGF0ZS5nZXRUaW1lKCkgKyAoZGF5cyAqIDI0ICogNjAgKiA2MCAqIDEwMDApKTtcblx0XHRcdGV4cGlyZXMgPSBcIjsgZXhwaXJlcz1cIiArIGRhdGUudG9VVENTdHJpbmcoKTtcblx0XHR9XG5cdFx0ZG9jdW1lbnQuY29va2llID0gbmFtZSArIFwiPVwiICsgKHZhbHVlIHx8IFwiXCIpICsgZXhwaXJlcyArIFwiOyBwYXRoPS9cIjtcblx0fVxuXG5cdGZ1bmN0aW9uIGdldENvb2tpZShuYW1lKSB7XG5cdFx0dmFyIG5hbWVFUSA9IG5hbWUgKyBcIj1cIjtcblx0XHR2YXIgY2EgPSBkb2N1bWVudC5jb29raWUuc3BsaXQoJzsnKTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYyA9IGNhW2ldO1xuXHRcdFx0d2hpbGUgKGMuY2hhckF0KDApID09PSAnICcpIGMgPSBjLnN1YnN0cmluZygxLCBjLmxlbmd0aCk7XG5cdFx0XHRpZiAoYy5pbmRleE9mKG5hbWVFUSkgPT09IDApIHJldHVybiBjLnN1YnN0cmluZyhuYW1lRVEubGVuZ3RoLCBjLmxlbmd0aCk7XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0ZnVuY3Rpb24gZXJhc2VDb29raWUobmFtZSkge1xuXHRcdGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyAnPTsgTWF4LUFnZT0tOTk5OTk5OTk7Jztcblx0fVxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwic2Nob29sXCJdJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgbmV3IFNjaG9vbFNlbGVjdCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKHRoaXMsIGpRdWVyeSk7IiwiLyoqXG4gKiBUb29sdGlwc1xuICogXG4gKiBCZWhhdmlvciBmb3IgdG9vbHRpcHNcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIFRvb2x0aXAgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuY29udGVudCA9IHRoaXMuJGVsLmF0dHIoJ3RpdGxlJyk7XG4gICAgICAgIHRoaXMuJHRvb2x0aXAgPSAkKCc8ZGl2IGlkPVwiY2NsLWN1cnJlbnQtdG9vbHRpcFwiIGNsYXNzPVwiY2NsLWMtdG9vbHRpcCBjY2wtaXMtdG9wXCIgcm9sZT1cInRvb2x0aXBcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2NsLWMtdG9vbHRpcF9fYXJyb3dcIj48L2Rpdj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiY2NsLWMtdG9vbHRpcF9faW5uZXJcIj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnQgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+Jyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgVG9vbHRpcC5wcm90b3R5cGUuaW5pdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsLmhvdmVyKGZ1bmN0aW9uKGUpe1xuXG4gICAgICAgICAgICAvLyBtb3VzZW92ZXJcblxuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ3RpdGxlJywgJycpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ2FyaWEtZGVzY3JpYmVkYnknLCAnY2NsLWN1cnJlbnQtdG9vbHRpcCcpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuYXBwZW5kVG8oZG9jdW1lbnQuYm9keSk7XG5cbiAgICAgICAgICAgIENDTC5yZWZsb3coX3RoaXMuJHRvb2x0aXBbMF0pO1xuXG4gICAgICAgICAgICB2YXIgb2Zmc2V0ID0gX3RoaXMuJGVsLm9mZnNldCgpLFxuICAgICAgICAgICAgICAgIHdpZHRoICA9IF90aGlzLiRlbC5vdXRlcldpZHRoKCksXG4gICAgICAgICAgICAgICAgdG9vbHRpcEhlaWdodCA9IF90aGlzLiR0b29sdGlwLm91dGVySGVpZ2h0KCk7XG5cbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLmNzcyh7XG4gICAgICAgICAgICAgICAgdG9wOiAob2Zmc2V0LnRvcCAtIHRvb2x0aXBIZWlnaHQpICsgJ3B4JyxcbiAgICAgICAgICAgICAgICBsZWZ0OiAob2Zmc2V0LmxlZnQgKyAod2lkdGgvMikpICsgJ3B4J1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICB9LCBmdW5jdGlvbihlKXsgXG5cbiAgICAgICAgICAgIC8vbW91c2VvdXRcblxuICAgICAgICAgICAgX3RoaXMuJGVsLmF0dHIoJ3RpdGxlJywgX3RoaXMuY29udGVudCk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cignYXJpYS1kZXNjcmliZWRieScsICcnKTtcbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLnJlbW92ZUNsYXNzKCdjY2wtaXMtc2hvd24nKTtcbiAgICAgICAgICAgIF90aGlzLiR0b29sdGlwLnJlbW92ZSgpO1xuXG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ1tkYXRhLXRvZ2dsZT1cInRvb2x0aXBcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgVG9vbHRpcCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIFdheWZpbmRpbmdcbiAqIFxuICogQ29udHJvbHMgaW50ZXJmYWNlIGZvciBsb29raW5nIHVwIGNhbGwgbnVtYmVyIGxvY2F0aW9uc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgdGFicywgd2F5ZmluZGVyO1xuICAgIFxuICAgIHZhciBUYWJzID0gZnVuY3Rpb24oZWwpIHtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHRhYnMgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtdGFiJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzID0gJCgnLmNjbC1jLXRhYl9fY29udGVudCcpO1xuICAgICAgICBcblxuICAgICAgICB0aGlzLiR0YWJzLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciAkdGFiID0gJCh0aGlzKTtcbiAgICAgICAgICAgICR0YWIuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIHZhciB0YXJnZXQgPSAkdGFiLmRhdGEoJ3RhcmdldCcpO1xuICAgICAgICAgICAgICAgIC8vIF90aGlzLiR0YWJDb250ZW50cy5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIC8vIF90aGlzLiR0YWJDb250ZW50cy5maWx0ZXIodGFyZ2V0KS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgIF90aGlzLnNldEFjdGl2ZSh0YXJnZXQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBUYWJzLnByb3RvdHlwZS5zZXRBY3RpdmUgPSBmdW5jdGlvbih0YXJnZXQpe1xuICAgICAgICB0aGlzLiR0YWJzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYnMuZmlsdGVyKCdbaHJlZj1cIicrdGFyZ2V0KydcIl0nKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiR0YWJDb250ZW50cy5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiR0YWJDb250ZW50cy5maWx0ZXIodGFyZ2V0KS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgIH07XG5cbiAgICB2YXIgV2F5ZmluZGVyID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLmNhbGxOdW1iZXJzID0ge307XG4gICAgICAgIHRoaXMuJGZvcm0gPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW1iZXItc2VhcmNoJyk7XG4gICAgICAgIHRoaXMuJGlucHV0ID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtLWlucHV0Jyk7XG4gICAgICAgIHRoaXMuJHN1Ym1pdCA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bS1zdWJtaXQnKTtcbiAgICAgICAgdGhpcy4kbWFycXVlZSA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX21hcnF1ZWUnKTtcbiAgICAgICAgdGhpcy4kY2FsbE51bSA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX2NhbGwtbnVtJyk7XG4gICAgICAgIHRoaXMuJHdpbmcgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX193aW5nJyk7XG4gICAgICAgIHRoaXMuJGZsb29yID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fZmxvb3InKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdCA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX3N1YmplY3QnKTtcbiAgICAgICAgdGhpcy5lcnJvciA9IHtcbiAgICAgICAgICAgIGdldDogJzxkaXYgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3IgY2NsLXdheWZpbmRlcl9fZXJyb3JcIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNjbC1iLWNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj48c3BhbiBjbGFzcz1cImNjbC1iLWljb24gYWxlcnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+IFRoZXJlIHdhcyBhbiBlcnJvciBmZXRjaGluZyBjYWxsIG51bWJlcnMuPC9kaXY+JyxcbiAgICAgICAgICAgIGZpbmQ6ICc8ZGl2IGNsYXNzPVwiY2NsLWMtYWxlcnQgY2NsLWlzLWVycm9yIGNjbC13YXlmaW5kZXJfX2Vycm9yXCI+PGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjY2wtYi1jbG9zZVwiIGRhdGEtZGlzbWlzcz1cImFsZXJ0XCIgYXJpYS1sYWJlbD1cIkNsb3NlXCI+PHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCI+w5c8L3NwYW4+PC9idXR0b24+PHNwYW4gY2xhc3M9XCJjY2wtYi1pY29uIGFsZXJ0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiBDb3VsZCBub3QgZmluZCB0aGF0IGNhbGwgbnVtYmVyLiBQbGVhc2UgdHJ5IGFnYWluLjwvZGl2PidcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy4kZXJyb3JCb3ggPSAkKCcuY2NsLWVycm9yLWJveCcpO1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgJC5nZXRKU09OKCBDQ0wuYXNzZXRzICsgJ2pzL2NhbGwtbnVtYmVycy5qc29uJyApXG4gICAgICAgICAgICAuZG9uZShmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBfdGhpcy5jYWxsTnVtYmVycyA9IGRhdGE7XG4gICAgICAgICAgICAgICAgX3RoaXMuaW5pdCgpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5mYWlsKGZ1bmN0aW9uKGVycil7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICB0aGlzLiRlcnJvckJveC5hcHBlbmQoIHRoaXMuZXJyb3IuZ2V0ICk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIFxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJGVsLmFkZENsYXNzKCdjY2wtYXBwLWFjdGl2ZScpO1xuXG4gICAgICAgIHRoaXMuJGlucHV0XG4gICAgICAgICAgICAua2V5dXAoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBxdWVyeSA9ICQodGhpcykudmFsKCk7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgaWYgKCBxdWVyeSA9PT0gXCJcIiApIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kbWFycXVlZS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJlc2V0KCk7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRzdWJtaXQuYXR0cignZGlzYWJsZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLiRmb3JtLnN1Ym1pdChmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgX3RoaXMucmVzZXQoKTtcblxuICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gX3RoaXMuJGlucHV0LnZhbCgpO1xuXG4gICAgICAgICAgICAkKCcuY2NsLXdheWZpbmRlcl9fZXJyb3InKS5yZW1vdmUoKTtcbiAgICAgICAgICAgIF90aGlzLiRtYXJxdWVlLnNob3coKTtcbiAgICAgICAgICAgIF90aGlzLiRjYWxsTnVtLnRleHQocXVlcnkpO1xuICAgICAgICAgICAgX3RoaXMuZmluZFJvb20oIHF1ZXJ5ICk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUuZ2V0Q2FsbEtleSA9IGZ1bmN0aW9uKGNhbGxOdW0pIHtcbiAgICAgICAgY2FsbE51bSA9IGNhbGxOdW0ucmVwbGFjZSgvIC9nLCAnJyk7XG4gICAgICAgIFxuICAgICAgICB2YXIga2V5LFxuICAgICAgICAgICAgY2FsbEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmNhbGxOdW1iZXJzKTtcblxuICAgICAgICBpZiAoIGNhbGxLZXlzLmxlbmd0aCA9PT0gMCApe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbEtleXMuZm9yRWFjaChmdW5jdGlvbihrKXtcbiAgICAgICAgICAgIHZhciBrX25vU3BhY2VzID0gay5yZXBsYWNlKC8gL2csICcnKTtcblxuICAgICAgICAgICAgaWYgKCBjYWxsTnVtID49IGtfbm9TcGFjZXMgKSB7XG4gICAgICAgICAgICAgICAga2V5ID0gaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGtleTtcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5maW5kUm9vbSA9IGZ1bmN0aW9uKHF1ZXJ5KSB7XG5cbiAgICAgICAgcXVlcnkgPSBxdWVyeS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzLFxuICAgICAgICAgICAgY2FsbEtleSA9IHRoaXMuZ2V0Q2FsbEtleShxdWVyeSksXG4gICAgICAgICAgICBjYWxsRGF0YSA9IHt9LFxuICAgICAgICAgICAgZmxvb3JJZCwgcm9vbUlkO1xuXG4gICAgICAgIGlmICggISBjYWxsS2V5ICkge1xuICAgICAgICAgICAgdGhpcy50aHJvd0ZpbmRFcnJvcigpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQoJy5jY2wtYy1zZWFyY2gnKS5vZmZzZXQoKS50b3AgfSk7XG4gICAgICAgIFxuICAgICAgICBjYWxsRGF0YSA9IHRoaXMuY2FsbE51bWJlcnNbY2FsbEtleV07XG5cbiAgICAgICAgdGhpcy4kZmxvb3IudGV4dCggY2FsbERhdGEuZmxvb3IgKTtcbiAgICAgICAgdGhpcy4kd2luZy50ZXh0KCBjYWxsRGF0YS53aW5nICk7XG4gICAgICAgIHRoaXMuJHN1YmplY3QudGV4dCggY2FsbERhdGEuc3ViamVjdCApO1xuXG4gICAgICAgIGZsb29ySWQgPSBjYWxsRGF0YS5mbG9vcl9pbnQ7XG4gICAgICAgIHJvb21JZCA9IGNhbGxEYXRhLnJvb21faW50OyAvLyB3aWxsIGJlIGludGVnZXIgT1IgYXJyYXlcblxuICAgICAgICAvLyBNYWtlIGZsb29yL3Jvb20gYWN0aXZlXG5cbiAgICAgICAgdGhpcy4kZWwuZmluZCgnYVtocmVmPVwiI2Zsb29yLScrZmxvb3JJZCsnXCJdJykuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcblxuICAgICAgICBpZiAoIHR5cGVvZiByb29tSWQgIT09ICdudW1iZXInICkge1xuICAgICAgICAgICAgLy8gaWYgcm9vbUlkIGlzIGFycmF5XG4gICAgICAgICAgICByb29tSWQuZm9yRWFjaChmdW5jdGlvbihpZCl7XG4gICAgICAgICAgICAgICAgdGhhdC4kZWwuZmluZCgnI3Jvb20tJytmbG9vcklkKyctJytpZCkuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgLy8gaWYgcm9vbUlkIGlzIG51bWJlclxuICAgICAgICAgICAgdGhpcy4kZWwuZmluZCgnI3Jvb20tJytmbG9vcklkKyctJytyb29tSWQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgY29ycmVzcG9uZGluZyBhY3RpdmUgZmxvb3IgdGFiXG5cbiAgICAgICAgdGFicy5zZXRBY3RpdmUoICcjZmxvb3ItJyArIGZsb29ySWQgKTtcbiAgICAgICAgXG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnYVtocmVmKj1cIiNmbG9vci1cIl0nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuY2NsLWMtZmxvb3JfX3Jvb20nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLnRocm93RmluZEVycm9yID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kZWwuZmluZCgnYVtocmVmKj1cIiNmbG9vci1cIl0nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcuY2NsLWMtZmxvb3JfX3Jvb20nKS5yZW1vdmVDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRmbG9vci50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiR3aW5nLnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJHN1YmplY3QudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kZXJyb3JCb3guYXBwZW5kKCB0aGlzLmVycm9yLmZpbmQgKTtcbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnLmNjbC1qcy10YWJzJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdGFicyA9IG5ldyBUYWJzKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmNjbC1qcy13YXlmaW5kZXInKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB3YXlmaW5kZXIgPSBuZXcgV2F5ZmluZGVyKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiJdfQ==
