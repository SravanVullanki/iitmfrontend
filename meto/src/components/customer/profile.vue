<template>
  <CustomerBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Update Profile</h1>
      <h5 class="text-center text-danger">Enter your password then edit the field(s) you want to change</h5>

      <form @submit.prevent="updateProfile">
        <div class="mb-3">
          <label for="current_password" class="form-label">Current Password</label>
          <input type="password" class="form-control" v-model="currentPassword" required>
        </div>

        <div class="mb-3">
          <label for="new_password" class="form-label">New Password</label>
          <input type="password" class="form-control" v-model="newPassword">
        </div>

        <div class="mb-3">
          <label for="confirm_new_password" class="form-label">Confirm New Password</label>
          <input type="password" class="form-control" v-model="confirmNewPassword">
        </div>

        <div class="mb-3">
          <label for="username" class="form-label">Name</label>
          <input type="text" class="form-control" v-model="username" required>
        </div>

        <div class="mb-3">
          <label for="phone_number" class="form-label">Phone Number</label>
          <input type="text" class="form-control" v-model="phoneNumber" required>
        </div>

        <div class="mb-3">
          <label for="email" class="form-label">Email</label>
          <input type="email" class="form-control" v-model="email" required>
        </div>

        <div class="mb-3">
          <label for="address" class="form-label">Address</label>
          <input type="text" class="form-control" v-model="address" required>
        </div>

        <button type="submit" class="btn btn-primary">Update Profile</button>
      </form>
    </div>
  </CustomerBoiler>
</template>

<script>
import axios from 'axios';
import config from '@/config';
import Cookies from 'js-cookie';
import CustomerBoiler from './customerboiler.vue';
export default {
    name:"CustomerProfile",
  components: {
    CustomerBoiler,
  },
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      username: '',
      phoneNumber: '',
      email: '',
      address: ''
    };
  },
  methods: {
    async fetchProfile() {
          try {
        const token = Cookies.get('access_token');
              const response = await axios.get(`${config.url}/dash/customer/profile`, {
                  headers: {
                      Authorization: `Bearer ${token}`,
                  }
          });
        const customer = response.data.customer;
        this.username = customer.user.username;
        this.phoneNumber = customer.phone_number;
        this.email = customer.user.email;
        this.address = customer.address;
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    },
    async updateProfile() {
      if (this.newPassword && this.newPassword !== this.confirmNewPassword) {
        alert('New passwords do not match.');
        return;
      }

      const profileData = {
        current_password: this.currentPassword,
        new_password: this.newPassword,
        confirm_new_password: this.confirmNewPassword,
        username: this.username,
        phone_number: this.phoneNumber,
        email: this.email,
        address: this.address
      };

      try {
        await axios.post(`${config.url}/dash/customer/profile`, profileData);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error.response.data.error);
        alert(error.response.data.error);
      }
    }
  },
  mounted() {
    this.fetchProfile(); 
  }
};
</script>

<style scoped>
.container {
  margin-top: 20px;
}
</style>
