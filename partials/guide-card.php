<?php
$guide_title    = get_the_title( $post->ID );
$guide_url      = get_post_meta( $post->ID, 'guide_friendly_url', true );
$guide_author   = get_post_meta( $post->ID, 'guide_owner', true );
$guide_id       = get_post_meta( $post->ID, 'guide_id', true);
$guide_content  = get_the_content( $post->ID );
$guide_updated  = get_post_meta( $post->ID, 'guide_updated', true );
$owner_email    = get_post_meta( $post->ID, 'guide_owner_email', true );
$guide_descr    = get_post_meta( $post->ID, 'guide_description', true );
$owner_id       = get_post_meta( $post->ID, 'guide_owner_id', true);

$owner_pofile   = 'http://libguides.libraries.claremont.edu/prf.php?account_id='.$owner_id;
$guide_descr    = !empty( $guide_descr ) ? $guide_descr : "Helpful resources for researching " . $guide_title;
$guide_updated  = date( 'm/d/y', strtotime( $guide_updated ) );

//http://libguides.libraries.claremont.edu/prf.php?account_id=103483

?>

<div class="ccl-c-guide-card" role="listitem" aria-label="<?php echo 'Information about the ' . $guide_title . ' guide'; ?>">
    <div class="ccl-l-row">
        
        <div class="ccl-l-column ccl-l-span-4-md ccl-c-guide-card__title">
            <a href="<?php echo esc_url( $guide_url ); ?>" target="_blank"><?php echo $guide_title; ?></a>
        </div>
        <div class="ccl-l-column ccl-l-span-8-md ccl-c-guide-card__content">
            <div class="ccl-c-guide-card__meta">
                <a href="<?php echo $owner_pofile; ?>" target="_blank">
                <i class="ccl-b-icon person-open" aria-hidden="true"></i> <span><?php echo $guide_author; ?></span>
                </a>
            </div>
            <div class="ccl-c-guide-card__desc">
                <?php echo $guide_descr; ?>
            </div>
        </div>        
        
        
    </div>
</div>
