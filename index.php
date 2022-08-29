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
?>

<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Carte de membre</title>
    <link rel="stylesheet" href="src/css/style3.css">
  </head>
  <body>
    <div class="container">
      <?php
        if (!empty($_SESSION["connect"])) {
      ?>
          <section class="img-home">
            <img src="src/images/card-member.png" alt="" class="img-home__item">
            <img src="src/images/certificate.png" alt="" class="img-home__item">
          </section>
          <script>
            document.querySelector('.img-home__item:first-child').addEventListener('click', function() {
              location.assign('member-card');
            });
            document.querySelector('.img-home__item:last-child').addEventListener('click', function() {
              location.assign('donation-certificate');
            });
          </script>
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
