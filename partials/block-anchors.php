<?php

$blocks = get_post_meta( get_the_ID(), 'block_group', true );

// The block check will almost always be true
// The extended check is to see if a single empty "WYSIWYG" block has been saved
if ( is_array( $blocks ) && ! ( 1 == count( $blocks ) && 'wysiwyg' == $blocks[0]['block_type'] && '' != $blocks[0]['block_description'] ) ) : ?>

    <!-- ### Blocks Anchors -->
    
    <ul class="ccl-c-hero__menu">

        <?php foreach ( $blocks as $index => $block ) : 
            
            $title = empty( $block['block_title'] ) ? '(no title)' : $block['block_title']; ?>

            <?php if ( $block['block_type'] != 'banner' ) : ?>
                <li><a href="<?php echo '#block-' . $index; ?>"><?php echo esc_html( $title ); ?></a></li>
            <?php endif; ?>

        <?php endforeach; ?>

    </ul>

<?php endif; ?>