bump_height = 600
bump_width = 1000

bar_height = 600
bar_width = 1000

d3.select("#buffer")
    .append("svg")
        .attr("height", (1/5)*bump_height)

d3.select("#buffer2")
    .append("svg")
        .attr("height", 0.06 * bump_height)

function showDefaultLegend() {
    const legend = d3.select("#tournament-legend")
    legend.html("")
    legend.append("h2")
        .attr("class", "legend-hint")
        .text("Click on a tournament block to see statistics")
    }