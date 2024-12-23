# Dijsktra's algorithm

### pseudokode

```
dijkstra(adjacencyList, startCell) {
    initiate empty priority queue pq
    initiate empty dictionary{} distances
    initiate empty dictionary{} prev

    add to distances <-- startCell, with a distance of 0
    add to pq <-- startCell, with a distance of 0

    for vertex v in adjacencyList {
        if v !== start {
            add to priority queue <-- v with a distance of infinity (expected: {A: 0, B: Infinity, C: Infinity,...})
            add vertex to pq (expected: {A: 0, B: Infinity, C: Infinity,...})
        }
        add vertex to prev with value undefined (expected: {A: undefined, B: undefined, C: undefined,...})
    }

    while pq is not empty {
        current = pq.extractMinimum

        foreach neighbour of graph[current]
            distance = graph[current] + graph[currentNeighbour] // calculate distance from graph[current] to currentNeighbour

            if (distance < distances[currentNeighbour])
                prev[neighbour] = graph[current] // updates route. fx {0,1: undefined} => {0,1: 0,0} travelled from 0,0 to 0,1
                distances[neighbour] = distance // updates infinity
                update pq(neighbour) with new distances // pq will rearrange itself
    }

    return prev, distances // prev holds the route of the shortest path
}
```
