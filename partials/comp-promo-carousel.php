<div class="promo promo--carousel">

    <header class="promo__header">
        <div class="promo__title">Carousel Promo</div>
        <p class="promo__action"><a href="#" class="h4 u-color-black u-color-hover-red">View All</a></p>
        <div class="promo__carousel-arrows">
            <button id="carousel-1-prev" class="carousel-arrow prev" aria-label="previous slide">&larr;</button>
            <button id="carousel-1-next" class="carousel-arrow next" aria-label="next slide">&rarr;</button>
        </div>
    </header>

    <div class="promo__content">        

        <div class="promo__carousel" data-slick='{ "slidesToShow": 2, "prevArrow": "#carousel-1-prev", "nextArrow": "#carousel-1-next" }'>

            <?php 
            $i = 0;
            do { ?>
                <article class="promo__item grid-4">
                    <a href="#">
                        <div class="u-mb-nudge"><img src="http://unsplash.it/500/350/"/></div>
                        <p class="h4 u-mt-0">Carousel Item: Lorem Ipsum Dolor Eset</p>
                        <p class="h4 u-color-muted u-mt-0">March 25, 7:00pm</p>
                        <p class="h4 u-color-muted u-mt-0">Auditorium, Honnold/Mudd Library</p>
                    </a>
                </article>
            <?php $i++; } while ( $i < 8 ); ?>
            
        </div>

    </div>

</div>