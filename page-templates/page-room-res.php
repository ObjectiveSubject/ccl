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
                array( 'title' => 'Digital Studios', 'slug' => 'digital-studio' )
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

                    <?php $rooms = array( 
                        array( 'title' => 'Room 1', 'slug' => $type['slug'] . '-room-1', 'description' => 'Alibus dit adiore ma dolorem ad maion excepudae es magnatemquis qui nullit andistem num nonsed moluptatio. Et qui reperum alibeaquas susam, oditateniet pa venimag nistrum, enihit de cus re omnihic totaque cum fugiant eatist aut qui sunt aut dia esti blanducid ute plit ut endusae.' ), 
                        array( 'title' => 'Room 2', 'slug' => $type['slug'] . 'room-2', 'description' => 'Alibus dit adiore ma dolorem ad maion excepudae es magnatemquis qui nullit andistem num nonsed moluptatio. Et qui reperum alibeaquas susam, oditateniet pa venimag nistrum, enihit de cus re omnihic totaque cum fugiant eatist aut qui sunt aut dia esti blanducid ute plit ut endusae.' ) 
                    ); ?>
                    
                    <div class="ccl-l-container">

                        <?php foreach ( $rooms as $room ) : ?>

                            <!-- Room Promo -->
                            <div class="ccl-c-promo">

                                <header class="ccl-c-promo__header">
                                    <div class="ccl-c-promo__title"><?php echo $room['title']; ?></div>
                                    <p class="ccl-c-promo__action">
                                        <span class="ccl-h4 ccl-u-mt-0 ccl-u-faded">Accommodates: 6</span><br/>
                                        <span class="ccl-h4 ccl-u-mt-0 ccl-u-faded">Projector: Yes</span>
                                        <a href="#" class="ccl-h4 ccl-u-mt-0" data-toggle="modal" data-target="#<?php echo $room['slug'] . '-map'; ?>">Show on Map</a>
                                        <a href="#" class="ccl-h4 ccl-u-mt-0" data-toggle="modal" data-target="#<?php echo $room['slug'] . '-reserve'; ?>">Book Room</a>
                                    </p>
                                    <div class="ccl-c-promo__action">
                                        <button id="<?php echo $room['slug'] . '-prev'; ?>" class="ccl-b-btn--circular prev" aria-label="previous slide">&larr;</button>
                                        <button id="<?php echo $room['slug'] . '-next'; ?>" class="ccl-b-btn--circular next" aria-label="next slide">&rarr;</button>
                                    </div>
                                </header>

                                <div class="ccl-c-promo__content">        

                                    <div class="ccl-c-carousel js-promo-carousel" data-slick='{ "slidesToShow": 2, "prevArrow": "#<?php echo $room['slug'] . '-prev'; ?>", "nextArrow": "#<?php echo $room['slug'] . '-next'; ?>" }'>

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
                            <div class="ccl-c-modal ccl-is-large" id="<?php echo $room['slug'] . '-map'; ?>" tabindex="-1" role="dialog" aria-labelledby="<?php echo $room['slug'] . '-map-label'; ?>" aria-hidden="true">
                                <div class="ccl-c-modal__dialog" role="document">

                                    <div class="ccl-c-modal__content">

                                        <div class="ccl-c-modal__header">
                                            <h5 class="ccl-c-modal__title" id="<?php echo $room['slug'] . '-map-label'; ?>"><?php echo $room['title']. ' Map'; ?></h5>
                                            <button type="button" class="ccl-b-close" data-toggle="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>

                                        <div class="ccl-c-modal__body">
                                            <img src="http://unsplash.it/966/400/" alt="room map" width="966" height="400" />
                                        </div>

                                        <div class="ccl-c-modal__footer">
                                            <button type="button" class="ccl-b-btn" data-toggle="modal">Close</button>
                                        </div>

                                    </div>

                                </div>
                            </div>

                            
                            <!-- Room Reservation Modal -->
                            <div class="ccl-c-modal ccl-is-large" id="<?php echo $room['slug'] . '-reserve'; ?>" tabindex="-1" role="dialog" aria-labelledby="<?php echo $room['slug'] . '-reserve-label'; ?>" aria-hidden="true">
                                <div class="ccl-c-modal__dialog" role="document">

                                    <form id="<?php echo $room['slug'] . '-form'; ?>" action="#" class="ccl-c-modal__content js-room-res-form">

                                        <div class="ccl-c-modal__header">
                                            <h5 class="ccl-c-modal__title" id="<?php echo $room['slug'] . '-reserve-label'; ?>"><?php echo 'Reserve ' . $room['title']; ?></h5>
                                            <button type="button" class="ccl-b-close" data-toggle="modal" aria-label="Close">
                                                <span aria-hidden="true">&times;</span>
                                            </button>
                                        </div>

                                        <div class="ccl-c-modal__body">

                                            <p><strong>Select available time slots (max: 2).</strong></p>

                                            <div class="ccl-c-room__schedule">
                                                <?php $i = 8 * 60; do {
                                                    $hours = floor( $i / 60 );
                                                    $ampm = ( $hours >= 12 ) ? 'p' : 'a';
                                                    $hours = ( $hours > 12 ) ? $hours - 12 : $hours;
                                                    ?>
                                                    <div class="ccl-c-room__slot">
                                                        <input type="checkbox" id="<?php echo $room['slug'] . '-slot-' . $i; ?>" name="<?php echo $room['slug'] . '-slot-' . $i; ?>" />
                                                        <label class="ccl-c-room__slot-label" for="<?php echo $room['slug'] . '-slot-' . $i; ?>">
                                                            <?php echo $hours . $ampm; ?>
                                                        </label>
                                                    </div>
                                                <?php $i += 60; } while( $i <= 1020 ); ?>
                                            </div>

                                            <ul class="ccl-c-room__legend ccl-u-mt-2">
                                                <li class="ccl-c-room__key--available">Available</li>
                                                <li class="ccl-c-room__key--occupied">Occupied</li>
                                                <li class="ccl-c-room__key--selected">Selected</li>
                                            </ul>

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