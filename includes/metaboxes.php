<?php
/**
 * Metaboxes
 *
 * Metaboxes are segmented by concerns to make the codebase more manageable
 * Create a new file under the metaboxes directory when appropriate.
 */

require_once CCL_INC . 'metaboxes/general.php';

// Add General metabox first, so it always appears at top
CCL\MetaBoxes\General\setup();

// Add other metaboxes here
