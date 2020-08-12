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

    //console.log(d.length, d);
    var csvContent = convertArrayOfObjectsToCSV({
        data: d
    });
    if (d == null) return;

    d = 'data:text/csv;charset=utf-8,' + d;

    //console.log("CSV" + d);

    var data = encodeURI(d);


    var link = document.createElement("a");
    link.setAttribute("href", data);
    link.setAttribute("download", "Covid-19.csv");
    document.body.appendChild(link); // Required for FF

    link.click(); // This will download the data file named "Covid-19.csv".
}))
