<div class="ccl-c-search ccl-js-search-form">

    <form class="ccl-c-search-form" name="catalogSearch" action="http://ccl.on.worldcat.org/search" target="_blank">
        <label for="ccl-search" class="ccl-u-display-none">Start typing to search</label>
        <input type="text" id="ccl-search" class="ccl-b-input" name="queryString" placeholder="Start typing to search" aria-label="Search"/>

        <div class="ccl-c-search-form__option">
            <strong>As:</strong>
            <select class="ccl-b-select ccl-c-search-index" name="index" title="Index" aria-label="Search Index">
                <option value="ti">Title</option>
                <option value="kw" selected="selected">Keyword</option>
                <option value="au">Author</option>
                <option value="su">Subject</option>
            </select>
        </div>
        
        <div class="ccl-c-search-form__option">
            <strong>In:</strong>
            <select class="ccl-b-select ccl-c-search-location" name="location" title="Location" aria-label="Search Location">
                <option value="" selected="selected">Libraries Worldwide</option>
                <option value="wz:519">Claremont Colleges Library</option>
                <option value="wz:519::zs:36307">Special Collections</option>
            </select>
        </div>
    
        <button type="submit" class="ccl-c-search-form__submit ccl-b-btn ccl-is-solid" style="min-width: 8rem">
            <i class="ccl-b-icon search" aria-hidden="true"></i>
            <span class="ccl-u-display-none">Search</span>
        </button>
    </form>

    <div class="ccl-c-search-results">
        <div class="ccl-c-search-results__list" role="list">

        </div>
    </div>

</div>
