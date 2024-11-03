import net from "net"

async function getPortFree() {
    return new Promise( res => {
        const srv = net.createServer();
        srv.listen(0,'127.0.0.1', () => {
            const port = srv.address()
            srv.close((err) => res(port))
        });
    })
}


export { getPortFree };