# Server-Side Events sample

Demonstrates:

1. Server-side events (from server to client)
1. Sent to multiple clients simultaneously
1. Correctly closing the connection by sending a special marker from server to client, waiting for the client to send the 'close' event in response to this marker, closing the client connection with `res.end()` on the server, and removing the client from the list of clients. Each client has to be identified with a unique id to remove it from the list.
1. If a client joins the party when some data has already been rendered, catch that client up by sending all the data that's been generated so far. Useful for refreshing a page while it's appending a log.

In order to handle the connection being lost and regained, it may be necessary to have the client pass in the last id it saw.
When the connection is restored, the server can re-send ids starting there. But I was unable to reproduce this. When I tried disabling WiFi for ten minutes, the connection just held on until I reconnected it.

But why does `eventSource.close()` cause `req.on('close')` to be called only when using Chrome or Firefox but not Safari?
