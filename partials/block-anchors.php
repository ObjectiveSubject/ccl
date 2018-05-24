<?php

$blocks = \CCL\Helpers\get_blocks();

if ( $blocks ) : ?>

    <!-- ### Blocks Anchors -->
    
    <ul class="ccl-c-hero__menu">

        <?php foreach ( $blocks as $index => $block ) : 
            
            $title = empty( $block['block_title'] ) ? '(no title)' : $block['block_title']; ?>

            <?php if ( $block['block_type'] != 'banner' ) : ?>
                <li>
                    <a href="<?php echo '#block-' . $index; ?>"><?php echo esc_html( $title ); ?></a>
                    <span class="ccl-b-icon arrow-down" aria-hidden="true"></span>
                </li>
            <?php endif; ?>

        <?php endforeach; ?>

    </ul>

<?php endif; ?>