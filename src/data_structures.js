class Node {
	constructor(row, col) {
		this.row = row;
		this.col = col;
		this.visited = false;
		this.neighbours = [];
		this.next = null;
		this.parent = null;
	}
}

class Queue {
	constructor() {
		this.head = null;
		this.tail = null;
		this.length = 0;
	}
	enqueue(node) {
		if (this.head === null) {
			this.head = node;
			this.tail = node;
		} else {
			this.tail.next = node;
			this.tail = node;
		}
		this.length++;
	}
	dequeue() {
		let ref = this.head;
		if (this.length > 1) {
			this.head = ref.next;
			ref.next = null;
		} else {
			this.head = null;
			this.tail = null;
		}
		this.length--;
		return ref;
	}
	empty() {
		return this.length === 0;
	}
}