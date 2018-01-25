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
	<link rel="stylesheet" type="text/css" href="https://cloud.typography.com/7861216/7459392/css/fonts.css" />
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


					<?php
					// @todo Sort out how to handle "Notices"
					// @todo Cache the build header functions?

					$events             = \CCL\Helpers\get_header_events();
					$hours              = \CCL\Helpers\get_library_hours();
					$notices            = \CCL\Helpers\get_header_notices();

					?>


					<ul class="ccl-c-masthead__status ccl-c-masthead__nav-item">
						<?php if ( $hours ) : ?>
							<li>
								<span class="ccl-h5"><i class="ccl-b-icon clock" aria-hidden="true"></i> Today&#39;s hours</span>
								<ul class="ccl-c-masthead__hours">
									<?php foreach($hours->locations as $location): ?>
										<li class="ccl-u-font-size-sm"><span><?php echo $location->name; ?></span> <span><?php echo $location->rendered; ?></span></li>
									<?php endforeach; ?>
									<li><a class="ccl-u-font-size-sm ccl-c-masthead__more-hours" href="<?php echo esc_url( home_url('/hours/') ); ?>">More Hours <i class="ccl-b-icon pointer-right-open" aria-hidden="true"></i></a></il>									
								</ul>

							</li>
						<?php endif; ?>
						
						<li>
							<?php if ( $events && ! empty( $events->events ) ) : ?>
								<div>
									<span class="ccl-h5"><i class="ccl-b-icon calendar" aria-hidden="true"></i>
										<a href="<?php echo esc_url( $events->events[0]->url->public ); ?>">
											<?php echo apply_filters( 'the_title', $events->events[0]->title ); ?>
										</a>
									</span>
								</div>
							<?php endif; ?>						

							<?php if ( $notices ) : ?>
								<div>
									<span class="ccl-h5">
										<span class="ccl-u-color-red">
											<i class="ccl-b-icon alert" aria-hidden="true"></i> Notice:
										</span>
										<?php $notice = shuffle( $notices ); // Return a random notice ?>
										<?php echo apply_filters( 'the_title', $notices[0] ); ?>
									</span>
								</div>
							<?php endif; ?>
						
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
