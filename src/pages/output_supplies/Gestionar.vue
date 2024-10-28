<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-text-field outlined dense append-icon="mdi-magnify" hide-details v-model="search">
      </v-text-field>
    </v-col>
  </v-row>

  <v-row justify="center">
    <AlertContainer ref="alertContainer" /> <!-- SPAIN CHANGE -->
    <v-col cols="6">
      <v-data-table :headers="headers" :items="outsupplies" class="elevation-3" :search="search" :items-per-page="5"
        height="400">
        <!-- Contenido adicional del v-data-table -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Gestionar insumos utilizados</v-toolbar-title>

            <v-btn color="primary" dark class="mb-2" @click="openModal">
              + Nuevo insumo utilizado
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon size="small" class="me-2" @click="openModal(-1, item)">
            mdi-pencil
          </v-icon>

          <v-icon size="small" class="me-2" @click="deleteItem(item.raw.id_outsupplies)">
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <!-- Modal de registro -->
  <Register :modelValue="modalOpen" @update:modelValue="modalOpen = $event" />
</template>

<script setup>
import AlertContainer from "../../components/Alerts/AlertContainer.vue"
import { ref, computed, onMounted } from "vue"
import { useStore } from "vuex";
import Register from "./Register.vue"
import { useRoute } from "vue-router"

const loadingForm = ref(false)
const alertContainer = ref(null)
const showAlert = ref(false)
const errorMessage = ref(null)

const headers = [
  {
    title: "Insumos utilizados",
    align: "start",
    sortable: false,
    value: "amount_outsupplies",
  },
  // {
  //   title: "Total del cultivo",
  //   sortable: false,
  //   value: "total_cultive",
  // },
  // {
  //   title: "Capacidad del cultivo",
  //   sortable: false,
  //   value: "capacidad_cultive",
  // },
  {
    title: "Acciones",
    key: "actions",
    sortable: false,
  },
]

const store = useStore()
const route = useRoute()

const modalOpen = ref(false)
const search = ref("");

onMounted(async () => {
  await store.dispatch("outsupply/list", route.params.id_process)
});


const outsupplies = computed(() =>
  Array.isArray(store.getters["outsupply/outsupplies"])
    ? store.getters["outsupply/outsupplies"]
    : []
);
console.log(outsupplies)
const openModal = () => {
  modalOpen.value = !modalOpen.value
};

const deleteItem = async (id_outsupply) => {
  loadingForm.value = true

  try {
    const response = await store.dispatch("outsupply/delete", id_outsupply)
    alertContainer.value.addAlert({
      id: 1,
      type: "success",
      message: response,
    });

    const index = outsupplies.value.findIndex((data) => data.id_outsupplies === id_outsupply);
    if (index !== -1) {
      // Si el índice es válido
      outsupplies.value.splice(index, 1); // Elimina el elemento en el índice 'index'
    }

    loadingForm.value = false
  } catch (error) {
    showAlert.value = true
    errorMessage.value = error.message

    if (error && typeof error === "object") {
      const { code, message } = error
      const typeMessage = code === 409 ? "warning" : "error"

      alertContainer.value.addAlert({
        id: 1,
        type: typeMessage,
        message: message,
      })
    } else {
      alertContainer.value.addAlert({
        id: 1,
        type: "error",
        message: error,
      })
    }
  }
}


const components = { Register }
</script>
