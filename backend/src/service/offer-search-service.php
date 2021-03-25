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
                WebUtil::exitWithHttpCode(400); // bad request
            }
            $pSize = $this->getIfSetAndNotEmpty($qParams, 'pSize');
            if ($pSize <= 0 && $pSize > 100) {
                WebUtil::exitWithHttpCode(400); // bad request
            }
            $cSort = $this->getIfSetAndNotEmpty($qParams, 'cSort');
            $cSortAsc = $this->getIfSetAndNotEmpty($qParams, 'cSortAsc');
            $fGenre = $this->getIfSetAndNotEmpty($qParams, 'fGenre');
            $fRating = $this->getIfSetAndNotEmpty($qParams, 'fRating');
            $fFav = $this->getIfSetAndNotEmpty($qParams, 'fFav');
            $fBookName = $this->getIfSetAndNotEmpty($qParams, 'fBookName');
            $fAuthor = $this->getIfSetAndNotEmpty($qParams, 'fAuthor');

            $database = new Database();
            $dbConn = $database->connect();

            // constructing SQL query
            $whereCond = $this->handleFilters($dbConn, $fGenre, $fRating, $fFav, $fBookName, $fAuthor); // collect binds from this q
            $userId = WebUtil::getUserAuth()->userId;
            $join = " LEFT JOIN favourite_offer fo ON fo.offer_id = o.id AND (fo.user_id IS NULL OR fo.user_id = $userId)"; // alias is important

            $stmtCount = $dbConn->prepare("SELECT COUNT(*) as offerCount FROM offer o " . $join . $whereCond);
            $stmtCount->execute();

            $offerCount = (int) $stmtCount->fetch()['offerCount'] ?? 0;
            $offers = array();
            if ($offerCount > 0) {
                $sort = $this->handleSort($cSort, $cSortAsc);
                $offset = ($pNo - 1) * $pSize;
                $stmt = $dbConn->prepare("SELECT o.*, fo.user_id IS NOT NULL AS favourite FROM offer o " . $join . $whereCond . $sort . " LIMIT $offset, $pSize");
                $stmt->execute();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    array_push($offers, JsonMapper::createOfferDtoOverview($row));
                }
            }

            echo json_encode(array(
                "content" => $offers,
                "count" => $offerCount
            ));

            WebUtil::fillResponseHeaders();
        } else {
            WebUtil::exitWithHttpCode(400); // bad request
        }
    }

    private function handleFilters($dbConn, $fGenre, $fRating, $fFav, $fBookName, $fAuthor): String {
        $whereCond = "";
        if ($fGenre || $fRating || $fFav || $fBookName || $fAuthor) {
            $whereCond = " WHERE ";
            $hasCond = false;
            if ($fGenre) {
                $hasCond = true;
                $whereCond .= "o.genre = " . $dbConn->quote($fGenre);
            }
            if ($fRating && $fRating > 0 && $fRating <= 5) {
                if ($hasCond) {
                    $whereCond .= " AND ";
                }
                $hasCond = true;
                $whereCond .= "o.rating >= $fRating"; // TODO escape
            }
            if ($fFav) {
                if ($hasCond) {
                    $whereCond .= " AND ";
                }
                $hasCond = true;
                if ($fFav === "true") {
                    $whereCond .= "fo.user_id IS NOT NULL"; // access alias
                } else {
                    $whereCond .= "fo.user_id IS NULL"; // access alias
                }
            }
            if ($fBookName) {
                if ($hasCond) {
                    $whereCond .= " AND ";
                }
                $hasCond = true;
                $whereCond .= "o.book_name = " . $dbConn->quote($fBookName);
            }
            if ($fAuthor) {
                if ($hasCond) {
                    $whereCond .= " AND ";
                }
                $whereCond .= "o.author = " . $dbConn->quote($fAuthor);
            }
        }
        return $whereCond;
    }

    private function handleSort($cSort, $cSortAsc): String {
        $sort = "";
        if ($cSort) {
            $sort = " ORDER BY o."; // use alias!
            switch ($cSort) {
                case 'book_name';
                case 'author';
                case 'genre';
                case 'rating';
                    $asc = $cSortAsc ? $cSortAsc === "true" : true;
                    $sort .= $cSort . ($asc ? " ASC" : " DESC");
                    break;
                default:
                    $sort = ""; // unknown sort - reset sort
                    break;
            }
        }
        return $sort;
    }

    private function isSetAndNotEmpty($arr, $varName): bool {
        return !empty($arr) && isset($arr[$varName]) && !empty($arr[$varName]);
    }

    private function getIfSetAndNotEmpty($arr, $varName) {
        if ($this->isSetAndNotEmpty($arr, $varName)) {
            return $arr[$varName];
        }
        return null;
    }
}
