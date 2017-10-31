<?php
/**
 * Template Name: Room Reservation
 */

get_header(); ?>

	<div class="site-content">

		<?php while ( have_posts() ) : the_post(); ?>

			<?php
			$thumb_url   = get_the_post_thumbnail_url( $post, 'full' );
			$title       = get_the_title();   // Could use 'the_title()' but this allows for override
			$description = ( $post->post_excerpt ) ? get_the_excerpt(): ''; // Could use 'the_excerpt()' but this allows for override
            $hero_class  = $thumb_url ? 'ccl-c-hero ccl-has-image':     'ccl-c-hero';

            // replace with get_terms()
            $room_types  = get_terms( array( 'taxonomy' => 'room_type' ) );

			?>

			<article <?php post_class(); ?>>

				<div class="<?php echo esc_attr( $hero_class ); ?>" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)">
					<div class="ccl-c-hero__container">
						<div class="ccl-c-hero__header">
							<h1 class="ccl-c-hero__title"><?php echo apply_filters( 'the_title', $title ); ?></h1>
						</div>

						<div class="ccl-c-hero__content">
                            <ul class="ccl-c-hero__menu">

                                <?php foreach ( $room_types as $type ) : ?>

                                    <li><a href="#<?php echo $type->slug; ?>"><?php echo $type->name; ?></a></li>

                                <?php endforeach; ?>

                            </ul>
						</div>

					</div>

				</div>

                <?php if ( get_the_content() ) : ?>

                    <div class="ccl-l-container">

                        <div class="ccl-l-row">
                            <div class="ccl-c-entry-content ccl-l-column ccl-l-span-8-md ccl-u-my-2">
                                <?php the_content(); ?>
                            </div>
                        </div>

                    </div>

                <?php endif; ?>


				<?php if ( empty( $room_types) ) : ?>
						<div class="ccl-l-container">

							<div class="ccl-l-row">
								<div class="ccl-c-entry-content ccl-l-column ccl-l-span-8-md ccl-u-my-2">

									<div class="ccl-c-alert ccl-is-error">No room types have been created</div>

								</div>
							</div>

						</div>
				<?php endif; ?>

                <?php foreach ( $room_types as $type ) : ?>

                <div id="<?php echo $type->slug; ?>">

                    <?php 
                    /* @TODO
                     * Create custom meta for an image on room type terms.
                     * Display that image as the background-image of this ccl-c-hero element.
                     */ ?>

                    <div class="ccl-c-hero ccl-is-short" style="margin-top:1px">
                        <div class="ccl-c-hero__container">
                            <div class="ccl-c-hero__header">
                                <h1 class="ccl-c-hero__title"><?php echo $type->name; ?></h1>
                            </div>
                        </div>
                    </div>

                    <?php 
                        $rooms = new WP_Query(array(
                            'post_type' => 'room',
                            'posts_per_page' => 20,
                            'tax_query' => array(
                                array(
                                    'taxonomy' => 'room_type',
                                    'field' => 'slug',
                                    'terms' => array( $type->slug )
                                )
                            )
                        ));
                    ?>
                    
                    <div class="ccl-l-container">

                        <?php while ( $rooms->have_posts() ) : $rooms->the_post(); ?>

                            <?php
                            $post_id = get_the_ID();
                            $room_id = get_post_meta( $post_id, 'room_id', true );
                            $room_description = get_post_meta( $post_id, 'room_description', true );
                            $room_image = get_post_meta( $post_id, 'room_image', true );
                            $room_capacity = get_post_meta( $post_id, 'room_capacity', true ); 
                            ?>

                            <!-- Room Promo -->
                            <div class="ccl-c-promo">

                                <header class="ccl-c-promo__header">

                                    <div class="ccl-c-promo__title"><?php the_title(); ?></div>

                                    <p class="ccl-c-promo__action">

                                        <?php if ( $room_capacity ) : ?>
                                            <span class="ccl-h4 ccl-u-mt-0 ccl-u-faded"><?php _e( 'Accommodates', 'ccl' ); ?>:&nbsp;<?php echo esc_html( $room_capacity ); ?></span><br/>
                                        <?php endif; ?>
                                    
                                        <!-- <a href="#" class="ccl-h4 ccl-u-mt-0" data-toggle="modal" data-target="#<?php //echo 'room-' . $room_id . '-map'; ?>">Show on Map</a> -->

                                        <a href="#" class="ccl-h4 ccl-u-mt-0" data-toggle="modal" data-target="#<?php echo 'room-' . $room_id . '-reserve'; ?>">
                                            <?php _e( 'Book Room', 'ccl' ); ?>
                                        </a>

                                    </p>
                                </header>

                                <div class="ccl-c-promo__content">        

                                    <div class="ccl-c-carousel ccl-is-static">

                                        <?php if ( $room_description ) : ?>
                                            
                                            <article class="ccl-c-promo__description ccl-c-carousel__slide">
                                                <div style="max-width:300px"><?php echo esc_html( $room_description ); ?></div>
                                            </article>

                                        <?php endif; ?>

                                        <?php if ( $room_image ) : ?>

                                            <article class="ccl-c-carousel__slide" style="max-width:350px">
                                                <div class="ccl-u-mb-nudge"><img src="<?php echo esc_url( $room_image ); ?>"/></div>
                                            </article>

                                        <?php endif; ?>
                                        
                                    </div>

                                </div>

                            </div>


                            <!-- Room Map Modal -->
                            <!-- <div id="<?php //echo 'room-' . $room_id . '-map'; ?>" class="ccl-c-modal ccl-is-large" tabindex="-1" role="dialog" aria-labelledby="<?php //echo 'room-' . $room_id . '-map-label'; ?>" aria-hidden="true">
                                <div class="ccl-c-modal__dialog" role="document">

                                    <div class="ccl-c-modal__content">

                                        <div class="ccl-c-modal__header">
                                            <h5 class="ccl-c-modal__title" id="<?php //echo 'room-' . $room_id . '-map-label'; ?>"><?php //echo get_the_title() . ' Map'; ?></h5>
                                            <button type="button" class="ccl-b-close" data-toggle="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>

                                        <div class="ccl-c-modal__body">
                                            <img src="http://unsplash.it/966/400/" alt="<?php //echo get_the_title() . ' map'; ?>" width="966" height="400" />
                                        </div>

                                        <div class="ccl-c-modal__footer">
                                            <button type="button" class="ccl-b-btn" data-toggle="modal">Close</button>
                                        </div>

                                    </div>

                                </div>
                            </div> -->

                            
                            <!-- Room Reservation Modal -->
                            <div id="<?php echo 'room-' . $room_id . '-reserve'; ?>" class="ccl-c-modal ccl-is-large" tabindex="-1" role="dialog" aria-labelledby="<?php echo 'room-' . $room_id . '-reserve-label'; ?>" aria-hidden="true">
                                <div class="ccl-c-modal__dialog" role="document">

                                    <form id="<?php echo 'room' . $room_id . '-form'; ?>" action="#" class="ccl-c-modal__content js-room-res-form" data-resource-id="<?php echo $room_id; ?>">

                                        <div class="ccl-c-modal__header">
                                            <h5 class="ccl-c-modal__title" id="<?php echo 'room-' . $room_id . '-reserve-label'; ?>"><?php echo 'Reserve ' . get_the_title(); ?></h5>
                                            <button type="button" class="ccl-b-close" data-toggle="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>

                                        <div class="ccl-c-modal__body">

                                            <div class="js-room-res-form-content">

                                                <div class="ccl-l-row">
                                                    <div class="ccl-l-column ccl-l-span-quarter-md ccl-u-mb-1">
                                                        <label class="ccl-b-label">
                                                            <?php _e( 'First Name', 'ccl' ); ?>
                                                            <input type="text" class="ccl-b-input" name="fname" required/>
                                                        </label>
                                                    </div>
                                                    <div class="ccl-l-column ccl-l-span-quarter-md ccl-u-mb-1">
                                                        <label class="ccl-b-label">
                                                            <?php _e( 'Last Name', 'ccl' ); ?>
                                                            <input type="text" class="ccl-b-input" name="lname" required/>
                                                        </label>
                                                    </div>
                                                    <div class="ccl-l-column ccl-l-span-half-md ccl-u-mb-1">
                                                        <label class="ccl-b-label">
                                                            <?php _e( 'Email Address', 'ccl' ); ?>
                                                            <input type="email" class="ccl-b-input" name="email" required/>
                                                        </label>
                                                    </div>
                                                    <div class="ccl-l-column ccl-l-span-half-md ccl-u-mb-1">
                                                        <label class="ccl-b-label">
                                                            <?php _e( 'Reservation Nickname (optional)', 'ccl' ); ?>
                                                            <input type="email" class="ccl-b-input" name="email" placeholder="e.g. 'History Study Group'"/>
                                                        </label>
                                                    </div>
                                                    <div class="ccl-l-column ccl-l-span-half-md ccl-u-mb-1">
                                                        <label class="ccl-b-label">
                                                            <?php _e( 'When', 'ccl' ); ?>
                                                            <select class="ccl-b-select ccl-u-display-block js-room-date-select" name="<?php echo 'room' . $room_id . '-date-select'; ?>" required style="width:100%">
                                                                <?php 
                                                                $i = 0; do { ?>
                                                                
                                                                    <?php 
                                                                    $time = time() + DAY_IN_SECONDS * $i;
                                                                    $date_value = date( 'Y-m-d', $time );
                                                                    switch($i) {
                                                                        case 0:
                                                                            $date_readable = 'Today, ' . date( 'M j, Y', $time );
                                                                            break;
                                                                        case 1:
                                                                            $date_readable = 'Tomorrow, ' . date( 'M j, Y', $time );
                                                                            break;
                                                                        default:
                                                                            $date_readable = date( 'l, M j, Y', $time );
                                                                            break;
                                                                    }
                                                                    ?>
                                                                    <option value="<?php echo $date_value; ?>"><?php echo $date_readable; ?></option>
                                                                
                                                                <?php $i++; } while ( $i < 9 ); ?>

                                                            </select>
                                                        </label>
                                                    </div>
                                                </div>

                                                <div class="ccl-l-row">

                                                    <div class="ccl-l-column ccl-l-span-half-md">
                                                        <p class="ccl-h4">
                                                            <?php _e( 'Select available time slots.', 'ccl' ); ?>
                                                            <span class="ccl-u-faded">(max: <span class="js-max-time"></span>)</span>
                                                        </p>
                                                    </div>
                                                    
                                                    <div class="ccl-l-column ccl-l-span-half-md">
                                                        <p class="ccl-h4 ccl-u-color-school">
                                                            <span class="ccl-u-faded">Selected Time:</span>
                                                            <span class="js-current-duration">None</span>
                                                            <a href="#" class="ccl-c-room__slot-reset js-reset-selection">&times; Reset</a>
                                                        </p>
                                                    </div>
                                                    
                                                </div>

                                                <div class="ccl-c-room__schedule js-room-schedule">
                                                    <!-- room schedule populated here via JS -->
                                                </div>

                                                <ul class="ccl-c-room__legend">
                                                    <li class="ccl-c-room__key ccl-is-available">
                                                        <i class="ccl-b-icon ccl-b-icon-close" aria-hidden="true"></i>
                                                        <span><?php _e( 'Available', 'ccl' ); ?></span>
                                                    </li>
                                                    <li class="ccl-c-room__key ccl-is-occupied">
                                                        <i class="ccl-b-icon ccl-b-icon-close" aria-hidden="true"></i>
                                                        <span><?php _e( 'Occupied', 'ccl' ); ?></span>
                                                    </li>
                                                    <li class="ccl-c-room__key ccl-is-selected">
                                                        <i class="ccl-b-icon ccl-b-icon-clock" aria-hidden="true"></i>
                                                        <span><?php _e( 'Selected', 'ccl' ); ?></span>
                                                    </li>
                                                </ul>
                                                
                                            </div>

                                            <div class="js-room-res-form-response">
                                                <!-- content populate via JS on form submit -->
                                            </div>

                                        </div>

                                        <div class="ccl-c-modal__footer">
                                            <button type="button" class="ccl-b-btn js-room-res-form-cancel" data-toggle="modal"><?php _e( 'Cancel', 'ccl' ); ?></button>
                                            <button type="submit" class="ccl-b-btn ccl-is-solid js-room-res-form-submit" ><?php _e( 'Submit', 'ccl' ); ?></button>
                                        </div>

                                    </form>

                                </div>
                            </div>

                        <?php endwhile; wp_reset_query(); ?>

                    </div>

                </div>

                <?php endforeach; ?>

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
									<p><a href="<?php echo get_the_permalink(); ?>" class="ccl-b-btn ccl-is-brand-inverse ccl-is-small">Learn more</a></p>
								</article>

							<?php endwhile; ?>

						</div>
						
					</div>

				</div>

			<?php endif; ?>

		<?php endwhile; ?>

	</div>

<?php get_footer();