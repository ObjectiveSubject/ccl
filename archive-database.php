<?php
/**
 * Archive Template
 */

get_header();

$begins_with = substr( sanitize_text_field( $_GET['begins_with'] ), 0, 1 ); // Sanitize and reduce to one character, technically could be validated against A-Z

$filter_by_letter = isset( $_GET['begins_with'] ) && '' !== $_GET['begins_with'];
$filter_by_subject = isset( $_GET['post_type'] ) && '' !== $_GET['post_type'];
$subject = get_queried_object();
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

                <div><a href="<?php echo site_url('database-directory/'); ?>" class="ccl-c-hero__action">&laquo; Back to Database Directory</a></div>

				<div class="ccl-l-row">

					<div class="ccl-l-column ccl-l-span-third-lg">
						<div class="ccl-c-hero__header">
							<h1 class="ccl-c-hero__title">
                                <?php _e( 'Databases', 'ccl' ); ?>
                                <?php echo $filter_by_letter ? ': "' . strtoupper( $begins_with ) . '"' : ''; ?>
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
            
                <?php 
                $shown_posts = 0;
                while ( have_posts() ) : the_post(); ?>

                    <?php 
                    if ( $filter_by_letter ) {
						$first_letter = strtoupper( substr( get_the_title(), 0, 1 ) );
						$show_article = $first_letter == strtoupper( $begins_with );
					} else {
						$show_article = true;
                    } 
                    ?>

                    <?php if ( $show_article ) :
                        
                        $database_friendly_url = get_post_meta( $post->ID, 'database_friendly_url', true );
                        $url = $database_friendly_url ? $database_friendly_url : get_permalink();
                        ?>

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
                        <?php the_posts_pagination( $pagination_args ); ?>
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
