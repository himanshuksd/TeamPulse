from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class ProjectCreate(BaseModel):
    name: str
    owner_id: int

class TaskCreate(BaseModel):
    title: str
    project_id: int

