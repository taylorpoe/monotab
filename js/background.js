chrome.browserAction.onClicked.addListener(function() {
  chrome.tabs.query({active: true}, function(data) {
    // If we're on the chrome new tab page, don't save it
    if (data[0].url.indexOf('chrome://newtab/') == 0) {
      return false
    }
    // Get setup active tab's
    var tabToSave = {
      id: data[0].id,
      url: data[0].url,
      title: data[0].title,
      rawDate: new Date()
    }
    // Add tab to storage
    chrome.storage.sync.get('monotabdata', function(tabsObj) {
      if (Object.keys(tabsObj).length ==  0) {
        var tmp = {'defaultList': [tabToSave]}
      } else {
        var tmp = JSON.parse(tabsObj.monotabdata)
        if (Object.keys(tmp).length == 0) {
          tmp = {'defaultList': [tabToSave]}
        } else if (Object.keys(tmp).length == 1 && tmp.titles !== undefined) {
          // Mutate tmp to delete titles and save it as the only tab
          tmp = {'defaultList': [tabToSave]}
        } else {
          // if defaultList already exists we've made it this far. We add to this list
          tmp.defaultList.unshift(tabToSave)
        }
      }

      chrome.storage.sync.set({'monotabdata': JSON.stringify(tmp)})
    })
    // Close the active tab after saving
    chrome.tabs.remove(data[0].id)
  })
})

function extend(a, b){
  for(var key in b)
    if(b.hasOwnProperty(key))
      a[key] = b[key];
  return a;
}