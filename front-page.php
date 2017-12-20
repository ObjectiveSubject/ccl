<?php
/**
 * The root level homepage
 */

get_header(); ?>

	<div class="site-content">

		<?php while ( have_posts() ) : the_post();

			if ( 'page' == get_option( 'show_on_front' ) ) {

				$thumb_url   	 = get_the_post_thumbnail_url( $post, 'large' );
				$contextual_text = get_post_meta( get_the_ID(), 'hero_context_text', true );
				$contextual_url  = get_post_meta( get_the_ID(), 'hero_context_url', true );
				$custom_title 	 = get_post_meta( get_the_ID(), 'hero_custom_title', true );
				$title       	 = $custom_title ? $custom_title : get_the_title();   // Could use 'the_title()' but this allows for override
				$description 	 = $post->post_excerpt;
				$content	 	 = get_the_content();

			} else {
				// Fall backs if not front-page is set
				$thumb_url   = ''; // maybe set a default here?
				$title       = get_bloginfo( 'name' );
				$description = get_bloginfo( 'description' );
				$content     = 'No front page has been set to pull content from (see <code>Settings &gt; Reading</code>).';

			}
			$hero_class = $thumb_url ? 'ccl-c-hero ccl-has-search ccl-has-image' : 'ccl-c-hero ccl-has-search';
			?>

			<article <?php post_class(); ?>>

				<div class="<?php echo esc_attr( $hero_class ); ?>" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)">

					<div class="ccl-l-container">
						<?php \CCL\Helpers\get_component( 'search-box' ); ?>
					</div>

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

							<div class="ccl-l-column">
								<div class="ccl-c-hero__header">	
									<h1 class="ccl-c-hero__title"><?php echo apply_filters( 'the_title', $title ); ?></h1>
								</div>
							</div>

							<?php if ( ! empty( $description ) || \CCL\Helpers\has_block_content() ) : ?>
								<div class="ccl-l-column ccl-l-span-two-thirds-lg">
									<div class="ccl-c-hero__content">
									
										<?php 
										$hide_blocks_nav = get_post_meta( get_the_ID(), 'hero_hide_blocks_nav' );

										if ( ! $hide_blocks_nav ) {
											get_template_part( 'partials/block-anchors' );
										} 
										
										if ( $description ) : ?>
											<div class="ccl-h4 ccl-u-mt-0"><?php echo apply_filters( 'the_excerpt', $description ); ?></div>
										<?php endif; ?>
									
									</div>
								</div>
							<?php endif; ?>
							
						</div>

						<?php get_template_part( 'partials/quick-links' ); ?>

					</div>

				</div>

				<div class="ccl-l-container">

					<div class="ccl-l-row">

						<div class="ccl-c-entry-content ccl-l-column ccl-l-span-9-md ccl-u-my-2">
							<?php echo apply_filters( 'the_content', $content ); ?>
						</div>

					</div>

				</div>

				<?php get_template_part( 'partials/blocks' ); ?>

			</article>

		<?php endwhile; ?>

	</div>

<?php get_footer();
