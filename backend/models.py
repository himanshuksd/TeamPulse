from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class User(Base):
    __tablename__ = "users"

    id                  = Column(Integer, primary_key=True, index=True)
    name                = Column(String(100))
    email               = Column(String(100), unique=True, index=True)
    password            = Column(String(200))
    total_completed     = Column(Integer, default=0)
    total_overdue       = Column(Integer, default=0)
    avg_completion_time = Column(Float, default=0.0)
    points              = Column(Integer, default=0)
    level               = Column(Integer, default=1)
    streak              = Column(Integer, default=0)

    # ✅ All relationships defined here — no dangling assignments at bottom
    created_teams    = relationship("Team",       back_populates="creator",          foreign_keys="Team.created_by")
    team_memberships = relationship("TeamMember", back_populates="user")
    projects         = relationship("Project",    back_populates="owner")
    tasks            = relationship("Task",       back_populates="assigned_user")
    messages         = relationship("Message",    back_populates="user")


class Team(Base):
    __tablename__ = "teams"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.utcnow)

    creator  = relationship("User",       back_populates="created_teams", foreign_keys=[created_by])
    members  = relationship("TeamMember", back_populates="team")
    projects = relationship("Project",    back_populates="team")
    messages = relationship("Message",    back_populates="team")


class TeamMember(Base):
    __tablename__ = "team_members"

    id        = Column(Integer, primary_key=True, index=True)
    team_id   = Column(Integer, ForeignKey("teams.id"))
    user_id   = Column(Integer, ForeignKey("users.id"))
    role      = Column(String(50), default="member")
    joined_at = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="members")
    user = relationship("User", back_populates="team_memberships")


class Project(Base):
    __tablename__ = "projects"

    id       = Column(Integer, primary_key=True, index=True)
    name     = Column(String(100))
    owner_id = Column(Integer, ForeignKey("users.id"))
    team_id  = Column(Integer, ForeignKey("teams.id"))

    owner = relationship("User",  back_populates="projects")
    tasks = relationship("Task",  back_populates="project")
    team  = relationship("Team",  back_populates="projects")


class Task(Base):
    __tablename__ = "tasks"

    id               = Column(Integer, primary_key=True, index=True)
    title            = Column(String(200))
    status           = Column(String(50), default="TODO")
    project_id       = Column(Integer, ForeignKey("projects.id"))
    assigned_user_id = Column(Integer, ForeignKey("users.id"))
    complexity_score = Column(Integer, default=1)
    created_at       = Column(DateTime, default=datetime.utcnow)
    deadline         = Column(DateTime)
    completed_at     = Column(DateTime, nullable=True)

    project       = relationship("Project", back_populates="tasks")
    assigned_user = relationship("User",    back_populates="tasks")


class Message(Base):
    __tablename__ = "messages"

    id        = Column(Integer, primary_key=True, index=True)
    team_id   = Column(Integer, ForeignKey("teams.id"))
    user_id   = Column(Integer, ForeignKey("users.id"))
    content   = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

    team = relationship("Team", back_populates="messages")
    user = relationship("User", back_populates="messages")