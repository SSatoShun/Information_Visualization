class PieChart {

    constructor( config, data ,inner_r,outer_r,text_pie) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 128,
            radius: config.radius || 128,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.inner_r = inner_r;
        this.outer_r = outer_r;
        this.text_pie = text_pie;
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
           .text("Pie Chart")
           .attr("id","title");

        self.pie = d3.pie();

        self.arc = d3.arc();
    }

    update() {
        let self = this;
        
        self.pie
            .value(d => d.population);

        self.arc
            .innerRadius(this.inner_r)
            .outerRadius(self.outer_r);
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
            .attr("opacity", 3)
            .attr("id",self.text_pie)
            .on("click",function(d){
                d3.selectAll("#"+self.text_pie).remove();
                //d3.selectAll("#title").remove();
            });
       

      
         self.pieChart
              .append("text")
              .text(function(d){return d.data.refecturea;})
              .attr('text-anchor', 'middle')
              .attr('font-size','14px')
              .attr("transform", function(d) {
                return "translate("+self.arc.centroid(d)+ ")";
              })
              .attr("fill","white")
              .attr("id",self.text_pie);

          self.pieChart
              .append("text")
              .text(function(d){return d.data.population;})
              .attr('text-anchor', 'middle')
              .attr('font-size','14px')
              .attr("transform", function(d) {
                return "translate("+self.arc.centroid(d)+ ")";
              })
              .attr("dy",20)
              .attr("fill","white")
              .attr("id",self.text_pie);
                 

    }
}
