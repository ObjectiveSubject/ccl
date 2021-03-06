<?php
$blocks = \CCL\Helpers\get_blocks();

if ( $blocks ) : ?>

    <!-- ### Blocks -->

    <?php foreach ( $blocks as $index => $block ) : ?>

        <?php if ( 'carousel' == $block['block_type'] ) : ?>
            
            <?php 
            $has_block_items = ( isset ( $block['block_items'] ) && $block['block_items'] );
            $block_item_count = ( $has_block_items && is_array( $block['block_items'] ) ) ? count( $block['block_items'] ) : 0;
            
            $block_item_count = ( isset( $block['block_description'] ) && $block['block_description'] ) ? $block_item_count + 1 : $block_item_count + 0;
            
            $enable_carousel = $block_item_count > 2; ?>

            <div id="block-<?php echo $index; ?>" class="ccl-l-container">

                <div class="ccl-c-promo">

                    <header class="ccl-c-promo__header">

                        <?php if ( isset( $block['block_title'] ) && $block['block_title'] ) : ?>

                            <div class="ccl-c-promo__title"><?php echo $block['block_title']; ?></div>

                        <?php endif; ?>

                        <?php if ( isset( $block['block_cta'] ) && $block['block_cta'] ) : ?>

                            <div class="ccl-c-promo__cta">
                                <?php echo apply_filters( 'the_content', $block['block_cta'] ); ?>
                            </div>

                        <?php endif; ?>
                        
                        <?php if ( $enable_carousel ) : ?>

                            <div class="ccl-c-promo__action">
                                <button id="carousel-<?php echo $index; ?>-prev" class="ccl-b-btn--circular prev" aria-label="previous slide">&larr;</button>
                                <button id="carousel-<?php echo $index; ?>-next" class="ccl-b-btn--circular next" aria-label="next slide">&rarr;</button>
                            </div>

                        <?php endif; ?>

                    </header>

                    <?php if ( $has_block_items ) : ?>

                        <?php $carousel_class = ( $enable_carousel ) ? 'js-promo-carousel' : 'ccl-is-static'; ?>

                        <div class="ccl-c-promo__content">

                            <div class="ccl-c-carousel <?php echo $carousel_class; ?>" data-slick='{ "slidesToShow": 1, "prevArrow": "#carousel-<?php echo $index; ?>-prev", "nextArrow": "#carousel-<?php echo $index; ?>-next" }'>

                                <?php if ( isset( $block['block_description'] ) && $block['block_description'] ) : ?>

                                    <article class="ccl-c-promo__description ccl-c-carousel__slide">
                                        <div style="width:300px"><?php echo apply_filters( 'the_content', $block['block_description'] ); ?></div>
                                    </article>

                                <?php endif; ?>

                                <?php foreach ( (array) $block['block_items'] as $image_id => $image_url ) : ?>

                                    <?php 
                                    $image_size = ( $enable_carousel ) ? 'thumbnail' : 'medium';
                                    $image_link = get_post_meta( $image_id, 'attachment_link', true ); ?>

                                    <article class="ccl-c-carousel__slide">
                                        <?php if ( $image_link ) : ?>
                                            <a href="<?php echo $image_link; ?>">
                                        <?php endif; ?>
                                                <div class="ccl-u-mb-nudge"><?php echo wp_get_attachment_image( $image_id, $image_size ); ?></div>
                                                <p class="ccl-h4 ccl-u-mt-0"><?php echo get_the_title( $image_id ); ?></p>
                                                <p class="ccl-h4 ccl-u-mt-0 ccl-u-faded"><?php echo get_the_excerpt( $image_id ); ?></p>
                                        <?php if ( $image_link ) : ?>
                                            </a>
                                        <?php endif; ?>
                                    </article>

                                <?php endforeach; ?>
                                
                            </div>

                        </div>

                    <?php endif; ?>

                </div>

            </div>

        <?php elseif ( 'events' == $block['block_type'] ) : ?>

			<?php
			$event_category = get_post_meta( $post->ID, 'event_category_id', true ); // get category from meta
			$event_data     = '';
			$events         = array();
			$transient_slug = 'all';

			if ( $event_category ) {
				$transient_slug = 'category_' . $event_category;
			}

			// check to see if we have a cached version of the events
			$event_cache = get_transient( 'events_' . $transient_slug );

			if ( $event_cache ) {

				$event_data = $event_cache;

			} else {

				$parameters = array(
					'limit'       => 10, // default it 20
					'category_id' => $event_category, // grab from a specific category
					// 'date'  => '2017-12-01', // useful for grabbing old events for testing
				);

				$event_data = \CCL\Integrations\LibCal\get_events( $parameters );

				if ( ! is_wp_error( $event_data ) ) {
					set_transient( 'events_' . $transient_slug, $event_data, 15 * MINUTE_IN_SECONDS ); // maybe cache for 15 minutes
				}

			}
			
			date_default_timezone_set('America/Los_Angeles');

			// This intermediary step likely isn't entirely necessary, mostly taking care of data massaging in one place
			foreach ( $event_data->events as $event ) {

				$start = date( 'l, F d, g:i', strtotime( $event->start ) );
				$end   = $event->end ? '&ndash;' . date( 'g:ia', strtotime( $event->end ) ) : '';

				$date_time = $start . $end;

				array_push( $events, array(
					'title'     => esc_html( $event->title ),
					'date_time' => $date_time,
					'venue'     => esc_html( $event->location->name ),
					'image'     => esc_url( $event->featured_image ),
					'url'       => esc_url( $event->url->public )
				) );
			}

            $has_block_items = ( isset ( $events ) && $events );
            $block_item_count = ( $has_block_items && is_array( $events ) ) ? count( $events ) : 0;
            $enable_carousel = $block_item_count > 2;
            
            if ( $has_block_items ) : ?>

                <div id="block-<?php echo $index; ?>" class="ccl-l-container">

                    <div class="ccl-c-promo">

                        <header class="ccl-c-promo__header">

                            <?php if ( isset( $block['block_title'] ) && $block['block_title'] ) : ?>

                                <div class="ccl-c-promo__title"><?php echo $block['block_title']; ?></div>

                            <?php endif; ?>

                            <?php if ( isset( $block['block_cta'] ) && $block['block_cta'] ) : ?>

                                <div class="ccl-c-promo__cta">
                                    <?php echo apply_filters( 'the_content', $block['block_cta'] ); ?>
                                </div>

                            <?php endif; ?>
                            
                            <?php if ( $enable_carousel ) : ?>

                                <div class="ccl-c-promo__action">
                                    <button id="carousel-<?php echo $index; ?>-prev" class="ccl-b-btn--circular prev" aria-label="previous slide">&larr;</button>
                                    <button id="carousel-<?php echo $index; ?>-next" class="ccl-b-btn--circular next" aria-label="next slide">&rarr;</button>
                                </div>

                            <?php endif; ?>

                        </header>

                        <?php $carousel_class = ( $enable_carousel ) ? 'js-promo-carousel' : 'ccl-is-static'; ?>

                        <div class="ccl-c-promo__content">

                            <div class="ccl-c-carousel <?php echo $carousel_class; ?>" data-slick='{ "slidesToShow": 1, "prevArrow": "#carousel-<?php echo $index; ?>-prev", "nextArrow": "#carousel-<?php echo $index; ?>-next" }'>

                                <?php if ( isset( $block['block_description'] ) && $block['block_description'] ) : ?>

                                    <article class="ccl-c-promo__description ccl-c-carousel__slide">
                                        <div style="width:300px"><?php echo apply_filters( 'the_content', $block['block_description'] ); ?></div>
                                    </article>

                                <?php endif; ?>

                                <?php foreach ( (array) $events as $i => $event ) : ?>
                                
                                    <?php if ( ! $event['image'] ) {
                                        $event['image'] = CCL_TEMPLATE_URL . "/assets/images/ccl-exterior.jpg";
                                    } ?>

                                    <article class="ccl-c-carousel__slide">
                                        <a href="<?php echo $event['url']; ?>">
                                            <div class="ccl-u-mb-nudge"><img src="<?php echo $event['image'] ?>" alt="<?php echo $event['title']; ?>" /></div>
                                            <p class="ccl-h4 ccl-u-mt-0"><?php echo $event['title']; ?></p>
                                            <p class="ccl-h4 ccl-u-mt-0 ccl-u-faded"><?php echo $event['date_time']; ?></p>
                                            <p class="ccl-h4 ccl-u-mt-0 ccl-u-faded"><?php echo $event['venue']; ?></p>
                                        </a>
                                    </article>

                                <?php endforeach; ?>
                                
                            </div>

                        </div>

                    </div>

                </div>

            <?php endif; ?>

        <?php elseif ( 'news-events' == $block['block_type'] ) : ?>

            <?php
            date_default_timezone_set('America/Los_Angeles');
            $news_events_items = array();
            $Libcal_event_data  = null;
            $promo_news_data    = null;
            $closest_date       = null;
            $today              = strtotime('today midnight');

            
            if ( isset( $block['block_news_events'] ) ) {

                $news_events = new WP_Query( array(
                    'post_type' => array( 'news', 'event' ),
                    'posts_per_page' => 500,
                    'post__in' => array_map( 'intval', $block['block_news_events'] ),
                    'orderby' => 'post__in'
                ) );

            } else { 
                $news_events = null;
            };
    
    		$Libcal_event_data = \CCL\Helpers\get_event_data_promo_block();

            //debug_to_console( $Libcal_event_data );
            
            //check for libcal data, and add the render results array
            if( !empty( $Libcal_event_data ) ){
                foreach( $Libcal_event_data as $key => $event ){
                    
    				$start = date( 'l, F d Y, g:i', strtotime( $event['start'] ) );
    				$end   = $event['end'] ? '&ndash;' . date( 'g:ia', strtotime( $event['end'] ) ) : '';
    
    				$date_time = $start . $end;                
                    
                    array_push( $news_events_items, array(
                            'title'         => $event['title'],
                            'date_time'     => esc_html( $date_time ),
                            'str_time'      => strtotime( $event['start'] ),
                            'location'      => $event['location']['name'],
                            'featured_img'  => $event['featured_image'] ?: CCL_TEMPLATE_URL . "/assets/images/ccl-exterior.jpg",
                            'link'          => $event['url']['public'],
                            'event_type'    => 'libcal'
                        ) );
                    
                }                
            }
            
            //check for data from the news item, and render to the results array
            if( isset ( $news_events ) && $news_events->have_posts() ){
                foreach( $news_events->posts as $key => $news ){
                    array_push( $news_events_items, array(
                            'title'         => $news->post_title,
                            'date_time'     => date( 'F d Y', strtotime( $news->post_date ) ),
                            'str_time'      => strtotime( $news->post_date ),
                            'featured_img'  =>  get_the_post_thumbnail_url($news->ID, 'medium') ?: CCL_TEMPLATE_URL . "/assets/images/ccl-exterior.jpg",
                            'link'          =>  get_permalink( $news->ID ),
                            'event_type'    => 'news'
                        ) );
                }                
            }
            

            //sort the results array by most recent
            usort( $news_events_items, function ( $a, $b ) {
            
            	return $a['str_time'] - $b['str_time'];
            } );
            
            
            //get the date closest to today
            // foreach( $news_events_items as $key => $item ){
                
            //     if( $item['str_time']  >= $today ){
            //         debug_to_console( $item );
            //         $closest_date = $key;
            //         break;
            //     }
            // }

            //make sure we have enough posts for the carousel
            $block_item_count = ( $news_events_items && is_array( $news_events_items ) ) ? count( $news_events_items ) : 0;
            
            $block_item_count = ( isset( $block['block_description'] ) && $block['block_description'] ) ? $block_item_count + 1 : $block_item_count + 0;
            
            //$closest_date = ( isset( $closest_date ) && isset( $block['block_description'] ) && $block['block_description'] ) ? $closest_date + 1 : $closest_date + 0;
            
            $enable_carousel = $block_item_count > 2;


            if ( $block_item_count ) : ?>

                <div id="block-<?php echo $index; ?>" class="ccl-l-container">

                    <div class="ccl-c-promo">

                        <header class="ccl-c-promo__header">

                            <?php if ( isset( $block['block_title'] ) && $block['block_title'] ) : ?>

                                <div class="ccl-c-promo__title"><?php echo $block['block_title']; ?></div>

                            <?php endif; ?>

                            <?php if ( isset( $block['block_cta'] ) && $block['block_cta'] ) : ?>

                                <div class="ccl-c-promo__cta">
                                    <?php echo apply_filters( 'the_content', $block['block_cta'] ); ?>
                                </div>

                            <?php endif; ?>
                            
                            <?php if ( $enable_carousel ) : ?>

                                <div class="ccl-c-promo__action">
                                    <button id="carousel-<?php echo $index; ?>-prev" class="ccl-b-btn--circular prev" aria-label="previous slide">&larr;</button>
                                    <button id="carousel-<?php echo $index; ?>-next" class="ccl-b-btn--circular next" aria-label="next slide">&rarr;</button>
                                </div>

                            <?php endif; ?>

                        </header>

                        <?php $carousel_class = ( $enable_carousel ) ? 'js-promo-carousel' : 'ccl-is-static'; ?>

                        <div class="ccl-c-promo__content">

                            <div class="ccl-c-carousel <?php echo $carousel_class; ?>" data-slick='{ "slidesToShow": 1, "prevArrow": "#carousel-<?php echo $index; ?>-prev", "nextArrow": "#carousel-<?php echo $index; ?>-next" }'>

                                <?php if ( isset( $block['block_description'] ) && $block['block_description'] ) : ?>

                                    <article class="ccl-c-promo__description ccl-c-carousel__slide">
                                        <div style="width:300px"><?php echo apply_filters( 'the_content', $block['block_description'] ); ?></div>
                                    </article>

                                <?php endif; ?>

                                <?php foreach( $news_events_items as $key => $promo ):?>
                                
                                    <article class="ccl-c-carousel__slide">

                                        <a href="<?php echo $promo['link']; ?>" title="Read <?php echo $promo['title']; ?>">

                                           <img src="<?php echo $promo['featured_img']; ?>" class="ccl-u-display-block ccl-u-mb-nudge" alt="<?php echo $promo['title']; ?>" />

                                            <?php if ( $promo['event_type'] === 'libcal' ) : ?>
                                                
                                                <p class="ccl-h4 ccl-u-mt-nudge ccl-u-faded">Events</p>
                                                <p class="ccl-h3 ccl-u-mt-nudge"><?php echo $promo['title']; ?></p>
                                                <p class="ccl-h4 ccl-u-mt-nudge ccl-u-faded"><?php echo $promo['date_time']; ?></p>
                                                <p class="ccl-h4 ccl-u-mt-nudge ccl-u-faded"><?php echo $promo['location']; ?></p>
                                            
                                            <?php else : ?>

                                                <p class="ccl-h4 ccl-u-mt-nudge ccl-u-faded">News</p>
                                                <p class="ccl-h4 ccl-u-mt-nudge"><?php echo $promo['title']; ?></p>
                                                
                                            <?php endif; ?>

                                        </a>
                                    
                                    </article>

                                <?php endforeach; ?>
                                
                            </div>

                        </div>

                    </div>

                </div>

            <?php endif; ?>

        <?php elseif ( 'banner' == $block['block_type'] ) : ?>

            <?php if ( isset( $block['block_items'] ) ) : ?>

                <div id="block-<?php echo $index; ?>" class="ccl-c-banner">

                    <?php foreach ( (array) $block['block_items'] as $image_id => $image_url ) : ?>

                        <?php
                        echo wp_get_attachment_image( $image_id, 'large' );
                        break; // only get first image, break after
                        ?>

                    <?php endforeach; ?>

                </div>

            <?php endif; ?>

        <?php elseif ( 'feature_item' == $block['block_type'] ) : ?>

            <div id="block-<?php echo $index; ?>" class="ccl-l-container">

                <div class="ccl-c-promo--slim <?php echo 'ccl-is-' . $block['block_layout']; ?>">

                    <header class="ccl-c-promo__header">

                        <?php if ( isset( $block['block_title'] ) && $block['block_title'] ) : ?>

                            <div class="ccl-c-promo__title"><?php echo $block['block_title']; ?></div>

                        <?php endif; ?>

                        <?php if ( isset( $block['block_description'] ) && $block['block_description'] ) : ?>
                        
                            <div class="ccl-c-promo__description">
                                <?php echo apply_filters( 'the_content', $block['block_description'] ); ?>
                            </div>

                        <?php endif; ?>

                    </header>

                    <div class="ccl-c-promo__content">        

                        <?php foreach ( (array) $block['block_items'] as $image_id => $image_url ) : ?>

                            <?php
                            echo wp_get_attachment_image( $image_id, 'large' );
                            break; // only get first image, break after
                            ?>

                        <?php endforeach; ?>

                    </div>

                </div>

            </div>

        <?php elseif ( 'staff' == $block['block_type'] ) : ?>

            <?php 
            $staff_ids = $block['block_staff_member'];
            $staff_ids = is_array( $staff_ids ) ? $staff_ids : array( $staff_ids ); ?>
            
            <?php if ( ! empty( $staff_ids ) ) : ?>

                <div id="block-<?php echo $index; ?>" class="ccl-l-container">

                    <div class="ccl-c-promo">
                    
                        <header class="ccl-c-promo__header">

                            <?php if ( isset( $block['block_title'] ) && $block['block_title'] ) : ?>

                                <div class="ccl-c-promo__title" role="heading" aria-level="2"><?php echo $block['block_title']; ?></div>

                            <?php endif; ?>

                            <?php if ( isset( $block['block_cta'] ) && $block['block_cta'] ) : ?>

                                <div class="ccl-c-promo__cta">
                                    <?php echo apply_filters( 'the_content', $block['block_cta'] ); ?>
                                </div>

                            <?php endif; ?>
                            
                        </header>

                        <div class="ccl-c-promo__content">

                            <div class="ccl-l-row">

                                <?php foreach ( $staff_ids as $staff_id ) :

                                $subjects = get_the_terms( $staff_id, 'subject' );
                                $member_image = get_post_meta( $staff_id, 'member_image', true );
                                $name = get_the_title( $staff_id );
                                $first_name = explode( ' ', $name )[0];
                                $profile_url = get_post_meta( $staff_id, 'member_friendly_url', true );
                                $column_class = count( $staff_ids ) > 1 ? 'ccl-l-span-half-md' : ''; 
                                $member_title   = get_post_meta( $staff_id, 'member_title', true );
                                ?>

                                    <div class="ccl-l-column <?php echo $column_class; ?>">

                                        <div class="ccl-c-profile-card ccl-u-mb-1">

                                            <div class="ccl-l-row">

                                                <div class="ccl-l-column ccl-l-span-half-md">

                                                    <div class="ccl-c-profile-card__header">
                                                        <div class="ccl-c-profile-card__title"><?php echo $name; ?></div>
                                                        
                                                        <?php if( !empty( $member_title ) ): ?>
                                                            <div class="ccl-c-profile-card__position"><?php echo $member_title; ?> </div>
                                                        <?php endif; ?>                        
                                                        
                                                        
                                                        <ul class="ccl-c-profile-card__list">
                                                            <?php if ( !empty( $profile_url ) ) : ?>
                                                                <li><a href="<?php echo esc_url( $profile_url ); ?>" target="_blank">Contact <?php echo $first_name; ?></a></li>
                                                            <?php endif; ?>

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

                                <?php endforeach; ?>

                            </div>

                        </div>

                    </div>

                </div>

            <?php endif; ?>
        
        
        <?php elseif ( 'search' == $block['block_type'] ) : ?>

            <?php 
            $enable_live_results = $block['block_search_is_live'];
            $search_js_class = ( $enable_live_results ) ? 'true' : 'false';
            $search_label = ( $enable_live_results ) ? 'Start typing to search' : 'Search...';
            

            // Databases added to the custom field in /includes/metaboxes/blocks.php need to be added here
			$ccl_locations = get_option( 'ccl-search-locations' );

			$db_ids = ( isset( $block['block_databases'] ) ) ? $block['block_databases'] : array( 'all' );
			$database_selected = 'all';
			
			
            ?>
            
            <div id="block-<?php echo $index; ?>" class="ccl-l-container ccl-u-pb-2 ccl-u-clearfix">

                <?php if ( isset( $block['block_title'] ) && $block['block_title'] ) : ?>

                    <div class="ccl-h2 ccl-u-mt-2"><?php echo $block['block_title']; ?></div>

                <?php endif; ?>

                <div class="ccl-c-search ccl-js-search-form ccl-u-mt-2" data-livesearch="<?php echo $search_js_class; ?>">

                <form class="ccl-c-search-form" name="catalogSearch" action="" target="_blank">
                        <input type="text" class="ccl-b-input ccl-search" name="queryString" placeholder="Start typing to search" aria-label="Search" autocomplete="off"/>
                
                        <div class="ccl-c-search-form__option ccl-c-search-index-container">
                            <strong>As:</strong>
                            <select class="ccl-b-select ccl-c-search-index" name="index" title="Index" aria-label="Search Index">
                                <option value="ti">Title</option>
                                <option value="kw" selected="selected">Keyword</option>
                                <option value="au">Author</option>
                                <option value="su">Subject</option>
                            </select>
                        </div>
                        
                        <div class="ccl-c-search-form__option ccl-c-search-location-container">
                            <strong>In:</strong>
                            <select class="ccl-b-select ccl-c-search-location" name="location" title="Location" aria-label="Search Location">
                                <?php foreach( $db_ids as $location ): ?>
                                <?php $selected_location = ( array_key_exists( 'selected', $ccl_locations[$location] ) ) ? 'selected="selected"' : ''; ?>
                                    
                                        <option data-loc="<?php echo $ccl_locations[$location]['loc']; ?>" value="<?php echo $ccl_locations[$location]['param']; ?>" <?php echo $selected_location; ?> ><?php echo $ccl_locations[$location]['name']; ?></option>
                                        
                                <?php endforeach;?>
                            </select>
                        </div>
                    
                        <button type="submit" class="ccl-c-search-form__submit ccl-b-btn ccl-is-solid" style="min-width: 8rem">
                            <span class="ccl-b-icon search" aria-hidden="true"></span>
                            <span class="ccl-u-display-none">Search</span>
                        </button>
                    </form>
                    
                    <?php if ( $enable_live_results ) : ?>
                        
                        <div class="ccl-c-search-results">
                            <div class="ccl-c-search-results__list" role="list">

                            </div>
                        </div>

                    <?php endif; ?>

                </div>

                <?php if ( isset( $block['block_description'] ) && $block['block_description'] ) : ?>
                        
                    <div class="ccl-u-mt-2">
                        <?php echo apply_filters( 'the_content', $block['block_description'] ); ?>
                    </div>

                <?php endif; ?>

            </div>

        <?php else : ?>

            <div id="block-<?php echo $index; ?>" class="ccl-l-container">

                <div class="ccl-c-promo">

                    <header class="ccl-c-promo__header">

                        <?php if ( isset( $block['block_title'] ) && $block['block_title'] ) : ?>

                            <div class="ccl-c-promo__title"><?php echo $block['block_title']; ?></div>

                        <?php endif; ?>

                        <?php if ( isset( $block['block_cta'] ) && $block['block_cta'] ) : ?>

                            <div class="ccl-c-promo__cta">
                                <?php echo apply_filters( 'the_content', $block['block_cta'] ); ?>
                            </div>

                        <?php endif; ?>

                    </header>

                    <div class="ccl-c-promo__content">        

                        <?php if ( isset( $block['block_description'] ) && $block['block_description'] ) : ?>
                        
                            <div class="ccl-c-promo__description">
                                <?php echo apply_filters( 'the_content', $block['block_description'] ); ?>
                            </div>

                        <?php endif; ?>

                    </div>

                </div>

            </div>

        <?php endif; ?>

    <?php endforeach; ?>
    
    <!-- End Blocks -->

<?php endif; ?>