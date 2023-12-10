import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '../../start/server';

chai.use(chaiHttp);
const expect = chai.expect;

describe('Cart API', () => {
	describe('POST /api/carts', () => {
		it('should add an item to the cart', async () => {
			const itemToAdd = {
				product_id: 'f7c1a7f3-6a53-4c0c-8959-ecdd87fbf3e9',
			};

			let req = chai.request(server).post('/api/carts').send(itemToAdd);

			const res = await req;

			expect(res).to.have.status(200);
		}).timeout(20000);
	});

	describe('GET /api/carts', () => {
		it(`should retrieve all items in the user's cart`, async () => {
			const res = await chai.request(server).get('/api/carts');

			expect(res).to.have.status(200);
		}).timeout(20000);
	});

	describe('GET /api/cart-summary', () => {
		it(`should generate a cart summary`, async () => {
			const res = await chai.request(server).get('/api/carts/cart-summary');

			expect(res).to.have.status(200);
		}).timeout(20000);
	});

	describe('DELETE /api/carts/:itemId', () => {
		it('should delete a product from cart and handle both 204 and 404 responses', async () => {
			const productIdToDelete = 'f7c1a7f3-6a53-4c0c-8959-ecdd87fbf3e9';
			const res = await chai
				.request(server)
				.delete(`/api/carts/${productIdToDelete}`);

			if (res.status === 200) {
				expect(res).to.have.status(200);
			} else if (res.status === 404) {
				expect(res).to.have.status(404);
			} else {
				throw new Error(`Unexpected response status: ${res.status}`);
			}
		}).timeout(20000);
	});
});

describe('Orders API', () => {
	describe('POST /api/orders', () => {
		it('should create an order if there are products in cart, if not throw 404', async () => {
			const itemToAdd = {
				redirect_url: 'https://frontendurl.com',
				payment_method: 'flutterwave',
			};
			const res = await chai
				.request(server)
				.post('/api/orders')
				.send(itemToAdd);

			if (res.status === 404) {
				expect(res).to.have.status(404);
			} else if (res.status === 201) {
				expect(res).to.have.status(201);
			}
		}).timeout(20000);
	});

	describe('GET /api/orders', () => {
		it(`should retrieve all orders`, async () => {
			const res = await chai.request(server).get('/api/orders');

			expect(res).to.have.status(200);
		});
	}).timeout(20000);

	describe('GET /api/orders/:orderId', () => {
		it('get order by id', async () => {
			const res = await chai
				.request(server)
				.get('/api/orders/aaa95c74-af13-4717-b86d-454ae36bdb60');
			expect(res).to.have.status(200);
			expect(res.body).to.be.an('object');
		}).timeout(20000);
	});

	describe('PUT /api/orders/', () => {
		it('confirm order', async () => {
			const res = await chai.request(server).put('/api/orders/').send({
				orderId: '6e245ff0-0771-49c5-bb16-c57d72872dd8',
				transactionStatus: 'success',
			});
			expect(res).to.have.status(200);
		}).timeout(20000);
	});
});

describe('User API', () => {
	describe('POST /tempuser', () => {
		it('should create a temporary user', async () => {
			const itemToAdd = {
				first_name: 'Peter',
				last_name: 'Ekene',
				email: 'peter.ekene@gmail.com',
			};

			let req = chai
				.request(server)
				.post('/api/users/tempuser')
				.send(itemToAdd);

			const res = await req;

			expect(res).to.have.status(201);
			expect(res.body).to.be.an('object');
		}).timeout(20000);
	});
});

describe('Transactions API', () => {
	describe('GET /api/transactions', () => {
		it('get all transactions', async () => {
			const res = await chai.request(server).get('/api/transactions');
			expect(res).to.have.status(200);
		});
	}).timeout(20000);

	describe('GET /api/transactions/:transactionId', () => {
		it('get a single transaction', async () => {
			const res = await chai
				.request(server)
				.get('/api/transactions/6e245ff0-0771-49c5-bb16-c57d72872dd8');
			expect(res).to.have.status(200);
		}).timeout(20000);
	});
});

describe('Webhooks API', () => {
	describe('POST /webhooks', () => {
		it('should return 401 because the request is not from flutterwave', async () => {
			try {
				const itemToAdd = {
					event: 'charge.completed',
					data: {
						id: 285959875,
						tx_ref: 'Links-616626414629',
						flw_ref: 'PeterEkene/FLW270177170',
						amount: 100,
						currency: 'NGN',
						charged_amount: 100,
						status: 'successful',
						payment_type: 'card',
						created_at: '2020-07-06T19:17:04.000Z',
					},
				};

				let req = chai
					.request(server)
					.post('/api/webhooks/flw')
					.send(itemToAdd);

				const res = await req;

				expect(res).to.have.status(401);
			} catch (error) {
				throw error;
			}
		});
	}).timeout(20000);
});
