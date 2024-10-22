<template>
  <ProfessionalBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Assigned Service Requests</h1>

      <div class="row mt-4">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-header">
              <h5>Your Assigned Service Requests</h5>
            </div>
            <div class="card-body">
              <div v-if="assignedServiceRequests.length > 0">
                <table class="table table-bordered">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Customer Address</th>
                      <th>Customer Phone</th>
                      <th>Service Name</th>
                      <th>Status</th>
                      <th>Request Date</th>
                      <th>Service Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="request in assignedServiceRequests" :key="request.request_id">
                      <td>{{ request.request_id }}</td>
                      <td>{{ request.customer.address }}</td>
                      <td>{{ request.customer.phone_number }}</td>
                      <td>{{ request.service.name }}</td>
                      <td>{{ request.status }}</td>
                      <td>{{ formatDate(request.request_date) }}</td>
                      <td>{{ formatDate(request.service_date) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p v-else>No assigned service requests found.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </ProfessionalBoiler>
</template>

<script>
import axios from 'axios';
import config from '@/config';
import Cookies from 'js-cookie';
import ProfessionalBoiler from './professionalboiler.vue';

export default {
  name: 'AssignedServiceRequests',
  components: {
    ProfessionalBoiler,
  },
  data() {
    return {
      assignedServiceRequests: [],
      message: '',
    };
  },
  created() {
    this.fetchAssignedServiceRequests();
  },
  methods: {
    fetchAssignedServiceRequests() {
      const session = Cookies.get('session');
      axios
        .get(`${config.url}/dash/professional/allservices`, {
          params: { session: session },
        })
        .then((response) => {
          this.assignedServiceRequests = response.data.assigned_service_requests;
        })
        .catch((error) => {
          console.error('Error fetching assigned service requests:', error);
          this.message = 'Failed to load service requests. Please try again later.';
        });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString();
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1100px;
}

.card-header {
  background-color: #007bff;
  color: white;
}

.table {
  margin-top: 20px;
}

.thead-dark {
  background-color: #343a40;
  color: white;
}

.badge {
  font-size: 0.9em;
  padding: 0.5em 1em;
  text-align: center;
}

.btn-sm {
  padding: 0.3rem 0.75rem;
  font-size: 0.875rem;
}

.form-control {
  margin-right: 10px;
  width: auto;
}

.form-inline {
  display: flex;
  align-items: center;
}

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.btn i {
  margin-right: 5px;
}
</style>
