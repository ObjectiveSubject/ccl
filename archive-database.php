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
$is_vendor  = isset( $taxonomy->taxonomy ) && $taxonomy->taxonomy === 'database_vendor' ? true : false;

//Ok let's process some data!
//get all the post data for this page
global $posts;
//turn into Array, this is quick and dirty
$show_article = json_decode(json_encode($posts), true);

if( $show_article ) :
    
    //initialize arrays
    $sort_array_best_bets   = array();
	$sort_array_others      = array();
	$format_filters         = array();
	$vendor_filters         = array();
	
    //if we are using a page by alphabet, set posts filtered by letter
    if ( $filter_by_letter ) {
        $show_article = array_filter( $show_article , function ($db) use ( $begins_with ) {
            return substr($db['post_title'], 0, 1) === $begins_with;
        });
	}  					
    
    foreach( $show_article as $key => $article ){
        //get metadata
        $post_metadata      = get_metadata( 'post', $article['ID'], '', false);
        $database_trial     = has_term( 'trial', 'trial', $article['ID'] );
        $db_alt_name        = get_post_meta( $article['ID'], 'db_alt_names', true );
        
        $db_formats         = wp_get_post_terms( $article['ID'], 'format' );                       
        $db_formats         = array_map( function($array){return $array->name; }, $db_formats );
        $db_formats_serial  = array_map( function($array){return sanitize_title( $array ); }, $db_formats );
        $format_list        = implode( ' | ' , $db_formats  );
        
        //add to article array
        $article['database_vendor_name']    = isset( $post_metadata['database_vendor_name'][0] ) ? $post_metadata['database_vendor_name'][0] : false;
        $article['database_friendly_url']   = isset( $post_metadata['database_friendly_url'][0] ) ? $post_metadata['database_friendly_url'][0] : false;
        $article['db_alt_names']            = $db_alt_name;
        $article['database_trial']          = $database_trial;
        $article['serialized_classes']      = implode( ' ', $db_formats_serial ) . ' ' . sanitize_title( $article['database_vendor_name'] );
        $article['formats']                 = $format_list;
        
        //if subject, get best bet
        if( $is_subject ){
            //check if current taxonomy is in best bet
            
            $best_bets_array = isset( $post_metadata['database_best_bets'][0] ) ? unserialize( $post_metadata['database_best_bets'][0]) : false;
            
            $has_best_bet    =  is_array( $best_bets_array )? in_array( $taxonomy->name, $best_bets_array , true ) : false; 
            if( $has_best_bet ){
                $article['database_best_bets']  = $best_bets_array ; 
                //if there is a best bet, then assign it to the best bet temporary array
                $article['has_best_bet']        = 'Best Bet'; 
                array_push( $sort_array_best_bets, $article );
            }else{
                //else, assign it to the regular array
                array_push( $sort_array_others, $article );
            }
            
        }else{
            array_push( $sort_array_others, $article );    
        }                       
        
        //add all formats to the formats_filter array
        if( $db_formats ){
            $format_filters = array_merge( $format_filters, $db_formats );
        }
        
        //add all vendors to vendor_filters array
        if( $article['database_vendor_name'] ){
            $vendor_filters[] = $article['database_vendor_name'];
        }
        

    }
    
    //merge in best bets
    $show_article       = array_merge( $sort_array_best_bets, $sort_array_others );
    
    //count the number of articles
    $article_count = count( $show_article );
    
    //remove duplicats from filters and create a class and readable name for each filter
    $format_filters     = array_unique( $format_filters );
    $format_filters     = array_map( function($array){
        return $array = array(
            'format_class'  => sanitize_title( $array ),
            'format_name'   => $array
            ); 
        
    }, $format_filters );
    
    //remove duplicates from vendors, and create a class and readable name for each vendor
    $vendor_filters     = array_unique( $vendor_filters );
    $vendor_filters     = array_map( function($array){
        return $array = array(
            'vendor_class'  => sanitize_title( $array ),
            'vendor_name'   => $array
            );
    }, $vendor_filters);
    
endif;
?>

<div class="site-content ccl-database-filter">

    <header class="ccl-c-hero ccl-is-naked">
        
        <?php
            /**
             * get supplementary content on data related to this subject
             */
            if( $is_subject ){
                $sorted_results = \CCL\Helpers\get_related_data( $taxonomy->term_id, array( 'staff', 'guide' ) );
            }
        ?>
        <div class="ccl-l-container">
            <div><a href="<?php echo site_url('database-directory/'); ?>" class="ccl-c-hero__action">&laquo; Back to Database Directory</a></div>
			<div class="ccl-l-row">
				<div class="ccl-l-column ccl-l-span-half-sm ccl-l-span-half-md ccl-l-span-two-thirds-lg">
					<div class="ccl-c-hero__header">
						<h1 class="ccl-c-hero__title">
                            <?php _e( 'Databases', 'ccl' ); ?>
                            <?php
                                //set up the right display
                                if( $filter_by_letter ): ?>
                                    <?php echo $filter_by_letter ? ': "<strong>' . strtoupper( $begins_with ) . '</strong>"' : ''; ?>                                    
                                <?php else: ?>
                                    <?php echo $filter_by_subject ? ':<br/>' . '<strong>'.$taxonomy->name .'</strong>' : ''; ?>                                    
                                <?php endif; ?>
                        </h1>
					</div>
				
				<div class="ccl-l-row  ccl-u-mt-2 ccl-c-database-filter__panel">
                    <div class="ccl-l-column ccl-l-span-full ccl-c-database-filter__title">
                        <div class="ccl-h3">Filtering Options:</div>
                        <div class="ccl-u-weight-bold ccl-c-database-filter__count">
                            <span class="ccl-c-database__displayed "><?php echo $article_count; ?></span> /
                            <span class="ccl-c-database__avail"><?php echo $article_count; ?></span> databases
                            
                            <button 
                                type="button" 
                                class="jplist-reset-btn ccl-c-database-filter--reset">
                                <i class="ccl-b-icon close"></i>  Reset
                            </button>                             
                        </div>

                    </div>
                    
				    <div class="ccl-l-column ccl-l-span-two-thirds-lg ccl-c-database-filter__textbox ccl-u-mt-1">
                        <i class="ccl-b-icon search" aria-hidden="true"></i>				        
                        <div class="text-filter-box">
                           <input
                            class="ccl-b-input"
                            data-path=".ccl-c-database__name" 
                            type="text" 
                            value="" 
                            placeholder="Filter by Database Name" 
                            data-control-type="textbox" 
                            data-control-name="title-filter" 
                            data-control-action="filter"
                           />
                        </div>
				    </div>
				    
				    <?php 
				    //remove best bets if by letter, vendor, and format
				    if( $is_subject ):?>
				    
    				    <div class="ccl-l-column ccl-l-span-third-lg  ccl-u-mt-1">
                            <div 
                                class="jplist-group ccl-c-database-filter__checkbox-group"
                                data-control-type="checkbox-group-filter"
                                data-control-action="filter"
                                data-control-name="best-bets">
                                
                                <label class="ccl-c-database-filter__best-best" for="best-bets">
                                    <input 
                                        data-path=".ccl-c-best-bet" 
                                        id="best-bets" 
                                        type="checkbox" 									
                                    />  
                                    <span class="ccl-c-database-filter__slider"></span>
                                </label>
                            <span class="ccl-c-database-filter__best-bet-label">Filter Best Bets</span>   
                         
                            </div>	        
    				    </div>
    				<?php endif; ?>
 
                    <?php 
                    //remove format filters if on filter page
                    if( !$is_format ): ?>   				
    				    <div class="ccl-l-column ccl-l-span-half-lg">
                            <div class="jplist-checkbox-dropdown"
                                data-control-type="checkbox-dropdown" 
                                data-control-name="format-checkbox-dropdown" 
                                data-control-action="filter"
                                data-no-selected-text="Filter by format:"
                                data-one-item-text="Filtered by {selected}"
                                data-many-items-text="{num} selected">
    
    				            <ul style="display: none;" class="ccl-u-clean-list ccl-c-database__filter-list">
    				                <?php foreach( $format_filters as $key => $format ): ?>
        				                <li>
                                          <input class="ccl-b-input" data-path=".<?php echo $format['format_class']; ?>" id="<?php echo $format['format_class']; ?>" type="checkbox"/>
                                          <label class="ccl-b-label" for="<?php echo $format['format_class']; ?>"><?php echo $format['format_name']; ?></label>						                    
        				                </li>
    				                <?php endforeach; ?>
    				            </ul>
    				            
                            </div>
    				    </div>
                    <?php endif; ?>

                    <?php 
                    //remove vendor filters if on vendor page
                    if(!$is_vendor): ?>
    				    <div class="ccl-l-column ccl-l-span-half-lg">
    				        <div class="jplist-checkbox-dropdown"
                                data-control-type="checkbox-dropdown" 
                                data-control-name="vendor-checkbox-dropdown" 
                                data-control-action="filter"
                                data-no-selected-text="Filter by Vendor:"
                                data-one-item-text="Filtered by {selected}"
                                data-many-items-text="{num} selected">
    				            <ul style="display: none;" class="ccl-u-clean-list ccl-c-database__filter-list">
    				                <?php foreach( $vendor_filters as $key => $vendor ): ?>
        				                <li>
                                          <input class="ccl-b-input" data-path=".<?php echo $vendor['vendor_class']; ?>" id="<?php echo $vendor['vendor_class']; ?>" type="checkbox"/>
                                          <label class="ccl-b-label" for="<?php echo $vendor['vendor_class']; ?>"><?php echo $vendor['vendor_name']; ?></label>					                    
        				                </li>
    				                <?php endforeach; ?>
    				            </ul>
    				        </div>				        
    				    </div>				    
				  <?php endif; ?>  
				    
				</div>
				
				</div>

				<div class="ccl-l-column ccl-l-span-half-sm ccl-l-span-half-md ccl-l-span-third-lg">
						<?php
						    if( !empty( $sorted_results ) ): ?>
					        <div class="ccl-c-database-related">
					            <div class="ccl-h3 ccl-u-mt-0">Related Help</div>
					            
					            <?php foreach( array_slice( $sorted_results, 0, 3)  as $key => $result ): ?>
					                <a class="ccl-c-database-related__item ccl-u-font-size-lg" href="<?php echo $result['url']; ?>" target="_blank">
						                <div class="ccl-c-database-related__profile" role="presentation" style="background-image:url(<?php echo $result['profile'] ?>)"></div>
						                <div class="ccl-c-database-related__name"><?php echo $result['name']; ?></div>						                    
					                </a>
					            <?php endforeach; wp_reset_query(); ?>
					            
					        </div>    

						<?php endif;?>
						

				</div>
				
			</div>

		</div>

    </header>

    <div class="ccl-l-container ccl-u-my-1 ccl-c-database-filter__container">
        
            <?php if ( $show_article ) : 
            
                //we don't want the best bet tooltip showing up for formats
                if( !$is_format && !$filter_by_letter && !$is_vendor ): ?>
                <div class="ccl-l-row" style="justify-content:flex-end;">
                    <?php $best_best_desc = 'This indicates go-to, best-of-the-best resources in ' . $taxonomy->name; ?>
                    <a style="text-decoration: underline;" class="ccl-u-weight-bold" href="#" data-toggle="tooltip" title="<?php echo $best_best_desc;  ?>">What is a Best Bet?</a>
                </div>
                <?php endif; ?>                        
                
            <?php
            //start the loop looking through each article
            foreach( $show_article as $article ): ?>

                <article id="post-<?php echo $article['ID']; ?>" <?php post_class('ccl-c-database ccl-u-mt-1 ' .  $article['serialized_classes']); ?>>
                
                    <div class="ccl-l-row">

                        <header class="ccl-l-column ccl-l-span-12 ccl-l-span-6-md ccl-l-span-4-lg">
                            
                            <a class="ccl-c-database__name" href="<?php echo esc_url( $article['database_friendly_url'] ); ?>" target="_blank" rel="bookmark">
                               <h2 class="ccl-h4 ccl-u-weight-bold"> <?php echo $article['post_title']; ?></h2>
                                
                                <?php if( $article['db_alt_names'] ): ?>
                                    <div class="ccl-c-database__alt-name ccl-u-mt-nudge">(<?php echo $article['db_alt_names']; ?>)</div>
                                <?php endif; ?>                                            
                            </a>
                            

                        </header>

                        <div class="ccl-l-column">
                            <ul class="ccl-u-clean-list ccl-u-mt-1 ccl-c-database__meta">
                                <?php 
                                //if best bet is detected in array, then append HTML
                                if( array_key_exists( 'has_best_bet', $article )  ): ?>
                                
                                    <li>
                                        <div class="ccl-u-weight-bold ccl-c-best-bet"><i class="ccl-b-icon alert" aria-hidden="true"></i>  Best Bet</div>
                                    </li>
                                <?php endif; ?>
                                
                                <?php 
                                //if trial is set, then append to HTML
                                if( $article['database_trial'] ): ?>
                                    <li class="ccl-c-database--trial">
                                        <div class="ccl-u-weight-bold ">Trial <i class="ccl-b-icon clock" aria-hidden="true"></i></div>
                                    </li>
                                <?php endif; ?>
                            
                                <?php 
                                //if this is subject, or letter (not format), then append each format type, or vendor
                                if( $is_subject || $filter_by_letter || $is_vendor  ):?>
                                    
                                    <?php if( $article['formats'] ): ?>
                                    <li class="ccl-c-database__formats">
                                        <div class="ccl-u-weight-bold "><?php echo $article['formats'];?></div>
                                    </li>
                                    <?php endif; ?>
                                <?php endif; ?>
                                
                                <?php 
                                //if vendor is present, and this is not the vendor page - show vendor
                                if(!$is_vendor && $article['database_vendor_name'] ): ?>
                                    <li>Vendor: <?php echo $article['database_vendor_name']; ?></li>
                                <?php endif; ?>                                         
                            
                            </ul>
                            
                            <p><?php echo $article['post_content']; ?></p>

                            
                            
                        </div>

                    </div>

                </article>
                
                <?php endforeach; ?>    

            <?php else: ?>

		        <p class="ccl-h3 ccl-u-mb-2">Currently no databases found for <?php echo $taxonomy->name; ?> </p>

	        <?php endif; ?>



	</div>
	
	<div class="ccl-l-container ccl-u-my-1">
        <!-- no results found -->
        <div class="jplist-no-results">
            <p>No results found</p>
        </div>		    
	</div>


</div>

<?php get_footer();
