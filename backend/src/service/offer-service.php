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

            $stmt = $dbConn->prepare("SELECT o.*, u.username FROM offer o join user u on o.user_id = u.id WHERE o.id =:id");
            $stmt->bindParam(':id', $id);
            $stmt->execute();

            if ($result = $stmt->fetch()) {
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
            $last_id = $dbConn->lastInsertId();
            WebUtil::exitWithHttpCode(200, (int) $last_id);
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

    /** only for offer owner */
    function endOffer(Request $req) {
        WebUtil::requireAuthentication();

        $offerId = $req->getPathVars()['offerId'];
        if ($offerId) {
            $database = new Database();
            $dbConn = $database->connect();

            $stmt1 = $dbConn->prepare("SELECT * FROM offer WHERE id =:id");
            $stmt1->bindParam(':id', $offerId);
            $stmt1->execute();

            if ($result = $stmt1->fetch()) {
                $userId = WebUtil::getUserAuth()->userId;
                if ($userId != $result['user_id']) {
                    WebUtil::exitWithHttpCode(403); // not offer owner
                }
                if ($result['ended_date']) {
                    WebUtil::exitWithHttpCode(422, "offer already ended");
                }
                $stmt2 = $dbConn->prepare("UPDATE offer SET ended_date = NOW() WHERE offer_id =:id");
                $stmt2->bindParam(':id', $offerId);
                $stmt2->execute();

                $offerChats = array();
                while ($row = $stmt2->fetch(PDO::FETCH_ASSOC)) {
                    array_push($offerChats, JsonMapper::createOfferChatOwnerOverviewDto($row));
                }

                WebUtil::exitWithHttpCode(200);
            }
            WebUtil::exitWithHttpCode(404);
        }
        WebUtil::exitWithHttpCode(400);
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
            !empty($body->bookName);
    }

    private function getOfferValidator($body) {
        $validator = v::attribute('author', v::stringType())
            ->attribute('bookName', v::stringType())
        ;

        if (Utils::isSetAndNotEmpty($body, 'review')) {
            $validator->attribute('review', v::stringType());
        }
        if (Utils::isSetAndNotEmpty($body, 'create_date')) {
            $validator->attribute('create_date', v::positive()->number());
        }

        return $validator;
    }

    private function getOfferData($body) {
        $data = [
            'genre' => $body->genre->val,
            'author' => $body->author,
            'book_name' => $body->bookName,
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
