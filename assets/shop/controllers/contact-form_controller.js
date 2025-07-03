import { Controller } from '@hotwired/stimulus';

export default class extends Controller {
    static targets = ['submitButton'];

    connect() {
        this.element.addEventListener('submit', this.handleSubmit.bind(this));
    }

    disconnect() {
        this.element.removeEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(this.element);
        const submitButton = this.submitButtonTarget;

        // Disable submit button and show loading state
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            const response = await fetch('/api/v1/uniflow/contact/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.get('contact[email]'),
                    message: formData.get('contact[message]')
                })
            });

            if (response.ok) {
                // Success - redirect to show flash message
                window.location.href = '/contact';
            } else {
                const errorData = await response.json();
                this.showError(errorData.message || 'An error occurred while sending your message.');
            }
        } catch (error) {
            this.showError('An error occurred while sending your message.');
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Send';
        }
    }

    showError(message) {
        // Remove existing error alerts
        const existingAlerts = this.element.querySelectorAll('.alert-danger');
        existingAlerts.forEach(alert => alert.remove());

        // Create new error alert
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger';
        errorAlert.setAttribute('role', 'alert');
        errorAlert.textContent = message;

        // Insert at the beginning of the form
        this.element.insertBefore(errorAlert, this.element.firstChild);

        // Scroll to top to show error
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
