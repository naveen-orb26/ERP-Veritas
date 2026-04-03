from activity_log.models import ActivityLog


def log_activity(
    *,
    user,
    action,
    module,
    reference_id,
    description="",
    ip_address=None
):

    ActivityLog.objects.create(

        user=user,

        action=action,

        module=module,

        reference_id=str(reference_id),

        description=description,

        ip_address=ip_address,
    )