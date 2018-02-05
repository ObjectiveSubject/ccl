<?php
namespace CCL\MetaBoxes\LibcalRooms;

/**
 * Metaboxes that appear on more than one post type around the site
 *
 * @return void
 */
 
 function setup(){
     $n = function( $function ){
         return __NAMESPACE__ . "\\$function";
     };
     
     	// NOTE: Uncomment to activate metabox
     	add_action( 'cmb2_init', $n( 'libcal_fields' ) );
    }
 /**
 * Example metabox
 * See https://github.com/WebDevStudios/CMB2/wiki/Field-Types for
 * more information on creating metaboxes and field types.
 */
 
//hide this metabox is we detect that this room was saved via libcal
//use metabox room_id
 function hide_for_libcal( $cmb ){
    $test_for_libcal = get_post_meta( $cmb->object_id, 'room_id', true );
    
    if( $test_for_libcal ){
        return false;
    }
     
    return true;
 }
 
 function libcal_fields(){
    $prefix = "libcal_";
    
    $cmb = new_cmb2_box( array(
        'id'            => $prefix . 'metabox',
		'title'         => __( 'Room Data', 'cmb2' ),
		'priority'      => 'high',
		'object_types'  => array( 'room' ),
		'show_on_cb'    => __NAMESPACE__ . "\\hide_for_libcal"
        )
    );
    
    $cmb->add_field( array(
        'name'	=> __( 'Room Description', 'cmb2' ),
		'desc'  =>  __( 'Add the title of this room with id', 'cmb2' ),
		'id'  	=> 'room_description',
        'type'	=> 'wysiwyg'
        )   
    );
    
    $cmb->add_field( array(
        'name'	=> __( 'Room Capacity', 'cmb2' ),
		'desc'  => __( 'Maximum occupancy', 'cmb2' ),
		'id'  	=> 'room_capacity',
        'type'	=> 'text'
        )   
    );
    
    $cmb->add_field( array(
        'name'	=> __( 'Room Image', 'cmb2' ),
		'desc'  => __( 'Photo of library space', 'cmb2' ),
		'id'  	=> 'room_image',
        'type'	=> 'file'
        )   
    );    
 
     
     
 }
 