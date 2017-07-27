<?php
namespace CCL\Integrations\Settings;

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
	add_action( 'admin_init', $n( 'libguide_api_v1_1_settings_init' ) );
	add_action( 'admin_init', $n( 'libguide_api_v1_2_settings_init' ) );
	add_action( 'admin_init', $n( 'libcal_api_v1_1_settings_init' ) );

}

/**
 * Add an Settings option page for Integrations
 */
function settings_page() {
	// add top level menu page
	add_submenu_page(
		'options-general.php',
		'Integrations Settings',
		'Integrations',
		'manage_options',
		'integrations-settings',
		'\CCL\Integrations\Settings\settings_page_html'
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
	settings_errors( 'integrations_messages' );
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

		<form action="options.php" method="post">
			<?php
			do_settings_sections( 'integrations-settings' );
			settings_fields( 'integrations-settings' );

			submit_button( 'Save Changes' );
			?>
		</form>

	</div>
	<?php
}

/**
 * Setup LibGuides API v1.1 options
 *
 * - Register the place to save (libguides-api-v1_1-settings)
 * - Add Sections
 * - Add fields to sections
 */
function libguide_api_v1_1_settings_init() {
	// register a new setting for "guides" page
	register_setting( 'integrations-settings', 'libguides-api-v1_1-settings' );

	// register a new section in the "guide options" page
	add_settings_section(
		'libguide_api_v1_1_settings',
		__('LibGuides API v1.1 Settings', 'integrations-settings'),
		'', // no call back
		'integrations-settings'
	);

	add_settings_field(
		'libguide_field-site_id', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('Site ID', 'integrations-settings'),
		'\CCL\Integrations\Settings\libguide_v1_1_site_id_cb',
		'integrations-settings',
		'libguide_api_v1_1_settings'
	);

	add_settings_field(
		'libguide_field-site_key', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('Site Key', 'integrations-settings'),
		'\CCL\Integrations\Settings\libguide_v1_1_site_key_cb',
		'integrations-settings',
		'libguide_api_v1_1_settings'
	);
}

/**
 * Setup LibGuides API v1.2 options
 *
 * - Register the place to save (libguides-api-v1_2-settings)
 * - Add Sections
 * - Add fields to sections
 */
function libguide_api_v1_2_settings_init() {
	// register a new setting for "guides" page
	register_setting( 'integrations-settings', 'libguides-api-v1_2-settings' );

	// register a new section in the "guide options" page
	add_settings_section(
		'libguide_api_v1_2_settings',
		__('LibGuides API v1.2 Settings', 'integrations-settings'),
		'', // no call back
		'integrations-settings'
	);

	add_settings_field(
		'libguide_field-client_id', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('Client ID', 'integrations-settings'),
		'\CCL\Integrations\Settings\libguide_v1_2_client_id_cb',
		'integrations-settings',
		'libguide_api_v1_2_settings'
	);

	add_settings_field(
		'libguide_field-client_secret', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('Client Secret', 'integrations-settings'),
		'\CCL\Integrations\Settings\libguide_v1_2_client_secret_cb',
		'integrations-settings',
		'libguide_api_v1_2_settings'
	);
}

/**
 * Setup LibCal API v1.1 options
 *
 * - Register the place to save (libcal-api-v1_1-settings)
 * - Add Sections
 * - Add fields to sections
 */
function libcal_api_v1_1_settings_init() {
	// register a new setting for "guides" page
	register_setting( 'integrations-settings', 'libcal-api-v1_1-settings' );

	// register a new section in the "guide options" page
	add_settings_section(
		'libcal_api_v1_1_settings',
		__('LibCal API v1.1 Settings', 'integrations-settings'),
		'', // no call back
		'integrations-settings'
	);

	add_settings_field(
		'libcal_field-client_id', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('Client ID', 'integrations-settings'),
		'\CCL\Integrations\Settings\libcal_v1_1_client_id_cb',
		'integrations-settings',
		'libcal_api_v1_1_settings'
	);

	add_settings_field(
		'libcal_field-client_secret', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('Client Secret', 'integrations-settings'),
		'\CCL\Integrations\Settings\libcal_v1_1_client_secret_cb',
		'integrations-settings',
		'libcal_api_v1_1_settings'
	);
}

/**
 * Call back for the LibGuides Site ID field
 *
 * @param $args
 */
function libguide_v1_1_site_id_cb( $args ) {
	$options = get_option( 'libguides-api-v1_1-settings' );
	?>
	<input id='libguide_field-site_id' name='libguides-api-v1_1-settings[site_id]' size='30' type='text' value='<?php echo $options['site_id']; ?>' />
	<?php
}

/**
 * Callback for the LibGuides Site Key field
 * @param $args
 */
function libguide_v1_1_site_key_cb( $args ) {
	$options = get_option( 'libguides-api-v1_1-settings' );
	?>
	<input id='libguide_field-site_key' name='libguides-api-v1_1-settings[site_key]' size='60' type='text' value='<?php echo $options['site_key']; ?>' />
	<?php
}

/**
 * Call back for the LibGuides Client ID field
 *
 * @param $args
 */
function libguide_v1_2_client_id_cb( $args ) {
	$options = get_option( 'libguides-api-v1_2-settings' );
	?>
	<input id='libguide_field-client_id' name='libguides-api-v1_2-settings[client_id]' size='30' type='text' value='<?php echo $options['client_id']; ?>' />
	<?php
}

/**
 * Callback for the LibGuides Client Secret field
 *
 * @param $args
 */
function libguide_v1_2_client_secret_cb( $args ) {
	$options = get_option( 'libguides-api-v1_2-settings' );
	?>
	<input id='libguide_field-client_secret' name='libguides-api-v1_2-settings[client_secret]' size='60' type='text' value='<?php echo $options['client_secret']; ?>' />
	<?php
}

/**
 * Call back for the LibCal Client ID field
 *
 * @param $args
 */
function libcal_v1_1_client_id_cb( $args ) {
	$options = get_option( 'libcal-api-v1_1-settings' );
	?>
	<input id='libcal_field-client_id' name='libcal-api-v1_1-settings[client_id]' size='30' type='text' value='<?php echo $options['client_id']; ?>' />
	<?php
}

/**
 * Callback for the LibCal Client Secret field
 *
 * @param $args
 */
function libcal_v1_1_client_secret_cb( $args ) {
	$options = get_option( 'libcal-api-v1_1-settings' );
	?>
	<input id='libcal_field-client_secret' name='libcal-api-v1_1-settings[client_secret]' size='60' type='text' value='<?php echo $options['client_secret']; ?>' />
	<?php
}