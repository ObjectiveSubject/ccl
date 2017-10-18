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
            $room_types  = array(
                array( 'title' => 'Group Study Rooms', 'slug' => 'group-study' ), 
                array( 'title' => 'Multimedia Rooms', 'slug' => 'multimedia' )
            );

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

                                    <li><a href="#<?php echo $type['slug']; ?>"><?php echo $type['title']; ?></a></li>

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

                <?php foreach ( $room_types as $type ) : ?>

                <div id="<?php echo $type['slug']; ?>">

                    <div class="ccl-c-hero ccl-is-short ccl-has-image" style="background-image:url(http://unsplash.it/1500x500)">
                        <div class="ccl-c-hero__container">
                            <div class="ccl-c-hero__header">
                                <h1 class="ccl-c-hero__title"><?php echo $type['title']; ?></h1>
                            </div>
                        </div>
                    </div>

                    <?php 
                    if ( $type['slug'] == 'group-study' ) {
                        $rooms = array( 
                            array( 'ID' => 1, 'title' => 'Group Study 1', 'resource_id' => '9148', 'slug' => 'group-study-1', 'capacity' => '6', 'has_projector' => false, 'description' => 'Alibus dit adiore ma dolorem ad maion excepudae es magnatemquis qui nullit andistem num nonsed moluptatio. Et qui reperum alibeaquas susam, oditateniet pa venimag nistrum, enihit de cus re omnihic totaque cum fugiant eatist aut qui sunt aut dia esti blanducid ute plit ut endusae.' ), 
                            array( 'ID' => 2, 'title' => 'Group Study 2', 'resource_id' => '9149', 'slug' => 'group-study-2', 'capacity' => '4', 'has_projector' => false, 'description' => 'Alibus dit adiore ma dolorem ad maion excepudae es magnatemquis qui nullit andistem num nonsed moluptatio. Et qui reperum alibeaquas susam, oditateniet pa venimag nistrum, enihit de cus re omnihic totaque cum fugiant eatist aut qui sunt aut dia esti blanducid ute plit ut endusae.' ), 
                            array( 'ID' => 3, 'title' => 'Group Study 3', 'resource_id' => '9150', 'slug' => 'group-study-3', 'capacity' => '4', 'has_projector' => false, 'description' => 'Alibus dit adiore ma dolorem ad maion excepudae es magnatemquis qui nullit andistem num nonsed moluptatio. Et qui reperum alibeaquas susam, oditateniet pa venimag nistrum, enihit de cus re omnihic totaque cum fugiant eatist aut qui sunt aut dia esti blanducid ute plit ut endusae.' ), 
                            array( 'ID' => 4, 'title' => 'Group Study 4', 'resource_id' => '9151', 'slug' => 'group-study-4', 'capacity' => '6', 'has_projector' => false, 'description' => 'Alibus dit adiore ma dolorem ad maion excepudae es magnatemquis qui nullit andistem num nonsed moluptatio. Et qui reperum alibeaquas susam, oditateniet pa venimag nistrum, enihit de cus re omnihic totaque cum fugiant eatist aut qui sunt aut dia esti blanducid ute plit ut endusae.' ), 
                        );
                    } elseif ( $type['slug'] == 'multimedia' ) {
                        $rooms = array( 
                            array( 'ID' => 5, 'title' => 'Media Viewing Room', 'resource_id' => '9152', 'slug' => 'media-viewing-room', 'capacity' => '4', 'has_projector' => true, 'description' => 'Alibus dit adiore ma dolorem ad maion excepudae es magnatemquis qui nullit andistem num nonsed moluptatio. Et qui reperum alibeaquas susam, oditateniet pa venimag nistrum, enihit de cus re omnihic totaque cum fugiant eatist aut qui sunt aut dia esti blanducid ute plit ut endusae.' ), 
                        );
                    }?>
                    
                    <div class="ccl-l-container">

                        <?php foreach ( $rooms as $room ) : ?>

                            <!-- Room Promo -->
                            <div class="ccl-c-promo">

                                <header class="ccl-c-promo__header">
                                    <div class="ccl-c-promo__title"><?php echo $room['title']; ?></div>
                                    <p class="ccl-c-promo__action">
                                        <span class="ccl-h4 ccl-u-mt-0 ccl-u-faded">Accommodates: <?php echo $room['capacity']; ?></span><br/>
                                        <span class="ccl-h4 ccl-u-mt-0 ccl-u-faded">Projector: <?php echo $room['has_projector'] ? 'Yes' : 'No'; ?></span>
                                        <a href="#" class="ccl-h4 ccl-u-mt-0" data-toggle="modal" data-target="#<?php echo 'room-' . $room['ID'] . '-map'; ?>">Show on Map</a>
                                        <a href="#" class="ccl-h4 ccl-u-mt-0" data-toggle="modal" data-target="#<?php echo 'room-' . $room['ID'] . '-reserve'; ?>">Book Room</a>
                                    </p>
                                    <div class="ccl-c-promo__action">
                                        <button id="<?php echo 'room-' . $room['ID'] . '-prev'; ?>" class="ccl-b-btn--circular prev" aria-label="previous slide">&larr;</button>
                                        <button id="<?php echo 'room-' . $room['ID'] . '-next'; ?>" class="ccl-b-btn--circular next" aria-label="next slide">&rarr;</button>
                                    </div>
                                </header>

                                <div class="ccl-c-promo__content">        

                                    <div class="ccl-c-carousel js-promo-carousel" data-slick='{ "slidesToShow": 2, "prevArrow": "#<?php echo 'room-' . $room['ID'] . '-prev'; ?>", "nextArrow": "#<?php echo 'room-' . $room['ID'] . '-next'; ?>" }'>

                                        <article class="ccl-c-promo__description ccl-c-carousel__slide">
                                            <div style="max-width:300px"><?php echo apply_filters( 'the_content', $room['description'] ); ?></div>
                                        </article>

                                        <?php 
                                        $i = 0;
                                        do { ?>
                                            <article class="ccl-c-carousel__slide" style="max-width:350px">
                                                <div class="ccl-u-mb-nudge"><img src="http://unsplash.it/500/350/"/></div>
                                            </article>
                                        <?php $i++; } while ( $i < 4 ); ?>
                                        
                                    </div>

                                </div>

                            </div>


                            <!-- Room Map Modal -->
                            <div class="ccl-c-modal ccl-is-large" id="<?php echo 'room-' . $room['ID'] . '-map'; ?>" tabindex="-1" role="dialog" aria-labelledby="<?php echo 'room-' . $room['ID'] . '-map-label'; ?>" aria-hidden="true">
                                <div class="ccl-c-modal__dialog" role="document">

                                    <div class="ccl-c-modal__content">

                                        <div class="ccl-c-modal__header">
                                            <h5 class="ccl-c-modal__title" id="<?php echo 'room-' . $room['ID'] . '-map-label'; ?>"><?php echo $room['title']. ' Map'; ?></h5>
                                            <button type="button" class="ccl-b-close" data-toggle="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>

                                        <div class="ccl-c-modal__body">
                                            <img src="http://unsplash.it/966/400/" alt="<?php echo $room['title'] . ' map'; ?>" width="966" height="400" />
                                        </div>

                                        <div class="ccl-c-modal__footer">
                                            <button type="button" class="ccl-b-btn" data-toggle="modal">Close</button>
                                        </div>

                                    </div>

                                </div>
                            </div>

                            
                            <!-- Room Reservation Modal -->
                            <div class="ccl-c-modal ccl-is-large" id="<?php echo 'room-' . $room['ID'] . '-reserve'; ?>" tabindex="-1" role="dialog" aria-labelledby="<?php echo 'room-' . $room['ID'] . '-reserve-label'; ?>" aria-hidden="true">
                                <div class="ccl-c-modal__dialog" role="document">

                                    <form id="<?php echo 'room' . $room['resource_id'] . '-form'; ?>" action="#" class="ccl-c-modal__content js-room-res-form" data-resource-id="<?php echo $room['resource_id']; ?>">

                                        <div class="ccl-c-modal__header">
                                            <h5 class="ccl-c-modal__title" id="<?php echo 'room-' . $room['ID'] . '-reserve-label'; ?>"><?php echo 'Reserve ' . $room['title']; ?></h5>
                                            <button type="button" class="ccl-b-close" data-toggle="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>

                                        <div class="js-room-res-form-body ccl-c-modal__body">

                                            <div class="ccl-l-row">
                                                <div class="ccl-l-column ccl-l-span-half-md ccl-u-mb-1">
                                                    <label class="ccl-b-label">
                                                        <?php _e( 'First Name', 'ccl' ); ?>
                                                        <input type="text" class="ccl-b-input" name="fname" required/>
                                                    </label>
                                                </div>
                                                <div class="ccl-l-column ccl-l-span-half-md ccl-u-mb-1">
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
                                                        <?php _e( 'When', 'ccl' ); ?>
                                                        <select class="ccl-b-select ccl-u-display-block js-room-date-select" name="<?php echo 'room' . $room['resource_id'] . '-date-select'; ?>" required style="width:100%">
                                                            <option value="<?php echo date( 'Y-m-d', time() ); ?>">Today</option>
                                                            <option value="<?php echo date( 'Y-m-d', time() + DAY_IN_SECONDS ); ?>">Tomorrow</option>
                                                            
                                                            <?php 
                                                            // start at 2 because we already defined 2 options above
                                                            $i = 2; do { ?>
                                                            
                                                                <?php 
                                                                $time = time() + DAY_IN_SECONDS * $i;
                                                                $date_value = date( 'Y-m-d', $time );
                                                                $date_readable = date( 'l, M j, Y', $time ); ?>
                                                                <option value="<?php echo $date_value; ?>"><?php echo $date_readable; ?></option>
                                                            
                                                            <?php $i++; } while ( $i < 9 ); ?>

                                                        </select>
                                                    </label>
                                                </div>
                                            </div>

                                            <p class="ccl-h4"><strong>Select available time slots. <span class="ccl-u-faded">(max: 2 hours)</span></strong></p>

                                            <ul class="ccl-c-room__legend">
                                                <li class="ccl-c-room__key ccl-is-available">
                                                    <i class="ccl-b-icon ccl-b-icon-close" aria-hidden="true"></i>
                                                    <span>Available</span>
                                                </li>
                                                <li class="ccl-c-room__key ccl-is-occupied">
                                                    <i class="ccl-b-icon ccl-b-icon-close" aria-hidden="true"></i>
                                                    <span>Occupied</span>
                                                </li>
                                                <li class="ccl-c-room__key ccl-is-selected">
                                                    <i class="ccl-b-icon ccl-b-icon-clock" aria-hidden="true"></i>
                                                    <span>Selected</span>
                                                </li>
                                            </ul>

                                            <div class="ccl-c-room__schedule js-room-schedule">
                                                <?php 

                                                /* -------------------------------------------------------
                                                 * Realized it's better to generate this markup in the JS. 
                                                 * Open/Close times for rooms vary by day. 
                                                 * Should make a request to spaces API to get data for
                                                 * operating hours.
                                                 * ------------------------------------------------------- */

                                                // $start = date()
                                                // $i = 8 * 60; do {
                                                //     $hours = $i / 60;
                                                //     $ampm = ( $hours >= 12 ) ? 'p' : 'a';
                                                //     $hour = ( $hours > 12 ) ? floor($hours - 12) : floor($hours);
                                                //     $minute = ( $hours - $hour ) * 60;
                                                    ?>
                                                    <!-- <div class="ccl-c-room__slot">
                                                        <input type="checkbox" id="<?php //echo $room['slug'] . '-slot-' . $i; ?>" name="<?php //echo $room['slug'] . '-slot-' . $i; ?>" />
                                                        <label class="ccl-c-room__slot-label" for="<?php //echo $room['slug'] . '-slot-' . $i; ?>">
                                                            <?php //echo $hour . ':' . $minute . $ampm; ?>
                                                        </label>
                                                    </div> -->

                                                <?php // $i += 30; } while( $i <= 1020 ); ?>
                                            </div>

                                        </div>

                                        <div class="ccl-c-modal__footer">
                                            <button type="button" class="ccl-b-btn" data-toggle="modal">Cancel</button>
                                            <button type="submit" class="ccl-b-btn ccl-is-solid" >Submit</button>
                                        </div>

                                    </form>

                                </div>
                            </div>

                        <?php endforeach; ?>

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