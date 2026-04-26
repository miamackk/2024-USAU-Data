Promise.all([
    d3.csv("./data/usau_2024.csv", d => ({
        ...d,
        Rank: +d.Rank,
        "PowerRating": +d["PowerRating"],
        Wins: +d.Wins,
        Losses: +d.Losses,
        Date: d.Date
    })),
    d3.csv("./data/2024team-specific.csv", d3.autoType)
]).then(([bumpData, barData]) => {
    drawBump(bumpData, barData);
    drawBarChart(barData, "Carleton"); // default team on load
});