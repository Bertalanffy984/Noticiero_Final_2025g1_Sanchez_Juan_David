import * as React from "react";
import Card from "@mui/material/Card";
import { useState, useEffect } from "react";
import db from "../../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useParams } from "react-router-dom";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import IconButton from "@mui/material/IconButton";

const CartaCrearNoticia = () => {
  const [contenido, setContenido] = useState(false);
  return (
    <Card
      sx={{
        minWidth: 345,
        minHeight: 500,
        maxHeight: 700,
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: 2,
        border: "1px solid rgba(255, 255, 255, 0.3)",
        boxShadow: 3,
      }}
    >
      <section className="flex justify-center items-center h-full">
        {!contenido ? (
          <AddCircleOutlineIcon
            sx={{
              fontSize: 100,
              backgroundColor: "rgba(15, 23, 42, 0.6)", // azul oscuro con 60% opacidad
              backdropFilter: "blur(10px)", // desenfoque tipo vidrio
              WebkitBackdropFilter: "blur(10px)", // soporte para Safari
              borderRadius: 2,
              boxShadow: 3,
            }}
            onClick={() => setContenido(true)}
          />
        ) : (
          <FormularioNoticia setContenido={setContenido} />
        )}
      </section>
    </Card>
  );
};

export default CartaCrearNoticia;

export const FormularioNoticia = ({setContenido}) => {
  const [usuario, setUsuario] = useState(null);
  const { nombreCategoria } = useParams();

  useEffect(() => {
    onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        setUsuario(usuarioFirebase.email);
      }
    });
  }, []);

  const agregarNoticia = async (Noticia) => {
    const docRef = await addDoc(collection(db, "Noticia"), {
      titulo: Noticia.titulo,
      subTitulo: Noticia.subTitulo,
      contenido: Noticia.contenido,
      ulr_img: Noticia.urlImg,
      estado: Noticia.estado,
      autor: usuario,
      categoria: nombreCategoria,
      fecha_creacion: serverTimestamp(),
      fecha_actualizacion: serverTimestamp()
    });
    console.log(docRef);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    const form = e.target.elements;
    const Noticia = {
      titulo: form.titulo.value,
      subTitulo: form.subTitulo.value,
      contenido: form.contenido.value,
      urlImg: form.urlImg.value,
      estado: form.estado.value,
    };
    agregarNoticia(Noticia);
  };

  return (
    <FormularioCrearNoticia submitHandler={submitHandler} setContenido={() => setContenido(false)} />
  );
};

export const FormularioActualizarNoticia = ({
  submitHandler,
  handleChange,
  noticia,
  usuario,
  setEdicion
}) => {
  return (

    <form className="mx-auto h-full w-full p-6" onSubmit={submitHandler}>
      <div className="w-full flex justify-between mb-7">
        <h2 className="text-2xl font-bold">
          Actualizar noticia
        </h2>
        <IconButton>
          <CloseOutlinedIcon onClick={setEdicion}/>
        </IconButton>
      </div>
      {usuario.rol === "Reportero" ? (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Titulo</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              id="titulo"
              type="text"
              required
              placeholder="Intento de suicidio en Uniamazonia"
              value={noticia.titulo}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Sub-titulo</label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              id="subTitulo"
              type="text"
              required
              placeholder="Desde un septimo piso"
              value={noticia.subTitulo}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Contenido</label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline resize-none overflow-y-auto"
              id="contenido"
              rows="2"
              required
              placeholder="lorem"
              value={noticia.contenido}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Url imagen de noticia
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
              id="ulr_img"
              type="url"
              required
              placeholder="https://img.com"
              // value={noticia.ulr_img}
              onChange={handleChange}
            />
          </div>
          <SelectorEstadoNoticia handleChange={handleChange} usuario={usuario} />
        </>
      ) : (
        <SelectorEstadoNoticia handleChange={handleChange} usuario={usuario} />
      )
      }

      <button className="bg-[rgba(15,23,42,0.7)] text-white font-bold py-2 px-4 rounded shadow-md backdrop-blur-md border border-white/20 hover:bg-[rgba(4,36,110,0.9)] transition duration-200 ease-in-out">
        Actualizar
      </button>
    </form>
  );
};

const SelectorEstadoNoticia = ({ handleChange, usuario }) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-bold mb-2">
        Estado Noticia
      </label>
      <select
        id="estado"
        onChange={handleChange}
        className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
      >
        {usuario.rol === "Reportero" ? (
          <>
            <option value="Edición">Edición</option>
            <option value="Terminado">Terminado</option>
          </>
        ) : (
          <>
            <option value="Publicado">Publicado</option>
            <option value="Desactivado">Desactivado</option>
          </>
        )}
      </select>
    </div>
  )
}

export const FormularioCrearNoticia = ({ submitHandler,setContenido }) => {
  return (
    <form className="mx-auto h-full w-full p-6" onSubmit={submitHandler}>
      <div className="w-full flex justify-between mb-7">
        <h2 className="text-2xl font-bold">
          Formulario Noticia
        </h2>
        <IconButton>
          <CloseOutlinedIcon onClick={setContenido} />
        </IconButton>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Titulo</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="titulo"
          type="text"
          required
          placeholder="Intento de suicidio en Uniamazonia"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Sub-titulo</label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="subTitulo"
          type="text"
          required
          placeholder="Desde un septimo piso"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Contenido</label>
        <textarea
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline resize-none overflow-y-auto"
          id="contenido"
          rows="2"
          required
          placeholder="lorem"
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Url imagen de noticia
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline"
          id="urlImg"
          type="url"
          required
          placeholder="https//img.com"
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Estado Noticia
        </label>
        <select
          id="estado"
          className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="Edición">Edición</option>
          <option value="Terminado">Terminado</option>
        </select>
      </div>

      <button className="bg-[rgba(15,23,42,0.7)] text-white font-bold py-2 px-4 rounded shadow-md backdrop-blur-md border border-white/20 hover:bg-[rgba(4,36,110,0.9)] transition duration-200 ease-in-out">
        Crear noticia
      </button>
    </form>
  );
};
