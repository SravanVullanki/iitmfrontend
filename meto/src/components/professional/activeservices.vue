<template>
  <ProfessionalBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Active Service Requests</h1>

      <div v-if="message" class="alert alert-warning" role="alert">
        {{ message }}
      </div>

      <div class="row mt-4">
        <div class="col-lg-12">
          <div class="card shadow-sm border-0">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Your Active Service Requests</h5>
            </div>
            <div class="card-body">
              <div v-if="activeServiceRequests.length > 0">
                <table class="table table-hover table-responsive-lg">
                  <thead class="thead-dark">
                    <tr>
                      <th>Request ID</th>
                      <th>Customer Address</th>
                      <th>Customer Phone</th>
                      <th>Service Name</th>
                      <th>Status</th>
                      <th>Request Date</th>
                      <th>Service Date</th>
                      <th class="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="request in activeServiceRequests" :key="request.request_id">
                      <td>{{ request.request_id }}</td>
                      <td>{{ request.customer.address }}</td>
                      <td>{{ request.customer.phone_number }}</td>
                      <td>{{ request.service.name }}</td>
                      <td>
                        <span :class="getStatusClass(request.status)" :style="statusStyle(request.status)">
                          {{ request.status }}
                        </span>
                      </td>
                      <td>{{ formatDate(request.request_date) }}</td>
                      <td>{{ formatDate(request.service_date) }}</td>
                      <td class="text-center">
                        <div v-if="request.status === 'Pending'">
                          <button class="btn btn-success btn-sm mr-2" @click="handleAction(request.request_id, 'accept')">
                            <i class="fas fa-check"></i> Accept
                          </button>
                          <button class="btn btn-danger btn-sm" @click="handleAction(request.request_id, 'reject')">
                            <i class="fas fa-times"></i> Reject
                          </button>
                        </div>
                        <div v-else-if="request.status === 'Accepted'">
                          <div class="form-inline justify-content-center">
                            <input
                              type="text"
                              v-model="otpInput"
                              class="form-control form-control-sm mb-2 mr-sm-2"
                              maxlength="6"
                              placeholder="Enter 6-digit OTP"
                              required
                            />
                            <button class="btn btn-primary btn-sm mb-2" @click="handleAction(request.request_id, 'complete', otpInput)">
                              <i class="fas fa-check-circle"></i> Complete
                            </button>
                          </div>
                          <!-- Reject button removed when status is Accepted -->
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p v-else class="text-center text-muted">No active service requests found.</p>
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
  name: 'ActiveServices',
  components: {
    ProfessionalBoiler,
  },
  data() {
    return {
      activeServiceRequests: [],
      otpInput: '',
      message: '',
    };
  },
  created() {
    this.fetchActiveServiceRequests();
  },
  methods: {
    fetchActiveServiceRequests() {
      const session = Cookies.get('session');
      axios
        .get(`${config.url}/dash/professional/activeservices`, {
          params: { session: session },
        })
        .then((response) => {
          this.activeServiceRequests = response.data.active_service_requests;
        })
        .catch((error) => {
          console.error('Error fetching active service requests:', error);
          this.message = 'Failed to load service requests. Please try again later.';
        });
    },
    handleAction(requestId, action, otp = null) {
      const session = Cookies.get('session');
      axios
        .post(`${config.url}/dash/professional/activeservices`, {
          request_id: requestId,
          action: action,
          otp: otp,
        }, {
          params: { session: session },
        })
        .then((response) => {
          this.message = response.data.message; // Display success message
          this.fetchActiveServiceRequests(); // Refresh the list
        })
        .catch((error) => {
          console.error('Error processing action:', error);
          this.message = error.response?.data?.error || 'Action failed. Please try again.';
        });
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleString();
    },
    getStatusClass(status) {
      return {
        'badge badge-warning': status === 'Pending',
        'badge badge-info': status === 'Accepted',
        'badge badge-success': status === 'Completed',
        'badge badge-danger': status === 'Rejected',
      };
    },
    statusStyle(status) {
      if (status === 'Pending') {
        return { color: 'yellow' };
      } else if (status === 'Accepted') {
        return { color: 'green' };
      } else if (status === 'Rejected') {
        return { color: 'red' };
      }
      return {};
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
