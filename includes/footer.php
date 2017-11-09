<?php
namespace CCL\Footer;

/**
 * The content areas for the footer could be created any number of ways (customizer, template, repeating fields,
 * specific fields, etc. For now, we'll have two large column content areas that allow for the [icon] shortcode
 * and <hr> tags as dividers.
 */


/**
 * Setup actions and filters for footer settings page
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'admin_menu', $n( 'settings_page' ) );
	add_action( 'admin_init', $n( 'footer_settings_init' ) );

}

/**
 * Add a settings page for Footer
 */
function settings_page() {
	// add top level menu page
	add_submenu_page(
		'options-general.php',
		'Footer Options',
		'Footer',
		'manage_options',
		'footer-options',
		'\CCL\Footer\settings_page_html'
	);
}

/**
 * Footer settings page callback
 */
function settings_page_html() {
	// check user capabilities
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}

	// show error/update messages
	settings_errors( 'footer_messages' );
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>

		<form action="options.php" method="post">
			<?php
			do_settings_sections( 'footer-options' );
			settings_fields( 'footer-options' );

			submit_button( 'Save Changes' );
			?>
		</form>

	</div>
	<?php
}

/**
 * Setup Footer options
 */
function footer_settings_init() {

	register_setting( 'footer-options', 'footer-options' );

	// register a new section in the "guide options" page
	add_settings_section(
		'footer-content',
		__('Footer Content', 'footer-content'),
		'\CCL\Footer\footer_content_cb', // no call back
		'footer-options'
	);

	add_settings_field(
		'footer_column_1', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('Column 1', 'footer-content'),
		'\CCL\Footer\footer_column_1_cb',
		'footer-options',
		'footer-content'
	);

	add_settings_field(
		'footer_column_2', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('Column 2', 'footer-content'),
		'\CCL\Footer\footer_column_2_cb',
		'footer-options',
		'footer-content'
	);
}

/**
 * Call back for footer column 1
 *
 * @param $args
 */
function footer_content_cb( $args ) {
	$options = get_option( 'footer-options' );
	?>
	<p>Add html to the footer columns, supports the <code>[icon]</code> shortcode and <code>&lt;hr&gt;</code> tags</p>
	<?php
}

/**
 * Call back for footer column 1
 *
 * @param $args
 */
function footer_column_1_cb( $args ) {
	$options = get_option( 'footer-options' );
	?>
	<textarea id='footer-column-1' name='footer-options[footer-column-1]' rows='18' cols='40' type='textarea'><?php echo esc_textarea( $options['footer-column-1'] ); ?></textarea>
	<?php
}

/**
 * Callback for footer column 2
 *
 * @param $args
 */
function footer_column_2_cb( $args ) {
	$options = get_option( 'footer-options' );
	?>
	<textarea id='footer-column-2' name='footer-options[footer-column-2]' rows='18' cols='40' type='textarea'><?php echo esc_textarea( $options['footer-column-2'] ); ?></textarea>
	<?php
}