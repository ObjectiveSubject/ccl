<?php
/**
 * Functions related specifically to retrieving data from LibCal
 */

namespace CCL\Integrations\LibCal;

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
 * Retrieve LibCal token from Springshare needed to access v1.1 API data
 *
 * LIBCAL_CLIENT_ID and LIBCAL_CLIENT_SECRET are defined as constants in wp-config. Will be converted to wp options at some point
 *
 * @return string|\WP_Error will return access code or an error message
 */
function get_token() {
	$token_request = wp_remote_post( 'https://api2.libcal.com/1.1/oauth/token', array(
		'header' => array(),
		'body'   => array(
			'client_id'     => LIBCAL_CLIENT_ID,
			'client_secret' => LIBCAL_CLIENT_SECRET,
			'grant_type' => 'client_credentials'
		)
	) );

	if ( is_wp_error ( $token_request ) ) {

		return $token_request->get_error_message();

	} else {
		// check for API errors??
		$results = json_decode( $token_request['body'] );

		// token is valid for an hour (3600 seconds), should probably store for like 30 mins in a transient
		return $results->access_token;
	}

}

/**
 * Retrieve all Space Locations
 *
 * Multiple rooms can be contained within a location
 *
 * @return array|string|\WP_Error
 */
function get_all_space_locations() {

	$token = get_token();

	$request = wp_remote_get( '	https://api2.libcal.com/1.1/space/locations?details=1', array(
		'headers' => array(
			'Authorization' => 'Bearer '. $token
		),
		'body'   => array(),
		'debug'  => true
	) );

	if ( is_wp_error ( $request ) ) {

		return $request->get_error_message();

	} else {
		// check for API errors??

		$results = json_decode( $request['body'] );

		return $results;
	}

}

/**
 * Retrieve info related to a specific category in a Space
 *
 * The ID 2314 is the "Rooms" category within CCL's setup. This could be replaced with a constant or option.
 *
 * @param int $id
 *
 * @return array|mixed|object|string
 */
function get_space_category( $id = 2314) {

	$token = get_token();

	$request = wp_remote_get( '	https://api2.libcal.com/1.1/space/category/' . $id . '?details=1', array(
		'headers' => array(
			'Authorization' => 'Bearer '. $token
		),
		'body'   => array(),
		'debug'  => true
	) );

	if ( is_wp_error ( $request ) ) {

		return $request->get_error_message();

	} else {
		// check for API errors??

		$results = json_decode( $request['body'] );

		return $results;
	}

}

/**
 * Retrieve info related to a specific item (Room) in a Space
 *
 * @param int $id
 *
 * @return array|mixed|object|string
 */
function get_space_item( $id ) {

	$token = get_token();

	$request = wp_remote_get( '	https://api2.libcal.com/1.1/space/item/' . $id . '?details=1', array(
		'headers' => array(
			'Authorization' => 'Bearer '. $token
		),
		'body'   => array(),
		'debug'  => true
	) );

	if ( is_wp_error ( $request ) ) {

		return $request->get_error_message();

	} else {
		// check for API errors??

		$results = json_decode( $request['body'] );

		return $results;
	}

}

/**
 * Book a space on LibCal
 *
 * Use a POST request, example payload:
 * 
 * $payload = array(
 *		'iid'      => 123, // internal id?
 *		'start'    => '2017-07-31T14:00:00-07:00',
 *		'fname'    => 'First',
 *		'lname'    => 'Last',
 *		'email'    => 'email@example.com',
 *		'nickname' => 'Study session',
 *		'bookings' => array(
 *		    array(
 *		        'id' => 1234, // must be int, not string
 *		        'to' => '2017-07-31T15:00:00-07:00'
 *		    )
 *		)
 * );
 *
 * @param $payload
 *
 * @return array|string|\WP_Error
 */
function reserve_space( $payload ) {

	$token = get_token();

	// verify/error check payload before request
	// (check for valid JSON and all fields, maybe a claremont email address too)

	$request = wp_remote_post( '	https://api2.libcal.com/1.1/space/reserve', array(
		'headers' => array(
			'Authorization' => 'Bearer '. $token,
			'Content-Type'  => 'application/json'
		),
		'body'   => $payload,
		'debug'  => true
	) );

	if ( is_wp_error ( $request ) ) {

		return $request->get_error_message();

	} else {
		// check for API errors??

		// $results = json_decode( $request );
		$results = $request;

		return $results;
	}

}