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
              .attr('transform', `translate(${self.config.margin.left+10}, ${self.config.margin.top-3})`);
  
          self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
          self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
  
          self.xscale = d3.scaleBand()
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

          self.yaxis_group = self.chart.append('g')
              .attr('transform', `translate(-3,0)`);
        
          self.svg.append("text")
            .attr("x",self.inner_width/2)
            .attr("y",self.config.margin.top-7)
            .attr("font-size","24px")
            .attr("fill","black")
            .attr("stroke","black")
            .attr("font-weight",20)
            .attr("stroke-width",1.8)
            .text("Bar Chart");
      }
  
      update() {
          let self = this;
          self.xscale.domain( self.data.map(d => d.refecturea ))
          .paddingInner(0.3);
          //self.yscale.domain( self.data.map(d => d.label ))
          //.paddingInner(0.3);

          const xmax = d3.max( self.data, d => d.born );
          self.yscale.domain( [0,xmax] );

          self.render();
      }
  
      render() {
          let self = this;
  
          self.chart.selectAll("rect")
              .data(self.data)
              .join("rect")
              .transition().duration(1000)
            //  .on("click",self.color)
            //  .transition().duration(1000)
              .attr("x", d => self.xscale( d.refecturea))
              .attr("y", d => self.yscale( d.born) )
              .attr("height", d => self.inner_height-self.yscale(d.born ))
              .attr("width", self.xscale.bandwidth());
              //.attr("fill",function(d){return d.color;});
          //
         self.chart.selectAll('#text_value').remove();
         self.chart
             .append("g")
             .attr("id","text_value")
             .selectAll("text")
             .data(self.data)
             .join("text")
             .transition().duration(1000)
             .attr("fill","white")
             .text(d => d.born)
              .attr("x",d => self.xscale( d.refecturea) + self.xscale.bandwidth()/self.data.length)
              .attr("y", d => self.yscale(d.refecturea)+20);

              
        
          self.xaxis_group
              .call( self.xaxis )
              .append("g")
              .attr("id","text_value")
              .append("text")
              .attr("x",self.inner_width/2)
              .attr("y",self.config.margin.bottom)
              .attr("font-size", "18px")
              .text("Food Name")
              .attr("dy",2)
              .attr("fill","black")
              .attr("stroke","black")
              .attr("stroke-width",1);

          self.yaxis_group
              .call( self.yaxis )
              .append("g")
              .attr("id","text_value")
              .append("text")
              .attr("x",-self.config.margin.right-self.inner_height/2)
              .attr("y",-self.config.margin.left/2)
              .attr("font-size", "18px")
              .text("Value")
              .attr("fill","black")
              .attr("stroke","black")
              .attr('transform', 'rotate(-90)')
              .attr('text-anchor', 'middle')
              .attr("stroke-width",1);

      }
  }

  

