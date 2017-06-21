<div class="floor-map">

    <h2 class="u-mb-2">Contextual Map</h2>

    <div class="floor-map-plans">
    
        <div class="floor-plan below" data-floor="1">
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300">
                <defs><style>.cls-1{fill:#f4f4f4;}.cls-2{fill:#d8d8d8;}</style></defs>
                <title>Floor Plan 1</title>
                <rect class="cls-1" width="480" height="300"/>
                <polygon class="cls-2" points="196 300 0 300 0 0 196 0 196 105 306 105 306 0 345 0 345 30.13 345 69 480 69 480 229 345 229 345 300 306 300 306 193 196 193 196 300"/>
                <rect class="cls-3 room" x="7" y="7" width="182" height="97"/>
                <rect class="cls-3 room" x="346" y="76" width="128" height="146"/>
                <rect class="cls-3 room" x="7" y="193" width="182" height="97"/>
            </svg>
            <p>Floor 1</p>
        </div>

        <div class="floor-plan active" data-floor="2">
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300">
                <defs><style>.cls-1{fill:#f4f4f4;}.cls-2{fill:#d8d8d8;}</style></defs>
                <title>Floor Plan 2</title>
                <rect class="cls-1" width="480" height="300"/>
                <polygon class="cls-2" points="196 300 0 300 0 0 196 0 196 105 306 105 306 0 345 0 345 30.13 345 69 480 69 480 229 345 229 345 300 306 300 306 193 196 193 196 300"/>
                <rect class="cls-3 room" x="7" y="7" width="182" height="97"/>
                <rect class="cls-3 room" x="346" y="76" width="128" height="146"/>
                <rect class="cls-3 room" x="7" y="193" width="182" height="97"/>
            </svg>
            <p>Floor 2</p>
        </div>

        <div class="floor-plan above" data-floor="3">
            <svg id="Layer_1" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 300">
                <defs><style>.cls-1{fill:#f4f4f4;}.cls-2{fill:#d8d8d8;}</style></defs>
                <title>Floor Plan 3</title>
                <rect class="cls-1" width="480" height="300"/>
                <polygon class="cls-2" points="196 300 0 300 0 0 196 0 196 105 306 105 306 0 345 0 345 30.13 345 69 480 69 480 229 345 229 345 300 306 300 306 193 196 193 196 300"/>
                <rect class="cls-3 room" x="7" y="7" width="182" height="97"/>
                <rect class="cls-3 room" x="346" y="76" width="128" height="146"/>
                <rect class="cls-3 room" x="7" y="193" width="182" height="97"/>
            </svg>
            <p>Floor 3</p>
        </div>
        
    </div>

</div>

<script type="text/javascript">

    (function( $, window ){

        $('.floor-plan').click(function(){
            $('.floor-plan').removeClass('active below above');
            $(this).addClass('active');
            $(this).prevAll().addClass('below');
            $(this).nextAll().addClass('above');
        });

    })( jQuery, this );

</script>