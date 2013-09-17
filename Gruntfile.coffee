path = require 'path'
#lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet
#folderMount = (connect, point) ->
#  connect.static path.resolve(point)

module.exports = (grunt) ->

  livereload = 35729

  grunt.initConfig
  
    pkg: grunt.file.readJSON("package.json")

    connect:
      server:
        options:
          port: 8080
          base: 'app/build'

    notify:
      watch:
        options:
          title: 'Regarde'
          message: 'Snipers on the roof, sir!'
      coffee:
        options:
          title: 'Coffeescript'
          message: 'Coffeescript compiled. Mission accomplished.'
      less:
        options:
          title: 'LESS'
          message: 'LESS compiled. Mission accomplished.'
      compile:
        options:
          title: 'Compile'
          message: 'Compiling. Mission accomplished, sir.'

    coffee:
      changed:
        expand: true
        src: '<%= grunt.task.current.files %>'
        rename: (base, src) ->
          src
            .replace(/^src\/(.*)$/, 'web/$1')
            .replace(/coffee/g, 'js')
      web:
        files: grunt.file.expandMapping(['src/coffee/**/*.coffee', '!node_modules/**/*.coffee'], '',
          expand: true
          rename: (base, src) ->
            src
              .replace(/^src\/(.*)$/, 'web/$1')
              .replace(/coffee/g, 'js')
        )

    less:
      changed:
        files:
          'web/css/main.css': 'src/less/main.less'
      web:
        files:
          'web/css/main.css': 'src/less/main.less'

    watch:
      coffee:
        files: ['src/coffee/**/*.coffee']
        tasks: ['coffee:web','notify:coffee']
        nospawn: true
      less:
        files: ['src/less/**/*.less']
        tasks: ['less:web','notify:less']
        nospawn: true
      php:
        files: ['web/*.php']
        options:
          livereload: livereload
      js:
        files: ['web/**/*.js']
        options:
          livereload: livereload
      css:
        files: ['web/**/*.css']
        options:
          livereload: livereload

    # QA tools
    jshint:
      all: ['web/**/js/*.js', '!node_modules/**/*.js']
      options:
        globals:
          jQuery:   true
          _:        true
          console:  true
          module:   true
          document: true
          window:   true
        validthis:true
        laxcomma: true
        laxbreak: true
        browser:  true
        boss:     true
        expr:     true
        asi:      true
        eqnull:   true

    coffeelint:
      app: ['src/coffee/**/*.coffee']
      options:
        max_line_length:
          level: 'ignore'

    selenium:
      options:
        browsers: ['firefox','ie','chrome']
      suite:
        files:
          'web/tests/selenium/result.tap': ['web/tests/selenium/**/*.suite']

    # build
    clean:
      build: ['web/build']

    copy:
      build:
        files: [
          expand: true,
          src: ['**', '!build/**'],
          dest: 'web/build'
          cwd: 'web'
          filter: 'isFile'
        ]

    uglify:
      build:
        files: [
          expand: true
          src: ['web/build/js/**/*.js', '!web/build/js/**/*.min.js']
          dest: './'
        ]

    cssmin:
      build:
        files: [
          expand: true
          src: ['web/build/css/**/*.css', '!web/build/css/**/*.min.css']
          dest: './'
        ]

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-cssmin'
  grunt.loadNpmTasks 'grunt-notify'
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-selenium'

  # Custom Tasks
  grunt.registerTask 'compile:web', ['notify:compile','coffee:web','less:web']

  grunt.registerTask 'build', ['clean:build','copy:build','uglify:build','cssmin:build']
  grunt.registerTask 'web', ['compile:web','watch']
  grunt.registerTask 'qa', ['jshint','coffeelint','selenium']

  grunt.registerTask 'default', ['web']

  true