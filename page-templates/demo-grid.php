<?php
/**
 * Template Name: Demo: Grid
 */

get_header(); ?>

	<div class="site-content">

		<div class="ccl-l-container">

			<style>
				.ccl-l-column {
					background: #ddd;
					padding: 1.5em 0.5em;
					margin-bottom: 1em;
					font-size:14px;
					line-height:1.1;
					font-weight: bold;
					text-align:center;
				}
			</style>

			<div class="ccl-l-row ccl-u-my-3">

				<?php

				$i = 1;
				$columns = 6;

				do { ?>

					<div class="<?php echo "ccl-l-column"; ?>"><?php echo ".ccl-l-column"; ?></div>

					<?php $i++;
				}

				while( $i <= $columns );

				?>

			</div>

			<div class="ccl-l-row ccl-u-my-3">
				<div class="ccl-l-column ccl-l-span-4-lg" style="padding:1.5em 0">
					.ccl-l-span-4-lg
				</div>
				<div class="ccl-l-column ccl-l-span-8-lg" style="padding:1.5em 0">
					.ccl-span-8-lg
					<div class="ccl-l-row ccl-u-mt-1">
						<div class="ccl-l-column ccl-l-span-4-md ccl-l-span-6-lg" style="background:#bbb">.ccl-l-span-4-md.ccl-l-span-6-lg</div>
						<div class="ccl-l-column ccl-l-span-4-md ccl-l-span-6-lg" style="background:#bbb">.ccl-l-span-4-md.ccl-l-span-6-lg</div>
						<div class="ccl-l-column ccl-l-span-4-md ccl-l-span-6-lg" style="background:#bbb">.ccl-l-span-4-md.ccl-l-span-6-lg</div>
						<div class="ccl-l-column ccl-l-span-4-md ccl-l-span-6-lg" style="background:#bbb">.ccl-l-span-4-md.ccl-l-span-6-lg</div>
						<div class="ccl-l-column ccl-l-span-4-md ccl-l-span-6-lg" style="background:#bbb">.ccl-l-span-4-md.ccl-l-span-6-lg</div>
						<div class="ccl-l-column ccl-l-span-4-md ccl-l-span-6-lg" style="background:#bbb">.ccl-l-span-4-md.ccl-l-span-6-lg</div>
					</div>
				</div>
			</div>

			<div class="ccl-l-row ccl-u-my-3">

				<?php

				$i = 1;
				$columns = 12;

				do { ?>

					<div class='<?php echo "ccl-l-column ccl-l-span-{$i}"; ?>'><?php echo ".ccl-l-span-{$i}"; ?></div>

					<?php
					$alt_i = $columns - $i;
					if ( $alt_i > 0 ) {
						do { ?>

							<div class='ccl-l-column ccl-l-span-1 ccl-l-span-1-sm ccl-l-span-1-md ccl-l-span-1-lg'>.ccl-l-span-1</div>

							<?php $alt_i--;
						}

						while( $alt_i > 0 );
					} ?>

					<?php $i++;
				}

				while( $i <= $columns );

				?>

			</div>


		</div>


	</div>

<?php get_footer();
