<template>
  <v-container fluid>
    <AlertContainer ref="alertContainer" />
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" class="fill-height">
        <v-card :loading="loadingForm">
          <v-card-title class="text-center">
            <h2>Registro</h2>
          </v-card-title>
          <v-card-text>
            <v-form  ref="form"  v-model="form">
              <v-text-field
                v-model="cedula_user"
                :rules="cedulaRules"
                label="Numero de identificacion"
                prepend-icon="mdi-card-account-details"
                maxlength="10"
                counter
                type="number"
              ></v-text-field>
              <v-text-field
                v-model="name_user"
                label="Nombre de usuario"
                :rules="nameRules"
                prepend-icon="mdi-account"
                maxlength="50"
                counter
                type="text"
              ></v-text-field>
              <v-text-field
                v-model="email_user"
                label="Correo electronico"
                :rules="emailRules"
                prepend-icon="mdi-email"
                maxlength="50"
                counter
                type="email"
                required
              ></v-text-field>
              <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-autocomplete prepend-icon="mdi-earth" label="Departamento*" clearable item-title="name_department" item-value="id_department"
                  :items="departamenties || []" variant="outlined" v-model="id_department" :rules="selectRules"></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-autocomplete prepend-icon="mdi-earth" label="Municipio*" clearable item-title="name_municipality"
                  item-value="id_municipality" :items="municipalities || []" variant="outlined"
                  v-model="fk_municipality_id" :rules="selectRules"></v-autocomplete>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-autocomplete prepend-icon="mdi-earth" label="Vereda*" clearable item-title="name_vereda" item-value="id_vereda"
                  :items="veredas || []" variant="outlined" v-model="fk_vereda_id" :rules="selectRules"></v-autocomplete>
              </v-col>
            </v-row>
              <v-text-field
                v-model="edad_user"
                label="Edad"
                :rules="edadRules"
                prepend-icon="mdi-cake-variant"
                maxlength="2"
                counter
                type="number"
              ></v-text-field>
              <v-row>
              <v-col cols="12" sm="6" md="12">
                <v-autocomplete prepend-icon="mdi-gender-male-female" label="Género*" clearable item-title="name" item-value="name"
                  :items="generos" variant="outlined" v-model="sexo_user" :rules="selectRules"></v-autocomplete>
              </v-col>
            </v-row>
              <v-text-field
                v-model="nacimiento_user"
                label="Nacimiento"
                :rules="nacimientoRules"
                prepend-icon="mdi-cake-variant"
                maxlength="10"
                counter
                type="date"
              ></v-text-field>
              <v-text-field
                v-model="estudios_user"
                label="Estudios"
                prepend-icon="mdi-brain"
                maxlength="100"
                counter
                type="text"
              ></v-text-field>
              <v-text-field
                v-model="password_user"
                label="Contraseña"
                :rules="passwordRules"
                prepend-icon="mdi-lock"
                maxlength="50"
                counter
                type="password"
                required
              ></v-text-field>
              <v-text-field
                v-model="celular1"
                label="Celular"
                :rules="celulardRules"
                prepend-icon="mdi-phone"
                maxlength="10"
                counter
                type="number"
                required
              ></v-text-field>
              <v-text-field
                v-model="celular2"
                label="Celular 2"
                :rules="celulardRules"
                maxlength="10"
                lazy
                counter
                prepend-icon="mdi-phone"
                type="number"
                required
              ></v-text-field>
              <v-btn color="primary" block @click="submitForm">Ingresar</v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
  
  <script>
import AlertContainer from "../../components/Alerts/AlertContainer.vue";
import {ref,onMounted,computed,watch} from "vue"
import { useStore } from "vuex"

export default {
  components: {
    AlertContainer,
  },
  data() {
    return {
      cedula_user: null,
      name_user: null,
      email_user: null,
      fk_vereda_id: null,
      edad_user: null,
      generos: [{name:"Hombre"},{name:"Mujer"}],
      sexo_user: null,
      nacimiento_user: null,
      estudios_user: null,
      password_user: null,
      celular1: null,
      celular2: null,
      typeMessage: "",
      form: true,
      valid: true,
      loadingForm: false,
      cedulaRules: [
        (value) => !!value || "Requerido.",
        (value) => (value || "").length <= 10 || "Max 10 numeros",
        (value) => (value || "").length >= 6 || "Min 6 numeros",
      ],
      nameRules:[
        (value) => !!value || "Requerido.",
        (value) => (value || "").length >= 8 || "Min 8 letras",
        (value) => (value || "").length <= 50 || "Max 50 letras",
      ],
      emailRules:[
        (value) => !!value || "Requerido.",
        (value) => (value || "").length <= 50 || "Max 50 letras",
        (value)=> {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'Correo invalido.'
        }
      ],
      edadRules:[
        (value) => !!value || "Requerido.",
        (value) => (value || "").length >= 2 || "Min 2 números",
        (value) => (value || "").length <= 3 || "Max 2 números",
      ],
      generoRules:[
        (value) => !!value || "Requerido.",
        (value) => (value || "").length >= 5 || "Min 6 letras",
        (value) => (value || "").length <= 7 || "Max 7 letras",
      ],
      nacimientoRules:[
        (value) => !!value || "Requerido.",
        // (value) => (value || "").length >= 10 || "Min 8 letras",
        // (value) => (value || "").length <=  || "Max 50 letras",
      ],
      passwordRules:[
        (value) => !!value || "Requerido.",
        (value) => (value || "").length >= 8 || "Min 8 letras",
        (value) => (value || "").length <= 50 || "Max 50 letras",
      ],
      celulardRules:[
       (value) => !!value || "Requerido.",
        (value) => (value || "").length <= 10 || "Max 10 numeros",
        (value) => (value || "").length >= 10 || "Min 10 numeros",
      ],
      selectRules:[
        (value) => !!value || "Requerido.",
      ]
    };
},
  setup(){
    const store = useStore();

    const id_department = ref(null)
    const municipalities = ref([null])
    const fk_municipality_id = ref(null)
    const veredas = ref([null])
    onMounted(() => { store.dispatch("departament/list") });
    // Computed
    const departamenties = computed(() => store.getters["departament/departamens"]);
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
return{
  id_department,
  municipalities,
  fk_municipality_id,
  departamenties,
  veredas
}

  },
  methods: {
    async submitForm() {
      this.loadingForm = true;
      const { valid } = await this.$refs.form.validate();
      if (valid) {
        const credentials = {
          cedula_user: this.cedula_user,
          name_user: this.name_user,
          email_user: this.email_user,
          fk_vereda_id: this.fk_vereda_id,
          edad_user: this.edad_user,
          sexo_user: this.sexo_user,
          nacimiento_user: this.nacimiento_user,
          estudios_user: this.estudios_user,
          password_user: this.password_user,
          celular1: this.celular1,
          celular2: this.celular2,
        };

        try {
          const response = await this.$store.dispatch(
            "auth/register",
            credentials
          );
          this.$refs.alertContainer.addAlert({
            id: 1,
            type: "success",
            message: response,
          });

          this.loadingForm = false;

          setTimeout(() => {
            this.$router.push("/login");
          }, 2000); // Pausa de 2 segundos antes de cerrar y reiniciar el formulario
        } catch (error) {

          this.showAlert = true;
          this.errorMessage = error.message;
          if (error && typeof error === "object") {
            const { code, message } = error;
            const typeMessage = code === 409 ?"error": "info";

            this.$refs.alertContainer.addAlert({
              id: 1,
              type: typeMessage,
              message: message,
            });

            this.loadingForm = false;
          } else {
            this.$refs.alertContainer.addAlert({
              id: 1,
              type: "error",
              message: error,
            });
            this.loadingForm = false;
          }
        }
      } else {
        this.loadingForm = false;
      }
    },
    
  },
};
</script>
  