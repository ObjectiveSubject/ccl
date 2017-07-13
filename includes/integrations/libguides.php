<?php
namespace CCL\Integrations\LibGuides;

/**
 * Retrieve LibGuides token from Springshare needed to access v1.2 API data
 *
 * LIBGUIDES_CLIENT_ID and LIBGUIDES_CLIENT_SECRET are defined as constants in wp-config. Will be converted to wp options at some point
 *
 * @return string|\WP_Error will return access code or an error message
 */
function get_token() {
	$token_request = wp_remote_post( 'https://lgapi-us.libapps.com/1.2/oauth/token', array(
		'header' => array(),
		'body'   => array(
			'client_id'     => LIBGUIDES_CLIENT_ID,
			'client_secret' => LIBGUIDES_CLIENT_SECRET,
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
 * Retrieve all Databases
 *
 * @return array|string|\WP_Error
 */
function get_all_databases() {

	$token = get_token();

	$request = wp_remote_get( 'https://lgapi-us.libapps.com/1.2/az', array(
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

		$results = $request;

		return $results;
	}

}

/**
 * Retrieve all Guides
 *
 * LIBGUIDES_SITE_ID and LIBGUIDES_SITE_KEY are defined as constants in wp-config. Will be converted to wp options at some point
 *
 * @return array|string|\WP_Error
 */
function get_all_guides() {

	$params = array(
		'site_id' => LIBGUIDES_SITE_ID,
		'key'     => LIBGUIDES_SITE_KEY,
		'status'  => 1, // only retrieve published guides
	);

	$query_string = http_build_query( $params );

	$request = wp_remote_get( 'http://lgapi-us.libapps.com/1.1/guides/?' . $query_string );

	if ( is_wp_error( $request ) ) {

		return $request->get_error_message();

	} else {
		// check for API errors??

		$results = $request;

		return $results;
	}

}

/**
 * Retrieve all People
 *
 * LIBGUIDES_SITE_ID and LIBGUIDES_SITE_KEY are defined as constants in wp-config. Will be converted to wp options at some point
 *
 * @return array|string|\WP_Error
 */
function get_all_people() {

	$params = array(
		'site_id' => LIBGUIDES_SITE_ID,
		'key'     => LIBGUIDES_SITE_KEY,
		'expand'  => 'profile'
	);

	$query_string = http_build_query( $params );

	$request = wp_remote_get( 'http://lgapi-us.libapps.com/1.1/accounts/?' . $query_string );

	if ( is_wp_error( $request ) ) {

		return $request->get_error_message();

	} else {
		// check for API errors??

		$results = $request;

		return $results;
	}

}