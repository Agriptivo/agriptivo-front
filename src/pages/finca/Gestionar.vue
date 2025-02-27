<template>
  <v-row justify="center">
    <v-col cols="8">
      <v-text-field outlined dense append-icon="mdi-magnify" hide-details v-model="search"></v-text-field>
    </v-col>
  </v-row>

  <v-row justify="center">
    <AlertContainer ref="alertContainer" /> <!-- SPAIN CHANGED -->
    <v-col cols="8">
      <v-data-table :headers="headers" :items="filteredFincas" class="elevation-3" :search="search" :items-per-page="5"
        height="400">
        <!-- Contenido adicional del v-data-table -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Gestionar Fincas</v-toolbar-title>

            <v-btn color="primary" dark class="mb-2" @click="openModal(1)">
              + Nueva finca
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-btn @click="openModal(-1, item)" variant="text" class="">
            <v-icon size="large" class="me-2">
              mdi-pencil
            </v-icon>
          </v-btn>
          <v-btn @click="deleteItem(item.raw.id_finca)" variant="text">
            <v-icon size="large" class="me-2">
              mdi-delete
            </v-icon>
          </v-btn>
          <v-btn @click="cultive(item.raw.id_finca)" variant="text">
            <v-tooltip top activator="parent" location="top">
              Cultivo
              <template v-slot:activator="{ on, attrs }">
                <v-icon size="large" class="me-2" v-bind="attrs" v-on="on">
                  mdi-sprout
                </v-icon>
              </template>
            </v-tooltip>
          </v-btn>

          <v-btn @click="supplies(item.raw.id_finca)" variant="text">
            <v-tooltip top activator="parent" location="top">
              Suministros entrada
              <template v-slot:activator="{ on, attrs }">
                <v-icon size="large" class="me-2" v-bind="attrs" v-on="on">
                  mdi-truck-plus-outline
                </v-icon>
              </template>
            </v-tooltip>
          </v-btn>
        </template>
      </v-data-table>
    </v-col>
  </v-row>

  <!-- Modal de registro -->
  <Register :modelValue="modalOpen" @update:modelValue="modalOpen = $event" :type="typeModal"
    @update:type="typeModal = $event" :data="dataModal" @update:data="dataModal = $event" />
</template>

<script setup>
import AlertContainer from "../../components/Alerts/AlertContainer.vue"
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import Register from "./Register.vue";
import { useRouter, useRoute } from "vue-router"

const loadingForm = ref(false)
const alertContainer = ref(null)
const showAlert = ref(false)
const errorMessage = ref(null)

const headers = [
  {
    title: "Mis fincas",
    align: "start",
    sortable: false,
    value: "name_finca",
  },
  {
    title: "Acciones",
    key: "actions",
    sortable: false,
  },
];

const store = useStore();

const modalOpen = ref(false);
const search = ref("");
const dataModal = ref({});
const typeModal = ref(1);

onMounted(async () => {
  await store.dispatch("finca/list");
});

const fincas = computed(() =>
  Array.isArray(store.getters["finca/fincas"]) ? store.getters["finca/fincas"] : []
);

const filteredFincas = computed(() =>
  fincas.value.filter((finca) => finca.name_finca.toLowerCase().includes(search.value.toLowerCase()))
)

const openModal = (type, item = null) => {
  modalOpen.value = true
  typeModal.value = type
  if (type === -1 && item) {
    // Si el tipo es -1 (editar) y se proporciona un ítem, se establece el valor del ítem en dataModal.
    dataModal.value = { ...item };
  } else {
    // Si el tipo no es -1 o no se proporciona un ítem, se crea un nuevo objeto en dataModal.
    dataModal.value = {};
  }
};

const deleteItem = async (id_finca) => {
  loadingForm.value = true

  try {
    const response = await store.dispatch("finca/delete", id_finca)
    alertContainer.value.addAlert({
      id: 1,
      type: "success",
      message: response,
    });

    const index = fincas.value.findIndex((data) => data.id_finca === id_finca);
    if (index !== -1) {
      // Si el índice es válido
      fincas.value.splice(index, 1); // Elimina el elemento en el índice 'index'
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
};

const components = { Register }

const router = useRouter()

const cultive = (id) => {
  router.push(
    {
      name: 'cultive_gestionar',
      params: { id_finca: id }
    }
  )
}
const supplies = (id) => {
  router.push(
    {
      name: 'suministro_gestionar',
      params: { id_finca: id }
    }
  )
}
</script>
