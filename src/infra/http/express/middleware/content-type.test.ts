import request from 'supertest';


describe('Api', () => {
    it('should have content type header set to json', async () => {
        // @@TODO: ver um jeito melhor de fazer esse bootstrap dos servicos
        global.expressTestServer.get('/content-test-route', (req, res) => {
            return res.send();
        });

        await request(global.expressTestServer)
            .get('/content-test-route')
            .expect('content-type', /json/);
    });
});
