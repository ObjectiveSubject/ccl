<?php
/**
 * Template Name: Wayfinding
 */

get_header(); ?>

	<div class="site-content ccl-u-pb-3">

		<?php while ( have_posts() ) : the_post(); ?>

			<?php
			$thumb_url   = get_the_post_thumbnail_url( $post, 'full' );
			$title       = get_the_title();   // Could use 'the_title()' but this allows for override
			$description = get_the_excerpt(); // Could use 'the_excerpt()' but this allows for override
			?>

			<article <?php post_class(); ?>>

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

						<form class="ccl-c-search__bar">
							<input type="text" class="ccl-b-input" placeholder="Enter a call number to begin"/>
							<button type="submit" class="ccl-c-search__submit">
								<i class="ccl-b-icon-search" aria-hidden="true"></i>
								<span class="ccl-u-display-none">Search</span>
							</button>
						</form>
					
					</div>

				</div>

				<div class="ccl-l-container">

					<h3>Item with call number "<span class="ccl-u-color-blue">JC 177 B3 1895</span>" can be found in "<span class="ccl-u-color-blue">Room Name</span>"</h3>

					<div class="ccl-l-row ccl-u-mt-2">
						<div class="ccl-l-column--lazy-lg ccl-l-span-full" style="min-width: 120px; border-right:1px solid #ddd">
							<ul class="ccl-u-clean-list ccl-u-mt-1">
								<li class="ccl-u-mb-1 ccl-u-pb-1" style="border-bottom:1px solid #ddd"><a href="#floor-1" class="ccl-h4 ccl-u-color-blue">Level 1</a></li>
								<li class="ccl-u-mb-1 ccl-u-pb-1" style="border-bottom:1px solid #ddd"><a href="#floor-1" class="ccl-h4">Level 2</a></li>
								<li class="ccl-u-mb-1 ccl-u-pb-1" style="border-bottom:1px solid #ddd"><a href="#floor-1" class="ccl-h4">Level 3</a></li>
								<li class="ccl-u-mb-1 ccl-u-pb-1" style="border-bottom:1px solid #ddd"><a href="#floor-1" class="ccl-h4">Level 4</a></li>
							</ul>	
						</div>
						<div class="ccl-l-column">
							<div id="floor-1" class="">
								<div><?php include( CCL_PATH . '/assets/images/level-1-flat.svg' ) ?></div>
							</div>	
						</div>
					</div>

				</div>

			</article>

		<?php endwhile; ?>

	</div>

<?php get_footer();