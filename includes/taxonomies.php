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
	//add_action( 'init', $n( 'register_taxonomy' ) );

}

/**
 * Register the my_taxo taxonomy and assign it to posts.
 *
 * See https://github.com/johnbillion/extended-taxos for more info on using the extended-taxos library
 */
function register_taxonomy() {
	register_extended_taxonomy( 'my_taxo', 'post' );
}
