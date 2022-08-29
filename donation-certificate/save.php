<?php
session_start();

if (!empty($_SESSION["connect"])) {
  try {
    if (!empty($_GET['name']) && !empty($_GET['amount'])) {
      $BddConnect = new PDO("mysql:host=localhost;dbname=;charset=utf8", "", "");
      // Création
      $prepare = array(
        "name" => $_GET['name'],
        "amount" => $_GET['amount']
      );
      $into = "name, amount";
      $values = ":name, :amount";
      $requete = $BddConnect->prepare('INSERT INTO list_certificate(' . $into . ') VALUES(' . $values . ')');
      if ($requete->execute($prepare)) {
        echo 'YEAH';
      } else {
        echo 'NOPE';
      }
    } else {
      echo 'NOPE';
    }
  }
  catch(Exception $e) {
    echo 'NOPE';
  }
} else {
  echo 'NOPE';
}
