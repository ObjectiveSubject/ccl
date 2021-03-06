<!-- Button trigger modal -->
<button type="button" class="ccl-b-btn" data-toggle="modal" data-target="#example-modal">
  Launch demo modal
</button>

<!-- Modal -->
<div class="ccl-c-modal" id="example-modal" tabindex="-1" role="dialog" aria-labelledby="example-modal-label" aria-hidden="true">
    <div class="ccl-c-modal__dialog" role="document">

        <div class="ccl-c-modal__content">

            <div class="ccl-c-modal__header">
                <h5 class="ccl-c-modal__title" id="example-modal-label">Example Modal</h5>
                <button type="button" class="ccl-b-close" data-toggle="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>

            <div class="ccl-c-modal__body">
                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
            </div>

            <div class="ccl-c-modal__footer">
                <button type="button" class="ccl-b-btn" data-toggle="modal">Close</button>
                <button type="button" class="ccl-b-btn ccl-is-solid">Save changes</button>
            </div>

        </div>

    </div>
</div>
<!--this is extra modal code removed from user-nav-->
                <a href="#" data-toggle="modal" data-target="#modal-librarian-chat">
                    <span class="ccl-u-hide-md ccl-h5" aria-hidden="true"><?php _e( 'Ask Us!', 'ccl' ); ?></span>
                    <span class="ccl-u-show-md"><?php _e( 'Contact the Library', 'ccl' ); ?> <span class="ccl-b-icon person-open" aria-hidden="true"></span>
                    </span>
                </a>
                
                    <div class="ccl-c-modal" id="modal-librarian-chat" tabindex="-1" role="dialog" aria-labelledby="label-librarian-chat" aria-hidden="true">
        <div class="ccl-c-modal__dialog" role="document">

            <div class="ccl-c-modal__content">

                <div class="ccl-c-modal__header">
                    <div class="ccl-c-modal__title ccl-h5" id="label-librarian-chat"><?php _e( 'Chat with a Librarian', 'ccl' ); ?></div>
                    <button type="button" class="ccl-b-close" data-toggle="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div class="ccl-c-modal__body">
                    <p>Please fill in your information and press <strong>Continue</strong>.</p>
                    <p>
                        <label class="ccl-b-label">Your Name:
                        <input type="text" class="ccl-b-input" /></label>
                    </p>
                    <p>
                        <label class="ccl-b-label">Your Email:
                        <input type="email" class="ccl-b-input" /></label>
                    </p>
                </div>

                <div class="ccl-c-modal__footer">
                    <button type="button" class="ccl-b-btn" data-toggle="modal">Cancel</button>
                    <button type="button" class="ccl-b-btn ccl-is-solid">Continue</button>
                </div>

            </div>

        </div>
    </div>
