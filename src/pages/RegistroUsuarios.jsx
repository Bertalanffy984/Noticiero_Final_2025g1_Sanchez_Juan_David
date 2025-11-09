import React from "react";
import { Formulario } from "./InicioSesion";
import {auth} from "../firebase/config";
import db from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc,setDoc } from "firebase/firestore";

const RegistroUsuarios = () => {
  const registrarUsuario = async (email,password,rol) => {
    const infoUsuario = await createUserWithEmailAndPassword(auth,email,password).
    then((user)=>user);

    const docuRef= doc(db,`/usuarios/${infoUsuario.user.uid}`)
    setDoc(docuRef,{correo:email, rol:rol})

  };
  const submitHandler = (e) => {
    e.preventDefault();
    const correo = e.target.elements.email.value;
    const contrasenia = e.target.elements.password.value;
    const rol = e.target.elements.rol.value;
    registrarUsuario(correo,contrasenia,rol)
  };
  return (
    <section className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Bienvenido</h1>
          <p className="text-gray-600">Por favor ingrese sus credenciales</p>
        </div>
        <Formulario submitHandler={submitHandler} contrasenia={'Cree una contraseña'}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Seleccione su rol
            </label>
            <select
              id="rol"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Seleccione su rol"
            >
              <option value="Reportero">Reportero</option>
              <option value="Editor">Editor</option>
            </select>
          </div>
        </Formulario>
      </div>
    </section>
  );
};

export default RegistroUsuarios;
