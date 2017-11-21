<?php
namespace CCL\StaffRoles;

/**
 * Setup actions and filters for subjects
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'init', $n( 'register_staff_role_taxonomy' ) );


}

/**
 * Register the 'subject' taxonomy using Extended Taxos
 *
 * This can be replaced with a standard taxonomy instead of using a library if desired
 *
 * See https://github.com/johnbillion/extended-taxos for more information
 * on registering taxonomies with the extended-taxos library.
 */
function register_staff_role_taxonomy() {

	register_extended_taxonomy(
		'staff_role', // taxonomy name
		array(
			// post types
			'staff'
		),
		array(
			// parameters
			// 'meta_box' => 'simple',
		)

	);

}
