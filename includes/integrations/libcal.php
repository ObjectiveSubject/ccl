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
 * LIBCAL_CLIENT_ID and LIBCAL_CLIENT_SECRET can be defined as constants in wp-config.
 *
 * @return string|\WP_Error will return access code or an error message
 */
function get_token() {

	$client_id          = '';
	$client_secret      = '';
	$libcal_settings = get_option( 'libcal-api-v1_1-settings' );
	$token              = get_transient( 'libcal_token' );


	// Get Client ID (constant will override option page setting)
	if ( defined( 'LIBCAL_CLIENT_ID' ) ) {
		$client_id = LIBCAL_CLIENT_ID;
	} elseif ( array_key_exists( 'client_id', $libcal_settings ) ) {
		$client_id = $libcal_settings['client_id'];
	}

	// Get Client Secret (constant will override option page setting)
	if ( defined( 'LIBCAL_CLIENT_SECRET' ) ) {
		$client_secret = LIBCAL_CLIENT_SECRET;
	} elseif ( array_key_exists( 'client_secret', $libcal_settings ) ) {
		$client_secret = $libcal_settings['client_secret'];
	}

	if ( ! $client_id || ! $client_secret ) {
		return new \WP_Error( 'api_error', "Missing API settings" );
	}

	if ( ! $token ) {

		$token_request = wp_remote_post( 'https://api2.libcal.com/1.1/oauth/token', array(
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
			set_transient( 'libcal_token', $token, 30 * MINUTE_IN_SECONDS );

		}

	}

	return $token;

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
function get_space_category( $id = 2314 ) {

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
 * Retrieve space bookings
 *
 * Can use various parameters to return up to a maximum of 100 space bookings
 *
 * @return array|mixed|object|string
 */
function get_bookings() {

	$token = get_token();

	// eid (space id), lid (location id), date (YYYY-MM-DD)
	$parameters = '?limit=100&cid=2314'; // max 100 returned, default spaces category

	$request = wp_remote_get( '	https://api2.libcal.com/1.1/space/bookings' . $parameters , array(
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
		//$results = $request;

		return $results;
	}

}

/**
 * Retrieve booking info related to a specific item (Room) in a Space
 *
 * @param int $id
 *
 * @return array|mixed|object|string
 */
function get_space_booking( $id ) {

	$token = get_token();

	$request = wp_remote_get( '	https://api2.libcal.com/1.1/space/booking/' . $id . '?details=1', array(
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
 * @param $payload array Payload from AJAX function
 *
 * @return array|string|\WP_Error
 */
function reserve_space( $payload ) {

	// verify/error check payload before request
	// (check for valid JSON and all fields, maybe a claremont email address too)
	$payload = json_encode( $payload ); 	// JSON encode for submission

	$token = get_token();

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

		$results = $request;
		// $results = json_decode( $request );

		return $results;
	}

}

/**
 * Helper function for displaying LibCal's Calendar widget
 *
 * More info here:
 *
 * @todo add args if any are needed from shortcode, etc.
 * @todo rework default css
 * @param $args
 */
function calendar_widget( $echo = true, $options = array() ) {

	$defaults = array(
		'months' => 3,
	);

	$options = array_merge( $defaults, $options );

	ob_start();
	?>
	<script src="//api3.libcal.com/js/hours_month.js?002"></script>
	<div id="s_lc_mhw_333_0"></div>
	<script>
		jQuery(document).ready(function($) {
			var s_lc_mhw_333_0 = new $.LibCalHoursCal( $("#s_lc_mhw_333_0"), { iid: 333, lid: 0, months: <?php echo (int) $options['months']; ?>, systemTime: false });
		});
	</script>

	<!-- Please note: The following styles are optional, feel free to modify! //-->
	<style>
		.s-lc-mhw-tb { width: 100%; border: 1px solid #ddd; border-collapse: collapse; border-spacing: 0; }
		.s-lc-mhw-tb th, .s-lc-mhw-tb td { border: 1px solid #ddd; vertical-align: top; }
		.s-lc-mhw-tb thead { background-color: #F5F5F5; }
		.s-lc-mhw-header { text-align: center; }
		.s-lc-mhw-header-date { text-align: center; display: inline-block; margin-top: 5px; font-size: 130%; }
		.s-lc-mhw-days td { text-align: center; font-weight: bold; min-width: 14.28%; max-width: 14.28%; width: 14.28%;}
		.s-lc-mhw-day-l { color: #555; text-align: right; padding: 2px; font-size: 11px; }
		.s-lc-mhw-cells { height: 50px; }
		.s-lc-mhw-fnc { color: #555; }
		.s-lc-mhw-loc { font-size: 11px; padding: 2px; margin-bottom: 1px; color: #fff;  }
		.s-lc-mhw-subloc { margin-left: 5px;}
		.s-lc-mhw-footnote-cal { font-size: 86%;}
		.loc_4816 { background-color: #000000; }
		.loc_4926 { background-color: #333333; }
		.loc_4925 { background-color: #666666; }
		.loc_4927 { background-color: #999999; }
	</style>

	<?php
	$html = ob_get_contents();
	ob_get_clean();

	if ( $echo ) {
		echo $html;
	} else {
		return $html;
	}
}

/**
 * Helper function for displaying LibCal's My Scheduler widget
 *
 * More info here: http://claremont.libcal.com/sched_widget.php
 *
 * @todo add args if any are needed from shortcode, etc.
 * @param $args
 */
function schedule_widget( $echo = true, $options = array() ) {

	$defaults = array(
		'text' => "Schedule Appointment",
		'height' => 450,
		'width'	=> 500,
	);

	$options = array_merge( $defaults, $options );

	ob_start();
	?>

	<script src="//api3.libcal.com/js/myscheduler.min.js?002"></script>
	<script>
		jQuery(function () {
			jQuery("#mySched23904").LibCalMySched({iid: 333, uid: 0, gid: 0, width: <?php echo esc_js( $options['width'] ); ?>, height: <?php echo esc_js( $options['height'] ); ?>});
		});
	</script>
	<button id="mySched23904" class="libcal-scheduler ccl-b-btn" href="#"><?php echo esc_html( $options['text'] ); ?></button>

	<?php
	$html = ob_get_contents();
	ob_get_clean();

	if ( $echo ) {
		echo $html;
	} else {
		return $html;
	}
}