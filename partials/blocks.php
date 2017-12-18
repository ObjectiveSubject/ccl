<?php
$blocks = \CCL\Helpers\get_blocks();

if ( $blocks ) : ?>

    <!-- ### Blocks -->

    <?php foreach ( $blocks as $index => $block ) : ?>

        <?php if ( 'carousel' == $block['block_type'] ) : ?>
            
            <?php 
            $has_block_items = ( isset ( $block['block_items'] ) && $block['block_items'] );
            $block_item_count = ( $has_block_items && is_array( $block['block_items'] ) ) ? count( $block['block_items'] ) : 0;
            $enable_carousel = $block_item_count > 3; ?>

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

                            <div class="ccl-c-carousel <?php echo $carousel_class; ?>" data-slick='{ "slidesToShow": 2, "prevArrow": "#carousel-<?php echo $index; ?>-prev", "nextArrow": "#carousel-<?php echo $index; ?>-next" }'>

                                <?php if ( isset( $block['block_description'] ) && $block['block_description'] ) : ?>

                                    <article class="ccl-c-promo__description ccl-c-carousel__slide">
                                        <div style="max-width:300px"><?php echo apply_filters( 'the_content', $block['block_description'] ); ?></div>
                                    </article>

                                <?php endif; ?>

                                <?php foreach ( (array) $block['block_items'] as $image_id => $image_url ) : ?>

                                    <?php 
                                    $image_size = ( $enable_carousel ) ? 'thumbnail' : 'medium';
                                    $image_link = get_post_meta( $image_id, 'attachment_link', true ); ?>

                                    <article class="ccl-c-carousel__slide" data-link="<?php echo $image_link; ?>">
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

        <?php elseif ( 'banner' == $block['block_type'] ) : ?>

            <div id="block-<?php echo $index; ?>" class="ccl-c-banner">

                <?php foreach ( (array) $block['block_items'] as $image_id => $image_url ) : ?>

                    <?php
                    echo wp_get_attachment_image( $image_id, 'large' );
                    break; // only get first image, break after
                    ?>

                <?php endforeach; ?>

            </div>

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

            <?php $staff_id = $block['block_staff_member']; ?>
            
            <?php if ( $staff_id ) : ?>

                <?php 
                $subjects = get_the_terms( $staff_id, 'subject' );
                $member_image = get_post_meta( $staff_id, 'member_image', true );
                $name = get_the_title( $staff_id );
                $first_name = explode( ' ', $name )[0];
                $profile_url = get_post_meta( $staff_id, 'member_friendly_url', true ); ?>

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

                    </div>

                </div>

            <?php endif; ?>
        
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