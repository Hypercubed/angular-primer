/*
 * angular-primer 0.0.2
 * (c) 2014 J. Harshbarger
 * This work was supported by a research grant from the Japanese Ministry of Education, Culture, Sports, Science and Technology (MEXT) to the RIKEN Center for Life Science Technologies.
 * Licensed MIT
 */

/*global angular*/
/*global d3 */

(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name angularprimer
     *
     * @description
     * AngularJs module for creating an interactive SVG primer visualization. This library currently depends on [d3](http://d3js.org/) and requires [angularjs 1.3.0-rc](https://angularjs.org/) or higher.
     *
      * @example

        The following example creates a simple genomic feature view using composable angular-primer directives.

        <example module="angularprimer">
          <file name="exampleA.html">
            <svg width="100%" shape-rendering="crispEdges">
              <g primer-track transform="translate(0,30)" sequence-length="1e6">
                <g primer-scale orient="top" />
                <g transform="translate(0,30)">
                  <g primer-label anchor="end"><text text-anchor="start">3'</text></g>
                  <g primer-label anchor="start"><text text-anchor="end">5'</text></g>
                </g>
                <g primer-feature class="marker" transform="translate(0,15)"start="10e4" end="25e4">
                  <g primer-feature-shape />
                </g>
                <g primer-feature class="marker" transform="translate(0,30)" start="20e4" end="55e4">
                  <g primer-feature-shape />
                </g>
                <g primer-feature transform="translate(0,45)" start="50e4" end="95e4" class="marker" >
                  <g primer-feature-shape />
                </g>
              </g>
            </svg>
          </file>
          <file name="example.css">
           svg .domain {
             fill: none;
             stroke: black;
             stroke-width: 2px;
           }

           svg .tick line {
             fill: none;
             stroke: black;
             stroke-width: 1px;
           }

           .marker:hover {
             stroke-width:2px;
           }
          </file>
        </example>

        However, because this is an angular view built using svg elements you have can add any additional svg attributes and angular directives.  This example shows binding to angular data and styling using ng-style directive.

        <example module="angularprimer-example">
          <file name="exampleB.html">
            <div ng-controller="MainController as main">
            <table class="form" style="float: left;">
              <tr>
                <th>Feature</th>
                <th>Strand</th>
                <th>Display</th>
              </tr>
              <tr class="track feature-track" ng-repeat="feature in main.features">
                <td>
                  <label>{{feature.label}}</label>
                </td>
                <td>
                  <input type="number"
                    ng-model="feature.start"
                    min="{{$first ? 0 : main.features[$index-1].end+1}}"
                    max="{{feature.end}}"/>
                  <input type="number"
                    ng-model="feature.end"
                    min="{{feature.start}}"
                    max="{{$last ? main.sequence.length : main.features[$index+1].start-1}}"/>
                  <select ng-model="feature.strand">
                    <option value="+">+</option>
                    <option value="-">-</option>
                  </select>
                </td>
                <td>
                  <select ng-model="feature.direction">
                    <option value="none">none</option>
                    <option value="forward">forward</option>
                    <option value="reverse">reverse</option>
                  </select>
                </td>
              </tr>
            </table>

            <svg width="800" height="200" shape-rendering="crispEdges">
              <g primer-track transform="translate(0,30)" class="track"
                  sequence="{{main.sequence}}" width="500" height="10">
                <g transform="translate(0,0)">
                  <g primer-label anchor="end">
                    <text text-anchor="start" alignment-baseline="middle">3'</text>
                  </g>
                  <g primer-label anchor="start">
                    <text text-anchor="end" alignment-baseline="middle">5'</text>
                  </g>
                  <g primer-scale ticks="0" outer-tick-size="0" />
                  <g primer-feature ng-repeat="feature in main.features | filter : { strand: '+' }"
                      start="feature.start" end="feature.end"
                      ng-style="{fill: feature.color}"
                      class="marker {{feature.label}} {{feature.direction}}" >
                    <path primer-feature-shape="{{main.getShape(feature)}}" />
                    <g primer-label orient="top">
                      <text text-anchor="middle">{{feature.label}}</text>
                    </g>
                  </g>
                </g>
                <g transform="translate(0,20)">
                  <g primer-label anchor="end">
                    <text text-anchor="start" alignment-baseline="middle">5'</text>
                  </g>
                  <g primer-label anchor="start">
                    <text text-anchor="end" alignment-baseline="middle">3'</text>
                  </g>
                  <g primer-scale ticks="0" outer-tick-size="0" />
                  <g primer-feature ng-repeat="feature in main.features | filter : { strand: '-' }"
                      start="feature.start" end="feature.end"
                      ng-style="{fill: feature.color}"
                      class="marker {{feature.label}} {{feature.direction}}" >
                    <path primer-feature-shape="{{main.getShape(feature)}}" />
                    <g primer-label orient="bottom">
                      <text text-anchor="middle" alignment-baseline="middle">{{feature.label}}</text>
                    </g>
                  </g>
                </g>
                <g primer-scale orient="bottom" transform="translate(0,60)"></g>
              </g>
            </svg>
            </div>
          </file>
          <file name=".js">

            angular.module('angularprimer-example',['angularprimer'])

            .controller('MainController', function MainController($scope) {
              var main = this;

              main.sequence = 'CCCTGTGGAGCCACACCCTCACCCT';
              main.sequence = new Array( 10 ).join( this.sequence );

              main.features = [
              { label: 'A', start: 25, end: 50, direction: 'forward', strand: '+', color: 'lightblue' },
              { label: 'B', start: 55, end: 90, direction: 'forward', strand: '+', color: 'green' },
              { label: 'C', start: 95, end: 120, direction: 'none', strand: '+', color: 'yellowgreen' },
              { label: 'D', start: 125, end: 155, direction: 'forward', strand: '-', color: 'grey' },
              { label: 'E', start: 160, end: 175, direction: 'forward', strand: '-', color: 'red' },
              { label: 'F', start: 180, end: 200, direction: 'none', strand: '-', color: '#fc0' }
              ];

              main.getShape = function(feature) {
                if (feature.direction === 'forward') {
                  return (feature.strand === '+') ? 'arrow-right' : 'arrow-left';
                } else if (feature.direction === 'reverse') {
                  return (feature.strand === '-') ? 'arrow-right' : 'arrow-left';
                } else {
                  return 'rect';
                }
              };

            });

          }

          </file>
          <file name="exampleB.css">
            table.form input {
              width: 40px;
            }

            svg .domain {
              fill: none;
              stroke: black;
              stroke-width: 2px;
            }

            svg .tick line {
              fill: none;
              stroke: black;
              stroke-width: 1px;
            }

          </file>
        </example>
      *
      */
    var app = angular.module('angularprimer', [])


    /**
     * @ngdoc directive
     * @name angularprimer.directive:primerTrack
     * @restrict EA
     * @element g
     *
     * @description
     * Creates a container used to group features, scales, and labels.
     *
     * @param {string=} sequence The sequence
     * @param {number|expression=} [sequenceLength=sequence.length || 100] The sequence length used to scale the track
     * @param {number|expression=} [start=1] The sequence starting value (default = 0)
     * @param {number|expression=} [width=500] The track width, in pixels
     * @param {number|expression=} [height=10] The track height, in pixels
     *
     * @example
       <example module="angularprimer">
         <file name="index.html">
          <form>
            sequence-length:
            <input ng-model="length" type="number" ng-init="length = 20" min="1" /><br />
            height:
            <input ng-model="height" type="number" ng-init="height = 10" min="1" /><br />
            width:
            <input ng-model="width" type="number" ng-init="width = 500"  min="1" /><br />
          </form>
          <svg width="100%" shape-rendering="crispEdges">
            <g primer-track transform="translate(0,30)"
              sequence-length="length" height="height" width="width">
              <g primer-scale />
              <g primer-label anchor="end" orient="middle">
                <text text-anchor="start" alignment-baseline="middle">3'</text>
              </g>
              <g primer-label anchor="start" orient="middle">
                <text text-anchor="end" alignment-baseline="middle">5'</text>
              </g>
              <g primer-feature start="3" end="8" class="marker" >
                <primer-feature-shape />
              </g>
              <g primer-feature start="10" end="15" class="marker">
                <primer-feature-shape />
              </g>
              <g primer-feature start="17" end="19" class="marker" >
                <primer-feature-shape />
              </g>
            </g>
          </svg>
         </file>
         <file name=".css">
          svg .domain {
            fill: none;
            stroke: black;
            stroke-width: 2px;
          }

          svg .tick line {
            fill: none;
            stroke: black;
            stroke-width: 1px;
          }

          .marker {
            fill:lightblue;
            stroke:black;
            stroke-width: 1px;
          }

          .marker.none {
            fill:#fff !important;
            stroke-width:1px;
          }

          .marker:hover {
            stroke-width:2px;
          }
         </file>
       </example>
     */
    .directive("primerTrack", function () {
      return {
          restrict: 'EA',
          templateNamespace: 'svg',
          template: '<g ng-transclude></g>',
          replace : true,
          transclude: true,
          require: 'primerTrack',
          scope: {
            sequence: '@',
            sequenceLength: '&',
            start: '&',
            width: '&',
            height: '&'
          },
          controller: function($scope, $attrs) {
            var track = $scope.track = this;

            track.sequence = function() {
              return $scope.sequence;
            };

            track.sequenceLength = function() {
              if ($scope.sequenceLength() !== undefined) { return $scope.sequenceLength(); }
              if ($scope.sequence !== undefined) { return $scope.sequence.length; }
              return 100;
            };

            track.height = function() {
              return $scope.height() || 10;
            };

            track.start = ($attrs.start) ? $scope.start : function() { return 1; };
            track.width = ($attrs.width) ? $scope.width : function() { return 500; };

            track.xScale = d3.scale.linear();

          },
          link: function link(scope, element, attrs, track) {

            function setScale() {

              track.xScale
                .domain([track.start()-1 || 1, track.sequenceLength()+1])
                .range([25, track.width()+25]);

            }

            scope.$watchCollection('[track.sequenceLength(),track.width(),track.start()]', setScale);
          },


      };
    })

  /**
   * @ngdoc directive
   * @name angularprimer.directive:primerFeature
   *
   * @restrict EA
   * @element g
   *
   * @description
   * Creates a feature on a track
   *
   * @param {number|expression} start The feature starting position
   * @param {number|expression} end The feature ending position
   * @param {number|expression=} [height=track.height] The feature height
   *
   * @example
    <example module="angularprimer-example">
      <file name="exampleB.html">
        <div ng-controller="MainController as main">

        <textarea ng-model="main.sequence" rows="4" cols="100" style="width: 100%;"></textarea>

        <table class="form" style="float: left;">
          <tr>
            <th>Feature</th>
            <th>Position</th>
            <th>Height</th>
          </tr>
          <tr class="track feature-track" ng-repeat="feature in main.features">
            <td>
              <label>{{feature.label}}</label>
            </td>
            <td>
              <input type="number" ng-model="feature.start" min="0" max="{{feature.end}}"/>
              <input type="number" ng-model="feature.end" min="{{feature.start}}" max="{{main.sequence.length}}"/>
            </td>
            <td>
              <input type="number" ng-model="feature.height" min="0"/>
            </td>
          </tr>
        </table>

        <svg width="800" height="200" shape-rendering="crispEdges">
          <g primer-track transform="translate(0,30)" class="track"
              sequence="{{main.sequence}}" start="10" width="500" height="10">
            <g primer-scale ticks="0" outer-tick-size="0">
              <g primer-label anchor="end">
                <text text-anchor="start" alignment-baseline="middle">3'</text>
              </g>
              <g primer-label anchor="start">
                <text text-anchor="end" alignment-baseline="middle">5'</text>
              </g>
            </g>
            <g primer-feature ng-repeat="feature in main.features"
                start="feature.start" end="feature.end" height="feature.height"
                class="marker {{feature.label}} {{feature.direction}}" ng-style="{fill: feature.color}">
              <g primer-feature-shape />
              <g primer-label orient="top">
                <text text-anchor="middle">{{feature.label}}</text>
              </g>
            </g>
            <primer-scale orient="bottom" transform="translate(0,30)" />
          </g>
        </svg>
        </div>
      </file>
      <file name=".js">

        angular.module('angularprimer-example',['angularprimer'])

        .controller('MainController', function MainController($scope) {
          var main = this;

          main.sequence = 'CCCTGTGGAGCCACACCCTCACCCT';
          main.sequence = new Array( 10 ).join( this.sequence );

          main.features = [
          { label: 'A', start: 60, end: 90, color: 'lightblue', height: null },
          { label: 'B', start: 125, end: 150, color: 'green', height: null },
          { label: 'C', start: 180, end: 210, color: 'yellowgreen', height: null },
          { label: 'D', start: 95, end: 120, color: 'grey', height: null },
          { label: 'E', start: 160, end: 175, color: 'red', height: null },
          { label: 'F', start: 25, end: 50, color: '#fc0', height: null }
          ];
        });

      </file>
      <file name="exampleB.css">
        table.form input {
          width: 40px;
        }

        svg .domain {
          fill: none;
          stroke: black;
          stroke-width: 2px;
        }

        svg .tick line {
          fill: none;
          stroke: black;
          stroke-width: 1px;
        }

      </file>
    </example>
   */
    .directive("primerFeature", function () {
      return {
          restrict: 'EA',
          templateNamespace: 'svg',
          template: '<g>'+
                      '<g ng-attr-transform="translate({{translate()}})">'+
                        '<title ng-bind="title()" />'+
                        '<g ng-transclude />'+
                      '</g>'+
                    '<g>',
          replace : true,
          transclude: true,
          require: ['primerFeature','^primerTrack'],
          scope: {
            start: '=',
            end: '=',
            height: '&',
            direction: '@'
          },
          controller: function($scope, $attrs) {
            var feature = this;

            feature.start = function() { return $scope.start || 0; };
            feature.end = function() { return $scope.end || $scope.start; };

          },
          link: function postLink(scope, element, attrs, ctrls) {
            var feature = scope.feature = ctrls[0];
            var track = scope.track = ctrls[1];

            if (!attrs.height) {
              feature.height = function() {
                return track.height() || 10;
              };
            } else {
              feature.height = function() {
                return scope.height() || track.height() || 10;
              };
            }

            feature.width = function() {
              return track.xScale(feature.end()+1)-track.xScale(feature.start());
            };

            function yPosition() {
              return (track.height())/2;
            }

            function xPosition() {
              return track.xScale(feature.start());
            }

            scope.translate = function() {
              return ''+xPosition()+','+yPosition();
            };

            scope.title = function() {
              var txt = ''+feature.start()+'-'+feature.end();
              if (track.sequence()) {
                txt += ' '+track.sequence().substring(feature.start()-1, feature.end());
              }
              return txt;
            };

          }

      };
    })

    /**
     * @ngdoc directive
     * @name angularprimer.directive:primerFeatureShape
     *
     * @restrict EA
     * @element path
     *
     * @description
     * Creates a shape in a feature
     *
     * @param {string=} [primerFeatureShape='rect'] The feature shape.  Can be `arrow-right`, `arrow-left`, or `rect`.
     * @param {string=} [height='feature.height()'] The shape hieght.  Defaults to height if the feature.
     *
     * @example
     <example module="angularprimer-example">
        <file name=".html">
          <div ng-controller="MainController as main">

          <table class="form" style="float: left;">
            <tr>
              <th>Feature</th>
              <th>Height</th>
              <th>Type</th>
            </tr>
            <tr class="track feature-track" ng-repeat="feature in main.features">
              <td>
                <label>{{feature.label}}</label>
              </td>
              <td>
                <input type="number" ng-model="feature.height" min="0"/>
              </td>
              <td>
                <select ng-model="feature.type">
                  <option value="">rect</option>
                  <option value="arrow-right">arrow-right</option>
                  <option value="arrow-left">arrow-left</option>
                  <!-- option value="circle">circle</option>
                  <option value="cross">cross</option>
                  <option value="diamond">diamond</option>
                  <option value="square">square</option>
                  <option value="triangle-down">triangle-down</option>
                  <option value="triangle-up">triangle-up</option -->
                </select>
              </td>
            </tr>
          </table>

          <svg width="800" height="200" shape-rendering="crispEdges">
            <g primer-track transform="translate(0,30)" class="track"
                sequence-length="250" start="10" width="500" height="10">
              <g primer-label anchor="end">
                <text text-anchor="start" alignment-baseline="middle">3'</text>
              </g>
              <g primer-label anchor="start">
                <text text-anchor="end" alignment-baseline="middle">5'</text>
              </g>
              <g primer-scale ticks="0" outer-tick-size="0" />
              <g primer-feature ng-repeat="feature in main.features"
                  start="feature.start" end="feature.end" class="marker {{feature.label}}" >
                <g primer-feature-shape="{{feature.type}}" height="feature.height" />
                <g primer-label orient="top">
                  <text text-anchor="middle">{{feature.label}}</text>
                </g>
              </g>
              <g primer-scale orient="bottom" transform="translate(0,30)"></g>
            </g>
          </svg>
          </div>
        </file>
        <file name=".js">

          angular.module('angularprimer-example',['angularprimer'])

          .controller('MainController', function MainController($scope) {
            var main = this;

            main.features = [
              { label: 'A', start: 60, end: 90, direction: 'right', height: null, type: null },
              { label: 'B', start: 125, end: 150, direction: 'right', height: null, type: null },
              { label: 'C', start: 180, end: 210, direction: 'none', height: null, type: null },
              { label: 'D', start: 95, end: 120, direction: 'left', height: null, type: null },
              { label: 'E', start: 160, end: 175, direction: 'left', height: null, type: null },
              { label: 'F', start: 25, end: 50, direction: 'none', height: null, type: null }
            ];
          });

        </file>
        <file name=".css">
          table.form input {
            width: 40px;
          }

          svg .domain {
            fill: none;
            stroke: black;
            stroke-width: 2px;
          }

          svg .tick line {
            fill: none;
            stroke: black;
            stroke-width: 1px;
          }

          .marker path {
            fill:lightblue;
            stroke:black;
            stroke-width: 1px;
          }

          .marker:hover path {
            stroke-width:2px;
          }
        </file>
      </example>
      */
      .directive("primerFeatureShape", function () {

        var arrow_height = 10;
        var arrow_length = 10;

        var svg_shapes = {  // TODO: move
          'rect': function svg_rect(L,h) {
            return 'M0,-'+h/2+' l'+L+',0 l0,'+h+' l-'+L+',0 z';
          },
          'arrow-left': function svg_arrow_left(L,h) {
            var al = L < arrow_length ? L : arrow_length;
            var ah = arrow_height;
            var w = L-al;

            return 'M0,0 l'+al+','+(h/2+5)+' l0,-5 l'+w+',0 l0,-'+h+' l-'+w+',0 l0,-5 z';
          },
          'arrow-right': function svg_arrow_right(L,h) {
            var al = L < arrow_length ? L : arrow_length;
            var ah = arrow_height;
            var w = L-al;

            return 'M0,-'+h/2+' l'+w+',0 l0,-5 l'+al+','+(h/2+5)+' l-'+al+','+(h/2+5)+' l0,-5 l-'+w+',0 z';
          }
        };

        return {
            restrict: 'EA',
            templateNamespace: 'svg',
            template: '<path />',
            replace : true,
            transclude: false,
            require: ['^primerFeature'],
            scope: {
              type: '@primerFeatureShape',
              height: '&'
            },
            link: function link(scope, element, attrs, ctrls) {
              var feature = scope.feature = ctrls[0];

              function draw() {

                var L = feature.width() || 1;
                var h = scope.height() || feature.height() || 10;
                var dir = scope.direction || 'none';
                var type = scope.type || 'rect';

                if (L < 0) {  L = 1; }

                var d = svg_shapes[type] || d3.svg.symbol().type(type).size(h*h);
                element.attr({d: d(L,h) });

              }

              scope.$watchCollection('[feature.width(),feature.height(),height(),direction,type]', draw);

            }
        };
      })

    /**
     * @ngdoc directive
     * @name angularprimer.directive:primerLabel
     *
     * @restrict EA
     * @element g
     *
     * @description
     * Adds a label to a feature or a track.
     *
     * @param {string=} [orient='middle'] The label vertical orientation.  Can be `middle`, `top`, or `bottom`.
     * @param {string=} [anchor='middle'] The label hrizontal anchor.  Can be `middle`, `start`, `end`.
     *
     * @example
       <example module="angularprimer">
         <file name=".html">
           <form>
             Feature label anchor:
             <select ng-model="anchor" ng-init="anchor = 'middle'">
               <option value="start">start</option>
               <option value="end">end</option>
               <option value="middle">middle</option>
             </select><br />
              Feature label orient:
              <select ng-model="orient" ng-init="orient = 'middle'">
                <option value="top">top</option>
                <option value="bottom">bottom</option>
                <option value="middle">middle</option>
              </select><br />
             Feature label text: <input ng-model="text" type="text" ng-init="text = 'A'" /><br />
           </form>
           <svg width="100%" shape-rendering="crispEdges">
            <g primer-track transform="translate(0,30)" sequence-length="100" height="15">
              <g primer-scale orient="top">
                <g primer-label anchor="start">
                  <text text-anchor="start" alignment-baseline="middle">3'</text>
                </g>
                <g primer-label anchor="end">
                  <text text-anchor="end" alignment-baseline="middle">5'</text>
                </g>
              </g>
              <g primer-feature start="10" end="50" class="marker" transform="translate(0,15)">
                <path primer-feature-shape />
                <g primer-label anchor="{{anchor}}" orient="{{orient}}">
                  <text text-anchor="{{anchor}}" alignment-baseline="middle">{{text}}</text>
                </g>
              </g>
            </g>
           </svg>
         </file>
         <file name=".css">
          svg .domain {
            fill: none;
            stroke: black;
            stroke-width: 2px;
          }

          svg .tick line {
            fill: none;
            stroke: black;
            stroke-width: 1px;
          }

          .marker {
            fill:lightblue;
            stroke:black;
            stroke-width: 1px;
          }

          .marker.none {
            fill:#fff !important;
            stroke-width:1px;
          }

          .marker:hover {
            stroke-width:2px;
          }

          .marker text {
            stroke: none;
            fill: black;
          }
         </file>
       </example>
     */
    .directive("primerLabel", function () {
      return {
          restrict: 'EA',
          templateNamespace: 'svg',
          template: '<g ng-attr-transform="translate({{translate()}})" ng-transclude />',
          replace : true,
          transclude: true,
          require: ['?^primerFeature','^primerTrack'],
          scope: {
            orient: '@',
            anchor: '@'
          },
          controller: function($scope) {

          },
          link: function link(scope, element, attrs, ctrls) {
            var feature = ctrls[0];
            var track = ctrls[1];

            var height = (feature) ?
              function() { return feature.height(); } :
              function() { return track.height(); };

            function xPosition() {
              var start = feature ? 0 : 25;
              if (scope.anchor === 'start') { return start; }
              var end = feature ? feature.width() : track.width()+25;
              if (scope.anchor === 'end') { return end; }
              return (end - start)/2;
            }

            function yPosition() {
              var h = height();
              var y = (feature) ? 0 : height()/2;
              if (scope.orient === 'top') { return y-h/2-6; }
              if (scope.orient === 'bottom') { return y+h/2+9; }
              return y+3;
            }

            scope.translate = function() {
              return ''+xPosition()+','+yPosition();
            };

          }
      };
    })

    /**
     * @ngdoc directive
     * @name angularprimer.directive:primerScale
     *
     * @restrict EA
     * @element g
     *
     * @description
     * Adds a axis to a track.
     *
     * @param {string=} [orient='top'] The axis orientation.  Can be `top`, or `bottom`.
     * @param {number=} [ticks=5] Approximate nuber of tick markers to display along axis.
     * @param {number=} [outerTickSize=6] The outer tick size, in pixels.
     * @param {number=} [innerTickSize=6] The inner tick size, in pixels.
     * @param {number=} [tickPadding=3] The tick padding, in pixels.
     * @param {expression} format Axis labels format.
     *
     * @example
       <example module="angularprimer">
         <file name="index.html">
          <form>
            Scale axis orientation:
            <select ng-model="orient" ng-init="orient = 'top'">
              <option value="top">top</option>
              <option value="bottom">bottom</option>
              <option value="middle">middle</option>
            </select><br />
            Scale tick format:
            <select ng-model="format" ng-init="format = 's|bp'">
              <option value="s|bp">default ("s|bp")</option>
              <option value="s">SI-prefix ("s")</option>
              <option value="e">exponent ("e")</option>
              <option value="d">integer ("d")</option>
            </select>
          </form>
          <svg width="100%" shape-rendering="crispEdges">
            <g primer-track transform="translate(0,30)" sequence-length="10e6">
              <g primer-label anchor="end" orient="middle">
                <text text-anchor="start" alignment-baseline="middle">3'</text>
              </g>
              <g primer-label anchor="start" orient="middle">
                <text text-anchor="end" alignment-baseline="middle">5'</text>
              </g>
              <g primer-scale orient="{{orient}}" format="format" />
              <g primer-feature start="10e5" end="25e5" class="marker">
                <primer-feature-shape />
              </g>
              <g primer-feature start="28e5" end="55e5" class="marker">
                  <primer-feature-shape />
              </g>
              <g primer-feature start="59e5" end="95e5"class="marker">
                <primer-feature-shape />
              </g>
            </g>
          </svg>
         </file>
         <file name=".css">
          svg .domain {
            fill: none;
            stroke: black;
            stroke-width: 2px;
          }

          svg .tick line {
            fill: none;
            stroke: black;
            stroke-width: 1px;
          }

          .marker {
            fill:lightblue;
            stroke:black;
            stroke-width: 1px;
          }

          .marker.none {
            fill:#fff !important;
            stroke-width:1px;
          }

          .marker:hover {
            stroke-width:2px;
          }
         </file>
       </example>
     */
    .directive("primerScale", function () {  // TODO: remame axis?
      return {
          restrict: 'EA',
          templateNamespace: 'svg',
          template: '<g>'+
                      '<g ng-attr-transform="translate(0,{{yPosition()}})" ng-transclude />'+
                    '</g>',
          replace : true,
          transclude: true,
          require: '^primerTrack',
          scope: {
            orient: '@',
            ticks: '&',
            outerTickSize: '&',
            innerTickSize: '&',
            tickPadding: '&',
            format: '=?'
          },
          link: function link(scope, element, attrs, track) {
            scope.track = track;

            var g = d3.select(element.find("g")[0]);
            var xAxis= d3.svg.axis();

            scope.yPosition = function() {
              if (scope.orient === 'top') { return -5; }
              if (scope.orient === 'bottom') { return track.height()+5; }
              return track.height()/2;
            };

            function fmt(specifier) {
              if (typeof specifier === 'function') {
                return specifier;
              } else {
                specifier = specifier || 's|bp';
                var split = specifier.split('|');
                var fn = d3.format(split[0] || 's');
                var suffix = split[1] || '';

                return function(d) {
                  return fn(d)+suffix;
                };

              }
            }

            function draw() {

              var orient = scope.orient || 'middle';
              var defaultSize = (orient === 'middle') ? [track.height()/2+6 || 6,0] : [6,6]; // [inner,outer]

              xAxis.scale(track.xScale)
                .ticks(scope.ticks() !== undefined ? scope.ticks() : 5)
                .tickPadding(scope.tickPadding() !== undefined ? scope.tickPadding() : 3)
                .innerTickSize(scope.innerTickSize() !== undefined ? scope.innerTickSize() : defaultSize[0])
                .outerTickSize(scope.outerTickSize() !== undefined ? scope.outerTickSize() : defaultSize[1])
                .tickFormat(fmt(scope.format))
                .orient(orient)
                ;

              g.call(xAxis);

            }

            draw();

            scope.$watchCollection('[track.sequenceLength(),track.width(),track.height(),orient,format,ticks,outerTickSize]', draw);

          }

      };
    });

}());
