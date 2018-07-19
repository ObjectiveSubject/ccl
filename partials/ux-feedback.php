<!-- Button trigger modal -->
<div type="button" class="ccl-c-feedback__btn" data-toggle="modal" data-target="#feedback-modal">
  Was this webpage helpful?
</div>

<!-- Modal -->
<div class="ccl-c-modal" id="feedback-modal" tabindex="-1" role="dialog" aria-labelledby="feedback-modal-label" aria-hidden="true" >
    <div class="ccl-c-modal__dialog" role="document">

        <div class="ccl-c-modal__content">

            <div class="ccl-c-modal__header">
                <?php global $post; ?>
                <div>
                    <h5 class="ccl-c-modal__title" id="feedback-modal-label">Give us feedback on "<?php echo get_the_title( $post->ID ); ?>"</h5>
                    <div class="ccl-u-weight-light"><?php echo get_permalink( $post->ID ); ?></div>                   
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