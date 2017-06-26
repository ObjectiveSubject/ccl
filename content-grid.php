<div class="grid-row ccl-u-my-3">
    
    <?php

        $i = 1;
        $columns = 10;
        $style = 'background: #ddd; padding: 0.5em 1em; margin-bottom: 1em';
        
        do { ?>
        
            <div class="<?php echo "grid-{$i}"; ?>" style="<?php echo $style; ?>"><?php echo ".grid-{$i}"; ?></div>
            
            <?php $alt_i = $columns - $i;
            if ( $alt_i !== 0 ) : ?>
            
            <div class="grid-<?php echo $alt_i; ?>" style="<?php echo $style; ?>">.grid-<?php echo $alt_i; ?></div>
            
            <?php endif; ?>

        <?php $i++;
        }
        
        while( $i <= $columns );

    ?>

</div>