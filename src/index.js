import '@/styles/index.scss';
//import '@/styles/style.css';
import startVisualizer from './app';
import startAccueilSpotify from './spotify'
import { initEngine } from './render/init';

(async () => {
    await initEngine()
    const urlParams = new URLSearchParams(window.location.search);
    const audioUrl = urlParams.get('audio');

    if (window.location.pathname === '/visualizer.html' && audioUrl) {
        startVisualizer(audioUrl)
    } else {
        startAccueilSpotify()
    }
})()