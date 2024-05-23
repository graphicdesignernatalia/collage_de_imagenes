const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(fileUpload({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  abortOnLimit: true,
  responseOnLimit: "El tamaño de la imagen supera el límite permitido de 5MB." 
}));

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/formulario.html");
});

app.get("/collage", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/collage.html"));
});

app.post('/imagen', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No se subió ninguna imagen.');
  }

  const { target_file } = req.files;
  const { posicion } = req.body;

  const uploadPath = path.join(__dirname, "public", "imgs", `imagen-${posicion}.jpg`);

  target_file.mv(uploadPath, (err) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.redirect("/collage");
  });
});

app.delete("/imagen/:nombre", (req, res) => {
  const imageName = req.params.nombre;
  const imagePath = path.join(__dirname, "public", "imgs", imageName);

  fs.unlink(imagePath, (err) => {
    if (err) {
      return res.status(500).send("No se pudo eliminar la imagen.");
    }
    res.send("Imagen eliminada.");
  });
});

app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`),(console.log("server ON!"));
});
