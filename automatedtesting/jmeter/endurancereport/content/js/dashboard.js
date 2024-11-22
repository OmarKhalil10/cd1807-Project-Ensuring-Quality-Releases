/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 62.944828010079696, "KoPercent": 37.055171989920304};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6170484112187826, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.6256212037548315, 500, 1500, "authors POST"], "isController": false}, {"data": [0.6229711141678129, 500, 1500, "activities DELETE "], "isController": false}, {"data": [0.6347971095052807, 500, 1500, "users DELETE"], "isController": false}, {"data": [0.6326587191571943, 500, 1500, "coverPhotos all GET"], "isController": false}, {"data": [0.6332223147377186, 500, 1500, "coverPhotosCoverPhotosForBook  GET"], "isController": false}, {"data": [0.6255172413793103, 500, 1500, "authors all GET"], "isController": false}, {"data": [0.6281094527363185, 500, 1500, "authors DELETE"], "isController": false}, {"data": [0.634407109136351, 500, 1500, "users all GET"], "isController": false}, {"data": [0.6316154059296204, 500, 1500, "books PUT"], "isController": false}, {"data": [0.6308203991130821, 500, 1500, "books POST"], "isController": false}, {"data": [0.6176631925397696, 500, 1500, "activities GET"], "isController": false}, {"data": [0.6213912565301072, 500, 1500, "activities PUT "], "isController": false}, {"data": [0.6272450953302017, 500, 1500, "authors PUT"], "isController": false}, {"data": [0.6305370985603543, 500, 1500, "books GET"], "isController": false}, {"data": [0.6315497643471029, 500, 1500, "books DELETE"], "isController": false}, {"data": [0.6334998612267555, 500, 1500, "coverPhotos POST"], "isController": false}, {"data": [0.6352140077821011, 500, 1500, "users PUT"], "isController": false}, {"data": [0.6352777777777778, 500, 1500, "users POST"], "isController": false}, {"data": [0.6257237386269644, 500, 1500, "authors GET"], "isController": false}, {"data": [0.6348236600944183, 500, 1500, "users GET"], "isController": false}, {"data": [0.6195443315948395, 500, 1500, "activities POST"], "isController": false}, {"data": [0.632630410654828, 500, 1500, "coverPhotos GET"], "isController": false}, {"data": [0.6241703539823009, 500, 1500, "books all GET"], "isController": false}, {"data": [0.6338517078589281, 500, 1500, "coverPhotos DELETE"], "isController": false}, {"data": [0.6337774077157924, 500, 1500, "coverPhotos PUT"], "isController": false}, {"data": [0.30235745614035087, 500, 1500, "activities all GET"], "isController": false}, {"data": [0.6247590195538419, 500, 1500, "authorsAuthorsForBook GET "], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 97622, 36174, 37.055171989920304, 59.26980598635583, 0, 3696, 48.0, 71.0, 89.0, 736.9900000000016, 815.1265415862996, 4312.150049407475, 150.19076739059642], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["authors POST", 3622, 1353, 37.355052457205964, 48.51049144119273, 0, 854, 29.0, 79.0, 108.0, 674.54, 31.38892981255037, 45.62855009002001, 7.0081441170671885], "isController": false}, {"data": ["activities DELETE ", 3635, 1368, 37.63411279229711, 41.90123796423668, 0, 927, 23.0, 68.0, 82.0, 677.9199999999996, 31.380301630739744, 44.71644928595785, 4.7401770645389645], "isController": false}, {"data": ["users DELETE", 3598, 1314, 36.52028904947193, 29.51556420233464, 0, 824, 18.0, 59.0, 69.04999999999973, 143.00999999999976, 31.651638442929404, 41.88888277985485, 5.477925005498131], "isController": false}, {"data": ["coverPhotos all GET", 3607, 1324, 36.706404214028275, 30.540892708622096, 0, 931, 17.0, 60.0, 71.0, 179.1200000000008, 31.532476615088733, 442.52134453678207, 4.81904012588513], "isController": false}, {"data": ["coverPhotosCoverPhotosForBook  GET", 3603, 1320, 36.63613655287261, 28.540105467665835, 0, 801, 17.0, 59.0, 68.0, 126.96000000000004, 31.570369591504125, 45.22447195150535, 4.8303759386555205], "isController": false}, {"data": ["authors all GET", 3625, 1357, 37.43448275862069, 49.11613793103445, 0, 955, 28.0, 75.0, 121.69999999999982, 668.7399999999998, 31.346742532989747, 942.5829351035956, 4.3436856851317], "isController": false}, {"data": ["authors DELETE", 3618, 1344, 37.14759535655058, 37.10226644555, 0, 878, 20.0, 65.0, 80.0, 584.6199999999999, 31.39834590250718, 43.202955839567295, 5.078008045392219], "isController": false}, {"data": ["users all GET", 3601, 1314, 36.48986392668703, 28.231324632046615, 0, 867, 16.0, 57.80000000000018, 67.0, 156.72000000000025, 31.6096242132706, 53.31272946274172, 4.776953437030925], "isController": false}, {"data": ["books PUT", 3609, 1328, 36.796896647270714, 33.99390412856744, 0, 1008, 20.0, 63.0, 75.0, 155.40000000000055, 31.491597005287865, 46.484773798668435, 9.648226511644648], "isController": false}, {"data": ["books POST", 3608, 1332, 36.91796008869179, 33.23004434589798, 0, 829, 19.0, 61.0, 74.0, 181.8199999999997, 31.508990716724742, 46.427488807998635, 9.861612240408883], "isController": false}, {"data": ["activities GET", 3646, 1390, 38.123971475589684, 57.0282501371366, 0, 874, 33.0, 72.0, 103.0, 740.5299999999997, 31.425887139175483, 48.49305057253553, 4.017905001012765], "isController": false}, {"data": ["activities PUT ", 3637, 1374, 37.77838878196316, 42.540830354687884, 0, 867, 22.0, 68.0, 85.0, 680.6199999999999, 31.388625183395185, 47.56788993052559, 7.009859513894882], "isController": false}, {"data": ["authors PUT", 3619, 1346, 37.19259463940315, 35.62862669245646, 0, 848, 20.0, 63.0, 76.0, 222.20000000000073, 31.4042988918682, 45.39211883834899, 6.951881999041123], "isController": false}, {"data": ["books GET", 3612, 1332, 36.87707641196013, 52.55149501661119, 0, 845, 42.0, 88.0, 121.34999999999991, 268.5699999999988, 31.468622855699117, 53.17079543053728, 4.593011297057004], "isController": false}, {"data": ["books DELETE", 3607, 1326, 36.76185195453285, 31.813418353202156, 0, 849, 19.0, 61.20000000000027, 72.0, 149.0, 31.5247600901956, 42.534896716425735, 5.241497663719869], "isController": false}, {"data": ["coverPhotos POST", 3603, 1320, 36.63613655287261, 29.866777685262278, 0, 849, 18.0, 60.0, 69.0, 118.88000000000011, 31.587529807827185, 44.1693506496353, 7.29949304776266], "isController": false}, {"data": ["users PUT", 3598, 1312, 36.46470261256253, 29.70261256253471, 0, 1041, 18.0, 60.0, 70.0, 122.0, 31.63939183425813, 43.89902584715395, 7.375310111986564], "isController": false}, {"data": ["users POST", 3600, 1312, 36.44444444444444, 30.249722222222196, 0, 826, 18.0, 60.0, 69.0, 135.0, 31.64111939249051, 43.94586182498946, 7.3754175556576085], "isController": false}, {"data": ["authors GET", 3627, 1357, 37.41384063964709, 38.811414392059596, 0, 888, 19.0, 66.0, 77.0, 644.7199999999998, 31.349669389342665, 46.29340108961062, 4.335601554734431], "isController": false}, {"data": ["users GET", 3601, 1315, 36.51763399055818, 26.639266870313744, 0, 836, 17.0, 57.0, 65.0, 103.0, 31.611566620432956, 44.001027159194656, 4.840788610267395], "isController": false}, {"data": ["activities POST", 3643, 1384, 37.990667032665385, 48.70354103760636, 0, 844, 23.0, 71.0, 101.0, 703.1199999999999, 31.406796903288097, 47.94220229063572, 6.8783443944298845], "isController": false}, {"data": ["coverPhotos GET", 3604, 1324, 36.736958934517205, 34.18756936736965, 0, 770, 23.0, 66.0, 79.0, 143.0, 31.534369312613748, 45.28185681403559, 4.881009557543225], "isController": false}, {"data": ["books all GET", 3616, 1340, 37.057522123893804, 54.256913716814026, 0, 3137, 22.5, 104.0, 168.14999999999964, 627.8299999999999, 31.386709256301646, 1943.6492379543956, 4.485518176906118], "isController": false}, {"data": ["coverPhotos DELETE", 3601, 1318, 36.60094418217162, 29.145515134684867, 0, 794, 18.0, 60.0, 69.0, 126.88000000000011, 31.592707620501482, 42.17883463781562, 5.52288752281062], "isController": false}, {"data": ["coverPhotos PUT", 3603, 1319, 36.60838190396891, 30.35664723841242, 0, 902, 18.0, 61.0, 71.0, 124.92000000000007, 31.570369591504125, 44.20997680195573, 7.187599602084537], "isController": false}, {"data": ["activities all GET", 3648, 1393, 38.18530701754386, 621.8810307017546, 2, 3696, 745.5, 1012.0, 1078.0, 3674.5099999999998, 30.467790834607, 98.26682891569158, 3.727882755276323], "isController": false}, {"data": ["authorsAuthorsForBook GET ", 3631, 1358, 37.400165243734506, 40.29220600385564, 0, 890, 19.0, 65.0, 76.0, 693.0, 31.370956593862317, 49.5457901030507, 4.312917610740081], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 122, 0.33725880466633495, 0.12497183012025978], "isController": false}, {"data": ["403/Site Disabled", 14904, 41.200862497926686, 15.267050459937309], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 21148, 58.46187869740698, 21.663149699862736], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 97622, 36174, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 21148, "403/Site Disabled", 14904, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 122, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["authors POST", 3622, 1353, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 842, "403/Site Disabled", 508, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 3, "", "", "", ""], "isController": false}, {"data": ["activities DELETE ", 3635, 1368, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1016, "403/Site Disabled", 347, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 5, "", "", "", ""], "isController": false}, {"data": ["users DELETE", 3598, 1314, "403/Site Disabled", 751, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 559, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 4, "", "", "", ""], "isController": false}, {"data": ["coverPhotos all GET", 3607, 1324, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 663, "403/Site Disabled", 657, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 4, "", "", "", ""], "isController": false}, {"data": ["coverPhotosCoverPhotosForBook  GET", 3603, 1320, "403/Site Disabled", 671, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 646, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 3, "", "", "", ""], "isController": false}, {"data": ["authors all GET", 3625, 1357, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 880, "403/Site Disabled", 468, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 9, "", "", "", ""], "isController": false}, {"data": ["authors DELETE", 3618, 1344, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 789, "403/Site Disabled", 551, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 4, "", "", "", ""], "isController": false}, {"data": ["users all GET", 3601, 1314, "403/Site Disabled", 709, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 604, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": ["books PUT", 3609, 1328, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 720, "403/Site Disabled", 606, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 2, "", "", "", ""], "isController": false}, {"data": ["books POST", 3608, 1332, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 694, "403/Site Disabled", 636, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 2, "", "", "", ""], "isController": false}, {"data": ["activities GET", 3646, 1390, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1159, "403/Site Disabled", 216, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 15, "", "", "", ""], "isController": false}, {"data": ["activities PUT ", 3637, 1374, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1052, "403/Site Disabled", 309, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 13, "", "", "", ""], "isController": false}, {"data": ["authors PUT", 3619, 1346, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 814, "403/Site Disabled", 524, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 8, "", "", "", ""], "isController": false}, {"data": ["books GET", 3612, 1332, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 741, "403/Site Disabled", 590, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": ["books DELETE", 3607, 1326, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 679, "403/Site Disabled", 642, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 5, "", "", "", ""], "isController": false}, {"data": ["coverPhotos POST", 3603, 1320, "403/Site Disabled", 695, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 624, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": ["users PUT", 3598, 1312, "403/Site Disabled", 736, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 572, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 4, "", "", "", ""], "isController": false}, {"data": ["users POST", 3600, 1312, "403/Site Disabled", 726, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 582, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 4, "", "", "", ""], "isController": false}, {"data": ["authors GET", 3627, 1357, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 919, "403/Site Disabled", 432, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 6, "", "", "", ""], "isController": false}, {"data": ["users GET", 3601, 1315, "403/Site Disabled", 716, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 597, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 2, "", "", "", ""], "isController": false}, {"data": ["activities POST", 3643, 1384, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1095, "403/Site Disabled", 276, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 13, "", "", "", ""], "isController": false}, {"data": ["coverPhotos GET", 3604, 1324, "403/Site Disabled", 663, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 661, "", "", "", "", "", ""], "isController": false}, {"data": ["books all GET", 3616, 1340, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 765, "403/Site Disabled", 569, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 6, "", "", "", ""], "isController": false}, {"data": ["coverPhotos DELETE", 3601, 1318, "403/Site Disabled", 700, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 615, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 3, "", "", "", ""], "isController": false}, {"data": ["coverPhotos PUT", 3603, 1319, "403/Site Disabled", 680, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 638, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": ["activities all GET", 3648, 1393, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1255, "403/Site Disabled", 138, "", "", "", "", "", ""], "isController": false}, {"data": ["authorsAuthorsForBook GET ", 3631, 1358, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 967, "403/Site Disabled", 388, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 3, "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
