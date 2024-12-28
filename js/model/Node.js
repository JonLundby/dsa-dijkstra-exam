export default class Node {
    constructor(row, col, weight) {
        this.row = row;
        this.col = col;
        this.weight = weight;
        this.distanceFromStart = Infinity;
        this.predecessor = undefined;
        this.neighbours = [];
        this.pqIndex = -1;
        this.isVisited = false;
    }
}