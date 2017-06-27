<div class="ccl-c-promo ccl-c-promo--carousel ccl-columns">

    <header class="ccl-c-promo__header ccl-column is-one-third-tablet is-one-quarter-desktop">
        <div class="ccl-c-promo__title">Carousel Promo</div>
        <p class="ccl-c-promo__action"><a href="#" class="ccl-h4 ccl-u-color-black ccl-u-color-hover-red">View All</a></p>
        <div class="ccl-c-promo__action">
            <button id="carousel-1-prev" class="ccl-b-btn--circular prev" aria-label="previous slide">&larr;</button>
            <button id="carousel-1-next" class="ccl-b-btn--circular next" aria-label="next slide">&rarr;</button>
        </div>
    </header>

    <div class="ccl-c-promo__content ccl-column is-two-thirds-tablet is-three-quarters-desktop">        

        <div class="ccl-c-carousel js-promo-carousel" data-slick='{ "slidesToShow": 2, "prevArrow": "#carousel-1-prev", "nextArrow": "#carousel-1-next" }'>

            <?php 
            $i = 0;
            do { ?>
                <article class="ccl-c-carousel__slide">
                    <a href="#">
                        <div class="ccl-u-mb-nudge"><img src="http://unsplash.it/500/350/"/></div>
                        <p class="ccl-h4 ccl-u-mt-0">Carousel Item: Lorem Ipsum Dolor Eset</p>
                        <p class="ccl-h4 ccl-u-mt-0 ccl-u-faded">March 25, 7:00pm</p>
                        <p class="ccl-h4 ccl-u-mt-0 ccl-u-faded">Auditorium, Honnold/Mudd Library</p>
                    </a>
                </article>
            <?php $i++; } while ( $i < 8 ); ?>
            
        </div>

    </div>

</div>