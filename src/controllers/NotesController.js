import { connection } from "../database/knex/index.js"

export class NotesController {
  async create(req, res) {
    const { id, title, description, rating, tags } = req.body
    const user_id = req.user.id

    const note_id = await connection("movie_notes").insert({
      title,
      description,
      rating,
      user_id,
    })

    const insertTags = tags.map((name) => {
      return {
        note_id,
        user_id,
        name,
      }
    })

    await connection("movie_tags").insert(insertTags)

    if (id) {
      await connection("movie_notes").where({ id }).delete()
      return res.status(200).send(`Movie "${title}" updated.`)
    }

    return res.status(201).send(`Movie "${title}" inserted.`)
  }

  async show(req, res) {
    const { id } = req.params
    const user_id = req.user.id

    const note = await connection("movie_notes").where({ id }).first()
    const tags = await connection("movie_tags")
      .where({ note_id: id })
      .orderBy("name")
    const user = await connection("users")
      .select(["name", "avatar"])
      .where({ id: user_id })
    return res.json({
      ...note,
      ...user[0],
      tags,
    })
  }

  async delete(req, res) {
    const { id } = req.params

    await connection("movie_notes").where({ id }).delete()

    return res.send(`Note deleted successfully.`)
  }

  async index(req, res) {
    const { title, tag } = req.query
    const user_id = req.user.id
    let notes

    if (tag) {
      notes = await connection("movie_tags")
        .select([
          "movie_notes.id",
          "movie_notes.title",
          "movie_notes.description",
          "movie_notes.rating",
          "movie_notes.user_id",
        ])
        .where("movie_notes.user_id", user_id)
        .whereLike("name", `%${tag}%`)
        .groupBy("movie_tags.note_id")
        .innerJoin("movie_notes", "movie_notes.id", "movie_tags.note_id")
        .orderBy("movie_notes.title")
    } else if (title) {
      notes = await connection("movie_notes")
        .where({ user_id })
        .whereLike("title", `%${title}%`)
        .orderBy("title")
    } else {
      notes = await connection("movie_notes")
        .where({ user_id })
        .orderBy("id", "desc")
    }

    const userTags = await connection("movie_tags").where({ user_id })
    const notesWithTags = notes.map((note) => {
      const noteTags = userTags.filter((tag) => tag.note_id === note.id)

      return {
        ...note,
        tags: noteTags,
      }
    })

    return res.json(notesWithTags)
  }
}
