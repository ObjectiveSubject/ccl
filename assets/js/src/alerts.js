/**
 * Alerts
 * 
 * Behavior for alerts
 */

(function (window, $) {
    'use strict';

    var document = window.document,
        DURATION = CCL.DURATION;

    var AlertDismiss = function(el){
        
        var $el = $(el);
        
        this.$el = $(el);
        this.target = $el.parent();
        this.$target = $(this.target);
        
        this.init();
    };

    AlertDismiss.prototype.init = function(){
        
        var _this = this; 

        _this.$el.on( 'click', function(e){
            e.preventDefault();

            _this.dismissAlert();
        });

    };
    
    AlertDismiss.prototype.dismissAlert = function(){

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
        $('[data-dismiss="alert"]').each(function(){
            new AlertDismiss(this);
        });
    });

})(this, jQuery);