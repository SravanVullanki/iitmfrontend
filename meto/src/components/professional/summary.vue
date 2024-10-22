<template>
  <ProfessionalBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Professional Summary</h1>

      <div class="row mt-5">
        <div class="col-md-6">
          <div class="chart-container">
            <h3>Service Request Status</h3>
            <canvas id="serviceRequestStatusChart"></canvas>
          </div>
        </div>
        <div class="col-md-6">
          <div class="chart-container">
            <h3>Number of Services</h3>
            <canvas id="servicesByTypeChart"></canvas>
          </div>
        </div>
      </div>
      
      <div class="row mt-5">
        <div class="col-md-12">
          <div class="chart-container">
            <h3>Average Ratings</h3>
            <canvas id="averageRatingsChart"></canvas>
          </div>
        </div>
      </div>
    </div>
  </ProfessionalBoiler>
</template>

<script>
import axios from 'axios';
import config from '@/config'; 
import { Chart } from 'chart.js';
import ProfessionalBoiler from './professionalboiler.vue';
import { registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  components: {
    ProfessionalBoiler,
  },
  data() {
    return {
      acceptedCount: 0,
      rejectedCount: 0,
      pendingCount: 0,
      serviceTypes: [],
      serviceCounts: [],
      averageRatings: [] 
    };
  },
  methods: {
    async fetchProfessionalSummary() {
      try {
        const response = await axios.get(`${config.url}/dash/professional/summary`);
        const data = response.data;

        this.acceptedCount = data.statusCounts.accepted;
        this.rejectedCount = data.statusCounts.rejected;
        this.pendingCount = data.statusCounts.pending;
        this.completedCount = data.statusCounts.completed;
        this.serviceTypes = Object.keys(data.serviceCounts);
        this.serviceCounts = Object.values(data.serviceCounts);
        this.averageRatings = data.averageRatings; 

        this.renderCharts();
      } catch (error) {
        console.error("Error fetching professional summary:", error);
      }
    },

    renderCharts() {
      new Chart(document.getElementById('serviceRequestStatusChart'), {
        type: 'doughnut',
        data: {
          labels: ['Completed','Accepted', 'Rejected', 'Pending'],
          datasets: [
            {
              label: 'Service Request Status',
              data: [this.completedCount,this.acceptedCount, this.rejectedCount, this.pendingCount],
              backgroundColor: ['#4CAF50','orange', '#F44336', '#FFEB3B']
            }
          ]
        },
        options: {
          responsive: true
        }
      });

      new Chart(document.getElementById('servicesByTypeChart'), {
        type: 'bar',
        data: {
          labels: this.serviceTypes,
          datasets: [
            {
              label: 'Number of Services',
              data: this.serviceCounts,
              backgroundColor: '#2196F3'
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

      new Chart(document.getElementById('averageRatingsChart'), {
        type: 'bar',
        data: {
          labels: this.serviceTypes,
          datasets: [
            {
              label: 'Average Ratings',
              data: this.averageRatings,
              backgroundColor: '#FF9800'
            }
          ]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              min: 0,
              max: 5
            }
          }
        }
      });
    }
  },
  mounted() {
    this.fetchProfessionalSummary(); 
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
