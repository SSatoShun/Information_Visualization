let input_data;
let input_data2;
let input_data3;
//let scatter_plot;
let pie_chart;
let pie_chart2;
let bar_chart;
let filter = [];
d3.csv("https://ssatoshun.github.io/Information_Visualization/Final/final_data.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => { d.refecturea = d.refecturea; d.wage = +d.wage;d.population = +d.population;d.born = d.born});

        var config = {
            parent: '#drawing_region',
            width: 256*5,
            height: 256*5,
            radius : Math.min(256,256)/2,
            margin: {top:30, right:20, bottom:30, left:30}
        };
        var config2 = {
            parent: '#drawing_region2',
            width: 256*5,
            height: 256*5,
            margin: {top:30, right:20, bottom:30, left:30}
        };

        // const pie_chart = new PieChart( config, data ,inner_r,outer_r);
        // const pie_chart2 = new PieChart( config, data,inner_r,outer_r );
        pie_chart = new PieChart( config, input_data ,200,500,"pie1");
        bar_chart = new BarChart( config2, input_data);
        //pie_chart2 = new PieChart( config, input_data,10,100,"pie2" );
        pie_chart.update();
        bar_chart.update();
        //pie_chart2.update();
    })
    .catch( error => {
        console.log( error );
    });

    d3.csv("https://ssatoshun.github.io/Information_Visualization/Final/final_separate.csv")
    .then( data => {
        input_data2 = data;
        input_data2.forEach( d => { d.refecturea = d.refecturea;d.population = +d.population});

        var config = {
            parent: '#drawing_region',
            width: 256*5,
            height: 256*5,
            radius : Math.min(256,256)/2,
            margin: {top:30, right:20, bottom:30, left:30}
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

function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot.data = input_data;
    }
    else {
        scatter_plot.data = input_data.filter( d => filter.includes( d.species ) );
    }
    scatter_plot.update();
}
function Filter2() {
    if ( filter.length == 0 ) {
        bar_chart.data = input_data;
    }
    else {
        bar_chart.data = input_data.filter( d => filter.includes( "石川" ) );
    }
    bar_chart.update();
}