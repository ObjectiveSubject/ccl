<?php
namespace CCL\Staff;

/**
 * Setup actions and filters for staff
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'init', $n( 'register_staff_post_type' ) );

	add_action( 'admin_enqueue_scripts', $n( 'load_admin_script' ), 20 );

	add_action( 'admin_menu', $n( 'import_page' ) );

	add_action( 'wp_ajax_retrieve_staff', __NAMESPACE__ . '\\retrieve_staff' );
	// add_action( 'wp_ajax_nopriv_retrieve_staff', __NAMESPACE__ . '\\retrieve_staff' );

}

/**
 * Register the 'staff' post type using Extended CPTs
 *
 * This can be replaced with a standard post type instead of using a library if desired
 *
 * See https://github.com/johnbillion/extended-cpts for more information
 * on registering post types with the extended-cpts library.
 */
function register_staff_post_type() {

	register_extended_post_type( 'staff', array(
		'menu_icon' 		=> 'dashicons-id',
		'supports' 			=> array( 'title', 'editor', 'excerpt', 'thumbnail' ),
		'capability_type' => 'post',
		'capabilities' => array(
			'create_posts' => false, // Remove support for "Add New"
		),
		'map_meta_cap' => true, // Allows created posts to be edited
	),

		array(

			# Override the base names used for labels:
			'singular'  => 'Staff Member',
			'plural'    => 'Staff',
			'slug'      => 'staff'

		)
	);

}


/**
 * Add option page to the Staff menu
 */
function import_page() {
	// add top level menu page
	add_submenu_page(
		'edit.php?post_type=staff',
		'Staff Import',
		'Import',
		'publish_posts',
		'staff_import',
		'\CCL\Staff\import_page_html'
	);
}

/**
 * Staff import page callback
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

		<p>Use this tool to import and update staff from staff.</p>

		<?php // Currently imported stats, api query for recently updated? ?>

		<div id="staff-importer">
			<div id="staff-info" class="hidden">

				<div class="spinner is-active" style="float:none;width:auto;height:auto;padding:10px 0 10px 40px;background-position:0;">
					Importing staff members from Springshare&hellip;
				</div>

				<div id="staff-import-response" class="staff-response"></div>

			</div>

			<input type="hidden" name="staff-import-nonce" id="staff-import-nonce" value="<?php echo wp_create_nonce( 'staff_import_nonce' ); ?>" />

			<p class="submit">
				<input type="submit" name="staff-import" id="staff-import" class="button button-primary" value="Import from Springshare">
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
	wp_enqueue_script( 'staff', get_template_directory_uri() . '/assets/js/admin/staff.js', 'jquery', '1.0', true );

}

/**
 * AJAX function for retrieving staff from Springshare
 */
function retrieve_staff() {
	check_ajax_referer( 'staff_import_nonce', 'staff_nonce' );

	if ( ! current_user_can( 'publish_posts' ) ) {
		wp_die( 'Error: invalid permissions' );
	}

	$staff = process_staff();

	$response = '<h3>Results</h3>';

	// @todo sort out actual error response here
	if ( $staff == 'error' ) {
		$response .= '<p>Error</p>';
	} else {
		$response .= '<p>Success!</p>';
		$response .= '<ul>';
		$response .= '<li><strong>Retrieved:</strong> ' . $staff['retrieved'] . ' staff</li>';
		$response .= '<li><strong>Imported:</strong> ' . $staff['added'] . '</li>';
		$response .= '<li><strong>Duplicates:</strong> ' . $staff['duplicates'] . '</li>';
		$response .= '</ul>';
	}

	wp_die( $response );
}

/**
 * Retrieve staff members, process them and return results
 *
 * @return array Data indicating success or failure of the import
 */
function process_staff() {

	$members = \CCL\Integrations\Libguides\get_all_staff();

	$results               = array();
	$results['retrieved']  = count( $members );
	$results['added']      = 0;
	$results['duplicates'] = 0;

	foreach ( $members as $member ) {
		$add_member = add_staff_member( $member );

		if ( 'added' == $add_member ) {
			$results['added'] = $results['added'] + 1;
		} elseif ( 'duplicate' == $add_member ) {
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
function add_staff_member( $member ) {

	// quick and dirty way to convert multi-dimensional object to array
	$member = json_decode( json_encode( $member ), true );

	// check against custom id field to see if post already exists
	$member_id = $member['id'];

	// meta query to check if the member id already exists
	$duplicate_check = new \WP_Query( array(
		'post_type' => 'staff',
		'meta_query' => array(
			array(
				'key' => 'member_id',
				'value' => $member_id
			)
		),
	) );

	if ( ! $duplicate_check->have_posts() ) {
		/*
		 * Construct arguments to use for wp_insert_post()
		 */
		$args = array();

		$args['post_title']   = $member['first_name'] . " " . $member['last_name']; // post_title
		// $args['post_content'] = $member['description']; // post_content
		// $args['post_status'] = 'draft'; // default is draft
		$args['post_type']    = 'staff';

		/*
		 * Create the Staff Member
		 */
		$member_post_id = wp_insert_post( $args );

		// Insert Gid into post_meta after event is created
		//add_post_meta( $member_post_id, 'friendly_url', $member['friendly_url'], true); // custom field ->
		add_post_meta( $member_post_id, 'member_id', $member['id'], true); // custom field ->

		return "added";
	} else {
		return "duplicate";
	}
}