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
            "userId" => (int)$result['user_id'],
            "userName" => $result['username']
        );
    }

    function createOfferDtoOverview($result): Array {
        $dto = array(
            "id" => (int) $result['id'],
            "genre" => $result['genre'],
            "createdDate" => $result['created_date'],
            "author" => $result['author'],
            "bookName" => $result['book_name'],
            "rating" => (int) $result['rating'],
            "review" => $result['review']
        );
        if (array_key_exists('favourite', $result)) {
            $dto["favourite"] = (bool) $result['favourite'];
        }
         return $dto;
    }

    function createOfferChatOwnerOverviewDto($result): Array {
        return array(
            "bidderId" => (int) $result['bidder_id'],
            "bidderFirstName" => $result['first_name'],
            "bidderLastName" => $result['last_name'],
        );
    }

    /** use with SELECT * FROM offer_chat ... */
    function createOfferChatDto($result): Array {
        return array(
            "id" => (int) $result['id'],
            "byUserId" => (int) $result['from_user_id'],
            "message" => $result['message'],
            "createdDate" => $result['created_date'],
        );
    }

    /** use with SELECT * FROM user ... */
    function createUserDto($result): Array {
        return array(
            "id" => (int) $result['id'],
            "username" => $result['username'],
            "firstName" => $result['first_name'],
            "lastName" => $result['last_name'],
            "email" => $result['email'],
            "role" => $result['role'],
            "createdDate" => $result['created_date'],
            "active" => (bool) $result['active'],
            "image" => $result['image']
        );
    }
}
