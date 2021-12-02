require('dotenv').config()

const port = Number(process.env.PORT)

const expiry_time = process.env.EXPIRY_TIME

const database_file = process.env.DATABASE_FILE

const hash_rounds = Number(process.env.HASH_ROUNDS)

const private_key_file = process.env.PRIVATE_KEY_FILE

const public_key_file = process.env.PUBLIC_KEY_FILE

if(!port || !expiry_time || !database_file || !hash_rounds || !private_key_file || !public_key_file)
{
	console.log("missing or invalid environment variables. Run setup.sh to generate a correct .env file")
	process.exit(1)
}

const bcrypt = require('bcrypt')
const dirty = require('dirty')
const express = require('express')
const fs = require('fs')
const jwt = require('jsonwebtoken')

const private_key = fs.readFileSync(private_key_file)

const public_key = fs.readFileSync(public_key_file)

const db = new dirty(database_file)

console.log('Public key is:')
console.log(public_key.toString('utf-8'))

const app = express()

app.get('/create', async (req, res) =>
{
	res.contentType('text/plain')
	const username = req.query.username
	const password = req.query.password

	if(!username || !password)
		return res.status(403).end('missing username or password')

	const db_ent = db.get(username)
	if(db_ent)
		return res.status(403).end(`username ${username} is already registered`)

	const hash = await bcrypt.hash(password, hash_rounds)
	user_data =
	{
		hash:hash,
		user:username,
		roles:['user',],
	}

	db.set(username, user_data)
	console.log(`registered ${username}`)
	res.status(200).end('ok')
})

app.get('/auth', async (req, res) =>
{
	res.contentType('text/plain')
	const username = req.query.username
	const password = req.query.password

	if(!username || !password)
		return res.status(403).end('missing username or password')

	const db_ent = db.get(username)
	if(!db_ent)
		return res.status(403).end('incorrect credentials')

	const {hash, ...user_data} = db_ent
	if(!await bcrypt.compare(password, hash))
		return res.status(403).end('incorrect credentials')

	const token = await jwt.sign(user_data, private_key,
	{
		algorithm:'RS256',
		expiresIn: expiry_time,
	})

	console.log(`authenticated ${username}`)
	res.status(200).end(token)
})

db.on('load', async () =>
{
	await app.listen(port)
	console.log(`listening on port ${port}`)
})
