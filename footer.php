<?php
/**
 * The template for displaying the footer.
 */

$footer_options = get_option( 'footer-options' );
?>

	<div class="ccl-c-school-band ccl-u-py-2" style="background-color:#F5F5F5" role="contentinfo" aria-label="Claremont Colleges Schools">
		<div class="ccl-l-container">
			<ul class="ccl-l-row ccl-l-align-center ccl-u-clean-list">
				<?php
				$schools = array(
					array( 'name' => 'Pomona', 				'url' => 'https://www.pomona.edu/', 		 'logo' => CCL_ASSETS . 'images/logos/pomona@2x.png', 			'width' => 96, 'height' => 40 ),
					array( 'name' => 'CGU', 				'url' => 'https://www.cgu.edu/', 			 'logo' => CCL_ASSETS . 'images/logos/cgu@2x.png', 				'width' => 108, 'height' => 58 ),
					array( 'name' => 'TCCS', 				'url' => 'https://www.services.claremont.edu/', 'logo' => CCL_ASSETS . 'images/logos/tccs@2x.png', 			'width' => 100, 'height' => 100 ),
					array( 'name' => 'Scripps', 			'url' => 'http://www.scrippscollege.edu/', 	 'logo' => CCL_ASSETS . 'images/logos/scrippscollege@2x.png',	'width' => 86, 'height' => 74 ),
					array( 'name' => 'Claremont McKenna', 	'url' => 'http://www.claremontmckenna.edu/', 'logo' => CCL_ASSETS . 'images/logos/claremontmckenna@2x.png', 'width' => 84, 'height' => 70 ),
					array( 'name' => 'Harvey Mudd', 		'url' => 'https://www.hmc.edu/', 			 'logo' => CCL_ASSETS . 'images/logos/hmc@2x.png', 				'width' => 64, 'height' => 66 ),
					array( 'name' => 'Pitzer', 				'url' => 'https://www.pitzer.edu/', 		 'logo' => CCL_ASSETS . 'images/logos/pitzer@2x.png', 			'width' => 114, 'height' => 36 ),
					array( 'name' => 'KGI', 				'url' => 'http://www.kgi.edu/', 			 'logo' => CCL_ASSETS . 'images/logos/kgi@2x.png', 				'width' => 158, 'height' => 36 ),

				);
				foreach ( $schools as $school ) : ?>
					<li class="ccl-l-column">
						<a href="<?php echo $school['url']; ?>" title="<?php echo $school['name']; ?>">
							<img src="<?php echo $school['logo']; ?>" 
								 class="ccl-u-display-block ccl-l-center" 
								 width="<?php echo $school['width']; ?>" 
								 height="<?php echo $school['height']; ?>" 
								 alt="<?php echo $school['name'] . ' logo'; ?>" />
						</a>
					</li>
				<?php endforeach; ?>
			</ul>
		</div>
	</div>

	<footer id="colophon" class="ccl-c-footer ccl-u-pt-2 ccl-u-pb-3" role="contentinfo">
		
		<div class="ccl-l-container">
			
			<div class="ccl-l-row">

				<div class="ccl-l-column ccl-l-span-third-lg">

					<a href="<?php echo site_url(); ?>" class="ccl-b-logo ccl-is-vert ccl-is-white ccl-u-mt-1">
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
