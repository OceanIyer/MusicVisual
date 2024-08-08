precision mediump float;

varying vec2 vTexCoord;

uniform sampler2D tex;
uniform float distortionAmount;
uniform vec2 resolution;

void main() {
    vec2 center = resolution / 2.0;
    vec2 uv = vTexCoord;
    vec2 dist = uv - center;
    float len = length(dist);
    float factor = 1.0 + distortionAmount * (len / max(resolution.x, resolution.y));

    vec2 distortedUV = center + dist * factor;
    gl_FragColor = texture2D(tex, distortedUV / resolution);
}
