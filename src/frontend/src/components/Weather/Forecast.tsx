import React from "react";
import "./Forecast.css";
import { useGetWeatherForecast } from "../../Data/weatherData";
import Spinner from "../Spinner/Spinner";
import { Forecast } from "../../types/weatherTypes";
import { Check, CloudLightning, X, Zap } from "lucide-react";


const ForecastComponent: React.FC = () => {
    const { data: forecast, isLoading: forecastLoading, error: forecastError} = useGetWeatherForecast();

    if (forecastLoading) {
        return <Spinner />;
    }

    if (forecastError || !forecast) {
        return (<section className="home-info">
            <div className="info-header">
            <h2>Wettervorhersage</h2>
            </div>
            <div className="info-section">    
                <h3>Lohnt sich Autowaschen?</h3>

                <div className="weather-result"><p><Zap/> Keine Wetterdaten gefunden.</p></div>
            </div>
            <div className="info-section">    
            <h3>Sollte man mit Winterreifen fahren?</h3>
            
                <div className="weather-result"><p><Zap/> Keine Wetterdaten gefunden.</p></div>
            </div>
        </section>);
    }


    const shouldIWash = (forecast:Forecast): boolean => {
        const days: { [key: string]: number } = {};

        for (let i = 0; i < forecast.time.length; i++) {
            const date = new Date(forecast.time[i]).toISOString().split("T")[0];
            if (!days[date]) {
            days[date] = 0;
            }
            days[date] += forecast.precipitation[i];
        }


        const dates = Object.keys(days).sort((a, b) => a.localeCompare(b)).slice(0, 3);
        for (const date of dates) {
            if (days[date] > 0) {
            return true;
            }
        }
        return false;
    }

    const overEight = (forecast:Forecast): boolean => {
        const days: { [key: string]: number } = {};

        for (let i = 0; i < forecast.time.length; i++) {
            const date = new Date(forecast.time[i]).toISOString().split("T")[0];
            if (!(date in days)) {
                days[date] = forecast.temperature2m[i];
            } else {
                days[date] = Math.min(days[date], forecast.temperature2m[i]);
            }
        }

        // Wenn an einem Tag die Temperatur unter 8 fällt, dann false
        for (const minTemp of Object.values(days)) {
            if (minTemp < 8) {
                return false;
            }
        }

        return true;
    }

    return (
        <section className="home-info">
            <div className="info-header">
            <h2>Wettervorhersage</h2>
            </div>
            <div className="info-section">    
                <h3>Lohnt sich Autowaschen?</h3>

                {shouldIWash(forecast ) ?
                ( 
                    <div className="weather-result"><p><X /> Nein, es wird regnen</p></div>
                ):( 
                    <div className="weather-result"><p><Check/> Ja, es regnet die nächten drei Tage nicht</p></div>
                )}
            </div>
            <div className="info-section">    
            <h3>Sollte man mit Winterreifen fahren?</h3>
            
                {overEight(forecast) ? 
                (<div className="weather-result"><p><Check/> Nein, es wird über 8 Grad</p></div>

                ): (
                <div className="weather-result"><p><CloudLightning/> Ja, es wird die nächsten 16 Tage unter 8 Grad</p></div>
                )}
            </div>
        </section>
    );
};

export default ForecastComponent;
