from fastapi import FastAPI
from database import cursor, db
from schemas import UserCreate, ProjectCreate, TaskCreate

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.post("/projects")
def create_project(project: ProjectCreate):
    cursor.execute(
        "INSERT INTO projects (name, owner_id) VALUES (%s, %s)",
        (project.name, project.owner_id)
    )
    db.commit()
    return {"message": "Project created"}
@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
    db.commit()
    return {"message": "Task deleted"}

@app.get("/")
def root():
    return {"status": "TeamPulse backend running"}

@app.post("/register")
def register(user: UserCreate):

    cursor.execute(
        "INSERT INTO users (name,email,password) VALUES (%s,%s,%s)",
        (user.name, user.email, user.password)
    )
    db.commit()
    return {"message": "User registered"}

@app.post("/projects")
def create_project(project: ProjectCreate):
    cursor.execute(
        "INSERT INTO projects (name, owner_id) VALUES (%s,%s)",
        (project.name, project.owner_id)
    )
    db.commit()
    return {"message": "Project created"}

@app.get("/projects")
def get_projects():
    cursor.execute("SELECT * FROM projects")
    return cursor.fetchall()

@app.get("/projects/{project_id}/tasks")
def get_tasks(project_id: int):
    cursor.execute(
        "SELECT * FROM tasks WHERE project_id = %s",
        (project_id,)
    )
    return cursor.fetchall()

@app.post("/tasks")
def create_task(task: TaskCreate):
    cursor.execute(
        "INSERT INTO tasks (title, status, project_id) VALUES (%s,'TODO',%s)",
        (task.title, task.project_id)
    )
    db.commit()
    return {"message": "Task created"}

@app.put("/tasks/{task_id}")
def update_task_status(task_id: int):
    cursor.execute(
        "UPDATE tasks SET status = 'DONE' WHERE id = %s",
        (task_id,)
    )
    db.commit()
    return {"message": "Task marked as DONE"}
