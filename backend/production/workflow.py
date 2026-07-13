from .models import ProductionRequest


def update_job_card_status(job_card):

    total = job_card.batches.count()

    completed = job_card.batches.filter(
        status="PRODUCTION_COMPLETE"
    ).count()

    running = job_card.batches.filter(
        status="IN_PROGRESS"
    ).count()

    planned = job_card.batches.filter(
        status__in=[
            "PLANNED",
            "READY",
        ]
    ).count()

    if total == 0:

        status = "READY"

    elif completed == total:

        status = "PRODUCTION_COMPLETE"

    elif running > 0:

        status = "IN_PROGRESS"

    elif completed > 0:

        # Some batches finished, others not started.
        # Production has already begun.
        status = "IN_PROGRESS"

    else:

        # All batches still waiting.
        status = "READY"

    if job_card.status != status:

        job_card.status = status

        job_card.save(
            update_fields=["status"]
        )
    
def update_production_request_status(request):

    total = request.job_cards.count()

    completed = request.job_cards.filter(
        status="PRODUCTION_COMPLETE"
    ).count()

    if total == 0:

        status = "PENDING"

    elif completed == total:

        status = "COMPLETED"

    else:

        status = "IN_PROGRESS"

    if request.status != status:

        request.status = status

        request.save(
            update_fields=["status"]
        )

def update_production_workflow(batch):

    job_card = batch.production

    request = job_card.production_request

    update_job_card_status(job_card)

    update_production_request_status(request)