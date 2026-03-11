# backend/websocket_manager.py
from typing import Dict, List
from fastapi import WebSocket
from datetime import datetime
import json

class ConnectionManager:
    def __init__(self):
        # Store active connections: {team_id: [websocket1, websocket2, ...]}
        self.active_connections: Dict[int, List[WebSocket]] = {}
        # Store user info: {websocket: {"user_id": 1, "username": "John"}}
        self.user_info: Dict[WebSocket, dict] = {}

    async def connect(self, websocket: WebSocket, team_id: int, user_id: int, username: str):
        await websocket.accept()
        
        # Add to team's connection list
        if team_id not in self.active_connections:
            self.active_connections[team_id] = []
        self.active_connections[team_id].append(websocket)
        
        # Store user info
        self.user_info[websocket] = {
            "user_id": user_id,
            "username": username,
            "team_id": team_id
        }
        
        # Notify others that user joined
        await self.broadcast_to_team(team_id, {
            "type": "user_joined",
            "user_id": user_id,
            "username": username,
            "timestamp": datetime.utcnow().isoformat()
        }, exclude=websocket)
        
        # Send online users list to the new user
        online_users = self.get_online_users(team_id)
        await websocket.send_json({
            "type": "online_users",
            "users": online_users
        })

    def disconnect(self, websocket: WebSocket):
        # Get user info before removing
        user_info = self.user_info.get(websocket)
        
        if user_info:
            team_id = user_info["team_id"]
            
            # Remove from connections
            if team_id in self.active_connections:
                self.active_connections[team_id].remove(websocket)
                if not self.active_connections[team_id]:
                    del self.active_connections[team_id]
            
            # Remove user info
            del self.user_info[websocket]
            
            # Notify others that user left
            if team_id in self.active_connections:
                import asyncio
                asyncio.create_task(self.broadcast_to_team(team_id, {
                    "type": "user_left",
                    "user_id": user_info["user_id"],
                    "username": user_info["username"],
                    "timestamp": datetime.utcnow().isoformat()
                }))

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)

    async def broadcast_to_team(self, team_id: int, message: dict, exclude: WebSocket = None):
        if team_id in self.active_connections:
            for connection in self.active_connections[team_id]:
                if connection != exclude:
                    try:
                        await connection.send_json(message)
                    except:
                        # Connection might be closed
                        pass

    async def send_typing_indicator(self, team_id: int, user_id: int, username: str, is_typing: bool):
        await self.broadcast_to_team(team_id, {
            "type": "typing",
            "user_id": user_id,
            "username": username,
            "is_typing": is_typing,
            "timestamp": datetime.utcnow().isoformat()
        })

    def get_online_users(self, team_id: int) -> List[dict]:
        online_users = []
        if team_id in self.active_connections:
            for ws in self.active_connections[team_id]:
                if ws in self.user_info:
                    user = self.user_info[ws]
                    online_users.append({
                        "user_id": user["user_id"],
                        "username": user["username"]
                    })
        return online_users

# Global manager instance
manager = ConnectionManager()