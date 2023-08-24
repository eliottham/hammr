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
      this.fire("login");
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
      await axios.post("/login", data);
      this.fire("login");
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
        // User is not logged in. Send empty user so that App will rerender
        this.fire("get-current-user", {
          _id: null,
          username: null,
          avatarUrl: null,
        });
      } else {
        this.checkError(e);
      }
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
        data.user.followers = response.data.followers;
        this.fire("get-user", data.user);
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
        data.user.followers = response.data.followers;
        this.fire("get-user", data.user);
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
      if (Object.keys(response.data).length === 0) {
        this.fire("require-spotify-authorization");
      } else {
        response.data.track = args?.track;
        this.fire("get-spotify-tokens", response.data);
      }
    } catch (e) {
      this.checkError(e);
    }
  }

  _checkForUpdatedSpotifyTokens({ spotifyAccessToken, track }) {
    // if expired tokens were refreshed on the server, fire the get-spotify-tokens event with the new token to recreate the Spotify web player
    if (spotifyAccessToken) {
      console.log("spotify token updated");
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

  async spotifyPlayTrack(track, queueTrackIndex) {
    const deviceId = this.spotifyDeviceId;
    if (!deviceId) {
      this.getSpotifyTokens({ track });
      return;
    }
    try {
      this.queueTrackIndex = queueTrackIndex;
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

  async editPost(data) {
    try {
      const response = await axios.put("/post", data);
      this.fire("get-post", response.data);
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

  async getPosts(params) {
    params = Object.assign(
      {
        category: "All",
        newest: true,
        top: false,
        posted: "Any Time",
      },
      params
    );
    try {
      const response = await axios.get("/posts", {
        params,
      });
      this.fire("get-posts", response.data);
    } catch (e) {
      this.checkError(e);
    }
  }

  async createComment(data) {
    try {
      const response = await axios.post("/comment", data);
      this.fire("create-comment", response.data);
      // if (response.data.post) {
      // this.fire("get-post", response.data.post);

      // }
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

  async getComments(params) {
    try {
      const response = await axios.get("/comments", {
        params,
      });
      this.fire("get-comments", {
        ...response.data,
        fromPost: !!params.post_id,
      });
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

  async search(query) {
    try {
      if (!query) {
        this.fire("search", { noSearch: true });
      } else {
        const response = await axios.get("/search", {
          params: {
            searchQuery: query,
          },
        });
        this.fire("search", response.data);
      }
    } catch (e) {
      this.checkError(e);
    }
  }

  async getLastXNotifications(params) {
    try {
      const response = await axios.get("/lastXNotifications", {
        params,
      });
      this.fire("last-x-notifications", response.data);
    } catch (e) {
      this.checkError(e);
    }
  }

  async getNotifications({ page = 1, limit = 20 }) {
    try {
      const response = await axios.get("/notifications", {
        page,
        limit,
      });
    } catch (e) {
      this.checkError(e);
    }
  }

  async updateNotificationsRead(data) {
    try {
      await axios.put("/notifications/read", data);
      this.fire("update-notifications-read");
    } catch (e) {
      this.checkError(e);
    }
  }
}

export default Client;
