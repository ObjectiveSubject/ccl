<?php
namespace CCL\Admin;

/**
 * Set up admin features
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'admin_enqueue_scripts', $n( 'load_admin_scripts' ), 20 );

	add_action( 'admin_init', $n( 'customize_admin' ) );
	add_action( 'admin_init', $n( 'add_editor_styles') );
	add_filter( 'dashboard_recent_posts_query_args', $n( 'add_cpts_to_dashboard_activity' ) );

	add_action( 'login_enqueue_scripts', $n( 'load_login_style' ) );

}

/**
 * Admin customization
 */
function customize_admin() {
	// Remove unused dashboard modules
	remove_meta_box( 'dashboard_quick_press', 'dashboard', 'side' );
	remove_meta_box( 'dashboard_primary', 'dashboard', 'side' );

	// Prevent default custom fields box from being available
	remove_meta_box( 'postcustom', 'post', 'normal' );
}

/**
 *
 */
function load_admin_scripts() {
	// Register Styles
	wp_register_style( 'ccl_admin_style', get_template_directory_uri() . '/assets/css/admin.css', false, '1.0.0' );

	// Enqueue Styles
	wp_enqueue_style( 'ccl_admin_style' );

	// Enqueue Scripts
	wp_enqueue_script( 'admin', get_template_directory_uri() . '/assets/js/admin/general.js' );
	wp_enqueue_script( 'ccl_blocks', get_template_directory_uri() . '/assets/js/admin/blocks.js', 'jquery', '1.0', true );

}

/**
 * Add a stylesheet to customize the appearance of the TinyMCE editor
 */
function add_editor_styles() {
	$stylesheet = get_template_directory_uri() . '/assets/css/admin-editor.css';

	add_editor_style( $stylesheet );
}

/**
 * Add a custom stylesheet to alter the appearance of the login page
 */
function load_login_style() {
	wp_register_style( 'admin_login_style', get_template_directory_uri() . '/assets/css/admin-login.css', false, '1.0.0' );
	wp_enqueue_style( 'admin_login_style' );
}

/**
 * Add custom post types to Dashboard activity widget
 *
 * @param $query_args
 *
 * @return mixed
 */
function add_cpts_to_dashboard_activity( $query_args ) {
	if ( is_array( $query_args[ 'post_type' ] ) ) {
		//Set you post types
		$query_args[ 'post_type' ][] = 'database';
		$query_args[ 'post_type' ][] = 'guide';
		$query_args[ 'post_type' ][] = 'page';
		$query_args[ 'post_type' ][] = 'staff';
	} else {
		$temp = array( $query_args[ 'post_type' ], 'page', 'database', 'guide', 'staff' );
		$query_args[ 'post_type' ] = $temp;
	}
	return $query_args;
}