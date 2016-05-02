/**
 * Created by paulb on 10/2/15.
 */

$(document).ready(function () {

    // ----------------------------------------------------------------------------------------------------------
    // Data source - Bloodhound
    // ==========================================================================================================

    var apsOrganizations = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('single_line_address'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
//              prefetch: 'http://aps-cms.dev-apskc.localhost/organizations/typeahead_list/s:a.json',
        limit: 50,
        crossDomain: true,

        remote: {
            url: 'http://dev-api.codeforkc.org/address-typeahead/V0/%QUERY',
            wildcard: '%QUERY',
            transform: function (response) {
                console.log('transform', response.data);
                return response.data;
            }
        }
    });

    apsOrganizations.initialize();

    // ----------------------------------------------------------------------------------------------------------
    // custom templates with all Custom Events
    // ==========================================================================================================
    // For events see https://github.com/twitter/typeahead.js/blob/master/doc/jquery_typeahead.md#custom-events
    // Another interesting jsfiddle http://jsfiddle.net/Fresh/kLLCy/
    // And the article that showed me to use .on('typeahead:selected', function (object, datum) { ....
    //   http://stackoverflow.com/questions/21000529/using-bootstrap-3-and-twitter-typeahead-js-for-autocomplete
    // This code is based off of
    //   http://stackoverflow.com/questions/21997266/how-do-i-submit-data-populated-from-typeahead-bloodhound-auto-complete
    // ----------------------------------------------------------------------------------------------------------
    // To use scrolable drop down menu,
    //   Wrap a div around the input field with .typeahead
    //   and attach it's ID to the typeahead
    //

    $('#remote .typeahead').typeahead(
        {
            highlight: true
        },
        {
            name: 'address',
            display: 'single_line_address',
            source: apsOrganizations.ttAdapter()
            ,
            templates: {
                empty: [
                    '<div class="empty-message">',
                    'unable to find any addresses that match the current query',
                    '</div>'
                ].join('\n')
            }

        })

        .on('typeahead:opened', function () {
            console.log('typeahead:opened');
            $('#person_was_selected').val(0);
            $('#address_saved_name').val($('#address_name_type_a_head').val());

        }).on('typeahead:closed', function () {
            console.log('typeahead:closed');

            console.log('address_was_selected=' + $('#address_was_selected').val());
            console.log('address_name_type_a_head=' + $('#address_name_type_a_head').val());
            console.log('address_saved_name=' + $('#address_saved_name').val());

            if ($('#address_was_selected').val() == 0) {
                if ($('#address_name_type_a_head').val() != $('#address_saved_name').val()) {
                    $('#PersonName').val($('#address_name_type_a_head').val());
                    $('#contact_address_id').val('');
                    console.log('NEW PERSON');
                } else {
                    console.log('EXISTING PERSON');
                    $('#PersonName').val('');
                }
            } else {
                console.log('EXISTING PERSON');
                $('#PersonName').val('');
            }

        }).on('typeahead:cursorchanged', function (eventObject, suggestionObject, suggestionDataset) {
            console.log('typeahead:cursorchanged');
        }).on('typeahead:selected', function (eventObject, suggestionObject, suggestionDataset) {
            console.log('typeahead:selected');
            $('#contact_address_id').val(suggestionObject.id);
            $('#address_was_selected').val(1);
//            addForm.populate_contact_add_form(suggestionObject.contact_id);
        }).on('typeahead:autocompleted', function (eventObject, suggestionObject, suggestionDataset) {
            console.log('typeahead:autocompleted');
            $('#contact_address_id').val(suggestionObject.id);
            $('#address_was_selected').val(1);
        })

    ;


    $("#address-form").on("submit", function () {

        var one_line_address = encodeURIComponent($("#address_id").val().replace(/ KANSAS CITY, MO/,''));

        var url = "http://dev-api.codeforkc.org//address-attributes/V0/" + one_line_address + "?city=Kansas%20City&state=mo";

        $.ajax({
            method: "GET",
            crossDomain: true,
            url: url
        })

            .done(function (data) {
                address_obj = jQuery.parseJSON(data);
                console.log(address_obj);

                $('.address-values').empty();

                console.log("id="+address_obj.data.id);

                var parcel = address_obj.data;
                console.dir(parcel);

                console.log("|" + parcel.land_bank_property + "|");

                var result = $("#address-results");
                result.empty();
                if (parcel.city.land_bank_property == 0) {
                    result.append("<h2>Land Bank Property</h2>");
                }

                result.append("<p>Owner: " + parcel.county_owner + ", " + parcel.county_owner_city + " " + parcel.county_owner_state + " </p>");
                result.append("<p>KIVA Pin: " + parcel.city_id + "   County APN: " + parcel.county_parcel_number + " </p>");

                // longitude, latitude if not found 0.0000000000
                // census_longitude, census_latitude

                var longitude = 0.0000000000;
                var latitude = 0.0000000000;

                if (parcel.longitude != 0.0000000000) {             // KCMO has best
                    longitude = parcel.longitude;
                    latitude = parcel.latitude;
                } else if ( parcel.census_longitude != 0.0000000000) {     // Census is next
                    longitude = parcel.census_longitude;
                    latitude = parcel.census_latitude;
                }

                result.append("<p><a href=\"/research.html?cid=" + parcel.city_id + "&lng=" + longitude + "&lat=" + latitude + "\"><b>Research</b></a> this property.</p>");


            })
            .fail(function () {
                $('#address-error').show("slow");
                $('#address-error').text('Error');

            })
            .always(function () {

            });

        return false;
    });

    /* ########################################################## */

});


