<?php 

$subjects = get_terms( array( 'taxonomy' => 'subject' ) );

foreach ( $subjects as $s_key => $subject ) :

    $args = array(
        'post_type' => 'staff',
        'posts_per_page' => 500,
        'tax_query' => array(
            array(
                'taxonomy' => 'subject',
                'field' => 'id',
                'terms' => $subject->term_id
            )
        )
    );

    $librarians = new WP_Query( $args ); 

    if ( $librarians->have_posts() ) : ?>

        <div class="ccl-l-container">

            <hr/>

            <h2 class="ccl-h4 ccl-u-mt-2 ccl-u-color-school"><?php echo $subject->name; ?></h2>

            <div class="ccl-l-row">
            
                <?php 
                $count = 0;
                while ( $librarians->have_posts() ) : $librarians->the_post() ?>

                    <div class="ccl-l-column ccl-l-span-6-md ccl-l-span-5-lg <?php echo ( $count % 2 === 0 ) ? '' : 'ccl-l-offset-2-lg'; ?>">

                        <?php get_template_part( 'partials/staff-profile-card' ); ?>

                    </div>

                    <?php $count++; ?>

                <?php endwhile; ?>

                <?php wp_reset_postdata(); wp_reset_query(); ?>

            </div>

        </div>
        

    <?php endif; ?>

<?php endforeach; ?>