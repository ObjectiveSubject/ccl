<?php
/**
 * Template Name: Database Directory
 */

get_header(); ?>

	<div class="site-content">

		<?php while ( have_posts() ) : the_post(); ?>

			<?php
			$thumb_url   = get_the_post_thumbnail_url( $post, 'full' );
			$title       = get_the_title();   // Could use 'the_title()' but this allows for override
			$description = ( $post->post_excerpt ) ? get_the_excerpt(): ''; // Could use 'the_excerpt()' but this allows for override
            $hero_class  = $thumb_url ? 'ccl-c-hero ccl-has-image':     'ccl-c-hero';
            $is_alpha_sort = strpos( $_SERVER['QUERY_STRING'], 'sort=alpha' ) > -1;
            $is_subject_sort = ( ! $is_alpha_sort );
            
			?>

			<article <?php post_class(); ?>>

				<div class="<?php echo esc_attr( $hero_class ); ?>" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)">

					<div class="ccl-c-hero__thumb" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)" role="presentaion"></div>
					
					<div class="ccl-l-container">

						<div class="ccl-l-row">

							<div class="ccl-l-column ccl-l-span-third-lg">
								<div class="ccl-c-hero__header">
									<h1 class="ccl-c-hero__title"><?php echo apply_filters( 'the_title', $title ); ?></h1>
								</div>
                            </div>
                            
                            <div class="ccl-l-column ccl-l-span-third-lg">
								<div class="ccl-c-hero__content">
								
                                    <ul class="ccl-c-hero__menu">
                                         <li>
                                            <a href="#block-database-search" class="js-smooth-scroll"><?php _e( 'Search Databases by Keyword', 'ccl' ); ?></a>
                                            <i class="ccl-b-icon arrow-down" aria-hidden="true"></i>
                                        </li>                                       
                                        <li>
                                            <a href="#block-subject" class="js-smooth-scroll"><?php _e( 'Databases by Subject', 'ccl' ); ?></a>
                                            <i class="ccl-b-icon arrow-down" aria-hidden="true"></i>
                                        </li>                                        
                                        <li>
                                            <a href="#block-title" class="js-smooth-scroll"><?php _e( 'Databases by Name', 'ccl' ); ?></a>
                                            <i class="ccl-b-icon arrow-down" aria-hidden="true"></i>
                                        </li>
                                        <li>
                                            <a href="#block-format" class="js-smooth-scroll"><?php _e( 'Databases by Format', 'ccl' ); ?></a>
                                            <i class="ccl-b-icon arrow-down" aria-hidden="true"></i>
                                        </li>
                                        <li>
                                            <a href="#block-vendor" class="js-smooth-scroll"><?php _e( 'Databases by Vendor', 'ccl' ); ?></a>
                                            <i class="ccl-b-icon arrow-down" aria-hidden="true"></i>
                                        </li>
                                    </ul>
        
								</div>
							</div>
							
							<div class="ccl-l-column ccl-l-span-third-lg">
								<?php if ( $description ) : ?>
									<div class="ccl-h4 ccl-u-mt-0"><?php echo apply_filters( 'the_excerpt', $description ); ?></div>
								<?php endif; ?>							    
							    
							</div>
							
						</div>

					</div>

                </div>
                
                <?php if ( get_the_content() ) : ?>

                    <div class="ccl-l-container">

                        <div class="ccl-l-row">
                            <div class="ccl-c-entry-content ccl-l-column ccl-l-span-9-md ccl-u-my-2">
                                <?php the_content(); ?>
                            </div>
                        </div>
                        
                    </div> 
                    
                <?php endif; ?>

                <div class="ccl-l-container ccl-u-mb-3">
                    
                    <div id="block-database-search" class="ccl-c-promo ccl-u-mt-4">
                        <h2 class="ccl-u-mt-0"><?php _e('Search Databases by Keyword','ccl'); ?></h2>                        
                       <?php get_template_part('partials/post-search'); ?> 
                    </div>
                    
                    <div id="block-subject" class="ccl-c-promo ccl-u-mt-4">
                        
                        <h2 class="ccl-u-mt-0"><?php _e('Databases by Subject','ccl'); ?></h2>


                        <?php $subjects = get_terms( array( 
                            'post_types'    => 'database',
                            'taxonomy'      => 'subject',
                            'parent'        => 0
                        ) );
                        
                        // foreach( $subjects as $subject ){
                        //     $args = array('post_type' => 'database',
                        //         'tax_query' => array(
                        //             array(
                        //                 'taxonomy' => 'subject',
                        //                 'field' => 'slug',
                        //                 'terms' => $subject->slug,
                        //             ),
                        //         ),
                        //      ); 
                        //     $loop = new WP_Query($args);  
                            
                        //     echo '<pre>';
                        //     print_r( $loop->post_count );
                        //     echo '</pre>';                           
                        // }                    
                        
                        if ( $subjects ) : ?>
                            
                            <ul class="ccl-u-ml-2 ccl-u-clean-list ccl-u-mt-1 ccl-u-columns-2-md ccl-u-columns-3-lg">

                            <?php foreach ( $subjects as $subject ) : ?>
                                    <li style="line-height:2"><a class="ccl-h4" href="<?php echo get_term_link( $subject, 'subject' ) . '?post_type=database'; ?>"><?php echo $subject->name; ?></a></li>
                            <?php endforeach; ?>

                            </ul>

                        <?php endif; ?>

                    </div>                    
                    
                    <div id="block-title" class="ccl-c-promo ccl-u-mt-4">

                        <h2 class="ccl-u-mt-0"><?php _e('Databases by Title','ccl'); ?></h2>

                        <?php $letters = array( 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z' ); ?>
                        <ul class="ccl-u-ml-2 ccl-u-clean-list ccl-u-mt-1">
                            <?php foreach ( $letters as $letter ) :?> 
                                <li class=" ccl-h4 ccl-u-mt-nudge ccl-u-display-inline-block">
                                    <a href="<?php echo get_post_type_archive_link( 'database' ) . '&begins_with=' . $letter; ?>" style="padding:0 0.5em"><?php echo $letter; ?></a>
                                    <span class="ccl-u-weight-medium ccl-u-faded">|</span>
                                </li>
                            <?php endforeach; ?>
                        </ul>

                    </div>


                    <div id="block-format" class="ccl-c-promo ccl-u-mt-4">
                        
                        <h2 class="ccl-u-mt-0"><?php _e('Databases by Format/Type','ccl'); ?></h2>

                        <?php $formats = get_terms( array( 
                            'taxonomy' => 'format',
                        ) );
                        
                        if ( $formats ) : ?>
                            
                            <ul class="ccl-u-ml-2 ccl-u-clean-list ccl-u-mt-1 ccl-u-columns-2-md ccl-u-columns-3-lg">

                            <?php foreach ( $formats as $format ) : ?>

                                    <li style="line-height:2"><a class="ccl-h4" href="<?php echo get_term_link( $format, 'format' ) . '?post_type=database'; ?>"><?php echo $format->name; ?></a></li>
                            <?php endforeach; ?>

                            </ul>

                        <?php endif; ?>

                    </div>

                    <?php $vendors = get_terms( array( 
                        'taxonomy'      => 'database_vendor',
                        'post_types'    => 'database'
                    ) );?>
                    
                    <?php if ( $vendors ) : ?>
                        
                    <div id="block-vendor" class="ccl-c-promo ccl-u-mt-4">
                        
                        <h2 class="ccl-u-mt-0"><?php _e('Databases by Vendor','ccl'); ?></h2>                          
                            
                            <ul class="ccl-u-ml-2 ccl-u-clean-list ccl-u-mt-1 ccl-u-columns-2-md ccl-u-columns-3-lg">

                                <?php foreach ( $vendors as $vendor ) : ?>
    
                                        <li style="line-height:2"><a class="ccl-h4" href="<?php echo get_term_link( $vendor, 'vendor' ) . '?post_type=database'; ?>"><?php echo $vendor->name; ?></a></li>
                                <?php endforeach; ?>

                            </ul>
                    </div>
                    
                    <?php endif; ?>
                </div>
                
				<?php get_template_part( 'partials/blocks' ); ?>

			</article>

			<?php $related_posts = \CCL\Helpers\get_ccl_related_posts(); ?>

			<?php if ( $related_posts && $related_posts->have_posts() ) : ?>
				<div class="ccl-c-related ccl-u-bg-school ccl-u-py-2">

					<div class="ccl-l-container">

						<h2 class="ccl-c-related__title ccl-u-mt-0">Related</h2>

						<div class="ccl-l-row ccl-u-mt-1">

							<?php while ( $related_posts->have_posts() ) : $related_posts->the_post(); ?>
								<article class="ccl-c-related__post ccl-l-column ccl-l-span-4-md ccl-u-mb-1">

									<?php if ( has_post_thumbnail() ) : ?>
										<div class="ccl-u-mb-nudge">
											<a href="<?php echo get_the_permalink(); ?>">
												<?php echo get_the_post_thumbnail( get_the_ID(), 'small', array( 'class' => 'ccl-c-image' ) ); ?>
											</a>
										</div>
									<?php endif; ?>

									<p class="ccl-h4 ccl-u-mt-0"><a href="<?php echo get_the_permalink(); ?>"><?php echo get_the_title(); ?></a></p>
									<p class="ccl-h5 ccl-u-faded ccl-u-mb-1"><?php echo get_the_excerpt(); ?></p>
									<p><a href="<?php echo get_the_permalink(); ?>" class="ccl-b-btn ccl-is-brand-inverse ccl-is-small" aria-label="<?php echo 'Learn more about ' . get_the_title(); ?>">Learn more</a></p>
								</article>

							<?php endwhile; ?>

						</div>
						
					</div>

				</div>

			<?php endif; ?>

		<?php endwhile; ?>

	</div>

<?php get_footer();