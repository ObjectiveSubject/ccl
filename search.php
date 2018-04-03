<?php
/**
 * The template for displaying search results pages
 */
get_header(); 

	global $wp_query;

?>
	<div class="site-content">

		<div class="ccl-l-container">

			<header>

				<?php
				if ( have_posts() ): ?>
					<h1> <?php printf( esc_html__( 'Search Results for: %s', '_s' ), '<strong>' . get_search_query() . '</strong>' ); ?> </h1>
					<div class=" ccl-u-ml-2 ccl-u-mt-1 ccl-u-faded ccl-u-weight-bold "><?php echo $wp_query->found_posts; ?> results found</div>
				<?php else: ?>
					<h1><?php printf( esc_html__( 'No Results for: %s', '_s' ), '<strong>' . get_search_query() . '</strong>' ); ?> </h1>
				<?php endif; ?>
			
			</header>

			<?php if ( have_posts() ) : 
			
			$pagination_args = array(
			    'prev_text' => '<span class="ccl-h3 ccl-u-mr-1">&#8249; ' . __( 'Previous page', 'ccl' ) . '</span>',
			    'next_text' => '<span class="ccl-h3 ccl-u-ml-1">' . __( 'Next page', 'ccl' ) . ' &#8250;</span>',
			    'before_page_number' => '<span class="ccl-h3" style="margin-left:0.5rem;margin-right:0.5rem"><span class="meta-nav screen-reader-text">' . __( 'Page', 'ccl' ) . ' </span>',
			    'after_page_number' => '</span>'
			); 
			
			?>

    		<div class="ccl-u-mt-2">

			<?php
			//create an empty array for filtered results to be sorted, 
			//each primary array key will be a post type, ie guide, page, staff, etc
			$sorted_search_results = array(
					'guide' 	=> array(
						'title'		=> '<i class="ccl-b-icon compass" aria-hidden="true"></i>  Guides',
						'slug'		=> 'Curated list of the best research tools and resources for a discipline or subject',
						),
					'faq'		=> array(
						'title'		=> '<i class="ccl-b-icon question" aria-hidden="true"></i>  FAQs',
						'slug'		=> 'Quick answers to frequently asked questions about the library and our services',
						),						
					'page'		=> array(
						'title'		=> '<i class="ccl-b-icon clip" aria-hidden="true"></i>  Library Website',
						'slug'		=> 'Content from the library website',
						),
					'staff'		=> array(
						'title'		=> '<i class="ccl-b-icon person" aria-hidden="true"></i>  Staff',
						'slug'		=> 'Library staff',
						),
					'news'		=> array(
						'title'		=> '<i class="ccl-b-icon calendar" aria-hidden="true"></i>  News',
						'slug'		=> 'Information about new things happening at the library',
						),						
					'database'	=> array(
						'title'		=> '<i class="ccl-b-icon pointer-right" aria-hidden="true"></i>  Databases',
						'slug'		=> 'Electronic resources offered through the library',
						),
					'room'		=> array(
						'title'		=> '<i class="ccl-b-icon home" aria-hidden="true"></i>  Rooms',
						'slug'		=> 'Spaces throughout the library',
						)						

				);
				
				$temp_guide_posts		= array();
				$temp_page_posts		= array();
				$temp_staff_posts		= array();
				$temp_database_posts	= array();
				$temp_faq_posts 		= array();
				$temp_room_posts		= array();
				$temp_news_posts		= array();	
				
				//start sorting through each post, pull each out, and assign correct custom data
				foreach( $wp_query->posts as $post ){
					
					//identify each post type and assign the appropriate data
					switch($post->post_type){
						
						case 'guide':
							$temp_guide_posts[] = array(
								'ID'			=> $post->ID,
								'post_title'	=> $post->post_title,
								'post_url'		=> get_post_meta( $post->ID, 'guide_friendly_url', true ) ?: site_url('/research-guides/'),
								'slug'			=> $post->post_name,
								);

							break;
						
						case 'page':
							$temp_page_posts[] = array(
								'ID'			=> $post->ID,
								'post_title'	=> $post->post_title,
								'post_url'		=> get_permalink( $post->ID ) ?: $post->guid,
								'slug'			=> $post->post_name,
								);							
							
							break;
							
						case 'staff':
							
							$temp_staff_posts[] = array(
								'ID'			=> $post->ID,
								'post_title'	=> $post->post_title,
								'post_url'		=> get_post_meta( $post->ID, 'member_friendly_url', true ) ?: site_url('/staff-directory/'),
								'slug'			=> $post->post_name,
								);							
							
							break;
							
						case 'database':
							$temp_database_posts[] = array(
								'ID'			=> $post->ID,
								'post_title'	=> $post->post_title,
								'post_url'		=> get_post_meta( $post->ID, 'database_friendly_url', true ) ?: site_url('/database-directory/'),
								'slug'			=> $post->post_name,
								);							
							
							break;
							
						case 'faq':
							$temp_faq_posts[] = array(
								'ID'			=> $post->ID,
								'post_title'	=> $post->post_title,
								'post_url'		=> get_post_meta( $post->ID, 'faq_friendly_url', true ) ?: 'https://claremont.libanswers.com/',
								'slug'			=> $post->post_name,
								'content'		=> $post->post_content
								);							
							
							break;
							
						case 'room':
							$temp_room_posts[] = array(
								'ID'			=> $post->ID,
								'post_title'	=> $post->post_title,
								'post_url'		=> site_url('/meeting-and-presentation-spaces/'),
								'slug'			=> $post->post_name,
								);							
							
							break;							
							
						case 'news':
							$temp_news_posts[] = array(
								'ID'			=> $post->ID,
								'post_title'	=> $post->post_title,
								'post_url'		=> get_permalink( $post->ID ) ?: get_post_type_archive_link( 'news' ) ,
								'slug'			=> $post->post_name,
								);	
								
							break;							
						
					}
				}
			
				//assign to the appropriate array			
				$sorted_search_results['guide']['posts']	= $temp_guide_posts;
				$sorted_search_results['page']['posts'] 	= $temp_page_posts;
				$sorted_search_results['staff']['posts']	= $temp_staff_posts;
				$sorted_search_results['database']['posts'] = $temp_database_posts;
				$sorted_search_results['faq']['posts']		= $temp_faq_posts;
				$sorted_search_results['room']['posts'] 	= $temp_room_posts;
				$sorted_search_results['news']['posts'] 	= $temp_news_posts;
				
			?>
			
			
			<?php
			$post_type_count = 0;
			//check for items in post type, then render
			foreach( $sorted_search_results as $key => $result ): ?>
				
				<?php 
				//skip if there are no posts //ccl-l-span-5-lg
				if( empty( $result['posts'] ) ) continue; ?>
				
	            	<div class="ccl-l-row ccl-u-mt-2  ccl-c-search-page <?php //echo ( $post_type_count % 2 === 0 ) ? '' : 'ccl-l-offset-2-lg'; ?>">				
						<div class="ccl-l-column ccl-l-span-12 ccl-l-span-6-md ccl-l-span-4-lg ccl-c-search-page__header">
							<h2 class="ccl-c-search-page__title"><?php echo $result['title']; ?></h2>
							<div class="ccl-u-faded ccl-u-weight-bold ccl-c-search-page__slug">
								<?php echo $result['slug']; ?>
							</div>								
						</div>
						<div class=" ccl-c-column ccl-c-search-page__content">							
						
							<ul class="ccl-c-search-page__items ccl-u-clean-list">
								<?php foreach( $result['posts'] as $key => $post): ?>
									<li class="ccl-c-search-page__list-links"><a href="<?php echo $post['post_url']; ?>" target="_blank">
										<span><?php echo $post['post_title']; ?></span>
										<span>View  <i class="ccl-b-icon arrow-right" aria-hidden="true"></i></span></a>
									</li>
								<?php endforeach; ?>
							</ul>
							
						</div>
						
					</div>
				<?php $post_type_count++; ?>	
				

			<?php endforeach; ?>

    		<?php  //this is the end of ccl-l-row ?>
    		</div>
			
			<?php //the_posts_navigation(); ?>
			<div class="ccl-u-mt-3 ccl-u-mb-3">
				<?php the_posts_pagination( $pagination_args ); ?>
			</div>		

			<?php endif; ?>

		</div>
	</div>

<?php

get_footer();