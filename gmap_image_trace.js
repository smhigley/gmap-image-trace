/*
*
* Thanks to Martin Ove for the polygon drawing-to-coordinates base code
* (http://martinove.dk/2011/03/17/polylinepolygon-tool-for-google-maps/)
*
* Overlay code modified from https://developers.google.com/maps/documentation/javascript/examples/overlay-simple
*
*/

;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "GmapImageTrace",
        defaults = {
          image: "",
          north: null,
          south: null,
          east: null,
          west: null,
          styles: [{
            stylers: [
              { hue: "#2f563c" },
              { saturation: -50 }
            ]
          }]
        };

    // The actual plugin constructor
    function GmapImageTrace( element, options ) {
        this.$el = $(element);

        this.options = $.extend( {}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        // we'll need this later
        this.map = null;

        this.init();
    }

    GmapImageTrace.prototype = {

        init: function() {
          var self = this;

          // set some vars we'll need to access later
          this._polygon = null;
          this._plotActive = false;

          // add necessary elements
          this.createControls();

          // process the north/south/east/west values
          var centerLat = (this.options.north + this.options.south)/2,
              centerLong = (this.options.east + this.options.west)/2,
              sw = new google.maps.LatLng(this.options.south, this.options.west),
              ne = new google.maps.LatLng(this.options.north, this.options.east);

          this.map = new google.maps.Map(self.$map_canvas[0], {
            zoom: 11,
            center: new google.maps.LatLng(centerLat, centerLong),
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: this.options.styles
          });

          // add image overlay
          this.addImageOverlay(this.options.image, ne, sw);

          this._polygon = new google.maps.Polyline({
              strokeColor: '#FA5C43',
              strokeOpacity: 1.0,
              strokeWeight: 2
            });

          this._polygon.setMap(this.map);

          // add click event to map
          google.maps.event.addListener(this.map, 'click', self.addNewPoint.bind(self));

          // add click event to controls
          this.$start_button.on('click', self.startPlot.bind(self));
          this.$remove_button.on('click', self.removeLastPoint.bind(self));
          this.$output_button.on('click', function(e) {
            e.preventDefault();
            self.$output.toggleClass('open');
          })
        },

        createControls: function() {
          this.$map_canvas = $('<div class="map-canvas" />');
          this.$start_button = $('<a href="#" class="start-btn">Start Plot</a>');
          this.$remove_button = $('<a href="#" class="remove-btn">Remove Last</a>');
          this.$output_button = $('<a href="#" class="output-btn">Show Output</a>');
          this.$output = $('<div class="output" />');

          var $controls = $('<div class="controls" />');
          $controls.append(this.$start_button, this.$remove_button, this.$output_button);
          this.$el.append(this.$map_canvas, $controls, this.$output);
        },

        // plotting fns

        addNewPoint: function(e) {
          // only add points if the plot is active
          if (this._plotActive == true) {
            // add lat/long to polygon path
            var path = this._polygon.getPath();
            path.push(e.latLng);

            // add lat/long to output
            this.$output.append('<span>'+ e.latLng +'</span>');
          }
        },

        removeLastPoint: function() {
          // remove last point from polygon path
          var path = this._polygon.getPath();
            path.pop();

          // remove last span from output
          this.$output.children('span').last().remove();
        },

        startPlot: function() {
          this.$el.toggleClass('active');

          if (this._plotActive == false) {
            this._plotActive = true;
            this.$start_button.html('Stop Plot');
          } else {
            this.$start_button.html('Start Plot');
            this._plotActive = false;
          }
        },

        // function to add image overlay
        addImageOverlay: function(src, ne, sw) {
          var overlay = new google.maps.OverlayView(),
              bounds = new google.maps.LatLngBounds(sw, ne),
              img_container = document.createElement('div'),
              img = document.createElement('img');

          // add overlay fn
          overlay.onAdd = function() {
            var layer = this.getPanes().overlayLayer;

            img_container.className = 'image-overlay';
            img.src = src;

            img_container.appendChild(img);
            layer.appendChild(img_container);
            layer.className = "test-class";

            // draw (every time the map is moved or resized)
            overlay.draw = function() {
              // get pixel values of bounds on map
              var projection = this.getProjection(),
                  swPix = projection.fromLatLngToDivPixel(sw),
                  nePix = projection.fromLatLngToDivPixel(ne);

              // move image div to that location
              $(img_container).css({
                top: nePix.y + 'px',
                left: swPix.x + 'px',
                width: (nePix.x - swPix.x) + 'px',
                height: (swPix.y - nePix.y) + 'px'
              });
            };
          };

          overlay.setMap(this.map);
        }
    };

    $.fn.gmapImageTrace = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new GmapImageTrace( this, options ));
            }
        });
    };

})( jQuery, window, document );
