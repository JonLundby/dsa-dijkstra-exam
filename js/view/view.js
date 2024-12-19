import * as controller from "../controller/controller.js"

export { createVisualGrid, updateVisualCell }

function createVisualGrid(rows, cols) {
    const visualGrid = document.querySelector("#grid-container");
    visualGrid.innerHTML = "";

    // opdater css root værdier --grid-rows & --grid-cols
    document.documentElement.style.setProperty("--grid-rows", rows)
    document.documentElement.style.setProperty("--grid-cols", cols)

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.dataset.row = row
            cell.dataset.col = col
            cell.addEventListener("click", controller.handleCellClick)

            visualGrid.insertAdjacentElement("beforeend", cell);
        }
    }
}

//
function updateVisualCell(cell, value) {
    // kode til at ændre visualCell baseret på en value
}