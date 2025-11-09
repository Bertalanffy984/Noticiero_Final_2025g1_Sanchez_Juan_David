import * as React from "react";
import { useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import IconoEdicion from "@mui/icons-material/AppRegistrationOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { FormularioActualizarNoticia } from "../CartaCreaNoticia/CartaCreaNoticia";
import db from "../../firebase/config";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import Stack from "@mui/material/Stack";

const Noticia = ({ noticia }) => {
  const [edicion, setEdicion] = useState(true);
  const [datosFormulario, setDatosFormulario] = useState(noticia);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setDatosFormulario((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  const ref = doc(db, "Noticia", datosFormulario.id);

  async function submitHandler(e) {
    e.preventDefault();
    const { id, ...camposActualizados } = datosFormulario;
    await updateDoc(ref, camposActualizados);
  }
  //logica para eliminar
  async function deleteHandler(e) {
    e.preventDefault();
    await deleteDoc(ref);
  }

  return (
    <Card
      sx={{
        minWidth: 345,
        maxWidth: 345,
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
      {edicion ? (
        <section>
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe"></Avatar>
            }
            action={
              <Stack direction="column" sx={{ ml: 1 }}>
                <IconButton onClick={() => setEdicion(false)} aria-label="edit">
                  <IconoEdicion />
                </IconButton>
                <IconButton
                  onClick={(e) => deleteHandler(e)}
                  aria-label="delete"
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </Stack>
            }
            title={noticia.autor}
            subheader={
              <div>
                <Typography variant="body2" color="text.secondary">
                  Publicado:
                  {noticia.fecha_creacion?.toDate().toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Actualizado:
                  {noticia.fecha_actualizacion?.toDate().toLocaleDateString()}
                </Typography>
              </div>
            }
          />
          <CardMedia
            component="img"
            height="10"
            image={noticia.ulr_img}
            alt={noticia.titulo}
            sx={{ padding: 2 }}
          />
          <CardContent>
            <Typography variant="body3" sx={{ color: "text.secondary" }}>
              {noticia.subTitulo}
            </Typography>
          </CardContent>
          <CardActions disableSpacing>
            {noticia.estado}
            {noticia.categoria}
          </CardActions>
          <CardContent>
            <Typography sx={{ marginBottom: 2 }}>Contenido:</Typography>
            <Typography sx={{ marginBottom: 2 }}>
              {noticia.contenido}
            </Typography>
          </CardContent>
        </section>
      ) : (
        <FormularioActualizarNoticia
          submitHandler={submitHandler}
          handleChange={handleChange}
          noticia={datosFormulario}
        />
      )}
    </Card>
  );
};
export default Noticia;
