import React from "react";
import { collection, addDoc, query, where, onSnapshot  } from "firebase/firestore";
import { useState, useEffect } from "react";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import db from "../../firebase/config";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import { doc, deleteDoc } from "firebase/firestore";
import Stack from "@mui/material/Stack";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
const Header = () => {
  return (
    <header className="bg-white shadow-lg py-2  sticky top-0 z-50 h-[15dvh]">
      <Categorias />
    </header>
  );
};

export default Header;

const Categorias = () => {
  const navigate = useNavigate();
  const [categorias, setCategorias] = useState([]);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "categoria"), (snapshot) => {
      const nuevasCategorias = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategorias(nuevasCategorias);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="mx-auto flex flex-col items-center justify-between px-4 h-full">
      <nav className="flex items-center space-x-8 m-auto">
        <ul className="flex space-x-8">
          {categorias.map((cat) => (
            <li className="text-center" key={cat.id}>
              <CategoriaLi cat={cat} />
            </li>
          ))}
        </ul>
      </nav>
      <div className=" w-full flex justify-between">
        <EntradaCategoria />
        <button
          onClick={() => {
            signOut(auth);
            navigate("/");
          }}
          className="px-3 border-transparent rounded-md shadow-sm text-center font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
        >
          CERRAR SESION
        </button>
      </div>
    </div>
  );
};

const CategoriaLi = ({ cat }) => {
  const navigate = useNavigate();

  const ref = doc(db, "categoria", cat.id);
  // const ref2=doc(db,"Noticia")
  async function deleteHandler(e) {
    e.preventDefault();
    await deleteDoc(ref).then(
      query(
        collection(db, "Noticia"),
        where("categoria", "==", cat.nombre_categoria)
      )
    );
  }

  return (
    <>
      <button
        onClick={() => navigate(`/categorias/${cat.nombre_categoria}`)}
        className="hover:text-blue-600 transition-colors duration-100"
      >
        {cat.nombre_categoria}
      </button>
      <IconButton onClick={(e) => deleteHandler(e)} aria-label="delete">
        <DeleteOutlineIcon />
      </IconButton>
    </>
  );
};
const EntradaCategoria = () => {
  const agregarCategoria = async (categoria) => {
    const docRef = await addDoc(collection(db, "categoria"), {
      nombre_categoria: categoria,
    });
    console.log(docRef);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const categoria = e.target.elements.categoria.value;
    agregarCategoria(categoria);
  };
  return (
    <form className="flex" onSubmit={submitHandler}>
      <div>
        <input
          type="text"
          id="categoria"
          name="categoria"
          required
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Agregar categoria"
        />
      </div>
      <button className="px-3 border-transparent rounded-md shadow-sm text-center font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">
        +
      </button>
    </form>
  );
};
