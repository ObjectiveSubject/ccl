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
					<a href="<?php echo get_home_url(); ?>" class="ccl-b-logo ccl-is-horz">
						<span class="ccl-u-display-none"><?php echo bloginfo( 'name' ); ?></span>
					</a>
				</div>

				<hr style="background:black"/>

				<?php $locations = get_nav_menu_locations(); ?>

				<div class="ccl-l-row">

					<div class="ccl-l-column ccl-l-span-half-sm ccl-l-span-third-lg">
						<?php if ( has_nav_menu( 'header_1' ) ) {
							echo \CCL\Helpers\header_menu( $locations[ 'header_1' ], 'ccl-is-primary' );
						} else {
							echo '<div class="ccl-u-mt-1"><a href="' . admin_url( 'nav-menus.php' ) . '" class="ccl-b-btn ccl-is-small">Add a primary header menu</a></div>';
						} ?>
					</div>

					<div class="ccl-l-column ccl-l-span-half-sm ccl-l-span-third-lg">
						<?php if ( has_nav_menu( 'header_2' ) ) {
							echo \CCL\Helpers\header_menu( $locations[ 'header_2' ], 'ccl-is-secondary' );							
						} else {
							echo '<div class="ccl-u-mt-1"><a href="' . admin_url( 'nav-menus.php' ) . '" class="ccl-b-btn ccl-is-small">Add a secondary header menu</a></div>';
						} ?>
					</div>

					<div class="ccl-l-column ccl-l-span-third-lg ccl-u-display-block-lg">
						<ul class="ccl-u-clean-list ccl-u-mt-1">
							<li>
								<hr class="ccl-u-my-nudge"/>
								<span class="ccl-h5"><i class="ccl-b-icon clock" aria-hidden="true"></i> Today’s hours 7:30am - 9pm</span>
							</li>
							<li>
								<hr class="ccl-u-my-nudge"/>
								<span class="ccl-h5"><i class="ccl-b-icon calendar" aria-hidden="true"></i> Relevent Calendar Item</span>
							</li>
							<li>
								<hr class="ccl-u-my-nudge"/>
								<span class="ccl-h5">
									<span class="ccl-u-color-red">
										<i class="ccl-b-icon alert" aria-hidden="true"></i> Notice:
									</span>
									Relevent notice message
								</span>
							</li>
						</ul>
					</div>
				</div>

			</div>

		</header><!-- #masthead -->
