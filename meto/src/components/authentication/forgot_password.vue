<template>
  <div>
    <div class="background-dots"></div>
    <nav>
      <div class="left_nav">
        <img :src="logoUrl" alt="" />
        <div class="logo_text">Meto</div>
      </div>
      <div class="right_nav">
        <ul class="menu_ul">
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/auth/login">Login</router-link></li>
          <li><router-link to="/auth/signup">Signup</router-link></li>
        </ul>
        <div class="menu_btn" @click="toggleMenu">
          <i class="bx bx-menu-alt-right open_menu"></i>
          <i class="ri-close-large-fill close_menu"></i>
        </div>
      </div>
    </nav>
    <br/><br/><br/><br/><br/><br/>
    <div class="main">
      <div class="left_side">
        <div class="form_section_box">
          <h1>Forgot Password?</h1>
          <div class="or">Enter your email to receive an OTP</div>

          <div class="message-section">
            <div v-if="successMessage" class="success">{{ successMessage }}</div>
            <div v-if="errorMessage" class="error">{{ errorMessage }}</div>
        </div>
            <br/>

          <form @submit.prevent="sendOtp">
            <div class="form-group">
              <input
                type="email"
                v-model="email"
                id="email"
                placeholder=" "
                required
              />
              <label for="email">Enter your email</label>
            </div>
            <button type="submit" class="submit_btn btn">Send OTP</button>
          </form>

          <div class="signup">
            <p>
              Remembered your password?
              <router-link to="/auth/login" class="signup_click"><b>Login</b></router-link>
            </p>
          </div>
        </div>
      </div>
      <div class="social_media"></div>
      <div class="right_side">
        <img :src="homeImageUrl" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '../../config.js';
require('@/assets/css/login.css');

export default {
  data() {
    return {
      email: "",
      flashMessage: "",
      flashClass: "",
      logoUrl: require("@/assets/images/logo.png"),
      homeImageUrl: require("@/assets/images/home.png"),
      errorMessage: "",  
      successMessage: "", 
    };
  },
  methods: {
    toggleMenu() {
      // Logic to toggle the menu
    },
    async sendOtp() {
      this.errorMessage = ''; 
      this.successMessage = ''; 
      try {
        const response = await axios.post(`${config.url}/dash/forgot_password`, {
          email: this.email,
        });

          this.successMessage = response.data.message; 
          setTimeout(() => {
            window.location.href = "http://localhost:8080/auth/verifyotp"
        }, 2000); 
      } catch (error) {
        if (error.response) {
          this.errorMessage = error.response.data.error || 'An error occurred. Please try again.';
        } else {
          this.errorMessage = 'Network error. Please check your connection.';
        }
      }
    },
  },
};
</script>

<style scoped>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.background-dots {
  position: absolute;
  top: 0;
  left: 60%;
  width: 60%;
  height: 100%;
  background-color: #ffffff;
  background-image: radial-gradient(#e0e0e0 1px, transparent 1px);
  background-size: 20px 20px;
}

.main {
  display: flex;
  height: 100%;
}

.left_side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.right_side {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form_section_box {
  width: 300px; 
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  position: relative;
  margin-bottom: 20px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.pw_one {
  position: relative;
}

.pw_eye {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
}

.submit_btn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
}

.submit_btn:hover {
  background-color: #0056b3;
}

.text-danger {
  margin-bottom: 10px;
}
.error {
    color: red; 
    display: block; 
}

.success {
    color: green;
    display: block; 
}

</style>
