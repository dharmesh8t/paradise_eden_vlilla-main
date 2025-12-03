document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');

    if (mobileMenuBtn && mobileNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            // Animate hamburger to X
            const spans = mobileMenuBtn.querySelectorAll('span');
            // Simple toggle logic for visual feedback could be added here
        });

        // Close menu when a link is clicked
        mobileNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
            });
        });
    }

    // Enquiry Form Handler
    const enquiryForm = document.getElementById('enquiryForm');
    if (enquiryForm) {
        enquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const dates = document.getElementById('dates').value;
            const guests = document.getElementById('guests').value;
            const message = document.getElementById('message').value;

            // Construct WhatsApp Message
            const text = `Hi, I would like to enquire about Paradise Eden Villa.%0A%0A*Name:* ${name}%0A*Dates:* ${dates}%0A*Guests:* ${guests}%0A*Message:* ${message}`;

            const whatsappUrl = `https://wa.me/917639738138?text=${text}`;

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');
        });
    }
});
