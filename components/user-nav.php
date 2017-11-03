<nav class="ccl-c-user-nav js-is-sticky" data-sticky='{ "offset": <?php echo is_admin_bar_showing() ? '32' : '0'; ?> }'>

    <div class="ccl-l-container">
        
        <ul class="ccl-c-user-nav__menu">

            <!-- <li class="ccl-c-user-nav__menu-item">
                Library Open 7am - 9pm Today
            </li> -->

            <li class="ccl-c-user-nav__menu-item ccl-is-right" style="margin-left: auto">
                <a href="#" data-toggle="modal" data-target="#modal-librarian-chat">Chat with a librarian</a>
            </li>
            
            <li class="ccl-c-user-nav__menu-item ccl-is-right">
                <select class="ccl-b-select ccl-is-inverse" data-toggle="school">
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
                    <div class="ccl-c-modal__title ccl-h5" id="label-librarian-chat">Chat with a Librarian</div>
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
