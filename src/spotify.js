
/**
 * Fonction à lancer pour la page d'accueil.
 * Appelle l'API Spotify pour récupérer les informations de l'utilisateur et les musiques que l'on recherche pour les envoyer à l'initialiseur.
 */
const startAccueilSpotify = () => {
    //code spotify dorian ici
    
    // const pour l'api spotify
    const clientId = '5fbe65d0e2d04d7ea42ad55995d78174';
    const redirectUri = 'http://localhost:8080';
    const scopes = 'user-top-read';
    
    /**
     * Fonction qui redirige vers la page d'autorisation Spotify.
     */
    function authorizeSpotify() {
        const authorizeUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
        window.location.href = authorizeUrl;
    }
    
    const button = document.getElementById("unidentified");
    
    button.onclick = authorizeSpotify;
    
    /**
     * Fonction pour récuperer le token d'authentification de l'utilisateur.
     * @returns {string} - L'access token de l'utilisateur
     */
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

    /**
     * Fonction de recherche du morceau sur l'API Spotify
     * @param {string} trackName - Le nom de la musique à rechercher (présent dans l'input)
     * @param {string} accessToken - Le token d'authentification de l'utilisateur
     * @returns 
     */
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
    
    /**
     * Fonction qui récupère le token d'authentification de l'utilisateur et qui lance la recherche de musique.
     */
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
    
    let currentTrack; // Déclarez la variable en dehors de la fonction pour qu'elle soit globale
    
    $(document).on("click", ".tpl-play-btn", function () {
      let audioElement = new Audio($(this).val());
    
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

