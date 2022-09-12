import serverlessMysql from "serverless-mysql"
import { createHash } from "crypto";

const hast = (input: string) => createHash('sha256').update(input).digest('hex');

export async function login(creditential: Record<"username" | "password", string>) {

  const mysql = serverlessMysql()

  mysql.config({
    host: process.env.ENDPOINT,
    database: process.env.DATABASE,
    //@ts-ignore
    port: process.env.PORT,
    user: process.env.USERNAME,
    password: process.env.PASSWORD
  })
  //console.log(hast(creditential.password))
  //console.log(creditential)
  const results = await mysql.query(`SELECT * FROM users WHERE username="${creditential.username}" AND password="${hast(creditential.password)}";`)

  await mysql.end()
  //console.log(results])
  //@ts-ignore
  return results[0];
}

export async function exist(creditential: { email: string, username: string }) {

  const mysql = serverlessMysql()

  mysql.config({
    host: process.env.ENDPOINT,
    database: process.env.DATABASE,
    //@ts-ignore
    port: process.env.PORT,
    user: process.env.USERNAME,
    password: process.env.PASSWORD
  })

  const results = await mysql.query(`SELECT * FROM users WHERE username="${creditential.username}" OR email="${creditential.email}";`)

  await mysql.end()
  console.log(results)
  //@ts-ignore
  return (results[0] !== null);
}

export async function create(creditential: { username: string, email: string, password: string }) {

  const mysql = serverlessMysql()

  mysql.config({
    host: process.env.ENDPOINT,
    database: process.env.DATABASE,
    //@ts-ignore
    port: process.env.PORT,
    user: process.env.USERNAME,
    password: process.env.PASSWORD
  })

  const results = await mysql.query(`INSERT INTO users (username, email, password) VALUES ('${creditential.username}', '${creditential.email}', '${hast(creditential.password)}');`)

  await mysql.end()
  return results;
}
