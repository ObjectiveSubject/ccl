<?php
namespace CCL\Databases;

/**
 * Setup actions and filters for databases
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'init', $n( 'register_databases_post_type' ) );

	add_action( 'admin_enqueue_scripts', $n( 'load_admin_script' ), 20 );

	add_action( 'admin_menu', $n( 'import_page' ) );

	add_action( 'wp_ajax_retrieve_databases', __NAMESPACE__ . '\\retrieve_databases' );
	// add_action( 'wp_ajax_nopriv_retrieve_databases', __NAMESPACE__ . '\\retrieve_databases' );

	add_action( 'add_meta_boxes_database', $n('add_database_meta_box' ) );
}

/**
 * Register the 'database' post type using Extended CPTs
 *
 * This can be replaced with a standard post type instead of using a rary if desired
 *
 * See https://github.com/johnbillion/extended-cpts for more information
 * on registering post types with the extended-cpts rary.
 */
function register_databases_post_type() {

	register_extended_post_type( 'database', array(
		'menu_icon' 		=> 'dashicons-archive',
		'supports'        => array( 'title' ), // content, editor, thumbnail would allow content to be edited
		'capability_type' => 'post',
		'capabilities' => array(
			'create_posts' => false, // Remove support for "Add New" (can also change to a role, rather than false)
		),
		'map_meta_cap' => true, // Allows created posts to be edited
	) );

}


/**
 * Add option page to the Databases menu
 */
function import_page() {
	// add top level menu page
	add_submenu_page(
		'edit.php?post_type=database',
		'Database Import',
		'Import',
		'publish_posts',
		'databases_import',
		'\CCL\Databases\import_page_html'
	);
}

/**
 * Databases import page callback
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

		<p>Use this tool to import and update databases from database.</p>

		<?php // Currently imported stats, api query for recently updated? ?>

		<div id="databases-importer">
			<div id="databases-info" class="hidden">

				<div class="spinner is-active" style="float:none;width:auto;height:auto;padding:10px 0 10px 40px;background-position:0;">
					Importing databases from Springshare&hellip;
				</div>

				<div id="databases-import-response" class="databases-response"></div>

			</div>

			<input type="hidden" name="databases-import-nonce" id="databases-import-nonce" value="<?php echo wp_create_nonce( 'databases_import_nonce' ); ?>" />

			<p class="submit">
				<input type="submit" name="databases-import" id="databases-import" class="button button-primary" value="Import from Springshare">
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
	wp_enqueue_script( 'databases', get_template_directory_uri() . '/assets/js/admin/databases.js', 'jquery', '1.0', true );

}

/**
 * AJAX function for retrieving databases from Springshare
 */
function retrieve_databases() {
	check_ajax_referer( 'databases_import_nonce', 'databases_nonce' );

	if ( ! current_user_can( 'publish_posts' ) ) {
		wp_die( 'Error: invalid permissions' );
	}

	$databases = process_databases();

	$response = '<h3>Results</h3>';

	// @todo sort out actual error response here
	if ( $databases == 'error' ) {
		$response .= '<p>Error</p>';
	} else {
		$response .= '<ul>';
		$response .= '<li><strong>Retrieved:</strong> ' . $databases['retrieved'] . ' databases</li>';
		$response .= '<li><strong>Imported:</strong> ' . $databases['added'] . '</li>';
		$response .= '<li><strong>Updated:</strong> ' . $databases['updated'] . '</li>';
		$response .= '</ul>';
	}

	wp_die( $response );
}

/**
 * Retrieve databases, process them and return results
 *
 * @return array Data indicating success or failure of the import
 */
function process_databases() {

	$databases = \CCL\Integrations\LibGuides\get_all_databases();

	$results               = array();
	$results['retrieved']  = count( $databases );
	$results['added']      = 0;
	$results['updated']    = 0;

	// @todo check if this is a Databases array or an error object

	// Events are stored as an indexed array under Event
	foreach ( $databases as $database ) {
		$add_database = add_database( $database );

		if ( 'added' == $add_database ) {
			$results['added'] = $results['added'] + 1;
		} elseif ( 'updated' == $add_database ) {
			$results['updated'] = $results['updated'] + 1;
		} else {
			//
		}
	}

	return $results;
}

/**
 * Create or update database
 *
 * @param $database
 *
 * @return string added|updated
 */
function add_database( $database ) {

	// quick and dirty way to convert multi-dimensional object to array
	$database = json_decode( json_encode( $database ), true );

	// check against custom id field to see if post already exists
	$database_id = $database['id'];

	// meta query to check if the Gid already exists
	$duplicate_check = new \WP_Query( array(
		'post_type' => 'database',
		'meta_query' => array(
			array(
				'key' => 'database_id',
				'value' => $database_id
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

	$args['post_title']   = $database['name']; // post_title
	$args['post_content'] = $database['description']; // post_content
	// $args['post_status'] = 'draft'; // default is draft
	$args['post_type']    = 'database';

	/*
	 * Create the Database and grab post id (for post meta insertion)
	 */
	$post_id = wp_insert_post( $args );

	// Insert data into custom fields
	add_post_meta( $post_id, 'database_id', $database['id'], true);

	// Raw data for development
	add_post_meta( $post_id, 'database_raw_data', $database, true);

	// @todo use this for subject?
	// Set category in XX taxonomy and create if it doesn't exist
	// $category = $database['category'];
	// wp_set_object_terms( $database_id, $category, 'XX' );

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
function add_database_meta_box( $post ) {
	add_meta_box(
		'api_data_meta_box',
		__( 'Data from LibGuides' ),
		__NAMESPACE__ . '\\render_database_data_metabox',
		'database',
		'normal',
		'high'
	);
}

/**
 * Render the API data metabox
 */
function render_database_data_metabox() {
	global $post;

	$raw_data = get_post_meta( $post->ID, 'database_raw_data', true );

	$content = $post->post_content;

	echo '<p>';

	echo '<strong>Database ID:</strong> ' . get_post_meta( $post->ID, 'database_id', true ) . '<br>';

	echo '</p>';

	if ( $content ) {
		echo '<h4>Content</h4>';
		echo apply_filters( 'the_content', $content );
	}

	// Raw Data
	echo '<hr>';

	echo '<strong>Raw Data</strong> (<span id="raw-data-toggle" style="color:#21759B;cursor:pointer">show</span>)';

	echo '<div id="raw-api-data" class="hidden">';

	echo '<pre>';
	print_r( $raw_data );
	echo '</pre>';

	echo '</div>';
}