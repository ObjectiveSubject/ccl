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
	
	add_action( 'init', $n( 'register_format_taxonomy' ) );

	add_action( 'init', $n( 'register_trial_taxonomy' ) );	
	
	add_action( 'init', $n( 'register_vendor_taxonomy' ) );

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
			'create_posts' => 'do_not_allow', // Remove support for "Add New" (can also change to a role, rather than false)
		),
		'public'				=> false,
		'exclude_from_search'	=> false,
		'publicly_queryable'	=> true,
		'show_ui'				=> true,
		'map_meta_cap' => true, // Allows created posts to be edited
		'admin_cols'	=> array(
			'subjects' => array(
				'taxonomy' => 'subject'
			),
			'format'	=> array(
				'title'		=> 'Format/Type',
				'taxonomy'	=> 'format'
			),
			'is_trial'	=> array(
				'title'		=> 'Database Trial',
				'taxonomy'	=> 'trial'
			),
			'db_vendor'	=> array(
				'title'		=> 'Database Vendor',
				'taxonomy'	=> 'database_vendor'
			),			
			'best_bets'	=> array(
				'title'		=> 'Best Bets',
				'function'	=> function(){
					global $post;
					$best_bets	= get_post_meta( $post->ID, 'database_best_bets', true );
					
					if( $best_bets ){
						//turn best bets into string
						$best_bets = implode( ', ', $best_bets );
						echo $best_bets;
					}					
					
				}
			)
		)
	) );

}


/**
 * 
 * Add custom taxonomy for format and type, using extended post taxonomies
 * 
 */
 function register_format_taxonomy(){
 	
 	register_extended_taxonomy(
		'format', // taxonomy name
		array(
			// post types
			'database'
		),
		array(
			// parameters
			'meta_box' => 'simple',
		)

	);	
 }
 
 /**
 * 
 * Add custom taxonomy for format and type, using extended post taxonomies
 * 
 */
 function register_trial_taxonomy(){
 	
 	register_extended_taxonomy(
		'trial', // taxonomy name
		array(
			// post types
			'database'
		),
		array(
			// parameters
			'meta_box' => 'radio',
		)

	);	
 }
 
  /**
 * 
 * Add custom taxonomy for format and type, using extended post taxonomies
 * 
 */
 function register_vendor_taxonomy(){
 	
 	register_extended_taxonomy(
		'database_vendor', // taxonomy name
		array(
			// post types
			'database'
		),
		array(
			// parameters
			'meta_box'		=> 'radio',
			'show_ui'		=> false,
		)

	);	
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
		
		//time_nanosleep(0, 100000000);

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
	$args['post_status'] = 'publish'; // default is draft
	$args['post_type']    = 'database';

	if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		$args['post_status'] = 'publish'; // automatically publish posts on servers with debug enabled
	}

	/*
	 * Create the Database and grab post id (for post meta insertion)
	 */
	$post_id = wp_insert_post( $args );

	// Insert data into custom fields
	update_post_meta( $post_id, 'database_id', $database['id'] );

	// Raw data for development
	update_post_meta( $post_id, 'database_raw_data', $database );


	//check if friendly URL exist, if not then replace with ugly url
	$database_url_check = !empty( $database['friendly_url'] ) ? $database['friendly_url'] : $database['url'];
	
	// Database friendly URL
	update_post_meta( $post_id, 'database_friendly_url', $database_url_check );
	
	//add the vendor taxonomy
	wp_set_object_terms( $post_id, $database['az_vendor_name'], 'database_vendor' );	

	// @todo use this for subject?
	// Set category in XX taxonomy and create if it doesn't exist
	// $category = $database['category'];
	// wp_set_object_terms( $database_id, $category, 'XX' );
	// Add Subjects to custom taxonomy
	if ( array_key_exists( 'subjects', $database ) ) {
		//setup empty arrays for data
		$subjects_array 	= array();
		$best_bet_subjects	= array();
		foreach ( $database['subjects'] as $subject ) {
			
			//add this subject to the list of subjects related to this database
			$subjects_array[] = $subject['name'];
			
			//if subject has 'featured' enabled, then add the Subject name to the list of best bets
			if( $subject['featured'] == 1 ){
				$best_bet_subjects[] = $subject['name'];
			}
		}
		// Add subject name to subject taxonomy
		wp_set_object_terms( $post_id, $subjects_array, 'subject' );
		
		//add best bet custom field from array of databases
		update_post_meta( $post_id, 'database_best_bets', $best_bet_subjects );
	}
	
	//set Format types and set taxonomy to the format, create if it doesn't exist
	//create an array and then add them all at same time
	if ( array_key_exists( 'az_types', $database ) ) {
		$format_array = array();
		foreach ( $database['az_types'] as $format ) {
			$format_array[] = $format['name'];
		}
		// Add subject name to subject taxonomy
		wp_set_object_terms( $post_id, $format_array, 'format' );
	}
	
	//if the database trial exists as 1 (or boolean) then add this to the trial taxonomy
	//has_term( $term, $taxonomy, $post )
	//wp_remove_object_terms( $id, $terms, $taxonomy )
	if ( array_key_exists( 'enable_trial', $database ) ) {
		if( $database['enable_trial'] == 1 ){
			wp_set_object_terms( $post_id, 'trial', 'trial' );			
		}
		
	}
	
	//check if an alt_name exists
	if( !empty( $database['alt_names'] ) ){
		update_post_meta( $post_id, 'db_alt_names', $database['alt_names']  );
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

	$raw_data	= get_post_meta( $post->ID, 'database_raw_data', true );
	$best_bets	= get_post_meta( $post->ID, 'database_best_bets', true );
	$alt_names	= get_post_meta( $post->ID, 'db_alt_names', true );
	
	if( $best_bets ){
		//turn best bets into string
		$best_bets = implode( ', ', $best_bets );
	}
	
	$content = $post->post_content;

	echo '<p>';

	echo '<strong>Database ID:</strong> ' . get_post_meta( $post->ID, 'database_id', true ) . '<br>';

	echo '</p>';

	echo '<p>';
	
		echo '<strong>Database URL:</strong> ' . get_post_meta( $post->ID, 'database_friendly_url', true ) . '<br>';
	
	echo '</p>';
	
	
	//echo alternate names if any
	if( $alt_names ){
		echo '<p>';
	
			echo '<strong>Database Alternate Names:</strong> ' . $alt_names . '<br>';
	
		echo '</p>';
	}
	
	//echo best bets if any
	if( $best_bets ){
		echo '<p>';
	
			echo '<strong>Database Best Bets:</strong> ' . $best_bets . '<br>';
	
		echo '</p>';
	}
	

	if ( $content ) {
		echo '<strong>Content:</strong><br>';
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