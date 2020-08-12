function convertArrayOfObjectsToCSV(args) {
    var result, ctr, keys, columnDelimiter, lineDelimiter, data;

    data = args.data || null;
    if (data == null || !data.length) {
        return null;
    }

    columnDelimiter = args.columnDelimiter || ',';
    lineDelimiter = args.lineDelimiter || '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function (item) {
        ctr = 0;
        keys.forEach(function (key) {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];
            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
}


function buildTable(data) {
    var table = document.createElement("table");
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var headRow = document.createElement("tr");
    ["ID", "Updated", "Confirmed",
        "ConfirmedChange", "Deaths", "DeathsChange",
        "Recovered", "RecoveredChange", "Latitude",
        "Longitude", "ISO2", "ISO3", "Country_Region",
        "AdminRegion1", "AdminRegion2"].forEach(function (el) {
            var th = document.createElement("th");
            th.appendChild(document.createTextNode(el));
            headRow.appendChild(th);
        });
    thead.appendChild(headRow);
    table.appendChild(thead);
    data.forEach(function (el) {
        var tr = document.createElement("tr");
        for (var o in el) {
            var td = document.createElement("td");
            td.appendChild(document.createTextNode(el[o]))
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
}

function addDataToTbody(nl, data) { // nl -> NodeList, data -> array with objects
    data.forEach((d, i) => {
        var tr = nl.insertRow(i);
        Object.keys(d).forEach((k, j) => { // Keys from object represent th.innerHTML
            var cell = tr.insertCell(j);
            cell.innerHTML = d[k]; // Assign object values to cells   
        });
        nl.appendChild(tr);
    })
}



var filters = {
    'Country_Region': ['Australia'],
};

d3.csv("https://raw.githubusercontent.com/microsoft/Bing-COVID-19-Data/master/data/Bing-COVID19-Data.csv").then((function (d) {
    d = d.filter(function (row) {
        return ['Country_Region'].reduce(function (pass, column) {
            return pass && (
                // pass if no filter is set
                !filters[column] ||
                // pass if the row's value is equal to the filter
                // (i.e. the filter is set to a string)
                row[column] === filters[column] ||
                // pass if the row's value is in an array of filter values
                filters[column].indexOf(row[column]) >= 0
            );
        }, true);
    })

    //var mainTable = document.createElement("table")
    //var tbody = document.createElement("tbody")
    //mainTable.appendChild(tbody)
    //var tbody = document.querySelector("#dataTable");
    document.getElementById("content").appendChild(buildTable(d));
    //addDataToTbody(tbody, d);
    // //console.log(d.length, d);
    // var csvContent = convertArrayOfObjectsToCSV({
    //     data: d
    // });
    // if (csvContent == null) return;

    // //console.log("CSV" + csvContent)

    // if (!csvContent.match(/^data:text\/csv/i)) {
    //     csvContent = 'data:text/csv;charset=utf-8,' + csvContent;
    // }

    // var data = encodeURI(csvContent);

    // //console.log("data" + data)


    // var link = document.createElement("a");
    // link.setAttribute("href", data);
    // link.setAttribute("download", "Covid-19.csv");
    // document.body.appendChild(link); // Required for FF

    // link.click(); // This will download the data file named "Covid-19.csv".
}))
