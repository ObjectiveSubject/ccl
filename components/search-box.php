<div class="ccl-u-px-3 ccl-u-py-6" style="background-color: #eee;">

    <div class="ccl-l-container">

        <div class="ccl-c-search">

            <form class="ccl-c-search__bar">
                <input type="text" id="ccl-b-input" class="ccl-b-input" placeholder="Start typing to search"/>
                <div class="ccl-c-dropdown">
                    <button class="ccl-c-dropdown__toggle ccl-b-btn">As: Keyword <i class="ccl-b-caret-down" aria-hidden="true"></i></button>
                    <ul class="ccl-c-dropdown__menu">
                        <li class="ccl-c-dropdown__item"><a href="#">All</a></li>
                        <li class="ccl-c-dropdown__item"><a href="#">Title</a></li>
                        <li class="ccl-c-dropdown__item"><a href="#">Keyword</a></li>
                        <li class="ccl-c-dropdown__item"><a href="#">Author</a></li>
                        <li class="ccl-c-dropdown__item"><a href="#">Subject</a></li>
                    </ul>
                </div>
                <div class="ccl-c-dropdown">
                    <button class="ccl-c-dropdown__toggle ccl-b-btn">In: Databases <i class="ccl-b-caret-down" aria-hidden="true"></i></button>
                    <ul class="ccl-c-dropdown__menu">
                        <li class="ccl-c-dropdown__item"><a href="#">DB Name</a></li>
                        <li class="ccl-c-dropdown__item"><a href="#">DB Name</a></li>
                        <li class="ccl-c-dropdown__item"><a href="#">DB Name</a></li>
                    </ul>
                </div>
                <button type="submit" class="ccl-c-search__submit">
                    <i class="ccl-b-icon-search" aria-hidden="true"></i>
                    <span class="ccl-u-display-none">Search</span>
                </button>
            </form>

            <div class="ccl-c-search__results">
                <ul class="ccl-c-search__list">
                    
                    <?php $i = 0;
                    $icons = array( 'book', 'book', 'clip', 'person', 'pointer-right', 'asterisk', 'question');
                    $types = array( 'Book', 'Book', 'Research Guide', 'Librarian', 'Database', 'Journal', 'FAQ' );
                    do { ?>

                        <li class="ccl-c-search-item">
                            <a href="#">
                                <span class="ccl-c-search-item__type">
                                    <i class="ccl-b-icon-<?php echo $icons[$i]; ?>" aria-hidden="true"></i>
                                    <span class="ccl-c-search-item__type-text"><?php echo $types[$i]; ?></span>
                                </span>
                                <span class="ccl-c-search-item__title">Search Result Item <?php echo $i; ?></span>
                            </a>
                        </li>
                    
                    <?php $i++; } while( $i <= 6 ); ?>
                    
                    <li class="ccl-c-search__results-footer">
                        <a href="#" class="ccl-c-search__results-action">View all 1,001 Results <i class="ccl-b-icon-arrow-right" aria-hidden="true"></i></a>
                    </li>
                </ul>
            </div>

        </div>

    </div>

</div>