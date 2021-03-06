<?php
namespace CCL\MetaBoxes\Blocks;

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
	add_action( 'cmb2_init',  $n( 'content_blocks' ) );
}

/**
 * Custom Contenct Blocks metabox
 * See https://github.com/WebDevStudios/CMB2/wiki/Field-Types for
 * more information on creating metaboxes and field types.
 */
function content_blocks() {

	$prefix = 'block_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'metabox',
		'title'        => __( 'Custom Blocks', 'cmb2' ),
		'priority'     => 'high',
		'object_types' => array( 'page' )
	) );

	$block_group_id = $cmb->add_field( array(
		'id'          => $prefix . 'group',
		'type'        => 'group',
		// 'description' => __( 'Generates reusable form entries', 'cmb2' ),
		// 'repeatable'  => false, // use false if you want non-repeatable group
		'options'     => array(
			'group_title'   => __( 'Block {#}', 'cmb2' ), // since version 1.1.4, {#} gets replaced by row number
			'add_button'    => __( 'Add Another Block', 'cmb2' ),
			'remove_button' => __( 'Remove Block', 'cmb2' ),
			'sortable'      => true, // beta
			'closed'     => true, // true to have the groups closed by default
		),
	) );

	$cmb->add_group_field( $block_group_id, array(
		'name'                => __( 'Block Type', 'cmb2' ),
		'id'                  => $prefix . 'type',
		'type'                => 'select',
		'default'             => 'none',
		'options'             => array(
			'none'               => __( 'None', 'cmb2' ),
			'banner'             => __( 'Banner Image(s)', 'cmb2' ),
			'carousel'           => __( 'Carousel/Feature Items', 'cmb2' ),
			'events'          	 => __( 'Events', 'cmb2' ),
			'news-events'		 => __( 'News & Events', 'cmb2' ),
			'feature_item'       => __( 'Single Featured Item', 'cmb2' ),
			'search'       		 => __( 'Search Box', 'cmb2' ),
			'staff'       		 => __( 'Staff Profile', 'cmb2' ),
			'wysiwyg'            => __( 'WYSIWYG', 'cmb2' ),
		),
		'classes' => 'ccl-block-type-toggle'
	) );

	$cmb->add_group_field( $block_group_id, array(
		'name'    => __( 'Layout', 'cmb2' ),
		'id'      => $prefix . 'layout',
		'type'    => 'radio_inline',
		'options' => array(
			'image_left'  => __( 'Image Left', 'cmb2' ),
			'image_right' => __( 'Image Right', 'cmb2' ),
		),
		'default' => 'image_right',
		'classes' => 'ccl-toggled-field show-on-feature_item'
	) );
	
	$cmb->add_group_field( $block_group_id, array(
		'name'    => __( 'Title', 'cmb2' ),
		// 'desc'    => 'field description (optional)',
		// 'default' => 'standard value (optional)',
		'id'      => $prefix . 'title',
		'type'    => 'text',
		'classes' => 'ccl-toggled-field show-on-wysiwyg show-on-staff show-on-carousel show-on-search show-on-events show-on-news-events show-on-feature_item'
	) );

	$cmb->add_group_field( $block_group_id, array(
		'name' => 'Enable Live Results',
		'desc' => 'Check to enable live search results as you type',
		'id'   => $prefix . 'search_is_live',
		'type' => 'checkbox',
		'classes' => 'ccl-toggled-field show-on-search'
	) );

	$cmb->add_group_field( $block_group_id, array(
		'name'    => __( 'Call to Action', 'cmb2' ),
		'desc'    => 'Provide short text or call-to-action links',
		// 'default' => 'standard value (optional)',
		'id'      => $prefix . 'cta',
		'type'    => 'wysiwyg',
		'options' => array(
			'media_buttons' => false,
			'editor_class' => $prefix . 'description_wysiwyg',
			'editor_css' => '<style> .' . $prefix . 'description_wysiwyg { height: 200px; }</style>'
		),
		'classes' => 'ccl-toggled-field show-on-wysiwyg show-on-staff show-on-carousel show-on-events show-on-news-events'
	) );

	$cmb->add_group_field( $block_group_id, array(
		'name'    => __( 'Description', 'cmb2' ),
		// 'desc'    => '',
		// 'default' => 'standard value (optional)',
		'id'      => $prefix . 'description',
		'type'    => 'wysiwyg',
		'classes' => 'ccl-toggled-field show-on-wysiwyg show-on-carousel show-on-feature_item show-on-search show-on-events show-on-news-events'
		// 'options' => array(
			// 'editor_class' => $prefix . 'description_wysiwyg',
			// 'editor_css' => '<style> .' . $prefix . 'description_wysiwyg { height: 200px; }</style>'
		// )
	) );

	$cmb->add_group_field( $block_group_id, array(
		'name'    => __( 'Event Category ID#', 'cmb2' ),
		// 'desc'    => 'field description (optional)',
		// 'default' => 'standard value (optional)',
		'id'      => $prefix . 'category_id',
		'type'    => 'text',
		'classes' => 'ccl-toggled-field show-on-events'
	) );

	$cmb->add_group_field( $block_group_id, array(
		'name'        => __( 'News & Event Posts', 'cmb2' ),
		'id'          => $prefix . 'news_events',
		'type'        => 'custom_attached_posts', // This field type
		'options' => array(
			'show_thumbnails' => false, // Show thumbnails on the left
			'filter_boxes'    => true, // Show a text box for filtering the results
			'query_args'      => array(
				//'posts_per_page' => 10,
				'post_type'      => array( 'news', 'event' ),
			), // override the get_posts args
		),	
		'classes' => 'ccl-toggled-field show-on-news-events'
	) );

	$cmb->add_group_field( $block_group_id, array(
		'name'        => __( 'Staff Member(s)', 'cmb2' ),
		'id'          => $prefix . 'staff_member',
		'type'        => 'custom_attached_posts', // This field type
		'options' => array(
			'show_thumbnails' => false, // Show thumbnails on the left
			'filter_boxes'    => true, // Show a text box for filtering the results
			'query_args'      => array(
				//'posts_per_page' => 10,
				'post_type'      => 'staff',
			), // override the get_posts args
		),	
		'classes' => 'ccl-toggled-field show-on-staff'
	) );

	$cmb->add_group_field( $block_group_id, array(
		'name' => __( 'Items', 'cmb2' ),
		'desc' => '',
		'id'   => $prefix . 'items',
		'type' => 'file_list',
		'preview_size' => array( 150, 150 ), // Default: array( 50, 50 )
		'query_args' => array( 'type' => 'image' ), // Only images attachment
		'classes' => 'ccl-toggled-field show-on-banner show-on-wysiwyg show-on-carousel show-on-feature_item',
		// Optional, override default text strings
		// 'text' => array(
		// 	'add_upload_files_text' => 'Replacement', // default: "Add or Upload Files"
		// 	'remove_image_text' => 'Replacement', // default: "Remove Image"
		// 	'file_text' => 'Replacement', // default: "File:"
		// 	'file_download_text' => 'Replacement', // default: "Download"
		// 	'remove_text' => 'Replacement', // default: "Remove"
		// ),
	) );

	$cmb->add_group_field( $block_group_id, array(
		'name'    => __( 'Databases Available', 'cmb2' ),
		'desc'    => '',
		'id'      => $prefix . 'databases',
		'type'    => 'multicheck',
		'options' => array(
			// Make sure the options here match those available in the block (/partials/blocks.php)
			'world' 	=> 'Libraries Worldwide',
			'ccl'		=> 'Claremont Colleges Library',
			'spcl'  	=> 'Special Collections',
			'oac'		=> 'Online Archive of California',
			'wp_ccl'	=> 'Library Website'
		),
		'classes' => 'ccl-toggled-field show-on-search',
	) );

}
