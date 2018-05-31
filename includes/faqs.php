<?php
namespace CCL\Faqs;

/**
 * Setup actions and filters for faqs
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'init', $n( 'register_faqs_post_type' ) );

	add_action( 'admin_enqueue_scripts', $n( 'load_admin_script' ), 20 );

	add_action( 'admin_menu', $n( 'import_page' ) );

	add_action( 'wp_ajax_retrieve_faqs', __NAMESPACE__ . '\\retrieve_faqs' ); // not sure why $n wrapper doesn't work here

	add_action( 'add_meta_boxes_faq', $n('add_faq_meta_box' ) );
}

/**
 * Register the 'faq' post type using Extended CPTs
 *
 * This can be replaced with a standard post type instead of using a library if desired
 *
 * See https://github.com/johnbillion/extended-cpts for more information
 * on registering post types with the extended-cpts library.
 */
function register_faqs_post_type() {

	register_extended_post_type( 'faq', array(
		'menu_icon'       => 'dashicons-testimonial',
		'supports'        => false, // title, content, editor, thumbnail would allow content to be edited
		'capability_type' => 'post',
		'capabilities'    => array(
			'create_posts' => 'do_not_allow', // Remove support for "Add New" (can also change to a role, rather than false)
		),
		'map_meta_cap'    => true, // Allows created posts to be edited
		'public'				=> false,
		'exclude_from_search'	=> false,
		'publicly_queryable'	=> true,
		'show_ui'				=> true,		
	),

		array(

			# Override the base names used for labels:
			'singular'  => 'Question',
			'plural'    => 'FAQs',
			'slug'      => 'faq'

		)
	);

}


/**
 * Add option page to the Faqs menu
 */
function import_page() {
	// add top level menu page
	add_submenu_page(
		'edit.php?post_type=faq',
		'FAQ Import',
		'Import',
		'publish_posts',
		'import',
		'\CCL\Faqs\import_page_html'
	);
}

/**
 * Faqs import page callback
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

		<p>Use this tool to import and update faqs from LibAnswers.</p>

		<?php // Currently imported stats, api query for recently updated? ?>

		<div id="faqs-importer">
			<div id="faqs-info" class="hidden">

				<div class="spinner is-active" style="float:none;width:auto;height:auto;padding:10px 0 10px 40px;background-position:0;">
					Importing faqs from Springshare&hellip;
				</div>

				<div id="faqs-import-response" class="faqs-response"></div>

			</div>

			<input type="hidden" name="faqs-import-nonce" id="faqs-import-nonce" value="<?php echo wp_create_nonce( 'faqs_import_nonce' ); ?>" />

			<p class="submit">
				<input type="submit" name="faqs-import" id="faqs-import" class="button button-primary" value="Import from Springshare">
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
	wp_enqueue_script( 'faqs', get_template_directory_uri() . '/assets/js/admin/faqs.js', 'jquery', '1.0', true );

}

/**
 * AJAX function for retrieving faqs from Springshare
 */
function retrieve_faqs() {
	check_ajax_referer( 'faqs_import_nonce', 'faqs_nonce' );

	if ( ! current_user_can( 'publish_posts' ) ) {
		wp_die( 'Error: invalid permissions' );
	}

	$faqs = process_faqs();

	$response = '<h3>Results</h3>';

	// @todo sort out actual error response here
	if ( $faqs == 'error' ) {
		$response .= '<p>Error</p>';
	} else {
		$response .= '<ul>';
		$response .= '<li><strong>Imported:</strong> ' . $faqs['added'] . '</li>';
		$response .= '<li><strong>Updated:</strong> ' . $faqs['updated'] . '</li>';
		$response .= '<li><strong>Deleted:</strong> ' . $faqs['deleted'] . '</li>';		
		$response .= '</ul>';
	}
	
	echo "<script>
			if(console.debug!='undefined'){
				console.log( " . json_encode($faqs) . ");
			}</script>" ;

	wp_die( $response );
}

/**
 * Retrieve faqs, process them and return results
 *
 * @return array Data indicating success or failure of the import
 */
function process_faqs() {

	//convert json object into an array
	$faqs = json_decode( json_encode( \CCL\Integrations\LibAnswers\get_all_faqs() ), true );
	//$faqs = \CCL\Integrations\LibAnswers\get_all_faqs();
	
	//compare two data fields and delete entries that are no longer in the API.
	//not - insert array for API data, however this functio will convert to array
	$deleted_from_WP = \CCL\Helpers\check_import_for_deletions( $meta_key = 'faq_id', $post_type = 'faq', $api_data = $faqs ); 

	$results            	= array();
	// $results['retrieved']  = count( $faqs );
	$results['added']   	= 0;
	$results['updated'] 	= 0;
	$results['deleted']		= $deleted_from_WP;
	$results['raw']			=  $faqs;
	$results['ids']			= array_column( $faqs, 'faqid' );

	//return $results; //this is for testing
	// @todo check if this is a Faqs array or an error object

	// Events are stored as an indexed array under Event
	foreach ( $faqs as $faq_group ) {
		//foreach ( $faq_group as $faq ) {
			// error_log( var_dump( $faq ) );

			$add_faq = add_faq( $faq_group );

			if ( 'added' == $add_faq ) {
				$results['added'] = $results['added'] + 1;
			} elseif ( 'updated' == $add_faq ) {
				$results['updated'] = $results['updated'] + 1;
			} else {
				//
			}
		//}
	}

	return $results;
}

/**
 * Create or update faq
 *
 * @param $faq
 *
 * @return string added|updated
 */
function add_faq( $faq ) {

	// quick and dirty way to convert multi-dimensional object to array
	//$faq = json_decode( json_encode( $faq ), true );

	// check against custom id field to see if post already exists
	$libanswer_id = $faq['faqid'];

	// meta query to check if the faq already exists
	$duplicate_check = new \WP_Query( array(
		'post_type' => 'faq',
		'meta_query' => array(
			array(
				'key' => 'faq_id',
				'value' => $libanswer_id
			)
		),
	) );

	/*
	 * Construct arguments to use for wp_insert_post()
	 */
	$args = array();
	$post_updated = false;
	
	if ( $duplicate_check->have_posts() ) {

		$duplicate_check->the_post();
		$args['ID'] = get_the_ID(); // existing post ID (otherwise will insert new)
		
		//dont know why but it's easier to update this post with true
		$post_updated = true;

	}

	$args['post_title']   = $faq['question']; // post_title
	$args['post_content'] = $faq['answer']; // post_content
	$args['post_status'] = 'publish'; // default is draft
	$args['post_type']    = 'faq';

	if ( defined( 'WP_DEBUG' ) && WP_DEBUG ) {
		$args['post_status'] = 'publish'; // automatically publish posts on servers with debug enabled
	}

	/*
	 * Create/update the Faq and grab post id (for post meta insertion)
	 */
	$post_id = wp_insert_post( $args );

	// Insert data into custom fields
	update_post_meta( $post_id, 'faq_id', $faq['faqid'] );
	update_post_meta( $post_id, 'faq_friendly_url', $faq['url']['public'] );
	update_post_meta( $post_id, 'faq_owner_id', $faq['owner']['id'] );

	// Raw data for development
	update_post_meta( $post_id, 'faq_raw_data', $faq );

	if ( $post_updated ) {
		return "updated";
	} else {
		return "added";
	}
}

/**
 * Create a metabox to display data retrieved from the API
 *
 * @param $post
 */
function add_faq_meta_box( $post ) {
	add_meta_box(
		'api_data_meta_box',
		__( 'Data from LibAnswers' ),
		__NAMESPACE__ . '\\render_faq_data_metabox',
		'faq',
		'normal',
		'high'
	);
}

/**
 * Render the API data metabox
 */
function render_faq_data_metabox() {
	global $post;

	$friendly_url = get_post_meta( $post->ID, 'faq_friendly_url', true );
	$owner_id = get_post_meta( $post->ID, 'faq_owner_id', true );
	$raw_data = get_post_meta( $post->ID, 'faq_raw_data', true );

	$content = $post->post_content;

	echo '<h4><a href="' . get_the_permalink( $post->ID ) . '" target="_blank">' . get_the_title( $post->ID ) . '</a></h4>';

	echo '<p>';

	echo '<strong>Faq ID:</strong> ' . get_post_meta( $post->ID, 'faq_id', true ) . '<br>';

	if ( $friendly_url ) {
		echo '<strong>Friendly URL:</strong> <a href="' . $friendly_url . '" target="_blank">' . $friendly_url . '</a><br>';
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
		echo '<strong>Owner:</strong> <a href="' . get_the_permalink() . '">' . get_the_title() . '</a> (owner id: ' . $owner_id . ')<br>';
	} else {
		echo '<strong>Owner ID:</strong> ' . get_post_meta( $post->ID, 'faq_owner_id', true ) . ' (no local staff member found)<br>'; // replace with link to Librarian if they exist

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