<?php
/**
 * Template Name: Demo: Components
 */

get_header(); ?>

	<div class="site-content">

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
			<div class="ccl-c-alert">
				<button type="button" class="ccl-b-close" data-dismiss="alert" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<i class="ccl-b-icon-alert" aria-hidden="true"></i> This is an <strong>Alert</strong>! Pretty cool, right?
			</div>
			<div class="ccl-c-alert ccl-is-warning">
				<button type="button" class="ccl-b-close" data-dismiss="alert" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<i class="ccl-b-icon-alert" aria-hidden="true"></i> This is a <strong>warning alert</strong>! Better check on something.
			</div>
			<div class="ccl-c-alert ccl-is-error">
				<button type="button" class="ccl-b-close" data-dismiss="alert" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<i class="ccl-b-icon-alert" aria-hidden="true"></i> This is an <strong>error Alert</strong>! Something went wrong.
			</div>
			<div class="ccl-c-alert ccl-is-muted">
				<button type="button" class="ccl-b-close" data-dismiss="alert" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
				<i class="ccl-b-icon-alert" aria-hidden="true"></i> This is a <strong>muted Alert</strong>. For when you want a softer "voice".
			</div>
		</div>

		<div class="ccl-u-my-3">
			<?php get_template_part( 'components/search-box' ); ?>
		</div>

		<div class="ccl-u-my-5 ccl-l-container">
			<?php get_template_part( 'components/room' ); ?>
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
