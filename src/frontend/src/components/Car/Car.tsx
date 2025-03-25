import React, { useContext } from "react";
import Header from "../General/Header.tsx";
import Spinner from "../Spinner/Spinner.tsx";
import "./Car.css";
import { CarIcon, Wrench, FileText, StickyNote,Database} from "lucide-react";
import { useGetCarByUser } from "../../Data/carData.ts";
import { AuthContext } from "../../context/AuthContext.tsx";



const CarDetail: React.FC = () => {
    const authContext = useContext(AuthContext);
    if(!authContext?.user) {
        return <Spinner />;
    }
    const userId = authContext.user.id;

    const { data: car, isLoading: carLoading, error: carError} = useGetCarByUser(userId!, authContext!.logout);
    if (carLoading) {
    
        return <Spinner />;
    }

    if (carError) {
        return <div>Fehler beim Laden der Autodetails</div>;
    }

    if (!car) {
        return <div>Auto nicht gefunden</div>;
    }

    return (
        <div>
            <Header /> 
            <div className="page-container">
                <div className="car-details-container">
                <section className="car-info">
                    <div className="car-info-left">
                        <div className="info-header">
                            <h2>
                                <CarIcon className="icon" /> {car.brand} {car.model}
                            </h2>
                        </div>
                        <div className="info-section">
                            <h3>
                                <Database className="icon" /> Daten
                            </h3>
                            <div className="info-grid">
                                <span className="label">Model Jahr:</span>
                                <span>{car.modelYear}</span>
                                <span className="label">Erstzulassung:</span>
                                <span>  {new Date(car.initialApproval).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="info-section">
                            <h3>
                                <Wrench className="icon" /> Antrieb
                            </h3>
                            <div className="info-grid">
                                <span className="label">Motorcodes:</span>
                                <span>{car.enginecode}</span>
                                <span className="label">Getriebecode:</span>
                                <span>{car.transmissioncode}</span>
                            </div>
                        </div>

                        <div className="info-section">
                            <h3>
                                <FileText className="icon" /> Identifikation
                            </h3>
                            <div className="info-grid">
                                <span className="label">VIN:</span>
                                <span>{car.vin}</span>
                                <span className="label">HSN:</span>
                                <span>{car.hsn}</span>
                                <span className="label">TSN:</span>
                                <span>{car.tsn}</span>
                                <span className="label">Kennzeichen:</span>
                                <span>{car.platenumber}</span>
                            </div>
                        </div>
                    </div>

                    <div className="car-info-right">
                        <div className="car-notes-section">
                            <h3>
                                <StickyNote className="icon" /> Notiz
                            </h3>
                            <textarea
                                    value={car.note || ''}
                                    readOnly
                                    className="car-notes-textarea"
                                />
                        </div>
                    </div>
                </section>
                <section className="regular-service-items">
                    <div className="regular-service-header">
                        <h2>Regelmäßige Service-Elemente</h2>
                    </div>
                    {car.regularServiceItem.length > 0 ? (
                    <div className="tableContainer">
                        <table>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Datum</th>
                                    <th>Intervall</th>
                                    <th>Fällig</th>
                                </tr>
                            </thead>
                            <tbody>
                            {car.regularServiceItem.map((item) => {
                                    const dueDate = new Date(new Date(item.date).setMonth(new Date(item.date).getMonth() + item.interval));
                                    const isDueSoon = (dueDate.getTime() - new Date().getTime()) <= 30 * 24 * 60 * 60 * 1000; // 1 month in milliseconds

                                    return (
                                    <tr key={item.id} className={isDueSoon ? "due-soon" : ""}>
                                        <td>{item.name}</td>
                                        <td>{item.date.toString().split("T")[0]}</td>
                                        <td>{item.interval}</td>
                                        <td>{dueDate.toISOString().split("T")[0]}</td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        </div>
                    ) : (
                    <p className="empty-service">Keine regelmäßigen Service-Elemente gefunden</p>
                    )}
                </section>
            </div>
        </div>
    </div>
    );
};

export default CarDetail;
