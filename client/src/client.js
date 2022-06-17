import Evt from './evt';
import axios from 'axios';

class Client extends Evt {

  async login({ email, password }) {
    try {
      const response = await axios({
        url: '/login',
        method: 'post',
        data: {
          email,
          password
        }
      });
      this.fire('login', response.data);
    } catch (err) {
      // TODO
    }
  }

  async getUser() {
    try {
      const response = await axios({
        url: '/user',
        method: 'get'
      })
      this.fire('user', response.data)
    } catch (err) {
      // TODO
    }
  }

  async getSpotifyTokens() {
    try {
      const response = await axios({
        url: '/spotifyTokens',
        method: 'get',
      });
      this.fire('spotify-tokens', response.data)
      return response.data
    } catch (err) {
      // TODO
    }
  }

  _checkForNewTokens(response) {
    // if expired tokens needed to be refreshed on the server, get the new tokens and fire the spotify-tokens event
    if (response.newTokens) {
      this.getSpotifyTokens()
    }
  }

  async spotifySearch(q) {
    try {
      const response = await axios({
        url: '/spotifySearch',
        method: 'post',
        data: { q }
      });
      this._checkForNewTokens(response)
      const tracks = response.data.response.tracks.items
      this.fire('spotify-search', tracks)
    } catch (err) {
      // TODO
    }
  }

  async playSpotifyTrack(track, deviceId) {
    try {
      const response = await axios({
        url: '/playSpotifyTrack',
        method: 'post',
        data: {
          track,
          deviceId
        }
      })
      this._checkForNewTokens(response)
      if (response.status === 200) {
        this.fire('play-spotify-track')
      }
    } catch (err) {
      // TODO
    }
  }

}

export default Client;