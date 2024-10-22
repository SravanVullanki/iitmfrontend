<template>
  <AdminBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Welcome to the Admin Dashboard, {{ user.username }}</h1>

      <div class="row mt-4">
        <!-- Services Section -->
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5>Services</h5>
            </div>
            <div class="card-body">
              <p>Total Services: {{ stats.total_services }}</p>
              <router-link :to="'/admin/services'" class="btn btn-primary">Manage Services</router-link>
            </div>
          </div>
        </div>

        <!-- Professionals Section -->
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5>Professionals</h5>
            </div>
            <div class="card-body">
              <p>New Applications: {{ stats.new_professional_applications }}</p>
              <p>Total Professionals: {{ stats.all_professional_count }}</p>
              <router-link :to="'/admin/professionals'" class="btn btn-primary">Review Applications and Professionals</router-link>
            </div>
          </div>
        </div>

        <!-- Service Requests Section -->
        <div class="col-lg-4">
          <div class="card">
            <div class="card-header">
              <h5>Service Requests</h5>
            </div>
            <div class="card-body">
              <p>Total Requests: {{ stats.total_requests }}</p>
              <p>Pending Requests: {{ stats.pending_requests }}</p>
              <router-link :to="'/admin/servicerequests'" class="btn btn-primary">View Requests</router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-4">
        <div class="col-lg-12">
          <button class="btn btn-success" @click="generateMonthlyReport">Download Monthly Report</button>
        </div>
      </div>
    </div>
  </AdminBoiler>
</template>

<script>
import axios from 'axios';
import AdminBoiler from './adminboiler.vue';
import config from '@/config'; 
import Cookies from 'js-cookie';

export default {
  name: 'AdminHome',
  components: {
    AdminBoiler,
  },
  data() {
    return {
      user: {
        username: '',
        role: '',
      },
      stats: {
        total_services: 0,
        new_professional_applications: 0,
        all_professional_count: 0,
        total_requests: 0,
        pending_requests: 0,
      },
    };
  },
  async mounted() {
    try {
      const session = Cookies.get('session');
      const response = await axios.get(`${config.url}/dash/dashboard`, {
        params: { session: session }
      });
      const data = response.data;

      if (data.user.role === 'admin') {
        this.user = data.user;
        this.stats = data.stats;
      } else {
        this.$router.push('/unauthorized');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        this.$router.push('/auth/login');
      } else {
        console.error('An error occurred:', error);
      }
    }
  },
  methods: {
    async generateMonthlyReport() {
      try {
        const session = Cookies.get('session');

        const response = await axios.get(`${config.url}/dash/download_report_pdf`, {
          params: { session: session },
          responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'monthly_report.pdf');
        document.body.appendChild(link);
        link.click();

        window.URL.revokeObjectURL(url);

      } catch (error) {
        console.error('An error occurred while downloading the report:', error);
      }
    }
   

  },
};
</script>

<style scoped>
.card {
  margin-bottom: 20px;
}
.success-message {
  color: green;
}
.error-message {
  color: red;
}
</style>
