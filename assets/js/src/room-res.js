/**
 * Room Reservation
 * 
 * Handle room reservations
 */

( function( window, $ ) {
	'use strict';
    var document = window.document;

    var RoomResForm = function(el){

        var now = new Date();
        
        this.$el = $(el);
        this.$formContent = this.$el.find('.js-room-res-form-content').css({position:'relative'});
        this.$formResponse = this.$el.find('.js-room-res-form-response').css({position: 'absolute', top: '1rem', left: '1rem', opacity: 0});
        this.$formCancel = this.$el.find('.js-room-res-form-cancel');
        this.$formSubmit = this.$el.find('.js-room-res-form-submit');
        this.$formReload = this.$el.find('.js-room-res-form-reload');
        this.roomId = this.$el.data('resource-id');
        this.$dateSelect = this.$el.find('.js-room-date-select');
        this.dateYmd = this.$dateSelect.val();
        this.$roomSchedule = this.$el.find('.js-room-schedule');
        this.$currentDurationText = this.$el.find('.js-current-duration');
        this.$formNotification = $('<p class="ccl-c-alert"></p>');
        this.$resetSelectionBtn = this.$el.find('.js-reset-selection'); 
        this.$roomSlotInputs = null;
        this.selectedSlotInputs = [];
        this.maxSlots = 6;
        this.$maxTime = this.$el.find('.js-max-time');
        this.slotMinutes = 30;
        this.locale = "en-US";
        this.timeZone = {timeZone: "America/Los_Angeles"};
        this.lid        = 4816;
        this.openTime = null;
        this.closingTime = null;

        this.init();

    };

    RoomResForm.prototype.init = function(){

        this.setLoading();

        this.updateScheduleData();

        this.setMaxTimeText();

        this.initDateEvents();
        
        this.initFormEvents();
    };

    RoomResForm.prototype.getSpaceAvailability = function(Ymd){

		var data = {
			action: 'get_room_info',
			ccl_nonce: CCL.nonce,
			availability: Ymd || '', // e.g. '2017-10-19'. empty string will get availability for current day
			room: this.roomId // room_id (space)
        };

        return $.post({
			url: CCL.ajax_url,
			data: data
		});

    };

    RoomResForm.prototype.getSpaceBookings = function(Ymd){
        
        var data = {
            action: 'get_bookings',
            ccl_nonce: CCL.nonce,
            date: Ymd || '', // e.g. '2017-10-19'. empty string will get bookings for current day
            room: this.roomId,
            limit: 50
        };

        return $.post({
            url: CCL.ajax_url,
            data: data
        });

    };
    
    RoomResForm.prototype.getMainLibraryHours = function(){
        //get the hours for the main library via AJAX
        var data = {
            action: 'get_main_library_hours',
            ccl_nonce: CCL.nonce           
        };
        
        return $.post({
            url: CCL.ajax_url,
            data: data
        });        
    };

    RoomResForm.prototype.updateScheduleData = function() {
        
        var getSpacejqXHR = this.getSpaceAvailability(this.dateYmd);
        var getBookingsjqXHR = this.getSpaceBookings(this.dateYmd);
        var getMainHoursjqXHR = this.getMainLibraryHours();
        var that = this;
        
        $.when(getSpacejqXHR, getBookingsjqXHR, getMainHoursjqXHR)
            .done(function(getSpace,getBookings, getMainHours){
                
                var spaceData = getSpace[0],
                    bookingsData = getBookings[0],
                    mainHoursData = getMainHours[0],
                    spacejqXHR = getSpace[2],
                    bookingsjqXHR = getBookings[2],
                    timeSlotsArray;

                // parse data to JSON if it's a string
                spaceData = ( typeof spaceData === 'string' ) ? JSON.parse( spaceData )[0] : spaceData[0];
                bookingsData = ( typeof bookingsData === 'string' ) ? JSON.parse( bookingsData ) : bookingsData;
                mainHoursData = ( typeof mainHoursData === 'string' ) ? JSON.parse( mainHoursData ) : mainHoursData;
                
                //get the open hours of the library and return these times as variables
                that.getOpenHours( mainHoursData );   
                
                if( !that.openTime && !that.closingTime ){
                    //if the library is closed, then the openTime and closingTime will still be null
                    //then we exit out of the function
                    that.$roomSchedule.html( 'No reservations are available' );
                    that.unsetLoading();
                    that.$currentDurationText.text('Library Closed');
                    that.$resetSelectionBtn.hide();                    
                    return;
                }
                

                // merge bookings with availability
                if ( bookingsData.length ){

                    bookingsData.forEach(function(booking,i){

                        // calculate number of slots based on booking duration
                        var fromTime = new Date(booking.fromDate).getTime(),
                            toTime = new Date(booking.toDate).getTime(),
                            durationMinutes = (toTime - fromTime) / 1000 / 60,
                            slotCount = durationMinutes / that.slotMinutes;

                        spaceData.availability.push({
                            "from": booking.fromDate,
                            "to": booking.toDate,
                            "slotCount": slotCount,
                            "isBooked": true
                        });
                        
                    });
                    
                    // sort time slot objects by the "from" key
                    _sortByKey( spaceData.availability, 'from' );

                }
                


                // parse time slots and return an appropriate subset (only open to close hours)
                timeSlotsArray = that.parseSchedule(spaceData.availability);
                
                // build schedule HTML
                that.buildSchedule(timeSlotsArray);

                // Error handlers
                spacejqXHR.fail(function(err){
                    console.log(err);
                });
                bookingsjqXHR.fail(function(err){
                    console.log(err);
                });

            })
            .always(function(){
                that.unsetLoading();
                that.$resetSelectionBtn.hide();
            });

    };

    RoomResForm.prototype.buildSchedule = function(timeSlotsArray){

        var that = this,
            html = [];
            
        // construct HTML for each time slot
        timeSlotsArray.forEach(function(item, i){

            var from = new Date( item.from ),
                timeString,
                itemClass = '';

            if ( from.getMinutes() !== 0 ) {
                timeString = that.readableTime( from, 'h:m' );
            } else {
                timeString = that.readableTime( from, 'ha' );
            }

            if ( item.isBooked && item.hasOwnProperty('slotCount') ) {
                itemClass = 'ccl-is-occupied ccl-duration-' + item.slotCount;
            }
            
            // build selectable time slots
            html.push( that.buildTimeSlot({
                id: 'slot-' + that.roomId + '-' + i,
                from: item.from,
                to: item.to,
                timeString: timeString,
                class: itemClass
            }) );
        
        });

        this.selectedSlotInputs = [];

        this.$roomSchedule.html( html.join('') );

        this.$roomSlotInputs = this.$el.find('.ccl-c-room__slot [type="checkbox"]');

        this.setCurrentDurationText();

        this.initSlotEvents();

    };

    RoomResForm.prototype.buildTimeSlot = function(vars){
        
        if ( ! vars || typeof vars !== 'object' ) {
            return '';
        }

        var defaults = {
            class: '',
            id: '',
            disabled: '',
            from: '',
            to: '',
            timeString: ''
        };
        vars = $.extend(defaults, vars);

        var template = '' +
            '<div class="ccl-c-room__slot ' + vars.class + '">' +
                '<input type="checkbox" id="' + vars.id + '" name="' + vars.id + '" value="' + vars.from + '" data-to="' + vars.to + '" ' + vars.disabled + '/>' +
                '<label class="ccl-c-room__slot-label" for="' + vars.id + '">' +
                    vars.timeString +
                '</label>' +
            '</div>';

        return template;
    };

    RoomResForm.prototype.parseSchedule = function(scheduleArray){
        // returns the appropriate schedule for a given array of time slots
        
        var to = null,
            that = this,
            startEndIndexes = [], 
            start, end;
            
            console.log( scheduleArray );

        $.each( scheduleArray, function( i, item ){
            start = new Date( item.from ).getTime();
            end = new Date( item.to ).getTime();
            
            if( that.openTime <= start && that.closingTime >= end){

                startEndIndexes.push( item );              
            }else{
                console.log( 'this didn\'t match' );
            }

        } );
        
        console.log( startEndIndexes );

        //reset this variable incase we use this script for other days
        that.openTime = null;
        that.closingTime = null;
        
        return startEndIndexes;

        // loop through array and pick out time gaps
        // scheduleArray.forEach(function(item,i){
        //     if ( to && to !== item.from ) {
        //         startEndIndexes.push(i);
        //     }
        //     to = item.to;
        // });

        // // depending on number of gaps found, determine start and end indexes
        // if ( startEndIndexes.length >= 2 ) {
        //     start = startEndIndexes[0];
        //     end = startEndIndexes[1];
        // } else {
        //     start = 0;
        //     if ( startEndIndexes.length === 1 ) {
        //         end = startEndIndexes[0];
        //     } else {
        //         end = scheduleArray.length;
        //     }
        // }
        
        // returned sliced portion of original schedule
        //return scheduleArray.slice(start,end);
    };
    
    RoomResForm.prototype.getOpenHours = function(hoursData){
        //returns the opening and closing hours for the main library
        var hoursObj,
            that = this;
        
        console.log( hoursData );
        
        //filter object for the main library and the current date passed in
        //@todo turn the lid into a global variable
        hoursObj = $.grep( hoursData.locations, function(library){
            return library.lid == that.lid ;
        } );
        //use this recirsive function to locate the day's hours for the date passed
        hoursObj = _findObjectByKeyVal( hoursObj[0].weeks, 'date', that.dateYmd );
        
        //identify the date situation and create global variables
        if( 'hours' in hoursObj.times ){
            //use the function to convert a series of strings into an actual Date Object
            that.openTime    = _convertToDateObj( hoursObj, 'from' );
            that.closingTime = _convertToDateObj( hoursObj, 'to');
            
            //if this day closes at 1am, then we need to kick the closing time to the next day
            if( (hoursObj.times.hours[0].to).indexOf( 'am' ) != -1 ){
                that.closingTime.setDate(that.closingTime.getDate() + 1 );
            }
            
            that.openTime   = that.openTime.getTime();
            that.closingTime = that.closingTime.getTime();
            
            console.log( 'custom hours', that.openTime, that.closingTime );
    
        }else if( hoursObj.times.status == '24hours' ){
            //if the status is 24 hours, we need to set the beginning end of this day
            var date = new Date( hoursObj.date );

            that.openTime    = date.getTime();            

            //could be end.setHours(23,59,59,999);
            //that.closingTime = that.openTime.setDate(that.openTime.getDate() + 1 );
            that.closingTime =   new Date( that.openTime + ( 1*24*60*60*1000 ) ).getTime();
            
            //console.log( '24 hour closing time',  new Date (that.openTime).toString() , new Date (that.closingTime ).toString() );
            
            //console.log( '24 hour closing time', that.openTime, that.closingTime  );
        }
        

    };

    RoomResForm.prototype.initFormEvents = function(){

        var that = this;

        this.$resetSelectionBtn.click(function(event){
            event.preventDefault();
            $(that.selectedSlotInputs).each(function(i,input){
                $(input)
                    .prop('checked',false)
                    .change();
            });
            $('.ccl-c-room__slot').removeClass('ccl-is-disabled');
        });

        this.$el.submit(function(event){
            event.preventDefault();
            that.onSubmit();
        });

        this.$formReload.click(function(event){
            event.preventDefault();
            that.reloadForm();
        });

    };

    RoomResForm.prototype.initDateEvents = function(){

        var that = this;
        
        this.$dateSelect.change(function(){
            that.onDateChange();
        });

    };

    RoomResForm.prototype.onDateChange = function() {
        
        this.dateYmd = this.$dateSelect.val();
        
        this.setLoading();

        this.updateScheduleData();
        
    };
        
    RoomResForm.prototype.initSlotEvents = function(){
        var that = this;
        
        if ( this.$roomSlotInputs && this.$roomSlotInputs.length ){
            
            // input change event handler
            this.$roomSlotInputs.change(function(){
                var input = this;
                that.onSlotChange(input);
            });
            
        }
    };
    
    RoomResForm.prototype.onSlotChange = function(changedInput){
        
        // if input checked, add it to selected set
        if ( $(changedInput).prop('checked') ) {

            this.selectedSlotInputs.push(changedInput);
            $(changedInput).parent('.ccl-c-room__slot').addClass('ccl-is-checked');
   
        } 
        
        // if input unchecked, remove it from the selected set
        else { 

            var changedInputIndex = this.selectedSlotInputs.indexOf(changedInput);

            if ( changedInputIndex > -1 ) {
                this.selectedSlotInputs.splice( changedInputIndex, 1 );
            }
            $(changedInput).parent('.ccl-c-room__slot').removeClass('ccl-is-checked');

        }
        
        // update the slots which can now be clickable
        this.updateSelectableSlots();
        
        // update button states
        if ( this.selectedSlotInputs.length > 0 ) {
            this.$resetSelectionBtn.show();
            this.$formSubmit.attr('disabled',false);
        }
        else {
            this.$formSubmit.attr('disabled',true);
            this.$resetSelectionBtn.hide(); 
        }

        // update text
        this.setCurrentDurationText();

    };

    RoomResForm.prototype.updateSelectableSlots = function() {

        var that = this;

        // IF there are selected slots
        if ( that.selectedSlotInputs.length ){
        
            // first, sort the selected slots
            that.selectedSlotInputs.sort(function(a,b){
                return a.getAttribute('value') > b.getAttribute('value');
            });

            // grab the first and last selected slots
            var minInput = that.selectedSlotInputs[0],
                maxInput = that.selectedSlotInputs[that.selectedSlotInputs.length - 1];
            
            // get the indexes of the first and last slots from the $roomSlotInputs jQuery object
            var minIndex = that.$roomSlotInputs.index(minInput),
                maxIndex = that.$roomSlotInputs.index(maxInput);
            
            // calculate the min and max slot indexes which are selectable
            var minAllowable = maxIndex - that.maxSlots,
                maxAllowable = minIndex + that.maxSlots;
    
            // loop through room slots and update them accordingly
            that.$roomSlotInputs.each(function(i, input){
                
                // enables or disables depending on whether slot falls within range
                if ( minAllowable < i && i < maxAllowable ) {
                    that.enableSlot(input);
                } else {
                    that.disableSlot(input);
                }
                
                // add a class to the slots that fall between the min and max selected slots
                if ( minIndex < i && i < maxIndex ) {
                    $(input).parent().addClass('ccl-is-between');
                } else {
                    $(input).parent().removeClass('ccl-is-between');
                }
            });
        
        } 
        // ELSE no selected slots
        else {

            // enable all slots
            that.$roomSlotInputs.each(function(i, input){
                that.enableSlot(input);
            });

        }
        
    };

    RoomResForm.prototype.clearSlot = function(slot) {
        // slot can be either the checkbox input -OR- the checkbox's container

        var inputIndex;

        // if it's the checkbox.
        if ( $(slot).is('[type="checkbox"]') ) {
         
            this.enableSlot(slot);

            // get index of the input from selected set
            inputIndex = this.selectedSlotInputs.indexOf(slot);
            
        // if it's the container
        } else {

            var $input = $(slot).find('[type="checkbox"]');

            this.enableSlot($input[0]);

            // get index of the input from selected set
            inputIndex = this.selectedSlotInputs.indexOf( $input[0] );

        }

        // remove input from selected set
        this.selectedSlotInputs.splice( inputIndex, 1 );

    };

    RoomResForm.prototype.clearAllSlots = function() {

        var that = this;

        this.$resetSelectionBtn.hide();
        
        // Extend the selected inputs array to a new variable.
        // The selected inputs array changes with every clearSlot() call
        // so, best to loop through an unchanging array.
        var selectedInputs = $.extend( [], that.selectedSlotInputs );

        $(selectedInputs).each(function(i,input){
            that.clearSlot(input);
        });

    };

    RoomResForm.prototype.activateSlot = function(slot) {
        // slot can be either the checkbox -OR- the checkbox's container

        var slotIsCheckbox = $(slot).is('[type="checkbox"]'),
            $container = slotIsCheckbox ? $(slot).parent('.ccl-c-room__slot') : $(slot);

        // never set an occupied slot as active
        if ( $container.hasClass('ccl-is-occupied') ) {
            return;
        }

        if ( $(slot).is('[type="checkbox"]') ) {

            // if it's the checkbox.
         
            $(slot).prop('checked',true);
            $container.addClass('ccl-is-checked');
            
        } else {

            // if it's the container

            $container
                .addClass('ccl-is-checked')
                .find('[type="checkbox"]')
                    .prop('checked',true);

        }
    };

    RoomResForm.prototype.enableSlot = function(slot) {
        $(slot)
            .prop('disabled', false)
            .parent('.ccl-c-room__slot')
                .removeClass('ccl-is-disabled');
    };

    RoomResForm.prototype.disableSlot = function(slot) {
        $(slot)
            .prop('disabled', true)
            .parent('.ccl-c-room__slot')
                .addClass('ccl-is-disabled');
    };

    RoomResForm.prototype.setLoading = function(){
        this.$currentDurationText.text('Loading schedule...');
        this.$el.addClass('ccl-is-loading');
    };

    RoomResForm.prototype.unsetLoading = function(){
        this.$el.removeClass('ccl-is-loading');
    };

    RoomResForm.prototype.setCurrentDurationText = function() {

        var selection = $.extend([],this.selectedSlotInputs),
            sortedSelection = selection.sort(function(a,b){ 
                return a.value > b.value; 
            }),
            selectionLength = sortedSelection.length;
        
        if ( selectionLength > 0 ) {

            var time1Val = sortedSelection[0].value,
                readableTime1 = this.readableTime( new Date(time1Val) );

            var time2Val = ( selectionLength >= 2 ) ? sortedSelection[sortedSelection.length - 1].value : time1Val,
                time2T = new Date(time2Val).getTime() + ( this.slotMinutes * 60 * 1000 ),
                readableTime2 = this.readableTime( new Date(time2T) );

            this.$currentDurationText.text( 'From ' + readableTime1 + ' to ' + readableTime2 );

        }
        
        else {

            this.$currentDurationText.text('Please select available time slots');

        }

    };

    RoomResForm.prototype.setMaxTimeText = function(){
        var maxMinutes = this.maxSlots * this.slotMinutes,
            maxText;

        if ( maxMinutes > 60 ) {
            maxText = maxMinutes / 60 + ' hours';    
        } 
        else {
            maxText = maxMinutes + ' minutes';
        }

        this.$maxTime.text( maxText );
    };

    RoomResForm.prototype.readableTime = function( dateObj, format ) {
        
        var localeString = dateObj.toLocaleString( this.locale, this.timeZone ), // e.g. --> "11/7/2017, 4:38:33 AM"
            localeTime = localeString.split(", ")[1]; // "4:38:33 AM"

        var time = localeTime.split(' ')[0], // "4:38:33",
            timeObj = {
                a: localeTime.split(' ')[1].toLowerCase(), // (am or pm) --> "a"
                h: time.split(':')[0], // "4"
                m: time.split(':')[1], // "38"
            };

        if ( format && typeof format === 'string' ) {
            
            var formatArr = format.split(''),
                readableArr = [];
            
            for ( var i = 0; i < formatArr.length; i++ ) {
                if ( timeObj[formatArr[i]] ) {
                    readableArr.push(timeObj[formatArr[i]]);
                } else {
                    readableArr.push(formatArr[i]);
                }
            }

            return readableArr.join('');
            
        }

        return timeObj.h + ':' + timeObj.m + timeObj.a;
        
    };

    RoomResForm.prototype.onSubmit = function(event){

        if ( ! this.selectedSlotInputs.length ) {
            
            this.$formNotification
                .css('display','none')
                .addClass('ccl-is-error')
                .text('Please select a time for your reservation')
                .appendTo(this.$formContent)
                .slideDown(CCL.DURATION);            

            return;
        } 
        else {
            this.$formNotification.remove();
        }

        var that = this,
            sortedSelection = $.extend([], this.selectedSlotInputs).sort(function(a,b){
                return a.value > b.value;
            }),
            start = sortedSelection[0].value,
            end = ( sortedSelection.length > 1 ) ? $( sortedSelection[ sortedSelection.length - 1 ] ).data('to') : $( sortedSelection[0] ).data('to'),
            payload = {
                "iid":333,
                "start": start,
                "fname": this.$el[0].fname.value,
                "lname": this.$el[0].lname.value,
                "email": this.$el[0].email.value,
                "nickname": this.$el[0].nickname.value,
                "bookings":[
                    { 
                        "id": this.roomId,
                        "to": end
                    }
                ]
            };

        this.$el.addClass('ccl-is-submitting');
        this.$formCancel.prop('disabled',true);
        this.$formSubmit.text('Sending...').prop('disabled',true);

        var data = {
            action: 'request_booking',
            ccl_nonce: CCL.nonce,
            payload: payload
        };

        /* ------------------------------------
         * Make a request here to reserve space
         * ------------------------------------ */
        $.post({
                url: CCL.ajax_url,
                data: data
            })
            .done(function(response){
                _handleSubmitResponse(response);
            })
            .fail(function(error){
                console.log(error);
            })
            .always(function(){
                that.$el.removeClass('ccl-is-submitting');
            });

        function _handleSubmitResponse(response) {

            var responseHTML,
                responseObject = JSON.parse(response);

            if ( responseObject.booking_id ) {
                responseHTML =  ['<p class="ccl-h2 ccl-u-mt-0">Success!</p>',
                                '<p class="ccl-h4">Your booking ID is <span class="ccl-u-color-school">' + responseObject.booking_id + '</span></p>',
                                '<p class="ccl-h4">Please check your email to confirm your booking.</p>'];
            } else {
                responseHTML =  ['<p class="ccl-h3 ccl-u-mt-0">Sorry, but we couldn\'t process your reservation.</p>','<p class="ccl-h4">Errors:</p>'];
                $(responseObject.errors).each(function(i, error){
                    responseHTML.push('<p class="ccl-c-alert ccl-is-error">' + error + '</p>');
                });
                responseHTML.push('<p class="ccl-h4">Please talk to your nearest librarian for help.</p>');
            }

            that.$formCancel.prop('disabled',false).text('Close');
            that.$formSubmit.hide();
            that.$formReload.show();

            that.$formContent.animate({opacity: 0}, CCL.DURATION);
            that.$formResponse
                .delay(CCL.DURATION)
                .animate({opacity: 1}, CCL.DURATION)
                .html(responseHTML);
            that.$formContent
                .delay(CCL.DURATION)
                .animate({height: that.$formResponse.height() + 'px' }, CCL.DURATION)
                .css({zIndex: '-1'});

            that.$el.removeClass('ccl-is-submitting');

        }

    };

    RoomResForm.prototype.reloadForm = function(){
        
        this.$formCancel.text('Cancel');
        this.$formSubmit.text('Submit').prop('disabled',false).show();
        this.$formReload.hide();
        
        this.clearAllSlots();

        this.$formResponse
            .animate({opacity: 0}, CCL.DURATION)
            .delay(CCL.DURATION)
            .html('');
        this.$formContent
            .delay(CCL.DURATION)
            .css({ height: '', zIndex: '' })
            .animate({opacity: 1}, CCL.DURATION);

        this.setLoading();
        
        this.updateScheduleData();
    };

    // ------------------------------------------------------- //
    // Helpers

    function _sortByKey( arr, key, order ) {
        function sortASC(a,b) {
            if (a[key] < b[key]){
                return -1;
            }
            if (a[key] > b[key]){
                return 1;
            }
            return 0;
        }
        function sortDESC(a,b) {
            if (a[key] > b[key]){
                return -1;
            }
            if (a[key] < b[key]){
                return 1;
            }
            return 0;
        }
        if ( 'DESC' === order ) {
            arr.sort(sortDESC);
        } else {
            arr.sort(sortASC);
        }
    }

function _findObjectByKeyVal (obj, key, val) {
    if (!obj || (typeof obj === 'string')) {
        return null;
    }
    if (obj[key] === val) {
        return obj;
    }
    
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
          var found = _findObjectByKeyVal(obj[i], key, val);
          if (found) {
            return found;
          }
        }
    }
    return null;
}

function _convertToDateObj( hoursObj, startEnd ){
    //need to create a date object in Javascript, but the date formats from LibCal are gross
    //gets the hours and minutes and splits into array
    var hoursMinutes = $.map(hoursObj.times.hours[0][startEnd].split(':'), function( val, i ){
        return parseInt(val);
    });
    //checks whether it is Am or Pm
    if( hoursObj.times.hours[0][startEnd].indexOf( 'pm' ) != -1 ){
        hoursMinutes[0] += 12;
    }
    //get the day objects and splits into  array
    var caldate = $.map( hoursObj.date.split("-"), function( val, i ){
        return val - (i === 1);
    }  );
    
    //ideally we could use apply - but it's throwing some error 
    //var date = new ( Function.prototype.bind.apply( Date , [null].concat( caldate ) ) );
    return new Date(  caldate[0], caldate[1], caldate[2], hoursMinutes[0], hoursMinutes[1] ); 
}
        

    // ------------------------------------------------------- //

    $(document).ready(function(){
        $('.js-room-res-form').each(function(){
            new RoomResForm(this);
        });
    });

} )( this, jQuery );
