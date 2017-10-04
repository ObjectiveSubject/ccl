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
				if ( is_array( $blocks ) && ! ( 1 == count( $blocks ) && 'wysiwyg' == $blocks[0]['block_type'] ) && '' != $blocks[0]['block_description'] ) : ?>

					<!-- ### Blocks -->
					<div class='ccl-l-container'>

						<?php foreach ( $blocks as $block ) : ?>

							<div class="block-<?php echo esc_attr( $block['block_type'] ); ?>">

								<?php if ( isset( $block['block_title'] ) && $block['block_title'] ) : ?>

									<h3 class="block-title">
										<?php echo apply_filters( 'the_title', $block['block_title'] ); ?>
									</h3>

								<?php endif; ?>

								<?php if ( isset( $block['block_description'] ) && $block['block_description'] ) : ?>

									<div class="block-description">
										<?php echo apply_filters( 'the_content', $block['block_description'] ); ?>
									</div>

								<?php endif; ?>

								<?php if ( isset( $block['block_items'] ) && $block['block_items'] ) : ?>

									<?php if ( 'carousel' == $block['block_type'] ) : ?>

										<div class="block-images">
											<ul>
											<?php foreach ( (array) $block['block_items'] as $image_id => $image_url ) : ?>

												<li><?php echo wp_get_attachment_image( $image_id, 'large' ); ?></li>

											<?php endforeach; ?>

											</ul>
										</div>

									<?php elseif ( 'banner' == $block['block_type'] ) : ?>

										<div class="block-banner-image">
											<?php foreach ( (array) $block['block_items'] as $image_id => $image_url ) : ?>

												<?php
												echo wp_get_attachment_image( $image_id, 'banner' ); // banner size may not exist
												break; // only get first image, break after
												?>

											<?php endforeach; ?>

										</div>

									<?php endif; ?>

								<?php endif; ?>

							</div>

						<?php endforeach; ?>

					</div>
					<!-- End Blocks -->

				<?php endif; ?>

			</article>

		<?php endwhile; ?>

	</div>

<?php get_footer();