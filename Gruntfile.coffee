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

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-less'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-notify'

  # Custom Tasks

  grunt.registerTask 'compile:web', ['notify:compile','coffee:web','less:web']

  grunt.registerTask 'web', ['compile:web','watch']

  grunt.registerTask 'default', ['web']

  true