<?php
/**
 * Various helper functions for retrieving or manipulating data
 */

namespace CCL\Helpers;

/**
 * Retrieve the URL of an asset
 *
 * @param string $path : path to asset
 *
 * @return string The url of the asset
 */
function get_asset( $path ) {
	return get_template_directory_uri() . '/assets/' . $path;
}

/**
 * For use with components instead of get_template_part()
 *
 * This allows variables to resolve. We don't really need get_template_part(), as we're not planning to use child themes
 *
 * @param $name string filename of the component
 */
function get_component( $name ) {
	// @todo probably need to do some sort of error trapping here, to make sure file exists
	include ( locate_template( 'components/' . $name . '.php' ) );
}

/**
 * Get post by slug
 *
 * @param string $slug The post's slug.
 * @param string $type The post's type
 *
 * @return object
 */
function get_post_by_slug( $slug, $type = 'post' ) {
	$posts = new \WP_Query( array(
		'name'                => $slug,
		'posts_per_page'      => 1,
		'post_type'           => $type,
		'post_status'         => 'publish',
		'ignore_sticky_posts' => true,
		'no_found_rows'       => true
	) );

	if ( ! $posts ) {
		return null;
	}

	return $posts;
}

/**
 * Get related posts
 *
 * Currently pulls manually selected related posts from the 'ccl_related_posts' meta field attached to the current post
 *
 * @return null|\WP_Query
 */
function get_ccl_related_posts() {
	$post_id = get_the_ID(); //@todo this might need to be more flexible
	$related_posts = get_post_meta( $post_id, 'ccl_related_posts', true);
	$types = array( 'post', 'page' ); // @todo: maybe sort out how to loop through all?

	$posts = '';

	if ( $related_posts ) {
		$posts = new \WP_Query( array(
			'posts_per_page'      => 15,
			'post_status'         => 'publish',
			'post_type'           => $types,
			'post__in'            => $related_posts,
			'ignore_sticky_posts' => true,
			'no_found_rows'       => true
		) );
	}

	if ( ! $posts ) {
		return null;
	}

	return $posts;
}

/**
 * Retrieve the URL of the post thumbnail
 *
 * @todo add thumbnail asset
 *
 * @param int    $post_id  : id of post
 * @param string $size     : image size reference
 * @param string $fallback : specific fallback image
 *
 * @return string The url of the asset
 */
function get_thumbnail_url( $size = 'hero', $fallback = '', $post_id = 0 ) {
	global $post;
	$post_id = ( ! $post_id ) ? $post->ID : $post_id;
	$image   = wp_get_attachment_image_src( get_post_thumbnail_id( $post_id ), $size );

	if ( $image ) {
		$image = $image[0];
	} else {
		if ( $fallback ) {
			$image = get_asset( 'images/placeholder_' . $fallback . '.svg' );
		}
	}

	return ( $image ) ? $image : false;
}

/**
 * Produce Open Graph tags for a page
 *
 * @param bool $echo return array or echo contents
 *
 * @return array|string OG tags
 */
function open_graph_tags( $echo = true ) {
	global $post;
	global $wp;

	$tags = array(
		'title'       => wp_title( '—', false, 'right' ) . get_bloginfo( 'name' ), // "{page title} - {site title}"
		'site_name'   => get_bloginfo( 'name' ),
		'description' => get_bloginfo( 'description' ),
		'url'         => home_url( add_query_arg( array(), $wp->request ) ), // get current page url
		'type'        => 'page',
		'image'       => ( has_post_thumbnail() ) ? get_thumbnail_url( 'thumbnail' ) : get_asset( 'images/emblem.png' )
	);

	// Contexts
	if ( is_single() ) {
		$tags['type'] = 'article';
	} elseif ( is_archive() ) {
		$tags['type'] = 'archive';
	} elseif ( is_search() ) {
		$tags['type'] = 'search';
	}

	$tag_string = array();
	foreach ( $tags as $prop => $content ) {
		$tag_string[] = '<meta property="og:' . $prop . '" content="' . $content . '">';
	}

	if ( $echo ) {
		echo implode( '', $tag_string );
	} else {
		return $tags;
	}
}

/**
 * Truncate a string
 *
 * @param string $string   : String to shorten
 * @param int    $cap      : max characters
 * @param bool   $ellipses : show ellipses at the end of string
 * @param int    $start    : index to start truncation
 *
 * @return string
 */
function truncate( $string = null, $cap = 40, $ellipses = true, $start = 0 ) {

	if ( ! isset( $string ) ) {
		return '';
	}

	if ( $cap >= strlen( $string ) ) {
		return $string;
	}

	$new_string = trim( substr( $string, $start, $cap - 1 ) );
	$new_string = ( $ellipses ) ? $new_string . '&hellip;' : $new_string;

	return $new_string;
}

/* 
 * Output a slug from a string
 *
 * $string (string) the string to convert
 */
function create_slug( $string ){
	$slug = preg_replace( '/[!@#$%^&*]+/', '', $string ); 
	$slug = preg_replace( '/[^A-Za-z0-9-]+/', '-', $slug );
	$slug = strtolower( $slug );
	return $slug;
}


/*
 * Loops through an array of any depth to build a tree of items based on a map of parents and their children
 * Used recursively to sort and nest menu items
 *
 * $items (array) array of menu items
 * $children_map (array) a map of menu item IDs that contain their children
 */
function sort_and_populate( $items, $children_map ) {
	
	$sorted_menu_items = array();

	foreach ( $items as $item ) {

		$children = isset( $children_map[$item->ID] ) ? $children_map[$item->ID] : array();

		if ( ! empty( $children ) ) {

			$item->children = sort_and_populate( $children, $children_map );
		
		}
		
		$sorted_menu_items[] = $item;

	}

	return $sorted_menu_items;
}

/*
 * Sort and nest nav menu items
 *
 * $menu (string) menu name or ID
 */
function get_sorted_menu_items( $menu_id ) {
	
	if ( empty( $menu_id ) ) {
		return;
	}
	
	$menu_items = (array) wp_get_nav_menu_items( $menu_id );
	
	if ( empty( $menu_items ) ) {
		return;
	}

	$items_with_children = array();
	
	foreach ( $menu_items as $item ) {
		if ( ! empty( $item->menu_item_parent ) ) {

			$parent_key = $item->menu_item_parent;
			
			if ( empty( $items_with_children[$parent_key] ) ) {
				$items_with_children[$parent_key] = array();
			}

			$items_with_children[$parent_key][] = $item;

		}
	}

	$sorted = array();

	foreach ( $menu_items as $item ) {

		if ( empty( $item->menu_item_parent ) ) {

			if ( isset( $items_with_children[$item->ID] ) ) {

				$item->children = sort_and_populate( $items_with_children[$item->ID], $items_with_children );
				
			}
			
			$sorted[] = $item;

		}

	}

	return $sorted;
}


/*
 * return a list of top level menu items
 *
 * $menu (string) menu name or ID
 */
function header_menu( $menu_id, $classname = '' ) {
	
	if ( empty( $menu_id ) ) {
		return;
	}
	
	$menu_items = (array) get_sorted_menu_items( $menu_id );

	if ( empty( $menu_items ) ) {
		return;
	}
	

	$classname = is_string( $classname ) ? $classname : '';

	ob_start(); ?>

	<ul class="ccl-c-menu <?php echo $classname; ?>">
									
		<?php foreach( $menu_items as $item ) : 
			
			$item_classes = ( !empty( $item->classes ) ) ? implode( ' ', (array) $item->classes ) : '';
			
			$menu_item_class = array( "menu-item", "menu-item-type-{$item->type}", "menu-item-object-{$item->object}", "menu-item-{$item->ID}", $item_classes );
			$link_class = '';
			
			if ( isset( $item->children ) && count( $item->children ) ) {
				$menu_item_class[] = 'menu-item-has-children'; 
				$link_class = 'js-toggle-header-menu';
			} ?>

			<li class="<?php echo implode( ' ', $menu_item_class ); ?>">
				<a href="<?php echo $item->url; ?>" class="<?php echo $link_class; ?>" data-target="#sub-menu-<?php echo $item->ID; ?>"><?php echo $item->title; ?></a>
			</li>

		<?php endforeach; ?>

	</ul>

	<?php
	$html = ob_get_contents();
	ob_get_clean();

	return $html;

}


/*
 * Loops through an array of any depth to build a tree of items
 * Used recursively to build menu items
 *
 * $items (array) array of menu items
 */
function build_sub_menu_items( $items ) {
	
	foreach( $items as $item ) :

		$item_class = array( "menu-item", "menu-item-type-{$item->type}", "menu-item-object-{$item->object}", "menu-item-{$item->ID}" ); 
		?>

		<li class="<?php echo implode( ' ', $item_class ); ?>">
			
			<?php if ( $item->url == '#' ) : ?>
				<span class="ccl-non-link"><?php echo $item->title; ?></span>
			<?php else : ?>
				<a href="<?php echo $item->url; ?>"><?php echo $item->title; ?></a>
			<?php endif; ?>

			<?php if ( ! empty( $item->children ) ) : ?>
				<ul class="ccl-c-sub-menu">
					<?php build_sub_menu_items( $item->children ); ?>
				</ul>
			<?php endif; ?>		

		</li>

	<?php endforeach;
}


/*
 * return HTML for child menu items
 *
 * $menu (string) menu name or ID
 */
function header_sub_menu( $menu_id, $classname = '' ) {
	
	if ( empty( $menu_id ) ) {
		return;
	}
	
	$menu_items = (array) get_sorted_menu_items( $menu_id );

	if ( empty( $menu_items ) ) {
		return;
	}

	$classname = is_string( $classname ) ? $classname : '';

	ob_start(); ?>

		<?php foreach( $menu_items as $item ) : 
			
			$has_children = ( ! empty( $item->children ) );
			$menu_item_class = array( "menu-item", "menu-item-type-{$item->type}", "menu-item-object-{$item->object}", "menu-item-{$item->ID}" );
			?>

			<?php if ( $has_children ) : ?>

				<div id="sub-menu-<?php echo $item->ID; ?>" class="<?php echo $classname; ?>">

					<ul class="ccl-c-sub-menu">
						
						<?php build_sub_menu_items( $item->children ); ?>

					</ul>

				</div>

			<?php endif; ?>

		<?php endforeach; ?>

	<?php
	$html = ob_get_contents();
	ob_get_clean();

	return $html;

}

/**
 * Fetch a librarian's statement from post_meta or fallback to default option if none found
 *
 * @param $id int post id of the staff member
 *
 * @return mixed|string Librarian's personal statement or the default one
 */
function get_librarian_statement( $id = 0 ) {

	$statement = get_post_meta( $id, 'staff_statement', true );

	if ( ! $statement ) {

		$staff_settings = get_option( 'staff-settings' );

		// set a notice message if no default statement is found
		if ( ! array_key_exists( 'staff-statement_default', $staff_settings ) ) {
			$statement = "No default librarian statement has been added.";
		} else {
			$statement = $staff_settings['staff-statement_default'];
		}

	}

	return $statement;
}

/**
 * Check if a post has blocks
 *
 * @param $id {int} post id
 *
 * @return bool
 */
function has_block_content( $id = 0, $blocks = false ) {

	if ( ! $id ) {
		$id = get_the_ID();
	}

	if ( ! $blocks ) {
		$blocks = get_post_meta( $id, 'block_group', true );
	}
	
	// The block check will almost always be true
	// The extended check is to see if there's only 1 block and it's of type "none" 
	return ( is_array( $blocks ) && ! ( 1 == count( $blocks ) && 'none' == $blocks[0]['block_type'] ) );

}

/**
 * Get blocks from a post
 *
 * @param $id {int} post id
 *
 * @return bool|array Array of blocks OR FALSE
 */
function get_blocks( $id = 0 ) {

	if ( ! $id ) {
		$id = get_the_ID();
	}

	$blocks = get_post_meta( $id, 'block_group', true );
	
	if ( has_block_content( $id, $blocks ) ) {
		
		return $blocks;
	
	} else {
	
		return false;
	
	}

}

/**
 * Attempts to grab libcal data and store in a transient
 *
 * @return array|mixed|string|\WP_Error
 */
function get_library_hours() {

	$hours_cache  = get_transient( 'library_hours_data' );

	if ( $hours_cache ) {
		$hours_data = $hours_cache;
	} else {

		$hours_data = \CCL\Integrations\LibCal\get_hours();

		if ( ! is_wp_error ( $hours_data ) ) {
			set_transient( 'library_hours_data', $hours_data, 3 * HOUR_IN_SECONDS ); // maybe cache for 3 hours
		}
	}

	return $hours_data;
}

/**
 * Attempts to grab libcal data and store in a transient
 *
 * @return array|mixed|string|\WP_Error
 */
function get_main_library_weekly_hours() {

	$hours_cache  = get_transient( 'main_library_weekly_hours_data' );

	if ( $hours_cache ) {
		$hours_data = $hours_cache;
	} else {

		$hours_data = \CCL\Integrations\LibCal\get_weekly_hours();

		if ( ! is_wp_error ( $hours_data ) ) {
			set_transient( 'main_library_weekly_hours_data', $hours_data, 3 * HOUR_IN_SECONDS ); // maybe cache for 3 hours
		}
	}

	return $hours_data;
}


/**
 * Retrieve the current events for header from LibCal Events
 *
 * @return array|mixed|string|\WP_Error
 */
function get_header_events() {

	$event_cache  = get_transient( 'header_events' );

	if ( $event_cache ) {
		$event_data = $event_cache;
	} else {

		$parameters = array(
			'limit' => 1
		);

		$event_data = \CCL\Integrations\LibCal\get_events( $parameters );

		if ( ! is_wp_error ( $event_data ) ) {
			set_transient( 'header_events', $event_data, 15 * MINUTE_IN_SECONDS ); // maybe cache for 15 minutes
		}
	}

	return $event_data;
}


/**
 * Retrieve events for the news-events block
 *
 * @return array|mixed|string|\WP_Error
 */
function get_event_data_promo_block() {

	$event_cache  = get_transient( 'news_events_event_data' );

	if ( $event_cache ) {
		$event_data = $event_cache;
	} else {

		$parameters = array(
			'limit' => 3
		);

		$event_data = \CCL\Integrations\LibCal\get_events( $parameters );
		
		$event_data = array_filter( $event_data->events, function($event){
			if( !empty( $event->category ) ){
				foreach( $event->category as $key => $cat ){
					if( $cat->id == 35493 ){
						return true;
					}
				}				
			}

			
		} );

		if ( ! is_wp_error ( $event_data ) ) {
			set_transient( 'news_events_event_data', $event_data, 15 * MINUTE_IN_SECONDS ); // maybe cache for 15 minutes
		}
	}

	return json_decode(json_encode($event_data), true);
}


/**
 * Header notices - get header notifications from options and filter for messages that are enabled and are before exp date
 *
 * @return array|mixed|string|null
 */
function get_header_notices() {
	
	//set timezone - just to be on the safe side
	date_default_timezone_set('America/Los_Angeles');
	$today = strtotime("today");

	//get notice data
	$notice_data =  \CCL\MetaBoxes\Notifications\notices_get_options('header_notices_items');
	
	//extensive error trapping because WPEngine is throwing errors
	if( empty( $notice_data ) ){
		return;
		
	}

	//filter out messages that are not enabled, and that are after the expiration date	
	$notice_data = array_filter( $notice_data, function( $array ) use( &$today )  {
		if(  array_key_exists( 'enable_message', $array ) && $array['enable_message'] != false  && $array['notice_expiration'] > $today && !empty( $array['notices_message'] ) ){
			return $array;
		}
	} );

	//return values to be printed and reset keys
	return $notice_data = array_values( $notice_data );
}

/**
 * Get all meta_values by meta_key
 * 
 * @param $meta_key, $post_type, $status (publish)
 *
 * @return array|null
 */
function get_meta_values( $key = '', $type = '', $status = 'publish' ) {

    global $wpdb;

    if( empty( $key ) )
        return;

    $r = $wpdb->get_col( $wpdb->prepare( "
        SELECT pm.meta_value FROM {$wpdb->postmeta} pm
        LEFT JOIN {$wpdb->posts} p ON p.ID = pm.post_id
        WHERE pm.meta_key = '%s' 
        AND p.post_status = '%s' 
        AND p.post_type = '%s'
    ", $key, $status, $type ) );

    return $r;
}


/**
 * Delete post types and post meta by meta key and meta value
 * 
 * @param $meta_key, $meta_value
 *
 * @return array|null
 */
function delete_post_by_meta( $meta_key= '', $meta_value = '' ){
    
    global $wpdb;
    
    if( empty( $meta_key ) ) return;
    
    $result = $wpdb->get_results( 
            $wpdb->prepare("
                DELETE p, pm
                FROM {$wpdb->posts} p
                INNER JOIN
                {$wpdb->postmeta} pm
                ON pm.post_id = p.ID
                WHERE pm.meta_key = '%s'
                AND pm.meta_value = '%s'
            ", $meta_key, $meta_value
            )
        
        );
    
    return $result;
}

/**
 * Retrieves post ID by the meta value
 * 
 * @param $meta_key, $meta_value
 *
 * @return array|null
 */
function get_post_id_by_meta_key_value( $key= '', $value = '' ){
    global $wpdb;
    
    $result = $wpdb->get_results(
            $wpdb->prepare(
                    "SELECT *
                    FROM {$wpdb->postmeta} pm
                    WHERE meta_key = '%s'
                    AND meta_value = '%s'
                    ", $key, $value
                )
        );
        
    return $result;
}

/**
 * Converts and console logs data from PHP on the front end
 * 
 * @param $data to log, $title
 * 
 * @todo - set up hook for displaying on admin side
 *
 * @return array|mixed|string|\WP_Error
 */
function debug_to_console( $data, $title = null) {
	
	//check for title and localize arguments
	$fn_title = !empty( $title ) ? $title : 'From WP';
	$fn_data = $data;
	
	add_action( (is_admin() ? 'admin_footer' : 'wp_footer'), function() use ($fn_title, $fn_data){
		
	    if( is_array($fn_data) || is_object($fn_data) ) {
			echo "<script>
					if(console.debug!='undefined'){
						console.log('{$fn_title}:' , ". json_encode($fn_data) .");
					}</script>" ;
		} else {
			echo "<script>
					if(console.debug!='undefined'){	
						console.log('{$fn_title}: ".$fn_data."');
					}</script>" ;
		}		
		
	} );
}

/**
 * On import - this function checks for 3rd party IDs that exist in WP, that don't exist in the canonical source
 * If there are IDs found in WP, create an array and delete these posts and post meta from WP database
 * 
 * @param $meta_key, $post_type, $api_data (array)
 *
 * @return mixed|string|int
 */
function check_import_for_deletions( $meta_key = '', $post_type = '', $api_data = '' ){
    
        //console log the API data for debugging
        //debug_to_console( $api_data, $post_type . ' API' );
    
    //check if object or array - if object convert to array
    $api_data		= is_object( $api_data ) ? json_decode( json_encode( $api_data ), true ) : $api_data;
    
    //get all wp posts by post type, make sure we are casting as strings because it's easier
    $wp_post_ids    =  array_map( 'strval', get_meta_values( $meta_key, $post_type ) );
    
        //console log the WP ids for debugging
        //debug_to_console( $wp_post_ids,  'WP IDs' );
    
    //get all id's of import accounts, make sure we are casting as strings because it's easier
    $id_check = ( $post_type == 'faq' ) ? 'faqid' : 'id';
    $api_ids        =   array_map( 'strval', array_column( $api_data, $id_check ) ) ;
    
        //console log the API data for debugging
        //debug_to_console( $api_ids,  'API IDs' );
    
    //let's check to make sure there are values, especially for the api_ids
    //aborts if either of them don't have data from the API
    if( empty( $wp_post_ids ) || empty( $api_ids ) ){
        
        //console log the abort message
        debug_to_console( 'No Ids found -- aborting' );
        return 'No Ids found -- aborting';
    }
    
    //compare the two arrays and produce a list of results, remove all the array_diff keys
    $diff_ids       =  array_values( array_diff( $wp_post_ids, $api_ids ) );
    
    if(  !empty( $diff_ids) ){
        
        //foreach outlying post type, delete post and post_meta
        foreach( $diff_ids as $key => $meta_id  ){
            
            //delete posts and postmeta
            delete_post_by_meta( $meta_key, $meta_id );
        }
        
        //return the cound of posts deleted
        return count( $diff_ids );
        
    }else{
        //if everything runs correctly, but there are still no updates
        debug_to_console( 'Nothing to delete' );
        return  'Nothing to delete';
    }
    
    
}

/**
 * Retrieves related posts to be inserted into related contexts by subject
 * 
 * @params $subject ID to be searched, $post_types (array) to search
 * 
 * @return mixed|array|null
 * 
 */
function get_related_data( $subject_id = '', $post_types  ){
	//$taxonomy->term_id
    $args = array(
        'post_type' => $post_types,
        'orderby'   => 'type',
        'tax_query' => array(
                array(
                    'taxonomy'  => 'subject',
                    'field'     => 'term_id',
                    'terms'     => $subject_id,
                    )
            )
        
        );
    
    $related_subject_data = new \WP_Query( $args );
    
        $temp_guide_array   =  array();
        $temp_staff_array   = array();
        $sorted_results     = array();                
    
    if( !empty( $related_subject_data->posts ) ){
        
        foreach( $related_subject_data->posts as $post ){
            
            /**
             * @todo
             *  Right now we are filtering for staff and guides, but we will need to generalize this for any cases
             */
            switch ( $post->post_type ) {
                case 'staff':
                    
                    $temp_staff_array[] = array(
                        'name'      => $post->post_title . '<br /> ' . '<span class="ccl-u-weight-bold ccl-u-font-size-sm">' . get_post_meta( $post->ID, 'member_title', true ) . '</span>',
                        'url'       => get_post_meta( $post->ID, 'member_friendly_url', true ) ?: site_url('/staff-directory/'),
                        'profile'   => get_post_meta( $post->ID, 'member_image', true ) ?: CCL_TEMPLATE_URL . "/assets/images/person.svg",

                        );
                        
                        
                    break;
                    
                case 'guide':
                    $temp_guide_array[] = array(
                        'name'  => $post->post_title . '<br /><span class="ccl-u-weight-bold ccl-u-font-size-sm">'. get_post_meta( $post->ID, 'guide_type', true ) .'</span>',
                        'url'   => get_post_meta( $post->ID, 'guide_friendly_url', true ) ?: site_url('/research-guides/'),
                        'profile'  => CCL_TEMPLATE_URL . "/assets/images/ccl-compass.svg"
                        );
                    break;    

            }//end switch
            
        }//end foreach
        
        //merge all data together
        return array_merge( $temp_staff_array,  $temp_guide_array );
        
    }//end if	
	
}