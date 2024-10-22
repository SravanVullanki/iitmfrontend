<template>
  <ProfessionalBoiler>
    <div class="container mt-5">
      <h1 class="text-center">Update Credentials</h1>
      <h5 class="text-center text-danger">
        Enter your password then edit the field(s) you want to change
      </h5>

      <div class="mb-3">
        <label for="current_password" class="form-label">Current Password</label>
        <input
          type="password"
          class="form-control"
          v-model="currentPassword"
          required
        />
      </div>

      <div class="mb-3">
        <label for="new_password" class="form-label">New Password</label>
        <input
          type="password"
          class="form-control"
          v-model="newPassword"
          required
        />
      </div>

      <div class="mb-3">
        <label for="confirm_new_password" class="form-label">Confirm New Password</label>
        <input
          type="password"
          class="form-control"
          v-model="confirmNewPassword"
          required
        />
      </div>

      <div class="mb-3">
        <label for="pdf_resume" class="form-label">Upload New Resume (PDF)</label>
        <input
          type="file"
          class="form-control"
          @change="onFileChange"
          accept=".pdf"
        />
        <small>Current Resume: 
          <a :href="resumeUrl" target="_blank">View</a>
        </small>
      </div>

      <button class="btn btn-primary" @click="updateCredentials">Update Credentials</button>

      <div v-if="message" class="alert mt-3" :class="messageClass">
        {{ message }}
      </div>
    </div>
  </ProfessionalBoiler>
</template>

<script>
import axios from 'axios';
import config from '@/config';
import Cookies from 'js-cookie';
import ProfessionalBoiler from './professionalboiler.vue';

export default {
  name: 'ProfessionalProfile',
  components: {
    ProfessionalBoiler,
  },
  data() {
    return {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      pdfResume: null,
      resumeUrl: '',
      message: '',
      messageClass: '',
    };
  },
  created() {
    this.fetchProfessionalData();
  },
  methods: {
    fetchProfessionalData() {
      const session = Cookies.get('session');
      axios
        .get(`${config.url}/dash/professional/professional_profile`, {
          params: { session: session },
        })
        .then((response) => {
          this.resumeUrl = `${config.url}/dash/professionals/${response.data.professional.professional_id}/resume`;
        })
        .catch((error) => {
          console.error('Error fetching professional profile:', error);
        });
    },
    onFileChange(event) {
      const file = event.target.files[0];
      if (file && file.type === 'application/pdf') {
        this.pdfResume = file;
      } else {
        this.message = 'Please upload a valid PDF file.';
        this.messageClass = 'alert-danger';
      }
    },
    validatePasswords() {
      if (this.newPassword !== this.confirmNewPassword) {
        this.message = 'New passwords do not match.';
        this.messageClass = 'alert-danger';
        return false;
      }
      return true;
    },
    updateCredentials() {
      if (!this.validatePasswords()) return;

      const formData = new FormData();
      formData.append('current_password', this.currentPassword);
      formData.append('new_password', this.newPassword);
      formData.append('confirm_new_password', this.confirmNewPassword);

      if (this.pdfResume) {
        formData.append('pdf_resume', this.pdfResume);
      }

      const session = Cookies.get('session');
      axios
        .post(`${config.url}/dash/professional/professional_profile`, formData, {
          params: { session: session },
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
          this.message = response.data.message;
          this.messageClass = 'alert-success';
        })
        .catch((error) => {
          console.error('Error updating credentials:', error);
          this.message = error.response.data.error || 'Failed to update credentials.';
          this.messageClass = 'alert-danger';
        });
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
}

.alert {
  margin-top: 10px;
}
</style>
