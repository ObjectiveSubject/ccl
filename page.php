<?php
/**
 * General page template
 */

get_header(); ?>

	<div class="site-content ccl-u-pb-3">

		<?php while ( have_posts() ) : the_post(); ?>

			<?php
			$thumb_url   = get_the_post_thumbnail_url( $post, 'full' );
			$title       = get_the_title();   // Could use 'the_title()' but this allows for override
			$description = ( $post->post_excerpt ) ? get_the_excerpt() : ''; // Could use 'the_excerpt()' but this allows for override
			?>

			<article <?php post_class(); ?>>

				<div class="ccl-c-hero" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)">
					<div class="ccl-c-hero__container">
						<div class="ccl-c-hero__header">
							<h1 class="ccl-c-hero__title"><?php echo apply_filters( 'the_title', $title ); ?></h1>
						</div>

						<div class="ccl-c-hero__content">
							<div class="ccl-h4 ccl-u-mt-0"><?php echo apply_filters( 'the_excerpt', $description ); ?></div>
						</div>

					</div>

				</div>

				<div class="ccl-l-container">

					<div class="ccl-l-row">
						<div class="ccl-c-entry-content ccl-l-column ccl-l-span-8-md ccl-u-my-2">
							<?php the_content(); ?>
						</div>
					</div>

				</div>

				<?php
				$blocks = get_post_meta( get_the_ID(), 'block_group', true );

				// The block check will almost always be true
				// The extended check is to see if a single empty "WYSIWYG" block has been saved
				if ( is_array( $blocks ) && ! ( 1 == count( $blocks ) && 'wysiwyg' == $blocks[0]['block_type'] && '' != $blocks[0]['block_description'] ) ) : ?>

					<!-- ### Blocks -->

					<?php foreach ( $blocks as $index => $block ) : ?>

						<?php if ( 'carousel' == $block['block_type'] ) : ?>
							
							<div class="ccl-l-container">

								<div id="block-<?php echo $index; ?>" class="ccl-c-promo">

									<header class="ccl-c-promo__header">

										<?php if ( isset( $block['block_title'] ) && $block['block_title'] ) : ?>

											<div class="ccl-c-promo__title"><?php echo $block['block_title']; ?></div>

										<?php endif; ?>

										<?php if ( isset( $block['block_cta'] ) && $block['block_cta'] ) : ?>

											<div class="ccl-c-promo__cta">
												<?php echo apply_filters( 'the_content', $block['block_cta'] ); ?>
											</div>

										<?php endif; ?>
										
										<div class="ccl-c-promo__action">
											<button id="carousel-<?php echo $index; ?>-prev" class="ccl-b-btn--circular prev" aria-label="previous slide">&larr;</button>
											<button id="carousel-<?php echo $index; ?>-next" class="ccl-b-btn--circular next" aria-label="next slide">&rarr;</button>
										</div>

									</header>

									<div class="ccl-c-promo__content">        

										<?php if ( isset ( $block['block_items'] ) && $block['block_items'] ) : ?>

											<div class="ccl-c-carousel js-promo-carousel" data-slick='{ "slidesToShow": 2, "prevArrow": "#carousel-<?php echo $index; ?>-prev", "nextArrow": "#carousel-<?php echo $index; ?>-next" }'>

												<?php if ( isset( $block['block_description'] ) && $block['block_description'] ) : ?>

													<article class="ccl-c-promo__description ccl-c-carousel__slide">
														<div style="max-width:300px"><?php echo apply_filters( 'the_content', $block['block_description'] ); ?></div>
													</article>

												<?php endif; ?>

												<?php foreach ( (array) $block['block_items'] as $image_id => $image_url ) : ?>
													<article class="ccl-c-carousel__slide">
														<div class="ccl-u-mb-nudge"><?php echo wp_get_attachment_image( $image_id ); ?></div>
														<p class="ccl-h4 ccl-u-mt-0"><?php echo get_the_title( $image_id ); ?></p>
														<p class="ccl-h4 ccl-u-mt-0 ccl-u-faded"><?php echo get_the_excerpt( $image_id ); ?></p>
													</article>
												<?php endforeach; ?>
												
											</div>

										<?php endif; ?>

									</div>

								</div>

							</div>

						<?php elseif ( 'banner' == $block['block_type'] ) : ?>

							<div class="ccl-c-banner">

								<?php foreach ( (array) $block['block_items'] as $image_id => $image_url ) : ?>

									<?php
									echo wp_get_attachment_image( $image_id, 'large' );
									break; // only get first image, break after
									?>

								<?php endforeach; ?>
	
							</div>

						<?php else : ?>

							<div class="ccl-l-container">

								<div id="block-<?php echo $index; ?>" class="ccl-c-promo">

									<header class="ccl-c-promo__header">

										<?php if ( isset( $block['block_title'] ) && $block['block_title'] ) : ?>

											<div class="ccl-c-promo__title"><?php echo $block['block_title']; ?></div>

										<?php endif; ?>

										<?php if ( isset( $block['block_cta'] ) && $block['block_cta'] ) : ?>

											<div class="ccl-c-promo__cta">
												<?php echo apply_filters( 'the_content', $block['block_cta'] ); ?>
											</div>

										<?php endif; ?>

									</header>

									<div class="ccl-c-promo__content">        

										<?php if ( isset( $block['block_description'] ) && $block['block_description'] ) : ?>
										
											<div class="ccl-c-promo__description">
												<?php echo apply_filters( 'the_content', $block['block_description'] ); ?>
											</div>

										<?php endif; ?>

									</div>

								</div>

							</div>

						<?php endif; ?>

					<?php endforeach; ?>
					
					<!-- End Blocks -->

				<?php endif; ?>

			</article>

		<?php endwhile; ?>

	</div>

<?php get_footer();