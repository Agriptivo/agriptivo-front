<template>
  <v-row justify="center">
    <v-col cols="6">
      <v-text-field outlined dense append-icon="mdi-magnify" hide-details v-model="search"></v-text-field>
    </v-col>
  </v-row>

  <v-row justify="center">
    <AlertContainer ref="alertContainer" /> <!-- SPAIN CHANGE -->
    <v-col cols="6">
      <v-data-table :headers="headers" :items="filteredSupplies" class="elevation-3" :search="search"
        :items-per-page="5" height="400">
        <!-- Contenido adicional del v-data-table -->
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title>Gestionar Suministros</v-toolbar-title>

            <v-btn color="primary" dark class="mb-2" @click="openModal(1)">
              + Nuevo suministro
            </v-btn>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon size="small" class="me-2" @click="openModal(-1, item)">
            mdi-pencil
          </v-icon>
          <v-icon size="small" @click="deleteItem(item.raw.id_supplies)">
            mdi-delete
          </v-icon>
          <!-- <v-icon size="small" @click="cultive(item.raw.id_finca)">
            mdi-monitor-edit
          </v-icon> -->
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
import { useRoute } from "vue-router";
// import { useRouter, useRoute } from "vue-router"

const headers = [
  {
    title: "Mis suministros",
    align: "start",
    sortable: false,
    // value: "name_supplies",
    value: "combined",
  },
  {
    title: "Acciones",
    key: "actions",
    sortable: false,
  },
];

const store = useStore();
const route = useRoute()


const modalOpen = ref(false);
const search = ref("");
const dataModal = ref({});
const typeModal = ref(1);

const loadingForm = ref(false)
const alertContainer = ref(null)
const showAlert = ref(false)
const errorMessage = ref(null)

onMounted(async () => {
  await store.dispatch("supply/list", route.params.id_finca);
});

const supplies = computed(() =>
  Array.isArray(store.getters["supply/supplies"]) ? store.getters["supply/supplies"] : []
);

const combinedSupplies = computed(() =>
  supplies.value.map(supply => ({
    ...supply,
    combined: `${supply.name_supplies} - ${supply.amount_supplies} ${supply.WUnitModel.name_wunit}`
  }))
);

const filteredSupplies = computed(() =>
  combinedSupplies.value.filter((supply) => supply.combined.toLowerCase().includes(search.value.toLowerCase()))
);


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



const components = { Register }

const deleteItem = async (id_supply) => {
  loadingForm.value = true

  try {
    const response = await store.dispatch("supply/delete", id_supply)
    alertContainer.value.addAlert({
      id: 1,
      type: "success",
      message: response,
    });

    const index = supplies.value.findIndex((data) => data.id_supplies === id_supply);
    if (index !== -1) {
      // Si el índice es válido
      supplies.value.splice(index, 1); // Elimina el elemento en el índice 'index'
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
</script>
