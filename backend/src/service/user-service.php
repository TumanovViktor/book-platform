<?php declare(strict_types=1);

require_once 'util/database.php';
require_once 'util/web-util.php';

use Respect\Validation\Validator as v;

class UserService {

    function register(Request $req) {
        $body = $req->getBody();
        $registerValidator = $this->getRegisterValidator($body);
        if (!$this->validRegisterRequest($body) || !$registerValidator->validate($body)) {
            WebUtil::exitWithHttpCode(400);
        }

        $database = new Database();
        $dbConn = $database->connect();

        $data = $this->getRegisterData($body);
        if ($this->hasUserWithData($dbConn, $data)) {
            WebUtil::exitWithHttpCode(400);
        }

        $sql = SqlUtils::getPreparedInsertSql('user', $data);
        $stmt = $dbConn->prepare($sql);
        if ($stmt->execute(array_values($data))) {
            WebUtil::exitWithHttpCode(200);
        }
        WebUtil::exitWithHttpCode(500);
    }

    function changePwd(Request $req) {
        WebUtil::requireAuthentication();

        $body = $req->getBody();
        $changePwdValidator = $this->getChangePwdValidator($body);
        if (!$this->validChangePwdRequest($body) || !$changePwdValidator->validate($body)) {
            WebUtil::exitWithHttpCode(400);
        }
        if ($body->password != $body->passwordConfirm) {
            WebUtil::exitWithHttpCode(400, "Passwords do not match");
        }

        $database = new Database();
        $dbConn = $database->connect();
        $stmt = $dbConn->prepare("UPDATE user u SET u.password =:pwd WHERE u.id =:userId");
        $stmt->bindValue(':pwd', password_hash($body->password, PASSWORD_DEFAULT));
        $stmt->bindParam(':userId', WebUtil::getUserAuth()->userId);

        if ($stmt->execute()) {
            WebUtil::exitWithHttpCode(200);
        }
        WebUtil::exitWithHttpCode(500);
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
            !empty($body->password) &&
            !empty($body->passwordConfirm);
    }

    private function getRegisterValidator($body) {
        return v::attribute('username', v::stringType())
            ->attribute('first_name', v::stringType())
            ->attribute('last_name', v::stringType())
            ->attribute('email', v::email())
            ->attribute('password', v::stringType());
    }

    private function getChangePwdValidator($body) {
        return v::attribute('password', v::stringType())
            ->attribute('passwordConfirm', v::stringType());
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
}
