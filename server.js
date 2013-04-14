// ================================================================
// TODO: filters are not applied until mouse moves in the UI
// ================================================================

var io = require('socket.io');
var sys = require('sys');
var express = require('express');
var server = require('http').createServer(express());
var rx = require('./RxJS/rx.js');
var l2o = require('./RxJS/l2o.js');
var Enumerable = l2o.Enumerable;
var Observable = rx.Observable;
var Observer = rx.Observer;
var testData = require('./testData.js');

io = io.listen(server);
io.set('log level', 1); // turn off "debug - websocket writing" message
server.listen(8000);

var traditionalSocketConnectionCallback =
    function (socket) {

        // ================================================================
        // Observables section
        //   These are proxies for the client.
        // ================================================================

        var boundingBoxObservable = Observable.create(
            // subscribe = 
            function (observer) {
                sys.log('BOUNDING-BOX OBSERVER SUBSCRIBING');
                var handler = function (payload) { observer.onNext(payload); };
                socket.on('bounding box', handler);
                // dispose = 
                return function () { socket.off('bounding box', handler); };
            });

        var linqInjectionObservable = Observable.create(
            // subscribe = 
            function (observer) {
                sys.log('LINQ-INJECTION OBSERVER SUBSCRIBING');
                var handler = function (payload) { observer.onNext(payload); };
                socket.on('linq injection', handler);
                // dispose = 
                return function () { socket.off('linq injection', handler); };
            });

        // ================================================================
        // Observers section
        //   These observe the client.
        // ================================================================

        var boundingBoxDisposable = boundingBoxObservable.subscribe(
            // onNext =
            function (payload) {
                console.log('BOUNDING-BOX PAYLOAD');
                sys.log([
                    [payload.lowerLeftLon, payload.lowerLeftLat],
                    [payload.upperRightLon, payload.upperRightLat]]);
            });

        var clientEntityObserver = Observer.create(
            // onNext = 
            function (entities) { socket.emit('entities', entities); });

        // in a real application, this would be an observable wrapper
        // on a database feed:
        var testObservable = Observable.fromArray(testData);

        var linqInjectionDisposable = linqInjectionObservable.subscribe(
            // onNext =
            function (payload) {
                sys.log('LINQ INJECTION RECEIVED');

                // var filteredEntities = eval(
                //     'Enumerable.fromArray(testData)' +
                //         payload.QueryTerms +
                //         '.toArray()');
                // sys.log('SENDING ENTITIES TO CLIENT');

                var filteredEntities = eval(
                    'testObservable' + payload.QueryTerms);

                var accumulator = [];
                filteredEntities.subscribe(
                    // onNext = 
                    function (datum) {
                        accumulator.push(datum);
                    },
                    // onError = 
                    function (err) {
                        sys.log('TEST-DATA OBSERVABLE ON-ERROR');
                        console.log(err);
                    },
                    // onCompleted = 
                    function () {
                        sys.log('TEST-DATA OBSERVABLE ON-COMPLETED');
                        sys.log('SENDING ENTITIES TO CLIENT');
                        clientEntityObserver.onNext(accumulator);
                    });

            },
            // onError =
            function (exception) { sys.log('LINQ INJECTION ERROR'); },
            // onCompleted =
            function () { sys.log('LINQ INJECTION COMPLETED'); }
        );
    };

// This 'connection' event is defined by the socket.io library.  The
// corresponding event on the client is 'connect' (that is, look for
// io.connect in index.html).

// The whole rest of this server is in the 'onConnection' callback

var connectionObservable = Observable.create(
    // subscribe = 
    function (observer) {
        sys.log('CONNECTION OBSERVER SUBSCRIBING: ');
        var handler = function (socket) { observer.onNext(socket); };
        io.sockets.on( 'connection', handler);
        // dispose = 
        return function () { io.sockets.off (handler); }
    });

var connectionDisposable = connectionObservable.subscribe(
    // onNext = 
    function (payload) {
        sys.log('CONNECTION OBSERVER ONNEXT: ');
        traditionalSocketConnectionCallback(payload);
    }
);
