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
        // self.color_scale = d3.scaleOrdinal()
		// 	.domain( d3.min(self.data, function(d){ return d.population; }), 
      	// 				d3.max(self.data, function(d){ return d.population; }))
		// 	.range( d3.schemeCategory20 );
    }

    update() {
        let self = this;
        
        self.pie
            .value(d => d.population)
            .sort(null);

        self.arc
            .innerRadius(this.inner_r)
            .outerRadius(self.outer_r);
        self.color = d3.scaleOrdinal()
                      .range(["#F4F6AA", "#D4AB92", "#DBAEEB", "#92C4D4", "#E3F6D6","#998732"]);

        self.render();
    }

    render() {
        let self = this;

        self.pieChart = self.chart.selectAll('pie')

            .append("g")
            .data( self.pie(self.data) )
        .enter();
            //.attr("class","pie");
//中心
        if(this.text_pie == "pie2"){
            self.pieChart
                .append('path')
                //.selectAll('path')
                
                .attr('d', self.arc)
                .attr('stroke', 'white')
                .style('stroke-width', '2px')
                //.style("fill",function(d,i){return d.data.color  ;})
                .attr("opacity", 3)
                .attr("id",self.text_pie)
                .attr("fill",function(d){
                    return self.color(d.index);
                })
                
                
                
                .on("click",function(ev,d){
                    let is_active = filter.includes(d.data.prefecturea);
                    if ( is_active ) {
                        filter = filter.filter( f => f !== d.data.prefecturea );
                    }
                    else {
                        filter.push( d.data.prefecturea );
                    }
                    Filter2();
                    //d3.selectAll("#"+self.text_pie).remove();
                    //d3.selectAll("#title").remove();
                })
                .on('mouseover', (e,d) => {
                    d3.select('#tooltip')
                        .style('opacity', 1)
                        .html(`<div class="tooltip-label">Population</div>(area:${d.data.prefecturea} , value:${d.data.population})`);
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
                .transition()
                .ease(d3.easeCircle)
                .duration(2000)
                .attrTween("d", function(d){    // ??定した??囲で値を変化させアニメーションさせ??
                    var interpolate = d3.interpolate(
                        { startAngle : 0, endAngle : 0 },   // ????グラフ???開始角度
                        { startAngle : d.startAngle, endAngle : d.endAngle }    // ????グラフ???終??角度
                    );
                    return function(t){
                        return self.arc(interpolate(t)); // 時間に応じて処??
                    }
                }); 
            }
            else{
                self.pieChart
                .append('path')
                //.selectAll('path')
                
                .attr('d', self.arc)
                .attr('stroke', 'white')
                .style('stroke-width', '2px')
                //.style("fill",function(d,i){return d.data.color  ;})
                .attr("opacity", 3)
                .attr("id",self.text_pie)
                //"#DC3912", "#3366CC", "#109618", "#FF9900", "#990099","#998732"
                .attr("fill",function(d,i){
                    if(d.data.area_num == 1)return "#F4F6AA";
                    else if(d.data.area_num==2)return "#D4AB92";
                    else if(d.data.area_num==3)return "#DBAEEB";
                    else if(d.data.area_num==4)return "#92C4D4";
                    else if(d.data.area_num==5)return "#E3F6D6";
                    else if(d.data.area_num==6)return "#998732";
    
                    //return self.color(d.data.area_num);
                })
                .on('mouseover', (e,d) => {
                    d3.select('#tooltip')
                        .style('opacity', 1)
                        .html(`<div class="tooltip-label">Population</div>(area:${d.data.area} , prefecturea:${d.data.prefecturea} , value:${d.data.population})`);
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
                .transition()
                .ease(d3.easeCircle)
                .duration(2000)
                .attrTween("d", function(d){    // ??定した??囲で値を変化させアニメーションさせ??
                    var interpolate = d3.interpolate(
                        { startAngle : 0, endAngle : 0 },   // ????グラフ???開始角度
                        { startAngle : d.startAngle, endAngle : d.endAngle }    // ????グラフ???終??角度
                    );
                    return function(t){
                        return self.arc(interpolate(t)); // 時間に応じて処??
                    }
                });

            }   
       

            // self.chart
            //  .append("g")
            //  .attr("id","text_value")
            //  .selectAll("text")
            //  .data(self.data)
            //  .join("text")
            //  .transition().duration(1000)
            //  .attr("fill","white")
            //  .text(d => d.value)
            //   .attr("x",d => self.xscale( d.label) + self.xscale.bandwidth()/self.data.length)
            //   .attr("y", d => self.yscale(d.value)+20);
         
          if(this.text_pie == "pie2"){

            self.pieChart
            .append("text")
            .text(function(d){return d.data.prefecturea;})
            .transition().duration(3000)
            .attr('text-anchor', 'middle')
            .attr('font-size','50px')
            .attr("transform", function(d) {
              var c = self.arc.centroid(d);
              return "translate("+c[0]*1.2+","+ c[1]*1.2 + ")";
            })
            .attr("fill","black")
            .attr("font-size","20px")
            .attr("font-weight","bold")
            
            .attr("id",self.text_pie);
  
            // self.pieChart
            //     .append("text")
            //     .text(function(d){return d.data.population;})
            //     .attr('text-anchor', 'middle')
            //     .attr('font-size','14px')
            //     .attr("transform", function(d) {
            //         return "translate("+self.arc.centroid(d)+ ")";
            //         //return "translate(10)";
            //     })
            //     .attr("dy",20)
            //     .attr("fill","black")
            //     .attr("id",self.text_pie);
          }
          else{
              if(filter.length > 0 && filter.length < 6){
                self.pieChart
                .append("text")
                .text(function(d){return d.data.prefecturea;})
                .transition().duration(3000)
                .attr('text-anchor', 'middle')
                .attr('font-size','14px')
                .attr("transform", function(d) {
                  var c = self.arc.centroid(d);
                  return "translate("+c[0]*1.2+","+ c[1]*1.2 + ")";
                })
                .attr("fill","black")
                .attr("font-size","20px")
                .attr("font-weight","bold")
                
                .attr("id",self.text_pie);
              }
          }
 
                 

    }
    tweenPie(b) {
        var i = d3.interpolate({startAngle: 0, endAngle: 0}, b);
        return function(t) {	return self.arc(i(t)) ;    };
    }
}
