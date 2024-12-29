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
            cell.classList.add("greenFlat");
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
        cell.classList.remove("greenFlat");
        cell.classList.remove("brownHill");
        cell.classList.remove("mountainBlocked");
        cell.classList.add("start");        
        cell.textContent = "🚶‍♂️";
        setStartCell(cell);
    }
    if (cellValue === 1) {
        cell.classList.remove("start");
        cell.classList.remove("greenFlat");
        cell.classList.remove("brownHill");
        cell.classList.remove("mountainBlocked");
        cell.classList.add("goal");
        cell.textContent = "🏁";
        setGoalCell(cell)
    }
    if (cellValue === 2) {
        cell.classList.remove("start");
        cell.classList.remove("brownHill");
        cell.classList.remove("mountainBlocked");
        cell.classList.remove("goal");
        cell.classList.add("greenFlat");
        cell.textContent = "";
    }
    if (cellValue === 3) {
        cell.classList.remove("start");
        cell.classList.remove("greenFlat");
        cell.classList.remove("mountainBlocked");
        cell.classList.remove("goal");
        cell.classList.add("brownHill");
        cell.textContent = "";
    }
    if (cellValue === 4) {
        cell.classList.remove("start");
        cell.classList.remove("greenFlat");
        cell.classList.remove("mountainBlocked");
        cell.classList.remove("goal");
        cell.classList.add("mountainBlocked");
        cell.textContent = "";
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
    cell.textContent = "⚪";

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, animationSpeed);
    });
}