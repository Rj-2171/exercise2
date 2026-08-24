/* classes */ 

// Color constructor
class Color {
    
        // Color constructor default opaque black
    constructor(r=0,g=0,b=0,a=255) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this.r = r; this.g = g; this.b = b; this.a = a; 
                return(this);
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method
    
        // Color add method
    add(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.add: non-color parameter";
            else {
                this.r += c.r; this.g += c.g; this.b += c.b; this.a += c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end color add
    
        // Color subtract method
    subtract(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.subtract: non-color parameter";
            else {
                this.r -= c.r; this.g -= c.g; this.b -= c.b; this.a -= c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end color subgtract
    
        // Color scale method
    scale(s) {
        try {
            if (typeof(s) !== "number")
                throw "scale factor not a number";
            else {
                this.r *= s; this.g *= s; this.b *= s; this.a *= s; 
                return(this);
            }
        } // end throw
        
        catch (e) {
            console.log(e);
        }
    } // end Color scale method
    
        // Color copy method
    copy(c) {
        try {
            if (!(c instanceof Color))
                throw "Color.copy: non-color parameter";
            else {
                this.r = c.r; this.g = c.g; this.b = c.b; this.a = c.a;
                return(this);
            }
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end Color copy method
    
        // Color clone method
    clone() {
        var newColor = new Color();
        newColor.copy(this);
        return(newColor);
    } // end Color clone method
    
        // Send color to console
    toConsole() {
        console.log(this.r +" "+ this.g +" "+ this.b +" "+ this.a);
    }  // end Color toConsole
    
} // end color class


/* utility functions */

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
        if ((typeof(x) !== "number") || (typeof(y) !== "number"))
            throw "drawpixel location not a number";
        else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
            throw "drawpixel location outside of image";
        else if (color instanceof Color) {
            var pixelindex = (y*imagedata.width + x) * 4;
            imagedata.data[pixelindex] = color.r;
            imagedata.data[pixelindex+1] = color.g;
            imagedata.data[pixelindex+2] = color.b;
            imagedata.data[pixelindex+3] = color.a;
        } else 
            throw "drawpixel color is not a Color";
    } // end try
    
    catch(e) {
        console.log(e);
    }
} // end drawPixel
    

/* main -- here is where execution begins after window load */

function main() {

    // Get the canvas, context, and image data
    var canvas = document.getElementById("viewport"); 
    var context = canvas.getContext("2d");
    var w = context.canvas.width; // as set in html
    var h = context.canvas.height;  // as set in html
    var imagedata = context.createImageData(w,h);
 
    // Define a triangle in 2D with a color at each corner
    // (a triangle only has 3 corners, so of cyan/magenta/yellow/pink
    // we keep cyan, magenta, and yellow -- pink doesn't fit anymore)
    var c0 = new Color(0,255,255,255);   // vertex 0 color: cyan
    var c1 = new Color(255,0,255,255);   // vertex 1 color: magenta
    var c2 = new Color(255,255,0,255);   // vertex 2 color: yellow
    var x0 = 125, y0 = 50;  // vertex 0 position: top
    var x1 = 50,  y1 = 150; // vertex 1 position: bottom left
    var x2 = 200, y2 = 150; // vertex 2 position: bottom right

    // bounding box of the triangle, clamped to the canvas
    var minX = Math.max(0, Math.floor(Math.min(x0,x1,x2)));
    var maxX = Math.min(w-1, Math.ceil(Math.max(x0,x1,x2)));
    var minY = Math.max(0, Math.floor(Math.min(y0,y1,y2)));
    var maxY = Math.min(h-1, Math.ceil(Math.max(y0,y1,y2)));

    // twice the signed area of the triangle, used to normalize barycentric weights
    var area = (x1-x0)*(y2-y0) - (x2-x0)*(y1-y0);

    // scan the bounding box and use barycentric coordinates both to test
    // whether a pixel lies inside the triangle and to interpolate its color
    for (var y=minY; y<=maxY; y++) {
        for (var x=minX; x<=maxX; x++) {
            var w0 = ((x1-x)*(y2-y) - (x2-x)*(y1-y)) / area; // weight for c0
            var w1 = ((x2-x)*(y0-y) - (x0-x)*(y2-y)) / area; // weight for c1
            var w2 = 1 - w0 - w1;                            // weight for c2

            if ((w0>=0) && (w1>=0) && (w2>=0)) { // inside the triangle
                var pc = c0.clone().scale(w0);
                pc.add(c1.clone().scale(w1));
                pc.add(c2.clone().scale(w2));
                drawPixel(imagedata,x,y,pc);
            }
        } // end horizontal
    } // end vertical
    
    context.putImageData(imagedata, 0, 0); // display the image in the context
}
