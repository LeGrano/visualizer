import '@/styles/index.scss';
import startVisualizer from './app';
import startAccueilSpotify from './spotify'
import { initEngine } from './render/init';

(async () => {
    await initEngine()
    if (window.location.pathname === 'visualizer') {
        console.log("t'es sur visu")
        startVisualizer()
    } else {
        startAccueilSpotify()
    }
    
})()