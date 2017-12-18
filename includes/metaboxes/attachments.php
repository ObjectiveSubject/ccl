<?php
namespace CCL\MetaBoxes\Attachments;

/**
 * Metaboxes that appear on more than one post type around the site
 *
 * @return void
 */
function setup() {
	$n = function ( $function ) {
		return __NAMESPACE__ . "\\$function";
	};

	// NOTE: Uncomment to activate metabox
	add_action( 'cmb2_init',  $n( 'attachment_fields' ) );
	add_filter( 'attachment_fields_to_edit', $n('add_attachment_fields_to_edit'), 10, 2 );
}

/**
 * Example metabox
 * See https://github.com/WebDevStudios/CMB2/wiki/Field-Types for
 * more information on creating metaboxes and field types.
 */
function attachment_fields() {

	$prefix = 'attachment_';

	$cmb = new_cmb2_box( array(
		'id'           => $prefix . 'metabox',
		'title'        => __( 'Attachment Options', 'cmb2' ),
		'priority'     => 'high',
		'object_types' => array( 'attachment' )
	) );

	$cmb->add_field( array(
		'name'	=> __( 'Promo Carousel Link', 'cmb2' ),
		'desc'  => __( 'Add a link to be used in promo carousels', 'cmb2' ),
		'id'  	=> $prefix . 'link',
		'type'	=> 'text_url'
	) );

}

/**
 * Add fields to attachment edit screens
 * See https://codex.wordpress.org/Plugin_API/Filter_Reference/attachment_fields_to_edit
 */
function add_attachment_fields_to_edit( $form_fields, $post ) {
    $field_value = get_post_meta( $post->ID, 'attachment_link', true );
    $form_fields['attachment_link'] = array(
        'value' => $field_value ? $field_value : '',
        'label' => __( 'Promo Carousel Link' ),
		'helps' => __( 'Add a link to be used in promo carousels' ),
		'show_in_edit' => false
    );
    return $form_fields;
}
