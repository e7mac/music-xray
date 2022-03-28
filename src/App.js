import './App.css';
import APIService from './services/APIService';
import SpotifyService from './services/SpotifyService';
import ChordChart from './components/ChordChart';
import Login from './components/Login';
import Player from './components/Player';
import SpotifyPlayer from './services/SpotifyPlayer';

function App() {

  const queryParams = new URLSearchParams(window.location.search);
  const token = queryParams.get("code");

  var apiService = new APIService();
  var spotifyService = null;

  if (token !== undefined) {
    spotifyService = new SpotifyService(token);
  }
  var spotifyPlayer = new SpotifyPlayer(spotifyService, apiService)

  return (
    <div className="App">
      <header className="App-header">
      {
        token === null
        ? <Login/>
        : <>
            <Player
              player={spotifyPlayer}
            />
            <ChordChart
              api={apiService}
              spotify={spotifyService}
              player={spotifyPlayer}
            />
          </>
      }
      </header>
    </div>
  );
}

export default App;
