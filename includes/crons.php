<?php
namespace CCL\Crons;

/**
 * 
 * These Cron jobs for the CCL theme
 * 
 * Primary function is running the updates on SpringShare imports
 * 
 */
 
 function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};
	
	add_filter( 'cron_schedules', $n( 'wpcron_intervals' ) );
	
	//add_action( 'init', $n( 'ccl_cron_hour_activation' ) );
	//don't know why but namespacing doesn't work with this one..
	//@todo namespace this function -- ok for now cuz it's prefixed
	ccl_cron_hour_activation();
	
	add_action( 'ccl_cron_hour', $n( 'ccl_process_hour_crons' ) );
	
}


/**
 * Setup intervals for crons
 *
 * @param $schedules
 *
 * @return array added|updated
 */
function wpcron_intervals( $schedules ) {

	// one minute
	$one_minute = array(
					'interval' => 60,
					'display' => 'One Minute'
				);

	$schedules[ 'ccl_one_minute' ] = $one_minute;

	// five minutes
	$five_minutes = array(
					'interval' => 300,
					'display' => 'Five Minutes'
				);

	$schedules[ 'ccl_five_minutes' ] = $five_minutes;
	
	// 1 hour
	$one_hour = array(
					'interval' => 60 * 60,
					'display' => 'One Hour'
				);

	$schedules[ 'ccl_one_hour' ] = $one_hour;
	
	// 1 day
	$one_day = array(
					'interval' => DAY_IN_SECONDS,
					'display' => 'One day'
				);

	$schedules[ 'ccl_one_day' ] = $one_day;	

	// return data

	return $schedules;

}

/**
 * Add the hook for Cron hour functions
 *
 * @param null
 *
 * @return null
 */
function ccl_cron_hour_activation() {

	if ( ! wp_next_scheduled( 'ccl_cron_hour' ) ) {
	    
        //register new hook for cron
		wp_schedule_event( time(), 'ccl_one_hour', 'ccl_cron_hour' );

	}

}

/**
 * Function that runs when cron is activated
 *
 * @param null
 *
 * @return null
 */
function ccl_process_hour_crons() {

	if ( ! defined( 'DOING_CRON' ) ) return;

	\CCL\Guides\process_guides();
	\CCL\Faqs\process_faqs();
	\CCL\Staff\process_staff();
	\CCL\Databases\process_databases();
}
