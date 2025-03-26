import React from "react";
import "./Home.css";
import Header from "../General/Header";
import ForecastComponent from "../Weather/Forecast";


const Home: React.FC = () => {
    return (
        <div>
            <Header />
            <div className="page-container">
                <div className="home-details-container">
                    <section className="home-info">
                        <div className="info-header">
                            <h2>Willkommen auf AboutMyCar</h2>
                        </div>
                        <div className="info-section">    

                            <h3>Öffentliche Feature:</h3>
                            <ul className="feature-list">
                                <li>Empfehlung zum Autowaschen</li>
                                <li>Empfehlung für Winterreifen</li>
                            </ul>
                        
                        </div>
                        <div className="info-section">

                            <h3>Login Features:</h3>
                            <ul className="feature-list">
                                <li>Sehe alle Infos zu deinem Auto</li>
                                <li>Verwalte deine Services</li>
                            </ul>

                        </div>
                        <div className="info-section">

                            <p>Logg dich ein, um die Services von deinem Auto zu verwalten.
                            </p>

                        </div>
                    </section>
                    <ForecastComponent />
                </div>
            </div>
        </div>
    );
};

export default Home;
