/**
 * Wayfinding
 * 
 * Controls interface for looking up call number locations
 */

( function( window, $ ) {
	'use strict';
    var document = window.document;
    
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
                console.log(target, _this.$tabContents);
                _this.$tabContents.removeClass('ccl-is-active');
                _this.$tabContents.filter(target).addClass('ccl-is-active');
            });
        });

        console.log(this);
    };

    var Wayfinder = function(el){
        this.$el = $(el);
        this.$input = this.$el.find('#call-num-search');
        this.$marquee = this.$el.find('.ccl-c-wayfinder__marquee');
        this.$callNum = this.$el.find('.ccl-c-wayfinder__call-num');
        this.$level = this.$el.find('.ccl-c-wayfinder__level');
        this.init();
    };

    Wayfinder.prototype.init = function() {
        
        var _this = this,
            timeout;

        this.$input
            .keyup(function () {
                var query = $(this).val();
                
                clearTimeout(timeout);
                
                _this.$callNum.text(query);

                if ( query === "" ) {
                    _this.$marquee.hide();                    
                } else {
                    _this.$marquee.show();
                }

                timeout = setTimeout(function () {
                    if ( query !== "" ) {

                        _this.findRoom( query );

                    } else {

                        _this.$marquee.hide();
                        _this.$callNum.text('');
                        _this.$level.text('');

                    }
                }, 600);
            })
            .keydown(function (event) {

                clearTimeout(timeout);

                _this.$level.text('...');
                _this.reset();
            });

    };

    Wayfinder.prototype.findRoom = function(query) {
        this.$el.addClass('ccl-app-active');
        this.$level.text('Level 1');
        this.$el.find('a[href="#floor-1"]').addClass('ccl-u-color-blue');
        this.$el.find('#floor-1__room-1').addClass('ccl-is-active');
        $('html, body').animate({ scrollTop: $('.ccl-c-search').offset().top });
    };

    Wayfinder.prototype.reset = function() {
        this.$el.removeClass('ccl-app-active');
        this.$el.find('a[href*="#floor-"]').removeClass('ccl-u-color-blue');
        this.$el.find('.ccl-c-floor__room').removeClass('ccl-is-active');
    };

    $(document).ready(function(){
        $('.ccl-js-tabs').each(function(){
            new Tabs(this);
        });
        $('.ccl-js-wayfinder').each(function(){
            new Wayfinder(this);
        });
    });

} )( this, jQuery );
