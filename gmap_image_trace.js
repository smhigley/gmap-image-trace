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
          imageLat: null,
          imageLong: null
        };

    // The actual plugin constructor
    function GmapImageTrace( element, options ) {
        this.$el = $(element);

        this.options = $.extend( {}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    GmapImageTrace.prototype = {

        init: function() {
          var latlng = new google.maps.LatLng(48.6, -19.8),
              self = this;

          // set some vars we'll need to access later
          this._polygon = null;
          this._plotActive = false;

          // add necessary elements
          this.createControls();

          var myOptions = {
            zoom: 3,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          var map = new google.maps.Map(self.$map_canvas[0], myOptions);

          this._polygon = new google.maps.Polyline({
              strokeColor: '#ff0000',
              strokeOpacity: 1.0,
              strokeWeight: 2
            });

          this._polygon.setMap(map);

          // add click event to map
          google.maps.event.addListener(map, 'click', self.addNewPoint.bind(self));

          // add click event to controls
          this.$start_button.on('click', self.startPlot.bind(self));
          this.$remove_button.on('click', self.removeLastPoint.bind(self));
        },

        createControls: function() {
          this.$map_canvas = $('<div class="map-canvas" />');
          this.$start_button = $('<a href="#" class="start-btn">Start Plot</a>');
          this.$remove_button = $('<a href="#" class="remove-btn">Remove Last</a>');
          this.$output_button = $('<a href="#" class="output-btn">Show Output</a>');
          this.$output = $('<div class="output" />');

          var $controls = $('<div class="controls" />');
          $controls.append(self.$start_button, self.$remove_button, self.$output_button);
          this.$el.append(self.$map_canvas, $controls, self.$output);
        }

        addNewPoint: function(e) {
          // only add points if the plot is active
          if (this._plotActive == true) {
            // add lat/long to polygon path
            var path = this._polygon.getPath();
            path.push(e.latLng);

            // add lat/long to output
            this.$output.append('<span>'+point+'</span>');
          }
        },

        removeLastPoint: function() {
          // remove last point from polygon path
          var path = this._polygon.getPath();
            path.pop();

          // remove last span from output
          this.$output.chilren('span').last().remove();
        },

        startPlot: function() {
          if (this._plotActive == false) {
            this._plotActive = true;
            this.$start_button.html('Stop Plot');
          } else {
            this.$start_button.html('Start Plot');
            this._plotActive = false;
          }
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
