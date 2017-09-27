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

	add_shortcode( 'scheduler', $n( 'scheduler_fn' ) );
	add_shortcode( 'accordion', $n( 'accordion_fn' ) );
}


/**
* Create a scheduler shortcode to display the Libcal MyScheduler widget for booking appointments
*
* @param $attributes array List of attributes from the given shortcode
*
* @return mixed HTML output for the shortcode
*/
function scheduler_fn( $attributes ) {

$data = shortcode_atts( array(
	'text' => "Schedule Appointment",
	'height' => 450,
	'width'	=> 500,
), $attributes );

$html = \CCL\Integrations\LibCal\schedule_widget( false, $data );

// $html = "<b>FARTSTICKS</b>";

return $html;
}


/**
* Create an accordion
*
* @param $attributes array List of attributes from the given shortcode
*
* @return mixed HTML output for the shortcode
*/
function accordion_fn( $attributes = false, $content = null ) {

	$data = shortcode_atts( array(
		'title' => "Title",
	), $attributes );

	$content = preg_replace( '#^<\/p>|^<br \/>|<p>$#', '', $content );
	ob_start();
	?>
	<div class="ccl-c-accordion">
		<div class="ccl-c-accordion__toggle">
			<?php echo $data['title']; ?>
		</div>
		<div class="ccl-c-accordion__content">
			<?php echo do_shortcode( shortcode_unautop( trim( $content ) ) ); ?>
		</div>
	</div>
	<?
	$html = ob_get_contents();
	ob_get_clean();

	return $html;
}
