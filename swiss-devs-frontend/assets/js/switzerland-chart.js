// Prepare demo data
// Data is joined to map using value of 'hc-key' property by default.
// See API docs for 'joinBy' for more info on linking data and map.
var data = [
    ['ch-fr', 0],
    ['ch-ne', 1],
    ['ch-ag', 2],
    ['ch-lu', 3],
    ['ch-7', 10],
    ['ch-vs', 5],
    ['ch-sg', 6],
    ['ch-ar', 7],
    ['ch-ti', 8],
    ['ch-gl', 9],
    ['ch-gr', 10],
    ['ch-sz', 11],
    ['ch-tg', 12],
    ['ch-sh', 13],
    ['ch-ur', 14],
    ['ch-zh', 15],
    ['ch-zg', 16],
    ['ch-vd', 17],
    ['ch-3306', 10],
    ['ch-be', 19],
    ['ch-bs', 20],
    ['ch-so', 21],
    ['ch-nw', 22],
    ['ch-ai', 23],
    ['ch-ge', 24],
    ['ch-ju', 25]
];

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
        data: data,
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
