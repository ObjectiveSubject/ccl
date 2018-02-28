<div class="ccl-l-container">
            
        <table class="ccl-b-table--striped ccl-is-hoverable">

        <thead>
            <th>Subject</th>
            <th>Librarians</th>
            <th>Contact</th>
        </thead>
        <tbody>

        <?php 

        $subjects = get_terms( array( 'taxonomy' => 'subject' ) );
        $count = 0;

        foreach ( $subjects as $s_key => $subject ) :

            $args = array(
                'post_type' => 'staff',
                'posts_per_page' => 500,
                'tax_query' => array(
                    'relationship' => 'AND',
                    array(
                        'taxonomy' => 'staff_role',
                        'field' => 'slug',
                        'terms' => 'librarian'
                    ),
                    array(
                        'taxonomy' => 'subject',
                        'field' => 'id',
                        'terms' => $subject->term_id
                    )
                )
            );

            $librarians = new WP_Query( $args );  ?>
            
            <?php if( empty( $librarians->have_posts() ) ) continue; ?>
            
            <tr>

                <td><?php echo $subject->name; ?></td>

                <td>

                    <?php if ( $librarians->have_posts() ) : ?>
                        
                        <?php while ( $librarians->have_posts() ) : $librarians->the_post(); ?>
            
                            <div><strong><?php the_title(); ?></strong></div>

                        <?php endwhile; ?>

                    <?php endif; ?>

                </td>

                <td>

                    <?php if ( $librarians->have_posts() ) : ?>
                        
                        <?php while ( $librarians->have_posts() ) : $librarians->the_post();
            
                            $profile_url = get_post_meta( $post->ID, 'member_friendly_url', true ); ?>

                            <div>
                                <a href="<?php echo esc_url( $profile_url ); ?>" class="ccl-u-color-school" target="_blank">
                                    <strong>Contact <?php the_title(); ?></strong>
                                    <span class="ccl-b-icon arrow-right" aria-hidden="true"></span>
                                </a>
                            </div>

                        <?php endwhile; ?>

                        <?php wp_reset_query(); ?>

                    <?php endif; ?>

                </td>

            </tr>

        <?php $count++; endforeach; ?>

        </tbody></table>

</div>