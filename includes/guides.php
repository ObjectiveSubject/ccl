<?php
namespace CCL\Guides;

/**
 * Setup actions and filters for guides
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'init', $n( 'register_guides_post_type' ) );

	add_action( 'admin_menu', $n( 'import_page' ) );

}

/**
 * Register the 'guide' post type using Extended CPTs
 *
 * This can be replaced with a standard post type instead of using a library if desired
 *
 * See https://github.com/johnbillion/extended-cpts for more information
 * on registering post types with the extended-cpts library.
 */
function register_guides_post_type() {

	register_extended_post_type( 'guide', array(
		'menu_icon' 		=> 'dashicons-book-alt',
		'supports' 			=> array( 'title', 'editor', 'excerpt', 'thumbnail' )
	) );

}


/**
 * Add option page to the Guides menu
 */
function import_page() {
	// add top level menu page
	add_submenu_page(
		'edit.php?post_type=guide',
		'Guide Import',
		'Import',
		'publish_posts',
		'import',
		'\CCL\Guides\import_page_html'
	);
}

/**
 * Guides import page callback
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

		<p>Use this tool to import and update guides from libguide.</p>

		<?php // Currently imported stats, api query for recently updated? ?>

		<div id="libguide-importer">
			<div id="libguide-info" class="hidden">

				<div class="spinner is-active" style="float:none;width:auto;height:auto;padding:10px 0 10px 40px;background-position:0;">
					Importing guides from Springshare&hellip;
				</div>

				<div id="libguide-import-response" class="libguide-response"></div>

			</div>

			<input type="hidden" name="libguide-import-nonce" id="libguide-import-nonce" value="<?php echo wp_create_nonce( 'libguide_import_nonce' ); ?>" />

			<p class="submit">
				<input type="submit" name="libguide-import" id="libguide-import" class="button button-primary" value="Import from Springshare">
			</p>

		</div>

	</div>
	<?php
}