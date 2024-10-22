<template>
  <CustomerBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Customer Summary with Ratings</h1>
      <div class="summary-card mb-4">
        <h3>Summary Details</h3>
        <p><strong>Total Services:</strong> {{ summary.total_services }}</p>
        <p><strong>Ongoing Services:</strong> {{ summary.ongoing_services }}</p>
        <p><strong>Average Rating:</strong> {{ summary.average_rating.toFixed(1) }}</p>
      </div>
      
      <div class="row mt-5">
        <div class="col-md-12">
          <div class="card mb-4">
            <div class="card-body">
              <h3>Service Ratings</h3>
              <canvas id="ratingsChart" ref="ratingsChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-md-12">
          <div class="card mb-4">
            <div class="card-body">
              <h3>Booked Services Over Time</h3>
              <canvas id="bookedServicesChart" ref="bookedServicesChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="row mt-5">
        <div class="col-md-12">
          <div class="card mb-4">
            <div class="card-body">
              <h3>Service Status Distribution</h3>
              <canvas id="serviceStatusChart" ref="serviceStatusChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </CustomerBoiler>
</template>

<script>
import axios from 'axios';
import config from '@/config';
import Cookies from 'js-cookie';
import CustomerBoiler from './customerboiler.vue';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export default {
  components: {
    CustomerBoiler,
  },
  data() {
    return {
      summary: {
        total_services: 0,
        ongoing_services: 0,
        average_rating: 0,
        ratings: [],
        booked_services: [], 
        service_status: {}, 
      },
    };
  },
  methods: {
    async fetchCustomerSummary() {
      try {
        const response = await axios.get(`${config.url}/dash/customer/summary`, {
          headers: {
            Authorization: `Bearer ${Cookies.get('session_token')}`,
          },
        });

        this.summary = response.data.summary;
        this.renderRatingsChart();
        this.renderBookedServicesChart();
        this.renderServiceStatusChart();
      } catch (error) {
        console.error("Error fetching customer summary:", error);
      }
    },
    
    renderRatingsChart() {
      const ctx = this.$refs.ratingsChart.getContext('2d');
      
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Array.from({ length: 5 }, (_, i) => i + 1),
          datasets: [{
            label: 'Number of Ratings',
            data: this.summary.ratings.reduce((acc, rating) => {
              acc[rating - 1] += 1;
              return acc;
            }, Array(5).fill(0)),
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
          }],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },

    renderBookedServicesChart() {
      const ctx = this.$refs.bookedServicesChart.getContext('2d');

      new Chart(ctx, {
        type: 'doughnut', 
        data: {
          labels: this.summary.booked_services.map(item => item.date), 
          datasets: [{
            label: 'Booked Services',
            data: this.summary.booked_services.map(item => item.count), 
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
            ],
            borderWidth: 1,
            borderColor: '#fff',
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Booked Services Over Time',
            },
          },
        },
      });
    },

    renderServiceStatusChart() {
      const ctx = this.$refs.serviceStatusChart.getContext('2d');
      const statusLabels = Object.keys(this.summary.service_status); // ['Pending', 'Completed', 'Cancelled']
      const statusData = Object.values(this.summary.service_status); // Corresponding counts

      new Chart(ctx, {
        type: 'pie', 
        data: {
          labels: statusLabels,
          datasets: [{
            data: statusData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
            ],
            borderColor: '#fff',
            borderWidth: 1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Service Status Distribution',
            },
          },
        },
      });
    },
  },
  mounted() {
    this.fetchCustomerSummary();
  },
};
</script>

<style scoped>
.container {
  max-width: 800px; 
  margin: 0 auto;
  padding: 20px;
}

.summary-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px; 
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

h1, h3 {
  color: #333333;
}

.card {
  border: 1px solid #e0e0e0; 
}

.card-body {
  padding: 15px; 
}

.charts {
  margin-top: 40px; 
}

.charts canvas {
  width: 100% !important;
  height: 300px !important; 
}
</style>
