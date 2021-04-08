<?php declare(strict_types=1);

require_once 'util/database.php';
require_once 'util/jwt-issuer.php';
require_once 'util/web-util.php';

class AuthService {

    function login(Request $req) {
        if (!empty($req->getBody())
              && !empty($req->getBody()->username)
              && !empty($req->getBody()->password)) {

            $database = new Database();
            $dbConn = $database->connect();

            $stmt = $dbConn->prepare("SELECT * FROM user WHERE username = ?");
            $stmt->execute(array($req->getBody()->username));

            if ($user = $stmt->fetch()) {
                if (!password_verify($req->getBody()->password, $user['password'])) {
                    WebUtil::exitWithHttpCode(403, "Špatné heslo");
                }
                if (!$user['active']) {
                    WebUtil::exitWithHttpCode(403, "Uživatel není aktivní");
                }
                $userWithToken = JsonMapper::createUserDto($user);
                $userWithToken['token'] = JwtIssuer::issueToken($user);
                WebUtil::respondSuccessWith($userWithToken);
            }
            WebUtil::exitWithHttpCode(404, "Uživatel nebyl nalezen");
        }
        WebUtil::exitWithHttpCode(400);
    }
}
