<?php
/**
 * The template for displaying search results pages
 */
get_header(); ?>

	<section id="primary" class="content-area">
		<main id="main" class="site-main">

			<?php
			if ( have_posts() ) : ?>

				<header class="page-header">
					<h1 class="page-title"><?php
						printf( esc_html__( 'Search Results for: %s', '_s' ), '<span>' . get_search_query() . '</span>' );
						?></h1>
				</header>

				<?php
				/* Start the Loop */
				while ( have_posts() ) : the_post(); ?>

					<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

						<header class="entry-header">
							<?php the_title( sprintf( '<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>

						</header>

						<div class="entry-summary">
							<?php the_excerpt(); ?>
						</div>

					</article>
				<?php endwhile;

				the_posts_navigation();

			else :

				get_template_part( 'template-parts/content', 'none' );
			endif; ?>

		</main><!-- #main -->
	</section><!-- #primary -->

<?php

get_footer();