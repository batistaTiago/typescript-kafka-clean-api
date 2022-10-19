import request from 'supertest';


describe('Api', () => {
    it('should have cors headers', async () => {
        // @@TODO: ver um jeito melhor de fazer esse bootstrap dos servicos
        global.expressTestServer.get('/test-route', (req, res) => {
            return res.send(req.body);
        });

        await request(global.expressTestServer)
            .get('/test-route')
            .expect('access-control-allow-origin', '*')
            .expect('access-control-allow-methods', '*')
            .expect('access-control-allow-headers', '*');
    });
});
