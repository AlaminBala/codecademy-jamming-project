const clientId = 'a030c0b337c344ef836b7416ad42eb40';
const redirectURI = 'http://rustic-voyage.surge.sh';

let accessToken;
const Spotify = {
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }

        //check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

        if(accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
        
        //this clears parameters allowing us to grab new accessToken
        window.setTimeout(() => accessToken = '' , expiresIn * 1000);
        window.history.pushState('Access Token', null, '/');
        return accessToken;
        } else {
            const accessURL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = accessURL;
        }

    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,  { 
            headers: {
                Authorization: `Bearer ${accessToken}`
        } 
    }).then(response => {
        return response.json();
    }).then(jsonResponse => {
        if(!jsonResponse.tracks) {
            return [];
        }
        return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri
        }));
    });
    },

    savePlaylist(name, trackURIs){
        if(!name || !trackURIs.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}` };
        let userId;
        return fetch('https://api.spotify.com/v1/me', { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, 
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name })
            }).then(response => response.json)
        }).then(jsonResponse => {
            const playlistId = jsonResponse.id;
            return fetch (`https://api.spotify.com/v1/users/{user_id}/playlists/${playlistId}/tracks`, 
            {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ uris: trackURIs })
            })
        })
    }
};

export default Spotify;