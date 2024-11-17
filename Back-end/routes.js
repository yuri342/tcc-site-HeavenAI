import { Router } from "express";
import usuarioDAO from "../Back-end/DAOs/usuarioDAO.js";
import Ia from "./Classes/IA.js";
import Contexto from "./Classes/contexto.js";
import { input, localResponseNormalization } from "@tensorflow/tfjs";

const routes = Router();

//chat
routes.post("/Chat", async (req, res) => {
  const { idusuario, photoUsuario } = req.body;
  let udao = new usuarioDAO();
  try {
    const resp3 = await udao.AtualizFoto(idusuario, photoUsuario)
    const resp2 = await udao.AtualizUltAcess(idusuario);
    const resp = await udao.findById(idusuario);
    if (resp != []) {
      console.log("- RESPOSTA -");
      console.log(resp);
      res.send({
         Usuario: resp,
         TimeResp: resp2,
         photoUsuario:resp3
      });
    }else{
      res.status(401).send({ message: "Usuario não existe!!!" });
      console.log("Usuario Não existe");
    }
  } catch (error) {
    console.error("Erro ao verificar Usuario:", error);
    res.status(500).send({ message: "Erro interno do servidor" });
    console.log("ERRO SERVER - AXIOS");
  }
});

routes.post("/Ia", async (req, res) => {
  const { inputValue } = req.body;
  console.log(inputValue);
  const ia = new Ia("ModeloTeste", null, "TESTE ADMIN", 1, 1);
  try {
    let resp = await ia.response(inputValue);
    res.send(
      {
        respota: resp
      }
    );
  } catch (error) {
    console.error("Erro ao enviar input:", error);
    res.status(500).send({ message: "Erro interno do servidor" });
    console.log("ERRO SERVER - AXIOS");
  }
});

//login
routes.post("/Login", async (req, res) => {
  let udao = new usuarioDAO();
  const { nome, senha } = req.body;
  console.log(nome, senha);
  try {
    const resp = await udao.verificarLogin(nome, senha);

    if (resp != "") {
      // Se o usuário foi encontrado
      res.send({
        message: "Login bem-sucedido",
        Token: "TrueLogin",
        id: resp[0].id,
      });
      console.log(resp[0].id);
    } else {
      res.status(401).send({ message: "Nome ou senha inválidos" });
      console.log("LoginERRADO");
    }
  } catch (error) {
    console.error("Erro ao verificar login:", error);
    res.status(500).send({ message: "Erro interno do servidor" });
    console.log("ERRO SERVER");
  }
});

//regitro
routes.post("/Cadastro", async (req, res) => {
  let udao = new usuarioDAO();
  const { nome, senha, email } = req.body;
  try {
    const resp = await udao.create(nome, senha, email);
    if (resp != Error) {
      console.log("RESP = " + resp);
      // Resposta bem-sucedida - Cadastro realizado
      res.status(200).send({
        message: "Requisição Feita Com Sucesso",
        data: resp.message,
      });
    } else {

      // Caso o cadastro falhe ou não retorne resultados
      res.status(401).send({
        message: "Erro ao Realizar Requisição",
      });
      console.log("Erro ao cadastrar. Código de status 401.");

    }

  } catch (error) {
    // Caso ocorra algum erro inesperado (ex: erro no banco de dados)
    console.log("Erro no servidor:", error);
    res.status(500).send({
      message: "Erro interno no servidor. Não foi possível realizar o cadastro.",
    });
  }
});

export default routes;
