<template>

    <body>
        <Header />

        <main>
            <div class="about-us-content">
                <div class="img-history-container">
                    <img src="../../public/carshub_logo.png" class="img-history-logo" alt="logo">
                </div>
                <div class="our-history">
                    <h1 class="title-history">Nuestra Historia</h1>
                    <div class="text-history">
                        En el corazón de Santa Cruz de Tenerife, España, nació una pequeña idea con grandes sueños.
                        Empezamos como un grupo
                        de entusiastas de los coches, compartiendo listas y comentarios en un pequeño blog. Con el
                        tiempo, nuestra pasión
                        nos impulsó a crear una plataforma dedicada a conectar amantes de los coches de todo el mundo.
                        Superamos desafíos financieros y técnicos, trabajando desde cafés locales y reuniones
                        improvisadas en garajes.
                        Hoy, nos enorgullece ser el lugar donde miles de personas pueden buscar coches, publicar sus
                        propias listas y
                        compartir sus opiniones en una comunidad vibrante y apasionada.
                    </div>
                </div>

                <div class="section">
                    <div class="text">
                        <h2>Néstor Rubén Delgado Feliciano</h2>
                        <p>Un líder organizado y meticuloso que supervisa todo el ciclo de desarrollo de software,
                            asegurándose de que el equipo siga las mejores prácticas y cumpla con los objetivos del
                            sprint. Su enfoque principal está en mantener la calidad del código en lo más alto,
                            promoviendo la colaboración, eliminando impedimentos y asegurando que el equipo entregue
                            soluciones sólidas y escalables.</p>
                    </div>
                    <div class="image-programer">
                        <img src="../../public/about-us/nestor.jpg" alt="programador 1">
                    </div>
                </div>

                <div class="section-reverse">
                    <div class="image-programer">
                        <img src="../../public/about-us/david.jpeg" alt="programador 2">
                    </div>
                    <div class="text">
                        <h2>Francisco David Hernández Alayón</h2>
                        <p>Un creativo apasionado por el diseño visual y la experiencia del usuario. Este perfil se
                            centra en construir interfaces atractivas, funcionales y fáciles de usar, priorizando la
                            coherencia estética y la usabilidad. Su trabajo asegura que los productos no solo sean
                            efectivos, sino también visualmente impactantes y alineados con las expectativas de los
                            usuarios.</p>
                    </div>
                </div>

                <div class="section">
                    <div class="text">
                        <h2>David Ezequiel Tolosa Cabalero</h2>
                        <p>Un profesional multifacético que puede saltar entre bases de datos, backend, frontend y
                            pruebas con facilidad. Este perfil es ideal para abordar emergencias técnicas, resolver
                            problemas críticos y garantizar que el sistema siga funcionando sin interrupciones. Su
                            adaptabilidad y capacidad para encontrar soluciones rápidas lo convierten en el salvavidas
                            del equipo en momentos de alta presión.</p>
                    </div>
                    <div class="image-programer">
                        <img src="../../public/about-us/david_e.jpeg" alt="programador 3">
                    </div>
                </div>
            </div>
        </main>

        <Footer />
    </body>
</template>


<script setup>
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
</script>


<style>
/** CONTENEDOR GLOBAL */
main {
    width: 100%;
    background-color: var(--color-primary1);

}

.about-us-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}


/** NUESTRA HISTORIA */
.img-history-container {
    /** Para que el padding no afecte al tamño total */
    box-sizing: border-box;
    margin-top: 100px;
    width: 100%;
    height: 100%;
    padding: 200px;

    display: flex;
    justify-content: center;
    align-items: center;

    background-color: var(--color-primary3);
}

.img-history-logo {
    width: 100%;
    max-width: 450px;
    height: auto;
    object-fit: cover;
    background-color: #181818;
    /* no usamos variable por el ligh teme */
    border-radius: 50%;
}

.our-history {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 200px;

    padding: 250px;
    box-sizing: border-box;
    background-color: var(--color-primary1);
}


.title-history {
    font-size: 75px;
    color: var(--color-secondary1);
    text-shadow: var(--shadow-primary1);
}

.text-history {
    width: 50%;
    font-size: 22px;
    line-height: 1.6;
    color: var(--color-terciary1);
}



/** SECCIONES SOBRE NOSOTROS */
.section {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;

    padding: 120px;
    box-sizing: border-box;
    /** Para que el padding no afecte al tamño total */
    width: 100%;
    background-color: var(--color-primary2);
}

.section-reverse {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;

    padding: 120px;
    box-sizing: border-box;
    /** Para que el padding no afecte al tamño total */
    width: 100%;
    background-color: var(--color-primary1)
}


.text {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    gap: 30px;
    padding: 20px;
}

.text h2 {
    font-size: 40px;
    color: var(--color-secondary1);
}

.text p {
    font-size: 20px;
    color: var(--color-terciary1);
}

.image-programer {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
}

.image-programer img {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    border: 5px solid var(--color-primary1);
    box-shadow: var(--shadow-primary1);
    object-fit: cover;
}




/** RESPONSIVDAD */
@media (max-width: 1580px) {
    .img-history-logo {
        max-width: 1000px;
    }

    .our-history h1 {
        font-size: 30px;
    }

    .our-history p {
        font-size: 9px;
    }
}


@media (max-width: 780px) {
    .our-history {
        padding: 10px;
        padding-top: 20px;
        padding-bottom: 20px;
        gap: 10px;
        flex-direction: column;
    }

    .img-history-container {
        padding: 10px;
    }

    .section {
        flex-direction: column;
        padding: 30px;
    }

    .section-reverse {
        flex-direction: column;
        padding: 30px;
    }

    .image-programer img {
        width: 200px;
        height: 200px;
    }
}
</style>