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
    ghostFeed: function () {
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
    },

    //Grabbing Flickr Pics
    flickrFeed: function(targetEl) {
      "use strict";

      //-- Flickr url/REST locations
      var FLICKR = {
          REST_URL: '//www.flickr.com/services/rest/',
          SEARCH: 'flickr.photos.search',
          GETINFO: 'flickr.photos.getInfo',
          PLACEINFO: 'flickr.places.getInfo'
      };
      //-- Flickr parameters
      var flickr = {
            'api_key': 'ce2cebcf703d8ab2bdbd5342f16ebcaa',
            'method': FLICKR.SEARCH, 'format': 'json', 'tags': 'movember', 'safe_search': '1',
            'per_page': '5', 'jsoncallback': '?', 'sort': 'interestingness-desc', 'extras': 'url_z,geo', 'has_geo': '1'
          };

      //-- Default settings
      var photos = [],
          $targetDOM = $(targetEl),
          settings = {
              mock: false,
              random: Math.floor(Math.random() * flickr.per_page)
          };

      //-- Flickr request URL
      var flickrSearchUrl = FLICKR.REST_URL +
              '?method=' + flickr.method + '&api_key='+ flickr.api_key + '&tags=' + flickr.tags +
              '&format=' + flickr.format + '&per_page=' + flickr.per_page + '&safe_search=' + flickr.safe_search + '&nojsoncallback=' + '1' +
              '&sort=' + flickr.sort + '&has_geo=' + flickr.has_geo + '&extras=' + flickr.extras,
          flickrSearchData;

      if(settings.mock === true) flickrSearchUrl = '/assets/js/flickr.photos.search.js';

      var fetchFlickrPic = function() {
        $.ajax({
          url: flickrSearchUrl,
          dataType: 'json',
          data: JSON,
          error: function(data) {
            console.info(data.statusText);
          },
          success: function(data) {
            console.info(data.stat);
            $.each(data.photos.photo, function(i, item){
              photos.push({
                'id' : item.id,
                'details' : {
                  'src': item.url_z,
                  'title': item.title,
                  'place_id': item.place_id,
                  'geo': { 'city': '', 'country': '' }
                }
              });
            });
          },
          complete: function(data) {
            console.info(data.statusText);
            $targetDOM.addClass('cover-loading').html('<div class="cover-image" style="background-image: url('+photos[settings.random].details.src+')">' +
              '<div class="cover-details clearfix"><p>'+ photos[settings.random].details.title +'</p></div></div>');
            fetchFlickrGeo(photos[settings.random].id, photos[settings.random].details.place_id);
          }
        });
      }

      var fetchFlickrGeo = function(photo_id, place_id) {
        var flickrGetinfoUrl = FLICKR.REST_URL +
            '?method=' + FLICKR.PLACEINFO +
            '&api_key=' + flickr.api_key +
            '&place_id=' + place_id +
            '&format=' + flickr.format +
            '&nojsoncallback=' + '1';
        if(settings.mock === true) flickrGetinfoUrl = '/assets/js/flickr.place.getinfo.js';

        $.ajax({
          url: flickrGetinfoUrl,
          dataType: 'json',
          data: JSON,
          error: function(data) {
            console.info('Place: fail!');
            console.info(data);
          },
          success: function(data) {
            var city = data.place.woe_name,
                country = data.place.country._content;

            $.each(photos, function(i, object) {
              if(object.id === photo_id) {
                photos[i].details.geo = {
                  'city': city, 'country': country
                };
                $('.cover-details p', $targetDOM).append('<br/><i class="fi-marker"></i>' +
                  photos[i].details.geo.city+', '+photos[i].details.geo.country);
              }
            });
          },
          complete: function(data){
            // 'place: complete'
            $targetDOM.removeClass('cover-loading');
          }
        });
      }

      return fetchFlickrPic();
    }

}
$(document).ready(function() {

    ghost.themes.zeitgeist.flickrFeed('#cover-image');

});