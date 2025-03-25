import React from "react";
import "./Home.css";
import Header from "../General/Header";

const Home: React.FC = () => {

    return (
        <div>
            <Header />
            <div className="page-container">
                <div className="row">
                    <div className="col-12">
                        <h1>Willkommen</h1>
                        <p>Willkommen auf unserer
                            Webseite. Hier finden Sie
                            Informationen zu unseren
                            Produkten und Dienstleistungen.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
