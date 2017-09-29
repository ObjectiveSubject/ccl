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
	add_action( 'cmb2_init',  $n( 'page_sidebar' ) );
}

/**
 * Add custom fields to page with sidebar template
 */
function page_sidebar() {

	$prefix = 'page_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'metabox',
		'title'        => __( 'Sidebar', 'cmb2' ),
		'priority'     => 'high',
		'object_types' => array( 'page' ),
		'show_on'      => array( 'key' => 'page-template', 'value' => 'page-templates/page-with-sidebar.php' )
	) );

	$cmb->add_field( array(
		'id'          => $prefix . 'sidebar_content',
		'type'        => 'wysiwyg',
		'description' => '',
		// 'repeatable'  => false, // use false if you want non-repeatable group
	) );

}
