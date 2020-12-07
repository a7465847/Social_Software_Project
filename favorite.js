const BASE_URL = "https://lighthouse-user-api.herokuapp.com/"
const INDEX_URL = BASE_URL + "api/v1/users/"
const users = JSON.parse(localStorage.getItem('favoriteMovies'))
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchFormBtn = document.querySelector('.btn-search')
const searchInput = document.querySelector('#search-input')


dataPanel.addEventListener('click', function onPanelClicked (event){
  if (event.target.matches('.btn-show-users')) {           //判斷More按鈕 傳入id
    showUsersModal(Number(event.target.dataset.id))
  }else if (event.target.matches('.btn-remove-favorite')) { //判斷收藏按鈕 傳入id
    removeFromFavorite(Number(event.target.dataset.id))
  }
}) 

function removeFromFavorite (id) { 
  if (!users) return
  const userIndex = users.findIndex( user => user.id === id)
  if (userIndex === -1) return
  users.splice(userIndex,1)
  localStorage.setItem('favoriteMovies',JSON.stringify(users))
  renderUsersList(users)
}





function showUsersModal (id) {
  const usersModalImage = document.querySelector('#users-modal-image')
  const usersModalTitle = document.querySelector('#users-modal-title')
  const usersModalEmail = document.querySelector('#users-modal-email')
  const usersModalGender = document.querySelector('#users-modal-gender')
  const usersModalAge = document.querySelector('#users-modal-age')
  const usersModalRegion = document.querySelector('#users-modal-region')
  const usersModalBirthday = document.querySelector('#users-modal-birthday')

  axios.get(INDEX_URL + id).then( response => {
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


function renderUsersList (data) {
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
            <button class="btn  btn-danger btn-remove-favorite" data-user='text' data-id="${item.id}">X</button>
          </div>
        </div>
      </div>
    </div>
    `
  })
  dataPanel.innerHTML = rawHTML
}

renderUsersList(users)


