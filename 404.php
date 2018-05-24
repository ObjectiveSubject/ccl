<?php
/**
 * Error Template
 */

get_header(); ?>

	<div class="site-content">

		<div class="ccl-l-container">

			<header class="ccl-u-mb-3">
				<h1><?php _e( 'Oops, nothing was found.', 'ccl' ) ; ?></h1>
			</header>
			
			<div class="ccl-l-row">
				<div class="ccl-c-entry-content ccl-l-column ccl-l-span-9-md ccl-u-my-2">

					<form class="ccl-c-search-form" role="search" method="get" action="<?php echo site_url(); ?>" style="border:1px solid">

						<input type="text" class="ccl-c-search-form-item ccl-b-input" name="s" placeholder="Maybe try a search?"/>
									
						<button type="submit" class="ccl-c-search-form__submit">
							<span class="ccl-b-icon search" aria-hidden="true"></span>
							<span class="ccl-u-display-none">Search</span>
						</button>

					</form>

				</div>
			</div>
		
		</div>

	</div>

<?php get_footer();