
const { default: mongoose } = require('mongoose');
const request = require('supertest');

const app = require('../../app');
const Product = require('../../models/product.model');


describe('Api de productos', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/tienda_online');
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    describe('GET/api/products', () => {

        let response;
        beforeAll(async () => {
            response = await request(app).get('/api/products').send();
        });

        it('debería responder con status 200', () => {
            expect(response.statusCode).toBe(200);
        });
        it('debería responder con un JSON', () => {
            expect(response.headers['content-type']).toContain('application/json')
        });
        it('debería devolver un array de productos', () => {
            expect(response.body).toBeInstanceOf(Array);
        });

    });

    describe('GET/api/products/PRODUCTID', () => {
        it('debería devolver un JSON correcto', async () => {
            const response = await request(app).get('/api/products/633be6c3c869c8b89ddf9a31').send();

            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json');

        });

        it('debería recuperar el producto correcto', async () => {
            const response = await request(app).get('/api/products/633be6c3c869c8b89ddf9a31').send();
            expect(response.body.name).toBeDefined();
            expect(response.body.name).toBe('Picadora Moulinex');

        });

        it('debería devolver error si el ID no existe', async () => {
            const response = await request(app).get('/api/products/idinvalido').send();
            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBeDefined();

        })
    })

    describe('POST/api/products', () => {
        let response;
        const newProduct = { name: 'Robot Roomba', description: 'Limpia cuando le apetece', price: 299, department: 'test', available: true, stock: 3 };
        beforeEach(async () => {
            response = await request(app).post('/api/products').send(newProduct);

        });

        afterAll(async () => {
            await Product.deleteMany({ department: 'test' });
        })

        it('debería devolver una respuesta con formato correcto', () => {
            expect(response.statusCode).toBe(201);
            expect(response.headers['content-type']).toContain('application/json')
        });

        it('debería obtener el objeto recién creado', () => {
            expect(response.body._id).toBeDefined();
            expect(response.body.name).toBe(newProduct.name);
        });


    });

    describe('PUT/api/products/PRODUCTID', () => {
        let response;
        let prod;
        const newProduct = { name: 'Robot Roomba', description: 'Limpia cuando le apetece', price: 299, department: 'test', available: true, stock: 3 };
        beforeEach(async () => {
            prod = await Product.create(newProduct);
            response = await request(app).put(`/api/products/${prod._id}`).send({ price: 78, department: 'otro' });
        });
        afterEach(async () => {
            await Product.findByIdAndDelete(prod._id);
        });

        it('debería devolver una respuesta con formato correcto', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json')
        });

        it('debería responder con los datos modificados', () => {
            expect(response.body.price).toBe(78);
            expect(response.body.department).toBe('otro');

        })

    });

    describe('DELETE/api/products/PRODUCTID', () => {
        let response;
        let prod;
        const newProduct = { name: 'Robot Roomba', description: 'Limpia cuando le apetece', price: 299, department: 'test', available: true, stock: 3 };
        beforeEach(async () => {
            prod = await Product.create(newProduct);
            response = await request(app).delete(`/api/products/${prod._id}`).send();

        });
        afterAll(async () => {
            await Product.deleteMany({ department: 'test' });
        });

        it('debería devolver una respuesta con formato correcto', () => {
            expect(response.statusCode).toBe(200);
            expect(response.headers['content-type']).toContain('application/json')
        });

        it('debería responder con los datos borrados', async () => {
            const deleteProduct = await Product.findById(prod._id);
            expect(deleteProduct).toBeNull();


        })

    });



});
