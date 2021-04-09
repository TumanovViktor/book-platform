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
    $r->addRoute('POST', '/user/update-user', 'UserService/updateUser');

    // admin
    $r->addRoute('GET', '/admin/users', 'AdminService/readAllUsers');
    $r->addRoute('PUT', '/admin/users/{userId:\d+}/activate-state', 'AdminService/changeUserActiveState');

    // offer
    $r->addRoute('GET', '/offer', 'OfferSearchService/readAllPageable');
    $r->addRoute('GET', '/offer/{id:\d+}', 'OfferService/readById');
    $r->addRoute('POST', '/offer', 'OfferService/create');
    $r->addRoute('PUT', '/offer/{id:\d+}', 'OfferService/update');
    $r->addRoute('PUT', '/offer/{id:\d+}/end', 'OfferService/endOffer');
    $r->addRoute('PUT', '/offer/{id:\d+}/favourite', 'OfferService/markAsFavourite');

    // offer chat
    $r->addRoute('GET', '/offer/chat/owner/{offerId:\d+}', 'OfferChatService/readAllOwnerChatsByOfferId');
    $r->addRoute('GET', '/offer/chat/{offerId:\d+}', 'OfferChatService/readAllByOfferId');
    $r->addRoute('POST', '/offer/chat/{offerId:\d+}', 'OfferChatService/createForOfferId');

    $r->addRoute('OPTIONS', '/user/register', 'UserService/optionsRequest');
    $r->addRoute('OPTIONS', '/user/login', 'UserService/optionsRequest');
    $r->addRoute('OPTIONS', '/user/update-user', 'UserService/optionsRequest');
    $r->addRoute('OPTIONS', '/offer', 'UserService/optionsRequest');
    $r->addRoute('OPTIONS', '/offer/{id:\d+}', 'UserService/optionsRequest');
    $r->addRoute('OPTIONS', '/offer/chat', 'UserService/optionsRequest');
    $r->addRoute('OPTIONS', '/offer/chat/{offerId:\d+}', 'UserService/optionsRequest');
    $r->addRoute('OPTIONS', '/offer/chat/owner/{offerId:\d+}', 'UserService/optionsRequest');
    $r->addRoute('OPTIONS', '/offer/{id:\d+}/end', 'UserService/optionsRequest');
    $r->addRoute('OPTIONS', '/offer/{id:\d+}/favourite', 'UserService/optionsRequest');
    $r->addRoute('OPTIONS', '/admin/users', 'UserService/optionsRequest');
    $r->addRoute('OPTIONS', '/admin/users/{userId:\d+}/activate-state', 'UserService/optionsRequest');
});

$uri = $_SERVER['PATH_INFO'];

// Strip query string (?foo=bar) and decode URI
if (false !== $pos = strpos($uri, '?')) {
    $uri = substr($uri, 0, $pos);
}
$uri = rawurldecode($uri);

$httpMethod = $_SERVER['REQUEST_METHOD'];
$routeInfo = $dispatcher->dispatch($httpMethod, $uri);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, Authorization');

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
        if ($httpMethod == 'POST' || $httpMethod == 'PUT') {
            $req->setBody(json_decode(file_get_contents("php://input")));
        }

        list($class, $method) = explode("/", $handler, 2);
        //call_user_func_array(array(new $class, $method), $vars);
        call_user_func(array(new $class, $method), $req);
        break;
}
