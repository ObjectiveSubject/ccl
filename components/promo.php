<div class="promo">

    <header class="promo__header">
        <div class="promo__title">Default Promo</div>
        <p class="promo__action"><a href="#" class="h4 u-color-black u-color-hover-red">View All</a></p>
    </header>

    <div class="promo__content">        

        <div class="grid-row">

            <?php 
            $i = 0;
            do { ?>
                <article class="grid-2">
                    <a href="#">
                        <?php if ($i !== 1) : ?>
                            <div class="u-mb-nudge"><img src="http://unsplash.it/400/<?php echo 400 - ($i * 50); ?>/"/></div>
                        <?php endif; ?>
                        <p class="h4 u-mt-0">Library Acquires Portait Collection</p>
                        <p class="h4 u-mt-nudge u-color-muted">March <?php echo $i * 5 + 5; ?></p>
                        <p class="u-mt-nudge">Itaquia voluptati optae con reti optae con reris aut ad quiaspe ruptam quibus. Icaepro deseque lacerum cus abore pratque.</p>
                    </a>
                </article>
            <?php $i++; } while ( $i < 4 ); ?>
            
        </div>

    </div>

</div>