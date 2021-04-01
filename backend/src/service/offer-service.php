<?php declare(strict_types=1);

require_once 'util/database.php';
require_once 'util/web-util.php';
require_once 'mapper/json-mapper.php';

use Respect\Validation\Validator as v;

class OfferService {

    function readById(Request $req) {
        $id = $req->getPathVars()['id'];
        if ($id) {
            $database = new Database();
            $dbConn = $database->connect();

            $stmt = $dbConn->prepare("SELECT * FROM offer WHERE id =:id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            if ($result = $stmt->fetch()) { // convert to function?
                $offer = JsonMapper::createOfferDto($result);

                WebUtil::respondSuccessWith($offer);
            }
            WebUtil::exitWithHttpCode(404);
        }
        WebUtil::exitWithHttpCode(400);
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
        $sql = SqlUtils::getPreparedInsertSql('offer', $data);
        $stmt = $dbConn->prepare($sql);

        if ($stmt->execute(array_values($data))) {
            WebUtil::exitWithHttpCode(200);
        }
        WebUtil::exitWithHttpCode(500);
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
        $sql = SqlUtils::getPreparedUpdateSql('offer', $data, $offerId);
        $stmt = $dbConn->prepare($sql);

        if ($stmt->execute($data)) {
            WebUtil::exitWithHttpCode(200);
        }
        WebUtil::exitWithHttpCode(500);
    }

    function markAsFavourite(Request $req) {
        WebUtil::requireAuthentication();

        $offerId = $req->getPathVars()['id'];
        $reqFav = Utils::getIfSetAndNotEmpty($req->getQueryParams(), 'fav');
        $fav = $reqFav == null || $reqFav === 'true';

        $database = new Database();
        $dbConn = $database->connect();

        $userId = WebUtil::getUserAuth()->userId;
        if ($fav) {
            $stmt = $dbConn->prepare("INSERT INTO favourite_offer (user_id, offer_id) VALUES (:userId, :offerId)");
        } else {
            $stmt = $dbConn->prepare("DELETE FROM favourite_offer WHERE user_id =:userId AND offer_id =:offerId");
        }

        $stmt->bindValue(':userId', $userId);
        $stmt->bindValue(':offerId', $offerId);
        $stmt->execute(); // does not matter if this fails
    }

    private function validOfferRequest($body) {
        return !empty($body) &&
            !empty($body->genre) &&
            !empty($body->author) &&
            !empty($body->book_name);
    }

    private function getOfferValidator($body) {
        $validator = v::attribute('genre', v::stringType())
            ->attribute('author', v::stringType())
            ->attribute('book_name', v::stringType());
        
        if (Utils::isSetAndNotEmpty($body, 'rating')) {
            $validator->attribute('rating', v::positive()->number()); // TODO: add range?
        }
        if (Utils::isSetAndNotEmpty($body, 'review')) {
            $validator->attribute('review', v::stringType());
        }
        if (Utils::isSetAndNotEmpty($body, 'create_date')) {
            $validator->attribute('create_date', v::positive()->number()); // TODO: enough for timestamp?
        }

        return $validator;
    }

    private function getOfferData($body) {
        $data = [
            'genre' => $body->genre,
            'author' => $body->author,
            'book_name' => $body->book_name,
            'user_id' => WebUtil::getUserAuth()->userId
        ];
        if (Utils::isSetAndNotEmpty($body, 'rating')) {
            $data['rating'] = $body->rating;
        }
        if (Utils::isSetAndNotEmpty($body, 'review')) {
            $data['review'] = $body->review;
        }
        if (Utils::isSetAndNotEmpty($body, 'create_date')) {
            $data['create_date'] = $body->create_date;
        }

        return $data;
    }
}
