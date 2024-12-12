<template>
  <v-row justify="center">
    <v-col cols="8">
      <v-text-field outlined dense append-icon="mdi-magnify" hide-details v-model="search">
      </v-text-field>
    </v-col>
  </v-row>

  <v-row justify="center">
    <v-col cols="8">
      <v-data-table :headers="headers" :items="activity_worker" class="elevation-3" :search="search" :items-per-page="5"
        height="400">
        <!-- Contenido adicional del v-data-table -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Lista de Actividades</v-toolbar-title>

          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useStore } from "vuex"

const headers = [
  {
    title: "Actividad",
    align: "start",
    sortable: false,
    value: "name_labour",
  },
  {
    title: "Descripción",
    sortable: false,
    value: "description",
  },
  {
    title: "Proceso",
    sortable: false,
    value: "name_process",
  },
  {
    title: "Finca",
    sortable: false,
    value: "name_finca",
  },
  {
    title: "Cultivo",
    sortable: false,
    value: "name_cultive",
  },
  {
    title: "Categoría",
    sortable: false,
    value: "name_subcategory",
  },
  {
    title: "Fecha",
    sortable: false,
    value: "createdAt",
  },
]

const store = useStore()

const search = ref("")

onMounted(async () => {
  await store.dispatch("worker/list")
})

const activity_worker = computed(() =>
  Array.isArray(store.getters["worker/activity_worker"])
    ? store.getters["worker/activity_worker"]
    : [],
  console.log(store.getters["worker/activity_worker"])
)

</script>