import "./App.css";
import InicioSesion from "./pages/InicioSesion";
import RegistroUsuarios from "./pages/RegistroUsuarios";
import { Categorias } from "./pages/Categorias";
import db from "./firebase/config";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { doc, getDoc } from "firebase/firestore";

const App = () => {
  const [usuario, setUsuario] = useState(null);

  const getRol = async (uid) => {
    const docuRef = doc(db, `/usuarios/${uid}`);
    const docuCifrada = await getDoc(docuRef);
    const infoFinal = docuCifrada.data().rol;
    return infoFinal;
  };

  useEffect(() => {
    onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        getRol(usuarioFirebase.uid).then((rol) => {
          const userData = {
            uid: usuarioFirebase.uid,
            email: usuarioFirebase.email,
            rol: rol,
          };
          setUsuario(userData);
          // console.log(usuario.email)
        });
      }
    });
  }, []);

  return  (
    <>
      <Routes>
        <Route path="/" element={<InicioSesion />} />
        <Route path="/registro" element={<RegistroUsuarios />} />
        <Route path="/categorias/:nombreCategoria?" element={< Categorias usuario={usuario}/>} />
      </Routes>
    </>
  )
}
export default App;

// useEffect es un hook que nos permite ejecutar codigo arbitario cuando se monta el componente en el doom y cada vez que cambian sus dependecias
// si no le pasamos las dependencias este se ejecutara cada vez que se renderice nuestro componenete
// si tiene los [] quiere decir que se ejecutara solo la primera vez que se renderize
// [x,u,y] entonces se ejecutara cada vez que cambie x,u,y , y la primera vez que se renderize.
