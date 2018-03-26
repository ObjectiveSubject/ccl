<?php
/**
 * Archive Template
 */

get_header();

$pagination_args = array(
    'prev_text' => '<span class="ccl-h3 ccl-u-mr-1">&#8249; ' . __( 'Previous page', 'ccl' ) . '</span>',
    'next_text' => '<span class="ccl-h3 ccl-u-ml-1">' . __( 'Next page', 'ccl' ) . ' &#8250;</span>',
    'before_page_number' => '<span class="ccl-h3" style="margin-left:0.5rem;margin-right:0.5rem"><span class="meta-nav screen-reader-text">' . __( 'Page', 'ccl' ) . ' </span>',
    'after_page_number' => '</span>'
); 
?>

	<div class="site-content">

        <header class="ccl-c-hero ccl-is-naked">
            
            <div class="ccl-l-container">

				<div class="ccl-l-row">

					<div class="ccl-l-column ccl-l-span-third-lg">
						<div class="ccl-c-hero__header">
							<h1 class="ccl-c-hero__title">
                                <?php _e( 'News', 'ccl' ); ?>
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

                <div class="ccl-l-row">
                
                    <?php 
                    while ( have_posts() ) : the_post(); ?>

                        <div class="ccl-l-column ccl-l-span-6-md ccl-l-span-4-lg ccl-u-mb-2">

                            <article id="post-<?php the_ID(); ?>" <?php post_class() ?>>

                                <a href="<?php the_permalink() ?>" title="Read <?php the_title() ?>">

                                    <div class="ccl-b-media--16x9 ccl-u-mb-nudge" role="presentation" style="background-image:url(<?php echo get_the_post_thumbnail_url( get_the_ID(), 'medium' ) ?>)"></div>
                                    <p class="ccl-h4 ccl-u-faded ccl-u-mt-nudge"><?php echo get_the_date(); ?></p>
                                    <?php the_title( '<h2 class="ccl-h4 ccl-u-mt-nudge">', '</h2>' ) ?>
                                    <div class="ccl-u-mt-nudge"><?php echo get_the_excerpt() ?></div>

                                </a>

                            </article>

                        </div>

                    <?php endwhile; ?>

                </div>
                
                <div class="ccl-u-mt-3">
                    <?php the_posts_pagination( $pagination_args ); ?>
                </div>

			<?php else : ?>

				<p class="ccl-h1 ccl-u-mb-2">No posts found.</p>

			<?php endif; ?>

		</div>

	</div>

<?php get_footer();
