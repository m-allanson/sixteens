const scaleFactor = 8;

function setup() {
  createCanvas(16 * scaleFactor, 16 * scaleFactor);
}

function draw() {
  const colours = [
    [random(255), random(255), random(255)],
    [random(255), random(255), random(255)],
    [0, 0, 0],
    [0, 0, 0],
  ];

  let choices = [];
  let halfway = 16 / 2;

  for (let i = 0; i < 16 * scaleFactor; i = i + scaleFactor) {
    let row = [];
    for (let j = 0; j < 16 * scaleFactor; j = j + scaleFactor) {
      if (j / scaleFactor < halfway) {
        row.push(int(random(colours.length - 1)));
      } else {
        const offset = j / scaleFactor - halfway;
        row.push(row[halfway - offset - 1]);
      }
    }

    choices.push(...row);
  }

  for (let i = 0; i < 16 * scaleFactor; i = i + scaleFactor) {
    for (let j = 0; j < 16 * scaleFactor; j = j + scaleFactor) {
      const colour = colours[choices[i / scaleFactor + j / scaleFactor]];
      fill(colour);
      noStroke();
      rect(i, j, scaleFactor, scaleFactor);
    }
  }

  noLoop();
}
