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
 * LIBGUIDES_CLIENT_ID and LIBGUIDES_CLIENT_SECRET can be defined as constants in wp-config.
 *
 * @return string|\WP_Error will return access code or an error message
 */
function get_token() {

	$client_id          = '';
	$client_secret      = '';
	$libguides_settings = get_option( 'libguides-api-v1_2-settings' );
	$token              = get_transient( 'libguides_token' );

	// Get Client ID (constant will override option page setting)
	if ( defined( 'LIBGUIDES_CLIENT_ID' ) ) {
		$client_id = LIBGUIDES_CLIENT_ID;
	} elseif ( array_key_exists( 'client_id', $libguides_settings ) ) {
		$client_id = $libguides_settings['client_id'];
	}

	// Get Client Secret (constant will override option page setting)
	if ( defined( 'LIBGUIDES_CLIENT_SECRET' ) ) {
		$client_secret = LIBGUIDES_CLIENT_SECRET;
	} elseif ( array_key_exists( 'client_secret', $libguides_settings ) ) {
		$client_secret = $libguides_settings['client_secret'];
	}

	if ( ! $client_id || ! $client_secret ) {
		return new \WP_Error( 'api_error', "Missing API settings" );
	}

	if ( ! $token ) {

		$token_request = wp_remote_post( 'https://lgapi-us.libapps.com/1.2/oauth/token', array(
			'header' => array(),
			'body'   => array(
				'client_id'     => $client_id,
				'client_secret' => $client_secret,
				'grant_type'    => 'client_credentials'
			)
		) );

		if ( is_wp_error ( $token_request ) ) {
			// not sure if this will ever get triggered
			// it's not really being handled properly either way
			return $token_request->get_error_message();

		} else {
			// check for API errors, like invalid keys?
			$token_request_data = json_decode( $token_request['body'] );

			$token = $token_request_data->access_token;

			// token is valid for an hour (3600 seconds), store in transient for 30 minutes
			set_transient( 'libguides_token', $token, 30 * MINUTE_IN_SECONDS );

		}

	}

	return $token;

}

/**
 * Fetch the libguide key from either WordPress database option or constant
 *
 * @return int|string libguide id or empty string
 */
function get_libguide_id() {

	$site_id = '';
	$libguides_settings = get_option( 'libguides-api-v1_1-settings' );

	// Constant will override option page setting
	if ( defined( 'LIBGUIDES_SITE_ID' ) ) {
		$site_id = LIBGUIDES_SITE_ID;
	} elseif ( array_key_exists( 'site_id', $libguides_settings ) ) {
		$site_id = $libguides_settings['site_id'];
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
	$libguides_settings = get_option( 'libguides-api-v1_1-settings' );

	// Constant will override option page setting
	if ( defined( 'LIBGUIDES_SITE_KEY' ) ) {
		$site_key = LIBGUIDES_SITE_KEY;
	} elseif ( array_key_exists( 'site_id', $libguides_settings ) ) {
		$site_key = $libguides_settings['site_key'];
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

	$params = array(
		'expand' => 'subjects,friendly_url,az_types,permitted_uses,az_props' // need to know who created the guide
	);

	$query_string = urldecode_deep( http_build_query( $params ) ); // urldecode is necessary to prevent the comma from being encoded

	$request = wp_remote_get( 'https://lgapi-us.libapps.com/1.2/az?' . $query_string, array(
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
		'group_ids'   => 15193,
		'status'      => 1, // only retrieve published guides
		'guide_types' => '2,3,4', // 1) General, 2) Course, 3) Subject, 4) Topic, 5) Internal, 6) Template
		'expand'      => 'owner,subjects,tags,group,metadata' // need to know who created the guide
	);

	$query_string = urldecode_deep( http_build_query( $params ) ); // urldecode is necessary to prevent the comma from being encoded

	$request = wp_remote_get( 'http://lgapi-us.libapps.com/1.1/guides/?' . $query_string );

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
		'site_id' => $site_id,
		'key'     => $site_key,
		'expand'  => 'profile,subjects'
	);

	// $query_string = urldecode_deep( http_build_query( $params ) ); // urldecode is necessary to prevent the comma from being encoded

	$query_string = 'site_id=' . $site_id . '&key=' . $site_key . '&expand[]=profile&expand[]=subjects';

	$request = wp_remote_get( 'http://lgapi-us.libapps.com/1.1/accounts/?' . $query_string );

	if ( is_wp_error( $request ) ) {

		return $request->get_error_message();

	} else {
		// check for API errors??

		$results = json_decode( $request['body'] );

		return $results;
	}

}