document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    let allProducts = []; // Store all products for filtering

    // --- Helper Functions ---
    const fetchData = async (url) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Could not fetch ${url}:`, error);
            return null; // Return null or appropriate default
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
    };

    // --- Render Functions ---
    const renderSiteMeta = (siteData) => {
        if (!siteData) return;
        document.title = siteData.site_title || document.title;
        const descriptionMeta = document.querySelector("meta[name=\"description\"]");
        const keywordsMeta = document.querySelector("meta[name=\"keywords\"]");
        if (descriptionMeta) descriptionMeta.content = siteData.description || "";
        if (keywordsMeta) keywordsMeta.content = siteData.keywords || "";
        document.documentElement.lang = siteData.lang || "vi";
    };

    const renderHeader = (headerData) => {
        const header = document.getElementById("main-header");
        if (!header || !headerData) return;

        let logoHtml = "";
        if (headerData.logo.type === "image" && headerData.logo.image_url) {
            logoHtml = `<a href="${headerData.logo.link || "index.html"}"><img src="${headerData.logo.image_url}" alt="${headerData.logo.alt_text}"></a>`;
        } else {
            logoHtml = `<a href="${headerData.logo.link || "index.html"}">${headerData.logo.text || "Logo"}</a>`;
        }

        let navHtml = "";
        if (headerData.navigation && headerData.navigation.length > 0) {
            navHtml = headerData.navigation.map(item => `
                <li><a href="${item.link}" class="${currentPage === item.link ? "active" : ""}">${item.label}</a></li>
            `).join("");
        }

        header.innerHTML = `
            <div class="container header-container">
                <div class="logo">${logoHtml}</div>
                <nav class="main-nav">
                    <button class="mobile-menu-toggle" aria-label="Toggle menu"><i class="fas fa-bars"></i></button>
                    <ul id="main-menu">
                        ${navHtml}
                    </ul>
                </nav>
            </div>
        `;
        addMobileMenuToggle();
    };

    const renderFooter = (footerData) => {
        const footer = document.getElementById("main-footer");
        if (!footer || !footerData) return;

        let contactHtml = "";
        if (footerData.contact_info) {
            contactHtml = `
                <h4>Thông tin liên hệ</h4>
                ${footerData.contact_info.address ? `<p><i class="fas fa-map-marker-alt"></i> ${footerData.contact_info.address}</p>` : ""}
                ${footerData.contact_info.phone ? `<p><i class="fas fa-phone-alt"></i> <a href="tel:${footerData.contact_info.phone.replace(/\s/g, "")}">${footerData.contact_info.phone}</a></p>` : ""}
                ${footerData.contact_info.email ? `<p><i class="fas fa-envelope"></i> <a href="mailto:${footerData.contact_info.email}">${footerData.contact_info.email}</a></p>` : ""}
            `;
        }

        let socialHtml = "";
        if (footerData.social_media && footerData.social_media.length > 0) {
            const links = footerData.social_media.map(item => `
                <a href="${item.link}" target="_blank" rel="noopener noreferrer" aria-label="${item.name}"><i class="${item.icon_class}"></i></a>
            `).join("");
            socialHtml = `
                <h4>Kết nối với chúng tôi</h4>
                <div class="social-media-links">${links}</div>
            `;
        }

        let policiesHtml = "";
        if (footerData.policies && footerData.policies.length > 0) {
            const links = footerData.policies.map(item => `<li><a href="${item.link}">${item.label}</a></li>`).join("");
            policiesHtml = `
                <h4>Chính sách</h4>
                <ul>${links}</ul>
            `;
        }

        footer.innerHTML = `
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-section">${contactHtml}</div>
                    <div class="footer-section">${policiesHtml}</div>
                    <div class="footer-section">${socialHtml}</div>
                </div>
                <div class="footer-bottom">
                    <p>${footerData.copyright_text || ""}</p>
                </div>
            </div>
        `;
    };

    const renderProductCard = (product) => {
        return `
            <div class="product-card" data-id="${product.id}" data-category="${product.category}">
                <img src="${product.image || "images/placeholder.png"}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="description">${product.description.substring(0, 100)}${product.description.length > 100 ? "..." : ""}</p>
                    <p class="price">${formatPrice(product.price)}</p>
                    <button class="cta-button view-details-btn">Xem chi tiết</button>
                </div>
            </div>
        `;
    };

    const renderProductList = (products, containerId) => {
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = products.map(renderProductCard).join("");
        addProductModalListeners(); // Add listeners after rendering cards
    };

    const renderFeaturedSlider = (products) => {
        const sliderContainer = document.querySelector("#hero-slider .slider-container");
        if (!sliderContainer) return;
        const featuredProducts = products.filter(p => p.is_featured);
        sliderContainer.innerHTML = featuredProducts.map(renderProductCard).join("");
        addProductModalListeners();
    };

    const renderNewestProducts = (products) => {
        const container = document.getElementById("new-products-container");
        if (!container) return;
        const newestProducts = products.filter(p => p.is_new).slice(0, 4); // Limit to 4 newest
        container.innerHTML = newestProducts.map(renderProductCard).join("");
        addProductModalListeners();
    };

    const renderCategoryFilters = (products) => {
        const filtersContainer = document.getElementById("category-filters");
        if (!filtersContainer) return;
        const categories = ["Tất cả", ...new Set(products.map(p => p.category))];
        filtersContainer.innerHTML = categories.map(category => `
            <button class="filter-btn ${category === "Tất cả" ? "active" : ""}" data-filter="${category === "Tất cả" ? "all" : category}">
                ${category}
            </button>
        `).join("");
        addCategoryFilterListeners();
    };

    const renderAboutPage = (aboutData) => {
        const titleElement = document.getElementById("about-page-title");
        const container = document.getElementById("about-sections-container");
        if (!titleElement || !container || !aboutData) return;

        titleElement.textContent = aboutData.page_title || "Giới thiệu";
        document.title = aboutData.page_title ? `${aboutData.page_title} - ${document.title.split(" - ")[1]}` : document.title;

        container.innerHTML = aboutData.sections.map(section => {
            if (section.type === "intro") {
                return `
                    <section class="about-section about-intro">
                        <h3>${section.title}</h3>
                        <div class="about-grid">
                            <div>${section.content.map(p => `<p>${p}</p>`).join("")}</div>
                            ${section.image_url ? `<img src="${section.image_url}" alt="${section.image_alt || section.title}">` : ""}
                        </div>
                    </section>
                `;
            } else if (section.type === "mission_vision") {
                return `
                    <section class="about-section mission-vision">
                        <div class="mission-vision-grid">
                            ${section.mission ? `<div><h4>${section.mission.title}</h4><p>${section.mission.text}</p></div>` : ""}
                            ${section.vision ? `<div><h4>${section.vision.title}</h4><p>${section.vision.text}</p></div>` : ""}
                        </div>
                    </section>
                `;
            } else if (section.type === "team") {
                return `
                    <section class="about-section about-team">
                         <h3>${section.title}</h3>
                         <div class="about-grid">
                             <div><p>${section.content}</p></div>
                             ${section.image_url ? `<img src="${section.image_url}" alt="${section.image_alt || section.title}">` : ""}
                         </div>
                    </section>
                `;
            }
            return "";
        }).join("");
    };

    const renderContactPage = (contactData) => {
        const pageTitle = document.getElementById("contact-page-title");
        const infoContainer = document.getElementById("contact-info-container");
        const formContainer = document.getElementById("contact-form-container");
        const mapContainer = document.getElementById("google-map-container");

        if (!pageTitle || !infoContainer || !formContainer || !mapContainer || !contactData) return;

        pageTitle.textContent = contactData.page_title || "Liên hệ";
        document.title = contactData.page_title ? `${contactData.page_title} - ${document.title.split(" - ")[1]}` : document.title;

        // Render Contact Info
        if (contactData.contact_info) {
            const info = contactData.contact_info;
            document.getElementById("contact-info-title").textContent = info.title || "Thông Tin Liên Hệ";
            infoContainer.innerHTML += `
                ${info.address ? `<p><i class="${info.address.icon_class}"></i> ${info.address.value}</p>` : ""}
                ${info.phone ? `<p><i class="${info.phone.icon_class}"></i> <a href="${info.phone.link}">${info.phone.value}</a></p>` : ""}
                ${info.email ? `<p><i class="${info.email.icon_class}"></i> <a href="${info.email.link}">${info.email.value}</a></p>` : ""}
                ${info.working_hours ? `<p><i class="${info.working_hours.icon_class}"></i> ${info.working_hours.value}</p>` : ""}
            `;
        }

        // Render Contact Form Info
        if (contactData.contact_form) {
            document.getElementById("contact-form-title").textContent = contactData.contact_form.title || "Gửi Yêu Cầu";
            document.getElementById("contact-submit-button").textContent = contactData.contact_form.submit_button_text || "Gửi";
            const formElement = document.getElementById("contact-form-element");
            if (formElement) formElement.action = contactData.contact_form.action_url || "#";
        }

        // Render Google Map
        if (contactData.google_map_iframe_src) {
            mapContainer.innerHTML = `<iframe src="${contactData.google_map_iframe_src}" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
        }
    };

    const renderHomeAbout = (aboutData) => {
        const titleEl = document.getElementById("home-about-title");
        const contentEl = document.getElementById("home-about-content");
        if (!titleEl || !contentEl || !aboutData || !aboutData.sections) return;

        const introSection = aboutData.sections.find(s => s.type === "intro");
        if (introSection) {
            titleEl.textContent = introSection.title || "Về Chúng Tôi";
            contentEl.innerHTML = `
                 <div>${introSection.content.map(p => `<p>${p}</p>`).join("")}</div>
                 ${introSection.image_url ? `<img src="${introSection.image_url}" alt="${introSection.image_alt || introSection.title}">` : ""}
                 <div class="view-all-link" style="grid-column: 1 / -1; text-align: center; margin-top: 1rem;">
                    <a href="about.html" class="cta-button">Xem thêm về chúng tôi</a>
                 </div>
            `;
        }
    };

    // --- Event Listeners & Logic ---
    const addMobileMenuToggle = () => {
        const toggleButton = document.querySelector(".mobile-menu-toggle");
        const mainMenu = document.getElementById("main-menu");
        if (toggleButton && mainMenu) {
            toggleButton.addEventListener("click", () => {
                mainMenu.classList.toggle("active");
            });
        }
    };

    const openModal = (product) => {
        const modal = document.getElementById("product-modal");
        const modalDetails = document.getElementById("modal-product-details");
        if (!modal || !modalDetails || !product) return;

        modalDetails.innerHTML = `
            <img src="${product.image || "images/placeholder.png"}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${formatPrice(product.price)}</p>
            <p class="description">${product.description}</p>
            ${product.features && product.features.length > 0 ? 
                `<h4>Đặc điểm nổi bật:</h4>
                 <ul class="features-list">
                     ${product.features.map(f => `<li>${f}</li>`).join("")}
                 </ul>` : ""}
        `;
        modal.style.display = "block";
    };

    const closeModal = () => {
        const modal = document.getElementById("product-modal");
        if (modal) modal.style.display = "none";
    };

    const addProductModalListeners = () => {
        const detailButtons = document.querySelectorAll(".view-details-btn");
        const modal = document.getElementById("product-modal");
        const closeButton = document.querySelector(".close-button");

        detailButtons.forEach(button => {
            button.addEventListener("click", (e) => {
                const card = e.target.closest(".product-card");
                const productId = card.dataset.id;
                const product = allProducts.find(p => p.id === productId);
                if (product) {
                    openModal(product);
                }
            });
        });

        if (closeButton) {
            closeButton.addEventListener("click", closeModal);
        }

        if (modal) {
            window.addEventListener("click", (event) => {
                if (event.target === modal) {
                    closeModal();
                }
            });
        }
    };

    const filterProducts = (filter) => {
        const productCards = document.querySelectorAll("#product-list-container .product-card");
        productCards.forEach(card => {
            if (filter === "all" || card.dataset.category === filter) {
                card.classList.remove("hide");
            } else {
                card.classList.add("hide");
            }
        });
    };

    const addCategoryFilterListeners = () => {
        const filterButtons = document.querySelectorAll(".filter-btn");
        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                const filterValue = button.dataset.filter;
                filterProducts(filterValue);
            });
        });
    };

    // --- Initialization ---
    const initializePage = async () => {
        const [siteData, headerData, footerData, productsData] = await Promise.all([
            fetchData("./data/site.json"),
            fetchData("./data/header.json"),
            fetchData("./data/footer.json"),
            fetchData("./data/products.json")
        ]);

        renderSiteMeta(siteData);
        renderHeader(headerData);
        renderFooter(footerData);

        if (productsData && productsData.products) {
            allProducts = productsData.products;
        }

        if (currentPage === "index.html") {
            const aboutData = await fetchData("./data/about.json");
            renderFeaturedSlider(allProducts);
            renderHomeAbout(aboutData);
            renderNewestProducts(allProducts);
        } else if (currentPage === "products.html") {
            renderCategoryFilters(allProducts);
            renderProductList(allProducts, "product-list-container");
        } else if (currentPage === "about.html") {
            const aboutData = await fetchData("./data/about.json");
            renderAboutPage(aboutData);
        } else if (currentPage === "contact.html") {
            const contactData = await fetchData("./data/contact.json");
            renderContactPage(contactData);
        }
    };

    initializePage();
});
