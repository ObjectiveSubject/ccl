<div class="ccl-u-py-6" style="background-color: #eee;">

    <div class="ccl-l-container">

        <div class="ccl-c-search">

            <form class="ccl-c-search-bar" name="catalogSearch" action="http://ccl.on.worldcat.org/search" target="_blank">
                <input type="text" id="ccl-search" class="ccl-b-input" name="queryString" placeholder="Start typing to search"/>

                <div class="ccl-c-search-bar__option">
                    <strong class="ccl-u-faded">As:</strong>
                    <select class="ccl-b-select" name="index" title="Index">
                        <option value="ti">Title</option>
                        <option value="kw" selected="selected">Keyword</option>
                        <option value="au">Author</option>
                        <option value="su">Subject</option>
                    </select>
                </div>
                
                <div class="ccl-c-search-bar__option">
                    <strong class="ccl-u-faded">In:</strong>
                    <select class="ccl-b-select" name="database" title="Database">
                        <option value="all" selected="selected">All</option>
                        <option value="Z-wcorg">WorldCat</option>
                        <option value="Z-oais">OAlster</option>
                        <option value="Bcnf">PapersFirst</option>
                    </select>
                </div>
            
                <button type="submit" class="ccl-c-search-bar__submit ccl-b-btn ccl-is-solid" style="min-width: 8rem">
                    <i class="ccl-b-icon-search" aria-hidden="true"></i>
                    <span class="ccl-u-display-none">Search</span>
                </button>
            </form>

            <div class="ccl-c-search-results">
                <ul class="ccl-c-search-results__list">

                </ul>
            </div>

        </div>

    </div>

</div>