const iconSize = 16; // no. of 'pixels' per icon edge
const iconCount = 6; // no. of icons per canvas edge
const scaleFactor = 8; // make everything bigger

function setup() {
  createCanvas(
    iconSize * scaleFactor * iconCount,
    iconSize * scaleFactor * iconCount
  );
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
      noStroke();
      rect(
        iconX + i * scaleFactor,
        iconY + j * scaleFactor,
        16 * scaleFactor,
        16 * scaleFactor
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
