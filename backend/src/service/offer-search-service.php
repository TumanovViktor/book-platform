<?php declare(strict_types=1);

require_once 'util/database.php';
require_once 'util/web-util.php';
require_once 'mapper/json-mapper.php';

class OfferSearchService {

    const ALLOWED_RATING = array("1", "2", "3", "4", "5");

    /** Accessible when not logged in */
    function readAllPageable(Request $req) {
        $qParams = $req->getQueryParams();
        if (!empty($qParams)
              && Utils::isSetAndNotEmpty($qParams, 'pNo')
              && Utils::isSetAndNotEmpty($qParams, 'pSize')) {

            $pNo = Utils::getIfSetAndNotEmpty($qParams, 'pNo');
            if ($pNo <= 0) {
                WebUtil::exitWithHttpCode(400); // bad request
            }
            $pSize = Utils::getIfSetAndNotEmpty($qParams, 'pSize');
            if ($pSize <= 0 && $pSize > 100) {
                WebUtil::exitWithHttpCode(400); // bad request
            }
            $cSort = Utils::getIfSetAndNotEmpty($qParams, 'cSort');
            $cSortAsc = Utils::getIfSetAndNotEmpty($qParams, 'cSortAsc');
            $fGenre = Utils::getIfSetAndNotEmpty($qParams, 'fGenre');
            $fRating = Utils::getIfSetAndNotEmpty($qParams, 'fRating');
            $fFav = Utils::getIfSetAndNotEmpty($qParams, 'fFav');
            $fBookName = Utils::getIfSetAndNotEmpty($qParams, 'fBookName');
            $fAuthor = Utils::getIfSetAndNotEmpty($qParams, 'fAuthor');

            $database = new Database();
            $dbConn = $database->connect();

            // constructing SQL query
            $whereCond = $this->handleFilters($dbConn, $fGenre, $fRating, $fFav, $fBookName, $fAuthor); // collect binds from this q
            $join = ""; // no join if not authenticated
            if (WebUtil::isAuthenticated()) {
                $userId = WebUtil::getUserAuth()->userId;
                $join = " LEFT JOIN favourite_offer fo ON fo.offer_id = o.id AND (fo.user_id IS NULL OR fo.user_id = $userId)"; // alias is important
            }

            $stmtCount = $dbConn->prepare("SELECT COUNT(*) as offerCount FROM offer o " . $join . $whereCond);
            $stmtCount->execute();

            $offerCount = (int) $stmtCount->fetch()['offerCount'] ?? 0;
            $offers = array();
            if ($offerCount > 0) {
                $sort = $this->handleSort($cSort, $cSortAsc);
                $offset = ($pNo - 1) * $pSize;
                $query =  "SELECT o.* ";
                if (WebUtil::isAuthenticated()) {
                    $query = $query . " , fo.user_id IS NOT NULL AS favourite ";
                }
                $query = $query . "FROM offer o " . $join . $whereCond . $sort . " LIMIT $offset, $pSize";
                $stmt = $dbConn->prepare($query);
//                WebUtil::respondSuccessWith("$query");

                $stmt->execute();

                while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                    array_push($offers, JsonMapper::createOfferDtoOverview($row));
                }
            }

            WebUtil::respondSuccessWith(array(
                "content" => $offers,
                "count" => $offerCount
            ));
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
                $genreArr = explode(',', str_replace(' ', '', $fGenre));
                $whereCond .= "o.genre IN (";
                $lastIndex = count($genreArr) - 1;
                for ($i = 0; $i < count($genreArr); $i++) {
                    $whereCond .= $dbConn->quote($genreArr[$i]);
                    if ($i !== $lastIndex) {
                        $whereCond .= ",";
                    }
                }
                $whereCond .= ")";
            }
            if ($fRating && in_array($fRating, ALLOWED_RATING)) {
                if ($hasCond) {
                    $whereCond .= " AND ";
                }
                $hasCond = true;
                $ratingInt = (int) $fRating;
                $whereCond .= "o.rating >= $ratingInt";
            }
            if (WebUtil::isAuthenticated() && $fFav) {
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
}
