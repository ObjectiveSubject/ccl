<?php
namespace CCL\PostTypes;

/**
 * Set up post types
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	// NOTE: Uncomment to activate post type
	add_action( 'init', $n( 'register_news' ) );

}

/**
 * Register the 'news' post type
 *
 * See https://github.com/johnbillion/extended-cpts for more information
 * on registering post types with the extended-cpts library.
 */
function register_news() {
	register_extended_post_type( 'news', array(

		'supports' 			=> array( 'title', 'editor', 'excerpt', 'thumbnail' ),
		'admin_cols' => [
			'category' => [
				'taxonomy' => 'category'
			],
			'date' => [
				'title' => 'Published',
			]
		],

	), array(

		# Override the base names used for labels:
		'singular'  => 'News Post',
		'plural'    => 'News',

	) );
}
