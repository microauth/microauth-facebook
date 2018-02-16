const { send } = require('micro');
const  microAuthFacebook  = require('.');

const options = {
  appId: 'APP_ID',
  appSecret: 'APP_SECRET',
  callbackUrl: 'http://localhost:3000/auth/facebook/callback',
  path: '/auth/facebook',
	fields: 'name,email,cover,first_name', // Check fields list here: https://developers.facebook.com/docs/graph-api/reference/v2.11/user
	scope: 'public_profile,email'	// Check permissions list here: https://developers.facebook.com/docs/facebook-login/permissions
};

const facebookAuth = microAuthFacebook(options);

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
