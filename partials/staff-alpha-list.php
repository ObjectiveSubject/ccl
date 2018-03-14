<?php 
$args = array(
    'post_type' => 'staff',
    'posts_per_page' => 500,
    'tax_query' => array(
        array(
            'taxonomy' => 'staff_role',
            'field' => 'slug',
            'terms' => 'staff',
            //'operator' => 'NOT IN'
        ) 
    )
);

$librarians = new WP_Query( $args ); 
$sorted_librarians = $librarians->posts;

usort( $sorted_librarians, function( $a, $b){

    $name_a = explode( ' ', $a->post_title );
    $last_a = array_reverse($name_a)[0];
    
    $name_b = explode( ' ', $b->post_title );
    $last_b = array_reverse($name_b)[0];

    if ( $last_a == $last_b ) {
        return 0;
    }

    return ( $last_a < $last_b ) ? -1 : 1;

} );

if ( $librarians->have_posts() ) : ?>

<div class="ccl-l-container">

    <div class="ccl-l-row ccl-u-mt-2">
    
        <?php foreach ( $sorted_librarians as $key => $post ) : setup_postdata( $post ); ?>

            <div class="ccl-l-column ccl-l-span-6-md ccl-l-span-5-lg <?php echo ( $key % 2 === 0 ) ? '' : 'ccl-l-offset-2-lg'; ?>">

                <?php get_template_part( 'partials/staff-profile-card' ); ?>

            </div>

        <?php endforeach; wp_reset_postdata(); wp_reset_query(); ?>

    </div>

</div>

<?php endif; ?>