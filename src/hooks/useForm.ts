import { useState, ChangeEvent } from 'react';

type FormFields = {
  [key: string]: any;
};

export const useForm = <T extends FormFields>(initialValues: T) => {
  const [formData, setFormData] = useState<T>(initialValues);

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
      | { target: { name: string; value: any; type?: string } }
  ) => {
    const { name, type = 'text', value, checked, files } = e.target as any;

    let newValue: any;

    if (type === 'checkbox') {
      newValue = checked;
    } else if (type === 'file') {
      newValue = files?.[0] ?? null;
    } else if (type === 'radio') {
      // convertit "true"/"false" (string) en boolean
      newValue = value === 'true';
    } else {
      newValue = value;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };


  const resetForm = () => setFormData(initialValues);

  const defaultForm = (newValues = initialValues) => {
    setFormData(newValues);
  };

  return {
    formData,
    handleChange,
    setFormData,
    resetForm,
    defaultForm,
  };
};
