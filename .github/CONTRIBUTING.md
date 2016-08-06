First of all — thank you for considering contributing!

#### App Details
* jQuery, CSS, HTML — that's it.

#### Dev Setup
1. Fork the project and get set up locally
2. In your browser navigate to `chrome://extensions/`
3. Click the `Load packed extension` _(You might need to compress/zip the folder first — I can't remember)_
4. You should be good to dev. Write me at taylorpoe@gmail.com if you can't get it going.

#### Other Funkiness
Chrome Extensions are a bit funky to develop in general. Tabs are saved in the `background.js` file, which runs in a secure environment. To access a console for this environment, go to `chrome://extensions/` in your browser and find the MonoTab app. Make sure to first Reload the extension (must be done every time you change background.js). Then — to access the console, click `background page` in the `Inspect Views` section.

#### Other Notes
* Please PR against staging unless we've talked about shooting straight to master.
* Please do not update the `manifest.js` file.