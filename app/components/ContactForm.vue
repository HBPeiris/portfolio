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

<script>
import emailjs from '@emailjs/browser';
import { emailjsConfig } from '@/config/emailjs';

export default {
  name: 'ContactForm',
  data() {
    return {
      form: {
        name: '',
        email: '',
        message: ''
      },
      isLoading: false,
      statusMessage: '',
      statusClass: ''
    };
  },
  methods: {
    async sendEmail() {
      this.isLoading = true;
      this.statusMessage = '';

      try {
        const result = await emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.templateId,
          {
            from_name: this.form.name,
            from_email: this.form.email,
            message: this.form.message
          },
          emailjsConfig.publicKey
        );

        this.statusMessage = 'Message sent successfully!';
        this.statusClass = 'success';
        this.form = { name: '', email: '', message: '' };
        
      } catch (error) {
        console.error('Email send failed:', error);
        this.statusMessage = 'Failed to send message. Please try again.';
        this.statusClass = 'error';
      } finally {
        this.isLoading = false;
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

.contact-form {
  max-width: 600px;
  margin: 0 auto;
  padding: 4rem 2rem;
  font-family: 'Inter', sans-serif;
}

.contact-header {
  text-align: center;
  margin-bottom: 3rem;
}

.contact-header h3 {
  font-size: 2rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  background: linear-gradient(135deg, #ffffff 0%, rgba(255, 255, 255, 0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-align: left;
}

.subtitle {
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 300;
  letter-spacing: 0.02em;
}

.form-group {
  margin-bottom: 2rem;
  position: relative;
}

label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color 0.3s ease;
}

input,
textarea {
  width: 100%;
  padding: 1rem 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  font-size: 1rem;
  color: white;
  font-family: 'Inter', sans-serif;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
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
  min-height: 140px;
  line-height: 1.6;
}

.submit-btn {
  width: 100%;
  padding: 1.25rem 2rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
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
  margin-top: 1.5rem;
  padding: 1rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9375rem;
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
    padding: 3rem 1.5rem;
  }

  .contact-header h2 {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
</style>