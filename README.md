# microauth-facebook

> Facebook oauth for [micro](https://github.com/zeit/micro/)

[![Build Status](https://travis-ci.org/microauth/microauth-facebook.svg?branch=master)](https://travis-ci.org/microauth/microauth-facebook)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)

Add [Facebook](https://facebook.com) authentication to your [micro](https://github.com/zeit/micro/) service as easy as a flick of your fingers.
This module is a part of [microauth](https://github.com/microauth/microauth) collection.

## Installation

```sh
npm install --save microauth-facebook
# or
yarn add microauth-facebook
```

## Usage

app.js
```js
const { send } = require('micro');
const  microAuthFacebook  = require('./');

const options = {
  appId: 'APP_ID',
  appSecret: 'APP_SECRET',
  callbackUrl: 'http://localhost:3000/auth/facebook/callback',
  path: '/auth/facebook',
  fields: 'name,email,cover,first_name' // Check fields list here: https://developers.facebook.com/docs/graph-api/reference/v2.8/user
};

const facebookAuth = microAuthFacebook(options);

// third `auth` argument will provide error or result of authentication
// so it will { err: errorObject} or { result: {
//  provider: 'facebook',
//  accessToken: 'blahblah',
//  info: userInfo
// }}
module.exports = facebookAuth(async (req, res, auth) => {
  if (!auth) {
    return send(res, 404, 'Not Found');
  }

  if (auth.err) {
    // Error handler
    console.error(auth.err);
    return send(res, 403, 'Forbidden');
  }

  return `Hello ${auth.result.info.first_name}`;
});
```

Run:
```sh
micro app.js
```

Now visit `http://localhost:3000/auth/facebook`


## Author
[Dmitry Pavlovsky](http://palosk.in)
