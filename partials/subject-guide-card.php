<?php
// replace with get_terms()
$all_subjects  = get_terms( array( 'taxonomy' => 'subject' ) );				

if ( empty( $all_subjects) ) : ?>
		<div class="ccl-l-container">

			<div class="ccl-l-row">
				<div class="ccl-c-entry-content ccl-l-column ccl-l-span-9-md ccl-u-my-2">

					<div class="ccl-c-alert ccl-is-error">No Libguides have been imported</div>

				</div>
			</div>

		</div>
<?php endif; ?>

<div class="ccl-l-container">
    <div class="ccl-l-row ccl-u-mt-2 ccl-u-mb-3">

        <?php foreach ( $all_subjects as $key => $subject ) : ?>  
                    
            <?php 
                $guides = new WP_Query(array(
                    'post_type' => 'guide',
                    'posts_per_page' => 20,
                    'order' => 'ASC',
                    'orderby'   => 'title',
                    'tax_query' => array(
                        array(
                            'taxonomy' => 'subject',
                            'field' => 'slug',
                            'terms' => array( $subject->slug )
                        )
                    )
                ));
                
                $subject_guides = $guides->posts;
                
                $subject_guide_len = count( $subject_guides );
            ?>
            
        <?php if( $guides->have_posts() ): ?>
        <div id="<?php echo $subject->slug; ?>" class="ccl-l-column ccl-l-span-6-md">                        
            <div class="ccl-c-accordion" role="list">
                <div class="ccl-c-accordion__toggle">
                    <span><?php echo $subject->name; ?></span>
                    <span class="ccl-c-guide-card__count">(<?php echo $subject_guide_len; ?>)</span>                                     
                </div>
                <div class="ccl-c-accordion__content">
                       
                    <?php foreach($subject_guides as $key => $post ): setup_postdata( $post ); ?>
                    
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
                        
                        <div class="ccl-c-guide-card" role="listitem" aria-label="<?php echo 'Information about the ' . $guide_title . ' guide'; ?>">
                            <div class="ccl-l-row">
                                
                                <div class="ccl-l-column ccl-l-span-7-md ccl-c-guide-card__title">
                                    <a class="ccl-h4 ccl-u-weight-bold" href="<?php echo esc_url( $guide_url ); ?>" target="_blank"><?php echo $guide_title; ?></a>
                                </div>
                                <div class="ccl-l-column ccl-l-span-5-md ccl-c-guide-card__meta">

                                    <i class="ccl-b-icon person-open ccl-u-mr-nudge" aria-hidden="true"></i><span><?php echo $guide_author; ?></span>

                                </div>        
                            </div>
                        </div>
 
                    
                    <?php endforeach; ?>
                </div>
            </div> 
        </div>                                   
        <?php endif; ?>
                    
        <?php endforeach; wp_reset_postdata(); wp_reset_query();?>  
    
    </div>                        
</div>

