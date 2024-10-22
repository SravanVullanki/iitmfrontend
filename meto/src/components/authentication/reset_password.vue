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
          <h1>Reset Your Password</h1>

          <div v-if="flashMessage" :class="flashClass">{{ flashMessage }}</div>

          <form @submit.prevent="resetPassword">
            <div class="form-group">
              <input
                type="password"
                v-model="newPassword"
                class="form-control"
                placeholder="New Password"
                required
              />
            </div>
            <div class="form-group">
              <input
                type="password"
                v-model="confirmNewPassword"
                class="form-control"
                placeholder="Confirm New Password"
                required
              />
            </div>
            <button type="submit" class="submit_btn btn">Reset Password</button>
          </form>

          <div class="signup">
            <p>
              <router-link to="/auth/login" class="signup_click"><b>Back to Login</b></router-link>
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
      newPassword: '',
      confirmNewPassword: '',
      flashMessage: '',
      flashClass: '',
      logoUrl: require('@/assets/images/logo.png'),
      homeImageUrl: require('@/assets/images/home.png'),
    };
  },
  methods: {
    async resetPassword() {
      try {
        // Send POST request using Axios
        const response = await axios.post(`${config.url}/dash/reset_password`, {
          new_password: this.newPassword,
          confirm_new_password: this.confirmNewPassword,
        });

        // Handle the response
        this.flashMessage = response.data.message || 'Password reset successfully.';
        this.flashClass = 'success-message'; // Add a class for styling if needed

        // Redirect after 2 seconds
        setTimeout(() => {
          this.$router.push('/auth/login');
        }, 2000);
      } catch (error) {
        // Handle errors
        this.flashMessage = error.response?.data?.message || 'Passwords dont match.';
        this.flashClass = 'error-message';
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
    toggleMenu() {
    }
  }
};
</script>

<style scoped>
.success-message {
  color: green;
}
.error-message {
  color: red;
}
</style>
