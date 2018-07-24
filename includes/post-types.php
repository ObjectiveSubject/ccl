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
	add_action( 'init', $n( 'register_general' ) );	

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


/**
 * Register the 'general' post type
 *
 *  This post type will be for general assets that aren't indexed in the live search
 * 
 * Also will include an additional metabox
 * 
 * See https://github.com/johnbillion/extended-cpts for more information
 * on registering post types with the extended-cpts library.
 */
function register_general() {
	register_extended_post_type( 'general', array(
		'menu_icon'     		=> 'dashicons-admin-links',
		'supports' 				=> array( 'title', 'editor' ),
		'public'				=> false,
		'exclude_from_search'	=> false,
		'publicly_queryable'	=> true,
		'show_ui'				=> true,		
		'has_archive'			=> false,
	), array(

		# Override the base names used for labels:
		'singular'  => 'General Asset',
		'plural'    => 'General Assets',

	) );
}