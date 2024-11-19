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

    var data = {"OkPercent": 0.0, "KoPercent": 100.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "authors POST"], "isController": false}, {"data": [0.0, 500, 1500, "activities DELETE "], "isController": false}, {"data": [0.0, 500, 1500, "users DELETE"], "isController": false}, {"data": [0.0, 500, 1500, "coverPhotos all GET"], "isController": false}, {"data": [0.0, 500, 1500, "coverPhotosCoverPhotosForBook  GET"], "isController": false}, {"data": [0.0, 500, 1500, "authors all GET"], "isController": false}, {"data": [0.0, 500, 1500, "authors DELETE"], "isController": false}, {"data": [0.0, 500, 1500, "users all GET"], "isController": false}, {"data": [0.0, 500, 1500, "books PUT"], "isController": false}, {"data": [0.0, 500, 1500, "books POST"], "isController": false}, {"data": [0.0, 500, 1500, "activities GET"], "isController": false}, {"data": [0.0, 500, 1500, "activities PUT "], "isController": false}, {"data": [0.0, 500, 1500, "authors PUT"], "isController": false}, {"data": [0.0, 500, 1500, "books GET"], "isController": false}, {"data": [0.0, 500, 1500, "books DELETE"], "isController": false}, {"data": [0.0, 500, 1500, "coverPhotos POST"], "isController": false}, {"data": [0.0, 500, 1500, "users PUT"], "isController": false}, {"data": [0.0, 500, 1500, "users POST"], "isController": false}, {"data": [0.0, 500, 1500, "authors GET"], "isController": false}, {"data": [0.0, 500, 1500, "users GET"], "isController": false}, {"data": [0.0, 500, 1500, "activities POST"], "isController": false}, {"data": [0.0, 500, 1500, "coverPhotos GET"], "isController": false}, {"data": [0.0, 500, 1500, "books all GET"], "isController": false}, {"data": [0.0, 500, 1500, "coverPhotos DELETE"], "isController": false}, {"data": [0.0, 500, 1500, "coverPhotos PUT"], "isController": false}, {"data": [0.0, 500, 1500, "activities all GET"], "isController": false}, {"data": [0.0, 500, 1500, "authorsAuthorsForBook GET "], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 31194, 31194, 100.0, 189.1508944027688, 2, 64848, 20.0, 69.0, 176.0, 775.0, 262.17190691107135, 73.27954019691889, 61.70631879921921], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["authors POST", 1157, 1157, 100.0, 40.38807260155577, 2, 813, 25.0, 85.20000000000005, 119.0, 282.0400000000045, 22.0561602836609, 6.117138203671579, 6.423099365909221], "isController": false}, {"data": ["activities DELETE ", 1163, 1163, 100.0, 48.17024935511599, 2, 826, 22.0, 92.0, 137.5999999999999, 811.3599999999999, 22.08968831316834, 6.255868760565253, 4.640123298875572], "isController": false}, {"data": ["users DELETE", 1143, 1143, 100.0, 34.329833770778656, 2, 605, 19.0, 74.0, 104.0, 275.6799999999985, 22.59965200885796, 6.400292072821101, 4.636856846626858], "isController": false}, {"data": ["coverPhotos all GET", 1153, 1153, 100.0, 107.6435385949698, 2, 5889, 24.0, 104.60000000000014, 192.29999999999995, 5862.84, 22.14029225953876, 6.140471681356453, 4.151304798663517], "isController": false}, {"data": ["coverPhotosCoverPhotosForBook  GET", 1149, 1149, 100.0, 79.83550913838133, 2, 5892, 23.0, 90.0, 147.5, 502.5, 22.13020030816641, 6.137672741718028, 4.129926449345146], "isController": false}, {"data": ["authors all GET", 1158, 1158, 100.0, 39.31692573402418, 2, 5536, 22.0, 70.0, 105.04999999999995, 245.25000000000205, 22.05336228075187, 6.116362195052277, 4.048859481231789], "isController": false}, {"data": ["authors DELETE", 1156, 1156, 100.0, 41.72837370242222, 2, 5518, 25.0, 83.0, 113.0, 176.88000000000102, 22.072863362101884, 6.2511038818452604, 4.571898211353395], "isController": false}, {"data": ["users all GET", 1146, 1146, 100.0, 49.43455497382208, 2, 1054, 23.0, 92.29999999999995, 141.64999999999986, 547.53, 22.16334345446458, 6.146864786199161, 4.025763557158605], "isController": false}, {"data": ["books PUT", 1154, 1154, 100.0, 55.519064124783306, 2, 5890, 24.0, 76.0, 106.25, 211.70000000000027, 22.09754322807958, 6.258093297014725, 8.463441934109492], "isController": false}, {"data": ["books POST", 1153, 1153, 100.0, 88.68950563746752, 2, 5885, 26.0, 80.0, 114.29999999999995, 517.5400000000018, 22.09362484910035, 6.127528766742675, 8.567690618592753], "isController": false}, {"data": ["activities GET", 1166, 1166, 100.0, 88.65351629502571, 2, 1182, 26.0, 142.29999999999995, 235.44999999999823, 1156.33, 21.649120852596596, 6.004248361462337, 4.082455172301751], "isController": false}, {"data": ["activities PUT ", 1164, 1164, 100.0, 49.25429553264595, 2, 5481, 23.0, 103.5, 155.0, 317.6499999999983, 22.096930349108717, 6.25791972777493, 6.978666863621695], "isController": false}, {"data": ["authors PUT", 1157, 1157, 100.0, 37.88159031979251, 2, 470, 25.0, 81.0, 113.09999999999991, 174.0, 22.080152671755727, 6.253168237118321, 6.324397662213741], "isController": false}, {"data": ["books GET", 1155, 1155, 100.0, 54.31341991341986, 2, 5536, 24.0, 76.0, 108.0, 212.32000000000016, 22.101033295063147, 6.12958345292767, 4.059741855625718], "isController": false}, {"data": ["books DELETE", 1153, 1153, 100.0, 95.22029488291417, 2, 5900, 24.0, 80.60000000000014, 144.0, 3142.4600000001838, 22.119904076738607, 6.2644259592326135, 4.538425509592326], "isController": false}, {"data": ["coverPhotos POST", 1149, 1149, 100.0, 46.73194081810274, 2, 1076, 24.0, 82.0, 121.5, 537.5, 22.187035356363566, 6.153435587116458, 6.203237691167668], "isController": false}, {"data": ["users PUT", 1143, 1143, 100.0, 36.54855643044624, 2, 606, 23.0, 79.0, 103.79999999999995, 249.2799999999993, 22.581346188039593, 6.3951078071596505, 6.267116902424087], "isController": false}, {"data": ["users POST", 1145, 1145, 100.0, 42.314410480349395, 2, 1038, 22.0, 88.0, 116.70000000000005, 383.119999999999, 22.167583055835205, 6.148040613141795, 6.171806180060791], "isController": false}, {"data": ["authors GET", 1162, 1162, 100.0, 37.045611015490465, 2, 812, 22.0, 75.0, 112.84999999999991, 265.3699999999999, 22.106805167132773, 6.13118424557198, 4.10398518801248], "isController": false}, {"data": ["users GET", 1145, 1145, 100.0, 48.247161572052406, 2, 1045, 23.0, 93.0, 127.70000000000005, 522.2599999999993, 22.154286709362847, 6.144352954549852, 4.069504842017685], "isController": false}, {"data": ["activities POST", 1165, 1165, 100.0, 43.994849785407744, 2, 345, 24.0, 126.0, 163.0, 197.33999999999992, 22.063140351873944, 6.11907408196504, 6.944296488835862], "isController": false}, {"data": ["coverPhotos GET", 1152, 1152, 100.0, 61.84201388888876, 2, 5881, 23.0, 96.0, 146.69999999999982, 341.94000000000005, 22.15086430672794, 6.143403772569077, 4.198672324158286], "isController": false}, {"data": ["books all GET", 1155, 1155, 100.0, 41.489177489177486, 2, 5535, 24.0, 73.40000000000009, 107.0, 247.7200000000007, 22.077375946173255, 6.123022235071488, 4.010148365222876], "isController": false}, {"data": ["coverPhotos DELETE", 1148, 1148, 100.0, 56.053135888501714, 2, 1049, 23.0, 87.0, 140.84999999999968, 1017.51, 22.185289684226802, 6.282943367603293, 4.68184210494531], "isController": false}, {"data": ["coverPhotos PUT", 1149, 1149, 100.0, 60.64664926022628, 2, 5877, 24.0, 77.0, 110.5, 466.0, 22.152813927931057, 6.2737461319336, 6.1308965418763375], "isController": false}, {"data": ["activities all GET", 1192, 1192, 100.0, 3565.514261744967, 62, 64848, 732.0, 976.7, 6213.0, 64761.49, 10.018237899531867, 2.778495667448291, 1.868636170713463], "isController": false}, {"data": ["authorsAuthorsForBook GET ", 1162, 1162, 100.0, 44.74096385542172, 2, 827, 22.0, 81.0, 129.0, 812.3699999999999, 22.09335488164274, 6.127453892955605, 4.144639313385303], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 19664, 63.03776367250112, 63.03776367250112], "isController": false}, {"data": ["405/Not Allowed", 11530, 36.96223632749888, 36.96223632749888], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 31194, 31194, "404/Not Found", 19664, "405/Not Allowed", 11530, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["authors POST", 1157, 1157, "404/Not Found", 1157, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities DELETE ", 1163, 1163, "405/Not Allowed", 1163, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users DELETE", 1143, 1143, "405/Not Allowed", 1143, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos all GET", 1153, 1153, "404/Not Found", 1153, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotosCoverPhotosForBook  GET", 1149, 1149, "404/Not Found", 1149, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authors all GET", 1158, 1158, "404/Not Found", 1158, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authors DELETE", 1156, 1156, "405/Not Allowed", 1156, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users all GET", 1146, 1146, "404/Not Found", 1146, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books PUT", 1154, 1154, "405/Not Allowed", 1154, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books POST", 1153, 1153, "404/Not Found", 1153, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities GET", 1166, 1166, "404/Not Found", 1166, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities PUT ", 1164, 1164, "405/Not Allowed", 1164, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authors PUT", 1157, 1157, "405/Not Allowed", 1157, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books GET", 1155, 1155, "404/Not Found", 1155, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books DELETE", 1153, 1153, "405/Not Allowed", 1153, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos POST", 1149, 1149, "404/Not Found", 1149, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users PUT", 1143, 1143, "405/Not Allowed", 1143, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users POST", 1145, 1145, "404/Not Found", 1145, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authors GET", 1162, 1162, "404/Not Found", 1162, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users GET", 1145, 1145, "404/Not Found", 1145, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities POST", 1165, 1165, "404/Not Found", 1165, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos GET", 1152, 1152, "404/Not Found", 1152, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books all GET", 1155, 1155, "404/Not Found", 1155, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos DELETE", 1148, 1148, "405/Not Allowed", 1148, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos PUT", 1149, 1149, "405/Not Allowed", 1149, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities all GET", 1192, 1192, "404/Not Found", 1192, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authorsAuthorsForBook GET ", 1162, 1162, "404/Not Found", 1162, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
