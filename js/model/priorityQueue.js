// min heap class (PriorityQueue)
export default class PriorityQueue {
    constructor() {
        this.queue = [];
    }

    // finder forældren til elementet på index i
    // ... math.floor i tilfælde af fx i = 4 => (4-1)/2 => 3/2 => 1.5 => floor 1 (altså må parent til index 4 være index 1)
    getParentIndex(i) {
        return Math.floor((i - 1) / 2);
    }

    left(i) {
        return 2 * i + 1;
    }
    right(i) {
        return 2 * i + 2;
    }

    insert(node) {
        // pusher den modtagne node til køen
        this.queue.push(node);

        let queue = this.queue;
        let i = queue.length - 1;

        // while i ikke er out of bounds og parent til indsatte node har større værdi end indsatte node
        while (i > 0 && queue[this.getParentIndex(i)].weight > queue[i].weight) {
            // hvis parentObj er noget så findes parents index og bytter med
            let p = this.getParentIndex(i);
            let temp = queue[i]; // holder på queue[i] objektet før det overskrives
            queue[i] = queue[p]; // overskriver queue[i] med dens parent(queue[p])
            queue[p] = temp; // parent
            i = p; // i sættes til parents index så loopet kan boble videre op om nødvendigt
        }
    }

    extractMin() {
        // hvis køen kun har 1 node så kan den bare extractes/poppes og intet skal rearrangeres/heapifies
        if (this.size() == 1) {
            return this.queue.shift();
        }

        let queue = this.queue;

        // gemmer root som senere kan returneres
        let rootTemp = queue[0];

        //overskriver roden med sidst indsatte child og fjerner sidst indsatte child (som er slutningen af q/arr)
        queue[0] = queue[queue.length - 1];
        queue.pop();

        // kalder miHeapify til at rearrangere
        this.minHeapify(0);

        // returnere den oprindelige root som skulle extractes
        return rootTemp;
    }

    minHeapify(i) {
        let queue = this.queue;
        // hvis der kun er et element i køen så er der ikke noget at heapify/rearrangere
        if (queue.length === 1) {
            return;
        }

        let leftIndex = this.left(i);
        let rightIndex = this.right(i);
        let lowestValueIndex = i;

        // leftIndex < queue.length = out of bounds check
        // hvis venstre child har lavere værdi end parent så sættes leftIndex som værende den der har den lavere værdi
        if (leftIndex < queue.length && queue[leftIndex].weight < queue[i].weight) {
            lowestValueIndex = leftIndex;
        }
        // hvis højre child er mindre end i's value eller venstre's value...
        // ... (i tilfælde af at venstre child skulle have overskrevet lowestValue som ellers er index i som udgangspunkt)
        if (rightIndex < queue.length && queue[rightIndex].weight < queue[lowestValueIndex].weight) {
            lowestValueIndex = rightIndex;
        }
        // hvis left eller right child har en værdi mindre end i's værdi så skal i og child bytte plads
        if (lowestValueIndex !== i) {
            let temp = queue[i];
            queue[i] = queue[lowestValueIndex];
            queue[lowestValueIndex] = temp;
            this.minHeapify(lowestValueIndex); // minHeapify kaldes igen med index af enten left eller right child så ombytning forsætter
        }
    }

    peek() {
        return this.queue[0];
    }

    size() {
        return this.queue.length;
    }
}
