<?php declare(strict_types=1);

require_once 'util/database.php';
require_once 'util/web-util.php';

class AdminService {

    function readAllUsers(Request $req) {
        WebUtil::requireAdmin();

        $database = new Database();
        $dbConn = $database->connect();
        $stmt = $dbConn->prepare("SELECT * FROM user u WHERE u.role = 'USER'"); // only normal users
        $stmt->execute();

        $users = array();
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            array_push($users, JsonMapper::createUserDto($row));
        }

        WebUtil::respondSuccessWith($users);
    }

    function changeUserActiveState(Request $req) {
        WebUtil::requireAdmin();

        $reqActivate = Utils::getIfSetAndNotEmpty($req->getQueryParams(), 'activate');
        if ($reqActivate == null) {
            WebUtil::exitWithHttpCode(400);
        }
        $activate = $reqActivate === 'true' ? 1 : 0; // bit

        $userId = $req->getPathVars()['userId'];

        $database = new Database();
        $dbConn = $database->connect();

        $stmt = $dbConn->prepare("UPDATE user u SET u.active = :activate WHERE u.id =:userId AND u.role = 'USER'");
        $stmt->bindParam(':activate', $activate);
        $stmt->bindParam(':userId', $userId);
        if ($stmt->execute()) {
            WebUtil::exitWithHttpCode(200);
        }
        WebUtil::exitWithHttpCode(500);
    }
}
