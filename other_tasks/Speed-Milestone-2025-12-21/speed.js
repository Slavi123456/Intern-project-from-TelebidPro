const graph = [
    [
        [3, 2],
        [2, 11],
        [4, 3],
        [3, 6],
    ],
    [
        [1, 11],
        [4, 8],
        [5, 7],
    ],
    [
        [1, 2],
        [1, 6],
        [5, 3],
        [6, 9],
    ],
    [
        [1, 3],
        [2, 8],
    ],
    [
        [2, 7],
        [3, 5],
        [6, 3],
    ],
    [
        [3, 9],
        [7, 6],
        [5, 3],
    ],
    [[6, 7]],
];
speed(graph);
function speed(graph) {
    for (const [neighbor,weight] of graph[0]) {
        const visited = new Set([0,neighbor]);
        const newMin = weight;
        const newMax = weight;
        traverseGraph(graph, visited, newMin, newMax);
    }
}
// traverseGraph(graph);
function traverseGraph(graph, visited, maxVal,minVal,startNode = 0) {
    // visited - върхове, които вече са посетени
    // const visited = new Set([startNode]);

    // min и max са началните стойности за метриката abs
    // let minVal = graph[startNode][1];
    // let maxVal = graph[startNode][1];
    // console.log(minVal, maxVal);
    // фронт - възможни кандидати за следващ връх
    let front = [];

    // добавяме началните съседи на стартовия връх
    // for (const [neighbor,weight] of graph[startNode]) {
    //     const newMin = Math.min(minVal, weight);
    //     const newMax = Math.max(maxVal, weight);
    //     front.push({ node: neighbor, min: newMin, max: newMax, abs: Math.abs(newMax - newMin) });
    // }

    while (front.length > 0) {
        // сортираме фронта по abs, най-малкото първо
        front.sort((a, b) => a.abs - b.abs);

        // избираме първия елемент
        const next = front.shift();
        if (visited.has(next.node)) continue;

        // добавяме към посетените
        visited.add(next.node);

        // обновяваме min/max
        minVal = next.min;
        maxVal = next.max;

        console.log(`Visit node: ${next.node}, current abs: ${next.abs}`);

        // добавяме новите кандидати към фронта
        for (const [neighbor, weight] of graph[next.node]) {
            if (!visited.has(neighbor)) {
                const newMin = Math.min(minVal, weight);
                const newMax = Math.max(maxVal, weight);
                front.push({ node: neighbor, min: newMin, max: newMax, abs: Math.abs(newMax - newMin) });
            }
        }
    }

    console.log(`Traversal complete. Min: ${minVal}, Max: ${maxVal}, abs: ${Math.abs(maxVal - minVal)}`);
}


// function speed(graph) {
//     let visited = [];
//     let resMin = null;
//     let resMax = null;
//     let abs = null;
//     for (const edge of graph[0]) {
//         visited.push(1);
//         visited.push(edge[0]);
//         // const { min, max } = 
//         smallesDiff(graph, min, max);

//         if (abs === null) {
//             abs = Math.abs(min - max);
//             resMin = min;
//             resMax = max;
//         } else {
//             const newAbs = Math.abs(min - max);
//             if (abs > newAbs) {
//                 abs = newAbs;
//                 resMin = min;
//                 resMax = max;
//             }
//         }
//         visited = [];
//     }
//     console.log(abs, `(${resMin},${resMax}))`);
// }

// function smallesDiff(graph, visited, min, max) {
//     const front = [];
//     //
//     for (const node of visited) {
//         for (const edge of graph[node]) {
//             if (!vecContains(visited, edge[0])) {
//                 const newMin = Math.min(min, edge[0]);
//                 const newMax = Math.max(max, edge[0]);
//                 front.push({ edge: edge, min: newMin, max: newMax, abs: Math.abs(newMin - newMax) });
//             }
//         }
//     }
//     front.sort((a, b) => a.abs - b.abs);
//     visited.push(front[0].edge[0]);
//     smallesDiff(graph, visited, front[0].newMin, front[0].newMax);
// }

// function vecContains(vec, target) {
//     for (const node of vec) {
//         if (node === target) {
//             return true;
//         }
//     }
//     return false;
// }
