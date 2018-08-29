<!-- Button trigger modal -->
<div type="button" class="ccl-c-feedback__btn" data-toggle="modal" data-target="#feedback-modal">
  <span class="ccl-b-icon compass ccl-u-pr-nudge"></span> Was this webpage helpful?
</div>

<!-- Modal -->
<div class="ccl-c-modal" id="feedback-modal" tabindex="-1" role="dialog" aria-labelledby="feedback-modal-label" aria-hidden="true" >
    <div class="ccl-c-modal__dialog" role="document">

        <div class="ccl-c-modal__content">

            <div class="ccl-c-modal__header">
                <?php global $post; 
                        global $wp_query;
                        //debug_to_console( $wp_query );
                        // debug_to_console( $wp_query->post->post_title );
                        // debug_to_console( $wp_query->queried_object->post_title );
                        // debug_to_console( get_queried_object() );
                        
                        if( is_singular() ){
                            $post_title = $wp_query->post->post_title;
                            $post_url = site_url( $wp_query->post->post_name );
                        
                        }elseif( is_archive() ){
                            $post_title = get_the_archive_title() . " - " . $wp_query->queried_object->name;
                            $post_url = $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
                            
                        }elseif( is_search() ){
                            $post_title = 'Search';
                            $post_url = $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];                           
                        }else{
                            $post_title = get_bloginfo( 'name' );
                            $post_url = $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']; 
                        }
                        
                ?>
                
                <div>
                    <h5 class="ccl-c-modal__title" id="feedback-modal-label">Give us feedback on "<?php echo $post_title; ?>"</h5>
                    <div class="ccl-u-weight-light"><?php echo $post_url; ?></div>                   
                </div>

                <button type="button" class="ccl-b-close" data-toggle="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>

            </div>

            <div class="ccl-c-modal__body ccl-c-feedback" style="width: 100%;">
                <iframe src="https://api.libsurveys.com/loader.php?id=ba348d01d9085d418696822b3328b6ea&nositeframe=1" frameborder="0" style="width:100%;"></iframe>
                
            </div>

            <div class="ccl-c-modal__footer">
                <button type="button" class="ccl-b-btn" data-toggle="modal">Close</button>
            </div>

        </div>

    </div>
</div>