<template>
    <footer>
        <div class="footer-content">
            <div class="footer-section">
                <h3>Acerca de Nosotros</h3>
                <router-link to="/about-us" class="about-us-link">¿quiénes somos?</router-link>
            </div>

            <div class="footer-section">
                <h3>Información adicional</h3>
                <ul>
                    <li><a href="https://github.com/SyTW2425/Proyecto-E12.git" target="_blank">GitHub</a></li>
                    <li><a href="https://github.com/SyTW2425/Proyecto-E12.git">Contacto</a></li>
                    <li><a href="https://github.com/SyTW2425/Proyecto-E12.git">Blog</a></li>
                    <li><a href="https://github.com/SyTW2425/Proyecto-E12.git">Términos de Servicio</a></li>
                    <li><a href="https://github.com/SyTW2425/Proyecto-E12.git">Política de Privacidad</a></li>
                </ul>
            </div>

            <div class="footer-section">
                <h3>Contacto</h3>
                <ul>
                    <li>
                        <p>Email: carshub@gmail.com</p>
                    </li>
                    <li>
                        <p>Teléfono: +996 458 183</p>
                    </li>
                </ul>
            </div>
        </div>

        <div class="divider-line"></div>

        <div class="social-media">
            <a href="https://facebook.com" target="_blank" class="social-link">
                <img alt="Facebook"
                    src="https://cdn.ferrari.com/cms/network/media/img/resize/5ca483b65d32fb0b9e2ac5a3-facebook?"
                    class="social-img">
                <i class="fab fa-facebook"></i> FACEBOOK
            </a>

            <a href="https://instagram.com" target="_blank" class="social-link">
                <img alt="Instagram"
                    src="https://cdn.ferrari.com/cms/network/media/img/resize/5ca4860a5d32fb0b9e2ac5a8-instagram?"
                    class="social-img">
                <i class="fab fa-instagram"></i> INSTAGRAM
            </a>

            <a href="https://linkedin.com" target="_blank" class="social-link">
                <img alt="Linkedin"
                    src="https://cdn.ferrari.com/cms/network/media/img/resize/5ca487ee5d32fb0b9e2ac5ad-linkedin?"
                    class="social-img">
                <i class="fab fa-linkedin"></i> LINKEDIN
            </a>

            <a href="https://tiktok.com" target="_blank" class="social-link">
                <img alt="TikTok"
                    src="https://cdn.ferrari.com/cms/network/media/img/resize/628cd2388a4b79293d7c99ff-tiktok?"
                    class="social-img">
                <i class="fab fa-tiktok"></i> TIKTOK
            </a>

            <a href="https://youtube.com" target="_blank" class="social-link">
                <img alt="YouTube"
                    src="https://cdn.ferrari.com/cms/network/media/img/resize/5ca487bf5d32fb0b9e2ac5ac-youtube?"
                    class="social-img">
                <i class="fab fa-youtube"></i> YOUTUBE
            </a>
        </div>

        <div class="divider-line"></div>

        <div class="legal-text">
            <p>
                CarsHub N.V. - Empresa registrada bajo las leyes de España. Dirección:
                Calle Vuelta los Pájaros 453, Tenerife, Islas Canarias. Número de registro 725656389.
            </p>
            <p>
                CarsHub S.A. - Subsidiaria en Tenerife. Dirección: Calle Vuelta los Pájaros 453, Santa Cruz de Tenerife,
                Islas Canarias. Número de IVA ES987654321.
            </p>
            <p>&copy; 2024 CarsHub. Todos los derechos reservados.</p>
        </div>

    </footer>
</template>

<script>
export default {
    name: "Footer",
    methods: {
        toggleTheme() {
            // Alternar la clase light-theme en el elemento raíz (document.documentElement)
            document.documentElement.classList.toggle('light-theme');
        },
    },
};
</script>

<style>
/** FOOTER COMPLETO */
footer {
    display: flex;
    flex-direction: column;
    text-align: center;
    align-items: center;
    justify-content: center;
    width: 100%;

    background-color: var(--color-primary3);
    color: var(--color-terciary1);
    padding: 50px 0;
    padding-top: 80px;

    position: relative;
    z-index: 5;

}

/** LINEA DIVISORIA */
.divider-line {
    margin: 70px 0;
    /** MIDE LA DISTANCIA ESTREN LAS TRES SECCIONES */

    width: 50%;
    height: 1px;
    text-align: center;
    background-color: VAR(--color-primary1);
    box-shadow: var(--shadow-primary1);
}


/** LINKS PRINCIPALES */
.footer-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    margin: 0 auto;
    background-color: var(--color-primary3);
}

.about-us-link {
    text-decoration: none;
    color: var(--color-terciary1);
    font-size: 12px;
}

.about-us-link:hover {
    text-decoration: underline;
}

.footer-section {
    margin: 10px;
    flex: 1;
    min-width: 200px;
    background: none;
    box-shadow: none;
}

.footer-section h3 {
    margin-bottom: 15px;
    font-size: 16px;
}

.footer-section ul {
    list-style: none;
    padding: 0;
}

.footer-section ul li {
    margin: 5px 0;
    font-size: 12px;
}

.footer-section ul li a {
    color: var(--color-terciary1);
    text-decoration: none;
    transition: color 0.3s ease;
}

.footer-section ul li a:hover {
    color: var(--color-terciary1);
    text-decoration: underline;
}


/** REDES SOCIALES */
.social-media {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 60px;
}

.social-link {
    display: flex;
    align-items: center;
    gap: 5px;

    font-size: 12px;
    color: var(--color-terciary1);
    font-weight: bold;
    text-decoration: none;
    transition: color 0.3s;
}

.social-link:hover {
    color: var(--color-secondary1);
}


.social-img {
    width: 100%;
    height: 100%;
}


/** TEXTO LEGAL */
.legal-text {
    font-size: 10px;

}

.legal-text p {
    margin: 5px 0;
    color: var(--color-primary4)
}

</style>