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

            $stmt = $dbConn->prepare("SELECT id, username, email, role, password, active FROM user WHERE email = ?");
            $stmt->execute(array($req->getBody()->email));

            if ($user = $stmt->fetch()) {
                if (!password_verify($req->getBody()->pwd, $user['password'])) {
                    WebUtil::exitWithHttpCode(403);
                }
                if (!$user['active']) {
                    WebUtil::exitWithHttpCode(403, "Account disabled");
                }
                WebUtil::respondSuccessWith(JwtIssuer::issueToken($user)); // respond with token
            }
            WebUtil::exitWithHttpCode(404);
        }
        WebUtil::exitWithHttpCode(400);
    }
}
