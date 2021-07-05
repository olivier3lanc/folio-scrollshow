(function(jQuery){
    jQuery.fn.scrollshow = function(options) {
        //jQuery objects
        var jQ_body = jQuery('body');
        var jQ_windowHeight = jQuery(window).height();
        var jQ_scrollToDepth = jQuery('#scrollshow');
        //Current item index
        var std_index = 0;
        //Amount of scroll
        var std_scrollTopRaw = 0;
        //Amount of items
        var std_amountOfItems = jQ_scrollToDepth.children('.item').length;
        //Scroll amount for an item
        var std_unitRange = 2000;
        //Apply body height
        jQ_body.height(std_amountOfItems * std_unitRange + jQ_windowHeight);

        //Navigation and progress
        //Include navigation
        jQ_scrollToDepth.append('<nav class="navigation"></nav>');
        //jQuery object of the navigation
        var jQ_stdNavigation = jQ_scrollToDepth.children('.navigation');
        //Include a bullet link for each item
        for (var i = 0; i < std_amountOfItems; i++) {
            jQ_stdNavigation.append('<a href="#'+i.toString()+'"></a>');
            //Include progress bar on the first item
            if(i == 0){
                jQ_stdNavigation.children('a:first-child').append('<span class="progress"></span>');
            }
        }
        //First bullet link jQuery object
        var jQ_stdNavigationFirstChild = jQ_stdNavigation.children('a:first-child');
        //Link bullet width
        var std_navigationBulletWidth = jQ_stdNavigationFirstChild.outerWidth();
        //Link bullet height
        var std_navigationBulletHeight = jQ_stdNavigationFirstChild.outerHeight();
        //Link bullet margin
        var std_navigationBulletMargin = parseFloat(jQ_stdNavigationFirstChild.css('margin-bottom'));
        //Computed 100% progress height
        var std_progressHeight = std_amountOfItems * (std_navigationBulletHeight + std_navigationBulletMargin);


        //Manage click on bullet link: Go to the target item
        jQ_stdNavigation.find('a').on('click',function(e){
            e.preventDefault();
            var currentHash = jQuery(this).attr('href');
            var currentIndex = currentHash.replace('#','');
            currentIndex = parseInt(currentIndex);
            var scrollAmount = currentIndex * std_unitRange;
            jQuery(document).scrollTop(scrollAmount);
        });

        //Wrap every letter of each item title
        jQ_scrollToDepth.children('.item').each(function(){
            //If not the last
            // if(jQuery(this).index()+1 != jQ_scrollToDepth.children('.item').length){
            //
            // };
            //jQuery object to contain the wrapped letters
            var jQ_text;
            //Check the existence of an custom element to scroll
            var jQ_textToScroll = jQuery(this).find('.scroll');
            //If there is an element with .scroll class, use is as text to scroll
            if(jQ_textToScroll.length > 0){
                jQ_text = jQ_textToScroll.eq(0);
            //Otherwise use the very first element into the item
            }else{
                jQ_text = jQuery(this).children().eq(0);
            }
            //Text content of the element to scroll
            var text = jQ_text.text()+' ...';
            var result = '';
            var zIndex = 1000;
            for(var i = 0; i < text.length; i++){
                if(text[i] == ' '){
                   result += '<span class="separator">'+text[i]+'</span>';
                }else{
                   result += '<span class="letter" style="z-index:'+zIndex+';">'+text[i]+'</span>';
                }
                zIndex--;
            }
            jQ_text.html(result);
        });

        //Update management
        var update = function(){
            //Update value of the scroll top amount
            std_scrollTopRaw = jQuery(document).scrollTop();
            //If end of scroll, decrease std_scrollTopRaw to avoid jump
            if(std_scrollTopRaw >= (std_amountOfItems * std_unitRange)){
                std_scrollTopRaw = std_amountOfItems * std_unitRange - 1;
            }
            //Calculates the displayed item in relation with scroll amount
            std_index = parseInt(std_scrollTopRaw / std_unitRange);
            //Amount of scroll for the current item
            var std_relativeScroll = std_scrollTopRaw - std_unitRange * std_index;
            //CSS transform property
            // var std_transform = 'translateY(calc(-50% - '+std_relativeScroll / 100+'px))';
            //CSS text shadow property
            // var std_textShadow = '0px '+std_relativeScroll/50+'px 30px rgba(0,0,0,'+std_relativeScroll/1900+')';
            //jQuery object of the active item
            var jQ_activeItem = jQ_scrollToDepth.children('.item:eq('+std_index+')');
            //jQuery object of the inactive items
            var jQ_inactiveItems = jQ_scrollToDepth.children('.item:not(:eq('+std_index+'))');

            //LETTERS
            //How many letters into this item title
            var std_amountOfLetters = jQ_scrollToDepth.find('.item:eq('+std_index+') .letter').length;
            //Amount of scroll per step
            var std_scrollSteps = parseInt(std_unitRange / std_amountOfLetters);
            //Index of the letter
            var std_letterIndex = parseInt(std_relativeScroll / std_scrollSteps);

            //Create event active item changed
            if(!jQ_activeItem.hasClass('active')){
                jQ_scrollToDepth.trigger('itemChange');
            }

            //Transformations on the active item
            jQ_activeItem.addClass('active');

            //Letters management of the active item
            //Make only the current letter index as active
            // jQ_activeItem
            //     .find('.letter:eq('+std_letterIndex+')')
            //     .addClass('active');
            // jQ_activeItem
            //     .find('.letter:not(:eq('+std_letterIndex+'))')
            //     .removeClass('active');

            //Make all the previous letters indexes active
            for (var z = 0; z < std_amountOfLetters; z++) {
                if(z <= std_letterIndex){
                    jQ_activeItem
                        .find('.letter:eq('+z.toString()+')')
                        .addClass('active');
                    std_temp_letterIndex = z;
                }else{
                    jQ_activeItem
                        .find('.letter:eq('+z.toString()+')')
                        .removeClass('active');
                }
            }


            //Transformations on non current item
            jQ_inactiveItems.removeClass('active');

            //Navigation and progress
            for (var i = 0; i < std_amountOfItems; i++) {
                if(i <= std_index){
                    //Add class active to all read items
                    jQ_stdNavigation.find('a[href="#'+i.toString()+'"]').addClass('active');
                }else{
                    //Remove class active for all unread items
                    jQ_stdNavigation.find('a[href="#'+i.toString()+'"]').removeClass('active');
                }
            }
            //Calculates progress ratio between 0 and 1
            var std_progressCoef = std_scrollTopRaw / (std_amountOfItems * std_unitRange);
            var std_currentProgressHeight = std_progressCoef * std_progressHeight;
            if(std_index + 1 == std_amountOfItems){
                std_currentProgressHeight = std_progressHeight - std_navigationBulletMargin - std_navigationBulletHeight;
            }
            //Assign ratio width to the progress bar
            jQ_stdNavigationFirstChild.children('.progress').height(std_currentProgressHeight);
        }
        //Apply routines on page start
        update();
        var oldscroll;
        //On page scroll
        jQuery(document).on('scroll',function(e){
            update();
            var currentScroll = jQuery(this).scrollTop();
            var movement = 0;
            if(oldscroll > currentScroll){
                movement = 1;
            }else{
                movement = -1;
            }
            oldscroll = currentScroll;
            var currentFov = shortapi.getYaw();
            shortapi.goToView({
                yaw: currentFov + 1 * movement,
                durationMS:0
            });
        });
        //On window change
        jQuery(window).on('resize',function(e){
            jQ_windowHeight = jQuery(window).height();
            //Apply body height
            jQ_body.height(std_amountOfItems * std_unitRange + jQ_windowHeight);
        });
        jQ_scrollToDepth.on('itemChange',function(e){
            var scene = jQuery(this).children('.item:eq('+std_index+')').attr('data-scene');
            if(scene !== undefined){
                // shortapi.goToScene(scene,true);
                if(std_index == 0){
                    shortapi.goToView({fov:110,pitch:0,durationMS:800,easing:'linear'});
                    jQ_scrollToDepth
                        .children('.overlay')
                        .removeClass('color2 color3 color4');
                }
                if(std_index == 1){
                    shortapi.goToView({fov:300,pitch:0,durationMS:800,easing:'linear'});
                    jQ_scrollToDepth
                        .children('.overlay')
                        .removeClass('color2 color3 color4')
                        .addClass('color2');
                }
                if(std_index == 2){
                    shortapi.goToView({fov:270,pitch:90,durationMS:2000});
                    jQ_scrollToDepth
                        .children('.overlay')
                        .removeClass('color2 color3 color4')
                        .addClass('color3');
                }
                if(std_index == 3){
                    shortapi.goToView({fov:200,pitch:-90,durationMS:2000});
                    jQ_scrollToDepth
                        .children('.overlay')
                        .removeClass('color2 color3 color4')
                        .addClass('color4');
                }
            }
        });
    };
}(jQuery));
