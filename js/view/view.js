import { setStartCell, setGoalCell, animationSpeed, greenStart, blueGoal, greenFlat, greyHill, mountainBlocked } from "../controller/controller.js";

export { createVisualGrid, updateVisualCell, greenStart, blueGoal, greenFlat, greyHill, mountainBlocked };

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
    if (cellValue === greenStart) {
        cell.classList.remove("goal");
        cell.classList.remove("greenFlat");
        cell.classList.remove("greyHill");
        cell.classList.remove("mountainBlocked");
        cell.classList.add("start");        
        cell.textContent = "🚶‍♂️";
        setStartCell(cell);
    }
    if (cellValue === blueGoal) {
        cell.classList.remove("start");
        cell.classList.remove("greenFlat");
        cell.classList.remove("greyHill");
        cell.classList.remove("mountainBlocked");
        cell.classList.add("goal");
        cell.textContent = "🏁";
        setGoalCell(cell)
    }
    if (cellValue === greenFlat) {
        cell.classList.remove("start");
        cell.classList.remove("greyHill");
        cell.classList.remove("mountainBlocked");
        cell.classList.remove("goal");
        cell.classList.add("greenFlat");
        cell.textContent = "";
    }
    if (cellValue === greyHill) {
        cell.classList.remove("start");
        cell.classList.remove("greenFlat");
        cell.classList.remove("mountainBlocked");
        cell.classList.remove("goal");
        cell.classList.add("greyHill");
        cell.textContent = "";
    }
    if (cellValue === mountainBlocked) {
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