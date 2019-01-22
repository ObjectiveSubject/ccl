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
	
	add_settings_field(
		'footer_column_ux_feedback', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('User Experience Feedback Form', 'footer-content'),
		'\CCL\Footer\footer_column_3_cb',
		'footer-options',
		'footer-content'
	);
	
	add_settings_field(
		'footer_column_enable_chat_widget', // as of WP 4.6 this value is used only internally
		// use $args' label_for to populate the id inside the callback
		__('Select pages to display LibAnswers chat widget', 'footer-content'),
		'\CCL\Footer\enable_chat_widget',
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
	<pre><textarea id='footer-column-1' name='footer-options[footer-column-1]' rows='18' cols='80' type='textarea'><?php echo esc_textarea( $options['footer-column-1'] ); ?></textarea></pre>
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
	<pre><textarea id='footer-column-2' name='footer-options[footer-column-2]' rows='18' cols='80' type='textarea'><?php echo esc_textarea( $options['footer-column-2'] ); ?></textarea></pre>
	<?php
}

/**
 * Callback for footer column 3
 * 
 * Enable UX feedback form
 *
 * @param $args
 */
function footer_column_3_cb( $args ) {
	$options = get_option( 'footer-options' );
	?>
		<input id="footer-column-ux-feedback" type="checkbox" name="footer-options[footer-column-ux-feedback]" value="1"<?php checked( isset( $options['footer-column-ux-feedback'] ) ); ?> />
	
	<?php
}


function enable_chat_widget( $args ){
	
	$options = get_option( 'footer-options' );
	
	// echo '<pre>';
	// print_r( $options );
	// echo '</pre>';

	?>
	
	    <div id="footer_column_enable_chat_widget" style="height:400px; width:50%; overflow-y:scroll; background-color: white;" >
	    	<input id="database" type="checkbox" value="database" name="footer-options[footer_column_enable_chat_widget][]" <?php  echo ( is_array( $options['footer_column_enable_chat_widget'] ) && in_array( 'database' , $options['footer_column_enable_chat_widget']) ) ? 'checked' : ''; ?> >
	    	<label for="database">All database subpages</label>
	    	<br />
	    	
	        <?php
	        if( $pages = get_pages() ){
	        	
	            foreach( $pages as $page ){
	            	?>
	            	
	            	<input id="<?php echo $page->ID; ?>" type="checkbox"  name="footer-options[footer_column_enable_chat_widget][]" value="<?php echo $page->ID; ?>" <?php  echo  ( is_array( $options['footer_column_enable_chat_widget'] ) && in_array( $page->ID , $options['footer_column_enable_chat_widget']) ) ? 'checked' : ''; ?> > 
	            	<label for="<?php echo $page->ID; ?>"> <?php echo $page->post_title; ?></label>
	                <br />
	                <?php
	            }
	        }
	        ?>
	    </div>
	
	<?php
	
}
