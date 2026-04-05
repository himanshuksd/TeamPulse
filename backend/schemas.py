# from pydantic import BaseModel, EmailStr
# from datetime import datetime
# from typing import Optional

# # ==========================================
# # USER SCHEMAS
# # ==========================================

# class UserCreate(BaseModel):
#     name: str
#     email: str
#     password: str


# # ==========================================
# # PROJECT SCHEMAS
# # ==========================================

# class ProjectCreate(BaseModel):
#     name: str
#     team_id: int


# # ==========================================
# # TASK SCHEMAS
# # ==========================================

# class TaskCreate(BaseModel):
#     title: str
#     project_id: int
#     assigned_user_id: int
#     complexity_score: int
#     deadline: datetime


# # ==========================================
# # TEAM SCHEMAS
# # ==========================================

# class TeamCreate(BaseModel):
#     name: str


# class AddMemberRequest(BaseModel):
#     user_id: int
from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

# ==========================================
# USER SCHEMAS
# ==========================================

class UserCreate(BaseModel):
    name: str
    email: EmailStr   # ✅ small improvement (no break)
    password: str


# ==========================================
# PROJECT SCHEMAS
# ==========================================

class ProjectCreate(BaseModel):
    name: str
    team_id: int


# ==========================================
# TASK SCHEMAS
# ==========================================

class TaskCreate(BaseModel):
    title: str
    project_id: int
    assigned_user_id: int
    complexity_score: int
    deadline: Optional[datetime] = None   # ✅ FIX (no more 422)


# ==========================================
# TEAM SCHEMAS
# ==========================================

class TeamCreate(BaseModel):
    name: str


class AddMemberRequest(BaseModel):
    user_id: int
