module.exports = function(grunt){
  'use strict';

  grunt.initConfig({
    pkg: grunt.file.readJSON('bower.json'),

    jshint: {
      options: {
        jshintrc: true,
        force: true
      },
      all: ['gruntfile.js', '<%= pkg.name %>.js']
    },

    bump: {
      options: {
        files: ['bower.json','package.json'],
        commit: true,
        commitMessage: 'release %VERSION%',
        commitFiles: ['package.json','bower.json','<%= pkg.name %>.min.js'], // '-a' for all files
        pushTo: 'origin',
      }
    },

    uglify: {
      options: {
        banner: '/*\n * <%= pkg.title || pkg.name %> <%= pkg.version %>\n' +
          ' * (c) <%= grunt.template.today("yyyy") %> <%= pkg.authors.join(" ") %>\n' +
          ' * Licensed <%= pkg.license %>\n */\n'
      },
      src: {
        files: {
          '<%= pkg.name %>.min.js': '<%= pkg.name %>.js'
        }
      }
    },

    ngdocs: {
      options: {
        html5Mode: false,
        //startPage: '/api/angularprimer',
        navTemplate: './docs-template/nav.html',
        discussions: {
          shortName: 'hypercubedgithub',
          url: 'http://hypercubed.github.io/<%= pkg.name %>/#',
          dev: false
        },
        analytics: {
          account: 'UA-102465-14',
          domainName: 'hypercubed.github.io'
        },
        scripts: [
          './bower_components/d3/d3.js',
          './bower_components/jquery/dist/jquery.js',
          './bower_components/angular/angular.js',
          './bower_components/angular-animate/angular-animate.js',
          './bower_components/angular-rangeslider/angular.rangeSlider.js',
          './<%= pkg.name %>.js',
          './docs-template/script.js'
        ],
        styles: [
          './bower_components/angular-rangeslider/angular.rangeSlider.css'
        ]
      },
      more: {
        src: ['./docs-template/*.ngdoc'],
        title: 'Learn more'
      },
      all: ['<%= pkg.name %>.js'],
    },

    clean: ['docs'],

    connect: {
      server: {
        options: {
          port: 9001,
          base: 'docs',
          hostname: 'localhost',
          open: true
        }
      }
    },

    watch: {
      serve: {
        files: ['<%= pkg.name %>.js','./docs-template/*.ngdoc'],
        tasks: ['ngdocs']
      },
      test: {
        files: ['<%= pkg.name %>.js','./test/spec/*.js'],
        tasks: ['test']
      }
    },

    'gh-pages': {
      options: {
        base: 'docs'
      },
      src: ['**']
    },

    karma: {
      unit: {
        configFile: 'karma.conf.js'
      },
      once: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS']
      },
      server: {
        configFile: 'karma.conf.js',
        singleRun: false,
        autoWatch: true,
        browsers: ['PhantomJS']
      }
    }

  });

  require('load-grunt-tasks')(grunt);
  //require('time-grunt')(grunt);

  grunt.registerTask('serve', ['build','connect','watch']);

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['clean','test','uglify','ngdocs']);
  grunt.registerTask('test', ['jshint', 'karma:once']);
  grunt.registerTask('publish', ['bump-only','build','bump-commit','gh-pages']);

};
