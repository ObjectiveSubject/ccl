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

	add_shortcode( 'scheduler', $n( 'schedule_appointment' ) );
}


 /**
  * Create a scheduler shortcode to display the Libcal MyScheduler widget for booking appointments
  *
  * @param $attributes array List of attributes from the given shortcode
  *
  * @return mixed HTML output for the shortcode
  */
 function schedule_appointment( $attributes ) {

 	$data = shortcode_atts( array(
 		'text' => "Schedule Appointment",
 		'height' => 450,
 		'width'	=> 500,
 	), $attributes );

 	$html = \CCL\Integrations\LibCal\schedule_widget( false, $data );

 	// $html = "<b>FARTSTICKS</b>";

 	return $html;
 }
