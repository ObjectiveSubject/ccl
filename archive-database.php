<?php
/**
 * Archive Template
 */

get_header();
$filter_by_letter = isset( $_GET['begins_with'] ) && '' !== $_GET['begins_with']; ?>

	<div class="site-content">

        <header class="ccl-c-hero">
            
            <div class="ccl-l-container">

				<div class="ccl-l-row">

					<div class="ccl-l-column ccl-l-span-third-lg">
						<div class="ccl-c-hero__header">
							<h1 class="ccl-c-hero__title">
                                <?php _e( 'Databases', 'ccl' ); ?>
                                <?php echo $filter_by_letter ? strtoupper( ': ' . $_GET['begins_with'] ) : ''; ?>
                            </h1>
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

                <?php 
                $shown_posts = 0;
                while ( have_posts() ) : the_post(); ?>

					<?php if ( $filter_by_letter ) {
						$first_letter = strtoupper( substr( get_the_title(), 0, 1 ) );
						$show_article = $first_letter == strtoupper( $_GET['begins_with'] );
					} else {
						$show_article = true;
					} ?>

                    <?php if ( $show_article ) : ?>

						<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>

							<header class="entry-header">
								<?php the_title( sprintf( '<h2 class="entry-title"><a href="%s" rel="bookmark">', esc_url( get_permalink() ) ), '</a></h2>' ); ?>

							</header>

							<div class="entry-summary">
								<?php the_excerpt(); ?>
							</div>

                        </article>

                        <?php $shown_posts++; ?>

					<?php endif; ?>

                <?php endwhile; ?>
                
                <?php if ( $shown_posts > 0 ) {
                    the_posts_navigation();
                } else {
                    echo '<p class="ccl-h1 ccl-u-mb-2">No posts found.</p>';
                } ?>

			<?php else : ?>

				<p class="ccl-h1 ccl-u-mb-2">No posts found.</p>

			<?php endif; ?>

		</div>

	</div>

<?php get_footer();
