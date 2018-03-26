<?php
namespace CCL\Events;

/**
 * Setup actions and filters for events
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'init', $n( 'register_events_post_type' ) );

	add_action( 'admin_enqueue_scripts', $n( 'load_admin_script' ), 20 );

	add_action( 'admin_menu', $n( 'import_page' ) );

	add_action( 'wp_ajax_retrieve_events', __NAMESPACE__ . '\\retrieve_events' );
	// add_action( 'wp_ajax_nopriv_retrieve_events', __NAMESPACE__ . '\\retrieve_events' );

	add_action( 'add_meta_boxes_event', $n('add_event_meta_box' ) );
}

/**
 * Register the 'event' post type using Extended CPTs
 *
 * This can be replaced with a standard post type instead of using a rary if desired
 *
 * See https://github.com/johnbillion/extended-cpts for more information
 * on registering post types with the extended-cpts rary.
 */
function register_events_post_type() {

	register_extended_post_type( 'event', array(
		'menu_icon' 		=> 'dashicons-calendar',
		'supports'        => array( 'title' ), // content, editor, thumbnail would allow content to be edited
		'capability_type' => 'post',
		'capabilities' => array(
			'create_posts' => 'do_not_allow', // Remove support for "Add New" (can also change to a role, rather than false)
		),
		'map_meta_cap' => true, // Allows created posts to be edited
		'admin_cols' => array(
			'category' => [
				'taxonomy' => 'category'
			],
			'date' => [
				'title' => 'Published',
			]
		),
	) );

}


/**
 * Add option page to the Events menu
 */
function import_page() {
	// add top level menu page
	add_submenu_page(
		'edit.php?post_type=event',
		'Event Import',
		'Import',
		'publish_posts',
		'events_import',
		'\CCL\Events\import_page_html'
	);
}

/**
 * Events import page callback
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

		<p>Use this tool to import and update events from event.</p>

		<?php // Currently imported stats, api query for recently updated? ?>

		<div id="events-importer">
			<div id="events-info" class="hidden">

				<div class="spinner is-active" style="float:none;width:auto;height:auto;padding:10px 0 10px 40px;background-position:0;">
					Importing events from Springshare&hellip;
				</div>

				<div id="events-import-response" class="events-response"></div>

			</div>

			<input type="hidden" name="events-import-nonce" id="events-import-nonce" value="<?php echo wp_create_nonce( 'events_import_nonce' ); ?>" />

			<p class="submit">
				<input type="submit" name="events-import" id="events-import" class="button button-primary" value="Import from Springshare">
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
	wp_enqueue_script( 'events', get_template_directory_uri() . '/assets/js/admin/events.js', 'jquery', '1.0', true );

}

/**
 * AJAX function for retrieving events from Springshare
 */
function retrieve_events() {
	check_ajax_referer( 'events_import_nonce', 'events_nonce' );

	if ( ! current_user_can( 'publish_posts' ) ) {
		wp_die( 'Error: invalid permissions' );
	}

	$events = process_events();

	$response = '<h3>Results</h3>';

	// @todo sort out actual error response here
	if ( $events == 'error' ) {
		$response .= '<p>Error</p>';
	} else {
		$response .= '<ul>';
		$response .= '<li><strong>Retrieved:</strong> ' . $events['retrieved'] . ' events</li>';
		$response .= '<li><strong>Imported:</strong> ' . $events['added'] . '</li>';
		$response .= '<li><strong>Updated:</strong> ' . $events['updated'] . '</li>';
		$response .= '</ul>';
	}

	wp_die( $response );
}

/**
 * Retrieve events, process them and return results
 *
 * @return array Data indicating success or failure of the import
 */
function process_events() {

	// this produceds a weird array within an array, so that's why we have $events->events later
	$events = \CCL\Integrations\LibCal\get_events( );

	$results               = array();
	$results['retrieved']  = count( $events->events );
	$results['added']      = 0;
	$results['updated']    = 0;

	// @todo check if this is a Events array or an error object

	// Events are stored as an indexed array under Event
	foreach ( $events->events as $event ) {
		$add_event = add_event( $event );

		if ( 'added' == $add_event ) {
			$results['added'] = $results['added'] + 1;
		} elseif ( 'updated' == $add_event ) {
			$results['updated'] = $results['updated'] + 1;
		} else {
			//
		}
	}

	return $results;
}

/**
 * Create or update event
 *
 * @param $event
 *
 * @return string added|updated
 */
function add_event( $event ) {

	// quick and dirty way to convert multi-dimensional object to array
	$event = json_decode( json_encode( $event ), true );

	// check against custom id field to see if post already exists
	$event_id = $event['id'];

	// meta query to check if the Gid already exists
	$duplicate_check = new \WP_Query( array(
		'post_type' => 'event',
		'meta_query' => array(
			array(
				'key' => 'event_id',
				'value' => $event_id
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

	$args['post_title']   = $event['title']; // post_title
	$args['post_content'] = $event['description']; // post_content
	// $args['post_status'] = 'draft'; // default is draft
	$args['post_type']    = 'event';

	if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		$args['post_status'] = 'publish'; // automatically publish posts on servers with debug enabled
	}

	/*
	 * Create the Event and grab post id (for post meta insertion)
	 */
	$post_id = wp_insert_post( $args );

	// Insert data into custom fields
	add_post_meta( $post_id, 'event_id', $event['id'], true);

	// Raw data for development
	add_post_meta( $post_id, 'event_raw_data', $event, true);

	// Event friendly URL
	add_post_meta( $post_id, 'event_url', $event['url']['public'], true);

	// @todo use this for subject?
	// Set category in XX taxonomy and create if it doesn't exist
	// $category = $event['category'];
	// wp_set_object_terms( $event_id, $category, 'XX' );
	// Add Subjects to custom taxonomy
	if ( array_key_exists( 'subjects', $event ) ) {
		$subjects_array = array();
		foreach ( $event['subjects'] as $subject ) {
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
function add_event_meta_box( $post ) {
	add_meta_box(
		'api_data_meta_box',
		__( 'Data from LibGuides' ),
		__NAMESPACE__ . '\\render_event_data_metabox',
		'event',
		'normal',
		'high'
	);
}

/**
 * Render the API data metabox
 */
function render_event_data_metabox() {
	global $post;

	$raw_data = get_post_meta( $post->ID, 'event_raw_data', true );

	$content = $post->post_content;

	echo '<p>';

	echo '<strong>Event ID:</strong> ' . get_post_meta( $post->ID, 'event_id', true ) . '<br>';

	echo '</p>';

	echo '<p>';
	
	echo '<strong>Event URL:</strong> ' . get_post_meta( $post->ID, 'event_url', true ) . '<br>';
	
	echo '</p>';

	if ( $content ) {
		echo '<h4>Content</h4>';
		echo apply_filters( 'the_content', $content );
	}

	// Raw Data
	echo '<hr>';

	echo '<strong>Raw Data</strong> (<span id="raw-data-toggle" style="color:#21759B;cursor:pointer">show</span>)';

	echo '<div id="raw-api-data" class="hidden">';

	echo '<div style="white-space:pre-wrap;font-family:monospace;">';
	print_r( $raw_data );
	echo '</pre>';

	echo '</div>';
}