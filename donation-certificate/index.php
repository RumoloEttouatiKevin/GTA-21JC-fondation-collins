<?php
session_start();

$BddConnect = new PDO("mysql:host=localhost;dbname=;charset=utf8", "", "");
if (!empty($_POST['password'])) {
  $mdp = '';
  $passwordSuccess = password_verify($_POST['password'], $mdp);
  if ($passwordSuccess) {
    $_SESSION["connect"] = true;
    header("Location: #");
  }
}

if (!empty($_SESSION["connect"])) {
  $requete = $BddConnect->query('SELECT * FROM list_certificate ORDER BY date DESC');
  while ($donneesRequete = $requete->fetch()) {
    $list[$donneesRequete['id']] = [
      htmlentities($donneesRequete['name'], ENT_QUOTES, "UTF-8"),
      htmlentities($donneesRequete['amount'], ENT_QUOTES, "UTF-8"),
      date('d-m-Y', strtotime($donneesRequete['date']))
    ];
  }
}
?>

<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carte de membre</title>
    <link rel="stylesheet" href="../src/css/style3.css">
  </head>
  <body>
    <div class="container">
      <?php
        if (!empty($_SESSION["connect"])) {
      ?>
          <a href="../" title="Retour"><button class="buttonBack">&#11013;</button></a>
          <section class="card">
            <canvas class="card__canvas"></canvas>
            <button class="btn" id="download">Download</button>
          </section>
          
          <form class="form" action="" method="post" id="form-change-card">
            <label for="name">Prénom & Nom</label>
            <input class="form__input" type="text" id="name" placeholder="Prénom & Nom" value="">
            <label for="amount">Montant</label>
            <input class="form__input" type="text" id="amount" placeholder="1000" value="">
            <button class="btn" type="submit">Valider</button>
          </form>

          <section class="list-card">
            <div>
              <h3>Liste des donations</h3>
              <ul class="list-card__member" id="list-certificate">
                <?php  
                  foreach ($list as $value) {
                ?>
                    <li class="list-card__member__item" data-date="<?= $value[2] ?>"><strong class="list-card__date"><?= $value[2] ?></strong> - <span class="list-card__name"><?= $value[0] ?></span> - $<span class="list-card__amount"><?= number_format($value[1], 0, '.', '.') ?></span></li>
                <?php
                  }
                ?>
              </ul>
            </div>
          </section>
          <script src="../src/js/donation-certificate3.js"></script>
      <?php
        } else {
      ?>
          <form class="form-connexion" action="" method="post">
            <input class="form__input" type="password" placeholder="Mot de passe" name="password">
            <button class="btn" type="submit">Valider</button>
          </form>
      <?php
        }
      ?>
    </div>
  </body>
</html>
