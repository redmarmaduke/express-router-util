const fs = require("fs");
const path = require("path");
const express = require("express");

async function commonJSRouter(router, route, fileName) {
  router.use(route, require(fileName));
  return Promise.resolve(router);
}

async function esRouter(router, route, fileName) {
  return import(fileName).then(({ default: mod }) => {
    router.use(route, mod);  
    return router;
  });
}

async function processDirectory(dirname) {
  const router = express.Router();

  // return unmodified router if directory is not valid
  if (!fs.statSync(dirname,{ throwIfNoEntry: false })?.isDirectory()) {
    console.log(`${dirname} is not a directory!`);
    return router;
  }

  if (fs.statSync(path.join(dirname, "index.js"), { throwIfNoEntry: false })?.isFile()) {
    console.log(`CJS: router->/${dirname}`);
    return commonJSRouter(router,'/',dirname);
  }
  else if (fs.statSync(path.join(dirname, "index.mjs"), { throwIfNoEntry: false })?.isFile()) {
    console.log(`ES6: router->/${dirname}`);
    return esRouter(router,'/',dirname);
  } else {
    fs.readdirSync(dirname, { withFileTypes: true }).forEach(function (dirent) {
      var name = dirent.name;
      // if filename isn't invisible
      if (name[0] !== '.') {
        if (dirent.isDirectory()) {
          // resolve the router returned by processDirectory and add to this router
          processDirectory(path.join(dirname, name)).then((subRouter) => {            
            router.use(`/${name}`, subRouter);
          });
        } else if (dirent.isFile()) {  
          if (name.slice(-3) === '.js') {
            console.log(`CJS: router->+/${dirname}`);
            commonJSRouter(router,'/',path.join(dirname, name));
          } else if (name.slice(-4) === '.mjs') {   
            console.log(`ES6: router->+/${dirname}`);
            esRouter(router,'/',path.join(dirname, name));
          }
        }
      }
    });
  }
  // if directory doesn't contain index.js/index.mjs then return router that has 
  return router;
}

module.exports = function (app, options) {
  options = options || {};

  // require.main.path?
  baseDir = options.baseDir || path.join(path.dirname(require.main.filename), "routes");
  baseRoute = options.baseRoute || "/";

  if (!fs.existsSync(baseDir) || !fs.statSync(baseDir).isDirectory()) {
    console.error("baseDir: " + baseDir);
    throw "express-router-util: invalid baseDir";
  }

  return processDirectory(baseDir).then((router) => {
    app.use(baseRoute,router);
  })
};
