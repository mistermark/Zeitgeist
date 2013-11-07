/**
 * Zeitgeist main Javascript functions
 */

/*globals jQuery, document */

var ghost = ghost || {};
ghost.themes = ghost.themes || {};
ghost.themes.zeitgeist = ghost.themes.zeitgeist || {

  //Gotta redo this whole thing myself
  //Just wanna grab all the data of a picture and throw it in the air
  //Using AJAX to grab all the data from Instagram for a tag
  //Turn it into a plugin... maybe

    /**
     * Load Instafeed resources
     * http://instafeedjs.com
     **/
    ghostFeed: function ghostFeed() {
        // "use strict";
        var ghostFeed;
        ghostFeed = new Instafeed({
          clientId: 'ea7c3d4e8f804b4d80aadf4d2a8f7375',
          limit: 1,
          template: '<div class="cover-image" style="background-image: url({{image}})"><div class="insta-location"><p><i class="fi-marker"></i>{{location}}</p></div></div>',
          get: 'tagged',
          tagName: 'dappersome', //Replace this value with your own
          target: 'cover-image',
          sortBy: 'random',
          resolution: 'standard_resolution',
          // mock: true,
          custom: {
            images: [],
            currentImage: 0,
            showImage: function() {
              var res, img;
              img = this.options.custom.images[this.options.custom.currentImage];
              res = this._makeTemplate(this.options.template, {
                model: img,
                id: img.id,
                link: img.link,
                image: img.images[this.options.resolution].url,
                caption: this._getObjectProperty(img, 'caption.text'),
                likes: img.likes.count,
                comments: img.comments.count,
                location: this._getObjectProperty(img, 'location.name')
              });
              $('#instafeed-bucket').text('background-image', res);
            }
          },
          succes: function() {
            this.options.custom.images = data.data;
            this.options.custom.showImage.call(this);
            console.info('Yeah, bitch!');
          },
          error: function(){
            $('.cover-image').css({
              'background-image': 'none',
              'background-color': 'transparent'
            });
            console.info('What?!');
          },
          before: function(){
            $('#'+this.options.target).addClass('cover-loading');
            console.info('Initiating...');
            console.info('#'+this.options.target);
          },
          after: function(){
            $('#'+this.options.target).removeClass('cover-loading');
            console.info('Completed.');
          }
        });
        ghostFeed.run();
    }
}
$(document).ready(function() {

    ghost.themes.zeitgeist.ghostFeed();

});