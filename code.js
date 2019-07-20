var score_index = ["neighborhood", "neighboorood_transferred", "fusion", "cooccurence", "homology", "coexpression", "coexpression_transferred", "experiments", "experiments_transferred", "database", "database_transferred", "textmining", "textmining_transferred", "combined_score"]
console.log(score_index.length)
var headers = document.getElementsByClassName("range-header");
var sliders = document.getElementsByClassName("range-slider");

setSlidersAndHeaders(headers, sliders, score_index);
var getNet = document.getElementById('net').checked



function setSlidersAndHeaders(headers, sliders, scoreIndexes) {

    for (i = 0; i < headers.length; i++) {
        headers[i].innerHTML = scoreIndexes[i]

    }
    for (i = 0; i < sliders.length; i++) {
        if (scoreIndexes[i] == "combined_score") {
            noUiSlider.create(sliders[i], {
                start: [990],
                connect: true,
                step: 1,
                range: {
                    'min': 700,
                    'max': 1000
                },
                format: wNumb({
                    decimals: 0
                })
            });
        } else if (scoreIndexes[i] == "experiments") {
            noUiSlider.create(sliders[i], {
                start: [900],
                connect: true,
                step: 1,
                range: {
                    'min': 0,
                    'max': 1000
                },
                format: wNumb({
                    decimals: 0
                })
            });
        } else {

            noUiSlider.create(sliders[i], {
                start: [0],
                connect: true,
                step: 1,
                range: {
                    'min': 0,
                    'max': 1000
                },
                format: wNumb({
                    decimals: 0
                })
            });

        }
    }

}

function getScores(sliders, score_index) {
    filtIndex = []
    filtVals = []
    for (i = 0; i < sliders.length; i++) {

        score = sliders[i].noUiSlider.get();
        if (score != 0) {
            filtIndex.push(i)
            filtVals.push(score)
        }
    }
    return {
        filtIndex: filtIndex,
        filtVals: filtVals
    }
}

function parseStringCUIS(rawStr) {
    string = rawStr;
    string = string.substring(1, string.length - 1);
    newStr = string.split("]");
    allEdges = []
    cuis = []
    scores = []
    for (i = 0; i < newStr.length; i++) {
        spot = i % 3
        if (spot == 0) {
            news = newStr[i].split("[")
            cuiStr = news[news.length - 1]
            cuis = cuiStr.split(",")
        }
        if (spot == 0) {
            news = newStr[i].split("[")
            cuiStr = news[news.length - 1]
            oldscores = cuiStr.split(",")
            for (j = 0; j < oldscores.length; j++) {
                scores.push(parseInt(oldscores[j]))
            }
        }
        if (spot == 0) {

            allEdges.push({
                cuis: cuis,
                scores: scores
            })
            cuis = []
            scores = []
        }
    }
}

function cleanCUIPairs(rawData, filtIndex, filtVals) {
    alz = ['C1863052', 'C2931257', 'C0002395', 'C1843013', 'C0494463', 'C0750901', 'C1863051', 'C1867751', 'C1834153', 'C1856170', 'C4015786', 'C1847200', 'C3549448', 'C4015781', 'C4015780', 'C1843015']
    keys = Object.keys(rawData)
    allEdges = []
    for (var i = 0; i < keys.length; i++) {
        edge = rawData[keys[i]]
        scores = edge["scores"]
        cui1 = edge["cui1"]
        cui2 = edge["cui2"]
        works = true;
        for (j = 0; j < filtIndex.length; j++) {
            index = filtIndex[j];
            if (scores[index] < filtVals[j]) {
                works = false;
            }


        }
        if (works) {
            if (alz.indexOf(cui1) != -1 && alz.indexOf(cui2) == -1) {
                console.log(cui1)
                console.log(cui2)
            }
            allEdges.push({

                data: {
                    id: cui1 + "->" + cui2,
                    source: cui1,
                    target: cui2,
                }
            })
        }

    }
    return allEdges;

}

function getNodesFromEdge(edges) {
    nodes = []
    cytoNodes = []
    for (i = edges.length - 1; i >= 0; i--) {
        if (nodes.indexOf(edges[i]["data"]["target"]) == -1) {

            nodes.push(edges[i]["data"]["target"])
            cytoNodes.push({
                data: {
                    id: edges[i]["data"]["target"]
                }
            });
        }
        if (nodes.indexOf(edges[i]["data"]["source"]) == -1) {

            nodes.push(edges[i]["data"]["source"])
            cytoNodes.push({
                data: {
                    id: edges[i]["data"]["source"]
                }
            });
        }
    }
    return cytoNodes;
}

function getedges(rawData, filtIndex, filtVals) {
    console.log("runn")
    return (cleanCUIPairs(rawData, filtIndex, filtVals))
}
var cicle = {
    name: 'circle',

    fit: true, // whether to fit the viewport to the graph
    padding: 30, // the padding on fit
    boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
    avoidOverlap: true, // prevents node overlap, may overflow boundingBox and radius if not enough space
    nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
    spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    radius: undefined, // the radius of the circle
    startAngle: 3 / 2 * Math.PI, // where nodes start in radians
    sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
    clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
    sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
    animate: false, // whether to transition the node positions
    animationDuration: 500, // duration of animation in ms if enabled
    animationEasing: undefined, // easing of animation if enabled
    animateFilter: function (node, i) {
        return true;
    }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
    ready: undefined, // callback on layoutready
    stop: undefined, // callback on layoutstop
    transform: function (node, position) {
        return position;
    }
}
var cose = {
    name: 'cose',
    idealEdgeLength: 100,
    nodeOverlap: 20,
    refresh: 20,
    fit: true,
    padding: 30,
    randomize: false,
    componentSpacing: 100,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 80,
    numIter: 1000,
    initialTemp: 200,
    coolingFactor: 0.95,
    minTemp: 1.0
}
var styles = [{
    "selector": "core",
    "style": {
        "selection-box-color": "#AAD8FF",
        "selection-box-border-color": "#8BB0D0",
        "selection-box-opacity": "0.5"
    }
                    }, {
    "selector": "node",
    "style": {
        "width": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        "height": "mapData(score, 0, 0.006769776522008331, 20, 60)",
        "content": "data(name)",
        "font-size": "12px",
        "text-valign": "center",
        "text-halign": "center",
        "background-color": "#555",
        "text-outline-color": "#555",
        "text-outline-width": "2px",
        "color": "#fff",
        "label": "data(id)",
        "overlay-padding": "6px",
        "z-index": "10"
    }
                    }]
var data = []

function makeGraph() {
    getNet = document.getElementById('net').checked

    filts = getScores(window.sliders, window.score_index)
    edges = getedges(window.data, filts["filtIndex"], filts["filtVals"]);
    nodes = getNodesFromEdge(edges)
    circle = window.cicle;
    cose = window.cose;
    layout = circle
    if (getNet) {
        layout = cose
    }
    styles = window.styles;
    var cy = window.cy = cytoscape({
        container: document.getElementById('cy'),
        layout: layout,
        style: styles,
        elements: {
            nodes: nodes,
            edges: edges
        }


    });
}
Promise.all([
  fetch('cleanCuiPair70.json', {
            mode: 'no-cors'
        })
    .then(function (res) {
            return res.json()
        }),

])
    .then(function (dataArray) {

        window.data = dataArray[0]
        makeGraph();

    });
$("#newFilts").click(function () {
    makeGraph();
});
/**

Promise.all([
  fetch('cy-style.json', {
            mode: 'no-cors'
        })
    .then(function (res) {
            return res.json()
        }),
  fetch('data.json', {
            mode: 'no-cors'
        })
    .then(function (res) {
            return res.json()
        })

])
    .then(function (dataArray) {
        var cy = window.cy = cytoscape({
            container: document.getElementById('cy'),

            layout: {
                name: 'cose',
                idealEdgeLength: 100,
                nodeOverlap: 20,
                refresh: 20,
                fit: true,
                padding: 30,
                randomize: false,
                componentSpacing: 100,
                nodeRepulsion: 400000,
                edgeElasticity: 100,
                nestingFactor: 5,
                gravity: 80,
                numIter: 1000,
                initialTemp: 200,
                coolingFactor: 0.95,
                minTemp: 1.0
            },

            style: dataArray[0],

            elements: dataArray[1]

        });
    });
    
    function edgesByDiseases(name, filteredEdges, convert) {
    edges = []
    sourceCUIs = matchCUIs(name, convert);
    sourceCUIs = sourceCUIs.filter(function (item, i, ar) {
        return ar.indexOf(item) === i;
    });
    for (i = filteredEdges.length - 1; i >= 0; i--) {
        edge = filteredEdges[i]
        for (j = 0; j < edge["endGene"].length; j++) {
            endCUIs = matchCUIs(edge["endGene"][j], convert);
            endCUIs = endCUIs.filter(function (item, i, ar) {
                return ar.indexOf(item) === i;
            });
            //newArr = pairs(sourceCUIs.concat(endCUIs));

            for (k = 0; k < sourceCUIs.length; k++) {
                const sources = k
                for (l = 0; l < endCUIs.length; l++) {
                    const end = l

                    edges.push({
                        data: {
                            id: sourceCUIs[sources] + "2" + endCUIs[end],
                            source: sourceCUIs[sources],
                            target: endCUIs[end],
                        }
                    })
                }
            }
        }
    }
    return edges
}
function getAllNodes(rawData) {
    nodes = [];
    console.log(rawData)
    for (const key of Object.keys(rawData)) {
        nodes.push({
            data: {
                id: rawData[key]["name"]
            }
        });
    }
    return nodes;
}
function parseString(rawStr) {
    stripped = rawStr.substring(1, rawStr.length - 1);
    connections = []
    rawArr = stripped.split("(");
    for (i = 0; i < rawArr.length; i++) {
        tempStr = rawArr[i];
        if (tempStr.length > 10) {
            tempStr = tempStr.substring(0, rawStr.length - 1);
            prots = tempStr.split("]");
            genes2 = prots[0].substring(1, prots[0].length).split(",");
            genes = [];
            for (j = 0; j < genes2.length; j++) {
                genes.push(genes2[j].split("'")[1])
            }
            rawScores = prots[1].split(")")[0].split(",");
            source = rawScores[2].split("'")[1]
            target = rawScores[3].split("'")[1]
            scoringArr = []
            for (j = 4; j < 18; j++) {
                scoringArr.push(parseInt(rawScores[j]))
            }
            connections.push({
                endGene: genes,
                startID: source,
                endID: target,
                scores: scoringArr,
            })
        }

    }
    //console.log(genes.length);
    return (connections);

}
function getEdges(name, filteredEdges) {
    cytoEdges = []
    for (i = filteredEdges.length - 1; i >= 0; i--) {
        edge = filteredEdges[i]
        for (j = 0; j < edge["endGene"].length; j++) {
            cytoEdges.push({
                data: {
                    id: name + "2" + edge["endGene"][j],
                    source: name,
                    target: edge["endGene"][j],
                }
            });
        }
    }
    return cytoEdges;
}
function edgeFilters(edges, filtIndex, filtVals) {
    newEdges = edges;
    for (i = newEdges.length - 1; i >= 0; i--) {
        edge = newEdges[i];
        for (j = 0; j < filtIndex.length; j++) {
            index = filtIndex[j];
            if (edge["scores"][index] < filtVals[j]) {
                newEdges.splice(i, 1);
                break;
            }
        }

    }
    return newEdges;

}
function rand(){

    edges = [];
    //console.log(rawData)
    keys = Object.keys(rawData)
    filtIndex = [13]
    filtVals = [990]

    edgescon = []
    
    for (var i = 0; i < keys.length; i++) {
        const j = i;
        key = keys[j]
        console.log(i)
        //moreEdges = getEdgesCUIs(rawData[key]["cui"], edgeFilters(parseStringCUIS(rawData[key]["related"]), filtIndex, filtVals));
        //moreEdges = getEdges(rawData[key]["name"], edgeFilters(parseString(rawData[key]["related"]), filtIndex, filtVals));
        //moreEdges = edgesByDiseases(rawData[key]["name"], edgeFilters(parseString(rawData[key]["related"]), filtIndex, filtVals), conversion);

        edgescon.push(removeDups(moreEdges));
    }
    
    edges = cuiCommonGene(conversion)
    newEdges = []
    for (i = 0; i < edges.length; i++) {
        newEdges.push({

            data: {
                id: edges[i],
                source: edges[i].split(";")[0],
                target: edges[i].split(";")[1]

            }
        })
    }
    console.log(new Date().toLocaleTimeString());
    //edges = removeDups(edges)
    
    arr1d = [].concat.apply([], edgescon);
console.log(new Date().toLocaleTimeString());
//arr1d = removeDups(arr1d)


console.log(new Date().toLocaleTimeString());

//console.log(rawData["1"]["name"])


    edges = getEdges(rawData[keys[0]]["name"], edgeFilters(parseString(rawData[keys[1]]["related"]), filtIndex, filtVals));
    edges2 = getEdges(rawData["2"]["name"], edgeFilters(parseString(rawData["2"]["related"]), filtIndex, filtVals));
    //edges3 = getEdges(rawData["3"]["name"], edgeFilters(parseString(rawData["3"]["related"]), filtIndex, filtVals));
    cuiEdges = edgesByDiseases(rawData["3"]["name"], edgeFilters(parseString(rawData["3"]["related"]), filtIndex, filtVals), conversion)
    console.log(cuiEdges)
    edges.push.apply(edges, edges2);
    edges.push.apply(edges, cuiEdges);
    //console.log(edges);
//console.log(newEdges)
// return arr1d;
} **/
