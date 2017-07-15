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

	add_action( 'wp_ajax_retrieve_guides', __NAMESPACE__ . '\\retrieve_guides' );
	// add_action( 'wp_ajax_nopriv_retrieve_guides', __NAMESPACE__ . '\\retrieve_guides' );

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
		'menu_icon' 		=> 'dashicons-book-alt',
		'supports' 			=> array( 'title', 'editor', 'excerpt', 'thumbnail' )
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
		$response .= '<p>Success!</p>';
		$response .= '<ul>';
		$response .= '<li><strong>Retrieved:</strong> ' . $guides['retrieved'] . ' guides</li>';
		$response .= '<li><strong>Imported:</strong> ' . $guides['added'] . '</li>';
		$response .= '<li><strong>Duplicates:</strong> ' . $guides['duplicates'] . '</li>';
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
	$results['duplicates'] = 0;

	// Events are stored as an indexed array under Event
	foreach ( $guides as $guide ) {
		$add_guide = add_guide( $guide );

		if ( 'added' == $add_guide ) {
			$results['added'] = $results['added'] + 1;
		} elseif ( 'duplicate' == $add_guide ) {
			$results['duplicates'] = $results['duplicates'] + 1;
		} else {
			//
		}
	}

	return $results;
}

/**
 *
 */
function add_guide( $guide ) {

	// quick and dirty way to convert multi-dimensional object to array
	$guide = json_decode( json_encode( $guide ), true );

	// check against custom id field to see if post already exists
	$libguide_id = $guide['id'];

	// meta query to check if the Gid already exists
	$duplicate_check = new \WP_Query( array(
		'post_type' => 'guide',
		'meta_query' => array(
			array(
				'key' => 'libguide_id',
				'value' => $libguide_id
			)
		),
	) );

	if ( ! $duplicate_check->have_posts() ) {
		/*
		 * Construct arguments to use for wp_insert_post()
		 */
		$args = array();

		$args['post_title']   = $guide['name']; // post_title
		$args['post_content'] = $guide['description']; // post_content
		// $args['post_status'] = 'draft'; // default is draft
		$args['post_type']    = 'guide';

		/*
		 * Process dates and times
		 * Date format (string) "13 Dec 2016 06:30 PM PT"
		 */

		// Prepare event start date and time

		/*
		 * Create the Guide
		 */
		$guide_id = wp_insert_post( $args );

		// Insert Gid into post_meta after event is created
		add_post_meta( $guide_id, 'friendly_url', $guide['friendly_url'], true); // custom field -> tribe_event_gid (generate RSVP link), also EventWebsite?
		add_post_meta( $guide_id, 'owner_id', $guide['owner_id'], true); // custom field -> tribe_event_gid (generate RSVP link), also EventWebsite?

		// Set category in XX taxonomy and create if it doesn't exist
		// $category = $guide['category'];
		// wp_set_object_terms( $guide_id, $category, 'XX' );

		return "added";
	} else {
		return "duplicate";
	}
}