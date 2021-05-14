const router = require("express").Router();

const PostModel = require("../models/Post.model");
const UserModel = require("../models/User.model")

// Crud (CREATE) - HTTP POST
// Criar um novo usuário
router.post("/user/:id/post", async (req, res) => {
  // Requisições do tipo POST tem uma propriedade especial chamada body, que carrega a informação enviada pelo cliente
  console.log(req.body);

  try {

    // Salva os dados de usuário no banco de dados (MongoDB) usando o body da requisição como parâmetro
    const result = await PostModel.create({
      ...req.body,
    });

    const user = await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { uploadedPosts : result._id } },
        { new: true }
      );

    // Responder o usuário recém-criado no banco para o cliente (solicitante). O status 201 significa Created
    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    // O status 500 signifca Internal Server Error
    return res.status(500).json({ msg: JSON.stringify(err) });
  }
});




// cRud (Read): Rota para listar todos os quartos
router.get("/post", async (req, res) => {
    try {
      // O find() sem filtros traz todos os documentos da collection
      const posts = await PostModel.find();
      console.log(post);
  
      // O status 200 é um status genérico de sucesso (OK)
      return res.status(200).json(post);
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  });
  
  router.get("/post/:id", async (req, res) => {
    try {
      const post = await PostModel.findOne({ _id: req.params.id })
      console.log(post);
  
      // O status 200 é um status genérico de sucesso (OK)
      return res.status(200).json(room);
    } catch (err) {
      return res.status(500).json({ msg: err });
    }
  });

module.exports = router;