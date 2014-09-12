/*
 * angular-primer
 * (c) 2014 J. Harshbarger
 * Licensed MIT
 */

/*global angular*/
/*global d3 */

(function () {
    'use strict';

    var app = angular.module('angularprimer', [])

    .directive("primerTrack", function () {
      return {
          restrict: 'AE',
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

            track.height = $scope.height;

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

    .directive("primerFeature", function () {
      return {
          restrict: 'AE',
          templateNamespace: 'svg',
          template: '<g ng-attr-transform="translate({{track.xScale(start)}},0)"><path ng-attr-d="{{d}}" /><title ng-bind="title()"></title><text text-anchor="middle" alignment-baseline="middle" ng-attr-x="{{track.xScale(end)/2 - track.xScale(start)/2}}" ng-attr-y="{{labely() + (height()/2)}}">{{label}}</text><g ng-transclude /></g>',
          replace : false,
          transclude: true,
          require: ['primerFeature','^primerTrack'],
          scope: {
            start: '=',
            end: '=',
            height: '&',
            //label: '@',
            //labely: '&',
            direction: '@'
          },
          controller: function($scope) {

          },
          link: function link(scope, element, attrs, ctrls) {
            var feature = ctrls[0];
            var track = scope.track = ctrls[1];

            //console.log(ctrls);

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

            scope.$watchCollection('[track.sequenceLength(),track.width(),start,end,direction]', draw);

          }

      };
    })

    .directive("primerLabel", function () {
      return {
          restrict: 'AE',
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
              return h;
            };

          }
      };
    })

    .directive("primerScale", function () {
      return {
          restrict: 'AE',
          templateNamespace: 'svg',
          template: '<g transform="translate(0,5)"></g><g ng-transclude />',
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
