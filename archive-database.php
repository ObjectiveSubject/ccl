<?php
/**
 * Archive Template
 */

get_header();

//check if letter
if( isset( $_GET['begins_with'] ) && '' !== $_GET['begins_with'] ){
    $begins_with =   substr( sanitize_text_field( $_GET['begins_with'] ), 0, 1 ); // Sanitize and reduce to one character, technically could be validated against A-Z
}

$filter_by_letter   = isset( $_GET['begins_with'] ) && '' !== $_GET['begins_with'];
$filter_by_subject  = isset( $_GET['post_type'] ) && '' !== $_GET['post_type'];

//might be a little redundant, but here we are checking to see if this is a subject or format
$taxonomy   = get_queried_object();
$is_subject = isset( $taxonomy->taxonomy ) && $taxonomy->taxonomy === 'subject' ? true : false;
$is_format  = isset( $taxonomy->taxonomy ) && $taxonomy->taxonomy === 'format' ? true : false;

$pagination_args = array(
    'prev_text' => '<span class="ccl-h3 ccl-u-mr-1">&#8249; ' . __( 'Previous page', 'ccl' ) . '</span>',
    'next_text' => '<span class="ccl-h3 ccl-u-ml-1">' . __( 'Next page', 'ccl' ) . ' &#8250;</span>',
    'before_page_number' => '<span class="ccl-h3" style="margin-left:0.5rem;margin-right:0.5rem"><span class="meta-nav screen-reader-text">' . __( 'Page', 'ccl' ) . ' </span>',
    'after_page_number' => '</span>'
); 
?>

	<div class="site-content">

        <header class="ccl-c-hero ccl-is-naked">
            
            <div class="ccl-l-container">
                <div><a href="<?php echo site_url('database-directory/'); ?>" class="ccl-c-hero__action">&laquo; Back to Database Directory</a></div>
				<div class="ccl-l-row">
					<div class="ccl-l-column ccl-l-span-third-lg">
						<div class="ccl-c-hero__header">
							<h1 class="ccl-c-hero__title">
                                <?php _e( 'Databases', 'ccl' ); ?>
                                <?php echo $filter_by_letter ? ': "' . strtoupper( $begins_with ) . '"' : ''; ?>
                                <?php echo $filter_by_subject ? ':<br/>' . $taxonomy->name : ''; ?>
                            </h1>
						</div>
					</div>

					<div class="ccl-l-column ccl-l-span-two-thirds-lg">
						<div class="ccl-c-hero__content">
							<div class="ccl-h4 ccl-u-mt-0"><?php echo the_archive_description(); ?></div>
						</div>
					</div>
					
				</div>

			</div>

        </header>

        <div class="ccl-l-container ccl-u-my-3">
            
            <?php
                //Ok let's process some data!
                //get all the post data for this page
                global $posts;
                //turn into Array, this is quick and dirty
                $db_posts = json_decode(json_encode($posts), true);
                
                //start pagination
                $shown_posts = 0;
                
                //if there are posts
                if ( $db_posts ) :
                    
                    //if we are using a page by alphabet, set posts filtered by letter
                    if ( $filter_by_letter ) {
                        $show_article = array_filter( $db_posts, function ($db) use ( $begins_with ) {
                            return substr($db['post_title'], 0, 1) === $begins_with;
                        });
    
    				} else {
    				    //if this is a subject page, then set the regular posts from query
    					//there's probably a better way to do this, but we want best bets at the top alphabetically, 
    					//then all other databases also in alpha
    					//also works for format too
    					
    					//$show_article = array();
    					$sort_array_best_bets = array();
    					$sort_array_others = array();
    					
                        foreach( $db_posts as $key => $article ){
                            //get best bet custom field
                            $best_bet_check     = get_post_meta( $article['ID'], 'database_best_bets', true );
                            
                            
                            if( is_array( $best_bet_check ) ){
                                //check if current taxonomy is in best bet
                                $has_best_bet    = in_array( $taxonomy->name, $best_bet_check, true ); 
                                if( $has_best_bet ){
                                    //if there is a best bet, then assign it to the best bet temporary array
                                    $article['has_best_bet'] = 'Best Bet'; 
                                    array_push( $sort_array_best_bets, $article );
                                }else{
                                    //else, assign it to the regular array
                                    array_push( $sort_array_others, $article );
                                }
                                
                            }else{
                                array_push( $sort_array_others, $article );    
                            }
                            
                        }
                        //merge array together
                        $show_article = array_merge( $sort_array_best_bets, $sort_array_others );
    
    				}
	
                    if ( $show_article ) : 
                    
                        //we don't want the best bet tooltip showing up for formats
                        if( !$is_format && !$filter_by_letter ): ?>
                        <div class="ccl-l-row" style="justify-content:flex-end;">
                            <?php $best_best_desc = 'This indicates go-to, best-of-the-best resources in ' . $taxonomy->name; ?>
                            <a style="text-decoration: underline;" class="ccl-u-weight-bold" href="#" data-toggle="tooltip" title="<?php echo $best_best_desc;  ?>">What is a Best Bet?</a>
                        </div>
                        <?php endif; ?>                        
                        
                    <?php
                    //start the loop looking through each article
                    foreach( $show_article as $article ):
                        
                        //get relevant metadata
                        $database_friendly_url  = get_post_meta( $article['ID'], 'database_friendly_url', true );
                        $url                    = $database_friendly_url ? $database_friendly_url : get_permalink();
                        //check for the trial tax
                        $database_trial         = has_term( 'trial', 'trial', $article['ID'] );
                        ?>

                        <article id="post-<?php $article['ID']; ?>" <?php post_class('ccl-c-database ccl-u-mt-1'); ?>>
                        
                            <div class="ccl-l-row">

                                <header class="ccl-l-column ccl-l-span-12 ccl-l-span-6-md ccl-l-span-4-lg">
                                    <?php echo '<h2 class="ccl-h4 ccl-u-weight-bold"><a href="' . esc_url(  $url )  . '" target="_blank" rel="bookmark">'. $article['post_title'] .'</a></h2>'; ?>
                                </header>

                                <div class="ccl-l-column">
                                    <ul class="ccl-u-clean-list ccl-u-mt-1">
                                        <?php 
                                        //if best bet is detected in array, then append HTML
                                        if( array_key_exists( 'has_best_bet', $article )  ): ?>
                                        
                                            <li style="display:inline-block;" class="ccl-u-faded ccl-u-weight-bold ccl-u-mr-1 ccl-u-best-bet">Best Bet <i class="ccl-b-icon alert" aria-hidden="true"></i></li>
                                        <?php endif; ?>
                                        
                                        <?php 
                                        //if trial is set, then append to HTML
                                        if( $database_trial ): ?>
                                            <li style="display:inline-block;" class="ccl-u-faded ccl-u-weight-bold ccl-u-mr-1">Trial <i class="ccl-b-icon clock" aria-hidden="true"></i></li>
                                        <?php endif; ?>
                                    
                                        <?php 
                                        //if this is subject, or letter (not format), then append each format type
                                        if( $is_subject || $filter_by_letter ):
                                                //get terms, filter for all term names, implode and append HTML
                                                $format_types   = wp_get_post_terms( $article['ID'], 'format' );
                                                $db_formats     = array_map( function($array){return $array->name; }, $format_types );
                                                $format_list = implode( ' | ' , $db_formats  );
                                            ?>
                                            <li style="display:inline-block;" class="ccl-u-faded ccl-u-weight-bold"><?php echo $format_list;?></li>
                                        <?php endif; ?>                                    
                                    
                                    </ul>

                                    <p><?php echo $article['post_content']; ?></p>
                                </div>

                            </div>

                        </article>
    
                            <?php $shown_posts++; ?>
                        
                        <?php endforeach; ?>    

					<?php endif; ?>


                
                <?php if ( $shown_posts > 0 ) : ?>
                    <div class="ccl-u-mt-3">
                        <?php the_posts_pagination( $pagination_args ); ?>
                    </div>
                <?php else : ?>
                    <p class="ccl-h3 ccl-u-mb-2">Currently no databases found for <?php echo $taxonomy->name; ?> </p>
                <?php endif; ?>

			<?php else : ?>

				<p class="ccl-h3 ccl-u-mb-2">Currently no databases found for <?php echo $taxonomy->name; ?> </p>

			<?php endif; ?>

		</div>

	</div>

<?php get_footer();
