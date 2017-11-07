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
		'post_type'           => array( 'guide', 'staff', 'page', 'faq', 'database', 'post' ), // see $sort_order below for results ordering
		'post_status'         => 'publish',
		'ignore_sticky_posts' => true,
		's'                   => $query,
		'posts_per_page'      => 7 // probably need to figure out how to do a limited number from each type
	);
	$search = new \WP_Query( $args );

	// Sort order for the first set of results returned to live search
	// Uses the "nice name", rather than adding an unused slug to each of the parameters
	$sort_order = array(
		'Research Guide',
		'Librarian',
		'Page',
		'FAQ',
		'Database',
		'Post'
	);

	$search_results = array();
	$posts = array();

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
					$post_link           = get_the_permalink();
					break;
				case 'database':
					$post_type_icon      = 'pointer-right';
					$post_type_nice_name = 'Database';
					$post_link           = get_post_meta( get_the_ID(), 'database_friendly_url', true );
					break;
				case 'faq':
					$post_type_icon      = 'question';
					$post_type_nice_name = 'FAQ';
					$post_link           = get_the_permalink();
					break;
				case 'guide':
					$post_type_icon      = 'clip';
					$post_type_nice_name = 'Research Guide';
					$post_link           = get_post_meta( get_the_ID(), 'guide_friendly_url', true );
					break;
				case 'journal':
					$post_type_icon      = 'asterisk';
					$post_type_nice_name = 'Journal';
					$post_link           = get_the_permalink();
					break;
				case 'page':
					$post_type_icon      = 'clip';
					$post_type_nice_name = 'Page';
					$post_link           = get_the_permalink();
					break;
				case 'staff':
					$post_type_icon      = 'person';
					$post_type_nice_name = 'Librarian';
					$post_link           = get_post_meta( get_the_ID(), 'member_friendly_url', true );
					break;
				default:
					$post_type_icon      = 'clip'; // do we have a default icon?
					$post_type_nice_name = 'Post';
					$post_link           = get_the_permalink();
					break;
			}

			$post = array(
				'type'  => $post_type_nice_name,
				'icon'  => $post_type_icon,
				'title' => get_the_title(),
				'link'  => $post_link
			);

			$posts[] = $post;

		}

		// sort $posts by ['type'] for given order
		usort( $posts, function ( $a, $b ) use ( $sort_order ) {
			$pos_a = array_search( $a['type'], $sort_order );
			$pos_b = array_search( $b['type'], $sort_order );

			return $pos_a - $pos_b;
		} );

		$search_results['posts'] = $posts;
	}

	// Encode array as JSON and return
	wp_send_json( wp_json_encode( $search_results ) );

	wp_die();

}