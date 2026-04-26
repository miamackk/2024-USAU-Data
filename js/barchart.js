const drawBarChart = (data, teamName) => {
    d3.select("#game-legend").html("")
    showDefaultLegend()

    //first separate into teams
    const team_data = data.filter(d => d.Team == teamName);

    d3.select("#bar-chart").selectAll("*").remove();
    
    const margin = {top: 60, right: 30, bottom: 10, left:30 };
    const width = 1000;
    const height = 600;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

     //append svg
    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)

    //append innerChart
    const innerChart = svg
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    svg.append("text")
        .attr("transform", `translate(0,20)`)
        .attr("font-size", "20px")
        .attr("font-weight", "bold")
        .text(`${teamName} Score Differentials For Every Game in 2024 Season`);

    svg.append("text")
        .attr("transform", `translate(0,45)`)
        .attr("font-size", "18px")
        // .attr("font-weight", "bold")
        .text("Click within a gray tournament outline box to see specific stats for that tournament below");


    const num_of_games = team_data.length+1 

    const yScale = d3.scaleLinear()
        .domain([-15, 15])
        .range([innerHeight, 0])

    const xScale = d3.scaleLinear()
        .domain([0, num_of_games])
        .range([0, innerWidth])
        
    const bottomAxis = d3.axisBottom(xScale)
        .tickSize(0)
        .tickFormat("")
    innerChart
        .append("g")
        .attr("class", "axis-x")
        .attr("transform", `translate(0, ${innerHeight/2})`)
        .call(bottomAxis);

    const leftAxis = d3.axisLeft(yScale)
        .tickValues(d3.range(-15, 16))
        .tickSize(-innerWidth);//extend ticks across 
    innerChart
        .append("g")
        .attr("class", "axis-y")
        .call(leftAxis);

    const padding = 3;

    const barSize = Math.floor((innerWidth - (num_of_games*padding)) / num_of_games)

    const dataByTournament = d3.group(team_data, d => d.Tournament)

    let cumulative = 1; // so we can store number of games in each tournament to draw the big boxes
    //tournament boxes find how many games are in tournament and use xscale to find position
    const tournamentData = [...dataByTournament.entries()].map(([tournament, rows]) => {
        const entry = {tournament, rows, count: rows.length, offset: cumulative}
        cumulative += rows.length; // add to total so we can next tournament box next to previous
        return entry;
    })
    // console.log("Tournament Data")
    // console.log(tournamentData)

    innerChart
        .selectAll("rect.background")
        .data(tournamentData)
        .join("rect")
            .attr("class", "background")
            .attr("x", d => xScale(d.offset)+1)
            .attr("y", 0)
            .attr("width", d => xScale(d.count))
            .attr("height", innerHeight)
            .attr("fill", "rgba(0,0,0,0)")
            .attr("stroke", "#a3a3a3")
            .attr("stroke-width", 2)
            .attr("rx", 5)
            .attr("ry", 5)
            .on("click", (event, d) => tournament_legend(d))
    
    legend_games(team_data)

    innerChart
        .selectAll("rect.bar")
        .data(team_data) 
        .join("rect")
            .attr("class", "bar")
            .attr("x", d => padding + xScale(d.Index))
            .attr("y", d => (d.diff < 0) ? yScale(0) + 1 : yScale(d.diff))
            .attr("width", barSize)
            .attr("height", d => (d.diff > 0) ? yScale(0) - yScale(d.diff) -1 : yScale(d.diff) - yScale(0))
            .attr("fill", d => (d.diff > 0) ? "#5dc34f" : "#d26565")

    showDefaultLegend()

}
