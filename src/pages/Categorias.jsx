import React from "react";
import Header from "../Components/Header/Header";
import Noticia from "../Components/Noticia/Noticia";
import CartaCrearNoticia from "../Components/CartaCreaNoticia/CartaCreaNoticia";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import db from "../firebase/config";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export const Categorias = ({ usuario }) => {
  const [noticias, setNoticias] = useState([]);
  const { nombreCategoria } = useParams();

  useEffect(() => {
    const consulta = query(
      collection(db, "Noticia"),
      where("categoria", "==", nombreCategoria)
    );
    //se suscribe a los cambios en esta consulta
    const unsubscribe = onSnapshot(consulta, (querySnapshot) => {
      const noticiasActuales = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNoticias(noticiasActuales);
      console.log(noticiasActuales);
    });

    return () => unsubscribe();
  }, [nombreCategoria]);


  let cartaAgregar

  if (usuario?.rol === "Reportero") {
    cartaAgregar = (
      <CartaCrearNoticia />
    )
  }

  let noticiasFiltradas=[];
  if (usuario?.rol === "Editor") {
    noticiasFiltradas = noticias.filter((noticia) => noticia.estado === "Terminado")
  } else if (usuario?.rol === "Reportero") {
    noticiasFiltradas = noticias
  } else {
    noticiasFiltradas = noticias.filter((noticia) => noticia.estado === "Publicado")
  }
  return (
    <main className="bg-[url('../../public/FondoPrincipal.png')] bg-cover bg-center bg-fixed min-h-screen">
      <Header usuario={usuario} />
      <section className="container m-auto flex flex-wrap justify-center gap-5 mt-3.5">
        {cartaAgregar}
        {noticiasFiltradas.map((noticia) => (
          <Noticia
            key={noticia.id}
            noticia={noticia}
            encabezadoNoticia="Crea tu noticia"
          />
        ))}
      </section>
    </main>
  );
};
