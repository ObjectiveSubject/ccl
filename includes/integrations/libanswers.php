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

	$lib_answers_id = 1587; // CCL id to retrieve faq data from

	$params = array(
		'iid'      => $lib_answers_id,
		'limit' => '50', // Maxes at 50 returned, otherwise need to use groups/topics/keywords, or pagination
	);

	$query_string = urldecode_deep( http_build_query( $params ) ); // urldecode is necessary to prevent the comma from being encoded

	$request = wp_remote_get( 'https://api2.libanswers.com/1.0/faqs?' . $query_string );

	if ( is_wp_error( $request ) ) {

		return $request->get_error_message();

	} else {
		// @todo will currently fail if API key is specified but invalid

		$results = json_decode( $request['body'] );

		return $results;
	}

}
