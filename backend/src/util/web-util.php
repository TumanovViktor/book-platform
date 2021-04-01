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

    function isAuthenticated(): bool {
        return self::getUserAuth() != null;
    }

    function requireAuthentication() {
        if (!self::isAuthenticated()) {
            self::exitWithHttpCode(403); // forbidden
        }
    }

    function exitWithHttpCode($httpCode, $data = null) {
        http_response_code($httpCode);
        if ($data || is_array($data)) {
            self::fillResponseHeaders();
            echo json_encode($data);
        }
        exit();
    }

    function respondSuccessWith($data) {
        self::exitWithHttpCode(200, $data); // exits code
    }

    function fillResponseHeaders() {
        header('Content-Type: application/json');
    }
}

class Utils {
    static function isSetAndNotEmpty($obj, $varName) {
        $arr = (array) $obj;
        return !empty($arr) && isset($arr[$varName]) && !empty($arr[$varName]);
    }

    static function getIfSetAndNotEmpty($arr, $varName) {
        if (self::isSetAndNotEmpty($arr, $varName)) {
            return $arr[$varName];
        }
        return null;
    }
}

class SqlUtils {
    static function getPreparedInsertSql($tableName, $data) {
        $keys = array_keys($data);
        $fields = implode(",", $keys);
        $placeholders = str_repeat("?,", count($keys) - 1) . '?';
        return "INSERT INTO $tableName ($fields) VALUES ($placeholders)";
    }

    static function getPreparedUpdateSql($tableName, $data, $id) {
        $keys = array_keys($data);
        $keys = array_map(function($key) {
            return "$key=:$key";
        }, $keys);
        $fields = implode(", ", $keys);
        $placeholders = str_repeat("?,", count($keys) - 1) . '?';
        return "UPDATE $tableName SET $fields WHERE id=$id";
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
