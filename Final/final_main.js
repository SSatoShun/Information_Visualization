let input_data;
//let scatter_plot;
let pie_chart;
let pie_chart2;
let filter = [];
d3.csv("https://ssatoshun.github.io/Information_Visualization/Final/final_temp_data.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => { d.label = d.label; d.value = +d.value; d.color = d.color; d.species = +d.species});

        var config = {
            parent: '#drawing_region',
            width: 256*2,
            height: 256*2,
            radius : Math.min(256,256)/2,
            margin: {top:30, right:20, bottom:30, left:30}
        };

        // const pie_chart = new PieChart( config, data ,inner_r,outer_r);
        // const pie_chart2 = new PieChart( config, data,inner_r,outer_r );
        pie_chart = new PieChart( config, input_data ,100,150,"pie1");
        pie_chart2 = new PieChart( config, input_data,10,100,"pie2" );
        pie_chart.update();
        pie_chart2.update();
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