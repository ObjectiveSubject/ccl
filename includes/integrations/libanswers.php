<?php
/**
 * Functions related specifically to retrieving data from LibAnswers
 */

namespace CCL\Integrations\LibAnswers;

/**
 * Setup actions and filters for FAQs
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
 * Retrieve all FAQs
 *
 * @return array|string|\WP_Error
 */
function get_all_faqs() {
	
	$results = array();
	
	for( $x = 1; $x <= 4; $x++ ){
		$lib_answers_id = 1587; // CCL id to retrieve faq data from
	
		$params = array(
			'iid'      => $lib_answers_id,
			'limit' => '200', // Maxes at 50 returned, otherwise need to use groups/topics/keywords, or pagination
			'page'	=> $x
		);
	
		$query_string = urldecode_deep( http_build_query( $params ) ); // urldecode is necessary to prevent the comma from being encoded
	
		$request = wp_remote_get( 'https://api2.libanswers.com/1.0/faqs?' . $query_string );
		
		$request = json_decode( $request['body'] , true );
		
		foreach( $request['faqs'] as $val ){
			array_push( $results, $val );
		}
		 
	}

	if ( is_wp_error( $request ) ) {

		return $request->get_error_message();

	} else {
		// @todo will currently fail if API key is specified but invalid

		return $results;
	}

}

/**
 * 
 * Helper for Ask Us form to be embedded in main content area
 * 
 * https://claremont.libanswers.com/admin_widgets.php
 *
 * @todo add args if any are needed from shortcode, etc.
 * @param $args
 * 
 */
 
 function libanswers_widget( $echo = true, $options = array() ){
 	
	//setup defaults
	$defaults = array(
		'id'	=> 6412
		
	);
	
	$options = array_merge( $defaults, $options );
	
	ob_start();
	?>
	
	<script src="https://api2.libanswers.com/1.0/widgets/<?php echo $options['id'];  ?>"></script>
	
	<div id="s-la-widget-<?php echo $options['id'];  ?>" class="ccl-u-mt-1 ccl-c-libwizard-widget"></div>
 	
 	<?php
 	$html = ob_get_contents();
 	ob_get_clean();
 	
 	if ( $echo ) {
		echo $html;
	} else {
		return $html;
	}
 	
 }
