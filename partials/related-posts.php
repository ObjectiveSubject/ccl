<?php $related_posts = \CCL\Helpers\get_ccl_related_posts(); ?>

<?php if ( $related_posts && $related_posts->have_posts() ) : ?>
	<div class="ccl-u-bg-school ccl-u-py-2">

		<aside class="ccl-l-container" role="complementary" aria-labelledby="related">

			<h2 id="related" class="ccl-u-mt-0">Related</h2>

			<div class="ccl-l-row ccl-u-mt-1">

				<?php while ( $related_posts->have_posts() ) : $related_posts->the_post(); ?>
					<article class="ccl-l-column ccl-l-span-4-md ccl-u-mb-1" aria-label="Related Article: <?php echo get_the_title(); ?>">

						<?php if ( has_post_thumbnail() ) : ?>
							<div class="ccl-u-mb-nudge">
								<a href="<?php echo get_the_permalink(); ?>">
									<?php echo get_the_post_thumbnail( get_the_ID(), 'small', array( 'class' => 'ccl-c-image' ) ); ?>
								</a>
							</div>
						<?php endif; ?>

						<p class="ccl-h4 ccl-u-mt-0"><a href="<?php echo get_the_permalink(); ?>"><?php echo get_the_title(); ?></a></p>
						<p class="ccl-h5 ccl-u-faded ccl-u-mb-1"><?php echo get_the_excerpt(); ?></p>
						<p><a href="<?php echo get_the_permalink(); ?>" class="ccl-b-btn ccl-is-brand-inverse ccl-is-small" aria-label="<?php echo 'Learn more about ' . get_the_title(); ?>">Learn more</a></p>
					</article>

				<?php endwhile; ?>

			</div>
			
		</aside>

	</div>

<?php endif; ?>