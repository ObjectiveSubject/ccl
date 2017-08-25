<?php
/**
 * Template for the "post" post type homepage when set in admin
 *
 * For the root level homepage, see front-page.php (WordPress template hierarchy)
 */

get_header(); ?>

	<div class="site-content ccl-u-pb-3">

		<?php if ( have_posts() ) : ?>

			<?php while ( have_posts() ) : the_post(); ?>

				<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

					<header class="entry-header">
						<?php the_title( sprintf( '<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>

					</header>

					<div class="entry-summary">
						<?php the_excerpt(); ?>
					</div>

				</article>

			<?php endwhile; ?>

			<?php the_posts_navigation(); ?>

		<?php else : ?>

			<p>No posts found.</p>

		<?php endif; ?>

	</div>

<?php get_footer();