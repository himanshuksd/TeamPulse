from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from database import cursor, db
from schemas import UserCreate, ProjectCreate, TaskCreate

# =============================
# 🔐 JWT CONFIG
# =============================

SECRET_KEY = "your-super-secret-key-change-this"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

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
# 🔐 AUTH HELPERS
# =============================


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def authenticate_user(email: str, password: str):
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        return None

    hashed_password = user.get("password")

    if not hashed_password:
        return None

    try:
        if not pwd_context.verify(password, hashed_password):
            return None
    except Exception:
        return None

    return user


def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=401,
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
    try:
        cursor.execute("SELECT id FROM users WHERE email = %s", (user.email,))
        existing = cursor.fetchone()

        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")

        print("PASSWORD LENGTH:", len(user.password))
        print("PASSWORD VALUE:", repr(user.password))
        hashed_password = pwd_context.hash(user.password[:72])


        cursor.execute(
            "INSERT INTO users (name,email,password) VALUES (%s,%s,%s)",
            (user.name, user.email, hashed_password),
        )
        db.commit()

        return {"message": "User registered"}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    access_token = create_access_token(data={"sub": str(user["id"])})

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    }


# =============================
# 📁 PROJECT ROUTES (PROTECTED)
# =============================


@app.post("/projects")
def create_project(
    project: ProjectCreate,
    current_user: dict = Depends(get_current_user),
):
    try:
        cursor.execute(
            "INSERT INTO projects (name) VALUES (%s)",
            (project.name,),
        )
        db.commit()
        return {"message": "Project created"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.get("/projects")
def get_projects(current_user: dict = Depends(get_current_user)):
    cursor.execute("SELECT * FROM projects ORDER BY id DESC")
    return cursor.fetchall()


# =============================
# ✅ TASK ROUTES (PROTECTED)
# =============================


@app.get("/projects/{project_id}/tasks")
def get_tasks(
    project_id: int,
    current_user: dict = Depends(get_current_user),
):
    cursor.execute(
        "SELECT * FROM tasks WHERE project_id = %s ORDER BY id DESC",
        (project_id,),
    )
    return cursor.fetchall()


@app.post("/tasks")
def create_task(
    task: TaskCreate,
    current_user: dict = Depends(get_current_user),
):
    try:
        cursor.execute(
            "INSERT INTO tasks (title, status, project_id) VALUES (%s,'TODO',%s)",
            (task.title, task.project_id),
        )
        db.commit()
        return {"message": "Task created"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.put("/tasks/{task_id}")
def update_task_status(
    task_id: int,
    current_user: dict = Depends(get_current_user),
):
    try:
        cursor.execute(
            "UPDATE tasks SET status = 'DONE' WHERE id = %s",
            (task_id,),
        )
        db.commit()
        return {"message": "Task marked as DONE"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e


@app.delete("/tasks/{task_id}")
def delete_task(
    task_id: int,
    current_user: dict = Depends(get_current_user),
):
    try:
        cursor.execute("DELETE FROM tasks WHERE id = %s", (task_id,))
        db.commit()
        return {"message": "Task deleted"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) from e
