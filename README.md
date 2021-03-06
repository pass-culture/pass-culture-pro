# pass-culture-pro

[![Coverage Status](https://coveralls.io/repos/github/betagouv/pass-culture-pro/badge.svg?branch=master)](https://coveralls.io/github/betagouv/pass-culture-pro?branch=master)

C'est la version (browser) de l'application PRO frontend du pass Culture.

Il faut aller voir le README dans https://github.com/betagouv/pass-culture-main
pour être informé des différentes lignes de commande associées à ce repo.

## Note sur Yarn

Yarn est prometteur, on vous conseille de l'utiliser. Tâchez de l'installer globalement sur votre ordinateur (https://yarnpkg.com/en/docs/install), puis:
```bash
  yarn
```

## Installation et Lancement de l'application Pro
- ```shell
  yarn install
  yarn start
  ```

## Lancement des tests

- ### Lancement des tests unitaires
  ```shell
  yarn test:unit
  ```

- ### Lancement des tests end to end

  - Prérequis aux lancement des tests e2e testcafe (⚠️**Depuis le repository api**)
    - Lancement de la base de donnée pc-postgres (pour l'api)  via docker-compose
      ```shell
      docker-compose -f ../docker-compose-app.yml up -d postgres
      ```
    - Injection des données de test
      ```shell
      export DATABASE_URL=postgresql://pass_culture:passq@localhost:5434/pass_culture && python src/pcapi/install_database_extensions.py && alembic upgrade head && rm -rf ./src/pcapi/static/object_store_data
      python src/pcapi/scripts/pc.py sandbox -n testcafe
      ```

  - Lancement des tests depuis la ligne de commande (⚠️**Depuis le repository pro**)
    ```shell
    yarn test:cafe
    ```
