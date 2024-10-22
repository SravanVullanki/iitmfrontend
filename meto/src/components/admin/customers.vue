/* eslint-disable */
<template>
  <AdminBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Manage Customers</h1>

      <div class="row mt-4">
        <div v-if="customers.length > 0" class="row">
          <div v-for="customer in customers" :key="customer.customer_id" class="col-lg-4 col-md-6 mb-4">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Name: {{ customer.user.username }}</h5>
                <p><strong>Email:</strong> {{ customer.user.email }}</p>
                <p><strong>Phone Number:</strong> {{ customer.phone_number }}</p>
                <p><strong>Address:</strong> {{ customer.address }}</p>
                <p><strong>Flagged:</strong> {{ customer.flagged }}</p>

                <button @click="handleAction(customer.customer_id, customer.flagged === 'False' ? 'flag' : 'flag')" class="btn btn-warning mb-2">
                  {{ customer.flagged === 'False' ? 'Flag' : 'Unflag' }}
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No customers found.</p>
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
      customers: [],  // Will hold the customer data fetched from the backend
    };
  },
  mounted() {
    this.fetchCustomers();  // Fetch customers when component is mounted
  },
  methods: {
    fetchCustomers() {
      const session = Cookies.get('session');
      axios.get(`${config.url}/dash/customers`, {
        params: { session: session }
      })
        .then(response => {
          this.customers = response.data.customers;  
        })
        .catch(error => {
          console.error('Error fetching customers:', error);
        });
    },
    handleAction(customerId, action) {
      const session = Cookies.get('session');

      axios.post(`${config.url}/dash/customers`, {
        session: session,
        customer_id: customerId,
        action: action
      })
      .then(() => {
        this.fetchCustomers();  
      })
      .catch(error => {
        console.error(`Error performing action ${action}:`, error);
      });
    },
  },
};
</script>

<style scoped>
/* Add any necessary styles here */
</style>
