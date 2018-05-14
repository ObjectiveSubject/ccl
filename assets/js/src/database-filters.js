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
                if( _this.runTimes == 0 ){
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
