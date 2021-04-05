
# Book-platform API

Max 7.1 PHP - verze na kitlabu... už je to deprecated verze...

localhost URI: /backend/src/api.php/...
kitlab URI: /api.php/...

## Documentation

https://app.swaggerhub.com/apis-docs/CULS_project/book-platform_api/1.0

## Localhost
Postup:

 1. Stáhnout PHP
 2. Stáhnout XAMPP
 3. Nastartovat XAMPP+MySQL
 4. Vytvořit si db s názvem `book-platform` (bez hesla) pomocí phpMyAdmin http://localhost/phpmyadmin/index.php
 5. Spustit SQL `backend/sql/init.sql` ve vytvořené db `book-platform`
 6. Stáhnout Composer (dependency manager pro PHP)
 7. Clone repa do `{XAMPP-složka}/htdocs`
 8. V naklonovanému repu ve složce `backend/` spustit `composer update` - to natáhne dependence (naplní složku `vendor`)

Potom stačí přijít na adresu http://localhost/dashboard/ - API bude přístupné na http://localhost/book-platform/backend/src/api.php

## Kitlab
Stačí potom jen zkopírovat soubory na disk. Musí to být zkopírováno trochu jinak - i se složkou `vendor` (libky) a do jinší složky. Zatím jsem udělal test jwt+composeru: https://kitlab.pef.czu.cz/2021zs/ete89e/08/backend/api/jwt-test.php

## Tech

 - JWT - https://github.com/firebase/php-jwt
 - PHP Routing - https://github.com/nikic/FastRoute
 - Composer - https://getcomposer.org/
 - XAMPP - https://www.apachefriends.org/download.html


Jestli jsou potřeba nové libky tak vyhledávat na https://packagist.org/ (bacha na verzi PHP <= 7.1)
