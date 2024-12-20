export default class Grid {
    constructor(rows, cols, cellValue) {
        this.rows = rows;
        this.cols = cols;
        this.cellValue = cellValue;
        this.grid = this.createGrid(rows, cols, cellValue);
    }

    createGrid(rows, cols, cellValue) {
        let grid = [];
        for (let i = 0; i < rows; i++) {
            grid.push([]);
            for (let j = 0; j < cols; j++) {
                if (cellValue || cellValue === null || cellValue === 0) {
                    grid[i].push(cellValue);
                } else {
                    grid[i].push(i * cols + j);
                }
            }
        }
        return grid;
    }

    _parsePosition(arg1, arg2) {
        // hvis arg1 er et objekt, så returner objekt med row og col
        if (typeof arg1 === "object") {
            return { row: arg1.row, col: arg1.col };
        }
        // ellers returner et objekt med row og col. På denne måde er row og col altid defineret som objektet {row: arg1, col: arg2}
        else {
            arg1 = parseInt(arg1)
            return { row: arg1, col: arg2 };
        }
    }

    // Tjek om positionen er inden for gridets grænser
    _isValidPosition(arg1, arg2) {
        // hvis arg1 er et objekt, så bruges parsePosition til at "udpakke" objektet til row og col
        const { row, col } = this._parsePosition(arg1, arg2);

        // returner true hvis row og col er inden for gridets grænser ellers returneres false
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }

    _isValidIndex(index) {
        const totalCells = this.rows * this.cols;
        return index >= 0 && index < totalCells;
    }

    set(arg1, arg2, arg3) {
        const { row, col } = this._parsePosition(arg1, arg2);

        // hvis positionen er gyldig...
        if (this._isValidPosition(row, col)) {
            // ...og arg1 er typen af objekt så indsættes arg2 som værdi og er arg1 IKKE et objekt så indsættes arg3 som værdi
            if (typeof arg1 === "object") {
                this.grid[row][col] = arg2;
            } else {
                this.grid[row][col] = arg3;
            }
        } else {
            return undefined;
        }
    }

    get(arg1, arg2) {
        const { row, col } = this._parsePosition(arg1, arg2);
        if (this._isValidPosition(row, col)) {
            return this.grid[row][col];
        } else {
            return undefined;
        }
    }

    indexFor(arg1, arg2) {
        if (this._isValidPosition(arg1, arg2)) {
            const { row, col } = this._parsePosition(arg1, arg2);
            return row * this.cols + col;
        } else {
            return undefined;
        }
    }

    rowColFor(index) {
        // tjek om index er gyldig og indenfor grid
        if (this._isValidIndex(index)) {
            // hvis index er gyldig findes den række som index befinder sig i ved at dividere index-tallet med antallet af kolonner
            const row = Math.floor(index / this.cols); // 1
            // og kolonnen som index befinder sig i findes ved at tage det overskydende tal(modolus) ved division af index med antal kolonner
            const col = index % this.cols;

            return { row, col };
        } else {
            return undefined;
        }
    }

    neighbours(arg1, arg2) {        
        const { row, col } = this._parsePosition(arg1, arg2);        
        let neighboursActual = [];

        if (this._isValidPosition(row, col)) {
            // tilføjer potentielle naboer inkl. diagonale
            const potentialNeighbours = [
                { row: row - 1, col: col - 1 }, // nord-vest
                { row: row - 1, col }, // nord
                { row: row - 1, col: col + 1 }, // nord-øst
                { row, col: col - 1 }, // vest
                { row, col: col + 1 }, // øst
                { row: row + 1, col }, // syd
                { row: row + 1, col: col - 1 }, // syd-vest
                { row: row + 1, col: col + 1 }, // syd-øst
            ];            

            // filtrere de nabo positioner der er uden for griddet
            neighboursActual = potentialNeighbours.filter((pos) => this._isValidPosition(pos.row, pos.col));

            return neighboursActual;
        } else {
            return undefined;
        }
    }

    neighbourValues(arg1, arg2) {
        const neighbours = this.neighbours(arg1, arg2);
        const neighbourValues = neighbours.map((pos) => this.get(pos.row, pos.col));
        return neighbourValues;
    }

    nextInRow(arg1, arg2) {
        const { row, col } = this._parsePosition(arg1, arg2);
        const value = this.get(row, col + 1);

        if (this._isValidPosition(row, col)) {
            return { row, col: col + 1, value };
        } else {
            return undefined;
        }
    }

    nextInCol(arg1, arg2) {
        const { row, col } = this._parsePosition(arg1, arg2);
        const value = this.get(row + 1, col);

        if (this._isValidPosition(row + 1, col)) {
            return { row: row + 1, col, value };
        } else {
            return undefined;
        }
    }

    north(arg1, arg2) {
        const { row, col } = this._parsePosition(arg1 - 1, arg2);
        const value = this.get(row, col);

        if (this._isValidPosition(row, col)) {
            return { row, col, value };
        } else {
            return undefined;
        }
    }

    south(arg1, arg2) {
        const { row, col } = this._parsePosition(arg1 + 1, arg2);
        const value = this.get(row, col);

        if (this._isValidPosition(row, col)) {
            return { row, col, value };
        } else {
            return undefined;
        }
    }

    west(arg1, arg2) {
        const { row, col } = this._parsePosition(arg1, arg2 - 1);
        const value = this.get(row, col);

        if (this._isValidPosition(row, col)) {
            return { row, col, value };
        } else {
            return undefined;
        }
    }

    east(arg1, arg2) {
        const { row, col } = this._parsePosition(arg1, arg2 + 1);
        const value = this.get(row, col);

        if (this._isValidPosition(row, col)) {
            return { row, col, value };
        } else {
            return undefined;
        }
    }

    getRows() {
        return this.rows;
    }

    getCols() {
        return this.cols;
    }

    size() {
        return this.rows * this.cols;
    }

    fill(value) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.set(row, col, value);
            }
        }
    }

    dump() {
        console.table(this.grid);
    }
}
