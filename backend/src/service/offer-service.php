<?php declare(strict_types=1);

require_once 'util/database.php';
require_once 'util/web-util.php';
require_once 'mapper/json-mapper.php';

use Respect\Validation\Validator as v;

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
        WebUtil::requireAuthentication();

        $body = $req->getBody();
        $offerValidator = $this->getOfferValidator($body);
        if (!$this->validOfferRequest($body) || !$offerValidator->validate($body)) {
            WebUtil::exitWithHttpCode(400);
        }

        $database = new Database();
        $dbConn = $database->connect();

        $data = $this->getOfferData($body);
        $sql = $this->getPreparedInsertSql('offer', $data);
        $stmt = $dbConn->prepare($sql);
        if ($stmt->execute(array_values($data))) {
            WebUtil::exitWithHttpCode(200);
        } else {
            WebUtil::exitWithHttpCode(500);
        }
    }

    function update(Request $req) {
        WebUtil::requireAuthentication();

        $body = $req->getBody();
        $offerId = $req->getPathVars()['id'];
        $offerValidator = $this->getOfferValidator($body);
        if (!$this->validOfferRequest($body) || !$offerValidator->validate($body)) {
            WebUtil::exitWithHttpCode(400);
        }

        $database = new Database();
        $dbConn = $database->connect();

        $data = $this->getOfferData($body);
        $sql = $this->getPreparedUpdateSql('offer', $data);
        $stmt = $dbConn->prepare($sql);

        $data += ['id' => (int) $offerId];
        if ($stmt->execute($data)) {
            WebUtil::exitWithHttpCode(200);
        } else {
            WebUtil::exitWithHttpCode(500);
        }
    }

    private function getPreparedInsertSql($tableName, $data) {
        $keys = array_keys($data);
        $fields = implode(",", $keys);
        $placeholders = str_repeat("?,", count($keys) - 1) . '?';
        return "INSERT INTO $tableName ($fields) VALUES ($placeholders)";
    }

    private function getPreparedUpdateSql($tableName, $data) {
        $keys = array_keys($data);
        $keys = array_map(function($key) {
            return "$key=:$key";
        }, $keys);
        $fields = implode(", ", $keys);
        $placeholders = str_repeat("?,", count($keys) - 1) . '?';
        return "UPDATE $tableName SET $fields WHERE id=:id";
    }

    private function validOfferRequest($body) {
        return !empty($body) &&
            !empty($body->user_id) &&
            !empty($body->genre) &&
            !empty($body->author) &&
            !empty($body->book_name);
    }

    private function getOfferValidator($body) {
        $validator = v::attribute('user_id', v::positive()->number())
            ->attribute('genre', v::stringType())
            ->attribute('author', v::stringType())
            ->attribute('book_name', v::stringType());
        
        if ($this->isSetAndNotEmpty($body, 'rating')) {
            $validator->attribute('rating', v::positive()->number()); // TODO: add range?
        }
        if ($this->isSetAndNotEmpty($body, 'review')) {
            $validator->attribute('review', v::stringType());
        }
        if ($this->isSetAndNotEmpty($body, 'create_date')) {
            $validator->attribute('create_date', v::positive()->number()); // TODO: enough for timestamp?
        }

        return $validator;
    }

    private function getOfferData($body) {
        $data = [
            'user_id' => $body->user_id,
            'genre' => $body->genre,
            'author' => $body->author,
            'book_name' => $body->book_name,
        ];
        if ($this->isSetAndNotEmpty($body, 'rating')) {
            $data['rating'] = $body->rating;
        }
        if ($this->isSetAndNotEmpty($body, 'review')) {
            $data['review'] = $body->review;
        }
        if ($this->isSetAndNotEmpty($body, 'create_date')) {
            $data['create_date'] = $body->create_date;
        }

        return $data;
    }

    private function isSetAndNotEmpty($obj, $varName) {
        $arr = (array) $obj;
        return !empty($arr) && isset($arr[$varName]) && !empty($arr[$varName]);
    }

    function markAsFavourite(Request $req) {
        // TODO finish
    }
}
