<?php
//get search locations so that they can be populated in select box
$search_locations = get_option( 'ccl-search-locations' );
?>

<?php $search_description = 'Before going to Library Search, this searchbox will show helpful resources like research guides, staff, web pages, databases and more';?>

<?php if( is_front_page() ): ?>
    <div class="ccl-c-search__description ccl-l-row">    
        <a class="ccl-c-search__description-content" href="#" data-toggle="tooltip" title="<?php echo $search_description; ?>">About this search box <span class="ccl-b-icon alert" aria-hidden="true"></span></a>
        <a class="ccl-c-search__description-content" href="https://ccl.on.worldcat.org/advancedsearch" target="_blank">Advanced search <span class="ccl-b-icon pointer-right-open" aria-hidden="true"></span></a> 
    </div>        
<?php else: ?>
    <div class="ccl-u-show-lg ccl-c-search__quick-desc">
        
        <?php get_template_part('components/slidetoggle'); ?>

    </div>        
<?php endif; ?>    
    

<div class="ccl-c-search ccl-js-search-form" data-livesearch="true">
    <form class="ccl-c-search-form" name="catalogSearch" action="http://ccl.on.worldcat.org/search" target="_blank">
        <label for="ccl-search" class="ccl-u-display-none">Start typing to search</label>
        <input type="text" id="ccl-search" class="ccl-b-input" name="queryString" placeholder="Start typing to search" aria-label="Search" autocomplete="off"/>

        <div class="ccl-c-search-form__option ccl-c-search-index-container">
            <strong>As:</strong>
            <select class="ccl-b-select ccl-c-search-index" name="index" title="Index" aria-label="Search Index">
                <option value="ti">Title</option>
                <option value="kw" selected="selected">Keyword</option>
                <option value="au">Author</option>
                <option value="su">Subject</option>
            </select>
        </div>
        
        <div class="ccl-c-search-form__option ccl-c-search-location-container">
            <strong>In:</strong>
            <select class="ccl-b-select ccl-c-search-location" name="location" title="Location" aria-label="Search Location">
                <?php foreach( $search_locations as $index => $location ): ?>
                <?php $selected_location = ( array_key_exists( 'selected', $location ) ) ? 'selected="selected"' : ''; ?>
                    <?php if( $location['on_front'] == true ): ?>
                    
                        <option data-loc="<?php echo $location['loc']; ?>" value="<?php echo $location['param']; ?>" <?php echo $selected_location; ?> ><?php echo $location['name']; ?></option>
                        
                    <?php endif; ?>
                <?php endforeach;?>
            </select>
        </div>
    
        <button type="submit" class="ccl-c-search-form__submit ccl-b-btn ccl-is-solid">
            <span class="ccl-b-icon search" aria-hidden="true"></span>
            <span class="ccl-u-display-none">Search</span>
        </button>
    </form>

    <div class="ccl-c-search-results">
        <div class="ccl-c-search-results__list">

        </div>
    </div>

</div>
