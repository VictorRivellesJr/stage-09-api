import { connection } from "../database/knex/index.js"

export class TagsController {
  async index(req, res) {
    const user_id = req.user.id

    const tags = await connection("movie_tags").where({ user_id })

    return res.json(tags)
  }
}
