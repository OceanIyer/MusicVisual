function Squares(){
    //Vis name
    this.name = "squares"
    //Fourier Transform
    this.fourier = new p5.FFT();
    //Rotation speed of squares
    this.rot = 0

    this.draw = function(){
        noStroke();

        //Use the fourier transform to get the bass
        this.fourier.analyze();
        var b = this.fourier.getEnergy("bass");

        this.rotatingBlocks(b)
    };
    

    this.rotatingBlocks = function(energy){
        //Rotate the blocks if the bass is above
        //a certain level
        if(energy < 200){
            this.rot += 0.01
        };

        var r = map(energy, 0, 255, 20, 100);

        push();
        rectMode(CENTER);
        translate(width/2, height/2);
        rotate(this.rot);
        fill(255, 0, 0);

        var cols = 10;
        var rows = 10;
        var incrX = width / (cols - 1);
        var incrY = height / (rows - 1);

        for(var i = 0; i < cols; i++){
            for(var j = 0; j < rows; j++){
                var red = random(255)//map(energy, 0, 255, 0, 255);
                var green = random(0)//map(energy, 0, 255, 255, 0);
                var blue = random(255)//map(energy, 0, 255, 0, 255);
                fill(red, green, blue);

                push();
                translate(i * incrX - width / 2, j * incrY - height / 2);
                rect(0, 0, r, r);
                pop();
            }
        }
        
        pop()
    };
};