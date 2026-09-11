document.addEventListener('DOMContentLoaded', () => {
    // 0. Bascule de Thème Clair / Sombre (Dark/Light Mode)
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

    // Toujours démarrer en mode sombre à chaque rechargement de page
    const initialTheme = 'dark';

    const setTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('portfolio-theme', theme);
        
        if (themeIcon) {
            if (theme === 'dark') {
                themeIcon.className = 'fas fa-sun';
                themeToggleBtn.setAttribute('title', 'Passer en mode clair (Fond blanc)');
                themeToggleBtn.setAttribute('aria-label', 'Passer en mode clair');
            } else {
                themeIcon.className = 'fas fa-moon';
                themeToggleBtn.setAttribute('title', 'Passer en mode sombre (Fond bleu nuit)');
                themeToggleBtn.setAttribute('aria-label', 'Passer en mode sombre');
            }
        }
    };

    // Appliquer le thème initial
    setTheme(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
            
            if (themeIcon) {
                themeIcon.style.transition = 'transform 0.3s ease';
                themeIcon.style.transform = 'rotate(180deg) scale(0.8)';
                setTimeout(() => {
                    themeIcon.style.transform = 'rotate(0deg) scale(1)';
                }, 200);
            }
            
            setTheme(newTheme);
        });
    }

    // 1. Effet de frappe (Typing Effect)
    const typingElement = document.getElementById('typing');
    if (typingElement) {
        const textToType = 'Abdourahmane';
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            typingElement.textContent = textToType;
        } else {
            let index = 0;
            typingElement.textContent = ''; // S'assurer que c'est vide au départ
            
            const typeText = () => {
                if (index < textToType.length) {
                    typingElement.textContent += textToType.charAt(index);
                    index++;
                    setTimeout(typeText, 100);
                } else {
                    // Ajouter un curseur clignotant
                    typingElement.classList.add('cursor-blink');
                    // Arrêter de clignoter après 2 secondes
                    setTimeout(() => {
                        typingElement.classList.remove('cursor-blink');
                    }, 2000);
                }
            };
            typeText();
        }
    }

    // 2. Animations au défilement (IntersectionObserver)
    const cards = document.querySelectorAll('.competence-card, .realisation-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries, observer) => {
        let delayIndex = 0; // Pour décaler les animations
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                target.style.transitionDelay = `${delayIndex * 0.1}s`;
                target.classList.add('animate');
                delayIndex++;
                // Ne plus observer après l'animation
                observer.unobserve(target);
            }
        });
    }, observerOptions);

    cards.forEach(card => cardObserver.observe(card));

    // 3. Navigation Active & 5. Effet de défilement de l'en-tête
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    const handleScrollAndNav = () => {
        // En-tête (Header)
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Navigation active
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - header.clientHeight - 50) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', handleScrollAndNav);

    // 4. Menu Mobile
    const menuBtn = document.querySelector('.menu-btn');
    const navLinksContainer = document.querySelector('.nav-links');
    const menuIcon = menuBtn ? menuBtn.querySelector('i') : null;

    const toggleMenu = () => {
        navLinksContainer.classList.toggle('active');
        document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
        
        if (menuIcon) {
            if (navLinksContainer.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        }
    };

    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Fermer le menu lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navLinksContainer.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Fermer le menu lors du clic à l'extérieur
    document.addEventListener('click', (e) => {
        if (navLinksContainer && navLinksContainer.classList.contains('active') && !navLinksContainer.contains(e.target) && !menuBtn.contains(e.target)) {
            toggleMenu();
        }
    });

    // 6. Compteurs animés (About Section)
    const statNumbers = document.querySelectorAll('.stat-number');
    const aboutSection = document.getElementById('apropos');
    let countersAnimated = false;

    const animateCounters = () => {
        statNumbers.forEach(stat => {
            const target = +stat.getAttribute('data-target');
            const duration = 2000; // 2 secondes
            let startTime = null;

            const updateCounter = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const progress = currentTime - startTime;
                
                const value = Math.min(Math.floor((progress / duration) * target), target);
                stat.textContent = value + (stat.hasAttribute('data-plus') ? '+' : '');

                if (progress < duration) {
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + (stat.hasAttribute('data-plus') ? '+' : '');
                }
            };
            requestAnimationFrame(updateCounter);
        });
    };

    if (aboutSection && statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    animateCounters();
                    countersAnimated = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        statsObserver.observe(aboutSection);
    }

    // 7. Bouton retour en haut
    const scrollTopBtn = document.getElementById('scroll-top');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        scrollTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 8. Défilement fluide (Smooth Scroll) pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = header ? header.clientHeight : 0;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // 9. Formulaire de contact & Envoi direct par Email
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-btn') || contactForm.querySelector('button[type="submit"]');
            const originalHTML = submitBtn.innerHTML;
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const subjectInput = document.getElementById('subject');
            const messageInput = document.getElementById('message');

            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput ? subjectInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';

            if (!name || !email || !message) {
                alert('Veuillez remplir votre nom, votre email et votre message.');
                return;
            }

            // État de chargement élégant
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
            submitBtn.style.opacity = '0.85';

            try {
                const response = await fetch('https://formsubmit.co/ajax/bahrahmane100@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        Nom: name,
                        Email: email,
                        Sujet: subject || 'Nouveau message depuis le portfolio',
                        Message: message,
                        _subject: `Message Portfolio de ${name} : ${subject || 'Contact'}`
                    })
                });

                const data = await response.json().catch(() => ({}));

                if (data && data.message && data.message.includes('Activation')) {
                    submitBtn.innerHTML = '<i class="fas fa-envelope-open-text"></i> Email d\'activation envoyé !';
                    submitBtn.classList.add('success');
                    alert("Un email d'activation a été envoyé à bahrahmane100@gmail.com. Cliquez sur 'Activate Form' dans votre boîte Gmail (ou dossier Spam) pour activer définitivement.");
                    contactForm.reset();
                } else {
                    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Message envoyé avec succès !';
                    submitBtn.classList.add('success');
                    submitBtn.style.opacity = '1';
                    contactForm.reset();
                }
            } catch (err) {
                submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erreur réseau. Réessayez.';
                submitBtn.classList.add('error');
            } finally {
                setTimeout(() => {
                    submitBtn.innerHTML = originalHTML;
                    submitBtn.classList.remove('success');
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 4000);
            }
        });
    }

    // Copie rapide de l'email
    const btnCopyEmail = document.getElementById('btn-copy-email');
    if (btnCopyEmail) {
        btnCopyEmail.addEventListener('click', () => {
            navigator.clipboard.writeText('bahrahmane100@gmail.com').then(() => {
                const originalIcon = btnCopyEmail.innerHTML;
                btnCopyEmail.innerHTML = '<i class="fas fa-check" style="color: #10b981;"></i>';
                btnCopyEmail.setAttribute('title', 'Email copié !');
                
                setTimeout(() => {
                    btnCopyEmail.innerHTML = originalIcon;
                    btnCopyEmail.setAttribute('title', 'Copier l\'adresse email');
                }, 2500);
            });
        });
    }

    // 10. Clic sur le logo
    const refreshImage = document.getElementById('refresh-image');
    if (refreshImage) {
        refreshImage.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.reload();
        });
        refreshImage.style.cursor = 'pointer';
    }

    // 11. Effet de survol 3D (Tilt) sur les cartes compétences uniquement
    const tiltCards = document.querySelectorAll('.competence-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 25;
            const rotateY = -(x - centerX) / 25;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            card.style.transition = 'transform 0.3s ease';
            
            setTimeout(() => {
                card.style.transition = '';
            }, 300);
        });
    });

    // ==========================================================================
    // 12. SYSTÈME DE MODALE — DÉTAILS DE PROJET (Galerie, Fonctionnalités, Infos)
    // ==========================================================================

    const projectsData = {
        'univ-scheduler': {
            category: '<i class="fas fa-calendar-check"></i> Desktop Java',
            title: 'univ-scheduler — Gestion Intelligente des Emplois du Temps',
            subtitle: 'Application desktop JavaFX pour l\'ordonnancement automatisé des salles et emplois du temps de l\'Université Iba Der Thiam. Algorithme de détection de conflits en temps réel avec interface graphique intuitive.',
            gallery: [
                { src: 'univ-cover.png', caption: 'Portail d\'accueil & Authentification ERP UIDT', large: true },
                { src: 'univ-dashboard.png', caption: 'Tableau de Bord — Statistiques en temps réel' },
                { src: 'univ-emploi-du-temps.png', caption: 'Emploi du Temps — Vue hebdomadaire UFR SET' },
                { src: 'univ-carte-campus.png', caption: 'Carte interactive du Campus UIDT' },
                { src: 'univ-cours-en-ligne.png', caption: 'Cours en Ligne — Sessions & Ressources' },
                { src: 'univ-assistant-ia.png', caption: 'Assistant IA d\'Orientation — Chatbot' }
            ],
            features: [
                { title: 'Portail ERP & Authentification sécurisée', desc: 'Page de connexion moderne avec sélection de profils (Admin, Professeur, Étudiant, Planning) et indicateurs d\'activité en direct (4200+ étudiants, 32+ enseignants).' },
                { title: 'Tableau de bord temps réel', desc: 'Vue d\'ensemble complète : occupation des salles (14%), cours planifiés, étudiants inscrits, conflits détectés et examens programmés avec graphiques dynamiques.' },
                { title: 'Emploi du temps interactif', desc: 'Grille hebdomadaire avec code couleur par type (CM, TD, TP). Filtrage par classe UFR SET, export PDF et détection automatique des conflits.' },
                { title: 'Carte interactive du campus', desc: 'Carte GPS du campus UIDT avec bâtiments A/B/C cliquables, assistant carte intégré, vue plan/satellite et navigation rapide entre les 23 salles.' },
                { title: 'Cours en ligne & Sessions live', desc: 'Sessions en direct via Google Meet avec statut EN DIRECT/BIENTÔT, ressources partagées (PDF, ZIP), replays et planification de sessions.' },
                { title: 'Assistant IA d\'orientation', desc: 'Chatbot intelligent connecté à la base de données. Répond aux questions sur la localisation des salles, les horaires, les examens et guide les étudiants sur le campus.' }
            ],
            techStack: ['JavaFX', 'Java', 'SQLite', 'MVC', 'Google Maps API', 'WebSocket', 'IA/NLP'],
            links: {
                code: 'https://github.com/Rahmane12745',
                demo: null
            },
            infos: {
                categorie: 'Desktop',
                annee: '2025',
                fonctionnalites: '6',
                photos: '6'
            }
        },
        'crouspace': {
            category: '<i class="fas fa-graduation-cap"></i> Web Fullstack',
            title: 'CrousSpace — Gestion des Locaux Universitaires & CROUS-T',
            subtitle: 'Plateforme web sécurisée pour la gestion intégrale des baux commerciaux, cantines et boutiques universitaires : demandes en ligne, validation comptable, encaissements (9M+ FCFA), reçus numériques et pilotage analytique CROUS-T.',
            gallery: [
                { src: 'crous-cover.png', caption: 'Page d\'accueil & Portail de Demande de Locaux', large: true },
                { src: 'crous-locaux.png', caption: 'Catalogue des Commerces & Cantines disponibles' },
                { src: 'crous-etudiant.png', caption: 'Espace Usager & Suivi des Signalements en direct' },
                { src: 'crous-comptabilite.png', caption: 'Espace Comptabilité & Encaissements (9M+ FCFA)' },
                { src: 'crous-analytics.png', caption: 'Tableau de Bord Décisionnel CROUS-T Intelligence' }
            ],
            features: [
                { title: 'Gestion des locaux & Baux commerciaux', desc: 'Catalogue interactif des cantines, boutiques et kiosques avec tarifs (FCFA), surfaces (m²) et dépôt de dossiers en ligne.' },
                { title: 'Module Comptabilité & Encaissements', desc: 'Suivi des paiements validés (9M+ FCFA), ventilation multi-modes (Mobile Money, Virement, Espèces) et génération instantanée de reçus numériques.' },
                { title: 'Espace Usager & Suivi des signalements', desc: 'Tableau de bord étudiant avec statut en temps réel des réclamations (Transmis ➔ Prise en charge ➔ Intervention ➔ Résolu).' },
                { title: 'CROUS-T Intelligence & Analytics', desc: 'Indicateurs décisionnels pour la direction (taux d\'occupation des locaux à 39.5%, taux de traitement à 63%, courbes d\'évolution).' },
                { title: 'Contrats numériques & Échéances', desc: 'Dématérialisation complète des baux, signature de contrats de location et suivi automatisé du paiement des loyers.' },
                { title: 'Architecture Backend Python (Flask) & Colab', desc: 'Backend conçu en Python avec Flask pour des APIs REST rapides et modulaires. Développement, tests et prototypage réalisés sous environnement Google Colab.' }
            ],
            techStack: ['Python', 'Flask', 'React.js', 'Google Colab', 'MySQL', 'REST API', 'Mobile Money', 'JWT'],
            links: {
                code: 'https://github.com/Rahmane12745',
                demo: 'https://crousspace.onrender.com'
            },
            infos: {
                categorie: 'Web Fullstack',
                annee: '2026',
                fonctionnalites: '6',
                photos: '5'
            }
        },
        'hackathon-mcn': {
            category: '<i class="fas fa-laptop-code"></i> Projet Hackathon',
            title: 'Hackathon Musée des Civilisations Noires',
            subtitle: 'Plateforme numérique développée en 48h pour la digitalisation et la valorisation du patrimoine culturel africain lors du hackathon au Musée des Civilisations Noires.',
            gallery: [
                { src: 'mcn-exploration3d.png', caption: 'Exploration 3D & Façade du Musée', large: true },
                { src: 'mcn-expositions.png', caption: 'Nos Expositions — Patrimoine culturel' },
                { src: 'mcn-collections.png', caption: 'Collections & Art mural' },
                { src: 'mcn-tarifs.png', caption: 'Horaires, Tarifs & Contact' },
                { src: 'mcn-detail-collection.png', caption: 'Détail d\'une collection & Vidéo' }
            ],
            features: [
                { title: 'Catalogue numérique interactif', desc: 'Numérisation des œuvres d\'art avec fiches détaillées, métadonnées enrichies et recherche sémantique avancée.' },
                { title: 'Visite virtuelle immersive', desc: 'Parcours interactif des galeries du musée avec navigation intuitive et informations contextuelles sur chaque œuvre.' },
                { title: 'Billetterie en ligne', desc: 'Système de réservation et achat de billets avec QR Code, gestion des créneaux et tarifs différenciés.' },
                { title: 'Recherche sémantique', desc: 'Moteur de recherche intelligent par thème, époque, région ou artiste avec suggestions automatiques.' },
                { title: 'Design responsive & accessible', desc: 'Interface entièrement responsive, conforme aux standards d\'accessibilité WCAG 2.1, multilingue (FR/EN).' },
                { title: 'Développement intensif 48h', desc: 'Prototypage rapide, sprints agiles, modélisation express de l\'architecture et pitch convaincant devant le jury.' }
            ],
            techStack: ['HTML5/CSS3', 'JavaScript', 'REST API', 'Responsive Design', 'UX/UI'],
            links: {
                code: 'https://github.com/Rahmane12745',
                demo: 'https://guileless-froyo-009e84.netlify.app/'
            },
            infos: {
                categorie: 'Hackathon',
                annee: '2025',
                fonctionnalites: '6',
                photos: '5'
            }
        },
        'votenow': {
            category: '<i class="fas fa-vote-yea"></i> Web & Sécurité',
            title: 'VoteNow — Solution de Vote Électronique Flexible & Sécurisée',
            subtitle: 'Plateforme web moderne de vote électronique développée avec HTML5, CSS3, JavaScript et Bootstrap. Elle garantit sécurité, anonymat, chiffrement cryptographique et traçabilité en temps réel pour tous types de scrutins (délégués, comités, élections associatives et universitaires).',
            gallery: [
                { src: 'votenow-cover.png', caption: 'Portail VoteNow — Accueil & Espace de vote sécurisé', large: true },
                { src: 'votenow-features.png', caption: 'Avantages Clés — Sécurité, Accessibilité & Traçabilité' },
                { src: 'votenow-results.png', caption: 'Résultats & Statistiques en temps réel avec Histogramme' },
                { src: 'votenow-steps.png', caption: 'Guide du Scrutin — 4 étapes simples pour voter' }
            ],
            features: [
                { title: 'Développement Frontend HTML5, CSS3 & Bootstrap', desc: 'Interface utilisateur moderne, intuitive et 100% responsive construite avec le framework Bootstrap et des animations CSS fluides.' },
                { title: 'Logique & Interactivité en JavaScript', desc: 'Gestion dynamique des formulaires de vote, validation en temps réel des matricules électeurs et calcul instantané des suffrages.' },
                { title: 'Sécurité et anonymat des suffrages', desc: 'Chiffrement de bout en bout des votes pour garantir une confidentialité absolue et l\'intégrité inviolable de chaque scrutin.' },
                { title: 'Dépouillement et résultats en direct', desc: 'Calcul automatique du taux de participation et visualisation dynamique des scores sous forme de barres de progression et d\'histogrammes.' },
                { title: 'Accessibilité universelle & Sans installation', desc: 'Conçu pour voter sans aucune friction depuis n\'importe quel appareil (smartphone, tablette, PC) sans aucun téléchargement.' },
                { title: 'Traçabilité et auditabilité complète', desc: 'Journalisation sécurisée des étapes du scrutin permettant un contrôle et une transparence totale pour les organisateurs.' }
            ],
            techStack: ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap', 'REST API', 'Responsive Design'],
            links: {
                code: 'https://github.com/Rahmane12745',
                demo: 'https://frabjous-mousse-4f30de.netlify.app/'
            },
            infos: {
                categorie: 'Web & Sécurité',
                annee: '2026',
                fonctionnalites: '6',
                photos: '4'
            }
        }
    };

    // Éléments de la modale
    const projectModal = document.getElementById('project-modal');
    const modalDynamicBody = document.getElementById('modal-dynamic-body');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalBackdrop = document.getElementById('modal-backdrop');

    // Éléments de la lightbox
    const lightboxModal = document.getElementById('lightbox-modal');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
    const lightboxBackdrop = document.getElementById('lightbox-backdrop');

    // Fonction pour construire le HTML de la modale
    const buildModalContent = (data) => {
        const galleryItems = data.gallery.map((item, i) => `
            <div class="gallery-item ${item.large ? 'large-item' : ''}" data-lightbox-src="${item.src}" data-lightbox-caption="${item.caption}">
                <img src="${item.src}" alt="${item.caption}" loading="lazy">
                <div class="gallery-item-caption">
                    <span>${item.caption}</span>
                    <i class="fas fa-search-plus gallery-zoom-icon"></i>
                </div>
            </div>
        `).join('');

        const featureItems = data.features.map(f => `
            <div class="feature-item">
                <i class="fas fa-check-circle feature-check"></i>
                <p class="feature-text"><strong>${f.title} —</strong> ${f.desc}</p>
            </div>
        `).join('');

        const techPills = data.techStack.map(t => `<span class="modal-tech-pill">${t}</span>`).join('');

        const demoBtn = data.links.demo ? `
            <a href="${data.links.demo}" target="_blank" rel="noopener noreferrer" class="btn-sidebar-link btn-demo">
                <span class="btn-content"><i class="fas fa-rocket"></i> Voir la démo</span>
                <i class="fas fa-external-link-alt"></i>
            </a>
        ` : '';

        return `
            <!-- En-tête -->
            <div class="modal-header-section">
                <span class="modal-category-badge">${data.category}</span>
                <h2 class="modal-project-title" id="modal-project-title">${data.title}</h2>
                <p class="modal-project-subtitle">${data.subtitle}</p>
            </div>

            <!-- Galerie Photos -->
            <div class="modal-gallery-wrapper">
                <div class="gallery-top-bar">
                    <span class="gallery-badge-pill"><i class="fas fa-images"></i> Galerie <span class="photo-count">${data.gallery.length} photos</span></span>
                    <span class="gallery-hint"><i class="fas fa-mouse-pointer"></i> Cliquez pour agrandir</span>
                </div>
                <div class="modal-gallery-grid">
                    ${galleryItems}
                </div>
            </div>

            <!-- Grille : Fonctionnalités + Sidebar -->
            <div class="modal-details-grid">
                <!-- Fonctionnalités clés -->
                <div class="modal-features-card">
                    <div class="features-header">
                        <i class="fas fa-check-double"></i>
                        <h3>Fonctionnalités clés</h3>
                    </div>
                    <div class="features-list">
                        ${featureItems}
                    </div>
                </div>

                <!-- Sidebar -->
                <div class="modal-sidebar-col">
                    <!-- Technologies -->
                    <div class="sidebar-box">
                        <h4><i class="fas fa-code"></i> Technologies</h4>
                        <div class="modal-tech-tags">
                            ${techPills}
                        </div>
                    </div>

                    <!-- Liens -->
                    <div class="sidebar-box">
                        <h4><i class="fas fa-link"></i> Liens</h4>
                        <div class="modal-action-buttons">
                            ${demoBtn || '<span style="color:#64748b;font-size:0.82rem;">Projet privé — démo non disponible</span>'}
                        </div>
                    </div>

                    <!-- Infos -->
                    <div class="sidebar-box">
                        <h4><i class="fas fa-info-circle"></i> Infos</h4>
                        <div class="info-row"><span class="info-label">Catégorie</span><span class="info-val">${data.infos.categorie}</span></div>
                        <div class="info-row"><span class="info-label">Année</span><span class="info-val">${data.infos.annee}</span></div>
                        <div class="info-row"><span class="info-label">Fonctionnalités</span><span class="info-val">${data.infos.fonctionnalites}</span></div>
                        <div class="info-row"><span class="info-label">Photos</span><span class="info-val">${data.infos.photos}</span></div>
                    </div>
                </div>
            </div>
        `;
    };

    // Ouvrir la modale
    const openProjectModal = (projectId) => {
        const data = projectsData[projectId];
        if (!data) return;

        modalDynamicBody.innerHTML = buildModalContent(data);
        projectModal.classList.add('active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Ajouter les listeners lightbox aux images de la galerie
        modalDynamicBody.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', () => {
                const src = item.getAttribute('data-lightbox-src');
                const caption = item.getAttribute('data-lightbox-caption');
                openLightbox(src, caption);
            });
        });
    };

    // Fermer la modale
    const closeProjectModal = () => {
        projectModal.classList.remove('active');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    };

    // Lightbox
    const openLightbox = (src, caption) => {
        lightboxImg.src = src;
        lightboxCaption.textContent = caption || '';
        lightboxModal.classList.add('active');
        lightboxModal.setAttribute('aria-hidden', 'false');
    };

    const closeLightbox = () => {
        lightboxModal.classList.remove('active');
        lightboxModal.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
    };

    // Event listeners pour les cartes de projet
    document.querySelectorAll('.compact-card').forEach(card => {
        card.addEventListener('click', (e) => {
            // Ne pas ouvrir si on a cliqué sur un lien externe
            if (e.target.closest('a[href]')) return;
            const projectId = card.getAttribute('data-project-id');
            openProjectModal(projectId);
        });
    });

    // Fermeture de la modale
    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeProjectModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeProjectModal);

    // Fermeture de la lightbox
    if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
    if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);

    // Fermeture via Échap
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (lightboxModal && lightboxModal.classList.contains('active')) {
                closeLightbox();
            } else if (projectModal && projectModal.classList.contains('active')) {
                closeProjectModal();
            }
        }
    });

    // ==========================================================================
    // 13. BOUTON VOIR PLUS / MOINS DE PROJETS (VoteNow & Projets additionnels)
    // ==========================================================================
    const toggleProjectsBtn = document.getElementById('btn-toggle-projects');
    const extraProjects = document.querySelectorAll('.extra-project');

    if (toggleProjectsBtn && extraProjects.length > 0) {
        toggleProjectsBtn.addEventListener('click', () => {
            const isExpanded = toggleProjectsBtn.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                // Masquer les projets supplémentaires
                extraProjects.forEach(card => {
                    card.classList.remove('active');
                });
                toggleProjectsBtn.setAttribute('aria-expanded', 'false');
                toggleProjectsBtn.innerHTML = '<i class="fas fa-plus-circle"></i> <span>Voir plus de projets</span>';
                
                // Défilement doux vers la section réalisations
                const realisationsSection = document.getElementById('realisations');
                if (realisationsSection) {
                    realisationsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                // Afficher les projets supplémentaires avec animation
                extraProjects.forEach(card => {
                    card.classList.add('active');
                    card.classList.add('animate');
                });
                toggleProjectsBtn.setAttribute('aria-expanded', 'true');
                toggleProjectsBtn.innerHTML = '<i class="fas fa-minus-circle"></i> <span>Afficher moins</span>';
            }
        });
    }

});