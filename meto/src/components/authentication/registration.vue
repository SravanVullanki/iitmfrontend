<template>
  <div>
    <div class="background-dots"></div>
    <nav>
        <div class="left_nav">
            <img src="@/assets/images/logo.png" alt="Meto Logo" />
            <div class="logo_text">Meto</div>
        </div>
        <div class="right_nav">
            <ul class="menu_ul">
                <li><router-link to="/">Home</router-link></li>
                <li><router-link to="/auth/login">Login</router-link></li>
                <li><router-link to="/auth/registration">Signup</router-link></li>
            </ul>
        </div>
    </nav>
    <br/><br/><br/><br/><br/><br/>
    <div class="main">
        <div class="left_side">
            <div class="form_section_box">
                <h1>Create an Account!</h1>

                <div v-if="flashMessage" class="or" style="color: red;">
                    {{ flashMessage }}
                </div>

                <form @submit.prevent="register">
                    <div class="wrapper">
                        <input
                            type="radio"
                            name="role"
                            id="option-1"
                            value="customer"
                            v-model="role"
                            @click="toggleFields('customer')"
                        />
                        <label for="option-1" class="option option-1">
                            <div class="dot"></div>
                            <span>Customer</span>
                        </label>
                        <input
                            type="radio"
                            name="role"
                            id="option-2"
                            value="professional"
                            v-model="role"
                            @click="toggleFields('professional')"
                        />
                        <label for="option-2" class="option option-2">
                            <div class="dot"></div>
                            <span>Professional</span>
                        </label>
                    </div>

                    <div class="form-group">
                        <input type="text" id="username" v-model="formData.username" placeholder=" " required />
                        <label for="username">Username</label>
                    </div>

                    <div class="form-group">
                        <input type="email" id="email" v-model="formData.email" placeholder=" " required />
                        <label for="email">Email</label>
                    </div>

                    <div class="form-group pw_one">
                        <div>
                            <input type="password" id="password" v-model="formData.password" placeholder=" " required />
                            <label for="password">Password</label>
                        </div>
                        <div class="pw_eye">
                            <i class="ri-eye-close-line pw_eye_close"></i>
                            <i class="ri-eye-line pw_eye_open"></i>
                        </div>
                    </div>

                    <div class="form-group">
                        <input type="password" id="confirm_password" v-model="formData.confirm_password" placeholder=" " required />
                        <label for="confirm_password">Confirm Password</label>
                    </div>

                    <!-- Customer Fields -->
                    <div v-if="role === 'customer'" id="customer_fields">
                        <div class="form-group">
                            <input type="text" id="phone_number" v-model="formData.phone_number" placeholder=" " required />
                            <label for="phone_number">Phone Number</label>
                        </div>

                        <div class="form-group">
                            <input type="text" id="address" v-model="formData.address" placeholder=" " required />
                            <label for="address">Address</label>
                        </div>
                    </div>

                    <!-- Professional Fields -->
                    <div v-if="role === 'professional'" id="professional_fields">
                        <div class="form-group">
                            <input type="text" id="expertise" v-model="formData.expertise" placeholder=" " required />
                            <label for="expertise">Expertise</label>
                        </div>

                        <div class="form-group">
                            <input type="text" id="experience_years" v-model="formData.experience_years" placeholder=" " required />
                            <label for="experience_years">Years of Experience</label>
                        </div>

                        <div class="form-group">
                            <h5>Upload Your Resume</h5>
                            <input
                                type="file"
                                id="pdf_resume"
                                @change="handleFileUpload"
                                class="file-upload"
                                accept=".pdf"
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" class="btn">Submit</button>
                </form>

                <div class="signup">
                    <p>
                        Already have an account?
                        <router-link to="/auth/login" class="signup_click"><b>Login</b></router-link>
                    </p>
                </div>
            </div>
        </div>

        <div class="social_media"></div>

        <div class="right_side">
            <img src="@/assets/images/home.png" alt="Home Image" />
        </div>
    </div>
    </div>
</template>

<script>
import axios from "axios";
require('@/assets/css/signup.css');
import '@/assets/javascript/authentication.js';
import config from '../../config.js';

export default {
  data() {
    return {
      formData: {
        username: "",
        email: "",
        password: "",
        confirm_password: "",
        phone_number: "",
        address: "",
        expertise: "",
        experience_years: "",
        pdf_resume: null, 
      },
      role: "customer",
      flashMessage: null,
    };
  },
  methods: {
    toggleFields(selectedRole) {
      this.role = selectedRole;
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.formData.pdf_resume = file; // Store the file in formData
    },
    validateFields() {
  // Check for required fields
  if (!this.formData.username || !this.formData.email || !this.formData.password || !this.formData.confirm_password) {
    this.flashMessage = "Please fill in all required fields.";
    return false;
  }

  // Role-specific validations for customers
  if (this.role === "customer") {
    if (!this.formData.phone_number || !this.formData.address) {
      this.flashMessage = "Please fill in all customer-specific fields.";
      return false;
    }
    
    // Validate phone number length (must be exactly 10 characters)
    if (this.formData.phone_number.length !== 10 || isNaN(this.formData.phone_number)) {
      this.flashMessage = "Phone number must be exactly 10 digits.";
      return false;
    }
  }

  // Role-specific validations for professionals
  if (this.role === "professional") {
    if (!this.formData.expertise || !this.formData.experience_years) {
      this.flashMessage = "Please fill in all professional-specific fields.";
      return false;
    }
    
    if (!this.formData.pdf_resume) {
      this.flashMessage = "Please upload your resume.";
      return false;
    }
  }


  if (this.formData.password.length < 6) {
    this.flashMessage = "Password must be at least 6 characters long.";
    return false;
  }


  const specialCharacterPattern = /[!@#$%^&*(),.?":{}|<>]/; 
  if (!specialCharacterPattern.test(this.formData.password)) {
    this.flashMessage = "Password must contain at least one special character.";
    return false;
  }


  if (this.formData.password !== this.formData.confirm_password) {
    this.flashMessage = "Passwords do not match.";
    return false;
  }

  return true; 
}
,
    async register() {
      if (!this.validateFields()) {
        return; 
      }

      try {
        const formData = new FormData(); 
        formData.append('username', this.formData.username);
        formData.append('email', this.formData.email);
        formData.append('password', this.formData.password);
        formData.append('role', this.role);

        // Customer-specific fields
        if (this.role === 'customer') {
          formData.append('phone_number', this.formData.phone_number);
          formData.append('address', this.formData.address);
        }

        // Professional-specific fields
        if (this.role === 'professional') {
          formData.append('expertise', this.formData.expertise);
          formData.append('experience_years', this.formData.experience_years);
          formData.append('pdf_resume', this.formData.pdf_resume); 
        }

        const response = await axios.post(`${config.url}/auth/signup`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // Important for file upload
          },
        });

        this.flashMessage = response.data.message;
      } catch (error) {
        if (error.response) {
          this.flashMessage = error.response.data.error;
        }
      }
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

.file-upload {
    display: block;
    margin-top: 8px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 100%;
    cursor: pointer;
}

.file-upload::file-selector-button {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
}

.file-upload::file-selector-button:hover {
    background-color: #0056b3;
}

.btn {
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 15px;
    cursor: pointer;
    width: 100%;
}

.btn:hover {
    background-color: #0056b3;
}

.or {
    text-align: center;
    font-size: 14px;
}

.main {
    display: flex;
    justify-content: space-between;
    width: 100%;
}

.left_side,
.right_side {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.left_side {
    padding: 20px;
}

.right_side img {
    max-width: 100%;
    height: auto;
}
</style>
