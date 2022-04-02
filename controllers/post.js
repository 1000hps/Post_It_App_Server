import PostMessage from "../models/postMessage.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
  try {
    const allPosts = await PostMessage.find();
    res.status(200).json({
      message: "All posts fetched",
      posts: allPosts,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;
  const newPost = new PostMessage({
    ...post,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });
  // console.log("createPost controller: ");
  // console.log(newPost);

  try {
    await newPost.save();
    res.status(201).json({
      message: "A new post created",
      newPost: newPost,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

export const updatePost = async (req, res) => {
  const _id = req.params.id;
  const post = req.body;

  // Check if _id is valid
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No post with that id");
  }

  try {
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });
    res.status(200).json({
      message: "Post was updated successfully",
      updatedPost,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const deletePost = async (req, res) => {
  const _id = req.params.id;

  // Check if _id is valid
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No post with that id");
  }

  try {
    await PostMessage.findByIdAndDelete(_id);
    res.status(200).json({
      message: "Post was deleted successfully",
      deletedId: _id,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const likePost = async (req, res) => {
  const _id = req.params.id;

  // First check if user is authenticated: check req.userId
  if (!req.userId) {
    res.status(400).json({
      message: "User not authenticated",
    });
  }

  // Check if post _id is valid
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(404).send("No post with that id");
  }

  try {
    // Find the post with this id
    const post = await PostMessage.findById(_id);

    // Check if the user id is in the likes array of this post
    const index = post.likes.findIndex((item) => item === String(req.userId));

    if (index === -1) {
      // if user id is not in the likes list, we push it into the list
      post.likes.push(String(req.userId));
    } else {
      // if user id is already in the like list, we remove it from the list
      post.likes = post.likes.filter((item) => item !== String(req.userId));
    }

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });

    res.status(200).json({
      message: "Post likeCount was incremented successfully",
      updatedPost,
    });
  } catch (error) {
    console.log(error.message);
  }
};
