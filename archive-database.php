<?php
/**
 * Archive Template
 */

get_header();
$filter_by_letter = isset( $_GET['begins_with'] ) && '' !== $_GET['begins_with'];
$filter_by_subject = isset( $_GET['post_type'] ) && '' !== $_GET['post_type'];
$subject = get_queried_object(); ?>

	<div class="site-content">

        <header class="ccl-c-hero ccl-is-naked">
            
            <div class="ccl-l-container">

                <div><a href="<?php echo site_url('database-directory/'); ?>" class="ccl-c-hero__action">&laquo; Back to Database Directory</a></div>

				<div class="ccl-l-row">

					<div class="ccl-l-column ccl-l-span-third-lg">
						<div class="ccl-c-hero__header">
							<h1 class="ccl-c-hero__title">
                                <?php _e( 'Databases', 'ccl' ); ?>
                                <?php echo $filter_by_letter ? ': "' . strtoupper( $_GET['begins_with'] ) . '"' : ''; ?>
                                <?php echo $filter_by_subject ? ':<br/>' . $subject->name : ''; ?>
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
            
                <?php if ( get_query_var( 'paged' ) > 1 ) { 
                    the_posts_navigation(); 
                } ?>

                <?php 
                $shown_posts = 0;
                while ( have_posts() ) : the_post(); ?>

					<?php if ( $filter_by_letter ) {
						$first_letter = strtoupper( substr( get_the_title(), 0, 1 ) );
						$show_article = $first_letter == strtoupper( $_GET['begins_with'] );
					} else {
						$show_article = true;
					} ?>

                    <?php if ( $show_article ) :
                        
                        $database_friendly_url = get_post_meta( $post->ID, 'database_friendly_url', true );
                        $url = $database_friendly_url ? $database_friendly_url : get_permalink(); ?>

                        <article id="post-<?php the_ID(); ?>" <?php post_class('ccl-c-database ccl-u-mt-1'); ?>>
                        
                            <div class="ccl-l-row">

                                <header class="ccl-l-column ccl-l-span-12 ccl-l-span-6-md ccl-l-span-4-lg">
                                    <?php the_title( sprintf( '<h2 class="ccl-h4"><a href="%s" target="_blank" rel="bookmark">', esc_url( $url ) ), '</a></h2>' ); ?>
                                </header>

                                <div class="ccl-l-column">
                                    <?php the_excerpt(); ?>
                                </div>

                            </div>

                        </article>

                        <?php $shown_posts++; ?>

					<?php endif; ?>

                <?php endwhile; ?>
                
                <?php if ( $shown_posts > 0 ) : ?>
                    <div class="ccl-u-mt-3">
                        <?php the_posts_navigation(); ?>
                    </div>
                <?php else : ?>
                    <p class="ccl-h1">No posts found.</p>
                <?php endif; ?>

			<?php else : ?>

				<p class="ccl-h1 ccl-u-mb-2">No posts found.</p>

			<?php endif; ?>

		</div>

	</div>

<?php get_footer();
