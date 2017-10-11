<div class="ccl-u-py-6" style="background-color: #eee;">

    <div class="ccl-l-container">

        <div class="ccl-c-search">

            <form class="ccl-c-search__bar" name="catalogSearch" action="http://ccl.on.worldcat.org/external-search" target="_blank">
                <input type="text" id="ccl-search" class="ccl-b-input" name="queryString" placeholder="Start typing to search"/>

                <div class="ccl-c-search__bar-option">
                    <strong class="ccl-u-faded">As: </strong>
                    <select class="ccl-b-select" name="search_keyword">
                        <option value="all">All</option>
                        <option value="title">Title</option>
                        <option value="keyword" selected="selected">Keyword</option>
                        <option value="author">Author</option>
                        <option value="subject">Subject</option>
                    </select>
                </div>
                
                <div class="ccl-c-search__bar-option">
                    <strong class="ccl-u-faded">In: </strong>
                    <select class="ccl-b-select" name="search_db">
                        <option value="db_name" selected="selected">DB Name</option>
                        <option value="db_name">DB Name</option>
                        <option value="db_name">DB Name</option>
                    </select>
                </div>
            
                <button type="submit" class="ccl-c-search__submit">
                    <i class="ccl-b-icon-search" aria-hidden="true"></i>
                    <span class="ccl-u-display-none">Search</span>
                </button>
            </form>

            <div class="ccl-c-search__results">
                <ul class="ccl-c-search__list">

                </ul>
            </div>

        </div>

    </div>

</div>