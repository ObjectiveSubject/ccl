<?php
/**
 * Template Name: Librarian Archive
 */

get_header(); ?>

	<div class="site-content">

		<?php while ( have_posts() ) : the_post(); ?>

			<?php
			$thumb_url   = get_the_post_thumbnail_url( $post, 'full' );
			$title       = get_the_title();   // Could use 'the_title()' but this allows for override
			$description = ( $post->post_excerpt ) ? get_the_excerpt(): ''; // Could use 'the_excerpt()' but this allows for override
			$hero_class  = $thumb_url ? 'ccl-c-hero ccl-has-image':     'ccl-c-hero';
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
							
						</div>

					</div>

				</div>

				<div class="ccl-l-container">

					<div class="ccl-l-row">
						<div class="ccl-c-entry-content ccl-l-column ccl-l-span-9-md ccl-u-my-2">
							<?php the_content(); ?>
						</div>
					</div>

                    <?php 
                    $args = array(
                        'post_type' => 'staff',
                        'posts_per_page' => 500
                    );
                    
                    $librarians = new WP_Query( $args ); 
                    $sorted_librarians = $librarians->posts;

                    usort( $sorted_librarians, function( $a, $b){

                        $name_a = explode( ' ', $a->post_title );
                        $last_a = array_reverse($name_a)[0];
                        
                        $name_b = explode( ' ', $b->post_title );
                        $last_b = array_reverse($name_b)[0];

                        if ( $last_a == $last_b ) {
                            return 0;
                        }

                        return ( $last_a < $last_b ) ? -1 : 1;

                    } );

                    if ( $librarians->have_posts() ) : ?>

                        <div class="ccl-l-row ccl-u-mt-2">
                        
                            <?php foreach ( $sorted_librarians as $post ) : setup_postdata( $post ); ?>

                                <div class="ccl-l-column ccl-l-span-half-md">

                                    <?php 
                                    $subjects = get_the_terms( $post->ID, 'subject' );
                                    $member_image = get_post_meta( $post->ID, 'member_image', true );
                                    $name = get_the_title( $post->ID );
                                    $first_name = explode( ' ', $name )[0];
                                    $profile_url = get_post_meta( $post->ID, 'member_friendly_url', true ); ?>

                                    <div class="ccl-c-profile-card">
                                    
                                        <div class="ccl-l-row">
        
                                            <div class="ccl-l-column ccl-l-span-half-md">
        
                                                <div class="ccl-c-profile-card__header">
                                                    <div class="ccl-c-profile-card__title"><?php echo $name; ?></div>
                                                    
                                                    <?php if ( ! empty( $subjects ) ) : 
                                                        
                                                        $subjects_count = count( $subjects );
                                                        $max = 6;
                                                        $remaining = $subjects_count - $max; ?>  
                                                    
                                                        <div class="ccl-c-profile-card__list" role="list">
        
                                                            <?php foreach( $subjects as $index => $subject ) {
                                                                
                                                                if ( $index === $max ) {
                                                                    echo '<button class="ccl-b-btn ccl-is-naked ccl-b-more-toggle" role="listitem">+' . $remaining . ' more</button>';
                                                                }
                                                                if ( $index < $max ) {
                                                                    echo '<div class="ccl-u-faded" role="listitem">' . $subject->name . '</div>';
                                                                } else {
                                                                    echo '<div class="ccl-u-faded ccl-b-more-toggled" role="listitem">' . $subject->name . '</div>';
                                                                }
                                                                
                                                            } ?>
        
                                                        </div>
                                                    
                                                    <?php endif; ?>
                                                    
                                                    <ul class="ccl-c-profile-card__list">
                                                        <?php if ( $profile_url ) : ?>
                                                            <li><a href="<?php echo esc_url( $profile_url ); ?>" target="_blank">Contact <?php echo $first_name; ?></a></li>
                                                        <?php endif; ?>
                                                        <li><a href="#">Make an appointment with <?php echo $first_name; ?></a></li>
                                                    </ul>
                                                </div>
        
                                            </div>
        
                                            <div class="ccl-l-column ccl-l-span-half-md">
        
                                                <?php if ( ! $member_image ) {
                                                    $member_image = CCL_TEMPLATE_URL . "/assets/images/person.svg";
                                                } ?>
        
                                                <div class="ccl-c-profile-card__avatar" role="presentation" style="background-image:url(<?php echo $member_image; ?>)"></div>
        
                                            </div>
        
                                        </div>
        
                                    </div>

                                </div>

                            <?php endforeach; wp_reset_postdata(); wp_reset_query(); ?>

                        </div>

                    <?php endif; ?>

				</div>

				<?php get_template_part( 'partials/blocks' ); ?>

			</article>

			<?php $related_posts = \CCL\Helpers\get_ccl_related_posts(); ?>

			<?php if ( $related_posts && $related_posts->have_posts() ) : ?>
				<div class="ccl-c-related ccl-u-bg-school ccl-u-py-2">

					<div class="ccl-l-container">

						<h2 class="ccl-c-related__title ccl-u-mt-0">Related</h2>

						<div class="ccl-l-row ccl-u-mt-1">

							<?php while ( $related_posts->have_posts() ) : $related_posts->the_post(); ?>
								<article class="ccl-c-related__post ccl-l-column ccl-l-span-4-md ccl-u-mb-1">

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
						
					</div>

				</div>

			<?php endif; ?>

		<?php endwhile; ?>

	</div>

<?php get_footer();