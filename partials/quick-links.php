<?php
$quick_links = get_post_meta( get_the_ID(), 'hero_quick_links', true );

if ( ! empty( $quick_links ) ) : ?>

    <ul class="ccl-c-quick-links">

        <?php foreach( $quick_links as $link ) : ?>
            
            <li class="ccl-c-quick-link">
                <a href="<?php echo $link['hero_link_url']; ?>">
                    <span class="ccl-c-quick-link__title"><?php echo $link['hero_link_title']; ?></span>
                    <?php if ( isset( $link['hero_link_icon'] ) && 'none' != $link['hero_link_icon'] ) : ?>
                        <i class="ccl-c-quick-link__icon ccl-b-icon <?php echo $link['hero_link_icon']; ?>" aria-hidden="true"></i>
                    <?php endif; ?>
                </a>
            </li>

        <?php endforeach; ?>

    </ul>

<?php endif; ?>
