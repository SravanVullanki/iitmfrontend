<template>
  <AdminBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Edit Service</h1>
      <form @submit.prevent="editService" class="mt-4">
        <div class="mb-3">
          <label for="name" class="form-label">Service Name</label>
          <input
            type="text"
            v-model="editForm.name"
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
            id="name"
            required
          />
          <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
        </div>

        <div class="mb-3">
          <label for="description" class="form-label">Service Description</label>
          <textarea
            v-model="editForm.description"
            class="form-control"
            :class="{ 'is-invalid': errors.description }"
            id="description"
            required
          ></textarea>
          <div v-if="errors.description" class="text-danger">{{ errors.description }}</div>
        </div>

        <div class="mb-3">
          <label for="base_price" class="form-label">Base Price</label>
          <input
            type="number"
            v-model="editForm.base_price"
            class="form-control"
            :class="{ 'is-invalid': errors.base_price }"
            id="base_price"
            required
          />
          <div v-if="errors.base_price" class="text-danger">{{ errors.base_price }}</div>
        </div>

        <div class="mb-3">
          <label for="current_professional" class="form-label">Currently Assigned Professional</label>
          <div class="form-control-plaintext">
            {{ professionalName || 'None' }}
          </div>
        </div>

        <div class="mb-3">
          <label for="professional_id" class="form-label">Available Professionals</label>
          <select
            v-model="editForm.professional_id"
            class="form-select"
            :class="{ 'is-invalid': errors.professional_id }"
            id="professional_id"
            required
          >
            <!-- Default option showing currently assigned professional -->
            <option value="" disabled>Select a professional</option>
            <option 
              v-if="editForm.professional_id" 
              :value="editForm.professional_id"
            >
              {{ professionalName }} (ID: {{ editForm.professional_id }})
            </option>
            <option
              v-for="professional in professionals"
              :key="professional.professional_id"
              :value="professional.professional_id"
            >
              {{ professional.username }} (ID: {{ professional.professional_id }})
            </option>
          </select>
          <div v-if="errors.professional_id" class="text-danger">{{ errors.professional_id }}</div>
        </div>

        <button type="submit" class="btn btn-primary">Update Service</button> &nbsp;
        <router-link to="/admin/services" class="btn btn-secondary">Cancel</router-link>
      </form>
    </div>
  </AdminBoiler>
</template>

<script>
import axios from "axios";
import config from "@/config";
import AdminBoiler from './adminboiler.vue';
import Cookies from 'js-cookie';

export default {
  name: 'EditService',
  components: {
    AdminBoiler,
  },
  data() {
    return {
      editForm: {
        name: "",
        description: "",
        base_price: "",
        professional_id: null
      },
      professionals: [], 
      errors: {}, 
      professionalName: "", // Variable to hold the name of the currently assigned professional
    };
  },
  created() {
    this.fetchServiceDetails();
    this.fetchProfessionals();
  },
  methods: {
    async fetchServiceDetails() {
      const service_id = this.$route.params.service_id; 
      try {
        const response = await axios.get(`${config.url}/dash/dashboard/services/edit/${service_id}`);
        const service = response.data;

        this.editForm = {
          name: service.name,
          description: service.description,
          base_price: service.base_price,
          professional_id: service.professional_id 
        };
        
        this.professionalName = service.professional_name; 
      } catch (error) {
        console.error("Error fetching service details:", error);
      }
    },
    
    async fetchProfessionals() {
      const session = Cookies.get('session');
      try {
        const response = await axios.get(`${config.url}/dash/dashboard/services`, {
          params: { session: session }
        });

        this.professionals = response.data.professionals;

        if (this.professionals.length === 0) {
          this.flashMessage = "No free professionals at the moment.";
        }
      } catch (error) {
        console.error('Error fetching professionals:', error);
        this.flashMessage = "Failed to fetch professionals. Please try again later.";
      }
    },

    async editService() {
      const service_id = this.$route.params.service_id;
      try {
        await axios.put(
          `${config.url}/dash/dashboard/services/edit/${service_id}`,
          this.editForm,
          { withCredentials: true }
        );
        this.$router.push("/admin/services"); 
      } catch (error) {
        if (error.response && error.response.data.errors) {
          this.errors = error.response.data.errors; 
        } else {
          console.error("Error updating service:", error);
        }
      }
    }
  }
};
</script>

<style scoped>
</style>
