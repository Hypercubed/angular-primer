/*
 * angular-primer
 * (c) 2014 J. Harshbarger
 * Licensed MIT
 */

/*global angular*/
/*global d3 */

(function () {
    'use strict';

    /**
     * @ngdoc overview
     * @name index
     *
     * @description
     * AngularJs module for creating an svg primer visualization.  This library currently depends on d3.
     *
      * @example

        The following basic example uses angularjs directives to build a simple genomic feature view.

        <example module="angularprimer">
          <file name="exampleA.html">
            <svg width="100%" shape-rendering="crispEdges">
              <g primer-track transform="translate(0,30)" sequence-length="1e6">
                <g primer-scale />
                <g transform="translate(0,30)">
                  <g primer-label orient="right"><text text-anchor="start">3'</text></g>
                  <g primer-label orient="left"><text text-anchor="end">5'</text></g>
                </g>
                <g primer-feature
                  transform="translate(0,15)"
                  start="10e4"
                  end="25e4"
                  class="marker" >
                </g>
                <g primer-feature
                  transform="translate(0,30)"
                  start="20e4"
                  end="55e4"
                  class="marker" >
                </g>
                <g primer-feature
                  transform="translate(0,45)"
                  start="50e4"
                  end="95e4"
                  class="marker" >
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

        This example shows binding to angular data.

        <example module="angularprimer-example">
          <file name="exampleB.html">
            <div ng-controller="MainController as main">

            <textarea ng-model="main.sequence" rows="4" cols="100" style="width: 100%;"></textarea>

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
                  <input type="number" ng-model="feature.start"/>
                  <input type="number" ng-model="feature.end"/>
                  <select ng-model="feature.strand">
                    <option value="+">+</option>
                    <option value="-">-</option>
                  </select>
                </td>
                <td>
                  <select ng-model="feature.direction">
                    <option value="none">none</option>
                    <option value="left">left</option>
                    <option value="right">right</option>
                  </select>
                </td>
              </tr>
            </table>

            <svg width="800" height="200" shape-rendering="crispEdges">
              <g primer-track transform="translate(0,30)" class="track"
                sequence="{{main.sequence}}"
                start="10"
                width="500"
                height="10">
                <g>
                  <g primer-scale
                    ticks="0"
                    outer-tick-size="0">
                      <g primer-label orient="right"><text text-anchor="start">3'</text></g>
                      <g primer-label orient="left"><text text-anchor="end">5'</text></g>
                    </g>
                  <g primer-feature ng-repeat="feature in main.features | filter : { strand: '+' }"
                    start="feature.start"
                    end="feature.end"
                    direction="{{feature.direction}}"
                    ng-style="{fill: feature.color, stroke: feature.color}"
                    class="marker {{feature.label}} {{feature.direction}}" >
                    <g primer-label orient="top"><text text-anchor="middle">{{feature.label}}</text></g>
                  </g>
                </g>
                <g transform="translate(0,20)">
                  <g primer-scale
                    ticks="0"
                    outer-tick-size="0"
                    label-left="3'"
                    label-right="5'">
                    <g primer-label orient="right"><text text-anchor="start">5'</text></g>
                    <g primer-label orient="left"><text text-anchor="end">3'</text></g>
                  </g>
                  <g primer-feature ng-repeat="feature in main.features | filter : { strand: '-' }"
                    start="feature.start"
                    end="feature.end"
                    direction="{{feature.direction}}"
                    ng-style="{fill: feature.color, stroke: feature.color}"
                    class="marker {{feature.label}} {{feature.direction}}" >
                    <g primer-label orient="bottom"><text text-anchor="middle">{{feature.label}}</text></g>
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
              { label: 'A', start: 60, end: 90, direction: 'right', strand: '+', color: 'lightblue' },
              { label: 'B', start: 125, end: 150, direction: 'right', strand: '+', color: 'green' },
              { label: 'C', start: 180, end: 210, direction: 'none', strand: '+', color: 'yellowgreen' },
              { label: 'D', start: 95, end: 120, direction: 'left', strand: '-', color: 'grey' },
              { label: 'E', start: 160, end: 175, direction: 'left', strand: '-', color: 'red' },
              { label: 'F', start: 25, end: 50, direction: 'none', strand: '-', color: '#fc0' }
              ];
            });

          </file>
          <file name="exampleB.css">
            table.form input {
              width: 30px;
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
      *
      */

    var app = angular.module('angularprimer', [])


    /**
     * @ngdoc directive
     * @name angularprimer.directive:primerTrack
     * @restrict A
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
            sequence-length: <input ng-model="length" type="number" ng-init="length = 20" /><br />
            height: <input ng-model="height" type="number" ng-init="height = 10" /><br />
            width: <input ng-model="width" type="number" ng-init="width = 500" /><br />
          </form>
          <svg width="100%" shape-rendering="crispEdges">
            <g primer-track transform="translate(0,30)"
              sequence-length="length"
              height="height"
              width="width">
              <g primer-scale ticks="0"/>
              <g>
                <g primer-label orient="right"><text text-anchor="start">3'</text></g>
                <g primer-label orient="left"><text text-anchor="end">5'</text></g>
              </g>
              <g primer-feature
                start="3"
                end="8"
                class="marker" >
              </g>
              <g primer-feature
                start="10"
                end="15"
                class="marker" >
              </g>
              <g primer-feature
                start="17"
                end="19"
                class="marker" >
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
          restrict: 'A',
          templateNamespace: 'svg',
          template: '<g ng-transclude></g>',
          replace : false,
          transclude: true,
          require: 'primerTrack',
          scope: {
            sequence: '@',
            sequenceLength: '&',
            start: '&',
            width: '&',
            height: '&'
          },
          link: function link(scope, element, attrs, track) {
            track.elm = element;
          },
          controller: function($scope) {
            var track = $scope.track = this;

            track.sequence = function() {
              return $scope.sequence;
            };

            track.height = function() {
              return $scope.height() || 10;
            };

            track.sequenceLength = function() {
              if ($scope.sequenceLength() !== undefined) { return $scope.sequenceLength(); }
              if ($scope.sequence !== undefined) { return $scope.sequence.length; }
              return 100;
            };

            track.start = function() {
              return $scope.start() || 1;
            };

            track.width = function() {
              return $scope.width() || 500;
            };

            function setScale() {

              track.xScale = d3.scale.linear()
                .domain([$scope.start()-1 || 1, track.sequenceLength()+1])
                .range([25, track.width()+25]);

            }

            setScale();

            $scope.$watchCollection('[sequence,sequenceLength(),width()]', setScale);

          }

      };
    })

  /**
   * @ngdoc directive
   * @name angularprimer.directive:primerFeature
   *
   * @restrict A
   * @element g
   *
   * @description
   * Creates a feature on a track
   *
   * @param {number|expression} start The feature starting position
   * @param {number|expression} end The feature ending position
   * @param {number|expression=} [height=track.height] The feature height
   * @param {string=} [direction='none'] The feature direction.  Can be `left`, `right`, or `none`.
   *
   * @example
     <example module="angularprimer">
       <file name="index.html">
        <svg width="100%" shape-rendering="crispEdges">
          <g primer-track transform="translate(0,30)" sequence-length="1e6">
            <g primer-scale />
            <g transform="translate(0,30)">
              <g primer-label orient="right"><text text-anchor="start">3'</text></g>
              <g primer-label orient="left"><text text-anchor="end">5'</text></g>
            </g>
            <g primer-feature
              transform="translate(0,15)"
              start="10e4"
              end="25e4"
              class="marker" >
            </g>
            <g primer-feature
              transform="translate(0,30)"
              start="20e4"
              end="55e4"
              class="marker" >
            </g>
            <g primer-feature
              transform="translate(0,45)"
              start="50e4"
              end="95e4"
              class="marker" >
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
    .directive("primerFeature", function () {
      return {
          restrict: 'A',
          templateNamespace: 'svg',
          template: '<g ng-attr-transform="translate({{track.xScale(start)}},0)"><path ng-attr-d="{{d}}" /><title ng-bind="title()"></title><text text-anchor="middle" alignment-baseline="middle" ng-attr-x="{{track.xScale(end)/2 - track.xScale(start)/2}}" ng-attr-y="{{labely() + (height()/2)}}">{{label}}</text><g ng-transclude /></g>',
          replace : false,
          transclude: true,
          require: ['primerFeature','^primerTrack'],
          scope: {
            start: '=',
            end: '=',
            height: '&',
            direction: '@'
          },
          controller: function($scope) { },
          link: function link(scope, element, attrs, ctrls) {
            var feature = scope.feature = ctrls[0];
            var track = scope.track = ctrls[1];

            feature.start = function() { return scope.start; };
            feature.end = function() { return scope.end; };

            if (!attrs.height) {
              scope.height = function() {
                return track.height() || 10;
              };
            }

            feature.height = scope.height;

            scope.title = function() {
              if (track.sequence()) {
                return track.sequence().substring(scope.start-1, scope.end);
              }
              return ''+scope.start+'-'+scope.end;
            };

            function draw() {
              var al = 10;
              var ah = 10;
              var L = track.xScale(scope.end+1)-track.xScale(scope.start);
              var dir = scope.direction;

              if (L < al) {
                dir = 'none';
              }

              if (L < 0) {
                L=1;
              }

              var h = scope.height();

              //console.log(h);

              if (dir == 'left') {
                L -= al;
                scope.d = 'M0,'+h/2+' l10,'+(h/2+5)+' l0,-5 l'+L+',0 l0,-'+h+' l-'+L+',0 l0,-5 z';
              } else if (dir == 'right') {
                L -= al;
                scope.d = 'M0,0 l'+L+',0 l0,-5 l10,10 l-10,10 l0,-5 l-'+L+',0 z';
              } else {
                scope.d = 'M0,0 l'+L+',0 l0,'+h+' l-'+L+',0 z';
              }
            }

            draw();

            scope.$watchCollection('[track.sequenceLength(),track.width(),height(),start,end,direction]', draw);

          }

      };
    })

    /**
     * @ngdoc directive
     * @name angularprimer.directive:primerLabel
     *
     * @restrict A
     * @element g
     *
     * @description
     * Adds a label to a feature or a track.
     *
     * @param {string=} [orient='middle'] The label orientation.  Can be `middle`, `left`, `right`, `top`, or `bottom`.
     *
     * @example
       <example module="angularprimer">
         <file name=".html">
          <svg width="100%" shape-rendering="crispEdges">
            <g primer-track transform="translate(0,30)" sequence-length="1e6">
              <g primer-scale />
              <g transform="translate(0,30)">
                <g primer-label orient="right"><text text-anchor="start">3'</text></g>
                <g primer-label orient="left"><text text-anchor="end">5'</text></g>
              </g>
              <g primer-feature
                transform="translate(0,15)"
                start="10e4"
                end="25e4"
                class="marker" >
              </g>
              <g primer-feature
                transform="translate(0,30)"
                start="20e4"
                end="55e4"
                class="marker" >
              </g>
              <g primer-feature
                transform="translate(0,45)"
                start="50e4"
                end="95e4"
                class="marker" >
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
    .directive("primerLabel", function () {
      return {
          restrict: 'A',
          templateNamespace: 'svg',
          template: '<g ng-transclude ng-attr-transform="translate({{translate()}})"></g>',
          replace : true,
          transclude: true,
          require: ['?^primerFeature','^primerTrack'],
          scope: {
            orient: '@'
          },
          link: function link(scope, element, attrs, ctrls) {
            var track = scope.track = ctrls[1];
            var feature = scope.feature = ctrls[0];

            scope.translate = function() {
              return ''+scope.xPosition()+','+scope.yPosition();
            };

            scope.xPosition = function() {
              var start = feature ? track.xScale(feature.start()) : 25;
              if (scope.orient === 'left') { return start-5; }

              var end = feature ? track.xScale(feature.end()) : track.width()+25;
              if (scope.orient === 'right') { return end+5; }

              return (end/2 - start/2);
            };

            scope.yPosition = function() {

              var h = feature ? feature.height(): track.height();
              if (scope.orient === 'top') { return -5; }
              if (scope.orient === 'bottom') { return 2*h+5; }
              return h/2;
            };

          }
      };
    })

    /**
     * @ngdoc directive
     * @name angularprimer.directive:primerScale
     *
     * @restrict A
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
     *
     * @example
       <example module="angularprimer">
         <file name="index.html">
          <svg width="100%" shape-rendering="crispEdges">
            <g primer-track transform="translate(0,30)" sequence-length="1e6">
              <g primer-scale />
              <g transform="translate(0,30)">
                <g primer-label orient="right"><text text-anchor="start">3'</text></g>
                <g primer-label orient="left"><text text-anchor="end">5'</text></g>
              </g>
              <g primer-feature
                transform="translate(0,15)"
                start="10e4"
                end="25e4"
                class="marker" >
              </g>
              <g primer-feature
                transform="translate(0,30)"
                start="20e4"
                end="55e4"
                class="marker" >
              </g>
              <g primer-feature
                transform="translate(0,45)"
                start="50e4"
                end="95e4"
                class="marker" >
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
    .directive("primerScale", function () {
      return {
          restrict: 'A',
          templateNamespace: 'svg',
          template: '<g ng-attr-transform="translate(0,{{track.height()/2}})"></g><g ng-transclude />',
          replace : false,
          transclude: true,
          require: '^primerTrack',
          scope: {
            orient: '@',
            ticks: '&',
            outerTickSize: '&',
            innerTickSize: '&',
            tickPadding: '&',
            //labelLeft: '@',
            //labelRight: '@'
          },
          link: function link(scope, element, attrs, track) {
            scope.track = track;

            var g = d3.select(element.find("g")[0]);
            var xAxis= d3.svg.axis();

            function format() {
              var fmt = d3.format("s");
              return function(d) {
                return fmt(d)+'bp';
              };
            }

            function draw() {

              xAxis.scale(track.xScale)
                .ticks(scope.ticks() !== undefined ? scope.ticks() : 5)
                .tickPadding(scope.tickPadding() !== undefined ? scope.tickPadding() : 3)
                .innerTickSize(scope.innerTickSize() !== undefined ? scope.innerTickSize() : 6)
                .outerTickSize(scope.outerTickSize() !== undefined ? scope.outerTickSize() : 6)
                .tickFormat(format())
                .orient(scope.orient || 'top' )
                ;

              g.call(xAxis);

            }

            draw();

            scope.$watchCollection('[track.sequenceLength(),track.width(),orient,ticks,outerTickSize]', draw);

          }

      };
    });

}());
