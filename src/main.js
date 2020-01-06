'use strict';

function run() {

	function* Generator() {
		const root = state.startNode;
		const target = state.targetNode;
		root.visited = true;

		let queue = new Queue();
		queue.enqueue(root);
		while (!queue.empty()) {
			let active = queue.dequeue();

			if (active.row === target.row && active.col == target.col) {
				let path = [];
				let current = active;
				while (current !== null) {
					path.push(current);
					current = current.parent;
				}

				for (let i = 1; i < path.length; i++) {
					ui.addClassAtIndex(path[i].row, path[i].col, 'path');
					yield 1;
				}
				return;
			}
			ui.addClassAtIndex(active.row, active.col, 'explored');
			yield 1;

			for (let i = 0; i < active.neighbours.length; i++) {
				let child = active.neighbours[i];
				if (!child.visited) {
					child.visited = true;
					child.parent = active;

					ui.addClassAtIndex(child.row, child.col, 'frontier');;
					yield 1;
					queue.enqueue(child);
				}
			}
		}
	}

	state.updateNodes();

	const generator = Generator();
	const id = setInterval(() => {
		const { done } = generator.next();
		if (done) {
			clearInterval(id);
		}
	}, 0);
}

const state = {
	numberOfRows: 20,
	numberOfCols: 20,	
	nodes: [],
	startNode: null,
	targetNode: null,
	init: function() {
		for (let i = 0; i < this.numberOfRows; i++) {
			const row = [];
			for (let j = 0; j < this.numberOfCols; j++) {;
				row.push(new Node(i, j));
			}
			this.nodes.push(row);
		}
	},
	updateNodes: function() {
		for (let i = 0; i < this.numberOfRows; i++) {
			for (let j = 0; j < this.numberOfCols; j++) {
			const node = this.nodes[i][j];
			let row = node.row;
			let col = node.col;
			if (row - 1 >= 0)
				if (!ui.divs[(row - 1) * this.numberOfRows + col].classList.contains('black'))
					node.neighbours.push(this.nodes[row - 1][col]);
			if (col - 1 >= 0)
				if (!ui.divs[row * this.numberOfCols + col - 1].classList.contains('black'))
					node.neighbours.push(this.nodes[row][col - 1]);
			if (col + 1 < this.numberOfCols)
				if (!ui.divs[row * this.numberOfCols + col + 1].classList.contains('black'))
					node.neighbours.push(this.nodes[row][col + 1]);
			if (row + 1 < this.numberOfRows)
				if (!ui.divs[(row + 1) * this.numberOfRows + col].classList.contains('black'))
					node.neighbours.push(this.nodes[row + 1][col]);
			}
		}
		this.startNode = this.nodes[ui.startRow][ui.startCol];
		this.targetNode = this.nodes[ui.targetRow][ui.targetCol];
	},
	resetNodes: function() {
		for (let i = 0; i < this.numberOfRows; i++) {
			for (let j = 0; j < this.numberOfCols; j++) {
				const node = this.nodes[i][j];
				node.visited = false;
				node.neighbours = [];
				node.className = '';
				node.parent = null;
			}
		}
	}
};

const ui = {
	startRow: -1,
	startCol: -1,
	targetRow: -1,
	targetCol: -1,
	divs: null,
	isSetStart: false,
	isSetTarget: false,
	addClassAtIndex(row, col, name) {
		this.divs[row * state.numberOfCols + col].classList.add(name);
	},
	removeClassAtIndex(row, col, name) {
		this.divs[row * state.numberOfCols + col].classList.remove(name);
	},
	setStart: function(row, col) {
		if (this.startRow !== -1) {
			this.removeClassAtIndex(this.startRow, this.startCol, 'start');
		}
		this.startRow = row;
		this.startCol = col;
		this.addClassAtIndex(this.startRow, this.startCol, 'start');
	},
	setTarget: function(row, col) {
		if (this.targetRow !== -1) {
			this.removeClassAtIndex(this.targetRow, this.targetCol, 'target');
		}
		this.targetRow = row;
		this.targetCol = col;
		this.addClassAtIndex(this.targetRow, this.targetCol, 'target');
	},
	setBlock: function(row, col) {
		this.addClassAtIndex(row, col, 'black');
	},
	removeBlock: function(row, col) {
		this.removeClassAtIndex(row, col, 'black');
	},
	setRandomLocations: function() {
		this.setStart(Math.floor(Math.random() * state.numberOfRows), Math.floor(Math.random() * state.numberOfCols));
		this.setTarget(Math.floor(Math.random() * state.numberOfRows), Math.floor(Math.random() * state.numberOfCols))
	},
	init: function(gridEl) {
		const fragment = document.createDocumentFragment();
		for (let i = 0; i < state.numberOfRows; i++) {
			for (let j = 0; j < state.numberOfCols; j++) {
				let div = document.createElement('div');
				div.dataset['row'] = i;
				div.dataset['col'] = j;
				fragment.appendChild(div);
			}
		}
		gridEl.appendChild(fragment);
		this.divs = gridEl.children;
		this.setRandomLocations();
	},
	reset() {
		[...this.divs].forEach(function resetColor(el) {
			el.className = '';
		});
		this.setRandomLocations();
	}
};

const mouse = {
	isDown: false,
	isLeftButton: false,
	isRightButton: false,
	mouseRow: -1,
	mouseCol: -1
};

const gridEl = document.querySelector("#grid");
ui.init(gridEl);
state.init();

const setStartBtn = document.querySelector('#set-start');
const setTargetBtn = document.querySelector('#set-target');
const runBtn = document.querySelector("#run");
const resetBtn = document.querySelector("#reset");

document.addEventListener('foo', (event) => {
	run();
});

runBtn.addEventListener('click', (event) => {
	document.dispatchEvent(new Event('foo'));
});

resetBtn.addEventListener('click', (event) => {
	ui.reset();
	state.resetNodes();
});

setStartBtn.addEventListener('click', (event) => {
	ui.isSetStart = true;
	ui.isSetTarget = false;
});

setTargetBtn.addEventListener('click', (event) => {
	ui.isSetTarget = true;
	ui.isSetStart = false;
});

gridEl.addEventListener('click', (event) => {
	const target = event.target;
	if (target.id === 'grid')
		return;

	const { row, col } = target.dataset;
	if (ui.isSetStart)
		ui.setStart(Number(row), Number(col));

	if (ui.isSetTarget)
		ui.setTarget(Number(row), Number(col));

	ui.isSetStart = false;
	ui.isSetTarget = false;
});

gridEl.addEventListener('mousedown', (event) => {
	event.preventDefault(); // prevent selection
	if (ui.isSetStart || ui.isSetTarget)
		return false;

	const target = event.target;

	mouse.isDown = true;
	if (event.button === 0) {
		mouse.isLeftButton = true;

		if (target.id === 'grid')
			return;

		let { row, col } = target.dataset;
		if (mouse.mouseRow === row && mouse.mouseCol === col)
			return;

		mouse.mouseRow = row;
		mouse.mouseCol = col;
		ui.setBlock(Number(row), Number(col));
	} else {
		mouse.isRightButton = true;

		if (target.id === 'grid')
			return;

		let { row, col } = target.dataset;
		if (mouse.mouseRow === row && mouse.mouseCol === col)
			return;

		mouse.mouseRow = row;
		mouse.mouseCol = col;
		ui.removeBlock(Number(row), Number(col));
	}
});

gridEl.addEventListener('mousemove', (event) => {
	if (!mouse.isDown)
		return;

	const target = event.target;
	if (target.id === 'grid')
		return;

	if (mouse.isLeftButton) {
		let { row, col } = target.dataset;
		if (mouse.mouseRow === row && mouse.mouseCol === col)
			return;

		mouse.mouseRow = row;
		mouse.mouseCol = col;
		ui.setBlock(Number(row), Number(col));
	}
	if (mouse.isRightButton) {
		let { row, col } = target.dataset;
		if (mouse.mouseRow === row && mouse.mouseCol === col)
			return;

		mouse.mouseRow = row;
		mouse.mouseCol = col;
		ui.removeBlock(Number(row), Number(col));
	}
});

grid.addEventListener('mouseup', (event) => {
	mouse.isDown = false;
	mouse.isLeftButton = false;
	mouse.isRightButton = false;
});

gridEl.addEventListener('contextmenu', (event) => {
	event.preventDefault()
});