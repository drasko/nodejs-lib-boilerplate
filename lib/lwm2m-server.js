/**
 * Copyright (c) Mainflux
 *
 * Coreflux is licensed under an MIT license.
 * All rights not explicitly granted in the MIT license are reserved.
 * See the included LICENSE file for more details.
 */

var coap    = require('coap');
var url     = require('url');

/**
 * Registration
 * ============
 *
 * 8.2.3 Registration Interface
 * The registration interface is used by a LWM2M Client to register with a LWM2M Server,
 * identified by the LWM2M Server URI. Registration is performed by sending a CoAP POST 
 * to the LWM2M Server URI, with registration parameters passed as query string parameters
 * as per Table 19 and Object and Object Instances included in the payload as specified in Section 5.2.1.
 * The response includes Location-Path Options, which indicate the path to use for updating or deleting
 * the registration. The erver MUST return a location under the /rd path segment.
 * Registration update is performed by sending a CoAP PUT to the Location path returned to the
 * LWM2M Client as a result of a successful registration.
 *
 * De-registration is performed by sending a CoAP DELETE to the Location path returned to the LWM2M Client
 * as a result of a successful registration.
 *
 *
 *  +------------+-------------+----------------------------------------+--------------+----------------+
 *  | Operation  | CoAP Method |                   URI                  |    Success   |     Failure    |
 *  +------------+-------------+----------------------------------------+--------------+----------------+
 *  | Register   | POST        | /rd?ep={Endpoint Client                | 2.01 Created | 4.00 Bad       |    
 *  |            |             | Name}&lt={Lifetime}&sms={MSISDN}       |              | Request, 4.09  |
 *  |            |             | &lwm2m={version}&b={binding}           |              | Conflict       |
 *  +------------+-------------+----------------------------------------+--------------+----------------+
 *  | Update     | PUT         | /{location}?lt={Lifetime}&sms={MSISDN} | 2.04 Changed | 4.00 Bad       |    
 *  |            |             | &b={binding}                           |              | Request, 4.04  |
 *  |            |             |                                        |              | Not Found      |
 *  +------------+-------------+----------------------------------------+--------------+----------------+
 *  | Deregister | DELETE      | /{location}                            | 2.02 Deleted | 4.04 Not Found |    
 *  +------------+-------------+----------------------------------------+--------------+----------------+
 *
 *                           Table 19: Operation to Method and URI Mapping
 *
 *
 *
 */
lwm2mRegister = function() {
}

/**
 * LWM2M Data Handler
 */

lwm2mDataHandler = function(req, res) {

    /**
     * request(url)
     * Execute a CoAP request. url can be a string or an object.
     * If it is a string, it is parsed using require('url').parse(url). If it is an object:
     * host: A domain name or IP address of the server to issue the request to. Defaults to 'localhost'.
     * hostname: To support url.parse() hostname is preferred over host
     * port: Port of remote server. Defaults to 5683.
     * method: A string specifying the CoAP request method. Defaults to 'GET'.
     * confirmable: send a CoAP confirmable message (CON), defaults to true.
     * observe: send a CoAP observe message, allowing the streaming of updates from the server.
     * pathname: Request path. Defaults to '/'. Should not include query string
     * query: Query string. Defaults to ''. Should not include the path, e.g. 'a=b&c=d'
     * options: object that includes the CoAP options, for each key-value pair the setOption() will be called.
     * headers: alias for options, but it works only if options is missing.
     * agent: Controls Agent behavior. Possible values:
     *      undefined (default): use globalAgent, a single socket for all concurrent requests.
     *      Agent object: explicitly use the passed in Agent.
     *      false: opts out of socket reuse with an Agent, each request uses a new UDP socket.
     * proxyUri: adds the Proxy-Uri option to the request, so if the request is sent
     *      to a proxy (or a server with proxy features) the request will be forwarded to the selected URI.
     *      The expected value is the URI of the target.
     *      E.g.: 'coap://192.168.5.13:6793'
     *
     * coap.request() returns an instance of OutgoingMessage.
     * If you need to add a payload, just pipe into it. Otherwise, you must call end to submit the request.
     *
     * If hostname is a IPv6 address then the payload is sent through a IPv6 UDP socket,
     * dubbed in node.js as 'udp6'.
     */
    req.urlObj = require('url').parse(req.url);
    console.log(req.urlObj);
    res.end('Hello ' + req.url.split('/')[1] + '\n');
}

/**
 * LWM2M Server class
 */
function Lwm2mServer() {
    if (!(this instanceof Lwm2mServer)) {
        return new Lwm2mServer();
    }

    console.log('Creating LWM2M Server');
    this.server = coap.createServer()
}

/**
 * LWM2M Server Methods
 */
Lwm2mServer.prototype.start = function() {
    this.server.on('request', lwm2mDataHandler);

    this.server.listen(function() {
        console.log('LWM2M server listening');
    });

    var req = coap.request('coap://localhost/Mainflux')

    req.on('response', function(res) {
        res.pipe(process.stdout);
        res.on('end', function() {
            process.exit(0)
        });
    });

    req.end();
}

/**
 * Exports
 */
module.exports = Lwm2mServer;


