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
  $requete = $BddConnect->query('SELECT * FROM list_card ORDER BY number DESC');
  while ($donneesRequete = $requete->fetch()) {
    $list[$donneesRequete['id']] = [
      htmlentities($donneesRequete['firstname'], ENT_QUOTES, "UTF-8"),
      htmlentities($donneesRequete['lastname'], ENT_QUOTES, "UTF-8"),
      htmlentities($donneesRequete['number'], ENT_QUOTES, "UTF-8"),
      htmlentities($donneesRequete['type'], ENT_QUOTES, "UTF-8")
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
            <label for="change-card">Type de carte</label>
            <select class="form__input" name="type-card" id="change-card">
              <option value="1" selected>Carte de Membre</option>
              <option value="2">Carte de Membre d'Honneur</option>
            </select>
            <label for="lastname">Nom</label>
            <input class="form__input" type="text" id="lastname" placeholder="Nom" value="">
            <label for="firstname">Prénom</label>
            <input class="form__input" type="text" id="firstname" placeholder="Prénom" value="">
            <label for="card-number">Numéro de carte</label>
            <input class="form__input" type="text" id="card-number" placeholder="000" value="">
            <button class="btn" type="submit">Valider</button>
          </form>

          <section class="list-card">
            <div>
              <h3>Carte Membre</h3>
              <ul class="list-card__member">
                <?php  
                  foreach ($list as $value) {
                    if ($value[3] == 1) {
                ?>
                      <li class="list-card__member__item" data-number="<?= $value[2] ?>"><strong class="list-card__number"><?= $value[2] ?></strong> - <span class="list-card__lastname"><?= $value[1] ?></span> <span class="list-card__firstname"><?= $value[0] ?></span></li>
                <?php
                    }
                  }
                ?>
              </ul>
            </div>
            <div>
              <h3>Carte Membre d'Honneur</h3>
              <ul class="list-card__honorary-member">
                <?php
                  foreach ($list as $value) {
                    if ($value[3] == 2) {
                ?>
                      <li class="list-card__honorary-member__item" data-number="<?= $value[2] ?>"><strong class="list-card__number"><?= $value[2] ?></strong> - <span class="list-card__lastname"><?= $value[1] ?></span> <span class="list-card__firstname"><?= $value[0] ?></span></li>
                <?php
                    }
                  }
                ?>
              </ul>
            </div>
          </section>
          <script src="../src/js/member-card7.js"></script>
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
