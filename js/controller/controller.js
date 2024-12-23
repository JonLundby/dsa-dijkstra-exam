"use strict";
import Grid from "../model/grid.js";
import * as view from "../view/view.js";
import AdjacencyList from "../model/adjacencyList.js";
import PriorityQueue from "../model/priorityQueue.js";

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
let startCell = {};

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
        dijkstraSearch(adjacencyList, startCell);
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
    const coords = `${cell.dataset.row}, ${cell.dataset.col}`;
    startCell[coords] = 0; // grid.get(`${cell.dataset.row}`, `${cell.dataset.col}`);
}

// laver griddet om til adjacencylist hvor navnet på hver key er koordinat på celle...
// ... og hver key(celle) har liste med nabo-celle objekter hvor hver nabo har koordinater som key...
// ... og en distance baseret på cellens farve
function gridToAdjacencyList(grid) {
    adjacencyList = new AdjacencyList();
    for (let i = 0; i < grid.rows; i++) {
        for (let j = 0; j < grid.cols; j++) {
            const key = `${i}, ${j}`; // key på hver celle
            adjacencyList.list[key] = {}; // vertex / celle oprettes
            const neighbours = grid.neighbours(i, j); // cellens naboer

            for (let n = 0; n < neighbours.length; n++) {
                const neighbourKey = `${neighbours[n].row}, ${neighbours[n].col}`; // finder nabo koordinat som string
                // console.log("neighbour to ", key, "is: ", neighbourKey);
                const distance = grid.grid[neighbours[n].row][neighbours[n].col]; // finder nabocellernes værdier
                // console.log("distance: ", distance);

                // tilføjer distancen(cellen cellValue i griddet) som value til hver nabo
                adjacencyList.list[key][neighbourKey] = distance;
            }
        }
    }
    // console.log("GRID: ", grid);
    // console.log("ADJACENCYLIST: ", adjacencyList);
}

function dijkstraSearch(adjacencyList, startCell) {
    // sætter startCellCoordsStr til at være en string værdi af startcelle objektets første key
    let startCellCoordsKey = Object.keys(startCell)[0];
    // initialisere pQ og distances
    let priorityQueue = new PriorityQueue();
    let distances = {};
    let prev = {};
    // let cells = Object.keys(adjacencyList.list); // laver object om til array for at kunne bruge den som iterable

    // indsætter start cellen i distances og pQ som et object {x,x: 0}...
    // ... hvor x,x er koordinat og 0 er distancen (0 fordi det er startcelle)
    distances[startCellCoordsKey] = 0;
    priorityQueue.add_with_priority(startCellCoordsKey, 0);

    for (const key in adjacencyList.list) {
        // initialisere distances, pq & prev med default start values Infinity og undefined
        if (key !== startCellCoordsKey) {
            distances[key] = Infinity;
            priorityQueue.add_with_priority(key, Infinity);
        }
        prev[key] = undefined;
    }

    
    while (priorityQueue.size() > 0) {
        
    }

    console.log("PQ populated with start{x,x: 0} and rest {x,x: infinity}: : ", priorityQueue.queue);
    console.log("Distances populated with start{x,x: 0} and rest {x,x: infinity}: ", distances);
    console.log("prev populated with all keys with value undefined ", prev);
}
