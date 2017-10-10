<?php
/**
 * The template for displaying the header.
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> class="no-js">
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?> data-school="CUC">

	<div id="page">

		<?php \CCL\Helpers\get_component( 'user-nav' ); ?>

		<header id="masthead" class="ccl-c-masthead ccl-u-mb-1" role="banner">
			
			<div class="ccl-l-container">
				
				<div class="site-title ccl-h2" style="font-family: Georgia,serif">
					<a href="<?php echo get_home_url(); ?>">Claremont Colleges Library • VIT@L</a>
				</div>

				<hr/>

				<div class="ccl-l-row">
					<div class="ccl-l-column">
						<nav>
							<ul class="ccl-u-clean-list ccl-u-mt-1">
								<li class="ccl-h3 ccl-u-mt-nudge"><a href="#">About Us</a></li>
								<li class="ccl-h3 ccl-u-mt-nudge"><a href="#">Using the Library</a></li>
								<li class="ccl-h3 ccl-u-mt-nudge"><a href="#">Learning Spaces</a></li>
								<li class="ccl-h3 ccl-u-mt-nudge"><a href="#">Collections</a></li>
								<li class="ccl-h3 ccl-u-mt-nudge"><a href="#">Research Support</a></li>
							</ul>
						</nav>	
					</div>
					<div class="ccl-l-column">
						<nav>
							<ul class="ccl-u-clean-list ccl-u-mt-1">
								<li class="ccl-h4 ccl-u-mt-nudge"><a href="#">Faculty Resources</a></li>
								<li class="ccl-h4 ccl-u-mt-nudge"><a href="#">News & Events</a></li>
								<li class="ccl-h4 ccl-u-mt-nudge"><a href="#">Chat with a Librarian</a></li>
							</ul>
						</nav>
					</div>
					<div class="ccl-l-column">
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
