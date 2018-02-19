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
 * 
 * @todo - rewrite this using wpdb class. This would reduce queries to be one
 * https://codex.wordpress.org/Class_Reference/wpdb
 */
function load_search_results() {

	$query = apply_filters( 'get_search_query', $_POST['query'] );
	$query = sanitize_text_field( $query );
	
	//not sure why.. but WP will search with apostrophes if slashes are stripped.
	//this might be a security issue...
	$query = stripslashes( $query );	

	//query the regular stuff, like title, author, content, etc
	$all_args   = array(
		'post_type'           => array( 'guide', 'staff', 'page', 'faq', 'database', 'post' ), // see $sort_order below for results ordering
		'post_status'         => 'publish',
		'ignore_sticky_posts' => true,
		's'                   => $query,
		'posts_per_page'      => 7 // probably need to figure out how to do a limited number from each type
	);
	$all_search = new \WP_Query( $all_args );
	
	//query metabox data for 'guide_raw_data',
	//@todo figure out what metabox query is the best for to query guides
	$guide_meta_args   = array(
		'post_type'           => array( 'guide' ), // see $sort_order below for results ordering
		'post_status'         => 'publish',
		'ignore_sticky_posts' => true,
		'posts_per_page'      => 4,
		'meta_query' => array(
			array(
				'key'     => 'guide_raw_data',
				'value'   => $query,
				'compare' => 'LIKE',
			),
		)

	);
	
	$guide_meta = new \WP_Query( $guide_meta_args );

	// Sort order for the first set of results returned to live search
	// Uses the "nice name", rather than adding an unused slug to each of the parameters
	$sort_order = array(
		'Librarian',
		'Research Guide',
		'Page',
		'FAQ',
		'Database',
		'Post'
	);
	
	//creates arrays
	$search_results = array();
	$posts = array();
	
	$search_results['query_sent'] = $query;
	
	// Add query details to array
	$search_results['query'] = stripslashes( htmlspecialchars_decode($query, ENT_QUOTES) );

	//instantiate a new WP_Query objec, merge queries together, and remove duplicates
	$search = new \WP_Query();
	$search->posts = array_unique( array_merge( $all_search->posts, $guide_meta->posts ), SORT_REGULAR );
	
	$search_results['count'] = count( $search->posts );

	if ( $search->posts ) {
		// Loop through returned posts and push into the array
		foreach ( $search->posts as $post ) {

			switch ( $post->post_type ) {
				case 'book':
					$post_type_icon      = 'book';
					$post_type_nice_name = 'Book';
					$post_link           = get_the_permalink( $post->ID );
					break;
				case 'database':
					$post_type_icon      = 'pointer-right';
					$post_type_nice_name = 'Database';
					$post_link           = get_post_meta( $post->ID , 'database_friendly_url', true );
					break;
				case 'faq':
					$post_type_icon      = 'question';
					$post_type_nice_name = 'FAQ';
					$post_link           = get_the_permalink( $post->ID );
					break;
				case 'guide':
					$post_type_icon      = 'clip';
					$post_type_nice_name = 'Research Guide';
					$post_link           = get_post_meta( $post->ID , 'guide_friendly_url', true );
					break;
				case 'journal':
					$post_type_icon      = 'asterisk';
					$post_type_nice_name = 'Journal';
					$post_link           = get_the_permalink( $post->ID );
					break;
				case 'page':
					$post_type_icon      = 'clip';
					$post_type_nice_name = 'Page';
					$post_link           = get_the_permalink( $post->ID );
					break;
				case 'staff':
					$post_type_icon      = 'person';
					$post_type_nice_name = 'Librarian';
					$post_link           = get_post_meta( $post->ID , 'member_friendly_url', true );
					break;
				default:
					$post_type_icon      = 'clip'; // do we have a default icon?
					$post_type_nice_name = 'Post';
					$post_link           = get_the_permalink( $post->ID );
					break;
			}

			$post = array(
				'type'  => $post_type_nice_name,
				'icon'  => $post_type_icon,
				'title' => get_the_title( $post->ID ),
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