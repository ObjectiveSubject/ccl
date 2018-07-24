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
	 add_action( 'cmb2_init',  $n( 'general_asset_options' ) );
}

/**
 * Example metabox
 * See https://github.com/WebDevStudios/CMB2/wiki/Field-Types for
 * more information on creating metaboxes and field types.
 */
function general_asset_options() {

	$prefix = 'general_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'metabox',
		'title'        => __( 'General Asset Options', 'cmb2' ),
		'priority'     => 'high',
		'object_types' => array( 'general' )
	) );

	$cmb->add_field( array(
		'name'	=> __( 'Webpage URL', 'cmb2' ),
		'desc'  => __( 'URL for the webpage being added as a general asset', 'cmb2' ),
		'id'  	=> $prefix . 'url',
		'type'	=> 'text_url'
	) );

}
