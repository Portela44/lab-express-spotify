require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

// Our routes go here:
app.get("/", (req, res, next) => {
    res.render("index");
})

app.get("/artist-search", (req, res, next) => {
    const {artist} = req.query;
    spotifyApi
        .searchArtists(artist)
        .then(data => {
            const response = data.body.artists;
            console.log("The received artists from the api: ", data.body);
            console.log("One example artist: ", response.items[0]);
            console.log("one example image: ", response.items[0].images[0].url)
            res.render("artist-search-results", response);
        })
        .catch(err => console.log("An error while searching the artist occured: ", err));
})

app.get("/albums/:artistId", (req, res, next) => {
    const {artistId} = req.params;
    spotifyApi
        .getArtistAlbums(artistId)
        .then(data => {
            const response = data.body;
            res.render("albums", response);
        })
        .catch(err => console.log("An error while searching the album occured: ", err));
})

app.get("/tracks/:albumId", (req, res, next) => {
    const {albumId} = req.params;
    spotifyApi
        .getAlbumTracks(albumId)
        .then(data => {
            const response = data.body;
            res.render("tracks", response);
        })
        .catch(err => console.log("An error while searching the tracks occured: ", err));
})


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
