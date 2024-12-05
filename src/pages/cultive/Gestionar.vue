<template>
  <v-row justify="center">
    <v-col cols="8">
      <v-text-field
        outlined
        dense
        append-icon="mdi-magnify"
        hide-details
        v-model="search"
      >
      </v-text-field>
    </v-col>
  </v-row>

  <v-row justify="center">
    <v-col cols="8">
      <v-data-table
        :headers="headers"
        :items="cultives"
        class="elevation-3"
        :search="search"
        :items-per-page="5"
        height="400"
      >
        <!-- Contenido adicional del v-data-table -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Gestionar Cultivos</v-toolbar-title>

            <v-btn color="primary" dark class="mb-2" @click="openModal">
              + Nuevo cultivo
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn @click="openModal(-1, item)" variant="text">
            <v-tooltip top activator="parent" location="top">
              Editar
              <template v-slot:activator="{ on, attrs }">
                <v-icon size="25" class="me-2" v-bind="attrs" v-on="on">
                  mdi-pencil
                </v-icon>
              </template>
            </v-tooltip>
          </v-btn>
          <v-btn @click="deleteItem(item.raw)" variant="text">
            <v-tooltip top activator="parent" location="top">
              Eliminar
              <template v-slot:activator="{ on, attrs }">
                <v-icon size="25" class="me-2" v-bind="attrs" v-on="on">
                  mdi-delete
                </v-icon>
              </template>
            </v-tooltip>
          </v-btn>
          <v-btn @click="crop_monitoring(item.raw.id_cultive)" variant="text">
            <v-tooltip top activator="parent" location="top">
              Seguimiento
              <template v-slot:activator="{ on, attrs }">
                <v-icon size="25" class="me-2" v-bind="attrs" v-on="on">
                  mdi-file-sign
                </v-icon>
              </template>
            </v-tooltip>
          </v-btn>
          <v-btn @click="estadistic(item.raw.id_cultive)" variant="text">
            <v-tooltip top activator="parent" location="top">
              Sensores
              <template v-slot:activator="{ on, attrs }">
                <v-icon size="25" class="me-2" v-bind="attrs" v-on="on">
                  mdi-chart-line
                </v-icon>
              </template>
            </v-tooltip>
          </v-btn>
          <v-btn @click="process(item.raw.id_cultive)" variant="text">
            <v-tooltip top activator="parent" location="top">
              Procesos
              <template v-slot:activator="{ on, attrs }">
                <v-icon size="25" class="me-2" v-bind="attrs" v-on="on">
                  mdi-cogs
                </v-icon>
              </template>
            </v-tooltip>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <!-- Modal de registro -->
  <Register :modelValue="modalOpen" @update:modelValue="modalOpen = $event" />
</template>
  
  <script setup>
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import Register from "./Register.vue";
import { useRouter, useRoute } from "vue-router"

const headers = [
  {
    title: "Mis cultivos",
    align: "start",
    sortable: false,
    value: "name_cultive",
  },
  {
    title: "Total del cultivo",
    sortable: false,
    value: "total_cultive",
  },
  {
    title: "Categoria del cultivo",
    sortable: false,
    value: "name_category",
  },
  {
    title: "Capacidad del cultivo",
    sortable: false,
    value: "capacidad_cultive",
  },
  {
    title: "Acciones",
    key: "actions",
    sortable: false,
  },
]

//router
const router = useRouter()
const route = useRoute()

const crop_monitoring = (id) => {
   router.push(
    {
      name:'crop_monitoring_gesiotnar',
      params:{id_cultive:id}
    }
   )
}

const estadistic=(id)=>{
  router.push({
    name:'estadistic',
    params:{id_cultive:id}
  })
}

const process =(id)=>{
  router.push({
    name:'process',
    params:{id_cultive:id}
  })
}
const store = useStore();

const modalOpen = ref(false);
const search = ref("");
onMounted(async () => {
  await store.dispatch("cultive/list",route.params.id_finca);
});

const cultives = computed(() =>
  Array.isArray(store.getters["cultive/cultives"])
    ? store.getters["cultive/cultives"]
    : []
);
const openModal = () => {
  modalOpen.value = !modalOpen.value;
};


const components = { Register };
</script>
  