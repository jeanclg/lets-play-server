const router = require("express").Router();

const UserModel = require("../models/User.model");
const MessageModel = require("../models/Message.model");
const isAuthenticated = require("../middlewares/isAuthenticated");
const attachCurrentUser = require("../middlewares/attachCurrentUser");

// Crud (CREATE) - MESSAGE
// Criar uma nova mensagem [Crud] - id da rota é o id que irá RECEBER a mensagem!!!
router.post(
  "/user/:id/message",
  isAuthenticated,
  attachCurrentUser,
  async (req, res) => {
    // Requisições do tipo POST tem uma propriedade especial chamada body, que carrega a informação enviada pelo cliente
    console.log(req.body);

    try {
      // Buscar o usuário logado que está disponível através do middleware attachCurrentUser
      const loggedInUser = req.currentUser;
      // Salva os dados de usuário no banco de dados (MongoDB) usando o body da requisição como parâmetro
      const result = await MessageModel.create({
        ...req.body,
        userSenderId: loggedInUser._id,
        userRecieverId: req.params.id,
      });

      const user = await UserModel.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { receivedMessages: result._id } },
        { new: true }
      );

      // Responder o usuário recém-criado no banco para o cliente (solicitante). O status 201 significa Created
      return res.status(201).json(result);
    } catch (err) {
      console.error(err);
      // O status 500 signifca Internal Server Error
      return res.status(500).json({ msg: JSON.stringify(err) });
    }
  }
);

// cRud (Read): Rota para listar todas as mensagens
router.get("/message", async (req, res) => {
  try {
    // O find() sem filtros traz todos os documentos da collection
    const messages = await MessageModel.find();
    console.log(messages);

    // O status 200 é um status genérico de sucesso (OK)
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
});

// cRud (Read): Rota para listar todas as mensagens do usuario
router.get("/:id/messages", async (req, res) => {
  try {
    // O find() sem filtros traz todos os documentos da collection
    const messages = await MessageModel.find({ userRecieverId: req.params.id });
    console.log(messages);

    // O status 200 é um status genérico de sucesso (OK)
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
});

// cRud (Read): Rota para listar todos os posts
router.get("/message/:id", async (req, res) => {
  try {
    const messages = await MessageModel.findOne({ _id: req.params.id });
    console.log(messages);

    // O status 200 é um status genérico de sucesso (OK)
    return res.status(200).json(messages);
  } catch (err) {
    return res.status(500).json({ msg: err });
  }
});

// cRud (Update): Rota para editar o post

router.put("/message/:id", async (req, res) => {
  try {
    // O findOneAndUpdate() vai buscar um documento que atenda à consulta do primeiro parâmetro, e, caso encontre, atualizar com o conteúdo do segundo parâmetro. Ao final da atualização, retornará o objeto atualizado
    const updatedMessage = await MessageModel.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { new: true }
    );
    console.log(updatedMessage);
    // Se o findOne() retornar null, ou seja, não encontrar o review no banco, retornamos um 404 dizendo que não encontramos o review
    if (!updatedMessage) {
      return res.status(404).json({ msg: "Message not found" });
    }

    return res.status(200).json(updatedMessage);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err });
  }
});

// // cruD (Delete): Apaga o post especificado do banco

router.delete("/message/:id", async (req, res) => {
  try {
    const deleted = await MessageModel.deleteOne({ _id: req.params.id });

    if (!deleted) {
      return res.status(404).json({ msg: "Message not found" });
    }

    return res.status(200).json({});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err });
  }
});

module.exports = router;
