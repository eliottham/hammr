require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require("./models/user.model.js");
const Post = require("./models/post.model.js");
const Comment = require("./models/comment.model.js");
// const Profile = require("./modles/profile.model.js");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const axios = require("axios");
const bodyParser = require("body-parser");
const upload = require("multer")();
const cloudinary = require("cloudinary");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
const { Readable } = require("stream");

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());

// // Add headers before the routes are defined
// app.use(function (req, res, next) {

//   // Website you wish to allow to connect
//   res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')

//   // Request methods you wish to allow
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

//   // Request headers you wish to allow
//   res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type')

//   // Set to true if you need the website to include cookies in the requests sent
//   // to the API (e.g. in case you use sessions)
//   res.setHeader('Access-Control-Allow-Credentials', true)

//   // Pass to next layer of middleware
//   next()
// })

mongoose.connect("mongodb://localhost:27017/zam");

app.get("/token", (req, res) =>
  res.json({ status: 200, token: req.cookies.token })
);

app.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        username: user.username,
      },
      // JWT_SECRET,
      process.env.JWT_SECRET,
      {
        expiresIn: "72h",
      }
    );
    res.cookie("token", token, { httpOnly: true });
    res.sendStatus(200);
  } catch (err) {
    // duplicate key error
    if (err.code === 11000) {
      res.status(409).json({ errorFields: Object.keys(err.keyValue) });
    } else {
      res.status(500).json(err);
    }
  }
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (user) {
      const token = jwt.sign(
        {
          _id: user._id,
          email: user.email,
          username: user.username,
        },
        // JWT_SECRET,
        process.env.JWT_SECRET,
        {
          expiresIn: "72h",
        }
      );
      res.cookie("token", token, { httpOnly: true });
      res.sendStatus(200);
    } else {
      res.status(401).json({
        error: "Incorrect username or password",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.end();
});

function useAuth(handler) {
  return async (req, res) => {
    try {
      const token = req.cookies["token"];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(new ObjectId(decoded._id));
      handler(req, res, user);
    } catch (err) {
      res.status(401).send("You must be logged in to continue");
    }
  };
}

function generateRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

async function getAndUpdateSpotifyTokens(user, code) {
  const params = code
    ? {
        code: code || null,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        grant_type: "authorization_code",
      }
    : {
        grant_type: "refresh_token",
        refresh_token: user.spotifyRefreshToken,
      };
  try {
    const response = await axios({
      url: "https://accounts.spotify.com/api/token",
      method: "post",
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            process.env.SPOTIFY_CLIENT_ID +
              ":" +
              process.env.SPOTIFY_CLIENT_SECRET_KEY
          ).toString("base64"),
      },
      params: params,
    });
    let spotifyAccessToken, spotifyRefreshToken;
    if (response.status === 200) {
      if (response.data.access_token && response.data.refresh_token) {
        spotifyAccessToken = response.data.access_token;
        spotifyRefreshToken = response.data.refresh_token;
        await user.updateOne({
          spotifyAccessToken: spotifyAccessToken,
          spotifyRefreshToken: spotifyRefreshToken,
        });
      } else if (response.data.access_token) {
        spotifyAccessToken = response.data.access_token;
        await user.updateOne({
          spotifyAccessToken: spotifyAccessToken,
        });
      }
    }
    return {
      spotifyAccessToken,
      spotifyRefreshToken,
    };
  } catch (err) {
    console.log(err);
    return {};
  }
}

app.get(
  "/spotify-tokens",
  useAuth(async (req, res, user) => {
    res.json(await getAndUpdateSpotifyTokens(user));
  })
);

app.get(
  "/spotify-authorization-callback",
  useAuth((req, res, user) => {
    const state = req.query.state || null;
    if (state === null) {
      res
        .redirect(
          "/#" +
            new URLSearchParams({
              error: "state_mismatch",
            })
        )
        .toString();
    } else {
      getAndUpdateSpotifyTokens(user, req.query.code);
      res.redirect("http://localhost:3000/");
    }
  })
);

app.get("/spotify-authorization", (req, res) => {
  const state = generateRandomString(16);
  const scope = process.env.SPOTIFY_USER_SCOPE;
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      new URLSearchParams({
        response_type: "code",
        client_id: process.env.SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: process.env.SPOTIFY_REDIRECT_URI,
        state: state,
        show_dialog: true,
      }).toString()
  );
});

function spotifyApi(args) {
  args.spotifyRequest.headers = {
    Authorization: `Bearer ${args.user.spotifyAccessToken}`,
  };
  axios(args.spotifyRequest)
    .then((response) => {
      // add the new token if it exists to the response so the client can recreate the web player with the token authentication
      if (args.spotifyAccessToken) {
        response.data.spotifyAccessToken = args.spotifyAccessToken;
      }
      args.success(response.data);
    })
    .catch(async (error) => {
      if (typeof error.toJSON === "function") {
        error = await error.toJSON();
      }
      // Bad or expired token, need to re-authenticate with refresh token
      if (error.status === 401) {
        let { spotifyAccessToken } = await getAndUpdateSpotifyTokens(args.user);
        // new tokens have been added to user in db by getAndUpdateSpotifyTokens(), but use returned values to avoid another db lookup for the updated user
        if (spotifyAccessToken) {
          args.spotifyAccessToken = spotifyAccessToken;
          spotifyApi(args);
        } else {
          // no tokens found, spotify authorization required
          args.failure({
            status: 420,
            statusMessage: "Spotify Authorization Required",
            data: {
              error: "Spotify Authorization Required",
            },
          });
        }
      } else {
        args.failure({
          status: error.status,
          statusMessage: error.statusText,
          data: error.data,
        });
      }
    });
}

app.post(
  "/spotify-search",
  useAuth((req, res, user) => {
    spotifyApi({
      user,
      spotifyRequest: {
        url: "https://api.spotify.com/v1/search",
        method: "get",
        params: {
          q: req.body.q,
          type: req.body.type || "album,artist,track",
        },
      },
      success: (response) => {
        res.status(200).json(response);
      },
      failure: (response) => {
        console.log(response);
        res.statusMessage = response.statusMessage;
        res.status(response.status).json(response.data);
      },
    });
  })
);

app.post(
  "/spotify-get-tracks",
  useAuth((req, res, user) => {
    spotifyApi({
      user,
      spotifyRequest: {
        url: "https://api.spotify.com/v1/tracks/",
        method: "get",
        params: {
          id: req.body.id,
        },
      },
      success: (response) => {
        res.status(200).json(response);
      },
      failure: (response) => {
        console.log(response);
        res.statusMessage = response.statusMessage;
        res.status(response.status).json(response.data);
      },
    });
  })
);

app.post(
  "/spotify-play-track",
  useAuth((req, res, user) => {
    const { track, deviceId } = req.body;
    spotifyApi({
      user,
      spotifyRequest: {
        url: `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        method: "put",
        data: {
          uris: [track.uri],
        },
      },
      success: (response) => {
        res.status(200).json(response);
      },
      failure: (response) => {
        console.log(response);
        res.statusMessage = response.statusMessage;
        res.status(response.status).json(response.data);
      },
    });
  })
);

app.get("/current-user", async (req, res) => {
  const currentUser = {
    _id: null,
    username: null,
    spotifyAuthorized: false,
  };
  try {
    const token = req.cookies["token"];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(new ObjectId(decoded._id));
      currentUser._id = user._id;
      currentUser.username = user.username;
      currentUser.spotifyAuthorized = !!user.spotifyAccessToken;
      currentUser.avatarUrl = user.avatarUrl;
    }
    res.status(200).json(currentUser);
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      res.status(401).json(currentUser);
    } else {
      res.status(500).send(err);
    }
  }
});

app.get("/user/:user_id", async (req, res) => {
  try {
    const user = await User.findById(new ObjectId(req.params.user_id))
      .lean()
      .populate("posts")
      .populate("comments");
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get("/user/:user_id/content", async (req, res) => {
  try {
    const user = await User.findById(new ObjectId(req.params.user_id))
      .lean()
      .populate("posts")
      .populate("comments");
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.post(
  "/user/avatar",
  upload.single("avatar"),
  useAuth((req, res, user) => {
    try {
      const cloudinaryUploadStream = cloudinary.v2.uploader.upload_stream(
        { folder: "avatars" },
        async (err, image) => {
          if (err) {
            console.log(err);
            res.status(500).send(err);
          }
          if (image) {
            cloudinary.v2.uploader.destroy(user.avatarPublicId, {
              invalidate: true,
            });
            await user.updateOne({
              avatarUrl: image.secure_url,
              avatarPublicId: image.public_id,
            });
            res.status(200).json({ newAvatarUrl: image.secure_url });
          }
        }
      );
      Readable.from(req.file.buffer).pipe(cloudinaryUploadStream);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

app.delete(
  "/user/avatar",
  useAuth(async (req, res, user) => {
    try {
      cloudinary.v2.uploader.destroy(user.avatarPublicId, {
        invalidate: true,
      });
      await user.updateOne({
        avatarUrl: "",
        avatarPublicId: "",
      });
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

app.put(
  "/user/edit",
  useAuth(async (req, res, user) => {
    const { firstName, lastName, username, bio } = req.body;
    try {
      let updatedUser = await User.findByIdAndUpdate(
        user._id,
        {
          firstName: firstName,
          lastName: lastName,
          username: username,
          bio: bio,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      console.log(err);
      // duplicate key error
      if (err.code === 11000) {
        res.status(409).json({ errorFields: Object.keys(err.keyValue) });
      } else {
        res.status(500).json(err);
      }
    }
  })
);

app.post(
  "/follow",
  useAuth(async (req, res, user) => {
    const targetUser = req.body.user;
    try {
      if (targetUser._id) {
        await user
          .updateOne({
            $push: { following: new ObjectId(targetUser._id) },
          })
          .lean();
        const targetUserDocument = await User.findByIdAndUpdate(
          targetUser._id,
          {
            $push: { followers: user._id },
          },
          { new: true }
        ).lean();
        res.status(200).json(targetUserDocument);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

app.post(
  "/unfollow",
  useAuth(async (req, res, user) => {
    const targetUser = req.body.user;
    try {
      if (targetUser._id) {
        await user
          .updateOne({
            $pull: { following: new ObjectId(targetUser._id) },
          })
          .lean();
        const targetUserDocument = await User.findByIdAndUpdate(
          targetUser._id,
          {
            $pull: { followers: user._id },
          },
          { new: true }
        ).lean();
        res.status(200).json(targetUserDocument);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

app.post(
  "/post",
  useAuth(async (req, res, user) => {
    const { title, spotifyTrack, description } = req.body;
    try {
      const post = await Post.create({
        author: user._id,
        title,
        spotifyTrack,
        description,
      });
      res.status(200).json(post);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

app.put(
  "/post",
  useAuth(async (req, res, user) => {
    const { post_id, description } = req.body;
    try {
      const post = await Post.findByIdAndUpdate(
        post_id,
        { description },
        { new: true }
      )
        .lean()
        .populate("author")
        .populate({
          path: "comments",
          populate: {
            path: "author",
          },
        });
      res.status(200).json(post);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

app.delete(
  "/post/:post_id",
  useAuth(async (req, res, user) => {
    try {
      const post = await Post.findById(new ObjectId(req.params.post_id));
      if (post.author.equals(user._id)) {
        await post.deleteOne();
        res.sendStatus(200);
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

app.get("/post/:post_id", async (req, res) => {
  try {
    const post = await Post.findById(new ObjectId(req.params.post_id))
      .lean()
      .populate("author");
    post ? res.status(200).json(post) : res.status(404).send("Post not found");
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.get("/posts/", async (req, res) => {
  const { category, newest, top, posted, page, user_id } = req.query;
  let user;
  if (category === "Following") {
    try {
      const token = req.cookies["token"];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(new ObjectId(decoded._id));
    } catch (err) {
      res.status(401).send("You must be logged in to continue");
      return;
    }
  }
  try {
    const pipeline = [];
    if (user_id) {
      pipeline.push({
        $match: {
          author: new ObjectId(user_id),
        },
      });
    }
    if (category === "Following") {
      pipeline.push({
        $match: {
          author: {
            $in: user.following,
          },
        },
      });
    }
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    });
    pipeline.push({
      $unwind: "$author",
    });
    if (newest === "true") {
      pipeline.push({
        $addFields: {
          date: {
            $dateFromParts: {
              year: { $year: "$creationDate" },
              month: { $month: "$creationDate" },
              day: { $dayOfMonth: "$creationDate" },
            },
          },
        },
      });
      pipeline.push({
        $sort: {
          date: -1,
        },
      });
    } else if (top === "true") {
      if (posted === "All Time") {
        pipeline.push({
          $sort: {
            likedUsers: -1,
          },
        });
      } else {
        let startDate = new Date();
        let endDate = new Date();
        endDate.setDate(endDate.getDate() + 1);
        if (posted === "This Year") {
          startDate.setFullYear(new Date().getFullYear() - 1);
        } else if (posted === "This Month") {
          startDate.setMonth(startDate.getMonth() - 1);
        } else if (posted === "This Week") {
          startDate.setDate(startDate.getDate() - 7);
        }
        // const ISOStringTime = "T00:00:00.000+00:00";
        const ISOStringTime = "T00:00:00.000Z";
        startDate = startDate.toISOString().substring(0, 10) + ISOStringTime;
        endDate = endDate.toISOString().substring(0, 10) + ISOStringTime;
        pipeline.push({
          $match: {
            creationDate: {
              $gte: new Date(startDate),
              $lt: new Date(endDate),
            },
          },
        });
        pipeline.push({
          $sort: {
            likedUsers: -1,
          },
        });
      }
    }
    let result = await Post.aggregatePaginate(Post.aggregate(pipeline), {
      page,
      limit: 20,
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.post(
  "/comment",
  useAuth(async (req, res, user) => {
    const { spotifyTrack, comment, post_id } = req.body;
    try {
      const newComment = await Comment.create({
        author: user._id,
        post: new ObjectId(post_id),
        spotifyTrack,
        comment,
      });
      // if the comment was made on a post, return the post in the comment to rerender
      if (post_id) {
        await newComment.populate({
          path: "post",
          populate: {
            path: "comments",
            populate: {
              path: "author",
            },
          },
        });
      }
      res.status(200).json(newComment);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

app.put(
  "/comment",
  useAuth(async (req, res, user) => {
    const { originalComment, spotifyTrack, comment } = req.body;
    try {
      if (user._id.equals(new ObjectId(originalComment.author._id))) {
        const data = {
          creationDate: new Date().toISOString(),
          edited: true,
        };
        if (spotifyTrack?.id !== originalComment.spotifyTrack?.id) {
          data.spotifyTrack = spotifyTrack;
        }
        if (comment !== originalComment.comment) {
          data.comment = comment;
        }
        if (data.spotifyTrack || data.comment) {
          const newComment = await Comment.findByIdAndUpdate(
            originalComment._id,
            data,
            { new: true } // return updated doc
          ).populate("author");
          res.status(200).json(newComment);
        } else {
          res.status(200).json(originalComment);
        }
      } else {
        res.status(403).send("You are not authorized to edit this comment");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

app.get("/comments", async (req, res, user) => {
  const { post_id, user_id, page } = req.query; // top, newest, bottom, oldest
  const sortBy = req.query.sortBy || "top";
  const pipeline = [];
  try {
    if (post_id) {
      pipeline.push({
        $match: {
          post: new ObjectId(post_id),
        },
      });
    } else if (user_id) {
      pipeline.push({
        $match: {
          author: new ObjectId(user_id),
        },
      });
    }
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    });
    pipeline.push({
      $unwind: "$author",
    });
    if (sortBy === "top" || sortBy === "bottom") {
      pipeline.push({
        $sort: { likedUsers: sortBy === "top" ? -1 : 1 },
      });
    } else if (sortBy === "newest" || sortBy === "oldest") {
      pipeline.push({
        $addFields: {
          date: {
            $dateFromParts: {
              year: { $year: "$creationDate" },
              month: { $month: "$creationDate" },
              day: { $dayOfMonth: "$creationDate" },
            },
          },
        },
      });
      pipeline.push({
        $sort: {
          date: sortBy === "newest" ? -1 : 1,
        },
      });
    }
    let result = await Comment.aggregatePaginate(Comment.aggregate(pipeline), {
      page,
      limit: 20,
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.delete(
  "/comment/:comment_id",
  useAuth(async (req, res, user) => {
    try {
      const comment = await Comment.findById(
        new ObjectId(req.params.comment_id)
      );
      if (user._id.equals(comment.author)) {
        const deletedComment = await comment.deleteOne();
        res.status(200).json(deletedComment);
      } else {
        res.status(403).send("You are not authorized to delete this comment");
      }
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

app.post(
  "/like",
  useAuth(async (req, res, user) => {
    const { post, comment } = req.body;
    try {
      if (post) {
        await user.updateOne({
          $push: { likedPosts: new ObjectId(post._id) },
        });
        await Post.findByIdAndUpdate(post._id, {
          $push: { likedUsers: user._id },
        });
      } else if (comment) {
        await user.updateOne({
          $push: { likedComments: new ObjectId(comment._id) },
        });
        await Comment.findByIdAndUpdate(comment._id, {
          $push: { likedUsers: user._id },
        });
      }
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

app.post(
  "/dislike",
  useAuth(async (req, res, user) => {
    const { post, comment } = req.body;
    try {
      if (post) {
        await user.updateOne({
          $pull: { likedPosts: new ObjectId(post._id) },
        });
        await Post.findByIdAndUpdate(post._id, {
          $pull: { likedUsers: user._id },
        });
      } else if (comment) {
        await user.updateOne({
          $pull: { likedComments: new ObjectId(comment._id) },
        });
        await Comment.findByIdAndUpdate(comment._id, {
          $pull: { likedUsers: user._id },
        });
      }
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.status(500).send(err);
    }
  })
);

app.get("/search", async (req, res) => {
  const { searchQuery } = req.query;
  try {
    const [users, posts] = await Promise.all([
      User.find({
        $or: [
          {
            $text: {
              $search: searchQuery,
            },
          },
          {
            username: {
              $regex: searchQuery,
              $options: "i",
            },
          },
          {
            firstName: {
              $regex: searchQuery,
              $options: "i",
            },
          },
          {
            lastName: {
              $regex: searchQuery,
              $options: "i",
            },
          },
        ],
      }),
      Post.find({
        $or: [
          {
            $text: {
              $search: searchQuery,
            },
          },
          {
            "spotifyTrack.name": {
              $regex: searchQuery,
              $options: "i",
            },
          },
          {
            "spotifyTrack.artists.name": {
              $regex: searchQuery,
              $options: "i",
            },
          },
          {
            title: {
              $regex: searchQuery,
              $options: "i",
            },
          },
        ],
      }).populate("author"),
    ]);
    res.status(200).json({ users, posts });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

app.listen(1337, () => {
  console.log("Server started on 1337");
});
