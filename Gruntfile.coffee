path = require 'path'
#lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet
#folderMount = (connect, point) ->
#  connect.static path.resolve(point)

module.exports = (grunt) ->

  livereload = 35729

  @initConfig

    pkg: @file.readJSON("package.json")

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
        files: @file.expandMapping(['src/coffee/**/*.coffee', '!node_modules/**/*.coffee'], '',
          expand: true
          rename: (base, src) ->
            src
            .replace(/^src\/(.*)$/, 'web/$1')
            .replace(/coffee/g, 'js')
        )
      spec:
        options:
          bare: true
        expand: true
        cwd: 'spec'
        src: ['**.coffee']
        dest: 'spec'
        ext: '.js'

    less:
      changed:
        files:
          'web/css/main.css': 'src/less/main.less'
      web:
        files:
          'web/css/main.css': 'src/less/main.less'

    component:
      web:
        options:
          action: 'install'

    component_build:
      searchreplace:
        output: './web/js/lib/'
        config: './component.json'
        scripts: true
        styles: false
        plugins: ['coffee']
        configure: (builder) ->
          # Enable Component plugins
          json = require 'component-json'
          builder.use json()

  # Fix broken Component aliases, as mentioned in
  # https://github.com/anthonyshort/component-coffee/issues/3
    combine:
      web:
        input: 'web/js/lib/searchreplace.js'
        output: 'web/js/lib/searchreplace.js'
        tokens: [
          token: '.coffee'
          string: '.js'
        ]

    watch:
      coffee:
        files: ['src/coffee/**/*.coffee', 'spec/*.coffee', 'components/*.coffee']
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
    cafemocha:
      nodejs:
        src: ['spec/*.coffee']
        options:
          reporter: 'dot'

    mocha_phantomjs:
      options:
        output: 'spec/result.xml'
        reporter: 'dot'
      all: ['spec/runner.html']

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
      app: ['src/coffee/**/*.coffee, components/*.coffee']
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

  # web
  @loadNpmTasks 'grunt-contrib-coffee'
  @loadNpmTasks 'grunt-contrib-less'
  @loadNpmTasks 'grunt-component'
  @loadNpmTasks 'grunt-component-build'
  @loadNpmTasks 'grunt-combine'
  @loadNpmTasks 'grunt-contrib-jshint'
  @loadNpmTasks 'grunt-contrib-watch'
  @loadNpmTasks 'grunt-contrib-connect'

  # qa
  @loadNpmTasks 'grunt-cafe-mocha'
  @loadNpmTasks 'grunt-mocha-phantomjs'
  @loadNpmTasks 'grunt-notify'
  @loadNpmTasks 'grunt-coffeelint'
  @loadNpmTasks 'grunt-selenium'

  # build
  @loadNpmTasks 'grunt-contrib-clean'
  @loadNpmTasks 'grunt-contrib-copy'
  @loadNpmTasks 'grunt-contrib-uglify'
  @loadNpmTasks 'grunt-contrib-cssmin'

  # tasks
  @registerTask 'noflo:web', ['component:web','component_build:searchreplace','combine:web']
  @registerTask 'compile:web', ['notify:compile','coffee:web','less:web','noflo:web']

  @registerTask 'web', ['compile:web','watch']
  @registerTask 'qa', ['jshint','coffeelint','selenium','cafemocha','mocha_phantomjs']
  @registerTask 'build', ['clean:build','copy:build','uglify:build','cssmin:build']

  @registerTask 'default', ['web']

  true
