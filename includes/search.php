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

	add_action( 'rest_api_init', $n('register_search_route'));
	
	add_filter( 'searchwp_common_words', $n( 'ccl_searchwp_common_words' ) );
	
	add_filter( 'searchwp_term_pattern_whitelist', $n('ccl_searchwp_term_pattern_whitelist') );	
	
	add_action( 'wp_ajax_retrieve_post_search_results', __NAMESPACE__ . '\\retrieve_post_search_results' );
	add_action( 'wp_ajax_nopriv_retrieve_post_search_results', __NAMESPACE__ . '\\retrieve_post_search_results' );	

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

function ccl_searchwp_common_words( $terms ) {
  
  // we DO NOT want to ignore 'first' so remove it from the list of common words
  $words_to_keep = array( 'web', 'full' );
  
  $terms = array_diff( $terms, $words_to_keep );
  
  return $terms;
}


function ccl_searchwp_term_pattern_whitelist( $whitelist ) {
    $my_whitelist = array(
        "/\\bS@C\\b/ui",
        "/\\bScholarship@claremont\\b/ui",
         "/\\bdh@cc\\b/ui",
         "/\\bDH@CC\\b/ui",
         "/\\gis\\b/ui",          
    );

    // we want our pattern to be considered the most specific
    // so that false positive matches do not interfere
    $whitelist = array_merge( $my_whitelist, $whitelist );

    return $whitelist;
}



function retrieve_post_search_results(){
	//sanitize and prepare the query
	$query		= apply_filters( 'get_search_query', $_POST['query'] );	
	$query		= sanitize_text_field( $query );
	//get the swarchwp engine we will be using
	$post_types	= $_POST['postType'];
	
		//query the regular stuff, like title, author, content, etc
	$all_args   = array(
		'engine'			=> $post_types,
		's'                   => $query,
		'posts_per_page'	  => -1
	);
	$search = new \SWP_Query( $all_args );
	
	//creates arrays
	$search_results = array();
	$posts = array();
	
	if( $search->posts ){
		
		$search_results['count'] = count( $search->posts );
		
		// usort( $search->posts, function ( $a, $b ) {

		// 	return $a->post_title > $b->post_title;
		// } );
		
		foreach( $search->posts as $key => $post){
			
			switch ( $post->post_type ) {
				case 'database':
					
					$posts[] = array(
						'post_link'		=> get_post_meta( $post->ID , 'database_friendly_url', true ),				
						'post_title'	=> wp_specialchars_decode( $post->post_title ),
						'post_content'	=> wp_specialchars_decode( $post->post_content ),
						'post_alt_name'	=> get_post_meta( $post->ID, 'db_alt_names', true )
					);
					
					break;
			}
			
		}
		
	}
	
	$search_results['posts'] = $posts;
	
	// Encode array as JSON and return
	wp_send_json( wp_json_encode( $search_results ) );

	wp_die();	
	
}

/**
 * Register our custom route.
 */
function register_search_route() {
    register_rest_route('ccl/v1', '/search', [
        'methods' => \WP_REST_Server::READABLE,
        'callback' => __NAMESPACE__ . '\\ajax_search',
        'args' => get_search_args()
    ]);
}

/**
 * Define the arguments our endpoint receives.
 */
function get_search_args() {
    $args = [];
    $args['s'] = [
       'description' => esc_html__( 'The search term.', 'namespace' ),
       'type'        => 'string',
   ];

   return $args;
}

/**
 * Use the request data to find the posts we
 * are looking for and prepare them for use
 * on the front end.
 */
function ajax_search( $request ) {

	$query = sanitize_text_field( $request['s'] );
    
    // check for a search term
    if( ! isset( $request['s'] ) ) {
		return rest_ensure_response( array() );
	}
	
	$args = array(
		'post_status'         => 'publish',
		'ignore_sticky_posts' => true,
		's'                   => $query,
		'posts_per_page'	  => 500,
		'post_type' => array(
			'staff',
			'guide',
			'page',
			'faq',
			'database',
			'post',
			'general'
		),
	);

	if ( class_exists('SWP_Query') ) :
		$search = new \SWP_Query( $args );
	else : 
		$search = new \WP_Query( $args );
	endif;

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

	if ( $search->posts ) :

		//array_slice($search->posts, 0, 3)
		// Loop through returned posts and push into the array
		foreach ( array_slice($search->posts, 0, 7 ) as $post ) :

			switch ( $post->post_type ) :

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
					$post_type_nice_name = ( has_term( 'librarian', 'staff_role', $post->ID ) ) ? 'Librarian' : 'Staff'   ;
					$post_link           = get_post_meta( $post->ID , 'member_friendly_url', true );
					break;
				default:
					$post_type_icon      = 'clip'; // do we have a default icon?
					$post_type_nice_name = 'Post';
					$post_link           = get_the_permalink( $post->ID );
					break;
			
			endswitch;

			$post = array(
				'type'  => $post_type_nice_name,
				'icon'  => $post_type_icon,
				'title' => get_the_title( $post->ID ),
				'link'  => $post_link
			);

			$posts[] = $post;

		endforeach;
	
		// right now let's work without a sort order 4/3/18
		// sort $posts by ['type'] for given order
		// usort( $posts, function ( $a, $b ) use ( $sort_order ) {
		// 	$pos_a = array_search( $a['type'], $sort_order );
		// 	$pos_b = array_search( $b['type'], $sort_order );

		// 	return $pos_a - $pos_b;
		// } );

		$search_results['posts'] = $posts;
	
	// else :

	// 	return new WP_Error( 'front_end_ajax_search', 'No results');

	endif;

    return rest_ensure_response( $search_results );
}