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

		<?php \CCL\Helpers\get_component( 'quick-nav' ); ?>

		<header id="masthead" class="ccl-c-masthead ccl-u-mb-1" role="banner">
			
			<div class="ccl-l-container">
				
				<div class="ccl-c-masthead__brand">
					<a href="<?php echo get_home_url(); ?>" class="ccl-b-logo ccl-is-horz">
						<span class="ccl-u-display-none"><?php echo bloginfo( 'name' ); ?></span>
					</a>
				</div>

				<div class="ccl-c-masthead__nav">

					<?php $locations = get_nav_menu_locations(); ?>

					<?php if ( has_nav_menu( 'header_1' ) ) {
						echo \CCL\Helpers\header_menu( $locations[ 'header_1' ], 'ccl-is-primary ccl-c-masthead__nav-item' );
					} else {
						echo '<div class="ccl-u-mt-1"><a href="' . admin_url( 'nav-menus.php' ) . '" class="ccl-b-btn ccl-is-small">Add a primary header menu</a></div>';
					} ?>

					<?php if ( has_nav_menu( 'header_2' ) ) {
						echo \CCL\Helpers\header_menu( $locations[ 'header_2' ], 'ccl-is-secondary ccl-c-masthead__nav-item' );							
					} else {
						echo '<div class="ccl-u-mt-1"><a href="' . admin_url( 'nav-menus.php' ) . '" class="ccl-b-btn ccl-is-small">Add a secondary header menu</a></div>';
					} ?>
				
					<ul class="ccl-c-masthead__status ccl-c-masthead__nav-item">
						<li>
							<span class="ccl-h5"><i class="ccl-b-icon clock" aria-hidden="true"></i> Today’s hours 7:30am - 9pm</span>
						</li>
						<li>
							<span class="ccl-h5"><i class="ccl-b-icon calendar" aria-hidden="true"></i> Relevent Calendar Item</span>
						</li>
						<li>
							<span class="ccl-h5">
								<span class="ccl-u-color-red">
									<i class="ccl-b-icon alert" aria-hidden="true"></i> Notice:
								</span>
								Relevent notice message
							</span>
						</li>
					</ul>

					<?php if ( has_nav_menu( 'header_1' ) ) { ?>
						
							<?php echo \CCL\Helpers\header_sub_menu( $locations[ 'header_1' ], 'ccl-c-sub-menu-container ccl-is-primary ccl-c-masthead__nav-item' ); ?>
						
					<?php } ?>

					<?php if ( has_nav_menu( 'header_2' ) ) { ?>
						
							<?php echo \CCL\Helpers\header_sub_menu( $locations[ 'header_2' ], 'ccl-c-sub-menu-container ccl-is-secondary ccl-c-masthead__nav-item' ); ?>
						
					<?php } ?>

				</div>

			</div>

		</header><!-- #masthead -->
