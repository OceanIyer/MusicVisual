function Video() {
    this.name = "Video";
    this.fourier = new p5.FFT();
    this.angleX = 0;
    this.angleY = 0;
    this.prevMouseX = mouseX;
    this.prevMouseY = mouseY;
    this.zoom = 500;
    this.musicStarted = false;
    this.progression = 0;
    this.gridSize = 35; // Grid size
    this.radius = min(width, height) / 3; // Sphere radius
    this.deformation = []; // To store deformation amounts

    this.draw = function() {
        background(255);
        video.loadPixels();

        // Analyze the sound to get the bass energy
        this.fourier.analyze();
        var bass = this.fourier.getEnergy("bass");

        // Check if the music has started or paused based on bass energy
        if (bass > 50) { // Assume music is playing if bass is above a certain threshold
            this.musicStarted = true;
        } else {
            this.musicStarted = false;
            this.progression = max(this.progression - 2, 0); // Gradually revert to the initial state
        }

        // Update rotation angles only if the middle mouse button is pressed
        if (mouseIsPressed && mouseButton === CENTER) {
            var deltaX = mouseX - this.prevMouseX;
            var deltaY = mouseY - this.prevMouseY;
            this.angleX += deltaY * 0.01;
            this.angleY += deltaX * 0.01;
        }

        this.prevMouseX = mouseX;
        this.prevMouseY = mouseY;

        // Center, zoom, and rotate the sphere
        translate(width / 2, height / 2);
        scale(this.zoom / 500); // Zoom in/out based on mouse wheel
        rotateX(this.angleX);
        rotateY(this.angleY);

        var deformationIndex = 0;

        for (var y = 0; y < height; y += this.gridSize) {
            for (var x = 0; x < width; x += this.gridSize) {
                var index = (y * video.width + x) * 4;

                if (index >= 0 && index + 3 < video.pixels.length) {
                    var r = video.pixels[index];
                    var g = video.pixels[index + 1];
                    var b = video.pixels[index + 2];
                    var colour = color(r, g, b);

                    // Initial grid position
                    var gridX = x - width / 2;
                    var gridY = y - height / 2;
                    var gridZ = 0;

                    // Sphere position using spherical coordinates
                    var theta = map(x, 0, width, 0, TWO_PI);
                    var phi = map(y, 0, height, 0.1, PI - 0.1);
                    var sphereX = this.radius * sin(phi) * cos(theta);
                    var sphereY = this.radius * sin(phi) * sin(theta);
                    var sphereZ = this.radius * cos(phi);

                    // Progressively transition from grid to sphere
                    var t = map(this.progression, 0, 100, 0, 1);
                    var xPos = lerp(gridX, sphereX, t);
                    var yPos = lerp(gridY, sphereY, t);
                    var zPos = lerp(gridZ, sphereZ, t);

                    // Apply deformation to sphere positions based on bass
                    if (this.deformation.length <= deformationIndex) {
                        this.deformation.push(1); // Initialize deformation amount
                    }
                    var deformationAmount = map(bass, 0, 255, 1, 1.5); // Adjust deformation factor
                    this.deformation[deformationIndex] += random(-0.02, 0.02);
                    this.deformation[deformationIndex] = constrain(this.deformation[deformationIndex], 1, deformationAmount);

                    xPos *= this.deformation[deformationIndex];
                    yPos *= this.deformation[deformationIndex];
                    zPos *= this.deformation[deformationIndex];

                    var dia = map(r, 0, 255, this.gridSize, 2);
                    fill(colour);
                    noStroke();
                    push();
                    translate(xPos, yPos, zPos);
                    sphere(dia / 2);
                    pop();

                    deformationIndex++;
                }
            }
        }

        // Gradually increase progression if music has started
        if (this.musicStarted) {
            this.progression = min(this.progression + 0.5, 100);
        }
    }

    // Handle zoom with mouse wheel
    this.mouseWheel = function(event) {
        this.zoom += event.delta;
        this.zoom = constrain(this.zoom, 100, 1000); // Limit zoom range
    }
}

// Add the mouseWheel event to the sketch
function mouseWheel(event) {
    if (typeof videoInstance !== 'undefined') {
        videoInstance.mouseWheel(event);
    }
}
