if (!window.location.protocol.indexOf('chrome-extension') == 0) {
  window.addEventListener("keydown", checkKeyPressed, false)

  function checkKeyPressed(e) {
    if (e.keyCode == "83" && e.metaKey) {
      e.preventDefault()
      if (window.location.pathname.indexOf('localhost') ==  0) {
        return false
      }
      // TODO: pass message to background.js to trigger
      // a browser-action click
    }
  }
}

