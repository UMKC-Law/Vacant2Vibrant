/* From http://www.nczonline.net/blog/2010/05/25/cross-domain-ajax-with-cross-origin-resource-sharing/ */

function createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
        xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
        xhr = new XDomainRequest();
        xhr.open(method, url);
    } else {
        xhr = null;
    }
    return xhr;
}

$(document).ready(function () {

    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results == null) {
            return null;
        }
        else {
            return results[1] || 0;
        }
    }

    var city_id = $.urlParam('cid');
    var longitude = $.urlParam('lng');
    var latitude = $.urlParam('lat');

    var url = "http://dev-api.codeforkc.org/address-attributes-city-id/V0/" + city_id + "?city=Kansas%20City&state=mo";

    $.ajax({
            method: "GET",
            crossDomain: true,
            url: url
        })

        .done(function (data) {
            address_obj = jQuery.parseJSON(data);
            console.log(address_obj);

            console.log("id=" + address_obj.data.id);

            var parcel = address_obj.data;
            console.dir(parcel);

            console.log("|" + parcel.land_bank_property + "|");

            var result = $("#address-results");
            result.empty();
            if (parcel.city.land_bank_property == 0) {
                result.append("<h2>Land Bank Property</h2>");
            }

            result.append("<h2>Results for: " + parcel.single_line_address + " </h2>");
            result.append("<p>Owner: " + parcel.county_owner + ", " + parcel.county_owner_city + " " + parcel.county_owner_state + " </p>");
            result.append("<p>KIVA Pin: " + parcel.city_id + "   County APN: " + parcel.county_parcel_number + " </p>");

            // longitude, latitude if not found 0.0000000000
            // census_longitude, census_latitude

            var longitude = 0.0000000000;
            var latitude = 0.0000000000;

            if (parcel.longitude != 0.0000000000) {             // KCMO has best
                longitude = parcel.longitude;
                latitude = parcel.latitude;
            } else if (parcel.census_longitude != 0.0000000000) {     // Census is next
                longitude = parcel.census_longitude;
                latitude = parcel.census_latitude;
            }


            var d = new Date();
            d.setDate(d.getDate() - 8);       // Past 7 days
            var month = d.getMonth() + 1;
            day = d.getDate();

            var output = d.getFullYear() + '-' +
                (('' + month).length < 2 ? '0' : '') + month + '-' +
                (('' + day).length < 2 ? '0' : '') + day;
            var yesterday = output + 'T00:00:00';

            // See http://dev.socrata.com/docs/queries.html on SoQL Clauses

            var request_property_violations = createCORSRequest("get", "http://data.kcmo.org/resource/nhtf-e75a.json?$where=within_circle(mapping_location," + latitude + "," + longitude + ",152.4)"); // $order=neighborhood");

            if (request_property_violations) {
                request_property_violations.onload = function () {
                    var data = JSON.parse(request_property_violations.responseText);
                    data.sort(function (a, b) {
                        if (a.case_opened < b.case_opened) {
                            return 1;
                        }
                        if (a.case_opened > b.case_opened) {
                            return -1;
                        }
                        // a must be equal to b
                        return 0;
                    });
//        console.dir(data);

                    var closed = '';
                    for (var i in data) {
                        var row = '';

                        closed = data[i]['case_closed'];
                        console.log(closed);
                        if (typeof closed == 'undefined') {
                            closed = '';
                        } else {
                            closed = closed.substring(0, 10);
                        }
                        row += '<tr>';
                        row += '<td>' + data[i]['case_opened'].substring(0, 10) + '</td>';
                        row += '<td>' + data[i]['address'] + '</td>';
                        row += '<td>' + data[i]['violation_description'] + '</td>';
                        row += '<td>' + data[i]['ordinance'] + '</td>';
                        row += '<td>' + closed + '</td>';
                        row += '<td>' + data[i]['status'] + '</td>';
                        row += '</tr>';

                        $('#cases > tbody:last').append(row);

                    }
                };
                request_property_violations.send();
            }


        })
        .fail(function () {
            $('#address-error').show("slow");
            $('#address-error').text('Error');

        })
        .always(function () {

        });


    /* ########################################################## */


});


