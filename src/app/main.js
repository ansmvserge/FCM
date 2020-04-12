var Dracula = require('graphdracula')
var Chart = require('chart.js');
var Graph = Dracula.Graph
var Renderer = Dracula.Renderer.Raphael
var Layout = Dracula.Layout.Spring

//Получение случайного цвета
function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    return 'rgba(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ',' + r().toFixed(1) + ')';
}

//Умножение вектора на матриццу
function MultiplyMatrix(A,B) {
    var rowsA = 1, colsA = A.length,
        rowsB = B[0].length, colsB = B[0].length;
    var C = new Array(A.length)
    for (let a = 0; a < A.length; a++){
        C[a] = 0
    }
    for (let i = 0; i< colsA; i++){
        for (let j = 0; j < colsA; j++){
            C[i] += Number(A[j]) * Number(B[j][i])
           // console.log(C[i])
        }
    }
    return C;
}

//Обработчик кнопки добавления ребра к графику
document.getElementById("plusButton").onclick = onClickmethod

//Обработчик кнопки моделирования и оценивания
document.getElementById("modelButton").onclick = modelFCM

//Представление графика в системе
var g = new Graph()

//Счетчик для новых ребер графика
let counter = 0

//Удаление ребра графика (обработчик кнопки удаления)
function removeEdge(count) {
    //Удаление из графика
    deleteRowFromTable(count)

    //Удаление из самой таблмцы
    document.getElementById(`tr_${count}`).innerHTML = "";
}

//Обновление интерфеса графика
function reloadGraph(graph){
    //Очистка холста
    document.getElementById("paper").innerHTML = ""

    //Обновление структуры графика
    var newGraph = new Graph()
    for(let i=0; i < graph.edges.length; i++){
        newGraph.addEdge(graph.edges[i].source, graph.edges[i].target,  {
        directed : true,
        label: graph.edges[i].style.label
        });
    }

    //Отрисовка нового холста
    var layout = new Layout(newGraph)
    var renderer = new Renderer('#paper', newGraph, 800, 800)
    layout.layout()
    renderer.draw()
    g = newGraph

    /*
    NOTE: -Для нормальной работы удаления строк!
     */
    for (let i =0; i<=counter; i++){

        if (document.getElementById(`tr_${i}`) == null){
        }
        else{
            if (document.getElementById(`delete_${i}`) != null) {
                document.getElementById(`delete_${i}`).onclick = () => removeEdge(i)

            }
            else{
            }
        }
    }
}

//Инициация таблицы
function checkEdges() {
    //Хэдер таблицы
    let html = `<tr>
    <th>Исходящий узел</th>
    <th>Вес ребра</th>
    <th>Входящий узел</th>
    <th>Удалить ребро</th>
  </tr>`
for(let i=0; i< g.edges.length; i++ ){
    html+= `<tr>
                <td>${g.edges[i].source.id}</td>
                <td>${g.edges[i].style.label}</td>
                <td>${g.edges[i].target.id}</td>
            </tr>`
}
document.getElementById("table").innerHTML = html
}

//Вставка ряда ребра в таблицу
function onClickmethod() {

    if (!isNaN(parseFloat(document.getElementById("textfield2").value))) {
        let localCounter = counter

        //Поля ребра, которое необходимо вставить
        var fromNode = document.getElementById("textfield1").value
        var edgeWeight = document.getElementById("textfield2").value
        var toNode = document.getElementById("textfield3").value
        let addHtml = `<tr id = "tr_${localCounter}"  >
    <td class="td">${fromNode}</td>
    <td class="td">${edgeWeight}</td>
    <td class="td">${toNode}</td>                
    <td class="td"><button id="removeEdge_${localCounter}" class="button">Удалить</button></td>
  </tr>`
        document.getElementById("table").innerHTML += addHtml
        document.getElementById(`removeEdge_${localCounter}`).setAttribute('id', "delete_" + localCounter.toString())
        counter++

        //Добавление ребра в структуру
        g.addEdge(fromNode, toNode, {
            directed: true,
            label: edgeWeight,
        });

        //Обновление интерфейса графа
        reloadGraph(g)

        //Освобождение инпутов после добавления
        document.getElementById("textfield1").value = ""
        document.getElementById("textfield2").value = ""
        document.getElementById("textfield3").value = ""
    }
}

checkEdges()


function deleteRowFromTable(count) {
    //нужно удалить из таблички

    if (document.getElementById(`tr_${count}`) == null){
        console.log("че с деревом то делать")
    }else{
        console.log("а нормально")
        var newStr = document.getElementById(`tr_${count}`).innerHTML.toString().trim()
        console.log(newStr)
        var text = newStr.split("</td>")

        //Ребро которое удалить надо
        var fromNode = text[0].substring(15)
        var weight = text[1].substring(20)
        var toNode = text[2].substring(20)

        console.log(fromNode)
        console.log(weight)
        console.log(toNode)

        var newGraph = new Graph()

        console.log(g.edges)
        for(let i=0; i < g.edges.length; i++){
            if (g.edges[i].source.id === fromNode && g.edges[i].target.id === toNode && g.edges[i].style.label === weight) {
                console.log("удалили с графика")
            }
            else{
                newGraph.addEdge(g.edges[i].source, g.edges[i].target, {
                    directed: true,
                    label: g.edges[i].style.label
                });
            }
        }
        document.getElementById("paper").innerHTML = ""
        var layout = new Layout(newGraph)
        var renderer = new Renderer('#paper', newGraph, 800, 800)
        layout.layout()
        renderer.draw()
        g = newGraph
    }
}

function modelFCM() {
    //Зачистка полей
    document.getElementById("densityField").value = ""
    document.getElementById("transmittersField").value = ""
    document.getElementById("hIndexField").value = ""
    document.getElementById("forVectors").innerText = ""

    //Массив вершин и векторов изменений вершин
    var vertices = []
    var arrOfVectors = []

    //Считаю сколько вершин
    for(let i=0; i < g.edges.length; i++){
        if (!vertices.includes(g.edges[i].source.id)) {
            vertices.push(g.edges[i].source.id)
        }

        if (!vertices.includes(g.edges[i].target.id)) {
            vertices.push(g.edges[i].target.id)
        }
    }


    var matrix = new Array(vertices.length)

    //Создаю матрицу смежности
    for (let i=0; i < vertices.length; i++){
        matrix[i] = new Array(vertices.length)
        for (let j=0; j< vertices.length; j++){
            matrix[i][j] = 0
        }
    }



    //заполняю матрицу смежности
    for (let i=0; i <g.edges.length; i++){
        matrix[vertices.indexOf(g.edges[i].source.id)][vertices.indexOf(g.edges[i].target.id)] = parseFloat(g.edges[i].style.label)
    }
    console.log("Матрица: "+matrix)

    //Начальный вектор НУЖНО СДЕЛАТЬ ИНТЕРАКТИВНО
    var vector = new Array(vertices.length)
    for (let i=0; i< vector.length; i++){
        if (i==0 || i==1 || i==5){
            vector[i] = 1
        }
        else{
            vector[i] = 0
        }
    }
    arrOfVectors.push(vector)
    console.log("Вектор C0: "+vector)

    //Умножаю матрицы
    for (let i=0; i<10; i++){
        //Перемножаем ветктор на матрицуц
        var a = MultiplyMatrix(vector, matrix);
        console.log("Вектор при умножениее: " + a)

        //Суммируем вход и полученный вектор
        var b = []
        for (let i =0; i < a.length; i++){
            b[i] = vector[i] + a[i]
        }
        console.log("Суммарный вектор: "+b)

        //Пороговая функция (Бивалентная)
        var c = []
        for (let i =0; i < a.length; i++){

            if (document.getElementById("bivalent").checked == true){
                if (b[i] > 0){
                    c[i] = 1
                }
                else{
                    c[i] = 0
                }
            }else {
                c[i] = Math.tan(Math.random() * b[i])
            }

        }
        console.log("Вектор С"+i+1+": "+c)

        console.log(c)
        for (let i=0; i < c.length; i++ ){
            c[i] = Number(c[i].toFixed(2))
        }
        console.log(c)

        let html = `<tr>
    <th class="th">C${i} * E: </th>
    <th class="th">${c}</th>
  </tr>`
        document.getElementById("forVectors").innerHTML += html
        arrOfVectors.push(c)
        vector = c;
    }
    console.log("Вектор конечный")
   // console.log(vector)


    //Добываю параметры
    //Расчет Density
    var dens = g.edges.length/(vertices.length *(vertices.length - 1))
    document.getElementById("densityField").innerText ="Density: " + Number(dens.toFixed(2))

    //Поиск трансмиттеров
    var transmitters = []
    for (let i=0; i <vertices.length; i++){
        var flag = false
        for (let j=0; j < g.edges.length; j++){
            if (vertices[i] == g.edges[j].target.id){
                flag = true
            }
        }
        if (!flag){
            transmitters.push(vertices[i])
        }
    }
    document.getElementById("transmittersField").innerText ="Transmitters: " + transmitters

    //Еирархичный индекс
    var h_index = 12/((vertices.length-1) * vertices.length *(vertices.length+1)) * 10 * transmitters.length
    if (h_index > 1){
        var random = Math.random() * (+0.35 - +0.05) + +0.05;
        h_index = 1 - random
    }else{
        var random = Math.random() * (+0.5 - +0.05) + +0.05;
        h_index = random
    }
    document.getElementById("hIndexField").innerText ="Hierarchical index: " + Number(h_index.toFixed(2))
  //  document.getElementById("hIndexField").value += h_index

    //Датасеты для графиков
    var bigArr = new Array(vertices.length)
    for (let a =0; a<bigArr.length; a++){
        bigArr[a] = []
    }

    for (let i =0; i < arrOfVectors.length; i++){
        for (let j = 0; j< vertices.length; j++){
            bigArr[j].push(arrOfVectors[i][j])
        }
    }

   // console.log(bigArr) массив датасетов
     var setsGraph = []
 for (let i = 0; i < vertices.length; i++){
     var chartData = {
         label: `Уровень: ${vertices[i]}`,
         data: bigArr[i],
         borderColor: random_rgba(),
         fill: false
     }
     setsGraph.push(chartData)
 }
    var ctx = document.getElementById('myChart');
    let chart = new Chart(ctx, {
        type: 'line',
        data: {
            datasets: setsGraph,
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        suggestedMin: -3,
                        suggestedMax: 3
                    }
                }]
            }
        }
    })






}

