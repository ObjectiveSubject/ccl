/**
 * Every piece of UI that requires javascript should have its own
 * javascript file. Use this file as a template for structuring
 * all JS source files.
 *
 * {Document Title}
 * {Description}
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var objectName = {

        init: function() {
            // Do something...
        }

    };

    $(document).ready(function(){
        objectName.init();
    });

} )( this, jQuery );
