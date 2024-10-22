<template>
  <CustomerBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Your Service History</h1>

      <div v-if="history.length > 0" class="card">
        <div class="card-header">
          <h5>Service Requests</h5>
        </div>
        <div class="card-body">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Service Date</th>
                <th>Status</th>
                <th>Professional</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in history" :key="request.request_id">
                <td>{{ request.request_id }}</td>
                <td>{{ formatDate(request.service_date) }}</td>
                <td>{{ request.status }}</td>
                <td>{{ request.professional ? request.professional.username : 'N/A' }}</td>
                <td>{{ request.rating !== null ? request.rating : 'Not Rated' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <p v-else>No service requests found in your history.</p>
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
      history: []
    };
  },
  methods: {
    async fetchServiceHistory() {
          try {
        const token = Cookies.get('access_token');
        const response = await axios.get(`${config.url}/dash/customer/history`, {
          headers: {
           Authorization: `Bearer ${token}`
          },
        });
        this.history = response.data.history; 
      } catch (error) {
        console.error("Error fetching service history:", error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(dateString).toLocaleString(undefined, options); 
    }
  },
  mounted() {
    this.fetchServiceHistory(); 
  }
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
