<?php
namespace CCL\Comments;

/**
 * Set up comments (mainly removing them)
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'admin_menu', $n( 'remove_comments_menu' ) );
	add_action( 'admin_init', $n( 'disable_comments_admin_menu_redirect' ) );
	add_action( 'admin_init', $n( 'remove_comments_support' ) );
	add_action( 'wp_before_admin_bar_render', $n( 'remove_admin_bar_comments' ) );

}

/**
 * Remove items from the admin sidebar menu
 */
function remove_comments_menu() {
	remove_menu_page( 'edit-comments.php' );
}

/**
 * Redirect people who visit edit-comments.php directly
 */
function disable_comments_admin_menu_redirect() {
	global $pagenow;

	if ( $pagenow === 'edit-comments.php' ) {
		wp_redirect( admin_url() );
		exit;
	}
}

/**
 * Remove comments/trackback support from posts
 */
function remove_comments_support() {
	remove_post_type_support( 'post', 'comments' );
	remove_post_type_support( 'post', 'trackbacks' );
}

/**
 * Remove comments from the admin bar
 */
function remove_admin_bar_comments() {
	global $wp_admin_bar;
	$wp_admin_bar->remove_menu( 'comments' );
}
