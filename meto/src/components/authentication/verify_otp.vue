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
          <li @click="goToHome">Home</li>
          <li @click="goToLogin">Login</li>
          <li @click="goToSignup">Signup</li>
        </ul>
        <div class="menu_btn" @click="toggleMenu">
          <i class='bx bx-menu-alt-right open_menu'></i>
          <i class="ri-close-large-fill close_menu"></i>
        </div>
      </div>
    </nav>
    <br/><br/><br/><br/><br/><br/><br/><br/>
    <div class="main">
      <div class="left_side">
        <div class="form_section_box">
          <h1>Verify OTP</h1>
          <p>Please enter the OTP sent to your email</p>
          <br/>
          <div v-if="flashMessage" :class="flashClass">{{ flashMessage }}</div>
          <br/>
          
          <form @submit.prevent="verifyOtp">
            <div class="form-group">
              <input
                type="text"
                v-model="otp"
                class="form-control"
                placeholder="Enter OTP"
                required
              />
            </div>
            <button type="submit" class="submit_btn btn">Verify</button>
          </form>

          <div class="signup">
            <p>
              <a @click="goToLogin" class="signup_click"><b>Back to Login</b></a>
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

export default {
  data() {
    return {
      otp: '',
      flashMessage: '',
      flashClass: '',
      logoUrl: require('@/assets/images/logo.png'),
      homeImageUrl: require('@/assets/images/home.png'),
    };
  },
  methods: {
    toggleMenu() {
      // Logic to toggle the menu
    },
    async verifyOtp() {
      try {
        const response = await axios.post(`${config.url}/dash/verify_otp`, { otp: this.otp });
        this.flashMessage = response.data.message;
        this.flashClass = 'alert alert-success';

        setTimeout(() => {
          this.$router.push('/auth/resetpassword');  
        }, 2000);
      } catch (error) {
        if (error.response) {
          this.flashMessage = error.response.data.error || 'An error occurred. Please try again.';
          this.flashClass = 'alert alert-danger';
        } else {
          this.flashMessage = 'Network error. Please check your connection.';
          this.flashClass = 'alert alert-danger';
        }
      }
    },
    goToHome() {
      this.$router.push('/');
    },
    goToLogin() {
      this.$router.push('/auth/login');
    },
    goToSignup() {
      this.$router.push('/auth/signup');
    },
  },
};
</script>

<style scoped>
body,
html {
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

.alert {
  margin-bottom: 10px;
  color: red;
}
</style>
