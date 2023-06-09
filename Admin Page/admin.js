const baseUrl = `https://64230bad001cb9fc2036bd2f.mockapi.io`;
let OFFItemData = [];
let OFFUserData = [];
const navBtn = {
   dashboard: document.querySelector('#dashoard-btn'),
   allItems: document.querySelector('#all-products-btn'),
   customers: document.querySelector('#customers-btn'),
   orders: document.querySelector('#orders-btn'),
   addItem: document.querySelector('#addItems-btn'),
   recycle: document.querySelector('#recyclebin-btn'),
};

const boxList = {
   dashboard: document.querySelector('#admin-box-dashboard'),
   allItems: document.querySelector('#admin-box-all-products'),
   customers: document.querySelector('#admin-box-all-customers'),
   orders: document.querySelector('#admin-box-all-orders'),
   addItem: document.querySelector('#admin-box-add-items'),
   recycle: document.querySelector('#admin-box-recycle-items'),
};

//////////////////////////////
// Dashboard /////////////////
//////////////////////////////

window.addEventListener('load', function () {
   renderDashboardData();
});

navBtn.dashboard.addEventListener('click', function (e) {
   controlBtnActiveState(e.target);
   controlBoxVisibality(e.target.dataset.panel);
   renderDashboardData();
});

const itemCount = document.querySelector('#total-item-count');
const userCount = document.querySelector('#total-customer-count');
const orderCount = document.querySelector('#total-order-count');
const revinue = document.querySelector('#total-revinue-count');

async function renderDashboardData() {
   let dashObj = await getDashBoardObj();
   itemCount.textContent = dashObj.itemCount;
   userCount.textContent = dashObj.userCount;
   orderCount.textContent = dashObj.orderCount;
   revinue.textContent = '$' + dashObj.revinue;
}

async function getDashBoardObj() {
   let resItem = await fetch(`${baseUrl}/products`);
   OFFItemData = await resItem.json();
   let resUser = await fetch(`${baseUrl}/users`);
   OFFUserData = await resUser.json();

   return {
      itemCount: OFFItemData.length,
      userCount: OFFUserData.length,
      orderCount: calcOrderCount(OFFUserData),
      revinue: calcRevinue(OFFUserData),
   };
}

function calcOrderCount(userData) {
   let order = 0;
   userData.forEach(function (user) {
      order += user.orderList.length;
   });
   return order;
}

function calcRevinue(userData) {
   let revinue = 0;
   userData.forEach(function (user) {
      revinue += user.orderCost;
   });
   return revinue;
}

/////////////////////////////////
// All Item /////////////////////
/////////////////////////////////

navBtn.allItems.addEventListener('click', function (e) {
   controlBtnActiveState(e.target);
   controlBoxVisibality(e.target.dataset.panel);
   displayCardList(OFFItemData);
});

// Display Card //////////////////

let cardList = document.querySelector('.card-list');
function displayCardList(itemData) {
   cardList.innerHTML = ``;
   itemData.forEach(function (item) {
      let card = getCard(item);
      let deleteBtn = card.querySelector('.delete-btn');
      let editBtn = card.querySelector('.edit-btn');
      let editBox = card.querySelector('.edit-item');
      let editForm = card.querySelector('.edit-item > form');
      let sizeInps = card.querySelectorAll('.sizeInp');
      for (let i = 0; i < sizeInps.length; i++) {
         sizeInps[i].addEventListener('change', function () {
            if (sizeInps[i].className == 'sizeInp') {
               sizeInps[i].className = 'sizeInp checked';
            } else {
               sizeInps[i].className = 'sizeInp';
            }
         });
      }

      editBtn.addEventListener('click', function () {
         if (editBox.className == 'edit-item') {
            editBox.className = 'edit-item hide';
         } else {
            editBox.className = 'edit-item';
         }
      });

      editForm.addEventListener('submit', async function (e) {
         e.preventDefault();
         updateItem(editForm, card.dataset.id);
      });

      deleteBtn.addEventListener('click', async function () {
         deleteItem(card.dataset.id);
      });
      cardList.append(card);
   });
}

// Update Item //////////////////////////
async function updateItem(editForm, itemID) {
   let nameInp = editForm.querySelector('.nameInp');
   let priceInp = editForm.querySelector('.priceInp');
   let discountInp = editForm.querySelector('.discountInp');
   let typeInp = editForm.querySelector('.typeInp');
   let categoryInp = editForm.querySelector('.categoryInp');
   let colorInp = editForm.querySelector('.colorInp');
   let mImg = editForm.querySelector('.main-imgInp');
   let oImg1 = editForm.querySelector('.other-imgInp-1');
   let oImg2 = editForm.querySelector('.other-imgInp-2');
   let oImg3 = editForm.querySelector('.other-imgInp-3');
   let productDetailsInp = editForm.querySelector('.product-detailsInp');
   let brandDetailsInp = editForm.querySelector('.brand-detailsInp');

   let sizeInp = editForm.querySelectorAll('.sizeInp > input');
   let sizeArr = [];
   for (let i = 0; i < sizeInp.length; i++) {
      if (sizeInp[i].checked) sizeArr.push(sizeInp[i].value);
   }

   let itemObj = {
      title: nameInp.value,
      price: priceInp.value,
      gender: categoryInp.value,
      productType: typeInp.value,
      discountPercentage: discountInp.value,
      color: colorInp.value,
      sizes: sizeArr,
      rating: [2.9, 89],
      productDetails: productDetailsInp.value,
      brandDetails: brandDetailsInp.value,
      images: {
         mainImg: mImg.value,
         otherImg: [oImg1.value, oImg2.value, oImg3.value],
      },
   };

   await fetch(`${baseUrl}/products/${itemID}`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(itemObj),
   });
   let resItem = await fetch(`${baseUrl}/products`);
   OFFItemData = await resItem.json();
   alert('Item Updated');
   displayCardList(OFFItemData);
}

// Delete Item ////////////////////
async function deleteItem(itemID) {
   await fetch(`${baseUrl}/products/${itemID}`, { method: 'DELETE' });
   let resItem = await fetch(`${baseUrl}/products`);
   OFFItemData = await resItem.json();
   displayCardList(OFFItemData);
   alert('item Deleted');
}

// Add Item //////////////////////
let addItemForm = document.querySelector('.add-item > form');
addItemForm.addEventListener('submit', function (e) {
   e.preventDefault();
   addIetm();
});

let addForm = document.querySelector('.add-item');
let sizeInps = addForm.querySelectorAll('.sizeInp');
for (let i = 0; i < sizeInps.length; i++) {
   sizeInps[i].addEventListener('change', function () {
      if (sizeInps[i].className == 'sizeInp') {
         sizeInps[i].className = 'sizeInp checked';
      } else {
         sizeInps[i].className = 'sizeInp';
      }
   });
}
async function addIetm() {
   let nameInp = addForm.querySelector('.nameInp');
   let priceInp = addForm.querySelector('.priceInp');
   let discountInp = addForm.querySelector('.discountInp');
   let typeInp = addForm.querySelector('.typeInp');
   let categoryInp = addForm.querySelector('.categoryInp');
   let colorInp = addForm.querySelector('.colorInp');
   let mImg = addForm.querySelector('.main-imgInp');
   let oImg1 = addForm.querySelector('.other-imgInp-1');
   let oImg2 = addForm.querySelector('.other-imgInp-2');
   let oImg3 = addForm.querySelector('.other-imgInp-3');
   let productDetailsInp = addForm.querySelector('.product-detailsInp');
   let brandDetailsInp = addForm.querySelector('.brand-detailsInp');

   let sizeInp = addForm.querySelectorAll('.sizeInp > input');
   let sizeArr = [];
   for (let i = 0; i < sizeInp.length; i++) {
      if (sizeInp[i].checked) sizeArr.push(sizeInp[i].value);
   }

   let itemObj = {
      title: nameInp.value,
      price: priceInp.value,
      gender: categoryInp.value,
      productType: typeInp.value,
      discountPercentage: discountInp.value,
      color: colorInp.value,
      sizes: sizeArr,
      rating: [2.9, 89],
      productDetails: productDetailsInp.value,
      brandDetails: brandDetailsInp.value,
      images: {
         mainImg: mImg.value,
         otherImg: [oImg1.value, oImg2.value, oImg3.value],
      },
   };

   await fetch(`${baseUrl}/products`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(itemObj),
   });
   let resItem = await fetch(`${baseUrl}/products`);
   OFFItemData = await resItem.json();
   alert('Item Added');
   displayCardList(OFFItemData);
}
// Get Card //////////////////////

function getCard(item) {
   let card = document.createElement('div');
   card.setAttribute('data-id', `${item.id}`);
   card.classList.add('item-card');
   card.innerHTML = `
<div class="item-details">
<img src="${item.images.mainImg}" alt="">
<div class="info-box">
<h2 class="title">${item.title}</h2>
<table>
<tr>
<td>Price</td>
<td> $${item.price}</td>
</tr>
<tr>
<td>Discount</td>
<td> ${item.discountPercentage}%</td>
</tr>
<tr>
<td>Rating</td>
<td> ${item.rating[0]}</td>
</tr>
<tr>
<td>Type</td>
<td> ${item.productType.toUpperCase()}</td>
</tr>
<tr>
<td>Category</td>
<td> ${item.gender.toUpperCase()}</td>
</tr>
<tr>
<td>Size</td>
<td> ${getSize(item.sizes)}</td>
</tr>
<tr>
<td>Color</td>
<td> ${item.color.toUpperCase()}</td>
</tr>
</table>
<div class="item-card-buttons">
<button class="btn-sm edit-btn"><i class="ri-edit-2-fill"></i><span>Edit Item</span>
</button>
<button class="btn-sm delete-btn"><i class="ri-delete-bin-6-line"></i> <span>Delete
Item</span> </button>
</div>
</div>
</div>
<div class="edit-item hide">
<form>
<div class="input-field">
<label>name</label>
<input class="nameInp" type="text" placeholder="name">
</div>
<div class="col-3">
<div class="input-field">
<label>Type</label>
<select class="typeInp">
<option value="">--select type--</option>
<option value="jeans">Jeans</option>
<option value="sneakers">Sneakers</option>
</select>
</div>
<div class="input-field">
<label>price</label>
<input class="priceInp" type="number" placeholder="price">
</div>
<div class="input-field">
<label>Discount percentage</label>
<input class="discountInp" type="number" placeholder="discount percentage">
</div>
</div>
<div class="col-2">
<div class="col-2">
<div class="input-field">
<label>Category</label>
<select class="categoryInp">
<option value="">--select category--</option>
<option value="men">Men</option>
<option value="women">Women</option>
</select>
</div>
<div class="input-field">
<label>Color</label>
<input class="colorInp" type="text" placeholder="color">
</div>
</div>
<div class="input-field">
<label>Sizes</label>
<div class="check-container">
<label class="sizeInp"><input value="US-1" type="checkbox">
<span>US-1</span>
</label>
<label class="sizeInp"><input value="US-2" type="checkbox"> <span>US-2</span>
</label>
<label class="sizeInp"><input value="US-4" type="checkbox"> <span>US-4</span>
</label>
<label class="sizeInp"><input value="US-6" type="checkbox">
<span>US-6</span>
</label>
<label class="sizeInp"><input value="US-8" type="checkbox">
<span>US-8</span>
</label>
<label class="sizeInp"><input value="US-10" type="checkbox">
<span>US-10</span>
</label>
<label class="sizeInp"><input value="US-12" type="checkbox">
<span>US-12</span>
</label>
</div>
</div>
</div>
<div class="input-field">
<label>Main image</label>
<input class="main-imgInp" type="text" placeholder="main image link">
</div>
<div class="input-field">
<label>Other image 1</label>
<input class="other-imgInp-1" type="text" placeholder="other image link">
</div>
<div class="input-field">
<label>Other image 2</label>
<input class="other-imgInp-2" type="text" placeholder="other image link">
</div>
<div class="input-field">
<label>Other image 3</label>
<input class="other-imgInp-3" type="text" placeholder="other image link">
</div>
<div class="input-field">
<label>Product Details</label>
<textarea class="product-detailsInp" cols="100" rows="2"></textarea>
</div>
<div class="input-field">
<label>Brand Details</label>
<textarea class="brand-detailsInp" cols="100" rows="2"></textarea>
</div>
<button class="btn-sm update-btn">
<i class="ri-refresh-line"></i> <span>Update
Item</span>
</button>
</form>
</div>
`;
   return card;
}

// Customers ////////////////////
navBtn.customers.addEventListener('click', function (e) {
   controlBtnActiveState(e.target);
   controlBoxVisibality(e.target.dataset.panel);
   displayUserList();
});

// Display UserList
async function displayUserList() {
   let res = await fetch(`${baseUrl}/users`);
   let data = await res.json();
   displayUserCards(data);
}
let userCardList = document.querySelector('.user-list');
function displayUserCards(data) {
   userCardList.innerHTML = '';
   data.forEach(function (user) {
      let card = getUserCard(user);
      userCardList.append(card);
   });
}
function getUserCard(user) {
   let card = document.createElement('div');
   card.className = 'user-card';
   card.innerHTML = `
<div class="info-box">
<table>
<tr>
<td>ID</td>
<td>${user.id}</td>
</tr>
<tr>
<td>Name</td>
<td>${user.name}</td>
</tr>
<tr>
<td>Email</td>
<td>${user.email}</td>
</tr>
<tr>
<td>Address</td>
<td>${user.address}</td>
</tr>
<tr>
<td>Phone No.</td>
<td>${user.phoneNo}</td>
</tr>
<tr>
<td>Password</td>
<td>${user.password}</td>
</tr>
</table>
</div>
   `;
   return card;
}

navBtn.orders.addEventListener('click', function (e) {
   controlBtnActiveState(e.target);
   controlBoxVisibality(e.target.dataset.panel);
});
navBtn.addItem.addEventListener('click', function (e) {
   controlBtnActiveState(e.target);
   controlBoxVisibality(e.target.dataset.panel);
});
navBtn.recycle.addEventListener('click', function (e) {
   controlBtnActiveState(e.target);
   controlBoxVisibality(e.target.dataset.panel);
});

/***************************
UTILITY FUNCTIONS
***************************/
function controlBtnActiveState(currBtn) {
   for (let btn in navBtn) {
      if (navBtn[btn] === currBtn) navBtn[btn].classList.add('active');
      else navBtn[btn].classList.remove('active');
   }
}

function controlBoxVisibality(id) {
   let currBox = document.querySelector(`#${id}`);
   for (let box in boxList) {
      if (boxList[box] == currBox) boxList[box].classList.remove('hide');
      else boxList[box].classList.add('hide');
   }
}

function getSize(sizeArr) {
   let size = '';
   sizeArr.forEach(function (s) {
      size += s.split('-')[1] + '/';
   });
   return size.slice(0, -1);
}
