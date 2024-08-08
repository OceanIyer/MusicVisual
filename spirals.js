function Spirals(){
    this.fourier = new p5.FFT();
    this.graph = [];

    this.draw = function(){
        push()
        stroke(255)
        strokeWeight(2)
        noFill()

        this.fourier.analyze();
        var bass = this.fourier.getEnergy("mid")
        this.graph.push(bass);

        var colors = [
            color(138, 43, 226),
            color(0, 0, 255),
            color(255, 105, 180),
            color(255, 165, 0)
        ]

        // Calculate the current color based on frame count
        let t = (frameCount % (colors.length * 60)) / (colors.length * 60); // Change color every 60 frames (1 second at 60 fps)
        let colorIndex = floor(t * colors.length);
        let nextColorIndex = (colorIndex + 1) % colors.length;
        let blendFactor = (t * colors.length) - colorIndex;
        let currentColor = lerpColor(colors[colorIndex], colors[nextColorIndex], blendFactor);

        beginShape()
        stroke(currentColor)
        for(var i = 0; i < this.graph.length; i++){
            var y = map(this.graph[i], 0, 255, height/2, 0)
            vertex(i, y)
        }
        endShape();

        if(this.graph.length > width - 50){
            this.graph.splice(0, 1)
        }
        stroke(255, 0, 0);
        line(this.graph.length, 0, this.graph.length, height)
        pop()
    }

};