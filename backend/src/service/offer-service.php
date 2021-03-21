<?php declare(strict_types=1);

require_once 'util/database.php';
require_once 'util/web-util.php';
require_once 'mapper/json-mapper.php';

class OfferService {

    function readById(Request $req) {
        WebUtil::requireAuthentication();

        $id = $req->getPathVars()['id'];
        if ($id) {
            $database = new Database();
            $dbConn = $database->connect();

            $stmt = $dbConn->prepare("SELECT * FROM offer WHERE id =:id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            if ($result = $stmt->fetch()) { // convert to function?
                $offer = JsonMapper::createOfferDto($result);

                echo json_encode($offer);

                WebUtil::fillResponseHeaders();
            } else {
                WebUtil::exitWithHttpCode(404);
            }
        } else {
            WebUtil::exitWithHttpCode(400);
        }
    }

    function create(Request $req) {
        // TODO finish
    }

    function update(Request $req) {
        // TODO finish
    }

    function markAsFavourite(Request $req) {
        // TODO finish
    }
}
