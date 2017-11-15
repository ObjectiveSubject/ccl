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

		<nav class="ccl-c-quick-nav">

			<div class="ccl-c-quick-nav__bar">
			
				<div class="ccl-c-quick-nav__item ccl-is-brand">
					<a href="<?php echo get_home_url(); ?>" class="ccl-b-logo ccl-is-standalone">
						<span class="ccl-u-display-none"><?php echo bloginfo( 'name' ); ?></span>
					</a>
				</div>

				<div class="ccl-c-dropdown ccl-c-quick-nav__item ccl-is-lazy ccl-has-divider">
				
					<a href="#dropdown-site-menus" class="ccl-c-dropdown__toggle ccl-c-quick-nav__item-text" data-toggle="dropdown" data-target="#dropdown-site-menus" aria-expanded="false" aria-haspopup="true">
						<?php 
							if ( is_front_page() ) {
								_e( 'Home', 'ccl' );
							}
							elseif ( is_search() ) {
								_e( 'Search Results', 'ccl' );
							}
							elseif ( is_404() ) {
								_e( 'Page not found', 'ccl' );
							}
							elseif ( is_archive() ) {
								echo get_queried_object()->name;
							}
							else {
								the_title();
							} 
						?>
						<i class="ccl-b-caret-down" aria-hidden="true"></i>
					</a>
					
					<div id="dropdown-site-menus" class="ccl-c-dropdown__content">

						<?php wp_nav_menu( array(
							'theme_location' => 'header_1',
							'container' => '',
							'menu_class' => 'ccl-c-quick-nav__menu ccl-is-primary'
						 ) ); ?>

						 <?php wp_nav_menu( array(
							'theme_location' => 'header_2',
							'container' => '',
							'menu_class' => 'ccl-c-quick-nav__menu ccl-is-secondary'
						 ) ); ?>

					</div>

				</div>

				<div class="ccl-c-quick-nav__item ccl-has-divider">
					<?php 
					$blocks = \CCL\Helpers\get_blocks();
					if ( $blocks ) : ?>
						<a href="#" class="ccl-c-quick-nav__item-text">Current Block Item</a>
					<?php endif; ?>
				</div>

				<div class="ccl-c-quick-nav__item ccl-is-search ccl-is-lazy ccl-has-divider">
					<a href="#" class="ccl-b-btn ccl-is-naked">
						<span class="ccl-u-display-none">Search</span>
						<i class="ccl-b-icon search" aria-hidden="true"></i>
					</a>
				</div>

			</div>

		</nav>

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
