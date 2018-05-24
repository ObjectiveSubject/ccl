<?php
/**
 * Template Name: Demo: Components
 */

get_header(); ?>

	<div id="content" class="site-content">

		<div class="">
			<?php get_template_part( 'components/hero' ); ?>
		</div>

		<div class="ccl-u-my-3 ccl-l-container">
			<h2 class="ccl-u-mb-1">Dropdowns</h2>
			<?php get_template_part( 'components/dropdown' ); ?>
		</div>

		<div class="ccl-u-my-3 ccl-l-container">
			<h2 class="ccl-u-mb-1">Accordions</h2>
			<div class="ccl-l-row">
				<div class="ccl-l-column ccl-l-span-8-md ccl-l-offset-2-md">
					<p>Literally synth stumptown ethical, austin pickled pop-up narwhal deep v pug banjo keytar celiac keffiyeh swag. Taxidermy hella deep v farm-to-table aesthetic synth air plant mustache. Forage kinfolk chambray four loko, humblebrag fanny pack affogato raclette coloring book plaid offal echo park.</p>
					<?php get_template_part( 'components/accordion' ); ?>
					<?php get_template_part( 'components/accordion' ); ?>
					<?php get_template_part( 'components/accordion' ); ?>
					<p>Literally synth stumptown ethical, austin pickled pop-up narwhal deep v pug banjo keytar celiac keffiyeh swag. Taxidermy hella deep v farm-to-table aesthetic synth air plant mustache. Forage kinfolk chambray four loko, humblebrag fanny pack affogato raclette coloring book plaid offal echo park.</p>
				</div>
			</div>
		</div>

		<div class="ccl-u-my-3 ccl-l-container">
			<h2 class="ccl-u-mb-1">Modals</h2>
			<?php get_template_part( 'components/modal' ); ?>
		</div>

		<div class="ccl-u-my-3 ccl-l-container">
			<h2 class="ccl-u-mb-1">Tooltips</h2>
			<?php get_template_part( 'components/tooltip' ); ?>
		</div>

		<div class="ccl-u-my-3 ccl-l-container">
			<h2 class="ccl-u-mb-1">Alerts</h2>
			<?php get_template_part( 'components/alerts' ); ?>
		</div>

		<div class="ccl-u-my-3 ccl-u-py-3" style="background-color:#eee">
			<div class="ccl-l-container">
				<h2 class="ccl-u-mb-3">Search</h2>
				<?php get_template_part( 'components/search-box' ); ?>
			</div>
		</div>

		<div class="ccl-u-my-5 ccl-l-container">
			<?php get_template_part( 'components/room' ); ?>
		</div>

		<div class="ccl-u-my-5 ccl-l-container">
			<h2>Profile Cards</h2>
			<div class="ccl-l-row">
				<div class="ccl-l-column ccl-l-span-half-md"><?php get_template_part( 'components/profile-card' ); ?></div>
				<div class="ccl-l-column ccl-l-span-half-md"><?php get_template_part( 'components/profile-card' ); ?></div>
			</div>
		</div>

		<div class="ccl-u-my-3 ccl-l-container">
			<?php get_template_part( 'components/promo' ); ?>
		</div>

		<div class="ccl-u-my-3 ccl-l-container">
			<?php get_template_part( 'components/promo-carousel' ); ?>
		</div>

		<div class="ccl-u-my-3 ccl-l-container">
			<?php get_template_part( 'components/quiz-card' ); ?>
		</div>

		<div class="ccl-u-mt-3 ccl-u-mb-6 ccl-l-container">
			<?php get_template_part( 'components/promo-bio-quote' ); ?>
		</div>

		<div class="ccl-u-clearfix"></div>

		<div class="ccl-u-my-6 ccl-l-container">
			<?php get_template_part( 'components/floor-map' ); ?>
		</div>

	</div>

<?php get_footer();
