<template>
  <div>
    <div id="container3">{{ dataArray }}</div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more'

HighchartsMore(Highcharts)

// Prop para recibir los datos de la gráfica
const props = defineProps({
  graphData2: {
    type: Object,
    required: true,
  },
  id_sensor: {
    type: Number,
    required: true,
  },
  dynamicTitle: {
    type: String,
    required: true
  }
});
let chartInstance = null; // Para almacenar la instancia de Highcharts
let dynamicTitle = props.dynamicTitle

watch(() => props.id_sensor, (newsensor) => {
  chartInstance.update({
    title: {
      text: props.dynamicTitle
    }
  });
})

watch(
  () => props.graphData2,
  (newValue) => {
    // Actualizar el valor directamente en la serie de la gráfica
    if (chartInstance && newValue !== undefined) {
      chartInstance.series[0].points[0].update(newValue); // Actualiza el punto de la serie
    }
  }
);

const highchartsgraph = () => {
  chartInstance = Highcharts.chart('container3', {
    chart: {
      type: 'gauge',
      plotBackgroundColor: null,
      plotBackgroundImage: null,
      plotBorderWidth: 0,
      plotShadow: false
    },
    title: {
      text: dynamicTitle
    },
    pane: {
      startAngle: -150,
      endAngle: 150
    },
    yAxis: {
      min: 0,
      max: 100,
      title: {
        text: 'Value'
      },
      labels: {
        distance: 20
      },
      plotBands: [
        {
          from: 0,
          to: 60,
          color: '#55BF3B' // Verde
        },
        {
          from: 60,
          to: 80,
          color: '#DDDF0D' // Amarillo
        },
        {
          from: 80,
          to: 100,
          color: '#DF5353' // Rojo
        }
      ]
    },
    series: [
      {
        name: 'Value',
        data: [props.graphData2 || 0] // Inicializar con el valor inicial
      }
    ]
  });
};

onMounted(() => {
  highchartsgraph()
})
</script>