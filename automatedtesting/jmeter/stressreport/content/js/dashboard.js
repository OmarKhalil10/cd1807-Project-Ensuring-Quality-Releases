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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2700, 2700, 100.0, 278.7118518518526, 0, 3240, 174.0, 377.0, 998.6999999999989, 2671.6199999999917, 236.19980754089755, 661.2785578962909, 19.19456617421923], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["authors POST", 100, 100, 100.0, 210.23999999999995, 0, 510, 213.5, 350.9, 405.4999999999999, 509.92999999999995, 33.23363243602525, 96.60406800432038, 1.8372616525423728], "isController": false}, {"data": ["activities DELETE ", 100, 100, 100.0, 184.36, 15, 494, 180.5, 324.00000000000006, 369.6499999999999, 493.77999999999986, 41.067761806981515, 118.8590862422998, 2.070633341889117], "isController": false}, {"data": ["users DELETE", 100, 100, 100.0, 112.09000000000007, 0, 2234, 67.5, 209.90000000000006, 260.39999999999986, 2217.9499999999916, 20.88118605136772, 55.79395815932345, 2.3564744727500524], "isController": false}, {"data": ["coverPhotos all GET", 100, 100, 100.0, 412.6899999999998, 1, 2220, 198.5, 1851.5000000000002, 1979.6499999999992, 2219.2699999999995, 17.421602787456447, 48.01829268292683, 1.17595818815331], "isController": false}, {"data": ["coverPhotosCoverPhotosForBook  GET", 100, 100, 100.0, 391.9099999999999, 1, 2211, 191.0, 1785.4000000000008, 2029.5499999999997, 2210.92, 17.51006828926633, 47.481525509980735, 1.6010426698476623], "isController": false}, {"data": ["authors all GET", 100, 100, 100.0, 242.07000000000005, 4, 570, 252.5, 418.8, 451.95, 569.2299999999996, 34.50655624568668, 100.5448261732229, 1.330389492753623], "isController": false}, {"data": ["authors DELETE", 100, 100, 100.0, 248.83000000000004, 1, 530, 252.5, 382.80000000000007, 434.5999999999999, 529.8299999999999, 29.036004645760745, 85.64005108522068, 0.8421575566202091], "isController": false}, {"data": ["users all GET", 100, 100, 100.0, 153.03000000000003, 0, 2159, 97.0, 227.20000000000005, 274.94999999999976, 2157.229999999999, 18.72308556450103, 49.60429197481745, 2.0405237783186667], "isController": false}, {"data": ["books PUT", 100, 100, 100.0, 252.20999999999995, 51, 1947, 234.5, 360.9000000000001, 388.74999999999994, 1931.6699999999921, 17.946877243359655, 53.112941941852114, 0.9639436019382628], "isController": false}, {"data": ["books POST", 100, 100, 100.0, 377.51, 0, 2265, 244.5, 446.3000000000003, 1960.35, 2264.94, 17.436791630340018, 50.63906522449869, 1.4209963491717523], "isController": false}, {"data": ["activities GET", 100, 100, 100.0, 116.84999999999997, 0, 418, 106.5, 207.8, 317.9999999999998, 417.15999999999957, 60.64281382656155, 168.229324590661, 2.7449164266221953], "isController": false}, {"data": ["activities PUT ", 100, 100, 100.0, 169.81999999999996, 4, 493, 159.0, 305.5, 336.84999999999997, 492.50999999999976, 48.61448711716091, 140.70096013612056, 3.6831171001458434], "isController": false}, {"data": ["authors PUT", 100, 100, 100.0, 218.51, 0, 415, 233.5, 362.5, 386.34999999999985, 414.96, 30.84515731030228, 89.84856955582974, 1.3241729642196176], "isController": false}, {"data": ["books GET", 100, 100, 100.0, 238.69999999999996, 0, 482, 239.5, 335.6, 418.2999999999996, 481.90999999999997, 28.61230329041488, 84.57701850858369, 0.6834540414878397], "isController": false}, {"data": ["books DELETE", 100, 100, 100.0, 497.34999999999997, 0, 2257, 235.0, 1918.0, 2067.0499999999993, 2255.5699999999993, 17.602534765006162, 49.44352611776096, 1.119583094965675], "isController": false}, {"data": ["coverPhotos POST", 100, 100, 100.0, 199.0799999999999, 21, 2022, 126.0, 288.80000000000007, 440.549999999999, 2020.119999999999, 17.238407171177382, 45.84658760343044, 2.8918101404930185], "isController": false}, {"data": ["users PUT", 100, 100, 100.0, 166.82999999999998, 0, 2189, 85.0, 246.80000000000007, 360.6499999999999, 2188.2099999999996, 19.904458598726112, 52.330454443670384, 3.1481700338375798], "isController": false}, {"data": ["users POST", 100, 100, 100.0, 159.95000000000007, 1, 1904, 86.5, 250.70000000000013, 421.549999999999, 1903.5299999999997, 19.916351324437365, 52.82617693188608, 3.2155960590519816], "isController": false}, {"data": ["authors GET", 100, 100, 100.0, 196.70999999999995, 0, 473, 180.0, 343.70000000000005, 401.84999999999974, 472.88999999999993, 37.993920972644375, 109.56534063924772, 1.4815402973024316], "isController": false}, {"data": ["users GET", 100, 100, 100.0, 148.88999999999996, 0, 2105, 86.0, 239.60000000000002, 303.79999999999995, 2104.3299999999995, 19.743336623889437, 51.90318824037512, 2.0666877467917075], "isController": false}, {"data": ["activities POST", 100, 100, 100.0, 192.73999999999998, 3, 469, 197.0, 402.00000000000006, 436.84999999999997, 468.96, 54.67468562055768, 158.24050027337344, 4.1278319778567525], "isController": false}, {"data": ["coverPhotos GET", 100, 100, 100.0, 350.7299999999999, 1, 2242, 188.0, 421.40000000000015, 2109.9499999999994, 2241.0499999999997, 17.89228842368939, 49.44841429593845, 1.3903216697978171], "isController": false}, {"data": ["books all GET", 100, 100, 100.0, 257.69, 8, 510, 251.0, 408.9000000000001, 444.9, 509.9, 29.65599051008304, 87.76551379003558, 0.7541425711743772], "isController": false}, {"data": ["coverPhotos DELETE", 100, 100, 100.0, 176.15000000000003, 1, 2297, 118.0, 267.3000000000002, 303.9, 2295.5599999999995, 18.433179723502302, 48.77196140552996, 2.294786866359447], "isController": false}, {"data": ["coverPhotos PUT", 100, 100, 100.0, 459.53000000000003, 1, 2192, 161.0, 1958.6000000000001, 2065.2, 2191.96, 17.522340984755562, 46.25744015025408, 2.9098379731032065], "isController": false}, {"data": ["activities all GET", 100, 100, 100.0, 1208.33, 23, 3240, 743.5, 3226.6, 3230.95, 3239.94, 23.277467411545622, 62.302232454608934, 2.5182400779795158], "isController": false}, {"data": ["authorsAuthorsForBook GET ", 100, 100, 100.0, 182.42000000000002, 3, 427, 174.0, 316.0, 343.84999999999997, 426.81999999999994, 42.3728813559322, 122.63638771186442, 1.9080210540254239], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 57, 2.111111111111111, 2.111111111111111], "isController": false}, {"data": ["403/Site Disabled", 953, 35.2962962962963, 35.2962962962963], "isController": false}, {"data": ["Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1690, 62.592592592592595, 62.592592592592595], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2700, 2700, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 1690, "403/Site Disabled", 953, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 57, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["authors POST", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 79, "403/Site Disabled", 19, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 2, "", "", "", ""], "isController": false}, {"data": ["activities DELETE ", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 76, "403/Site Disabled", 24, "", "", "", "", "", ""], "isController": false}, {"data": ["users DELETE", 100, 100, "403/Site Disabled", 55, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 43, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 2, "", "", "", ""], "isController": false}, {"data": ["coverPhotos all GET", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 58, "403/Site Disabled", 36, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 6, "", "", "", ""], "isController": false}, {"data": ["coverPhotosCoverPhotosForBook  GET", 100, 100, "403/Site Disabled", 49, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 49, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 2, "", "", "", ""], "isController": false}, {"data": ["authors all GET", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 79, "403/Site Disabled", 21, "", "", "", "", "", ""], "isController": false}, {"data": ["authors DELETE", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 85, "403/Site Disabled", 14, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": ["users all GET", 100, 100, "403/Site Disabled", 60, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 39, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": ["books PUT", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 86, "403/Site Disabled", 14, "", "", "", "", "", ""], "isController": false}, {"data": ["books POST", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 78, "403/Site Disabled", 21, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": ["activities GET", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 64, "403/Site Disabled", 24, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 12, "", "", "", ""], "isController": false}, {"data": ["activities PUT ", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 76, "403/Site Disabled", 24, "", "", "", "", "", ""], "isController": false}, {"data": ["authors PUT", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 81, "403/Site Disabled", 15, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 4, "", "", "", ""], "isController": false}, {"data": ["books GET", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 86, "403/Site Disabled", 13, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 1, "", "", "", ""], "isController": false}, {"data": ["books DELETE", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 65, "403/Site Disabled", 31, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 4, "", "", "", ""], "isController": false}, {"data": ["coverPhotos POST", 100, 100, "403/Site Disabled", 60, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 40, "", "", "", "", "", ""], "isController": false}, {"data": ["users PUT", 100, 100, "403/Site Disabled", 57, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 38, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 5, "", "", "", ""], "isController": false}, {"data": ["users POST", 100, 100, "403/Site Disabled", 58, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 40, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 2, "", "", "", ""], "isController": false}, {"data": ["authors GET", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 76, "403/Site Disabled", 21, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 3, "", "", "", ""], "isController": false}, {"data": ["users GET", 100, 100, "403/Site Disabled", 57, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 38, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 5, "", "", "", ""], "isController": false}, {"data": ["activities POST", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 76, "403/Site Disabled", 24, "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos GET", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 57, "403/Site Disabled", 41, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 2, "", "", "", ""], "isController": false}, {"data": ["books all GET", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 86, "403/Site Disabled", 14, "", "", "", "", "", ""], "isController": false}, {"data": ["coverPhotos DELETE", 100, 100, "403/Site Disabled", 59, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 39, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 2, "", "", "", ""], "isController": false}, {"data": ["coverPhotos PUT", 100, 100, "403/Site Disabled", 60, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 38, "Non HTTP response code: org.apache.http.NoHttpResponseException/Non HTTP response message: myapplication-appservice.azurewebsites.net:443 failed to respond", 2, "", "", "", ""], "isController": false}, {"data": ["activities all GET", 100, 100, "403/Site Disabled", 58, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 42, "", "", "", "", "", ""], "isController": false}, {"data": ["authorsAuthorsForBook GET ", 100, 100, "Non HTTP response code: javax.net.ssl.SSLHandshakeException/Non HTTP response message: Remote host terminated the handshake", 76, "403/Site Disabled", 24, "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
