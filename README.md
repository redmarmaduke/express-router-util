# express-router-util

Builds express routes that mimic the directory structure.


## Installation

git has support for submodules.

```bash
git submodule add http://www.github.com/redmarmaduke/express-router-util
```

## Usage

For each non-index.js file/directory in a directory below the baseDir, the name of the
file/directory will be considered a route segment name.  The utility will recurse through
the entire directory structure.

The files should default export the router callback used in express.

The files can be CommonJS (.js) or ES6 modules(.mjs).

If a directory contains an index[.js|.mjs], no recursion will occur in that directory. index[.js|.mjs]
assumes all responsibility for constructing routes and must also default export the router
callback used in express.

ex.
/routes/api/getSomething.js -> builds a route "/api/getSomething"


```javascript
/**
 * require('express-router-util)(app, object);
 * require('express-router-util)(object);
 * @params {function} - express function/app
 * @params {object} - options {
 *  baseDir : defaults to "/routes" - the base directory for constructing routes
 *  baseRoute: defaults to "/" - prefix to the constructed routes
 * }
 * @returns express() app if none passed as an argument, else returns app passed
 *  as an argument.
 */

const app = require('express');
require('express-router-util')(
    app,
    {
        baseDir : "/routes",
        baseRoute: "/"
    }
);
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
