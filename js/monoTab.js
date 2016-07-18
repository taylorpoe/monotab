// On Ready
$(document).ready(function() {
  /*
      ———————— INIT CALLS ————————
  */
  var drake = dragula() // drag/drop library
  drake.on('dragend', saveSort)
  setupHeaderText()
  setupLinks(drake)

  /*
      ———————— LISTENERS ————————
  */
  $('body').on('click', '.deleter', handleDeleterClick)
  $('body').on('click', '.lists-container a', handleLinkClick)
  $('body').on('click', '.nav-btn', handleNavClick)
  $('body').on('click', '.add-list', handleAddList)
  $('body').on('click', '.scrim', handleScrimClick)
  $('body').on('click', '.hi', handleAboutClick)
  $('body').on('change blur', '#header-text', saveHeaderText)
  $('body').on('keydown', '#header-text', resizeHeaderText)
  $('body').on('change blur', '.title-field', saveListName)
  $('body').on('keydown', '.title-field', checkForReturnKey)
  $(document).mousedown(function() { s.mouseIsDown = true })
    .mouseup(function() { s.mouseIsDown = false })
  $('body').on('mousemove', handleMouseMove)

  function handleAddList() {
    var title = h.gimmeListName()
    var id = Date.now().toString()
    var listHtml = createList(id, title, '', 0)

    $('.lists-container').append(listHtml)

    // Setup the list with drag/drop
    drake.containers.push(document.getElementById(id))

    // Set lists-container width
    handleContainerWidth()

    // Push new list into navigation
    var newNavBtn = createNavBtn([id, title])
    $('.nav-btns').append(newNavBtn)

    // Click the new button to bring it into view
    $('[data-list='+ id +']').click()

    // Show nav if there are more than 3 lists
    showNavAsNeeded()
  }

}) // End On Ready

/*
    ———————— GLOBAL STATE ————————
*/
var s = {
  linkTotal: 0,
  mouseIsDown: false,
  pageWidth: undefined
}

/*
    ———————— FUNCTIONS ————————
*/
function handleMouseMove(e) {
  if (s.mouseIsDown) {
    s.pageWidth ? s.pageWidth : s.pageWidth = $('body').width()

    if (e.pageX / s.pageWidth > .85) {
      startHorzScroll('right')
    } else if (e.pageX / s.pageWidth < .15) {
      startHorzScroll('left')
    } else {
      stopHorzScroll()
    }
  }
}

function startHorzScroll(dir) {
  var dist = dir === 'left'
    ? 0
    : $('.lists-container').width()

  $('.lists-container-housing').stop().animate({
    scrollLeft: dist
  }, 1200, 'easeInSine')
}

function stopHorzScroll() {
  $('.lists-container-housing').stop()
}

function checkForReturnKey(e) {
  if (e.keyCode == 13) {
    e.preventDefault()
    $(this).blur()
    window.getSelection().removeAllRanges()
  }
}

function saveListName() {
  var $this = $(this)
  var listId = $this.attr('name')
  var newTitle = $this.text()
  var btn = $('.nav-btns').find('[data-list="'+listId+'"]')

  // (Optimistically) update nav title
  btn.text(newTitle)
  // Update nav title
  chrome.storage.sync.get('monotabdata', function(tabsArray) {
    var currentTabs = (tabsArray.monotabdata === null) ? {} : JSON.parse(tabsArray.monotabdata)

    if (currentTabs.titles === undefined) {
      currentTabs.titles = {}
      currentTabs.titles[listId] = newTitle
    } else {
      currentTabs.titles[listId] = newTitle
    }

    chrome.storage.sync.set({'monotabdata': JSON.stringify(currentTabs)})
  })

}

function handleDeleterClick(e) {
  e.preventDefault()
  e.stopPropagation()

  var link = $(this).closest('a')
  var linkId = link.data('link-id')
  var listId =  link.closest('.links-list').attr('id')

  deleteLink(linkId, listId)
  link.slideUp(190)
}

function handleLinkClick(e) {
  var link = $(this)
  var linkId = link.data('link-id')
  var listId = link.closest('.links-list').attr('id')
  var animationTime = 190

  deleteLink(linkId, listId)
  link.slideUp(animationTime)

  if (e.metaKey || e.ctrlKey) {
    // Check if current banner open if so slideUp()
    // Put link.text() variable
    // Slide down new banner w  link text and message that it was opened in new
    // tab

    // $('banner')
  } else {
    $('.loader').fadeIn(animationTime+170)
    $('.load-bar').addClass('gotime')
  }

}

function handleNavClick() {
  var list = $(this).data('list')
  $('.lists-container-housing').stop().animate({
		scrollLeft: $('#' + list).offset().left
	}, 920, 'easeOutQuad')
}

function handleScrimClick() {
  $(this).fadeOut(225)
}

function handleAboutClick() {
  $('.scrim').fadeIn(225)
}

function deleteLink(linkId, listId) {

  var list = $('#' + listId)
  var listCountEl = list.closest('.list').find('.count')
  var newCount = list.find('.link').length - 1

  // decrement state object
  s.linkTotal -= 1
  showAddBtnAsNeeded()

  setCount(listCountEl, newCount)

  chrome.storage.sync.get('monotabdata', function(tabsArray) {
    var currentTabs = (tabsArray.monotabdata === null) ? {} : JSON.parse(tabsArray.monotabdata)
    var listInQuestion = currentTabs[listId]

    var groomedList = listInQuestion.filter(function(el) {
      return el.id !== linkId
    })

    currentTabs[listId] = groomedList

    if (currentTabs[listId].length === 0) delete currentTabs[listId]

    chrome.storage.sync.set({'monotabdata': JSON.stringify(currentTabs)})
  })
}

function saveSort(el) {
  chrome.storage.sync.get('monotabdata', function(tabsArray) {
    var fullSet = (tabsArray.monotabdata === null) ? {} : JSON.parse(tabsArray.monotabdata)

    $.each($('.links-list'), function() {
      var $this = $(this)
      var listId = $this.attr('id')

      var sortedLinks = []
      $this.find('.link').each(function() {
        var $this = $(this)
        var linkObj = {
          id: $this.data('link-id'),
          url:  $this.attr('href'),
          title: $this.data('title'),
          date: $this.data('date')
        }
        sortedLinks.push(linkObj)
      })

      fullSet[listId] = sortedLinks

      // Remove list and associated nav-btn if it is empty after sorting
      if (fullSet[listId].length === 0) {
        var selector = '#' + listId
        $(selector).closest('.list').remove()
        delete fullSet[listId]
        $('[data-list=' + listId + ']').remove()
      }

      // Save title if we have a new list
      if (!fullSet.titles) {
        fullSet.titles = {}
      }
      if (fullSet.titles[listId] == undefined) {
        fullSet.titles[listId] = $(this).closest('.list').find('.title-field').text()
      }
    })


    // Set lists-container width
    handleContainerWidth()

    chrome.storage.sync.set({'monotabdata': JSON.stringify(fullSet)})

    updateCountsOnSort()

    showNavAsNeeded()
  })
}

// Only show nav if there are three or more lists
function showNavAsNeeded() {
  if ($('.nav-btn').length > 2) {
    $('.nav-btns').show()
  } else {
    $('.nav-btns').hide()
  }
}

// Only show add-list button if there is more than one link in state
function showAddBtnAsNeeded() {
  if (s.linkTotal > 1) {
    $('.add-list').show()
  } else {
    $('.add-list').hide()
  }
}

// Used for testing
function whatIsStateNow() {
  chrome.storage.sync.get('monotabdata', function(tabsObj) {
    console.info(tabsObj)
  })
}

// TODO: Make onboarding prettier. Maybe step through slider.
function checkForEmptyState(lists) {
  var listsCount = Object.keys(lists).length

  if (listsCount <= 1 ) {
    if (listsCount === 1 && lists.titles == undefined) {
      return false
    } else {
      $('.spinner').hide()
      $('.empty-state').show()
    }
  }
}

function setupLinks(drake) {
  chrome.storage.sync.get('monotabdata', function(tabsObj) {
    var lists = (Object.keys(tabsObj).length ===  0) ? {} : JSON.parse(tabsObj.monotabdata)

    checkForEmptyState(lists)

    var listInfoForNav = []
    // For each list in lists
    $.each(lists, function(x, list) {
      var listId = x
      var listCount = list.length
      var linksObjs = []

      if (listId !== 'titles') {
        $.each(list, function(y, linkObj) {
          linksObjs.push(linkObj)
          // update links total in state object
          s.linkTotal += 1
        })

        // Map over our array of link objects and turn them into html
        var linkHtmlArray = linksObjs.map(createListItems)
        var linksHtml = linkHtmlArray.join('')
        // See if a user-saved title exists, if so pass it in for createList
        var listTitle = lists.titles === undefined
            ? listId
            : lists.titles[listId]

        // Setup nav with list titles
        listInfoForNav.push([listId, listTitle])

        // Create list HTML
        var listHtml = createList(listId, listTitle, linksHtml, listCount)
        $('.lists-container').append(listHtml)

        // Setup the list with drag/drop
        drake.containers.push(document.getElementById(listId))
      }
    })

    // Set lists-container width
    handleContainerWidth()

    // Add navigation buttons to navbar
    var navBtns = listInfoForNav.map(createNavBtn)
    var navHolster = $('.nav-btns')

    navHolster.append(navBtns)

    // If we have less than 3 lists don't show nav buttons
    showNavAsNeeded()

    // If we have only one link item we hide the add-list button
    showAddBtnAsNeeded()

    $('.spinner').hide()
  })
}

function createNavBtn(array){
  var listId = array[0]
  var listName = array[1]
  return '<button type="button" class="nav-btn" data-list="'+listId+'">'+listName+'</button>'
}

function createList(id, title, linksItems, count) {
  var list =
    '<div class="list">'+
      '<div class="list-title">'+
        '<span class="title-field" contenteditable="true" name="'+id+'">'+title+'</span>'+
        '<div class="goofwrap">&nbsp;('+
          '<span class="count-holster">'+
            '<span class="count">'+ count +'</span>'+
          '</span>'+
        ')</div>'+
      '</div>'+
      '<div class="links-list" id="'+ id +'">'+
        linksItems +
      '</div>'+
    '</div>'

  return list
}

function createListItems(link) {
  if (link.title == "MonoTab") {
    return
  }

  var prettyUrl = link.url.replace(/^(https?:\/\/)?(www\.)?/,'').replace(/\/$/, "")
  var prettyUrlTrunced = prettyUrl.trunc(47)
  var baseUrl = prettyUrl.split('/')[0]
  var titleTruced = link.title.trunc(47) || 'No Title'
  var date = link.date || 'Date Unknown'
  var favicon = '<img width="16" height="16" class="favicon" src="http://www.google.com/s2/favicons?domain=' + baseUrl + '" />'

  var linkUI =
    '<a class="link" data-link-id="' +link.id+'" href="' +link.url+ '" data-date="' +date+ '" data-title="' +link.title+ '">' +
    favicon +
    titleTruced +
      '<div class="tooltip">' +
         '<div class="tooltip-item-wrap">' +
          '<div class="tooltip-title mid">URL</div>' +
          '<div class="tooltip-data mid">' +prettyUrlTrunced+ '</div>' +
        '</div>' +
         '<div class="tooltip-item-wrap">' +
          '<div class="tooltip-title">ADDED</div>' +
          '<div class="tooltip-data">' +date+ '</div>' +
        '</div>' +
      '</div>' +
      '<div class="deleter">&times</div>' +
    '</a>'

  return linkUI
}

function updateCountsOnSort() {
  $.each($('.count'), function() {
    var $currentCount = $(this)
    var currentValue = parseInt($currentCount.text())
    var newCount = $currentCount.closest('.list').find('.link').length

    if (currentValue !== newCount) setCount($currentCount, newCount)
  })
}

function setCount(countToChange, newCount) {
  countToChange.addClass('exit-up')

  setTimeout(function() {
    var holster = countToChange.closest('.count-holster')
    countToChange.hide().removeClass('count')
    holster.append(
      '<span class="count below">' +newCount+ '</span>'
    )
    setTimeout(function() {
      holster.find('span').removeClass('below')
    }, 17)
  }, 200)
}

function saveHeaderText() {
  var newMainText = $('#header-text').val()

  if (!newMainText) return

  resizeHeaderText()

  chrome.storage.sync.set({'mainText': newMainText})
}

function setupHeaderText() {
  chrome.storage.sync.get('mainText', function(text) {
    var setupText = text.mainText || "MonoTab"

    $('#header-text').val(setupText)
    resizeHeaderText()
  })
}

// Resize font-size based on how may words are within the message
function resizeHeaderText(e) {
  var headerText = $('#header-text')
  if (e !== undefined) {
    if (e.keyCode == 13) {
      e.preventDefault();
      headerText.blur()
      return false
    }
  }

  var numWords = headerText.val().split(" ").length

  if ((numWords >= 1) && (numWords < 3)) {
    headerText.css("font-size", "120px")
  }
  else if ((numWords >= 3) && (numWords < 5)) {
    headerText.css("font-size", "90px")
  }
  else if ((numWords >= 3) && (numWords < 10)) {
    headerText.css("font-size", "70px")
  }
  else if ((numWords >= 10) && (numWords < 15)) {
    headerText.css("font-size", "50px")
  }
  else if ((numWords >= 20) && (numWords < 27)) {
    headerText.css("font-size", "40px")
  }
  else if ((numWords >= 30) && (numWords < 40)) {
    headerText.css("font-size", "33px")
  }
  else {
    headerText.css("font-size", "20px")
  }
}

function handleContainerWidth() {
  var listsCount = $('.list').length

  if (listsCount > 2) {
    $('.list').css('float', 'left')

    var newWidth = (listsCount - 2) * 530 + 1200
    $('.lists-container').css('width', newWidth + 'px')
  } else {
    $('.list').css('float', 'none')
    $('.lists-container').css('width', '100%')
  }
}

// Decorate native String obejct with trucation
String.prototype.trunc = String.prototype.trunc ||
  function(n) {
    return (this.length > n) ? this.substr(0, n - 1) + '<span class="lip">&hellip;</span>' : this
  }

// function imageExists(src, callback) {
//   var img = new Image()
//   img.onload = function() {
//     callback(src, true)
//     state.hasFavicon = true
//   }
//   img.onerror = function() {
//     callback(src, false)
//     state.hasFavicon = false
//   }
//   // img.onload = function() {
//   //   callback(src, true)
//   //   fImg = true
//   // }
//   // img.onerror = function() {
//   //   callback(src, false)

//   // }
//   img.src=src
// }

// Make favicon loading more robust
// Work out this conditional

// var baseUrl = 'reactforbeginners.com';

// imageExists('http://' + baseUrl +'/favicon.ico', function(src, exists) {
//     if (exists) {
//         console.log('worked');
//         $('<img>').attr('src', src).appendTo('body');
//     } else {
//         console.log('failed');
//         $('<img>').attr('src', "http://www.google.com/s2/favicons?domain=" + baseUrl).appendTo('body');
//     }
// });


// function imageExists(src, callback) {
//     var img = new Image();
//     img.onload = function() {
//         callback(src, true);
//     };
//     img.onerror = function() {
//         callback(src, false);
//     };
//     img.src=src;
// }




//or


// works but dont' want to use
  // faviconUrl = 'http://favicon.yandex.net/favicon/' + baseUrl