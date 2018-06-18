<?php
/**
 * General page template
 */

get_header(); ?>

	<div id="content" class="site-content">

		<?php while ( have_posts() ) : the_post(); ?>

			<?php
			$thumb_url   		= get_the_post_thumbnail_url( $post, 'full' );
			$contextual_text	= get_post_meta( get_the_ID(), 'hero_context_text', true );
			$contextual_url 	= get_post_meta( get_the_ID(), 'hero_context_url', true );
			$custom_title 		= get_post_meta( get_the_ID(), 'hero_custom_title', true );
			$additional_excerpt = get_post_meta( get_the_ID(), 'hero_2nd_excerpt', true );
			$hero_height_pos	= get_post_meta( get_the_ID(), 'feat_img_placement', true);
			$title       		= $custom_title ? $custom_title : get_the_title();   // Could use 'the_title()' but this allows for override
			$description 		= ( $post->post_excerpt ) ? $post->post_excerpt: ''; // Could use 'the_excerpt()' but this allows for override
			//$hero_class  		= $thumb_url ? 'ccl-c-hero ccl-has-image':     'ccl-c-hero';

			if( $thumb_url && $hero_height_pos ){
				$hero_class = 'ccl-c-hero ccl-c-hero-custom-height--'. $hero_height_pos .' ccl-has-image';
			}elseif( $thumb_url) {
				$hero_class = 'ccl-c-hero ccl-has-image';
			}else{
				$hero_class =  'ccl-c-hero';
			}
			
			?>

			<main <?php post_class(); ?> aria-label="<?php echo $title; ?>">

				<div class="<?php echo esc_attr( $hero_class ); ?>" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)">

					<div class="ccl-c-hero__thumb" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)"></div>
					
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

										if ( ! $hide_blocks_nav && empty( $additional_excerpt ) ) {
											get_template_part( 'partials/block-anchors' );
										} 
									?>

									<?php if ( $description ) : ?>
										<div class="ccl-h4 ccl-u-mt-0"><?php echo apply_filters( 'the_excerpt', $description ); ?></div>
									<?php endif; ?>
									
									<?php if ( $additional_excerpt ) : ?>
										<div class="ccl-u-mt-0"><?php echo apply_filters( 'the_content', $additional_excerpt ); ?></div>
									<?php endif; ?>									
									
								</div>
							</div>
							
						</div>
						
						<?php get_template_part( 'partials/quick-links' ); ?>	

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

				<?php get_template_part( 'partials/blocks' ); ?>

			</main>

			<?php 
			//get the related posts from template part
			get_template_part( 'partials/related-posts' ); ?>

		<?php endwhile; ?>

	</div>

<?php get_footer();