const app = {
  init: function() {
    card.init();
  }
};
document.addEventListener('DOMContentLoaded', app.init);

const card = {
  cardFirstName: document.getElementById('firstname').value,
  cardLastName: document.getElementById('lastname').value,
  cardNumber: document.getElementById('card-number').value,
  cardType: document.getElementById('change-card').value,

  init: function() {
    card.addEvents();

    card.canvas = document.querySelector('canvas');
    card.ctx = card.canvas.getContext("2d");

    card.chargeCanvas(card.cardFirstName, card.cardLastName, card.cardNumber, card.cardType);
  },

  addEvents: function() {
    document.getElementById('download').addEventListener('click', card.handleDownloadCard);
    document.getElementById('change-card').addEventListener('change', card.handleChangeCard);
    document.querySelector('.form').addEventListener('submit', card.handleChangeCard);
    const oldMemberCards = document.querySelectorAll('.list-card__member__item');
    for (const oldMemberCard of oldMemberCards) {
      oldMemberCard.addEventListener('click', card.handleChargeOldCard);
    }
    const oldHonoraryMemberCards = document.querySelectorAll('.list-card__honorary-member__item');
    for (const oldHonoraryMemberCard of oldHonoraryMemberCards) {
      oldHonoraryMemberCard.addEventListener('click', card.handleChargeOldCard);
    }
  },

  handleDownloadCard: function() {
    let name = document.getElementById('firstname').value + '-' + document.getElementById('lastname').value;
    name = name.replaceAll(' ', '').replaceAll('\\', '').replaceAll('/', '').replaceAll(':', '').replaceAll('*', '').replaceAll('?', '').replaceAll('"', '').replaceAll('<', '').replaceAll('>', '').replaceAll('|', '');

    const link = document.createElement('a');
    link.download = 'card-member-' + name + '.png';
    link.href = card.canvas.toDataURL();
    link.click();
    link.delete;
  },

  handleChangeCard: function(event) {
    event.preventDefault();

    card.cardFirstName = document.getElementById('firstname').value;
    card.cardLastName = document.getElementById('lastname').value;
    card.cardNumber = document.getElementById('card-number').value;
    card.cardType = document.getElementById('change-card').value;
    card.chargeCanvas(card.cardFirstName, card.cardLastName, card.cardNumber, card.cardType);
    if (event.target.id === 'form-change-card') {
      list.addList(card.cardFirstName, card.cardLastName, card.cardNumber, card.cardType);
    }
  },

  handleChargeOldCard: function(event) {
    let type;
    if (event.currentTarget.classList.contains('list-card__member__item')) {
      type = document.getElementById('change-card').value = '1';
    } else {
      type = document.getElementById('change-card').value = '2';
    }
    const firstname = document.getElementById('firstname').value = event.currentTarget.querySelector('.list-card__firstname').textContent;
    const lastname = document.getElementById('lastname').value = event.currentTarget.querySelector('.list-card__lastname').textContent;
    const number = document.getElementById('card-number').value = event.currentTarget.querySelector('.list-card__number').textContent;
    card.chargeCanvas(firstname, lastname, number, type);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },

  chargeCanvas: function(firstname, lastname, number, type) {
    card.ctx.clearRect(0, 0, 690, 440);

    card.canvas.width = 690;
    card.canvas.height = 440;

    let background = new Image();
    let color1, color2;
    if (type == 1) {
      background.src = "../src/images/card-white2.png";
      color1 = 'black';
      color2 = 'white';
    } else {
      background.src = "../src/images/card-black2.png";
      color1 = 'white';
      color2 = 'black';
    }
    background.onload = function(){
      card.ctx.drawImage(background,0,0);   

      card.ctx.fill();
      card.ctx.fillStyle = color1;
      card.ctx.font = '18px LouisGeorgeCafe';
      card.ctx.fillText(firstname, 240, 399);
      card.ctx.fillText(lastname, 240, 372);
      card.ctx.fillStyle = color2;
      card.ctx.font = '25px LouisGeorgeCafe';
      card.ctx.textAlign = 'center';
      if (type == 1) {
        card.ctx.fillText(number, 75, 43);
      } else {
        card.ctx.fillText(number, 74, 43);
      }
    }
  }
};

const list = {
  addList: function(firstname, lastname, number, type) {
    const newElement = document.createElement('li');
    if (type == 1) {
      newElement.classList.add('list-card__member__item');
    } else {
      newElement.classList.add('list-card__honorary-member__item');
    }
    newElement.dataset.number = number;
    newElement.innerHTML = '<strong class="list-card__number">' + number + '</strong> - <span class="list-card__lastname">' + lastname + '</span> <span class="list-card__firstname">' + firstname + '</span>';

    const xhr = new XMLHttpRequest();

    let data = "firstname=" + firstname + "&lastname=" + lastname + "&number=" + number + "&type=" + type;
    const filename = "save.php?" + data;
    data = null;

    xhr.open("GET", filename, true);

    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        if (xhr.responseText === 'YEAH') {
          if (type == 1) {
            document.querySelector('.list-card__member').prepend(newElement);
            document.querySelector('.list-card__member__item').addEventListener('click', card.handleChargeOldCard);
          } else {
            document.querySelector('.list-card__honorary-member').prepend(newElement);
            document.querySelector('.list-card__honorary-member__item').addEventListener('click', card.handleChargeOldCard);
          }
        } else if (xhr.responseText === 'UPDATE') {
          if (type == 1) {
            document.querySelector('.list-card__member__item[data-number="' + number + '"]').innerHTML = '<strong class="list-card__number">' + number + '</strong> - <span class="list-card__lastname">' + lastname + '</span> <span class="list-card__firstname">' + firstname + '</span>';
          } else {
            document.querySelector('.list-card__honorary-member__item[data-number="' + number + '"]').innerHTML = '<strong class="list-card__number">' + number + '</strong> - <span class="list-card__lastname">' + lastname + '</span> <span class="list-card__firstname">' + firstname + '</span>';
          }
        }
      }
    }

    xhr.send(data);
  }
};
