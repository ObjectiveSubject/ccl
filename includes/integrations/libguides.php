<?php
/**
 * Functions related specifically to retrieving data from LibGuides
 */

namespace CCL\Integrations\LibGuides;

/**
 * Setup actions and filters for guides
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
 * Fetch the libguide key from either WordPress database option or constant
 *
 * @return int|string libguide id or empty string
 */
function get_libguide_id() {

	$site_id = '';
	$libguides_settings = get_option( 'libguides-api-v1_1-settings ');

	if ( array_key_exists( 'site_id', $libguides_settings ) ) {
		$site_id = $libguides_settings['site_id'];
	}

	// Constant will override option page setting
	if ( LIBGUIDES_SITE_ID ) {
		$site_id = LIBGUIDES_SITE_ID;
	}

	return $site_id;
}

/**
 * Fetch the libguide key from either WordPress database option or constant
 *
 * @return string libguide key or empty string
 */
function get_libguide_key() {

	$site_key = '';
	$libguides_settings = get_option( 'libguides-api-v1_1-settings ');

	if ( array_key_exists( 'site_id', $libguides_settings ) ) {
		$site_key = $libguides_settings['site_key'];
	}

	// Constant will override option page setting
	if ( LIBGUIDES_SITE_KEY ) {
		$site_key = LIBGUIDES_SITE_KEY;
	}

	return $site_key;
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

		$results = json_decode( $request['body'] );

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

	$site_id = get_libguide_id();
	$site_key = get_libguide_key();

	if ( ! $site_id || ! $site_key ) {
		return new \WP_Error( 'api_error', "Missing API settings" );
	}

	$params = array(
		'site_id'     => $site_id,
		'key'         => $site_key,
		'status'      => 1, // only retrieve published guides
		'guide_types' => '1,2,3,4', // General Purpose, Course, Subject, Topic
		'expand'      => 'owner' // need to know who created the guide
	);

	$query_string = urldecode_deep( http_build_query( $params ) );

	$request = wp_remote_get( 'http://lgapi-us.libapps.com/1.1/guides/?' . $query_string ); // urldecode is necessary to prevent the comma from being encoded

	if ( is_wp_error( $request ) ) {

		return $request->get_error_message();

	} else {
		// @todo will currently fail if API key is specified but invalid

		$results = json_decode( $request['body'] );

		return $results;
	}

}

/**
 * Retrieve all Staff members
 *
 * LIBGUIDES_SITE_ID and LIBGUIDES_SITE_KEY are defined as constants in wp-config. Will be converted to wp options at some point
 *
 * @return array|string|\WP_Error
 */
function get_all_staff() {

	$site_id = get_libguide_id();
	$site_key = get_libguide_key();

	if ( ! $site_id || ! $site_key ) {
		return new \WP_Error( 'api_error', "Missing API settings" );
	}

	$params = array(
		'site_id' => LIBGUIDES_SITE_ID,
		'key'     => LIBGUIDES_SITE_KEY,
		'expand'  => 'profile,subjects'
	);

	// $query_string = urldecode_deep( http_build_query( $params ) ); // urldecode is necessary to prevent the comma from being encoded

	$query_string = 'site_id=' . LIBGUIDES_SITE_ID . '&key=' . LIBGUIDES_SITE_KEY . '&expand[]=profile&expand[]=subjects';

	$request = wp_remote_get( 'http://lgapi-us.libapps.com/1.1/accounts/?' . $query_string );

	if ( is_wp_error( $request ) ) {

		return $request->get_error_message();

	} else {
		// check for API errors??

		$results = json_decode( $request['body'] );

		return $results;
	}

}