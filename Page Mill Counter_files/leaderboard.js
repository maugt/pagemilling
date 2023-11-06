var CLOCKWISE_BAY_LOOP = 3439398;
var WIDDERSHINS_BAY_LOOP = 657656;

var updateLeaderboard = function(data) {
  var table = '<tr><th>Rank</th><th>Photo</th><th>Name</th><th>' + data.segment + ' Count</th><th></th></tr>';
  $.each(data.counts, function(i, item) {
    if (item.rank == 1) {
      table += '<tr class="mayor">';
    } else {
      table += '<tr>';
    }
    table += '<td class="count">'
    if (item.rank <= 5) {
      table += '<div class="icon rank' + item.rank + '"></div>';
    } else {
      table += '<div class="icon">' + item.rank + '</div>';
    }
    table += '</td>'
    table += '<td class="photo"><img width="124" height="124" src="' + item.profile + '"/></td>';
    table += '<td><a href="https://www.strava.com/athletes/' + item.id + '">';
    table += item.firstname + ' ' + item.lastname + '</a>';
    if (item.reauth) {
      table += '<div class="tooltip"><i class="material-icons">warning</i>';
      table += '<span class="tooltiptext">Reauthentication required.<br/>';
      table += 'If this is you, please click "Join Leaderboard" to refresh your authorization token.</span></div>';
    }
    table += '</td>';
    table += '<td class="count">' + item.count + '</td>';
    table += '<td><a href="details/' + item.id + '/' + data.segment_id + '">Details</a></td>';
    table += '</tr>';
  });
  $('#leaderboard').html(table);
};

var updateBloopLeaderboard = function(data) {
  var table = '<tr><th>Rank</th><th>Photo</th><th>Name</th><th>Clockwise</th><th>Widdershins</th><th>Total</th><th></th></tr>';
  $.each(data.counts, function(i, item) {
    if (item.rank == 1) {
      table += '<tr class="mayor">';
    } else {
      table += '<tr>';
    }
    table += '<td class="count">'
    if (item.total >= 1000) {
      table += '<div class="icon badgewtf"></div>';
    } else if (item.total >= 500) {
      table += '<div class="icon badgeomg"></div>';
    } else if (item.total >= 400) {
      table += '<div class="icon badge400"></div>';
    } else if (item.total >= 300) {
      table += '<div class="icon badge300"></div>';
    } else if (item.total >= 200) {
      table += '<div class="icon badge200"></div>';
    } else if (item.total >= 100) {
      table += '<div class="icon badge100"></div>';
    } else if (item.total >= 50) {
      table += '<div class="icon badge50"></div>';
    } else {
      table += '<div class="icon"></div>';
    }
    if (item.rank <= 5) {
      table += '<div class="icon rank' + item.rank + '"></div>';
    } else {
      table += '<div class="icon">' + item.rank + '</div>';
    }
    table += '</td>'
    table += '<td class="photo"><img width="124" height="124" src="' + item.profile + '"/></td>';
    table += '<td><a href="https://www.strava.com/athletes/' + item.id + '">';
    table += item.firstname + ' ' + item.lastname + '</a>';
    if (item.reauth) {
      table += '<div class="tooltip"><i class="material-icons">warning</i>';
      table += '<span class="tooltiptext">Reauthentication required.<br/>';
      table += 'If this is you, please click "Join Leaderboard" to refresh your authorization token.</span></div>';
    }
    table += '</td>';
    table += '<td>' + item.cw_count + '</td>';
    table += '<td>' + item.ws_count + '</td>';
    table += '<td class="count">' + item.total + '</td>';
    table += '<td><a href="details/' + item.id + '/' + data.segment_id + '">Details</a></td>';
    table += '</tr>';
  });
  $('#leaderboard').html(table);
};

var handleUpdate = function(data) {
  if (data.segment_id == CLOCKWISE_BAY_LOOP || data.segment_id == WIDDERSHINS_BAY_LOOP) {
    updateBloopLeaderboard(data);
  } else {
    updateLeaderboard(data);
  }
}

var fetchLeaderboard = function(url, rangetype) {
  $('#leaderboard').html('<tr><td><img src="/static/spinner.png"/></td></tr>');
  $.ajax({
    url: url,
    dataType: "jsonp",
    data: { rangetype: rangetype },
    cache: true,
    success: handleUpdate,
    error: function(data, error) {
      console.log(error);
    }
  });
}

$(function() {
  $('input#range_all').bind('click', function() {
    fetchLeaderboard(SCRIPT_ROOT + '/query', 'all');
    return true;
  });
  $('input#range_ytd').bind('click', function() {
    fetchLeaderboard(SCRIPT_ROOT + '/query', 'ytd');
    return true;
  });
  $('input#range_mtd').bind('click', function() {
    fetchLeaderboard(SCRIPT_ROOT + '/query', 'mtd');
    return true;
  });
  $('#join').bind('click', function() {
    $('#join a').addClass('processing');
    return true;
  });
  fetchLeaderboard(SCRIPT_ROOT + '/query', 'all');
});
