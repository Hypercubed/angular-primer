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
        scripts: [
          './bower_components/d3/d3.js',
          './bower_components/angular/angular.js',
          './bower_components/angular-animate/angular-animate.js',
          './<%= pkg.name %>.js',
          './docs-template/script.js'
        ]
        //styles: ['./example/example.css']
      },
      all: ['<%= pkg.name %>.js']
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
      parser: {
        files: ['<%= pkg.name %>.js'],
        tasks: ['build']
      }
    },

    'gh-pages': {
      options: {
        base: 'docs'
      },
      src: ['**']
    }

  });

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  grunt.registerTask('serve', ['build','connect','watch']);

  grunt.registerTask('default', ['build']);
  grunt.registerTask('build', ['clean', 'jshint', 'uglify','ngdocs']);
  grunt.registerTask('publish', ['bump-only','build','bump-commit','gh-pages']);

};