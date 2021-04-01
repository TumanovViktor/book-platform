<?php declare(strict_types=1);

require_once '../vendor/autoload.php';

use \Firebase\JWT\JWT;

class JwtIssuer {

    private static $jwtSecret = '5up3rN1nj4H1dd3nS3cr37!';

    function issueToken($user): string {
        $payload = [
            'userId' => $user['id'],
            'username' => $user['username'],
            'email' => $user['email'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + 28800, // 8 hours
            'iss' => 'book-platform'
        ];

        return JWT::encode($payload, self::$jwtSecret);
    }

    function parseToken(string $token) {
        try {
            return JWT::decode($token, self::$jwtSecret, array('HS256'));
        } catch (Exception $e) {
            return null; // malformed / expired JWT
        }
    }
}
