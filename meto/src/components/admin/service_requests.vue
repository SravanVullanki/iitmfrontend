<template>
  <AdminBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Service Requests</h1>

      <!-- Search form -->
      <form @submit.prevent="searchServiceRequests" class="form-inline mb-4">
        <div class="form-group">
          <select v-model="searchCategory" class="form-control ml-2" id="search_category" required>
            <option value="service">Service</option>
            <option value="professional">Professional</option>
            <option value="customer">Customer</option>
          </select>
        </div>

        <div class="form-group ml-3">
          <input
            v-model="searchTerm"
            type="text"
            class="form-control"
            id="search_term"
            placeholder="Enter search term..."
          />
        </div>

        <button type="submit" class="btn btn-primary ml-3">Search</button>
      </form>

      <!-- Service Requests Table -->
      <div class="row mt-4">
        <div v-if="serviceRequests.length > 0">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Customer</th>
                <th>Professional</th>
                <th>Service</th>
                <th>Status</th>
                <th>Request Date</th>
                <th>Service Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in serviceRequests" :key="request.request_id">
                <td>{{ request.request_id }}</td>
                <td>
                  {{ request.customer.username }} ({{ request.customer.email }})
                </td>
                <td>
                  {{ request.professional.username }} 
                </td>
                <td>{{ request.service.name }}</td>
                <td>{{ request.status }}</td>
                <td>{{ formatDate(request.request_date) }}</td>
                <td>{{ formatDate(request.service_date) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-else>
          <p>No service requests found.</p>
        </div>
      </div>
    </div>
  </AdminBoiler>
</template>

<script>
import axios from 'axios';
import config from '@/config'; 
import Cookies from 'js-cookie';
import AdminBoiler from './adminboiler.vue';

export default {
  components: {
    AdminBoiler,
  },
  data() {
    return {
      searchCategory: 'service', // Default search category
      searchTerm: '', // Empty search term
      serviceRequests: [], // Store fetched service requests here
    };
  },
  methods: {
    // Fetch service requests from the server based on search criteria
    async searchServiceRequests() {
      const session = Cookies.get('session'); // Fetch session token
      try {
        const response = await axios.post(`${config.url}/dash/service_requests`, {
          session: session,
          search_category: this.searchCategory,
          search_term: this.searchTerm,
        });
        this.serviceRequests = response.data.service_requests; 
      } catch (error) {
        console.error('Error fetching service requests:', error);
      }
    },
    // Format date to 'YYYY-MM-DD'
    formatDate(date) {
      return new Date(date).toISOString().split('T')[0];
    },
  },
  mounted() {
    // Fetch all service requests on component mount
    this.searchServiceRequests();
  },
};
</script>

<style scoped>
/* Add custom styles here if necessary */
</style>
