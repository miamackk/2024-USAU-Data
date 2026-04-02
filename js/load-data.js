
d3.csv("./data/usau_2024.csv", d => ({
    ...d,
    Rank: +d.Rank,
    "PowerRating": +d["PowerRating"],
    Wins: +d.Wins,
    Losses: +d.Losses,
    Date: d.Date  // keep as string so i can compare
})).then( data => {
    drawScatterplot(data);
});