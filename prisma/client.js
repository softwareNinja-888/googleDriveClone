const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(argument) {
	// const users = await prisma.user.findMany()
	// console.log('USERS:\n',users)
	
}
main()
module.exports = prisma;
