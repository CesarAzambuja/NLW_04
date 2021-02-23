/*Importando express*/
import express from 'express';

/*Chamando o express*/
const app = express();

/*
GET - Buscar
POST - Salvar
PUT - Alterar
DELETE - Delear 
PATCH - Alteração expecifica
*/

/*Criando uma rota get, enviado uma mensagem para o cliente*/
app.get('/', (req, res) => {
    res.send('Olá Mundo!')
});

/*Criando um rota post*/
app.post('/', (req, res) => {
    //Recebemos os dados para salvar
    res.json({'message':'Dados Salvos com Sucesso'})
});



app.listen(3333, () => console.log('Server in Running'));

