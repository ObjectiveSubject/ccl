<?php
namespace CCL\Integrations\LibGuides;

/**
 * Setup actions and filters for guides
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'admin_menu', $n( 'settings_page' ) );
	add_action( 'admin_init', $n( 'api_v1_1_settings_init' ) );
	add_action( 'admin_init', $n( 'api_v1_2_settings_init' ) );

}

/**
 * Retrieve LibGuides token from Springshare needed to access v1.2 API data
 *
 * LIBGUIDES_CLIENT_ID and LIBGUIDES_CLIENT_SECRET are defined as constants in wp-config. Will be converted to wp options at some point
 *
 * @return string|\WP_Error will return access code or an error message
 */
function get_token() {
	$token_request = wp_remote_post( 'https://lgapi-us.libapps.com/1.2/oauth/token', array(
		'header' => array(),
		'body'   => array(
			'client_id'     => LIBGUIDES_CLIENT_ID,
			'client_secret' => LIBGUIDES_CLIENT_SECRET,
			'grant_type' => 'client_credentials'
		)
	) );

	if ( is_wp_error ( $token_request ) ) {

		return $token_request->get_error_message();

	} else {
		// check for API errors??
		$results = json_decode( $token_request['body'] );

		// token is valid for an hour (3600 seconds), should probably store for like 30 mins in a transient

		return $results->access_token;
	}

}

/**
 * Retrieve all Databases
 *
 * @return array|string|\WP_Error
 */
function get_all_databases() {

	$token = get_token();

	$request = wp_remote_get( 'https://lgapi-us.libapps.com/1.2/az', array(
		'headers' => array(
			'Authorization' => 'Bearer '. $token
		),
		'body'   => array(),
		'debug'  => true
	) );

	if ( is_wp_error ( $request ) ) {

		return $request->get_error_message();

	} else {
		// check for API errors??

		$results = $request;

		return $results;
	}

}

/**
 * Retrieve all Guides
 *
 * LIBGUIDES_SITE_ID and LIBGUIDES_SITE_KEY are defined as constants in wp-config. Will be converted to wp options at some point
 *
 * @return array|string|\WP_Error
 */
function get_all_guides() {

	$params = array(
		'site_id'     => LIBGUIDES_SITE_ID,
		'key'         => LIBGUIDES_SITE_KEY,
		'status'      => 1, // only retrieve published guides
		'guide_types' => '1,2,3,4', // General Purpose, Course, Subject, Topic
		'expand'      => 'owner' // need to know who created the guide
	);

	$query_string = urldecode_deep( http_build_query( $params ) );

	$request = wp_remote_get( 'http://lgapi-us.libapps.com/1.1/guides/?' . $query_string ); // urldecode is necessary to prevent the comma from being encoded

	if ( is_wp_error( $request ) ) {

		return $request->get_error_message();

	} else {
		// check for API authentication errors??

		$results = json_decode( $request['body'] );

		return $results;
	}

}

/**
 * Retrieve all Staff members
 *
 * LIBGUIDES_SITE_ID and LIBGUIDES_SITE_KEY are defined as constants in wp-config. Will be converted to wp options at some point
 *
 * @return array|string|\WP_Error
 */
function get_all_staff() {

	$params = array(
		'site_id' => LIBGUIDES_SITE_ID,
		'key'     => LIBGUIDES_SITE_KEY,
		'expand'  => 'profile,subjects'
	);

	// $query_string = urldecode_deep( http_build_query( $params ) ); // urldecode is necessary to prevent the comma from being encoded

	$query_string = 'site_id=' . LIBGUIDES_SITE_ID . '&key=' . LIBGUIDES_SITE_KEY . '&expand[]=profile&expand[]=subjects';

	$request = wp_remote_get( 'http://lgapi-us.libapps.com/1.1/accounts/?' . $query_string );

	if ( is_wp_error( $request ) ) {

		return $request->get_error_message();

	} else {
		// check for API errors??

		$results = json_decode( $request['body'] );

		return $results;
	}

}


/**
 * Add an Settings option page for LibGuides
 */
function settings_page() {
	// add top level menu page
	add_submenu_page(
		'options-general.php',
		'LibGuide Settings',
		'LibGuides',
		'manage_options',
		'libguide-settings',
		'\CCL\Integrations\LibGuides\settings_page_html'
	);
}

/**
 * LibGuides settings page callback
 */
function settings_page_html() {
	// check user capabilities
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	// show error/update messages
	settings_errors( 'libguide_messages' );
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

		<form action="options.php" method="post">
			<?php
			do_settings_sections( 'libguide-settings' );
			settings_fields( 'libguide-settings' );

			submit_button( 'Save Changes' );
			?>
		</form>

	</div>
	<?php
}

/**
 * Setup API v1.1 options
 *
 * - Register the place to save (api-v1_1-settings)
 * - Add Sections
 * - Add fields to sections
 */
function api_v1_1_settings_init() {
	// register a new setting for "guides" page
	register_setting( 'libguide-settings', 'api-v1_1-settings' );

	// register a new section in the "guide options" page
	add_settings_section(
		'api_v1_1_settings',
		__('API v1.1 Settings', 'libguide-settings'),
		'', // no call back
		'libguide-settings'
	);

	add_settings_field(
		'libguide_field-site_id', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('Site ID', 'libguide-settings'),
		'\CCL\Integrations\LibGuides\v1_1_site_id_cb',
		'libguide-settings',
		'api_v1_1_settings'
	);

	add_settings_field(
		'libguide_field-site_key', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('Site Key', 'libguide-settings'),
		'\CCL\Integrations\LibGuides\v1_1_site_key_cb',
		'libguide-settings',
		'api_v1_1_settings'
	);
}

/**
 * Setup API v1.2 options
 *
 * - Register the place to save (api-v1_2-settings)
 * - Add Sections
 * - Add fields to sections
 */
function api_v1_2_settings_init() {
	// register a new setting for "guides" page
	register_setting( 'libguide-settings', 'api-v1_2-settings' );

	// register a new section in the "guide options" page
	add_settings_section(
		'api_v1_2_settings',
		__('API v1.2 Settings', 'libguide-settings'),
		'', // no call back
		'libguide-settings'
	);

	add_settings_field(
		'libguide_field-client_id', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('Client ID', 'libguide-settings'),
		'\CCL\Integrations\LibGuides\v1_2_client_id_cb',
		'libguide-settings',
		'api_v1_2_settings'
	);

	add_settings_field(
		'libguide_field-client_secret', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('Client Secret', 'libguide-settings'),
		'\CCL\Integrations\LibGuides\v1_2_client_secret_cb',
		'libguide-settings',
		'api_v1_2_settings'
	);
}

/**
 * Call back for the Site ID field
 *
 * @param $args
 */
function v1_1_site_id_cb( $args ) {
	$options = get_option( 'api-v1_1-settings' );
	?>
	<input id='libguide_field-site_id' name='api-v1_1-settings[site_id]' size='30' type='text' value='<?php echo $options['site_id']; ?>' />
	<?php
}

/**
 * Callback for the Site Key field
 * @param $args
 */
function v1_1_site_key_cb( $args ) {
	$options = get_option( 'api-v1_1-settings' );
	?>
	<input id='libguide_field-site_key' name='api-v1_1-settings[site_key]' size='60' type='text' value='<?php echo $options['site_key']; ?>' />
	<?php
}

/**
 * Call back for the Client ID field
 *
 * @param $args
 */
function v1_2_client_id_cb( $args ) {
	$options = get_option( 'api-v1_2-settings' );
	?>
	<input id='libguide_field-client_id' name='api-v1_2-settings[client_id]' size='30' type='text' value='<?php echo $options['client_id']; ?>' />
	<?php
}

/**
 * Callback for the Client Secret field
 *
 * @param $args
 */
function v1_2_client_secret_cb( $args ) {
	$options = get_option( 'api-v1_2-settings' );
	?>
	<input id='libguide_field-client_secret' name='api-v1_2-settings[client_secret]' size='60' type='text' value='<?php echo $options['client_secret']; ?>' />
	<?php
}