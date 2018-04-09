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
	
	add_action( 'admin_init', $n( 'load_search_options' ) );
	add_action( 'wp_enqueue_scripts', $n( 'scripts' ) );
	add_action( 'wp_ajax_load_search_results', __NAMESPACE__ . '\\load_search_results' );
	add_action( 'wp_ajax_nopriv_load_search_results', __NAMESPACE__ . '\\load_search_results' );
	add_filter( 'searchwp_common_words', $n( 'ccl_searchwp_common_words' ) );

}


function load_search_options(){
	
	$search_locations = array(
		'world'	=> array(
			'loc'		=> 'wms',
			'name'		=> 'Libraries Worldwide',
			'param'		=> '',
			'on_front'	=> true,
			'selected'	=> true
			),
		'ccl'	=> array(
			'loc'		=> 'wms',
			'name'		=> 'The Claremont Colleges Library',
			'param'		=> 'wz:519',
			'on_front'	=> true			

			),				
		'spcl'	=> array(
			'loc'		=> 'wms',
			'name'		=> 'Special Collections',
			'param'		=> 'wz:519::zs:36307',
			'on_front'	=> true			

			),
		'oac'	=> array(
			'loc'		=> 'oac',
			'name'		=> 'Online Archive of California',
			'param'		=> 'Claremont+Colleges',
			'on_front'	=> false		

			),
		'wp_ccl' => array(
			'loc'		=> 'wp_ccl',
			'name'		=> 'Library Website',
			'param'		=> 's',
			'on_front'	=> true		

			)			
		
		);
		
	update_option( 'ccl-search-locations', $search_locations );

	
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

	wp_localize_script( 'search', 'searchAjax', 
		array( 
			'ajaxurl'			=> admin_url( 'admin-ajax.php' ),
			'searchLocations'	=> get_option( 'ccl-search-locations' ),
			'site_url'			=> site_url()
		) 
	);
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
		'post_status'         => 'publish',
		'ignore_sticky_posts' => true,
		's'                   => $query,
		'posts_per_page'	  => 175
	);
	$search = new \SWP_Query( $all_args );
	

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

	
	$search_results['count'] = count( $search->posts );

	if ( $search->posts ) {
		//array_slice($search->posts, 0, 3)
		// Loop through returned posts and push into the array
		foreach ( array_slice($search->posts, 0, 7 ) as $post ) {

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
		
		//right now let's work without a sort order 4/3/18
		// sort $posts by ['type'] for given order
		// usort( $posts, function ( $a, $b ) use ( $sort_order ) {
		// 	$pos_a = array_search( $a['type'], $sort_order );
		// 	$pos_b = array_search( $b['type'], $sort_order );

		// 	return $pos_a - $pos_b;
		// } );

		$search_results['posts'] = $posts;
	}
	
	
	// Encode array as JSON and return
	wp_send_json( wp_json_encode( $search_results ) );

	wp_die();

}

function ccl_searchwp_common_words( $terms ) {
  
  // we DO NOT want to ignore 'first' so remove it from the list of common words
  $words_to_keep = array( 'web', 'full' );
  
  $terms = array_diff( $terms, $words_to_keep );
  
  return $terms;
}