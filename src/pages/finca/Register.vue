<template>
  <v-dialog v-model="dialog" max-width="500px">
    <AlertContainer ref="alertContainer" />

    <v-card :loading="loadingForm">
      <v-card-title>
        <span class="text-h5">{{ typeForm }}</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="validForm">
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-text-field v-model="name_finca" label="Nombre de tu finca*" :rules="fincaRules" maxlength="50"
                  counter variant="outlined" type="text"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-autocomplete label="Departamentos*" clearable item-title="name_department" item-value="id_department"
                  :items="departamenties" variant="outlined" v-model="id_department"></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-autocomplete label="Municipios*" clearable item-title="name_municipality"
                  item-value="id_municipality" :items="municipalities || []" variant="outlined"
                  v-model="fk_municipality_id"></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-autocomplete label="Veredas*" clearable item-title="name_vereda" item-value="id_vereda"
                  :items="veredas || []" variant="outlined" v-model="fk_vereda_id"></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                ¿El predio cuenta con documentos?
                <v-radio-group v-model="documentos" :rules="booleanRules" row>
                  <v-row>
                    <v-radio label="Sí" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-row>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row v-if="documentos">
              <v-col cols="12" sm="6" md="12">
                <v-text-field v-model="matricula_catastral" label="Número matricula catastral" :rules="fincaRules"
                  maxlength="50" counter variant="outlined" type="text"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                ¿Tiene servicios públicos?
                <v-radio-group v-model="servicio_publico" :rules="booleanRules" row>
                  <v-row>
                    <v-radio label="Sí" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-row>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row v-if="servicio_publico">
              <v-col cols="12" sm="6" md="12">
                Seleccione los servicios con los que cuenta
                <v-row>
                  <v-checkbox v-model="tipo_servicio" label="Agua" value="Agua" :rules="tipo_servicioRules"
                    variant="outlined"></v-checkbox>
                  <v-checkbox v-model="tipo_servicio" label="Electricidad" value="Electricidad"
                    :rules="tipo_servicioRules" variant="outlined"></v-checkbox>
                </v-row>
                <v-row>
                  <v-checkbox v-model="tipo_servicio" label="Gas" value="Gas" :rules="tipo_servicioRules"
                    variant="outlined"></v-checkbox>
                  <v-checkbox v-model="tipo_servicio" label="Internet" value="Internet" :rules="tipo_servicioRules"
                    variant="outlined"></v-checkbox>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                ¿Acceso carreteable?
                <v-radio-group v-model="acceso_carreteable" :rules="booleanRules" row>
                  <v-row>
                    <v-radio label="Sí" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-row>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row v-if="acceso_carreteable">
              <v-col cols="12" sm="6" md="12">
                Seleccione los servicios con los que cuenta
                <v-row>
                  <v-checkbox v-model="tipo_acceso" label="Herradura" value="Herradura" :rules="tipo_accesoRules"
                    variant="outlined"></v-checkbox>
                  <v-checkbox v-model="tipo_acceso" label="Destapado" value="Destapado" :rules="tipo_accesoRules"
                    variant="outlined"></v-checkbox>
                </v-row>
                <v-row>
                  <v-checkbox v-model="tipo_acceso" label="Primario" value="Primario" :rules="tipo_accesoRules"
                    variant="outlined"></v-checkbox>
                  <v-checkbox v-model="tipo_acceso" label="Pavimento" value="Pavimento" :rules="tipo_accesoRules"
                    variant="outlined"></v-checkbox>
                </v-row>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-text-field v-model="area_total" label="Area total del predio" :rules="fincaRules" maxlength="50"
                  counter variant="outlined" type="text"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-text-field v-model="area_produccion" label="Area en producción del predio" :rules="fincaRules"
                  maxlength="50" counter variant="outlined" type="text"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                ¿Tiene áreas en preservación?
                <v-radio-group v-model="preservacion" :rules="booleanRules" row>
                  <v-row>
                    <v-radio label="Sí" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-row>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row v-if="preservacion">
              <v-col cols="12" sm="6" md="12">
                <v-text-field v-model="area_preservacion" label="Área total en preservación" :rules="fincaRules"
                  maxlength="50" counter variant="outlined" type="text"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                ¿Cuenta con cuencas hídricas?
                <v-radio-group v-model="cuenca_hidrica" :rules="booleanRules" row>
                  <v-row>
                    <v-radio label="Sí" :value="true"></v-radio>
                    <v-radio label="No" :value="false"></v-radio>
                  </v-row>
                </v-radio-group>
              </v-col>
            </v-row>
            <v-row v-if="cuenca_hidrica">
              <v-col cols="12" sm="6" md="12">
                <v-text-field v-model="ubicacion_hidrica" label="Ubicación de la cuenca hídrica" :rules="fincaRules"
                  maxlength="50" counter variant="outlined" type="text"></v-text-field>
              </v-col>
            </v-row>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" variant="text" @click="cancel">Cancelar</v-btn>
        <v-btn color="blue darken-1" variant="text" @click="submitForm">Guardar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import AlertContainer from "../../components/Alerts/AlertContainer.vue"
import { useStore } from "vuex"
import { ref, watch, onMounted, defineProps, defineEmits, computed } from "vue"

const store = useStore();
// Data
const prop = defineProps(["modelValue", "type", "data"])
const emit = defineEmits(["modelValue"])
const dialog = ref(prop.modelValue); // Inicializamos el valor con la propiedad
const id_department = ref(null)
const municipalities = ref([null])
const fk_municipality_id = ref(null)
// FORM
const name_finca = ref(null)
const fk_vereda_id = ref(null)
const documentos = ref(null)
const matricula_catastral = ref(null)
const servicio_publico = ref(null)
const tipo_servicio = ref([])
const acceso_carreteable = ref(null)
const tipo_acceso = ref("")
const area_total = ref(null)
const area_produccion = ref(null)
const preservacion = ref(null)
const area_preservacion = ref(null)
const cuenca_hidrica = ref(null)
const ubicacion_hidrica = ref(null)
// DATA
const veredas = ref([null])
const validForm = ref(false)
const loadingForm = ref(false)
const form = ref(false)
const alertContainer = ref(null)
const showAlert = ref(false)
const errorMessage = ref(null)

// Rules
const fincaRules = ref([
  (value) => !!value || "Requerido.",
  (value) => (value || "").length >= 3 || "Mínimo 3 letras",
  (value) => (value || "").length <= 50 || "Máximo 50 letras",
]);

const booleanRules = ref([
  (value) => (value !== null) || 'Debe seleccionar una opción.'
]);

const tipo_servicioRules = computed(() => [
  () =>
    servicio_publico.value === null ||
    servicio_publico.value === false ||
    tipo_servicio.value.length > 0 ||
    'Debe seleccionar al menos un servicio.',
]);

const tipo_accesoRules = computed(() => [
  () =>
    acceso_carreteable.value === null ||
    acceso_carreteable.value === false ||
    tipo_acceso.value.length > 0 ||
    'Debe seleccionar al menos un tipo de acceso.',
]);

// Mounted
onMounted(() => { store.dispatch("municipality/list") });
onMounted(() => { store.dispatch("departament/list") });

// Computed
const departamenties = computed(() => store.getters["departament/departamens"]);

const typeForm = computed(() => prop.type === 1
  ? "Registrar Finca"
  : "Actualizar Finca"
);

const resetData = () => {
  name_finca.value = null
  fk_vereda_id.value = null
  id_department.value = null
  municipalities.value = [null]
  fk_municipality_id.value = null
  veredas.value = [null]
  documentos.value = null
  matricula_catastral.value = null
  servicio_publico.value = null
  tipo_servicio.value = []
  acceso_carreteable.value = null
  tipo_acceso.value = ""
  area_total.value = null
  area_produccion.value = null
  preservacion.value = null
  area_preservacion.value = null
  cuenca_hidrica.value = null
  ubicacion_hidrica.value = null
}

// Methods
async function submitForm() {

  loadingForm.value = true;
  validForm.value = false;

  const { valid } = await form.value.validate();

  if (valid) {
    const credentials = {
      name_finca: name_finca.value,
      fk_vereda_id: fk_vereda_id.value,
      documentos: documentos.value,
      matricula_catastral: matricula_catastral.value,
      servicio_publico: servicio_publico.value,
      tipo_servicio: tipo_servicio.value.join(', '),
      acceso_carreteable: acceso_carreteable.value,
      tipo_acceso: tipo_acceso.value,
      area_total: area_total.value,
      area_produccion: area_produccion.value,
      preservacion: preservacion.value,
      area_preservacion: area_preservacion.value,
      cuenca_hidrica: cuenca_hidrica.value,
      ubicacion_hidrica: ubicacion_hidrica.value
    };

    try {
      let response;
      if (prop.type === -1 && prop.data) {
        response = await store.dispatch("finca/update", { credentials, id: prop.data.value.id_finca });
      } else {
        response = await store.dispatch("finca/register", credentials);
      }
      // const response = await store.dispatch("finca/register", credentials);
      await store.dispatch("finca/list")
      alertContainer.value.addAlert({
        id: 1,
        type: "success",
        message: response,
      });

      loadingForm.value = false;
      resetData()

      setTimeout(() => {
        cancel()
      }, 2000); // Pausa de 2 segundos antes de cerrar y reiniciar el formulario

    } catch (error) {
      showAlert.value = true;
      errorMessage.value = error.message;

      if (error && typeof error === "object") {
        const { code, message } = error;
        const typeMessage = code === 409 ? "warning" : "error";

        alertContainer.value.addAlert({
          id: 1,
          type: typeMessage,
          message: message,
        });
      } else {
        alertContainer.value.addAlert({
          id: 1,
          type: "error",
          message: error,
        });
      }

      loadingForm.value = false;
    }
  } else {
    loadingForm.value = false;
  }
}

function cancel() {
  emit("update:modelValue", false); // Emite el evento para actualizar el valor de la propiedad

}

//WHATCH
watch(
  () => prop.modelValue,
  (newValue) => {
    dialog.value = newValue;
  }
);
watch(
  () => prop.data,
  (newValue) => {
    if (prop.type === -1 && newValue) {
      name_finca.value = newValue.value.name_finca;
      fk_vereda_id.value = newValue.value.fk_vereda_id;
    }
  }
);
watch(
  () => id_department.value,
  async (newDepartmentId) => {
    if (newDepartmentId) {
      try {
        await store.dispatch("municipality/departamentShow", newDepartmentId);
        municipalities.value = store.getters['municipality/municipalities'];
        console.log(store.getters['municipality/municipalities']);
      } catch (error) {
        console.error("Error fetching municipalities:", error);
      }
    } else {
      municipalities.value = [];
    }
  }
)
watch(
  () => fk_municipality_id.value,
  async (newVeredatId) => {
    if (newVeredatId) {
      try {
        await store.dispatch("vereda/list", newVeredatId);
        veredas.value = store.getters['vereda/veredas'];
      } catch (error) {
        console.error("Error fetching municipalities:", error);
      }
    } else {
      // If no department is selected, reset the municipalities array
      veredas.value = [];
    }
  }
)



</script>
