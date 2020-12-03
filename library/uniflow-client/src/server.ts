import * as express from "express"
import config from "./config"

export default async function server() {
  const PORT = config.get("port")

  const app = express()
  app.use("/", express.static("./public"))

  return new Promise((resolve: any) => {
    app.on("error", (err: any) => {
      console.log(err)
      process.exit(1)
    })
    app.listen(PORT, resolve)
  })
}
