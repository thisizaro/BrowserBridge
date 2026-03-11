import asyncio
import websockets
import json
import uuid

async def test():

    uri = "ws://localhost:8000/ws/controller"

    async with websockets.connect(uri) as ws:

        command = {
            "type": "command",
            "id": str(uuid.uuid4()),
            "action": "open_url",
            "params": {
                "url": "https://thisizaro.github.io"
            }
        }

        await ws.send(json.dumps(command))
        print("Command sent")

        result = await ws.recv()
        print("Result:", result)

asyncio.run(test())