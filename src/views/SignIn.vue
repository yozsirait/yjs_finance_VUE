<template>
  <navbar btnBackground="bg-gradient-success" />
  <div class="page-header align-items-start min-vh-100" style="
      background-image: url('https://images.unsplash.com/photo-1497294815431-9365093b7331?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1950&q=80');
    ">
    <span class="mask bg-gradient-dark opacity-6"></span>
    <div class="container my-auto">
      <div class="row">
        <div class="col-lg-4 col-md-8 col-12 mx-auto">
          <div class="card z-index-0 fadeIn3 fadeInBottom">
            <div class="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
              <div class="bg-gradient-success shadow-success border-radius-lg py-3 pe-1">
                <h4 class="text-white font-weight-bolder text-center mt-2 mb-0">
                  Sign in
                </h4>
                <div class="row mt-3">
                  <div class="col-2 text-center ms-auto">
                    <a class="btn btn-link px-3" href="javascript:;">
                      <i class="fab fa-facebook text-white text-lg"></i>
                    </a>
                  </div>
                  <div class="col-2 text-center px-1">
                    <a class="btn btn-link px-3" href="javascript:;">
                      <i class="fab fa-github text-white text-lg"></i>
                    </a>
                  </div>
                  <div class="col-2 text-center me-auto">
                    <a class="btn btn-link px-3" href="javascript:;">
                      <i class="fab fa-google text-white text-lg"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="card-body">
              <form role="form" class="text-start mt-3">
                <div class="mb-3">
                  <material-input id="email" type="email" label="Email" name="email" v-model="form.email"
                    autocomplete="current-email" />
                </div>
                <div class="mb-3">
                  <material-input id="password" type="password" label="Password" name="password" v-model="form.password"
                    autocomplete="current-password" />
                </div>
                <material-switch id="rememberMe" name="rememberMe">Remember me</material-switch>
                <div class="text-center">
                  <material-button class="my-4 mb-2" variant="gradient" color="success" fullWidth :disabled="loading"
                    @click.prevent="login">
                    {{ loading ? "Logging in..." : "Sign in" }}
                  </material-button>
                  <p v-if="errorMessage" class="text-danger text-center">{{ errorMessage }}</p>
                </div>
                <p class="mt-4 text-sm text-center">
                  Don't have an account?
                  <router-link :to="{ name: 'SignUp' }" class="text-success text-gradient font-weight-bold">Sign
                    up</router-link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer position-absolute bottom-2 py-2 w-100">
      <div class="container">
        <div class="row align-items-center justify-content-lg-between">
          <div class="col-12 col-md-6 my-auto">
            <div class="copyright text-center text-sm text-white text-lg-start">
              © {{ new Date().getFullYear() }}, made with
              <i class="fa fa-heart" aria-hidden="true"></i> by
              <a href="https://www.creative-tim.com" class="font-weight-bold text-white" target="_blank">Creative
                Tim</a>
              for a better web.
            </div>
          </div>
          <div class="col-12 col-md-6">
            <ul class="nav nav-footer justify-content-center justify-content-lg-end">
              <li class="nav-item">
                <a href="https://www.creative-tim.com" class="nav-link text-white" target="_blank">Creative Tim</a>
              </li>
              <li class="nav-item">
                <a href="https://www.creative-tim.com/presentation" class="nav-link text-white" target="_blank">About
                  Us</a>
              </li>
              <li class="nav-item">
                <a href="https://www.creative-tim.com/blog" class="nav-link text-white" target="_blank">Blog</a>
              </li>
              <li class="nav-item">
                <a href="https://www.creative-tim.com/license" class="nav-link pe-0 text-white"
                  target="_blank">License</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import Navbar from "@/examples/PageLayout/Navbar.vue";
import MaterialInput from "@/components/MaterialInput.vue";
import MaterialSwitch from "@/components/MaterialSwitch.vue";
import MaterialButton from "@/components/MaterialButton.vue";
import { mapMutations } from "vuex";
import axios from "@/axios";

export default {
  name: "sign-in",
  components: {
    Navbar,
    MaterialInput,
    MaterialSwitch,
    MaterialButton,
  },
  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      loading: false,
      errorMessage: "",
    };
  },
  beforeMount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
  },
  beforeUnmount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
  },
  methods: {
    ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),
    async login() {
      this.loading = true;
      this.errorMessage = "";

      try {
        const response = await axios.post("/login", this.form); // baseURL sudah ada di @/axios
        const token = response.data.token;

        if (token) {
          localStorage.setItem("token", token);

          // Optional: simpan data user juga jika tersedia
          // localStorage.setItem("user", JSON.stringify(response.data.user));

          // Pindah ke dashboard
          this.$router.push({ name: "Dashboard" });
        } else {
          this.errorMessage = "Token tidak diterima dari server.";
        }
      } catch (error) {
        console.error("Login error:", error);
        this.errorMessage = error.response?.data?.message || "Login gagal. Coba lagi.";
      } finally {
        this.loading = false;
      }
    }

  },
};
</script>
