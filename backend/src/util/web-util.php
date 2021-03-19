<?php declare(strict_types=1);

require_once 'jwt-issuer.php';

class WebUtil {

    function getUserAuth() {
        if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
            $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
            if (!empty($authHeader) && preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
                $token = $matches[1]; // second group = token
                return JwtIssuer::parseToken($token);
            }
        }
        return null; // none or expired authorization
    }

    function isAuthenticated() {
        return self::getUserAuth();
    }

    function requireAuthentication() {
        if (!self::isAuthenticated()) {
            self::exitWithHttpCode(403); // forbidden
        }
    }

    function exitWithHttpCode($httpCode, $data = null) {
        http_response_code($httpCode); // usually 4xx
        if ($data) {
            echo json_encode($data);
        }
        exit();
    }

    function fillResponseHeaders() {
        header('Content-Type: application/json');
    }
}

class Request {
    private $pathVars = [];
    private $queryParams = [];
    private $body = [];

    function setVarsAndParams($pathVars, $queryParams) {
        $this->pathVars = $pathVars;
        $this->queryParams = $queryParams;
    }
    function setBody($body) {
        $this->body = $body;
    }

    public function getPathVars() {
        return $this->pathVars;
    }
    public function getQueryParams() {
        return $this->queryParams;
    }
    public function getBody() {
        return $this->body;
    }
}
