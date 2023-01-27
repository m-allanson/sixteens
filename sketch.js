let resetButton;
let saveButton;

let iconSize = 16; // no. of 'pixels' per icon edge
let iconCount = 6; // no. of icons per canvas edge
let scaleFactor = 8; // make everything bigger

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isNum = (value) => Number(value) === value && value > 0; // Works because NaN is not equal to NaN.

function setup() {
  let queryParams = new URLSearchParams(window.location.search);

  let qpIconSize = Number(queryParams?.get("iconSize"));
  let qpIconCount = Number(queryParams?.get("iconCount"));
  let qpScaleFactor = Number(queryParams?.get("scaleFactor"));

  iconSize = isNum(qpIconSize) ? qpIconSize : iconSize;
  iconCount = isNum(qpIconCount) ? qpIconCount : iconCount;
  scaleFactor = isNum(qpScaleFactor) ? qpScaleFactor : scaleFactor;

  createCanvas(
    iconSize * scaleFactor * iconCount,
    iconSize * scaleFactor * iconCount
  );
  
  noStroke();

  resetButton = createButton("Refresh (Space key)");
  resetButton.mousePressed(draw);
  resetButton.parent("buttons");

  saveButton = createButton("Download (Enter key)");
  saveButton.mousePressed(downloadTheseSquares);
  saveButton.parent("buttons");

  console.log(
    `?iconSize=${iconSize}&iconCount=${iconCount}&scaleFactor=${scaleFactor}`
  );
  console.log("Space to refresh, Enter to save all");

}

function drawIcon(iconX, iconY) {
  const colours = [
    [random(255), random(255), random(255)],
    [random(255), random(255), random(255)],
    [0, 0, 0],
    [0, 0, 0],
  ];

  let choices = [];
  let halfway = iconSize / 2;

  for (let i = 0; i < iconSize; i++) {
    let row = [];
    for (let j = 0; j < iconSize; j++) {
      if (j < halfway) {
        row.push(int(random(colours.length - 1)));
      } else {
        const offset = j - halfway;
        row.push(row[halfway - offset - 1]);
      }
    }

    choices.push(...row);
  }

  for (let i = 0; i < iconSize; i++) {
    for (let j = 0; j < iconSize; j++) {
      const colour = colours[choices[i + j]];
      fill(colour);
      rect(
        iconX + i * scaleFactor,
        iconY + j * scaleFactor,
        iconSize * scaleFactor,
        iconSize * scaleFactor
      );
    }
  }
}

function draw() {
  for (let i = 0; i < iconCount; i++) {
    for (let j = 0; j < iconCount; j++) {
      drawIcon(i * iconSize * scaleFactor, j * iconSize * scaleFactor);
    }
  }

  noLoop();
}

function keyPressed() {
  if (keyCode === 13) {
    downloadTheseSquares();
  } else if (keyCode === 32) {
    draw();
  }
}

async function downloadTheseSquares() {
  if (window.confirm(`Download ${iconCount * iconCount} icons?`)) {
    let images = [];
    for (let i = 0; i < iconCount; i++) {
      for (let j = 0; j < iconCount; j++) {
        let c = get(
          i * iconSize * scaleFactor,
          j * iconSize * scaleFactor,
          iconSize * scaleFactor,
          iconSize * scaleFactor
        );
        images.push(c);
      }
    }

    for (let k = 0; k < images.length; k++) {
      await sleep(100);
      images[k].save(`icon0${k}`, "png");
    }
  }
}
