import { useForm } from 'react-hook-form';
import React from 'react';
const DynamicForm = ({ fields, onSubmit }) => {
  const {
    register,//register is method that we get from the useform hook, it allows us to register inputs
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map(({ name, label, type, placeholder }, index) => (// Each field is an object with name, label, type, and placeholder
        <div key={index} style={{ marginBottom: '1rem' }}>
          <label htmlFor={name}>{label}</label>
          <input
            id={name}
            type={type}
            placeholder={placeholder}
            {...register(name, { required: true })}//> {/* register method is used to register the input with react-hook-form */}
          />
          {errors[name] && <p style={{ color: 'red' }}>This field is required</p>}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  );
};

export default DynamicForm;