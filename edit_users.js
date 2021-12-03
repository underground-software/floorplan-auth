require('dotenv').config()

const dirty = require('dirty')

const db = new dirty(process.env.DATABASE_FILE)

const usage = () =>
{
	console.error('Usage:')
	console.error(`${process.argv[0]} get username`)
	console.error('or')
	console.error(`${process.argv[0]} set username role1 role2 role3 ...`)
	process.exit(1)
}

if(process.argv.length < 4)
	usage()
db.on('load', () =>
{
	if(process.argv[2] === 'get')
	{
		const user = process.argv[3]
		const db_ent = db.get(user)
		if(!db_ent)
		{
			console.error(`user ${user} is not in the database`)
			process.exit(1)
		}
		const {roles, ...others} = db_ent
		console.error(`user ${user} has the following roles:`)
		for(const role of roles)
			console.error(role)
		db.close()
	}
	else if(process.argv[2] === 'set')
	{
		const user = process.argv[3]
		db.update(user, (db_ent) =>
		{
			if(!db_ent)
			{
				console.error(`user ${user} is not in the database`)
				process.exit(1)
			}
			const {roles, ...others} = db_ent
			others.roles = process.argv.slice(4)
			return others
		})
		db.close()
	}
	else
		usage()
})
