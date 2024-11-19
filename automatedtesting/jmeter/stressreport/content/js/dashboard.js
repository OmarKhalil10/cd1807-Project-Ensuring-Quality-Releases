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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2700, 2700, 100.0, 173.24370370370343, 3, 3503, 66.0, 263.0, 379.0, 3131.169999999982, 329.54961552544853, 92.11369461735629, 77.58028004088857], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["authors POST", 100, 100, 100.0, 77.04000000000002, 4, 268, 69.5, 124.80000000000001, 252.89999999999998, 267.98, 30.441400304414003, 8.442732115677321, 8.864868721461187], "isController": false}, {"data": ["activities DELETE ", 100, 100, 100.0, 96.66999999999999, 5, 494, 79.5, 153.60000000000002, 220.59999999999945, 492.8999999999994, 28.28854314002829, 8.011403818953324, 5.942251591230551], "isController": false}, {"data": ["users DELETE", 100, 100, 100.0, 57.929999999999986, 4, 156, 47.5, 117.40000000000003, 126.79999999999995, 155.98, 60.16847172081829, 17.039899217809868, 12.345113191937426], "isController": false}, {"data": ["coverPhotos all GET", 100, 100, 100.0, 74.33999999999997, 11, 457, 46.5, 209.70000000000002, 289.9, 456.5599999999998, 36.54970760233918, 10.136832967836256, 6.853070175438596], "isController": false}, {"data": ["coverPhotosCoverPhotosForBook  GET", 100, 100, 100.0, 69.90999999999997, 4, 344, 48.0, 170.00000000000034, 260.54999999999967, 343.2999999999996, 39.635354736424894, 10.99261791518034, 7.3967932520808555], "isController": false}, {"data": ["authors all GET", 100, 100, 100.0, 62.94999999999999, 4, 404, 54.0, 102.9, 152.5499999999999, 403.6299999999998, 30.084235860409144, 8.343674789410349, 5.523277677496992], "isController": false}, {"data": ["authors DELETE", 100, 100, 100.0, 129.84000000000003, 44, 783, 113.0, 263.9, 270.84999999999997, 779.3799999999982, 30.712530712530715, 8.697884674447176, 6.36145289465602], "isController": false}, {"data": ["users all GET", 100, 100, 100.0, 67.71000000000002, 6, 348, 51.5, 107.80000000000001, 191.74999999999926, 347.15999999999957, 44.9034575662326, 12.453693309384823, 8.15629209699147], "isController": false}, {"data": ["books PUT", 100, 100, 100.0, 146.31, 13, 769, 71.5, 360.5000000000001, 381.95, 768.7899999999998, 34.494653328734046, 9.768993618489134, 13.21172171438427], "isController": false}, {"data": ["books POST", 100, 100, 100.0, 126.61999999999999, 4, 744, 54.5, 350.10000000000014, 411.95, 743.96, 35.536602700781806, 9.855854655294953, 13.780844660625444], "isController": false}, {"data": ["activities GET", 100, 100, 100.0, 80.08999999999997, 4, 422, 47.5, 193.0, 292.9999999999993, 421.16999999999956, 27.870680044593087, 7.729758918617614, 5.255691715440356], "isController": false}, {"data": ["activities PUT ", 100, 100, 100.0, 98.14, 24, 376, 81.5, 142.9, 263.14999999999867, 375.8099999999999, 28.169014084507044, 7.977552816901409, 8.896346830985916], "isController": false}, {"data": ["authors PUT", 100, 100, 100.0, 119.09, 13, 276, 87.0, 260.9, 265.9, 275.99, 30.349013657056148, 8.594935508345978, 8.692739946889226], "isController": false}, {"data": ["books GET", 100, 100, 100.0, 93.11, 15, 332, 91.0, 149.3000000000001, 193.6499999999997, 331.87999999999994, 33.9097999321804, 9.404671074940659, 6.228938835198373], "isController": false}, {"data": ["books DELETE", 100, 100, 100.0, 86.15999999999997, 7, 411, 49.0, 294.0000000000001, 355.69999999999993, 410.8599999999999, 35.549235691432635, 10.067654639175258, 7.2938422058300745], "isController": false}, {"data": ["coverPhotos POST", 100, 100, 100.0, 100.74999999999999, 33, 290, 68.5, 226.80000000000007, 267.79999999999995, 289.9, 41.10152075626798, 11.399249897246198, 11.491567766132349], "isController": false}, {"data": ["users PUT", 100, 100, 100.0, 65.89999999999998, 5, 158, 52.5, 120.0, 124.89999999999998, 157.71999999999986, 56.022408963585434, 15.865721288515408, 15.548406862745098], "isController": false}, {"data": ["users POST", 100, 100, 100.0, 76.75999999999999, 11, 357, 74.0, 112.0, 121.84999999999997, 354.979999999999, 49.82561036372696, 13.818821624314896, 13.872345229197807], "isController": false}, {"data": ["authors GET", 100, 100, 100.0, 131.18999999999988, 5, 564, 77.0, 273.9, 489.74999999999994, 563.99, 28.75215641173088, 7.974230879815986, 5.337680599482461], "isController": false}, {"data": ["users GET", 100, 100, 100.0, 72.59, 3, 411, 60.0, 118.70000000000002, 129.69999999999993, 410.3499999999997, 50.02501250625313, 13.874124562281139, 9.189164894947472], "isController": false}, {"data": ["activities POST", 100, 100, 100.0, 70.65, 4, 287, 69.0, 127.50000000000003, 155.0999999999998, 286.5799999999998, 27.739251040221916, 7.693307905686546, 8.73082090846047], "isController": false}, {"data": ["coverPhotos GET", 100, 100, 100.0, 86.75000000000001, 3, 485, 49.0, 238.00000000000006, 299.79999999999995, 483.86999999999944, 37.18854592785422, 10.314010784678318, 7.049117934176274], "isController": false}, {"data": ["books all GET", 100, 100, 100.0, 92.79999999999998, 10, 379, 92.5, 128.8, 147.24999999999983, 379.0, 32.97065611605671, 9.144205407187604, 5.988810583580613], "isController": false}, {"data": ["coverPhotos DELETE", 100, 100, 100.0, 94.87999999999998, 11, 291, 80.0, 206.70000000000002, 221.84999999999997, 290.86999999999995, 41.631973355537056, 11.790304954204828, 8.785810002081599], "isController": false}, {"data": ["coverPhotos PUT", 100, 100, 100.0, 85.37000000000002, 4, 283, 55.0, 219.70000000000013, 275.79999999999995, 282.99, 39.57261574990107, 11.2070884447962, 10.952030569845666], "isController": false}, {"data": ["activities all GET", 100, 100, 100.0, 2301.509999999999, 719, 3503, 2176.5, 3499.0, 3501.0, 3503.0, 14.088475626937164, 3.9073506621583545, 2.627830903071288], "isController": false}, {"data": ["authorsAuthorsForBook GET ", 100, 100, 100.0, 112.52, 4, 488, 72.5, 272.0, 274.95, 486.91999999999945, 28.65329512893983, 7.946812320916905, 5.375291010028653], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["404/Not Found", 1700, 62.96296296296296, 62.96296296296296], "isController": false}, {"data": ["405/Not Allowed", 1000, 37.03703703703704, 37.03703703703704], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2700, 2700, "404/Not Found", 1700, "405/Not Allowed", 1000, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["authors POST", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities DELETE ", 100, 100, "405/Not Allowed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users DELETE", 100, 100, "405/Not Allowed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos all GET", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotosCoverPhotosForBook  GET", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authors all GET", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authors DELETE", 100, 100, "405/Not Allowed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users all GET", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books PUT", 100, 100, "405/Not Allowed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books POST", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities GET", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities PUT ", 100, 100, "405/Not Allowed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authors PUT", 100, 100, "405/Not Allowed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books GET", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books DELETE", 100, 100, "405/Not Allowed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos POST", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users PUT", 100, 100, "405/Not Allowed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users POST", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authors GET", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["users GET", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities POST", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos GET", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["books all GET", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos DELETE", 100, 100, "405/Not Allowed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos PUT", 100, 100, "405/Not Allowed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["activities all GET", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["authorsAuthorsForBook GET ", 100, 100, "404/Not Found", 100, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
