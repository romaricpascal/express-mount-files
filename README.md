# express-fluffy-train (Temporary name - Work in Progress)

An express middleware that discovers and loads routes within directories. Declare your routes through:
 
- `/folder/routes.js`: Export an array of middlewares, an object with `use`, `get`,`post`,`put`... or a `configure(router)` function to easily declare routes within `/folder`.
- `/folder/<method>.js`: Export a function or an array of middewares to handle the `<method> /folder` route.
- `/folder/path.<method>.js`: Similarly, export a function or array of middlewares that handle the `<method> /folder/path` route. Saves creating a folder just for the sake of `/folder/path/<method>.js`
- `/folder/<method>.<view_extension>`: Maps a generic handler that renders the view for the `<method> /folder` route. This will mostly be for `GET` routes, but could also benefits other methods where the data is worked out by middlewares.
- `/folder/path.<method>.<view_extension>`: Same as for the JS, quickly declare a handler for `<method> /folder/path` to render the given view

If both `<method>.js` and `<method>.<view_extension>` are present, the JS version will get mounted first, allowing it to do its rendering and bypass the `<method>.<view_extension>` or forward to it with `next()` (that would be sweet if I understood how this worked, it'd mean you can attach data to `res.locals` and forward to the view handler!).

New `Router`s are created for each `routes.js` and `middlewares.js` found. Routes further down the respective containing directory get attached to them, allowing to share middlewares. This probably calls for a mechanism to exclude some routes to be mounted on the current router, or even to be mounted on a parent router (*TBD*, maybe allow `/folder--<variant>` to be mounted to the same `/folder`).

*TBD* Path parameters need some way to be declared too. *Need to find a naming scheme that works both for `/folder/<...>/get.js`,`/folder/<...>.get.js`. Maybe `_paramName_`. The leading `_` propels the file to the top of the listing though.*

Files not ending with `.<method>.<extension>` will not get automatically mounted. This lets you have whichever structure you need inside the folder.

Possible aliases:
 - `/folder/middlewares.js`: `/folder/routes.js`, but more meaningful when routes are declared through `get.<extension>` for ex.
 - `/folder/index.js`: `/folder/get.js` to match the `index.html` convention

## Why?

Never been a fan of collocating files by function (routes, views, models...). It makes much more sense to me to keep files of a same feature close to each other as it makes it much easier to get into things. This middleware should help with that.




