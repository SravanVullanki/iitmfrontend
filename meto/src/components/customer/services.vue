<template>
  <CustomerBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Available Services</h1>

      <form @submit.prevent="fetchServices" class="mb-4">
        <div class="input-group">
          <input
            type="text"
            v-model="searchQuery"
            class="form-control"
            placeholder="Search services..."
          />
          <select v-model="selectedCategory" class="form-control">
            <option value="">All Categories</option>
            <option value="name">Name</option>
            <option value="description">Description</option>
            <option value="professional">Professional</option>
          </select>
          <div class="input-group-append">
            <button class="btn btn-primary" type="submit">Search</button>
          </div>
        </div>
      </form>

      <div v-if="loading">Loading services...</div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>

      <div class="row mt-4">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-header">
              <h5>List of Services</h5>
            </div>
            <div class="card-body">
              <template v-if="services.length > 0">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Service ID</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Base Price</th>
                      <th>Professional</th>
                      <th>Professional Rating</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="service in services" :key="service.service_id">
                      <td>{{ service.service_id }}</td>
                      <td>{{ service.name }}</td>
                      <td>{{ service.description }}</td>
                      <td>
                        <span v-if="typeof service.base_price === 'number'">
                          {{ service.base_price.toFixed(2) }}
                        </span>
                        <span v-else>N/A</span>
                      </td>
                      <td>{{ service.professional ? service.professional.username : 'N/A' }}</td>
                      <td>
                        <span v-if="service.professional">
                          {{ service.professional.rating > 0 ? (Math.round(service.professional.rating * 100) / 100).toFixed(2) : 'N/A' }}
                        </span>
                        <span v-else>N/A</span>
                      </td>
                      <td>
                        <router-link :to="{ path: '/customer/bookservice', query: { service_id: service.service_id } }" class="btn btn-primary">
                          Book
                        </router-link>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
              <template v-else>
                <p>No services available.</p>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CustomerBoiler>
</template>

<script>
import axios from 'axios';
import config from '@/config';
import Cookies from 'js-cookie';
import CustomerBoiler from './customerboiler.vue';

export default {
  components: {
    CustomerBoiler,
  },
  data() {
    return {
      services: [],
      searchQuery: '',
      selectedCategory: '', 
      loading: false,
      error: null,
    };
  },
  methods: {
    async fetchServices() {
      this.loading = true;
      this.error = null;

      try {
        const token = Cookies.get('access_token');
        const response = await axios.get(`${config.url}/dash/customer/services`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            search: this.searchQuery,
            category: this.selectedCategory, 
          },
        });

        console.log('API Response:', response.data);

        if (response.data && response.data.services) {
          this.services = response.data.services;
        } else {
          this.error = 'No services found.';
        }
      } catch (error) {
        this.error = 'Error fetching services, please try again.';
        console.error('Error fetching services:', error);
      } finally {
        this.loading = false;
      }
    },
  },
  created() {
    this.fetchServices(); 
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.card {
  margin-bottom: 20px;
  border-radius: 0.5rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card-header {
  background-color: #007bff;
  color: white;
  padding: 15px;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}

.table {
  width: 100%;
  margin-bottom: 20px;
}

.table th,
.table td {
  padding: 12px;
  text-align: center;
}

.table th {
  background-color: #f8f9fa;
}

.table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.table tr:hover {
  background-color: #e9ecef;
}

.alert {
  margin-top: 20px;
}

.input-group {
  margin-bottom: 5px;
}

.select {
  margin-left: 10px;
}
</style>
