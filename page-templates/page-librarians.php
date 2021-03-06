<?php
/**
 * Template Name: Librarian Archive
 */

get_header(); ?>

	<div id="content" class="site-content">

		<?php while ( have_posts() ) : the_post(); ?>

			<?php
			$thumb_url   = get_the_post_thumbnail_url( $post, 'full' );
			$title       = get_the_title();   // Could use 'the_title()' but this allows for override
			$description = ( $post->post_excerpt ) ? get_the_excerpt(): ''; // Could use 'the_excerpt()' but this allows for override
            $hero_class  = $thumb_url ? 'ccl-c-hero ccl-has-image':     'ccl-c-hero';
            $is_alpha_sort = strpos( $_SERVER['QUERY_STRING'], 'sort=alpha' ) > -1;
            $is_subject_sort = ( ! $is_alpha_sort );
			?>

			<article <?php post_class(); ?>>

				<div class="<?php echo esc_attr( $hero_class ); ?>" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)">

					<div class="ccl-c-hero__thumb" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)" role="presentaion"></div>
					
					<div class="ccl-l-container">

						<div class="ccl-l-row">

							<div class="ccl-l-column ccl-l-span-third-lg">
								<div class="ccl-c-hero__header">
									<h1 class="ccl-c-hero__title"><?php echo apply_filters( 'the_title', $title ); ?></h1>
								</div>
							</div>
							
						</div>

					</div>

				</div>

				<div class="ccl-l-container">

					<div class="ccl-l-row">
						<div class="ccl-c-entry-content ccl-l-column ccl-l-span-9-md ccl-u-my-2">
							<?php the_content(); ?>
						</div>
                    </div>
                    
                    <p>
                        <a href="?sort=subject" class="ccl-h4 ccl-u-mr-2 <?php echo ( ! $is_subject_sort ) ? 'ccl-u-faded' : 'ccl-u-color-school ccl-u-color-hover-black'; ?>">Alphabetical by Subject</a>
                        <a href="?sort=alpha" class="ccl-h4 <?php echo ( ! $is_alpha_sort ) ? 'ccl-u-faded' : 'ccl-u-color-school ccl-u-color-hover-black'; ?>">Alphabetical by Name</a>
                    </p>

                </div> 
                
                <?php if ( $is_subject_sort ) {
                    get_template_part( 'partials/librarian-subject-list' );
                } else {
                    get_template_part( 'partials/librarian-alpha-list' );
                } ?>

				<?php get_template_part( 'partials/blocks' ); ?>

			</article>

			<?php 
			//get the related posts from template part
			get_template_part( 'partials/related-posts' ); ?>

		<?php endwhile; ?>

	</div>

<?php get_footer();