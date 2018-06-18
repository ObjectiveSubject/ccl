<?php
/**
 * Template Name: Database Directory
 */

get_header(); ?>

	<div id="content" class="site-content">

		<?php while ( have_posts() ) : the_post(); ?>

			<?php
			$thumb_url   = get_the_post_thumbnail_url( $post, 'full' );
			$title       = get_the_title();   // Could use 'the_title()' but this allows for override
			$description = ( $post->post_excerpt ) ? get_the_excerpt(): ''; // Could use 'the_excerpt()' but this allows for override
            $hero_class  = $thumb_url ? 'ccl-c-hero ccl-has-image':     'ccl-c-hero';
            $is_alpha_sort = strpos( $_SERVER['QUERY_STRING'], 'sort=alpha' ) > -1;
            $is_subject_sort = ( ! $is_alpha_sort );
            
			?>

			<article <?php post_class(); ?>>

				<div class="<?php echo esc_attr( $hero_class ); ?>" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)">

					<div class="ccl-c-hero__thumb" style="background-image:url(<?php echo esc_url( $thumb_url ); ?>)"></div>
					
					<div class="ccl-l-container">

						<div class="ccl-l-row">

							<div class="ccl-l-column ccl-l-span-third-lg">
								<div class="ccl-c-hero__header">
									<h1 class="ccl-c-hero__title"><?php echo apply_filters( 'the_title', $title ); ?></h1>
								</div>
                            </div>
                            
                            <div class="ccl-l-column ccl-l-span-third-lg">
								<div class="ccl-c-hero__content">
								
                                    <ul class="ccl-c-hero__menu">
                                         <li>
                                            <a href="#block-database-search" class="js-smooth-scroll"><?php _e( 'Find a Specific Database by Name or Description', 'ccl' ); ?></a>
                                            <span class="ccl-b-icon arrow-down" aria-hidden="true"></span>
                                        </li>                                       
                                        <li>
                                            <a href="#block-subject" class="js-smooth-scroll"><?php _e( 'Databases by Subject', 'ccl' ); ?></a>
                                            <span class="ccl-b-icon arrow-down" aria-hidden="true"></span>
                                        </li>                                        
                                        <li>
                                            <a href="#block-title" class="js-smooth-scroll"><?php _e( 'Databases by Name', 'ccl' ); ?></a>
                                            <span class="ccl-b-icon arrow-down" aria-hidden="true"></span>
                                        </li>
                                        <li>
                                            <a href="#block-format" class="js-smooth-scroll"><?php _e( 'Databases by Format', 'ccl' ); ?></a>
                                            <span class="ccl-b-icon arrow-down" aria-hidden="true"></span>
                                        </li>
                                    </ul>
        
								</div>
							</div>
							
							<div class="ccl-l-column ccl-l-span-third-lg">
								<?php if ( $description ) : ?>
									<div class="ccl-h4 ccl-u-mt-0"><?php echo apply_filters( 'the_excerpt', $description ); ?></div>
								<?php endif; ?>							    
							    
							</div>
							
						</div>

					</div>

                </div>
                
                <?php if ( get_the_content() ) : ?>

                    <div class="ccl-l-container">

                        <div class="ccl-l-row">
                            <div class="ccl-c-entry-content ccl-l-column ccl-l-span-9-md ccl-u-my-2">
                                <?php the_content(); ?>
                            </div>
                        </div>
                        
                    </div> 
                    
                <?php endif; ?>

                <div class="ccl-l-container ccl-u-mb-3">
                    
                    <div id="block-database-search" class="ccl-c-promo ccl-u-mt-4">
                        <h2 class="ccl-u-mt-0"><?php _e('Find a Specific Database by Name or Description','ccl'); ?></h2>                        
                       <?php get_template_part('partials/post-search'); ?> 
                    </div>
                    
                    <div id="block-subject" class="ccl-c-promo ccl-u-mt-4">
                        
                        <h2 class="ccl-u-mt-0"><?php _e('Databases by Subject','ccl'); ?></h2>


                        <?php $subjects = get_terms( array( 
                            'post_types'    => 'database',
                            'taxonomy'      => 'subject',
                            'parent'        => 0
                        ) );
                        
                        // foreach( $subjects as $subject ){
                        //     $args = array('post_type' => 'database',
                        //         'tax_query' => array(
                        //             array(
                        //                 'taxonomy' => 'subject',
                        //                 'field' => 'slug',
                        //                 'terms' => $subject->slug,
                        //             ),
                        //         ),
                        //      ); 
                        //     $loop = new WP_Query($args);  
                            
                        //     echo '<pre>';
                        //     print_r( $loop->post_count );
                        //     echo '</pre>';                           
                        // }                    
                        
                        if ( $subjects ) : ?>
                            
                            <ul class="ccl-u-ml-2 ccl-u-clean-list ccl-u-mt-1 ccl-u-columns-2-md ccl-u-columns-3-lg">

                            <?php foreach ( $subjects as $subject ) : ?>
                                    <li style="line-height:2"><a title="Find databases with resources on '<?php echo $subject->name; ?>'" class="ccl-h4" href="<?php echo  esc_url( get_term_link( $subject, 'subject' ) . '?post_type=database' ); ?>"><?php echo $subject->name; ?></a></li>
                            <?php endforeach; ?>

                            </ul>

                        <?php endif; ?>

                    </div>                    
                    
                    <?php
                    
                        $args = array(
                            'post_type' => 'database',
                            'orderby' => 'title',
                            'order' => 'ASC',
                            'posts_per_page' => -1
                        );
                    
                        $databases = new WP_Query( $args );
                        
                        $get_letters = json_decode(json_encode($databases->posts), true);
                        
                        $get_letters = array_map( function($array){
                            
                            $temp = strtoupper( substr($array['post_title'], 0, 1) );
                            
                            return  preg_match('~[0-9]~', $temp) ? $temp = '0 - 9' : $temp;
                        
                        }, $get_letters );
                        
                        $get_letters = array_unique( $get_letters );
                        //ctype_digit()
                        //preg_match('~[0-9]~', $string)
                        
                        //\CCL\Helpers\debug_to_console( $get_letters  );
                    
                    ?>
                    
                    
                    
                    <div id="block-title" class="ccl-c-promo ccl-u-mt-4">

                        <h2 class="ccl-u-mt-0"><?php _e('Databases by Title','ccl'); ?></h2>

                        <?php $letters = array( '0 - 9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z' ); ?>
                        <ul class="ccl-u-ml-2 ccl-u-clean-list ccl-u-mt-1 ccl-c-database__by-alpha">
                            <?php foreach ( $letters as $letter ) : ?>
                            
                                <?php if( in_array( $letter, $get_letters ) ):    ?>
                                    <li class="ccl-c-database__letter">
                                        <a title="Find databases that begin with '<?php echo $letter; ?>'" href="<?php echo esc_url( get_post_type_archive_link( 'database' ) . '&begins_with=' . $letter ); ?>"><?php echo $letter; ?></a>
                                    </li>                              
                                <?php else: ?>
                                    <li class="ccl-c-database__letter">
                                        <span class="ccl-u-faded"><?php echo $letter; ?></span>
                                    </li>
                                <?php endif; ?>

                            <?php endforeach; ?>
                        </ul>

                    </div>



                    <?php $formats = get_terms( array( 
                        'taxonomy' => 'format',
                    ) );
                    
                    if ( $formats ) : ?>
                        <div id="block-format" class="ccl-c-promo ccl-u-mt-4">
                            
                            <h2 class="ccl-u-mt-0"><?php _e('Databases by Format/Type','ccl'); ?></h2>                        
                                
                                <ul class="ccl-u-ml-2 ccl-u-clean-list ccl-u-mt-1 ccl-u-columns-2-md ccl-u-columns-3-lg">
    
                                <?php foreach ( $formats as $format ) : ?>
    
                                        <li style="line-height:2"><a title="Find databases that contain '<?php echo $format->name; ?>'" class="ccl-h4" href="<?php echo  esc_url( get_term_link( $format, 'format' ) . '?post_type=database' ); ?>"><?php echo $format->name; ?></a></li>
                                <?php endforeach; ?>
    
                                </ul>
                        </div>
                    <?php endif; ?>


                </div>
                
				<?php get_template_part( 'partials/blocks' ); ?>

			</article>

			<?php 
			//get the related posts from template part
			get_template_part( 'partials/related-posts' ); ?>

		<?php endwhile; ?>

	</div>

<?php get_footer();