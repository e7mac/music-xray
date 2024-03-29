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

  const songList = [{
    "artist": "Thomas Bergersen",
    "albums": [{
      "name": "Sun",
      "tracks": [
        // "Before Time", // 2/2 - seeking not working
        // "Creation of Earth", // 3/4 - seeking not working
        "Sun",
        // "Our Destiny", // 3/4 - all broken
        "New Life",
        // "Final Frontier", // time signature
        // "Starchild", // seeking broken
        "Colors of Love",
        // "Cassandra", // seeking broken
        // "Always Mine",// seeking broken
        // "Dragonland",// seeking broken
        // "Fearless",// seeking broken
        // "Empire of Angels", // seeking weird
        "Two Hearts",
        // "In Paradisum",// seeking broken
      ]
    }]
  }, {
    artist: 'Within Temptation',
    albums: [
      {
        name: 'The Unforgiving',
        tracks: [
          // 'Shot in the Dark', // broken links
          // 'In the Middle of the Night',// seeking broken
          // 'Faster', // broken links
          'Fire and Ice',
          // 'Iron', //3/4
          // 'Where Is the Edge', // broken links
          // 'Sinead', // broken links
          // 'Lost', //3/4
          'Murder',
          'A Demon\'s Fate',
          'Stairway to the Skies',
        ],
      },
    ],
  }, {
    artist: 'René Aubry',
    albums: [
      {
        name: 'Plaisirs d\'amour',
        tracks: [
          'Demi Lune',
          // 'Fil de verre', //3.4
          'Flow',
          // 'La grande cascade',//time sig
          // 'La petite cascade', // broken
          // 'Le vent',//time sig
          // 'Lungomare', // mistakes
          'Prima donna',
          'Salento',
          'Scirocco',
          'Sirtaki à Helsinki',
          // 'Trou de mémoire',//time sig
          // 'Zig Zag', //time sig
        ],
      },
    ],
  // }, {
    // artist: 'Tingvall Trio',
    // albums: [
    //   {
    //     name: 'Dance',
    //     tracks: [
    //       "Tokyo Dance",
  //         "Dance",
  //         "Spanish Swing",
  //         "Flotten",
  //         "Riddaren",
  //         "Cuban SMS",
  //         "Arabic Slow Dance",
  //         "Puls",
  //         "Det Lilla",
  //         "Ya Man",
  //         "Bolero",
  //         "Sommarvisan",
  //         "In Memory",
    //   ]
    // }]
  // }, {
  //   artist: 'Nicholas Britell',
  //   albums: [
  //     {
  //       name: 'Succession□ Season 4 (HBO Original Series Soundtrack)',
  //       tracks: [
  //         "A Piacere di Nuovo",
  //         "Allegro Bellicoso - □Pirates□",
  //         "Allegro in F Minor - Arrival at Waystar",
  //         "Andante Espressivo - String Orchestra - □Number One Boy□",
  //         "Elegy - Strings",
  //         "End Credits - Choir and Orchestra - □With Open Eyes□",
  //         "End Credits - Vivace Appassionato in G Minor",
  //         "End Credits - □Action That□",
  //         "Interlude - Ricercare - □On the Lot□",
  //         "It's Done",
  //         "Lamentoso - Clarinets, Piano, Pizzicato Strings",
  //         "Lamentoso - Piano, Oboes, Strings",
  //         "Lamentoso - □Needy Love Sponges□",
  //         "Langsam - □We Gave It a Go□",
  //         "Lento Nobile + Lento Pizzicato",
  //         "Marcato e con Forza",
  //         "Minuet in C Minor - English Horn - □I Need You□",
  //         "Minuet in C Minor - Strings and Viola Solo",
  //         "Molto Grave - Recessional",
  //         "Phone Call",
  //         "Piano Solo + Elegy for Orchestra - □Logan's Return□",
  //         "Pianos + 808 + Beat - □Welcome Home□",
  //         "Succession (Main Title Theme) - Orchestral Intro Version",
  //         "Succession - Andante Risoluto",
  //         "□My Dear, Dear, World of a Father□",          
  //       ]
    // }]
  }
]

  // write a function to randomly pick and return a track, along with the artist and album from the songList
  const getRandomTrack = () => {
    const artistIndex = Math.floor(Math.random() * songList.length);
    const albumIndex = Math.floor(Math.random() * songList[artistIndex].albums.length);
    const trackIndex = Math.floor(Math.random() * songList[artistIndex].albums[albumIndex].tracks.length);
    const artist = songList[artistIndex].artist;
    const album = songList[artistIndex].albums[albumIndex].name;
    const track = songList[artistIndex].albums[albumIndex].tracks[trackIndex];
    return { artist, album, track };
  }

  if (mode==="spotify") { // spotify mode
    if (token !== undefined) {
      spotifyService = new SpotifyService(token);
    }
    spotifyPlayer = new SpotifyPlayer(spotifyService, apiService)
  } else {
    // quiz or direct mode
    const item = getRandomTrack();
    artist = item.artist;
    album = item.album;
    track = item.track;
    audioPlayer = new AudioURLPlayer(apiService, track, artist, album);
  }

  return (
    <div className="App">
      <header className="App-header">
      {
        mode === "spotify"
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
            <p>
              {artist} - {album} - {track}
            </p>
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
