from datetime import datetime


def calculate_completion_rate(total_completed, total_tasks):
    if total_tasks == 0:
        return 0
    return total_completed / total_tasks


def calculate_overdue_rate(total_overdue, total_tasks):
    if total_tasks == 0:
        return 0
    return total_overdue / total_tasks


def calculate_workload_ratio(user_active_tasks, total_active_tasks):
    if total_active_tasks == 0:
        return 0
    return user_active_tasks / total_active_tasks


def calculate_risk_score(workload_ratio, overdue_rate, deadline_proximity, complexity_score):
    risk = (
        workload_ratio * 0.3 +
        overdue_rate * 0.3 +
        deadline_proximity * 0.2 +
        (complexity_score / 5) * 0.2
    )
    return round(risk * 100, 2)


def calculate_tpi(completion_rate, deadline_adherence, velocity_score):
    tpi = (
        completion_rate * 0.4 +
        deadline_adherence * 0.3 +
        velocity_score * 0.3
    )
    return round(tpi * 100, 2)
