import '@/styles/index.scss';
//import '@/styles/style.css';
import startVisualizer from './app';
import startAccueilSpotify from './spotify'
import { initEngine } from './render/init';

/**
 * Fichier js pour lancer l'application avec webpack.
 * Verifie si on est sur la page visualizer.html et si on a bien un audio dans l'url. Si non on lance la page d'accueil Spotify.
 */
(async () => {
   
    const urlParams = new URLSearchParams(window.location.search);
    const audioUrl = urlParams.get('audio');

    if (window.location.pathname === '/visualizer.html' && audioUrl) {
        await initEngine()
        startVisualizer(audioUrl)
    } else {
        startAccueilSpotify()
    }
})()