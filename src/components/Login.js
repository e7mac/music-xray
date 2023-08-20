import React, { useEffect } from 'react';

const Login = () => {
    const client_id = 'c7ceddc193814288b0559ca594aa0184';
    const redirect_uri = 'https://e7mac.github.io/music-xray/';
    const scopes = 'user-read-playback-state user-modify-playback-state user-read-currently-playing';

    useEffect(() => {
        authorize();
    }, []);

    const authorize = () => {
        const address = 'https://accounts.spotify.com/authorize?' +
            'response_type=code' +
            '&client_id=' + client_id +
            '&scope=' + scopes +
            '&redirect_uri=' + redirect_uri;

        window.location.href = address;
    };

    return (
        <div>
            <div id="login">
                <h1>First, log in to Spotify</h1>
                <a href="/login">Log in</a>
            </div>
            <div id="loggedin"></div>
        </div>
    );
};

export default Login;
