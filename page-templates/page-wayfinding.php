<?php
/**
 * Template Name: Wayfinding
 */

get_header(); ?>

	<div class="site-content">

		<?php while ( have_posts() ) : the_post(); ?>

			<?php
			$thumb_url   = get_the_post_thumbnail_url( $post, 'full' );
			$title       = get_the_title();   // Could use 'the_title()' but this allows for override
			$description = get_the_excerpt(); // Could use 'the_excerpt()' but this allows for override
			?>

			<article <?php post_class(); ?>>

				<div class="ccl-c-hero <?php echo $thumb_url ? 'ccl-has-image' : ''; ?>" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)">
					
					<div class="ccl-l-container">

						<div class="ccl-l-row">

							<div class="ccl-l-column ccl-l-span-third-lg">
								<div class="ccl-c-hero__header">
									<h1 class="ccl-c-hero__title">
										<?php echo apply_filters( 'the_title', $title ); ?>
									</h1>
								</div>
							</div>

							<div class="ccl-l-column ccl-l-span-two-thirds-lg">
								<div class="ccl-c-hero__content">
									<div class="ccl-h4 ccl-u-mt-0">
										<?php echo apply_filters( 'the_excerpt', $description ); ?>
									</div>
								</div>
							</div>

						</div>

					</div>

				</div>

				<div class="ccl-c-wayfinder ccl-js-wayfinder">

					<div class="ccl-u-py-2" style="background-color: #eee;">

						<div class="ccl-l-container">

							<div class="ccl-l-row">
								<div class="ccl-l-column ccl-l-span-half-lg">
									<form id="call-number-search" class="ccl-c-search-form">
										<input id="call-num-input" name="call-number" type="text" class="ccl-b-input" placeholder="Enter a call number to begin"/>
										<button id="call-num-submit" type="submit" class="ccl-c-search-form__submit ccl-b-btn ccl-is-solid" disabled>
											<span class="ccl-b-icon search" aria-hidden="true"></span>&nbsp;<span>Find</span>
										</button>
									</form>
									<div class="ccl-u-mt-1 ccl-u-hide-lg" role="presentation"></div>
								</div>
								<div class="ccl-l-column ccl-l-span-half-lg">
									<div class="ccl-error-box"></div>
									<div class="ccl-c-wayfinder__marquee">
										<span class="ccl-h5">Location for call number &ldquo;<span class="ccl-c-wayfinder__call-num">&hellip;</span>&rdquo;</span><br/>
										<span class="ccl-h3">Wing: <span class="ccl-c-wayfinder__wing">&hellip;</span></span><br/>
										<span class="ccl-h3">Floor: <span class="ccl-c-wayfinder__floor">&hellip;</span></span><br/>
										<span class="ccl-h3">Subject: <span class="ccl-c-wayfinder__subject">&hellip;</span></span>
									</div>
								</div>
							</div>
						
						</div>

					</div>

					<div class="ccl-l-container">

						<div class="ccl-l-row ccl-u-my-2">
							<div class="ccl-l-column--lazy-lg ccl-l-span-full" style="min-width: 120px; border-right:1px solid #ddd">
								<ul class="ccl-u-clean-list ccl-js-tabs">
									<li><a href="#floor-4" class="ccl-c-tab ccl-h4" data-target="#floor-4">Level 4</a></li>
									<li><a href="#floor-3" class="ccl-c-tab ccl-h4" data-target="#floor-3">Level 3</a></li>
									<li><a href="#floor-2" class="ccl-c-tab ccl-h4" data-target="#floor-2">Level 2</a></li>
									<li><a href="#floor-1" class="ccl-c-tab ccl-h4 ccl-is-active" data-target="#floor-1">Level 1</a></li>
								</ul>	
							</div>
							<div class="ccl-c-wayfinder__maps ccl-l-column">
								<div id="floor-1" class="ccl-c-tab__content ccl-is-active">
									<h3 class="ccl-u-text-center">Floor 1</h3>
									<div><?php include( CCL_PATH . '/assets/images/floor-1.svg' ) ?></div>
								</div>
								<div id="floor-2" class="ccl-c-tab__content">
									<h3 class="ccl-u-text-center">Floor 2</h3>
									<div><?php include( CCL_PATH . '/assets/images/floor-2.svg' ) ?></div>
								</div>
								<div id="floor-3" class="ccl-c-tab__content">
									<h3 class="ccl-u-text-center">Floor 3</h3>
									<div><?php include( CCL_PATH . '/assets/images/floor-3.svg' ) ?></div>
								</div>
								<div id="floor-4" class="ccl-c-tab__content">
									<h3 class="ccl-u-text-center">Floor 4</h3>
									<div><?php include( CCL_PATH . '/assets/images/floor-4.svg' ) ?></div>
								</div>	
							</div>
						</div>

					</div>

				</div>

			</article>

		<?php endwhile; ?>

	</div>

<?php get_footer();