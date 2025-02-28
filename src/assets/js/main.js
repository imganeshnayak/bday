document.addEventListener('DOMContentLoaded', () => {
    // Add at the beginning of your existing DOMContentLoaded handler
    const audio = document.getElementById('birthday-song');
    audio.volume = 0.5; // Set initial volume to 50%
    
    // Initialize audio on first click anywhere on the page
    document.addEventListener('click', () => {
        if (audio.paused) {
            audio.play()
                .catch(error => {
                    console.log("Audio playback failed:", error);
                });
        }
    }, { once: true }); // Remove listener after first click

    // Particles.js configuration
    particlesJS('particles-js', {
        particles: {
            number: {
                value: 100,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"]
            },
            shape: {
                type: "circle"
            },
            size: {
                value: 6,
                random: true
            },
            move: {
                enable: true,
                speed: 3,
                direction: "none",
                random: true,
                out_mode: "out"
            }
        }
    });

    // Add confetti effect
    function createConfetti() {
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }

    // Create confetti continuously
    setInterval(createConfetti, 100);

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
        alpha: true,
        antialias: true 
    });

    // Set renderer size and add to container
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
    document.querySelector('.container').appendChild(renderer.domElement);

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add this after scene setup
    function typeText(element, text, speed = 50) {
        let index = 0;
        element.textContent = '';
        element.classList.remove('blinking-cursor');
        
        function type() {
            if (index < text.length) {
                element.textContent += text[index];
                index++;
                setTimeout(type, speed);
            } else {
                // Add blinking cursor after typing is complete
                element.classList.add('blinking-cursor');
            }
        }
        
        type();
    }

    // Update the quotes array with paragraphs
    const birthdayQuotes = [
       "Happy Birthday to the wonderful person 😁 🎉🎂 May this special day bring you joy, love, and all your heart's desires.",
       " Wishing you a year filled with happiness, success, and unforgettable moments! 💫🌸😁"
    ];

    // Initialize typing animation
    const typingElement = document.querySelector('.typing-text');
    let currentQuote = 0;

    // Update quote cycling function
    function cycleQuotes() {
        typeText(typingElement, birthdayQuotes[currentQuote]);
        currentQuote = (currentQuote + 1) % birthdayQuotes.length;
        
        // Increased delay for longer paragraphs
        setTimeout(() => {
            typingElement.textContent = '';
            typingElement.classList.remove('blinking-cursor');
            setTimeout(cycleQuotes, 1000);
        }, birthdayQuotes[currentQuote].length * 50 + 5000); // Longer pause between paragraphs
    }

    // Start the quote cycle
    cycleQuotes();

    // Create floating blocks with images
    function createFloatingBlocks() {
        const blocks = [];
        const images = [
            'src/assets/images/1.jpg',
            'src/assets/images/2.jpg',
            'src/assets/images/3.jpg',
            'src/assets/images/1.jpg',
            'src/assets/images/2.jpg',
            'src/assets/images/3.jpg', 
            'src/assets/images/2.jpg',
         ,        
        ];

        const textureLoader = new THREE.TextureLoader();
        
        images.forEach((imagePath, index) => {
            const geometry = new THREE.BoxGeometry(3, 3, 0.2);
            const texture = textureLoader.load(imagePath);
            
            // Create materials with transparency
            const materials = Array(6).fill().map(() => 
                new THREE.MeshBasicMaterial({
                    map: texture,
                    transparent: true,
                    opacity: 0 // Start invisible
                })
            );

            const block = new THREE.Mesh(geometry, materials);
            
            // Position blocks in a circular pattern
            block.position.set(
                Math.sin(index * Math.PI / 2) * 8, // Spread in X
                -5, // Start below view
                Math.cos(index * Math.PI / 2) * 8  // Spread in Z
            );
            
            // Add metadata for animation
            block.userData = {
                fadeState: 'in',
                startTime: Date.now() + (index * 2000), // Stagger start times
                speed: 0.02 + Math.random() * 0.02
            };

            scene.add(block);
            blocks.push(block);
        });

        return blocks;
    }

    // Create the floating blocks
    const floatingBlocks = createFloatingBlocks();

    // Create 3D cake
    function create3DCake() {
        const cakeGroup = new THREE.Group();
        
        // Make plate larger and more decorative
        const plateGeometry = new THREE.CylinderGeometry(5, 5.2, 0.3, 32);
        const plateMaterial = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: 100,
            specular: 0x666666
        });
        const plate = new THREE.Mesh(plateGeometry, plateMaterial);
        cakeGroup.add(plate);
    
        // Enhanced cake layers
        const layerColors = [0xff69b4, 0xff1493, 0xff69b4];
        const layerSizes = [
            { radius: 4.5, height: 1.5 },  // Larger bottom layer
            { radius: 3.5, height: 1.5 },  // Larger middle layer
            { radius: 2.5, height: 1.5 }   // Larger top layer
        ];
    
        let currentHeight = 0.3; // Start above plate
        const layers = [];
    
        layerSizes.forEach((size, index) => {
            const layerGeometry = new THREE.CylinderGeometry(
                size.radius, size.radius, size.height, 32
            );
            const layerMaterial = new THREE.MeshPhongMaterial({
                color: layerColors[index],
                shininess: 30,
                specular: 0xffffff
            });
            const layer = new THREE.Mesh(layerGeometry, layerMaterial);
            layer.position.y = currentHeight + size.height/2;
            cakeGroup.add(layer);
            layers.push(layer);
            currentHeight += size.height;
        });
    
        // Add more candles
        for(let i = 0; i < 8; i++) {
            const candleGeometry = new THREE.CylinderGeometry(0.15, 0.15, 1.2, 16);
            const candleMaterial = new THREE.MeshPhongMaterial({
                color: 0xffd700,
                shininess: 100
            });
            const candle = new THREE.Mesh(candleGeometry, candleMaterial);
            const angle = (i / 8) * Math.PI * 2;
            const radius = 1.8;
            candle.position.set(
                Math.cos(angle) * radius,
                currentHeight + 0.6,
                Math.sin(angle) * radius
            );
            cakeGroup.add(candle);
    
            // Enhanced flame
            const flameGeometry = new THREE.SphereGeometry(0.2, 32, 32);
            const flameMaterial = new THREE.MeshPhongMaterial({
                color: 0xff4500,
                emissive: 0xff4500,
                emissiveIntensity: 1
            });
            const flame = new THREE.Mesh(flameGeometry, flameMaterial);
            flame.position.y = 0.8;
            flame.scale.y = 1.5;
            candle.add(flame);
    
            // Brighter flame light
            const flameLight = new THREE.PointLight(0xff4500, 2, 3);
            flameLight.position.y = 0.8;
            candle.add(flameLight);
        }
    
        // Position cake
        cakeGroup.position.set(0, -2, 0);
        scene.add(cakeGroup);
    
        return { cakeGroup, layers };
    }
    
    // Create cake and store reference
    const cake = create3DCake();
    
    // Add cake cutting animation
    let isCutting = false;
    let cutProgress = 0;
    
    function animateCakeCut() {
        if (isCutting && cutProgress < 1) {
            cutProgress += 0.01;
            cake.layers.forEach((layer, index) => {
                const offset = index * 0.5;
                if (cutProgress > offset) {
                    const slide = Math.min(1, (cutProgress - offset) * 2);
                    layer.position.x = slide * 2;
                    layer.rotation.y = slide * Math.PI / 6;
                }
            });
        }
    }

    // Add click handler for cake cutting
    renderer.domElement.addEventListener('click', () => {
        if (!isCutting) {
            isCutting = true;
        }
    });

    // Animation function
    function animate() {
        requestAnimationFrame(animate);
        
        const currentTime = Date.now();
        const time = currentTime * 0.001; // Convert to seconds
        
        floatingBlocks.forEach((block, index) => {
            const timeSinceStart = (currentTime - block.userData.startTime) / 1000;
            
            if (block.userData.fadeState === 'in') {
                // Fade in and float up
                const fadeInProgress = Math.min(timeSinceStart * 0.5, 1);
                block.material.forEach(material => {
                    material.opacity = fadeInProgress;
                });
                
                // Move up with a slight wave motion
                block.position.y += block.userData.speed;
                block.position.x += Math.sin(time + index) * 0.01;
                
                // Start fade out when reaching certain height
                if (block.position.y >= 8) {
                    block.userData.fadeState = 'out';
                    block.userData.startTime = currentTime;
                }
            } else {
                // Fade out and continue floating
                const fadeOutProgress = Math.max(1 - timeSinceStart * 0.5, 0);
                block.material.forEach(material => {
                    material.opacity = fadeOutProgress;
                });
                
                block.position.y += block.userData.speed * 0.5;
                
                // Reset when completely faded out
                if (fadeOutProgress === 0) {
                    block.position.y = -5;
                    block.position.x = Math.sin(index * Math.PI / 2) * 8;
                    block.position.z = Math.cos(index * Math.PI / 2) * 8;
                    block.userData.fadeState = 'in';
                    block.userData.startTime = currentTime;
                }
            }
            
            // Add gentle rotation
            block.rotation.y += 0.01;
            block.rotation.x = Math.sin(time + index) * 0.1;
        });
        
        // Add cake animations
        if (cake.cakeGroup) {
            cake.cakeGroup.rotation.y = Math.sin(time * 0.5) * 0.1;
            animateCakeCut();
        }

        renderer.render(scene, camera);
    }

    // Start animation
    animate();

    // Camera positioning
    camera.position.z = 20;
    camera.position.y = 5;
    camera.lookAt(0, 0, 0);

    // Handle window resize
    window.addEventListener('resize', () => {
        const width = window.innerWidth * 0.8;
        const height = window.innerHeight * 0.8;
        
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });

    // Add spotlights for better lighting
    const spotLight1 = new THREE.SpotLight(0xffffff, 1);
    spotLight1.position.set(10, 10, 10);
    scene.add(spotLight1);

    const spotLight2 = new THREE.SpotLight(0xffffff, 0.5);
    spotLight2.position.set(-10, 10, -10);
    scene.add(spotLight2);
});