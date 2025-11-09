import React from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase/config";
import { useNavigate } from "react-router-dom";

const InicioSesion = () => {
  const navigate = useNavigate()
  const irRegistro=()=>{
    navigate('/registro')
  }
    const submitHandler = (e) => {
    e.preventDefault();
    const correo = e.target.elements.email.value;
    const contrasenia = e.target.elements.password.value;
    signInWithEmailAndPassword(auth,correo,contrasenia).then(navigate('/categorias'))
  };
  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Bienvenido</h1>
          <p className="text-gray-600">Por favor ingrese sus credenciales</p>
        </div>
        <Formulario submitHandler={submitHandler} contrasenia={'contraseña'}/>
        <div className="mt-6 flex justify-evenly">
          <p className="mt-6 text-center text-sm text-gray-600">
            No tiene una cuenta?
          </p>
            <button onClick={irRegistro} className="font-medium text-blue-600 mt-6 hover:text-blue-500 transition-all duration-100 hover:scale-120">
              Registrate ahora
            </button>
        </div>
      </div>
    </section>
  );
};

export default InicioSesion;

export const Formulario = ({children,submitHandler,contrasenia}) => {
  return (
    <form className="space-y-6"
    onSubmit={submitHandler}>
      <div>
        <label for="email" className="block text-sm font-medium text-gray-700 mb-1">
          Correo electronico
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="ejemplo@email.com"
        />
      </div>

      <div>
        <label
          for="password"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {contrasenia}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="••••••••"
        />
      </div>
      {children}
      <div>
        <button
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
        >
          Comenzar
        </button>
      </div>
    </form>
  );
};
