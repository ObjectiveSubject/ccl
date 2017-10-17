( function( window, $, undefined ) {
	'use strict';
	var document = window.document;

	var BlockAdmin = function(el) {

		this.$el = $(el);
		this.$blockTypeToggle = this.$el.find('.ccl-block-type-toggle select');
		this.$toggledFields = this.$el.find('.ccl-toggled-field');
		
		this.init();

	};

	BlockAdmin.prototype.init = function() {

		var blockType = this.$blockTypeToggle.val();

		this.setBlockType( blockType );

		var _this = this;

		this.$blockTypeToggle.change( function() {
			blockType = _this.$blockTypeToggle.val();
			_this.setBlockType( blockType );
		} );
	},

	BlockAdmin.prototype.setBlockType = function( blockType ) {

		this.$toggledFields.filter( '.show-on-' + blockType ).show();
		this.$toggledFields.filter( function(){
			return ( ! $(this).hasClass('show-on-' + blockType) );
		} ).hide();

	}

	$(document).ready( function() {
		if ($('body').hasClass('post-type-page')) {

			// intialize existing rows
			$('#block_group_repeat > .cmb-repeatable-grouping').each(function(){
				new BlockAdmin(this);
			});

			// intialize new row when it is added
			$('.cmb-repeatable-group').on('cmb2_add_row', function(e, $el){
				new BlockAdmin( $el[0] );
			});

		}
	});

} )( this, jQuery );