<div class="ccl-l-container">
            
    <div class="ccl-l-row">

        <?php 

        $subjects = get_terms( array( 'taxonomy' => 'subject' ) );
        $count = 0;

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
                
                <div id="<?php echo "subject-$subject->slug"; ?>" class="ccl-l-column ccl-l-span-6-md ccl-l-span-5-lg <?php echo ( $count % 2 === 0 ) ? '' : 'ccl-l-offset-2-lg'; ?>">
                
                    <h2 class="ccl-h4 ccl-u-mt-2 ccl-u-color-school"><?php echo $subject->name; ?></h2>

                    <?php while ( $librarians->have_posts() ) : $librarians->the_post() ?>

                        <?php get_template_part( 'partials/staff-profile-card' ); ?>

                    <?php endwhile; wp_reset_query(); ?>

                </div>

            <?php endif; ?>

        <?php $count++; endforeach; ?>

    </div>

</div>