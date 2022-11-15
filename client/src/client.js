import Evt from "./evt";
import axios from "axios";

class Client extends Evt {
  checkError(e) {
    if (e.response && e.response.status === 401) {
      this.fire("require-authentication");
    }
  }

  async login({ email, password }) {
    try {
      const response = await axios({
        url: "/login",
        method: "post",
        data: {
          email,
          password,
        },
      });
      this.fire("login", response.data);
    } catch (e) {
      this.checkError(e);
    }
  }

  async getUser() {
    try {
      const response = await axios({
        url: "/user",
        method: "get",
      });
      this.fire("get-user", response.data);
    } catch (e) {
      this.checkError(e);
    }
  }

  async getSpotifyTokens(args) {
    try {
      const response = await axios({
        url: "/spotify-tokens",
        method: "get",
      });
      response.data.track = args.track;
      this.fire("get-spotify-tokens", response.data);
      return response.data;
    } catch (e) {
      this.checkError(e);
    }
  }

  _checkForUpdatedSpotifyTokens({ newTokens, spotifyAccessToken, track }) {
    // if expired tokens needed to be refreshed on the server, get the new tokens and fire the spotify-tokens event
    if (newTokens) {
      this.fire("get-spotify-tokens", { spotifyAccessToken, track });
    }
  }

  async spotifySearch(q) {
    try {
      const response = await axios({
        url: "/spotify-search",
        method: "post",
        data: { q },
      });
      this._checkForUpdatedSpotifyTokens(response.data);
      return response.data.tracks.items;
      // this.fire('spotify-search', { tracks });
    } catch (e) {
      this.checkError(e);
    }
  }

  async spotifyPlayTrack(track, deviceId) {
    if (!deviceId) {
      this.getSpotifyTokens({ track });
      return;
    }
    try {
      const response = await axios({
        url: "/spotify-play-track",
        method: "post",
        data: {
          track,
          deviceId,
        },
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
      const response = await axios({
        url: "/post",
        method: "post",
        data,
      });
      this.fire("create-post", response.data);
    } catch (e) {
      this.checkError(e);
    }
  }

  async getPost(postId) {
    try {
      const response = await axios({
        url: "/post",
        method: "get",
        params: {
          postId,
        },
      });
      this.fire("get-post", response.data);
    } catch (e) {
      this.checkError(e);
    }
  }
}

export default Client;
