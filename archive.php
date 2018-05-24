<?php
/**
 * Archive Template
 */

get_header(); ?>

	<div id="content" class="site-content">

        <header class="ccl-c-hero">
            
            <div class="ccl-l-container">

				<div class="ccl-l-row">

					<div class="ccl-l-column ccl-l-span-third-lg">
						<div class="ccl-c-hero__header">
							<h1 class="ccl-c-hero__title"><?php the_archive_title(); ?></h1>
						</div>
					</div>

					<div class="ccl-l-column ccl-l-span-two-thirds-lg">
						<div class="ccl-c-hero__content">
							<div class="ccl-h4 ccl-u-mt-0"><?php echo the_archive_description(); ?></div>
						</div>
					</div>
					
				</div>

			</div>

        </header>

        <div class="ccl-l-container ccl-u-my-3">

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
