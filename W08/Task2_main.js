d3.csv("https://ssatoshun.github.io/Information_Visualization/W08/W08_task2_data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; d.color = d.color;});

        var config = {
            parent: '#drawing_region',
            width: 256*3/2,
            height: 256*3/2,
            margin: {top:30, right:20, bottom:30, left:80}
        };

        const line_chart = new LineChart( config, data );
        line_chart.update();
    })
    .catch( error => {
        console.log( error );
    });
class LineChart {

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
              .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top-3})`);
  
          self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
          self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
  
          self.xscale = d3.scaleLinear()
              .range( [0, self.inner_width] );
  
          self.yscale = d3.scaleLinear()
              .range( [self.inner_height,0] );
  
          self.xaxis = d3.axisBottom( self.xscale )
              .ticks(5)
              .tickSizeOuter(0);

          self.yaxis = d3.axisLeft( self.yscale )
              .tickSizeOuter(0);
  
          self.xaxis_group = self.chart.append('g')
              .attr('transform', `translate(0, ${self.inner_height})`);

          self.yaxis_group = self.chart.append('g');
        
          self.svg.append("text")
            .attr("x",self.inner_width/2 - self.config.margin.right*2)
            .attr("y",self.config.margin.top-7)
            .attr("font-size","18px")
            .attr("fill","black")
            .attr("stroke","black")
            .attr("font-weight",20)
            .attr("stroke-width",1.6)
            .text("Line Chart with Dots and Area");

          self.area = d3.area()
            .x( d => self.xscale(d.x ))
            .y1( d => self.yscale(d.y) )
            .y0(self.inner_height);
          self.line = d3.line()
            .x( d => self.xscale(d.x ))
            .y( d => self.yscale(d.y) );
      }
  
      update() {
          let self = this;
          const xmin = d3.min(self.data, d => d.x);
          const xmax = d3.max(self.data, d => d.x);
          self.xscale.domain( [xmin,xmax]);

          const ymax = d3.max(self.data, d => d.y);

          self.yscale.domain( [0,ymax] );

          self.render();
      }
  
      render() {
          let self = this;
  
          self.chart.append("path")
              .attr("d", self.area(self.data))
              .attr('fill', '#999')
              .attr('stroke', 'black');

          self.chart.append("path")
              .attr("d", self.line(self.data))
              .attr('stroke', 'blue')
              .attr("stroke-width",2)
              .attr("fill","none");
              

          self.chart.selectAll("circle")
              .data(self.data)
              .enter()
              .append("circle")
              .attr("cx", function(d){ return self.xscale(d.x); })
              .attr("cy", function(d){ return self.yscale(d.y); })
              .attr("r", function(d){ return 4; })
              .style("fill","red")


              self.chart.selectAll("text")
                 .data(self.data)
                 .enter()
                 .append("text")
                 //.attr("fill","white");
                  .text(function(d) {
                     return d.y;
                  })
                  .attr("x", function(d, i) {
                     return self.xscale(d.x)+1;
                  })
                  .attr("y", function(d) {
                     return self.yscale(d.y)+12;
                  });
                   
          self.xaxis_group
              .call( self.xaxis )
              .append("text")
              .attr("x",self.inner_width/2)
              .attr("y",self.config.margin.bottom)
              .attr("font-size", "18px")
              .text("XLabel")
              .attr("fill","black")
              .attr("stroke","black")
              .attr("stroke-width",1);

          self.yaxis_group
              .call( self.yaxis )
              .append("text")
              .attr("x",-self.config.margin.right-self.inner_height/2)
              .attr("y",-self.config.margin.left/2)
              .attr("font-size", "18px")
              .text("YLabel")
              .attr("fill","black")
              .attr("stroke","black")
              .attr('transform', 'rotate(-90)')
              .attr('text-anchor', 'middle')
              .attr("stroke-width",1);

      }
  }

