import * as THREE from 'three'
import {useScene, useTick } from './render/init.js'
import vertexShader from './shaders/vertex.glsl'
import fragmentShader from './shaders/fragment.glsl'

import PATH from './sounds/candeur-dealer.mp3' //test locale

/**
 * Classe qui gère l'analyseur audio et l'envoie au shader et à la sphère.
 * Pour l'instantiliser il faut lui passer la sphère et le nom de l'uniform qui va recevoir la fréquence
 */
class Visualizer {
  constructor(mesh, frequencyUniformName) {
    this.mesh = mesh
    
    this.frequencyUniformName = frequencyUniformName
    this.aiguUniform = 'aiguUniform'
    this.midUniform = 'midUniform'
    this.graveUniform = 'graveUniform'

    this.mesh.material.uniforms[this.frequencyUniformName] = { value: 0 }
    this.mesh.material.uniforms[this.aiguUniform] = { value: 0 }
    this.mesh.material.uniforms[this.midUniform] = { value: 0 }
    this.mesh.material.uniforms[this.graveUniform] = { value: 0 }
 
    this.listener = new THREE.AudioListener()
    this.mesh.add(this.listener)
    this.sound = new THREE.Audio(this.listener)
    this.loader = new THREE.AudioLoader()

    this.analyser = new THREE.AudioAnalyser(this.sound, 32)
  }
/**
 * Initialise l'analyseur audio et charge le fichier audio.
 * @param {string} path - Le chemin vers le fichier audio ici ce sera le lien de l'API Spotify
 */
  load(path) {
    this.loader.load(path, (buffer) => {
      this.sound.setBuffer(buffer)
      this.sound.setLoop(true)
      this.sound.setVolume(0.5)
      this.sound.play()
    })
  }

  getFrequency() {
    return this.analyser.getAverageFrequency()
  }

 /**
  * Calcule les valeurs moyennes pour différentes plages de fréquences première partie du tableau en param
  * @param {number[]} dataArray - Le tableau de données de fréquence (issue du visualizer).
  * @returns {Object} - Retourne un objet avec les valeurs moyennes pour les aigus, les mid et les graves.
  */
  calculateAverage(dataArray) {
    const aigus = dataArray.slice(0, 5); // Les 32 premières valeurs correspondent aux aigus
    const mid = dataArray.slice(5, 10); // Les valeurs de 32 à 96 correspondent aux mid
    const graves = dataArray.slice(10, 15); // Les valeurs à partir de 96 correspondent aux graves

    const averageAigus = aigus.reduce((sum, value) => sum + value, 0) / aigus.length;
    const averageMid = mid.reduce((sum, value) => sum + value, 0) / mid.length;
    const averageGraves = graves.reduce((sum, value) => sum + value, 0) / graves.length;

    return {
      aigus: averageAigus/255,
      mid: averageMid/255,
      graves: averageGraves/255
    };
  }

  /**
   * Met à jour les valeurs de fréquence et les envoie au shader.
   */
  update() {
    const freq = Math.max(this.getFrequency() - 100, 0) / 50
    const freqToDisplay = Math.max(this.getFrequency(), 0)
    this.mesh.material.uniforms[this.frequencyUniformName].value = freq

    this.analyser.fftSize = 256
    const bufferLength = this.analyser.frequencyBinCount
    let dataArray = new Uint8Array(bufferLength)

    // Mettre à jour dataArray avec les données de fréquence.
    dataArray = this.analyser.getFrequencyData()
    const { aigus, mid, graves } = this.calculateAverage(dataArray)

    this.mesh.material.uniforms[this.aiguUniform].value = aigus
    this.mesh.material.uniforms[this.midUniform].value = mid
    this.mesh.material.uniforms[this.graveUniform].value = graves

    const freqElement = document.getElementById("freq")
    freqElement.textContent = freqToDisplay.toFixed(2) 
    
  }
  
  getDataArray() {
    const bufferLength = this.analyser.frequencyBinCount
    let dataArray = new Uint8Array(bufferLength)
    dataArray = this.analyser.getFrequencyData()
    return dataArray
  }
}

/**
 * Fonction générale qui initialise et lance le visualizer 3d.
 * @param {string} audioUrl - Le chemin vers le fichier audio ici ce sera le lien de l'API Spotify
 */
const startVisualizer = async(audioUrl) => {
  const scene = useScene()

  const ROTATION_SPEED = 0.02

  const dirLight = new THREE.DirectionalLight('#ffffff', 1)
  const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
  const light = new THREE.PointLight(0xffff00, 1, 1000)
  scene.add(dirLight, ambientLight, light)


  const geometry = new THREE.SphereGeometry(1, 100, 100)
  const material = new THREE.ShaderMaterial({
    vertexShader: '\n' + vertexShader,
    fragmentShader: '\n' + fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uLightPosition: {value: light.position},
      lightColor: { value: light.color},
    },
  })
  
  const ico = new THREE.Mesh(geometry, material)
  const visualizer = new Visualizer(ico, 'uAudioFrequency', 'uAudioFrequencyArray')

  visualizer.load(audioUrl)
  scene.add(ico)

  /**
   * Fonction qui anime la sphere en fonction de la fréquence.
   */
  const animateIco = () => {
    const dataArray = visualizer.getDataArray()
    const { aigus, mid, graves } = visualizer.calculateAverage(dataArray)
    const rotationSpeed = ROTATION_SPEED;
    graves > aigus ? rotationSpeed + (graves/100) : rotationSpeed - (aigus/10)
    ico.rotation.x += rotationSpeed * mid;
    ico.rotation.y += rotationSpeed
  }

  /**
   * `useTick` est une fonction qui permet d'effectuer une action à chaque frame. Cela permet d'alimenter les uniform pour le shader.
   */
  useTick(({ timestamp }) => {
    animateIco()
    material.uniforms.uTime.value = timestamp / 1000
    visualizer.update()
  })
}

export default startVisualizer
