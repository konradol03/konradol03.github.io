let map = L.map('map').setView([53.430127, 14.564802], 18);
L.tileLayer.provider('Esri.WorldImagery').addTo(map);
let puzzleSolved = false;
document.getElementById("getLocation").addEventListener("click", function(event) {
  if (! navigator.geolocation) {
    console.log("No geolocation.");
  }
  navigator.geolocation.getCurrentPosition(position => {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let marker = L.marker([lat, lon]).addTo(map);
    marker.bindPopup("Twoja lokalizacja");
    document.getElementById("latitude").innerText = lat;
    document.getElementById("longitude").innerText = lon;
    map.setView([lat, lon]);
  }, positionError => {
    console.error(positionError);
    alert("Błąd przy pobieraniu pozycji, sprawdź ustawienia")
  });
});

document.getElementById("saveButton").addEventListener("click", function() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
  }
  leafletImage(map, function (err, canvas) {
    let puzzlePatern = document.getElementById("puzzlePattern")
    puzzlePatern.width = canvas.width;
    puzzlePatern.height = canvas.height;
    let patternContext = puzzlePatern.getContext("2d")
    patternContext.drawImage(canvas, 0,0)
    createPuzzleBoard();
    generatePuzzles(puzzlePatern);
    dragAndDrop();
  });
});

function createPuzzleBoard() {
  let puzzleBoard = document.getElementById("puzzleBoard");
  puzzleBoard.innerHTML="";
  for (let i = 0; i < 16; i++) {
    let slot = document.createElement("div");
    slot.className = "drag-target";
    slot.dataset.index = i;
    puzzleBoard.appendChild(slot);
  }
}
function generatePuzzles(image) {
  let puzzlePieces = document.getElementById("puzzlePieces");
  puzzlePieces.innerHTML="";
  let puzzleHeight = image.height/4;
  let puzzleWidth = image.width/4;
  let puzzles = []
  for (let row =0;row<4;row++){
    for(let column =0; column<4;column++){
      let puzzle = document.createElement("canvas");
      puzzle.width = puzzleWidth;
      puzzle.height=puzzleHeight;
      let puzzleContext = puzzle.getContext("2d");
      puzzleContext.drawImage(image, column*puzzleWidth, row*puzzleHeight, puzzleWidth, puzzleHeight,0,0,puzzleWidth,puzzleHeight)
      puzzle.id = row * 4 + column;
      puzzle.dataset.index = row * 4 + column;
      puzzle.className = "item";
      puzzle.draggable = true;
      puzzles.push(puzzle);
    }
  }
  for (let i = 15; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [puzzles[i], puzzles[j]] = [puzzles[j], puzzles[i]];
  }
  for (let puzzle of puzzles) {
    puzzlePieces.appendChild(puzzle);
  }
}
function dragAndDrop() {
  let items = document.querySelectorAll(".item");
  for(let item of items){
    item.addEventListener("dragstart", function (event) {
      this.style.opacity = 0.5;
      event.dataTransfer.setData("text",this.id);
    });
    item.addEventListener("dragover", function (event){
      this.style.opacity=1;
    })
  }
  let targets = document.querySelectorAll(".drag-target");
  for (let target of targets) {
    target.addEventListener("dragover", function(event) {
      event.preventDefault();
    });
    target.addEventListener("drop", function(event) {
      event.preventDefault();
      let puzzleId = event.dataTransfer.getData("text");
      let puzzle = document.getElementById(puzzleId);
      if (puzzle && this.children.length === 0) {
        this.appendChild(puzzle);
        checkWin();
      }
    });
  }
  let puzzlePieces = document.getElementById("puzzlePieces");
  puzzlePieces.addEventListener("dragover", function(event) {
    event.preventDefault();
  });
  puzzlePieces.addEventListener("drop", function(event) {
    event.preventDefault();
    let puzzleId = event.dataTransfer.getData("text");
    let puzzle = document.getElementById(puzzleId);
    if (puzzle) {
      this.appendChild(puzzle);
    }
  });
}
function checkWin() {
  let targets = document.querySelectorAll(".drag-target");
  for (let target of targets) {
    let puzzle = target.querySelector(".item");
    if (!puzzle || puzzle.dataset.index !== target.dataset.index) {
      return;
    }
  }
  if (!puzzleSolved) {
    puzzleSolved = true;
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification("Puzle", {
          body: "Puzle zostały poprawnie ułożone"
        });
        console.debug("Puzle zostały poprawnie ułożone")
      } catch (error) {
        console.error(error);
      }
    }
  }
}
