<template>
  <div>
    <div class="background-dots"></div>
    <nav>
      <div class="left_nav">
        <img src="@/assets/images/logo.png" alt="Logo" />
        <div class="logo_text">Meto</div>
      </div>
      <div class="right_nav">
        <ul class="menu_ul">
          <router-link to="/">
            <li>Home</li>
          </router-link>
          <router-link to="/auth/login">
            <li>Login</li>
          </router-link>
          <router-link to="/auth/registration">
            <li>Signup</li>
          </router-link>
        </ul>
      </div>
    </nav>
<br/><br/><br/><br/><br/><br/><br/><br/><br/>
    <div class="main">
      <div class="left_side">
        <div class="form_section_box">
          <h1>Welcome Back!</h1>
          <p class="or">Login to Continue</p>

          <div v-if="errorMessage" class="text-danger">
            <div class="alert alert-danger">{{ errorMessage }}</div>
          </div>
<br/>
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <input
                type="text"
                v-model="username"
                id="username"
                required
                placeholder=" "
              />
              <label for="username">Email or Username</label>
            </div>
            <div class="form-group pw_one">
              <div>
                <input
                  :type="showPassword ? 'text' : 'password'"
                  v-model="password"
                  id="password"
                  required
                  placeholder=" "
                />
                <label for="password">Password</label>
              </div>
              <div class="pw_eye" @click="togglePasswordVisibility">
                <i v-if="!showPassword" class="ri-eye-close-line"></i>
                <i v-else class="ri-eye-line"></i>
              </div>
            </div>

            <div class="remember_forget">
              <div class="remember">
                <input type="checkbox" v-model="remember" id="remember" />
                <label for="remember">Remember me</label>
              </div>
            </div>

            <button type="submit" class="submit_btn btn">Login</button>
          </form>

          <div class="signup">
            <p>Don't have an account? <router-link to="/auth/registration">Signup</router-link>
          <router-link to="/auth/forgotpassword" class="submit_btn btn">Forgot Password?</router-link>
          </p>
          </div>
        </div>
      </div>
      <div class="right_side">
        <img src="@/assets/images/home.png" alt="Login Image" />
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import config from '../../config.js';
require('@/assets/css/login.css');
axios.defaults.withCredentials = true;

export default {
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
      showPassword: false,
      remember: false,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async handleLogin() {
  this.errorMessage = '';
  try {
    const response = await axios.post(`${config.url}/auth/login`, {
      username: this.username,
      password: this.password,
    });

    const role = response.data.role;
    console.log(response.data.message);


    if (role === 'admin') {
      this.$router.push('/admin/home');
    } else if (role === 'professional') {
      this.$router.push('/professional/home');
    } else if (role === 'customer') {
      this.$router.push('/customer/home');
    }
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
  width: 300; 
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
</style>
