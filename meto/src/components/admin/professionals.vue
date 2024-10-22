<template>
  <AdminBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Manage Professionals</h1>

      <!-- Section for Pending Applicants -->
      <h2 class="mt-5">Pending Applicants</h2>
      <div class="row mt-4">
        <div v-if="pendingProfessionals.length > 0" class="row">
          <!-- Wrap each professional card inside a column -->
          <div v-for="professional in pendingProfessionals" :key="professional.professional_id" class="col-lg-4 col-md-6 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Name: {{ professional.user.username }}</h5>
                <p><strong>Expertise:</strong> {{ professional.expertise }}</p>
                <p><strong>Years of Experience:</strong> {{ professional.experience_years }}</p>
                <p><strong>Status:</strong> {{ professional.status }}</p>
                <p><strong>Flagged:</strong> {{ professional.flagged }}</p>
                <p><strong>Rating:</strong> {{ parseFloat(professional.rating).toFixed(2) }}</p>
                <p>
                  <a :href="getResumeUrl(professional.professional_id)" target="_blank">View Resume</a>
                </p>

                <button @click="handleAction(professional.professional_id, 'accept')" class="btn btn-success mb-2">Accept</button>
                <button @click="handleAction(professional.professional_id, 'reject')" class="btn btn-danger mb-2">Reject</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No Pending Applicants.</p>
        </div>
      </div>

      <!-- Section for All Other Professionals -->
      <h2 class="mt-5">All Professionals</h2>
      <div class="row mt-4">
        <div v-if="allProfessionals.length > 0" class="row">
          <!-- Wrap each professional card inside a column -->
          <div v-for="professional in allProfessionals" :key="professional.professional_id" class="col-lg-4 col-md-6 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Name: {{ professional.user.username }}</h5>
                <p><strong>Expertise:</strong> {{ professional.expertise }}</p>
                <p><strong>Years of Experience:</strong> {{ professional.experience_years }}</p>
                <p><strong>Status:</strong> {{ professional.status }}</p>
                <p><strong>Flagged:</strong> {{ professional.flagged }}</p>
                <p><strong>Rating:</strong> {{ parseFloat(professional.rating).toFixed(2) }}</p>
                <p>
                  <a :href="getResumeUrl(professional.professional_id)" target="_blank">View Resume</a>
                </p>

                <button @click="handleAction(professional.professional_id, professional.flagged === 'False' ? 'flag' : 'flag')" class="btn btn-warning mb-2">
                  {{ professional.flagged === 'False' ? 'Flag' : 'Unflag' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No professionals found.</p>
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
      pendingProfessionals: [], 
      allProfessionals: [], 
    };
  },
  mounted() {
    this.fetchProfessionals(); 
  },
  methods: {
    fetchProfessionals() {
      const session = Cookies.get('session');
      axios.get(`${config.url}/dash/dashboard/professionals`, {
        params: { session: session }
      })
        .then(response => {
          this.pendingProfessionals = response.data.pending_professionals;
          this.allProfessionals = response.data.all_professionals;
        })
        .catch(error => {
          console.error('Error fetching professionals:', error);
        });
    },
    handleAction(professionalId, action) {
      const session = Cookies.get('session');  

      axios.post(`${config.url}/dash/dashboard/professionals`, {
        session: session,  
        professional_id: professionalId,
        action: action
      })
      .then(() => {
        this.fetchProfessionals();  // Refresh the list of professionals
      })
      .catch(error => {
        console.error(`Error performing action ${action}:`, error);
      });
    },
    getResumeUrl(professionalId) {
      return `${config.url}/dash/professionals/${professionalId}/resume`; 
    },
  },
};
</script>

<style scoped>
</style>
