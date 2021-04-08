<?php declare(strict_types=1);

require_once 'util/database.php';
require_once 'util/web-util.php';
require_once 'mapper/json-mapper.php';

class OfferChatService {

    /** Only for owner of the offer */
    function readAllOwnerChatsByOfferId(Request $req) {
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
                $stmt2 = $dbConn->prepare("SELECT DISTINCT oc.bidder_id, u.first_name, u.last_name FROM offer_chat oc
                    JOIN user u ON oc.bidder_id = u.id
                    WHERE oc.offer_id =:id");
                $stmt2->bindParam(':id', $offerId);
                $stmt2->execute();

                $offerChats = array();
                while ($row = $stmt2->fetch(PDO::FETCH_ASSOC)) {
                    array_push($offerChats, JsonMapper::createOfferChatOwnerOverviewDto($row));
                }

                WebUtil::respondSuccessWith($offerChats);
            }
            WebUtil::exitWithHttpCode(404);
        }
        WebUtil::exitWithHttpCode(400);
    }

    function readAllByOfferId(Request $req) {
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
                if ($userId === $result['user_id']) {
                    // owner needs to specify chat with query param of the bidderId
                    $bidderId = empty($req->getQueryParams()) ? null : Utils::getIfSetAndNotEmpty($req->getQueryParams(), 'bidderId');
                    if ($bidderId == null) {
                        WebUtil::exitWithHttpCode(400);
                    }
                } else {
                    $bidderId = $userId;
                }

                $stmt2 = $dbConn->prepare("SELECT oc.* FROM offer_chat oc
                    WHERE oc.offer_id =:id AND oc.bidder_id =:bidderId ORDER BY oc.id ASC"); // order by id is better
                $stmt2->bindParam(':id', $offerId);
                $stmt2->bindParam(':bidderId', $bidderId);
                $stmt2->execute();

                $offerChats = array();
                while ($row = $stmt2->fetch(PDO::FETCH_ASSOC)) {
                    array_push($offerChats, JsonMapper::createOfferChatDto($row));
                }

                WebUtil::respondSuccessWith($offerChats);
            }
            WebUtil::exitWithHttpCode(404);
        }
        WebUtil::exitWithHttpCode(400);
    }

    function createForOfferId(Request $req) {
        WebUtil::requireAuthentication();

        $offerId = $req->getPathVars()['offerId'];
        $msg = $req->getBody()->message;
        if ($offerId && $msg && !empty($msg)) {
            $database = new Database();
            $dbConn = $database->connect();

            $stmt1 = $dbConn->prepare("SELECT * FROM offer WHERE id =:id");
            $stmt1->bindParam(':id', $offerId);
            $stmt1->execute();

            if ($result = $stmt1->fetch()) {
                $userId = WebUtil::getUserAuth()->userId;
                if ($userId === $result['user_id']) {
                    // owner needs to specify chat with query param of the bidderId
                    $bidderId = empty($req->getQueryParams()) ? null : Utils::getIfSetAndNotEmpty($req->getQueryParams(), 'bidderId');
                    if ($bidderId == null) {
                        WebUtil::exitWithHttpCode(400);
                    }
                } else {
                    $bidderId = $userId;
                }

                $stmt2 = $dbConn->prepare("INSERT INTO offer_chat (offer_id, bidder_id, from_user_id, message) VALUES (:offerId, :bidderId, :userId, :msg)");
                $stmt2->bindValue(':offerId', $offerId);
                $stmt2->bindValue(':bidderId', $bidderId);
                $stmt2->bindValue(':userId', $userId);
                $stmt2->bindValue(':msg', $msg);

                if ($stmt2->execute()) {
                    WebUtil::exitWithHttpCode(200);
                }
                WebUtil::exitWithHttpCode(500);
            }
            WebUtil::exitWithHttpCode(404);
        }
        WebUtil::exitWithHttpCode(400);
    }
}
