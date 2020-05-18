let _paused = false;

let grid;
let cols, rows;

let RESOLUTION = 10;

let generation = 0;
let genDisplay;

function setup() {
    //generation display
    genDisplay = createP(0);

    if(typeof getURLParams().resolution == 'string' && getURLParams().resolution < 100){ RESOLUTION = getURLParams().resolution; }

    createCanvas(1000, 600);
    cols = width / RESOLUTION;
    rows = height / RESOLUTION;

    grid = new Grid(cols, rows);
    grid.loop((c, r)=>{
        grid.grid[c][r] = floor(random(2));
    })
    console.table(grid.grid)
}

function draw() {
    
    background(0);
    //frameRate(1);
    grid.loop((c, r)=>{
        let x = c * RESOLUTION;
        let y = r * RESOLUTION;

        if(grid.grid[c][r]){
            fill(255);
            stroke(0)
            rect(x, y, RESOLUTION-1, RESOLUTION-1)
        }
    })


    //calculate the next generation
    if(!_paused){
        let nexGen = new Grid(cols, rows);
        grid.loop((c, r)=>{
            let state = grid.grid[c][r];
            //count live neighbors
            let neighbors = countNeighbors(grid, c, r);
            //check new sate
            if(state == 0 && neighbors == 3){
                nexGen.grid[c][r] = 1;
            }else if (state == 1 && (neighbors < 2 || neighbors > 3)){
                nexGen.grid[c][r] = 0;
            }else{
                nexGen.grid[c][r] = state;
            }
        })
        // compute next generation based on grid
        grid.grid = nexGen.grid;
    
        //update generation
        generation++;
        genDisplay.html("Generation: "+generation);
    }
}

function countNeighbors(grid = new Grid(), x = 0, y = 0){
    let sum = 0;
    for (let i = -1; i < 2; i++){
        for (let j = -1; j < 2; j++){
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            //sum += grid.grid[x + i][y + i]
            sum += grid.grid[col][row]
        }
    }
    //subtract the cell we are checking for
    sum -= grid.grid[x][y];
    return sum;
}
//#region player interactions
function mousePressed(){drawing();}
function mouseDragged(){drawing();}

function drawing(){
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
          grid.cellClicked(i, j);
      }
  }
}
function keyPressed() {
    if (keyCode === ENTER) {
      if(_paused){
        console.log('Un paused')
          _paused = false;
      }else{
        console.log('Paused')
        _paused = true;
      }
    }
  }

class Grid{
    constructor(cols, rows){
        this.cols = cols, this.rows = rows;
        let arr = new Array(cols);
        for(let i=0; i < arr.length; i++){
            arr[i] = new Array(rows);
        }
        this.grid = arr;
    }
    loop(callback = (col, row)=>{}){
        for(let c = 0; c < cols; c++){
            for(let r = 0; r < rows; r++){
                if(typeof callback != "function") return console.error("Callback is not a function!");
                callback(c, r);
            }
        }
    }
    cellClicked(column, row){
      var d = dist(mouseX / RESOLUTION, mouseY / RESOLUTION, column, row);
      if(d < 1){
            this.grid[column][row] = 1;
        }
    }
}