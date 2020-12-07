const BASE_URL = "https://lighthouse-user-api.herokuapp.com/"
const INDEX_URL = BASE_URL + "api/v1/users/"
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchFormBtn = document.querySelector('.btn-search')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const changeMode = document.querySelector('#change-mode')
const USERS_PER_PAGE = 12  //分頁
const users = [] //盒子
let filteredUsers = []
let nowMode = 'card'
let newPage = 1

axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results)
  renderPaginator(users.length)
  renderUsersCard(getUsersByPage(1))
})

dataPanel.addEventListener('click', function onPanelClicked (event) {
  if(event.target.matches('.btn-show-users')){           //判斷More按鈕 傳入id
    showUsersModal(Number(event.target.dataset.id))
  }else if (event.target.matches('.btn-add-favorite')) { //判斷收藏按鈕 傳入id
    addToFavorite(Number(event.target.dataset.id))
  }
}) 

// 切換模式
changeMode.addEventListener('click', function onPanelClicked (event) {
  if (event.target.matches("#cardMode")) {
    nowMode = 'card'
  }else if (event.target.matches("#listMode")) {
    nowMode = 'list'
  }
  againRender()
})

// 重新渲染模式
function againRender () {
  const usersList = getUsersByPage(newPage)
  if ( nowMode === 'card') {
    console.log('card')
    renderUsersCard(usersList)
  }else {
    console.log("list")
    renderUsersList(usersList)
  }
}


// 收藏
function addToFavorite (id) {
  let user = users.find( user => user.id === id)
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  if (list.some (movie => movie.id === id)) {
    return alert('此電影已經在收藏清單中！')
  }
  list.push(user)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}


// 搜尋
searchForm.addEventListener('submit', function onSearchFormSubmitted (event)  {
  event.preventDefault()
  if (searchFormBtn.getAttribute("aria-expanded") === "true")  return // 避免第一次點擊 誤認直接搜尋 先做判斷
  const keyword = searchInput.value.trim().toLowerCase() //取出 input框內容
  filteredUsers = users.filter( user => 
    user.name.toLowerCase().includes(keyword) || user.surname.toLowerCase().includes(keyword)//符合條件放入空盒子內                  
  ) 
  // if(keyword === '' ) alert('記得輸入') 
  if (filteredUsers.length === 0 ) alert(`您輸入的關鍵字：${keyword} 沒有符合條件的電影`) 
  renderPaginator(filteredUsers.length) //設定總頁
  renderUsersCard(getUsersByPage(1)) //將符合對象重新渲染畫面
})

// 監聽頁數
paginator.addEventListener('click', function onPaginatorClicked (event) {
  if (event.target.tagName !== 'A') return
  newPage = Number(event.target.dataset.id)
  if (nowMode === 'card') {
    renderUsersCard(getUsersByPage(newPage))
  }else {
    renderUsersList(getUsersByPage(newPage))
  }

})


//分頁
function getUsersByPage (page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page - 1) * USERS_PER_PAGE   //計算起始 index 
  return data.slice(startIndex, startIndex + USERS_PER_PAGE)   //回傳切割後的新陣列
}

//計算總頁數
function renderPaginator (amount) {
  const numberOfPages = Math.ceil(amount / USERS_PER_PAGE)
  let rawHTML = ''
  for (let page = 1; page <= numberOfPages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-id="${page}">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

function showUsersModal (id) {
  const usersModalImage = document.querySelector('#users-modal-image')
  const usersModalTitle = document.querySelector('#users-modal-title')
  const usersModalEmail = document.querySelector('#users-modal-email')
  const usersModalGender = document.querySelector('#users-modal-gender')
  const usersModalAge = document.querySelector('#users-modal-age')
  const usersModalRegion = document.querySelector('#users-modal-region')
  const usersModalBirthday = document.querySelector('#users-modal-birthday')

  axios.get(INDEX_URL + id).then((response) => {
  const data = response.data
  usersModalImage.innerHTML = `<img src="${data.avatar}" alt="user-poster" class="img-fluid">`
  usersModalTitle.innerHTML = `${data.name} ${data.surname}`
  usersModalEmail.innerHTML = `${data.email}`
  usersModalGender.innerHTML = `Gender:${data.gender}`
  usersModalAge.innerHTML = `Age:${data.age}`
  usersModalRegion.innerHTML = `Region:${data.region}`
  usersModalBirthday.innerHTML = `Birthday:${data.birthday}`
})
}


function renderUsersCard (data) {
  let rawHTML = ''
  data.forEach( item => {
    rawHTML +=`
      <div class="col-sm-3 pt-3  card border-primary mb-3 " style="max-width: 12rem;">
      <div class="mb-3">
        <div class="card text-center md-auto">
          <img src=${item.avatar} class="card-img-top" alt="Card image cap" />
          <div class="card-body"> 
            <h5 class="card-name">${item.name}</h5>
          </div>
           <div class="card-footer d-flex justify-content-around ">
            <button class="btn btn-primary btn-show-users" data-toggle="modal" data-target="#users-modal" data-id="${item.id}">More</button>
            <button class="btn btn-info btn-add-favorite" data-user='text' data-id="${item.id}"><i class="fab fa-gratipay"></i></button>
          </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

function renderUsersList (data) {
  let rawHTML = ''
  rawHTML += '<table class="table"><tbody>'
  data.forEach( item => {
    rawHTML += `
    <tr>
      <td>
      <span><img src="${item.avatar}">${item.name} ${item.surname}</span>
      </td>
      <td>
          <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
          <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
      </td>
    </tr>
    `
  })
  rawHTML += '</tbody></table>'
 
  dataPanel.innerHTML = rawHTML
}
