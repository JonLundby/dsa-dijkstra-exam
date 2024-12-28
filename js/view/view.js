import { setStartCell, setGoalCell, animationSpeed } from "../controller/controller.js";

export { createVisualGrid, updateVisualCell };

function createVisualGrid(rows, cols) {
    const visualGrid = document.querySelector("#grid-container");
    visualGrid.innerHTML = "";

    // opdater css root værdier --grid-rows & --grid-cols
    document.documentElement.style.setProperty("--grid-rows", rows);
    document.documentElement.style.setProperty("--grid-cols", cols);

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.classList.add("whiteFlat");
            cell.dataset.row = row;
            cell.dataset.col = col;

            visualGrid.insertAdjacentElement("beforeend", cell);
        }
    }
}

// Visuel opdatering af enkelte celler
function updateVisualCell(cell, cellValue) {
    if (cellValue === 0) {
        cell.classList.remove("goal");
        cell.classList.remove("whiteFlat");
        cell.classList.remove("greyHill");
        cell.classList.remove("blackBlocked");
        cell.classList.add("start");        
        setStartCell(cell);
        console.log("visual start cell: ", cell);
    }
    if (cellValue === 1) {
        cell.classList.remove("start");
        cell.classList.remove("whiteFlat");
        cell.classList.remove("greyHill");
        cell.classList.remove("blackBlocked");
        cell.classList.add("goal");
        setGoalCell(cell)        
    }
    if (cellValue === 2) {
        cell.classList.remove("start");
        cell.classList.remove("greyHill");
        cell.classList.remove("blackBlocked");
        cell.classList.remove("goal");
        cell.classList.add("whiteFlat");
    }
    if (cellValue === 3) {
        cell.classList.remove("start");
        cell.classList.remove("whiteFlat");
        cell.classList.remove("blackBlocked");
        cell.classList.remove("goal");
        cell.classList.add("greyHill");
    }
    if (cellValue === 4) {
        cell.classList.remove("start");
        cell.classList.remove("whiteFlat");
        cell.classList.remove("blackBlocked");
        cell.classList.remove("goal");
        cell.classList.add("blackBlocked");
    }
}

export async function markCellVisited(cell) {
    cell.classList.add("visited");

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, animationSpeed);
    });
}

export async function markPathCells(cell) {
    cell.classList.add("path");
    
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, animationSpeed);
    });
    
}