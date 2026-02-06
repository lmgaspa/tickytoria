<template>
  <footer class="footer-custom glass-card py-4 mt-auto">
    <div class="container">
      <div class="row align-items-center">
        <!-- Logo/Brand -->
        <div class="col-md-4 text-center text-md-start mb-3 mb-md-0">
          <h5 class="mb-0 text-gradient-rainbow fw-bold">Tickytoria</h5>
          <small class="text-muted-light">{{ $t('footer.subtitle') }}</small>
        </div>

        <!-- Powered By -->
        <div class="col-md-4 text-center mb-3 mb-md-0">
          <p class="mb-0 powered-by">
            {{ $t('footer.poweredBy') }} <span class="text-gradient-cool fw-bold">AndesCore Software</span>
          </p>
        </div>

        <!-- Copyright -->
        <div class="col-md-4 text-center text-md-end">
          <small class="text-muted-light">
            © {{ currentYear }} {{ $t('footer.rights') }}
          </small>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer-custom {
  position: relative;
  backdrop-filter: blur(10px);
  background: rgba(15, 15, 27, 0.8);
  border-top: 1px solid rgba(0, 255, 163, 0.2);
  margin-top: 0;
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

.text-gradient-cool {
  background: linear-gradient(135deg, 
    #00ffa3 0%, 
    #03e9f4 50%, 
    #9d50ff 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 6s ease infinite;
  background-size: 200% 200%;
}

.text-muted-light {
  color: rgba(255, 255, 255, 0.6);
}

.powered-by {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>
