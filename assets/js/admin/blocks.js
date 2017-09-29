( function( window, $, undefined ) {
	'use strict';
	var document = window.document;

	var blockAdmin = {
		init: function() {
			console.log('wave');

			var blockTypeField = $('#block_type'),
				blockType = blockTypeField.val();

			blockAdmin.setBlockType( blockType );

			blockTypeField.change( function() {
				blockType = $(this).val();
				blockAdmin.setBlockType( blockType );

			});
		},

		setBlockType: function( blockType ) {

			var carouselSelect 		= $('.cmb2-id-block-carousel-images');

			if ('carousel' === blockType) {

				carouselSelect.show();
				
				other.hide();

			} else if ('other' === blockType) {

				other.show();

				carouselSelect.hide();

			} else {
				
				carouselSelect.hide();
				
			}

		}

	};

	$(document).ready( function() {
		if ($('body').hasClass('post-type-page')) {
			blockAdmin.init();
		}
	});

} )( this, jQuery );