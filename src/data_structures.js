class Node {
	constructor(row, col) {
		this.row = row;
		this.col = col;
		this.visited = false;
		this.neighbours = [];
		this.next = null;
		this.parent = null;
		this.cost = 0; // r
		this.estimate = 0; //r
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

class PriorityQueue {
	constructor(comparator) {
		this.data = [];
		this.size = 0;
		this.comparator = comparator;
	}
	swim(k) {
		let parent = Math.floor((k - 1) / 2);
		while ((k > 0) && this.comparator(this.data[k], this.data[parent])) {
			[this.data[k], this.data[parent]] = [this.data[parent], this.data[k]];

			k = parent;
			parent = Math.floor((k - 1) / 2);
		}
	}
	sink(k) {
		while (true) {
			let left = Math.floor(2 * k + 1);
			let right = Math.floor(2 * k + 2);
			let smallest = left;

			if ((right < this.size) && (this.comparator(this.data[right], this.data[left])))
				smallest = right;

			if ((left >= this.size ) || this.comparator(this.data[k], this.data[smallest]))
				break;

			[this.data[k], this.data[smallest]] = [this.data[smallest], this.data[k]];
			k = smallest;
		}
	}
	add(node) {
		this.data.push(node);
		this.size++;
		this.swim(this.size - 1);
	}
	remove() {
		[this.data[0], this.data[this.size - 1]] = [this.data[this.size - 1], this.data[0]];
		let target = this.data.pop();
		this.size--;
		this.sink(0);
		return target;
	}
	empty() {
		return this.size === 0;
	}
}