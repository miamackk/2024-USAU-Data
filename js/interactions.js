//not all interactions live here
//some made more sense to me to go at the bottom of their respective js file
function tournament_legend(d) {
    //so we can print the date
    const formatTime = d3.timeFormat("%B %d");
    const date = d["rows"][0].date

    const formatDate = d3.timeParse("%Y-%m-%d")
    // console.log(date)
    // console.log(formatTime(date))

    const legend = d3.select("#tournament-legend")
    legend.html("")
    legend.append("h2").text(d.tournament)
    // console.log(formatTime(d["rows"][0].date))
    legend.append("h3").text(`${formatTime(date)}`)

    // clear and rebuild game cards
    const gameContainer = d3.select("#game-legend")
    gameContainer.html("")

    d.rows.forEach((row, i) => {
        const card = gameContainer.append("div")
            .attr("class", "game-card")

        card.append("h4").text(`Game ${i + 1} vs ${row.Opponent}`)
        card.append("p").text(`Winner: ${row.diff > 0 ? row.Team : row.Opponent}`)
        card.append("p").text(`Score: ${row.pointsscored} - ${row.pointslost}`)
    })

    d3.selectAll("rect.background").attr("fill", "rgba(0,0,0,0)")
    d3.selectAll("rect.background")
        .filter(r => r.tournament === d.tournament)
        .attr("fill", "rgba(163, 163, 163, 0.2)")

    // make red line appear on bump chart for when tournament happened

    const firstDate = formatDate("2024-03-10")
    const lastDate = formatDate("2024-06-20")

    //declare xScale
    const xScale = d3.scaleTime()
        .domain([firstDate, lastDate])
        .range([0, 930])

    const mar12 = formatDate("2024-03-12") // parse the string
    const june20 = formatDate("2024-06-20")

    greater_than_mar = date > mar12
    less_than_june = date < june20

    d3.select(".time-line")
        .attr("opacity", 1)
             .attr("x1", (less_than_june == true && greater_than_mar == true) ? xScale(date) : (less_than_june == true) ? xScale(formatDate("2024-03-12")): xScale(formatDate("2024-06-20")))
            .attr("y1", 20)
            .attr("x2", (less_than_june == true && greater_than_mar == true) ? xScale(date) : (less_than_june == true) ? xScale(formatDate("2024-03-12")): xScale(formatDate("2024-06-20")))
            .attr("y2", innerHeight)

}
        // console.log(d["rows"][0])
