// Add your scripts here
import SpotifyWebApi from 'spotify-web-api-node';
import ServerMethods from 'spotify-web-api-node/src/server-methods';

// Patch missing server methods to client methods
// Fix found in https://github.com/thelinmichael/spotify-web-api-node/issues/342
// eslint-disable-next-line no-underscore-dangle
SpotifyWebApi._addMethods(ServerMethods);

// Create the API object
const spotifyApi = new SpotifyWebApi({
  clientId: '6cf3f16a66384230930850cc3f530bd2',
  redirectUri: 'http://localhost:8000/callback/',
});

// Set up the authentication permissions and URL
const scopes = ['user-read-private'];
const state = 'final-project';
const showDialog = true;
const responseType = 'token';

const authorizeURL = spotifyApi.createAuthorizeURL(scopes, state, showDialog,
  responseType);

// Click a button to log in
const loginButton = document.querySelector('#js-login');

function logIn() {
  window.location.href = authorizeURL;
}

loginButton.addEventListener('click', logIn);

// Look for parameters in the URL
const queryString = window.location.hash;

// If there are any parameters in the URL, go ahead
// with granting the authorization code and trimming
// the URL back down
if (queryString !== '') {
  const code = queryString.split("&")[0].split("=")[1];
  spotifyApi.setAccessToken(code);
  // Redirect to the place you'd like to be in nextURL.
  // Right now, this will redirect to your index.html.
  const nextURL = window.location.origin;
  const nextTitle = 'Begin the quiz';
  const nextState = { additionalInformation: 'Authorization granted' };
  window.history.replaceState(nextState, nextTitle, nextURL);
  loginButton.style.display = "none";
}

// Get Elvis' albums
spotifyApi.getArtistAlbums('43ZHCT0cAZBISjO8DG9PnE', { limit: 10, offset: 20 }).then(
  // eslint-disable-next-line prefer-arrow-callback
  function (data) {
    console.log('Artist albums', data.body);
  },
  // eslint-disable-next-line prefer-arrow-callback
  function (err) {
    console.error(err);
  },
);
