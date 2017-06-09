<?php
namespace CCL\Integrations\Springshare;

/**
 * Retrieve Springshare token needed to access API data
 *
 * SPRINGSHARE_ID and SPRINGSHARE_SECRET are defined as constants in wp-config. Will be converted to wp options at some point
 *
 * @return string|\WP_Error will return access code or an error message
 */
function get_token() {
	$token_request = wp_remote_post( 'https://lgapi-us.libapps.com/1.2/oauth/token', array(
		'header' => array(),
		'body'   => array(
			'client_id'     => SPRINGSHARE_ID,
			'client_secret' => SPRINGSHARE_SECRET,
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
 * Retrieve all Guides
 *
 * @return array|string|\WP_Error
 */
function get_all_guides() {

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