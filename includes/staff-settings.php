<?php
namespace CCL\Staff\Settings;

/**
 * Setup actions and filters for staff settings page
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'admin_menu', $n( 'settings_page' ) );
	add_action( 'admin_init', $n( 'staff_settings_init' ) );

}

/**
 * Add a settings page for Staff
 */
function settings_page() {
	// add top level menu page
	add_submenu_page(
		'edit.php?post_type=staff',
		'Staff Settings',
		'Settings',
		'manage_options',
		'staff-settings',
		'\CCL\Staff\Settings\settings_page_html'
	);
}

/**
 * Staff settings page callback
 */
function settings_page_html() {
	// check user capabilities
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	// show error/update messages
	settings_errors( 'staff_messages' );
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

		<form action="options.php" method="post">
			<?php
			do_settings_sections( 'staff-settings' );
			settings_fields( 'staff-settings' );

			submit_button( 'Save Changes' );
			?>
		</form>

	</div>
	<?php
}

/**
 * Setup Staff options
 */
function staff_settings_init() {
	// register a new setting for "guides" page
	register_setting( 'staff-settings', 'staff-settings' );

	// register a new section in the "guide options" page
	add_settings_section(
		'general_settings',
		__('General Settings', 'staff-general-settings'),
		'', // no call back
		'staff-settings'
	);

	add_settings_field(
		'staff_statement_default', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('Default Statement', 'staff-general-settings'),
		'\CCL\Staff\Settings\staff_statement_default_cb',
		'staff-settings',
		'general_settings'
	);
}


/**
 * Call back for the default staff statment
 *
 * @param $args
 */
function staff_statement_default_cb( $args ) {
	$options = get_option( 'staff-settings' );
	?>
	<textarea id='staff-statement_default' name='staff-settings[staff-statement_default]' rows='4' cols='50' type='textarea'><?php echo esc_textarea( $options['staff-statement_default'] ); ?></textarea>
	<?php
}