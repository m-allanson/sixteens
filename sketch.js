let resetButton;
let saveButton;

let iconSize = 16; // no. of 'pixels' per icon edge
let iconCount = 6; // no. of icons per canvas edge
let scaleFactor = 8; // make everything bigger (or smaller)

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const isNum = (value) => Number(value) === value && value > 0; // Works because NaN is not equal to NaN.

const strategies = {
  // noop: (r) => r,
  rotateLeft: (r) => {
    r.push(r.shift());
    return r;
  },
  rotateRight: (r) => {
    r.unshift(r.pop());
    return r;
  },
  mirror: (r) => {
    const ends = [r.shift(), r.pop()];
    r.splice(r.length / 2, 0, ...ends);
    return r;
  },
  mirrorInverse: (r) => {
    const middle = r.splice(r.length / 2 - 2, 4);
    r.unshift(middle[2]);
    r.unshift(middle[3]);
    r.push(middle[0]);
    r.push(middle[1]);
    return r;
  },
  mirrorMore: (r) => {
    const bigEnds = [
      r.shift(),
      r.shift(),
      r.shift(),
      r.pop(),
      r.pop(),
      r.pop(),
    ];
    r.splice(r.length / 2, 0, ...bigEnds);
    return r;
  },
  marching: (r) => {
    let step = 0;
    for (let i = 0; i < r.length; i++) {
      step += r.length / 4;
      if (step >= r.length) step = 0;
      let [a, b] = [r[i], r[step]];
      r[i] = b;
      r[step] = a;
    }
    return r;
  },
};

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
  console.log(
    "View source or check the repo at https://github.com/m-allanson/sixteens"
  );
}

function drawIcon(iconX, iconY) {
  const availableStrategies = Object.keys(strategies);
  const picked = int(random(availableStrategies.length));
  const strategy = strategies[availableStrategies[picked]];
  let strategyRepeat = int(random(1, 3));

  // console.log(
  //   "USING: ",
  //   availableStrategies[picked],
  //   "with REPEATS: ",
  //   strategyRepeat
  // );

  let row = [];

  const cm = new ColorMaker({});
  cm.newPalette(int(random(3, 6))); // Use a variable quantity of colours
  const colours = cm.palette;

  // Fill the row with random colours
  for (let i = 0; i < iconSize; i++) {
    row.push(int(random(colours.length)));
  }

  let nextRow = [...row];

  for (let i = 0; i < iconSize; i++) {
    // Modify the row each time for interesting patterns
    for (let repeat = 0; repeat < strategyRepeat; repeat++) {
      nextRow = strategy(nextRow);
    }

    // Draw the row
    for (let j = 0; j < iconSize; j++) {
      cm.fill(colours[nextRow[j]]);
      rect(
        iconX + j * scaleFactor,
        iconY + i * scaleFactor,
        iconSize / 2,
        iconSize / 2
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
