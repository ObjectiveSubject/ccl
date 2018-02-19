<?php
namespace CCL\Guides;

/**
 * Setup actions and filters for guides
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'init', $n( 'register_guides_post_type' ) );

	add_action( 'admin_enqueue_scripts', $n( 'load_admin_script' ), 20 );

	add_action( 'admin_menu', $n( 'import_page' ) );

	add_action( 'wp_ajax_retrieve_guides', __NAMESPACE__ . '\\retrieve_guides' ); // not sure why $n wrapper doesn't work here

	add_action( 'add_meta_boxes_guide', $n('add_guide_meta_box' ) );
}

/**
 * Register the 'guide' post type using Extended CPTs
 *
 * This can be replaced with a standard post type instead of using a library if desired
 *
 * See https://github.com/johnbillion/extended-cpts for more information
 * on registering post types with the extended-cpts library.
 */
function register_guides_post_type() {

	register_extended_post_type( 'guide', array(
		'menu_icon'       => 'dashicons-book-alt',
		'supports'        => array( 'title' ), // false turns everything off
		'capability_type' => 'post',
		'capabilities'    => array(
			'create_posts' => 'do_not_allow', // Remove support for "Add New" (can also change to a role, rather than false)
		),
		'map_meta_cap'    => true, // Allows created posts to be edited
	) );

}


/**
 * Add option page to the Guides menu
 */
function import_page() {
	// add top level menu page
	add_submenu_page(
		'edit.php?post_type=guide',
		'Guide Import',
		'Import',
		'publish_posts',
		'import',
		'\CCL\Guides\import_page_html'
	);
}

/**
 * Guides import page callback
 */
function import_page_html() {
	// check user capabilities
	if ( ! current_user_can( 'publish_posts' ) ) {
		return;
	}

	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

		<h2>Import</h2>

		<p>Use this tool to import and update guides from libguide.</p>

		<?php if ( ! \CCL\Integrations\LibGuides\get_libguide_key() || ! \CCL\Integrations\LibGuides\get_libguide_id() ) : ?>
			<div class="error notice">
				<p><strong>LibGuide API key and id have not been set</strong></p>
			</div>
		<?php endif; ?>

		<?php // Currently imported stats, api query for recently updated? ?>

		<div id="libguides-importer">
			<div id="libguides-info" class="hidden">

				<div class="spinner is-active" style="float:none;width:auto;height:auto;padding:10px 0 10px 40px;background-position:0;">
					Importing guides from Springshare&hellip;
				</div>

				<div id="libguides-import-response" class="libguides-response"></div>

			</div>

			<input type="hidden" name="libguides-import-nonce" id="libguides-import-nonce" value="<?php echo wp_create_nonce( 'libguides_import_nonce' ); ?>" />

			<p class="submit">
				<input type="submit" name="libguides-import" id="libguides-import" class="button button-primary" value="Import from Springshare">
			</p>

		</div>

	</div>
	<?php
}

/**
 * Add scripts and styles for import page
 */
function load_admin_script() {
	// Enqueue Styles

	// Enqueue Scripts
	wp_enqueue_script( 'libguides', get_template_directory_uri() . '/assets/js/admin/libguides.js', 'jquery', '1.0', true );

}

/**
 * AJAX function for retrieving guides from Springshare
 */
function retrieve_guides() {
	check_ajax_referer( 'libguides_import_nonce', 'libguides_nonce' );

	if ( ! current_user_can( 'publish_posts' ) ) {
		wp_die( 'Error: invalid permissions' );
	}

	$guides = process_guides();

	$response = '<h3>Results</h3>';

	// @todo sort out actual error response here
	if ( $guides == 'error' ) {
		$response .= '<p>Error</p>';
	} else {
		$response .= '<ul>';
		$response .= '<li><strong>Retrieved:</strong> ' . $guides['retrieved'] . ' guides</li>';
		$response .= '<li><strong>Imported:</strong> ' . $guides['added'] . '</li>';
		$response .= '<li><strong>Updated:</strong> ' . $guides['updated'] . '</li>';
		$response .= '</ul>';
	}

	wp_die( $response );
}

/**
 * Retrieve guides, process them and return results
 *
 * @return array Data indicating success or failure of the import
 */
function process_guides() {

	$guides = \CCL\Integrations\LibGuides\get_all_guides();

	$results               = array();
	$results['retrieved']  = count( $guides );
	$results['added']      = 0;
	$results['updated'] = 0;

	// @todo check if this is a Guides array or an error object

	// Events are stored as an indexed array under Event
	foreach ( $guides as $guide ) {
		$add_guide = add_guide( $guide );

		if ( 'added' == $add_guide ) {
			$results['added'] = $results['added'] + 1;
		} elseif ( 'updated' == $add_guide ) {
			$results['updated'] = $results['updated'] + 1;
		} else {
			//
		}
	}

	return $results;
}

/**
 * Create or update guide
 *
 * @param $guide
 *
 * @return string added|updated
 */
function add_guide( $guide ) {

	// quick and dirty way to convert multi-dimensional object to array
	$guide = json_decode( json_encode( $guide ), true );

	// check against custom id field to see if post already exists
	$libguide_id = $guide['id'];

	// meta query to check if the guide already exists
	$duplicate_check = new \WP_Query( array(
		'post_type' => 'guide',
		'meta_query' => array(
			array(
				'key' => 'guide_id',
				'value' => $libguide_id
			)
		),
	) );

	/*
	 * Construct arguments to use for wp_insert_post()
	 */
	$args = array();

	if ( $duplicate_check->have_posts() ) {

		$duplicate_check->the_post();
		$args['ID'] = get_the_ID(); // existing post ID (otherwise will insert new)

	}

	$args['post_title']   = $guide['name']; // post_title
	$args['post_content'] = $guide['description']; // post_content
	$args['post_status'] = 'publish'; // default is draft
	$args['post_type']    = 'guide';

	if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		$args['post_status'] = 'publish'; // automatically publish posts on servers with debug enabled
	}

	/*
	 * Create/update the Guide and grab post id (for post meta insertion)
	 */
	$post_id = wp_insert_post( $args );
	
	//format guide owner name
	$owner_name = $guide['owner']['first_name'] . " " . $guide['owner']['last_name'];

	// Insert data into custom fields
	update_post_meta( $post_id, 'guide_id', $guide['id']);
	update_post_meta( $post_id, 'guide_friendly_url', $guide['friendly_url']);
	update_post_meta( $post_id, 'guide_owner_id', $guide['owner_id']);
	update_post_meta( $post_id, 'guide_owner', $owner_name );
	update_post_meta( $post_id, 'guide_owner_email', $guide['owner']['email']);
	update_post_meta( $post_id, 'guide_updated', $guide['updated']);
	update_post_meta( $post_id, 'guide_description', $guide['description'] );

	// Raw data for development
	update_post_meta( $post_id, 'guide_raw_data', $guide);

	// Add Subjects to custom taxonomy
	if ( array_key_exists( 'subjects', $guide ) ) {
		$subjects_array = array();
		foreach ( $guide['subjects'] as $subject ) {
			$subjects_array[] = $subject['name'];
		}
		// Add subject name to subject taxonomy
		wp_set_object_terms( $post_id, $subject['name'], 'subject' );
	}

	if ( $duplicate_check->have_posts() ) {
		return "added";
	} else {
		return "updated";
	}
}

/**
 * Create a metabox to display data retrieved from the API
 *
 * @param $post
 */
function add_guide_meta_box( $post ) {
	add_meta_box(
		'api_data_meta_box',
		__( 'Data from LibGuides' ),
		__NAMESPACE__ . '\\render_guide_data_metabox',
		'guide',
		'normal',
		'high'
	);
}

/**
 * Render the API data metabox
 */
function render_guide_data_metabox() {
	global $post;

	$friendly_url		= get_post_meta( $post->ID, 'guide_friendly_url', true );
	$owner_id			= get_post_meta( $post->ID, 'guide_owner_id', true );
	$raw_data			= get_post_meta( $post->ID, 'guide_raw_data', true );
	$guide_owner		= get_post_meta( $post->ID, 'guide_owner', true);
	$guide_owner_email	= get_post_meta( $post->ID, 'guide_owner_email', true);
	$guide_updated		= get_post_meta( $post->ID, 'guide_updated', true);
	$guide_updated		= date( 'm/d/y', strtotime( $guide_updated ) );
	$guide_description	= get_post_meta( $post->ID, 'guide_description', true );

	$guide_description	= !empty( $guide_description ) ? $guide_description : 'No description yet'. '<br>';
	$content = $post->post_content;
	
	echo '<p>';

	echo '<strong>Guide ID:</strong> ' . get_post_meta( $post->ID, 'guide_id', true ) . '<br>';

	if ( $friendly_url ) {
		echo '<strong>Friendly URL:</strong> <a href="' . $friendly_url . '" target="_blank">' . $friendly_url . '</a><br>';
		echo '<strong>Updated:</strong> ' . $guide_updated . '<br>';
		echo '<strong>Description:</strong> ' . $guide_description . '<br>';
	}

	// Find owner in Staff
	$owner = new \WP_Query( array(
		'post_type' => 'staff',
		'meta_query' => array(
			array(
				'key' => 'member_id',
				'value' => $owner_id
			)
		),
	) );

	
	if ( $owner->have_posts() ) {
		$owner->the_post();
		echo '<strong>Owner:</strong> <a href="' . get_the_permalink() . '">' . get_the_title() . '</a> (Full Name: '. $guide_owner .')<br>' ;
		echo '<strong>Email:</strong> ' . $guide_owner_email . '<br>';
	} else {
		echo '<strong>Owner ID:</strong> ' . get_post_meta( $post->ID, 'guide_owner_id', true ) . ' (no local staff member found)<br>'; // replace with link to Librarian if they exist

	}

	// These don't seem to work, subsequent post->ID calls use $owner query
	// We may need to use get_posts() in the admin area, this is weird
	wp_reset_query();
	wp_reset_postdata();

	echo '</p>';

	if ( $content ) {
		echo '<h4>Content</h4>';
		echo apply_filters( 'the_content', $content );
	}

	// Raw Data
	echo '<hr>';

	echo '<strong>Raw Data</strong> (<span id="raw-data-toggle" style="color:#21759B;cursor:pointer">show</span>)';

	echo '<div id="raw-api-data" class="hidden">';

	echo '<p><em>Currently crossed with expand: <code>owner</code>. Can also cross with: <code>group</code>, <code>pages</code>, 
		  <code>pages.boxes</code>, <code>subjects</code>, <code>tags</code>, <code>metadata</code>.</em></p>';

	echo '<div style="white-space:pre-wrap;font-family:monospace;">';
	print_r( $raw_data );
	echo '</pre>';

	echo '</div>';
}