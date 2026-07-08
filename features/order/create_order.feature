@payment
Feature: API Order HiPay - Payment Flow

  Background:
    Given je suis authentifie avec des credentials valides

  @nominal @smoke
  Scenario: Paiement valide avec les informations obligatoires uniquement
    When j'envoie une requete POST sur "/v1/connector/order" avec un payload minimal valide
    Then la reponse doit avoir le statut 200
    And la reponse doit contenir un "paymentStatus"

  @security @error
  Scenario: Paiement refuse avec une authentification invalide
    Given je suis authentifie avec des credentials invalides
    When j'envoie une requete POST sur "/v1/connector/order" avec un payload minimal valide
    Then la reponse doit avoir le statut 401

  @error @validation
  Scenario: Paiement refuse avec un champ obligatoire manquant
    When j'envoie une requete POST sur "/v1/connector/order" sans le champ "amount"
    Then la reponse doit avoir le statut 400

  @error @validation
  Scenario: Paiement refuse avec un payload vide
    When j'envoie une requete POST sur "/v1/connector/order" avec un payload vide
    Then la reponse doit avoir le statut 400

  @healthcheck @smoke
  Scenario: Verification de la disponibilite du service
    When j'envoie une requete GET sur "/v1/connector/healthcheck"
    Then la reponse doit avoir le statut 200