d3.csv("https://ssatoshun.github.io/Information_Visualization/W08/W08_task1_data.csv")
    .then( data => {
        data.forEach( d => { d.label = d.label; d.value = +d.value; d.color = d.color;});

        var config = {
            parent: '#drawing_region',
            width: 256*3/2,
            height: 256*3/2,
            margin: {top:30, right:20, bottom:30, left:80}
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });
class BarChart {

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
  
          self.yscale = d3.scaleBand()
              .range( [0, self.inner_height] );
  
          self.xaxis = d3.axisBottom( self.xscale )
              .ticks(5)
              .tickSizeOuter(0);

          self.yaxis = d3.axisLeft( self.yscale )
              .tickSizeOuter(0);
  
          self.xaxis_group = self.chart.append('g')
              .attr('transform', `translate(0, ${self.inner_height-1})`);

          self.yaxis_group = self.chart.append('g');
        
          self.svg.append("text")
            .attr("x",self.inner_width/2)
            .attr("y",self.config.margin.top-5)
            .attr("font-size","25px")
            .attr("fill","black")
            .attr("stroke","black")
            .attr("font-weight",20)
            .attr("stroke-width",1.8)
            .text("Bar Chart");
      }
  
      update() {
          let self = this;
          const xmax = d3.max( self.data, d => d.value );
          self.xscale.domain( [0, xmax] );
  
          //const ymin = d3.min( self.data, d => d.y );
          //const ymax = d3.max( self.data, d => d.y );
          self.yscale.domain( self.data.map(d => d.label ))
          .paddingInner(0.3);

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
              .attr("width", d => self.xscale(d.value ))
              .attr("height", self.yscale.bandwidth())
              .attr("fill",function(d){return d.color;});

            //   chart.selectAll("rect").data(data).enter()
            //   .append("rect")
            //   .attr("x", 0)
            //   .attr("y", d => yscale(d.label))
            //   .attr("width", d => xscale(d.value))
            //   .attr("height", yscale.bandwidth());
  
          self.xaxis_group
              .call( self.xaxis )
              .append("text")
              .attr("x",self.inner_width/2)
              .attr("y",self.config.margin.bottom)
              .attr("font-size", "18px")
              .text("X-label")
              .attr("fill","black")
              .attr("stroke","black")
              .attr("stroke-width",1);

          self.yaxis_group
              .call( self.yaxis )
              .append("text")
              .attr("x",0)
              .attr("y",0)
              .attr("font-size", "18px")
              .text("Y-label")
              .attr("fill","black")
              .attr("stroke","black")
              .attr("stroke-width",1);
      }
  }

