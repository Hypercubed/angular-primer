# angular-primer

AngularJs module for creating an interactive SVG primer visualization.

## Requirements
This library currently depends on [d3](http://d3js.org/) and requires [angularjs 1.3.0-rc](https://angularjs.org/) or higher.

## Installation
1. `bower install Hypercubed/angular-primer`
2. Include `angular-primer.js` to your app.  By default at `bower_components/angular-primer/angular-primer.js`.
3. Include `d3.js` to your app.  By default at `bower_components/d3/d3.js`.
4. Add `angularprimer` as a module dependency to your app.

## Introduction
angular-primer is a set of angualrjs directives that can be easily added to existing angularjs applications to visualize genomic features.  While originally designed for the visualization of DNA/RNA primers, the angular-primer directives composable elements can be used together to create a simple, or complex, SVG visualizations of any strand based genomic features.  A visulaization consists of one or more <a href="http://hypercubed.github.io/angular-primer/#/api/angularprimer.directive:primerTrack">primer-track</a> elements.  Each <a href="http://hypercubed.github.io/angular-primer/#/api/angularprimer.directive:primerTrack">primer-track</a> element can contain any number of <a href="http://hypercubed.github.io/angular-primer/#/api/angularprimer.directive:primerScale">primer-scale</a>, <a href="http://hypercubed.github.io/angular-primer/#/api/angularprimer.directive:primerLabel">primer-label</a>, and <a href="http://hypercubed.github.io/angular-primer/#/api/angularprimer.directive:primerFeature">primer-feature</a> elements. A <a href="http://hypercubed.github.io/angular-primer/#/api/angularprimer.directive:primerFeature">primer-feature</a> in turn can contain any number of <a href="http://hypercubed.github.io/angular-primer/#/api/angularprimer.directive:primerLabel">primer-label</a> and <a href="http://hypercubed.github.io/angular-primer/#/api/angularprimer.directive:primerFeatureShape">primer-feature-shape</a> elements.  Since the view is built using SVG elements you have can add any additional SVG attributes, style with CSS, or extend behavior with other angularjs directives.  The code below shows a very simple example of the composable angular-primer elements.  More complex examples are in the [angular-primer documentation](http://hypercubed.github.io/angular-primer/).

```
<svg width="100%" shape-rendering="crispEdges" >
  <g primer-track transform="translate(0,30)">
    <g primer-scale/>
    <g primer-label anchor="start"><text text-anchor="end">3'</text></g>
    <g primer-label anchor="end"><text text-anchor="start">5'</text></g>
    <g primer-feature start="10" end="25">
      <g primer-feature-shape class="marker"/>
      <g primer-label orient="top"><text>A</text></g>
    </g>
    <g primer-feature start="30" end="55">
      <g primer-feature-shape class="marker" />
      <g primer-label orient="top"><text>B</text></g>
    </g>
    <g primer-feature start="60" end="95">
      <g primer-feature-shape class="marker"/>
      <g primer-label orient="top"><text>C</text></g>
    </g>
  </g>
</svg>
```

![example](https://rawgithub.com/Hypercubed/angular-primer/master/README-example.svg)

## Usage

See [angular-primer documentation](http://hypercubed.github.io/angular-primer/)

## Acknowledgments
This work was supported by a research grant from the Japanese Ministry of Education, Culture, Sports, Science and Technology (MEXT) to the RIKEN Center for Life Science Technologies.

## License
Copyright (c) 2014 Jayson Harshbarger

MIT
