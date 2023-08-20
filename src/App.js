import './App.css';
import APIService from './services/APIService';
import SpotifyService from './services/SpotifyService';
import ChordChart from './components/ChordChart';
import QuizChart from './components/QuizChart';
import Login from './components/Login';
import SpotifyPlayerControl from './components/SpotifyPlayerControl';
import SpotifyPlayer from './services/SpotifyPlayer';
import AudioPlayerControl from './components/AudioPlayerControl';
import AudioURLPlayer from './services/AudioURLPlayer';

function App() {

  const queryParams = new URLSearchParams(window.location.search);
  const mode = queryParams.get("mode");
  console.log(mode);

  const token = queryParams.get("code");

  var apiService = new APIService();
  var spotifyService = null;
  var spotifyPlayer = null;
  var audioPlayer = null;

  var artist = null;
  var album = null;
  var track = null;

  if (mode==="spotify") { // spotify mode
    if (token !== undefined) {
      spotifyService = new SpotifyService(token);
    }
    spotifyPlayer = new SpotifyPlayer(spotifyService, apiService)
  } else if (mode==="quiz") {
    artist = "Thomas Bergersen"
    album = "Sun"
    track = "Colors of Love"
    audioPlayer = new AudioURLPlayer(apiService, track, artist, album)
  } else {
    // direct mode
    artist = "Thomas Bergersen"
    album = "Sun"
    track = "Colors of Love"
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
        : mode === "direct"
          ?
            <>
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
          : // mode quiz            
          <>
            <AudioPlayerControl
              player={audioPlayer}
            />
            <QuizChart
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
