<template>
  <div>
    <nav class="sidebar">
      <header>
        <div class="image-text">
          <span class="image">
           <img src="@/assets/images/logo.png" alt="Logo" />
          </span>
          <div class="text logo-text">
            <span class="name">Meto Admin</span>
          </div>
        </div>
      </header>

      <div class="menu-bar">
        <ul class="menu-links">
           <li>
            <router-link to="/admin/home">
              <i class="bx bx-home-alt icon"></i> 
              <span class="text nav-text">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/summary">
              <i class="bx bx-bar-chart-alt icon"></i> 
              <span class="text nav-text">Summary</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/services">
              <i class="bx bx-task icon"></i> 
              <span class="text nav-text">Services</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/professionals">
              <i class="bx bx-group icon"></i> 
              <span class="text nav-text">Professionals</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/customers">
              <i class="bx bx-group icon"></i> 
              <span class="text nav-text">Customers</span>
            </router-link>
          </li>
          <li>
            <router-link to="/admin/servicerequests">
              <i class="bx bx-envelope icon"></i> 
              <span class="text nav-text">Service Requests</span>
            </router-link>
          </li>
          <li>
            <a @click.prevent="logout">
              <i class="bx bx-log-out icon"></i> 
              <span class="text nav-text">Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </nav>

    <section class="home">
      <div class="top_nav">
        <div class="left_top_nav">
          <div class="page_title">{{ pageTitle }}</div>
        </div>
      </div>

      <div class="container">
        <div v-if="messages.length > 0" class="container mt-3">
          <div v-for="(message, index) in messages" :key="index" class="alert" :class="'alert-' + message.category">
            {{ message.message }}
          </div>
        </div>

        <slot></slot>
      </div>
    </section>
  </div>
</template>

<script>
import axios from 'axios';
import config from '../../config.js';
require('@/assets/css/style.css'); 

export default {
  name: "AdminBoiler",
  data() {
    return {
      pageTitle: "Admin Dashboard",
      messages: [], 
    };
  },
  created() {
    this.messages = this.getFlashMessages();
  },
  methods: {
    getFlashMessages() {
      return [
        // { message: "Welcome to the dashboard", category: "success" },
        // { message: "You have new notifications", category: "info" },
      ];
    },
    logout() {
      // Call backend logout API
      axios.get(`${config.url}/auth/logout`, {}, { withCredentials: true })
        .then(response => {
          if (response.status === 200) {
            this.$router.push('/');
          } else {
            this.messages.push({ message: 'Logout failed. Please try again.', category: 'error' });
          }
        })
        .catch(error => {
          console.error('Error:', error);
          this.messages.push({ message: 'An error occurred during logout.', category: 'error' });
        });
    }
  }
}
</script>


<style scoped>


.sidebar {
  width: 10;
  height: 100vh;
  background-color: #2c3e50;
  position: fixed;
  top: 0;
  left: 0;
  padding: 5px;
  overflow: auto; 
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.image-text {
  display: flex;
  align-items: center;
  padding-bottom: 20px;
}

.image img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.logo-text {
  margin-left: 15px;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
}

.menu-bar {
  flex: 1; 
  margin-top: 20px;
}

.menu-links li a {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  white-space: normal; 
  word-break: break-word; 
}

.text.nav-text {
  font-size: 18px;
  color: #ffffff;
  transition: color 0.3s ease;
  white-space: normal; 
}

.menu-links li {
  margin-bottom: 20px;
}

.menu-links li a {
  display: flex;
  align-items: center;
  text-decoration: none;
  padding: 10px 15px;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.menu-links li a .icon {
  font-size: 24px;
  margin-right: 10px;
  color: #ffffff;
}

.text.nav-text {
  font-size: 18px;
  color: #ffffff;
  transition: color 0.3s ease;
}

.menu-links li:hover a {
  background-color: #34495e;
}

.menu-links li:hover .text.nav-text,
.menu-links li:hover .icon {
  color: #f39c12;
}


.home {
  margin-left: 50; 
  padding: 20px;
}


</style>
