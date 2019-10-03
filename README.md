# express-mount-files

[![Travis CI - Build Status](https://travis-ci.org/rhumaric/express-fluffy-train.svg?branch=master)](https://travis-ci.org/rhumaric/express-fluffy-train)
[![Appveyor - Build status](https://ci.appveyor.com/api/projects/status/r2kkx586wajvfm7q/branch/master?svg=true)](https://ci.appveyor.com/project/rhumaric/express-fluffy-train/branch/master)
[![Coverage Status](https://coveralls.io/repos/github/rhumaric/express-fluffy-train/badge.svg?branch=master)](https://coveralls.io/github/rhumaric/express-fluffy-train?branch=master)

An express middleware that lets you match your folder structure to your app's URL structure.
Declare routes by creating files at the path you want them to handle requests for, helping identify which bit of the app is handling a request hitting a specific URL.

## Getting started

Add the middleware to your express app, passing the folder that'll contain your routes.

```js
const mw = require('express-fluffy-train');
// Use the routes folder as the root for all your routes
app.use(mw('routes'))
```

In that `routes` folder, create files ending with `<http_method>.js` and exporting the function that will handle the request. You can use any of the HTTP methods supported by Express. They need to be in **lowercase** in the file name, though.

For example, the following code in <code>routes/hello/world<strong>.get.js</strong></code> will make GET requests to `/hello/world` respond with 'Hello world'.

```js
module.exports = function(req,res) {
  res.send('Hello world')
}
```

The middleware also support files that don't have any part before their `<http_method>.js` extension. For example 'routes/hello/get.js' will respond to `GET` requests sent to `/hello`.

### Mounting order

Deeper routes will be mounted first ensuring requests don't get swallowed by shallow routes being mounted ahead.

## Template rendering

If a specific URL only needs to render a template, you can create files ending with `<http_method>.<template_extension>` to declare routes the same way as for JavaScript function.

For this to happen, you'll need to:

- [configure Express to render use the templating engine of your choice](express-templating-engine)
- let the middleware know which extension those templates are using, via its `viewExtensions` option.
  As Express allows multiple template engines, this option accepts an `Array`.

  ```js
    // Provided `pug` has been registered as a view engine for Express
    const mw = require('express-fluffy-train');
    app.use(mw('routes', {viewExtensions: ['pug']}))
  ```

With that in place, the `routes/time.get.pug` template will render for requests hitting `/time`.

### Mounting order

For a same path, JavaScript routes will always be mounted before template routes. This lets you take advantage of Express' `next()` function to:

- prepare the data in a JavaScript route, say the `greeting.get.js` file

  ```js
  module.exports = function(req,res,next) {
    res.locals.greeting = 'Howdy!';
  }
  ```

- render the response in `greeting.get.pug` template

  ```js
  h1 #{res.locals.greeting} world!
  ```

## Route parameters

Express allows parts of routes starting in `:` to be intepreted as [parameters for the requests](express-route-parameters), later available in the `req.params` object. This middleware provides the same feature, with one little tweak, it uses the `$` character instead of `:` (`:` didn't feel that safe to put in a file/folder name).

This way, the file at `routes/users/$userId/edit.get.js` will get `12` for `req.params.userId` when responding to `/users/12/edit`.

### Mounting order

For routes with the same depth (say `/users/$userId/edit.get.js` and `/users/me/edit.get.js`), the routes with the most variables will be mounted last, leaving the more specific routes to match first.

## Mounting middlewares

express-fluffy-train also lets you  set up middlewares of specific routes. It'll look for `routes.js` files exporting an `Array` of functions to be registered as middlewares.

The following `routes/middlewares/routes.js` will register two functions to be used as middlewares for requests hitting `routes/middlewares`.

```js
module.exports = [function(req,res, next){
  next()
}, function(req,res,next) {
  next()
}];
```

### Mounting order

The middlewares in those `routes.js` files are always mounted **before** the JavaScript and view routes.
This means middlewares will run for all the routes within the folder. Contrary to the routes, though, middlewares will be mounted deepest last. This allows middlewares declared closest to the root to apply before the ones declared deeper.

## Declaring middlewares and routes simmultaneously

The `routes.js` files can also export a hash, in which case they will be used to register:

- middlewares declared in their `use` key
- routes declared in any `<http_method>` key

For example, this `routes.js` file will mount:

- 1 function as middleware,
- two routes to handle the GET and POST requests hitting the path of the folder:

```js
module.exports = {
  use: [function(req,res,next) {
    next()
  }],
  get(req,res) {
    res.send('GET')
  },
  post(req,res) {
    res.send('POST')
  }
}
```

### Mounting order

The middlewares will be mounted in the same order as when exporting an `Array`. Routes will follow the same order as when using `<http_method>.js` files.

## Folder separator

The middleware replaces any double underscore (`__`) as a directory separator. This should be used sparingly, but can help preventing to create nested folders for a single route file.

[express-templating-engine]: https://expressjs.com/en/guide/using-template-engines.html
[express-route-parameters]: https://expressjs.com/en/guide/routing.html#route-parameters
