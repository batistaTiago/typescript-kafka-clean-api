import request from 'supertest';


describe('Api', () => {
    it('should parse json data sucessfully', async () => {
        // @@TODO: ver um jeito melhor de fazer esse bootstrap dos servicos
        global.expressTestServer.post('/json-test-route', (req, res) => {
            return res.send(req.body);
        });

        const sampleData = { data: { some: ['arbitrary', 'object']}};

        await request(global.expressTestServer)
            .post('/json-test-route')
            .send(sampleData)
            .expect(sampleData);
    });
});
