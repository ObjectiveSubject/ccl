<?php
namespace CCL\MetaBoxes\General;

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
	// add_action( 'cmb2_init',  $n( 'general_options' ) );
}

/**
 * Example metabox
 * See https://github.com/WebDevStudios/CMB2/wiki/Field-Types for
 * more information on creating metaboxes and field types.
 */
function general_options() {

	$prefix = 'general_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'metabox',
		'title'        => __( 'General Options', 'cmb2' ),
		'priority'     => 'high',
		'object_types' => array( 'page' )
	) );

	$cmb->add_field( array(
		'name'	=> __( 'A Title', 'cmb2' ),
		'desc'  => __( 'A description', 'cmb2' ),
		'id'  	=> $prefix . 'field_id',
		'type'	=> 'text'
	) );

}
