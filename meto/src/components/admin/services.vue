<template>
  <AdminBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Manage Services</h1>

      <div v-if="flashMessage" class="alert alert-info">{{ flashMessage }}</div>

      <div class="mt-4">
        <div class="mb-3">
          <label for="name" class="form-label">Service Name</label>
          <input type="text" id="name" v-model="newService.name" class="form-control" required />
          <div v-if="errors.name" class="text-danger">{{ errors.name }}</div>
        </div>
        <div class="mb-3">
          <label for="description" class="form-label">Service Description</label>
          <textarea id="description" v-model="newService.description" class="form-control" required></textarea>
          <div v-if="errors.description" class="text-danger">{{ errors.description }}</div>
        </div>
        <div class="mb-3">
          <label for="base_price" class="form-label">Base Price</label>
          <input type="number" id="base_price" v-model="newService.base_price" class="form-control" required />
          <div v-if="errors.base_price" class="text-danger">{{ errors.base_price }}</div>
        </div>
        <div class="mb-3">
          <label for="professional_id" class="form-label">Offered By</label>
          <select id="professional_id" v-model="newService.professional_id" class="form-select" required>
            <option value="" disabled>Select a professional</option>
            <option v-for="professional in professionals" :key="professional.professional_id" :value="professional.professional_id">
              {{ professional.username }}
            </option>
          </select>
          <div v-if="errors.professional_id" class="text-danger">{{ errors.professional_id }}</div>
        </div>
        <button type="button" @click="addService" class="btn btn-primary">Add Service</button>
      </div>

      <h2 class="mt-4">Existing Services</h2>
      <ul class="list-group mt-3">
        <li v-for="service in services" :key="service.service_id" class="list-group-item">
          <h5>Service Name: {{ service.name }}</h5>
          <p>Service Description: {{ service.description }}</p>
          <p>Base Price: ₹{{ service.base_price.toFixed(2) }}</p>
          <p>Offered by: {{ service.professional.username }}</p>
          <button @click="goToEditService(service.service_id)" class="btn btn-sm" style="background-color: darkorange; color: black; box-shadow: none;">Edit</button>
          &nbsp;
          <button @click="deleteService(service.service_id)" class="btn btn-danger btn-sm">Delete</button>
        </li>
      </ul>
    </div>
  </AdminBoiler>
</template>

<script>
import axios from 'axios';
import config from '@/config'; 
import Cookies from 'js-cookie';
import AdminBoiler from './adminboiler.vue';

export default {
  name: 'Services',
  components: {
    AdminBoiler,
  },
  data() {
    return {
      services: [],
      professionals: [],
      newService: {
        name: '',
        description: '',
        base_price: '',
        professional_id: null,
      },
      flashMessage: null,
      errors: {},
    };
  },
  mounted() {
    this.fetchServices();
  },
  methods: {
    async fetchServices() {
      const session = Cookies.get('session');
      try {
        const response = await axios.get(`${config.url}/dash/dashboard/services`, {
          params: { session: session }
        });
        this.services = response.data.services.map(service => ({
          ...service,
          base_price: Number(service.base_price) 
        }));
        this.professionals = response.data.professionals;

        if (this.professionals.length === 0) {
          this.flashMessage = "No Free professionals at the moment.";
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        this.flashMessage = "Failed to fetch services. Please try again later.";
      }
    },
  goToEditService(service_id) {
    this.$router.push(`/admin/editservice/${service_id}`);
  },


    async addService() {
      try {
        console.log('Adding service...');
        const response = await axios.post(`${config.url}/dash/dashboard/services/add`, this.newService, {
          withCredentials: true 
        });
        this.flashMessage = response.data.message;
        await this.fetchServices(); 
        this.newService = { name: '', description: '', base_price: '', professional_id: null };
        this.flashMessage = "Added The Service.";
      } catch (error) {
        console.error('Error adding service:', error.response.data.errors);
        this.errors = error.response.data.errors;
        this.flashMessage = "Failed to add service. Please check the form inputs.";
      }
    },
    async deleteService(service_id) {
    if (confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`${config.url}/dash/dashboard/services/delete/${service_id}`, {
          withCredentials: true,
        });
        this.services = this.services.filter(service => service.service_id !== service_id);
        alert("Service deleted successfully!");
      } catch (error) {
        console.error("Error deleting service:", error);
        alert("Failed to delete the service. Please try again later.");
      }
    }
  },
  }
};
</script>

<style>
</style>
