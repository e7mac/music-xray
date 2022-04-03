import './App.css';
import APIService from './services/APIService';
import SpotifyService from './services/SpotifyService';
import ChordChart from './components/ChordChart';
import Login from './components/Login';
import SpotifyPlayerControl from './components/SpotifyPlayerControl';
import SpotifyPlayer from './services/SpotifyPlayer';
import AudioPlayerControl from './components/AudioPlayerControl';
import AudioURLPlayer from './services/AudioURLPlayer';

function App() {

  const queryParams = new URLSearchParams(window.location.search);
  const mode = queryParams.get("direct");
  console.log(mode);


  const token = queryParams.get("code");

  var apiService = new APIService();
  var spotifyService = null;
  var spotifyPlayer = null;
  var audioPlayer = null;

  var artist = null;
  var album = null;
  var track = null;

  if (mode===null) { // spotify mode
    if (token !== undefined) {
      spotifyService = new SpotifyService(token);
    }
    spotifyPlayer = new SpotifyPlayer(spotifyService, apiService)
  } else {
    // direct mode
    artist = "Nicholas Britell"
    album = "Succession□ Season 1 (HBO Original Series Soundtrack)"
    track = "Succession (Main Title Theme)"
    audioPlayer = new AudioURLPlayer(apiService, track, artist, album)
  }

  return (
    <div className="App">
      <header className="App-header">
      {
        mode === null
        ? token === null
          ? <Login/>
          : <>
              <SpotifyPlayerControl
                player={spotifyPlayer}
              />
              <ChordChart
                api={apiService}
                player={spotifyPlayer}
              />
            </>
        : <>
              <AudioPlayerControl
                player={audioPlayer}
              />
              <ChordChart
                api={apiService}
                player={audioPlayer}
                artist={artist}
                album={album}
                track={track}
              />
            </>

      }
      </header>
    </div>
  );
}

export default App;
