import { useEffect, useState } from 'react';

export default function Riders() {
    const [riders, setRiders] = useState([]);

    useEffect(() => {
        fetch('./riders.json')
            .then(response => response.json())
            .then(data => {
                setRiders(data);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    let rank = 0;
    let prevCount = null;
    return (
        <div id="container">
            
            <div className="pagetitle">
            <h1>Page Mill In a Halloween Costume Counter</h1>
            </div>
            <table className="leaderboard" id="leaderboard">
                <thead>
                    <tr><th>Rank</th><th>Photo</th><th>Name</th><th>Costumed Page Mill Count</th><th></th></tr>
                                    <tr>
                    </tr>
                </thead>
                <tbody>
                    {riders.sort(function(a, b) { return b.count - a.count }).map((rider, index) => (
                        rank = prevCount != rider.count ? index + 1 : rank,
                        prevCount = rider.count,
    <tr key={index} className={rank === 1 ? 'mayor' : ''}>
     <td class="count"><div class={`icon rank${rank}`}></div></td>
     <td class="photo"><img width="124" height="124" src={`${rider.name}.jpg`}/></td>
     <td><a href={`https://www.strava.com/athletes/${rider.id}`}>{rider.name}</a></td>
     <td class="count">{rider.count}</td><td>Details</td>
                           {/* <td>{rider.name}</td>
                            <td>{rider.count}</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}