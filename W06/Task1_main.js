d3.csv("https://ssatoshun.github.io/Information_Visualization/W06/W06_data.csv")
    .then( data => {
        //数値変換
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:16, right:16, bottom:16, left:16}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

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

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(10)
            .tickSize(10)
            .tickPadding(8);

        //g領域の中にさらにg領域を作成し、グラフの下に表示されるように平行移動している
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height-self.config.margin.top})`);

        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(${self.config.margin.left} ,0)`);

    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        //self.xscale.domain( [xmin, xmax] );
        self.xscale.domain( [xmin-self.config.margin.left, xmax+self.config.margin.right] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        //self.yscale.domain( [ymin, ymax] );
        self.yscale.domain( [ymin-self.config.margin.top, ymax+self.config.margin.bottom] );

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r );

        self.xaxis_group
            .call( self.xaxis );

        self.yaxis_group
            .call( self.yaxis );
    }
}
