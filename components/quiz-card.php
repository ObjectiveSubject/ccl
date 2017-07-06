<div class="ccl-c-promo">

    <header class="ccl-c-promo__header">
        <div class="ccl-c-promo__title">Quiz Cards</div>
        <p class="ccl-c-promo__action"><a href="#" class="ccl-h4 ccl-u-color-black ccl-u-color-hover-red">Contextual Action</a></p>
        <div class="ccl-c-promo__action">
            <button id="carousel-2-prev" class="ccl-b-btn--circular prev" aria-label="previous slide">&larr;</button>
            <button id="carousel-2-next" class="ccl-b-btn--circular next" aria-label="next slide">&rarr;</button>
        </div>
    </header>

    <div class="ccl-c-promo__content">

        <form>

            <div class="ccl-c-carousel" 
                 data-options='{ "prevArrow": "#carousel-2-prev", "nextArrow": "#carousel-2-next" }'
                 data-options-md='{ "slidesToShow": 2 }'>

                <?php 
                $i = 0;
                do { ?>
                    <article class="ccl-c-carousel__slide">

                        <div class="ccl-c-quiz-card">
                            <header class="ccl-c-quiz-card__header">
                                <p class="ccl-c-quiz-card__number"><?php echo $i + 1; ?></p>
                                <p class="ccl-c-quiz-card__title">Lorem Ipsum Question?</p>
                            </header>
                            <div class="ccl-c-quiz-card__content">
                                <ul class="ccl-u-clean-list">
                                    <?php
                                    $ii = 0;
                                    do { $radio_id = 'radio-' . $i . '-' . $ii; ?>
                                        <li>
                                            <input class="ccl-b-input--radio" id="<?php echo $radio_id; ?>" name="<?php echo 'radio-' . $i; ?>" type="radio"/>
                                            <label for="<?php echo $radio_id; ?>" class="ccl-b-label">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</label>
                                        </li>
                                    <?php $ii++; } while ( $ii < 4 ); ?>
                                </ul>
                            </div>
                        </div>

                    </article>
                <?php $i++; } while ( $i < 7 ); ?>

                <article class="ccl-c-carousel__slide">

                    <div class="ccl-c-quiz-card">
                        <header class="ccl-c-quiz-card__header">
                            <p class="ccl-c-quiz-card__title">Thank you!</p>
                        </header>
                        <div class="ccl-c-quiz-card__content">
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.</p>
                            <p><input type="submit" class="ccl-b-btn--light" value="Submit"/></p>
                        </div>
                    </div>

                </article>
                
            </div>


        </form>

    </div>

</div>
