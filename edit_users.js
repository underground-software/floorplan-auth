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

//const readline = require('readline')
//
//const rl = readline.createInterface({input:process.stdin,output:process.stderr,})
//
////const get_roles = (new_roles) =>
////{
////	let role = null
////	rl.setPrompt('Role:')
////	rl.prompt()
////	rl.on('line', (line) =>
////	{
////		role = line
////		rl.pause()
////	})
////	rl.on('pause', () =>
////	{
////		if(!role)
////			return
////		new_roles.push(role)
////		get_roles(new_roles)
////	})
////}
//
//const get_user = () =>
//{
//	rl.question('User:', (user) =>
//	{
//		if(!user)
//			return
//		const db_ent = db.get(user)
//		if(!db_ent)
//		{
//			console.error(`There is no user ${user} in the database`)
//			return get_user()
//		}
//		else
//		{
//			const {roles, ...others} = db_ent
//			console.error(`User ${user} has the following roles:`)
//			for(const role of roles)
//				console.error(role)
//			console.error('Enter the new list of roles one at a time. Hit enter without typing anything to finish')
//			const new_roles = []
//			rl.setPrompt('Role:')
//			rl.prompt()
//			rl.on('line', (line) =>
//			{
//				if(line)
//				{
//					new_roles.push(line)
//					rl.prompt()
//				}
//				else
//				{
//					others.roles = new_roles
//					db.rm(user)
//					db.set(user,others)
//					return get_user()
//				}
//			})
//		}
//	})
//}
//
////const get_user = () =>
////{
////	let user = null
////	rl.setPrompt('User:')
////	rl.prompt()
////	rl.on('line', (line) =>
////	{
////		user = line
////		rl.pause()
////	})
////	rl.on('pause', () =>
////	{
////		if(!user)
////			return
////		const db_ent = db.get(user)
////		if(!db_ent)
////			console.error(`There is no user ${user} in the database`)
////		else
////		{
////			const {roles, ...others} = db_ent
////			console.error(`User ${user} has the following roles:`)
////			for(const role of roles)
////				console.error(role)
////			console.error('Enter the new list of roles one at a time. Hit enter without typing anything to finish')
////			const new_roles = []
////			get_roles(new_roles)
////			others.roles = new_roles
////			db.set(user,others)
////		}
////		get_user()
////	})
////}
//
//console.log('Enter a username to edit their roles')
//get_user()
//
////const get_roles = (new_roles) =>
////{
////	const my_rl = readline.createInterface({input:process.stdin,output:process.stderr,})
////	my_rl.question('Role: ', (role) =>
////	{
////		if(!role)
////		{
////			my_rl.close()
////			return
////		}
////		new_roles.push(role)
////		get_roles(new_roles);
////	})
//////	return await get_roles(new_roles);
//////	, (role) =>
//////	{
//////		if(!role)
//////			return
//////		new_roles.push(role)
//////		return get_roles(new_roles)
//////	})
////}
////
////
////const update = () =>
////{
////	rl.question('Enter a username to edit their roles: ', async (user) =>
////	{
////		if(!user)
////			process.exit(0)
////		const db_ent = db.get(user)
////		if(!db_ent)
////			console.error(`There is no user ${user} in the database`)
////		else
////		{
////			const {roles, ...others} = db_ent
////			console.error(`User ${user} has the following roles:`)
////			for(const role of roles)
////				console.error(role)
////			console.error('Enter the new list of roles one at a time. Hit enter without typing anything to finish')
////			const new_roles = []
////			get_roles(new_roles)
////			others.roles = new_roles
////			db.set(user,others)
////		}
////		update()
////	})
////}
////
////const list = []
////get_roles(list)
////console.log(list)
