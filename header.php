<?php
/**
 * The template for displaying the header.
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js" data-school="default">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>

	<div id="page">

		<?php \CCL\Helpers\get_component( 'user-nav' ); ?>

		<header id="masthead" class="ccl-c-masthead ccl-u-mb-1" role="banner">
			
			<div class="ccl-l-container">
				
				<div class="site-title ccl-h2" style="font-family: Georgia,serif">
					<a href="<?php echo get_home_url(); ?>">Claremont Colleges Library • VIT@L</a>
				</div>

				<hr/>

				<div class="ccl-l-row">
					<div class="ccl-l-column ccl-l-span-half-sm ccl-l-span-third-lg">
						<?php if ( has_nav_menu( 'header_1' ) ) {
							wp_nav_menu( array(
								'theme_location' => 'header_1',
								'menu_class' => 'ccl-c-menu ccl-is-primary',
								'container' => 'nav',
							) );
						} else {
							echo '<div class="ccl-u-mt-1"><a href="' . admin_url( 'nav-menus.php' ) . '" class="ccl-b-btn ccl-is-small">Add a primary menu</a></div>';
						} ?>
					</div>
					<div class="ccl-l-column ccl-l-span-half-sm ccl-l-span-third-lg">
						<?php if ( has_nav_menu( 'header_2' ) ) {
							wp_nav_menu( array(
								'theme_location' => 'header_2',
								'menu_class' => 'ccl-c-menu ccl-is-secondary',
								'container' => 'nav',
							) );
						} else {
							echo '<div class="ccl-u-mt-1"><a href="' . admin_url( 'nav-menus.php' ) . '" class="ccl-b-btn ccl-is-small">Add a secondary menu</a></div>';
						} ?>
					</div>
					<div class="ccl-l-column ccl-l-span-third-lg">
						<ul class="ccl-u-clean-list ccl-u-mt-1">
							<li>
								<hr class="ccl-u-my-nudge"/>
								<span class="ccl-h5"><i class="ccl-b-icon-clock" aria-hidden="true"></i> Today’s hours 7:30am - 9pm</span>
							</li>
							<li>
								<hr class="ccl-u-my-nudge"/>
								<span class="ccl-h5"><i class="ccl-b-icon-calendar" aria-hidden="true"></i> Relevent Calendar Item</span>
							</li>
							<li>
								<hr class="ccl-u-my-nudge"/>
								<span class="ccl-h5">
									<span style="color: red">
										<i class="ccl-b-icon-alert" aria-hidden="true"></i> Notice:
									</span>
									Relevent notice message
								</span>
							</li>
						</ul>
					</div>
				</div>

			</div>

		</header><!-- #masthead -->
