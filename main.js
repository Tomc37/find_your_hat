const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldCharacter = "░";
const pathCharacter = "*";

class Field {
  constructor(map) {
    this._map = map;
  }
  get map() {
    return this._map;
  }
  print() {
    for (let i = 0; i < this._map.length; i++) {
      let mapRow = this._map[i].join("");
      console.log(mapRow);
    }
  }
  playGame() {
    this.print();
    let gameWon = false;
    const getPathCharacterLoc = () => {
      // Return starting position of character. Important if starting position to be randomised.
      let currentPathCharacterLoc = [];
      for (let i = 0; i < this._map.length; i++) {
        if (this._map[i].findIndex((obj) => obj === pathCharacter) != -1) {
          currentPathCharacterLoc.push(i);
          currentPathCharacterLoc.push(
            this._map[i].findIndex((obj) => obj === pathCharacter)
          );
        }
      }
      return currentPathCharacterLoc;
    };
    let currentPathCharacterLoc = getPathCharacterLoc(); // Fix starting position location.
    while (gameWon === false) {
      let vertIndexPathCharacterLoc = currentPathCharacterLoc[0];
      let horiIndexPathCharacterLoc = currentPathCharacterLoc[1];
      let way = prompt("Which way? ");
      if (way === "u" || way === "U") {
        // All directions similar, changing indexes by +/- 1
        vertIndexPathCharacterLoc -= 1;
        currentPathCharacterLoc = [];
        currentPathCharacterLoc.push(vertIndexPathCharacterLoc); // vert or hori index changed depending on direction.
        currentPathCharacterLoc.push(horiIndexPathCharacterLoc); // new indexes pushed to character location
        if (vertIndexPathCharacterLoc < 0) {
          console.log("Out of bounds. Game ended. Please retry.");
          process.exit(1); // Lose
        } else if (
          this._map[currentPathCharacterLoc[0]][currentPathCharacterLoc[1]] ===
          hole
        ) {
          console.log("You fell down a hole! Please retry.");
          process.exit(1); // Lose
        } else if (
          this._map[currentPathCharacterLoc[0]][currentPathCharacterLoc[1]] ===
          hat
        ) {
          console.log("Congrats, you found the hat!");
          process.exit(1); // Win
        }
        this._map[currentPathCharacterLoc[0]][currentPathCharacterLoc[1]] = // New character location defined after losing/winning checks
          pathCharacter; // Here we could also change previous paths by using new variable fixing old location and changing that to another character
        this.print(); // Print current state of map
      }
      if (way === "d" || way === "D") {
        vertIndexPathCharacterLoc += 1;
        currentPathCharacterLoc = [];
        currentPathCharacterLoc.push(vertIndexPathCharacterLoc);
        currentPathCharacterLoc.push(horiIndexPathCharacterLoc);
        if (vertIndexPathCharacterLoc > this._map.length - 1) {
          console.log("Out of bounds. Game ended. Please retry.");
          process.exit(1);
        } else if (
          this._map[currentPathCharacterLoc[0]][currentPathCharacterLoc[1]] ===
          hole
        ) {
          console.log("You fell down a hole! Please retry.");
          process.exit(1);
        } else if (
          this._map[currentPathCharacterLoc[0]][currentPathCharacterLoc[1]] ===
          hat
        ) {
          console.log("Congrats, you found the hat!");
          process.exit(1);
        }
        this._map[currentPathCharacterLoc[0]][currentPathCharacterLoc[1]] =
          pathCharacter;
        this.print();
      }
      if (way === "r" || way === "R") {
        horiIndexPathCharacterLoc += 1;
        currentPathCharacterLoc = [];
        currentPathCharacterLoc.push(vertIndexPathCharacterLoc);
        currentPathCharacterLoc.push(horiIndexPathCharacterLoc);
        if (horiIndexPathCharacterLoc > this._map[0].length - 1) {
          console.log("Out of bounds. Game ended. Please retry.");
          process.exit(1);
        } else if (
          this._map[currentPathCharacterLoc[0]][currentPathCharacterLoc[1]] ===
          hole
        ) {
          console.log("You fell down a hole! Please retry.");
          process.exit(1);
        } else if (
          this._map[currentPathCharacterLoc[0]][currentPathCharacterLoc[1]] ===
          hat
        ) {
          console.log("Congrats, you found the hat!");
          process.exit(1);
        }
        this._map[currentPathCharacterLoc[0]][currentPathCharacterLoc[1]] =
          pathCharacter;
        this.print();
      }
      if (way === "l" || way === "L") {
        horiIndexPathCharacterLoc -= 1;
        currentPathCharacterLoc = [];
        currentPathCharacterLoc.push(vertIndexPathCharacterLoc);
        currentPathCharacterLoc.push(horiIndexPathCharacterLoc);
        if (horiIndexPathCharacterLoc < 0) {
          console.log("Out of bounds. Game ended. Please retry.");
          process.exit(1);
        } else if (
          this._map[currentPathCharacterLoc[0]][currentPathCharacterLoc[1]] ===
          hole
        ) {
          console.log("You fell down a hole! Please retry.");
          process.exit(1);
        } else if (
          this._map[currentPathCharacterLoc[0]][currentPathCharacterLoc[1]] ===
          hat
        ) {
          console.log("Congrats, you found the hat!");
          process.exit(1);
        }
        this._map[currentPathCharacterLoc[0]][currentPathCharacterLoc[1]] =
          pathCharacter;
        this.print();
      }
    }
  }
  generateField(x, y, percentage) {
    const getMapRow = () => {
      let mapRow = [];
      for (let i = 0; i < x; i++) {
        mapRow.push(fieldCharacter);
      }
      return mapRow; // Returns a single row of fields of x length
    };
    const getMap = () => {
      let map = [];
      for (let j = 0; j < y; j++) {
        map.push(getMapRow());
      }
      return map; // Generates y number of rows of fields defined in getMapRow
    };
    const map = getMap(); // Creates the map array
    map[0][0] = pathCharacter;
    const getRandomGridPos = () => {
      // Random grid position retriever for hat and hole placements.
      let randomGridPos = [];
      let randomY = Math.floor(Math.random() * y);
      let randomX = Math.floor(Math.random() * x);
      randomGridPos.push(randomY);
      randomGridPos.push(Math.floor(Math.random() * x));
      return randomGridPos;
    };
    const countOccurrences = (arr, val) =>
      arr.reduce((a, v) => (v === val ? a + 1 : a), 0); // Simple count function to count occurences.
    const countMapOccurences = (object) => {
      // Function to loop through map rows to count occurences of supplied object i.e. hole, hat
      let Occurences = 0; // Needed because map array is a nested array.
      for (let i = 0; i < y; i++) {
        Occurences += countOccurrences(map[i], object);
      }
      return Occurences;
    };
    while (countMapOccurences(hat) < 1) {
      // Loop through randomGridPos values and place hat in unoccupied position while hat doesn't exist.
      const hatPos = getRandomGridPos();
      if (map[hatPos[0]][hatPos[1]] === pathCharacter) {
        continue;
      } else {
        map[hatPos[0]][hatPos[1]] = hat;
      }
    }
    let targetHoleCount = Math.floor(x * y * (percentage / 100)); // Set amount of holes based percentage supplied in generateField
    while (countMapOccurences(hole) < targetHoleCount) {
      // Loop through randomGridPos values and place holes in unoccupied positions while number of holes in map < targetHoleCount
      const holePos = getRandomGridPos();
      if (
        map[holePos[0]][holePos[1]] === hat ||
        map[holePos[0]][holePos[1]] === pathCharacter
      ) {
        continue;
      } else {
        map[holePos[0]][holePos[1]] = hole;
      }
    }
    return map;
  }
}

const fieldOne = new Field([]);
const randomMap = fieldOne.generateField(15, 15, 30);
const fieldTwo = new Field(randomMap);
fieldTwo.playGame();
