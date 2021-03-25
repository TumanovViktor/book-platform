<?php declare(strict_types=1);

require_once '../vendor/autoload.php';
require_once 'util/web-util.php';

// Services
require_once 'service/auth-service.php';
require_once 'service/user-service.php';
require_once 'service/admin-service.php';
require_once 'service/offer-service.php';
require_once 'service/offer-search-service.php';
require_once 'service/offer-chat-service.php';

$dispatcher = FastRoute\simpleDispatcher(function(FastRoute\RouteCollector $r) {
    // auth
    $r->addRoute('POST', '/user/login', 'AuthService/login');

    // user
    $r->addRoute('POST', '/user/register', 'UserService/register');
    $r->addRoute('POST', '/user/change-pwd', 'UserService/changePwd');

    // admin
    $r->addRoute('GET', '/admin/users', 'AdminService/readAllUsers');
    $r->addRoute('PUT', '/admin/users/activate', 'AdminService/activateUser');
    $r->addRoute('PUT', '/admin/users/deactivate', 'AdminService/deactivateUser');

    // offer
    $r->addRoute('GET', '/offer', 'OfferSearchService/readAllPageable');
    $r->addRoute('GET', '/offer/{id:\d+}', 'OfferService/readById');
    $r->addRoute('POST', '/offer', 'OfferService/create');
    $r->addRoute('PUT', '/offer/{id:\d+}', 'OfferService/update');

    // offer chat
    $r->addRoute('GET', '/offer/chat/{id:\d+}', 'OfferChatService/readAllByOfferId');
    $r->addRoute('POST', '/offer/chat/{id:\d+}', 'OfferChatService/createForOfferId');
});

$uri = $_SERVER['PATH_INFO'];

// Strip query string (?foo=bar) and decode URI
if (false !== $pos = strpos($uri, '?')) {
    $uri = substr($uri, 0, $pos);
}
$uri = rawurldecode($uri);

$httpMethod = $_SERVER['REQUEST_METHOD'];
$routeInfo = $dispatcher->dispatch($httpMethod, $uri);

switch ($routeInfo[0]) {
    case FastRoute\Dispatcher::NOT_FOUND:
        WebUtil::exitWithHttpCode(404);
        break;
    case FastRoute\Dispatcher::METHOD_NOT_ALLOWED:
        $allowedMethods = $routeInfo[1];
        WebUtil::exitWithHttpCode(405);
        break;
    case FastRoute\Dispatcher::FOUND:
        $handler = $routeInfo[1];
        $vars = $routeInfo[2];
        parse_str($_SERVER['QUERY_STRING'], $params);

        $req = new Request();
        $req->setVarsAndParams($vars, $params);
        if ($httpMethod == 'POST') {
            $req->setBody(json_decode(file_get_contents("php://input")));
        }

        list($class, $method) = explode("/", $handler, 2);
        //call_user_func_array(array(new $class, $method), $vars);
        call_user_func(array(new $class, $method), $req);
        break;
}
