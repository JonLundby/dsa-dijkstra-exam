"use strict";
import Grid from "../model/grid.js";
import * as view from "../view/view.js";

window.addEventListener("load", startApp);

// model værdi referencer
//  0 = hvid tilgængelig celle
//  1 = sort blokeret celle
//  2 = grå cost celle (koster ekstra)
//  3 = grøn start celle
//  4 = blå mål celle

// globale variabler
let GRID_ROWS_SIZE;
let GRID_COLS_SIZE;
let model;
let isDrawing = false;
let isErasing = false;
let selectedDrawType = 1;

function startApp() {
    // sætter GRID_ROWS_SIZE & GRID_COLS_SIZE til default value
    GRID_ROWS_SIZE = parseInt(document.querySelector("#row-size-input").value);
    GRID_COLS_SIZE = parseInt(document.querySelector("#col-size-input").value);

    // Ny instans a grid model
    model = new Grid(GRID_ROWS_SIZE, GRID_ROWS_SIZE, 0);

    resizeGridModel();

    // EVENTLISTENERS
    // resize model og visual grid når bruger ændrer row/col input
    document.querySelector("#row-size-input").addEventListener("change", resizeGridModel);
    document.querySelector("#col-size-input").addEventListener("change", resizeGridModel);

    // lytter på valg af drawType
    document.querySelector("#select-draw").addEventListener("change", () => {
        selectedDrawType = parseInt(document.querySelector("#select-draw").value);
        console.log(selectedDrawType);
    });

    // mousedown aktivere "viskelæder" eller "blyant" alt efter hvad event.target.classList indeholder...
    // ... og kalder updateDrawingModel (kun så længe mousedown sker over grid-container elementet)
    document.querySelector("#grid-container").addEventListener("mousedown", (e) => {
        if (e.target.classList.contains("available")) {
            isDrawing = true;
            isErasing = false;
        } else {
            isDrawing = false;
            isErasing = true;
        }
        updateDrawingModel(e);
    });

    // lytter på mousemove og kalder updateDrawingModel hvis isDrawing eller isErasing er true
    document.querySelector("#grid-container").addEventListener("mousemove", (e) => {
        if (isDrawing || isErasing) {
            updateDrawingModel(e);
        }
    });

    // lytter på mouseup og deaktivere drawing og erasing
    document.addEventListener("mouseup", () => {
        isDrawing = false;
        isErasing = false;
    });
}

// ændre grid størrelse og opdaterer model
function resizeGridModel() {
    // opdater GRID_ROWS_SIZE & GRID_COLS_SIZE
    GRID_ROWS_SIZE = parseInt(document.querySelector("#row-size-input").value);
    GRID_COLS_SIZE = parseInt(document.querySelector("#col-size-input").value);
    // opdatere selve modeller / laver en ny
    model = new Grid(GRID_ROWS_SIZE, GRID_COLS_SIZE, 0);

    // opdater det visuelle grid
    view.createVisualGrid(GRID_ROWS_SIZE, GRID_COLS_SIZE);
}

// opdater tegnet model
function updateDrawingModel(e) {
    const row = parseInt(e.target.dataset.row); // dataset giver en string værdi og må konverteres/parses til number/int..
    const col = parseInt(e.target.dataset.col);
    let cell = e.target;
    let cellValue;

    if (isDrawing) {
        // cellen der bliver klikket på opdateres baseret på drawType
        model.set(row, col, selectedDrawType);
        cellValue = model.get(row, col);
        view.updateVisualCell(cell, cellValue);
    }

    if (isErasing) {
        model.set(row, col, 0);
        cellValue = model.get(row, col);
        view.updateVisualCell(cell, cellValue);
    }

    console.table(model.grid);
}
