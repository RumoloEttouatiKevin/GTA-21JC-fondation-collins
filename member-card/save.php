<?php
session_start();

if (!empty($_SESSION["connect"])) {
  try {
    if (!empty($_GET['firstname']) && !empty($_GET['lastname']) && !empty($_GET['number']) && !empty($_GET['type'])) {
      $BddConnect = new PDO("mysql:host=localhost;dbname=;charset=utf8", "", "");
      // Check si exist
      $requete = $BddConnect->prepare("SELECT * FROM list_card WHERE number = :number AND type = :type");
      $prepare = array(
        "number" => $_GET['number'],
        "type" => $_GET['type']
      );
      // Si la requete SQL a fonctionné
      if ($requete->execute($prepare)) {
        $donneesRequete = $requete->fetch();
        // Si il y a un resultat
        if ($donneesRequete) {
          // Modification
          $requete = $BddConnect->prepare("UPDATE list_card SET firstname = :firstname, lastname = :lastname WHERE number = :number AND type = :type");
          $prepare = array(
            "firstname" => $_GET['firstname'],
            "lastname" => $_GET['lastname'],
            "number" => $_GET['number'],
            "type" => $_GET['type']
          );
          // Si la requete SQL a fonctionné
          if ($requete->execute($prepare)) {
            echo 'UPDATE';
          } else {
            echo 'NOPE';
          }
        } else {
          // Création
          $prepare = array(
            "firstname" => $_GET['firstname'],
            "lastname" => $_GET['lastname'],
            "number" => $_GET['number'],
            "type" => $_GET['type']
          );
          $into = "firstname, lastname, number, type";
          $values = ":firstname, :lastname, :number, :type";
          $requete = $BddConnect->prepare('INSERT INTO list_card(' . $into . ') VALUES(' . $values . ')');
          if ($requete->execute($prepare)) {
            echo 'YEAH';
          } else {
            echo 'NOPE';
          }
        }
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
