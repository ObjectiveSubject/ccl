<?php
namespace CCL\MetaBoxes\Attachments;

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
	add_action( 'cmb2_init',  $n( 'attachment_fields' ) );
}

/**
 * Example metabox
 * See https://github.com/WebDevStudios/CMB2/wiki/Field-Types for
 * more information on creating metaboxes and field types.
 */
function attachment_fields() {

	$prefix = 'attachment_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'metabox',
		'title'        => __( 'Attachment Options', 'cmb2' ),
		'priority'     => 'high',
		'object_types' => array( 'attachment' )
	) );

	$cmb->add_field( array(
		'name'	=> __( 'Carousel Link', 'cmb2' ),
		// 'desc'  => __( 'A description', 'cmb2' ),
		'id'  	=> $prefix . 'carousel_link',
		'type'	=> 'text_url'
	) );

}
