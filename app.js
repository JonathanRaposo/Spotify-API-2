require('dotenv').config()
const express = require('express');
const app = express();
const hbs = require('hbs');


app.use(express.static(__dirname + '/public'))
app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');

const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi(
    {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    }
)

// console.log(spotifyApi)

spotifyApi
    .clientCredentialsGrant()
    .then((data) => {
        // console.log('data: ', data)
        spotifyApi.setAccessToken(data.body['access_token'])
    })
    .catch((err) => console.log('Something went wrong when retrieving an access token', err));

// Get Home Page

app.get('/', (req, res) => {
    res.render('index');
});

//  search artist route:
app.get('/artist-search', (req, res) => {
    console.log('query: ', req.query)
    const { q: query } = req.query;


    spotifyApi
        .searchArtists(query)
        .then((data) => {

            const artists = data.body.artists.items;

            // for (let artist of artists) {
            //     console.log(artist.images[1])
            // }

            res.render('artist-search-results.hbs', { artist: artists })
        })
        .catch((err) => console.log('Error while retrieving artist: ', err))
})

//  search for artist's albums :
app.get('/albums/:id', (req, res) => {
    console.log('params', req.params);
    const { id } = req.params;
    spotifyApi
        .getArtistAlbums(id)
        .then((data) => {
            // console.log('Albums: ', data.body.items);
            // const { items: albums } = data.body;
            const albums = data.body.items;
            res.render('albums.hbs', { album: albums })
        })
        .catch((err) => console.log('Error while getting albums: ', err))

})

app.get('/tracks/:id', (req, res) => {
    console.log('params: ', req.params)

    const { id } = req.params;
    spotifyApi
        .getAlbumTracks(id)
        .then((data) => {
            // console.log('tracks: ', data.body.items)
            const { items: tracks } = data.body;
            // const tracks = data.body.items;

            res.render('tracks.hbs', { track: tracks })
        })
        .catch((err) => console.log('Error while getting tracks: ', err))
})


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
