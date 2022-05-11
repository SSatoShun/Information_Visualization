d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
            margin: {top:10, right:10, bottom:20, left:60}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

var data = [
    {label:'Apple', value:100},
    {label:'Banana', value:200},
    {label:'Cookie', value:50},
    {label:'Doughnut', value:120},
    {label:'Egg', value:80}
];

class ScatterPlot {

      constructor( config, data ) {
          this.config = {
              parent: config.parent,
              width: config.width || 256,
              height: config.height || 128,
              margin: config.margin || {top:10, right:10, bottom:10, left:10}
          }
          this.data = data;
          this.init();
      }
  
      init() {
          let self = this;
  
          self.svg = d3.select( self.config.parent )
              .attr('width', self.config.width)
              .attr('height', self.config.height);
  
          self.chart = self.svg.append('g')
              .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
  
          self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
          self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
  
          self.xscale = d3.scaleLinear()
              .range( [0, self.inner_width] );
  
          self.yscale = d3.scaleLinear()
              .range( [0, self.inner_height] );
  
          self.xaxis = d3.axisBottom( self.xscale )
              .ticks(5)
              .tickSizeOuter(0);

          self.yaxis = d3.axisLeft( self.yscale )
              .tickSizeOuter(0);
  
          self.xaxis_group = self.chart.append('g')
              .attr('transform', `translate(0, ${self.inner_height})`);

          self.yaxis_group = self.chart.append('g');
              //.attr('transform', `translate(0, ${self.inner_width})`);
      }
  
      update() {
          let self = this;
  
          const xmin = d3.min( self.data, d => d.x );
          const xmax = d3.max( self.data, d => d.x );
          self.xscale.domain( [xmin, xmax] );
  
          const ymin = d3.min( self.data, d => d.y );
          const ymax = d3.max( self.data, d => d.y );
          self.yscale.domain( [ymin, ymax] );
  
          self.render();
      }
  
      render() {
          let self = this;
  
          self.chart.selectAll("rect")
              .data(self.data)
              .enter()
              .append("rect")
              .attr("x", 0)
              .attr("y", d => self.yscale( d.label) )
              .attr("width", d => d.value )///
              .attr("height", yscale.bandwidth());

            //   chart.selectAll("rect").data(data).enter()
            //   .append("rect")
            //   .attr("x", 0)
            //   .attr("y", d => yscale(d.label))
            //   .attr("width", d => xscale(d.value))
            //   .attr("height", yscale.bandwidth());
  
          self.xaxis_group
              .call( self.xaxis );
          self.yaxis_group
              .call( self.yaxis );
      }
  }

// Initialize axis scales
const xscale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([0, inner_width]);

const yscale = d3.scaleBand()
      .domain(data.map(d => d.label))
      .range([0, inner_height])
      .paddingInner(0.1);

