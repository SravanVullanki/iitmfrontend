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
          <router-link to="auth/login">
            <li>Login</li>
          </router-link>
          <router-link to="auth/registration">
            <li>Signup</li>
          </router-link>
        </ul>

      </div>
    </nav>
    <div class="services-container">
      <div class="services-image">
        <img
          src="@/assets/images/services.png"
          alt="Home services at your doorstep"
        />
      </div>
    </div>
  </div>
</template>

<script>
require('@/assets/css/login.css');

export default {
  name: "HomePage",
};
</script>

<style scoped>
.services-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  width: 85%;
  height: 110vh;
  background-color: #f4f4f415;
}

.services-image img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.menu_ul {
  list-style: none;
  display: flex;
}

.menu_ul li {
  margin-right: 15px;
}

.left_nav img {
  width: 50px;
}

.logo_text {
  font-size: 24px;
  font-weight: bold;
}
</style>