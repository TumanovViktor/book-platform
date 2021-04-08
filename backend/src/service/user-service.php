<?php declare(strict_types=1);

require_once 'util/database.php';
require_once 'util/web-util.php';

use Respect\Validation\Validator as v;

class UserService {

    function register(Request $req) {
        $body = $req->getBody();
        $registerValidator = $this->getRegisterValidator();
        if (!$this->validRegisterRequest($body) || !$registerValidator->validate($body)) {
            WebUtil::exitWithHttpCode(400, "Údaje nejsou správně vyplněny");
        }

        $database = new Database();
        $dbConn = $database->connect();

        $data = $this->getRegisterData($body);
        if ($this->hasUserWithData($dbConn, $data)) {
            WebUtil::exitWithHttpCode(400, "Uživatel s tímto e-mailem nebo uživatelským jménem již existuje");
        }

        $sql = SqlUtils::getPreparedInsertSql('user', $data);
        $stmt = $dbConn->prepare($sql);
        if ($stmt->execute(array_values($data))) {
            WebUtil::exitWithHttpCode(200);
        }
        WebUtil::exitWithHttpCode(500);
    }

    function updateUser(Request $req) {
        WebUtil::requireAuthentication();

        $body = $req->getBody();
        $database = new Database();
        $dbConn = $database->connect();

        if (empty($body->userId) || $body->userId != WebUtil::getUserAuth()->userId) {
            WebUtil::exitWithHttpCode(400);
        }

        $changePwdValidator = $this->getPwdValidator();
        if ($this->validChangePwdRequest($body) && $changePwdValidator->validate($body)) {
            $stmt = $dbConn->prepare("UPDATE user u SET u.password =:pwd WHERE u.id =:userId");
            $stmt->bindValue(':pwd', password_hash($body->password, PASSWORD_DEFAULT));
            $stmt->bindParam(':userId', WebUtil::getUserAuth()->userId);
            if (!$stmt->execute()) {
                WebUtil::exitWithHttpCode(500, "Chyba uložení hesla");
            }
        }
        $updateUserValidator = $this->getUpdateUserValidator();
        if (!$this->validUpdateUserRequest($body) || !$updateUserValidator->validate($body)) {
            WebUtil::exitWithHttpCode(500, "Chyba uložení dat");
        }
        $stmt = $dbConn->prepare("UPDATE user u SET  u.username =:username, u.first_name =:first_name, u.last_name =:last_name, u.email =:email, u.image =:image WHERE u.id =:userId");
        $stmt->bindValue(':username', $body->username);
        $stmt->bindValue(':first_name', $body->first_name);
        $stmt->bindValue(':last_name', $body->last_name);
        $stmt->bindValue(':email', $body->email);
        $stmt->bindValue(':image', $body->image);
        $stmt->bindParam(':userId', WebUtil::getUserAuth()->userId);
        if ($stmt->execute()) {
            $stmt = $dbConn->prepare("SELECT * FROM user WHERE id = ?");
            $stmt->execute(array(WebUtil::getUserAuth()->userId));

            if ($result = $stmt->fetch()) {
                $updatedUser = JsonMapper::createUserDto($result);
                $updatedUser['token'] = JwtIssuer::issueToken($result);
                WebUtil::exitWithHttpCode(200, $updatedUser);
            }
        }
        WebUtil::exitWithHttpCode(500, "Chyba uložení dat");
    }

    function optionsRequest(Request $req) {
        WebUtil::exitWithHttpCode(200);
    }

    private function hasUserWithData($dbConn, $data) {
        $stmt = $dbConn->prepare("SELECT id FROM user WHERE email = ? OR username = ?");
        $stmt->execute(array($data['email'], $data['username']));
        return boolval($stmt->fetch());
    }

    private function validRegisterRequest($body): bool {
        return !empty($body) &&
            !empty($body->username) &&
            !empty($body->first_name) &&
            !empty($body->last_name) &&
            !empty($body->email) &&
            !empty($body->password);
    }

    private function validChangePwdRequest($body): bool {
        return !empty($body) &&
            !empty($body->password);
    }

    private function getRegisterValidator() {
        return v::attribute('username', v::stringType())
            ->attribute('first_name', v::stringType())
            ->attribute('last_name', v::stringType())
            ->attribute('email', v::email())
            ->attribute('password', v::stringType());
    }

    private function getPwdValidator() {
        return v::attribute('password', v::stringType());
    }

    private function getRegisterData($body) {
        return [
            'username' => $body->username,
            'first_name' => $body->first_name,
            'last_name' => $body->last_name,
            'password' => password_hash($body->password, PASSWORD_DEFAULT),
            'email' => $body->email,
            'active' => true
        ];
    }

    private function getUpdateUserValidator()
    {
        return v::attribute('username', v::stringType())
            ->attribute('first_name', v::stringType())
            ->attribute('last_name', v::stringType())
            ->attribute('email', v::email())
            ->attribute('image', v::stringType());
    }

    private function validUpdateUserRequest($body)
    {
        return !empty($body) &&
            !empty($body->username) &&
            !empty($body->first_name) &&
            !empty($body->last_name) &&
            !empty($body->email) &&
            !empty($body->image);
    }
}
