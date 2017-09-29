<?php
namespace CCL\MetaBoxes\Page;

/**
 * Metaboxes that appear on more than one post type around the site
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	// NOTE: Uncomment to activate metabox
	add_action( 'cmb2_init',  $n( 'page_blocks' ) );
}

/**
 * Custom Content Blocks metabox
 * See https://github.com/WebDevStudios/CMB2/wiki/Field-Types for
 * more information on creating metaboxes and field types.
 */
function page_blocks() {

	$prefix = 'page_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'metabox',
		'title'        => __( 'Sidebar', 'cmb2' ),
		'priority'     => 'high',
		'object_types' => array( 'page' ),
		'show_on'      => 'page-with-sidebar'
	) );

	$cmb->add_field( array(
		'id'          => $prefix . 'sidebar_content',
		'type'        => 'wysiwyg',
		'description' => '',
		// 'repeatable'  => false, // use false if you want non-repeatable group
	) );

}
