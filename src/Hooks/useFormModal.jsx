import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const useFormModal = (title, fields, validationCallback) => {
  const openFormModal = async (defaultValues = {}) => {
    const htmlFields = fields.map(({ id, placeholder, type = 'text' }) => {
      return `
        <input id="${id}" class="swal2-input" placeholder="${placeholder}" 
               value="${defaultValues[id] || ''}" type="${type}">
      `;
    }).join('');

    const { value: formValues } = await MySwal.fire({
      title: title,
      html: htmlFields,
      focusConfirm: false,
      preConfirm: () => {
        const values = fields.reduce((acc, field) => {
          const value = document.getElementById(field.id).value;
          acc[field.id] = field.type === 'number' ? parseFloat(value) || null : value;
          return acc;
        }, {});

        const error = validationCallback(values);
        if (error) {
          Swal.showValidationMessage(error);
          return null;
        }
        return values;
      }
    });

    return formValues;
  };

  return { openFormModal };
};

export default useFormModal;
