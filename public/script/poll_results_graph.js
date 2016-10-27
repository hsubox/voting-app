d3.json(window.location.pathname.replace("show","json"), function(error, full_data) {
  if (error) return console.error("error loading graph:" + error);
  var data = full_data.poll.Choices;
  var width = 400;
  var height = 400;
  var radius = Math.min(width, height) / 2 - 30;
  var color = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
  var arc = d3.arc()
      .outerRadius(radius - 10)
      .innerRadius(radius - 70);
  var pie = d3.pie()
      .sort(null)
      .value(function(d) { return d.Votes.length; });
  var svg = d3.select("#graph").append("svg")
      .attr("width", width)
      .attr("height", height)
    .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
  var g = svg.selectAll(".arc")
        .data(pie(data))
      .enter().append("g")
        .attr("class", "arc");

    g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.option); });

    g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dx", "-1em")
      .text(function(d) { return d.data.option + ": " + d.data.Votes.length; });
});
