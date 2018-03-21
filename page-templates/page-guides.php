<?php
/**
 * Template Name: LibGuides Archive
 */

get_header(); ?>

	<div class="site-content">

		<?php while ( have_posts() ) : the_post(); ?>
			
			<?php
			$thumb_url   	 = get_the_post_thumbnail_url( $post, 'full' );
			$contextual_text = get_post_meta( get_the_ID(), 'hero_context_text', true );
			$contextual_url  = get_post_meta( get_the_ID(), 'hero_context_url', true );
			$custom_title 	 = get_post_meta( get_the_ID(), 'hero_custom_title', true );
			$title       	 = $custom_title ? $custom_title : get_the_title();   // Could use 'the_title()' but this allows for override
			$description 	 = ( $post->post_excerpt ) ? $post->post_excerpt: ''; // Could use 'the_excerpt()' but this allows for override
			$hero_class  	 = $thumb_url ? 'ccl-c-hero ccl-has-image':     'ccl-c-hero';
            $is_subject_sort = ! array_key_exists( 'sort', $_GET ) || strpos( $_SERVER['QUERY_STRING'], 'sort=subject' ) > -1;
            $is_course_sort = ( ! $is_subject_sort );


			?>

			<article <?php post_class(); ?>>

				<div class="<?php echo esc_attr( $hero_class ); ?>" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)">

					<div class="ccl-c-hero__thumb" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)" role="presentaion"></div>
					
					<div class="ccl-l-container">

						<?php if ( $contextual_text ) : ?>
							<?php if ( $contextual_url ) : ?>
								<div><a href="<?php echo $contextual_url; ?>" class="ccl-c-hero__action"><?php echo $contextual_text; ?></a></div>
							<?php else : ?>
								<div><span class="ccl-c-hero__action"><?php echo $contextual_text; ?></span></div>
							<?php endif; ?>
						<?php endif; ?>

						<div class="ccl-l-row">

							<div class="ccl-l-column ccl-l-span-third-lg">
								<div class="ccl-c-hero__header">
									<h1 class="ccl-c-hero__title">
										<?php echo apply_filters( 'the_title', $title ); ?>
									</h1>
								</div>
							</div>

							<div class="ccl-l-column ccl-l-span-two-thirds-lg">
								<div class="ccl-c-hero__content">
								
									<?php 
										$hide_blocks_nav = get_post_meta( get_the_ID(), 'hero_hide_blocks_nav' );

										if ( ! $hide_blocks_nav ) {
											get_template_part( 'partials/block-anchors' );
										} 
									?>

									<?php if ( $description ) : ?>
										<div class="ccl-h4 ccl-u-mt-0"><?php echo apply_filters( 'the_excerpt', $description ); ?></div>
									<?php endif; ?>
									
								</div>
							</div>
							
						</div>

					</div>

				</div>

 

                    <div class="ccl-l-container">

                        <div class="ccl-l-row">
                            <div class="ccl-c-entry-content ccl-l-column ccl-l-span-9-md ccl-u-my-2">
               				<?php if ( get_the_content() ) : ?>                            	
                                <?php the_content(); ?>
                			<?php endif; ?>                                
                            </div>
                        </div>
                        
	                    <p>
	                        <a href="?sort=subject" class="ccl-h4 ccl-u-mr-2 <?php echo ( ! $is_subject_sort ) ? 'ccl-u-faded' : 'ccl-u-color-school ccl-u-color-hover-black'; ?>">Guides by Subject</a>
	                        <a href="?sort=course" class="ccl-h4 <?php echo ( ! $is_course_sort ) ? 'ccl-u-faded' : 'ccl-u-color-school ccl-u-color-hover-black'; ?>">Guides for Courses</a>
	                    </p>    

                    </div>

                <?php if ( $is_subject_sort ) {
                    get_template_part( 'partials/subject-guide-card' );
                } else {
                    get_template_part( 'partials/course-guide-card' );
                } ?>

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
									<p><a href="<?php echo get_the_permalink(); ?>" class="ccl-b-btn ccl-is-brand-inverse ccl-is-small">Learn more</a></p>
								</article>

							<?php endwhile; ?>

						</div>
						
					</div>

				</div>

			<?php endif; ?>

		<?php endwhile; ?>

	</div>

<?php get_footer();