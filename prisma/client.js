const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main(argument) {
	// const folders = await prisma.folder.deleteMany()
	// console.log('USERS:\n',folders)

}
main()
module.exports = prisma;
