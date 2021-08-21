class Tile {
	constructor(x, y, l, lcol, rcol) {
		this.x = x;
		this.y = y;
		this.l = l;
		this.scale = random([1, -1]);
		this.leftCol = lcol;
		this.rightCol = rcol;
		if (this.scale === 1) {
			this.topCol = this.leftCol;
			this.bottomCol = this.rightCol;
		} else {
			this.topCol = this.rightCol;
			this.bottomCol = this.leftCol;
		}
	}
	show() {
		let l = this.l,
			x = this.x * l,
			y = this.y * l;
		push();
		translate(x + l / 2, y + l / 2);
		push();
		scale(-1, -1 * this.scale);
		strokeWeight(scl / 2 - scl / 6);
		noFill();
		stroke(this.leftCol);
		arc(l / 2, l / 2, l, l, 180, 270);
		stroke(this.rightCol);
		arc(-l / 2, -l / 2, l, l, 0, 90);
		pop();
		pop();
	}

	setTop(col) {
		this.topCol = col;
		if (this.scale == 1) {
			this.leftCol = col;
		} else {
			this.rightCol = col;
		}
	}
	setBottom(col) {
		this.bottomCol = col;
		if (this.scale == 1) {
			this.rightCol = col;
		} else {
			this.leftCol = col;
		}
	}
	setLeft(col) {
		this.leftCol = col;
		if (this.scale == 1) {
			this.topCol = col;
		} else {
			this.bottomCol = col;
		}
	}
	setRight(col) {
		this.rightCol = col;
		if (this.scale == 1) {
			this.bottomCol = col;
		} else {
			this.topCol = col;
		}
	}

	setColors(lcol, rcol) {
		this.setLeft(lcol);
		this.setRight(rcol);
	}

	guessColors(tiles, from) {
		let leftTileCol = this.x > 0 && tiles[this.x - 1 + this.y * rows].rightCol;
		let topTileCol =
			this.y > 0 && tiles[this.x + (this.y - 1) * rows].bottomCol;
		let rightTileCol =
			this.x < cols - 1 && tiles[this.x + 1 + this.y * rows].leftCol;
		let bottomTileCol =
			this.y < rows - 1 && tiles[this.x + (this.y + 1) * rows].topCol;

		if (
			leftTileCol == this.leftCol &&
			rightTileCol == this.rightCol &&
			topTileCol == this.topCol &&
			bottomTileCol == this.bottomCol
		) {
			return;
		}
		if (this.scale == 1) {
			if (topTileCol && topTileCol === leftTileCol) {
				this.setLeft(leftTileCol);
			} else {
				if (!topTileCol && !leftTileCol) {
					//skip it
					this.setTop(chooseRandomColor());
				} else if (!topTileCol) {
					//means left available
					this.setLeft(leftTileCol);
					//guess top
					this.y > 0 &&
						tiles[this.x + (this.y - 1) * rows].guessColors(tiles, "BOTTOM");
				} else if (!leftTileCol) {
					//means top available
					this.setTop(topTileCol);
					//guess left
					this.x > 0 &&
						tiles[this.x - 1 + this.y * rows].guessColors(tiles, "RIGHT");
				} else if (leftTileCol != topTileCol) {
					//backtrack
					if (from == "LEFT") {
						//trust left tile
						this.setLeft(leftTileCol);
						//guess top
						this.y > 0 &&
							tiles[this.x + (this.y - 1) * rows].guessColors(tiles, "BOTTOM");
					} else {
						//trust top tile
						this.setTop(topTileCol);
						//guess left
						this.x > 0 &&
							tiles[this.x - 1 + this.y * rows].guessColors(tiles, "RIGHT");
					}
				}
			}
			if (bottomTileCol && bottomTileCol == rightTileCol) {
				this.setRight(rightTileCol);
			} else {
				if (!bottomTileCol && !rightTileCol) {
					this.setRight(chooseRandomColor());
				} else if (!bottomTileCol) {
					//means right available
					this.setRight(rightTileCol);
					//guess bottom
					this.y < rows - 1 &&
						tiles[this.x + (this.y + 1) * rows].guessColors(tiles, "TOP");
				} else if (!rightTileCol) {
					//means bottom available
					this.setBottom(bottomTileCol);
					//guess right
					this.x < cols - 1 &&
						tiles[this.x + 1 + this.y * rows].guessColors(tiles, "LEFT");
				} else if (rightTileCol != bottomTileCol) {
					if (from == "BOTTOM") {
						//trust bottom
						this.setBottom(bottomTileCol);
						//guess right
						this.x < cols - 1 &&
							tiles[this.x + 1 + this.y * rows].guessColors(tiles, "LEFT");
					} else {
						//trust right
						this.setRight(rightTileCol);
						//guess bottom
						this.y < rows - 1 &&
							tiles[this.x + (this.y + 1) * rows].guessColors(tiles, "TOP");
					}
				}
			}
		} else {
			if (leftTileCol && leftTileCol == bottomTileCol) {
				this.setLeft(leftTileCol);
			} else {
				if (!leftTileCol && !bottomTileCol) {
					this.setLeft(chooseRandomColor());
				} else if (!bottomTileCol) {
					//means left available
					this.setLeft(leftTileCol);
					//guess botom
					this.y < rows - 1 &&
						tiles[this.x + (this.y + 1) * rows].guessColors(tiles, "TOP");
				} else if (!leftTileCol) {
					//means bottom available
					this.setBottom(bottomTileCol);
					//guess left
					this.x > 0 &&
						tiles[this.x - 1 + this.y * rows].guessColors(tiles, "RIGHT");
				} else if (leftTileCol != bottomTileCol) {
					if (from == "BOTTOM") {
						//trust bottom
						this.setBottom(bottomTileCol);
						//guess left
						this.x > 0 &&
							tiles[this.x - 1 + this.y * rows].guessColors(tiles, "RIGHT");
					} else {
						//trust left
						this.setLeft(leftTileCol);
						//guess bottom
						this.y < rows - 1 &&
							tiles[this.x + (this.y + 1) * rows].guessColors(tiles, "TOP");
					}
				}
			}
			if (rightTileCol && rightTileCol == topTileCol) {
				this.setRight(rightTileCol);
			} else {
				if (!rightTileCol && !topTileCol) {
					this.setRight(chooseRandomColor());

					//skip it
				} else if (!topTileCol) {
					//means right available
					this.setRight(rightTileCol);
					// guess top
					this.y > 0 &&
						tiles[this.x + (this.y - 1) * rows].guessColors(tiles, "BOTTOM");
				} else if (!rightTileCol) {
					//means top available
					this.setTop(topTileCol);
					//guess right
					this.x < cols - 1 &&
						tiles[this.x + 1 + this.y * rows].guessColors(tiles, "LEFT");
				} else if (rightTileCol != topTileCol) {
					if (from == "TOP") {
						//trust top col
						this.setTop(topTileCol);
						//guess right
						this.x < cols - 1 &&
							tiles[this.x + 1 + this.y * rows].guessColors(tiles, "LEFT");
					} else {
						//trust right
						this.setRight(rightTileCol);
						// guess top
						this.y > 0 &&
							tiles[this.x + (this.y - 1) * rows].guessColors(tiles, "BOTTOM");
					}
				}
			}
		}
	}
}
const params = new URLSearchParams(window.location.search);
let COLORS;
if (params.has("c")) {
	COLORS = params.get("c");
} else {
	COLORS = "000000ffffff000000ffffff";
}
let scl = 108;
let rows, cols;
let a = [0, 90, 180, 270, 360];
let tiles = [];

function setup() {
	pixelDensity(1);
	let canvas = createCanvas(1080, 1080);
	cols = width / scl;
	rows = height / scl;
	angleMode(DEGREES);
	canvas.mousePressed(stopr);

	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			tiles.push(new Tile(j, i, scl));
		}
	}
	tiles[0].setColors(chooseRandomColor(), chooseRandomColor());
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			if (j + i != 0) {
				tiles[i * rows + j].guessColors(tiles);
			}
		}
	}

	background(255);
	gridimg();
	// grid();
}
function stopr() {
	noLoop();
	saveCanvas(canvas, "TrouchetTiles");
}
function chooseRandomColor() {
	let colorHex = COLORS;
	let code = random([
		colorHex.slice(0, 6),
		colorHex.slice(6, 12),
		colorHex.slice(12, 18),
		colorHex.slice(18, 24),
	]);
	return "#" + code;
}

function grid() {
	stroke(255);
	strokeWeight(0.4);
	for (let i = 0; i <= width; i += scl) {
		line(i, 0, i, height);
		line(0, i, width, i);
	}
}
function gridimg() {
	for (let i = 0; i < rows; i++) {
		for (let j = 0; j < cols; j++) {
			tiles[i * rows + j].show();
		}
	}
}
