const drawBump = (data, barData) => {

    d3.select("#reset-btn").on("click", () => {
    //reset lines, make everything fully opaque again
    d3.selectAll(".line")
        .attr("opacity", 1)

    d3.selectAll("circle")
        .attr("opacity", 1)

    d3.selectAll(".legend-item").style("opacity", 1)
    
    })

    const margin = {top: 40, right: 50, bottom: 25, left:30 };
    const width = 1000;
    const height = 600;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    //i think im going to focus on D1 teams only so far
    const d1_data = data.filter(d => d.Division == 'Division I');
    const d3_data = data.filter(d => d.Division == 'Division III');
    
    //set since many teams will appear in top 10 every time, might expand to more teams
    const top_teams = d1_data.filter(d => d.Rank <= 9);
    const top_team_names = new Set(top_teams.map(d => d.Team));

    //isolate top team data 
    const isolated_data = d1_data.filter(d => top_team_names.has(d.Team));
    // console.log(top_team_names)
    //for when we actually need the date for the scales
    const parseDate = d3.timeParse("%Y-%m-%d");

    //append svg
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)

    svg
        .append("text")
            .text("Top 9 Teams' Ranking By Power Rating")
            .attr("font-weight", "bold")
            .style("font-size", "28px")
            .attr("dominant-baseline", "hanging")
    svg
        .append("text")
            .text("Click on each line to see a specific team's season details")
            .style("font-size", "24px")
            .attr("dominant-baseline", "hanging")
            .attr("transform", `translate(0, 40)`)

    //append innerChart
    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const firstDate = parseDate("2024-03-10")
    const lastDate = d3.max(data, d => d.Date)

    //declare xScale
    const xScale = d3.scaleTime()
        .domain([firstDate, parseDate(lastDate)])
        .range([0, innerWidth])

    //discrete y axis for bump chart
    const maxRank = 9; 

    const yScale = d3.scaleLinear()
        .domain([0, maxRank + 0.5])
        .range([0, innerHeight]); // rank 1 at top, rank 10 at bottom

    //declare colorScale
    const colorScale = d3.scaleOrdinal()
        .domain([...top_team_names])
        .range(["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00",
        "#a65628", "#f781bf", "#999999", "#66c2a5", "#fc8d62",
        "#8da0cb"]
 );


    //call x and y scales
    const bottomAxis = d3.axisBottom(xScale)
        .tickValues([
        parseDate("2024-03-12"),
        parseDate("2024-03-20"),
        parseDate("2024-03-27"),
        parseDate("2024-04-04"),
        parseDate("2024-05-08"),
        parseDate("2024-06-20"),
    ])
    .tickFormat(d3.timeFormat("%b %d"));

    innerChart
        .append("g")
        .attr("class", "axis-x")
        .attr("transform", `translate(0, ${innerHeight})`)
        .call(bottomAxis)

    const leftAxis = d3.axisLeft(yScale)
        .tickValues(d3.range(1, maxRank + 1))
        .tickSize(-innerWidth);//extend ticks across 

    innerChart
        .append("g")
        .attr("class", "axis-y")
        .call(leftAxis);

    

    innerChart
        .append("line")
            .attr("x1", xScale(parseDate("2024-03-12")))
            .attr("y1", 20)
            .attr("x2", xScale(parseDate("2024-03-12")))
            .attr("y2", innerHeight)
            .attr("class", "time-line")
            .attr("stroke", "red")
            .attr("stroke-width", 3)
            .attr("opacity", 0)



    //join data and add circles
    innerChart
        .selectAll("circle")
        .data(isolated_data)
        .join("circle")
            .attr("r", 4)
            .attr("cx", d => xScale(parseDate(d.Date)))
            .attr("cy", d => yScale(d.Rank))
            .attr("fill", d => colorScale(d.Team))
            .attr("class", d => "points team-" + d.Team.replace(/\s+/g, "-"))

    const curveGenerator = d3.line()
        .x(d => xScale(parseDate(d.Date)))
        .y(d => yScale(d.Rank))
        .curve(d3.curveLinear); 
        
//generate line by team so we can have different line and color for each team
    const dataByTeam = d3.group(isolated_data, d => d.Team)
    dataByTeam.forEach(values => values.sort((a, b) => d3.ascending(parseDate(a.Date), parseDate(b.Date))));

    const linesGroup = innerChart.append("g").attr("class", "lines");
    // console.log(dataByTeam)

    linesGroup
        .selectAll("path")
        .data(dataByTeam)
        .join("path")
            .attr("d", ([team, values]) => curveGenerator(values))
            .attr("fill", "none")
            .attr("stroke", ([team, values]) => colorScale(team))
            .attr("stroke-width", 5)
            .attr("class", ([team, values]) => "line team-" + team.replace(/\s+/g, "-"))

    addLegend(colorScale, Array.from(top_team_names));


    linesGroup.selectAll("path")
    .on("click", function(event, [team, values]) {
        linesGroup.selectAll("path").attr("opacity", 0.2);
        innerChart.selectAll("circle").attr("opacity", 0.2);

        d3.select(this).attr("opacity", 1);
        d3.selectAll(`.points.team-${team.replace(/\s+/g, "-")}`).attr("opacity", 1);

        d3.select(".time-line")
            .attr("opacity", 0)

        d3.select("#game-legend").html("")
            showDefaultLegend()

        d3.selectAll(".legend-item").style("opacity", 0.2)
        d3.selectAll(".legend-item")
            .filter(d => d === team)
            .style("opacity", 1)


        innerChart.selectAll(".rank-label").remove();

        const parseDate = d3.timeParse("%Y-%m-%d");
//see power rating at each point when you click on the line
        innerChart.selectAll(".rank-label")
            .data(values)
            .join("text")
                .attr("class", "rank-label")
                .attr("x", d => xScale(parseDate(d.Date)) + 8) 
                .attr("y", d => yScale(d.Rank) - 8)
                .attr("fill", colorScale(team))
                .text(d => d.PowerRating)

        drawBarChart(barData, team);
    });
};