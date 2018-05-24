<?php
/**
 * The main template file
 *
 * This is mostly a fall back, in case a query doesn't hit any other template.
 * For the root level homepage, see front-page.php (WordPress template hierarchy).
 */

get_header(); ?>

	<div id="content" class="site-content">

		<div class="ccl-l-container">

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

				<p class="ccl-h1 ccl-u-mb-2">No posts found.</p>

			<?php endif; ?>

		</div>

	</div>

<?php get_footer();
