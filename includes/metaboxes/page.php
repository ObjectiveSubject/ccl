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

	add_action( 'cmb2_init',  $n( 'page_related' ) );
	add_action( 'cmb2_init',  $n( 'page_sidebar' ) );
	add_action( 'cmb2_init',  $n( 'page_options' ) );
}

/**
 * Add custom fields to page with sidebar template
 */
function page_related() {

	$prefix = 'page_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'related_metabox',
		'title'        => __( 'Related Pages', 'cmb2' ),
		'desc'         => 'Selected related pages to display at the bottom of the page',
		'priority'     => 'high',
		'object_types' => array( 'page' )
	) );

	$cmb->add_field( array(
		'id'      => 'ccl_related_posts',
		'desc'    => 'Drag pages from the left column to the right column to attach them to this page.<br />You may rearrange the order of the pages in the right column by dragging and dropping.',
		'type'    => 'custom_attached_posts',
		'options' => array(
			'show_thumbnails' => true, // Show thumbnails on the left
			'filter_boxes'    => true, // Show a text box for filtering the results
			'query_args'      => array(
				'posts_per_page' => 250,
				'post_type'      => 'page',
				'orderby'        => 'title',
				'order'          => 'ASC'
			), // override the get_posts args
		),
		// 'repeatable'  => false, // use false if you want non-repeatable group
	) );

}

/**
 * Add custom fields to page with sidebar template
 */
function page_sidebar() {

	$prefix = 'page_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'sidebar_metabox',
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


/**
 * Add page options box/fields
 */
function page_options() {

	$prefix = 'page_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'options_metabox',
		'title'        => __( 'Page Options', 'cmb2' ),
		'context'      => 'side',
		'priority'	   => 'low',
		'object_types' => array( 'page' )	
	) );

	$cmb->add_field( array(
		'id'          => $prefix . 'options',
		// 'name'		  => __( 'Options', 'cmb2' ),
		// 'desc'    => 'field description (optional)',
		'type'    => 'multicheck',
		'options' => array(
			'is_spc' => 'Special Collections Page',
		),
		'attributes' => array(
			'select_all_button' => false
		)
	) );

}