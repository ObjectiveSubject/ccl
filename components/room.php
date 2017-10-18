<div class="ccl-c-room">
    <header class="ccl-c-room__header">
        <h2 class="ccl-c-room__name">Room Name</h2>
        <span class="ccl-c-room__meta">Accommodates: 6</span>
        <span class="ccl-c-room__meta">Projector: Yes</span>
        <a href="#" class="ccl-c-room__link">Show on map</a>
        <a href="#" class="ccl-c-room__link">View Photos</a>
    </header>
    <div class="ccl-c-room__content">
        
        <div class="ccl-c-room__image">
            <img src="http://unsplash.it/500/280/" width="500" height="280"/>
        </div>

        <div class="ccl-c-room__schedule">

            <?php $i = 8 * 60; do {
                
                $hours = floor( $i / 60 );
                $ampm = ( $hours >= 12 ) ? 'p' : 'a';
                $hours = ( $hours > 12 ) ? $hours - 12 : $hours;
                ?>
                <div class="ccl-c-room__slot">
                    <input type="checkbox" id="slot-<?php echo $i; ?>" name="slot-<?php echo $i; ?>" />
                    <label class="ccl-c-room__slot-label" for="slot-<?php echo $i; ?>">
                        <?php echo $hours . $ampm; ?>
                    </label>
                </div>
                
            <?php $i += 60; } while( $i <= 1020 ); ?>
            
        </div>

    </div>

    <ul class="ccl-c-room__legend ccl-u-mt-2">
        <li class="ccl-c-room__key ccl-is-available">
            <i class="ccl-b-icon ccl-b-icon-close" aria-hidden="true"></i>
            <span>Available</span>
        </li>
        <li class="ccl-c-room__key ccl-is-occupied">
            <i class="ccl-b-icon ccl-b-icon-close" aria-hidden="true"></i>
            <span>Occupied</span>
        </li>
        <li class="ccl-c-room__key ccl-is-selected">
            <i class="ccl-b-icon ccl-b-icon-clock" aria-hidden="true"></i>
            <span>Selected</span>
        </li>
    </ul>

</div>
