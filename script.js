var cells = []
const xs = 50;
const ys = 50;
const size = 10;
var frontier = [];
let endCell;
var show;
var mazeSize = 40;

function setup() {
  createCanvas(500, 500);
  for (i = 0; i < mazeSize-1; i++){
    var row = [];
    for (j = 0; j < mazeSize-1; j++){
      row.push(new Cell(i,j));
    }
    cells.push(row);
  }
  const start = Math.floor(random(0,cells.length));
  cells[0][start].used= true;
  frontier.push([0, start]);
  
  while(frontier.length > 0){
    //select node
    const i = Math.floor(random(0,frontier.length));
    const x = frontier[i][0];
    const y = frontier[i][1];
    
    // select 1 of adjacent nodes if any
    var nodes = cells[x][y].neighbors() 
    if (nodes.length == 0){
      // constant time removal
      frontier[i] = frontier[frontier.length - 1]
      frontier.pop();
    }
    else{
      const t = Math.floor(random(0,nodes.length))
      const x2 = nodes[t][0];
      const y2 = nodes[t][1];
      cells[x2][y2].used= true;
      cells[x2][y2].prevNode = cells[x][y];
      cells[x][y].next.push(-1 * cells[x2][y2].BDP());
      frontier.push([x2, y2]);
    }
  }
  const end = Math.floor(random(0,cells.length));
  cells[cells.length-1][end].end = true;
  endCell = cells[cells.length-1][end];
  
  
  // buttons
  var button = createButton("New Random Maze");
  button.mousePressed(function(){
    history.go(0);
  });
  
  show = createButton("Show Path");
  show.mousePressed(function(){
    b = endCell;
    if (show.html() == "Show Path"){
      while(b != null){
        b.selected = true;
        b = b.prevNode;
      }
      show.html("Hide Path");
    }else{
      while(b != null){
        b.selected = false;
        b = b.prevNode;
      }
      show.html("Show Path");
    }
  })
}

function draw() {
  background(200);
  for (i = 0; i < mazeSize-1; i++){
    for (j = 0; j < mazeSize-1; j++){
      cells[i][j].show();
    }
  }
}

class Cell{
  constructor(x,y){
    this.x = x;
    this.y = y;
    this.prevNode = null;
    this.used = false;
    this.next = [];
    this.end = false;
    this.selected = false;
  }
  // N=1, S=-1, W=-2, E=2
  BDP(){
    if (this.prevNode == null){
      return -2;
    }
    if (this.prevNode.y == this.y){
      if (this.prevNode.x < this.x){
        return -2;
      }
      return 2;
    }
    else{
      if (this.prevNode.y < this.y){
        return 1;
      }
      return -1;
    }
  }
  show(){
    strokeWeight(3)
    fill("black")
    var bdp = this.BDP();
    if (bdp != 1 && ! this.next.includes(1)){
      line(this.x * size + xs, this.y * size + ys, (this.x+1)*size + xs, this.y*size + ys)
    }
    if (bdp != -1 && ! this.next.includes(-1)){
      line(this.x * size + xs, (this.y+1) * size + ys, (this.x+1)*size + xs, (this.y+1) *size + ys)
    }
    if (bdp != -2 && ! this.next.includes(-2)){
      line(this.x * size + xs, this.y * size + ys, this.x*size + xs, (this.y+1)*size + ys)
    }
    if (bdp != 2 && ! this.next.includes(2) && !this.end){
      line((this.x+1) * size + xs, this.y * size + ys, (this.x+1)*size + xs, (this.y+1)*size + ys)
    }
    if (this.selected){
      fill("lightblue")
      strokeWeight(0);
      rect((this.x + 0.1) * size + xs, this.y * size + ys + 1, size * 0.8 );
    }
    
  }

  neighbors(){
    var n = []
    //N, E, W, S
    if (validNeighbor(this.x, this.y-1)){
      n.push([this.x, this.y-1])
    }
    if (validNeighbor(this.x+1, this.y)){
      n.push([this.x+1, this.y])
    }
    if (validNeighbor(this.x-1, this.y)){
      n.push([this.x-1, this.y])
    }
    if (validNeighbor(this.x, this.y+1)){
      n.push([this.x, this.y+1])
    }
    return n
  }
  
}

function validNeighbor(x,y){
  if (x >= 0 && x < cells.length){
    if (y >= 0 && y < cells.length){
      if (cells[x][y].used){
        return false;
      }
      return true;
    }
    return false;
  }
  return false;
}
