d3.csv("https://ssatoshun.github.io/Information_Visualization/W08/W08_task3_data.csv")
    .then( data => {
        data.forEach( d => { d.label = d.label; d.value = +d.value; d.color = d.color;});

        var config = {
            parent: '#drawing_region',
            width: 256*2,
            height: 256*2,
            radius : Math.min(256,256)/2,
            margin: {top:30, right:20, bottom:30, left:30}
        };

        const pie_chart = new PieChart( config, data );
        pie_chart.update();
    })
    .catch( error => {
        console.log( error );
    });
class PieChart {

      constructor( config, data ) {
          this.config = {
              parent: config.parent,
              width: config.width || 256,
              height: config.height || 128,
              radius: config.radius || 128,
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

          self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
          self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
  
          self.chart = self.svg.append('g')
              .attr('transform', `translate(${self.config.margin.left+self.inner_width/2}, ${self.config.margin.top+self.inner_height/2})`);
  
          self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
          self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
  
        
           self.svg.append("text")
             .attr("x", self.inner_width/2-20)
             .attr("y",self.inner_height/4)
             .attr("font-size","24px")
             .attr("fill","black")
             .attr("stroke","black")
             .attr("font-weight",20)
             .attr("stroke-width",1.6)
             .text("Pie Chart");

          self.pie = d3.pie();

          self.arc = d3.arc();
      }
  
      update() {
          let self = this;

          self.pie
              .value(d => d.value);

          self.arc
              .innerRadius(30)
              .outerRadius(self.config.radius);
          self.color = d3.scaleOrdinal()
                        .range(["#DC3912", "#3366CC", "#109618", "#FF9900", "#990099"]);

          self.render();
      }
  
      render() {
          let self = this;

          self.pieChart = self.chart.selectAll('pie')
              .data( self.pie(self.data) )
              .enter()
              .append("g");
              //.attr("class","pie");

          self.pieChart.append('path')
              .attr('d', self.arc)
              .attr('stroke', 'white')
              .style('stroke-width', '2px')
              .style("fill",function(d,i){return d.data.color  ;})
              .attr("opacity", 3);
         

        
           self.pieChart
                .append("text")
                .text(function(d){return d.data.label;})
                .attr('text-anchor', 'middle')
                .attr('font-size','14px')
                .attr("transform", function(d) {
                  return "translate("+self.arc.centroid(d)+ ")";
                })
                .attr("fill","white");
                   

      }
  }

