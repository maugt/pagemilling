function displayRiders(riders)
{
    let table = `<table class="leaderboard" id="leaderboard"><tr><th>Rank</th><th>Photo</th><th>Name</th><th>Costumed Page Mill Count</th><th></th></tr>`;

    let rank = 0;
    let prevCount = null;
    riders.sort(function(a, b) {

	return b.count - a.count;
s
    }).forEach((rider, index) => {
	
        if (prevCount != rider.count) {
            rank = index + 1;
        }
        prevCount = rider.count;
        if (rank === 1) {
            table = table + `<tr class="mayor">`;
        } else {
            table = table + `<tr>`;
        }
        table = table + `<td class=count><div class="icon rank${rank}"</div></td>`;
        table = table + `<td class="photo"><img width="124" height="124" src="${rider.name}.jpg"></td>`;
        table = table + `<td><a href="https://www.strava.com/athletes/${rider.id}">${rider.name}</a></td>`;
        table = table + `<td class="count">${rider.count}</td><td>Details</td>`;
        table += `</tr>`;

    });
    table += "</table>";
    document.getElementById("main").innerHTML = table;
}

fetch('riders.json')
    .then(response => response.json())
    .then(data => {
        let riders = data;
        displayRiders(riders);
    })
    .catch(error => console.error('Error:', error));
