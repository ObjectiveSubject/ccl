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