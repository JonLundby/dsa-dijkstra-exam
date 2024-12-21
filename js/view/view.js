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
            cell.classList.add("available");
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
        cell.classList.remove("available");
        cell.classList.remove("costly");
        cell.classList.remove("blocked");
        cell.classList.add("start");
    }
    if (cellValue === 1) {
        cell.classList.remove("start");
        cell.classList.remove("costly");
        cell.classList.remove("blocked");
        cell.classList.remove("goal");
        cell.classList.add("available");
    }
    if (cellValue === 2) {
        cell.classList.remove("start");
        cell.classList.remove("available");
        cell.classList.remove("blocked");
        cell.classList.remove("goal");
        cell.classList.add("costly");
    }
    if (cellValue === 3) {
        cell.classList.remove("start");
        cell.classList.remove("available");
        cell.classList.remove("blocked");
        cell.classList.remove("goal");
        cell.classList.add("blocked");
    }
    if (cellValue === 4) {
        cell.classList.remove("start");
        cell.classList.remove("available");
        cell.classList.remove("costly");
        cell.classList.remove("blocked");
        cell.classList.add("goal");
    }
}
