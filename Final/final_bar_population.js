class BarChart_population {

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
            .text("Population of each Prefecture");
      }
  
      update() {
          let self = this;
          self.xscale.domain( self.data.map(d => d.prefecture ))
          .paddingInner(0.3);
          //self.yscale.domain( self.data.map(d => d.label ))
          //.paddingInner(0.3);

          const xmax = d3.max( self.data, d => d.population );
          self.yscale.domain( [0,xmax] );

          self.render();
      }
  
      render() {
          let self = this;
  
          self.chart.selectAll("rect")
              .data(self.data)
              .join("rect")
              .attr("fill",function(d,i){
                if(d.region_num == 1)return "#F4F6AA";
                else if(d.region_num==2)return "#D4AB92";
                else if(d.region_num==3)return "#DBAEEB";
                else if(d.region_num==4)return "#92C4D4";
                else if(d.region_num==5)return "#E3F6D6";
                else if(d.region_num==6)return "#998732";

                //return self.color(d.data.area_num);
            })
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Population</div>(region:${d.region} , prefecture:${d.prefecture} , value:${d.population})`);
            })
            .on('mousemove', (e) => {
                const padding = 10;
                d3.select('#tooltip')
                    .style('left', (e.pageX + padding) + 'px')
                    .style('top', (e.pageY + padding) + 'px');
            })
            .on('mouseleave', () => {
                d3.select('#tooltip')
                    .style('opacity', 0);
            })
              .transition().duration(1000)
            //  .on("click",self.color)
            //  .transition().duration(1000)
              .attr("x", d => self.xscale( d.prefecture))
              .attr("y", d => self.yscale( d.population) )
              .attr("height", d => self.inner_height-self.yscale(d.population ))
              .attr("width", self.xscale.bandwidth())
              //.attr("fill","yellow")
              ;
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
             .text(d => d.population)
             .attr("id","axis_value")
              .attr("x",d => self.xscale( d.prefecture) + self.xscale.bandwidth()/self.data.length)
              .attr("y", d => self.yscale(d.prefecture)+20);

              
        
          self.xaxis_group
              .call( self.xaxis )
              .style('font-size',"25px")
              //.selectAll('text')
              //.attr("y", 5)   // Y座標を指定する

              .append("g")
              .attr("id","text_value");
            //   .append("text")
              
            //   .attr("x",self.inner_width/2)
            //   .attr("y",self.config.margin.bottom)
            //   .text("Food Name")
            //   .attr("dy",2)
            //   .attr("fill","black")
            //   .attr("stroke","black")
            //   .attr("stroke-width",1);
              //.attr("y", 5)   // Y座標を指定する
              self.xaxis_group
              .call( self.xaxis )
              .selectAll("text")
              .attr("transform","rotate(-90)")
              .attr("dx",-40)
              .attr("dy",0);
              self.chart.selectAll('#XTitle').remove();
              self.xaxis_group
              //.call( self.xaxis )
              .append("text")
              .attr("x",self.inner_width/2)
              .attr("y",self.config.margin.bottom)
              .text("Prefectures")
              .attr("id","XTitle")
              //.attr("dy",2)
              .attr("fill","black")
              .attr("stroke","black")
              .attr("font-weight","bold")
              .attr("stroke-width",1);


          self.yaxis_group
              .call( self.yaxis )
              .style('font-size',"25px")
              .append("g")
              .attr("id","text_value")
              .append("text")
              .attr("x",-self.config.margin.right-self.inner_height/2)
              .attr("y",-self.config.margin.left/2)
              .attr("font-size", "25px")
              .text("Population")
              .attr("dy",-50)
              .attr("fill","black")
              .attr("stroke","black")
              .attr('transform', 'rotate(-90)')
              .attr("font-weight","bold")
              .attr('text-anchor', 'middle')
              .attr("stroke-width",1);

      }
  }

  

