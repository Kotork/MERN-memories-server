import mongoose from 'mongoose'

import PostMessage from '../models/postMessage.js'

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find()

    res.status(200).json(postMessages)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
}

export const createPost = async (req, res) => {
  const post = req.body

  const newPost = new PostMessage({ ...post, creator: req.userId })

  try {
    await newPost.save()

    res.status(201).json(newPost)
  } catch (error) {
    res.status(409).json({ message: error.message })
  }
}

export const updatePost = async (req, res) => {
  const { id } = req.params
  const post = req.body

  // Check if id is a valid (mongoose )
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No post with that id')
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })

  res.json(updatedPost)
}

export const deletePost = async (req, res) => {
  const { id } = req.params

  // Check if id is a valid (mongoose )
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No post with that id')
  }

  await PostMessage.findByIdAndRemove(id)

  res.json({ message: 'Post deleted successfully' })
}

export const likePost = async (req, res) => {
  const { id } = req.params

  if (!req.userId) {
    return res.json({ message: 'Unauthenticated' })
  }

  // Check if id is a valid (mongoose )
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('No post with that id')
  }

  const post = await PostMessage.findById(id)

  const index = post.likes.findIndex( id => id === String(req.userId))

  if (index === -1) {
    // Like the post
    post.likes.push(req.userId)
  } else {
    // Dislike the post
    post.likes = post.likes.filter( id => id !== String(req.userId))
  }

  const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true })

  res.json(updatedPost)
}