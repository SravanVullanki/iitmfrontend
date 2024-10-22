<template>
  <ProfessionalBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Welcome to Your Dashboard</h1>

      <div class="row mt-4">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-header">
              <h5>Active Service Requests</h5>
            </div>
            <div class="card-body">
              <div v-if="activeServiceRequests.length > 0">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Service Name</th>
                      <th>Service Date</th>
                      <th>Status</th>
                      <th>Customer Address</th>
                      <th>Customer Phone</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(request, index) in activeServiceRequests" :key="index">
                      <td>{{ request.service.name }}</td>
                      <td>{{ formatDateTime(request.service_date) }}</td>
                      <td>{{ request.status }}</td>
                      <td>{{ request.customer.address }}</td>
                      <td>{{ request.customer.phone_number }}</td>
                    </tr>
                  </tbody>
                </table>
                <router-link :to="{ path: '/professional/activeservices' }" class="btn btn-primary">
                  Review Request(s)
                </router-link>
              </div>
              <p v-else>No active service requests at the moment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ProfessionalBoiler>
</template>

<script>
import axios from "axios";
import ProfessionalBoiler from "./professionalboiler.vue"; 
import config from '@/config'; 
import Cookies from 'js-cookie';

export default {
  name: "ProfessionalHome",
  components: {
    ProfessionalBoiler,
  },
  data() {
    return {
      activeServiceRequests: [],
    };
  },
  methods: {
    formatDateTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },
    fetchServiceRequests() {
      const session = Cookies.get('session');

      axios
        .get(`${config.url}/dash/professional/home`, {
          params: { session: session }  
        })
        .then((response) => {
          this.activeServiceRequests = response.data.active_service_requests;
        })
        .catch((error) => {
          console.error("Error fetching service requests:", error);
        });
    },
  },
  created() {
    this.fetchServiceRequests();
  },
};
</script>

<style scoped>
.table {
  margin-top: 20px;
}

.btn-primary {
  margin-top: 20px;
}
</style>
