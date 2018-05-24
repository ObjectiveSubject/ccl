<?php
    $guides = new \WP_Query(array(
        'post_type'         => 'guide',
        'order'             => 'ASC',
        'orderby'           => 'title',
        'posts_per_page'    => -1,
        'meta_query' => array(
            array(
                'key'       => 'guide_type',
                'value'     => 'Course Guide',
            )
        )
    ));
    
    $course_guides = $guides->posts;
    
if ( empty(  $course_guides ) ) : ?>
		<div class="ccl-l-container">

			<div class="ccl-l-row">
				<div class="ccl-c-entry-content ccl-l-column ccl-l-span-9-md ccl-u-my-2">

					<div class="ccl-c-alert ccl-is-error ccl-h4">No course guides are available at this time</div>

				</div>
			</div>

		</div>
<?php endif; ?>


<div class="ccl-l-container">
    <div class="ccl-l-row ccl-u-mt-2 ccl-u-mb-3">
                    
        <?php while( $guides->have_posts() ): $guides->the_post(); ?>
            <?php
            $guide_title    = get_the_title( $post->ID );
            $guide_url      = get_post_meta( $post->ID, 'guide_friendly_url', true );
            $guide_author   = get_post_meta( $post->ID, 'guide_owner', true );
            $guide_id       = get_post_meta( $post->ID, 'guide_id', true);
            $guide_content  = get_the_content( $post->ID );
            $guide_updated  = get_post_meta( $post->ID, 'guide_updated', true );
            $owner_email    = get_post_meta( $post->ID, 'guide_owner_email', true );
            $guide_descr    = get_post_meta( $post->ID, 'guide_description', true );
            $owner_id       = get_post_meta( $post->ID, 'guide_owner_id', true);
            
            $owner_pofile   = 'http://libguides.libraries.claremont.edu/prf.php?account_id='.$owner_id;
            $guide_descr    = !empty( $guide_descr ) ? $guide_descr : "Helpful resources for researching " . $guide_title;
            $guide_updated  = date( 'm/d/y', strtotime( $guide_updated ) );
            
            //http://libguides.libraries.claremont.edu/prf.php?account_id=103483
            
            ?>        
        
        <div class="ccl-l-column ccl-l-span-6-md">
            <div class="ccl-l-row ccl-c-guide-card ccl-c-guide-card--course">
                <div class="ccl-l-column ccl-l-span-7-md ccl-c-guide-card__title ">
                    <a class="ccl-h4 ccl-u-weight-bold" href="<?php echo esc_url( $guide_url ); ?>" target="_blank"><?php echo $guide_title; ?></a>
                </div>
                <div class="ccl-l-column ccl-l-span-5-md ccl-c-guide-card__meta">
                    <span class="ccl-b-icon person-open ccl-u-mr-nudge" aria-hidden="true"></span> <span><?php echo $guide_author; ?></span>
                </div>                 
                
            </div>

        </div>                                   
        <?php endwhile; wp_reset_postdata(); wp_reset_query();?>

    
    </div>                        
</div>

