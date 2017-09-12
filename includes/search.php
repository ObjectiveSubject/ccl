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
		'search',
		//CCL_TEMPLATE_URL . "/assets/js/search{$min}.js", // not currently minified
		CCL_TEMPLATE_URL . "/assets/js/search.js",
		array( 'jquery' ),
		CCL_VERSION,
		true
	);

	wp_enqueue_script( 'search' );

	wp_localize_script( 'search', 'searchAjax', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
}

/**
 * Load search results from WordPress
 *
 * @todo error trapping for no results
 */
function load_search_results() {

	$query = apply_filters( 'get_search_query', $_POST['query'] );
	$query = esc_attr( $query );

	$args   = array(
		'post_type'           => array( 'post', 'guide', 'staff', 'database', 'room', 'book', 'reference', 'page' ), // book/reference don't exist yet
		'post_status'         => 'publish',
		'ignore_sticky_posts' => true,
		's'                   => $query,
		'posts_per_page'      => 7 // probably need to figure out how to do a limited number from each type
	);
	$search = new \WP_Query( $args );

	$search_results = array();

	// Add query details to array
	$search_results['query'] = $query;
	$search_results['count'] = $search->found_posts;
	if ( $search->have_posts() ) {

		// Loop through returned posts and push into the array
		while ( $search->have_posts() ) {
			$search->the_post();

			switch ( get_post_type() ) {
				case 'book':
					$post_type_icon      = 'book';
					$post_type_nice_name = 'Book';
					break;
				case 'database':
					$post_type_icon      = 'pointer-right';
					$post_type_nice_name = 'Database';
					break;
				case 'faq':
					$post_type_icon      = 'pointer-question';
					$post_type_nice_name = 'FAQ';
					break;
				case 'guide':
					$post_type_icon      = 'clip';
					$post_type_nice_name = 'Research Guide';
					break;
				case 'journal':
					$post_type_icon      = 'asterisk';
					$post_type_nice_name = 'Journal';
					break;
				case 'page':
					$post_type_icon      = 'clip';
					$post_type_nice_name = 'Page';
					break;
				case 'staff':
					$post_type_icon      = 'person';
					$post_type_nice_name = 'Librarian';
					break;
				default:
					$post_type_icon      = 'clip'; // do we have a default icon?
					$post_type_nice_name = 'Post';
					break;
			}

			$post = array(
				'type'  => $post_type_nice_name,
				'icon'  => $post_type_icon,
				'title' => get_the_title(),
				'link'  => get_the_permalink()
			);

			$search_results['posts'][] = $post;

		}
		
	}

	// Encode array as JSON and return
	wp_send_json( wp_json_encode( $search_results ) );

	wp_die();

}