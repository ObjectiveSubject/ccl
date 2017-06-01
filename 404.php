<?php
/**
 * General page template
 */

get_header();
?>

	<div class="site-content error-404">

		<article class="hentry">

			<h1 class="entry-title"><?php esc_html_e( 'Oops! That page can&rsquo;t be found.', 'ccl' ); ?></h1>

			<div class="entry-content">

				<p><?php esc_html_e( 'It looks like nothing was found at this location. Maybe try a search?', 'ccl' ); ?></p>

				<?php get_search_form(); ?>

			</div><!-- .entry-content -->

		</article>

	</div><!-- .error-404 -->

<?php get_footer();