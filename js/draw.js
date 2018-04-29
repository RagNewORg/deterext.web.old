google.charts.load('current', {packages: ['corechart', 'line', 'table']});
//google.charts.setOnLoadCallback(drawBasic);

function draw(size,array,my_title) {
    console.log(array);
    console.log(size);
    var data = new google.visualization.DataTable();

    data.addColumn('number', 'size');
    data.addColumn('number', 'time');

    data.addRows(array);

    var options = {
        title: my_title,
        vAxis: {title:"Time (ms)"},
        hAxis: {title:"File Size (MB)"},
        width: 900,
        height: 500
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));

    chart.draw(data, options);
}
