export default class ReadQueue {
	constructor() {
		this.data = {};
		this.frontIndex = 0;
		this.backIndex = 0;
	}

	enqueue(item) {
		this.data[this.backIndex] = item;
		this.backIndex++;
		return true;
	}

	dequeue() {
		if (this.frontIndex === this.backIndex) return null;
		const item = this.data[this.frontIndex];
		delete this.data[this.frontIndex];
		this.frontIndex++;
		return item;
	}
}

export const readQueue = new ReadQueue();
