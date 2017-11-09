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
			
			$menu_item_class = array( "menu-item", "menu-item-type-{$item->type}", "menu-item-object-{$item->object}", "menu-item-{$item->ID}" );
			$link_class = '';
			
			if ( isset( $item->children ) && count( $item->children ) ) {
				$menu_item_class[] = 'menu-item-has-children'; 
				$link_class = 'js-toggle-header-menu';
			} ?>

			<li id="menu-item-<?php echo $item->ID; ?>" class="<?php echo implode( ' ', $menu_item_class ); ?>">
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

		<li id="menu-item-<?php echo $item->ID; ?>" class="<?php echo implode( ' ', $item_class ); ?>">
			
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
