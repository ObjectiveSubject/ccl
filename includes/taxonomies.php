<?php
namespace CCL\Taxonomies;

/**
 * Set up taxonomies.
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	// NOTE: Uncomment to activate taxonomy
	add_action( 'init', $n( 'register_category' ) );

}

/**
 * See https://github.com/johnbillion/extended-taxos for more info on using the extended-taxos library
 */
function register_category() {
	register_extended_taxonomy( 'category', array(
		
		# post types
		'post', 'event', 'news'
	
	), array(

		# options...

	), array(

		# Override the base names used for labels:
		'singular'  => 'Category',
		'plural'    => 'Categories',

	) );
}
