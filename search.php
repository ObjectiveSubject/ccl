<?php
/**
 * The template for displaying search results pages
 */
get_header(); 

	global $wp_query;
	
	if( have_posts() ):
			
	$pagination_args = array(
	    'prev_text' => '<span class="ccl-h3 ccl-u-mr-1">&#8249; ' . __( 'Previous page', 'ccl' ) . '</span>',
	    'next_text' => '<span class="ccl-h3 ccl-u-ml-1">' . __( 'Next page', 'ccl' ) . ' &#8250;</span>',
	    'before_page_number' => '<span class="ccl-h3" style="margin-left:0.5rem;margin-right:0.5rem"><span class="meta-nav screen-reader-text">' . __( 'Page', 'ccl' ) . ' </span>',
	    'after_page_number' => '</span>'
	); 
			
	//create an empty array for filtered results to be sorted, 
	//each primary array key will be a post type, ie guide, page, staff, etc
	$sorted_search_results = array(
			'guide' 	=> array(
				'title'		=> '<span class="ccl-b-icon compass" aria-hidden="true"></span>  Guides',
				'slug'		=> 'Curated list of the best research tools and resources for a discipline or subject',
				),
			'faq'		=> array(
				'title'		=> '<span class="ccl-b-icon question" aria-hidden="true"></span>  FAQs',
				'slug'		=> 'Quick answers to frequently asked questions about the library and our services',
				),						
			'webpage'		=> array(
				'title'		=> '<span class="ccl-b-icon clip" aria-hidden="true"></span>  Library Website',
				'slug'		=> 'Content from the library website',
				),
			'staff'		=> array(
				'title'		=> '<span class="ccl-b-icon person" aria-hidden="true"></span>  Staff',
				'slug'		=> 'Library staff',
				),
			'news'		=> array(
				'title'		=> '<span class="ccl-b-icon calendar" aria-hidden="true"></span>  News',
				'slug'		=> 'Information about new things happening at the library',
				),						
			'database'	=> array(
				'title'		=> '<span class="ccl-b-icon pointer-right" aria-hidden="true"></span>  Databases',
				'slug'		=> 'Electronic resources available through the library',
				),
			'general'		=> array(
				'title'		=> '<span class="ccl-b-icon clip" aria-hidden="true"></span>  Resources',
				'slug'		=> 'General resources offered by the library',
				)

		);
		
	$temp_guide_posts		= array();
	$temp_webpage_posts		= array();
	$temp_staff_posts		= array();
	$temp_database_posts	= array();
	$temp_faq_posts 		= array();
	$temp_general_posts		= array();
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
				$temp_webpage_posts[] = array(
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
				
			case 'news':
				$temp_news_posts[] = array(
					'ID'			=> $post->ID,
					'post_title'	=> $post->post_title,
					'post_url'		=> get_permalink( $post->ID ) ?: get_post_type_archive_link( 'news' ) ,
					'slug'			=> $post->post_name,
					);	
					
				break;
				
			default:
				$temp_general_posts[] = array(
					'ID'			=> $post->ID,
					'post_title'	=> $post->post_title,
					'post_url'		=> get_post_meta( $post->ID , 'general_url', true ) ?: site_url() ,
					'slug'			=> $post->post_name,
					);	
					
			
		}
	}

	//assign to the appropriate array			
	$sorted_search_results['guide']['posts']	= $temp_guide_posts;
	$sorted_search_results['webpage']['posts'] 	= $temp_webpage_posts;
	$sorted_search_results['staff']['posts']	= $temp_staff_posts;
	$sorted_search_results['database']['posts'] = $temp_database_posts;
	$sorted_search_results['faq']['posts']		= $temp_faq_posts;
	$sorted_search_results['news']['posts'] 	= $temp_news_posts;
	$sorted_search_results['general']['posts'] 	= $temp_general_posts;	
	
	//check to make sure there are posts for each post type
	$sorted_search_results = array_filter( $sorted_search_results, function( $k ){
		
		return !empty( $k['posts'] );
		
	} );
	
	endif;
	
?>
<div id="content" class="site-content">

	<header class="ccl-c-hero">
		<div class="ccl-l-container">
			<div class="ccl-l-row">

				<?php 	if ( have_posts() ): ?>
					<div class="ccl-l-column ccl-l-span-two-thirds-lg">				

						<h1> <?php printf( esc_html__( 'Search Results for : %s', '_s' ), '<strong><br />' . get_search_query() . '</strong>' ); ?> </h1>
						<div class=" ccl-u-ml-2 ccl-u-mt-1 ccl-u-weight-bold "><?php echo $wp_query->found_posts; ?> results found</div>
					</div>
					<div class="ccl-l-column ccl-l-span-third-lg">
	                    <div class="ccl-c-hero__content">
	                        <ul class="ccl-c-hero__menu">
	
	                            <?php foreach ( $sorted_search_results as $key => $result ) : ?>
	                            
	                            	<?php $result_count = count( $result['posts'] ); ?>
	
	                                <li><a class="js-smooth-scroll" href="#<?php echo $key; ?>"><?php echo $result['title'] . '  ('. $result_count .')' ; ?></a></li>
	
	                            <?php endforeach; ?>
	
	                        </ul>
	                    </div>
	                    
					</div>						
				<?php else: ?>
						<div class="ccl-l-column ccl-l-span-two-thirds-lg">						
							<h1><?php printf( esc_html__( 'No Results for : %s', '_s' ), '<strong>' . get_search_query() . '</strong>' ); ?> </h1>
						</div>					
				<?php endif; ?>					
			</div>
		</div>			
	</header>



	<div class="ccl-l-container">			
		<div class="ccl-u-mt-2">			
			<?php
			
			if( have_posts() ) :
			
			$post_type_count = 0;
			//check for items in post type, then render
			foreach( $sorted_search_results as $key => $result ): ?>
				
	        	<div id="<?php echo $key; ?>" class="ccl-l-row ccl-u-mt-2  ccl-c-search-page <?php //echo ( $post_type_count % 2 === 0 ) ? '' : 'ccl-l-offset-2-lg'; ?>">				
					<div class="ccl-l-column ccl-l-span-12 ccl-l-span-6-md ccl-l-span-4-lg ccl-c-search-page__header">
						<h3 class="ccl-c-search-page__title"><?php echo $result['title']; ?></h3>
						<div class="ccl-u-faded ccl-c-search-page__slug">
							<?php echo $result['slug']; ?>
						</div>								
					</div>
					<div class=" ccl-c-column ccl-c-search-page__content">							
					
						<ul class="ccl-c-search-page__items ccl-u-clean-list">
							<?php foreach( $result['posts'] as $key => $post): ?>
								<li class="ccl-c-search-page__list-links"><a href="<?php echo $post['post_url']; ?>" target="_blank">
									<span class="ccl-u-weight-bold"><?php echo $post['post_title']; ?></span>
									<span>View  <span class="ccl-b-icon arrow-right" aria-hidden="true"></span></span></a>
								</li>
							<?php endforeach; ?>
						</ul>
						
					</div>
					
				</div>
			<?php $post_type_count++; ?>	
				
	
			<?php endforeach; ?>
	
			<?php else: //this is the end of ccl-l-row 
			//no results	
			?>
			
				<div>Sorry, no search results found for "<?php echo get_search_query(); ?>"</div>
			
			
			<?php endif; ?>
		</div>
		
		<?php //the_posts_navigation(); ?>
		<div class="ccl-u-mt-3 ccl-u-mb-3">
			<?php //the_posts_pagination( $pagination_args ); ?>
		</div>		

	</div>
</div>

<?php

get_footer();