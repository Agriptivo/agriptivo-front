<template>
  <div>
    <div id="container"></div>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import Highcharts from 'highcharts'
import HighchartsMore from 'highcharts/highcharts-more'

HighchartsMore(Highcharts)

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

let id_sensor = null
let chartInstance = null; // Para almacenar la instancia de Highcharts
let repeat = false

watch(
  () => props.graphData2,
  (newValues) => {
    // Solo agregar el nuevo punto
    if (chartInstance && newValues.length > 0 && !repeat) {
      const newPoint = newValues[newValues.length - 1]; // Obtener el último valor
      // El tercer parámetro elimina el primer punto si hay más de 10
      chartInstance.series[0].addPoint(newPoint, true, chartInstance.series[0].data.length >= 10);
    } else {
      highchartsgraph(props.graphData2, props.dynamicTitle); // Crear una nueva gráfica con los datos actuales

    }
  }
);

watch(() => props.id_sensor, (newsensor) => {
  repeat = false
  if (id_sensor !== newsensor) {
    repeat = true
  }
})

const highchartsgraph = (dataArray, dynamicTitle) => {
  chartInstance = Highcharts.chart('container', {
    chart: {
      type: 'line'
    },
    title: {
      text: dynamicTitle
    },
    xAxis: {
      categories: Array.from({ length: dataArray.length }, (_, i) => (i + 1).toString())
    },
    yAxis: {
      // type: 'logarithmic',
      type: 'linear',
      // minorTickInterval: 0,
      min: 0,
    },
    series: [{
      data: dataArray,
      pointStart: 0
    }]
  });
};

onMounted(() => {
  highchartsgraph(props.graphData2, props.dynamicTitle)
})
</script>