<template>
  <CustomerBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Service Requests</h1>
      <div v-if="serviceRequests.length > 0" class="card">
        <div class="card-header">
          <h5>Active Service Requests</h5>
        </div>
        <div class="card-body">
          <table class="table table-bordered">
            <thead>
              <tr>
                <th>Request ID</th>
                <th>Service Date</th>
                <th>Status</th>
                <th>Professional</th>
                <th>OTP</th>
                <th>Actions</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="request in serviceRequests" :key="request.request_id">
                <td>{{ request.request_id }}</td>
                <td>{{ formatDate(request.service_date) }}</td>
                <td>{{ request.status }}</td>
                <td>{{ request.professional ? request.professional.username : 'N/A' }}</td>
                <td>
                  <span v-if="request.status === 'Accepted'">{{ request.otp }}</span>
                  <span v-else>N/A</span>
                </td>
                <td>
                  <div v-if="request.status !== 'Completed'">
                    <button @click="deleteRequest(request.request_id)" class="btn btn-danger btn-sm">Delete</button>
                  </div>
                  <div v-else>
                    <p>Completed</p>
                  </div>
                </td>
                <td>
                 <div v-if="request.status === 'Completed' && !request.rating">
                    <select v-model="rating" required>
                      <option value="">Rate</option>
                      <option v-for="i in 5" :key="i" :value="i">{{ i }} Star{{ i > 1 ? 's' : '' }}</option>
                    </select> &nbsp;
                    <button @click="submitRating(request.request_id)" class="btn btn-success btn-sm" :disabled="!rating">Submit Rating</button>
                  </div>
                  <div v-else>
                    <p v-if="request.rating">Rated: {{ request.rating }} Stars</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else>
        <p>No service requests found.</p>
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
      serviceRequests: [],
      rating: '',
    };
  },
  async created() {
    await this.fetchServiceRequests();
  },
  methods: {
    async fetchServiceRequests() {
      try {
        const response = await axios.get(`${config.url}/dash/customer/home`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('access_token')}`, 
          },
        });
        this.serviceRequests = response.data.service_requests;
      } catch (error) {
        console.error('Error fetching service requests:', error);
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(dateString).toLocaleString(undefined, options);
    },
    async deleteRequest(requestId) {
      try {
        await axios.post(`${config.url}/dash/customer/delete_request/${requestId}`
        );
        this.fetchServiceRequests(); 
      } catch (error) {
        console.error('Error deleting service request:', error);
      }
    },
    async submitRating(requestId) {
      try {
        await axios.post(`${config.url}/dash/customer/rate_request/${requestId}`, {
         rating: this.rating.toString(),
        });
        this.fetchServiceRequests(); 
        this.rating = ''; 
      } catch (error) {
        console.error('Error submitting rating:', error);
      }
    },
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

.table th, .table td {
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

.btn {
  padding: 5px 10px; 
  border-radius: 0.3rem; 
}

.btn-danger {
  background-color: #dc3545; 
  color: white;
}

.btn-primary {
  background-color: #007bff; 
  color: white; 
}

.success-message {
  color: green; 
  margin: 10px 0; 
}

.error-message {
  color: red; 
  margin: 10px 0; 
}
</style>

