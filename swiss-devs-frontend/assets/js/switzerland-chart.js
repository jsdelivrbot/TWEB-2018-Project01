let API_ROOT = "http://localhost:3000";

// Initialize the Switzerland MAP with the count numbers stored in DataBase
function initMap() {
    let ENDPOINT_USERS_COUNT_PER_CANTON = "/users/canton/count";

    let custom_data = [];
    $.get( API_ROOT + ENDPOINT_USERS_COUNT_PER_CANTON, function( payload ) {
        // Create the dataset from payload
        for (let _obj in payload) {
            if (_obj == "undefined") {
                continue;
            }
            custom_data.push(new Array(_obj, payload[_obj]));
        }
        
        // Create the chart
        Highcharts.mapChart('chart-switzerland', {
            chart: {
                map: 'countries/ch/ch-all',
                backgroundColor: '#EEEEEE',
                height: 560,
            },
            plotOptions:{
                series:{
                    cursor: 'pointer',
                    point:{
                        events:{
                            click: function(){
                                loadUsers(this.name);
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
function loadUsers(canton) {
    // Handle special cases
    canton = canton.replace("Genève", "Geneva");
    canton = canton.replace('ü', 'u');
    canton = canton.replace('è', 'e');
    canton = canton.replace('â', 'a');

    let languages_canton = [];

    console.log("Clicked for " + canton);
    let ENDPOINT_USERS_COUNT_PER_CANTON = "/users/canton/" + canton;

    let custom_data = [];
    $("#selected_canton").empty();
    $("#selected_canton").text(canton);
    $.get( API_ROOT + ENDPOINT_USERS_COUNT_PER_CANTON, function( payload ) {
        console.log(payload);
        $("#users_content").empty();
        payload.forEach(user => {
            console.log(user);
            let user_tr = 
            "<tr>" +
                "<td><a target=\"_blank\" href=\"https://github.com/" + user.username + "\">" + user.name + "(" + user.username + ")</a></td>" +
                "<td>" + user.languages + "</td>" +
                 '<td class="text-center"><button type="button" class="btn" data-toggle="collapse" data-target="#collapse' + user.id_github + '">Details</button></td>' +
            "</tr><hr>";
            let collapse = 
            '<tr id="collapse' + user.id_github + '" class="collapse in">' +
                '<td colspan="3">' +
                    '<ul>' +
                        '<li><strong>Location: </strong>' + user.location + '</li>' +
                        '<li><strong>Bio: </strong>' + user.bio + '</li>' +
                        '<li><strong>Blog: </strong>' + user.blog + '</li>' +
                        '<li><strong>Company: </strong>' + user.company + '</li>' +
                        '<li><strong>Hireable: </strong>' + user.hireable + '</li>' +
                        '<li><strong>Github id: </strong>' + user.id_github + '</li>' +
                    '</ul>' +
                '</td>' +
            '</tr>';
            console.log(user_tr);
            $("#users_content").append(user_tr);
            $("#users_content").append(collapse);
            user.languages.forEach(lang => {
                if(languages_canton.indexOf(lang) === -1) {
                    languages_canton.push(lang);
                }
            });
        });

        // Update the selectbox
    });

}

initMap();


$('#search_language').bind("enterKey",function(e){
    event.preventDefault();
    let term = $('#search_language').val();
    if (term != null && term != "") {
        let current_canton =  $("#selected_canton").text();
        if (current_canton == "Nothing" ||  current_canton == "")
            return;

        let ENDPOINT_USERS_COUNT_PER_CANTON = "/users/canton/" + current_canton  + "/language/" + term;

        $.get( API_ROOT + ENDPOINT_USERS_COUNT_PER_CANTON, function( payload ) {
            console.log(payload);
            $("#users_content").empty();
            payload.forEach(user => {
                console.log(user);
                let user_tr = 
                "<tr>" +
                    "<td><a target=\"_blank\" href=\"https://github.com/" + user.username + "\">" + user.name + "(" + user.username + ")</a></td>" +
                    "<td>" + user.languages + "</td>" +
                    '<td class="text-center"><button type="button" class="btn" data-toggle="collapse" data-target="#collapse' + user.id_github + '">Details</button></td>' +
                "</tr><hr>";
                let collapse = 
                '<tr id="collapse' + user.id_github + '" class="collapse in">' +
                    '<td colspan="3">' +
                        '<ul>' +
                            '<li><strong>Location: </strong>' + user.location + '</li>' +
                            '<li><strong>Bio: </strong>' + user.bio + '</li>' +
                            '<li><strong>Blog: </strong>' + user.blog + '</li>' +
                            '<li><strong>Company: </strong>' + user.company + '</li>' +
                            '<li><strong>Hireable: </strong>' + user.hireable + '</li>' +
                            '<li><strong>Github id: </strong>' + user.id_github + '</li>' +
                        '</ul>' +
                    '</td>' +
                '</tr>';
                console.log(user_tr);
                $("#users_content").append(user_tr);
                $("#users_content").append(collapse);
            });
        });
    }
 });

 $('#search_language').keyup(function(e){
     if(e.keyCode == 13)
     {
         $(this).trigger("enterKey");
         event.preventDefault();
     }
 });
