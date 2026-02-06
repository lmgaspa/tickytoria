<template>
  <div class="landing-page position-relative">
    <div class="page-background"></div>

    <!-- Hero Section -->
    <section class="hero-section d-flex align-items-center justify-content-center py-3 position-relative" style="min-height: 40vh;">
      <div class="glass-card p-4 text-center position-relative z-2 hero-card">
        <div class="mb-1 logo-container">
          <span class="logo-icon">✨</span>
        </div>
        <h1 class="display-4 fw-bold mb-1 tracking-tight text-gradient-rainbow">{{ $t('home.hero.title') }}</h1>
        <p class="lead mb-2 text-light">
          {{ $t('home.hero.subtitle') }} <br>
          {{ $t('home.hero.description') }}
        </p>
        
        <div class="d-flex flex-column flex-sm-row gap-3 justify-content-center">
          <button @click="goToLogin" class="btn btn-primary-glow px-4 py-2 fw-bold rounded-pill">
            {{ $t('home.hero.accessButton') }}
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section py-4 position-relative">
      <div class="container">
        <h2 class="text-center display-5 fw-bold mb-4 text-gradient">{{ $t('home.features.title') }}</h2>
        
        <div class="row g-4">
          <!-- Feature 1: Service Tickets -->
          <div class="col-md-6 col-lg-4">
            <div class="feature-card glass-card p-4 h-100">
              <div class="feature-icon mb-3">
                <i class="bi bi-ticket-perforated-fill fs-1 text-primary"></i>
              </div>
              <h4 class="fw-bold mb-3">{{ $t('home.features.serviceTickets.title') }}</h4>
              <p class="text-muted-light">
                {{ $t('home.features.serviceTickets.description') }}
              </p>
              <ul class="feature-list">
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.serviceTickets.quickRegistration') }}</li>
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.serviceTickets.advancedSearch') }}</li>
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.serviceTickets.editTracking') }}</li>
              </ul>
            </div>
          </div>

          <!-- Feature 2: Client Management -->
          <div class="col-md-6 col-lg-4">
            <div class="feature-card glass-card p-4 h-100">
              <div class="feature-icon mb-3">
                <i class="bi bi-people-fill fs-1 text-info"></i>
              </div>
              <h4 class="fw-bold mb-3">{{ $t('home.features.clientDatabase.title') }}</h4>
              <p class="text-muted-light">
                {{ $t('home.features.clientDatabase.description') }}
              </p>
              <ul class="feature-list">
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.clientDatabase.completeRegistration') }}</li>
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.clientDatabase.multiSearch') }}</li>
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.clientDatabase.contactInfo') }}</li>
              </ul>
            </div>
          </div>

          <!-- Feature 3: Employee Management -->
          <div class="col-md-6 col-lg-4">
            <div class="feature-card glass-card p-4 h-100">
              <div class="feature-icon mb-3">
                <i class="bi bi-person-badge-fill fs-1 text-warning"></i>
              </div>
              <h4 class="fw-bold mb-3">{{ $t('home.features.teamManagement.title') }}</h4>
              <p class="text-muted-light">
                {{ $t('home.features.teamManagement.description') }}
              </p>
              <ul class="feature-list">
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.teamManagement.employeeRegistration') }}</li>
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.teamManagement.roleAssignment') }}</li>
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.teamManagement.teamDirectory') }}</li>
              </ul>
            </div>
          </div>

          <!-- Feature 4: Multilingual -->
          <div class="col-md-6 col-lg-4">
            <div class="feature-card glass-card p-4 h-100">
              <div class="feature-icon mb-3">
                <i class="bi bi-globe fs-1 text-primary"></i>
              </div>
              <h4 class="fw-bold mb-3">{{ $t('home.features.multilingual.title') }}</h4>
              <p class="text-muted-light">
                {{ $t('home.features.multilingual.description') }}
              </p>
              <ul class="feature-list">
                <li><i class="bi bi-check-circle-fill text-success"></i> 🇺🇸 English</li>
                <li><i class="bi bi-check-circle-fill text-success"></i> 🇪🇸 Español</li>
                <li><i class="bi bi-check-circle-fill text-success"></i> 🇧🇷 Português</li>
              </ul>
            </div>
          </div>

          <!-- Feature 5: Intuitive Dashboard -->
          <div class="col-md-6 col-lg-4">
            <div class="feature-card glass-card p-4 h-100">
              <div class="feature-icon mb-3">
                <i class="bi bi-speedometer2 fs-1 text-success"></i>
              </div>
              <h4 class="fw-bold mb-3">{{ $t('home.features.dashboard.title') }}</h4>
              <p class="text-muted-light">
                {{ $t('home.features.dashboard.description') }}
              </p>
              <ul class="feature-list">
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.dashboard.modernDesign') }}</li>
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.dashboard.quickAccess') }}</li>
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.dashboard.responsive') }}</li>
              </ul>
            </div>
          </div>

          <!-- Feature 6: Security -->
          <div class="col-md-6 col-lg-4">
            <div class="feature-card glass-card p-4 h-100">
              <div class="feature-icon mb-3">
                <i class="bi bi-shield-check fs-1 text-danger"></i>
              </div>
              <h4 class="fw-bold mb-3">{{ $t('home.features.security.title') }}</h4>
              <p class="text-muted-light">
                {{ $t('home.features.security.description') }}
              </p>
              <ul class="feature-list">
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.security.secureLogin') }}</li>
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.security.roleAccess') }}</li>
                <li><i class="bi bi-check-circle-fill text-success"></i> {{ $t('home.features.security.passwordRecovery') }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- CTA Section -->
        <div class="text-center mt-5 pt-5">
          <div class="glass-card p-5 mx-auto" style="max-width: 700px;">
            <h3 class="fw-bold mb-3">{{ $t('home.cta.title') }}</h3>
            <p class="text-muted-light mb-4">
              {{ $t('home.cta.description') }}
            </p>
            <button @click="goToLogin" class="btn btn-primary-glow px-4 py-2 fw-bold rounded-pill">
              {{ $t('home.cta.button') }}
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}
</script>

<style scoped>
.landing-page {
  background-color: var(--bg-color);
  overflow-x: hidden;
}

.text-muted-light {
  color: var(--text-muted);
}

.text-light {
  color: rgba(255, 255, 255, 0.9);
}

.hero-card {
  max-width: 700px;
  width: 90%;
  padding: 2rem !important;
  animation: fadeUp 1s ease-out;
}

.logo-icon {
  font-size: 3rem;
  animation: float 3s ease-in-out infinite;
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

.text-gradient {
  background: linear-gradient(135deg, var(--primary-color), #03e9f4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features-section {
  min-height: auto;
  padding-top: 2rem !important;
  padding-bottom: 3rem !important;
}

.feature-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: fadeUp 0.8s ease-out;
  animation-fill-mode: both;
}

.feature-card:nth-child(1) { animation-delay: 0.1s; }
.feature-card:nth-child(2) { animation-delay: 0.2s; }
.feature-card:nth-child(3) { animation-delay: 0.3s; }
.feature-card:nth-child(4) { animation-delay: 0.4s; }
.feature-card:nth-child(5) { animation-delay: 0.5s; }
.feature-card:nth-child(6) { animation-delay: 0.6s; }

.feature-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 30px rgba(0, 255, 163, 0.3);
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 20px;
  background: rgba(0, 255, 163, 0.1);
}

.feature-list {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
}

.feature-list li {
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
}

.btn-primary-glow {
  background: var(--primary-color);
  border: none;
  color: var(--bg-color);
  box-shadow: 0 0 20px rgba(0, 255, 163, 0.4);
  transition: all 0.3s ease;
}

.btn-primary-glow:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 30px rgba(0, 255, 163, 0.6);
  background: #00ffaa;
}

/* Animations */
@keyframes fadeUp {
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Responsive */
@media (max-width: 768px) {
  .hero-card {
    padding: 2rem !important;
  }
  
  .display-3 {
    font-size: 2.5rem;
  }
  
  .feature-card {
    margin-bottom: 1rem;
  }
}
</style>
