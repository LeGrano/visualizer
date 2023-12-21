varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;
uniform float uAudioFrequency;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);

    float displacement = uAudioFrequency * 0.5;
    vec3 newPosition = position + normal * displacement;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}