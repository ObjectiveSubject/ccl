<?php
/**
 * The root level homepage
 */

get_header(); ?>

	<div class="site-content">

		<?php while ( have_posts() ) : the_post();

			if ( 'page' == get_option( 'show_on_front' ) ) {

				$thumb_url   = get_the_post_thumbnail_url( $post, 'full' );
				$title       = get_the_title(); // write conditional for front-page being set
				$description = get_the_excerpt();
				$content	 = get_the_content();

			} else {
				// Fall backs if not front-page is set
				$thumb_url   = ''; // maybe set a default here?
				$title       = get_bloginfo( 'name' );
				$description = get_bloginfo( 'description' );
				$content     = 'No front page has been set to pull content from (see <code>Settings &gt; Reading</code>).';

			}
			$hero_class = $thumb_url ? 'ccl-c-hero ccl-has-image' : 'ccl-c-hero';
			?>

			<article <?php post_class(); ?>>

				<div class="ccl-c-masthead-search">
					<div class="ccl-l-container">
						<?php \CCL\Helpers\get_component( 'search-box' ); ?>
					</div>
				</div>

				<div class="<?php echo esc_attr( $hero_class ); ?>" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)">
					<div class="ccl-l-container">

						<div class="ccl-l-row">

							<div class="ccl-l-column ccl-l-span-third-lg">
								<div class="ccl-c-hero__header">
									<h1 class="ccl-c-hero__title"><?php echo apply_filters( 'the_title', $title ); ?></h1>
								</div>
							</div>

							<div class="ccl-l-column ccl-l-span-two-thirds-lg">
								<div class="ccl-c-hero__content">
									<div class="ccl-h4 ccl-u-mt-0"><?php echo apply_filters( 'the_excerpt', $description ); ?></div>
								</div>
							</div>
							
						</div>

					</div>

				</div>

				<div class="ccl-l-container">

					<div class="ccl-l-row">

						<div class="ccl-c-entry-content ccl-l-column ccl-l-span-8-md ccl-u-mt-2">
							<?php echo apply_filters( 'the_content', $content ); ?>
						</div>

					</div>

				</div>

				<?php get_template_part( 'partials/blocks' ); ?>

			</article>

		<?php endwhile; ?>

	</div>

<?php get_footer();
