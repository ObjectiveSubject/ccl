<?php
namespace CCL\MetaBoxes\FeaturedImage;

/**
 * Metaboxes that appear on the staff post type
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	add_action( 'cmb2_admin_init',  $n( 'feat_img_fields' ) );
	add_filter( 'admin_post_thumbnail_html', $n( 'feat_img_output_fields' ), 10, 3 );	
}

/**
 * Create a options for adjusting featured image position
 */


function feat_img_fields(){
	$cmb = new_cmb2_box( array(
		'id'           => 'feat-image-fields',
		'object_types' => array( 'page' ),
		'priority'     => 'high'	
	) );
	$cmb->add_field( array(
		'name' => 'Featured Image Height Position',
		'id'   => 'feat_img_placement',
		'type' => 'select',
		'desc'  => __( 'Select percentage height from top of container', 'cmb2' ),		
		'options' => array(
			''      => 'Default', // The default -- no value. Keeps out of the database.
			'10' => '10%',
			'20' => '20%',
			'30' => '30%',
			'40' => '40%',
			'50' => '50%',
			'60' => '60%',
			'70' => '70%',
			'80' => '80%',
			'90' => '90%',
			'100' => '100%'			
		),
		'before' => '<style>
		#cmb2-metabox-feat-image-fields .cmb-th,
		#cmb2-metabox-feat-image-fields .cmb-td,
		#side-sortables .cmb2-wrap #cmb2-metabox-feat-image-fields .cmb-row {
			padding: 0;
		}
		</style>',
	) );	
}

function feat_img_output_fields( $content, $post_id, $thumbnail_id ) {
	$cmb = cmb2_get_metabox( 'feat-image-fields' );
	if ( in_array( get_post_type(), $cmb->prop( 'object_types' ), 1 ) ) {
		ob_start();
		$cmb->show_form();
		// grab the data from the output buffer and add it to our $content variable
		$content .= ob_get_clean();
	}
	return $content;
}