// uniform vec2 uResolution;
// uniform float uTime;
// uniform float uAudioFrequency;
// uniform sampler2D iChannel0;

// varying vec2 vUv;
// varying float vPattern;

// float horizontalLine(vec2 p){
//     float linePosition = fract(uTime); 
//     float lineWidth = 0.03;
//     float line = smoothstep(linePosition, linePosition + lineWidth, p.y);

//     return line;
// }



// void main() {
//     vec3 color = vec3(1.0);
//     color = vec3(horizontalLine(vUv));


//     vec3 mainColor = vec3(0.1, 0.0, 0.0);
//     float angle = (sin(uAudioFrequency) + 1.0) * 180.0;
//     if (angle >= 60.0 && angle < 120.0) 
//         mainColor.r = 1.0 - ((angle - 60.0) / 60.0);
//     else if (angle >= 240.0 && angle < 300.0) 
//         mainColor.r = ((angle - 240.0) / 60.0);
//     else if (angle >= 120.0 && angle < 240.0) 
//         mainColor.r = 0.0;
//     else 
//         mainColor.r = 1.0;

//      if (angle >= 120.0 && angle < 180.0) 
//         mainColor.g = 1.0 - ((angle - 120.0) / 60.0);
//     else if (angle >= 300.0 && angle < 360.0) 
//         mainColor.g = ((angle - 300.0) / 60.0);
//     else if (angle >= 180.0 && angle < 300.0) 
//         mainColor.g = 0.0;
//     else 
//         mainColor.g = 1.0;

//     if (angle >= 180.0 && angle < 240.0) 
//         mainColor.b = 1.0 - ((angle - 180.0) / 60.0);
//     else if (angle >= 0.0 && angle < 60.0) 
//         mainColor.b = ((angle - 60.0) / 60.0);
//     else if (angle >= 240.0 && angle < 360.0) 
//         mainColor.b = 0.0;
//     else 
//         mainColor.b = 1.0;

//     gl_FragColor = vec4(mainColor,1.0);
// }
varying vec2 vUv;
varying vec3 vNormal;
uniform vec3 uLightPosition;
uniform float uAudioFrequency;      
uniform float uTime;
uniform float uWindowWidth;
uniform vec3 lightColor;

void main() {
    vec3 movingLightPosition = vec3(
        sin(uTime),
        cos(uTime),
        cos(uTime)
    );

    vec3 timeDependentColor = vec3(
        (sin(uTime) + 1.0) / 2.0, // Les valeurs varient entre 0 et 1
        (cos(uTime) + 1.0) / 2.0, // Les valeurs varient entre 0 et 1
        (sin(uTime + 3.14159 / 2.0) + 1.0) / 2.0 // Les valeurs varient entre 0 et 1
    );

    vec3 lightDirection = normalize(movingLightPosition - vec3(gl_FragCoord));
    float diff = max(dot(vNormal, lightDirection), 0.0);
    vec3 diffuse = diff * timeDependentColor; // Utilisez timeDependentColor ici

    vec3 color = diffuse * uAudioFrequency;

    gl_FragColor = vec4(color, 1.0);
}
// void main() {
//     // Calculez la nouvelle position de la lumière
//     vec3 rotatedLightPosition = vec3(
//         lightPosition.x * uTime ,
//         lightPosition.y * uTime,
//         lightPosition.z
//     );

//     vec3 lightDirection = normalize(rotatedLightPosition + vec3(uWindowWidth - gl_FragCoord.x, gl_FragCoord.y, gl_FragCoord.z));
//     float diff = max(dot(vNormal, lightDirection), 0.0);
//     vec3 diffuse = diff * vec3(1.0, 1.0, 1.0);

//     vec3 color = diffuse * uAudioFrequency;

//     gl_FragColor = vec4(color, 1.0);
// }