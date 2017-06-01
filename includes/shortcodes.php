<?php
namespace CCL\Shortcodes;

/**
 * Set up shortcodes
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	// NOTE: Uncomment to activate shortcode
	// add_shortcode( 'example_shortcode', $n( 'example_shortcode' ) );
}



 /**
  * Create an example shortcode
  *
  * @param $attributes array List of attributes from the given shortcode
  *
  * @return mixed HTML output for the shortcode
  */
 function example_shortcode( $attributes, $content = null ) {
 	$data = shortcode_atts( array(
 		'class' => 'h2',
 		'text'	=> 'Hello World',
 	), $attributes );

 	$html = '<div class="' . $data['class'] . '">' . $data['text'] . '</div>';

 	return $html;
 }
