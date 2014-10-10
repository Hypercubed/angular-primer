describe('Directive: marked,', function () {
  'use strict';

  // load the directive's module
  beforeEach(module('angularprimer'));

  var $rootScope,
      $scope,
      $compile;

  beforeEach(inject(function (_$rootScope_, _$compile_) {

    $rootScope = _$rootScope_;
    $scope = $rootScope.$new();
    $compile = _$compile_;

  }));

  describe('primer-track', function () {
    it('should set default values', function () {
      var element = $compile('<primer-track />')($scope);
      $scope.$digest();

      var scope = element.isolateScope();
      var track = scope.track;
      var scale = track.xScale;

      expect(track.sequence()).toBeUndefined();
      expect(track.sequenceLength()).toEqual(100);
      expect(track.height()).toEqual(10);
      expect(track.start()).toEqual(0);
      expect(track.width()).toEqual(500);
      expect(typeof scale).toEqual('function');

      expect(scale.domain()).toEqual([0,100]);  // 0-based, default
      expect(scale.range()).toEqual([25,525]);  // margin

      expect(scale(0)).toEqual(25);
      expect(scale(50)).toEqual(275);

    });

    it('should take attributes', function () {
      var html = '<primer-track sequence-length="300" start="100" width="900" height="30" />';
      var element = $compile(html)($scope);
      $scope.$digest();

      var scope = element.isolateScope();
      var track = scope.track;
      var scale = track.xScale;

      expect(track.start()).toEqual(100);

      expect(track.sequence()).toBeUndefined();
      expect(track.sequenceLength()).toEqual(300);

      expect(track.height()).toEqual(30);
      expect(track.width()).toEqual(900);

      expect(typeof scale).toEqual('function');

      expect(scale.domain()).toEqual([100,400]);  //TODO: check this!!!
      expect(scale.range()).toEqual([25,925]);

      expect(scale(100)).toBeCloseTo(25, 0); // check
      expect(scale(250)).toBeCloseTo(475, 0); // check

    });

    it('should take sequence', function () {
      var html = '<primer-track sequence="ATCGNNNUU" start="100" width="900" height="30" />';
      var element = $compile(html)($scope);
      $scope.$digest();

      var scope = element.isolateScope();
      var track = scope.track;
      var scale = track.xScale;

      expect(track.start()).toEqual(100);

      expect(track.sequence()).toEqual('ATCGNNNUU');
      expect(track.sequenceLength()).toEqual(9);

      expect(track.height()).toEqual(30);
      expect(track.width()).toEqual(900);

      expect(typeof scale).toEqual('function');

      expect(scale.domain()).toEqual([100,109]);  //TODO: check
      expect(scale.range()).toEqual([25,925]);

      expect(scale(100)).toBeCloseTo(25, 0);
      expect(scale(103)).toBeCloseTo(325, 0);

    });

  });

  describe('primer-feature', function () {

    it('should set default values', function () {
      var element = $compile('<g primer-track><primer-feature /></g>')($scope);
      $scope.$digest();

      var scope = element.find('g').isolateScope();
      var feature = scope.feature;

      expect(feature.start()).toEqual(0);
      expect(feature.end()).toEqual(1);

      expect(feature.width()).toEqual(5);
      expect(feature.height()).toEqual(10);

      expect(feature.sequence()).toBeUndefined();
      expect(feature.sequenceLength()).toEqual(1);

      element = element.find('title');
      expect(element.text()).toEqual('0-1');

      element = element.parent();
      expect(element.attr('transform')).toEqual('translate(25,5)');  // margin, track.height/2

    });

    it('should set default values from track, sequence-length', function () {
      var html = '<g primer-track sequence-length="300" start="100" width="900" height="30">'+
                   '<primer-feature />'+
                 '</g>';

      var element = $compile(html)($scope);
      $scope.$digest();

      var scope = element.find('g').isolateScope();
      var feature = scope.feature;

      expect(feature.start()).toEqual(100);
      expect(feature.end()).toEqual(101);

      expect(feature.width()).toBeCloseTo(3,0);
      expect(feature.height()).toEqual(30);

      expect(feature.sequence()).toBeUndefined();
      expect(feature.sequenceLength()).toEqual(1);

      element = element.find('title');
      expect(element.text()).toEqual('100-101');

      element = element.parent();
      expect(element.attr('transform')).toEqual('translate(25,15)');  // margin, track.height/2

    });

    it('should set default values from track, sequence', function () {
      var html = '<g primer-track sequence="ATCG" start="100" width="900" height="60">'+
                   '<primer-feature />'+
                 '</g>';

      var element = $compile(html)($scope);
      $scope.$digest();

      var scope = element.find('g').isolateScope();
      var feature = scope.feature;

      expect(feature.start()).toEqual(100);
      expect(feature.end()).toEqual(101);

      expect(feature.width()).toBeCloseTo(1/4*900,0);
      expect(feature.height()).toEqual(60);

      expect(feature.sequence()).toEqual('A');
      expect(feature.sequenceLength()).toEqual(1);

      element = element.find('title');
      expect(element.text()).toEqual('100-101 A');

      element = element.parent();
      expect(element.attr('transform')).toEqual('translate(25,30)');  // margin, track.height/2

    });

    it('should override track', function () {
      var html = '<g primer-track sequence-length="300" start="100" width="900" height="30">'+
                   '<primer-feature start="150" end="200" height="50" />'+
                 '</g>';

      var element = $compile(html)($scope);
      $scope.$digest();

      var scope = element.find('g').isolateScope();
      var feature = scope.feature;

      expect(feature.start()).toEqual(150);
      expect(feature.end()).toEqual(200);

      expect(feature.width()).toBeCloseTo(150,0);
      expect(feature.height()).toEqual(50);

      expect(feature.sequence()).toBeUndefined();
      expect(feature.sequenceLength()).toEqual(50);

      element = element.find('title');
      expect(element.text()).toEqual('150-200');

      element = element.parent();
      expect(element.attr('transform')).toMatch(/translate\(175\.0[^\,]*\,15\)/);  // margin+pos, track.height/2

    });

    it('should get correct sequence', function () {
      var html = '<g primer-track sequence="ATCGNNNUU" start="100" width="900" height="30">'+
                   '<primer-feature start="101" end="103" />'+
                 '</g>';

      var element = $compile(html)($scope);
      $scope.$digest();

      var scope = element.find('g').isolateScope();
      var feature = scope.feature;

      expect(feature.start()).toEqual(101);
      expect(feature.end()).toEqual(103);

      expect(feature.width()).toBeCloseTo(200,2);
      expect(feature.height()).toEqual(30);

      expect(feature.sequence()).toEqual('TC');
      expect(feature.sequenceLength()).toEqual(2);

      element = element.find('title');
      expect(element.text()).toEqual('101-103 TC');

      element = element.parent();
      expect(element.attr('transform')).toEqual('translate(125,15)');  // margin, track.height/2


    });

  });

  describe('primer-feature-shape', function () {

    it('should set default shape', function () {
      var html = '<g primer-track>'+
                   '<g primer-feature>'+
                     '<primer-feature-shape />'+
                   '</g>'+
                 '</g>';

      var element = $compile(html)($scope);
      $scope.$digest();

      element = element.find('path');
      expect(element.attr('d')).toEqual('M0,-5 l5,0 l0,10 l-5,0 z');  // TODO: check

    });

    it('should take attributes from track', function () {
      var html = '<g primer-track height="20">'+
                   '<g primer-feature>'+
                     '<primer-feature-shape />'+
                   '</g>'+
                 '</g>';

      var element = $compile(html)($scope);
      $scope.$digest();

      element = element.find('path');
      expect(element.attr('d')).toEqual('M0,-10 l5,0 l0,20 l-5,0 z');  // TODO: check

    });

    it('should take attributes from feature that override track', function () {
      var html = '<g primer-track height="20">'+
                   '<g primer-feature height="30" start="50" end="60" >'+
                     '<primer-feature-shape />'+
                   '</g>'+
                 '</g>';

      var element = $compile(html)($scope);
      $scope.$digest();

      element = element.find('path');
      expect(element.attr('d')).toEqual('M0,-15 l50,0 l0,30 l-50,0 z');  // TODO: check

    });

    it('should take attributes override features and track', function () {
      var html = '<g primer-track height="20">'+
                   '<g primer-feature height="30" start="50" end="60" >'+
                     '<primer-feature-shape height="40" />'+
                   '</g>'+
                 '</g>';

      var element = $compile(html)($scope);
      $scope.$digest();

      element = element.find('path');
      expect(element.attr('d')).toEqual('M0,-20 l50,0 l0,40 l-50,0 z');  // TODO: check

    });

    it('should take attributes', function () {
      var html = '<g primer-track>'+
                   '<g primer-feature >'+
                     '<g primer-feature-shape="arrow-right" height="20" />'+
                   '</g>'+
                 '</g>';

      var element = $compile(html)($scope);
      $scope.$digest();

      element = element.find('path');
      expect(element.attr('d')).toEqual('M0,-10 l0,0 l0,-5 l5,15 l-5,15 l0,-5 l-0,0 z');  // TODO: check

    });

  });

  describe('primer-feature primer-label', function () {

    it('should add simple label', function () {
      var html = '<g primer-track>'+
                   '<g primer-feature>'+
                     '<g primer-label="ABC" />'+
                   '</g>'+
                 '</g>';

      var element = $compile(html)($scope);
      $scope.$digest();

      element = element.find('text');
      expect(element.text()).toEqual('ABC');

      element = element.parent();
      expect(element.attr('transform')).toEqual('translate(2.5,3)'); // TODO: check

    });

    it('should add advanced label', function () {
      var html = '<g primer-track>'+
                   '<g primer-feature>'+
                     '<g primer-label>'+
                       '<text>123<text>'+
                     '</g>'+
                   '</g>'+
                 '</g>';

      var element = $compile(html)($scope);
      $scope.$digest();

      element = element.find('text');
      expect(element.text()).toEqual('123');

      element = element.parent();
      expect(element.attr('transform')).toEqual('translate(2.5,3)'); // TODO: check x=width/2, y=-fontsize

    });

    it('should add simple label, top-start', function () {
      var html = '<g primer-track>'+
                   '<g primer-feature>'+
                     '<g primer-label="123" orient="top" anchor="start" />'+
                   '</g>'+
                 '</g>';

      var element = $compile(html)($scope);
      $scope.$digest();

      element = element.find('text');
      expect(element.text()).toEqual('123');

      element = element.parent();
      expect(element.attr('transform')).toEqual('translate(0,-11)');  // todo: check

    });

    it('should add simple label, bottom-end', function () {
      var html = '<g primer-track>'+
                   '<g primer-feature>'+
                     '<g primer-label="123" orient="bottom" anchor="end" />'+
                   '</g>'+
                 '</g>';

      var element = $compile(html)($scope);
      $scope.$digest();

      element = element.find('text');
      expect(element.text()).toEqual('123');

      element = element.parent();
      expect(element.attr('transform')).toEqual('translate(5,14)');  // todo: check

    });

  });

});
