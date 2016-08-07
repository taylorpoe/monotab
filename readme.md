
# Contributing

#### App Details
* jQuery, CSS, HTML

#### Dev Setup
1. Fork the project and get set up locally
2. In your browser navigate to `chrome://extensions/`
3. Click the `Load packed extension` _(You might need to compress/zip the folder first — I can't remember)_
4. Make sure it is 'enabled' after loading it
5. You should be good to dev. Write me at taylorpoe@gmail.com if you can't get it going.

#### Other Funkiness
Chrome Extensions are a bit funky to develop in general.

**background.js**
Tabs are saved in the `background.js` file, which runs in a secure environment. To access a console for this environment, go to `chrome://extensions/` in your browser and find the MonoTab app. Make sure to first Reload the extension (must be done every time you change background.js). Then — to access the console, click `background page` in the `Inspect Views` section.

**content.js**
This environment runs on all webpages except for the new tab page

**monoTab.js**
This environment runs on the new tab page

#### Other Notes
* Please PR against staging unless we've talked about shooting straight to master.
* Please do not update the `manifest.js` file.

----

# The Why

**Different from typical user-lists apps**
Reason it _needs to be on a new tab_ is because most user-list apps out there:
Pocket, flipboard, etc tend to become graveyards of "set and forget". When our lists
aren't in front of us they are often are never revisited.

MonoTab is different in that it hijacks the new tab screen in Chrome. A screen
we all see many times each day. The goal is to create something worth of taking over this
prime real estate. It needs to have a remarkable ux — something users will enjoy interacting with.

**Memory Savings**
Save your browser some memory of having all those pages open at once. Write more here.