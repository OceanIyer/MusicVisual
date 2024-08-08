attribute vec3 aPosition;
attribute vec2 aTexCoord;

varying vec2 vTexCoord;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {
    vTexCoord = aTexCoord;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(aPosition, 1.0);
}
