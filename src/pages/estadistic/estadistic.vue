<template>
  <v-row>
    <v-col cols="12" sm="6" md="4">
      <v-card>
        <v-card-title>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select prepend-icon="mdi-wifi-strength-1" label="Tipo de sensor*" clearable item-title="name_tsensor"
                item-value="id_tsensor" :items="sensores" variant="outlined" v-model="type_sensor1"
                :rules="selectRules"></v-select>
            </v-col>
          </v-row>
          <SingleDataLineChart v-if="hasGraphData" :graphData2="graphData" :id_sensor="type_sensor1"
            :dynamicTitle="dynamicTitle" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-card>
        <v-card-title>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select prepend-icon="mdi-wifi-strength-1" label="Tipo de sensor*" clearable item-title="name_tsensor"
                item-value="id_tsensor" :items="sensores" variant="outlined" v-model="type_sensor2"
                :rules="selectRules"></v-select>
            </v-col>
          </v-row>
          <SingleDataLineChart2 v-if="hasGraphData2" :graphData2="graphData2" :id_sensor="type_sensor2"
            :dynamicTitle="dynamicTitle" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-card>
        <v-card-title>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select prepend-icon="mdi-wifi-strength-1" label="Tipo de sensor*" clearable item-title="name_tsensor"
                item-value="id_tsensor" :items="sensores" variant="outlined" v-model="type_sensor3"
                :rules="selectRules"></v-select>
            </v-col>
          </v-row>
          <SingleDataChart v-if="hasGraphData3" :graphData2="graphData3" :id_sensor="type_sensor3" :dynamicTitle="dynamicTitle" />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12" sm="6" md="4">
      <v-card>
        <v-card-title>
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-select prepend-icon="mdi-wifi-strength-1" label="Tipo de sensor*" clearable item-title="name_tsensor"
                item-value="id_tsensor" :items="sensores" variant="outlined" v-model="type_sensor4"
                :rules="selectRules"></v-select>
            </v-col>
          </v-row>
          <SingleDataChart2 v-if="hasGraphData4" :graphData2="graphData4" :id_sensor="type_sensor4" :dynamicTitle="dynamicTitle"/>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup>

import { ref, onMounted, onUnmounted, watchEffect, computed, watch } from 'vue'
import { io } from 'socket.io-client'
import { useRoute } from "vue-router"
import SingleDataLineChart from './SingleLineChart.vue'
import SingleDataLineChart2 from './SingleLineChart2.vue'

import SingleDataChart from './SingleDataChart.vue'
import SingleDataChart2 from './SingleDataChart2.vue'
import { useStore } from "vuex"


//ROUTER
const route = useRoute()
const store = useStore();

const socket = io(import.meta.env.VITE_API_URL)

const graphData = ref([])
const graphData2 = ref([])
const graphData3 = ref([])
const graphData4 = ref([])
const type_sensor1 = ref(null)
const type_sensor2 = ref(null)
const type_sensor3 = ref(null)
const type_sensor4 = ref(null)
const dynamicTitle = ref("")

onMounted(() => { store.dispatch("type_sensor/list") })
const sensores = computed(() => Array.isArray(store.getters["type_sensor/sensores"]) ? store.getters["type_sensor/sensores"] : []);

const name_sensor = (id) => {
  dynamicTitle.value = sensores.value.find(sensor => sensor.id_tsensor === id)?.name_tsensor
}

const sensor1 = (graphName) => {
  socket.emit(graphName, `${route.params.id_cultive},${type_sensor1.value}`)

  socket.on(graphName, (data) => {
    graphData.value = data
  })
}

const sensor2 = (graphName) => {
  socket.emit(graphName, `${route.params.id_cultive},${type_sensor2.value}`)

  socket.on(graphName, (data) => {
    graphData2.value = data
  })
}
const sensor3 = (graphName) => {
  socket.emit(graphName, `${route.params.id_cultive},${type_sensor3.value}`)

  socket.on(graphName, (data) => {
    graphData3.value = data
  })
}

const sensor4 = (graphName) => {
  socket.emit(graphName, `${route.params.id_cultive},${type_sensor4.value}`)

  socket.on(graphName, (data) => {
    graphData4.value = data
  })
}

watch(
  () => type_sensor1.value, (newValue) => {
    name_sensor(type_sensor1.value)
    sensor1("grafica1")
  }
)
watch(
  () => type_sensor2.value, (newValue) => {
    name_sensor(type_sensor2.value)
    sensor2("grafica2")
  }
)
watch(
  () => type_sensor3.value, (newValue) => {
    name_sensor(type_sensor3.value)
    sensor3("grafica3")
  }
)
watch(
  () => type_sensor4.value, (newValue) => {
    name_sensor(type_sensor4.value)
    sensor4("grafica4")
  }
)

onUnmounted(() => {
  socket.disconnect()
})
const hasGraphData = ref(false)
const hasGraphData2 = ref(false)
const hasGraphData3 = ref(false)
const hasGraphData4 = ref(false)

watchEffect(() => {
  if (graphData.value.length > 0) {
    hasGraphData.value = true
  }
  if (graphData2.value.length > 0) {
    hasGraphData2.value = true
  }
  if (graphData3.value.length > 0) {
    hasGraphData3.value = true
  }
  if (graphData4.value.length > 0) {
    hasGraphData4.value = true
  }
})
</script>
