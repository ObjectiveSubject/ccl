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

	add_shortcode( 'accordion', $n( 'accordion_fn' ) );
	add_shortcode( 'button', $n( 'button_fn' ) );
	add_shortcode( 'calendar_widget', $n( 'calendar_fn' ) );
	add_shortcode( 'icon', $n( 'icon_fn' ) );
	add_shortcode( 'libwizard_form', $n( 'libwizard_form_fn' ) );
	add_shortcode( 'modal', $n( 'modal_fn' ) );
	add_shortcode( 'modal_toggle', $n( 'modal_toggle_fn' ) );
	add_shortcode( 'scheduler', $n( 'scheduler_fn' ) );
	add_shortcode( 'tooltip', $n( 'tooltip_fn' ) );
	add_shortcode( 'libanswers_widget', $n( 'libanswers_widget_fn' ) );
	add_shortcode( 'chat_widget', $n( 'chat_widget_fn' ) );
	
}

/**
 * Create a scheduler shortcode to display the Libcal MyScheduler widget for booking appointments
 *
 * @param $attributes array List of attributes from the given shortcode
 *
 * @return mixed HTML output for the shortcode
 */
function calendar_fn( $attributes ) {

	$data = shortcode_atts( array(
		'months' => 3,
	), $attributes );

	$html = \CCL\Integrations\LibCal\calendar_widget( false, $data );

	return $html;
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
	'text' => 'Schedule Appointment',
	'height' => 600,
	'width'	=> 800,
), $attributes );

$html = \CCL\Integrations\LibCal\schedule_widget( false, $data );

return $html;
}

/**
 * Display a LibWizard form
 *
 * @param $attributes array List of attributes from the given shortcode
 *
 * @return mixed HTML output for the shortcode
 */
function libwizard_form_fn( $attributes ) {

	$data = shortcode_atts( array(
		'id' => '',
	), $attributes );

	$html = \CCL\Integrations\LibWizard\form_widget( false, $data );

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
		'title' => 'Title',
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
	<?php
	$html = ob_get_contents();
	ob_get_clean();

	return $html;
}



/**
* Create a tooltip
*
* @param $attributes array List of attributes from the given shortcode
*
* @return mixed HTML output for the shortcode
*/
function tooltip_fn( $attributes = false, $content = null ) {

	$data = shortcode_atts( array(
		'text' => '',
	), $attributes );

	if ( ! $data['text'] || ! $content ) {
		return;
	}

	$html = '<span data-toggle="tooltip" title="' . $data['text'] . '">' . $content . '</span>';

	return $html;
}



/**
* Create a modal
*
* @param $attributes array List of attributes from the given shortcode
*
* @return mixed HTML output for the shortcode
*/
function modal_fn( $attributes = false, $content = null ) {

	$data = shortcode_atts( array(
		'title' => 'Modal Title',
		'id' => ''
	), $attributes );

	if ( ! $data['id'] || ! $content ) {
		return;
	}

	$modal_id = \CCL\Helpers\create_slug( $data['id'] );
	$modal_slug = \CCL\Helpers\create_slug( $data['title'] );

	ob_start();
	?>

	<div class="ccl-c-modal" id="modal-<?php echo $modal_id; ?>" tabindex="-1" role="dialog" aria-labelledby="modal-title-<?php echo $modal_slug; ?>" aria-hidden="true">
		<div class="ccl-c-modal__dialog" role="document">

			<div class="ccl-c-modal__content">

				<div class="ccl-c-modal__header">
					<h5 class="ccl-c-modal__title" id="modal-title-<?php echo $modal_slug; ?>"><?php echo $data['title']; ?></h5>
					<button type="button" class="ccl-b-close" data-toggle="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
					</button>
				</div>

				<div class="ccl-c-modal__body">
					<?php echo do_shortcode( shortcode_unautop( trim( $content ) ) ); ?>
				</div>

			</div>

		</div>
	</div>

	<?php
	$html = ob_get_contents();
	ob_get_clean();

	return $html;
}



/**
* Create a modal toggle
*
* @param $attributes array List of attributes from the given shortcode
*
* @return mixed HTML output for the shortcode
*/
function modal_toggle_fn( $attributes = false ) {
	
	$data = shortcode_atts( array(
		'type' => 'link', // also 'button'
		'id' => '',
		'text' => ''
	), $attributes );

	if ( ! $data['id'] || ! $data['text'] ) {
		return;
	}

	$modal_id = \CCL\Helpers\create_slug( $data['id'] );

	ob_start(); 
	?>

	<?php if ( 'button' === $data['type'] ) : ?>
	
		<button type="button" class="ccl-b-btn" data-toggle="modal" data-target="#modal-<?php echo $modal_id; ?>">
			<?php echo $data['text']; ?>
		</button>
	
	<?php else : ?>

		<a href="#<?php echo $modal_id; ?>" data-toggle="modal" data-target="#modal-<?php echo $modal_id; ?>">
			<?php echo $data['text']; ?>
		</a>

	<?php endif; ?>

	<?php
	$html = ob_get_contents();
	ob_get_clean();

	return $html;
}

/**
 * Create a button CTA shortcode
 *
 * @param $attributes array List of attributes from the given shortcode
 *
 * @return mixed HTML output for the shortcode
 */
function button_fn( $attributes = false, $content = null ) {

	$data = shortcode_atts( array(
		'url'   => '',
		'size'  => '', // small, default ""
		'style' => '', // solid, default ""
	), $attributes );

	if ( ! $data['url'] ) {
		return null; // will return nothing if no url is specified
	}

	$classes = '';

	// @todo error trapping could be built-in here to check for valid class names
	if ( array_key_exists( 'size', $data ) && $data['size'] ) {
		$classes  = 'ccl-is-' . esc_attr( $data['size'] ) . ' ';
	}

	if ( array_key_exists( 'style', $data ) && $data['style'] ) {
		$classes .= 'ccl-is-' . esc_attr( $data['style'] );
	}

	$html = '<a href="' . esc_url( $data['url'] ) . '" class="ccl-b-btn ' . $classes . '">' . $content . '</a>';

	return $html;
}

/**
 * Create an icon to display with a link
 *
 * @param $attributes array List of attributes from the given shortcode
 *
 * @return mixed HTML output for the shortcode
 */
function icon_fn( $attributes = false, $content = null ) {

	$data = shortcode_atts( array(
		'type' => '',
	), $attributes );

	if ( ! $data['type'] ) {
		return null;
	}

	$html = '<span class="ccl-b-icon ' . esc_attr( $data['type'] ) . '" aria-hidden="true"></span> ' . $content;

	return $html;
}


/**
*
* Insert an ask us form widget anywhere on the page
* 
* @param $attributes array List of attributes from the given shortcode
*
* @return mixed HTML output for the shortcode
*/
function libanswers_widget_fn( $attributes ){
	
$data = shortcode_atts( array(
	'id'	=> 6412
), $attributes );

$html = \CCL\Integrations\LibAnswers\libAnswers_widget( false, $data );

return $html;	
}

/**
 * 
 * Insert a widget for library chat from LibraryH3lp
 * 
 * @param none
 * 
 * @return mixed HTML output in shortcode
 * 
 */
 
 function chat_widget_fn(){
 	
 	ob_start();
 	?>
 	
	<div class="needs-js">chat loading...</div>
	
	<script type="text/javascript">
	  (function() {
	    var x = document.createElement("script"); x.type = "text/javascript"; x.async = true;
	    x.src = (document.location.protocol === "https:" ? "https://" : "http://") + "libraryh3lp.com/js/libraryh3lp.js?9486";
	    var y = document.getElementsByTagName("script")[0]; y.parentNode.insertBefore(x, y);
	  })();
	</script> 	
 	
 	<?php
 	$html = ob_get_contents();
 	ob_get_clean();
 	
 	return $html;
 	
 }