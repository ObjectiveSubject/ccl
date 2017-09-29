<?php
/**
 * The template for displaying search results pages
 */
get_header(); ?>

	<div class="site-content ccl-u-pb-3">

	<div class="ccl-l-container">

				<div class="ccl-l-row ccl-u-mb-3">
					<header class="page-header">

						<h1 class="page-title"><?php
							if ( have_posts() ) {
								printf( esc_html__( 'Search Results for: %s', '_s' ), '<strong>' . get_search_query() . '</strong>' );
							} else {
								printf( esc_html__( 'No Results for: %s', '_s' ), '<strong>' . get_search_query() . '</strong>' );
							}
							?></h1>
					
					</header>
				</div>

				<?php if ( have_posts() ) : ?>

					<?php while ( have_posts() ) : the_post(); ?>
						<div class="ccl-l-row ccl-u-mb-1">
							<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

								<header class="entry-header">
									<h2 class="entry-title"><a href="<?php echo esc_url( get_permalink() ); ?>" rel="bookmark"><?php the_title(); ?></a></h2>
								</header>

								<div class="entry-summary">
									<?php the_excerpt(); ?>
								</div>

							</article>
						</div>
					<?php endwhile; ?>

					<div class="ccl-l-row">
						<?php the_posts_navigation(); ?>
					</div>

				<?php endif; ?>

		</div>
	</div>

<?php

get_footer();