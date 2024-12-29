"use strict";
import Grid from "../model/grid.js";
import * as view from "../view/view.js";
import AdjacencyList from "../model/adjacencyList.js";
import PriorityQueue from "../model/priorityQueue.js";
import Node from "../model/Node.js";

export { setStartCell, setGoalCell, animationSpeed };

window.addEventListener("load", startApp);

//  draw types & grid værdi referencer
//  0 = grøn start celle
let greenStart = 0;
//  1 = blå mål celle
let blueGoal = 1;
//  2 = hvid fladt terræn celle
let greenFlat = 2;
//  3 = grå bakke celle (koster ekstra)
let yellowSand = 3;
//  5 = sort blokeret celle
let blueWater = 4;

// globale variabler
// grid
let GRID_ROWS_SIZE;
let GRID_COLS_SIZE;
let grid;
// drawing
let adjacencyList;
let isDrawing = false;
let isErasing = false;
let selectedDrawType = yellowSand;
let isDrawingStart = false;
let isDrawingGoal = false;
let animationSpeed;
// start & goal celler
let startCellIndex;
let goalCellIndex; // celle i nederste højre hjørne er default goal cellen

function startApp() {
    // sætter GRID_ROWS_SIZE & GRID_COLS_SIZE til default value
    GRID_ROWS_SIZE = parseInt(document.querySelector("#row-size-input").value);
    GRID_COLS_SIZE = parseInt(document.querySelector("#col-size-input").value);

    // deaktiver search/find-path-btn indtil start & goal er sat
    document.querySelector("#find-path-btn").disabled = true;

    // animation-speed-input
    animationSpeed = document.querySelector("#animation-speed-input").value;
    document.querySelector("#animation-speed-input").addEventListener("change", () => {
        animationSpeed = document.querySelector("#animation-speed-input").value;
    });

    // Ny instans a grid grid
    grid = new Grid(GRID_ROWS_SIZE, GRID_ROWS_SIZE, greenFlat);
    // goalCellIndex = grid.rows * grid.cols;

    resizeGrid();

    // EVENTLISTENERS
    // resize grid og visual grid når bruger ændrer row/col input
    document.querySelector("#row-size-input").addEventListener("change", resizeGrid);
    document.querySelector("#col-size-input").addEventListener("change", resizeGrid);

    // find path btn
    document.querySelector("#find-path-btn").addEventListener("click", () => {
        gridToAdjacencyList(grid);
        dijkstraSearch(adjacencyList, startCellIndex);
    });

    // lytter på om bruger vil tegne start cellen
    document.querySelector("#draw-start-checkbox").addEventListener("change", () => {
        const drawSelection = document.querySelector("#select-draw");
        const drawGoal = document.querySelector("#draw-goal-checkbox");
        if (!isDrawingStart) {
            isDrawingStart = true;
            drawSelection.disabled = true;
            drawGoal.disabled = true;
            selectedDrawType = greenStart;
        } else {
            isDrawingStart = false;
            drawSelection.disabled = false;
            drawGoal.disabled = false;
            selectedDrawType = parseInt(drawSelection.value);
        }
    });

    // lytter på om bruger vil tegne mål cellen
    document.querySelector("#draw-goal-checkbox").addEventListener("change", () => {
        const drawSelection = document.querySelector("#select-draw");
        const drawStart = document.querySelector("#draw-start-checkbox");
        if (!isDrawingGoal) {
            isDrawingGoal = true;
            drawSelection.disabled = true;
            drawStart.disabled = true;
            selectedDrawType = blueGoal;
        } else {
            isDrawingGoal = false;
            drawStart.disabled = false;
            drawSelection.disabled = false;
            selectedDrawType = parseInt(drawSelection.value);
        }
    });

    // lytter på valg af drawType
    document.querySelector("#select-draw").addEventListener("change", () => {
        selectedDrawType = parseInt(document.querySelector("#select-draw").value);
    });

    // mousedown aktivere "viskelæder" eller "blyant" alt efter hvad event.target.classList indeholder...
    // ... og kalder updateDrawingGrid (kun så længe mousedown sker over grid-container elementet)
    document.querySelector("#grid-container").addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("greenFlat")) {
            isDrawing = true;
            isErasing = false;
        } else {
            isDrawing = false;
            isErasing = true;
        }
        updateDrawingGrid(e);
    });

    // lytter på mousemove og kalder updateDrawingGrid hvis isDrawing eller isErasing er true
    document.querySelector("#grid-container").addEventListener("mousemove", (e) => {
        if (isDrawing || isErasing) {
            updateDrawingGrid(e);
        }
    });

    // lytter på mouseup og deaktivere drawing og erasing
    document.addEventListener("mouseup", () => {
        isDrawing = false;
        isErasing = false;
    });
}

// ændre grid størrelse og opdaterer model
function resizeGrid() {
    // opdater GRID_ROWS_SIZE & GRID_COLS_SIZE
    GRID_ROWS_SIZE = parseInt(document.querySelector("#row-size-input").value);
    GRID_COLS_SIZE = parseInt(document.querySelector("#col-size-input").value);

    if (GRID_ROWS_SIZE > 50) {
        GRID_ROWS_SIZE = 50;
    }
    if (GRID_COLS_SIZE > 50) {
        GRID_COLS_SIZE = 50;
    }
    if (GRID_ROWS_SIZE < 3) {
        GRID_ROWS_SIZE = 3;
    }
    if (GRID_COLS_SIZE < 3) {
        GRID_COLS_SIZE = 3;
    }

    // opdatere selve griddet (ændre instansen til en ny)
    grid = new Grid(GRID_ROWS_SIZE, GRID_COLS_SIZE, greenFlat);

    // opdater det visuelle grid
    view.createVisualGrid(GRID_ROWS_SIZE, GRID_COLS_SIZE);
}

// opdater tegnet grid
function updateDrawingGrid(e) {
    const row = parseInt(e.target.dataset.row); // dataset giver en string værdi og må konverteres/parses til number/int..
    const col = parseInt(e.target.dataset.col);
    let cell = e.target;
    let cellValue;

    if (isDrawing) {
        // cellen der bliver klikket på opdateres baseret på drawType
        grid.set(row, col, selectedDrawType);
        cellValue = grid.get(row, col);
        view.updateVisualCell(cell, cellValue);
    }

    if (isErasing) {
        grid.set(row, col, greenFlat);
        cellValue = grid.get(row, col);
        view.updateVisualCell(cell, cellValue);
    }
    // console.table(grid.grid);
}

function setStartCell(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    startCellIndex = row * grid.cols + col;

    // check om start og goal er sat
    if (startCellIndex > -1 && goalCellIndex > -1) {
        document.querySelector("#find-path-btn").disabled = false;
    }
}

function setGoalCell(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    goalCellIndex = row * grid.cols + col;

    // check om start og goal er sat
    if (startCellIndex > -1 && goalCellIndex > -1) {
        document.querySelector("#find-path-btn").disabled = false;
    }
}

function gridToAdjacencyList(grid) {
    adjacencyList = new AdjacencyList();

    // pusher ny node til adjacencylist for hver celle i griddet med weight baseret på cellValue
    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            const newCellNode = new Node(row, col, grid.get(row, col));
            adjacencyList.list.push(newCellNode);
        }
    }

    // gennemgår griddet igen og finder hver celle fra adjacencylisten
    for (let row = 0; row < grid.rows; row++) {
        for (let col = 0; col < grid.cols; col++) {
            const cellIndex = row * grid.cols + col;
            const currentCell = adjacencyList.list[cellIndex];

            // finder naboer i til celle i griddet
            const neighbours = grid.neighbours(row, col);

            // hver nabo hentes fra adjacencylisten og pushes til currentCells neighbours..
            // ... vigtigt at cellens naboer findes fra adjacencylisten således at de senere har den samme reference i priority queue
            for (const n of neighbours) {
                const nIndex = grid.indexFor(n.row, n.col);
                const nFromAdjacencyList = adjacencyList.list[nIndex];
                currentCell.neighbours.push(nFromAdjacencyList);
            }
        }
    }
    // console.log(adjacencyList.list);
}

async function dijkstraSearch(adjacencyList, startCellIndex) {
    // initialisere pQ, distances & prev samt start object
    let priorityQueue = new PriorityQueue();
    let startCellObj = adjacencyList.list[startCellIndex];
    startCellObj.distanceFromStart = 0;
    startCellObj.weight = 0;
    startCellObj.isVisited = true;

    // // indsætter start cellen i distances og pQ som et object {x,x: 0}...
    // // ... hvor x,x er koordinat og 0 er distancen (0 fordi det er startcelle)
    priorityQueue.insert(startCellObj);

    for (const element of adjacencyList.list) {
        // "&& element.weight !== 3" kan tilføjes for at gøre sorte celler til faste mure der ikke kan besøges (blokeringer)
        if (element !== startCellObj && element.weight !== blueWater) {
            // alle elementer undtagen start pushes fra adjacencylist til priorityQueue...
            // ... elementerne har allerede "distanceFromStart = Infinity" & "predecessor = undefined" som default
            priorityQueue.insert(element);
        }
    }

    while (priorityQueue.size() > 0) {
        // console.log("---- while iteration ----");

        const u = priorityQueue.extractMin();
        u.isVisited = true;
        // console.log("u extracted from pq: ", u);

        // bryder while loopet hvis mål cellen findes / bliver besøgt
        if (u === adjacencyList.list[goalCellIndex]) {
            break;
        }

        for (const n of u.neighbours) {
            // hvis nabo noden ikke er visited (når den er visited så er den allerede opdateret med den laveste distanceFromStart)...
            // ... && hvis ikke det er en mur
            if (!n.isVisited && n.weight !== blueWater) {
                // sammenlægger noden u's distance fra start med naboens weight, altså en beregning den samlede distance fra start til den nye nabo node...
                const alt = u.distanceFromStart + n.weight;

                // finder index på den nabo der itereres over
                const nIndex = n.row * grid.cols + n.col;

                // hvis den alternative distance (alt) er mindre en nabo nodens distance fra start så er der fundet en ny hurtigere rute til nabo noden...
                // ... og denne nye distance opdateres på nabo nodens distanceFromStart property
                if (alt < n.distanceFromStart) {
                    adjacencyList.list[nIndex].predecessor = u;
                    adjacencyList.list[nIndex].distanceFromStart = alt;

                    // opdatere nabo nodens distanceFromStart property gennem priority queue som rearrangere nodernes prioritet
                    priorityQueue.decreasePriority(n.pqIndex, alt);

                    // besøgte noder visualiseres
                    const visualCell = document.querySelector(`#grid-container .cell[data-row="${n.row}"][data-col="${n.col}"]`);
                    await view.markCellVisited(visualCell);
                }
            }
        }
    }
    let current = adjacencyList.list[goalCellIndex].predecessor;
    calculatePath(current);
}

async function calculatePath(current) {
    // base case: hvis current er start cellen så er stien fundet nbaglæns
    if (current === adjacencyList.list[startCellIndex]) {
        return;
    }

    // peger på celle elementet og sender det til markPathCells
    const visualCell = document.querySelector(`#grid-container .cell[data-row="${current.row}"][data-col="${current.col}"]`);
    await view.markPathCells(visualCell);

    // sætter current til dens predecessor
    current = current.predecessor;

    calculatePath(current);
}
