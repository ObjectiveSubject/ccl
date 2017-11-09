<?php
/**
 * The template for displaying the footer.
 */

$footer_options = get_option( 'footer-options' );
?>

	<footer id="colophon" class="ccl-c-footer ccl-u-pt-2 ccl-u-pb-3" role="contentinfo">
		
		<div class="ccl-l-container">
			
			<div class="ccl-l-row">

				<div class="ccl-l-column ccl-l-span-third-lg">

					<a href="<?php echo site_url(); ?>" class="ccl-b-logo ccl-is-vert ccl-u-mt-1">
						<span class="ccl-u-display-none"><?php echo bloginfo( 'name' ); ?></span>
					</a>

					<?php if ( has_nav_menu( 'footer_1' ) ) {
						wp_nav_menu( array(
							'theme_location' => 'footer_1',
							'menu_class' => 'ccl-c-menu ccl-is-primary',
							'container' => 'nav',
						) );
					} else {
						echo '<div class="ccl-u-mt-1"><a href="' . admin_url( 'nav-menus.php' ) . '" class="ccl-b-btn ccl-is-small ccl-is-inverse">Add a footer menu</a></div>';
					} ?>

				</div>

				<div class="ccl-l-column ccl-l-span-third-lg">
					<?php if ( array_key_exists( 'footer-column-1', $footer_options ) && $footer_options['footer-column-1'] ) : ?>

						<?php echo apply_filters( 'the_content', $footer_options['footer-column-1'] ); ?>

					<?php else : ?>
						<p>Add content to footer column 1</p>
					<?php endif; ?>
				</div>

				<div class="ccl-l-column ccl-l-span-third-lg">
					<?php if ( array_key_exists( 'footer-column-2', $footer_options ) && $footer_options['footer-column-2'] ) : ?>

						<?php echo apply_filters( 'the_content', $footer_options['footer-column-2'] ); ?>

					<?php else : ?>
						<p>Add content to footer column 2</p>
					<?php endif; ?>
				</div>

			</div>

			<p class="ccl-u-font-size-sm ccl-u-faded">&copy; <?php echo date('Y'); ?> Claremont Colleges Library</p>

		</div>

	</footer><!-- #colophon -->

</div><!-- #page -->

<span class="media-size"></span>

<?php wp_footer(); ?>

</body>
</html>
