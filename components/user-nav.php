<nav class="ccl-c-user-nav">

    <div class="ccl-l-container">
        
        <ul class="ccl-c-user-nav__menu">

            <!-- <li class="ccl-c-user-nav__menu-item">
                Library Open 7am - 9pm Today
            </li> -->
            
            <li class="ccl-c-user-nav__menu-item ccl-is-right" style="margin-left: auto">
                <a href="https://ccl.on.worldcat.org/myaccount" target="_blank">
                <span class="ccl-u-hide-md">Library Account</span>
                <span class="ccl-u-show-md">View Library Account <i class="ccl-b-icon list" aria-hidden="true"></i></span> 
                </a>
            </li>

            <li class="ccl-c-user-nav__menu-item ccl-is-right" >
                <a href="#" data-toggle="modal" data-target="#modal-librarian-chat">
                    <span class="ccl-u-hide-md" aria-hidden="true"><?php _e( 'Chat', 'ccl' ); ?></span>
                    <span class="ccl-u-show-md"><?php _e( 'Chat with a Librarian', 'ccl' ); ?> <i class="ccl-b-icon person-open" aria-hidden="true"></i>
                    </span>
                </a>
            </li>
            
            <li class="ccl-c-user-nav__menu-item ccl-is-right">
                <select class="ccl-b-select ccl-is-inverse" data-toggle="school" aria-label="Select School" >
                    <option value="default">Select School</option>
                    <option value="cgu">CGU</option>
                    <option value="claremont-mckenna">Claremont McKenna</option>
                    <option value="cuc">CUC</option>
                    <option value="harvey-mudd">Harvey Mudd</option>
                    <option value="kgi">KGI</option>
                    <option value="pitzer">Pitzer</option>
                    <option value="pomona">Pomona</option>
                    <option value="scripps">Scripps</option>
                </select>
            </li>

        </ul>

    </div>

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

</nav>
