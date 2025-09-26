import { Category, Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import { countries } from '../seed/seed-countries';

type FakeStoreProduct = {
	id: number;
	title: string;
	price: number;
	description: string;
	category: string;
	image: string;
	rating: { rate: number; count: number };
};

function mapCategory(category: string): Category {
	switch (category) {
		case "men's clothing":
			return Category.men_s_clothing;
		case "women's clothing":
			return Category.women_s_clothing;
		case 'electronics':
			return Category.electronics;
		case 'jewelery':
			return Category.jewelery;
		default:
			return Category.electronics;
	}
}

async function main() {
	console.log('Seeding products from fakestoreapi.com ...');

	const res = await fetch('https://fakestoreapi.com/products');
	
	if (!res.ok)
		throw new Error(`Fetch failed: ${res.status}`);
	
	const data = (await res.json()) as FakeStoreProduct[];

	// Limpieza de productos (y dependencias) antes de insertar
	await prisma.cartItem.deleteMany();	
	await prisma.product.deleteMany();

	await prisma.country.deleteMany();

	await prisma.country.createMany({ data: countries });

	const rows = data.map((p) => ({
		title: p.title,
		price: new Prisma.Decimal(p.price),
		description: p.description,
		category: mapCategory(p.category),
		image: p.image,
		rating: p.rating as unknown as Prisma.InputJsonValue,
	}));
	
	const created = await prisma.product.createMany({ data: rows });
	console.log(`Seed complete. Inserted products: ${created.count}`);
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});


