<template>
  <nav class="navbar-custom glass-card py-3 px-4">
    <div class="container-fluid d-flex justify-content-between align-items-center">
      <!-- Logo Tickytoria com gradiente -->
      <div class="navbar-brand">
        <RouterLink v-if="isLogoClickable" to="/" class="text-decoration-none">
          <h3 class="mb-0 text-gradient-rainbow fw-bold">Tickytoria</h3>
        </RouterLink>
        <h3 v-else class="mb-0 text-gradient-rainbow fw-bold">Tickytoria</h3>
      </div>

      <!-- Language Selector -->
      <div class="dropdown">
        <button 
          class="btn btn-outline-light btn-sm dropdown-toggle d-flex align-items-center gap-2" 
          type="button" 
          id="languageDropdown" 
          data-bs-toggle="dropdown" 
          aria-expanded="false"
        >
          <i class="bi bi-globe fs-5"></i>
          <span class="d-none d-sm-inline">{{ currentLanguageName }}</span>
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="languageDropdown">
          <li>
            <a class="dropdown-item d-flex align-items-center gap-2" href="#" @click.prevent="changeLanguage('en-US')">
              <span class="fs-5">🇺🇸</span>
              <span>English</span>
            </a>
          </li>
          <li>
            <a class="dropdown-item d-flex align-items-center gap-2" href="#" @click.prevent="changeLanguage('es-ES')">
              <span class="fs-5">🇪🇸</span>
              <span>Español</span>
            </a>
          </li>
          <li>
            <a class="dropdown-item d-flex align-items-center gap-2" href="#" @click.prevent="changeLanguage('pt-BR')">
              <span class="fs-5">🇧🇷</span>
              <span>Português</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { locale } = useI18n()
const route = useRoute()

const currentLanguageName = computed(() => {
  switch (locale.value) {
    case 'pt-BR': return 'Português'
    case 'en-US': return 'English'
    case 'es-ES': return 'Español'
    default: return 'Português'
  }
})

const isLogoClickable = computed(() => {
  const clickableRoutes = ['/', '/login']
  return clickableRoutes.includes(route.path)
})

const changeLanguage = (lang: string) => {
  locale.value = lang
  localStorage.setItem('locale', lang)
}
</script>

<style scoped>
.navbar-custom {
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background: rgba(15, 15, 27, 0.8);
  border-bottom: 1px solid rgba(0, 255, 163, 0.2);
}

.text-gradient-rainbow {
  background: linear-gradient(135deg, 
    #00ffa3 0%, 
    #03e9f4 25%, 
    #9d50ff 50%, 
    #ff006e 75%, 
    #ffbe0b 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 8s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.btn-outline-light {
  border-color: rgba(255, 255, 255, 0.5);
  color: #ffffff !important;
  transition: all 0.3s ease;
}

.btn-outline-light:hover {
  background: rgba(0, 255, 163, 0.2);
  border-color: var(--primary-color);
  color: var(--primary-color) !important;
}

.btn-outline-light:focus,
.btn-outline-light:active,
.btn-outline-light.show {
  background: rgba(15, 15, 27, 0.5) !important;
  border-color: rgba(255, 255, 255, 0.5) !important;
  color: #ffffff !important;
  box-shadow: none !important;
}

.btn-outline-light i {
  color: #ffffff;
}

.dropdown-menu {
  background: rgba(15, 15, 27, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 255, 163, 0.2);
}

.dropdown-item {
  color: #ffffff !important;
  transition: all 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(0, 255, 163, 0.1);
  color: var(--primary-color) !important;
}
</style>
