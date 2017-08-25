<?php
/**
 * The default WordPress search form
 *
 * For the main page search results with dropdown, see components/search-box.php
 */
?>

<form id="header-search-form" role="search" method="get" class="header-search-form search-form" action="<?php echo site_url(); ?>">
	<label for="s" class="u-hug u-display-none">
		<?php _e( 'What are you looking for?', 'ccl' ); ?>
	</label>
	<input id="s" type="search" class="search-field h3 u-hug" placeholder="<?php _e( 'Search', 'ccl' ); ?>" value="" name="s" title="Search for:">
	<input type="submit" class="search-submit" value="<?php _e( 'Press Enter', 'ccl' ); ?>">
</form>
