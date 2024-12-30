# Dijkstra's algoritme

![alt text](/assets/Dijkstra_Path_01.png)

Deployet udgave: https://github.com/JonLundby/dsa-dijkstra-exam

### Beskrivelse:
I denne visualisering af Dijkstra’s algoritme kan man tegne med 2 farver i et grid af celler. Den ene farve (sort) repræsentere bjerge som er ufarbart terræn og den anden farve (grå) repræsentere bakker der er dyrere at rejse igennem end de grønne celler. Har man tegnet forkert kan man slette disse to farver ved at tegne over dem igen så en celle bliver grøn igen (museknappen kan holdes nede når man tegner). Man kan også tegne ”start” og ”goal” ind i griddet således får algoritmen et startpunkt at gå ud fra og et slutpunkt hvor den skal ende. Når både start og goal er sat aktiveres ”find path” knappen. Når man trykker på ”find path” knappen vil algoritmen finde den korteste (mindst kostbare) rute og tegne ruten in i griddet med hvide prikker. Undervejs vil man kunne se hvilke celler der bliver besøgt ved at iagttage det forsvindende omrids af en celle. Størrelsen på griddet kan justeres til max 50x50 og min 3x3. Desuden kan tiden justeres før eller imens algoritmen kører hvis man ønsker ændring i tempoet.


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
