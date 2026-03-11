def get_team_membership(team_id: int, user_id: int, db: Session):
    return db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == user_id
    ).first()


def require_team_role(team_id: int, user_id: int, allowed_roles: list, db: Session):
    membership = get_team_membership(team_id, user_id, db)

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="You are not a member of this team"
        )

    if membership.role not in allowed_roles:
        raise HTTPException(
            status_code=403,
            detail="You don't have permission for this action"
        )

    return membership