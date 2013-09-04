# Require JS Configuration

# js/app is page specific configuration
# js/app/main is a bootstrap configuration (loaded on every page)

requirejs.config
  baseUrl: '/js/lib'
  paths:
    app: '../app'
    jquery: ['//ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min','jquery-1.10.1.min']
    bootstrap: 'bootstrap.min'
  urlArgs: "bust=" +  (new Date()).getTime()
  shim:
    bootstrap: ['jquery']

# This should be defined before
window.app ?= {}
window.app.scripts ?= []

# Set main script
scripts = ['jquery']

# Add all page scripts
for script in app.scripts
  scripts.push script

requirejs scripts