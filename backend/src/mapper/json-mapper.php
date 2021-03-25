<?php declare(strict_types=1);

class JsonMapper {

    /** use with SELECT * FROM offer ... */
    function createOfferDto($result): Array {
        return array(
            "id" => (int) $result['id'],
            "genre" => $result['genre'],
            "createdDate" => $result['created_date'],
            "author" => $result['author'],
            "bookName" => $result['book_name'],
            "rating" => (int) $result['rating'],
            "review" => $result['review'],
        );
    }

    function createOfferDtoOverview($result): Array {
        return array(
            "id" => (int) $result['id'],
            "genre" => $result['genre'],
            "createdDate" => $result['created_date'],
            "author" => $result['author'],
            "bookName" => $result['book_name'],
            "rating" => (int) $result['rating'],
            "review" => $result['review'],
            "favourite" => (bool) $result['favourite'],
        );
    }
}
