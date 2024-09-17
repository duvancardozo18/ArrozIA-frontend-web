import React, { useState } from 'react';

const useFormModal = (title, fields, validationCallback) => {
  const [isOpen, setIsOpen] = useState(false);  // Controla la visibilidad del modal
  const [formValues, setFormValues] = useState({});  // Almacena los valores del formulario

  const openFormModal = (defaultValues = {}) => {
    setFormValues(defaultValues);
    setIsOpen(true);  // Abre el modal
  };

  const closeModal = () => {
    setIsOpen(false);  // Cierra el modal
  };

  const handleChange = (id, value) => {
    setFormValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const error = validationCallback(formValues);
    if (error) {
      alert(error);  // Muestra el error si hay
      return;
    }

    const formData = new FormData();
    Object.keys(formValues).forEach((key) => {
      formData.append(key, formValues[key]);
    });

    closeModal();  // Cierra el modal después de la validación
    return formData;  // Retorna el FormData
  };

  const FormModal = () => (
    isOpen && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{title}</h2>
          {fields.map(({ id, placeholder, type = 'text' }) => (
            <div key={id}>
              <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={formValues[id] || ''}
                onChange={(e) => handleChange(id, e.target.value)}
              />
            </div>
          ))}
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={closeModal}>Close</button>
        </div>
      </div>
    )
  );

  return { openFormModal, FormModal };
};

export default useFormModal;
