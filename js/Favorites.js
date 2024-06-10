import { GithubUser } from "./GithubUser.js"

class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
      
    if(this.entries.length === 0) {
      this.root.querySelector('.no-favorites.hide').classList.remove('hide')
      console.log('hide -> load')
    }
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {
      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('User already exists!!!')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('User not found!!!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

      if(this.entries.length !== 0) {
        this.root.querySelector('.no-favorites').classList.add('hide')
        console.log('add hide -> add')
      }

    } catch (error) {
      
    }
  }

 delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
    this.entries = filteredEntries
    this.update()
    this.save()

     if(this.entries.length === 0) {
      this.root.querySelector('.no-favorites.hide').classList.remove('hide')
      console.log('remove -> hide')
    }

    this.update()
    this.save()
  }
}


export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.tbody = this.root.querySelector('table tbody')

    this.load()
    this.onAdd()
    this.update()
  }


  onAdd() {
    const addButton = this.root.querySelector('.search button')

    addButton.addEventListener('click', () => {
      const { value } = this.root.querySelector('.search input')
      this.add(value)
      this.root.querySelector('.search input').value = ''
    })
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Image of ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers
      
      row.querySelector('.delete').addEventListener('click', () => {
        const isOkToDelete = confirm('Are you sure you want to delete?')

        if(isOkToDelete) {
          this.delete(user)
        }
      })

      this.tbody.append(row)
    })


  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
          <img src="" alt="">
          <a href="" target="_blank">
          <p></p>
          <span></span>
          </a>
      </td>
      <td class="repositories"></td>
      <td class="followers"></td>
      <td class="action">
          <button class="delete">Delete</button>
      </td>
    `

    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })
  }
}