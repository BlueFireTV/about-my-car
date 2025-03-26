import React, { FormEvent, useContext, useEffect, useRef, useState } from "react";
import "./rsiEdit.css";
import { useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import { motion } from "framer-motion";
import { setRegularServiceItem } from "../../api/cars.api";
import { FormWrapper } from "./Wrapper/FormWrapper";
import { RegularService } from "../../types/car";
import { RegularServiceDictionary, RegularServiceValues } from "../../types/regularServiceValues";
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation";
import { User } from "../../types/user";
import { AuthContext } from "../../context/AuthContext";

type RsiEditProps = {
  setShowForm: (value: boolean) => void;
  user: User;
};

interface serviceValuesSelectorProps {
  disabledValues: string[];
}

const RsiEdit: React.FC<RsiEditProps> = ({ setShowForm, user }) => {
  const queryClient = useQueryClient();
  const authContext = useContext(AuthContext);
  const car = user.car;
  const nextRegularservices = car.regularServiceItem;
  const serviceValues = Object.values(RegularServiceValues);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [negativeIdCounter, setNegativeIdCounter] = useState(-1); // Start from -1


  const [serviceValuesSelector, setServiceValuesSelector] = useState<serviceValuesSelectorProps>(() => ({
    enabledValues: Object.values(serviceValues).filter((value) => !nextRegularservices.some((rsi) => rsi.name === value)),
    disabledValues: nextRegularservices.map((rsi) => rsi.name)
  }));
  

  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const [regularServices, setregularService] = useState<RegularService[]>(nextRegularservices);

  const handleChange = (index: number, field: keyof RegularService, value: string | Date) => {
    if (field === "name") {
      const valueBefore = regularServices[index].name;
      const valueAfter = value as RegularServiceValues;
  
      if (valueBefore !== valueAfter) {
        // Update the state in a single batch
        setServiceValuesSelector((prev) => {
          const updatedDisabledValues = prev.disabledValues
            .filter((v) => v !== valueBefore) // Remove the previous value
            .concat(valueAfter); // Add the new value
  
          return { ...prev, disabledValues: updatedDisabledValues };
        });
      }
    }

    setregularService((prev) => {
      console.log("test", serviceValuesSelector);

      const updatedRegularServices = [...prev];

      if (field === "name") {
        const nameValue = value as RegularServiceValues;
        updatedRegularServices[index] = {
          ...updatedRegularServices[index],
          name: nameValue,
          interval: RegularServiceDictionary[nameValue],
        };
      } else {
        updatedRegularServices[index] = {
          ...updatedRegularServices[index],
          [field]: value,
        };
      }

      return updatedRegularServices;
    });
  };

  const addNewRegularService = () => {
    const regularServiceName: RegularServiceValues = serviceValues.filter((value) => !serviceValuesSelector.disabledValues.includes(value))[0] as RegularServiceValues;

    setregularService((prev) => [
      ...prev,
      {
      id: negativeIdCounter, // Ensure a unique negative ID
      name: regularServiceName,
      date: new Date(),
      interval: RegularServiceDictionary[regularServiceName],
      note: "",
      },
    ]);

    //remove serviceValuesSelector.enabledValues[0] add it to disabledValues
    setServiceValuesSelector({
      disabledValues: [...serviceValuesSelector.disabledValues, regularServiceName]
    });

    setNegativeIdCounter((prev) => prev - 1);
  };

  function deleteRegularService(index: number) {

    const regularServiceName = regularServices[index].name;

    //remove from disabledValues and add it to enabledValues
    setServiceValuesSelector({
      disabledValues: serviceValuesSelector.disabledValues.filter((value) => value !== regularServiceName)
    });
  
    setregularService((prev) => {
      // Verify index validity
      setShowDeleteConfirmation(false);
      if (index < 0 || index >= prev.length) {
        console.error("Invalid index:", index);
        return prev;
      }
      // Remove the specified element
      const updatedRegularServices = prev.filter((_, i) => i !== index);
      return updatedRegularServices;
    });
  }
  

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleUpdateRsiCar();
  };

  const handleUpdateRsiCar = async () => {
    await setRegularServiceItem(car.id, regularServices, authContext!.logout);
    
    queryClient.invalidateQueries({ queryKey: ["usercar", user.id], exact: true });

    setShowForm(false);
    dialogRef.current?.close();
  };

  useEffect(() => {
    if (dialogRef.current) {
      dialogRef.current.showModal();
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowForm(false);
        dialogRef.current?.close();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <dialog ref={dialogRef} className="change-rsi-dialog ">
      <form onSubmit={onSubmit}>
        <div className="dialog-content">
          <motion.button 
                      className="close-dialog-button" 
                      onClick={() => { setShowForm(false); dialogRef.current?.close(); }}
                      whileHover={{ scale: 1.1 }} 
                      whileTap={{ scale: 0.9 }}
                      aria-label="Dialog schließen">
            <X size={24} />
          </motion.button>
          
           <FormWrapper title="Regelmäßige Service-Elemente">
              <div className="rsi-edit-container">
                {regularServices.map((rsi: RegularService, index) => (
                  <div className="rsi-edit-entry" key={rsi.id ?? `temp-${index}`}>
                    <div className="rsi-edit-entry-item">
                      <label htmlFor={`date-${index}`}>Zuletzt gemacht:</label>
                      <input
                        id={`date-${index}`}
                        type="date"
                        className="date-input"
                        value={new Date(rsi.date).toISOString().split("T")[0]} // Bind to state
                        onChange={(e) => handleChange(index, "date", e.target.value)}
                      />
                    </div>
                    <div className="rsi-edit-entry-item">
                      <label htmlFor={`serviceSelect-${index}`}>Service:</label>
                      <select
                        id={`serviceSelect-${index}`}
                        value={rsi.name} // Bind to state
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                      >
                        {serviceValues.filter((value) => !serviceValuesSelector.disabledValues.includes(value)).map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                        {serviceValuesSelector.disabledValues.map((service) => (
                          <option key={service} value={service} disabled>
                            {service}
                            
                          </option>
                        ))}

                      </select>
                    </div>
                    <div className="rsi-edit-entry-item">
                      <label htmlFor={`interval-${index}`}>Intervall (Monate):</label>
                      <input
                        id={`interval-${index}`}
                        type="number"
                        min={1}
                        max={999}
                        value={rsi.interval} // Bind to state
                        onChange={(e) => handleChange(index, "interval", e.target.value)}
                      />
                    </div>
                    <button type="button" onClick={() => setShowDeleteConfirmation(true)}>
                      <X/>
                    </button>
                    {showDeleteConfirmation && (
                        <DeleteConfirmation
                            onConfirm={() => deleteRegularService(index)}
                            onCancel={() => setShowDeleteConfirmation(false)}
                            confirmationText="Regelmäßigen Service wirklich löschen?"
                        />
                    )}
                  </div>
                ))}
              </div>
           </FormWrapper>
        </div>
        <div className="rsi-dialog-footer">
        </div>
        <div className="rsi-dialog-buttons">
          {serviceValues.filter((value) => !serviceValuesSelector.disabledValues.includes(value)).length > 0 && (
            <button className="submit-action" type="button" onClick={() => addNewRegularService()}>
              <div className="add-action">
                <Plus/> <span>Regulären Service Eintrag hinzufügen</span>
              </div>
            </button>
          )}
          <button className="submit-action" type="submit">
            Aktualisieren
          </button>     
        </div>
      </form>
    </dialog>
  );
};

export default RsiEdit;
