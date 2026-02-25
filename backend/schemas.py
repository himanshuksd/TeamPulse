from pydoc import text
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class ProjectCreate(BaseModel):
    name: str
   

class TaskCreate(BaseModel):
    title: str
    project_id: int


class TaskUpdate(BaseModel):
    status: str