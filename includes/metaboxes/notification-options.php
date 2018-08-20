<?php
namespace CCL\MetaBoxes\Notifications;

/**
 * Metaboxes on the options page for managing homepage header notifications
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	// NOTE: Uncomment to activate metabox
	 add_action( 'cmb2_admin_init',  $n( 'register_notification_options' ) );
}

/**
 * For more Info: https://github.com/CMB2/CMB2-Snippet-Library/blob/master/options-and-settings-pages/theme-options-cmb.php
 * 
 * Hook in and register a metabox to handle a theme options page and adds a menu item.
 *
 * @return void 
 */
function register_notification_options() {
	/**
	 * Registers options page menu item and form.
	 */
	$cmb_options = new_cmb2_box( array(
		'id'           => 'header_notices_metabox',
		'title'        => esc_html__( 'Homepage Notifications', 'cmb2' ),
		'object_types' => array( 'options-page' ),
		/*
		 * The following parameters are specific to the options-page box
		 * Several of these parameters are passed along to add_menu_page()/add_submenu_page().
		 */
		'option_key'      => 'header_notices', // The option key and admin menu page slug.
		'icon_url'        => 'dashicons-palmtree', // Menu icon. Only applicable if 'parent_slug' is left empty.
		// 'menu_title'      => esc_html__( 'Options', 'myprefix' ), // Falls back to 'title' (above).
		'parent_slug'     => 'options-general.php', // Make options page a submenu item of the themes menu.
		'capability'      => 'manage_options', // Cap required to view options-page.
		// 'position'        => 1, // Menu position. Only applicable if 'parent_slug' is left empty.
		// 'admin_menu_hook' => 'network_admin_menu', // 'network_admin_menu' to add network-level options page.
		// 'display_cb'      => false, // Override the options-page form output (CMB2_Hookup::options_page_output()).
		'save_button'     => esc_html__( 'Save Messages', 'cmb2' ), // The text for the options-page save button. Defaults to 'Save'.
	) );
	
	/*
	 * Options fields ids only need
	 * to be unique within this box.
	 * Prefix is not needed.
	 */
	 
	$notices_id = $cmb_options->add_field( array(
		'id'          => 'header_notices_items',
		'type'        => 'group',
		// 'description' => __( 'Generates reusable form entries', 'cmb2' ),
		// 'repeatable'  => false, // use false if you want non-repeatable group
		'options'     => array(
			'group_title'   => __( 'Header Notifications {#}', 'cmb2' ), // since version 1.1.4, {#} gets replaced by row number
			'add_button'    => __( 'Add Another Notice', 'cmb2' ),
			'remove_button' => __( 'Remove Notice', 'cmb2' ),
			'sortable'      => true, // beta
			'closed'     => false, // true to have the groups closed by default
		),
	) );
	
   $cmb_options->add_group_field( $notices_id, array(
    		'name'    => __( 'Enable Message', 'cmb2' ),
    		'desc'    => 'Check to start displaying message. Note: this message must be within date range.',
    		'id'      =>  'enable_message',
    		'type'    => 'checkbox',
    		'attributes' => array(
    		)
    	) );	
	 
    $cmb_options->add_group_field( $notices_id, array(
    		'name'    => __( 'Message', 'cmb2' ),
    		'desc'    => 'Notification Message for homepage',
    		'id'      =>  'notices_message',
    		'type'    => 'text_medium',
    		'attributes' => array(
    			'style' => 'width:100%'
    		)
    	) );
    
	$cmb_options->add_group_field( $notices_id, array(
		'name'    => __( 'Expiration', 'cmb2' ),
		'desc'    => 'Message will expire at midnight of the date selected',
		'id'      => 'notice_expiration',
		'type'    => 'text_date_timestamp',
    	'timezone_meta_key' => 'America/Los_Angeles',
        // 'date_format' => 'Y-m-d',    	
		'attributes' => array(
		)
	) );
}
/**
 * Wrapper function around cmb2_get_option
 * @since  0.1.0
 * @param  string $key     Options array key
 * @param  mixed  $default Optional default value
 * @return mixed           Option value
 */
function notices_get_options( $key = '', $default = false ) {
	if ( function_exists( 'cmb2_get_option' ) ) {
		// Use cmb2_get_option as it passes through some key filters.
		return cmb2_get_option( 'header_notices', $key, $default );
	}
	// Fallback to get_option if CMB2 is not loaded yet.
	$opts = get_option( 'header_notices', $default );
	$val = $default;
	if ( 'all' == $key ) {
		$val = $opts;
	} elseif ( is_array( $opts ) && array_key_exists( $key, $opts ) && false !== $opts[ $key ] ) {
		$val = $opts[ $key ];
	}
	return $val;
}
