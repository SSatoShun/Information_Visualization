let input_data;
let input_data2;
let input_data3;
//let scatter_plot;
let pie_chart;
let pie_chart2;
let bar_chart;
let bar_chart2;
let filter = [];
d3.csv("https://ssatoshun.github.io/Information_Visualization/Final/final_data.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => { d.prefecturea = d.prefecturea; d.wage = +d.wage;d.population = +d.population;d.born = d.born;d.area_num = +d.area_num});

        var config = {
            parent: '#drawing_region',
            width: 256*4,
            height: 256*4,
            radius : Math.min(256,256)/2,
            margin: {top:30, right:20, bottom:60, left:30}
        };
        var config2 = {
            parent: '#drawing_region2',
            width: 256*5,
            height: 256*4,
            margin: {top:30, right:20, bottom:100, left:80}
        };
        var config3 = {
            parent: '#drawing_region3',
            width: 256*5,
            height: 256*4,
            margin: {top:30, right:20, bottom:100, left:80}
        };
        d3.select('#reset')
            .style("width","300px")
            .style("height","100px")
            .style("font-size","50px")
            .on('click', d =>{
                filter=[];
                self.Filter2();
            })

        // const pie_chart = new PieChart( config, data ,inner_r,outer_r);
        // const pie_chart2 = new PieChart( config, data,inner_r,outer_r );
        pie_chart = new PieChart( config, input_data ,250,500,"pie1");
        bar_chart = new BarChart_population( config2, input_data);
        bar_chart2 = new BarChart_born( config3, input_data);
        //pie_chart2 = new PieChart( config, input_data,10,100,"pie2" );
        d3.selectAll("#choice_announce").style("font-size","60px");
        document.getElementById("choice_announce").innerHTML = "You have no choice. All date are displayed!";
        pie_chart.update();
        bar_chart.update();
        bar_chart2.update();
        //pie_chart2.update();
    })
    .catch( error => {
        console.log( error );
    });

    d3.csv("https://ssatoshun.github.io/Information_Visualization/Final/final_separate.csv")
    .then( data => {
        input_data2 = data;
        input_data2.forEach( d => { d.prefecturea = d.prefecturea;d.population = +d.population});

        var config = {
            parent: '#drawing_region',
            width: 256*4,
            height: 256*4,
            radius : Math.min(256,256)/2,
            margin: {top:30, right:20, bottom:60, left:30}
        };

        // const pie_chart = new PieChart( config, data ,inner_r,outer_r);
        // const pie_chart2 = new PieChart( config, data,inner_r,outer_r );
        //pie_chart = new PieChart( config, input_data ,100,150,"pie1");
        pie_chart2 = new PieChart( config, input_data2,50,200,"pie2" );
        pie_chart2.update();
        //pie_chart2.update();
    })
    .catch( error => {
        console.log( error );
    });

function Filter2() {
    if ( filter.length == 0 ) {
        bar_chart.data = input_data;
        bar_chart2.data = input_data;
        pie_chart.data = input_data;
        document.getElementById("choice_announce").innerHTML = "You have no choice. All date are displayed!";
        
    }
    else {
        bar_chart.data = input_data.filter( d => filter.includes( d.area ) );
        bar_chart2.data = input_data.filter( d => filter.includes( d.area ) );
        pie_chart.data = input_data.filter( d => filter.includes( d.area ) );
        document.getElementById("choice_announce").innerHTML = "Your choice is ("+filter+") !";
    }
    bar_chart.update();
    bar_chart2.update();
    pie_chart.update();
}