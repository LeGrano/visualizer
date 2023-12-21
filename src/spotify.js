

const startAccueilSpotify = () => {
    //code spotify dorian ici
    console.log('test function');

    const clientId = '5fbe65d0e2d04d7ea42ad55995d78174';
    const redirectUri = 'http://localhost:8080';
    const scopes = 'user-top-read';
    const body = document.querySelector("body");
    
    function authorizeSpotify() {
        const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
        window.location.href = authorizeUrl;
    }
    
    const button = document.getElementById("unidentified");
    
    button.onclick = authorizeSpotify;
    
    // Function to extract access token from URL hash
    function getAccessTokenFromUrl() {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        return params.get('access_token');
    }
    
    function getUserInfo(accessToken) {
        const userInfoUrl = 'https://api.spotify.com/v1/me';
    
        fetch(userInfoUrl, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => response.json())
        .then(data => {
            document.querySelector("#identified>div>p").append(data.display_name);
            document.querySelector(".profile-pic").src = data.images[1].url;
        })
        .catch(error => {
            console.error('Error fetching user info:', error);
        });
    }
    
    function GetTracks(mytoken) {
        const endpoint = 'https://api.spotify.com/v1/me/top/tracks';
        const time_range = 'short_term';
        const limit = 5;
        const token = mytoken;
      
        return fetch(`${endpoint}?time_range=${time_range}&limit=${limit}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            return data;
          })
          .catch((error) => {
            throw error;
          });
    }
    
    function searchTrackByName(trackName, accessToken) {
        const endpoint = 'https://api.spotify.com/v1/search';
        const token = accessToken;
      
        return fetch(`${endpoint}?q=${trackName}&type=track`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            data.tracks.items.slice(0, 10).forEach(element => {
                // console.log(element);
                const tracksContainer = document.getElementById('tracks-container');
                const trackTemplate = document.getElementById('track-template');
    
                const clone = document.importNode(trackTemplate.content, true);
    
                let trackName;
                let albumName;
    
                if (element.name.length > 30){
                    trackName = element.name.substring(0, 35) + '...';
                } else {
                    trackName = element.name;
                }
    
                if (element.album.name.length > 30){
                  albumName = element.album.name.substring(0, 35) + '...';
                } else {
                  albumName = element.album.name;
                }
    
                clone.getElementById('tpl-album-pic').src = element.album.images[1].url; 
                clone.getElementById('tpl-play-btn').href = `visualizer.html?audio=${element.preview_url}`; 
                clone.getElementById('tpl-track-name').textContent = trackName; 
                clone.getElementById('tpl-album-name').textContent = albumName + " - ";
                clone.getElementById('tpl-artist-name').textContent = element.artists[0].name;
    
                if(element.preview_url !== null){tracksContainer.appendChild(clone)};
    
            });
            return data;
          })
          .catch((error) => {
            throw error;
          });
    }
    
    window.onload = function () {
        const accessToken = getAccessTokenFromUrl();
        if (accessToken) {
          getUserInfo(accessToken);
          document.querySelector("#unidentified").style.display = "none";
        } else {
          document.querySelector("#identified").style.display = "none";
        }
        document.querySelector("#track-search").addEventListener("input", (event) => {
            document.getElementById('tracks-container').innerHTML = "";
            searchTrackByName(document.querySelector("#track-search").value.replace(/ /g, '+'), accessToken);
        }); 
    };
    
    var currentTrack; // Déclarez la variable en dehors de la fonction pour qu'elle soit globale
    
    $(document).on("click", ".tpl-play-btn", function () {
      var audioElement = new Audio($(this).val());
    
      if (currentTrack && currentTrack !== audioElement) {
        currentTrack.pause(); // Arrêtez la lecture du son précédent
      }
    
      if (audioElement.paused) {
        audioElement.play();
        currentTrack = audioElement; // Mettez à jour l'audio en cours de lecture
      } else {
        audioElement.pause(); // Si l'audio est en cours de lecture, mettez-le en pause
      }
    });
    
}

export default startAccueilSpotify;

