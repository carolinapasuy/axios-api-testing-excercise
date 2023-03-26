
const { StatusCodes } = require('http-status-codes');
const { expect } = require('chai');
const axios = require('axios');

const urlBase = 'https://api.github.com';
const githubUserName = 'carolinapasuy';
const repository = 'axios-api-testing-excercise';
let issueNumber;

describe('Homework', () => {
  describe('Obtencion del usuario y verificacion del repositorio', () => {
    it('Obtener el usuario logueado', async () => {
      const response = await axios.get(`${urlBase}/user`, {
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      });

      expect(response.status).to.equal(StatusCodes.OK);
      username = response.data.login;

    });
    it('Verificar que exista el repositorio', async () => {
        let issueNumber;
        beforeEach(async () => {
        const response = await axios.get(
          `${urlBase}/repos/${githubUserName}/${repository}`,
          { access_token: process.env.ACCESS_TOKEN }
        );
        issueNumber = response.data[0];
        expect(response.status).to.equal(StatusCodes.OK);
      });
    });
  });
  describe('Creacion de un issue', () => {
    it('Verificar que el título corresponda y que el cuerpo no contenga contenido.', async () => {
    const issue = {
        title: 'Bug',
        repo: repository,
        owner: githubUserName
    };
      const response = await axios.post(`${urlBase}/repos/${githubUserName}/${repository}/issues`,issue, {
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      });
      expect(response.status).to.equal(StatusCodes.CREATED);
      expect(response.data.body).not.exist;
      expect(response.data).to.have.property("title").equal(issue.title);

    });
  });
  describe('Modificacion de un issue', () => {

    beforeEach(async () => {
        const response = await axios.get(`${urlBase}/repos/${githubUserName}/${repository}/issues`, {
            headers: {
                Authorization: `token ${process.env.ACCESS_TOKEN}`
            }
        });

        expect(response.status).to.equal(StatusCodes.OK);
        issueNumber = response.data[0].number;
    });
    describe('Agregarle un body y verificarlo', () => {
        it('Verificar que el título no haya cambiado y que contenga el nuevo cuerpo', async () => {
            const issue = {
                body: 'La pagina de login se queda cargando'
            };
              const response = await axios.patch(`${urlBase}/repos/${githubUserName}/${repository}/issues/${issueNumber}`,issue, {
                headers: {
                  Authorization: `token ${process.env.ACCESS_TOKEN}`
                }
              });
              expect(response.status).to.equal(StatusCodes.OK);
        
              const response2 = await axios.get(`${urlBase}/repos/${githubUserName}/${repository}/issues/${issueNumber}`, {
                headers: {
                  Authorization: `token ${process.env.ACCESS_TOKEN}`
                }
              });
              expect(response.status).to.equal(StatusCodes.OK);
              expect(response2.data).to.have.property("body").equal(issue.body);
              expect(response2.data.title).to.equal(response.data.title);
            });
    });
    describe('Realizar el "lock" del issue', () => {
        const issue = {
            repo : repository,
            issue_number : issueNumber,
            lock_reason : 'resolved',
            owner : githubUserName,
        };
        it('Validar el correcto lock' , async () => {
            const response = await axios.put(`${urlBase}/repos/${githubUserName}/${repository}/issues/${issueNumber}/lock`, issue, {
                headers: {
                    Authorization: `token ${process.env.ACCESS_TOKEN}`
                }
            });
            expect(response.status).to.equal(StatusCodes.NO_CONTENT);

            const response2 = await axios.get(`${urlBase}/repos/${githubUserName}/${repository}/issues/${issueNumber}`, {
                headers: {
                    Authorization: `token ${process.env.ACCESS_TOKEN}`
                }
            });
            expect(response2.status).to.equal(StatusCodes.OK);
            expect(response2.data.locked).to.equal(true);
            expect(response2.data).to.have.property("active_lock_reason").equal(issue.lock_reason);
         });
        });
    });
    describe('Process of unlocking a repository issue for user', () => {
        it('Eliminar el lock ', async () => {
            const response = await axios.delete(`${urlBase}/repos/${githubUserName}/${repository}/issues/${issueNumber}/lock`, {
                headers: {
                    Authorization: `token ${process.env.ACCESS_TOKEN}`
                }
            });

            expect(response.status).to.equal(StatusCodes.NO_CONTENT);

            const response2 = await axios.get(`${urlBase}/repos/${githubUserName}/${repository}/issues/${issueNumber}`, {
                headers: {
                    Authorization: `token ${process.env.ACCESS_TOKEN}`
                }
            });

            expect(response2.status).to.equal(StatusCodes.OK);
            expect(response2.data.locked).to.equal(false);
        });
    });
});