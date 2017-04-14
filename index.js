const querystring = require('querystring');
const url = require('url');

const rp = require('request-promise');
const redirect = require('micro-redirect');
const uuid = require('uuid');

const provider = 'facebook';
const apiVersion = '2.8';

const microAuthFacebook = ({ appId, appSecret, fields = 'name,email,cover', callbackUrl, path = '/auth/facebook' }) => {

  const getRedirectUrl = state => {
    return `https://www.facebook.com/dialog/oauth?client_id=${appId}&redirect_uri=${callbackUrl}&response_type=code&state=${state}`;
  };

  const getAccessTokenUrl = code => {
    return `https://graph.facebook.com/v${apiVersion}/oauth/access_token?client_id=${appId}&redirect_uri=${callbackUrl}&client_secret=${appSecret}&code=${code}`;
  };

  const getUserInfoUrl = accessToken => {
    return `https://graph.facebook.com/v${apiVersion}/me?access_token=${accessToken}&fields=${fields}`;
  };

  const states = [];
  return fn => async (req, res, ...args) => {

    const { pathname, query } = url.parse(req.url);

    if (pathname === path) {
      try {
        const state = uuid.v4();
        const redirectUrl = getRedirectUrl(state);
        states.push(state);
        return redirect(res, 302, redirectUrl);
      } catch (err) {
        args.push({ err, provider });
        return fn(req, res, ...args);
      }

    }

    const callbackPath = url.parse(callbackUrl).pathname;
    if (pathname === callbackPath) {
      try {
        const { state, code } = querystring.parse(query);

        if (!states.includes(state)) {
          const err = new Error('Invalid state');
          args.push({ err, provider });
          return fn(req, res, ...args);
        }

        const response = await rp({
          method: 'GET',
          url: getAccessTokenUrl(code),
          json: true
        });

        const accessToken = response.access_token;
        const info = await rp({
          method: 'GET',
          url: getUserInfoUrl(accessToken),
          json: true
        });

        const result = {
          provider,
          accessToken,
          info
        };

        args.push({ result });
        return fn(req, res, ...args);
      } catch (err) {
        args.push({ err, provider });
        return fn(req, res, ...args);
      }
    }

    return fn(req, res, ...args);
  };
};

module.exports = microAuthFacebook;
