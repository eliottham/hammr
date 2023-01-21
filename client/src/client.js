import Evt from "./evt";
import axios from "axios";

class Client extends Evt {
  checkError(e) {
    const status = e.response && e.response.status;
    if (status === 401) {
      // prompt login
      this.fire("require-authentication", e.response.data);
    } else if (status === 404) {
      // file not found page
      this.fire("not-found", e.response && e.response.data);
    } else if (status === 420) {
      // prompt spotify authorization
      this.fire("require-spotify-authorization");
    } else {
      // show error
      this.fire("error", e.response && e.response.data);
      // TODO: add error listener - check for error property and errors array
    }
  }

  async register(data) {
    try {
      await axios.post("/register", data);
    } catch (e) {
      if (e.response.status === 409) {
        this.fire("register-error", e.response.data);
      } else {
        this.checkError(e);
      }
    }
  }

  async login(data) {
    try {
      const response = await axios.post("/login", data);
      this.fire("login", response.data);
    } catch (e) {
      if (e.response.status === 401) {
        this.fire("login-error", e.response.data);
      } else {
        this.checkError(e);
      }
    }
  }

  async logout() {
    try {
      await axios.post("/logout");
      this.fire("logout");
    } catch (e) {
      this.checkError(e);
    }
  }

  // Returns only the current user's id and username
  async getCurrentUser() {
    try {
      const response = await axios.get("/current-user");
      this.fire("get-current-user", response.data);
    } catch (e) {
      if (e.response.status === 401) {
        this.fire("get-current-user", {
          _id: null,
          username: null,
        });
      }
      this.checkError(e);
    }
  }

  async getUser(user_id) {
    try {
      const response = await axios.get(`/user/${user_id}`);
      this.fire("get-user", response.data);
    } catch (e) {
      this.checkError(e);
    }
  }

  async uploadAvatar(blob) {
    const data = new FormData();
    data.append("avatar", blob);
    try {
      const response = await axios.post("/user/avatar", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      this.fire("avatar-change", response.data);
    } catch (e) {
      this.checkError(e);
    }
  }

  async deleteAvatar() {
    try {
      await axios.delete("/user/avatar");
      this.fire("avatar-change");
    } catch (e) {
      this.checkError(e);
    }
  }

  async submitUserProfileEdits(data) {
    try {
      const response = await axios.put("/user/edit", data);
      this.fire("get-user", response.data);
      this.fire("alert", {
        severity: "success",
        message: "Profile saved.",
      });
    } catch (e) {
      this.checkError(e);
    }
  }

  async follow(data) {
    try {
      const response = await axios.post("/follow", data);
      if (data.user) {
        this.fire("get-user", response.data);
      }
      return response.status;
    } catch (e) {
      this.checkError(e);
    }
  }

  async unfollow(data) {
    try {
      const response = await axios.post("/unfollow", data);
      if (data.user) {
        this.fire("get-user", response.data);
      }
      return response.status;
    } catch (e) {
      this.checkError(e);
    }
  }

  async getSpotifyTokens(args) {
    console.log("get spotify tokens");
    try {
      const response = await axios.get("/spotify-tokens");
      response.data.track = args.track;
      this.fire("get-spotify-tokens", response.data);
      return response.data;
    } catch (e) {
      this.checkError(e);
    }
  }

  _checkForUpdatedSpotifyTokens({ spotifyAccessToken, track }) {
    console.log("check for updated spotify tokens");
    // if expired tokens needed to be refreshed on the server,  fire the get-spotify-tokens event with the new token
    if (spotifyAccessToken) {
      this.fire("get-spotify-tokens", { spotifyAccessToken, track });
    }
  }

  async spotifySearch(q) {
    try {
      const response = await axios.post("/spotify-search", { q });
      this._checkForUpdatedSpotifyTokens(response.data);
      return response.data.tracks.items;
    } catch (e) {
      this.checkError(e);
      return [];
    }
  }

  async spotifyPlayTrack(track, deviceId) {
    if (!deviceId) {
      this.getSpotifyTokens({ track });
      return;
    }
    try {
      const response = await axios.post("/spotify-play-track", {
        track,
        deviceId,
      });
      this._checkForUpdatedSpotifyTokens({ ...response.data, track });
      if (response.status === 200) {
        this.fire("spotify-play-track", { track });
      }
    } catch (e) {
      this.checkError(e);
    }
  }

  async createPost(data) {
    try {
      const response = await axios.post("/post", data);
      this.fire("create-post", response.data);
    } catch (e) {
      this.checkError(e);
    }
  }

  async deletePost(post_id) {
    try {
      await axios.delete(`/post/${post_id}`);
      this.fire("delete-post");
    } catch (e) {
      this.checkError(e);
    }
  }

  async getPost(post_id) {
    try {
      const response = await axios.get(`/post/${post_id}`);
      this.fire("get-post", response.data);
    } catch (e) {
      this.checkError(e);
    }
  }

  // TODO: Add search parameters to have feed curated to user
  async getPosts() {
    try {
      const response = await axios.get("/posts");
      this.fire("get-posts", response.data);
    } catch (e) {
      this.checkError(e);
    }
  }

  async createComment(data) {
    try {
      const response = await axios.post("/comment", data);
      if (response.data.post) {
        this.fire("get-post", response.data.post);
      }
    } catch (e) {
      this.checkError(e);
    }
  }

  async editComment(data) {
    try {
      const response = await axios.put("/comment", data);
      this.fire("edit-comment", response.data);
    } catch (e) {
      this.checkError(e);
    }
  }

  async deleteComment(comment_id) {
    try {
      const response = await axios.delete(`/comment/${comment_id}`);
      if (response.data && response.data.post) {
        this.getPost(response.data.post);
      }
    } catch (e) {
      this.checkError(e);
    }
  }

  async like(data) {
    try {
      const response = await axios.post("/like", data);
      return response.status;
    } catch (e) {
      this.checkError(e);
    }
  }

  async dislike(data) {
    try {
      const response = await axios.post("/dislike", data);
      return response.status;
    } catch (e) {
      this.checkError(e);
    }
  }
}

export default Client;
