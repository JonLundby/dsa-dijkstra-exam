"use strict";
import Grid from "../model/grid.js";
import * as view from "../view/view.js";
import AdjacencyList from "../model/adjacencyList.js";
import PriorityQueue from "../model/priorityQueue.js";
import Node from "../model/Node.js";

export { setStartCell };

window.addEventListener("load", startApp);

// grid værdi referencer
//  0 = grøn start celle
//  1 = hvid tilgængelig celle
//  2 = grå cost celle (koster ekstra)
//  3 = sort blokeret celle
//  4 = blå mål celle

// globale variabler
let GRID_ROWS_SIZE;
let GRID_COLS_SIZE;
let grid;
let adjacencyList;
let isDrawing = false;
let isErasing = false;
let selectedDrawType = 2;
let isDrawingStart = false;
let isDrawingGoal = false;
let startCellIndex = 0;

function startApp() {
    // sætter GRID_ROWS_SIZE & GRID_COLS_SIZE til default value
    GRID_ROWS_SIZE = parseInt(document.querySelector("#row-size-input").value);
    GRID_COLS_SIZE = parseInt(document.querySelector("#col-size-input").value);

    // Ny instans a grid grid
    grid = new Grid(GRID_ROWS_SIZE, GRID_ROWS_SIZE, 0);

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

    // tegn start og stop celler
    document.querySelector("#draw-start-checkbox").addEventListener("change", () => {
        const drawSelection = document.querySelector("#select-draw");
        const drawGoal = document.querySelector("#draw-goal-checkbox");
        if (!isDrawingStart) {
            isDrawingStart = true;
            drawSelection.disabled = true;
            drawGoal.disabled = true;
            selectedDrawType = 0;
        } else {
            isDrawingStart = false;
            drawSelection.disabled = false;
            drawGoal.disabled = false;
            selectedDrawType = parseInt(drawSelection.value);
        }
    });
    document.querySelector("#draw-goal-checkbox").addEventListener("change", () => {
        const drawSelection = document.querySelector("#select-draw");
        const drawStart = document.querySelector("#draw-start-checkbox");
        if (!isDrawingGoal) {
            isDrawingGoal = true;
            drawSelection.disabled = true;
            drawStart.disabled = true;
            selectedDrawType = 4;
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
        // console.log(selectedDrawType);
    });

    // mousedown aktivere "viskelæder" eller "blyant" alt efter hvad event.target.classList indeholder...
    // ... og kalder updateDrawingGrid (kun så længe mousedown sker over grid-container elementet)
    document.querySelector("#grid-container").addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("available")) {
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
    // opdatere selve griddet (ændre instansen til en ny)
    grid = new Grid(GRID_ROWS_SIZE, GRID_COLS_SIZE, 1);

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
        grid.set(row, col, 1);
        cellValue = grid.get(row, col);
        view.updateVisualCell(cell, cellValue);
    }

    // console.table(grid.grid);
}

function setStartCell(cell) {
    // const coords = `${cell.dataset.row}, ${cell.dataset.col}`;
    // startCell[coords] = 0; // grid.get(`${cell.dataset.row}`, `${cell.dataset.col}`);
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);
    startCellIndex = row * grid.cols + col;
}

// laver griddet om til adjacencylist hvor navnet på hver key er koordinat på celle...
// ... og hver key(celle) har liste med nabo-celle objekter hvor hver nabo har koordinater som key...
// ... og en distance baseret på cellens farve
// function gridToAdjacencyList(grid) {
//     adjacencyList = new AdjacencyList();
//     for (let i = 0; i < grid.rows; i++) {
//         for (let j = 0; j < grid.cols; j++) {
//             const key = `${i}, ${j}`; // key på hver celle som string
//             adjacencyList.list[key] = {}; // vertex / celle oprettes
//             const neighbours = grid.neighbours(i, j); // cellens naboer

//             for (let n = 0; n < neighbours.length; n++) {
//                 const neighbourKey = `${neighbours[n].row}, ${neighbours[n].col}`; // finder nabo koordinat som string
//                 // console.log("neighbour to ", key, "is: ", neighbourKey);
//                 const distance = grid.grid[neighbours[n].row][neighbours[n].col]; // finder nabocellernes værdier
//                 // console.log("distance: ", distance);

//                 // tilføjer distancen(cellen cellValue i griddet) som value til hver nabo
//                 adjacencyList.list[key][neighbourKey] = distance;
//             }
//         }
//     }
//     // console.log("GRID: ", grid);
//     // console.log("ADJACENCYLIST: ", adjacencyList);
// }
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

function dijkstraSearch(adjacencyList, startCellIndex) {
    // initialisere pQ, distances & prev samt start object
    let priorityQueue = new PriorityQueue();
    let distances = [];
    let prev = [];
    let startCellObj = adjacencyList.list[startCellIndex];

    // // indsætter start cellen i distances og pQ som et object {x,x: 0}...
    // // ... hvor x,x er koordinat og 0 er distancen (0 fordi det er startcelle)
    distances.push(adjacencyList.list[startCellIndex]);
    priorityQueue.insert(startCellObj);
    prev.push(startCellObj);

    for (const element of adjacencyList.list) {
        // "&& element.weight !== 3" kan tilføjes for at gøre sorte celler til faste mure der ikke kan besøges (blokeringer)
        if (element !== startCellObj) {
            // giver alle elementer en weight på Infinity og pusher dem til PQ og distances
            // element.distanceFromStart = Infinity; // ikke nødvendigt da det er default og bliver overskrevet senere
            distances.push(element);
            priorityQueue.insert(element);

            // alle elementer har allerede default som predecessor ved instantiering
            // alle elementer pushes til prev som holder på stien til den korteste rute
            prev.push(element);
        }
    }

    while (priorityQueue.size() > 9) {
        console.log("---- while iteration ----");

        const u = priorityQueue.extractMin();
        console.log("u extracted from pq: ", u);

        for (const n of u.neighbours) {
            const alt = u.weight + n.weight;            

            const nIndex = n.row * grid.cols + n.col;

            if (alt < distances[nIndex].weight) {
                prev[nIndex].predecessor = u;
                distances[nIndex].weight = alt;
                
                console.log(n.pqIndex);
                priorityQueue.decreasePriority(n.pqIndex, alt);
            }
        }
    }
    
    console.log("AD, should be unaffected clean grid (only with updated drawing/weights)", adjacencyList.list);
    console.log("PQ populated with start{x,x: 0} and rest {x,x: infinity}: ", priorityQueue.queue);
    console.log("Distances populated with start{x,x: 0} and rest {x,x: infinity}: ", distances);
    console.log("prev populated with all keys with value undefined: ", prev);
}
