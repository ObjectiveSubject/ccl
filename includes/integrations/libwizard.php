<?php
/**
 * Functions related specifically to retrieving data from Libwizard
 */

namespace CCL\Integrations\LibWizard;

/**
 * Setup actions and filters for cal
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	// add_action( 'hook', $n( 'function_name' ) );

}

/**
 * Helper function for displaying LibWizard's Form widget
 *
 * More info here: http://claremont.libsurveys.com/forms.php#
 *
 * @param $args
 */
function form_widget( $echo = true, $options = array() ) {

	$defaults = array(
		'id' => ""
	);

	$options = array_merge( $defaults, $options );

	ob_start();
	?>

	<div id="form_<?php echo esc_attr( $options['id'] ); ?>"></div>
	<script type="text/javascript" src="//claremont.libsurveys.com/form_loader.php?id=<?php echo esc_attr( $options['id'] ); ?>"></script>

	<?php
	$html = ob_get_contents();
	ob_get_clean();

	if ( $echo ) {
		echo $html;
	} else {
		return $html;
	}
}