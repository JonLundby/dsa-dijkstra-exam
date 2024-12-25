export default class NodeCell {
    constructor(row, col, weight) {
        this.row = row;
        this.col = col;
        this.weight = weight;
        this.neighbours = [];
        this.predecessor = undefined;
    }
}