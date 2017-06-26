<div class="promo columns">

    <header class="promo__header column is-one-third-tablet is-one-quarter-desktop">
        <div class="promo__title">Default Promo</div>
        <p class="promo__action"><a href="#" class="h4 u-color-black u-color-hover-red">View All</a></p>
    </header>

    <div class="promo__content column">        

        <div class="columns is-multiline is-mobile">

            <?php 
            $i = 0;
            do { ?>
                <article class="column is-half-mobile is-half-tablet is-one-third-desktop">
                    <a href="#">
                        <div class="u-mb-nudge"><img src="http://unsplash.it/400/400/"/></div>
                        <p class="h4 u-mt-0">Library Acquires Portait Collection</p>
                        <p class="h4 u-mt-nudge u-color-muted">March 5</p>
                        <p class="u-mt-nudge">Itaquia voluptati optae con reti optae con reris aut ad quiaspe ruptam quibus. Icaepro deseque lacerum cus abore pratque.</p>
                    </a>
                </article>
            <?php $i++; } while ( $i < 4 ); ?>
            
        </div>

    </div>

</div>