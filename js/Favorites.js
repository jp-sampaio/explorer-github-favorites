import { GithubUser } from "./GithubUser.js"

// Aqui vai aramazenar os dados da minha aplicação
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem
      ("@github-favorites")) || []
  }

  save() {
    localStorage.setItem("@github-favorites", JSON.stringify(this.entries))
  }

  // async await vai esperar algo ser executado que outra coisa execute, deixando a aplicação muito mais fluida                                                       
  async add(userName) {
    try {
      const userExists = this.entries.find( entry => entry.login === userName)

      if (userExists) {
        throw new Error("O usuário já foi cadastrato!")
      }

      const user = await GithubUser.search(userName)

      if (user.login === undefined) {
        throw new Error("Usuário não encontrato!")
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  // O filter se receber true retorna os elementos do array em um novo array, mais caso retorne false, vai retorna um array vazio;
  delete(user) {
    const filteredEntries = this.entries
    .filter( entry => entry.login !== user.login)

    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

// Vai mostrar o meu HTML 
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)
    this.tBody = document.querySelector("table tbody");
    this.update()
    this.onadd()
  }

  onadd() {
    const addButton = this.root.querySelector(".search .add")
    addButton.onclick = () => {
      const { value } = this.root.querySelector(".search #input-search")
      
      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    this.entries.forEach( user => {
      const row = this.createRow()

      row.querySelector(".user img").src = `https://github.com/${user.login}.png`
      row.querySelector(".user img").alt = `Imagem de ${user.name}`
      row.querySelector(".user a").href = `https://github.com/${user.login}`
      row.querySelector(".user a p").textContent = `${user.name}`
      row.querySelector(".user a span").textContent = `${user.login}`
      row.querySelector(".repositories").textContent = `${user.public_repos}`;
      row.querySelector(".followers").textContent = `${user.followers}`
      row.querySelector(".remove").onclick = () => {
        const isOk = confirm("Tem certeza que deseja excluir esse usuário");

        if( isOk ) {
          this.delete(user)
        }
      }

      this.tBody.append(row)
    })
  }

  createRow() {
    const tr = document.createElement("tr")

    tr.innerHTML = `
      <td class="user">
            <img src="https://github.com/jp-sampaio.png" alt="Imagem de João Paulo Sampaio">
            <a href="https://github.com/jp-sampaio" target="_blank">
              <p>João Paulo Sampaio</p>
              <span>jp-sampaio</span>
            </a>
          </td>
          <td class="repositories">75</td>
          <td class="followers">9</td>
          <td>
            <button class="remove">&times;</button>
          </td>
        </tr>
    `

    return tr
  }

  removeAllTr() {
    this.tBody.querySelectorAll("tr")
    .forEach( (tr) => {
      tr.remove()
    })
  }
}