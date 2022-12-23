import Evt from "./evt";
import axios from "axios";

class Client extends Evt {
  checkError(e) {
    const status = e.response && e.response.status;
    if (status === 401) {
      // prompt login
      this.fire("require-authentication");
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

  async getCurrentUser() {
    try {
      const response = await axios.get("/current-user");
      this.fire("get-current-user", response.data);
    } catch (e) {
      this.fire("get-current-user");
    }
  }

  async getSpotifyTokens(args) {
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
      const response = await axios.delete(`/post/${post_id}`);
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
      await axios.post("/like", data);
    } catch (e) {
      this.checkError(e);
    }
  }

  async dislike(data) {
    try {
      await axios.post("/dislike", data);
    } catch (e) {
      this.checkError(e);
    }
  }
}

export default Client;
