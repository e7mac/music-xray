import logo from './logo.svg';
import './App.css';
import APIService from './services/APIService';
import SpotifyService from './services/SpotifyService';
import ChordChart from './components/ChordChart';

function App() {

  const apiService = new APIService()
  const spotifyService = new SpotifyService()
  const artist = "Lin-Manuel Miranda"
  const album = "Vivo (Original Motion Picture Soundtrack)"
  const track = "Keep the Beat"

  return (
    <div className="App">
      <header className="App-header">
      <ChordChart
        api={apiService}
        spotify={spotifyService}
      />
      </header>
    </div>
  );
}

export default App;
