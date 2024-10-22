<template>
  <div>
    <!-- Sidebar Section -->
    <nav class="sidebar">
      <header>
        <div class="image-text">
          <span class="image">
            <img src="@/assets/images/logo.png" alt="Logo" />
          </span>
          <div class="text logo-text">
            <span class="name"> Professional</span>
          </div>
        </div>
      </header>

      <div class="menu-bar">
        <ul class="menu-links">
          <li>
            <router-link to="/professional/home">
              <i class="bx bx-home-alt icon"></i> 
              <span class="text nav-text">Home</span>
            </router-link>
          </li>
          <li>
            <router-link to="/professional/summary">
              <i class="bx bx-bar-chart-alt icon"></i> 
              <span class="text nav-text">Summary</span>
            </router-link>
          </li>
          <li>
            <router-link to="/professional/allservices">
              <i class="bx bx-task icon"></i> 
              <span class="text nav-text">All Services</span>
            </router-link>
          </li>
          <li>
            <router-link to="/professional/activeservices">
              <i class="bx bx-check-circle icon"></i> 
              <span class="text nav-text">Active Services</span>
            </router-link>
          </li>
          <li>
            <router-link to="/professional/profile">
              <i class="bx bx-user icon"></i> 
              <span class="text nav-text">Profile</span>
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

    <!-- Main Content Section -->
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
  name: "ProfessionalBoiler",
  data() {
    return {
      pageTitle: "Professional Dashboard",
      messages: [], 
    };
  },
  created() {
    this.messages = this.getFlashMessages();
  },
  methods: {
    getFlashMessages() {
      return [];
    },
    logout() {
      axios.get(`${config.url}/auth/logout`, {}, { withCredentials: true })
        .then(response => {
          if (response.status === 200) {
            this.$router.push('/auth/login');
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
