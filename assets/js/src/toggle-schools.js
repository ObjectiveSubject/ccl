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
        
        /* TODO: REMOVE FOR PRODUCTION
         * get a random school if none exists
         * --------------------------- */
        if ( ! initSchool || '' === initSchool ) {

            var schools = ['pomona','cgu','cuc','scripps','claremont-mckenna','harvey-mudd','pitzer','kgi'],
                key = Math.floor( Math.random() * schools.length );
            
            initSchool = schools[key];
            $('html').attr( 'data-school', initSchool );

        }
        /* --------------------------- */

        this.$select
            .find( 'option[value="' + initSchool + '"]' )
            .attr( 'selected', 'selected' );

        this.$select.change(function(event){
            $('html').attr( 'data-school', event.target.value );
        });
    };

    $(document).ready(function(){
        $('[data-toggle="school"]').each(function(){
            new SchoolSelect(this);
        });
    });

})(this, jQuery);