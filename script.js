// Three.js animated background
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;

function initBackground() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('bg-canvas'),
        alpha: true,
        antialias: true
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 800;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 200;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.8,
        color: 0x00D9FF,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    camera.position.z = 50;

    animate();
}

function animate() {
    requestAnimationFrame(animate);

    // Base continuous rotation (when mouse is in center)
    const baseRotationX = 0.0005;
    const baseRotationY = 0.0008;

    // Mouse influence - center is neutral, sides speed up in opposite directions
    const mouseInfluenceX = mouseY * 0.001;  // Up/down still works the same
    const mouseInfluenceY = mouseX * 0.002;  // Left/right: negative on left, positive on right
    
    // Apply rotation: base + mouse influence
    particles.rotation.x += baseRotationX + mouseInfluenceX;
    particles.rotation.y += baseRotationY + mouseInfluenceY;

    // Pulse effect
    const time = Date.now() * 0.001;
    particles.material.opacity = 0.3 + Math.sin(time) * 0.1;

    // Subtle camera movement based on mouse - increased effect
    camera.position.x += (mouseX * 0.02 - camera.position.x) * 0.05;
    camera.position.y += (-mouseY * 0.02 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Mouse movement tracking
window.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = (event.clientY / window.innerHeight) * 2 - 1;
});

// Touch movement tracking for mobile
window.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
        mouseX = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        mouseY = (event.touches[0].clientY / window.innerHeight) * 2 - 1;
    }
});

// Fade in animations
function handleScrollAnimations() {
    const elements = document.querySelectorAll('.fade-in');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize everything when page loads
window.addEventListener('load', () => {
    initBackground();
    handleScrollAnimations();
    
    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
});

window.addEventListener('scroll', handleScrollAnimations);
