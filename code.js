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
                    'min': 400,
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



function cleanCUIPairs(rawData, filtIndex, filtVals, sval) {
    console.log(sval)
    searchVal = sval.toLowerCase().trim()
    keys = Object.keys(rawData)
    allEdges = []
    for (var i = 0; i < keys.length; i++) {

        edge = rawData[keys[i]]

        rawscores = edge["scores"]
        scores = rawscores.substring(1, rawscores.length - 1).split(", ");

        cui1 = edge["cui1"]
        cui2 = edge["cui2"]
        name1 = edge["name1"]
        name2 = edge["name2"]
        works = true;

        if (searchVal != "") {
            if (!name1.toLowerCase().includes(searchVal) && !name2.toLowerCase().includes(searchVal)) {
                if (searchVal.length == 8 && !isNaN(searchVal.substring(1, searchVal.length))) {
                    if (!cui1.toLowerCase().includes(searchVal) && !cui2.toLowerCase().includes(searchVal)) {
                        works = false;

                    } else {
                        works = true;
                    }
                } else {
                    works = false;
                }
            }

        }
        for (j = 0; j < filtIndex.length; j++) {
            index = filtIndex[j];


            if (parseInt(scores[index]) < filtVals[j]) {
                works = false;

            }
        }

        if (works) {

            allEdges.push({

                data: {
                    id: cui1 + "->" + cui2,
                    source: cui1,
                    target: cui2,
                    options: {
                        type: "ppInt",
                        name1: name1,
                        name2: name2,
                        scores: scores,
                        gene1: edge["gene1"],
                        gene2: edge["gene2"]

                    },

                },
            })

        }


    }
    return allEdges;

}

function geneCUIs(rawData, sval) {
    console.log(sval)
    searchVal = sval.toLowerCase().trim()
    keys = Object.keys(rawData)
    allEdges = []
    for (var i = 0; i < keys.length; i++) {
        edge = rawData[keys[i]]
        cui1 = edge["cui1"]
        cui2 = edge["cui2"]
        name1 = edge["name1"]
        name2 = edge["name2"]
        works = true;

        if (searchVal != "") {
            if (!name1.toLowerCase().includes(searchVal) && !name2.toLowerCase().includes(searchVal)) {
                if (searchVal.length == 8 && !isNaN(searchVal.substring(1, searchVal.length))) {
                    if (!cui1.toLowerCase().includes(searchVal) && !cui2.toLowerCase().includes(searchVal)) {
                        works = false;

                    } else {
                        works = true;
                    }
                } else {
                    works = false;
                }
            }

        }
        if (works) {

            allEdges.push({

                data: {
                    id: cui1 + "->" + cui2,
                    source: cui1,
                    target: cui2,
                    options: {
                        type: "geneInt",
                        name1: name1,
                        name2: name2,
                        gene: edge["gene"],
                    },

                },
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
                    id: edges[i]["data"]["target"],
                    name: edges[i]["data"]["options"]["name2"]
                },
            });
        }
        if (nodes.indexOf(edges[i]["data"]["source"]) == -1) {

            nodes.push(edges[i]["data"]["source"])
            cytoNodes.push({
                data: {
                    id: edges[i]["data"]["source"],

                    name: edges[i]["data"]["options"]["name1"]
                },
            });
        }
    }
    return cytoNodes;
}

function getedges(rawData, filtIndex, filtVals, sval, geneInts, geneData) {
    edges = (cleanCUIPairs(rawData, filtIndex, filtVals, sval))
    if (geneInts) {
        edges = edges.concat(geneCUIs(geneData, sval))
    }
    return edges
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
    componentSpacing: 10,
    nodeRepulsion: 400000,
    edgeElasticity: 100,
    nestingFactor: 5,
    gravity: 100,
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
            "selection-box-opacity": "0.5",
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
            "label": "data(name)",
            "overlay-padding": "6px",
            "z-index": "10",
        },
                    },
    {
        "selector": ':selected',
        "style": {
            'background-color': 'blue',
            "z-index": "100"
        }
      }]
var data = []
var gene_data = []

function makeGraph() {

    getNet = document.getElementById('net').checked
    nameFilt = document.getElementById('icon_prefix').value;
    filts = getScores(window.sliders, window.score_index)
    genes = document.getElementById('genes').checked;
    console.log(genes);
    edges = getedges(window.data, filts["filtIndex"], filts["filtVals"], nameFilt, genes, window.gene_data);
    nodes = getNodesFromEdge(edges)
    circle = window.cicle;
    cose = window.cose;
    layout = circle
    if (getNet) {
        layout = cose
    }
    console.log(getNet);
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
    cy.on('select', 'node', function (event) {
        clearTimeout(cy.nodesSelectionTimeout);
        cy.nodesSelectionTimeout = setTimeout(function () {
            node = cy.$('node:selected')
            tdata = node[0]["_private"]["data"]
            redges = cy.$('node:selected')[0].connectedEdges()
            edges = []
            for (i = 0; i < redges.length; i++) {
                edges.push(redges[i][0]["_private"]["data"])
            }
            innerText = "CUI: " + tdata["id"] + "<br>" + "Name: " + tdata["name"] + "<hr> Edges: <br>"
            allStr = [innerText]
            for (i = 0; i < edges.length; i++) {
                opt = edges[i]["options"]
                if (opt["type"] == "ppInt") {
                    start = "Type: Protein Interaction <br> "
                    newStr = "CUI1: " + edges[i]["source"] + " <br> CUI2: " + edges[i]["target"]
                    moreStr = "<br> Gene1: " + opt["gene1"] + " <br> Gene2: " + opt["gene2"]
                    moreStr2 = "<br> Name1: " + opt["name1"] + " <br> Name2: " + opt["name2"]
                    moreStr3 = " <br> Scores: " + opt["scores"].join(", ") + "<hr>"
                    curr = [start, newStr, moreStr, moreStr2, moreStr3]

                    allStr.push(curr.join(" "))
                } else {
                    start = "Type: Common Gene Interaction <br> "
                    newStr = "CUI1: " + edges[i]["source"] + " <br> CUI2: " + edges[i]["target"]
                    moreStr = "<br> Gene: " + opt["gene"]
                    moreStr2 = "<br> Name1: " + opt["name1"] + " <br> Name2: " + opt["name2"]
                    moreStr3 = "<hr>"

                    curr = [start, newStr, moreStr, moreStr2, moreStr3]

                    allStr.push(curr.join(" "))

                }
            }
            document.getElementById("select").innerHTML = allStr.join(" ")
        }, 300)
    })
    cy.on('select', 'edge', function (event) {
        clearTimeout(cy.nodesSelectionTimeout);
        cy.nodesSelectionTimeout = setTimeout(function () {
            edge = cy.$('edge:selected')
            tdata = edge[0]["_private"]["data"]
            opt = tdata["options"]

            curr = []

            if (opt["type"] == "ppInt") {
                start = "Type: Protein Interaction <br> "

                newStr = "CUI1: " + tdata["source"] + " <br> CUI2: " + tdata["target"]
                moreStr = "<br> Gene1: " + opt["gene1"] + " <br> Gene2: " + opt["gene2"]
                moreStr2 = "<br> Name1: " + opt["name1"] + " <br> Name2: " + opt["name2"]
                moreStr3 = " <br> Scores: " + opt["scores"].join(", ") + ""
                curr = [start, newStr, moreStr, moreStr2, moreStr3]
            } else {
                start = "Type: Common Gene Interaction <br> "
                newStr = "CUI1: " + tdata["source"] + " <br> CUI2: " + tdata["target"]
                moreStr = "<br> Gene: " + opt["gene"]
                moreStr2 = "<br> Name1: " + opt["name1"] + " <br> Name2: " + opt["name2"]
                moreStr3 = "<hr>"

                curr = [start, newStr, moreStr, moreStr2, moreStr3]


            }

            document.getElementById("select").innerHTML = curr.join(" ")

        }, 300)
    })
    window.cy = cy;
}
Promise.all([
  fetch('libraries/cleanCuiPair40det.json', {
            mode: 'no-cors'
        })
    .then(function (res) {
            return res.json()
        }),
      fetch('libraries/geneInteraction.json', {
            mode: 'no-cors'
        })
    .then(function (res) {
            return res.json()
        }),

])
    .then(function (dataArray) {

        window.data = dataArray[0]
        window.gene_data = dataArray[1]

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
} **/
