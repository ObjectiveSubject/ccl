<?php
namespace CCL\MetaBoxes\Staff;

/**
 * Metaboxes that appear on the staff post type
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'cmb2_init',  $n( 'staff_options' ) );
}

/**
 * Create a general options metabox for staff
 */
function staff_options() {

	$prefix = 'staff_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'metabox',
		'title'        => __( 'Staff Options', 'cmb2' ),
		'priority'     => 'high',
		'object_types' => array( 'staff' )
	) );

	$cmb->add_field( array(
		'name'	=> __( 'Statement', 'cmb2' ),
		//'desc'  => __( 'A description', 'cmb2' ),
		'id'  	=> $prefix . 'statement',
		'type'	=> 'textarea_small'
	) );

}
