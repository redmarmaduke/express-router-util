# express-router-util

## Installation

git has support for submodules.

```bash
git submodule add http://www.github.com/redmarmaduke/express-router-util
```

## Usage


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
