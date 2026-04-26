const addLegend = (colorScale, teams) => {
  const container = d3.select("#legend-container");
  container.html("");

  let activeTeams = new Set(teams); // start with all visible

  const items = container.selectAll(".legend-item")
    .data(teams)
    .join("div")
    .attr("class", "legend-item")
    // .style("cursor", "pointer");

  // color box
  items.append("span")
    .attr("class", "legend-color")
    .style("background-color", d => colorScale(d));

  // label
  items.append("span")
    .text(d => d);
};

//legend for bar chart
const legend_games = (team_data) => {
  const container = d3.select("#games-legend")
  container.html("");
  const items = [ {color: "#5dc34f", label: "Win"},
                  {color: "#d26565", label: "Loss"}]

  items.forEach(item => {
    const row = container.append("div")
      .attr("class", "legend-item")

    row.append("span")
      .attr("class", "legend-color")
      .style("background-color", item.color)

    row.append("span")
      .text(item.label)

  })

  container.append("p")
    .text("bar size = (points scored - points lost)")
    .style("color", "#404040")
    .style("font-size", "20px")
    .style("margin-left", "10%")  // pushes to the right
    .style("margin-top", "0")
    .style("margin-bottom", "0")
};
