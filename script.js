// Navigation Interactivity
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if(navLinks.classList.contains('active')){
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('active'); // close mobile menu
            const icon = hamburger.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');

            const target = document.querySelector(this.getAttribute('href'));
            if(target){
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.03)';
        }
    });

    // Custom Cursor
    const cursorDot = document.getElementById('cursor-dot');
    const cursorOutline = document.getElementById('cursor-outline');

    window.addEventListener('mousemove', (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        cursorDot.style.left = `${posX}px`;
        cursorDot.style.top = `${posY}px`;

        // Add a slight delay to the outline for physical feel
        cursorOutline.animate({
            left: `${posX}px`,
            top: `${posY}px`
        }, { duration: 500, fill: "forwards" });
    });

    // Cursor hover effects on links and buttons
    const interactables = document.querySelectorAll('a, button, .project-card, .skill-tag');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.classList.remove('hovering');
        });
    });

    // 3D Neural Network / FaceNet Background Animation (Three.js)
    if (typeof THREE !== 'undefined') {
        const canvas = document.getElementById('canvas3d');
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 150;

        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);

        // Particles representing FaceNet / Neural Nodes
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 350; // number of initial nodes

        const posArray = new Float32Array(particlesCount * 3);
        // Generate points in a space
        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 400;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // Material for points
        const particlesMaterial = new THREE.PointsMaterial({
            size: 2,
            color: 0x9d4edd, // purple accent
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Create connecting lines (MediaPipe mesh style)
        const linesMaterial = new THREE.LineBasicMaterial({
            color: 0x4361ee, // blue accent
            transparent: true,
            opacity: 0.2
        });

        const linePositions = [];
        for (let i = 0; i < particlesCount; i++) {
            for (let j = i + 1; j < particlesCount; j++) {
                const dx = posArray[i*3] - posArray[j*3];
                const dy = posArray[i*3+1] - posArray[j*3+1];
                const dz = posArray[i*3+2] - posArray[j*3+2];
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
                
                // Connect if points are close to each other
                if (dist < 50) {
                    linePositions.push(
                        posArray[i*3], posArray[i*3+1], posArray[i*3+2],
                        posArray[j*3], posArray[j*3+1], posArray[j*3+2]
                    );
                }
            }
        }

        const linesGeometry = new THREE.BufferGeometry();
        linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
        scene.add(linesMesh);

        // Mouse Interaction
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = (e.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
        });

        // Animation Loop
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            
            // Slow rotation
            particlesMesh.rotation.y = elapsedTime * 0.05;
            particlesMesh.rotation.x = elapsedTime * 0.02;
            
            linesMesh.rotation.y = elapsedTime * 0.05;
            linesMesh.rotation.x = elapsedTime * 0.02;

            // Slight parallax effect based on mouse
            particlesMesh.position.x += (mouseX * 20 - particlesMesh.position.x) * 0.05;
            particlesMesh.position.y += (mouseY * 20 - particlesMesh.position.y) * 0.05;
            
            linesMesh.position.x += (mouseX * 20 - linesMesh.position.x) * 0.05;
            linesMesh.position.y += (mouseY * 20 - linesMesh.position.y) * 0.05;

            renderer.render(scene, camera);
        }
        animate();

        // Resize Handler
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

});
