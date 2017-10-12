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

			<article <?php post_class('ccl-js-wayfinder'); ?>>

				<div class="ccl-c-hero <?php echo $thumb_url ? 'ccl-has-image' : ''; ?>" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)">
					<div class="ccl-c-hero__container">
						<div class="ccl-c-hero__header">
							<h1 class="ccl-c-hero__title"><?php echo apply_filters( 'the_title', $title ); ?></h1>
						</div>

						<div class="ccl-c-hero__content">
							<div class="ccl-h4 ccl-u-mt-0"><?php echo apply_filters( 'the_excerpt', $description ); ?></div>
						</div>

					</div>

				</div>

				<div class="ccl-c-search ccl-u-px-3 ccl-u-py-3" style="background-color: #eee;">

					<div class="ccl-l-container">

						<div class="ccl-l-row">
							<div class="ccl-l-column">
								<form class="ccl-c-search__bar">
									<input id="call-num-search" name="call-num-search" type="text" class="ccl-b-input" placeholder="Enter a call number to begin"/>
								</form>
							</div>
							<div class="ccl-l-column">
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

					<div class="ccl-l-row ccl-u-mt-2">
						<div class="ccl-l-column--lazy-lg ccl-l-span-full" style="min-width: 120px; border-right:1px solid #ddd">
							<ul class="ccl-u-clean-list ccl-js-tabs ccl-u-mt-1">
								<li class="ccl-u-mb-1 ccl-u-pb-1" style="border-bottom:1px solid #ddd"><a href="#floor-4" class="ccl-c-tab ccl-h4" data-target="#floor-4">Level 4</a></li>
								<li class="ccl-u-mb-1 ccl-u-pb-1" style="border-bottom:1px solid #ddd"><a href="#floor-3" class="ccl-c-tab ccl-h4" data-target="#floor-3">Level 3</a></li>
								<li class="ccl-u-mb-1 ccl-u-pb-1" style="border-bottom:1px solid #ddd"><a href="#floor-2" class="ccl-c-tab ccl-h4" data-target="#floor-2">Level 2</a></li>
								<li class="ccl-u-mb-1 ccl-u-pb-1" style="border-bottom:1px solid #ddd"><a href="#floor-1" class="ccl-c-tab ccl-h4" data-target="#floor-1">Level 1</a></li>
							</ul>	
						</div>
						<div class="ccl-c-wayfinder__maps ccl-l-column">
							<div id="floor-1" class="ccl-c-tab__content ccl-is-active">
								<div><?php include( CCL_PATH . '/assets/images/level-1-flat.svg' ) ?></div>
							</div>
							<div id="floor-2" class="ccl-c-tab__content">
								<div><?php include( CCL_PATH . '/assets/images/level-2-flat.svg' ) ?></div>
							</div>
							<div id="floor-3" class="ccl-c-tab__content">
								<div><?php include( CCL_PATH . '/assets/images/level-3-flat.svg' ) ?></div>
							</div>
							<div id="floor-4" class="ccl-c-tab__content">
								<div><?php include( CCL_PATH . '/assets/images/level-4-flat.svg' ) ?></div>
							</div>	
						</div>
					</div>

				</div>

			</article>

		<?php endwhile; ?>

	</div>

<?php get_footer();