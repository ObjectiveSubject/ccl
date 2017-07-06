<div class="ccl-c-room">
    <header class="ccl-c-room__header">
        <h2 class="ccl-c-room__name">Room Name</h2>
        <span class="ccl-c-room__meta">Accommodates: 6</span>
        <span class="ccl-c-room__meta">Projector: Yes</span>
        <a href="#" class="ccl-c-room__link">Show on map</a>
        <a href="#" class="ccl-c-room__link">View Photos</a>
    </header>
    <div class="ccl-c-room__content">
        <img class="ccl-c-room__image" src="http://unsplash.it/190/100/" />
        <div class="ccl-c-room__schedule">

            <?php $i = 8 * 60; do {
                
                $hours = floor( $i / 60 );
                $ampm = ( $hours >= 12 ) ? 'p' : 'a';
                $hours = ( $hours > 12 ) ? $hours - 12 : $hours;
                $minutes = ( $i % 60 > 0 ) ? $i % 60 : '';
                ?>
                <div class="ccl-c-room__slot <?php echo ( $minutes ) ? 'ccl-is-half-hour' : ''; ?> ">
                    <input type="checkbox" id="slot-<?php echo $i; ?>" name="slot-<?php echo $i; ?>" />
                    <label class="ccl-c-room__slot-label" for="slot-<?php echo $i; ?>">
                        <span class="ccl-c-room__slot-time">
                            <?php if ( $minutes ) { 
                                echo ':' . $minutes;
                            } else {
                                echo $hours . $ampm;
                            } ?>
                        </span>
                    </label>
                </div>
            <?php $i += 30; } while( $i <= 1230 ); ?>
            
        </div>
    </div>
</div>
