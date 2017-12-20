<?php
namespace CCL\MetaBoxes\Hero;

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
	add_action( 'cmb2_init',  $n( 'hero_fields' ) );
}

/**
 * Example metabox
 * See https://github.com/WebDevStudios/CMB2/wiki/Field-Types for
 * more information on creating metaboxes and field types.
 */
function hero_fields() {

	$prefix = 'hero_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'metabox',
		'title'        => __( 'Hero Options', 'cmb2' ),
		'priority'     => 'high',
		'object_types' => array( 'page' )
	) );

	$cmb->add_field( array(
		'name'	=> __( 'Contextual Text', 'cmb2' ),
		'desc'  => __( 'Add text above the page title', 'cmb2' ),
		'id'  	=> $prefix . 'context_text',
        'type'	=> 'text',
    ) );
    
    $cmb->add_field( array(
		'name'	=> __( 'Contextual URL', 'cmb2' ),
		'desc'  => __( 'Make the contextual text a url', 'cmb2' ),
		'id'  	=> $prefix . 'context_url',
        'type'	=> 'text',
    ) );

    $cmb->add_field( array(
		'name'	=> __( 'Custom Title', 'cmb2' ),
		'desc'  => __( 'A custom title for this page', 'cmb2' ),
		'id'  	=> $prefix . 'custom_title',
        'type'	=> 'text',
        'attributes' => array(
            'style' => 'width:100%'
        )
	) );

	$cmb->add_field( array(
		'name'	=> __( 'Content Blocks Nav', 'cmb2' ),
		'desc'  => __( 'Hide the nav for content blocks', 'cmb2' ),
		'id'  	=> $prefix . 'hide_blocks_nav',
        'type'	=> 'checkbox',
	) );

	$quick_link_id = $cmb->add_field( array(
		'id'          => $prefix . 'quick_links',
		'type'        => 'group',
		// 'description' => __( 'Generates reusable form entries', 'cmb2' ),
		// 'repeatable'  => false, // use false if you want non-repeatable group
		'options'     => array(
			'group_title'   => __( 'Quick Link {#}', 'cmb2' ), // since version 1.1.4, {#} gets replaced by row number
			'add_button'    => __( 'Add Another Link', 'cmb2' ),
			'remove_button' => __( 'Remove Link', 'cmb2' ),
			'sortable'      => true, // beta
			'closed'     => true, // true to have the groups closed by default
		),
	) );

	$group_prefix = $prefix . 'link_';

	$cmb->add_group_field( $quick_link_id, array(
		'name'    => __( 'Title', 'cmb2' ),
		// 'desc'    => 'field description (optional)',
		// 'default' => 'standard value (optional)',
		'id'      => $group_prefix . 'title',
		'type'    => 'text',
		'attributes' => array(
			'style' => 'width:100%'
		)
	) );

	$cmb->add_group_field( $quick_link_id, array(
		'name'    => __( 'URL', 'cmb2' ),
		// 'desc'    => 'field description (optional)',
		// 'default' => 'standard value (optional)',
		'id'      => $group_prefix . 'url',
		'type'    => 'text_url',
		'attributes' => array(
			'style' => 'width:100%'
		)
	) );

	$cmb->add_group_field( $quick_link_id, array(
		'name'                => __( 'Icon', 'cmb2' ),
		'id'                  => $group_prefix . 'icon',
		'type'                => 'select',
		'show_option_none' 	  => true,
		'options'             => array(
			'asterisk' 			=> __( 'Asterisk', 'cmb2' ),
			'book' 				=> __( 'Book', 'cmb2' ),
			'calendar' 			=> __( 'Calendar', 'cmb2' ),
			'clock' 			=> __( 'Clock', 'cmb2' ),
			'compass' 			=> __( 'Compass', 'cmb2' ),
			'search' 			=> __( 'Magnifying Glass', 'cmb2' ),
			'pointer-right-open'=> __( 'Mouse Cursor', 'cmb2' ),
			'clip' 				=> __( 'Paper Clip', 'cmb2' ),
			'person-open ' 		=> __( 'Person', 'cmb2' ),
			'question' 			=> __( 'Question Mark', 'cmb2' ),
		),
	) );

}
