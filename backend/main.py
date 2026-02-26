from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext

from database import cursor, db
from schemas import TaskUpdate, UserCreate, ProjectCreate, TaskCreate

# =============================
# 🔐 SECURITY CONFIG
# =============================

SECRET_KEY = "your-super-secret-key-change-this"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# =============================
# 🚀 APP
# =============================

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =============================
# 🔐 HELPERS
# =============================


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def authenticate_user(email: str, password: str):
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        return None

    try:
        if not pwd_context.verify(password, user["password"]):
            return None
    except Exception:
        return None

    return user


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
    user = cursor.fetchone()

    if user is None:
        raise credentials_exception

    return user


# =============================
# 🏠 ROOT
# =============================


@app.get("/")
def root():
    return {"status": "TeamPulse backend running"}


# =============================
# 🔐 AUTH ROUTES
# =============================


@app.post("/register")
def register(user: UserCreate):
    cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
    existing = cursor.fetchone()

    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = pwd_context.hash(user.password)

    cursor.execute(
        "INSERT INTO users (name,email,password) VALUES (%s,%s,%s)",
        (user.name, user.email, hashed_password),
    )
    db.commit()

    return {"message": "User registered"}


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(
        data={
            "sub": str(user["id"]),
            "email": user["email"],
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


# =============================
# 📁 PROJECT ROUTES (MULTI-TENANT)
# =============================


@app.post("/projects")
def create_project(
    project: ProjectCreate,
    current_user: dict = Depends(get_current_user),
):
    cursor.execute(
        "INSERT INTO projects (name, user_id) VALUES (%s, %s)",
        (project.name, current_user["id"]),
    )
    db.commit()

    return {"message": "Project created"}


@app.get("/projects")
def get_projects(current_user: dict = Depends(get_current_user)):
    cursor.execute(
        "SELECT * FROM projects WHERE user_id = %s ORDER BY id DESC",
        (current_user["id"],),
    )
    return cursor.fetchall()


# =============================
# ✅ TASK ROUTES (MULTI-TENANT)
# =============================


@app.get("/projects/{project_id}/tasks")
def get_tasks(
    project_id: int,
    current_user: dict = Depends(get_current_user),
):
    # ✅ ownership check
    cursor.execute(
        "SELECT id FROM projects WHERE id=%s AND user_id=%s",
        (project_id, current_user["id"]),
    )
    project = cursor.fetchone()

    if not project:
        raise HTTPException(status_code=403, detail="Not authorized")

    cursor.execute(
        "SELECT * FROM tasks WHERE project_id=%s AND user_id=%s ORDER BY id DESC",
        (project_id, current_user["id"]),
    )
    return cursor.fetchall()


@app.post("/tasks")
def create_task(
    task: TaskCreate,
    current_user: dict = Depends(get_current_user),
):
    # ✅ verify project ownership
    cursor.execute(
        "SELECT id FROM projects WHERE id=%s AND user_id=%s",
        (task.project_id, current_user["id"]),
    )
    project = cursor.fetchone()

    if not project:
        raise HTTPException(status_code=403, detail="Not authorized")

    cursor.execute(
        "INSERT INTO tasks (title, status, project_id, user_id) VALUES (%s,'TODO',%s,%s)",
        (task.title, task.project_id, current_user["id"]),
    )
    db.commit()

    return {"message": "Task created"}


@app.put("/tasks/{task_id}")
def update_task_status(
    task_id: int,
    task: TaskUpdate,
    current_user: dict = Depends(get_current_user),
):
    cursor.execute(
        "UPDATE tasks SET status=%s WHERE id=%s AND user_id=%s",
        (task.status, task_id, current_user["id"]),
    )

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    db.commit()
    return {"message": "Task updated"}


@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    current_user: dict = Depends(get_current_user),
):
    cursor.execute(
        "DELETE FROM tasks WHERE id=%s AND user_id=%s",
        (task_id, current_user["id"]),
    )

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Task not found")

    db.commit()
    return {"message": "Task deleted"}
