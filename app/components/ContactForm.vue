<template>
  <div class="contact-form">
    <div class="contact-header">
      <h3>Let's Create Something Together</h3>
    </div>
    
    <form @submit.prevent="sendEmail">
      <div class="form-group">
        <label for="name">Name</label>
        <input 
          v-model="form.name" 
          type="text" 
          id="name" 
          placeholder="Your full name"
          required 
        />
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input 
          v-model="form.email" 
          type="email" 
          id="email" 
          placeholder="your.email@example.com"
          required 
        />
      </div>

      <div class="form-group">
        <label for="message">Message</label>
        <textarea 
          v-model="form.message" 
          id="message" 
          rows="5"
          placeholder="Tell me about your project..."
          required
        ></textarea>
      </div>

      <button type="submit" :disabled="isLoading" class="submit-btn">
        <span v-if="!isLoading">Send Message</span>
        <span v-else class="loading-text">
          <span class="dot">.</span>
          <span class="dot">.</span>
          <span class="dot">.</span>
        </span>
      </button>

      <transition name="message-fade">
        <p v-if="statusMessage" :class="['status-message', statusClass]">
          {{ statusMessage }}
        </p>
      </transition>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import emailjs from '@emailjs/browser'

// Get runtime config
const config = useRuntimeConfig()

// Reactive state
const form = ref({
  name: '',
  email: '',
  message: ''
})

const isLoading = ref(false)
const statusMessage = ref('')
const statusClass = ref('')

// Initialize EmailJS on mount
onMounted(() => {
  const publicKey = config.public.emailjsPublicKey
  
  // Debug: Log to verify env variables are loaded
  console.log('EmailJS Config Check:')
  console.log('Service ID:', config.public.emailjsServiceId ? '✓ Loaded' : '✗ Missing')
  console.log('Template ID:', config.public.emailjsTemplateId ? '✓ Loaded' : '✗ Missing')
  console.log('Public Key:', config.public.emailjsPublicKey ? '✓ Loaded' : '✗ Missing')
  
  if (publicKey) {
    emailjs.init(publicKey)
    console.log('✓ EmailJS initialized successfully')
  } else {
    console.error('✗ EmailJS public key not found in environment variables')
  }
})

// Send email function
const sendEmail = async () => {
  isLoading.value = true
  statusMessage.value = ''

  // Get environment variables
  const serviceId = config.public.emailjsServiceId
  const templateId = config.public.emailjsTemplateId
  const publicKey = config.public.emailjsPublicKey

  // Validate environment variables
  if (!serviceId || !templateId || !publicKey) {
    statusMessage.value = 'Email configuration is missing. Please contact the administrator.'
    statusClass.value = 'error'
    isLoading.value = false
    console.error('Missing EmailJS configuration:', {
      serviceId: !!serviceId,
      templateId: !!templateId,
      publicKey: !!publicKey
    })
    return
  }

  try {
    const result = await emailjs.send(
      serviceId,
      templateId,
      {
        from_name: form.value.name,
        from_email: form.value.email,
        message: form.value.message,
        // Optional: Add these if your template uses them
        name: form.value.name,
        email: form.value.email
      },
      publicKey
    )

    console.log('✓ Email sent successfully:', result)
    statusMessage.value = "Message sent successfully! I'll get back to you soon."
    statusClass.value = 'success'
    
    // Clear form
    form.value = { name: '', email: '', message: '' }
    
    // Clear success message after 5 seconds
    setTimeout(() => {
      statusMessage.value = ''
    }, 5000)
    
  } catch (error) {
    console.error('✗ Email send failed:', error)
    statusMessage.value = 'Failed to send message. Please try again or email me directly.'
    statusClass.value = 'error'
    
    // Clear error message after 5 seconds
    setTimeout(() => {
      statusMessage.value = ''
    }, 5000)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  padding: clamp(2rem, 5vw, 4rem) clamp(1rem, 4vw, 2rem);
  font-family: 'Inter', sans-serif;
  width: 100%;
  box-sizing: border-box;
}

.contact-header {
  text-align: center;
  margin-bottom: clamp(2rem, 5vw, 3rem);
}

.contact-header h3 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: left;
  line-height: 1.2;
}

.form-group {
  margin-bottom: clamp(1.25rem, 3vw, 1.5rem);
  position: relative;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
  font-size: clamp(0.75rem, 2vw, 0.875rem);
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.3s ease;
}

input,
textarea {
  width: 100%;
  padding: clamp(0.75rem, 2vw, 0.875rem) clamp(0.875rem, 2.5vw, 1rem);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: clamp(8px, 2vw, 12px);
  font-size: clamp(0.875rem, 2vw, 1rem);
  color: white;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  box-sizing: border-box;
}

input::placeholder,
textarea::placeholder {
  color: rgba(255, 255, 255, 0.3);
  font-weight: 300;
}

input:focus,
textarea:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.05);
}

input:focus + label,
textarea:focus + label {
  color: white;
}

textarea {
  resize: vertical;
  min-height: clamp(100px, 20vw, 120px);
  line-height: 1.6;
}

.submit-btn {
  width: 100%;
  padding: clamp(0.875rem, 2.5vw, 1rem) clamp(1.5rem, 4vw, 2rem);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: clamp(8px, 2vw, 12px);
  color: white;
  font-size: clamp(0.875rem, 2vw, 1rem);
  font-weight: 600;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  text-transform: uppercase;
  font-family: 'Inter', sans-serif;
  backdrop-filter: blur(10px);
}

.submit-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
  transition: left 0.5s ease;
}

.submit-btn:hover::before {
  left: 100%;
}

.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(255, 255, 255, 0.1);
}

.submit-btn:active:not(:disabled) {
  transform: translateY(0);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-text {
  display: inline-flex;
  gap: 0.25rem;
}

.dot {
  animation: loading 1.4s infinite;
  opacity: 0;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loading {
  0%, 60%, 100% {
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
}

.status-message {
  margin-top: clamp(1.25rem, 3vw, 1.5rem);
  padding: clamp(0.875rem, 2vw, 1rem) clamp(1rem, 2.5vw, 1.25rem);
  border-radius: clamp(8px, 2vw, 12px);
  font-size: clamp(0.8125rem, 2vw, 0.9375rem);
  font-weight: 500;
  text-align: center;
  backdrop-filter: blur(10px);
}

.status-message.success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #4ade80;
}

.status-message.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #f87171;
}

.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.3s ease;
}

.message-fade-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.message-fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive Design */
@media (max-width: 640px) {
  .contact-form {
    padding: 2.5rem 1.25rem;
  }

  .contact-header {
    margin-bottom: 2rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  input,
  textarea {
    padding: 0.75rem 0.875rem;
  }

  textarea {
    min-height: 100px;
  }

  .submit-btn {
    padding: 0.875rem 1.5rem;
  }
}

@media (max-width: 480px) {
  .contact-form {
    padding: 2rem 1rem;
  }

  .contact-header h3 {
    font-size: 1.5rem;
  }
}

/* Improve touch targets for mobile */
@media (pointer: coarse) {
  input,
  textarea,
  .submit-btn {
    min-height: 44px;
  }
}

/* Landscape mobile devices */
@media (max-width: 896px) and (orientation: landscape) {
  .contact-form {
    padding: 1.5rem 1rem;
  }

  .contact-header {
    margin-bottom: 1.5rem;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  textarea {
    min-height: 80px;
  }
}

/* Large tablets and small desktops */
@media (min-width: 641px) and (max-width: 1024px) {
  .contact-form {
    padding: 3rem 1.5rem;
  }
}

/* Extra small devices */
@media (max-width: 360px) {
  .contact-header h3 {
    font-size: 1.25rem;
  }

  label {
    font-size: 0.75rem;
  }

  input,
  textarea {
    font-size: 0.875rem;
    padding: 0.625rem 0.75rem;
  }

  .submit-btn {
    font-size: 0.875rem;
    padding: 0.75rem 1.25rem;
  }
}
</style>