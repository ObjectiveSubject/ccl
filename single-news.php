<?php
/**
 * Single: News
 */

get_header(); ?>

	<div id="content" class="site-content">

		<?php while ( have_posts() ) : the_post(); ?>

			<article <?php post_class(); ?>>

				<div class="ccl-c-hero">

					<div class="ccl-c-hero__thumb" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)" role="presentaion"></div>
					
					<div class="ccl-l-container">

						<div class="ccl-c-hero__header">
                            <div class="ccl-h4"><a href="<?php echo get_post_type_archive_link( 'news' ) ?>" class="ccl-u-faded ccl-u-color-white">&#8249; See all News</a></div>
                            <h1 class="ccl-c-hero__title"><?php the_title() ?></h1>
                            <p class="ccl-h4"><?php the_date(); ?></p>
                        </div>

					</div>

				</div>

				<div class="ccl-l-container">

					<div class="ccl-l-row">

						<div class="ccl-c-entry-content ccl-l-column ccl-l-span-9-md ccl-u-my-2">
                            <?php the_post_thumbnail( 'large' ); ?>
							<?php the_content(); ?>
						</div>

					</div>

				</div>

			</article>

		<?php endwhile; ?>

	</div>

<?php get_footer();