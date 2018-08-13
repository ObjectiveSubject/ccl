<?php
/**
 * Template Name: Room Reservation
 */

get_header(); ?>

	<div id="content" class="site-content">

		<?php while ( have_posts() ) : the_post(); ?>

			<?php
			$thumb_url   = get_the_post_thumbnail_url( $post, 'full' );
			$title       = get_the_title();   // Could use 'the_title()' but this allows for override
			$description = ( $post->post_excerpt ) ? get_the_excerpt(): ''; // Could use 'the_excerpt()' but this allows for override
            $hero_class  = $thumb_url ? 'ccl-c-hero ccl-has-image':     'ccl-c-hero';
            date_default_timezone_set('America/Los_Angeles');
            
            // replace with get_terms()
            $room_types  = get_terms( array( 'taxonomy' => 'room_type' ) );

			?>

			<article <?php post_class(); ?>>

				<div class="<?php echo esc_attr( $hero_class ); ?>" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)">
                    
                    <div class="ccl-l-container">

                        <div class="ccl-l-row">

                            <div class="ccl-l-column ccl-l-span-third-lg">
                                <div class="ccl-c-hero__header">
                                    <h1 class="ccl-c-hero__title"><?php echo apply_filters( 'the_title', $title ); ?></h1>
                                </div>
                            </div>

                            <div class="ccl-l-column ccl-l-span-two-thirds-lg">
                                <div class="ccl-c-hero__content">
                                    <ul class="ccl-c-hero__menu">

                                        <?php foreach ( $room_types as $type ) : ?>

                                            <li><a href="#<?php echo $type->slug; ?>"><?php echo $type->name; ?></a></li>

                                        <?php endforeach; ?>

                                    </ul>
                                </div>
                            </div>
                            
                        </div>

                    </div>

				</div>

                <?php if ( get_the_content() ) : ?>

                    <div class="ccl-l-container">

                        <div class="ccl-l-row">
                            <div class="ccl-c-entry-content ccl-l-column ccl-l-span-9-md ccl-u-my-2">
                                <?php the_content(); ?>
                            </div>
                        </div>

                    </div>

                <?php endif; ?>


				<?php if ( empty( $room_types) ) : ?>
						<div class="ccl-l-container">

							<div class="ccl-l-row">
								<div class="ccl-c-entry-content ccl-l-column ccl-l-span-9-md ccl-u-my-2">

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
                        <div class="ccl-l-container">
                            <div class="ccl-c-hero__header">
                                <h1 class="ccl-c-hero__title"><?php echo $type->name; ?></h1>
                            </div>
                        </div>
                    </div>

                    <?php 
                        $rooms = new WP_Query(array(
                            'post_type' => 'room',
                            'posts_per_page' => -1,
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
                                        
                                        <?php if( $room_id ): ?>    
                                        <a href="#" class="ccl-b-btn" data-toggle="modal" data-target="#<?php echo 'room-' . $room_id . '-reserve'; ?>" aria-label="Book <?php the_title(); ?>">
                                            <?php _e( 'Book Room', 'ccl' ); ?>
                                        </a>
                                        <?php endif; ?>
                                    </p>
                                </header>

                                <div class="ccl-c-promo__content">        

                                    <div class="ccl-c-carousel ccl-is-static">

                                        <?php if ( $room_description ) : ?>
                                            
                                            <article class="ccl-c-promo__description ccl-c-carousel__slide">
                                                <div style="width:300px"><?php echo  $room_description; ?></div>
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

                            <?php if( empty( $room_id ) ) continue; ?>
                            
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
                                            <div class="ccl-c-modal__description">
                                                <div class="ccl-u-weight-bold"><span class="ccl-b-icon compass"></span> Policies:</div>
                                                <div class="ccl-u-ml-1">Available to current TCC students, staff, and faculty. Use your campus email address to sign up. You may make 1 reservation per day, for up to 3 hours. 
                                                Pick up your room key at the Main Services Desk. We will release your reservation after 15 minutes if you do not check-in.</div>
                                            </div>
                                            <div class="ccl-c-room__form-content js-room-res-form-content ccl-u-mt-nudge">

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
                                                            <input type="text" class="ccl-b-input" name="nickname" placeholder="e.g. 'History Study Group'"/>
                                                        </label>
                                                    </div>
                                                    <div class="ccl-l-column ccl-l-span-half-md ccl-u-mb-1">
                                                        <label class="ccl-b-label">
                                                            <?php _e( 'Date', 'ccl' ); ?>
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
                                                                
                                                                <?php $i++; } while ( $i < 3 ); ?>

                                                            </select>
                                                        </label>
                                                    </div>
                                                </div>

                                                <p class="ccl-h4 ccl-u-mt-0">
                                                    <span class="ccl-c-room__current-duration js-current-duration ccl-u-color-school">Please select available time slots</span>
                                                    <a href="#" class="ccl-c-room__slot-reset js-reset-selection">&times; Reset</a>
                                                </p>
                                                
                                                <p class="ccl-h5 ccl-u-mt-0">
                                                    Max: <span class="js-max-time"></span>
                                                </p>
                                                    
                                                <div class="ccl-c-room__schedule js-room-schedule">
                                                    <!-- room schedule populated here via JS -->
                                                </div>

                                                <ul class="ccl-c-room__legend">
                                                    <li class="ccl-c-room__key ccl-is-available">
                                                        <span class="ccl-b-icon close" aria-hidden="true"></span>
                                                        <span><?php _e( 'Available', 'ccl' ); ?></span>
                                                    </li>
                                                    <li class="ccl-c-room__key ccl-is-occupied">
                                                        <span class="ccl-b-icon close" aria-hidden="true"></span>
                                                        <span><?php _e( 'Occupied', 'ccl' ); ?></span>
                                                    </li>
                                                    <li class="ccl-c-room__key ccl-is-selected">
                                                        <span class="ccl-b-icon clock" aria-hidden="true"></span>
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
                                            <button id="room-res-submit" type="submit" class="ccl-b-btn ccl-is-solid js-room-res-form-submit" disabled><?php _e( 'Submit', 'ccl' ); ?></button>
                                            <button type="submit" class="ccl-b-btn ccl-is-solid js-room-res-form-reload" style="display:none"><?php _e( 'Make another booking', 'ccl' ); ?></button>
                                        </div>

                                    </form>

                                </div>
                            </div>

                        <?php endwhile; wp_reset_query(); ?>

                    </div>

                </div>

                <?php endforeach; ?>

			</article>

			<?php 
			//get the related posts from template part
			get_template_part( 'partials/related-posts' ); ?>

		<?php endwhile; ?>

	</div>

<?php get_footer();