<template>
  <AdminBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Admin Summary</h1>

      <div class="row mt-5">
        <div class="col-md-6">
          <div class="chart-container">
            <h3>Customer Flagged Status</h3>
            <canvas id="customerFlaggedChart"></canvas>
          </div>
        </div>
        <div class="col-md-6">
          <div class="chart-container">
            <h3>Professional Ratings Chart</h3>
            <canvas id="professionalRatingsChart"></canvas>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-md-6">
          <div class="chart-container">
            <h3>Service Requests Chart</h3>
            <canvas id="serviceRequestsChart"></canvas>
          </div>
        </div>
        <div class="col-md-6">
          <div class="chart-container">
            <h3>Professional Flagged Status</h3>
            <canvas id="professionalFlaggedChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </AdminBoiler>
</template>

<script>
import axios from 'axios';
import config from '@/config'; 
import { Chart } from 'chart.js';
import AdminBoiler from './adminboiler.vue';
import { registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  components: {
    AdminBoiler,
  },
  data() {
    return {
      flaggedCount: 0,
      notFlaggedCount: 0,
      flaggedProfessionalsCount: 0,
      notFlaggedProfessionalsCount: 0,
      professionalNames: [],
      professionalRatings: [],
      requestCategories: [],
      requestRatings: []
    };
  },
  methods: {
    async fetchAdminSummary() {
      try {
        const response = await axios.get(`${config.url}/dash/admin_summary`);
        const data = response.data;

        this.flaggedCount = data.flagged_count;
        this.notFlaggedCount = data.not_flagged_count;
        this.flaggedProfessionalsCount = data.flagged_professionals_count;
        this.notFlaggedProfessionalsCount = data.not_flagged_professionals_count;
        this.professionalNames = data.professional_names;
        this.professionalRatings = data.professional_ratings;
        this.requestCategories = data.request_categories;
        this.requestRatings = data.request_ratings;

        this.renderCharts();
      } catch (error) {
        console.error("Error fetching admin summary:", error);
      }
    },

    renderCharts() {
      new Chart(document.getElementById('customerFlaggedChart'), {
        type: 'doughnut',
        data: {
          labels: ['Flagged', 'Not Flagged'],
          datasets: [
            {
              label: 'Customers',
              data: [this.flaggedCount, this.notFlaggedCount],
              backgroundColor: ['#FF6384', '#36A2EB']
            }
          ]
        },
        options: {
          responsive: true
        }
      });

      new Chart(document.getElementById('professionalRatingsChart'), {
        type: 'bar',
        data: {
          labels: this.professionalNames,
          datasets: [
            {
              label: 'Professional Ratings',
              data: this.professionalRatings,
              backgroundColor: '#FFCE56'
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      new Chart(document.getElementById('serviceRequestsChart'), {
        type: 'pie',
        data: {
          labels: this.requestCategories,
          datasets: [
            {
              label: 'Service Requests',
              data: this.requestRatings,
              backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
            }
          ]
        },
        options: {
          responsive: true
        }
      });

      new Chart(document.getElementById('professionalFlaggedChart'), {
        type: 'doughnut',
        data: {
          labels: ['Flagged Professionals', 'Not Flagged Professionals'],
          datasets: [
            {
              label: 'Professionals',
              data: [this.flaggedProfessionalsCount, this.notFlaggedProfessionalsCount],
              backgroundColor: ['#FF6384', '#36A2EB']
            }
          ]
        },
        options: {
          responsive: true
        }
      });
    }
  },
  mounted() {
    this.fetchAdminSummary(); 
  }
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 300px;
  margin: auto;
}
</style>
