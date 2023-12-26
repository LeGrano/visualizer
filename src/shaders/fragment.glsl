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


// Créer une lumière qui tourne autour de la sphère

// varying vec2 vUv;
// varying vec3 vNormal;
// uniform vec3 uLightPosition;
// uniform float uAudioFrequency;      
// uniform float uTime;
// uniform float uWindowWidth;
// uniform vec3 lightColor;

// void main() {
//     vec3 movingLightPosition = vec3(
//         sin(uTime),
//         cos(uTime),
//         cos(uTime)
//     );

//     vec3 timeDependentColor = vec3(
//         (sin(uTime) + 1.0) / 2.0, // Les valeurs varient entre 0 et 1
//         (cos(uTime) + 1.0) / 2.0, // Les valeurs varient entre 0 et 1
//         (sin(uTime + 3.14159 / 2.0) + 1.0) / 2.0 // Les valeurs varient entre 0 et 1
//     );

//     vec3 lightDirection = normalize(movingLightPosition - vec3(gl_FragCoord));
//     float diff = max(dot(vNormal, lightDirection), 0.0);
//     vec3 diffuse = diff * timeDependentColor; // Utilisez timeDependentColor ici

//     vec3 color = diffuse * uAudioFrequency;

//     gl_FragColor = vec4(color, 1.0);
// }



precision highp float;

// Les coordonnées de texture et la valeur de motif (pattern)
varying vec2 vUv;
varying float vPattern;
uniform float uTime;
uniform float uAudioFrequency;
// Structure de données pour représenter un point sur la rampe de couleur
struct ColorStop {
    vec3 color;
    float position;
};

// Macro COLOR_RAMP basée sur le node ColorRamp de Blender
#define COLOR_RAMP(colors, factor, finalColor) { \
    int index = 0; \
    for(int i = 0; i < colors.length() - 1; i++){ \
       ColorStop currentColor = colors[i]; \
       bool isInBetween = currentColor.position <= factor; \
       index = int(mix(float(index), float(i), float(isInBetween))); \
    } \
    ColorStop currentColor = colors[index]; \
    ColorStop nextColor = colors[index + 1]; \
    float range = nextColor.position - currentColor.position; \
    float lerpFactor = (factor - currentColor.position) / range; \
    finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \
}

/*
#define getClr(angle, offset){
    if(angle >= 60 + offset && angle < 120) mainColor.r = 1.0 - ((v - 60) / 60);
    else if(angle >= 240 && angle < 300) mainColor.r = ((v - 240) / 60);
    else if(angle >= 120 && angle < 240) mainColor.r = 0;
    else mainColor.r = 1;
} 
*/

void main() {
    vec3 color;
    vec3 mainColor = vec3(0.1, 0.0, 0.0);
    float time = uTime;
    
    //mainColor.r *= 0.9 + sin(time) / 3.2;
    //mainColor.g *= 1.1 + cos(time / 2.0) / 2.5;
    //mainColor.b *= 0.8 + sin(time / 5.0) / 4.0;
    //mainColor.rgb += 0.1;
    float angle = (sin(uAudioFrequency) + 1.0) * 180.0;
    
    if(angle >= 60.0 && angle < 120.0) mainColor.r = 1.0 - ((angle - 60.0) / 60.0);
    else if(angle >= 240.0 && angle < 300.0) mainColor.r = ((angle - 240.0) / 60.0);
    else if(angle >= 120.0 && angle < 240.0) mainColor.r = 0.0;
    else mainColor.r = 1.0;

    ColorStop colors[2] = ColorStop[](
        ColorStop(vec3(1), 0.0),
        ColorStop(mainColor, 1.0)
        //ColorStop(vec3(1, 0, 0), 1.0)
        //ColorStop(vec3(1, 0, 0), 0.5),
        //ColorStop(mainColor, 1.0)
    );

    // Utilisation de la macro COLOR_RAMP pour obtenir la couleur en fonction du motif (pattern)
    COLOR_RAMP(colors, vPattern , color);
    //COLOR_RAMP(colors, 1.0 , color);

    // Utilisation de la couleur obtenue pour définir la couleur du fragment
    gl_FragColor = vec4(color, 1.0);
}


