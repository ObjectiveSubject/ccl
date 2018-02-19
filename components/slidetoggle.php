<?php $search_description = 'Before going to Library Search, this searchbox will show helpful resources like LibGuides, staff, web pages, databases and more.';?>
<div class="ccl-c-slideToggle" >
    <ul class="ccl-c-slideToggle__links">
        <li>
            <a class="ccl-c-slideToggle__title" data-toggleTitle="search-description"  aria-expanded="false" aria-controls="SerchDescription">Learn more about search</a>                   
        </li>
        <li>
            <a href="https://ccl.on.worldcat.org/advancedsearch" target="_blank">Advanced Search <i class="ccl-b-icon pointer-right-open" aria-hidden="true"></i></a>              
        </li>
    </ul>

    <div class="ccl-c-slideToggle__container" aria-expanded="false">
        <div data-toggleTarget="search-description" class="ccl-c-slideToggle__content"  aria-controls="SerchDescription"><?php echo $search_description; ?></div>   
    </div>
</div>