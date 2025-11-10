import React from "react";
import { collection, addDoc, query, where, onSnapshot, getDocs, doc, deleteDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { auth } from "../../firebase/config";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import db from "../../firebase/config";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
const Header = ({ usuario }) => {
  return (
    <header className="bg-white shadow-lg py-2  sticky top-0 z-50 h-[15dvh]">
      <Categorias usuario={usuario} />
    </header>
  );
};

export default Header;

const Categorias = ({ usuario }) => {
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
  let entradaCategoria;
  if (usuario && usuario.rol === "Reportero") {
    entradaCategoria = (
      <EntradaCategoria />
    )
  }

  return (
    <div className="mx-auto flex flex-col items-center justify-between px-4 h-full">
      <nav className="w-full overflow-x-auto scroll-smooth scrollbar-hide flex justify-center">
        <ul className="flex space-x-4 px-2 py-2 w-max">
          {categorias.map((cat) => (
            <li
              key={cat.id}
              className="min-w-[150px] shrink-0 text-center bg-blue-100 rounded-md p-2 shadow hover:bg-blue-200 transition"
            >
              <CategoriaLi usuario={usuario} cat={cat} />
            </li>
          ))}
        </ul>
      </nav>
      <div className=" w-full flex justify-between">

        {entradaCategoria}
        <button
          onClick={() => {
            signOut(auth);
            navigate("/");
          }}
          className="px-3 border-transparent rounded-md shadow-sm text-center font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150
          text-xs"
        >
          CERRAR SESION
        </button>
      </div>
    </div>
  );
};

const CategoriaLi = ({ cat, usuario }) => {
  const navigate = useNavigate();

  const refCategoria = doc(db, "categoria", cat.id);

  async function deleteHandler(e) {
    e.preventDefault();

    const noticiasQuery = query(
      collection(db, "Noticia"),
      where("categoria", "==", cat.nombre_categoria)
    );

    const snapshot = await getDocs(noticiasQuery);

    const deletePromises = snapshot.docs.map((docSnap) =>
      deleteDoc(doc(db, "Noticia", docSnap.id))
    );

    await Promise.all(deletePromises);

    await deleteDoc(refCategoria);

  }
  let iconoEliminar

  if (usuario && usuario.rol === "Reportero") {
    iconoEliminar = (
      <IconButton >
        <DeleteOutlineIcon onClick={(e) => deleteHandler(e)} aria-label="delete" />
      </IconButton>
    )
  }
  return (
    <>
      <button
        onClick={() => navigate(`/categorias/${cat.nombre_categoria}`)}
        className="hover:text-blue-600 transition-colors duration-100"
      >
        {cat.nombre_categoria}
      </button>
      {iconoEliminar}
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
          className="px-4 py-2 border w-30 sm:text-sm sm:w-xs text-xs  border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Agregar categoria"
        />
      </div>
      <button className="px-3 border-transparent rounded-md shadow-sm text-center font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">
        +
      </button>
    </form>
  );
};
