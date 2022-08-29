const app = {
  init: function() {
    card.init();
  }
};
document.addEventListener('DOMContentLoaded', app.init);

const card = {
  certificateName: document.getElementById('name').value,
  certificateAmount: document.getElementById('amount').value,
  certificateDate: '',

  init: function() {
    card.addEvents();

    card.canvas = document.querySelector('canvas');
    card.ctx = card.canvas.getContext("2d");

    card.chargeCanvas(card.certificateName, card.certificateAmount, card.certificateDate);
  },

  addEvents: function() {
    document.getElementById('download').addEventListener('click', card.handleDownloadCard);
    document.querySelector('.form').addEventListener('submit', card.handleChangeCard);
    const oldMemberCards = document.querySelectorAll('.list-card__member__item');
    for (const oldMemberCard of oldMemberCards) {
      oldMemberCard.addEventListener('click', card.handleChargeOldCard);
    }
  },

  handleDownloadCard: function() {
    const link = document.createElement('a');
    link.download = 'certificate-donation.png';
    link.href = card.canvas.toDataURL();
    link.click();
    link.delete;
  },

  handleChangeCard: function(event) {
    event.preventDefault();

    card.certificateName = document.getElementById('name').value;
    card.certificateAmount = document.getElementById('amount').value;

    const date = new Date()
    card.certificateDate = String(date.getDate()).padStart(2, '0') + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + date.getFullYear();

    card.chargeCanvas(card.certificateName, card.certificateAmount, card.certificateDate);
    if (event.target.id === 'form-change-card') {
      list.addList(card.certificateName, card.certificateAmount, card.certificateDate);
      document.getElementById('name').value = '';
      document.getElementById('amount').value = '';
    }
  },

  handleChargeOldCard: function(event) {
    const name = event.currentTarget.querySelector('.list-card__name').textContent;
    const amount = event.currentTarget.querySelector('.list-card__amount').textContent;
    const date = event.currentTarget.querySelector('.list-card__date').textContent;
    card.chargeCanvas(name, amount, date);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  },

  chargeCanvas: function(name, amount, date) {
    amount = amount.replaceAll('.', '').replaceAll(',', '').replaceAll(' ', '');
    // amount = amount.replaceAll(',', '');
    // amount = amount.replaceAll(' ', '');
    amount = '$' + number_format(parseInt(amount), 0, '.', '.');

    card.ctx.clearRect(0, 0, 300, 470);

    card.canvas.width = 300;
    card.canvas.height = 470;

    let background = new Image();
    let color1, color2;
    background.src = "../src/images/certificate.png";
    background.onload = function(){
      card.ctx.drawImage(background,0,0);

      card.ctx.fill();
      card.ctx.fillStyle = 'black';
      card.ctx.font = '12px LouisGeorgeCafe';
      card.ctx.textAlign = 'center';
      card.ctx.fillText(name, 150, 242);
      card.ctx.fillText(amount, 150, 293);
      card.ctx.fillText(date, 150, 348);
    }
  }
};

const list = {
  addList: function(name, amount, date) {
    amount = amount.replaceAll('.', '').replaceAll(',', '').replaceAll(' ', '');
    amount = number_format(parseInt(amount), 0, '.', '.');

    const newElement = document.createElement('li');
    newElement.classList.add('list-card__member__item');
    newElement.dataset.date = date;
    newElement.innerHTML = '<strong class="list-card__date">' + date + '</strong> - <span class="list-card__name">' + name + '</span> - $<span class="list-card__amount">' + amount + '</span>';

    const xhr = new XMLHttpRequest();

    amount = amount.replaceAll('.', '').replaceAll(',', '').replaceAll(' ', '');
    let data = "name=" + name + "&amount=" + amount;
    const filename = "save.php?" + data;
    data = null;

    xhr.open("GET", filename, true);

    xhr.onreadystatechange = function() {
      if(xhr.readyState == 4) {
        if (xhr.responseText === 'YEAH') {
          document.querySelector('.list-card__member').prepend(newElement);
          document.querySelector('.list-card__member__item').addEventListener('click', card.handleChargeOldCard);
        }
      }
    }

    xhr.send(data);
  }
};

function number_format(number, decimals, dec_point, thousands_sep) {
  // Strip all characters but numerical ones.
  number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
  var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
      dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
      s = '',
      toFixedFix = function (n, prec) {
          var k = Math.pow(10, prec);
          return '' + Math.round(n * k) / k;
      };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
      s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
      s[1] = s[1] || '';
      s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}
