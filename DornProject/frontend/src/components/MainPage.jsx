import React, { useState, useEffect } from 'react';
import '../styles/MainPage.css'; // Archivo de estilos
import heroImage1 from '../styles/images/drone1.png';
import heroImage2 from '../styles/images/drone2.png';
import heroImage3 from '../styles/images/robot1.png';

const MainPage = () => {
  const backgrounds = [
    { image: heroImage1, title: "Innovación en Drones", text: "Lideramos el futuro con tecnología avanzada en drones para múltiples aplicaciones." },
    { image: heroImage2, title: "Automatización Industrial", text: "Optimizamos procesos con soluciones robóticas personalizadas." },
    { image: heroImage3, title: "Seguridad y Logística", text: "Tecnología avanzada para garantizar eficiencia y seguridad en cada operación." }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % backgrounds.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgrounds.length]);

  return (
    <div>
      {/* Menú de navegación principal */}
      <nav className="main-nav">
        <ul>
          <li><a href="./login">Empezar</a></li>
          <li><a href="#tecnologia">Tecnología</a></li>
          <li><a href="#noticias">Noticias</a></li>
          <li><a href="#faq">Preguntas Frecuentes</a></li>
          <li><a href="contacto.html">Contacto</a></li>
          <li><a href="#" className="search-icon" title="buscar"><i className="fas fa-search"></i></a></li>
        </ul>
      </nav>
      

      {/* Sección Hero */}
      <section
        className="hero-section"
        style={{ backgroundImage: `url(${backgrounds[currentSlide].image})` }}
      >
        <div className="overlay">
          <h1>{backgrounds[currentSlide].title}</h1>
          <p>{backgrounds[currentSlide].text}</p>
        </div>
      </section>

      {/* Sección de bienvenida */}
      <div className="welcome-section">
        <div className="welcome-text">
          <h1>¡Bienvenidos a la era de la automatización!</h1>
          <p>
            Este sistema centraliza el uso de drones y robots en el campus, 
            optimizando el transporte interno, la grabación de eventos y la 
            exploración de prototipos en escenarios desafiantes.
          </p>
          <p>
            Diseñado para estudiantes, docentes e investigadores, buscamos 
            impulsar la innovación tecnológica y el aprendizaje práctico 
            en la comunidad académica.
          </p>
          <p>
            ¡Gracias por formar parte de este emocionante proyecto! 
          </p>
        </div>
        
      </div>
      <div className="map-container">
  <h2 className="map-title">Nuestra Ubicación</h2>
  <p className="map-description">
    Estamos ubicados en la Pontificia Universidad Javeriana Cali, facilitando acceso fácil a estudiantes, docentes e investigadores.
  </p>
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3983.0057200189335!2d-76.53420342376403!3d3.348723896626016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a1938af71d63%3A0x636fe0863cf7e12!2sPontificia%20Universidad%20Javeriana%20Cali!5e0!3m2!1ses!2sco!4v1731811158882!5m2!1ses!2sco"
    width="100%"
    height="450"
    style={{ border: "0" }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Mapa de la Pontificia Universidad Javeriana Cali"
  ></iframe>
</div>

      <footer className="footer-bar">
  <div className="footer-content">
    <p>
      ¿Interesado en llevar la tecnología a nuevos límites? 
      <strong> Publicidad y patrocinio </strong> están disponibles para colaborar en este emocionante proyecto.
    </p>
    <p>
      Contáctanos al: <a href="mailto:contacto@dronesrobots.com">contacto@dronesrobots.com</a>
    </p>
  </div>
</footer>

    </div>
  );
};

export default MainPage;
