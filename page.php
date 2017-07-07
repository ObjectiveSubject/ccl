<?php
/**
 * General page template
 */

get_header(); ?>

	<div class="site-content">

		<?php while ( have_posts() ) : the_post();
		
			$thumb_url = get_the_post_thumbnail_url( $post, 'full' ); ?>

			<article <?php post_class(); ?>>

				<div class="ccl-c-hero" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)">
					<div class="ccl-c-hero__container">
						
						<div class="ccl-c-hero__header">
							<h1 class="ccl-c-hero__title"><?php the_title(); ?></h1>
						</div>
					
						<div class="ccl-c-hero__content">
							
							<div class="ccl-h4 ccl-u-mt-0"><?php the_excerpt(); ?></div>

						</div>
					
					</div>

				</div>

				<div class="ccl-l-container">
					
					<div class="ccl-l-row">

						<div class="ccl-l-column ccl-l-span-8-md ccl-u-mt-2">
							<?php the_content(); ?>
						</div>

					</div>
					
				</div>

			</article>

		<?php endwhile; ?>

	</div>

<?php get_footer();