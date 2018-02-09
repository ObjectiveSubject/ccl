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
                        <li class="ccl-c-profile-card__cta"><a href="<?php echo esc_url( $profile_url ); ?>" target="_blank">Contact <?php echo $first_name; ?></a></li>
                    <?php endif; ?>
                    <li class="ccl-c-profile-card__cta"><a href="https://claremont.libcal.com/appointments/?g=1372" target="_blank">Make an appointment with <?php echo $first_name; ?></a></li>
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