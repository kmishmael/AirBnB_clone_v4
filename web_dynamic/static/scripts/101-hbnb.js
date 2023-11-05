$('document').ready(function () {
  const api = 'http://' + window.location.hostname;
  //const url = 'http://' + window.location.hostname + ':5001/api/v1/status/';
  //url = api + ':5001/api/v1/status/';
  $.get(api + ':5001/api/v1/status/', function (response) {
    if (response.status === 'OK') {
      $('DIV#api_status').addClass('available');
    } else {
      $('DIV#api_status').removeClass('available');
    }
  });

  $.ajax({
    url: api + ':5001/api/v1/places_search/',
    type: 'POST',
    data: '{}',
    contentType: 'application/json',
    dataType: 'json',
    success: appendPlaces
  });


  let states = {};
  $('.locations #state_input').change(function () {
    if ($(this).is(':checked')) {
      states[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete states[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations H4').html('&nbsp;');
    } else {
      $('.locations H4').text(Object.values(locations).join(', '));
    }
  });

  let cities = {};
  $('.locations #city_input').change(function () {
    if ($(this).is(':checked')) {
      cities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete cities[$(this).attr('data-id')];
    }
    const locations = Object.assign({}, states, cities);
    if (Object.values(locations).length === 0) {
      $('.locations H4').html('&nbsp;');
    } else {
      $('.locations H4').text(Object.values(locations).join(', '));
    }
  });

  let amenities = {};
  $('.amenities INPUT[type="checkbox"]').change(function () {
    if ($(this).is(':checked')) {
      amenities[$(this).attr('data-id')] = $(this).attr('data-name');
    } else {
      delete amenities[$(this).attr('data-id')];
    }
    if (Object.values(amenities).length === 0) {
      $('.amenities H4').html('&nbsp;');
    } else {
      $('.amenities H4').text(Object.values(amenities).join(', '));
    }
  });

  
  $('BUTTON').click(function () {
    $.ajax({
      url: api + ':5001/api/v1/places_search/',
      type: 'POST',
      data: JSON.stringify({
	        'states': Object.keys(states),
	        'cities': Object.keys(cities),
	        'amenities': Object.keys(amenities)
      }),
      contentType: 'application/json',
      dataType: 'json',
      success: appendPlaces
    });
  });
$('body').on('click', '.show', function () {
    let id = $(this).attr('data-placeid');
    let reviews = getReviews(id);
    $('h4.' + id).replaceWith('<h4 class="' + id + '"> \
      ' + reviews['string'] + '\
      <span class="hide" data-placeid="' + id + '">Hide</span> \
      </h4> \
    ');
    reviews['result'].forEach((review) => {
      $('div.' + id).append(' \
        <p>' + review.text + '</p> \
      ');
    });
  });

  $('body').on('click', '.hide', function() {
    let id = $(this).attr('data-placeid');
    $('h4.' + id).replaceWith('<h4 class="' + id + '"> \
      Reviews \
      <span class="show" data-placeid="' + id  + '">Show</span> \
      </h4> \
    ');
    $('div.' + id).empty();
  });
  function getReviews (id) {
    let reviews = {};
    let reviewString;
    $.ajax({
      type: 'GET',
      url: 'http://' + window.location.hostname + ':5001/api/v1/' + 'places/' + id + '/reviews',
      contentType: 'application/json',
      success: function (result, statusCode) {
        reviews['result'] = result;
      },
      async: false
    });
    if (reviews['result'].length !== 1)
      reviewString = reviews['result'].length + ' Reviews';
    else
      reviewString = reviews['result'].length + ' Review';
    reviews['string'] = reviewString;
    return reviews;
  }

});

function appendPlaces (data) {
  $('SECTION.places').empty();
  $('SECTION.places').append(data.map(place => {
    return `<ARTICLE>
              <DIV class="title_box">
                <H2>${place.name}</H2>
                  <DIV class="price_by_night">
                    ${place.price_by_night}
                  </DIV>
                </DIV>
                <DIV class="information">
                  <DIV class="max_guest">
                    <I class="fa fa-users fa-3x" aria-hidden="true"></I>
                    </BR>
                    ${place.max_guest} Guests
                  </DIV>
                  <DIV class="number_rooms">
                    <I class="fa fa-bed fa-3x" aria-hidden="true"></I>
                    </BR>
                    ${place.number_rooms} Bedrooms
                  </DIV>
                  <DIV class="number_bathrooms">
                    <I class="fa fa-bath fa-3x" aria-hidden="true"></I>
                    </BR>
                    ${place.number_bathrooms} Bathrooms
                  </DIV>
                </DIV>
                <DIV class="description">
                  ${place.description}
                </DIV>
	  <div class="reviews">
	  <h2 class="' + object.id + '">Reviews</h2><span class="show" data-placeid="' + object.id + '">Show</span>
	  <div class="' + object.id + '"></div>
       </div>
              </ARTICLE>`;
  }));
}
