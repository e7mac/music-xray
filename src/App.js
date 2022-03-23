import './App.css';
import APIService from './services/APIService';
import SpotifyService from './services/SpotifyService';
import ChordChart from './components/ChordChart';

function App() {

  const apiService = new APIService()
  const spotifyService = new SpotifyService()

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
