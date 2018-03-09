<?php
/**
 * Metaboxes
 *
 * Metaboxes are segmented by concerns to make the codebase more manageable
 * Create a new file under the metaboxes directory when appropriate.
 */

require_once CCL_INC . 'metaboxes/general.php';
require_once CCL_INC . 'metaboxes/attachments.php';
require_once CCL_INC . 'metaboxes/blocks.php';
require_once CCL_INC . 'metaboxes/hero.php';
require_once CCL_INC . 'metaboxes/page.php';
require_once CCL_INC . 'metaboxes/staff.php';
require_once CCL_INC . 'metaboxes/libcalrooms.php';
require_once CCL_INC . 'metaboxes/featuredImage.php';

// Add General metabox first, so it always appears at top
CCL\MetaBoxes\General\setup();
CCL\MetaBoxes\Blocks\setup();
CCL\MetaBoxes\Page\setup();
CCL\MetaBoxes\Staff\setup();
CCL\MetaBoxes\Attachments\setup();
CCL\MetaBoxes\Hero\setup();
CCL\MetaBoxes\LibcalRooms\setup();
CCL\MetaBoxes\FeaturedImage\setup();

// Add other metaboxes here
