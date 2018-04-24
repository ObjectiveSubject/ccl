<?php

/**
 * Functions and definitions
 */

// Useful global constants
define( 'CCL_VERSION',      '0.1.0' );
define( 'CCL_URL',          get_stylesheet_directory_uri() );
define( 'CCL_TEMPLATE_URL', get_template_directory_uri() );
//define( 'CCL_PATH',         get_template_directory() . '/' );
define( 'CCL_PATH',         dirname( __FILE__ ) . '/' );
define( 'CCL_INC',          CCL_PATH . 'includes/' );
define( 'CCL_ASSETS',       CCL_TEMPLATE_URL . '/assets/' );
if ( ! defined( 'DAY_IN_SECONDS' ) ) {
    define( 'DAY_IN_SECONDS', 24 * 60 * 60 );
}

// Include compartmentalized functions
require_once CCL_INC . 'core.php';

require_once CCL_INC . 'admin.php';
require_once CCL_INC . 'comments.php';
require_once CCL_INC . 'databases.php';
require_once CCL_INC . 'events.php';
require_once CCL_INC . 'faqs.php';
require_once CCL_INC . 'footer.php';
require_once CCL_INC . 'guides.php';
require_once CCL_INC . 'helpers.php';
require_once CCL_INC . 'metaboxes.php';
require_once CCL_INC . 'post-types.php';
require_once CCL_INC . 'rooms.php';
require_once CCL_INC . 'search.php';
require_once CCL_INC . 'shortcodes.php';
require_once CCL_INC . 'staff.php';
require_once CCL_INC . 'staff-settings.php';
require_once CCL_INC . 'staff-roles.php';
require_once CCL_INC . 'subjects.php';
require_once CCL_INC . 'taxonomies.php';
require_once CCL_INC . 'template-tags.php';
require_once CCL_INC . 'crons.php';

// Include integrations
require_once CCL_INC . 'integrations/libanswers.php';
require_once CCL_INC . 'integrations/libcal.php';
require_once CCL_INC . 'integrations/libguides.php';
require_once CCL_INC . 'integrations/libwizard.php';
require_once CCL_INC . 'integrations/settings.php';

// Include lib classes
include( CCL_INC . 'libraries/extended-cpts.php' );
include( CCL_INC . 'libraries/extended-taxos.php' );
include( CCL_INC . 'libraries/cmb2.addons.php' );
include( CCL_INC . 'libraries/cmb2/init.php' );
include( CCL_INC . 'libraries/cmb2-attached-posts/cmb2-attached-posts-field.php' );
include( CCL_INC . 'libraries/cmb2-post-search-field/cmb2_post_search_field.php' );

// Run the setup functions
CCL\Core\setup();
CCL\Admin\setup();
CCL\Comments\setup();
CCL\Databases\setup();
// CCL\Events\setup();
CCL\Faqs\setup();
CCL\Footer\setup();
CCL\Guides\setup();
CCL\Integrations\Settings\setup();
CCL\Rooms\setup();
CCL\Search\setup();
CCL\Shortcodes\setup();
CCL\Staff\setup();
CCL\Staff\Settings\setup();
CCL\StaffRoles\setup();
CCL\Subjects\setup();
CCL\PostTypes\setup();
CCL\Taxonomies\setup();
CCL\Crons\setup();