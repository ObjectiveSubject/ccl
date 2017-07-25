<?php
namespace CCL\Search;

/**
 * Set up search and autocomplete
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};
	add_action( 'wp_enqueue_scripts', $n( 'scripts' ) );
	add_action( 'wp_ajax_load_search_results', __NAMESPACE__ . '\\load_search_results' );
	add_action( 'wp_ajax_nopriv_load_search_results', __NAMESPACE__ . '\\load_search_results' );
}

/**
 * Add script to get functioning search lookahead
 *
 * @param bool $debug
 */
function scripts( $debug = false ) {
	$min = ( $debug || defined( 'SCRIPT_DEBUG' ) && SCRIPT_DEBUG ) ? '' : '.min';

	wp_register_script(
		'home',
		CCL_TEMPLATE_URL . "/assets/js/home{$min}.js",
		array( 'jquery' ),
		CCL_VERSION,
		true
	);

	wp_enqueue_script( 'home' );
	wp_localize_script( 'home', 'myAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
}

/**
 * Load search results from WordPress
 */
function load_search_results() {

	$query = apply_filters( 'get_search_query', $_POST['query'] );
	$query = esc_attr( $query );

	$args   = array(
		'post_type'           => array( 'book', 'post', 'guide', 'staff' ),
		'post_status'         => 'publish',
		'no_found_rows'       => true,
		'ignore_sticky_posts' => true,
		's'                   => $query
	);
	$search = new \WP_Query( $args );

	$search_results = array();

	if ( $search->have_posts() ) :

		while ( $search->have_posts() ) : $search->the_post();

			$search_results[] = array(
				'title'     => get_the_title(),
				'post_type' => get_post_type()
			);

		endwhile;

	endif;

	var_dump( json_encode( $search_results ) );

	wp_die();

}