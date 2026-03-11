from fastapi import FastAPI, WebSocket, WebSocketDisconnect

app = FastAPI()

browser_socket = None
controllers = set()


@app.websocket("/ws/browser")
async def browser_ws(ws: WebSocket):
    global browser_socket

    await ws.accept()
    browser_socket = ws
    print("Browser connected")

    try:
        while True:
            data = await ws.receive_text()

            # Forward browser results to controllers
            for controller in controllers:
                await controller.send_text(data)

    except WebSocketDisconnect:
        print("Browser disconnected")
        browser_socket = None


@app.websocket("/ws/controller")
async def controller_ws(ws: WebSocket):
    await ws.accept()
    controllers.add(ws)
    print("Controller connected")

    try:
        while True:
            data = await ws.receive_text()

            # Forward commands to browser
            if browser_socket:
                await browser_socket.send_text(data)

    except WebSocketDisconnect:
        controllers.remove(ws)
        print("Controller disconnected")