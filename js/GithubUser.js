export class GithubUser {
  static async search(username) {
    const endPoint = `https://api.github.com/users/${username}`

    return fetch(endPoint)
      .then(data => data.json())
      .then(({login, name, public_repos, followers}) => ({
          login,
          name,
          public_repos,
          followers
        }))
  }
}