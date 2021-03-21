<?php declare(strict_types=1);

require_once 'util/database.php';
require_once 'util/web-util.php';
require_once 'mapper/json-mapper.php';

class OfferSearchService {

    function readAllPageable(Request $req) {
        WebUtil::requireAuthentication();

        $qParams = $req->getQueryParams();
        if (!empty($qParams)
              && $this->isSetAndNotEmpty($qParams, 'pNo')
              && $this->isSetAndNotEmpty($qParams, 'pSize')) {

            $pNo = $this->getIfSetAndNotEmpty($qParams, 'pNo');
            if ($pNo <= 0) {
                WebUtil::exitWithHttpCode(400);
            }
            $pSize = $this->getIfSetAndNotEmpty($qParams, 'pSize');
            if ($pSize <= 0 && $pSize > 100) {
                WebUtil::exitWithHttpCode(400);
            }
            $cSort = $this->getIfSetAndNotEmpty($qParams, 'cSort');
            $cSortOrder = $this->getIfSetAndNotEmpty($qParams, 'cSortOrder');
            $fGenre = $this->getIfSetAndNotEmpty($qParams, 'fGenre');
            $fRating = $this->getIfSetAndNotEmpty($qParams, 'fRating');
            $fFav = $this->getIfSetAndNotEmpty($qParams, 'fFav');
            $fBookName = $this->getIfSetAndNotEmpty($qParams, 'fBookName');
            $fAuthor = $this->getIfSetAndNotEmpty($qParams, 'fAuthor');

            $database = new Database();
            $dbConn = $database->connect();

            // constructing SQL
            $whereCond = ""; // TODO extract to function
            if ($fGenre || $fRating || $fFav || $fBookName || $fAuthor) {
                $whereCond = "WHERE ";
                $hasCond = false;
                if ($fGenre) {
                    $hasCond = true;
                    $whereCond .= "genre = '$fGenre'"; // TODO escape
                }
                if ($fRating && $fRating > 0 && $fRating <= 5) {
                    if ($hasCond) {
                        $whereCond .= " AND ";
                    }
                    $hasCond = true;
                    $whereCond .= "rating >= $fRating"; // TODO escape
                }
                if ($fFav) {
                    if ($hasCond) {
                        $whereCond .= " AND ";
                    }
                    $hasCond = true;
                    // access join
                    $whereCond .= "genre = $fFav"; // TODO escape
                }
                if ($fBookName) {
                    if ($hasCond) {
                        $whereCond .= " AND ";
                    }
                    $hasCond = true;
                    $whereCond .= "book_name = '$fBookName'"; // TODO escape
                }
                if ($fAuthor) {
                    if ($hasCond) {
                        $whereCond .= " AND ";
                    }
                    $whereCond .= "author = '$fAuthor'"; // TODO escape
                }
            }

            $stmtCount = $dbConn->prepare("SELECT COUNT(*) as offerCount FROM offer " . $whereCond);
            $stmtCount->execute();

            $offerCount = (int) $stmtCount->fetch()['offerCount'];
            $offers = array();
            if ($offerCount > 0) {
                // TODO left join offer_favourite

                $sort = ""; // TODO extract to function
                if ($cSort) {
                    // TODO use cSortOrder
                    switch ($cSort) {
                        case 'name';
                        case 'author';
                        case 'genre';
                        case 'rating';
                            break;
                        default:
                            // do ntohing
                            break;
                    }
                }

                $offset = ($pNo - 1) * $pSize;
                $stmt = $dbConn->prepare("SELECT * FROM offer " . $whereCond . $sort . " LIMIT $offset, $pSize");
                $stmt->execute();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    array_push($offers, JsonMapper::createOfferDto($row));
                }
            }

            echo json_encode(array(
                "content" => $offers,
                "count" => $offerCount
            ));

            WebUtil::fillResponseHeaders();
        } else {
            WebUtil::exitWithHttpCode(400);
        }
    }

    private function isSetAndNotEmpty($arr, $varName) {
        return !empty($arr) && isset($arr[$varName]) && !empty($arr[$varName]);
    }

    private function getIfSetAndNotEmpty($arr, $varName) {
        if ($this->isSetAndNotEmpty($arr, $varName)) {
            return $arr[$varName];
        }
        return null;
    }
}
