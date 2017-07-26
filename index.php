<?php
/**
 * The main template file
 */

get_header(); ?>

	<div class="site-content">

		<?php //get_template_part( 'content', 'grid' ); ?>
		<?php //get_template_part( 'content', 'icons' ); ?>
		<?php //get_template_part( 'content', 'blocks' ); ?>
		<?php // get_template_part( 'content', 'components' ); ?>

		<pre>
		<?php
		$staff = \CCL\Integrations\LibGuides\get_all_staff();
		var_dump( $staff );
		echo $staff;
		?>
		</pre>
	</div>

<?php get_footer();
