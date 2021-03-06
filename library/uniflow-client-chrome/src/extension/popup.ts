;(function() {
  function addEvent(parent, evt, selector, handler) {
    parent.addEventListener(
      evt,
      function(event) {
        if (event.target.matches(selector + ', ' + selector + ' *')) {
          handler.apply(event.target.closest(selector), arguments)
        }
      },
      false
    )
  }

  const refreshButton = document.getElementById('refresh')
  const goToOptionsButton = document.getElementById('go-to-options')
  const flowsElement = document.getElementById('flows')

  goToOptionsButton.addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage()
    } else {
      window.open(chrome.runtime.getURL('options.html'))
    }
  })

  addEvent(flowsElement, 'click', 'a', e => {
    e.preventDefault()

    let itemId = e.target.getAttribute('href')
    browser.runtime.sendMessage({ channel: 'run', id: itemId })
  })

  refreshButton.addEventListener('click', () => {
    browser.runtime.sendMessage({ channel: 'refresh' })
  })

  browser.runtime.onMessage.addListener(message => {
    if (message.channel === 'refresh-data') {
      let items = []
      for (let i = 0; i < message.data.length; i++) {
        let item = message.data[i]
        const template = `<div class="row"><div class="col-12-sm"><a href="${item.id}">${item.title}</a></div></div>`

        items.push(template)
      }

      flowsElement.innerHTML = items.join('')
    }
  })

  browser.runtime.sendMessage({ channel: 'refresh' })
})()
