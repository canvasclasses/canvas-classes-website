#!/usr/bin/env python3
"""Drive the running Blender instance from the terminal via its MCP add-on socket.

The Blender "MCP" add-on (Blender Lab, v1.0.0, requires Blender >= 5.1) runs a
local TCP server on localhost:9876 that listens for null-byte-delimited JSON
requests of the shape:

    {"type": "execute", "code": "<python>", "strict_json": <bool>}\\0

It executes `code` inside Blender (with `bpy` in scope) and replies with a
null-byte-terminated JSON envelope: {"status": "ok"|"error", "result": ...,
"stdout": ..., "stderr": ..., "message": ...}. Set a `result` variable in your
code to return structured data.

This lets the coding agent build the 3D-anatomy models (import Z-Anatomy, name /
group layers, decimate, colour, export .glb) WITHOUT the Claude Desktop MCP
connector — we talk to the same socket the connector uses.

Per CLAUDE.md §3, send code from a .py file (never inline shell) so quoting and
backslashes survive intact.

Usage:
    python3 scripts/blender/blender_client.py path/to/code.py
    python3 scripts/blender/blender_client.py -          # read code from stdin
"""
import json
import socket
import sys

HOST = "127.0.0.1"
PORT = 9876


def run(code: str, timeout: float = 1800.0) -> dict:
    with socket.create_connection((HOST, PORT), timeout=timeout) as s:
        s.settimeout(timeout)
        payload = json.dumps({"type": "execute", "code": code, "strict_json": False})
        s.sendall((payload + "\0").encode("utf-8"))
        buf = bytearray()
        while b"\0" not in buf:
            chunk = s.recv(65536)
            if not chunk:
                break
            buf.extend(chunk)
    data = bytes(buf).split(b"\0", 1)[0]
    return json.loads(data.decode("utf-8"))


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: blender_client.py <code.py | ->", file=sys.stderr)
        return 2
    src = sys.argv[1]
    code = sys.stdin.read() if src == "-" else open(src, encoding="utf-8").read()
    try:
        resp = run(code)
    except (ConnectionRefusedError, OSError) as e:
        print(
            f"ERROR: cannot reach Blender on {HOST}:{PORT} — is the MCP server running "
            f"(Preferences > Add-ons > MCP > Start MCP Server)? ({e})",
            file=sys.stderr,
        )
        return 1
    if resp.get("stdout"):
        print(resp["stdout"], end="")
    if resp.get("stderr"):
        print(resp["stderr"], end="", file=sys.stderr)
    if resp.get("status") == "error":
        print("BLENDER ERROR: " + str(resp.get("message", "")), file=sys.stderr)
        return 1
    if resp.get("result") is not None:
        print(json.dumps(resp["result"], indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
