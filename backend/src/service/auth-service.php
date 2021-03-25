<?php declare(strict_types=1);

require_once 'util/database.php';
require_once 'util/jwt-issuer.php';
require_once 'util/web-util.php';

class AuthService {

    function login(Request $req) {
        if (!empty($req->getBody())
              && !empty($req->getBody()->email)
              && !empty($req->getBody()->pwd)) {

            $database = new Database();
            $dbConn = $database->connect();

            $stmt = $dbConn->prepare("SELECT id, username, email, password, active FROM user WHERE email = ?");
            $stmt->execute(array($req->getBody()->email));

            if ($user = $stmt->fetch()) {
                if ($user['active'] && password_verify($req->getBody()->pwd, $user['password'])) {
                    echo json_encode(JwtIssuer::issueToken($user)); // respond with token

                    WebUtil::fillResponseHeaders();
                } else {
                    WebUtil::exitWithHttpCode(403);
                }
            } else {
                WebUtil::exitWithHttpCode(404);
            }
        } else {
            WebUtil::exitWithHttpCode(400);
        }
    }
}
