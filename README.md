# Dijsktra's algorithm

### pseudokode

```
dijkstra(adjacencyList, startCellIndex) {
    instantiere ny PriorityQueue = priorityQueue
    startCell = adjacencyList[startCellIndex] // finder startcellen i adjacency-listen
    sæt startCell til at være 0 væk fra sig selv
    sæt startCell's vægt til nul
    sæt startCell til at være besøgt

    tilføj startcellen til priorityQueue

    for hver celle c i adjacencyList {
        if c !== startCell {
            indsæt alle andre celler fra adjacency-listen til priorityQueue //alle cellers distanceFromStart er Infinity som default
        }
    }

    while priorityQueue ikke er tom {
        u = pq.extractMinimum // fjerner celle med "højeste" fra prioritets køen (cellen med mindste distance fra start)

        if( u === målet hvor algoritmen skal finde hen) {
            bryd ud af while loop
        }

        for hver nabo n af u
            ny distance = u's distance fra start + n's vægt (det som det koster at gå til n)

            if (distance < n's nuværende distance fra start)
                n's distance fra start = ny distance
                n's forgænger = u

                // n's distance fra start opdateres og priorityQueue rearrangere sig selv
                priorityQueue.decreasePriority(n.distanceFromStart, ny distance)
            }

    returner adjacency liste med opdaterede celler (distance fra start & forgængere)
}
```
