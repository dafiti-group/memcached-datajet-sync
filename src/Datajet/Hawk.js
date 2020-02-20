'use strict'
const fetch = require('node-fetch')
const { URLSearchParams } = require('url')

class Hawk {
  constructor ({ token, user, pass, clientConfig }) {
    this.URL = 'https://hawk.use.k.datajet.io/v3/search/'
    this.AUTH_URL = 'https://oauth.datajet.io/oauth2/token'
    this.CLIENT_CONFIG = clientConfig || ''
    this.token = token || null
    this.user = user || null
    this.pass = pass || null
    this.res = null
  }

  setToken (token) {
    this.token = token
    return this
  }

  async auth (user, pass) {
    if (user) this.user = user
    if (pass) this.pass = pass

    const userPass = this.user + ':' + this.pass
    const userPassBase64 = Buffer.from(userPass).toString('base64')

    const params = new URLSearchParams()
    params.append('grant_type', 'client_credentials')
    params.append('scope', 'service/hawk.read')

    const json = await fetch(
      this.AUTH_URL,
      {
        method: 'POST',
        headers: {
          'cache-control': 'no-cache,no-cache',
          Authorization: 'Basic ' + userPassBase64,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      })
      .then(res => res.json())
      .catch(err => console.error('Error', err))

    this.token = json.access_token

    return this
  }

  async isAuth () {
    if (!this.token) return false
    if (!this.token) return false
    return true
  }

  async search (query) {
    if (!this.token) await this.auth

    let res = await this.query(query)

    if (res.status === 401) {
      await this.auth()
      res = this.query(query)
    }

    return res.then(res => res.json())
  }

  async query (query) {
    const res = await fetch(
      this.URL + this.CLIENT_CONFIG,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.token
        },
        body: query
      })

    return res
  }
}

module.exports = Hawk
