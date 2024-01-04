precision highp float; // Précision des nombres flottants

// Les coordonnées de texture et la valeur de motif (pattern) ainsi que les unfiorms
varying vec2 vUv;
varying float vPattern;
uniform float uTime;
uniform float uAudioFrequency;
uniform float aiguUniform;
uniform float midUniform;
uniform float graveUniform;

// Structure de données pour représenter un point sur la rampe de couleur
struct ColorStop {
    vec3 color;
    float position;
};

// Macro pour calculer la couleur en fonction de la position sur la rampe à la manière de blender
//La macro COLOR_RAMP prend trois arguments :
// colors : un tableau de structures ColorStop, qui définissent les couleurs et les positions sur la rampe de couleur.
// factor : un nombre flottant entre 0.0 et 1.0 qui représente la position sur la rampe de couleur pour laquelle vous voulez calculer une couleur.
// finalColor : une variable dans laquelle la couleur calculée sera stockée.
// La macro parcourt le tableau colors, trouve les deux ColorStop entre lesquels se trouve le factor, puis interpole entre leurs couleurs pour obtenir la couleur finale.

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


// Ce fragment permet de faire varié la couleur (du blanc au rouge) selon la fréquence audio et la position du pattern

void main() {
    
    vec3 color;
    vec3 mainColor = vec3(0.1, 0.0, 0.0);
    float time = uTime;

    float angle = (sin(uAudioFrequency) + 1.0) * 180.0;
    
    if(angle >= 60.0 && angle < 120.0) mainColor.r = 1.0 - ((angle - 60.0) / 60.0);
    else if(angle >= 240.0 && angle < 300.0) mainColor.r = ((angle - 240.0) / 60.0);
    else if(angle >= 120.0 && angle < 240.0) mainColor.r = 0.0;
    else mainColor.r = 1.0;

    ColorStop colors[2] = ColorStop[](
        ColorStop(vec3(1), 0.0),
        ColorStop(mainColor, 1.0)
    );

    // Utilisation de la macro COLOR_RAMP pour obtenir la couleur en fonction du motif (pattern)
    COLOR_RAMP(colors, vPattern , color);
    gl_FragColor = vec4(color, 1.0);


 //Tentative d'utilsé le tableau dans le shader pour visualiser le tout avec une couleur mais rendu bof

    // float aigu = aiguUniform;
    // float mid = midUniform;
    // float grave = graveUniform;

    // vec3 color = vec3(aigu, mid, grave);

    // gl_FragColor = vec4(color, 1.0);
}


