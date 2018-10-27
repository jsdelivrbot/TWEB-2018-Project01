// Initialize the Switzerland MAP with the count numbers stored in DataBase
function initMap() {
    let API_ROOT = "http://localhost:3000";
    let ENDPOINT_USERS_COUNT_PER_CANTON = "/users/canton/count";

    var custom_data = [];
    $.get( API_ROOT + ENDPOINT_USERS_COUNT_PER_CANTON, function( payload ) {
        // Create the dataset from payload
        for (var _obj in payload) {
            if (_obj == "undefined") {
                continue;
            }
            custom_data.push(new Array(_obj, payload[_obj]));
        }
        
        // Create the chart
        Highcharts.mapChart('chart-switzerland', {
            chart: {
                map: 'countries/ch/ch-all',
                backgroundColor: '#EEEEEE'
            },
            plotOptions:{
                series:{
                    cursor: 'pointer',
                    point:{
                        events:{
                            click: function(){
                                console.log(this.name);
                            }
                        }
                    }
                }
            },
        
            title: {
                text: 'Switzerland Cantons'
            },
        
            subtitle: {
                text: 'Source map: <a href="http://code.highcharts.com/mapdata/countries/ch/ch-all.js">Switzerland</a>'
            },
        
            mapNavigation: {
                enabled: false,
            },
        
            colorAxis: {
                min: 0
            },
        
            series: [{
                data: custom_data,
                name: 'Github users',
                states: {
                    hover: {
                        color: '#da291c'
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                },
                
            }]
        });

    });
}

// Load users informations concerned by the specified canton and langage on the table.
function loadUsers() {

}

initMap();


// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
/*
For a better understanding of Highcharts code
"ch-ag": "Aargau"
"ch-ai": "Appenzell Inner Rhoden"
"ch-ar": "Appenzell Outer Rhoden"
"ch-be": "Berne"
"ch-bs": "Basle-Country"
"ch-3306": "Basle-City"
"ch-fr": "Fribourg"
"ch-ge": "Geneva"
"ch-gl": "Glaris"
"ch-gr": "Grisons"
"ch-ju": "Jura'"
"ch-lu": "ucerne"
"ch-ne": "Neuchatel"
"ch-nw": "Nidwalden"
"ch-7": "Obwalden"
"ch-sg": "St. Gall"
"ch-sh": "Schaffhausen"
"ch-so": "Solothurn"
"ch-sz": "Schwyz"
"ch-tg": "Thurgau"
"ch-ti": "Ticino"
"ch-ur": "Uri"
"ch-vd": "Vaud"
"ch-vs": "Valais"
"ch-zg": "Zu"
"ch-zh": "Zurich"
*/

