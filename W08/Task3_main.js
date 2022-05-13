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
  
        
        //   self.svg.append("text")
        //     .attr("x",self.inner_width/2 - self.config.margin.right*2)
        //     .attr("y",self.config.margin.top-7)
        //     .attr("font-size","18px")
        //     .attr("fill","black")
        //     .attr("stroke","black")
        //     .attr("font-weight",20)
        //     .attr("stroke-width",1.6)
        //     .text("Line Chart with Dots and Area");

          self.pie = d3.pie();

          self.arc = d3.arc();
      }
  
      update() {
          let self = this;

          self.pie
              .value(d => d.value);

          self.arc
              .innerRadius(0)
              .outerRadius(self.config.radius);

          self.render();
      }
  
      render() {
          let self = this;

          self.chart.selectAll('pie')
              .data( self.pie(self.data) )
              .enter()
              .append('path')
              .attr('d', self.arc)
              .attr('fill', 'black')
              .attr('stroke', 'white')
              .style('stroke-width', '2px');
        
        //   self.chart.selectAll("text")
        //          .data(self.data)
        //          .enter()
        //          .append("text")
        //          //.attr("fill","white");
        //           .text(function(d) {
        //              return d.y;
        //           })
        //           .attr("x", function(d, i) {
        //              return self.xscale(d.x)+1;
        //           })
        //           .attr("y", function(d) {
        //              return self.yscale(d.y)+12;
        //           });
                   

      }
  }

