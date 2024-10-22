<template>
  <CustomerBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Book Service</h1>

      <div v-if="loading">Loading service details...</div>
      <div v-if="error" class="alert alert-danger">{{ error }}</div>
      <div v-if="service">
        <p><strong>Service:</strong> {{ service.name }}</p>
        <p><strong>Description:</strong> {{ service.description }}</p>
        <p><strong>Price:</strong> {{ (Math.round(service.base_price * 100) / 100).toFixed(2) }}</p>

        <form @submit.prevent="confirmBooking">
          <div class="mb-3">
            <label for="service_date" class="form-label">Service Date</label>
            <input type="date" v-model="serviceDate" class="form-control" id="service_date" required />
          </div>

          <div class="mb-3">
            <label for="service_time" class="form-label">Service Time</label>
            <input type="time" v-model="serviceTime" class="form-control" id="service_time" required />
          </div>

          <input type="hidden" v-model="professionalId" />

          <div class="mb-3">
            <label for="professional" class="form-label">Professional</label>
            <p>{{ service.professional ? service.professional.username : 'N/A' }}</p>
          </div>

          <button type="submit" class="btn btn-success">Confirm Booking</button>
          <router-link to="/customer/services" class="btn btn-secondary">Cancel</router-link>
        </form>
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
      service: null,
      serviceDate: '',
      serviceTime: '',
      professionalId: '',
      loading: true,
      error: null,
    };
  },
  methods: {
    async fetchServiceDetails() {
      const serviceId = this.$route.query.service_id; 
      const token = Cookies.get('access_token');

      try {
        const response = await axios.get(`${config.url}/dash/customer/services/${serviceId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data && response.data.service) {
          this.service = response.data.service;
          this.professionalId = this.service.professional.professional_id; 
        } else {
          this.error = 'Service not found.';
        }
      } catch (error) {
        this.error = 'Error fetching service details, please try again.';
        console.error('Error fetching service details:', error);
      } finally {
        this.loading = false;
      }
    },
    async confirmBooking() {
      const token = Cookies.get('access_token');

      try {
        const response = await axios.post(`${config.url}/dash/customer/book_service/${this.service.service_id}`, {
          professional_id: this.professionalId,
          service_date: this.serviceDate,
          service_time: this.serviceTime,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.message) {
          alert(response.data.message); 
          this.$router.push('/customer/home'); 
        }
      } catch (error) {
        this.error = 'Error confirming booking, please try again.';
        console.error('Error confirming booking:', error);
      }
    },
  },
  created() {
    this.fetchServiceDetails();
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  font-size: 2rem;
  margin-bottom: 20px;
}

.alert {
  margin-top: 20px;
}

.form-label {
  font-weight: bold;
}

.btn {
  margin-right: 10px;
}
</style>
