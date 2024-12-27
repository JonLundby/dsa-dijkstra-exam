export default class NodeCell {
    constructor(row, col, weight) {
        this.row = row;
        this.col = col;
        this.weight = weight;
        this.distanceFromStart = Infinity;
        this.neighbours = [];
        this.predecessor = undefined;
        this.pqIndex = -1;
    }
}