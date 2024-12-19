"use strict";
import Grid from "../model/grid.js";
import * as view from "../view/view.js";

export { GRID_ROWS_SIZE, GRID_COLS_SIZE };

window.addEventListener("load", startApp);

// globale variabler
let GRID_ROWS_SIZE;
let GRID_COLS_SIZE;
let model;

function startApp() {
    // sætter GRID_ROWS_SIZE & GRID_COLS_SIZE til default value
    GRID_ROWS_SIZE = parseInt(document.querySelector("#row-size-input").value); 
    GRID_COLS_SIZE = parseInt(document.querySelector("#col-size-input").value);
    
    // Ny instans a grid model
    model = new Grid(GRID_ROWS_SIZE, GRID_ROWS_SIZE, 0);

    resizeGridModel()
    
    // opdatere model med GRID_ROWS_SIZE & GRID_COLS_SIZE hvis bruger input ændrer sig
    document.querySelector("#row-size-input").addEventListener("change", resizeGridModel);
    document.querySelector("#col-size-input").addEventListener("change", resizeGridModel);
    
    
}

// ændre grid størrelse og opdaterer model
function resizeGridModel() {
    GRID_ROWS_SIZE = parseInt(document.querySelector("#row-size-input").value); 
    GRID_COLS_SIZE = parseInt(document.querySelector("#col-size-input").value);
    model = new Grid(GRID_ROWS_SIZE, GRID_COLS_SIZE, 0);
    console.table(model.grid);

    view.createVisualGrid(GRID_ROWS_SIZE, GRID_COLS_SIZE);
}
