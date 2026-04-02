//gets called at the end of scatterplot function since 
//we use colorScale and teamNames as a parameter
const addLegend = (colorScale, teamNames) => {
    const ul = d3.select("#legend-container")
        .append("ul")
        .attr("class", "color-legend");

    const items = ul.selectAll("li")
        .data([...teamNames])
        .join("li")
        .attr("class", "color-legend-item");

    items.append("span")
        .attr("class", "color-legend-item-color")
        .style("background-color", d => colorScale(d))
        .style("display", "inline-block")
        .style("width", "12px")
        .style("height", "12px");

    items.append("span")
        .attr("class", "color-legend-item-label")
        .text(d => d);
};