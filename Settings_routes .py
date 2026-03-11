# ─────────────────────────────────────────────────────────────
# ADD THESE ROUTES TO YOUR main.py
# Place them near your other user/auth routes
# ─────────────────────────────────────────────────────────────

from pydantic import BaseModel
from typing import Optional

class ProfileUpdate(BaseModel):
    name:     Optional[str] = None
    email:    Optional[str] = None
    role:     Optional[str] = None
    bio:      Optional[str] = None
    phone:    Optional[str] = None
    location: Optional[str] = None

class SettingsUpdate(BaseModel):
    profile:    Optional[ProfileUpdate] = None
    notifs:     Optional[dict]          = None
    appearance: Optional[dict]          = None


@app.get("/user/settings")
def get_user_settings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id":       user.id,
        "name":     user.name,
        "email":    user.email,
        "role":     getattr(user, "role",     None) or "",
        "bio":      getattr(user, "bio",      None) or "",
        "phone":    getattr(user, "phone",    None) or "",
        "location": getattr(user, "location", None) or "",
        "points":   getattr(user, "points",   0),
        "level":    getattr(user, "level",    1),
        "streak":   getattr(user, "streak",   0),
    }


@app.put("/user/settings")
def update_user_settings(
    data: SettingsUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if data.profile:
        if data.profile.name:  user.name  = data.profile.name
        if data.profile.email: user.email = data.profile.email
        for field in ["role", "bio", "phone", "location"]:
            val = getattr(data.profile, field, None)
            if val is not None and hasattr(user, field):
                setattr(user, field, val)

    db.commit()
    db.refresh(user)
    return {"message": "Settings updated", "name": user.name, "email": user.email}


@app.put("/user/password")
def change_password(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    from passlib.context import CryptContext
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    user = db.query(User).filter(User.id == current_user.id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if not pwd_context.verify(payload.get("currentPassword", ""), user.password):
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    user.password = pwd_context.hash(payload.get("newPassword", ""))
    db.commit()
    return {"message": "Password changed successfully"}