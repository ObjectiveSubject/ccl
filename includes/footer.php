<?php
namespace CCL\Footer;

/**
 * Setup actions and filters for the footer
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	// add_action( 'hook_name', $n( 'function_name' ) );

}

// create settings page

// create generic text field

// save fields