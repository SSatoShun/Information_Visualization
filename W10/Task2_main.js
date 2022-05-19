d3.csv("https://ssatoshun.github.io/Information_Visualization/W10/W10_task2_data.csv")
    .then( data => {
        //数値変換
        data.forEach( d => { d.x = +d.x; d.y = +d.y; d.r = +d.r });

        var config = {
            parent: '#drawing_region',
            width: 256*2,
            height: 256*2,
            margin: {top:30, right:30, bottom:30, left:30}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();

        d3.select('#color0').on('click' ,d=> scatter_plot.color_Flag(0))
        d3.select('#color1').on('click' , d=>scatter_plot.color_Flag(1))
        d3.select('#color2').on('click' , d=>scatter_plot.color_Flag(2))
        d3.select('#color3').on('click' , d=>scatter_plot.color_Flag(3))
        d3.select('#color4').on('click' , d=>scatter_plot.color_Flag(4))
        d3.select('#color5').on('click' , d=>scatter_plot.color_Flag(5))
        document.getElementById("all_announce").innerHTML = "You can use three functions!";
        document.getElementById("color_announce").innerHTML = "Function 1 : You can change the color with a click!<br>Your color of choice right now is <font color = red> 'Red'</font>";
        document.getElementById("radius_announce").innerHTML = "Function 2 : You can change radius of circles!";
        document.getElementById("tooltip_announce").innerHTML = "Function 3 : You can see the coordinates and radius of the circle by hovering the mouse over the circle!";
        d3.select('#radius-slider')
            .on('input', function() {
                scatter_plot.set_radius(parseInt(this.value));
                d3.select('#radius-value').text(this.value);
        });

    })
    .catch( error => {
        console.log( error );
    });

let color_flag =0;

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;
        //外枠(Parent)の幅指定
        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        //外枠の中のg領域の平行移動
        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        //g領域の領域サイズ計算
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        //スケールの調整。g領域のサイズにリシェイプするための変数
        self.xscale = d3.scaleLinear()
            .range( [self.config.margin.left, self.inner_width-self.config.margin.right] );

        self.yscale = d3.scaleLinear()
            .range( [self.config.margin.top, self.inner_height-self.config.margin.bottom] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(10)//メモリの刻み幅
            .tickSize(10)//メモリの棒の長さ
            .tickPadding(8);//軸と数値の間隔
            
            //.text("年/月"); 

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(10)
            .tickSize(10)
            .tickPadding(8);

        //g領域の中にさらにg領域を作成し、グラフの下に表示されるように平行移動している
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height-self.config.margin.top})`);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(${self.config.margin.left} ,0)`);

        self.svg.append("text")
            .attr("x",self.inner_width/2)
            .attr("y",self.config.margin.top)
            .attr("font-size","25px")
            .attr("fill","black")
            .attr("stroke","black")
            .attr("stroke-width",2)
            .text("Scatter Plot");
        self.radius = 20;

    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        //self.xscale.domain( [xmin, xmax] );
        self.xscale.domain( [xmin-self.config.margin.left/2, xmax+self.config.margin.right] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        //self.yscale.domain( [ymin, ymax] );
        self.yscale.domain( [ymax+self.config.margin.bottom,ymin-self.config.margin.top/2] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .on("click",self.color)
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r",  self.radius  )
            .attr("fill", d => d.color)
            .on('mouseover', (e,d) => {
                d3.select('#tooltip')
                    .style('opacity', 1)
                    .html(`<div class="tooltip-label">Position</div>(x:${d.x}, y:${d.y}, r:${self.radius})`);
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
            });

        self.xaxis_group
            .call( self.xaxis )
            .append("text")
            .attr("x",self.inner_width/2)
            .attr("y",self.config.margin.bottom)
            .attr("dy",19)
            .attr("font-size", "18px")
            .text("X-label")
            .attr("fill","black")
            .attr("stroke","black")
            .attr("stroke-width",1);
            


        self.yaxis_group
            //.attr("transform", "translate(" + self.config.margin.left + "," + 0 + ")")
            .call( self.yaxis )
            .append("text")
            .attr("x",0)
            .attr("y",0)
            .attr("dx",-200)
            .attr("dy",-40)
            .attr("font-size", "18px")
            .text("Y-label")
            .attr("fill","black")
            .attr("stroke","black")
            .attr("stroke-width",1)
            .attr("transform", "rotate(-90)")
            //.attr("transform","rotate(180,0,self.inner_height/2)")
            .attr("text-orientation","sideways");
            //.attr("writing-mode","vertical-rl");
    }
    color_Flag(flag){
        color_flag = flag;
        if(flag == 0)document.getElementById("color_announce").innerHTML = "Function 1 : You can change the color with a click!<br>Your color of choice right now is <font color = red> 'Red'</font>";
        if(flag == 1)document.getElementById("color_announce").innerHTML = "Function 1 : You can change the color with a click!<br>Your color of choice right now is <font color = red> 'Black'</font>";
        if(flag == 2)document.getElementById("color_announce").innerHTML = "Function 1 : You can change the color with a click!<br>Your color of choice right now is <font color = red> 'Green'</font>";
        if(flag == 3)document.getElementById("color_announce").innerHTML = "Function 1 : You can change the color with a click!<br>Your color of choice right now is <font color = red> 'Blue'</font>";
        if(flag == 4)document.getElementById("color_announce").innerHTML = "Function 1 : You can change the color with a click!<br>Your color of choice right now is <font color = red> 'Purple'</font>";
        if(flag == 5)document.getElementById("color_announce").innerHTML = "Function 1 : You can change the color with a click!<br>Your color of choice right now is <font color = red> 'Yellow'</font>";
      }
      
    color(){
        if(color_flag == 0){
            d3.select(this).style("fill","red");
        }
        if(color_flag == 1){
            d3.select(this).style("fill","black");
        }
        if(color_flag == 2){
            d3.select(this).style("fill","green");
        }
        if(color_flag == 3){
            d3.select(this).style("fill","blue");
        }
        if(color_flag == 4){
            d3.select(this).style("fill","purple");
        }
        if(color_flag == 5){
            d3.select(this).style("fill","yellow");
        }
    }
    set_radius(rr){
        d3.selectAll("circle")
                  .attr("r",rr)
                  .on('mouseover', (e,d) => {
                    d3.select('#tooltip')
                        .style('opacity', 1)
                        .html(`<div class="tooltip-label">Position</div>(x:${d.x}, y:${d.y}, r:${rr})`);
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
                });
    }
    
}
