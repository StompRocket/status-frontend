<template>
  <div>
    <canvas :id="property.id"></canvas>
  </div>

</template>
<script>
  import Chart from 'chart.js'

  export default {
    name: 'chart',
    props: ['property'],
    mounted() {
      const ctx = document.getElementById(this.property.id);
      let chartData = this.property.chartData.map(i => {
        return {
          y: i.y,
          x: this.$moment.unix(i.x).toDate()
        }
      })
      let lineChart = new Chart(ctx, {
        type: 'line',
        data: {
          datasets: [{
            data: chartData,
            label: "Response Time in ms",
            borderColor: "black",
            lineTension: 0.1,
            fill: false
          }
          ]
        },
        options: {
          scales: {
            xAxes: [{
              zeroLineColor: 'transparent',
              type: 'time',
              time: {
                unit: 'minute'
              },
              ticks: {
                display: false
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
                showBorder: false,
                zeroLineColor: 'transparent'
              }
            }],
            yAxes: [{
              ticks: {
                display: false
              },
              gridLines: {
                color: "rgba(0, 0, 0, 0)",
                showBorder: false
              }
            }]
          },
          elements: {
            point:{
              radius: 2
            }
          },
          legend: {
            display: false
          },
          title: {
            display: false,
            text: 'World population per region (in millions)'
          }
        }
      });
    }
  }
</script>