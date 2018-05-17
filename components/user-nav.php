<nav aria-label="User Navigation" class="ccl-c-user-nav">

    <div class="ccl-l-container">
        
        <ul class="ccl-c-user-nav__menu">

            <!-- <li class="ccl-c-user-nav__menu-item">
                Library Open 7am - 9pm Today
            </li> -->
            
            <li class="ccl-c-user-nav__menu-item ccl-is-right" style="margin-left: auto">
                <a href="https://ccl.on.worldcat.org/myaccount" target="_blank">
                <span class="ccl-u-hide-md ccl-h5">Library Account</span>
                <span class="ccl-u-show-md">View Library Account <i class="ccl-b-icon list" aria-hidden="true"></i></span> 
                </a>
            </li>

            <li class="ccl-c-user-nav__menu-item ccl-is-right" >
                <a href="<?php echo site_url('ask-us/'); ?>" >
                    <span class="ccl-u-hide-md ccl-h5" aria-hidden="true"><?php _e( 'Ask Us', 'ccl' ); ?></span>
                    <span class="ccl-u-show-md"><?php _e( 'Ask Us', 'ccl' ); ?> <i class="ccl-b-icon person-open" aria-hidden="true"></i>
                    </span>
                </a>
            </li>
            
            <li class="ccl-c-user-nav__menu-item ccl-is-right ccl-u-show-md">
                <select class="ccl-b-select ccl-is-inverse" data-toggle="school" aria-label="Select School" >
                    <option value="default">Select School</option>
                    <option value="pomona">Pomona College</option>
                    <option value="cgu">Claremont Graduate University</option>
                    <option value="cuc">The Claremont Colleges Services</option>    
                    <option value="scripps">Scripps College</option>                    
                    <option value="claremont-mckenna">Claremont McKenna College</option>
                    <option value="harvey-mudd">Harvey Mudd College</option>
                    <option value="pitzer">Pitzer College</option>
                    <option value="kgi">Keck Graduate Institute</option>

                </select>
            </li>

        </ul>

    </div>


</nav>
