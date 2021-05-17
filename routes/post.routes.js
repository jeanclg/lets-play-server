const router = require("express").Router();

const PostModel = require("../models/Post.model");
const { find } = require("../models/User.model");
const UserModel = require("../models/User.model");

// Crud (CREATE) - HTTP POST
// Criar um novo usuário
router.post("/user/:id/post", async (req, res) => {
  // Requisições do tipo POST tem uma propriedade especial chamada body, que carrega a informação enviada pelo cliente
  console.log(req.body);

  try {
    // Salva os dados de usuário no banco de dados (MongoDB) usando o body da requisição como parâmetro
    const result = await PostModel.create({
      ...req.body,
      userId: req.params.id,
    });

    const user = await UserModel.findOneAndUpdate(
      { _id: req.params.id },
      { $push: { uploadedPosts: result._id } },
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

// cRud (Read): Rota para listar todos os posts
router.get("/post", async (req, res) => {
  try {
    // O find() sem filtros traz todos os documentos da collection
    const posts = await PostModel.find().populate("userId");
    console.log(posts);

    // O status 200 é um status genérico de sucesso (OK)
    return res.status(200).json(posts);
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
});

// Listar um post especifico
router.get("/post/:id", async (req, res) => {
  try {
    const post = await PostModel.findOne({ _id: req.params.id });
    console.log(post);

    // O status 200 é um status genérico de sucesso (OK)
    return res.status(200).json(post);
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
});

// cRud (Update): Rota para editar o post

router.put("/post/:id", async (req, res) => {
  try {
    // O findOneAndUpdate() vai buscar um documento que atenda à consulta do primeiro parâmetro, e, caso encontre, atualizar com o conteúdo do segundo parâmetro. Ao final da atualização, retornará o objeto atualizado
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    console.log(updatedPost);
    // Se o findOne() retornar null, ou seja, não encontrar o review no banco, retornamos um 404 dizendo que não encontramos o review
    if (!updatedPost) {
      return res.status(404).json({ msg: "Post not found" });
    }

    return res.status(200).json(updatedPost);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err });
  }
});

// // cruD (Delete): Apaga o post especificado do banco

router.delete("/post/:id", async (req, res) => {
  try {
    const post = await PostModel.findOne({ _id: req.params.id });
    const userResult = await UserModel.findOne({ _id: post.userId });

    const { uploadedPosts } = userResult;

    const arr = uploadedPosts.filter(
      (x) => x.toString() !== post._id.toString()
    );

    const newUser = await UserModel.findOneAndUpdate(
      { _id: userResult._id },
      { uploadedPosts: arr },
      { new: true }
    );

    const deleted = await PostModel.deleteOne({ _id: req.params.id });

    if (!deleted) {
      return res.status(404).json({ msg: "Post not found" });
    }

    return res.status(200).json({});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err });
  }
});

module.exports = router;
