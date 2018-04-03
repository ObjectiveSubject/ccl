<?php
namespace CCL\Core;

/**
 * Set up theme defaults and register supported WordPress features.
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'wp_enqueue_scripts', $n( 'scripts' ) );
	add_action( 'wp_enqueue_scripts', $n( 'styles' ) );
	add_action( 'after_setup_theme', $n( 'features' ) );
	add_action( 'pre_get_posts', $n( 'modify_queries' ) );
	add_action( 'init', $n( 'add_menus' ) );

	// Remove WordPress header cruft
	remove_action( 'wp_head', 'feed_links_extra', 3 );
	remove_action( 'wp_head', 'rsd_link' );
	remove_action( 'wp_head', 'wlwmanifest_link' );
	remove_action( 'wp_head', 'index_rel_link' );
	remove_action( 'wp_head', 'wp_generator' );
}

/**
 * Add feature support to theme
 */
function features() {
	add_theme_support( 'title-tag' );

	add_theme_support( 'post-thumbnails' );

	add_post_type_support( 'page', 'excerpt' );

	add_theme_support( 'html5', array(
		'search-form',
		'gallery',
		'caption',
	) );
}

/**
 * Enqueue scripts for front-end.
 *
 * @param bool $debug Whether to enable loading uncompressed/debugging assets. Default false.
 *
 * @return void
 */
function scripts( $debug = false ) {
	$min = ( $debug || defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_register_script( 
		'slick', 
		CCL_TEMPLATE_URL . "/assets/js/vendor/slick{$min}.js", 
		array(), 
		CCL_VERSION, 
		true 
	);

	wp_enqueue_script(
		'main',
		CCL_TEMPLATE_URL . "/assets/js/main{$min}.js",
		array('jquery', 'slick'),
		CCL_VERSION,
		true
	);

	wp_localize_script( 'main', 'CCL', array(
		'site_url' => site_url('/'),
		'assets' => CCL_ASSETS,
		'ajax_url' => admin_url( 'admin-ajax.php' ),
		'nonce'    => wp_create_nonce( 'ccl_nonce' )
	) );
}

/**
 * Enqueue styles for front-end.
 *
 * @param bool $debug Whether to enable loading uncompressed/debugging assets. Default false.
 *
 * @return void
 */
function styles( $debug = false ) {
	$min = ( $debug || defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_enqueue_style(
		'style',
		CCL_URL . "/assets/css/style{$min}.css",
		array(),
		CCL_VERSION
	);
}

/**
 * Modify default queries in specific areas of the site
 *
 * @param $query
 */
function modify_queries( $query ) {

		// Perform query modifications here
		if( is_search() ){
		   
		   	$query->set( 'posts_per_page', 50 );
		}

		if ( ! is_admin() && $query->is_main_query() ) {

			if ( is_post_type_archive( 'database' ) ) {
				
				$query->set( 'orderby', 'title' );
				$query->set( 'order', 'ASC' );

				$is_filter_by_letter = isset( $_GET['begins_with'] ) && '' !== $_GET['begins_with'];

				if ( $is_filter_by_letter ) {

					// The best thing to do here would probably be to perform a custom query for databases beginning with the appropriate letter.
					// But it seems you have to use SQL queries to do that, which are more complicated and possibly less performant.

					// Instead we just return all the databases and use a conditional in the template (see archive-database.php).
					$query->set( 'posts_per_page', 1000 );
				}else{
					$query->set( 'posts_per_page', 20 );
				}
			}

		}

}

/**
 * Add Menu Locations
 * */
function add_menus() {
	
	register_nav_menus(
		array(
			'header_1' => 'Header 1',
			'header_2' => 'Header 2',
			'footer_1' => 'Footer 1',
			'special_collections' => 'Special Collections'
		)
	);

}
