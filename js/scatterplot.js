const drawScatterplot = (data) => {
    const margin = {top: 40, right: 170, bottom: 25, left:60 };
    const width = 1000;
    const height = 500;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    //i think im going to focus on D1 teams only so far
    const d1_data = data.filter(d => d.Division == 'Division I');
    const d3_data = data.filter(d => d.Division == 'Division III');
    
    //set since many teams will appear in top 20 every time
    const top_teams = d1_data.filter(d => d.Rank <= 10);
    const top_team_names = new Set(top_teams.map(d => d.Team));

    //isolate top team data 
    const isolated_data = d1_data.filter(d => top_team_names.has(d.Team));
    console.log(top_team_names)
    //for when we actually need the date for the scales
    const parseDate = d3.timeParse("%Y-%m-%d");

    //append svg
    const svg = d3.select("#scatterplot")
        .append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)

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

    const lowestPowerRating = d3.min(isolated_data, d => d.PowerRating)
    const highestPowerRating = d3.max(isolated_data, d => d.PowerRating)

    // declare yScale
    const yScale = d3.scaleLinear()
        .domain([lowestPowerRating, highestPowerRating])
        .range([innerHeight, 0])

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

    const leftAxis = d3.axisLeft(yScale);
    innerChart
        .append("g")
        .attr("class", "axis-y")
        .call(leftAxis);

    innerChart
        .selectAll("circle")
        .data(isolated_data)
        .join("circle")
        .attr("r", 4)
        .attr("cx", d => xScale(parseDate(d.Date)))
        .attr("cy", d => yScale(d.PowerRating))
        .attr("fill", d => colorScale(d.Team))

    const curveGenerator = d3.line()
        .x(d => xScale(parseDate(d.Date)))
        .y(d => yScale(d.PowerRating))

    const dataByTeam = d3.group(isolated_data, d => d.Team);

    const linesGroup = innerChart.append("g").attr("class", "lines");

    linesGroup
        .selectAll("path")
        .data(dataByTeam)
        .join("path")
            .attr("d", ([team, values]) => curveGenerator(values))
            .attr("fill", "none")
            .attr("stroke", ([team, values]) => colorScale(team));
   
    addLegend(colorScale, top_team_names);
    console.log("legend called");
};