(function () {

    var myConnector = tableau.makeConnector();


    myConnector.getSchema = function (schemaCallback) {

        var source = tableau.connectionData;

        $.ajax({
            url: source,
            dataType: "text"
        }).done(successFunction);

        function successFunction(data) {
            var data = data.replace(/\"/g, "");
            var data = data.replace(/ /g, '');
            var allRows = data.split(/\r?\n|\r/);
            var cols = [];
            for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
                var rowCells = allRows[singleRow].split(',');
                for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
                    if (singleRow === 0) {
                        x = rowCells[rowCell];

                        y = {
                            id: x,
                            alias: x,
                            dataType: tableau.dataTypeEnum.string
                        };
                        cols.push(y);
                    }
                }
            }
            console.log(cols);
            var tableInfo = {
                id: "Covid19CSV",
                alias: "covid19csv",
                columns: cols
            };

            schemaCallback([tableInfo]);
        }


    };

    myConnector.getData = function (table, doneCallback) {

        var source = tableau.connectionData;

        $.ajax({
            url: source,
            dataType: "text",
        }).done(successFunction);

        function successFunction(data) {
            var data = data.replace(/\"/g, "");
            var allRows = data.split(/\r?\n|\r/);
            var tableData = [];
            var cols = [];
            for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
                var rowCells = allRows[singleRow].split(',');
                for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
                    if (singleRow === 0) {
                        x = rowCells[rowCell];
                        y = {
                            id: x,
                            alias: x,
                            dataType: tableau.dataTypeEnum.string
                        };
                        cols.push(y);
                    }
                }
                if (singleRow != 0) {
                    x = rowCells;

                    tableData.push(x);
                }
            }

            table.appendRows(tableData);
            doneCallback();
        }
    };

    tableau.registerConnector(myConnector);
})();




$(document).ready(function () {

    $("#submitButton").click(function () {
        datasource = "https://raw.githubusercontent.com/microsoft/Bing-COVID-19-Data/master/data/Bing-COVID19-Data.csv";
        tableau.connectionData = datasource;
        tableau.connectionName = "Covid19CSV";
        tableau.submit();

    });
});