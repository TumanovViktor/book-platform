<?php

    class Database {
        private $host = "localhost";
        private $db_name = "book-platform";
        private $username = "root";
        private $password = "";
        public $conn = null;

        public function connect() {
            $this->conn = null;

            try {
                $this->conn = new PDO("mysql:host=" . $this->host . ";dbname=" . $this->db_name, $this->username, $this->password);
                $this->conn->exec("set names utf8");
            } catch (PDOException $exception) {
                echo "Connection error: " . $exception->getMessage();
            }
            return $this->conn;
        }

        public function disconnect() {
            $this->$conn = null;
        }
    }

?>
