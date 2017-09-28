<?php
namespace CCL\Subjects;

/**
 * Setup actions and filters for subjects
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'init', $n( 'register_subject_taxonomy' ) );


}

/**
 * Register the 'subject' taxonomy using Extended Taxos
 *
 * This can be replaced with a standard taxonomy instead of using a library if desired
 *
 * See https://github.com/johnbillion/extended-taxos for more information
 * on registering taxonomies with the extended-taxos library.
 */
function register_subject_taxonomy() {

	register_extended_taxonomy(
		'subject', // taxonomy name
		array(
			// post types
			'guide',
			'staff'
		),
		array(
			// parameters
			'meta_box' => 'simple',
		)

	);

}
