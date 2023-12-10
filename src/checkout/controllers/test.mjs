import { Sequelize,DataTypes } from 'sequelize';
// import  ADMIN_STATUS  from '../models/shop.model';
// import { PRODUCT_STATUS } from '../models/products.model';

// const { ADMIN_STATUS } = require('../models/shop.model');
// const { PRODUCT_STATUS } = require('../models/products.model');
import { Order, Product, PromoProduct, Promotion, Transaction, User } from "../models";
import { DiscountType } from '../models/promotions.model';
// import { OrderStatus } from "../models/orders.model";
// import { ADMIN_STATUS } from "../models/products.model";


const sequelize = new Sequelize("postgresql://postgres:2aoXJC41r85zFaYrgrpl@containers-us-west-145.railway.app:7675/railway");
sequelize
	.authenticate()
	.then(() => {
		console.info('Database is good');
	})
	.catch((err) => {
		console.error('Database no dey work', err);
	});

async function runScripts() {
      try {
        // Create sample records for the User table
        const user1 = await User.create({
          id: "4e8f65c7-d21b-4a5e-98ab-2f2560973c34", 
          username: 'user1',
          first_name: 'John',
          last_name: 'Doe',
          email: 'user1@example.com',
          section_order: 'Section A',
          password: 'password1',
          provider: 'local',
          profile_pic: 'pic1.jpg',
          refresh_token: 'token1',
		  role_id: 1,
		  token:"tokeneyaoeadoan",
		  phone_number: "12345678912",
		  is_verified: true,
		  two_factor_auth: true,
		  location: "Lagos",
		  country: "Nigeria",
        });
        const user2 = await User.create({
          id: "a956799f-458d-49f0-a8b0-842e7c7e950d",
          username: 'user2',
          first_name: 'Jane',
          last_name: 'Smith',
          email: 'user2@example.com',
          section_order: 'Section B',
          password: 'password2',
          provider: 'local',
          profile_pic: 'pic2.jpg',
          refresh_token: 'token2',
		  role_id: 1,
		  token:"tokeneyaoeadoan",
		  phone_number: "12345678912",
		  is_verified: true,
		  two_factor_auth: true,
		  location: "Lagos",
		  country: "Nigeria",
        });
    
        // Create sample records for the Product table
        const product1 = await Product.create({
          id: "f7c1a7f3-6a53-4c0c-8959-ecdd87fbf3e9",
          user_id: "4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
          name: 'Product 1',
          description: 'Description for Product 1',
          quantity: 10,
          category: 1,
          price: 19.99,
          discount_price: 15.99,
          admin_status: 'approved',
          is_published: true,
          currency: 'USD',
          shop_id: "123",
          tax: 30,
          admin_status: ADMIN_STATUS.APPROVED,
          is_deleted: PRODUCT_STATUS.ACTIVE,
          average_rating: 4,
        });

        const product2 = await Product.create({
          id: "33e0e140-2449-4e91-9eae-d662a7d1e32e",
          user_id: "4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
          name: 'Product 2',
          description: 'Description for Product 2',
          quantity: 5,
          category: 2,
          price: 29.99,
          discount_price: 24.99,
          admin_status: 'pending',
          is_published: false,
          currency: 'EUR',
          shop_id: "123",
          tax: 30,
          admin_status: ADMIN_STATUS.APPROVED,
          is_deleted: PRODUCT_STATUS.ACTIVE,
          average_rating: 4,
        });
    
        const promotion = Promotion.create({
          id: 1,
          user_id:"4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
          code: "EK56W8Y",
          promotion_type: "discount",
          discount_type: DiscountType.Fixed,
          quantity: 0,
          amount: 1000,
          valid_from: new Date("2023-10-12"),
          valid_to: new Date("2023-11-12"),
          maximum_discount_price: 1000
        })

        const promotion1 = Promotion.create({
          id: 2,
          user_id:"4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
          code: "EW56V8T",
          promotion_type: "discount",
          discount_type: DiscountType.Percentage,
          quantity: 0,
          amount: 5,
          valid_from: new Date("2023-10-12"),
          valid_to: new Date("2023-11-12"),
          maximum_discount_price: 1000
        })

        const promoProduct = PromoProduct.create({
          id: 1,
          product_id: "33e0e140-2449-4e91-9eae-d662a7d1e32e",
          promo_id: 1,
          user_id: "4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
        })

        const promoProduct1 = PromoProduct.create({
          id: 2,
          product_id: "f7c1a7f3-6a53-4c0c-8959-ecdd87fbf3e9",
          promo_id: 2,
          user_id: "4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
        })

        // Create sample records for the Order table
        // const order1 = await Order.create({
        //   id: "d7853ae1-cb46-4d09-a87e-70c858d45cd7",
        //   customer_id: "4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
        //   subtotal: 50.0,
        //   VAT: 5.0,
        //   discount: 2.5,
        //   status: 'completed',
        // });
        // const order2 = await Order.create({
        //   id: "9f5b80c5-10c4-4b3b-94ec-15941ae6dd2c",
        //   customer_id: "4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
        //   subtotal: 75.0,
        //   VAT: 7.5,
        //   discount: 3.0,
        //   status: 'pending',
        // });
    
        // Create sample records for the Transaction table
        // await Transaction.create({
        //   id: "7e0716c7-0f4c-49f1-8c8f-07c02c34f2e1",
        //   order_id: order1.id,
        //   amount: 47.5,
        //   status: 'success',
        //   currency: 'USD',
        //   provider_ref: 'ref1',
        //   in_app_ref: 'app_ref1',
        //   provider: 'paypal',
        // });
        // await Transaction.create({
        //   id: "5875fd92-1636-4ad5-a78f-3e59aa0961a1",
        //   order_id: order2.id,
        //   amount: 71.25,
        //   status: 'success',
        //   currency: 'EUR',
        //   provider_ref: 'ref2',
        //   in_app_ref: 'app_ref2',
        //   provider: 'stripe',
        // });
    
        console.log('Sample data inserted successfully.');
      } catch (error) {
        console.error('Error inserting sample data:', error);
      } finally {
        // Close the database connection
      }
    };
    
const deleteAllTransactions = async () => {
	await sequelize.query('TRUNCATE TABLE transactions CASCADE');
	await sequelize.query('TRUNCATE TABLE orders CASCADE');
	await sequelize.query('TRUNCATE TABLE products CASCADE');
	await sequelize.query('TRUNCATE TABLE users CASCADE');
	res.status(200).json({msg: "done truncating"})
}


async function runDatabase() {
  sequelize.sync();
}


// runDatabase()
runScripts()


// Tokens: Regular: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjNkN2QxMTU4LTU3ZjctNGU4YS04Mzk2LTZjNjMzNDdmYjZhMiIsImlhdCI6MTY5NzM5ODk0MX0.bGvVaS5CeC5Zzzmjf2np-9Kl9dQTDqre7ztXzKhJKMc
// Guest: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjliYzM1MWJiLTdjMDMtNGZkMC1iNGU4LTk2NDYzNGQxYjlmMCIsImlhdCI6MTY5NzM5ODk5NH0.DYXa9B1XlX48d25Bk_7ChBNxIxGczg0T8_Rt-uqat2E
// Admin: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImQ0M2Q4OGEzLWUzZjUtNDE1NS05MjE0LWI0N2VjMWMxYTVhNSIsImlhdCI6MTY5NzM5OTA0Mn0.Zp_1u5oWINS3LIenDqLXzAZHVerCmmYXJlIp_WWCo5w

// await sequelize.query('TRUNCATE TABLE Transactions CASCADE');
// await sequelize.query('TRUNCATE TABLE Orders CASCADE');
// await sequelize.query('TRUNCATE TABLE Products CASCADE');
// await sequelize.query('TRUNCATE TABLE Users CASCADE');




// const createShop = Asyncly(async(req, res) => {
// 	try {
// 		const shop = await Shop.create({
// 			id: "5e8f65d7-d23b-4a5e-98ab-2f2590973c68",
// 			merchant_id: "4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
// 			name: "John Doe",
// 			policy_confirmation: true,
// 			restricted: RESTRICTED.NO,
// 			admin_status: ADMIN_STATUS.APPROVED,
// 			is_deleted: SHOP_STATUS.ACTIVE,
// 			reviewed: true,
// 			rating: 5,
// 		})
// 		return res
// 			.status(httpStatus.OK)
// 			.json({ message: 'SHOP CREATED' });
// 	} catch (error) {console.log(error);
	
// 		return res
// 			.status(httpStatus.INTERNAL_SERVER_ERROR)
// 			.json({ message: 'Error fetching user transactions:' });
// 	}
// } )



// const createUser = Asyncly(async (req, res) => {

// 	try {
// 		const user1 = await User.create({
// 			id: "4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
// 			username: 'user1',
// 			first_name: 'John',
// 			last_name: 'Doe',
// 			email: 'user1@example.com',
// 			section_order: 'Section A',
// 			password: 'password1',
// 			provider: 'local',
// 			profile_pic: 'pic1.jpg',
// 			refresh_token: 'token1',
// 			role_id: 1,
// 			token:"tokeneyaoeadoan",
// 			phone_number: "12345678912",
// 			is_verified: true,
// 			two_factor_auth: true,
// 			location: "Lagos",
// 			country: "Nigeria",
// 		  });
// 		  const user2 = await User.create({
// 			id: "a956799f-458d-49f0-a8b0-842e7c7e950d",
// 			username: 'user2',
// 			first_name: 'Jane',
// 			last_name: 'Smith',
// 			email: 'user2@example.com',
// 			section_order: 'Section B',
// 			password: 'password2',
// 			provider: 'local',
// 			profile_pic: 'pic2.jpg',
// 			refresh_token: 'token2',
// 			role_id: 1,
// 			token:"tokeneyaoeadoan",
// 			phone_number: "12345678912",
// 			is_verified: true,
// 			two_factor_auth: true,
// 			location: "Lagos",
// 			country: "Nigeria",
// 		  });
// 		return res
// 				.status(200)
// 				.json({ message: 'User created' });
// 	} catch (error) {
// 		console.log(error);
		
// 		return res
// 				.status(500)
// 				.json({ message: 'Error creating Product' });
// 	}
	
// });

// const createProduct = Asyncly(async (req, res) => {
// 	try {
// 		const product1 = await Product.create({
// 			id: "f7e1a7d3-6a53-4c0c-8959-ecdd86fbf3e8",
// 			user_id: "4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
// 			name: 'Product 1',
// 			description: 'Description for Product 1',
// 			quantity: 10,
// 			category: 1,
// 			price: 4500,
// 			discount_price: 15.99,
// 			is_published: true,
// 			currency: 'USD',
// 			shop_id: "5e8f65d7-d23b-4a5e-98ab-2f2590973c68",
// 			tax: 30,
// 			admin_status: ADMIN_STATUS.APPROVED,
// 			is_deleted: PRODUCT_STATUS.ACTIVE,
// 			average_rating: 4,
// 		  });
		  
		  
// 		  const product2 = await Product.create({
// 			id: "63e3e140-2749-4e21-9ede-d662a4d1b32a",
// 			user_id: "4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
// 			name: 'Product 2',
// 			description: 'Description for Product 2',
// 			quantity: 5,
// 			category: 2,
// 			price: 3000,
// 			discount_price: 500,
// 			is_published: false,
// 			currency: 'EUR',
// 			shop_id: "5e8f65d7-d23b-4a5e-98ab-2f2590973c68",
// 			tax: 30,
// 			admin_status: ADMIN_STATUS.APPROVED,
// 			is_deleted: PRODUCT_STATUS.ACTIVE,
// 			average_rating: 4,
// 		  });
// 		return res
// 				.status(200)
// 				.json({ message: 'Products created' });
// 	} catch (error) {
// 		console.log(error);
		
// 		return res
// 				.status(500)
// 				.json({ message: 'Error creating Product' });
// 	}
	
// });

// const createRole = Asyncly(async (req, res) => {
// 	try {
// 		const role = Role.create({
// 			id: 1,
// 			name: "customer"
// 		})
// 		res.status(httpStatus.OK).json({message: "Role created successfully"});	
// 	} catch (error) {
// 		console.log(error);
// 		return res
// 				.status(500)
// 				.json({ message: 'Error creating Product' });
// 	}
	
// });

// const createPromo = Asyncly(async (req, res) => {
// 	try {
// 		const promotion = Promotion.create({
// 			id: 1,
// 			user_id:"4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
// 			code: "EK56W8Y",
// 			promotion_type: "discount",
// 			discount_type: DiscountType.Fixed,
// 			quantity: 0,
// 			amount: 1000,
// 			valid_from: "2023-10-12T14:30:00",
// 			valid_to: "2023-11-12T14:30:00",
// 			maximum_discount_price: 1000
// 		  })
  
// 		  const promotion1 = Promotion.create({
// 			id: 2,
// 			user_id:"4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
// 			code: "EW56V8T",
// 			promotion_type: "discount",
// 			discount_type: DiscountType.Percentage,
// 			quantity: 0,
// 			amount: 5,
// 			valid_from: "2023-10-12T14:30:00",
// 			valid_to: "2023-11-12T14:30:00",
// 			maximum_discount_price: 1000,
// 		  })
// 		  return res
// 				.status(httpStatus.OK)
// 				.json({message: "Promotion created successfully"});	
// 	} catch (error) {
// 		console.log(error);
// 		return res
// 				.status(500)
// 				.json({ message: 'Error creating Product' });
// 	}
	
// });

// const createPromoProduct = Asyncly(async (req, res) => {
// 	try {
// 		const promoProduct = PromoProduct.create({
// 			id: 1,
// 			product_id: "33e0e140-2449-4e91-9eae-d662a7d1e32e",
// 			promo_id: 1,
// 			user_id: "4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
// 		  })
  
// 		  const promoProduct1 = PromoProduct.create({
// 			id: 2,
// 			product_id: "f7c1a7f3-6a53-4c0c-8959-ecdd87fbf3e9",
// 			promo_id: 2,
// 			user_id: "4e8f65c7-d21b-4a5e-98ab-2f2560973c34",
// 		  })
// 		  return res
// 					.status(httpStatus.OK)
// 					.json({message: "PromoProduct created successfully"});	
// 	} catch (error) {
// 		console.log(error);
// 		return res
// 				.status(500)
// 				.json({ message: 'Error creating Product' });
// 	}
	
// });