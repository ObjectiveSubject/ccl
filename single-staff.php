<?php
/**
 * Staff member display
 */

get_header(); ?>

	<div id="content" class="site-content">

		<?php while ( have_posts() ) : the_post(); ?>

			<?php
			$thumb_url   = get_the_post_thumbnail_url( $post, 'full' );
			$title       = get_the_title();   // Could use 'the_title()' but this allows for override
			$description = get_the_excerpt(); // Could use 'the_excerpt()' but this allows for override
			
			$hero_class = $thumb_url ? 'ccl-c-hero ccl-has-image' : 'ccl-c-hero';

			// Raw data (things we can import)
			$raw_data = get_post_meta( get_the_ID(), 'member_raw_data', true );

			// Custom fields
			$email = get_post_meta( get_the_ID(), 'member_email', true );
			$image = get_post_meta( get_the_ID(), 'member_image', true );
			?>

			<article <?php post_class(); ?>>

				<div class="<?php echo esc_attr( $hero_class ); ?>" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)">

					<div class="ccl-c-hero__thumb" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)" role="presentaion"></div>
					
					<div class="ccl-l-container">

						<div class="ccl-l-row">

							<div class="ccl-l-column ccl-l-span-third-lg">
								<div class="ccl-c-hero__header">
									<h1 class="ccl-c-hero__title"><?php echo apply_filters( 'the_title', $title ); ?></h1>
								</div>
							</div>

							<div class="ccl-l-column ccl-l-span-two-thirds-lg">
								<div class="ccl-c-hero__content">
									<div class="ccl-h4 ccl-u-mt-0"><?php echo apply_filters( 'the_excerpt', $description ); ?></div>
								</div>
							</div>
							
						</div>

					</div>

				</div>

				<div class="ccl-l-container">

					<div class="ccl-l-row">

						<div class="ccl-c-entry-content ccl-l-column ccl-l-span-9-md ccl-u-my-2">
							<?php if ( $image ) : ?>
								<img src="<?php echo esc_url( $image ); ?>" style="width:200px;">
							<?php endif; ?>

							<?php the_content(); ?>

							<?php if ( $email ) : ?>
								<h4>Contact</h4>

								<p>
									Email: <a href="mailto:<?php echo esc_attr( $email ); ?>"><?php echo esc_attr( $email ); ?></a>
								</p>
							<?php endif; ?>

							<?php $subjects = get_the_terms( get_the_ID(), 'subject' ); ?>

							<?php if ( $subjects && ! is_wp_error( $subjects ) ) : ?>
								<h4>Subjects</h4>

								<ul>
									<?php foreach ( $subjects as $subject ) : ?>
										<li><a href="<?php echo esc_url( get_term_link( $subject ) ); ?>"><?php echo $subject->name; ?></a></li>
									<?php endforeach; ?>
								</ul>

							<?php endif; ?>

						</div>

					</div>

				</div>

			</article>

		<?php endwhile; ?>

	</div>

<?php get_footer();